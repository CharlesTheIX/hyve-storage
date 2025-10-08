"use client";
import parseJSON from "@/lib/parseJSON";
import Storage from "@/lib/classes/Storage";
import { useRouter } from "next/navigation";
import getInputError from "@/lib/getInputError";
import { useRef, useState, useEffect } from "react";
import TextInput from "@/components/inputs/TextInput";
import LoadingContainer from "@/components/LoadingIcon";
import ErrorContainer from "@/components/forms/ErrorContainer";
import getErrorResponseTitle from "@/lib/getErrorResponseTitle";
import ButtonContainer from "@/components/forms/ButtonContainer";
import { default_simple_error, header_internal } from "@/globals";
import UserDropdown from "@/components/inputs/dropdowns/UserDropdown";
import CompletionContainer from "@/components/forms/CompletionContainer";

type Props = {
  redirect?: string;
};

const storage_key = "company_creation_form_data";
const CompanyCreationForm: React.FC<Props> = (props: Props) => {
  const { redirect = `/companies` } = props;
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
    setComplete(false);
    setError(default_simple_error);
    const form_data = new FormData(form);
    const name = form_data.get("name")?.toString() || "";
    const user_ids = parseJSON(form_data.get("user_ids")?.toString()) ?? "";
    const request_data: Partial<Company> = {
      name,
      user_ids: [user_ids.value],
    };

    const validation_error = validateRequest(request_data);
    Storage.setStorageValue(storage_key, { ...request_data, user_ids });
    if (validation_error.error) {
      setLoading(false);
      return setError(validation_error);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/companies/create`, {
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

  const validateRequest = (data: Partial<Company>): SimpleError => {
    var invalid;
    const inputs_invalid: { [key: string]: boolean } = {};
    var message = "Please address the following errors:\n";
    Object.keys(data).map((key: string) => {
      switch (key) {
        case "name":
          invalid = getInputError("username", data[key], true);
          if (invalid.error) {
            inputs_invalid.name = invalid.error;
            message += `- Company name: ${invalid.message}\n`;
          }
          break;
        case "user_ids":
          //TODO: update for an array of values
          const value = data[key] || [""];
          invalid = getInputError("mongo_id", value[0], true);
          if (invalid.error) {
            inputs_invalid.user_ids = invalid.error;
            message += `- User: ${invalid.message}\n`;
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
            <TextInput name="name" required={true} label="Company name" error={!!inputErrors.name} default_value={storageValue?.value?.name} />
          </div>

          <div className="w-full">
            <UserDropdown
              label="User"
              name="user_ids"
              required={true}
              error={!!inputErrors.user_ids}
              default_value={storageValue?.value?.user_ids[0]}
            />
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
