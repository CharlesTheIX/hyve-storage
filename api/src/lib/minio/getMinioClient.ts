import * as Minio from "minio";
import getEnvVars from "../getEnvVars";

export default (): Minio.Client => {
  const vars = getEnvVars().minio;
  const client = new Minio.Client({
    useSSL: vars.useSSL,
    port: Number(vars.port),
    endPoint: vars.endpoint,
    accessKey: vars.accessKey,
    secretKey: vars.secretKey,
  });
  return client;
};
