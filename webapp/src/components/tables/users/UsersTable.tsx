"use client";
import Link from "next/link";
import Table from "../lib/Table";
import Bin from "@/components/svgs/Bin";
import Copy from "@/components/svgs/Copy";
import Storage from "@/lib/classes/Storage";
import getUsers from "@/lib/users/getUsers";
import Button from "@/components/buttons/Button";
import { JSX, useEffect, useState } from "react";
import Permissions from "@/lib/classes/Permissions";
import { useToastContext } from "@/contexts/toastContext";
import getUsersByCompanyId from "@/lib/users/getUsersByCompanyId";
import copyContentToClipboard from "@/lib/copyContentToClipboard";
import { colors, default_null_label, default_toast_item } from "@/globals";
import { getTableHeaders, getTableMongoFilters, getTableStorageKey } from "../lib/helpers";

type Props = {
  company_id?: string;
  slice_limit?: number;
};

const type = "users";
const storage_key = getTableStorageKey(type);

const UsersTable: React.FC<Props> = (props: Props) => {
  const { company_id, slice_limit = 3 } = props;
  const { setToastItems } = useToastContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [list, setList] = useState<Partial<User>[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [meta, setMeta] = useState<Partial<ApiResponseMeta>>({});
  const [activeData, setActiveData] = useState<Partial<User>>({});
  const [headers, setHeaders] = useState<TableHeader[]>(getTableHeaders(type));
  const [filters, setFilters] = useState<ApiRequestFilters>(getTableMongoFilters(type));

  const getTableBody = (td: any, h: TableHeader): JSX.Element => {
    switch (h.value) {
      case "username":
        return (
          <td>
            <p>{td.username ? td.username : default_null_label}</p>
          </td>
        );

      case "first_name":
        return (
          <td>
            <p>{td.first_name ? td.first_name : default_null_label}</p>
          </td>
        );

      case "surname":
        return (
          <td>
            <p>{td.surname ? td.surname : default_null_label}</p>
          </td>
        );

      case "company_id":
        if (company_id) return <></>;
        return (
          <td className="z-2 relative">
            {td.company_id ? (
              typeof td.company_id === "string" ? (
                <Link href={`/companies/${td.company_id}`} className="link-text">
                  {td.company_id}
                </Link>
              ) : (
                <Link href={`/companies/${td.company_id._id}`} className="link-text">
                  {td.company_id.name}
                </Link>
              )
            ) : (
              <p>{default_null_label}</p>
            )}
          </td>
        );

      case "permissions":
        return (
          <td>
            {td.permissions ? (
              <p>
                {Permissions.getBucketPermissionLabels(td.permissions, [0, slice_limit]).join(", ")}
                {td.permissions.length > slice_limit && <span>{` +${td.permissions.length - slice_limit}`}</span>}
              </p>
            ) : (
              <p>{default_null_label}</p>
            )}
          </td>
        );

      case "createdAt":
        return (
          <td>
            <p>{td.createdAt ? new Date(td.createdAt).toLocaleDateString() : default_null_label}</p>
          </td>
        );

      case "updatedAt":
        return (
          <td>
            <p>{td.updatedAt ? new Date(td.updatedAt).toLocaleDateString() : default_null_label}</p>
          </td>
        );

      case "_id":
        return (
          <td>
            <div
              style={{ display: "flex" }}
              className="flex-row justify-start items-center z-2 gap-2 link-text"
              onClick={(event: any) => {
                event.preventDefault();
                event.stopPropagation();
                const copied = copyContentToClipboard(td._id || "");
                setToastItems((prev) => {
                  const item: ToastItem = {
                    ...default_toast_item,
                    content: copied.message,
                    title: copied.title || "",
                    type: copied.error ? "error" : "success",
                  };
                  const next = [...prev, item];
                  return next;
                });
              }}
            >
              <Copy size={16} primary_color={colors.green} />
              <p>{td._id ? td._id : default_null_label}</p>
            </div>
          </td>
        );

      case "delete":
        return (
          <td>
            <div className="z-2 delete-button">
              <Button
                type="remove"
                callback={() => {
                  setActiveData(td);
                  setModalOpen(true);
                }}
              >
                <Bin primary_color={colors.red} size={16} />
              </Button>
            </div>
          </td>
        );

      default:
        return <p>-</p>;
    }
  };

  const getTableData = async (filters: ApiRequestFilters): Promise<void> => {
    setLoading(true);

    try {
      var res: ApiResponse;
      if (!company_id) res = await getUsers(filters);
      else res = await getUsersByCompanyId(company_id, filters);
      if (res.error) throw new Error(res.message);
      if (res.meta) setMeta(res.meta);
      if (res.data.length > 0) setList(res.data);
      setLoading(false);
    } catch (err: any) {
      setList([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved_data = Storage.getStorageValue(storage_key);
    const saved_filters = saved_data?.value.filters || filters;
    const saved_headers = saved_data?.value.headers || headers;
    setHeaders(saved_headers);
    setFilters(saved_filters);

    (async () => await getTableData(saved_filters))();
  }, []);

  return (
    <Table
      type="users"
      list={list}
      meta={meta}
      filters={filters}
      loading={loading}
      headers={headers}
      modalOpen={modalOpen}
      activeData={activeData}
      setHeaders={setHeaders}
      setFilters={setFilters}
      setModalOpen={setModalOpen}
      getTableBody={getTableBody}
      getTableData={getTableData}
      setActiveData={setActiveData}
    />
  );
};

export default UsersTable;
