import { colors } from "@/globals";
import Edit from "@/components/svgs/Edit";
import DeleteDataButton from "@/components/buttons/DeleteDataButton";
import BucketEditForm from "@/components/forms/buckets/BucketEditForm";

type Props = {
  data: Partial<Bucket>;
};

const BucketEditPage: React.FC<Props> = (props: Props) => {
  const { data } = props;

  return (
    <main>
      <section>
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Edit primaryColor={colors.white} size={50} />
            <h1>Edit Bucket</h1>
          </div>

          <DeleteDataButton dataKey={data._id || ""} type="bucket" redirect="/buckets">
            <p>Delete</p>
          </DeleteDataButton>
        </div>
      </section>

      <section>
        <BucketEditForm data={data} />
      </section>
    </main>
  );
};

export default BucketEditPage;
