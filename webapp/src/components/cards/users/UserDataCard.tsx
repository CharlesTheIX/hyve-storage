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
  const { _id, username, firstName, surname, createdAt, updatedAt, permissions, companyId } = data;

  return (
    <div className="hyve-card">
      <div className="card-head">
        <Document primaryColor={colors.white} />
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

          {firstName && (
            <li>
              <p>
                <strong>First Name:</strong> {firstName}
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

          {companyId && (
            <li>
              <p>
                <strong>Company:</strong>{" "}
                <Link href={`/companies/${typeof companyId === "string" ? companyId : companyId?._id}`}>
                  {typeof companyId === "string" ? companyId : companyId.name}
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

export default UserDataCard;
