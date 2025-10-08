import { Metadata } from "next";
import { default_metadata, site_name } from "@/globals";
import CompanyCreationForm from "@/components/forms/companies/CompanyCreationForm";

export const metadata: Metadata = {
  ...default_metadata,
  title: `Company Creation | ${site_name}`,
  description: "Some description here.",
};

const Page: React.FC = () => (
  <main>
    <section>
      <div className="flex flex-row gap-2 items-center">
        <h1>Companies</h1>
      </div>
    </section>

    <section>
      <CompanyCreationForm />
    </section>
  </main>
);
export default Page;
