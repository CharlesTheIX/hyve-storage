import { Metadata } from "next";
import { defaultMetadata } from "@/globals";
import BucketCreationPage from "@/pages/Buckets/create";

//TODO: update the metadata dor this page
export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Bucket Creation | Hyve Storage",
  description: "Some description here.",
};

const Page: React.FC = () => <BucketCreationPage />;
export default Page;
