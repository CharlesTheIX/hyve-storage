import { Metadata } from "next";
import { defaultMetadata, siteName } from "@/globals";
import CompanyCreationPage from "@/pages/Companies/create";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: `Company Creation | ${siteName}`,
  //TODO
  description: "Some description here.",
};

const Page: React.FC = () => <CompanyCreationPage />;
export default Page;
