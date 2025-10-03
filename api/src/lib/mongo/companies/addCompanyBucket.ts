import getCompanyById from "./getCompanyById";
import updateCompanyById from "./updateCompanyById";
import { response_SERVER_ERROR } from "../../../globals";

export default async (_id: string, bucketId: string): Promise<ApiResponse> => {
  try {
    const company = await getCompanyById(_id, { fields: ["bucketIds"] });
    if (company.error) return company;
    const update = { bucketIds: [...company.data.bucketIds, bucketId] };
    const updatedCompany = await updateCompanyById({ _id, update, options: { fields: ["bucketIds"] } });
    return updatedCompany;
  } catch (err: any) {
    return { ...response_SERVER_ERROR, data: err };
  }
};
