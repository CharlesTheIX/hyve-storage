// import { Metadata } from "next";
import { notFound } from "next/navigation";
import { header_external } from "@/globals";
import BucketEditPage from "@/pages/Buckets/edit";
// import { default_404_metadata, site_name } from "@/globals";

type Params = Promise<{ _id: string }>;

// export const generateMetadata = async ({ params }: { params: Promise<Params> }): Promise<Metadata> => {
//   const { _id } = await params;
//   try {
//     const response = await getBucketById(_id);
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
    const res = await fetch(`${process.env.API_ENDPOINT}/v1/buckets`, {
      method: "POST",
      headers: header_external,
    }).then((res) => res.json());
    if (res.error) return [];
    const data = res.data.map((i: Partial<Bucket>) => ({ _id: i._id }));
    return data;
  } catch (err: any) {
    console.error(err);
    return [];
  }
};

const Page = async ({ params }: { params: Params }): Promise<React.JSX.Element> => {
  const populate = ["company_id"];
  const fields = ["permissions", "name", "max_size_bytes", "consumption_bytes", "createdAt", "updatedAt", "company_id", "object_count"];
  const filters = { fields, populate };
  try {
    const { _id } = await params;
    const res = await fetch(`${process.env.API_ENDPOINT}/v1/buckets/by-id`, {
      method: "POST",
      headers: header_external,
      body: JSON.stringify({ _id, filters }),
    }).then((res) => res.json());
    if (res.error) return notFound();
    return <BucketEditPage data={res.data} />;
  } catch (err: any) {
    console.error(err);
    return notFound();
  }
};
export default Page;
