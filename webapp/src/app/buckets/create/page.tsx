import { Metadata } from "next";
import { default_metadata, site_name } from "@/globals";
import BucketCreationForm from "@/components/forms/buckets/BucketCreationForm";

export const metadata: Metadata = {
  ...default_metadata,
  title: `Bucket Creation | ${site_name}`,
  description: "Some description here.",
};

const Page: React.FC = () => (
  <main>
    <section>
      <div className="flex flex-row gap-2 items-center">
        <h1>Bucket Creation</h1>
      </div>
    </section>

    <section>
      <BucketCreationForm />
    </section>
  </main>
);
export default Page;
