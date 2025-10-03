import getEnvVars from "../getEnvVars";
import { Request, Response, NextFunction } from "express";
import { response_UNAUTHORISED, status } from "../../globals";

export default (request: Request, response: Response, next: NextFunction) => {
  const authHeader = request.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) return response.status(status.UNAUTHORISED).json(response_UNAUTHORISED);
  const vars = getEnvVars().auth;
  const token = authHeader.split(" ")[1];
  if (token !== vars.token) return response.status(status.UNAUTHORISED).json(response_UNAUTHORISED);
  next();
};
