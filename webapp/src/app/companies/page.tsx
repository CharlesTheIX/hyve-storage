import { Metadata } from "next";
import CompaniesPage from "@/pages/Companies";
import { default_metadata, site_name } from "@/globals";

export const metadata: Metadata = {
  ...default_metadata,
  title: `Companies | ${site_name}`,
  //TODO
  description: "Some description here.",
};

const Page: React.FC = () => <CompaniesPage />;
export default Page;
