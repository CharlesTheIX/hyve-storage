import getCompanyById from "./getCompanyById";
import updateCompanyById from "./updateCompanyById";
import { response_SERVER_ERROR } from "../../../globals";

export default async (_id: string, userId: string): Promise<ApiResponse> => {
  try {
    const company = await getCompanyById(_id, { fields: ["userIds"] });
    if (company.error) return company;
    const filteredUsers = company.data.userIds.filter((item: string) => item !== userId);
    const update = { userIds: filteredUsers };
    const updatedCompany = await updateCompanyById({ _id, update, options: { fields: ["userIds"] } });
    return updatedCompany;
  } catch (err: any) {
    return { ...response_SERVER_ERROR, data: err };
  }
};
