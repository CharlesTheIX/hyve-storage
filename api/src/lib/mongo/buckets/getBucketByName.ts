import Model from "../../../models/Bucket.model";
import applyPopulation from "../applyPopulation";
import getSelectionFields from "../getSelectionFields";
import { response_BAD, response_OK, response_SERVER_ERROR } from "../../../globals";

export default async (name: string, options?: Partial<ApiRequestOptions>): Promise<ApiResponse> => {
  try {
    const fields = getSelectionFields(options?.fields);
    const query = Model.findOne({ name }).select(fields);
    const doc = await applyPopulation(query, options?.populate).lean();
    if (!doc) return { ...response_BAD, message: `No bucket found with an name of ${name}` };
    return { ...response_OK, data: doc };
  } catch (err: any) {
    return { ...response_SERVER_ERROR, message: err.message };
  }
};
