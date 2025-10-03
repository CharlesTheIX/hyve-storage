import Link from "next/link";
import { colors } from "@/globals";
import Document from "@/components/svgs/Document";
import BucketDataCard from "@/components/cards/BucketDataCard";
import BucketObjectsTable from "@/components/tables/BucketObjectsTable";

type Props = {
  data: Partial<Bucket>;
};

const BucketPage: React.FC<Props> = (props: Props) => {
  const { data } = props;

  return (
    <main className="flex flex-col gap-2 items-center justify-start">
      <section className="w-full">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Document primaryColor={colors.white} width={50} height={50} />
            <h1>{data.name ? data.name : data._id}</h1>
          </div>

          <Link href={`/buckets/${data._id}/edit`} className="hyve-button link">
            Edit
          </Link>
        </div>
      </section>

      <section className="w-full">
        <div>
          <BucketDataCard data={data} />
        </div>
      </section>

      <section className="w-full">
        <div>
          <div className="flex flex-row gap-2 items-center">
            <h2>Objects</h2>
          </div>

          <BucketObjectsTable bucketId={data._id || ""} />
        </div>
      </section>
    </main>
  );
};

export default BucketPage;
