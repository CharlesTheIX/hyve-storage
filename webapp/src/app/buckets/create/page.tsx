import { Metadata } from "next";
import { defaultMetadata, siteName } from "@/globals";
import BucketCreationPage from "@/pages/Buckets/create";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: `Bucket Creation | ${siteName}`,
  //TODO
  description: "Some description here.",
};

const Page: React.FC = () => <BucketCreationPage />;
export default Page;
