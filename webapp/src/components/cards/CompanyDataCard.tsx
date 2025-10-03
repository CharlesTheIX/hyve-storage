import Link from "next/link";
import Document from "@/components/svgs/Document";
import { colors, defaultTableNullValue } from "@/globals";

type Props = {
  data: Partial<Company>;
};

const CompanyDataCard: React.FC<Props> = (props: Props) => {
  const { data } = props;
  const { _id, name, userIds, bucketIds, createdAt, updatedAt } = data;

  return (
    <div className="hyve-card">
      <div className="card-head">
        <Document primaryColor={colors.white} />
        <p>Company Details</p>
      </div>

      <div className="card-body flex flex-col gap-2 items-centre justify-centre">
        <ul>
          <li>
            <p>
              <strong>Name:</strong> {name || defaultTableNullValue}
            </p>
          </li>

          <li>
            <p>
              <strong>Users:</strong>
            </p>

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
          </li>

          <li>
            <p>
              <strong>Buckets:</strong> {bucketIds?.length === 0 && defaultTableNullValue}
            </p>

            {bucketIds?.length !== 0 && (
              <ul className="indent">
                {bucketIds?.map((bucket, key: number) => {
                  if (typeof bucket === "string") {
                    return (
                      <li key={key}>
                        <Link href={`/buckets/${_id}`}>{bucket}</Link>
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

export default CompanyDataCard;
