"use client";
import Paginator from "./Paginator";
import TableHead from "./TableHead";
import { useRouter } from "next/navigation";
import DeletionModal from "./DeletionModal";
import TableControls from "./TableControls";
import Storage from "@/lib/classes/Storage";
import { getTableStorageKey } from "./helpers";
import { Fragment, JSX, useState } from "react";
import LoadingContainer from "@/components/LoadingIcon";
import deleteUserById from "@/lib/users/deleteUserById";
import { useToastContext } from "@/contexts/toastContext";
import getErrorResponseTitle from "@/lib/getErrorResponseTitle";
import PermissionsWrapper from "@/components/PermissionsWrapper";
import { default_simple_error, default_toast_item } from "@/globals";

type Props = {
  list: any[];
  activeData: any;
  type: TableType;
  loading: boolean;
  modalOpen: boolean;
  headers: TableHeader[];
  filters: ApiRequestFilters;
  meta: Partial<ApiResponseMeta>;
  getTableBody: (td: any, h: TableHeader) => JSX.Element;
  setActiveData: React.Dispatch<React.SetStateAction<any>>;
  getTableData: (filters: ApiRequestFilters) => Promise<void>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setHeaders: React.Dispatch<React.SetStateAction<TableHeader[]>>;
  setFilters: React.Dispatch<React.SetStateAction<ApiRequestFilters>>;
};

const Table: React.FC<Props> = (props: Props) => {
  const {
    type,
    list,
    meta,
    loading,
    filters,
    headers,
    modalOpen,
    setHeaders,
    setFilters,
    activeData,
    setModalOpen,
    getTableBody,
    getTableData,
    setActiveData,
  } = props;
  const router = useRouter();
  const { setToastItems } = useToastContext();
  const storage_key = getTableStorageKey(type);
  const [hover, setHover] = useState<number | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [modalError, setModalError] = useState<SimpleError>(default_simple_error);

  const navigate = (uri: string): void => {
    if (!uri) return;
    router.push(uri);
  };

  const removeData = async (data_key: string): Promise<void> => {
    setModalLoading(true);
    setModalError(default_simple_error);

    try {
      var res;
      switch (type) {
        case "users":
          res = await deleteUserById(data_key);
          break;

        case "companies":
          res = await deleteUserById(data_key);
          break;

        case "buckets":
          res = await deleteUserById(data_key);
          break;

        case "objects":
          res = await deleteUserById(data_key);
          break;
      }

      if (res.error) {
        setActiveData({});
        setModalLoading(false);
        return setModalError({ error: true, title: getErrorResponseTitle(res.status), message: res.message });
      }
      setActiveData({});
      setModalOpen(false);
      setModalLoading(false);
      setModalError(default_simple_error);
      setToastItems((prev) => {
        const item: ToastItem = {
          ...default_toast_item,
          title: "Data removed",
        };
        const next = [...prev, item];
        return next;
      });
      await getTableData(filters);
    } catch (err: any) {
      setActiveData({});
      setModalLoading(false);
      return setModalError({ error: true, title: `Unexpected Error`, message: err.message });
    }
  };

  const updateFilters = (filters: ApiRequestFilters): void => {
    const saved_data = { headers: headers, filters: filters };
    setFilters(filters);
    Storage.setStorageValue(storage_key, saved_data);
  };

  return (
    <div className="hyve-table">
      {!loading && list.length === 0 && <p>No data to display.</p>}

      {list.length > 0 && (
        <TableControls
          filters={filters}
          loading={loading}
          headers={headers}
          setHeaders={setHeaders}
          storage_key={storage_key}
          getTableData={getTableData}
        />
      )}

      {loading && <LoadingContainer />}

      {!loading && list.length > 0 && (
        <div className="table-container">
          <table>
            <TableHead headers={headers} filters={filters} getTableData={getTableData} updateFilters={updateFilters} />

            <tbody>
              {list.map((td: Partial<User>, key: number) => {
                return (
                  <tr
                    key={key}
                    onMouseOver={() => setHover(key)}
                    onMouseLeave={() => setHover(null)}
                    className={hover === key ? "hover" : ""}
                    onClick={() => navigate(`/${type}/${td._id}`)}
                  >
                    {headers.map((h, key) => {
                      if (!h.visible) return <Fragment key={key}></Fragment>;
                      const body = getTableBody(td, h);
                      return h.permissions ? (
                        <PermissionsWrapper permissions={h.permissions} key={key}>
                          {body}
                        </PermissionsWrapper>
                      ) : (
                        <Fragment key={key}>{body}</Fragment>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {list.length > 0 && (
        <Paginator
          filters={filters}
          list_length={list.length}
          getTableData={getTableData}
          updateFilters={updateFilters}
          collection_count={meta.collection_count || 0}
        />
      )}

      <DeletionModal
        modalOpen={modalOpen}
        modalError={modalError}
        removeData={removeData}
        modalLoading={modalLoading}
        setModalOpen={setModalOpen}
        setModalError={setModalError}
        data_key={activeData._id || ""}
      />
    </div>
  );
};

export default Table;
