"use client";
import Link from "next/link";
import { colors } from "@/globals";
import Copy from "@/components/svgs/Copy";
import handleError from "@/lib/handleError";
import { useEffect, useState } from "react";
import formatBytes from "@/lib/formatBytes";
import Document from "@/components/svgs/Document";
import LoadingIcon from "@/components/LoadingIcon";
import Permissions from "@/lib/classes/Permissions";
import getBucketById from "@/lib/buckets/getBucketById";
import { useToastContext } from "@/contexts/toastContext";
import PermissionsWrapper from "@/components/PermissionsWrapper";
import copyContentToClipboard from "@/lib/copyContentToClipboard";

type Props = {
  id: string;
  fields?: string[];
};

const bucket_idCard: React.FC<Props> = (props: Props) => {
  var { id, fields } = props;
  const { setToastItems } = useToastContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Partial<Bucket> | null>(null);

  const errorCallback = () => {
    setData(null);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const populate: string[] = ["company_id"];
      const filters: Partial<ApiRequestFilters> = { fields, populate };

      try {
        const res = await getBucketById(id, filters);
        if (res.error) return handleError({ message: res.message, err: res.data, callback: errorCallback });
        setData(res.data);
        setLoading(false);
      } catch (err: any) {
        return handleError({ message: err.message, err, callback: errorCallback });
      }
    })();
  }, []);

  return (
    <div className="hyve-card">
      <div className="card-head">
        <Document primary_color={colors.white} />
        <p>Bucket Details</p>
      </div>

      <div className="card-body">
        {loading && <LoadingIcon size={50} />}

        {!data && !loading && <p>No data found for bucket ID: {id}</p>}

        {data && !loading && (
          <ul>
            <PermissionsWrapper permissions={[9]}>
              {data._id && (
                <li className="flex flex-row gap-2">
                  <p>
                    <strong>_id:</strong>
                  </p>
                  <div
                    style={{ display: "flex" }}
                    className="flex-row justify-start items-center z-2 gap-2 link-text"
                    onClick={(event: any) => {
                      event.preventDefault();
                      event.stopPropagation();
                      const copied = copyContentToClipboard(data._id || "");
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
                    <p>{data._id}</p>
                  </div>
                </li>
              )}
            </PermissionsWrapper>

            {data.name && (
              <li>
                <p>
                  <strong>Name:</strong> {data.name}
                </p>
              </li>
            )}

            {data.max_size_bytes && (
              <li>
                <p>
                  <strong>Max Size (KB):</strong> {formatBytes(data.max_size_bytes, "KB")}
                </p>
              </li>
            )}

            {data.consumption_bytes && (
              <li>
                <p>
                  <strong>Consumption (KB):</strong> {formatBytes(data.consumption_bytes || 0, "KB")}/{formatBytes(data.max_size_bytes || 0, "KB")}
                </p>
              </li>
            )}

            {data.company_id && (
              <li>
                <p>
                  <strong>Company:</strong>{" "}
                  <Link href={`/companies/${typeof data.company_id === "string" ? data.company_id : data.company_id?._id}`}>
                    {typeof data.company_id === "string" ? data.company_id : data.company_id.name}
                  </Link>
                </p>
              </li>
            )}

            {data.object_count && (
              <li>
                <p>
                  <strong>Object Count:</strong> {data.object_count}
                </p>
              </li>
            )}

            {data.permissions && (
              <li>
                <strong>Permissions:</strong> {Permissions.getBucketPermissionLabels(data.permissions).join(", ")}
              </li>
            )}

            {data.createdAt && (
              <li>
                <p>
                  <strong>Creation Date:</strong> {new Date(data.createdAt).toLocaleDateString()}
                </p>
              </li>
            )}

            {data.updatedAt && (
              <li>
                <p>
                  <strong>Last Updated:</strong> {new Date(data.updatedAt).toLocaleDateString()}
                </p>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default bucket_idCard;
