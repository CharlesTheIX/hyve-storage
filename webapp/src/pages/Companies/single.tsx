import Link from "next/link";
import { colors } from "@/globals";
import Cog from "@/components/svgs/Cog";
import CompanyDataCard from "@/components/cards/CompanyDataCard";

type Props = {
  data: Partial<Company>;
};

const CompanyPage: React.FC<Props> = (props: Props) => {
  const { data } = props;

  return (
    <main className="flex flex-col gap-2 items-center justify-start">
      <section className="w-full">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Cog primaryColor={colors.white} width={50} height={50} />
            <h1>{data.name}</h1>
          </div>

          <Link href={`/companies/${data._id}/edit`} className="hyve-button link">
            Edit
          </Link>
        </div>
      </section>

      <section className="w-full">
        <div>
          <CompanyDataCard data={data} />
        </div>
      </section>
    </main>
  );
};

export default CompanyPage;
