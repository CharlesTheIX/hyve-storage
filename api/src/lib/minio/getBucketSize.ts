import { Client } from "minio";
import bucketExists from "./bucketExists";
import { isValidBucketName } from "../validation";
import { response_BAD, response_OK, response_SERVER_ERROR } from "../../globals";

export default async (client: Client, name: string): Promise<ApiResponse> => {
  const validation = isValidBucketName(name);
  if (validation.error) return { ...response_BAD, message: validation.message };

  try {
    const exists = await bucketExists(client, name);
    if (exists.error) return exists;
    if (!exists.data) return { ...response_BAD, message: `A bucket with the name ${name} does not exist` };

    return new Promise((resolve, reject) => {
      var totalSize: number = 0;
      const stream = client.listObjectsV2(name, "", true);
      stream.on("data", (obj) => {
        totalSize += obj.size;
      });
      stream.on("error", (err) => {
        reject(err);
      });
      stream.on("end", () => {
        const response: ApiResponse = { ...response_OK, data: totalSize };
        resolve(response);
      });
    });
  } catch (err: any) {
    return { ...response_SERVER_ERROR, data: err };
  }
};
