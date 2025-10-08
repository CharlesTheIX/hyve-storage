import getEnvVars from "../getEnvVars";
import { UNAUTHORISED } from "../../globals";
import { Request, Response, NextFunction } from "express";

export default (request: Request, response: Response, next: NextFunction) => {
  const auth_header = request.headers["authorization"];
  if (!auth_header || !auth_header.startsWith("Bearer ")) return response.json(UNAUTHORISED);

  const vars = getEnvVars().auth;
  const token = auth_header.split(" ")[1];
  if (token !== vars.token) return response.json(UNAUTHORISED);

  next();
};
