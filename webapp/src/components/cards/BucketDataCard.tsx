import Link from "next/link";
import formatBytes from "@/lib/formatBytes";
import Document from "@/components/svgs/Document";
import PercentageRing from "@/components/PercentageRing";
import { colors, defaultTableNullValue } from "@/globals";
import getPercentageFromRatio from "@/lib/getPercentageFromRatio";

type Props = {
  data: Partial<Bucket>;
};

const BucketDataCard: React.FC<Props> = (props: Props) => {
  const { data } = props;
  const { name, createdAt, updatedAt, permissions, companyId, maxSize_bytes, consumption_bytes, objectCount } = data;
  const consumptionPercentage = getPercentageFromRatio(consumption_bytes || 0, maxSize_bytes || 0);

  return (
    <div className="hyve-card">
      <div className="card-head">
        <Document primaryColor={colors.white} />
        <p>Bucket Details</p>
      </div>

      <div className="card-body flex flex-col gap-2 items-centre justify-centre">
        <ul>
          <li>
            <p>
              <strong>name:</strong> {name || defaultTableNullValue}
            </p>
          </li>

          <li>
            <p>
              <strong>Max Size (GB):</strong> {maxSize_bytes ? formatBytes(maxSize_bytes, "GB") : defaultTableNullValue}
            </p>
          </li>

          <li>
            <div className="flex flex-row gap-1 items-start">
              <p>
                <strong>Consumption (GB):</strong>
              </p>

              {maxSize_bytes && consumption_bytes ? (
                <div className="flex flex-row items-center justify-between w-full">
                  <p>
                    {formatBytes(consumption_bytes || 0, "KB")}/{formatBytes(maxSize_bytes || 0, "KB")}
                  </p>
                  <PercentageRing percentage={consumptionPercentage} size_rem={1} />
                </div>
              ) : (
                <p>{defaultTableNullValue}</p>
              )}
            </div>
          </li>

          <li>
            <p>
              <strong>Owning Company:</strong>{" "}
              <Link href={`/companies/${typeof companyId === "string" ? companyId : companyId?._id}`}>
                {companyId ? (typeof companyId === "string" ? companyId : companyId.name) : defaultTableNullValue}
              </Link>
            </p>
          </li>

          <li>
            <p>
              <strong>Object Count:</strong> {objectCount || defaultTableNullValue}
            </p>
          </li>

          <li>
            <p>
              <strong>Permissions:</strong> {permissions || defaultTableNullValue}
            </p>
          </li>

          <li>
            <p>
              <strong>Creation Date:</strong> {createdAt ? new Date(createdAt).toLocaleDateString() : defaultTableNullValue}
            </p>
          </li>

          <li>
            <p>
              <strong>Last Updated:</strong> {updatedAt ? new Date(updatedAt).toLocaleDateString() : defaultTableNullValue}
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BucketDataCard;
