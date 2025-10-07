import { isValidObjectId } from "mongoose";
import getCompanyById from "./getCompanyById";
import Model from "../../../models/User.model";
import { SERVER_ERROR, OK, NO_CONTENT, BAD } from "../../../globals";

export default async (_id: string, user_id: string): Promise<ApiResponse> => {
  const _id_validation = isValidObjectId(_id);
  if (!_id_validation) return { ...BAD, message: "Invalid _id" };

  const user_id_validation = isValidObjectId(user_id);
  if (!user_id_validation) return { ...BAD, message: "Invalid user_id" };

  try {
    const user = await getCompanyById(_id);
    if (user.error) return user;
    if (user.data.user_ids.includes(user_id)) return OK;

    const query = { $push: { user_ids: user_id } };
    const update = await Model.findByIdAndUpdate(_id, query).exec();
    if (!update) throw new Error("Could not add user to company");

    return NO_CONTENT;
  } catch (err: any) {
    //TODO: handle errors
    return { ...SERVER_ERROR, data: err };
  }
};
