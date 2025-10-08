import { Metadata } from "next";
import { default_metadata, site_name } from "@/globals";
import UserCreationForm from "@/components/forms/users/UserCreationForm";

export const metadata: Metadata = {
  ...default_metadata,
  title: `User Creation | ${site_name}`,
  description: "Some description here.",
};

const Page: React.FC = () => (
  <main>
    <section>
      <div className="flex flex-row gap-2 items-center">
        <h1>Create User</h1>
      </div>
    </section>

    <section>
      <UserCreationForm />
    </section>
  </main>
);
export default Page;
