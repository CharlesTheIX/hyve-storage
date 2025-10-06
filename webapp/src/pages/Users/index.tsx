import Link from "next/link";
import { colors } from "@/globals";
import Users from "@/components/svgs/Users";
import UsersTable from "@/components/tables/users/UsersTable";
import PermissionsWrapper from "@/components/PermissionsWrapper";

const UsersPage: React.FC = () => {
  return (
    <main>
      <section>
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Users primaryColor={colors.white} size={50} />
            <h1>Users</h1>
          </div>

          <PermissionsWrapper permissionLevel={9}>
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
};

export default UsersPage;
