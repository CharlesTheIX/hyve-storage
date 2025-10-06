import { Metadata } from "next";
import { notFound } from "next/navigation";
import getBuckets from "@/lib/buckets/getBuckets";
import BucketEditPage from "@/pages/Buckets/edit";
import getBucketById from "@/lib/buckets/getBucketById";
import { default404Metadata, siteName } from "@/globals";

type Params = Promise<{ _id: string }>;

export const generateMetadata = async ({ params }: { params: Params }): Promise<Metadata> => {
  const { _id } = await params;
  try {
    const response = await getBucketById(_id);
    if (response.error) return default404Metadata;
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
    const response = await getBuckets();
    if (response.error) return [];
    return response.data.map((user: Partial<User>) => ({ _id: user._id }));
  } catch (error: any) {
    return [];
  }
};

const Page = async ({ params }: { params: Params }): Promise<React.JSX.Element> => {
  const populate = ["companyId"];
  const fields = ["permissions", "name", "maxSize_bytes", "consumption_bytes", "createdAt", "updatedAt", "companyId", "objectCount"];
  const options = { fields, populate };
  try {
    const { _id } = await params;
    const response = await getBucketById(_id, options);
    if (response.error) return notFound();
    return <BucketEditPage data={response.data} />;
  } catch (error: any) {
    notFound();
  }
};
export default Page;
