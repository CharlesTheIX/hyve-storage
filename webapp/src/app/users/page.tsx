import Link from "next/link";
import { Metadata } from "next";
import { default_metadata, site_name } from "@/globals";
import UsersTable from "@/components/tables/users/UsersTable";
import PermissionsWrapper from "@/components/PermissionsWrapper";

export const metadata: Metadata = {
  ...default_metadata,
  title: `Users | ${site_name}`,
  description: "Some description here.",
};

const Page: React.FC = () => (
  <main>
    <section>
      <div className="flex flex-row gap-2 items-center justify-between">
        <div className="flex flex-row gap-2 items-center">
          <h1>Users</h1>
        </div>

        <PermissionsWrapper permissions={[9]}>
          <Link href="/users/create" className="hyve-button">
            Create New
          </Link>
        </PermissionsWrapper>
      </div>
    </section>

    <section>
      <UsersTable />
    </section>
  </main>
);
export default Page;
