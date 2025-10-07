import Link from "next/link";
import { colors } from "@/globals";
import Cog from "@/components/svgs/Cog";
import PermissionsWrapper from "@/components/PermissionsWrapper";
import CompaniesTable from "@/components/tables/companies/CompaniesTable";

const CompaniesPage: React.FC = () => {
  return (
    <main>
      <section>
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Cog primary_color={colors.white} size={50} />
            <h1>Companies</h1>
          </div>

          <PermissionsWrapper permission_level={9}>
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
};

export default CompaniesPage;
