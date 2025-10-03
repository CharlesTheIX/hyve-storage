"use client";
import Storage from "@/lib/Storage";
import getBuckets from "@/lib/getBuckets";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import handleError from "@/lib/handleError";
import formatBytes from "@/lib/formatBytes";
import Chevron from "@/components/svgs/Chevron";
import PercentageRing from "@/components/PercentageRing";
import { colors, defaultTableNullValue } from "@/globals";
import LoadingContainer from "@/components/LoadingContainer";
import getPercentageFromRatio from "@/lib/getPercentageFromRatio";

const storageKey: string = "buckets_table_headers";
const bucketTableHeaders = [
  {
    value: "name",
    label: "Name",
    sortable: false,
    visible: true,
  },
  {
    value: "companyId",
    label: "Company",
    sortable: false,
    visible: true,
  },
  {
    value: "objectCount",
    label: "Object Count",
    sortable: false,
    visible: true,
  },
  {
    value: "maxSize_bytes",
    label: "Size Limit (KB)",
    sortable: false,
    visible: true,
  },
  {
    value: "consumption_bytes",
    label: "Consumption (KB)",
    sortable: false,
    visible: true,
  },
  {
    value: "permissions",
    label: "Permissions",
    sortable: false,
    visible: true,
  },
  {
    value: "createdAt",
    label: "Creation Date",
    sortable: false,
    visible: true,
  },
  {
    value: "updatedAt",
    label: "Last Updated",
    sortable: false,
    visible: true,
  },
];

const BucketsTable: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<Partial<Bucket>[]>([]);
  const [accordionOpen, setAccordionOpen] = useState<boolean>(false);
  const [tableHeaders, setTableHeaders] = useState<TableHeader[]>(bucketTableHeaders);

  const errorCallback = () => {
    setLoading(false);
    setList([]);
  };

  const navigateTo = (uri: string): void => {
    if (!uri) return;
    router.push(uri);
  };

  useEffect(() => {
    const savedData = Storage.getStorageValue(storageKey);
    if (savedData && savedData.value) setTableHeaders(savedData.value);

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
        <>
          <div className="column-filter-container">
            <div className={`hyve-accordion ${accordionOpen ? "open" : ""}`}>
              <div
                className="accordion-head"
                onClick={() => {
                  setAccordionOpen(!accordionOpen);
                }}
              >
                <p>Filter Columns</p>
                <Chevron primaryColor={colors.white} direction="down" />
              </div>

              <div className="accordion-body">
                <ul>
                  {tableHeaders.map((th) => {
                    return (
                      <li
                        key={th.value}
                        className={`${th.visible ? "visible" : ""}`}
                        onClick={() => {
                          setTableHeaders((prevValue) => {
                            const newValue = prevValue.map((h) => (h.value === th.value ? { ...h, visible: !h.visible } : h));
                            Storage.setStorageValue(storageKey, newValue);
                            return newValue;
                          });
                        }}
                      >
                        <p>{th.label}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                {tableHeaders.map((th: TableHeader, key: number) => {
                  if (th.visible) {
                    return (
                      <th key={key}>
                        <p>{th.label}</p>
                      </th>
                    );
                  }
                })}
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
                    {tableHeaders[0].visible !== false && (
                      <td>
                        <p>{td.name ? td.name : defaultTableNullValue}</p>
                      </td>
                    )}

                    {tableHeaders[1].visible !== false && (
                      <td
                        className="z-2 relative"
                        onClick={(event: any) => {
                          if (!td.companyId) return;
                          event.stopPropagation();
                          const uri = `/companies/${typeof td.companyId === "string" ? td.companyId : td.companyId._id}`;
                          navigateTo(uri);
                        }}
                      >
                        {td.companyId ? (
                          typeof td.companyId === "string" ? (
                            <p className="link-text">{td.companyId}</p>
                          ) : (
                            <p className="link-text">{td.companyId.name}</p>
                          )
                        ) : (
                          <p>{defaultTableNullValue}</p>
                        )}
                      </td>
                    )}

                    {tableHeaders[2].visible !== false && (
                      <td>
                        <p>{td.objectCount || defaultTableNullValue}</p>
                      </td>
                    )}

                    {tableHeaders[3].visible !== false && (
                      <td>
                        <p>{td.maxSize_bytes ? formatBytes(td.maxSize_bytes, "KB") : defaultTableNullValue}</p>
                      </td>
                    )}

                    {tableHeaders[4].visible !== false && (
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
                    )}

                    {tableHeaders[5].visible !== false && (
                      <td>
                        <p>{td.permissions ? td.permissions : defaultTableNullValue}</p>
                      </td>
                    )}

                    {tableHeaders[6].visible !== false && (
                      <td>
                        <p>{td.createdAt ? new Date(td.createdAt).toLocaleDateString() : defaultTableNullValue}</p>
                      </td>
                    )}

                    {tableHeaders[7].visible !== false && (
                      <td>
                        <p>{td.updatedAt ? new Date(td.updatedAt).toLocaleDateString() : defaultTableNullValue}</p>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default BucketsTable;
