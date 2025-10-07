import getCompanyById from "./getCompanyById";
import Model from "../../../models/Company.model";
import mongoose, { isValidObjectId } from "mongoose";
import updateUserById from "../users/updateUserById";
import { BAD, NO_CONTENT, SERVER_ERROR } from "../../../globals";

export default async (_id: string): Promise<ApiResponse> => {
  const _id_validation = isValidObjectId(_id);
  if (!_id_validation) return { ...BAD, message: "Invalid _id" };

  try {
    const company = await getCompanyById(_id, { populate: ["user_ids", "bucket_ids"] });
    if (company.error) return company;
    if (company.data.bucket_ids.length > 0) return { ...BAD, message: "Company cannot be removed whilst with active buckets" };

    const object_id = new mongoose.Types.ObjectId(_id);
    const deleted_doc = await Model.findByIdAndDelete(object_id).exec();
    if (!deleted_doc) throw new Error("Company not deleted");

    await Promise.all(company.data.user_ids.map((i: string) => updateUserById({ _id: i, update: { company_id: "" } })));

    return NO_CONTENT;
  } catch (err: any) {
    //TODO: handle errors
    return { ...SERVER_ERROR, data: err };
  }
};
