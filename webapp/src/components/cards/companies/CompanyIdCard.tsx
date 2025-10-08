"use client";
import Link from "next/link";
import Copy from "@/components/svgs/Copy";
import handleError from "@/lib/handleError";
import { useEffect, useState } from "react";
import Document from "@/components/svgs/Document";
import LoadingIcon from "@/components/LoadingIcon";
import { colors, default_null_label } from "@/globals";
import { useToastContext } from "@/contexts/toastContext";
import getCompanyById from "@/lib/companies/getCompanyById";
import PermissionsWrapper from "@/components/PermissionsWrapper";
import copyContentToClipboard from "@/lib/copyContentToClipboard";

type Props = {
  id: string;
  fields?: string[];
};

const company_idCard: React.FC<Props> = (props: Props) => {
  var { id, fields } = props;
  const { setToastItems } = useToastContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Partial<Company> | null>(null);

  const errorCallback = () => {
    setData(null);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const populate: string[] = ["user_ids", "bucket_ids"];
      const filters: Partial<ApiRequestFilters> = { fields, populate };

      try {
        const res = await getCompanyById(id, filters);
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
        <p>Company Details</p>
      </div>

      <div className="card-body">
        {loading && <LoadingIcon size={50} />}

        {!data && !loading && <p>No data found for company ID: {id}</p>}

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

            {data.user_ids && (
              <li>
                <p>
                  <strong>Users:</strong> {data.user_ids?.length === 0 && default_null_label}
                </p>

                {data.user_ids.length > 0 && (
                  <ul className="indent">
                    {data.user_ids?.map((user, key: number) => {
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

            {data.bucket_ids && (
              <li>
                <p>
                  <strong>Buckets:</strong> {data.bucket_ids?.length === 0 && default_null_label}
                </p>

                {data.bucket_ids?.length > 0 && (
                  <ul className="indent">
                    {data.bucket_ids?.map((bucket, key: number) => {
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

export default company_idCard;
