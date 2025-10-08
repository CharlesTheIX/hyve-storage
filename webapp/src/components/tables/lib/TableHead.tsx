"use client";
import { Fragment } from "react";
import Chevron from "@/components/svgs/Chevron";
import PermissionsWrapper from "@/components/PermissionsWrapper";

type Props = {
  headers: TableHeader[];
  filters: ApiRequestFilters;
  updateFilters: (filters: ApiRequestFilters) => void;
  getTableData: (filters: ApiRequestFilters) => Promise<void>;
};

const TableHead: React.FC<Props> = (props: Props) => {
  const { headers, filters, updateFilters, getTableData } = props;

  return (
    <thead>
      <tr>
        {headers.map((th: TableHeader, key: number) => {
          const className = `${th.sortable ? "sortable" : ""} ${th.sortable && filters.sort.field === th.value ? "active" : ""}`;
          const body = (
            <>
              {th.visible && (
                <th>
                  <div
                    className={`flex flex-row gap-1 items-center justify-between ${className}`}
                    onClick={() => {
                      if (!th.sortable) return;
                      const field = th.value as string;
                      const order = filters.sort.field === th.value && filters.sort.order === "asc" ? "desc" : "asc";
                      const next: ApiRequestFilters = { ...filters, sort: { field, order } };
                      updateFilters(next);
                      getTableData(next);
                    }}
                  >
                    <p>{th.label}</p>

                    {th.sortable && (
                      <Chevron size={24} direction={filters.sort.field === th.value && filters.sort.order === "desc" ? "up" : "down"} />
                    )}
                  </div>
                </th>
              )}
            </>
          );

          return th.permissions ? (
            <PermissionsWrapper permissions={th.permissions} key={key}>
              {body}
            </PermissionsWrapper>
          ) : (
            <Fragment key={key}>{body}</Fragment>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHead;
