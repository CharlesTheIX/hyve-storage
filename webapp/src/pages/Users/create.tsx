import { colors } from "@/globals";
import Create from "@/components/svgs/Create";
import UserCreationForm from "@/components/forms/users/UserCreationForm";

const UserCreationPage: React.FC = () => {
  return (
    <main>
      <section>
        <div className="flex flex-row gap-2 items-center">
          <Create primaryColor={colors.white} size={50} />
          <h1>Create User</h1>
        </div>
      </section>

      <section>
        <UserCreationForm />
      </section>
    </main>
  );
};

export default UserCreationPage;
