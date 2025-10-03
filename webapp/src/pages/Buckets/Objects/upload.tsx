import { colors } from "@/globals";
import Create from "@/components/svgs/Create";
import ObjectUploadForm from "@/components/forms/ObjectUploadForm";

type Props = {
  data: Partial<Bucket>;
};

const ObjectUploadPage: React.FC<Props> = (props: Props) => {
  const { data } = props;

  return (
    <main className="flex flex-col gap-2 items-center justify-start">
      <section className="w-full">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Create primaryColor={colors.white} width={50} height={50} />
            <h1>Object Upload</h1>
          </div>
        </div>
      </section>

      <section className="w-full">
        <ObjectUploadForm data={data} />
      </section>
    </main>
  );
};

export default ObjectUploadPage;
