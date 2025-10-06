import { Metadata } from "next";
import UsersPage from "@/pages/Users";
import { defaultMetadata, siteName } from "@/globals";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: `Users | ${siteName}`,
  //TODO
  description: "Some description here.",
};

const Page: React.FC = () => <UsersPage />;
export default Page;
