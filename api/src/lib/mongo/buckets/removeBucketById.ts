import mongoose from "mongoose";
import getBucketById from "./getBucketById";
import Model from "../../../models/Bucket.model";
import removeBucket from "../../minio/removeBucket";
import getMinioClient from "../../minio/getMinioClient";
import removeCompanyBucket from "../companies/removeCompanyBucket";
import { response_BAD, response_DB_UPDATED, response_SERVER_ERROR } from "../../../globals";

export default async (_id: string): Promise<ApiResponse> => {
  try {
    const bucket = await getBucketById(_id, { fields: ["name", "companyId"] });
    if (bucket.error) return bucket;

    const client = getMinioClient();
    const removedBucket = await removeBucket({ client, name: bucket.data.name });
    if (removedBucket.error) return removedBucket;

    const objectId = new mongoose.Types.ObjectId(_id);
    const deletedDoc = await Model.deleteOne({ _id: objectId });
    if (!deletedDoc) return { ...response_BAD, message: "Bucket not deleted" };

    const companyUpdated = await removeCompanyBucket(bucket.data.companyId, bucket.data.name);
    if (companyUpdated.error) return companyUpdated;

    return { ...response_DB_UPDATED };
  } catch (err: any) {
    return { ...response_SERVER_ERROR, message: err.message };
  }
};
