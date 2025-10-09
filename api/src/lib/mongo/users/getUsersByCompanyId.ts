import logError from "../../logError";
import { isValidObjectId } from "mongoose";
import Model from "../../../models/User.model";
import applyMongoFilters from "../applyMongoFilters";
import { BAD, NO_CONTENT, OK, SERVER_ERROR } from "../../../globals";

export default async (company_id: string, filters?: Partial<ApiRequestFilters>): Promise<ApiResponse> => {
  const company_id_validation = isValidObjectId(company_id);
  if (!company_id_validation) return { ...BAD, message: "Invalid company_id" };

  try {
    const query = Model.find({ company_id });
    const data = await applyMongoFilters(query, filters).lean();
    if (data.length === 0) return NO_CONTENT;

    const collection_count = await Model.countDocuments({ company_id });

    return { ...OK, data, meta: { collection_count } };
  } catch (err: any) {
    logError({ ...SERVER_ERROR, message: err.message });
    return { ...SERVER_ERROR, data: err };
  }
};
