import Link from "next/link";
import { colors } from "@/globals";
import Cog from "@/components/svgs/Cog";
import CompaniesTable from "@/components/tables/CompaniesTable";

const CompaniesPage: React.FC = () => {
  return (
    <main className="flex flex-col gap-2 items-center justify-start">
      <section className="w-full">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Cog primaryColor={colors.white} width={50} height={50} />
            <h1>Companies</h1>
          </div>

          <Link href="/companies/create" className="hyve-button link">
            Create New
          </Link>
        </div>
      </section>

      <section className="w-full">
        <CompaniesTable />
      </section>
    </main>
  );
};

export default CompaniesPage;
