import { Metadata } from "next";
import { defaultMetadata } from "@/globals";
import ContactUsPage from "@/pages/ContactUs";

//TODO: update the metadata dor this page
export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Contact us | Hyve Storage",
  description: "Some description here.",
};

const Page: React.FC = () => <ContactUsPage />;
export default Page;
