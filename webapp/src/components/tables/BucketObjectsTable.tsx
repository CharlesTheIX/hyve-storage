"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import handleError from "@/lib/handleError";
import getBucketObjects from "@/lib/getBucketObjects";
import LoadingContainer from "@/components/LoadingContainer";

type Props = {
  bucketId: string;
};

const BucketObjectsTable: React.FC<Props> = (props: Props) => {
  const { bucketId } = props;
  const router = useRouter();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tableHeaders, setTableHeaders] = useState<string[]>(["data"]);

  const errorCallback = () => {
    setLoading(false);
    setList([]);
  };

  const navigateTo = (uri: string): void => {
    if (!uri) return;
    router.push(uri);
  };

  useEffect(() => {
    (async () => {
      if (!bucketId) return;
      setLoading(true);

      try {
        const res = await getBucketObjects(bucketId);
        if (res.error) return handleError({ message: res.message, err: res.data, callback: errorCallback });
        if (res.data.length > 0) setList(res.data);
        setLoading(false);
      } catch (err: any) {
        return handleError({ message: err.message, err, callback: errorCallback });
      }
    })();
  }, []);

  return (
    <div className="hyve-table">
      {loading && <LoadingContainer />}
      {!loading && list.length === 0 && <p>No data to display.</p>}
      {!loading && list.length > 0 && (
        <table>
          <thead>
            <tr>
              {tableHeaders.map((th: string, key: number) => (
                <th key={key}>
                  <p>{th}</p>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {list.map((td: any, key: number) => {
              return (
                <tr
                  key={key}
                  onClick={() => {
                    navigateTo(`/buckets/${bucketId}/${"todo"}}`);
                  }}
                >
                  <td>
                    <p>{JSON.stringify(td)}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BucketObjectsTable;
