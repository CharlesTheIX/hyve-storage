import { colors } from "@/globals";
import Create from "@/components/svgs/Create";
import BucketCreationForm from "@/components/forms/buckets/BucketCreationForm";

const BucketCreationPage: React.FC = () => {
  return (
    <main>
      <section>
        <div className="flex flex-row gap-2 items-center">
          <Create primaryColor={colors.white} size={50} />
          <h1>Bucket Creation</h1>
        </div>
      </section>

      <section>
        <BucketCreationForm />
      </section>
    </main>
  );
};

export default BucketCreationPage;
