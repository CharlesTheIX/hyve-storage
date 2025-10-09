import logError from "../lib/logError";
import { OK, SERVER_ERROR } from "../globals";
import express, { Router, Request, Response } from "express";

const router: Router = express.Router();
router.route("/").post(async (request: Request, response: Response) => {
  const { data } = request.body;
  try {
    logError(data);
    return response.json(OK);
  } catch (err: any) {
    return response.status(SERVER_ERROR.status).json({ ...SERVER_ERROR, data: err });
  }
});
export default router;
