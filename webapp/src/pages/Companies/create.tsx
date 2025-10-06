import { colors } from "@/globals";
import Create from "@/components/svgs/Create";
import CompanyCreationForm from "@/components/forms/companies/CompanyCreationForm";

const CompanyCreationPage: React.FC = () => {
  return (
    <main>
      <section>
        <div className="flex flex-row gap-2 items-center">
          <Create primaryColor={colors.white} size={50} />
          <h1>Companies</h1>
        </div>
      </section>

      <section>
        <CompanyCreationForm />
      </section>
    </main>
  );
};

export default CompanyCreationPage;
