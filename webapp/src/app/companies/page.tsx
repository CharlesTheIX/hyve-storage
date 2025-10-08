import Link from "next/link";
import { Metadata } from "next";
import { default_metadata, site_name } from "@/globals";
import PermissionsWrapper from "@/components/PermissionsWrapper";
import CompaniesTable from "@/components/tables/companies/CompaniesTable";

export const metadata: Metadata = {
  ...default_metadata,
  title: `Companies | ${site_name}`,
  description: "Some description here.",
};

const Page: React.FC = () => (
  <main>
    <section>
      <div className="flex flex-row gap-2 items-center justify-between">
        <div className="flex flex-row gap-2 items-center">
          <h1>Companies</h1>
        </div>

        <PermissionsWrapper permissions={[9]}>
          <Link href="/companies/create" className="hyve-button">
            Create New
          </Link>
        </PermissionsWrapper>
      </div>
    </section>

    <section>
      <CompaniesTable />
    </section>
  </main>
);
export default Page;
