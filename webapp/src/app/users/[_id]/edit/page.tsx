import { Metadata } from "next";
import { notFound } from "next/navigation";
import getUsers from "@/lib/users/getUsers";
import UserEditPage from "@/pages/Users/edit";
import getUserById from "@/lib/users/getUserById";
import { default404Metadata, siteName } from "@/globals";

type Params = Promise<{ _id: string }>;

export const generateMetadata = async ({ params }: { params: Params }): Promise<Metadata> => {
  const { _id } = await params;
  try {
    const response = await getUserById(_id);
    if (response.error) default404Metadata;
    return {
      title: `${response.data._id} | Edit | ${siteName}`,
      //TODO
      description: `Some description here.`,
    };
  } catch (error: any) {
    return default404Metadata;
  }
};

export const generateStaticParams = async (): Promise<{ _id: string }[]> => {
  try {
    const response = await getUsers();
    if (response.error) return [];
    return response.data.map((user: Partial<User>) => ({ _id: user._id }));
  } catch (error: any) {
    return [];
  }
};

const Page = async ({ params }: { params: Params }): Promise<React.JSX.Element> => {
  const populate = ["companyId"];
  const fields = ["permissions", "username", "firstName", "surname", "companyId"];
  const options = { fields, populate };
  try {
    const { _id } = await params;
    const response = await getUserById(_id, options);
    if (response.error) return notFound();
    return <UserEditPage data={response.data} />;
  } catch (error: any) {
    notFound();
  }
};
export default Page;
