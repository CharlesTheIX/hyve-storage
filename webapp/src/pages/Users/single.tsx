import Link from "next/link";
import { colors } from "@/globals";
import Profile from "@/components/svgs/Profile";
import UserDataCard from "@/components/cards/users/UserDataCard";
import DeleteDataButton from "@/components/buttons/DeleteDataButton";

type Props = {
  data: Partial<User>;
};

const UserPage: React.FC<Props> = (props: Props) => {
  const { data } = props;

  return (
    <main>
      <section>
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Profile primaryColor={colors.white} size={50} />
            <h1>{data.firstName && data.surname ? `${data.firstName} ${data.surname}` : data._id}</h1>
          </div>

          <div className="flex flex-row gap-2 items-center">
            <Link href={`/users/${data._id}/edit`} className="hyve-button">
              Edit
            </Link>

            <DeleteDataButton dataKey={data._id || ""} type="user" redirect="/users">
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
};

export default UserPage;
