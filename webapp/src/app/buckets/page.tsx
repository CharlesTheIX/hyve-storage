import { Metadata } from "next";
import BucketsPage from "@/pages/Buckets";
import { defaultMetadata } from "@/globals";

//TODO: update the metadata dor this page
export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Buckets | Hyve Storage",
  description: "Some description here.",
};

const Page: React.FC = () => <BucketsPage />;
export default Page;
