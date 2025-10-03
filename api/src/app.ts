import cors from "cors";
import express from "express";
import bearerAuth from "./lib/auth/bearerAuth";
import usersRouter from "./routes/users.route";
import minioRouter from "./routes/minio.route";
import healthRoute from "./routes/health.route";
import bucketsRouter from "./routes/buckets.route";
import companiesRouter from "./routes/companies.route";

const version = "v1";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/", healthRoute);

app.use(bearerAuth);
app.use(`/${version}/minio`, minioRouter);
app.use(`/${version}/users`, usersRouter);
app.use(`/${version}/buckets`, bucketsRouter);
app.use(`/${version}/companies`, companiesRouter);

export default app;
