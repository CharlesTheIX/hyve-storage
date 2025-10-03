import { Client } from "minio";

type Props = {
  client: Client;
  bucketName: string;
  objectName: string;
};

export default async (props: Props): Promise<boolean> => {
  const { client, bucketName, objectName } = props;

  try {
    await client.statObject(bucketName, objectName);
    return true;
  } catch (err: any) {
    if (err.code === "NoSuchKey" || err.code === "NotFound") return false;
    return false;
  }
};
