import { colors } from "@/globals";
import Edit from "@/components/svgs/Edit";
import UserEditForm from "@/components/forms/users/UserEditForm";
import DeleteDataButton from "@/components/buttons/DeleteDataButton";

type Props = {
  data: Partial<User>;
};

const UserEditPage: React.FC<Props> = (props: Props) => {
  const { data } = props;

  return (
    <main>
      <section>
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Edit primary_color={colors.white} size={50} />
            <h1>Edit User</h1>
          </div>

          <DeleteDataButton data_key={data._id || ""} type="user" redirect="/users">
            <p>Delete</p>
          </DeleteDataButton>
        </div>
      </section>

      <section>
        <UserEditForm data={data} />
      </section>
    </main>
  );
};

export default UserEditPage;
