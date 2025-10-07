import fs from "fs";
import multer from "multer";
import { SERVER_ERROR, BAD } from "../globals";
import { isValidMimeType } from "../lib/validation";
import express, { Router, Request, Response } from "express";
import createBucket from "../lib/mongo/buckets/createBucket";
import getObjects from "../lib/mongo/buckets/getBucketObjects";
import getAllBuckets from "../lib/mongo/buckets/getAllBuckets";
import getBucketById from "../lib/mongo/buckets/getBucketById";
import bucketExists from "../lib/mongo/buckets/getBucketExists";
import getBucketByName from "../lib/mongo/buckets/getBucketByName";
import removeBucketById from "../lib/mongo/buckets/removeBucketById";
import updateBucketById from "../lib/mongo/buckets/updateBucketById";
import uploadBucketObject from "../lib/mongo/buckets/uploadBucketObject";
import getBucketsByCompany from "../lib/mongo/buckets/getBucketsByCompanyId";

const router: Router = express.Router();
const upload = multer({ dest: "/tmp" });

router.route("/").post(async (request: Request, response: Response) => {
  const { filters } = request.body;
  try {
    const res = await getAllBuckets(filters);
    return response.status(res.status).json(res);
  } catch (err: any) {
    //TODO: handle errors
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/by-company-id").post(async (request: Request, response: Response) => {
  const { company_id, filters } = request.body;
  if (!company_id) return response.status(400).json({ ...BAD, message: "Missing required value(s): company_id" });
  try {
    const res = await getBucketsByCompany(company_id, filters);
    return response.status(res.status).json(res);
  } catch (err: any) {
    //TODO: handle errors
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/by-id").delete(async (request: Request, response: Response) => {
  const { _id } = request.body;
  if (!_id) return response.status(400).json({ ...BAD, message: "Missing required value(s): _id" });
  try {
    const res = await removeBucketById(_id);
    return response.status(res.status).json(res);
  } catch (err: any) {
    //TODO: handle errors
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/by-id").patch(async (request: Request, response: Response) => {
  const { _id, update, filters } = request.body;
  if (!_id || !update) return response.status(400).json({ ...BAD, message: "Missing required value(s): _id, update" });
  try {
    const res = await updateBucketById({ _id, update, filters });
    return response.status(res.status).json(res);
  } catch (err: any) {
    //TODO: handle errors
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/by-id").post(async (request: Request, response: Response) => {
  const { _id, filters } = request.body;
  if (!_id) return response.status(400).json({ ...BAD, message: "Missing required value(s): _id" });
  try {
    const res = await getBucketById(_id, filters);
    return response.status(res.status).json(res);
  } catch (err: any) {
    //TODO: handle errors
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/by-name").post(async (request: Request, response: Response) => {
  const { name, filters } = request.body;
  if (!name) return response.status(400).json({ ...BAD, message: `Missing required value(s): name` });
  try {
    const res = await getBucketByName(name, filters);
    return response.status(res.status).json(res);
  } catch (err: any) {
    //TODO: handle errors
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/create").put(async (request: Request, response: Response) => {
  const { name, company_id, max_size_bytes, permissions } = request.body;
  if (!name || !company_id || !max_size_bytes) {
    return response.status(400).json({ ...BAD, message: `Missing required value(s): name, company_id, max_size_bytes` });
  }
  try {
    const res = await createBucket({ name, max_size_bytes, company_id, permissions });
    return response.status(res.status).json(res);
  } catch (err: any) {
    //TODO: handle errors
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/exists").post(async (request: Request, response: Response) => {
  const { name } = request.body;
  if (!name) return response.status(400).json({ ...BAD, message: `Missing required value(s): name` });
  try {
    const res = await bucketExists(name);
    return response.status(res.status).json(res);
  } catch (err: any) {
    //TODO: handle errors
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/objects").post(async (request: Request, response: Response) => {
  const { bucket_id } = request.body;
  if (!bucket_id) return response.status(400).json({ ...BAD, message: `Missing required value(s): bucket_id` });
  try {
    const res = await getObjects(bucket_id);
    return response.status(res.status).json(res);
  } catch (err: any) {
    //TODO: handle errors
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/objects/upload").put(upload.single("file"), async (request: Request, response: Response): Promise<any> => {
  const { bucket_name, object_name, from_source } = request.body;
  const file = request.file;
  if (!bucket_name || !file) {
    return response.status(BAD.status).json({ ...BAD, message: "Missing Required value(s): bucket_name, file." });
  }
  const valid_mimetype = isValidMimeType(file);
  if (valid_mimetype.error) {
    fs.unlinkSync(file.path);
    return response.status(BAD.status).json({ ...BAD, message: valid_mimetype.message });
  }
  try {
    const res = await uploadBucketObject({ bucket_name, object_name, file, from_source });
    fs.unlinkSync(file.path);
    return response.json(res);
  } catch (err: any) {
    //TODO: handle errors
    return response.status(SERVER_ERROR.status).json(SERVER_ERROR);
  }
});

export default router;
