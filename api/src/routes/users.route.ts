import logError from "../lib/logError";
import { SERVER_ERROR, BAD } from "../globals";
import createUser from "../lib/mongo/users/createUser";
import getAllUsers from "../lib/mongo/users/getAllUsers";
import getUserById from "../lib/mongo/users/getUserById";
import userExists from "../lib/mongo/users/getUserExists";
import express, { Router, Request, Response } from "express";
import updateUserById from "../lib/mongo/users/updateUserById";
import removeUserById from "../lib/mongo/users/removeUserById";
import getUsersByCompany from "../lib/mongo/users/getUsersByCompanyId";

const router: Router = express.Router();

router.route("/").post(async (request: Request, response: Response) => {
  const { filters } = request.body;
  try {
    const res = await getAllUsers(filters);
    return response.json(res);
  } catch (err: any) {
    logError({ ...SERVER_ERROR, message: err.message });
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/by-company-id").post(async (request: Request, response: Response) => {
  const { company_id, filters } = request.body;
  if (!company_id) return response.json({ ...BAD, message: "Missing required value(s): company_id" });
  try {
    const res = await getUsersByCompany(company_id, filters);
    return response.json(res);
  } catch (err: any) {
    //TODO: handle errors
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/by-id").delete(async (request: Request, response: Response) => {
  const { _id } = request.body;
  if (!_id) return response.json({ ...BAD, message: "Missing required value(s): _id" });
  try {
    const res = await removeUserById(_id);
    return response.json(res);
  } catch (err: any) {
    //TODO: handle errors
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/by-id").patch(async (request: Request, response: Response) => {
  const { _id, update, filters } = request.body;
  if (!_id || !update) return response.json({ ...BAD, message: "Missing required value(s): _id, update" });
  try {
    const res = await updateUserById({ _id, update, filters });
    return response.json(res);
  } catch (err: any) {
    //TODO: handle errors
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/by-id").post(async (request: Request, response: Response) => {
  const { _id, filters } = request.body;
  if (!_id) return response.json({ ...BAD, message: "Missing required value(s): _id" });
  try {
    const res = await getUserById(_id, filters);
    return response.json(res);
  } catch (err: any) {
    //TODO: handle errors
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/create").put(async (request: Request, response: Response) => {
  const { username, permissions, company_id, first_name, surname } = request.body;
  if (!surname || !username || !first_name || !permissions || permissions.length === 0) {
    return response.json({ ...BAD, message: `Missing required value(s): surname, first_name, username, permissions` });
  }
  try {
    const res = await createUser({ username, permissions, company_id, first_name, surname });
    return response.json(res);
  } catch (err: any) {
    //TODO: handle errors
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

router.route("/exists").post(async (request: Request, response: Response) => {
  const { username } = request.body;
  if (!username) return response.json({ ...BAD, message: `Missing required value(s): username` });
  try {
    const res = await userExists(username);
    return response.json(res);
  } catch (err: any) {
    //TODO: handle errors
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});

export default router;
