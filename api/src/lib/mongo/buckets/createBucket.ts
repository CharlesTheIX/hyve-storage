import bucketExists from "./getBucketExists";
import { isValidObjectId } from "mongoose";
import Model from "../../../models/Bucket.model";
import createBucket from "../../minio/createBucket";
import { isValidBucketName } from "../../validation";
import minioBucketExists from "../../minio/bucketExists";
import addCompanyBucket from "../companies/addCompanyBucket";
import { BAD, CONFLICT, DB_UPDATED, OK, SERVER_ERROR } from "../../../globals";

export default async (data: Partial<Bucket>): Promise<ApiResponse> => {
  const { name, max_size_bytes, company_id, permissions = [] } = data;
  const validation = isValidBucketName(name || "");
  if (validation.error) return { ...BAD, message: validation.message };

  const company_id_validation = isValidObjectId(company_id);
  if (!company_id_validation) return { ...BAD, message: "Invalid company_id" };

  try {
    const existing_doc = await bucketExists(name || "");
    if (existing_doc.error) return existing_doc;
    if (existing_doc.status === OK.status) return { ...CONFLICT, message: "Bucket name already exists" };

    const existing_bucket = await minioBucketExists(name || "");
    if (existing_bucket.error) return existing_bucket;
    if (existing_bucket.status === OK.status) return { ...CONFLICT, message: "Bucket name already exists" };

    const new_bucket = await createBucket(name || "");
    if (new_bucket.error) return new_bucket;

    const new_doc = new Model({ name, max_size_bytes, company_id, permissions });
    if (!new_doc) throw new Error("Bucket not created");

    const created_doc = await new_doc.save();
    if (!created_doc) throw new Error("Bucket not created");

    const bucket_id = created_doc._id.toString();
    await addCompanyBucket(company_id || "", bucket_id);

    return DB_UPDATED;
  } catch (err: any) {
    //TODO: handle errors
    return { ...SERVER_ERROR, data: err };
  }
};
