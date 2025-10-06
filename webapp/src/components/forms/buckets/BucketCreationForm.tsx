"use client";
import parseJSON from "@/lib/parseJSON";
import Storage from "@/lib/classes/Storage";
import { useRouter } from "next/navigation";
import getInputError from "@/lib/getInputError";
import { useRef, useState, useEffect } from "react";
import TextInput from "@/components/inputs/TextInput";
import LoadingContainer from "@/components/LoadingIcon";
import NumberInput from "@/components/inputs/NumberInput";
import ErrorContainer from "@/components/forms/ErrorContainer";
import { defaultSimpleError, header_internal } from "@/globals";
import ButtonContainer from "@/components/forms/ButtonContainer";
import CompletionContainer from "@/components/forms/CompletionContainer";
import CompanyDropdown from "@/components/inputs/dropdowns/CompanyDropdown";

type Props = {
  redirect?: string;
};

const storageKey = "bucket_creation_form_data";
const BucketCreationForm: React.FC<Props> = (props: Props) => {
  const { redirect = `/buckets` } = props;
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [complete, setComplete] = useState<boolean>(false);
  const [error, setError] = useState<SimpleError>(defaultSimpleError);
  const [storageValue, setStorageValue] = useState<StorageValue | null>(null);
  const [inputErrors, setInputErrors] = useState<{ [key: string]: boolean }>({});

  const handleFormSubmission = async (): Promise<void> => {
    const form = formRef.current;
    if (!form) return;

    setLoading(true);
    setInputErrors({});
    setError(defaultSimpleError);
    const formData = new FormData(form);
    const name = formData.get("name")?.toString() || "";
    const companyId = parseJSON(formData.get("companyId")?.toString()) ?? "";
    const maxSize_bytes = parseInt(formData.get("maxSize_bytes")?.toString() || "0");
    //TODO: update for an array of values
    const permissions = parseInt(formData.get("permissions")?.toString() || "1") as BucketPermission;
    const requestData: Partial<Bucket> = {
      name,
      maxSize_bytes,
      permissions: [permissions],
      companyId: companyId?.value,
    };

    Storage.setStorageValue(storageKey, { ...requestData, permissions, companyId });

    const validationError = validateRequest(requestData);
    if (validationError.error) {
      setLoading(false);
      return setError(validationError);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/buckets/create`, {
        method: "PUT",
        headers: header_internal,
        body: JSON.stringify(requestData),
      }).then((res: any) => res.json());

      if (response.error) {
        setLoading(false);
        return setError({ error: true, message: response.message, title: "Error" });
      }

      Storage.clearStorageValue(storageKey);
      if (redirect) return router.push(redirect);

      setComplete(true);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError({ error: true, message: "An unexpected error occurred, please try again.", title: `Unexpected Error` });
    }
  };

  const validateRequest = (data: Partial<Bucket>): SimpleError => {
    var invalid;
    const inputsInvalid: { [key: string]: boolean } = {};
    var message = "Please address the following errors:\n";
    Object.keys(data).map((key: string) => {
      switch (key) {
        case "name":
          invalid = getInputError("name", data[key], true);
          if (invalid.error) {
            inputsInvalid.name = invalid.error;
            message += `- Company name: ${invalid.message}\n`;
          }
          break;
        case "maxSize_bytes":
          invalid = getInputError("number", data[key], true);
          if (invalid.error) {
            inputsInvalid.maxSize_bytes = invalid.error;
            message += `- Max size: ${invalid.message}\n`;
          }
          break;
        case "permissions":
          //TODO: update for an array of values
          const value = data[key] || [0];
          invalid = getInputError("number", value[0], true);
          if (invalid.error) {
            inputsInvalid.permissions = invalid.error;
            message += `- Permissions: ${invalid.message}\n`;
          }
          break;
        case "companyId":
          invalid = getInputError("mongoId", data[key], true);
          if (invalid.error) {
            inputsInvalid.companyId = invalid.error;
            message += `- Company: ${invalid.message}\n`;
          }
          break;
      }
    });

    const title = "Input error";
    const error = Object.keys(inputsInvalid).length > 0;
    if (!error) message = "";
    setInputErrors(inputsInvalid);
    return { error, message, title };
  };

  useEffect(() => {
    const savedData = Storage.getStorageValue(storageKey);
    if (!savedData) return;
    setStorageValue(savedData);
  }, []);

  return (
    <form
      ref={formRef}
      className={`hyve-form ${loading ? "loading" : ""}`}
      onSubmit={(event: any) => {
        event.preventDefault();
      }}
    >
      <div className="content-container">
        <div className="inputs">
          <div className="w-full">
            <TextInput name="name" required={true} label="Bucket name" error={!!inputErrors.name} defaultValue={storageValue?.value?.name} />
          </div>

          <div className="w-full flex flex-row gap-2 items-center justify-between">
            <CompanyDropdown
              label="Company"
              required={true}
              name="companyId"
              error={!!inputErrors.companyId}
              defaultValue={storageValue?.value?.companyId}
            />

            <NumberInput
              min={1}
              max={9}
              required={true}
              name="maxSize_bytes"
              label="Max Size (B)"
              error={!!inputErrors.maxSize_bytes}
              defaultValue={storageValue?.value?.maxSize_bytes || 1000000000}
            />

            {/* //TODO: update for an array of values */}
            <NumberInput
              min={1}
              max={9}
              required={true}
              name="permissions"
              label="Permissions"
              error={!!inputErrors.permissions}
              defaultValue={storageValue?.value?.permissions[0] || 1}
            />
          </div>
        </div>

        <ButtonContainer disabled={loading} callback={handleFormSubmission} text="Update" />
      </div>

      {loading && <LoadingContainer />}
      {error.error && error.message && <ErrorContainer error={error} />}
      {complete && <CompletionContainer title="Bucket Created Successfully" />}
    </form>
  );
};

export default BucketCreationForm;
