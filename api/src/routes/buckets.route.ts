import { isValidBucketName } from "../lib/validation";
import bucketExists from "../lib/mongo/buckets/bucketExists";
import express, { Router, Request, Response } from "express";
import createBucket from "../lib/mongo/buckets/createBucket";
import getAllBuckets from "../lib/mongo/buckets/getAllBuckets";
import getBucketById from "../lib/mongo/buckets/getBucketById";
import getBucketByName from "../lib/mongo/buckets/getBucketByName";
import removeBucketById from "../lib/mongo/buckets/removeBucketById";
import updateBucketById from "../lib/mongo/buckets/updateBucketById";
import { response_SERVER_ERROR, response_BAD, status } from "../globals";
import getBucketsByCompany from "../lib/mongo/buckets/getBucketsByCompany";
import getObjects from "../lib/mongo/buckets/getObjects";

const router: Router = express.Router();

router.route("/").post(async (request: Request, response: Response) => {
  const { options } = request.body;

  try {
    const res = await getAllBuckets(options);
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/by-company").post(async (request: Request, response: Response) => {
  const { companyId, options } = request.body;
  if (!companyId) return response.status(400).json({ ...response_BAD, message: "Missing required value(s): companyId" });

  try {
    const res = await getBucketsByCompany(companyId, options);
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/by-id").delete(async (request: Request, response: Response) => {
  const { _id } = request.body;
  if (!_id) return response.status(400).json({ ...response_BAD, message: "Missing required value(s): _id" });

  try {
    const res = await removeBucketById(_id);
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/by-id").patch(async (request: Request, response: Response) => {
  const { _id, update, options } = request.body;
  if (!_id || !update) return response.status(400).json({ ...response_BAD, message: "Missing required value(s): _id, update" });

  try {
    const res = await updateBucketById({ _id, update, options });
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/by-id").post(async (request: Request, response: Response) => {
  const { _id, options } = request.body;
  if (!_id) return response.status(400).json({ ...response_BAD, message: "Missing required value(s): _id" });

  try {
    const res = await getBucketById(_id, options);
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/by-name").post(async (request: Request, response: Response) => {
  const { name, options } = request.body;
  if (!name) return response.status(400).json({ ...response_BAD, message: `Missing required value(s): name` });

  const validation = isValidBucketName(name);
  if (validation.error) return response.status(400).json({ ...response_BAD, message: validation.message });

  try {
    const res = await getBucketByName(name, options);
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/create").put(async (request: Request, response: Response) => {
  const { name, companyId, maxSize_bytes, permissions } = request.body;
  if (!name || !companyId || !maxSize_bytes)
    return response.status(400).json({ ...response_BAD, message: `Missing required value(s): name, companyId, maxSize_bytes` });

  const validation = isValidBucketName(name);
  if (validation.error) return response.status(400).json({ ...response_BAD, message: validation.message });

  try {
    const res = await createBucket({ name, maxSize_bytes, companyId, permissions });
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/exists").post(async (request: Request, response: Response) => {
  const { name } = request.body;
  if (!name) return response.status(400).json({ ...response_BAD, message: `Missing required value(s): name` });

  const validation = isValidBucketName(name);
  if (validation.error) return response.status(400).json({ ...response_BAD, message: validation.message });

  try {
    const res = await bucketExists(name);
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/objects").post(async (request: Request, response: Response) => {
  const { bucketId } = request.body;
  if (!bucketId) return response.status(400).json({ ...response_BAD, message: `Missing required value(s): bucketId` });

  try {
    const res = await getObjects(bucketId);
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

export default router;
