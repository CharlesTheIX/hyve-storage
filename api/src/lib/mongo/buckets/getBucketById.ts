import mongoose from "mongoose";
import logError from "../../logError";
import Model from "../../../models/Bucket.model";
import applyMongoFilters from "../applyMongoFilters";
import { NOT_FOUND, OK, SERVER_ERROR } from "../../../globals";

export default async (_id: string, filters?: Partial<ApiRequestFilters>): Promise<ApiResponse> => {
  try {
    const object_id = new mongoose.Types.ObjectId(_id);
    const query = Model.findById(object_id);
    const data = await applyMongoFilters(query, filters).lean().exec();
    if (!data) return NOT_FOUND;

    return { ...OK, data };
  } catch (err: any) {
    logError({ ...SERVER_ERROR, message: err.message });
    return { ...SERVER_ERROR, data: err };
  }
};
