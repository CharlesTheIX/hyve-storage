import logError from "../logError";
import getEnvVars from "../getEnvVars";
import bucketExists from "./bucketExists";
import getMinioClient from "./getMinioClient";
import { isValidBucketName } from "../validation";
import { BAD, CONFLICT, DB_UPDATED, OK, SERVER_ERROR } from "../../globals";

const vars = getEnvVars();
export default async (name: string, options: any = { region: vars.minio.region, makeOptions: { ObjectLocking: false } }): Promise<ApiResponse> => {
  const validation = isValidBucketName(name);
  if (validation.error) return { ...BAD, message: validation.message };

  try {
    const exists = await bucketExists(name);
    if (exists.error) return exists;
    if (exists.status === OK.status) return { ...CONFLICT, message: "Bucket name already exists" };

    const client = getMinioClient();
    const { region, makeOptions } = options;
    await client.makeBucket(name, region, makeOptions);

    return DB_UPDATED;
  } catch (err: any) {
    logError({ ...SERVER_ERROR, message: err.message });
    return { ...SERVER_ERROR, data: err };
  }
};
