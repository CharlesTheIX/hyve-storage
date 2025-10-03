import Link from "next/link";
import Document from "@/components/svgs/Document";
import { colors, defaultTableNullValue } from "@/globals";

type Props = {
  data: Partial<User>;
};

const UserDataCard: React.FC<Props> = (props: Props) => {
  const { data } = props;
  const { username, firstName, surname, createdAt, updatedAt, permissions, companyId } = data;

  return (
    <div className="hyve-card">
      <div className="card-head">
        <Document primaryColor={colors.white} />
        <p>User Details</p>
      </div>

      <div className="card-body flex flex-col gap-2 items-centre justify-centre">
        <ul>
          <li>
            <p>
              <strong>Username:</strong> {username || defaultTableNullValue}
            </p>
          </li>

          <li>
            <p>
              <strong>First Name:</strong> {firstName || defaultTableNullValue}
            </p>
          </li>

          <li>
            <p>
              <strong>Surname:</strong> {surname || defaultTableNullValue}
            </p>
          </li>

          <li>
            <p>
              <strong>Company:</strong>{" "}
              <Link href={`/companies/${typeof companyId === "string" ? companyId : companyId?._id}`}>
                {companyId ? (typeof companyId === "string" ? companyId : companyId.name) : defaultTableNullValue}
              </Link>
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

export default UserDataCard;
