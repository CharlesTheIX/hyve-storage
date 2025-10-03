"use client";
import getBuckets from "@/lib/getBuckets";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import handleError from "@/lib/handleError";
import formatBytes from "@/lib/formatBytes";
import { defaultTableNullValue } from "@/globals";
import PercentageRing from "@/components/PercentageRing";
import LoadingContainer from "@/components/LoadingContainer";
import getPercentageFromRatio from "@/lib/getPercentageFromRatio";

const BucketsTable: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<Partial<Bucket>[]>([]);
  const [tableHeaders, setTableHeaders] = useState<string[]>([
    "Bucket Name",
    "Owning Company",
    "Object Count",
    "Size Limit (KB)",
    "Consumption (KB)",
    "Permission Level",
    "Creation Date",
    "Last Updated",
  ]);

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
      const populate = ["companyId"];
      const fields = ["name", "companyId", "maxSize_bytes", "permissions", "createdAt", "updatedAt", "consumption_bytes", "objectCount"];
      const options: Partial<ApiRequestOptions> = { fields, populate };

      try {
        const res = await getBuckets(options);
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
            {list.map((td: Partial<Bucket>, key: number) => {
              const consumptionPercentage = getPercentageFromRatio(td.consumption_bytes || 0, td.maxSize_bytes || 0);

              return (
                <tr
                  key={key}
                  onClick={() => {
                    navigateTo(`/buckets/${td._id}`);
                  }}
                >
                  <td>
                    <p>{td.name ? td.name : defaultTableNullValue}</p>
                  </td>

                  <td
                    className="z-2 relative"
                    onClick={(event: any) => {
                      if (!td.companyId) return;
                      event.stopPropagation();
                      const uri = `/companies/${typeof td.companyId === "string" ? td.companyId : td.companyId._id}`;
                      navigateTo(uri);
                    }}
                  >
                    <p className="link-text">
                      {td.companyId ? (typeof td.companyId === "string" ? td.companyId : td.companyId.name) : defaultTableNullValue}
                    </p>
                  </td>

                  <td>
                    <p>{td.objectCount || defaultTableNullValue}</p>
                  </td>

                  <td>
                    <p>{td.maxSize_bytes ? formatBytes(td.maxSize_bytes, "KB") : defaultTableNullValue}</p>
                  </td>

                  <td>
                    {td.maxSize_bytes && td.consumption_bytes ? (
                      <div className="flex flex-row items-center justify-between w-full">
                        <p>
                          {formatBytes(td.consumption_bytes || 0, "KB")}/{formatBytes(td.maxSize_bytes || 0, "KB")}
                        </p>
                        <PercentageRing percentage={consumptionPercentage} size_rem={1} />
                      </div>
                    ) : (
                      <p>{defaultTableNullValue}</p>
                    )}
                  </td>

                  <td>
                    <p>{td.permissions ? td.permissions : defaultTableNullValue}</p>
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

export default BucketsTable;
