import mongoose from "mongoose";
import getUserById from "./getUserById";
import Model from "../../../models/User.model";
import removeCompanyUser from "../companies/removeCompanyUser";
import { response_BAD, response_DB_UPDATED, response_SERVER_ERROR } from "../../../globals";

export default async (_id: string): Promise<ApiResponse> => {
  try {
    const user = await getUserById(_id, { fields: ["companyId"] });
    if (user.error) return user;

    const objectId = new mongoose.Types.ObjectId(_id);
    const deletedDoc = await Model.deleteOne({ _id: objectId });
    if (!deletedDoc) return { ...response_BAD, message: "User not deleted" };

    const companyUpdated = await removeCompanyUser(user.data.companyId, _id);
    if (companyUpdated.error) return companyUpdated;
    return { ...response_DB_UPDATED };
  } catch (err: any) {
    return { ...response_SERVER_ERROR, message: err.message };
  }
};
