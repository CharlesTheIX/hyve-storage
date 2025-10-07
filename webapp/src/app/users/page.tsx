import { Metadata } from "next";
import UsersPage from "@/pages/Users";
import { default_metadata, site_name } from "@/globals";

export const metadata: Metadata = {
  ...default_metadata,
  title: `Users | ${site_name}`,
  //TODO
  description: "Some description here.",
};

const Page: React.FC = () => <UsersPage />;
export default Page;
