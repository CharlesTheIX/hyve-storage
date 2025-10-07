import mongoose from "mongoose";
import getCompanyById from "./getCompanyById";
import Model from "../../../models/Company.model";
import applyMongoFilters from "../applyMongoFilters";
import { NO_CONTENT, SERVER_ERROR } from "../../../globals";

type Props = {
  _id: string;
  update: Partial<Company>;
  filters?: Partial<ApiRequestFilters>;
};

export default async (props: Props): Promise<ApiResponse> => {
  const { _id, update, filters } = props;

  try {
    const existing_doc = await getCompanyById(_id);
    if (existing_doc.error) return existing_doc;

    const object_id = new mongoose.Types.ObjectId(_id);
    const query: any = { $set: { updatedAt: new Date() }, $unset: {} };
    const updated_doc = await applyMongoFilters(Model.findByIdAndUpdate(object_id, query, { new: true }), filters)
      .lean()
      .exec();
    if (!updated_doc) throw new Error("Company not updated");

    return NO_CONTENT;
  } catch (err: any) {
    //TODO: handle errors
    return { ...SERVER_ERROR, data: err };
  }
};
