import { Metadata } from "next";
import { notFound } from "next/navigation";
import { header_external } from "@/globals";
import { default_404_metadata, site_name } from "@/globals";
import UserEditForm from "@/components/forms/users/UserEditForm";
import DeleteDataButton from "@/components/buttons/DeleteDataButton";

type Params = Promise<{ _id: string }>;

export const generateMetadata = async ({ params }: { params: Params }): Promise<Metadata> => {
  const { _id } = await params;
  try {
    const res = await fetch(`${process.env.API_ENDPOINT}/v1/users/by-id`, {
      method: "POST",
      headers: header_external,
      body: JSON.stringify({ _id }),
    }).then((r) => r.json());
    if (res.error) default_404_metadata;
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
    const res = await fetch(`${process.env.API_ENDPOINT}/v1/users`, {
      method: "POST",
      headers: header_external,
    }).then((res) => res.json());
    if (res.error) return [];
    const data = res.data.map((i: Partial<User>) => ({ _id: i._id }));
    return data;
  } catch (err: any) {
    console.error(err);
    return [];
  }
};

const Page = async ({ params }: { params: Params }): Promise<React.JSX.Element> => {
  const populate = ["company_id"];
  const fields = ["permissions", "username", "first_name", "surname", "company_id"];
  const filters = { fields, populate };

  try {
    const { _id } = await params;
    const res = await fetch(`${process.env.API_ENDPOINT}/v1/users/by-id`, {
      method: "POST",
      headers: header_external,
      body: JSON.stringify({ _id, filters }),
    }).then((r) => r.json());
    if (res.error) return notFound();

    const data: User = res.data;
    return (
      <main>
        <section>
          <div className="flex flex-row gap-2 items-center justify-between">
            <div className="flex flex-row gap-2 items-center">
              <h1>Edit {data.username}</h1>
            </div>

            <DeleteDataButton data_key={data._id || ""} type="user" redirect="/users">
              <p>Delete</p>
            </DeleteDataButton>
          </div>
        </section>

        <section>
          <UserEditForm data={data} />
        </section>
      </main>
    );
  } catch (err: any) {
    console.error(err);
    return notFound();
  }
};
export default Page;
