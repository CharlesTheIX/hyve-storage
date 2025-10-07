import { Metadata } from "next";
import { default_metadata, site_name } from "@/globals";
import BucketCreationPage from "@/pages/Buckets/create";

export const metadata: Metadata = {
  ...default_metadata,
  title: `Bucket Creation | ${site_name}`,
  //TODO
  description: "Some description here.",
};

const Page: React.FC = () => <BucketCreationPage />;
export default Page;
