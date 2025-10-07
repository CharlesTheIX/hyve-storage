import getMinioClient from "./getMinioClient";
import { NO_CONTENT, OK, SERVER_ERROR } from "../../globals";

export default async (): Promise<ApiResponse> => {
  try {
    const client = getMinioClient();
    var data = await client.listBuckets();
    if (data.length === 0) return NO_CONTENT;

    return { ...OK, data };
  } catch (err: any) {
    //TODO: handle errors
    return { ...SERVER_ERROR, data: err };
  }
};
