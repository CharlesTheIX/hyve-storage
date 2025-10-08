"use client";
import { Fragment } from "react";
import Storage from "@/lib/classes/Storage";
import Accordion from "@/components/Accordion";
import PermissionsWrapper from "@/components/PermissionsWrapper";

type Props = {
  storage_key: string;
  headers: TableHeader[];
  filters: ApiRequestFilters;
  setHeaders: React.Dispatch<React.SetStateAction<TableHeader[]>>;
};

const ColumnFilters: React.FC<Props> = (props: Props) => {
  const { headers, setHeaders, storage_key, filters } = props;
  return (
    <Accordion title="Filter Columns">
      <ul>
        {headers.map((th: TableHeader, key: number) => {
          const body = (
            <li
              className={`${th.visible ? "visible" : ""}`}
              onClick={() => {
                setHeaders((prev) => {
                  const next = prev.map((h, i) => (key === i ? { ...h, visible: !h.visible } : h));
                  const saved_data = { headers: next, filters: filters };
                  Storage.setStorageValue(storage_key, saved_data);
                  return next;
                });
              }}
            >
              <p>{th.label}</p>
            </li>
          );

          return th.permissions ? (
            <PermissionsWrapper permissions={th.permissions} key={key}>
              {body}
            </PermissionsWrapper>
          ) : (
            <Fragment key={key}>{body}</Fragment>
          );
        })}
      </ul>
    </Accordion>
  );
};

export default ColumnFilters;
