"use client";
import Link from "next/link";
import Storage from "@/lib/Storage";
import { useRouter } from "next/navigation";
import Button from "@/components/buttons/Button";
import { useRef, useState, useEffect } from "react";
import getInputHasError from "@/lib/getInputHasError";
import TextInput from "@/components/inputs/TextInput";
import LoadingContainer from "@/components/LoadingContainer";
import { apiPermissions, defaultFormError } from "@/globals";
import PasswordInput from "@/components/inputs/PasswordInput";
import UserDropdown from "../inputs/UserDropdown";

const storageKey = "company_creation_form_data";
const CompanyCreationForm: React.FC = () => {
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
    const userIds = JSON.parse(formData.get("user-id")?.toString() || "");
    const requestData: Partial<Company> = {
      name,
      userIds: [userIds.value],
    };

    Storage.setStorageValue(storageKey, requestData);

    const validationError = validateRequest(requestData);
    if (validationError.error) {
      setLoading(false);
      return setError(validationError);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/companies/create`, {
        method: "PUT",
        body: JSON.stringify(requestData),
        headers: { "Content-Type": "application/json" },
      }).then((res: any) => res.json());

      if (response.error) {
        setLoading(false);
        return setError({ error: true, message: response.message, title: "Error" });
      }

      Storage.clearStorageValue(storageKey);
      router.push(`/companies`);
    } catch (err: any) {
      setLoading(false);
      setError({ error: true, message: "An unexpected error occurred, please try again.", title: `Unexpected Error` });
    }
  };

  const validateRequest = (data: Partial<Company>): FormError => {
    var invalid = false;
    const inputsInvalid: { [key: string]: boolean } = {};
    var message = "Please address the following errors:\n";
    Object.keys(data).map((key: string) => {
      switch (key) {
        case "name":
          invalid = getInputHasError("text", data[key], true);
          if (invalid) {
            inputsInvalid.name = invalid;
            message += "- Ensure the name is valid.\n";
          }
          break;
        case "userIds":
          //TODO: update for an array of values
          const value = data[key] || [""];
          invalid = getInputHasError("text", value[0], true);
          if (invalid) {
            inputsInvalid.userIds = invalid;
            message += "- Ensure the user id valid.\n";
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
        <div className="w-full flex flex-row gap-2 items-center justify-between">
          <TextInput name="name" required={true} label="Name" error={!!inputErrors.name} defaultValue={storageValue?.value?.name} />

          <UserDropdown label="User" name="user-id" required={true} error={!!inputErrors.userIds} defaultValue={storageValue?.value?.userIds[0]} />
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
            Submit
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

export default CompanyCreationForm;
