import getUserById from "./getUserById";
import Model from "../../../models/User.model";
import mongoose, { isValidObjectId } from "mongoose";
import removeCompanyUser from "../companies/removeCompanyUser";
import { BAD, NO_CONTENT, SERVER_ERROR } from "../../../globals";

export default async (_id: string): Promise<ApiResponse> => {
  const _id_validation = isValidObjectId(_id);
  if (!_id_validation) return { ...BAD, message: "Invalid _id" };

  try {
    const user = await getUserById(_id, { fields: ["company_id"] });
    if (user.error) return user;
    if (user.data.company_id) await removeCompanyUser(user.data.company_id, _id);

    const object_id = new mongoose.Types.ObjectId(_id);
    const deleted_doc = await Model.findByIdAndDelete(object_id).exec();
    if (!deleted_doc) throw new Error("User not deleted");

    return NO_CONTENT;
  } catch (err: any) {
    //TODO: handle error
    return { ...SERVER_ERROR, data: err };
  }
};
