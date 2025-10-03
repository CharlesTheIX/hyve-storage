import { isValidCompanyName } from "../lib/validation";
import express, { Router, Request, Response } from "express";
import createCompany from "../lib/mongo/companies/createCompany";
import companyExists from "../lib/mongo/companies/companyExists";
import getCompanyById from "../lib/mongo/companies/getCompanyById";
import addCompanyUser from "../lib/mongo/companies/addCompanyUser";
import getAllCompanies from "../lib/mongo/companies/getAllCompanies";
import addCompanyBucket from "../lib/mongo/companies/addCompanyBucket";
import { response_SERVER_ERROR, response_BAD, status } from "../globals";
import removeCompanyById from "../lib/mongo/companies/removeCompanyById";
import updateCompanyById from "../lib/mongo/companies/updateCompanyById";
import removeCompanyUser from "../lib/mongo/companies/removeCompanyUser";
import removeCompanyBucket from "../lib/mongo/companies/removeCompanyBucket";

const router: Router = express.Router();

router.route("/").post(async (request: Request, response: Response) => {
  const { options } = request.body;

  try {
    const res = await getAllCompanies(options);
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/add-bucket").patch(async (request: Request, response: Response) => {
  const { _id, bucketId } = request.body;
  if (!_id || !bucketId) return response.status(400).json({ ...response_BAD, message: "Missing required value(s): _id, bucketId" });

  try {
    const res = await addCompanyBucket(_id, bucketId);
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/add-user").patch(async (request: Request, response: Response) => {
  const { _id, userId } = request.body;
  if (!_id || !userId) return response.status(400).json({ ...response_BAD, message: "Missing required value(s): _id, userId" });

  try {
    const res = await addCompanyUser(_id, userId);
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/by-id").delete(async (request: Request, response: Response) => {
  const { _id } = request.body;
  if (!_id) return response.status(400).json({ ...response_BAD, message: "Missing required value(s): _id" });

  try {
    const res = await removeCompanyById(_id);
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/by-id").patch(async (request: Request, response: Response) => {
  const { _id, update, options } = request.body;
  if (!_id || !update) return response.status(400).json({ ...response_BAD, message: "Missing required value(s): _id, update" });

  try {
    const res = await updateCompanyById({ _id, update, options });
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/by-id").post(async (request: Request, response: Response) => {
  const { _id, options } = request.body;
  if (!_id) return response.status(400).json({ ...response_BAD, message: "Missing required value(s): _id" });

  try {
    const res = await getCompanyById(_id, options);
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/create").put(async (request: Request, response: Response) => {
  const { name, userIds } = request.body;
  if (!name || !userIds) return response.status(400).json({ ...response_BAD, message: `Missing required value(s): name, userIds` });

  const validation = isValidCompanyName(name);
  if (validation.error) return response.status(400).json({ ...response_BAD, message: validation.message });

  try {
    const res = await createCompany({ name, userIds });
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/exists").post(async (request: Request, response: Response) => {
  const { name } = request.body;
  if (!name) return response.status(400).json({ ...response_BAD, message: `Missing required value(s): name` });

  const validation = isValidCompanyName(name);
  if (validation.error) return response.status(400).json({ ...response_BAD, message: validation.message });

  try {
    const res = await companyExists(name);
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/remove-bucket").patch(async (request: Request, response: Response) => {
  const { _id, bucketId } = request.body;
  if (!_id || !bucketId) return response.status(400).json({ ...response_BAD, message: `Missing required value(s): _id, bucketId` });

  try {
    const res = await removeCompanyBucket(_id, bucketId);
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/remove-user").patch(async (request: Request, response: Response) => {
  const { _id, userId } = request.body;
  if (!_id || !userId) return response.status(400).json({ ...response_BAD, message: `Missing required value(s): _id, userId` });

  try {
    const res = await removeCompanyUser(_id, userId);
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

export default router;
