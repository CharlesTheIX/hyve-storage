import Link from "next/link";
import { colors } from "@/globals";
import Document from "@/components/svgs/Document";
import PermissionsWrapper from "@/components/PermissionsWrapper";
import BucketsTable from "@/components/tables/buckets/BucketsTable";

const BucketsPage: React.FC = () => {
  return (
    <main>
      <section>
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Document primary_color={colors.white} size={50} />
            <h1>Buckets</h1>
          </div>

          <PermissionsWrapper permission_level={9}>
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
};

export default BucketsPage;
