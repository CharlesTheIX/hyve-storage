import getUserById from "./getUserById";
import Model from "../../../models/User.model";
import mongoose, { isValidObjectId } from "mongoose";
import applyMongoFilters from "../applyMongoFilters";
import addCompanyUser from "../companies/addCompanyUser";
import getCompanyById from "../companies/getCompanyById";
import removeCompanyUser from "../companies/removeCompanyUser";
import { BAD, NO_CONTENT, SERVER_ERROR } from "../../../globals";

type Props = {
  _id: string;
  update: Partial<User>;
  filters?: Partial<ApiRequestFilters>;
};

export default async (props: Props): Promise<ApiResponse> => {
  const { _id, update, filters } = props;
  const _id_validation = isValidObjectId(_id);
  if (!_id_validation) return { ...BAD, message: "Invalid _id" };

  const company_id_validation = isValidObjectId(update.company_id);
  if (update.company_id && !company_id_validation) return { ...BAD, message: "Invalid company_id" };

  try {
    const existing_doc = await getUserById(_id);
    if (existing_doc.error) return existing_doc;

    if (update.company_id) {
      const existing_company = await getCompanyById(update.company_id);
      if (!existing_company.data) return existing_company;
    }

    const object_id = new mongoose.Types.ObjectId(_id);
    const query: any = { $set: { updatedAt: new Date() }, $unset: {} };

    if (update.surname) query.$set.surname = update.surname;
    if (update.first_name) query.$set.first_name = update.first_name;
    if (update.permissions) query.$set.permissions = update.permissions;

    if (update.company_id === "") query.$unset.company_id = 1;
    else query.$set.company_id = update.company_id;

    const updated_doc = await applyMongoFilters(Model.findByIdAndUpdate(object_id, query, { new: true }), filters)
      .lean()
      .exec();
    if (!updated_doc) throw new Error("User not updated");

    if (update.company_id === "") await removeCompanyUser(update.company_id, _id);
    else if (update.company_id) await addCompanyUser(update.company_id, _id);

    return NO_CONTENT;
  } catch (err: any) {
    //TODO: handle error
    return { ...SERVER_ERROR, data: err };
  }
};
