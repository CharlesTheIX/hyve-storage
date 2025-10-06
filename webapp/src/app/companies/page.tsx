import { Metadata } from "next";
import CompaniesPage from "@/pages/Companies";
import { defaultMetadata, siteName } from "@/globals";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: `Companies | ${siteName}`,
  //TODO
  description: "Some description here.",
};

const Page: React.FC = () => <CompaniesPage />;
export default Page;
