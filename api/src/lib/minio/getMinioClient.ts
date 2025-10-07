import { Client } from "minio";
import getEnvVars from "../getEnvVars";

export default (): Client => {
  const vars = getEnvVars().minio;
  const client = new Client({
    useSSL: vars.use_SSL,
    port: Number(vars.port),
    endPoint: vars.endpoint,
    accessKey: vars.access_key,
    secretKey: vars.secret_key,
  });
  return client;
};
