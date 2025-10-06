import fs from "fs";
import objectExists from "../../minio/objectExists";
import bucketExists from "../../minio/bucketExists";
import { isValidObjectName } from "../../validation";
import getMinioClient from "../../minio/getMinioClient";
import getBucketByName from "../../mongo/buckets/getBucketByName";
import updateBucketById from "../../mongo/buckets/updateBucketById";
import { response_BAD, response_DB_UPDATED } from "../../../globals";

type Props = {
  bucketName: string;
  objectName?: string;
  fromSource?: string;
  file: Express.Multer.File;
};

export default async (props: Props): Promise<ApiResponse> => {
  const { bucketName, objectName, file, fromSource = "unknown" } = props;
  const filePath = file.path;
  const client = getMinioClient();
  const fileSize = fs.statSync(filePath).size;
  const fileStream = fs.createReadStream(filePath);
  const fileName = objectName || file.originalname;
  const metaData = {
    "Content-Type": file.mimetype,
    "X-Amz-Meta-Uploaded-From": fromSource,
  };

  const validObjectName = isValidObjectName(fileName);
  if (validObjectName.error) return { ...response_BAD, message: `${validObjectName.message}` };

  try {
    const bucket_exists = await bucketExists(client, bucketName);
    if (bucket_exists.error) return bucket_exists;
    if (!bucket_exists.data) return { ...response_BAD, message: `Bucket does not exists: ${bucketName}.` };

    const object_exists = await objectExists({ client, bucketName, objectName: fileName });
    if (object_exists) return { ...response_BAD, message: `Object already exists: ${fileName}.` };

    const objectInfo = await client.putObject(bucketName, fileName, fileStream, fileSize, metaData);
    if (!objectInfo) return { ...response_BAD, message: "Filed to upload form object." };

    const mongoBucket = await getBucketByName(bucketName, { fields: ["objectCount", "consumption_bytes"] });
    if (mongoBucket.error) return mongoBucket;

    const update = { objectCount: mongoBucket.data.objectCount + 1, consumption_bytes: mongoBucket.data.consumption_bytes + fileSize };
    const updatedMongoBucket = await updateBucketById({ _id: mongoBucket.data._id, update, options: { fields: ["_id"] } });
    if (updatedMongoBucket.error) return updatedMongoBucket;

    return response_DB_UPDATED;
  } catch (err: any) {
    console.error("Failed to upload form object: ", err);
    return { ...response_BAD, message: `Failed to upload form object - ${err.message}.` };
  }
};
