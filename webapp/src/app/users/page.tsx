import { Metadata } from "next";
import UsersPage from "@/pages/Users";
import { defaultMetadata } from "@/globals";

//TODO: update the metadata dor this page
export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Users | Hyve Storage",
  description: "Some description here.",
};

const Page: React.FC = () => <UsersPage />;
export default Page;
