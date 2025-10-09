import fs from "fs";
import logError from "../../logError";
import objectExists from "../../minio/objectExists";
import bucketExists from "../../minio/bucketExists";
import { isValidObjectName } from "../../validation";
import getMinioClient from "../../minio/getMinioClient";
import getBucketByName from "../../mongo/buckets/getBucketByName";
import updateBucketById from "../../mongo/buckets/updateBucketById";
import { BAD, CONFLICT, DB_UPDATED, NOT_FOUND, OK, SERVER_ERROR } from "../../../globals";

type Props = {
  bucket_name: string;
  object_name?: string;
  from_source?: string;
  file: Express.Multer.File;
};

export default async (props: Props): Promise<ApiResponse> => {
  const { bucket_name, object_name, file, from_source = "unknown" } = props;
  const file_name = object_name || file.originalname;
  const valid_object_name = isValidObjectName(file_name);
  if (valid_object_name.error) return { ...BAD, message: `${valid_object_name.message}` };

  const file_path = file.path;
  const file_size = fs.statSync(file_path).size;
  const file_stream = fs.createReadStream(file_path);
  const metaData = {
    "Content-Type": file.mimetype,
    "X-Amz-Meta-Uploaded-From": from_source,
  };

  try {
    const bucket_exists = await bucketExists(bucket_name);
    if (bucket_exists.error) return bucket_exists;
    if (bucket_exists.status !== OK.status) return NOT_FOUND;

    const object_exists = await objectExists(bucket_name, file_name);
    if (object_exists.error) return object_exists;
    if (object_exists.status === OK.status) return { ...CONFLICT, message: "Object name already exists" };

    const client = getMinioClient();
    const object_info = await client.putObject(bucket_name, file_name, file_stream, file_size, metaData);
    if (!object_info) return { ...BAD, message: "Filed to upload form object." };

    const mongo_bucket = await getBucketByName(bucket_name, { fields: ["object_count", "consumption_bytes"] });
    if (mongo_bucket.error) return mongo_bucket;

    const update = { object_count: mongo_bucket.data.object_count + 1, consumption_bytes: mongo_bucket.data.consumption_bytes + file_size };
    const updated_mongo_bucket = await updateBucketById({ _id: mongo_bucket.data._id, update });
    if (updated_mongo_bucket.error) return updated_mongo_bucket;

    return DB_UPDATED;
  } catch (err: any) {
    logError({ ...SERVER_ERROR, message: err.message });
    return { ...SERVER_ERROR, data: err };
  }
};
