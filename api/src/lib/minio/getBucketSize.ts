import logError from "../logError";
import bucketExists from "./bucketExists";
import getMinioClient from "./getMinioClient";
import { isValidBucketName } from "../validation";
import { BAD, NOT_FOUND, OK, SERVER_ERROR } from "../../globals";

export default async (name: string): Promise<ApiResponse> => {
  const validation = isValidBucketName(name);
  if (validation.error) return { ...BAD, message: validation.message };

  try {
    const exists = await bucketExists(name);
    if (exists.error) return exists;
    if (exists.status !== OK.status) return NOT_FOUND;

    const client = getMinioClient();
    const data = new Promise((resolve, reject) => {
      var total_size: number = 0;
      const stream = client.listObjectsV2(name, "", true);

      stream.on("data", (obj) => (total_size += obj.size));
      stream.on("error", (err) => reject(err));
      stream.on("end", () => resolve(total_size));
    });

    return { ...OK, data };
  } catch (err: any) {
    logError({ ...SERVER_ERROR, message: err.message });
    return { ...SERVER_ERROR, data: err };
  }
};
