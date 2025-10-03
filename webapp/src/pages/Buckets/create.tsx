import { colors } from "@/globals";
import Create from "@/components/svgs/Create";
import BucketCreationForm from "@/components/forms/BucketCreationForm";

const BucketCreationPage: React.FC = () => {
  return (
    <main className="flex flex-col gap-2 items-center justify-start">
      <section className="w-full">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Create primaryColor={colors.white} width={50} height={50} />
            <h1>Bucket Creation</h1>
          </div>
        </div>
      </section>

      <section className="w-full">
        <BucketCreationForm />
      </section>
    </main>
  );
};

export default BucketCreationPage;
