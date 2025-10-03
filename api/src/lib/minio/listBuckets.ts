import { Client } from "minio";
import { response_OK, response_SERVER_ERROR } from "../../globals";

export default async (client: Client): Promise<ApiResponse> => {
  try {
    var response = await client.listBuckets();
    return { ...response_OK, data: response, message: "Buckets listed successfully" };
  } catch (err: any) {
    return { ...response_SERVER_ERROR, data: err };
  }
};
