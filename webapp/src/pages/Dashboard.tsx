import { colors } from "@/globals";
import Dashboard from "@/components/svgs/Dashboard";

const DashboardPage: React.FC = () => {
  return (
    <main className="flex flex-col gap-2 items-center justify-start">
      <section className="w-full">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Dashboard primaryColor={colors.white} width={50} height={50} />
            <h1>Dashboard</h1>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;
