import { Metadata } from "next";
import NotFoundPage from "@/pages/NotFound";
import { defaultMetadata, siteName } from "@/globals";

//TODO: update the metadata dor this page
export const metadata: Metadata = {
  ...defaultMetadata,
  title: `Not found - 404 | ${siteName}`,
  description: "",
  robots: {
    index: false,
    follow: false
  }
};

const Page: React.FC = () => <NotFoundPage />;
export default Page;
