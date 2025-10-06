"use client";
import Modal from "@/components/Modal";
import Bin from "@/components/svgs/Bin";
import Copy from "@/components/svgs/Copy";
import formatBytes from "@/lib/formatBytes";
import Storage from "@/lib/classes/Storage";
import { useRouter } from "next/navigation";
import handleError from "@/lib/handleError";
import Accordion from "@/components/Accordion";
import Button from "@/components/buttons/Button";
import getBuckets from "@/lib/buckets/getBuckets";
import LoadingIcon from "@/components/LoadingIcon";
import Permissions from "@/lib/classes/Permissions";
import { Fragment, useEffect, useState } from "react";
import LoadingContainer from "@/components/LoadingIcon";
import PercentageRing from "@/components/PercentageRing";
import deleteBucketById from "@/lib/buckets/deleteBucketById";
import ErrorContainer from "@/components/forms/ErrorContainer";
import PermissionsWrapper from "@/components/PermissionsWrapper";
import getPercentageFromRatio from "@/lib/getPercentageFromRatio";
import copyContentToClipboard from "@/lib/copyContentToClipboard";
import { ToastItem, useToastContext } from "@/contexts/toastContext";
import getBucketsByCompanyId from "@/lib/buckets/getBucketsByCompanyId";
import { colors, defaultSimpleError, defaultTableNullValue } from "@/globals";
import { getTableHeaders, getTableMongoData, getTableStorageKey } from "../helpers";

type Props = {
  companyId?: string;
  sliceLimit?: number;
};

const type = "buckets";
const storageKey = getTableStorageKey(type);
const BucketsTable: React.FC<Props> = (props: Props) => {
  const { companyId, sliceLimit = 3 } = props;
  const router = useRouter();
  const { setToastItems } = useToastContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<Partial<Bucket>[]>([]);
  const [hover, setHover] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [activeData, setActiveData] = useState<Partial<Bucket>>({});
  const [headers, setHeaders] = useState<TableHeader[]>(getTableHeaders(type));
  const [modalError, setModalError] = useState<SimpleError>(defaultSimpleError);

  const errorCallback = () => {
    setLoading(false);
    setList([]);
  };

  const getTableData = async (): Promise<void> => {
    setLoading(true);
    const options: Partial<ApiRequestOptions> = getTableMongoData(type);
    try {
      var res;
      if (!companyId) res = await getBuckets(options);
      else res = await getBucketsByCompanyId(companyId, options);
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
      const res = await deleteBucketById(dataKey);
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
          title: "Bucket removed",
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
                  if (!!companyId && th.value == "companyId") return <Fragment key={key} />;
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
                  if (!!companyId && th.value == "companyId") return <Fragment key={key} />;
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
              {list.map((td: Partial<Bucket>, key: number) => {
                const consumptionPercentage = getPercentageFromRatio(td.consumption_bytes || 0, td.maxSize_bytes || 0);

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
                      navigateTo(`/buckets/${td._id}`);
                    }}
                  >
                    {headers[0].visible && (
                      <td>
                        <p>{td.name ? td.name : defaultTableNullValue}</p>
                      </td>
                    )}

                    {headers[1].visible && !companyId && (
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

                    {headers[2].visible && (
                      <td>
                        <p>{td.objectCount || defaultTableNullValue}</p>
                      </td>
                    )}

                    {headers[3].visible && (
                      <td>
                        <p>{td.maxSize_bytes ? formatBytes(td.maxSize_bytes, "KB") : defaultTableNullValue}</p>
                      </td>
                    )}

                    {headers[4].visible && (
                      <td>
                        <div className="flex flex-row items-center gap-2 w-full">
                          <p>
                            {formatBytes(td.consumption_bytes || 0, "KB")}/{formatBytes(td.maxSize_bytes || 0, "KB")}
                          </p>

                          <PercentageRing percentage={consumptionPercentage} size_rem={1} />
                        </div>
                      </td>
                    )}

                    {headers[5].visible && (
                      <td>
                        {td.permissions ? (
                          <>
                            {Permissions.getBucketPermissionLabels(td.permissions, [0, sliceLimit]).join(", ")}
                            {td.permissions.length > sliceLimit && <span>{` +${td.permissions.length - sliceLimit}`}</span>}
                          </>
                        ) : (
                          <p>{defaultTableNullValue}</p>
                        )}
                      </td>
                    )}

                    {headers[6].visible && (
                      <td>
                        <p>{td.createdAt ? new Date(td.createdAt).toLocaleDateString() : defaultTableNullValue}</p>
                      </td>
                    )}

                    {headers[7].visible && (
                      <td>
                        <p>{td.updatedAt ? new Date(td.updatedAt).toLocaleDateString() : defaultTableNullValue}</p>
                      </td>
                    )}

                    <PermissionsWrapper permissionLevel={9}>
                      {headers[8]?.visible && (
                        <td>
                          <div
                            style={{ display: "flex" }}
                            className="flex-row justify-start items-center z-2 gap-2 link-text"
                            onClick={(event: any) => {
                              event.preventDefault();
                              event.stopPropagation();
                              const copied = copyContentToClipboard(td._id || "");
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
                            <p>{td._id ? td._id : defaultTableNullValue}</p>
                          </div>
                        </td>
                      )}

                      {headers[9]?.visible && (
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
                        if (activeData._id) await removeData(activeData._id);
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

export default BucketsTable;
