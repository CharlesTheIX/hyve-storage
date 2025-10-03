import { Metadata } from "next";
import { defaultMetadata } from "@/globals";
import DashboardPage from "@/pages/Dashboard";

//TODO: update the metadata dor this page
export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Dashboard | Hyve Storage",
  description: "View and manage your storage assets here.",
};

const Page: React.FC = () => <DashboardPage />;
export default Page;
