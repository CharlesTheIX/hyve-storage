import { Client } from "minio";
import bucketExists from "./bucketExists";
import { isValidBucketName } from "../validation";
import { response_BAD, response_OK, response_SERVER_ERROR } from "../../globals";

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
    if (!exists.data) return { ...response_BAD, message: `A bucket with the name ${name} does not exist` };

    const { prefix = "", recursive = false } = options;
    const data = await new Promise<any[]>((resolve, reject) => {
      const objects: any[] = [];
      const stream = client.listObjects(name, prefix, recursive);

      stream.on("data", (obj) => objects.push(obj));
      stream.on("error", (err) => reject(err));
      stream.on("end", () => resolve(objects));
    });
    return { ...response_OK, data, message: `Bucket objects listed successfully from ${name}` };
  } catch (err: any) {
    return { ...response_SERVER_ERROR, data: err };
  }
};
