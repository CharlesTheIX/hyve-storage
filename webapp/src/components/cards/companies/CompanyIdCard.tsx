"use client";
import Link from "next/link";
import Copy from "@/components/svgs/Copy";
import handleError from "@/lib/handleError";
import { useEffect, useState } from "react";
import Document from "@/components/svgs/Document";
import LoadingIcon from "@/components/LoadingIcon";
import { colors, defaultTableNullValue } from "@/globals";
import getCompanyById from "@/lib/companies/getCompanyById";
import PermissionsWrapper from "@/components/PermissionsWrapper";
import copyContentToClipboard from "@/lib/copyContentToClipboard";
import { ToastItem, useToastContext } from "@/contexts/toastContext";

type Props = {
  id: string;
  fields?: string[];
};

const CompanyIdCard: React.FC<Props> = (props: Props) => {
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
      const populate: string[] = ["userIds", "bucketIds"];
      const options: Partial<ApiRequestOptions> = { fields, populate };

      try {
        const res = await getCompanyById(id, options);
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
        <Document primaryColor={colors.white} />
        <p>Company Details</p>
      </div>

      <div className="card-body flex flex-col gap-2 items-centre justify-centre relative min-h-[75px]">
        {loading && <LoadingIcon size={50} />}

        {!data && !loading && <p>No data found for company ID: {id}</p>}

        {data && !loading && (
          <ul>
            {data.name && (
              <li>
                <p>
                  <strong>Name:</strong> {data.name}
                </p>
              </li>
            )}

            {data.userIds && (
              <li>
                <p>
                  <strong>Users:</strong> {data.userIds?.length === 0 && defaultTableNullValue}
                </p>

                {data.userIds.length > 0 && (
                  <ul className="indent">
                    {data.userIds?.map((user, key: number) => {
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
                              {user.username} ({user.firstName} {user.surname})
                            </Link>
                          </li>
                        );
                      }
                    })}
                  </ul>
                )}
              </li>
            )}

            {data.bucketIds && (
              <li>
                <p>
                  <strong>Buckets:</strong> {data.bucketIds?.length === 0 && defaultTableNullValue}
                </p>

                {data.bucketIds?.length > 0 && (
                  <ul className="indent">
                    {data.bucketIds?.map((bucket, key: number) => {
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

            <PermissionsWrapper permissionLevel={9}>
              {data._id && (
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
                      const copied = copyContentToClipboard(data._id || "");
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
                    <p>{data._id}</p>
                  </div>
                </li>
              )}
            </PermissionsWrapper>
          </ul>
        )}
      </div>
    </div>
  );
};

export default CompanyIdCard;
