"use client";
type ButtonType = "default" | "cancel" | "submission" | "link";

type Props = {
  type?: ButtonType;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};

const Button: React.FC<Props> = (props: Props) => {
  const { type = "default", disabled = false, children, onClick = () => {} } = props;

  return (
    <button
      disabled={disabled}
      className={`hyve-button ${type}`}
      type={type === "submission" ? "submit" : "button"}
      onClick={(event: any) => {
        event.preventDefault();
        onClick();
      }}
    >
      {children}
    </button>
  );
};

export default Button;
