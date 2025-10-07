// import { Metadata } from "next";
import { notFound } from "next/navigation";
import { header_external } from "@/globals";
import CompanyEditPage from "@/pages/Companies/edit";
// import { default_404_metadata, site_name } from "@/globals";

// export const generateMetadata = async ({ params }: { params: Params }): Promise<Metadata> => {
//   const { _id } = await params;
//   try {
//     const response = await getCompanyById(_id);
//     if (response.error) return default_404_metadata;
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
    const res = await fetch(`${process.env.API_ENDPOINT}/v1/companies`, {
      method: "POST",
      headers: header_external,
    }).then((res) => res.json());
    if (res.error) return [];
    const data = res.data.map((i: Partial<Company>) => ({ _id: i._id }));
    return data;
  } catch (err: any) {
    console.error(err);
    return [];
  }
};

const Page = async ({ params }: { params: { _id: string } }): Promise<React.JSX.Element> => {
  const populate = ["user_ids", "bucket_ids"];
  const fields = ["name", "user_ids", "bucket_ids"];
  const filters = { fields, populate };
  try {
    const { _id } = params;
    const res = await fetch(`${process.env.API_ENDPOINT}/v1/companies/by-id`, {
      method: "POST",
      headers: header_external,
      body: JSON.stringify({ _id, filters }),
    }).then((r) => r.json());
    if (res.error) return notFound();
    return <CompanyEditPage data={res.data} />;
  } catch (err: any) {
    console.error(err);
    return notFound();
  }
};
export default Page;
