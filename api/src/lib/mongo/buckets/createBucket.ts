import bucketExists from "./bucketExists";
import Model from "../../../models/Bucket.model";
import createBucket from "../../minio/createBucket";
import getMinioClient from "../../minio/getMinioClient";
import minioBucketExists from "../../minio/bucketExists";
import addCompanyBucket from "../companies/addCompanyBucket";
import { response_BAD, response_DB_UPDATED, response_SERVER_ERROR } from "../../../globals";

export default async (data: Partial<Bucket>): Promise<ApiResponse> => {
  const { name, maxSize_bytes, companyId, permissions = [] } = data;
  if (!name) return { ...response_BAD, message: "name required" };
  if (!companyId) return { ...response_BAD, message: "companyId required" };
  if (!maxSize_bytes) return { ...response_BAD, message: "maxSize_bytes required" };

  try {
    const existingDoc = await bucketExists(name);
    if (existingDoc.data) return { ...response_BAD, message: `Bucket ${name} already exists` };

    const client = getMinioClient();
    const existingBucket = await minioBucketExists(client, name);
    if (existingBucket.data) return { ...response_BAD, message: `Bucket ${name} already exists` };

    const newBucket = await createBucket({ client, name, options: {} });
    if (newBucket.error) return newBucket;

    const newDoc = new Model({ name, maxSize_bytes, companyId, permissions });
    if (!newDoc) return { ...response_BAD, message: "Bucket not created" };

    const createdDoc = await newDoc.save();
    if (!createdDoc) return { ...response_BAD, message: "Bucket not created" };

    const bucketId = createdDoc._id.toString();
    const companyUpdated = await addCompanyBucket(companyId, bucketId);
    if (companyUpdated.error) return companyUpdated;

    return { ...response_DB_UPDATED };
  } catch (err: any) {
    return { ...response_SERVER_ERROR, message: err.message };
  }
};
