import companyExists from "./companyExists";
import Model from "../../../models/Company.model";
import { response_BAD, response_DB_UPDATED, response_SERVER_ERROR } from "../../../globals";

export default async (data: Partial<Company>): Promise<ApiResponse> => {
  const { name, userIds = [] } = data;
  if (!name) return { ...response_BAD, message: "name required" };

  try {
    const existingDoc = await companyExists(name);
    if (existingDoc.data) return { ...response_BAD, message: `Company ${name} already exists` };

    const newDoc = new Model({ name, userIds });
    if (!newDoc) return { ...response_BAD, message: "Company not created" };

    const createdDoc = await newDoc.save();
    if (!createdDoc) return { ...response_BAD, message: "Company not created" };
    return { ...response_DB_UPDATED };
  } catch (err: any) {
    return { ...response_SERVER_ERROR, data: err };
  }
};
