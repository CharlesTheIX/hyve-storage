"use client";
import Storage from "@/lib/Storage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import handleError from "@/lib/handleError";
import getCompanies from "@/lib/getCompanies";
import Chevron from "@/components/svgs/Chevron";
import { colors, defaultTableNullValue } from "@/globals";
import LoadingContainer from "@/components/LoadingContainer";

const storageKey: string = "companies_table_headers";
const companyTableHeaders = [
  {
    value: "name",
    label: "Company Name",
    sortable: false,
    visible: true,
  },
  {
    value: "userIdCount",
    label: "User Count",
    sortable: false,
    visible: true,
  },
  {
    value: "bucketIdCount",
    label: "Bucket Count",
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

const CompaniesTable: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [list, setList] = useState<Partial<Company>[]>([]);
  const [accordionOpen, setAccordionOpen] = useState<boolean>(false);
  const [tableHeaders, setTableHeaders] = useState<TableHeader[]>(companyTableHeaders);

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
              {list.map((td: Partial<Company>, key: number) => {
                return (
                  <tr
                    key={key}
                    onClick={() => {
                      navigateTo(`/companies/${td._id}`);
                    }}
                  >
                    {tableHeaders[0].visible && (
                      <td>
                        <p>{td.name ? td.name : defaultTableNullValue}</p>
                      </td>
                    )}

                    {tableHeaders[1].visible && (
                      <td>
                        <p>{td.userIds ? td.userIds.length : defaultTableNullValue}</p>
                      </td>
                    )}

                    {tableHeaders[2].visible && (
                      <td>
                        <p>{td.bucketIds ? td.bucketIds.length : defaultTableNullValue}</p>
                      </td>
                    )}

                    {tableHeaders[3].visible && (
                      <td>
                        <p>{td.createdAt ? new Date(td.createdAt).toLocaleDateString() : defaultTableNullValue}</p>
                      </td>
                    )}

                    {tableHeaders[4].visible && (
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

export default CompaniesTable;
