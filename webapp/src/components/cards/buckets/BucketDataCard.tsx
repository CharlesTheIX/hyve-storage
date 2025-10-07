"use client";
import Link from "next/link";
import Copy from "@/components/svgs/Copy";
import formatBytes from "@/lib/formatBytes";
import Document from "@/components/svgs/Document";
import Permissions from "@/lib/classes/Permissions";
import { colors, default_null_label } from "@/globals";
import PercentageRing from "@/components/PercentageRing";
import PermissionsWrapper from "@/components/PermissionsWrapper";
import copyContentToClipboard from "@/lib/copyContentToClipboard";
import getPercentageFromRatio from "@/lib/getPercentageFromRatio";
import { ToastItem, useToastContext } from "@/contexts/toastContext";

type Props = {
  data: Partial<Bucket>;
};

const BucketDataCard: React.FC<Props> = (props: Props) => {
  const { data } = props;
  const { setToastItems } = useToastContext();
  const { _id, name, createdAt, updatedAt, permissions, company_id, max_size_bytes, consumption_bytes, object_count } = data;
  const consumption_percentage = getPercentageFromRatio(consumption_bytes || 0, max_size_bytes || 0);

  return (
    <div className="hyve-card">
      <div className="card-head">
        <Document primary_color={colors.white} />
        <p>Bucket Details</p>
      </div>

      <div className="card-body flex flex-col gap-2 items-centre justify-centre">
        <ul>
          {name && (
            <li>
              <p>
                <strong>name:</strong> {name}
              </p>
            </li>
          )}

          <li>
            <p>
              <strong>Max Size (KB):</strong> {max_size_bytes ? formatBytes(max_size_bytes, "KB") : default_null_label}
            </p>
          </li>

          <li>
            <div className="flex flex-row gap-1 items-start">
              <p>
                <strong>Consumption (KB):</strong>
              </p>

              <div className="flex flex-row gap-1 items-center">
                <p>
                  {formatBytes(consumption_bytes || 0, "KB")}/{formatBytes(max_size_bytes || 0, "KB")}
                </p>

                <PercentageRing percentage={consumption_percentage} size_rem={1} />
              </div>
            </div>
          </li>

          {company_id && (
            <li>
              <p>
                <strong>Owning Company:</strong>{" "}
                <Link href={`/companies/${typeof company_id === "string" ? company_id : company_id?._id}`}>
                  {typeof company_id === "string" ? company_id : company_id.name}
                </Link>
              </p>
            </li>
          )}

          <li>
            <p>
              <strong>Object Count:</strong> {object_count || object_count === 0 ? object_count : default_null_label}
            </p>
          </li>

          {permissions && (
            <li>
              <p>
                <strong>Permissions:</strong> {Permissions.getBucketPermissionLabels(permissions).join(", ")}
              </p>
            </li>
          )}

          {createdAt && (
            <li>
              <p>
                <strong>Creation Date:</strong> {new Date(createdAt).toLocaleDateString()}
              </p>
            </li>
          )}

          {updatedAt && (
            <li>
              <p>
                <strong>Last Updated:</strong> {new Date(updatedAt).toLocaleDateString()}
              </p>
            </li>
          )}

          <PermissionsWrapper permission_level={9}>
            <li className="flex flex cold gap-2 items-center">
              <p>
                <strong>_id:</strong>
              </p>
              <div
                style={{ display: "flex" }}
                className="flex-row justify-start items-center z-2 gap-2 link-text"
                onClick={(event: any) => {
                  event.preventDefault();
                  event.stopPropagation();
                  const copied = copyContentToClipboard(_id || "");
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
                <p>{_id}</p>
              </div>
            </li>
          </PermissionsWrapper>
        </ul>
      </div>
    </div>
  );
};

export default BucketDataCard;
