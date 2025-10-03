import { Metadata } from "next";
import getUsers from "@/lib/getUsers";
import { notFound } from "next/navigation";
import UserPage from "@/pages/Users/single";
import getUserById from "@/lib/getUserById";

type Params = Promise<{ _id: string }>;

export const generateMetadata = async ({ params }: { params: Params }): Promise<Metadata> => {
  const { _id } = await params;
  const fields = ["_id"];
  const options = { fields };
  try {
    const response = await getUserById(_id, options);
    if (response.error) throw new Error();
    return {
      title: `${response.data._id} | Users`,
      description: `Some description here.`,
    };
  } catch (error: any) {
    return {
      title: "404",
      robots: "noindex, nofollow",
      description: "User not found",
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
  const fields = ["permissions", "username", "firstName", "surname", "createdAt", "updatedAt", "companyId"];
  const options = { fields, populate };
  try {
    const { _id } = await params;
    const response = await getUserById(_id, options);
    if (response.error) return notFound();
    return <UserPage data={response.data} />;
  } catch (error: any) {
    notFound();
  }
};
export default Page;
