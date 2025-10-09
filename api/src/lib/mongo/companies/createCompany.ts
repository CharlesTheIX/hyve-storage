import logError from "../../logError";
import { isValidObjectId } from "mongoose";
import companyExists from "./getCompanyExists";
import Model from "../../../models/Company.model";
import updateUserById from "../users/updateUserById";
import { BAD, CONFLICT, DB_UPDATED, OK, SERVER_ERROR } from "../../../globals";

export default async (data: Partial<Company>): Promise<ApiResponse> => {
  const { name, user_ids = [] } = data;
  const valid: SimpleError = { error: false, message: "" };
  user_ids.forEach((i) => {
    if (valid.error) return;
    if (!isValidObjectId(i)) valid.error = true;
  });

  if (valid.error) return { ...BAD, message: "User ids contains and invalid id" };

  try {
    const existing_doc = await companyExists(name || "");
    if (existing_doc.error) return existing_doc;
    if (existing_doc.status === OK.status) return { ...CONFLICT, message: "Company name already exists" };

    const new_doc = new Model({ name, user_ids, bucket_ids: [] });
    if (!new_doc) throw new Error("Company not created");

    const created_doc = await new_doc.save();
    if (!created_doc) throw new Error("Company not created");

    if (user_ids.length > 0) {
      await Promise.all(user_ids.map((i: string) => updateUserById({ _id: i, update: { company_id: new_doc._id.toString() } })));
    }

    return DB_UPDATED;
  } catch (err: any) {
    logError({ ...SERVER_ERROR, message: err.message });
    return { ...SERVER_ERROR, data: err };
  }
};
