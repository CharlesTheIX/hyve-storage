import { Metadata } from "next";
import { notFound } from "next/navigation";
import getCompanies from "@/lib/getCompanies";
import getCompanyById from "@/lib/getCompanyById";
import CompanyPage from "@/pages/Companies/single";

type Params = Promise<{ _id: string }>;

export const generateMetadata = async ({ params }: { params: Params }): Promise<Metadata> => {
  const { _id } = await params;
  const fields = ["_id"];
  const options = { fields };
  try {
    const response = await getCompanyById(_id, options);
    if (response.error) throw new Error();
    return {
      title: `${response.data.name} | Companies`,
      description: `Some description here.`,
    };
  } catch (error: any) {
    return {
      title: "404",
      description: "Company not found",
      robots: "noindex, nofollow",
    };
  }
};

export const generateStaticParams = async (): Promise<{ _id: string }[]> => {
  const fields = ["_id"];
  const options = { fields };
  try {
    const response = await getCompanies(options);
    if (response.error) throw new Error();
    return response.data.map((company: Partial<Company>) => {
      return { _id: company._id };
    });
  } catch (error: any) {
    return [];
  }
};

const Page = async ({ params }: { params: Params }): Promise<React.JSX.Element> => {
  const populate = ["userIds", "bucketIds"];
  const fields = ["name", "userIds", "bucketIds", "createdAt", "updatedAt"];
  const options = { fields, populate };
  try {
    const { _id } = await params;
    const response = await getCompanyById(_id, options);
    if (response.error) return notFound();
    return <CompanyPage data={response.data} />;
  } catch (error: any) {
    notFound();
  }
};
export default Page;
