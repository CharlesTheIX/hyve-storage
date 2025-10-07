import { Metadata } from "next";
import UserCreationPage from "@/pages/Users/create";
import { default_metadata, site_name } from "@/globals";

export const metadata: Metadata = {
  ...default_metadata,
  title: `User Creation | ${site_name}`,
  //TODO
  description: "Some description here.",
};

const Page: React.FC = () => <UserCreationPage />;
export default Page;
