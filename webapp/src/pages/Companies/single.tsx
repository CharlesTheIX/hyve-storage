import Link from "next/link";
import { colors } from "@/globals";
import Cog from "@/components/svgs/Cog";
import DeleteDataButton from "@/components/buttons/DeleteDataButton";
import CompanyDataCard from "@/components/cards/companies/CompanyDataCard";

type Props = {
  data: Partial<Company>;
};

const CompanyPage: React.FC<Props> = (props: Props) => {
  const { data } = props;

  return (
    <main>
      <section>
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Cog primaryColor={colors.white} size={50} />
            <h1>{data.name}</h1>
          </div>

          <div className="flex flex-row gap-2 items-center">
            <Link href={`/companies/${data._id}/edit`} className="hyve-button">
              Edit
            </Link>

            <DeleteDataButton dataKey={data._id || ""} type="company" redirect="/companies">
              <p>Delete</p>
            </DeleteDataButton>
          </div>
        </div>
      </section>

      <section>
        <CompanyDataCard data={data} />
      </section>
    </main>
  );
};

export default CompanyPage;
