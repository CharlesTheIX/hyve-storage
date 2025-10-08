import Link from "next/link";
import { Metadata } from "next";
import { default_metadata, site_name } from "@/globals";
import PermissionsWrapper from "@/components/PermissionsWrapper";
import BucketsTable from "@/components/tables/buckets/BucketsTable";

export const metadata: Metadata = {
  ...default_metadata,
  title: `Buckets | ${site_name}`,
  description: "Some description here.",
};

const Page: React.FC = () => (
  <main>
    <section>
      <div className="flex flex-row gap-2 items-center justify-between">
        <div className="flex flex-row gap-2 items-center">
          <h1>Buckets</h1>
        </div>

        <PermissionsWrapper permissions={[9]}>
          <Link href="/buckets/create" className="hyve-button">
            Create New
          </Link>
        </PermissionsWrapper>
      </div>
    </section>

    <section>
      <BucketsTable />
    </section>
  </main>
);
export default Page;
