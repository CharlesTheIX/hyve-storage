import { Metadata } from "next";
import NotFoundPage from "@/pages/NotFound";
import { default_metadata, site_name } from "@/globals";

//TODO: update the metadata dor this page
export const metadata: Metadata = {
  ...default_metadata,
  description: "Page not found",
  title: `Not found - 404 | ${site_name}`,
  robots: {
    index: false,
    follow: false,
  },
};

const Page: React.FC = () => <NotFoundPage />;
export default Page;
