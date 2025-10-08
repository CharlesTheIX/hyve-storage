import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { header_external } from "@/globals";
import { default_404_metadata, site_name } from "@/globals";
import PermissionsWrapper from "@/components/PermissionsWrapper";
import DeleteDataButton from "@/components/buttons/DeleteDataButton";
import BucketDataCard from "@/components/cards/buckets/BucketDataCard";
import BucketObjectsTable from "@/components/tables/buckets/BucketObjectsTable";

type Params = Promise<{ _id: string }>;

export const generateMetadata = async ({ params }: { params: Promise<Params> }): Promise<Metadata> => {
  const { _id } = await params;
  try {
    const res = await fetch(`${process.env.API_ENDPOINT}/v1/buckets/by-id`, {
      method: "POST",
      headers: header_external,
      body: JSON.stringify({ _id }),
    }).then((res) => res.json());
    if (res.error) return default_404_metadata;
    return {
      title: `${res.data._id} | Buckets | ${site_name}`,
      description: `Some description here.`,
    };
  } catch (error: any) {
    return default_404_metadata;
  }
};

export const generateStaticParams = async (): Promise<Params[]> => {
  try {
    const res = await fetch(`${process.env.API_ENDPOINT}/v1/buckets`, {
      method: "POST",
      headers: header_external,
    }).then((res) => res.json());
    if (res.error) return [];
    const data = res.data.map((i: Partial<Bucket>) => ({ _id: i._id }));
    return data;
  } catch (err: any) {
    console.error(err);
    return [];
  }
};

const Page = async ({ params }: { params: Params }): Promise<React.JSX.Element> => {
  const populate = ["company_id"];
  const fields = ["permissions", "name", "max_size_bytes", "consumption_bytes", "createdAt", "updatedAt", "company_id", "object_count"];
  const filters = { fields, populate };
  try {
    const { _id } = await params;
    const res = await fetch(`${process.env.API_ENDPOINT}/v1/buckets/by-id`, {
      method: "POST",
      headers: header_external,
      body: JSON.stringify({ _id, filters }),
    }).then((res) => res.json());
    if (res.error) return notFound();

    const data: Bucket = res.data;
    return (
      <main>
        <section>
          <div className="flex flex-row gap-2 items-center justify-between">
            <div className="flex flex-row gap-2 items-center">
              <h1>{data?.name || ""}</h1>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Link href={`/buckets/${data._id}/edit`} className="hyve-button">
                Edit
              </Link>

              <DeleteDataButton data_key={data._id || ""} type="bucket" redirect="/buckets">
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
                <h2>Objects</h2>
              </div>

              <PermissionsWrapper permissions={[9]}>
                <Link href={`/buckets/${data._id}/upload`} className="hyve-button">
                  Upload
                </Link>
              </PermissionsWrapper>
            </div>

            <BucketObjectsTable bucket_id={data._id || ""} />
          </div>
        </section>
      </main>
    );
  } catch (err: any) {
    console.error(err);
    return notFound();
  }
};
export default Page;
