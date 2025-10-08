import Modal from "@/components/Modal";
import Button from "@/components/buttons/Button";
import { default_simple_error } from "@/globals";
import LoadingIcon from "@/components/LoadingIcon";
import ErrorContainer from "@/components/forms/ErrorContainer";

type Props = {
  data_key: string;
  modalOpen: boolean;
  modalLoading: boolean;
  modalError: SimpleError;
  removeData: (data_key: string) => Promise<void>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setModalError: React.Dispatch<React.SetStateAction<SimpleError>>;
};
const DeletionModal: React.FC<Props> = (props: Props) => {
  const { data_key, removeData, modalOpen, modalLoading, modalError, setModalError, setModalOpen } = props;
  return (
    <Modal open={modalOpen} setOpen={setModalOpen}>
      <>
        {modalLoading && <LoadingIcon />}
        {modalError.error && !modalLoading && (
          <>
            <ErrorContainer error={modalError} />
            <Button
              type="default"
              callback={() => {
                setModalError(default_simple_error);
              }}
            >
              Try Again
            </Button>
          </>
        )}

        {!modalError.error && !modalLoading && (
          <div className="flex flex-col gap-2">
            <h4>This action is irreversible</h4>

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
                  if (data_key) await removeData(data_key);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </>
    </Modal>
  );
};

export default DeletionModal;
