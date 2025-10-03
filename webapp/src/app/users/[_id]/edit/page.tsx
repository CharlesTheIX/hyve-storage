import { Metadata } from "next";
import getUsers from "@/lib/getUsers";
import { notFound } from "next/navigation";
import getUserById from "@/lib/getUserById";
import UserEditPage from "@/pages/Users/edit";

type Params = Promise<{ _id: string }>;

export const generateMetadata = async ({ params }: { params: Params }): Promise<Metadata> => {
  const { _id } = await params;
  const fields = ["_id"];
  const options = { fields };
  try {
    const response = await getUserById(_id, options);
    if (response.error) throw new Error();
    return {
      title: `${response.data._id} | Edit`,
      description: `Some description here.`,
    };
  } catch (error: any) {
    return {
      title: "404",
      robots: "noindex, nofollow",
      description: "Country not found",
    };
  }
};

export const generateStaticParams = async (): Promise<{ _id: string }[]> => {
  const fields = ["_id"];
  const options = { fields };
  try {
    const response = await getUsers(options);
    if (response.error) throw new Error();
    return response.data.map((user: Partial<User>) => {
      return { _id: user._id };
    });
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
