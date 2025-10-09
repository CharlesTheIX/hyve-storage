import cors from "cors";
import express from "express";
import ErrorRoute from "./routes/error.route";
import bearerAuth from "./lib/auth/bearerAuth";
import UsersRouter from "./routes/users.route";
import MinioRouter from "./routes/minio.route";
import HealthRoute from "./routes/health.route";
import BucketsRouter from "./routes/buckets.route";
import CompaniesRouter from "./routes/companies.route";

const version = "v1";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/", HealthRoute);

app.use(bearerAuth);
app.use(`/${version}/error`, ErrorRoute);
app.use(`/${version}/minio`, MinioRouter);
app.use(`/${version}/users`, UsersRouter);
app.use(`/${version}/buckets`, BucketsRouter);
app.use(`/${version}/companies`, CompaniesRouter);

export default app;
