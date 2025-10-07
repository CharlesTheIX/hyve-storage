"use client";
import Modal from "@/components/Modal";
import Bin from "@/components/svgs/Bin";
import Copy from "@/components/svgs/Copy";
import formatBytes from "@/lib/formatBytes";
import Storage from "@/lib/classes/Storage";
import { useRouter } from "next/navigation";
import handleError from "@/lib/handleError";
import { useEffect, useState } from "react";
import Accordion from "@/components/Accordion";
import Button from "@/components/buttons/Button";
import LoadingIcon from "@/components/LoadingIcon";
import LoadingContainer from "@/components/LoadingIcon";
import getBucketObjects from "@/lib/buckets/getBucketObjects";
import ErrorContainer from "@/components/forms/ErrorContainer";
import PermissionsWrapper from "@/components/PermissionsWrapper";
import { getTableHeaders, getTableStorageKey } from "../helpers";
import copyContentToClipboard from "@/lib/copyContentToClipboard";
import { ToastItem, useToastContext } from "@/contexts/toastContext";
import deleteBucketObjectById from "@/lib/buckets/deleteBucketObjectById";
import { colors, default_simple_error, default_null_label } from "@/globals";

type Props = {
  bucket_id: string;
};

const type = "objects";
const storage_key = getTableStorageKey(type);
const BucketObjectsTable: React.FC<Props> = (props: Props) => {
  const { bucket_id } = props;
  const router = useRouter();
  const { setToastItems } = useToastContext();
  const [list, setList] = useState<MinioObject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hover, setHover] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [activeData, setActiveData] = useState<Partial<MinioObject>>({});
  const [headers, setHeaders] = useState<TableHeader[]>(getTableHeaders(type));
  const [modalError, setModalError] = useState<SimpleError>(default_simple_error);

  const errorCallback = () => {
    setLoading(false);
    setList([]);
  };

  const getTableData = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await getBucketObjects(bucket_id);
      if (res.error) return handleError({ message: res.message, err: res.data, callback: errorCallback });
      if (res.data.length > 0) setList(res.data);
      setLoading(false);
    } catch (err: any) {
      return handleError({ message: err.message, err, callback: errorCallback });
    }
  };

  const navigateTo = (uri: string): void => {
    if (!uri) return;
    router.push(uri);
  };

  const removeData = async (data_key: string): Promise<void> => {
    setModalLoading(true);
    setModalError(default_simple_error);
    try {
      const res = await deleteBucketObjectById(data_key);
      if (res.error) {
        setActiveData({});
        setModalLoading(false);
        return setModalError({ error: true, title: "Error", message: res.message });
      }
      setActiveData({});
      setModalOpen(false);
      setModalLoading(false);
      setModalError(default_simple_error);
      setToastItems((prev) => {
        const new_item: ToastItem = {
          content: "",
          timeout: 3000,
          visible: true,
          type: "success",
          title: "Object removed",
        };
        const new_value = [...prev, new_item];
        return new_value;
      });
      await getTableData();
    } catch (err: any) {
      setActiveData({});
      setModalLoading(false);
      setModalError({ error: true, title: "Error", message: err.message });
    }
  };

  useEffect(() => {
    const saved_data = Storage.getStorageValue(storage_key);
    if (saved_data && saved_data.value) setHeaders(saved_data.value);
    (async () => await getTableData())();
  }, []);

  return (
    <div className="hyve-table">
      {loading && <LoadingContainer />}
      {!loading && list.length === 0 && <p>No data to display.</p>}
      {!loading && list.length > 0 && (
        <>
          <div className="column-filter-container">
            <Accordion title="Filter Columns">
              <ul>
                {headers.map((th: TableHeader, key: number) => {
                  return (
                    <li
                      key={th.value}
                      className={`${th.visible ? "visible" : ""}`}
                      onClick={() => {
                        setHeaders((prev) => {
                          const new_value = prev.map((h, i) => (key === i ? { ...h, visible: !h.visible } : h));
                          Storage.setStorageValue(storage_key, new_value);
                          return new_value;
                        });
                      }}
                    >
                      <p>{th.label}</p>
                    </li>
                  );
                })}
              </ul>
            </Accordion>
          </div>

          <table>
            <thead>
              <tr>
                {headers.map((th: TableHeader, key: number) => {
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
                  <tr
                    key={key}
                    className={hover === key ? "hover" : ""}
                    onMouseOver={() => {
                      setHover(key);
                    }}
                    onMouseLeave={() => {
                      setHover(null);
                    }}
                    onClick={() => {
                      navigateTo(`/buckets/${bucket_id}/objects/${td.name}`);
                    }}
                  >
                    {headers[0].visible !== false && (
                      <td>
                        <div
                          style={{ display: "flex" }}
                          className="flex-row justify-start items-center z-2 gap-2 link-text"
                          onClick={(event: any) => {
                            event.preventDefault();
                            event.stopPropagation();
                            const copied = copyContentToClipboard(td.name || "");
                            setToastItems((prev) => {
                              const new_item: ToastItem = {
                                timeout: 3000,
                                visible: true,
                                content: copied.message,
                                title: copied.title || "",
                                type: copied.error ? "error" : "success",
                              };
                              const new_value = [...prev, new_item];
                              return new_value;
                            });
                          }}
                        >
                          <Copy size={16} primary_color={colors.green} />
                          <p>{td.name}</p>
                        </div>
                      </td>
                    )}

                    {headers[1].visible !== false && (
                      <td>
                        <p>{td.size ? formatBytes(td.size, "KB") : default_null_label}</p>
                      </td>
                    )}

                    {headers[2].visible !== false && (
                      <td>
                        <p>{td.etag || default_null_label}</p>
                      </td>
                    )}

                    {headers[3].visible !== false && (
                      <td>
                        <p>{td.lastModified ? new Date(td.lastModified).toLocaleDateString() : default_null_label}</p>
                      </td>
                    )}

                    <PermissionsWrapper permission_level={9}>
                      {headers[4]?.visible && (
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
                      )}
                    </PermissionsWrapper>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <Modal open={modalOpen} setOpen={setModalOpen}>
            <>
              {modalLoading && <LoadingIcon />}
              {modalError.error && !modalLoading && (
                <>
                  <ErrorContainer error={modalError} />
                  <Button
                    type="default"
                    callback={() => {
                      setModalError(default_simple_error);
                    }}
                  >
                    Try Again
                  </Button>
                </>
              )}

              {!modalError.error && !modalLoading && (
                <div className="flex flex-col gap-2">
                  <h4>This action is irreversible</h4>

                  <p>This action is permanent & irreversible, are you sure you wish to continue?</p>

                  <div className="flex flex-row gap-2">
                    <Button
                      type="cancel"
                      callback={() => {
                        setModalOpen(false);
                      }}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="remove"
                      callback={async () => {
                        if (activeData.name) await removeData(activeData.name);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </>
          </Modal>
        </>
      )}
    </div>
  );
};

export default BucketObjectsTable;
