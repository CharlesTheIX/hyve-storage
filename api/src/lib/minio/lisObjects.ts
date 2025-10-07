import bucketExists from "./bucketExists";
import getMinioClient from "./getMinioClient";
import { isValidBucketName } from "../validation";
import { BAD, NOT_FOUND, OK, SERVER_ERROR } from "../../globals";

export default async (name: string, options: any = { prefix: "", recursive: false }): Promise<ApiResponse> => {
  const validation = isValidBucketName(name);
  if (validation.error) return { ...BAD, message: validation.message };

  try {
    const exists = await bucketExists(name);
    if (exists.error) return exists;
    if (exists.status !== OK.status) return NOT_FOUND;

    const client = getMinioClient();
    const { prefix, recursive } = options;
    const data = await new Promise<any[]>((resolve, reject) => {
      const objects: any[] = [];
      const stream = client.listObjects(name, prefix, recursive);

      stream.on("data", (obj) => objects.push(obj));
      stream.on("error", (err) => reject(err));
      stream.on("end", () => resolve(objects));
    });

    return { ...OK, data };
  } catch (err: any) {
    //TODO: handle errors
    return { ...SERVER_ERROR, data: err };
  }
};
