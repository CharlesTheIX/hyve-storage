import mongoose from "mongoose";
import getUserById from "./getUserById";
import Model from "../../../models/User.model";
import companyExists from "../companies/companyExists";
import { response_BAD, response_DB_UPDATED, response_SERVER_ERROR } from "../../../globals";

type Props = {
  _id: string;
  update: Partial<User>;
  options?: Partial<ApiRequestOptions>;
};

export default async (props: Props): Promise<ApiResponse> => {
  const { _id, update, options } = props;

  try {
    const existingDoc = await getUserById(_id, { fields: ["surname", "firstName"] });
    if (existingDoc.error) return { ...response_BAD, message: "User not found" };

    if (update.companyId) {
      const existingCompany = await companyExists(update.companyId);
      if (!existingCompany.data) return { ...response_BAD, message: `Company does not exist` };
    }

    const objectId = new mongoose.Types.ObjectId(_id);
    const docUpdate: Partial<User> = {
      updatedAt: new Date(),
      surname: update.surname || existingDoc.data.surname,
      // username: update.username || existingDoc.data.username,
      firstName: update.firstName || existingDoc.data.firstName,
      // companyId: update.companyId || existingDoc.data.companyId,
      // permissions: update.permissions || existingDoc.data.permissions,
    };

    const updatedDoc = await Model.updateOne({ _id: objectId }, docUpdate);
    if (!updatedDoc || updatedDoc?.modifiedCount === 0) return { ...response_BAD, message: "User not updated" };

    const response = await getUserById(_id, options);
    return { ...response_DB_UPDATED, data: response.data };
  } catch (err: any) {
    return { ...response_SERVER_ERROR, message: err.message };
  }
};
