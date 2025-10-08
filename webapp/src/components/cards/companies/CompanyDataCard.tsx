"use client";
import Link from "next/link";
import Copy from "@/components/svgs/Copy";
import Document from "@/components/svgs/Document";
import { colors, default_null_label } from "@/globals";
import { useToastContext } from "@/contexts/toastContext";
import PermissionsWrapper from "@/components/PermissionsWrapper";
import copyContentToClipboard from "@/lib/copyContentToClipboard";

type Props = {
  data: Partial<Company>;
};

const CompanyDataCard: React.FC<Props> = (props: Props) => {
  const { data } = props;
  const { setToastItems } = useToastContext();
  const { _id, name, user_ids, bucket_ids, createdAt, updatedAt } = data;

  return (
    <div className="hyve-card">
      <div className="card-head">
        <Document primary_color={colors.white} />
        <p>Company Details</p>
      </div>

      <div className="card-body">
        <ul>
          <PermissionsWrapper permissions={[9]}>
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

          {name && (
            <li>
              <p>
                <strong>Name:</strong> {name}
              </p>
            </li>
          )}

          {user_ids && (
            <li>
              <p>
                <strong>Users:</strong> {user_ids?.length === 0 && default_null_label}
              </p>

              {user_ids.length > 0 && (
                <ul className="indent flex flex-row flex-wrap gap-2 items-center">
                  {user_ids?.map((user, key: number) => {
                    if (typeof user === "string") {
                      return (
                        <li key={key}>
                          <Link href={`/users/${user}`}>{user}</Link>
                        </li>
                      );
                    } else {
                      return (
                        <li key={key}>
                          <Link href={`/users/${user._id}`}>
                            {user.username} ({user.first_name} {user.surname})
                          </Link>
                        </li>
                      );
                    }
                  })}
                </ul>
              )}
            </li>
          )}

          {bucket_ids && (
            <li>
              <p>
                <strong>Buckets:</strong> {bucket_ids?.length === 0 && default_null_label}
              </p>

              {bucket_ids?.length > 0 && (
                <ul className="indent flex flex-row flex-wrap gap-2">
                  {bucket_ids?.map((bucket, key: number) => {
                    if (typeof bucket === "string") {
                      return (
                        <li key={key}>
                          <Link href={`/buckets/${bucket}`}>{bucket}</Link>
                        </li>
                      );
                    } else {
                      return (
                        <li key={key}>
                          <Link href={`/buckets/${bucket._id}`}>{bucket.name}</Link>
                        </li>
                      );
                    }
                  })}
                </ul>
              )}
            </li>
          )}

          {createdAt && (
            <li>
              <p>
                <strong>Creation Date:</strong> {createdAt ? new Date(createdAt).toLocaleDateString() : default_null_label}
              </p>
            </li>
          )}

          {updatedAt && (
            <li>
              <p>
                <strong>Last Updated:</strong> {updatedAt ? new Date(updatedAt).toLocaleDateString() : default_null_label}
              </p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CompanyDataCard;
