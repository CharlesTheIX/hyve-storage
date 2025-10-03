import Link from "next/link";
import { colors } from "@/globals";
import Users from "@/components/svgs/Users";
import UsersTable from "@/components/tables/UsersTable";

const UsersPage: React.FC = () => {
  return (
    <main className="flex flex-col gap-2 items-center justify-start">
      <section className="w-full">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Users primaryColor={colors.white} width={50} height={50} />
            <h1>Users</h1>
          </div>

          <Link href="/users/create" className="hyve-button link">
            Create New
          </Link>
        </div>
      </section>

      <section className="w-full">
        <UsersTable />
      </section>
    </main>
  );
};

export default UsersPage;
