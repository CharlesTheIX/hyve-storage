"use client";
import Link from "next/link";
import Storage from "@/lib/Storage";
import { useRouter } from "next/navigation";
import { defaultFormError } from "@/globals";
import Button from "@/components/buttons/Button";
import { useRef, useState, useEffect } from "react";
import getInputHasError from "@/lib/getInputHasError";
import TextInput from "@/components/inputs/TextInput";
import NumberInput from "@/components/inputs/NumberInput";
import LoadingContainer from "@/components/LoadingContainer";
import CompanyDropdown from "@/components/inputs/CompanyDropdown";

const storageKey = "bucket_creation_form_data";
const BucketCreationForm: React.FC = () => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<FormError>(defaultFormError);
  const [storageValue, setStorageValue] = useState<StorageValue | null>(null);
  const [inputErrors, setInputErrors] = useState<{ [key: string]: boolean }>({});

  const handleFormSubmission = async (): Promise<void> => {
    const form = formRef.current;
    if (!form) return;

    setLoading(true);
    setInputErrors({});
    setError(defaultFormError);
    const formData = new FormData(form);
    const name = formData.get("name")?.toString() || "";
    const maxSize_bytes = parseInt(formData.get("max-size")?.toString() || "0");
    const companyId = JSON.parse(formData.get("company-id")?.toString() || "");
    //TODO: update for an array of values
    const permissions = parseInt(formData.get("permissions")?.toString() || "1") as BucketPermission;
    const requestData: Partial<Bucket> = {
      name,
      maxSize_bytes,
      permissions: [permissions],
      companyId: companyId?.value,
    };

    Storage.setStorageValue(storageKey, requestData);

    const validationError = validateRequest(requestData);
    if (validationError.error) {
      setLoading(false);
      return setError(validationError);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/buckets/create`, {
        method: "PUT",
        body: JSON.stringify(requestData),
        headers: { "Content-Type": "application/json" },
      }).then((res: any) => res.json());

      if (response.error) {
        setLoading(false);
        return setError({ error: true, message: response.message, title: "Error" });
      }

      Storage.clearStorageValue(storageKey);
      router.push(`/buckets`);
    } catch (err: any) {
      setLoading(false);
      setError({ error: true, message: "An unexpected error occurred, please try again.", title: `Unexpected Error` });
    }
  };

  const validateRequest = (data: Partial<Bucket>): FormError => {
    var invalid = false;
    const inputsInvalid: { [key: string]: boolean } = {};
    var message = "Please address the following errors:\n";
    Object.keys(data).map((key: string) => {
      switch (key) {
        case "name":
          invalid = getInputHasError("name", data[key], true);
          if (invalid) {
            inputsInvalid.name = invalid;
            message += "- Ensure the name is valid.\n";
          }
          break;
        case "maxSize_bytes":
          invalid = getInputHasError("number", data[key], true);
          if (invalid) {
            inputsInvalid.maxSize_bytes = invalid;
            message += "- Ensure the max size is valid.\n";
          }
          break;
        case "permissions":
          //TODO: update for an array of values
          const value = data[key] || [0];
          invalid = getInputHasError("number", value[0], true);
          if (invalid) {
            inputsInvalid.permissions = invalid;
            message += "- Ensure the permissions is valid.\n";
          }
          break;
        case "companyId":
          invalid = getInputHasError("text", data[key], true);
          if (invalid) {
            inputsInvalid.companyId = invalid;
            message += "- Ensure the company is valid.\n";
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
        <div className="w-full">
          <TextInput name="name" required={true} label="Name" error={!!inputErrors.name} defaultValue={storageValue?.value?.name} />
        </div>

        <div className="w-full flex flex-row gap-2 items-center justify-between">
          <CompanyDropdown
            label="Company"
            required={true}
            name="company-id"
            error={!!inputErrors.companyId}
            defaultValue={storageValue?.value?.companyId}
          />

          <NumberInput
            min={1}
            max={9}
            required={true}
            name="max-size"
            label="Max Size (B)"
            error={!!inputErrors.maxSize_bytes}
            defaultValue={storageValue?.value?.maxSize_bytes || "1000000000"}
          />

          {/* //TODO: update for an array of values */}
          <NumberInput
            min={1}
            max={9}
            required={true}
            name="permissions"
            label="Permissions"
            error={!!inputErrors.permissions}
            defaultValue={storageValue?.value?.permissions[0] || "1"}
          />
        </div>

        <div className="button-container">
          <Button
            type="submission"
            disabled={loading}
            onClick={async () => {
              if (loading) return;
              await handleFormSubmission();
            }}
          >
            Update
          </Button>
        </div>
      </div>

      {loading && <LoadingContainer />}

      {error.error && error.message && (
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
      )}
    </form>
  );
};

export default BucketCreationForm;
