import userExists from "./userExists";
import Model from "../../../models/User.model";
import addCompanyUser from "../companies/addCompanyUser";
import { response_BAD, response_DB_UPDATED, response_SERVER_ERROR } from "../../../globals";

export default async (data: Partial<User>): Promise<ApiResponse> => {
  const { username, permissions = 0, companyId, firstName, surname } = data;
  if (!surname) return { ...response_BAD, message: "A surname is required" };
  if (!username) return { ...response_BAD, message: "A username is required" };
  if (!firstName) return { ...response_BAD, message: "A first name is required" };

  try {
    const existingDoc = await userExists(username);
    if (existingDoc.data) return { ...response_BAD, message: `A User with username ${username} already exists` };

    const newDoc = new Model({ username, permissions, companyId: companyId || undefined, firstName, surname });
    if (!newDoc) return { ...response_BAD, message: "User could not be created" };

    const createdDoc = await newDoc.save();
    if (!createdDoc) return { ...response_BAD, message: "User could not be created" };

    if (companyId) {
      const companyUpdated = await addCompanyUser(companyId, createdDoc._id.toString());
      if (companyUpdated.error) return companyUpdated;
    }

    return { ...response_DB_UPDATED };
  } catch (err: any) {
    return { ...response_SERVER_ERROR, data: err };
  }
};
