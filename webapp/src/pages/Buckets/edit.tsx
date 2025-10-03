import UserEditForm from "@/components/forms/UserEditForm";
import Edit from "@/components/svgs/Edit";
import { colors } from "@/globals";

type Props = {
  data: Partial<User>;
};

const UserEditPage: React.FC<Props> = (props: Props) => {
  const { data } = props;

  return (
    <main className="flex flex-col gap-2 items-center justify-start">
      <section className="w-full">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Edit primaryColor={colors.white} width={50} height={50} />
            <h1>Edit User</h1>
          </div>
        </div>
      </section>

      <section className="w-full">
        <UserEditForm data={data} />
      </section>
    </main>
  );
};

export default UserEditPage;
