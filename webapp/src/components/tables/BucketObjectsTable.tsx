"use client";
import Storage from "@/lib/Storage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import handleError from "@/lib/handleError";
import formatBytes from "@/lib/formatBytes";
import Chevron from "@/components/svgs/Chevron";
import getBucketObjects from "@/lib/getBucketObjects";
import LoadingContainer from "@/components/LoadingContainer";
import { colors, defaultTableNullValue } from "@/globals";

type Props = {
  bucketId: string;
};

const storageKey: string = "buckets_objects_table_headers";
const objectTableHeaders = [
  {
    value: "name",
    label: "Name",
    sortable: false,
    visible: true,
  },
  {
    value: "size",
    label: "Size (KB)",
    sortable: false,
    visible: true,
  },
  {
    value: "etag",
    label: "Etag",
    sortable: false,
    visible: true,
  },
  {
    value: "lastModified",
    label: "Last Modified",
    sortable: false,
    visible: true,
  },
];

const BucketObjectsTable: React.FC<Props> = (props: Props) => {
  const { bucketId } = props;
  const router = useRouter();
  const [list, setList] = useState<MinioObject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [accordionOpen, setAccordionOpen] = useState<boolean>(false);
  const [tableHeaders, setTableHeaders] = useState<TableHeader[]>(objectTableHeaders);

  const errorCallback = () => {
    setLoading(false);
    setList([]);
  };

  useEffect(() => {
    const savedData = Storage.getStorageValue(storageKey);
    if (savedData && savedData.value) setTableHeaders(savedData.value);

    (async () => {
      if (!bucketId) return;
      setLoading(true);

      try {
        const res = await getBucketObjects(bucketId);
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
              {list.map((td: Partial<MinioObject>, key: number) => {
                return (
                  <tr key={key} onClick={() => {}}>
                    {tableHeaders[0].visible !== false && (
                      <td>
                        <p>{td.name || defaultTableNullValue}</p>
                      </td>
                    )}

                    {tableHeaders[1].visible !== false && (
                      <td>
                        <p>{td.size ? formatBytes(td.size, "KB") : defaultTableNullValue}</p>
                      </td>
                    )}

                    {tableHeaders[2].visible !== false && (
                      <td>
                        <p>{td.etag || defaultTableNullValue}</p>
                      </td>
                    )}

                    {tableHeaders[3].visible !== false && (
                      <td>
                        <p>{td.lastModified ? new Date(td.lastModified).toLocaleDateString() : defaultTableNullValue}</p>
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

export default BucketObjectsTable;
