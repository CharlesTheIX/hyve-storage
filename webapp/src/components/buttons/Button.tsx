"use client";
type ButtonType = "default" | "cancel" | "submission" | "link" | "remove";

type Props = {
  type?: ButtonType;
  disabled?: boolean;
  callback?: () => void;
  children: React.ReactNode;
};

const Button: React.FC<Props> = (props: Props) => {
  const { type = "default", disabled = false, children, callback = () => {} } = props;

  return (
    <button
      disabled={disabled}
      className={`hyve-button ${type}`}
      type={type === "submission" ? "submit" : "button"}
      onClick={(event: any) => {
        event.preventDefault();
        event.stopPropagation();
        callback();
      }}
    >
      {children}
    </button>
  );
};

export default Button;
