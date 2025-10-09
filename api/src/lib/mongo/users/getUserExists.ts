import logError from "../../logError";
import Model from "../../../models/User.model";
import { isValidUsername } from "../../validation";
import { BAD, NO_CONTENT, OK, SERVER_ERROR } from "../../../globals";

export default async (username: string): Promise<ApiResponse> => {
  const validation = isValidUsername(username);
  if (validation.error) return { ...BAD, message: validation.message };

  try {
    const data = !!(await Model.findOne({ username }).select({ _id: 1 }).lean().exec());
    if (!data) return NO_CONTENT;

    return { ...OK, data };
  } catch (err: any) {
    logError({ ...SERVER_ERROR, message: err.message });
    return { ...SERVER_ERROR, data: err };
  }
};
