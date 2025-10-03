import Model from "../../../models/Bucket.model";
import { response_OK, response_SERVER_ERROR } from "../../../globals";

export default async (name: string): Promise<ApiResponse> => {
  try {
    const doc = await Model.findOne({ name }).select({ _id: 1 }).lean();
    return { ...response_OK, data: !!doc };
  } catch (err: any) {
    return { ...response_SERVER_ERROR, data: err };
  }
};
