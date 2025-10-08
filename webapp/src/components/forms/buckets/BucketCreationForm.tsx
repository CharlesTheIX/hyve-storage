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
import getErrorResponseTitle from "@/lib/getErrorResponseTitle";
import ButtonContainer from "@/components/forms/ButtonContainer";
import { default_simple_error, header_internal } from "@/globals";
import CompletionContainer from "@/components/forms/CompletionContainer";
import CompanyDropdown from "@/components/inputs/dropdowns/CompanyDropdown";

type Props = {
  redirect?: string;
};

const storage_key = "bucket_creation_form_data";
const BucketCreationForm: React.FC<Props> = (props: Props) => {
  const { redirect = `/buckets` } = props;
  const router = useRouter();
  const form_ref = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [complete, setComplete] = useState<boolean>(false);
  const [error, setError] = useState<SimpleError>(default_simple_error);
  const [storageValue, setStorageValue] = useState<StorageValue | null>(null);
  const [inputErrors, setInputErrors] = useState<{ [key: string]: boolean }>({});

  const handleFormSubmission = async (): Promise<void> => {
    const form = form_ref.current;
    if (!form) return;

    setLoading(true);
    setInputErrors({});
    setError(default_simple_error);
    const form_data = new FormData(form);
    const name = form_data.get("name")?.toString() || "";
    const company_id = parseJSON(form_data.get("company_id")?.toString()) ?? "";
    const max_size_bytes = parseInt(form_data.get("max_size_bytes")?.toString() || "0");
    const permissions = parseInt(form_data.get("permissions")?.toString() || "1") as BucketPermission;
    const request_data: Partial<Bucket> = {
      name,
      max_size_bytes,
      permissions: [permissions],
      company_id: company_id?.value,
    };

    const validation_error = validateRequest(request_data);
    Storage.setStorageValue(storage_key, { ...request_data, permissions, company_id });
    if (validation_error.error) {
      setLoading(false);
      return setError(validation_error);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/buckets/create`, {
        method: "PUT",
        headers: header_internal,
        body: JSON.stringify(request_data),
      }).then((res: any) => res.json());

      if (response.error) {
        setLoading(false);
        return setError({ error: true, message: response.message, title: getErrorResponseTitle(response.status) });
      }

      Storage.clearStorageValue(storage_key);
      if (redirect) return router.push(redirect);

      setComplete(true);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      return setError({ error: true, message: "An unexpected error occurred, please try again.", title: `Unexpected Error` });
    }
  };

  const validateRequest = (data: Partial<Bucket>): SimpleError => {
    var invalid;
    const inputs_invalid: { [key: string]: boolean } = {};
    var message = "Please address the following errors:\n";
    Object.keys(data).map((key: string) => {
      switch (key) {
        case "name":
          invalid = getInputError("name", data[key], true);
          if (invalid.error) {
            inputs_invalid.name = invalid.error;
            message += `- Company name: ${invalid.message}\n`;
          }
          break;
        case "max_size_bytes":
          invalid = getInputError("number", data[key], true);
          if (invalid.error) {
            inputs_invalid.max_size_bytes = invalid.error;
            message += `- Max size: ${invalid.message}\n`;
          }
          break;
        case "permissions":
          //TODO: update for an array of values
          const value = data[key] || [0];
          invalid = getInputError("number", value[0], true);
          if (invalid.error) {
            inputs_invalid.permissions = invalid.error;
            message += `- Permissions: ${invalid.message}\n`;
          }
          break;
        case "company_id":
          invalid = getInputError("mongo_id", data[key], true);
          if (invalid.error) {
            inputs_invalid.company_id = invalid.error;
            message += `- Company: ${invalid.message}\n`;
          }
          break;
      }
    });

    const title = "Input error";
    const error = Object.keys(inputs_invalid).length > 0;
    if (!error) message = "";
    setInputErrors(inputs_invalid);
    return { error, message, title };
  };

  useEffect(() => {
    const saved_data = Storage.getStorageValue(storage_key);
    if (!saved_data) return;
    setStorageValue(saved_data);
  }, []);

  return (
    <form
      ref={form_ref}
      className={`hyve-form ${loading ? "loading" : ""}`}
      onSubmit={(event: any) => {
        event.preventDefault();
      }}
    >
      <div className="content-container">
        <div className="inputs">
          <div className="w-full">
            <TextInput name="name" required={true} label="Bucket name" error={!!inputErrors.name} default_value={storageValue?.value?.name} />
          </div>

          <div className="w-full flex flex-row gap-2 items-center justify-between">
            <CompanyDropdown
              label="Company"
              required={true}
              name="company_id"
              error={!!inputErrors.company_id}
              default_value={storageValue?.value?.company_id}
            />

            <NumberInput
              min={1}
              max={9}
              required={true}
              name="max_size_bytes"
              label="Max Size (B)"
              error={!!inputErrors.max_size_bytes}
              default_value={storageValue?.value?.max_size_bytes || 1000000000}
            />

            {/* //TODO: update for an array of values */}
            <NumberInput
              min={1}
              max={9}
              required={true}
              name="permissions"
              label="Permissions"
              error={!!inputErrors.permissions}
              default_value={storageValue?.value?.permissions[0] || 1}
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
