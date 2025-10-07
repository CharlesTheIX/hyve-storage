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
import { colors, default_simple_error, default_null_label } from "@/globals";
import { getTableHeaders, getTableMongoData, getTableStorageKey } from "../helpers";

type Props = {
  company_id?: string;
  slice_limit?: number;
};

const type = "buckets";
const storage_key = getTableStorageKey(type);
const BucketsTable: React.FC<Props> = (props: Props) => {
  const { company_id, slice_limit = 3 } = props;
  const router = useRouter();
  const { setToastItems } = useToastContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<Partial<Bucket>[]>([]);
  const [hover, setHover] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [activeData, setActiveData] = useState<Partial<Bucket>>({});
  const [headers, setHeaders] = useState<TableHeader[]>(getTableHeaders(type));
  const [modalError, setModalError] = useState<SimpleError>(default_simple_error);

  const errorCallback = () => {
    setLoading(false);
    setList([]);
  };

  const getTableData = async (): Promise<void> => {
    setLoading(true);
    const filters: Partial<ApiRequestFilters> = getTableMongoData(type);
    try {
      var res;
      if (!company_id) res = await getBuckets(filters);
      else res = await getBucketsByCompanyId(company_id, filters);
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
      const res = await deleteBucketById(data_key);
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
          title: "Bucket removed",
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
                  if (!!company_id && th.value == "company_id") return <Fragment key={key} />;
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
                  if (!!company_id && th.value == "company_id") return <Fragment key={key} />;
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
                const consumption_percentage = getPercentageFromRatio(td.consumption_bytes || 0, td.max_size_bytes || 0);

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
                        <p>{td.name ? td.name : default_null_label}</p>
                      </td>
                    )}

                    {headers[1].visible && !company_id && (
                      <td
                        className="z-2 relative"
                        onClick={(event: any) => {
                          if (!td.company_id) return;
                          event.stopPropagation();
                          const uri = `/companies/${typeof td.company_id === "string" ? td.company_id : td.company_id._id}`;
                          navigateTo(uri);
                        }}
                      >
                        {td.company_id ? (
                          typeof td.company_id === "string" ? (
                            <p className="link-text">{td.company_id}</p>
                          ) : (
                            <p className="link-text">{td.company_id.name}</p>
                          )
                        ) : (
                          <p>{default_null_label}</p>
                        )}
                      </td>
                    )}

                    {headers[2].visible && (
                      <td>
                        <p>{td.object_count || default_null_label}</p>
                      </td>
                    )}

                    {headers[3].visible && (
                      <td>
                        <p>{td.max_size_bytes ? formatBytes(td.max_size_bytes, "KB") : default_null_label}</p>
                      </td>
                    )}

                    {headers[4].visible && (
                      <td>
                        <div className="flex flex-row items-center gap-2 w-full">
                          <p>
                            {formatBytes(td.consumption_bytes || 0, "KB")}/{formatBytes(td.max_size_bytes || 0, "KB")}
                          </p>

                          <PercentageRing percentage={consumption_percentage} size_rem={1} />
                        </div>
                      </td>
                    )}

                    {headers[5].visible && (
                      <td>
                        {td.permissions ? (
                          <>
                            {Permissions.getBucketPermissionLabels(td.permissions, [0, slice_limit]).join(", ")}
                            {td.permissions.length > slice_limit && <span>{` +${td.permissions.length - slice_limit}`}</span>}
                          </>
                        ) : (
                          <p>{default_null_label}</p>
                        )}
                      </td>
                    )}

                    {headers[6].visible && (
                      <td>
                        <p>{td.createdAt ? new Date(td.createdAt).toLocaleDateString() : default_null_label}</p>
                      </td>
                    )}

                    {headers[7].visible && (
                      <td>
                        <p>{td.updatedAt ? new Date(td.updatedAt).toLocaleDateString() : default_null_label}</p>
                      </td>
                    )}

                    <PermissionsWrapper permission_level={9}>
                      {headers[8]?.visible && (
                        <td>
                          <div
                            style={{ display: "flex" }}
                            className="flex-row justify-start items-center z-2 gap-2 link-text"
                            onClick={(event: any) => {
                              event.preventDefault();
                              event.stopPropagation();
                              const copied = copyContentToClipboard(td._id || "");
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
                            <p>{td._id ? td._id : default_null_label}</p>
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
