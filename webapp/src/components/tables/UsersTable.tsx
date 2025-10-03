"use client";
import Storage from "@/lib/Storage";
import getUsers from "@/lib/getUsers";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import handleError from "@/lib/handleError";
import Chevron from "@/components/svgs/Chevron";
import { colors, defaultTableNullValue } from "@/globals";
import LoadingContainer from "@/components/LoadingContainer";

const storageKey: string = "users_table_headers";
const userTableHeaders = [
  {
    value: "username",
    label: "Username",
    sortable: false,
    visible: true,
  },
  {
    value: "fullName",
    label: "Full Name",
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

const UsersTable: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [list, setList] = useState<Partial<User>[]>([]);
  const [accordionOpen, setAccordionOpen] = useState<boolean>(false);
  const [tableHeaders, setTableHeaders] = useState<TableHeader[]>(userTableHeaders);

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
      const populate: string[] = ["companyId"];
      const fields = ["username", "firstName", "surname", "permissions", "companyId", "createdAt", "updatedAt"];
      const options: Partial<ApiRequestOptions> = { fields, populate };

      try {
        const res = await getUsers(options);
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
                  {tableHeaders.map((th, key) => {
                    return (
                      <li
                        key={th.value}
                        className={`${th.visible ? "visible" : ""}`}
                        onClick={() => {
                          setTableHeaders((prevValue) => {
                            const newValue = prevValue.map((h, i) => (key === i ? { ...h, visible: !h.visible } : h));
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
              {list.map((td: Partial<User>, key: number) => {
                return (
                  <tr
                    key={key}
                    onClick={() => {
                      navigateTo(`/users/${td._id}`);
                    }}
                  >
                    {tableHeaders[0].visible && (
                      <td>
                        <p>{td.username ? td.username : defaultTableNullValue}</p>
                      </td>
                    )}

                    {tableHeaders[1].visible && (
                      <td>
                        <p>{td.firstName && td.surname ? `${td.firstName} ${td.surname}` : defaultTableNullValue}</p>
                      </td>
                    )}

                    {tableHeaders[2].visible && (
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

                    {tableHeaders[3].visible && (
                      <td>
                        <p>{td.permissions ? td.permissions : defaultTableNullValue}</p>
                      </td>
                    )}

                    {tableHeaders[4].visible && (
                      <td>
                        <p>{td.createdAt ? new Date(td.createdAt).toLocaleDateString() : defaultTableNullValue}</p>
                      </td>
                    )}

                    {tableHeaders[5].visible && (
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

export default UsersTable;
