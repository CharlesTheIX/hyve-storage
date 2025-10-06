import { Metadata } from "next";
import { notFound } from "next/navigation";
import CompanyPage from "@/pages/Companies/single";
import getCompanies from "@/lib/companies/getCompanies";
import { default404Metadata, siteName } from "@/globals";
import getCompanyById from "@/lib/companies/getCompanyById";

type Params = Promise<{ _id: string }>;

export const generateMetadata = async ({ params }: { params: Params }): Promise<Metadata> => {
  const { _id } = await params;
  try {
    const response = await getCompanyById(_id);
    if (response.error) return default404Metadata;
    return {
      title: `${response.data._id} | Companies | ${siteName}`,
      //TODO
      description: `Some description here.`,
    };
  } catch (error: any) {
    return default404Metadata;
  }
};

export const generateStaticParams = async (): Promise<{ _id: string }[]> => {
  try {
    const response = await getCompanies();
    if (response.error) [];
    return response.data.map((company: Partial<Company>) => ({ _id: company._id }));
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
