"use client";
import Link from "next/link";
import { colors } from "@/globals";
import Copy from "@/components/svgs/Copy";
import Document from "@/components/svgs/Document";
import Permissions from "@/lib/classes/Permissions";
import PermissionsWrapper from "@/components/PermissionsWrapper";
import copyContentToClipboard from "@/lib/copyContentToClipboard";
import { ToastItem, useToastContext } from "@/contexts/toastContext";

type Props = {
  data: Partial<User>;
};

const UserDataCard: React.FC<Props> = (props: Props) => {
  const { data } = props;
  const { setToastItems } = useToastContext();
  const { _id, username, first_name, surname, createdAt, updatedAt, permissions, company_id } = data;

  return (
    <div className="hyve-card">
      <div className="card-head">
        <Document primary_color={colors.white} />
        <p>User Details</p>
      </div>

      <div className="card-body flex flex-col gap-2 items-centre justify-centre">
        <ul>
          {username && (
            <li>
              <p>
                <strong>Username:</strong> {username}
              </p>
            </li>
          )}

          {first_name && (
            <li>
              <p>
                <strong>First Name:</strong> {first_name}
              </p>
            </li>
          )}

          {surname && (
            <li>
              <p>
                <strong>Surname:</strong> {surname}
              </p>
            </li>
          )}

          {company_id && (
            <li>
              <p>
                <strong>Company:</strong>{" "}
                <Link href={`/companies/${typeof company_id === "string" ? company_id : company_id?._id}`}>
                  {typeof company_id === "string" ? company_id : company_id.name}
                </Link>
              </p>
            </li>
          )}

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

export default UserDataCard;
