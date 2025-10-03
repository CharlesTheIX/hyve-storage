import { Metadata } from "next";
import getBuckets from "@/lib/getBuckets";
import { notFound } from "next/navigation";
import getBucketById from "@/lib/getBucketById";
import BucketEditPage from "@/pages/Buckets/edit";
import ObjectUploadPage from "@/pages/Buckets/Objects/upload";

type Params = Promise<{ _id: string }>;

export const generateMetadata = async ({ params }: { params: Params }): Promise<Metadata> => {
  const { _id } = await params;
  const fields = ["_id"];
  const options = { fields };
  try {
    const response = await getBucketById(_id, options);
    if (response.error) throw new Error();
    return {
      title: `${response.data._id} | Upload`,
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
    const response = await getBuckets(options);
    if (response.error) throw new Error();
    return response.data.map((user: Partial<User>) => {
      return { _id: user._id };
    });
  } catch (error: any) {
    return [];
  }
};

const Page = async ({ params }: { params: Params }): Promise<React.JSX.Element> => {
  const fields = ["name"];
  const options = { fields };
  try {
    const { _id } = await params;
    const response = await getBucketById(_id, options);
    if (response.error) return notFound();
    return <ObjectUploadPage data={response.data} />;
  } catch (error: any) {
    notFound();
  }
};
export default Page;
