import mongoose from "mongoose";
import getBucketById from "./getBucketById";
import Model from "../../../models/Bucket.model";
import companyExists from "../companies/companyExists";
import { response_BAD, response_DB_UPDATED, response_SERVER_ERROR } from "../../../globals";

type Props = {
  _id: string;
  update: Partial<Bucket>;
  options?: Partial<ApiRequestOptions>;
};

export default async (props: Props): Promise<ApiResponse> => {
  const { _id, update, options } = props;

  try {
    const existingDoc = await getBucketById(_id, { fields: ["permissions", "maxSize_bytes", "consumption_bytes"] });
    if (existingDoc.error) return { ...response_BAD, message: "Bucket not found" };

    if (update.companyId) {
      const existingCompany = await companyExists(update.companyId);
      if (!existingCompany.data) return { ...response_BAD, message: `Company does not exist` };
    }

    const objectId = new mongoose.Types.ObjectId(_id);
    const docUpdate: Partial<Bucket> = {
      updatedAt: new Date(),
      // companyId: update.companyId || existingDoc.data.companyId,
      objectCount: update.objectCount || existingDoc.data.objectCount,
      permissions: update.permissions || existingDoc.data.permissions,
      maxSize_bytes: update.maxSize_bytes || existingDoc.data.maxSize_bytes,
      consumption_bytes: update.consumption_bytes || existingDoc.data.consumption_bytes,
    };

    const updatedDoc = await Model.updateOne({ _id: objectId }, docUpdate);
    if (!updatedDoc || updatedDoc?.modifiedCount === 0) return { ...response_BAD, message: "Bucket not updated" };

    const response = await getBucketById(_id, options);
    return { ...response_DB_UPDATED, data: response.data };
  } catch (err: any) {
    return { ...response_SERVER_ERROR, message: err.message };
  }
};
