"use client";
type Props = {
  open: boolean;
  class_name?: string;
  children: React.ReactNode;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Modal: React.FC<Props> = (props: Props) => {
  const { open, children, setOpen, class_name = "" } = props;
  return (
    <div className={`hyve-modal ${open ? "open" : ""} ${class_name}`}>
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
