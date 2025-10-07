import { isValidObjectId } from "mongoose";
import getBucketById from "./getBucketById";
import lisObjects from "../../minio/lisObjects";
import bucketExists from "../../minio/bucketExists";
import { BAD, NOT_FOUND, OK, SERVER_ERROR } from "../../../globals";

export default async (bucket_id: string, options: any = { prefix: "", recursive: false }): Promise<ApiResponse> => {
  const validation = isValidObjectId(bucket_id);
  if (!validation) return { ...BAD, message: "Invalid bucket_id" };

  try {
    const bucket = await getBucketById(bucket_id, { fields: ["name"] });
    if (bucket.error) return bucket;

    const name = bucket.data.name;
    const exists = await bucketExists(name);
    if (exists.error) return exists;
    if (exists.status !== OK.status) return NOT_FOUND;

    return await lisObjects(name, options);
  } catch (err: any) {
    //TODO: handle errors
    return { ...SERVER_ERROR, data: err };
  }
};
