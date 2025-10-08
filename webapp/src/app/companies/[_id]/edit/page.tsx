import { Metadata } from "next";
import { notFound } from "next/navigation";
import { header_external } from "@/globals";
import { default_404_metadata, site_name } from "@/globals";
import DeleteDataButton from "@/components/buttons/DeleteDataButton";
import CompanyEditForm from "@/components/forms/companies/CompanyEditForm";

export const generateMetadata = async ({ params }: { params: { _id: string } }): Promise<Metadata> => {
  const { _id } = await params;
  try {
    const res = await fetch(`${process.env.API_ENDPOINT}/v1/companies/by-id`, {
      method: "POST",
      headers: header_external,
      body: JSON.stringify({ _id }),
    }).then((r) => r.json());
    if (res.error) return default_404_metadata;
    return {
      title: `${res.data._id} | Edit | ${site_name}`,
      description: `Some description here.`,
    };
  } catch (error: any) {
    return default_404_metadata;
  }
};

export const generateStaticParams = async (): Promise<{ _id: string }[]> => {
  try {
    const res = await fetch(`${process.env.API_ENDPOINT}/v1/companies`, {
      method: "POST",
      headers: header_external,
    }).then((res) => res.json());
    if (res.error) return [];
    const data = res.data.map((i: Partial<Company>) => ({ _id: i._id }));
    return data;
  } catch (err: any) {
    console.error(err);
    return [];
  }
};

const Page = async ({ params }: { params: { _id: string } }): Promise<React.JSX.Element> => {
  const populate = ["user_ids", "bucket_ids"];
  const fields = ["name", "user_ids", "bucket_ids"];
  const filters = { fields, populate };
  try {
    const { _id } = params;
    const res = await fetch(`${process.env.API_ENDPOINT}/v1/companies/by-id`, {
      method: "POST",
      headers: header_external,
      body: JSON.stringify({ _id, filters }),
    }).then((r) => r.json());
    if (res.error) return notFound();

    const data: Company = res.data;
    return (
      <main>
        <section>
          <div className="flex flex-row gap-2 items-center justify-between">
            <div className="flex flex-row gap-2 items-center">
              <h1>Edit Company</h1>
            </div>

            <DeleteDataButton data_key={data._id || ""} type="user" redirect="/companies">
              <p>Delete</p>
            </DeleteDataButton>
          </div>
        </section>

        <section>
          <CompanyEditForm data={data} />
        </section>
      </main>
    );
  } catch (err: any) {
    console.error(err);
    return notFound();
  }
};
export default Page;
