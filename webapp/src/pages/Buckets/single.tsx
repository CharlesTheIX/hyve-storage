import Link from "next/link";
import { colors } from "@/globals";
import Document from "@/components/svgs/Document";
import PermissionsWrapper from "@/components/PermissionsWrapper";
import DeleteDataButton from "@/components/buttons/DeleteDataButton";
import BucketDataCard from "@/components/cards/buckets/BucketDataCard";
import BucketObjectsTable from "@/components/tables/buckets/BucketObjectsTable";

type Props = {
  data: Partial<Bucket>;
};

const BucketPage: React.FC<Props> = (props: Props) => {
  const { data } = props;

  return (
    <main>
      <section>
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Document primaryColor={colors.white} size={50} />
            <h1>{data.name ? data.name : data._id}</h1>
          </div>

          <div className="flex flex-row gap-2 items-center">
            <Link href={`/buckets/${data._id}/edit`} className="hyve-button">
              Edit
            </Link>

            <DeleteDataButton dataKey={data._id || ""} type="bucket" redirect="/buckets">
              <p>Delete</p>
            </DeleteDataButton>
          </div>
        </div>
      </section>

      <section>
        <BucketDataCard data={data} />
      </section>

      <section>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center justify-between">
            <div className="flex flex-row gap-2 items-center">
              <Document primaryColor={colors.white} size={50} />
              <h2>Objects</h2>
            </div>

            <PermissionsWrapper permissionLevel={9}>
              <Link href={`/buckets/${data._id}/upload`} className="hyve-button">
                Upload
              </Link>
            </PermissionsWrapper>
          </div>

          <BucketObjectsTable bucketId={data._id || ""} />
        </div>
      </section>
    </main>
  );
};

export default BucketPage;
