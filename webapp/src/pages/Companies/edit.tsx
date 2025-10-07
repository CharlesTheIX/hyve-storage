import { colors } from "@/globals";
import Edit from "@/components/svgs/Edit";
import DeleteDataButton from "@/components/buttons/DeleteDataButton";
import CompanyEditForm from "@/components/forms/companies/CompanyEditForm";

type Props = {
  data: Partial<Company>;
};

const CompanyEditPage: React.FC<Props> = (props: Props) => {
  const { data } = props;

  return (
    <main>
      <section>
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Edit primary_color={colors.white} size={50} />
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
};

export default CompanyEditPage;
