import fs from "fs";
import multer from "multer";
import logError from "../lib/logError";
import { SERVER_ERROR, BAD } from "../globals";
import listBuckets from "../lib/minio/listBuckets";
import { isValidMimeType } from "../lib/validation";
import bucketExists from "../lib/minio/bucketExists";
import createBucket from "../lib/minio/createBucket";
import removeBucket from "../lib/minio/removeBucket";
import getBucketSize from "../lib/minio/getBucketSize";
import listBucketObjects from "../lib/minio/lisObjects";
import getBucketByName from "../lib/minio/getBucketByName";
import express, { Router, Request, Response } from "express";
import uploadFormObject from "../lib/minio/uploadFormObject";

const router: Router = express.Router();
const upload = multer({ dest: "/tmp" });

router.route("/buckets").post(async (_, response: Response) => {
  try {
    const res = await listBuckets();
    return response.json(res);
  } catch (err: any) {
    logError({ ...SERVER_ERROR, message: err.message });
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/buckets/by-name").delete(async (request: Request, response: Response) => {
  const { name } = request.body;
  if (!name) return response.json({ ...BAD, message: `Missing required value(s): name` });

  try {
    const res = await removeBucket(name);
    return response.json(res);
  } catch (err: any) {
    logError({ ...SERVER_ERROR, message: err.message });
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/buckets/by-name").post(async (request: Request, response: Response) => {
  const { name } = request.body;
  if (!name) return response.json({ ...BAD, message: `Missing required value(s): name` });

  try {
    const res = await getBucketByName(name);
    return response.json(res);
  } catch (err: any) {
    logError({ ...SERVER_ERROR, message: err.message });
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/buckets/create").put(async (request: Request, response: Response) => {
  const { name } = request.body;
  if (!name) return response.json({ ...BAD, message: `Missing required value(s): name` });

  try {
    const res = await createBucket(name);
    return response.json(res);
  } catch (err: any) {
    logError({ ...SERVER_ERROR, message: err.message });
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/buckets/exists").post(async (request: Request, response: Response) => {
  const { name } = request.body;
  if (!name) return response.json({ ...BAD, message: `Missing required value(s): name` });

  try {
    const res = await bucketExists(name);
    return response.json(res);
  } catch (err: any) {
    logError({ ...SERVER_ERROR, message: err.message });
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/buckets/size").post(async (request: Request, response: Response) => {
  const { name } = request.body;
  if (!name) return response.json({ ...BAD, message: `Missing required value(s): name` });

  try {
    const res = await getBucketSize(name);
    return response.json(res);
  } catch (err: any) {
    logError({ ...SERVER_ERROR, message: err.message });
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/objects").post(async (request: Request, response: Response) => {
  const { name } = request.body;
  if (!name) return response.json({ ...BAD, message: `Missing required value(s): name` });

  try {
    const res = await listBucketObjects(name);
    return response.json(res);
  } catch (err: any) {
    logError({ ...SERVER_ERROR, message: err.message });
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/objects/upload").put(upload.single("file"), async (request: Request, response: Response): Promise<any> => {
  const { bucket_name, object_name, from_source } = request.body;
  const file = request.file;
  if (!bucket_name || !file) {
    return response.json({ ...BAD, message: "Missing Required value(s): bucket_name, file." });
  }

  const valid_mimetype = isValidMimeType(file);
  if (valid_mimetype.error) {
    fs.unlinkSync(file.path);
    return response.json({ ...BAD, message: valid_mimetype.message });
  }

  try {
    const res = await uploadFormObject({ bucket_name, object_name, file, from_source });
    fs.unlinkSync(file.path);
    return response.json(res);
  } catch (err: any) {
    logError({ ...SERVER_ERROR, message: err.message });
    return response.status(SERVER_ERROR.status).json(SERVER_ERROR);
  }
});

export default router;
