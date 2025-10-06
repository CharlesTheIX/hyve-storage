"use client";
import parseJSON from "@/lib/parseJSON";
import Storage from "@/lib/classes/Storage";
import { useRouter } from "next/navigation";
import getInputError from "@/lib/getInputError";
import { useRef, useState, useEffect } from "react";
import TextInput from "@/components/inputs/TextInput";
import LoadingContainer from "@/components/LoadingIcon";
import ErrorContainer from "@/components/forms/ErrorContainer";
import { defaultSimpleError, header_internal } from "@/globals";
import ButtonContainer from "@/components/forms/ButtonContainer";
import UserDropdown from "@/components/inputs/dropdowns/UserDropdown";
import CompletionContainer from "@/components/forms/CompletionContainer";

type Props = {
  redirect?: string;
};

const storageKey = "company_creation_form_data";
const CompanyCreationForm: React.FC<Props> = (props: Props) => {
  const { redirect = `/companies` } = props;
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
    setComplete(false);
    setError(defaultSimpleError);
    const formData = new FormData(form);
    const name = formData.get("name")?.toString() || "";
    const userIds = parseJSON(formData.get("userIds")?.toString()) ?? "";
    const requestData: Partial<Company> = {
      name,
      userIds: [userIds.value],
    };

    Storage.setStorageValue(storageKey, { ...requestData, userIds });

    const validationError = validateRequest(requestData);
    if (validationError.error) {
      setLoading(false);
      return setError(validationError);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/companies/create`, {
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

  const validateRequest = (data: Partial<Company>): SimpleError => {
    var invalid;
    const inputsInvalid: { [key: string]: boolean } = {};
    var message = "Please address the following errors:\n";
    Object.keys(data).map((key: string) => {
      switch (key) {
        case "name":
          invalid = getInputError("username", data[key], true);
          if (invalid.error) {
            inputsInvalid.name = invalid.error;
            message += `- Company name: ${invalid.message}\n`;
          }
          break;
        case "userIds":
          //TODO: update for an array of values
          const value = data[key] || [""];
          invalid = getInputError("mongoId", value[0], true);
          if (invalid.error) {
            inputsInvalid.userIds = invalid.error;
            message += `- User: ${invalid.message}\n`;
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
            <TextInput name="name" required={true} label="Company name" error={!!inputErrors.name} defaultValue={storageValue?.value?.name} />
          </div>

          <div className="w-full">
            <UserDropdown label="User" name="userIds" required={true} error={!!inputErrors.userIds} defaultValue={storageValue?.value?.userIds[0]} />
          </div>
        </div>

        <ButtonContainer disabled={loading} callback={handleFormSubmission} text="Submit" />
      </div>

      {loading && <LoadingContainer />}
      {error.error && error.message && <ErrorContainer error={error} />}
      {complete && <CompletionContainer title="Company Created Successfully" />}
    </form>
  );
};

export default CompanyCreationForm;
