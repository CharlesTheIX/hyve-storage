import { Client } from "minio";
import { response_OK, response_SERVER_ERROR } from "../../globals";

type Props = {
  name: string;
  client: Client;
};

export default async (props: Props): Promise<ApiResponse> => {
  const { client, name } = props;
  try {
    var response = await client.listBuckets();
    const data = response.find((item) => item.name === name) || null;
    return { ...response_OK, data };
  } catch (err: any) {
    return { ...response_SERVER_ERROR, data: err };
  }
};
