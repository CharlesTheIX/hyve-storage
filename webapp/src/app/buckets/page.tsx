import { Metadata } from "next";
import BucketsPage from "@/pages/Buckets";
import { default_metadata, site_name } from "@/globals";

export const metadata: Metadata = {
  ...default_metadata,
  title: `Buckets | ${site_name}`,
  //TODO
  description: "Some description here.",
};

const Page: React.FC = () => <BucketsPage />;
export default Page;
