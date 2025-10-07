import Model from "../../../models/User.model";
import mongoose, { isValidObjectId } from "mongoose";
import applyMongoFilters from "../applyMongoFilters";
import { BAD, NOT_FOUND, OK, SERVER_ERROR } from "../../../globals";

export default async (_id: string, filters?: Partial<ApiRequestFilters>): Promise<ApiResponse> => {
  const _id_validation = isValidObjectId(_id);
  if (!_id_validation) return { ...BAD, message: "Invalid _id" };

  try {
    const object_id = new mongoose.Types.ObjectId(_id);
    const query = Model.findById(object_id);
    const data = await applyMongoFilters(query, filters).lean().exec();
    if (!data) return NOT_FOUND;

    return { ...OK, data };
  } catch (err: any) {
    //TODO: handle errors
    return { ...SERVER_ERROR, data: err };
  }
};
