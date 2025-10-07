"use client";
import Button from "./Button";
import { useState } from "react";
import Modal from "@/components/Modal";
import { useRouter } from "next/navigation";
import { default_simple_error } from "@/globals";
import LoadingIcon from "@/components/LoadingIcon";
import { useUserContext } from "@/contexts/userContext";
import deleteUserById from "@/lib/users/deleteUserById";
import deleteBucketById from "@/lib/buckets/deleteBucketById";
import ErrorContainer from "@/components/forms/ErrorContainer";
import deleteCompanyById from "@/lib/companies/deleteCompanyById";
import { useToastContext, ToastItem } from "@/contexts/toastContext";
import deleteBucketObjectById from "@/lib/buckets/deleteBucketObjectById";

type Props = {
  type: DataType;
  data_key: string;
  redirect?: string;
  class_name?: string;
  children: React.ReactNode;
};

const DeleteDataButton: React.FC<Props> = (props: Props) => {
  const { type, data_key, redirect = "", children, class_name = "" } = props;
  const router = useRouter();
  const { userData } = useUserContext();
  const { setToastItems } = useToastContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<SimpleError>(default_simple_error);

  const removeData = async (type: DataType): Promise<void> => {
    var res;
    setLoading(true);
    setError(default_simple_error);

    try {
      switch (type) {
        case "user":
          res = await deleteUserById(data_key);
          break;

        case "company":
          res = await deleteCompanyById(data_key);
          break;

        case "bucket":
          res = await deleteBucketById(data_key);
          break;

        case "object":
          res = await deleteBucketObjectById(data_key);
          break;
      }

      if (res.error) {
        setLoading(false);
        return setError({ error: true, title: "Error", message: res.message });
      }

      setToastItems((prev) => {
        const new_item: ToastItem = {
          content: "",
          timeout: 3000,
          visible: true,
          type: "success",
          title: "Data removed",
        };
        const new_value = [...prev, new_item];
        return new_value;
      });
      if (redirect) router.push(redirect);
      router.refresh();
    } catch (err: any) {
      setLoading(false);
      setError({ error: true, title: "Error", message: err.message });
    }
  };

  if (!userData.permissions?.includes(9)) return <></>;

  return (
    <>
      <Button
        type="remove"
        callback={() => {
          setModalOpen(true);
        }}
      >
        {children}
      </Button>

      <Modal open={modalOpen} setOpen={setModalOpen} class_name={class_name}>
        <>
          {loading && <LoadingIcon />}
          {error.error && !loading && (
            <>
              <ErrorContainer error={error} />{" "}
              <Button
                type="default"
                callback={() => {
                  setError(default_simple_error);
                }}
              >
                Try Again
              </Button>
            </>
          )}

          {!error.error && !loading && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 items-center">
                <h4>This action is irreversible</h4>
              </div>

              <p>This action is permanent & irreversible, are you sure you wish to continue?</p>

              <div className="flex flex-row gap-2">
                <Button
                  type="cancel"
                  callback={() => {
                    setModalOpen(false);
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="remove"
                  callback={async () => {
                    removeData(type);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </>
      </Modal>
    </>
  );
};

export default DeleteDataButton;
