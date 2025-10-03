import { colors } from "@/globals";
import Create from "@/components/svgs/Create";
import CompanyCreationForm from "@/components/forms/CompanyCreationForm";

const CompanyCreationPage: React.FC = () => {
  return (
    <main className="flex flex-col gap-2 items-center justify-start">
      <section className="w-full">
        <div className="flex flex-row gap-2 items-center">
          <Create primaryColor={colors.white} width={50} height={50} />
          <h1>Companies</h1>
        </div>
      </section>

      <section className="w-full">
        <CompanyCreationForm />
      </section>
    </main>
  );
};

export default CompanyCreationPage;
