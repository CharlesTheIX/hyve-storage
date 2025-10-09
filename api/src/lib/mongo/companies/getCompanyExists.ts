import logError from "../../logError";
import Model from "../../../models/Company.model";
import { isValidCompanyName } from "../../validation";
import { BAD, NO_CONTENT, OK, SERVER_ERROR } from "../../../globals";

export default async (name: string): Promise<ApiResponse> => {
  const validation = isValidCompanyName(name);
  if (validation.error) return { ...BAD, message: validation.message };

  try {
    const data = !!(await Model.findOne({ name }).select({ _id: 1 }).lean().exec());
    if (!data) return NO_CONTENT;

    return { ...OK, data };
  } catch (err: any) {
    logError({ ...SERVER_ERROR, message: err.message });
    return { ...SERVER_ERROR, data: err };
  }
};
