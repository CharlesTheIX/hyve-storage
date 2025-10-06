import Link from "next/link";
import Copy from "@/components/svgs/Copy";
import Document from "@/components/svgs/Document";
import { colors, defaultTableNullValue } from "@/globals";
import PermissionsWrapper from "@/components/PermissionsWrapper";
import copyContentToClipboard from "@/lib/copyContentToClipboard";
import { ToastItem, useToastContext } from "@/contexts/toastContext";

type Props = {
  data: Partial<Company>;
};

const CompanyDataCard: React.FC<Props> = (props: Props) => {
  const { data } = props;
  const { setToastItems } = useToastContext();
  const { _id, name, userIds, bucketIds, createdAt, updatedAt } = data;

  return (
    <div className="hyve-card">
      <div className="card-head">
        <Document primaryColor={colors.white} />
        <p>Company Details</p>
      </div>

      <div className="card-body flex flex-col gap-2 items-centre justify-centre">
        <ul>
          {name && (
            <li>
              <p>
                <strong>Name:</strong> {name}
              </p>
            </li>
          )}

          {userIds && (
            <li>
              <p>
                <strong>Users:</strong> {userIds?.length === 0 && defaultTableNullValue}
              </p>

              {userIds.length > 0 && (
                <ul className="indent">
                  {userIds?.map((user, key: number) => {
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

          {bucketIds && (
            <li>
              <p>
                <strong>Buckets:</strong> {bucketIds?.length === 0 && defaultTableNullValue}
              </p>

              {bucketIds?.length > 0 && (
                <ul className="indent">
                  {bucketIds?.map((bucket, key: number) => {
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
                <strong>Creation Date:</strong> {createdAt ? new Date(createdAt).toLocaleDateString() : defaultTableNullValue}
              </p>
            </li>
          )}

          {updatedAt && (
            <li>
              <p>
                <strong>Last Updated:</strong> {updatedAt ? new Date(updatedAt).toLocaleDateString() : defaultTableNullValue}
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

export default CompanyDataCard;
