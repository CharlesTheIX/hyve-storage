import Link from "next/link";
import { colors } from "@/globals";
import Profile from "@/components/svgs/Profile";
import UserDataCard from "@/components/cards/UserDataCard";

type Props = {
  data: Partial<User>;
};

const UserPage: React.FC<Props> = (props: Props) => {
  const { data } = props;

  return (
    <main className="flex flex-col gap-2 items-center justify-start">
      <section className="w-full">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Profile primaryColor={colors.white} width={50} height={50} />
            <h1>{data.firstName && data.surname ? `${data.firstName} ${data.surname}` : data._id}</h1>
          </div>

          <Link href={`/users/${data._id}/edit`} className="hyve-button link">
            Edit
          </Link>
        </div>
      </section>

      <section className="w-full">
        <div>
          <UserDataCard data={data} />
        </div>
      </section>
    </main>
  );
};

export default UserPage;
