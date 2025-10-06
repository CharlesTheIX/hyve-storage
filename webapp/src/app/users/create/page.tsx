import { Metadata } from "next";
import UserCreationPage from "@/pages/Users/create";
import { defaultMetadata, siteName } from "@/globals";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: `User Creation | ${siteName}`,
  //TODO
  description: "Some description here.",
};

const Page: React.FC = () => <UserCreationPage />;
export default Page;
