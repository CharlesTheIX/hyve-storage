// import { Metadata } from "next";
import { notFound } from "next/navigation";
import { header_external } from "@/globals";
import UserEditPage from "@/pages/Users/edit";
// import { default_404_metadata, site_name } from "@/globals";

type Params = Promise<{ _id: string }>;

// export const generateMetadata = async ({ params }: { params: Params }): Promise<Metadata> => {
//   const { _id } = await params;
//   try {
//     const response = await getUserById(_id);
//     if (response.error) default_404_metadata;
//     return {
//       title: `${response.data._id} | Edit | ${site_name}`,
//       //TODO
//       description: `Some description here.`,
//     };
//   } catch (error: any) {
//     return default_404_metadata;
//   }
// };

export const generateStaticParams = async (): Promise<{ _id: string }[]> => {
  try {
    const res = await fetch(`${process.env.API_ENDPOINT}/v1/users`, {
      method: "POST",
      headers: header_external,
    }).then((res) => res.json());
    if (res.error) return [];
    const data = res.data.map((i: Partial<User>) => ({ _id: i._id }));
    return data;
  } catch (err: any) {
    console.error(err);
    return [];
  }
};

const Page = async ({ params }: { params: Params }): Promise<React.JSX.Element> => {
  const populate = ["company_id"];
  const fields = ["permissions", "username", "first_name", "surname", "company_id"];
  const filters = { fields, populate };
  try {
    const { _id } = await params;
    const res = await fetch(`${process.env.API_ENDPOINT}/v1/users/by-id`, {
      method: "POST",
      headers: header_external,
      body: JSON.stringify({ _id, filters }),
    }).then((r) => r.json());
    if (res.error) return notFound();
    return <UserEditPage data={res.data} />;
  } catch (err: any) {
    console.error(err);
    return notFound();
  }
};
export default Page;
