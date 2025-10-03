"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import handleError from "@/lib/handleError";
import getCompanies from "@/lib/getCompanies";
import { defaultTableNullValue } from "@/globals";
import LoadingContainer from "@/components/LoadingContainer";

const CompaniesTable: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [list, setList] = useState<Partial<Company>[]>([]);
  const [tableHeaders, setTableHeaders] = useState<string[]>(["Company Name", "User Count", "Bucket Count", "Creation Date", "Last Updated"]);

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
      setLoading(true);
      const populate: string[] = [];
      const fields = ["name", "userIds", "bucketIds", "createdAt", "updatedAt"];
      const options: Partial<ApiRequestOptions> = { fields, populate };

      try {
        const res = await getCompanies(options);
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
            {list.map((td: Partial<Company>, key: number) => {
              return (
                <tr
                  key={key}
                  onClick={() => {
                    navigateTo(`/companies/${td._id}`);
                  }}
                >
                  <td>
                    <p>{td.name ? td.name : defaultTableNullValue}</p>
                  </td>

                  <td>
                    <p>{td.userIds ? td.userIds.length : defaultTableNullValue}</p>
                  </td>

                  <td>
                    <p>{td.bucketIds ? td.bucketIds.length : defaultTableNullValue}</p>
                  </td>

                  <td>
                    <p>{td.createdAt ? new Date(td.createdAt).toLocaleDateString() : defaultTableNullValue}</p>
                  </td>

                  <td>
                    <p>{td.updatedAt ? new Date(td.updatedAt).toLocaleDateString() : defaultTableNullValue}</p>
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

export default CompaniesTable;
