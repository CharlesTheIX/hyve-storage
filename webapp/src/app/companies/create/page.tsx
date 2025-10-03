import { Metadata } from "next";
import { defaultMetadata } from "@/globals";
import CompanyCreationPage from "@/pages/Companies/create";

//TODO: update the metadata dor this page
export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Company Creation | Hyve Storage",
  description: "Some description here.",
};

const Page: React.FC = () => <CompanyCreationPage />;
export default Page;
