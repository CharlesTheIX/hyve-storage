import logError from "../../logError";
import userExists from "./getUserExists";
import { isValidObjectId } from "mongoose";
import Model from "../../../models/User.model";
import addCompanyUser from "../companies/addCompanyUser";
import { BAD, CONFLICT, DB_UPDATED, OK, PARTIAL_UPDATE, SERVER_ERROR } from "../../../globals";

export default async (data: Partial<User>): Promise<ApiResponse> => {
  const { username, permissions, company_id, first_name, surname } = data;
  const company_id_validation = isValidObjectId(company_id);
  if (company_id && !company_id_validation) return { ...BAD, message: "Invalid company_id" };

  try {
    const existing_doc = await userExists(username || "");
    if (existing_doc.error) return existing_doc;
    if (existing_doc.status === OK.status) return { ...CONFLICT, message: "Username already exists" };

    const new_doc = new Model({ username, permissions, company_id: company_id || undefined, first_name, surname });
    if (!new_doc) throw new Error("User could not be created");

    const created_doc = await new_doc.save();
    if (!created_doc) throw new Error("User could not be created");

    var company_update_res = OK;
    if (company_id) company_update_res = await addCompanyUser(company_id, created_doc._id.toString());
    if (company_update_res?.error) {
      logError({ ...PARTIAL_UPDATE, message: `User created, but failed to update company ${company_id} - ${company_update_res.message}` });
    }

    return DB_UPDATED;
  } catch (err: any) {
    logError({ ...SERVER_ERROR, message: err.message });
    return { ...SERVER_ERROR, data: err };
  }
};
