import logError from "../logError";
import getMinioClient from "./getMinioClient";
import { isValidBucketName } from "../validation";
import { BAD, NO_CONTENT, OK, SERVER_ERROR } from "../../globals";

export default async (bucket_name: string, object_name: string): Promise<ApiResponse> => {
  const bucket_validation = isValidBucketName(bucket_name);
  if (bucket_validation.error) return { ...BAD, message: bucket_validation.message };

  const object_validation = isValidBucketName(object_name);
  if (object_validation.error) return { ...BAD, message: object_validation.message };

  try {
    const client = getMinioClient();
    const data = !!(await client.statObject(bucket_name, object_name));
    if (!data) return NO_CONTENT;

    return { ...OK, data };
  } catch (err: any) {
    logError({ ...SERVER_ERROR, message: err.message });
    return { ...SERVER_ERROR, data: err };
  }
};
