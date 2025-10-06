import { Metadata } from "next";
import BucketsPage from "@/pages/Buckets";
import { defaultMetadata, siteName } from "@/globals";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: `Buckets | ${siteName}`,
  //TODO
  description: "Some description here.",
};

const Page: React.FC = () => <BucketsPage />;
export default Page;
