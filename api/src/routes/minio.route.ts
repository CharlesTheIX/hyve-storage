import fs from "fs";
import multer from "multer";
import listBuckets from "../lib/minio/listBuckets";
import bucketExists from "../lib/minio/bucketExists";
import createBucket from "../lib/minio/createBucket";
import removeBucket from "../lib/minio/removeBucket";
import getBucketSize from "../lib/minio/getBucketSize";
import listBucketObjects from "../lib/minio/lisObjects";
import getMinioClient from "../lib/minio/getMinioClient";
import getBucketByName from "../lib/minio/getBucketByName";
import express, { Router, Request, Response } from "express";
import uploadFormObject from "../lib/minio/uploadFormObject";
import { isValidBucketName, isValidMimeType } from "../lib/validation";
import { response_SERVER_ERROR, response_BAD, status } from "../globals";

const client = getMinioClient();
const router: Router = express.Router();
const upload = multer({ dest: "/tmp" });

router.route("/buckets").post(async (_, response: Response) => {
  try {
    const res = await listBuckets(client);
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/buckets/by-name").delete(async (request: Request, response: Response) => {
  const { name } = request.body;
  if (!name) return response.status(400).json({ ...response_BAD, message: `Missing required value(s): name` });

  const validation = isValidBucketName(name);
  if (validation.error) return response.status(400).json({ ...response_BAD, message: validation.message });

  try {
    const res = await removeBucket({ client, name });
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/buckets/by-name").post(async (request: Request, response: Response) => {
  const { name } = request.body;
  if (!name) return response.status(400).json({ ...response_BAD, message: `Missing required value(s): name` });

  const validation = isValidBucketName(name);
  if (validation.error) return response.status(400).json({ ...response_BAD, message: validation.message });

  try {
    const res = await getBucketByName({ client, name });
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/buckets/create").put(async (request: Request, response: Response) => {
  const { name } = request.body;
  if (!name) return response.status(400).json({ ...response_BAD, message: `Missing required value(s): name` });

  const validation = isValidBucketName(name);
  if (validation.error) return response.status(400).json({ ...response_BAD, message: validation.message });

  try {
    const res = await createBucket({ client, name, options: {} });
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/buckets/exists").post(async (request: Request, response: Response) => {
  const { name } = request.body;
  if (!name) return response.status(400).json({ ...response_BAD, message: `Missing required value(s): name` });

  const validation = isValidBucketName(name);
  if (validation.error) return response.status(400).json({ ...response_BAD, message: validation.message });

  try {
    const res = await bucketExists(client, name);
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/buckets/size").post(async (request: Request, response: Response) => {
  const { name } = request.body;
  if (!name) return response.status(400).json({ ...response_BAD, message: `Missing required value(s): name` });

  const validation = isValidBucketName(name);
  if (validation.error) return response.status(400).json({ ...response_BAD, message: validation.message });

  try {
    const res = await getBucketSize(client, name);
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/objects").post(async (request: Request, response: Response) => {
  const { name } = request.body;
  if (!name) return response.status(400).json({ ...response_BAD, message: `Missing required value(s): name` });

  const validation = isValidBucketName(name);
  if (validation.error) return response.status(400).json({ ...response_BAD, message: validation.message });

  try {
    const res = await listBucketObjects({ client, name, options: {} });
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/objects/upload").put(upload.single("file"), async (request: Request, response: Response): Promise<any> => {
  const { bucketName, objectName, fromSource } = request.body;
  const file = request.file;
  if (!bucketName || !file) {
    return response.status(status.BAD).json({ ...response_BAD, message: "Missing Required value(s): bucketName, file." });
  }

  const validBucketName = isValidBucketName(bucketName);
  if (validBucketName.error) {
    return response.status(status.BAD).json({ ...response_BAD, message: validBucketName.message });
  }

  const validMimeType = isValidMimeType(file);
  if (validMimeType.error) {
    fs.unlinkSync(file.path);
    return response.status(status.BAD).json({ ...response_BAD, message: validMimeType.message });
  }

  try {
    const res = await uploadFormObject({ client, bucketName, objectName, file, fromSource });
    fs.unlinkSync(file.path);
    return response.json(res);
  } catch (err: any) {
    console.error(`Minio upload form object error: ${err.message}`);
    return response.status(status.SERVER_ERROR).json(response_SERVER_ERROR);
  }
});

export default router;
