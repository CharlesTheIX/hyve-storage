import mongoose from "mongoose";
import getCompanyById from "./getCompanyById";
import Model from "../../../models/Company.model";
import { response_BAD, response_DB_UPDATED, response_SERVER_ERROR } from "../../../globals";

export default async (_id: string): Promise<ApiResponse> => {
  try {
    const company = await getCompanyById(_id, { fields: ["_id"] });
    if (company.error) return company;

    const objectId = new mongoose.Types.ObjectId(_id);
    const deletedDoc = await Model.deleteOne({ _id: objectId });
    if (!deletedDoc) return { ...response_BAD, message: "Company not deleted" };
    return { ...response_DB_UPDATED };
  } catch (err: any) {
    return { ...response_SERVER_ERROR, message: err.message };
  }
};
