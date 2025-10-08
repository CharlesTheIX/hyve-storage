"use client";
import Table from "../lib/Table";
import Bin from "@/components/svgs/Bin";
import Copy from "@/components/svgs/Copy";
import Storage from "@/lib/classes/Storage";
import { JSX, useEffect, useState } from "react";
import Button from "@/components/buttons/Button";
import getCompanies from "@/lib/companies/getCompanies";
import { useToastContext } from "@/contexts/toastContext";
import copyContentToClipboard from "@/lib/copyContentToClipboard";
import { colors, default_null_label, default_toast_item } from "@/globals";
import { getTableHeaders, getTableMongoFilters, getTableStorageKey } from "../lib/helpers";

const type = "companies";
const storage_key = getTableStorageKey(type);

const CompaniesTable: React.FC = () => {
  const { setToastItems } = useToastContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [list, setList] = useState<Partial<Company>[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [meta, setMeta] = useState<Partial<ApiResponseMeta>>({});
  const [activeData, setActiveData] = useState<Partial<Company>>({});
  const [headers, setHeaders] = useState<TableHeader[]>(getTableHeaders(type));
  const [filters, setFilters] = useState<ApiRequestFilters>(getTableMongoFilters(type));

  const getTableBody = (td: any, h: TableHeader): JSX.Element => {
    switch (h.value) {
      case "name":
        return (
          <td>
            <p>{td.name ? td.name : default_null_label}</p>
          </td>
        );

      case "user_ids":
        return (
          <td>
            <p>{td.user_ids ? td.user_ids.length : default_null_label}</p>
          </td>
        );

      case "bucket_ids":
        return (
          <td>
            <p>{td.bucket_ids ? td.bucket_ids.length : default_null_label}</p>
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
      const res = await getCompanies(filters);
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

export default CompaniesTable;
