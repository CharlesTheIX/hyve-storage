import { Metadata } from "next";
import { default_metadata, site_name } from "@/globals";
import CompanyCreationPage from "@/pages/Companies/create";

export const metadata: Metadata = {
  ...default_metadata,
  title: `Company Creation | ${site_name}`,
  //TODO
  description: "Some description here.",
};

const Page: React.FC = () => <CompanyCreationPage />;
export default Page;
