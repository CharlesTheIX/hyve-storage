import Model from "../../../models/Bucket.model";
import applyMongoFilters from "../applyMongoFilters";
import { NOT_FOUND, OK, SERVER_ERROR } from "../../../globals";

export default async (name: string, filters?: Partial<ApiRequestFilters>): Promise<ApiResponse> => {
  try {
    const query = Model.findOne({ name });
    const data = await applyMongoFilters(query, filters).lean().exec();
    if (!data) return NOT_FOUND;

    return { ...OK, data };
  } catch (err: any) {
    //TODO: handle errors
    return { ...SERVER_ERROR, data: err };
  }
};
