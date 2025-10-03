import Model from "../../../models/User.model";
import getSelectionFields from "../getSelectionFields";
import { response_BAD, response_OK, response_SERVER_ERROR } from "../../../globals";

export default async (companyId: string, options?: Partial<ApiRequestOptions>): Promise<ApiResponse> => {
  try {
    const fields = getSelectionFields(options?.fields);
    const doc = await Model.find({ companyId }).select(fields).lean();
    if (!doc) return { ...response_BAD, message: `No users found with a company id of ${companyId}` };
    return { ...response_OK, data: doc };
  } catch (err: any) {
    return { ...response_SERVER_ERROR, message: err.message };
  }
};
