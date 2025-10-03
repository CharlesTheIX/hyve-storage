import getBucketById from "./getBucketById";
import bucketExists from "../../minio/bucketExists";
import getMinioClient from "../../minio/getMinioClient";
import { response_BAD, response_OK, response_SERVER_ERROR } from "../../../globals";

export default async (bucketId: string, options: any = {}): Promise<ApiResponse> => {
  try {
    const bucket = await getBucketById(bucketId, { fields: ["name"] });
    if (bucket.error) return bucket;

    const name = bucket.data.name;
    const client = getMinioClient();
    const exists = await bucketExists(client, name);
    if (exists.error) return exists;
    if (!exists.data) return { ...response_BAD, message: `A bucket with the name ${name} does not exist` };

    const data: any[] = [];
    var error: boolean = false;
    const { prefix = "", recursive = false } = options;
    const response = client.listObjects(name, prefix, recursive);
    response.on("data", (obj) => {
      data.push(obj);
    });
    response.on("error", () => {
      error = true;
    });
    if (error) return { ...response_SERVER_ERROR, message: `The bucket stream failed to run completely for bucket: ${name}` };
    return { ...response_OK, data, message: `Bucket objects listed successfully from ${name}` };
  } catch (err: any) {
    return { ...response_SERVER_ERROR, data: err };
  }
};
