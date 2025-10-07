import { colors } from "@/globals";
import Create from "@/components/svgs/Create";
import ObjectUploadForm from "@/components/forms/buckets/objects/ObjectUploadForm";

type Props = {
  data: Partial<Bucket>;
};

const ObjectUploadPage: React.FC<Props> = (props: Props) => {
  const { data } = props;

  return (
    <main>
      <section>
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Create primary_color={colors.white} size={50} />
            <h1>Object Upload</h1>
          </div>
        </div>
      </section>

      <section>
        <ObjectUploadForm data={data} />
      </section>
    </main>
  );
};

export default ObjectUploadPage;
