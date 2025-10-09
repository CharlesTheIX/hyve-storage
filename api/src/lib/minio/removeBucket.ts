import logError from "../logError";
import bucketExists from "./bucketExists";
import getMinioClient from "./getMinioClient";
import { isValidBucketName } from "../validation";
import { BAD, NO_CONTENT, NOT_FOUND, OK, SERVER_ERROR } from "../../globals";

export default async (name: string): Promise<ApiResponse> => {
  const validation = isValidBucketName(name);
  if (validation.error) return { ...BAD, message: validation.message };

  try {
    const client = getMinioClient();
    const exists = await bucketExists(name);

    if (exists.error) return exists;
    if (exists.status !== OK.status) return NOT_FOUND;

    await client.removeBucket(name);

    return NO_CONTENT;
  } catch (err: any) {
    logError({ ...SERVER_ERROR, message: err.message });
    return { ...SERVER_ERROR, data: err };
  }
};
