import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { header_external } from "@/globals";
import { default_404_metadata, site_name } from "@/globals";
import UserDataCard from "@/components/cards/users/UserDataCard";
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
    if (res.error) return default_404_metadata;
    return {
      title: `${res.data._id} | Users | ${site_name}`,
      //TODO
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
    }).then((r) => r.json());
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
  const fields = ["permissions", "username", "first_name", "surname", "createdAt", "updatedAt", "company_id"];
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
              <h1>{data.first_name && data.surname ? `${data.first_name} ${data.surname}` : data._id}</h1>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Link href={`/users/${data._id}/edit`} className="hyve-button">
                Edit
              </Link>

              <DeleteDataButton data_key={data._id || ""} type="user" redirect="/users">
                <p>Delete</p>
              </DeleteDataButton>
            </div>
          </div>
        </section>

        <section>
          <UserDataCard data={data} />
        </section>
      </main>
    );
  } catch (err: any) {
    console.error(err);
    return notFound();
  }
};
export default Page;
