import { Client } from "minio";
import { isValidBucketName } from "../validation";
import { response_BAD, response_OK, response_SERVER_ERROR } from "../../globals";

export default async (client: Client, name: string): Promise<ApiResponse> => {
  const validation = isValidBucketName(name);
  if (validation.error) return { ...response_BAD, message: validation.message };

  try {
    const response = await client.bucketExists(name);
    return { ...response_OK, data: response, message: `Minio bucket ${name} ${!!response ? "does" : "does not"} exist` };
  } catch (err: any) {
    return { ...response_SERVER_ERROR, data: err };
  }
};
