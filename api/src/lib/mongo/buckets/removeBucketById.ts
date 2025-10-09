import logError from "../../logError";
import getBucketById from "./getBucketById";
import Model from "../../../models/Bucket.model";
import removeBucket from "../../minio/removeBucket";
import mongoose, { isValidObjectId } from "mongoose";
import { BAD, NO_CONTENT, SERVER_ERROR } from "../../../globals";
import removeCompanyBucket from "../companies/removeCompanyBucket";

export default async (_id: string): Promise<ApiResponse> => {
  const validation = isValidObjectId(_id);
  if (!validation) return { ...BAD, message: "Invalid _id" };

  try {
    const bucket = await getBucketById(_id);
    if (bucket.error) return bucket;

    const company_updated = await removeCompanyBucket(bucket.data.company_id, bucket.data.name);
    if (company_updated.error) return company_updated;

    const object_id = new mongoose.Types.ObjectId(_id);
    const deleted_doc = await Model.findByIdAndDelete(object_id).exec();
    if (!deleted_doc) throw new Error("Bucket not deleted");

    await removeBucket(bucket.data.name);

    return NO_CONTENT;
  } catch (err: any) {
    logError({ ...SERVER_ERROR, message: err.message });
    return { ...SERVER_ERROR, data: err };
  }
};
