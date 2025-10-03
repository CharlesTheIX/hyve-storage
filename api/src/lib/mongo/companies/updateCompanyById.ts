import mongoose from "mongoose";
import getCompanyById from "./getCompanyById";
import Model from "../../../models/Company.model";
import { response_BAD, response_DB_UPDATED, response_SERVER_ERROR } from "../../../globals";

type Props = {
  _id: string;
  update: Partial<Company>;
  options?: Partial<ApiRequestOptions>;
};

export default async (props: Props): Promise<ApiResponse> => {
  const { _id, update, options } = props;

  try {
    const existingDoc = await getCompanyById(_id, { fields: ["userIds", "name", "bucketIds"] });
    if (existingDoc.error) return { ...response_BAD, message: "Company not found" };

    const objectId = new mongoose.Types.ObjectId(_id);
    const docUpdate: Partial<Company> = {
      updatedAt: new Date(),
      name: update.name || existingDoc.data.name,
      userIds: update.userIds || existingDoc.data.userIds,
      bucketIds: update.bucketIds || existingDoc.data.bucketIds,
    };
    if (docUpdate.userIds && docUpdate.userIds.length <= 0) return { ...response_BAD, message: "A company must have at least one user." };

    const updatedDoc = await Model.updateOne({ _id: objectId }, docUpdate);
    if (!updatedDoc || updatedDoc?.modifiedCount === 0) return { ...response_BAD, message: "Company not updated" };

    const response = await getCompanyById(_id, options);
    return { ...response_DB_UPDATED, data: response.data };
  } catch (err: any) {
    return { ...response_SERVER_ERROR, message: err.message };
  }
};
