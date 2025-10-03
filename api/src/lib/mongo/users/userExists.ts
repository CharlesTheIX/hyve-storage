import Model from "../../../models/User.model";
import { response_OK, response_SERVER_ERROR } from "../../../globals";

export default async (username: string): Promise<ApiResponse> => {
  try {
    const doc = await Model.findOne({ username }).select({ _id: 1 }).lean();
    const message = `User ${username} ${!!doc ? "already exists" : "does not exists"}`;
    return { ...response_OK, data: !!doc, message };
  } catch (err: any) {
    return { ...response_SERVER_ERROR, data: err };
  }
};
