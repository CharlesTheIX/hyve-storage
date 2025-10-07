import Model from "../../../models/Bucket.model";
import applyMongoFilters from "../applyMongoFilters";
import { NO_CONTENT, OK, SERVER_ERROR } from "../../../globals";

export default async (filters?: Partial<ApiRequestFilters>): Promise<ApiResponse> => {
  try {
    const query = Model.find();
    const data = await applyMongoFilters(query, filters).lean().exec();
    if (data.length === 0) return NO_CONTENT;

    const collection_count = await Model.countDocuments();

    return { ...OK, data, meta: { collection_count } };
  } catch (err: any) {
    //TODO: handle errors
    return { ...SERVER_ERROR, data: err };
  }
};
