import { Client } from "minio";
import getEnvVars from "../getEnvVars";
import bucketExists from "./bucketExists";
import { isValidBucketName } from "../validation";
import { response_BAD, response_DB_UPDATED, response_SERVER_ERROR } from "../../globals";

type Props = {
  options: any;
  name: string;
  client: Client;
};

export default async (props: Props): Promise<ApiResponse> => {
  const { client, name, options } = props;
  const validation = isValidBucketName(name);
  if (validation.error) return { ...response_BAD, message: validation.message };

  try {
    const exists = await bucketExists(client, name);
    if (exists.error) return exists;
    if (exists.data) return { ...response_BAD, message: `A bucket with the name ${name} name already exists` };

    const vars = getEnvVars();
    const { region = vars.minio.region, makeOptions = { ObjectLocking: false } } = options;
    await client.makeBucket(name, region, makeOptions);

    const newExists = await bucketExists(client, name);
    if (newExists.error || !newExists.data) return { ...response_SERVER_ERROR, message: "Bucket creation failed" };

    return { ...response_DB_UPDATED, message: `Bucket ${name} created` };
  } catch (err: any) {
    return { ...response_SERVER_ERROR, data: err };
  }
};
