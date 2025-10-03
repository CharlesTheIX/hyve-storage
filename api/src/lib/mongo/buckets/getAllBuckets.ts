import Model from "../../../models/Bucket.model";
import applyPopulation from "../applyPopulation";
import getSelectionFields from "../getSelectionFields";
import { response_OK, response_SERVER_ERROR } from "../../../globals";

export default async (options?: Partial<ApiRequestOptions>): Promise<ApiResponse> => {
  try {
    const fields = getSelectionFields(options?.fields);
    const query = Model.find().select(fields);
    const docs = await applyPopulation(query, options?.populate).lean();
    return { ...response_OK, data: docs };
  } catch (err: any) {
    return { ...response_SERVER_ERROR, message: err.message };
  }
};
