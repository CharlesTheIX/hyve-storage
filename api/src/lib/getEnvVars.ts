import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

export default () => ({
  port: Number(process.env.PORT!),
  environment: process.env.ENVIRONMENT!,
  minio: {
    port: process.env.MINIO_PORT!,
    region: process.env.MINIO_REGION!,
    endpoint: process.env.MINIO_ENDPOINT!,
    accessKey: process.env.MINIO_ACCESS_KEY!,
    secretKey: process.env.MINIO_SECRET_KEY!,
    useSSL: process.env.MINIO_USE_SSL! === "true",
  },
  mongo: {
    uri: process.env.MONGO_URI!,
  },
  auth: {
    token: process.env.AUTH_TOKEN!,
  },
});
