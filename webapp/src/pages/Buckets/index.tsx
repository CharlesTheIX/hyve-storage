import Link from "next/link";
import { colors } from "@/globals";
import Document from "@/components/svgs/Document";
import BucketsTable from "@/components/tables/BucketsTable";

const BucketsPage: React.FC = () => {
  return (
    <main className="flex flex-col gap-2 items-center justify-start">
      <section className="w-full">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Document primaryColor={colors.white} width={50} height={50} />
            <h1>Buckets</h1>
          </div>

          <Link href="/buckets/create" className="hyve-button link">
            Create New
          </Link>
        </div>
      </section>

      <section className="w-full">
        <BucketsTable />
      </section>
    </main>
  );
};

export default BucketsPage;
