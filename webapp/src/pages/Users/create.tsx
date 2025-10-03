import { colors } from "@/globals";
import Create from "@/components/svgs/Create";
import UserCreationForm from "@/components/forms/UserCreationForm";

const UserCreationPage: React.FC = () => {
  return (
    <main className="flex flex-col gap-2 items-center justify-start">
      <section className="w-full">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Create primaryColor={colors.white} width={50} height={50} />
            <h1>Create User</h1>
          </div>
        </div>
      </section>

      <section className="w-full">
        <UserCreationForm />
      </section>
    </main>
  );
};

export default UserCreationPage;
