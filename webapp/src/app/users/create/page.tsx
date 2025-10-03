import { Metadata } from "next";
import { defaultMetadata } from "@/globals";
import UserCreationPage from "@/pages/Users/create";

//TODO: update the metadata dor this page
export const metadata: Metadata = {
  ...defaultMetadata,
  title: "User Creation | Hyve Storage",
  description: "Some description here.",
};

const Page: React.FC = () => <UserCreationPage />;
export default Page;
