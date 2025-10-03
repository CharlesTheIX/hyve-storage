import { Metadata } from "next";
import LoginPage from "@/pages/Login";
import { defaultMetadata } from "@/globals";

//TODO: update the metadata dor this page
export const metadata: Metadata = {
  ...defaultMetadata,
  title: "",
  description: "",
};

const Page: React.FC = () => <LoginPage />;
export default Page;
