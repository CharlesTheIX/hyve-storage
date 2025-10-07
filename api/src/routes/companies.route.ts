import { SERVER_ERROR, BAD } from "../globals";
import express, { Router, Request, Response } from "express";
import createCompany from "../lib/mongo/companies/createCompany";
import getCompanyById from "../lib/mongo/companies/getCompanyById";
import companyExists from "../lib/mongo/companies/getCompanyExists";
import getAllCompanies from "../lib/mongo/companies/getAllCompanies";
import removeCompanyById from "../lib/mongo/companies/removeCompanyById";
import updateCompanyById from "../lib/mongo/companies/updateCompanyById";

const router: Router = express.Router();

router.route("/").post(async (request: Request, response: Response) => {
  const { filters } = request.body;
  try {
    const res = await getAllCompanies(filters);
    return response.status(res.status).json(res);
  } catch (err: any) {
    // TODO: handle errors
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/by-id").delete(async (request: Request, response: Response) => {
  const { _id } = request.body;
  if (!_id) return response.status(BAD.status).json({ ...BAD, message: "Missing required value(s): _id" });
  try {
    const res = await removeCompanyById(_id);
    return response.status(res.status).json(res);
  } catch (err: any) {
    // TODO: handle errors
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/by-id").patch(async (request: Request, response: Response) => {
  const { _id, update, filters } = request.body;
  if (!_id || !update) return response.status(BAD.status).json({ ...BAD, message: "Missing required value(s): _id, update" });
  try {
    const res = await updateCompanyById({ _id, update, filters });
    return response.status(res.status).json(res);
  } catch (err: any) {
    // TODO: handle errors
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/by-id").post(async (request: Request, response: Response) => {
  const { _id, filters } = request.body;
  if (!_id) return response.status(BAD.status).json({ ...BAD, message: "Missing required value(s): _id" });
  try {
    const res = await getCompanyById(_id, filters);
    return response.status(res.status).json(res);
  } catch (err: any) {
    // TODO: handle errors
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/create").put(async (request: Request, response: Response) => {
  const { name, user_ids } = request.body;
  if (!name || !user_ids || user_ids.length === 0) {
    return response.status(BAD.status).json({ ...BAD, message: `Missing required value(s): name, user_ids` });
  }
  try {
    const res = await createCompany({ name, user_ids });
    return response.status(res.status).json(res);
  } catch (err: any) {
    // TODO: handle errors
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/exists").post(async (request: Request, response: Response) => {
  const { name } = request.body;
  if (!name) return response.status(BAD.status).json({ ...BAD, message: `Missing required value(s): name` });
  try {
    const res = await companyExists(name);
    return response.status(res.status).json(res);
  } catch (err: any) {
    // TODO: handle errors
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

export default router;
