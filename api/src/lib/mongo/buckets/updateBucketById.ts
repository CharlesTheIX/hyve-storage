import getBucketById from "./getBucketById";
import Model from "../../../models/Bucket.model";
import mongoose, { isValidObjectId } from "mongoose";
import getCompanyById from "../companies/getCompanyById";
import { BAD, NO_CONTENT, SERVER_ERROR } from "../../../globals";

type Props = {
  _id: string;
  update: Partial<Bucket>;
  filters?: Partial<ApiRequestFilters>;
};

export default async (props: Props): Promise<ApiResponse> => {
  const { _id, update, filters } = props;
  const validation = isValidObjectId(_id);
  if (!validation) return { ...BAD, message: "Invalid _id" };

  const company_id_validation = isValidObjectId(update.company_id);
  if (update.company_id && !company_id_validation) return { ...BAD, message: "Invalid company_id" };

  try {
    const existing_doc = await getBucketById(_id);
    if (existing_doc.error) return existing_doc;

    if (update.company_id) {
      const existing_company = await getCompanyById(update.company_id);
      if (!existing_company.data) return existing_company;
    }

    const object_id = new mongoose.Types.ObjectId(_id);
    const query: any = { $set: { updatedAt: new Date() }, $unset: {} };

    if (update.permissions) query.$set.permissions = update.permissions;
    if (update.object_count) query.$set.object_count = update.object_count;
    if (update.max_size_bytes) query.$set.max_size_bytes = update.max_size_bytes;
    if (update.consumption_bytes) query.$set.consumption_bytes = update.consumption_bytes;

    const updated_doc = await Model.findByIdAndUpdate(object_id, query).exec();
    if (!updated_doc) throw new Error("Bucket not updated");

    return NO_CONTENT;
  } catch (err: any) {
    //TODO: handle errors
    return { ...SERVER_ERROR, data: err };
  }
};
