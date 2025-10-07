import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

export default () => ({
  port: Number(process.env.PORT!),
  environment: process.env.ENVIRONMENT!,
  minio: {
    port: process.env.MINIO_PORT!,
    region: process.env.MINIO_REGION!,
    endpoint: process.env.MINIO_ENDPOINT!,
    access_key: process.env.MINIO_ACCESS_KEY!,
    secret_key: process.env.MINIO_SECRET_KEY!,
    use_SSL: process.env.MINIO_USE_SSL! === "true",
  },
  mongo: {
    uri: process.env.MONGO_URI!,
  },
  auth: {
    token: process.env.AUTH_TOKEN!,
  },
});
