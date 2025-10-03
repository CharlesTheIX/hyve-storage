import { Metadata } from "next";
import { defaultMetadata } from "@/globals";
import CompaniesPage from "@/pages/Companies";

//TODO: update the metadata dor this page
export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Companies | Hyve Storage",
  description: "Some description here.",
};

const Page: React.FC = () => <CompaniesPage />;
export default Page;
