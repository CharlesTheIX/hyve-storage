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
import { colors, defaultSimpleError, defaultTableNullValue } from "@/globals";

type Props = {
  bucketId: string;
};

const type = "objects";
const storageKey = getTableStorageKey(type);
const BucketObjectsTable: React.FC<Props> = (props: Props) => {
  const { bucketId } = props;
  const router = useRouter();
  const { setToastItems } = useToastContext();
  const [list, setList] = useState<MinioObject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hover, setHover] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [activeData, setActiveData] = useState<Partial<MinioObject>>({});
  const [headers, setHeaders] = useState<TableHeader[]>(getTableHeaders(type));
  const [modalError, setModalError] = useState<SimpleError>(defaultSimpleError);

  const errorCallback = () => {
    setLoading(false);
    setList([]);
  };

  const getTableData = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await getBucketObjects(bucketId);
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

  const removeData = async (dataKey: string): Promise<void> => {
    setModalLoading(true);
    setModalError(defaultSimpleError);
    try {
      const res = await deleteBucketObjectById(dataKey);
      if (res.error) {
        setActiveData({});
        setModalLoading(false);
        return setModalError({ error: true, title: "Error", message: res.message });
      }
      setActiveData({});
      setModalOpen(false);
      setModalLoading(false);
      setModalError(defaultSimpleError);
      setToastItems((prevValue) => {
        const newItem: ToastItem = {
          content: "",
          timeout: 3000,
          visible: true,
          type: "success",
          title: "Object removed",
        };
        const newValue = [...prevValue, newItem];
        return newValue;
      });
      await getTableData();
    } catch (err: any) {
      setActiveData({});
      setModalLoading(false);
      setModalError({ error: true, title: "Error", message: err.message });
    }
  };

  useEffect(() => {
    const savedData = Storage.getStorageValue(storageKey);
    if (savedData && savedData.value) setHeaders(savedData.value);
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
                        setHeaders((prevValue) => {
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
                      navigateTo(`/buckets/${bucketId}/objects/${td.name}`);
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
                            setToastItems((prevValue) => {
                              const newItem: ToastItem = {
                                timeout: 3000,
                                visible: true,
                                content: copied.message,
                                title: copied.title || "",
                                type: copied.error ? "error" : "success",
                              };
                              const newValue = [...prevValue, newItem];
                              return newValue;
                            });
                          }}
                        >
                          <Copy size={16} primaryColor={colors.green} />
                          <p>{td.name}</p>
                        </div>
                      </td>
                    )}

                    {headers[1].visible !== false && (
                      <td>
                        <p>{td.size ? formatBytes(td.size, "KB") : defaultTableNullValue}</p>
                      </td>
                    )}

                    {headers[2].visible !== false && (
                      <td>
                        <p>{td.etag || defaultTableNullValue}</p>
                      </td>
                    )}

                    {headers[3].visible !== false && (
                      <td>
                        <p>{td.lastModified ? new Date(td.lastModified).toLocaleDateString() : defaultTableNullValue}</p>
                      </td>
                    )}

                    <PermissionsWrapper permissionLevel={9}>
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
                              <Bin primaryColor={colors.red} size={16} />
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
                      setModalError(defaultSimpleError);
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
