import createUser from "../lib/mongo/users/createUser";
import userExists from "../lib/mongo/users/userExists";
import getAllUsers from "../lib/mongo/users/getAllUsers";
import getUserById from "../lib/mongo/users/getUserById";
import express, { Router, Request, Response } from "express";
import updateUserById from "../lib/mongo/users/updateUserById";
import removeUserById from "../lib/mongo/users/removeUserById";
import { isValidUsername, isValidName } from "../lib/validation";
import getUsersByCompany from "../lib/mongo/users/getUsersByCompany";
import { response_SERVER_ERROR, response_BAD, status } from "../globals";

const router: Router = express.Router();

router.route("/").post(async (request: Request, response: Response) => {
  const { options } = request.body;

  try {
    const res = await getAllUsers(options);
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/by-company").post(async (request: Request, response: Response) => {
  const { companyId, options } = request.body;
  if (!companyId) return response.status(400).json({ ...response_BAD, message: "Missing required value(s): companyId" });

  try {
    const res = await getUsersByCompany(companyId, options);
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/by-id").delete(async (request: Request, response: Response) => {
  const { _id } = request.body;
  if (!_id) return response.status(400).json({ ...response_BAD, message: "Missing required value(s): _id" });

  try {
    const res = await removeUserById(_id);
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/by-id").patch(async (request: Request, response: Response) => {
  const { _id, update, options } = request.body;
  if (!_id || !update) return response.status(400).json({ ...response_BAD, message: "Missing required value(s): _id, update" });

  try {
    const res = await updateUserById({ _id, update, options });
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/by-id").post(async (request: Request, response: Response) => {
  const { _id, options } = request.body;
  if (!_id) return response.status(400).json({ ...response_BAD, message: "Missing required value(s): _id" });

  try {
    const res = await getUserById(_id, options);
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/create").put(async (request: Request, response: Response) => {
  const { username, permissions, companyId, firstName, surname } = request.body;
  if (!surname || !username || !firstName || !companyId) {
    return response.status(400).json({ ...response_BAD, message: `Missing required value(s): surname, firstName, companyId, username` });
  }

  const surnameValidation = isValidName(surname);
  const firstNameValidation = isValidName(firstName);
  const usernameValidation = isValidUsername(username);
  if (surnameValidation.error) return response.status(400).json({ ...response_BAD, message: surnameValidation.message });
  if (usernameValidation.error) return response.status(400).json({ ...response_BAD, message: usernameValidation.message });
  if (firstNameValidation.error) return response.status(400).json({ ...response_BAD, message: firstNameValidation.message });

  try {
    const res = await createUser({ username, permissions, companyId, firstName, surname });
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

router.route("/exists").post(async (request: Request, response: Response) => {
  const { username } = request.body;
  if (!username) return response.status(400).json({ ...response_BAD, message: `Missing required value(s): username` });

  const validation = isValidUsername(username);
  if (validation.error) return response.status(400).json({ ...response_BAD, message: validation.message });

  try {
    const res = await userExists(username);
    return response.status(res.status).json(res);
  } catch (err: any) {
    return response.status(status.SERVER_ERROR).json({ ...response_SERVER_ERROR, data: err });
  }
});

export default router;
