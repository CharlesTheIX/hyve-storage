import { response_OK } from "../globals";
import express, { Router, Response } from "express";

const router: Router = express.Router();
router.route("/").get((_, response: Response) => {
  return response.json(response_OK);
});
export default router;
