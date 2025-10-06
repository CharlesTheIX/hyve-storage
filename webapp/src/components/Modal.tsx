"use client";
type Props = {
  open: boolean;
  className?: string;
  children: React.ReactNode;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Modal: React.FC<Props> = (props: Props) => {
  const { open, children, setOpen, className = "" } = props;
  return (
    <div className={`hyve-modal ${open ? "open" : ""} ${className}`}>
      <div
        className="modal-background"
        onClick={(event: any) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
        }}
      />
      <div className="content-container">{children}</div>
    </div>
  );
};

export default Modal;
