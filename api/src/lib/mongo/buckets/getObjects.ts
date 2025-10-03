import getBucketById from "./getBucketById";
import lisObjects from "../../minio/lisObjects";
import bucketExists from "../../minio/bucketExists";
import getMinioClient from "../../minio/getMinioClient";
import { response_BAD, response_SERVER_ERROR } from "../../../globals";

export default async (bucketId: string, options: any = { prefix: "", recursive: false }): Promise<ApiResponse> => {
  try {
    const bucket = await getBucketById(bucketId, { fields: ["name"] });
    if (bucket.error) return bucket;

    const name = bucket.data.name;
    const client = getMinioClient();
    const exists = await bucketExists(client, name);
    if (exists.error) return exists;
    if (!exists.data) return { ...response_BAD, message: `A bucket with the name ${name} does not exist` };

    const response = await lisObjects({ client, options, name });
    return response;
  } catch (err: any) {
    return { ...response_SERVER_ERROR, data: err };
  }
};
