import { Client } from "minio";
import bucketExists from "./bucketExists";
import { isValidBucketName } from "../validation";
import { response_BAD, response_DB_UPDATED, response_SERVER_ERROR } from "../../globals";

type Props = {
  name: string;
  client: Client;
};

export default async (props: Props): Promise<ApiResponse> => {
  const { client, name } = props;
  const validation = isValidBucketName(name);
  if (validation.error) return { ...response_BAD, message: validation.message };

  try {
    const exists = await bucketExists(client, name);
    if (exists.error) return exists;
    if (!exists.data) return { ...response_BAD, message: `A bucket with the name ${name} does not exist` };

    await client.removeBucket(name);
    const newExists = await bucketExists(client, name);
    if (newExists.error || newExists.data) return { ...response_SERVER_ERROR, message: "Bucket removal failed" };

    return { ...response_DB_UPDATED, message: `Bucket ${name} removed` };
  } catch (err: any) {
    return { ...response_SERVER_ERROR, data: err };
  }
};
