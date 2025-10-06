import Link from "next/link";
type Props = {
  error: SimpleError;
};
const ErrorContainer: React.FC<Props> = (props: Props) => {
  const { error } = props;
  return (
    <div className="error-container">
      <div>
        {error.title && <h6>{error.title}</h6>}
        <p>{error.message}</p>
        <p>
          If this issue persists, please contact our support team{" "}
          <Link href="" target="_blank">
            here
          </Link>
          .
        </p>
      </div>
    </div>
  );
};
export default ErrorContainer;
