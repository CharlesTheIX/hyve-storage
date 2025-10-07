import getMinioClient from "./getMinioClient";
import { isValidBucketName } from "../validation";
import { BAD, NOT_FOUND, OK, SERVER_ERROR } from "../../globals";

export default async (name: string): Promise<ApiResponse> => {
  const validation = isValidBucketName(name);
  if (validation.error) return { ...BAD, message: validation.message };

  try {
    const client = getMinioClient();
    var response = await client.listBuckets();
    const data = response.find((i) => i.name === name);
    if (!data) return NOT_FOUND;

    return { ...OK, data };
  } catch (err: any) {
    //TODO: handle errors
    return { ...SERVER_ERROR, data: err };
  }
};
