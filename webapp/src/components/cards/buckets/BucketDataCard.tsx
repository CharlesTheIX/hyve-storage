"use client";
import Link from "next/link";
import Copy from "@/components/svgs/Copy";
import formatBytes from "@/lib/formatBytes";
import Document from "@/components/svgs/Document";
import Permissions from "@/lib/classes/Permissions";
import PercentageRing from "@/components/PercentageRing";
import { colors, defaultTableNullValue } from "@/globals";
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
  const { _id, name, createdAt, updatedAt, permissions, companyId, maxSize_bytes, consumption_bytes, objectCount } = data;
  const consumptionPercentage = getPercentageFromRatio(consumption_bytes || 0, maxSize_bytes || 0);

  return (
    <div className="hyve-card">
      <div className="card-head">
        <Document primaryColor={colors.white} />
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
              <strong>Max Size (KB):</strong> {maxSize_bytes ? formatBytes(maxSize_bytes, "KB") : defaultTableNullValue}
            </p>
          </li>

          <li>
            <div className="flex flex-row gap-1 items-start">
              <p>
                <strong>Consumption (KB):</strong>
              </p>

              <div className="flex flex-row gap-1 items-center">
                <p>
                  {formatBytes(consumption_bytes || 0, "KB")}/{formatBytes(maxSize_bytes || 0, "KB")}
                </p>

                <PercentageRing percentage={consumptionPercentage} size_rem={1} />
              </div>
            </div>
          </li>

          {companyId && (
            <li>
              <p>
                <strong>Owning Company:</strong>{" "}
                <Link href={`/companies/${typeof companyId === "string" ? companyId : companyId?._id}`}>
                  {typeof companyId === "string" ? companyId : companyId.name}
                </Link>
              </p>
            </li>
          )}

          <li>
            <p>
              <strong>Object Count:</strong> {objectCount || objectCount === 0 ? objectCount : defaultTableNullValue}
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

          <PermissionsWrapper permissionLevel={9}>
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
