"use client";
import getUsers from "@/lib/getUsers";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import handleError from "@/lib/handleError";
import { defaultTableNullValue } from "@/globals";
import LoadingContainer from "@/components/LoadingContainer";

const UsersTable: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [list, setList] = useState<Partial<User>[]>([]);
  const [tableHeaders, setTableHeaders] = useState<string[]>(["Username", "Full Name", "Company", "Permissions", "Creation Date", "Last Updated"]);

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
            {list.map((td: Partial<User>, key: number) => {
              return (
                <tr
                  key={key}
                  onClick={() => {
                    navigateTo(`/users/${td._id}`);
                  }}
                >
                  <td>
                    <p>{td.username ? td.username : defaultTableNullValue}</p>
                  </td>

                  <td>
                    <p>{td.firstName && td.surname ? `${td.firstName} ${td.surname}` : defaultTableNullValue}</p>
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
                    <p className="link-text">{td.companyId ? (typeof td.companyId === "string" ? td.companyId : td.companyId.name) : defaultTableNullValue}</p>
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

export default UsersTable;
