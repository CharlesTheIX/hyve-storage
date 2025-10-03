import userExists from "./userExists";
import Model from "../../../models/User.model";
import addCompanyUser from "../companies/addCompanyUser";
import { response_BAD, response_DB_UPDATED, response_SERVER_ERROR } from "../../../globals";

export default async (data: Partial<User>): Promise<ApiResponse> => {
  const { username, permissions = 0, companyId, firstName, surname } = data;
  if (!surname) return { ...response_BAD, message: "surname required" };
  if (!username) return { ...response_BAD, message: "username required" };
  if (!firstName) return { ...response_BAD, message: "firstName required" };
  if (!companyId) return { ...response_BAD, message: "companyId required" };

  try {
    const existingDoc = await userExists(username);
    if (existingDoc.data) return { ...response_BAD, message: `User ${username} already exists` };

    const newDoc = new Model({ username, permissions, companyId, firstName, surname });
    if (!newDoc) return { ...response_BAD, message: "User not created" };

    const createdDoc = await newDoc.save();
    if (!createdDoc) return { ...response_BAD, message: "User not created" };

    const companyUpdated = await addCompanyUser(companyId, createdDoc._id.toString());
    if (companyUpdated.error) return companyUpdated;
    return { ...response_DB_UPDATED };
  } catch (err: any) {
    return { ...response_SERVER_ERROR, data: err };
  }
};
