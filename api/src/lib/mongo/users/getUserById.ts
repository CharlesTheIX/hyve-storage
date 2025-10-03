import mongoose from "mongoose";
import Model from "../../../models/User.model";
import applyPopulation from "../applyPopulation";
import getSelectionFields from "../getSelectionFields";
import { response_BAD, response_OK, response_SERVER_ERROR } from "../../../globals";

export default async (_id: string, options?: Partial<ApiRequestOptions>): Promise<ApiResponse> => {
  try {
    const objectId = new mongoose.Types.ObjectId(_id);
    const fields = getSelectionFields(options?.fields);
    const query = Model.findById(objectId).select(fields);
    const doc = await applyPopulation(query, options?.populate).lean();
    if (!doc) return { ...response_BAD, message: `No user found with an _id of ${_id}` };
    return { ...response_OK, data: doc };
  } catch (err: any) {
    return { ...response_SERVER_ERROR, message: err.message };
  }
};
