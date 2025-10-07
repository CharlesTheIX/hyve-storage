import getMinioClient from "./getMinioClient";
import { isValidBucketName } from "../validation";
import { BAD, NO_CONTENT, OK, SERVER_ERROR } from "../../globals";

export default async (name: string): Promise<ApiResponse> => {
  const validation = isValidBucketName(name);
  if (validation.error) return { ...BAD, message: validation.message };

  try {
    const client = getMinioClient();
    const data = !!(await client.bucketExists(name));
    if (!data) return NO_CONTENT;

    return { ...OK, data };
  } catch (err: any) {
    //TODO: handle errors
    return { ...SERVER_ERROR, data: err };
  }
};
