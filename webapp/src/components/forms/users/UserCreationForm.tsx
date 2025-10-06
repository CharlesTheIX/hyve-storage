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
import { useToastContext, ToastItem } from "@/contexts/toastContext";
import CompletionContainer from "@/components/forms/CompletionContainer";
import CompanyDropdown from "@/components/inputs/dropdowns/CompanyDropdown";
import PermissionsMultiDropdown from "@/components/inputs/dropdowns/PermissionsMultiDropdown";

type Props = { redirect?: string };

const storageKey = "user_creation_form_data";
const UserCreationForm: React.FC<Props> = (props: Props) => {
  const { redirect = "/users" } = props;
  const router = useRouter();
  const { setToastItems } = useToastContext();
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
    const surname = formData.get("surname")?.toString() || "";
    const username = formData.get("username")?.toString() || "";
    const firstName = formData.get("firstName")?.toString() || "";
    const permissions = parseJSON(formData.get("permissions")?.toString()) ?? [];
    const companyId = parseJSON(formData.get("companyId")?.toString()) ?? undefined;
    const requestData: Partial<User> = {
      surname,
      username,
      firstName,
      companyId: companyId?.value,
      permissions: permissions.map((p: Option) => p.value),
    };

    const validationError = validateRequest(requestData);
    Storage.setStorageValue(storageKey, { ...requestData, companyId, permissions });
    if (validationError.error) {
      setLoading(false);
      return setError(validationError);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/create`, {
        method: "PUT",
        headers: header_internal,
        body: JSON.stringify(requestData),
      }).then((res: any) => res.json());

      if (response.error) {
        setLoading(false);
        return setError({ error: true, message: response.message, title: "Error" });
      }

      Storage.clearStorageValue(storageKey);
      setToastItems((prevValue) => {
        const newItem: ToastItem = {
          content: "",
          timeout: 3000,
          visible: true,
          type: "success",
          title: "User created successfully",
        };
        const newValue = [...prevValue, newItem];
        return newValue;
      });

      if (redirect) return router.push(redirect);
      setComplete(true);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      return setError({ error: true, message: "An unexpected error occurred, please try again.", title: `Unexpected Error` });
    }
  };

  const validateRequest = (data: Partial<User>): SimpleError => {
    var invalid;
    const inputsInvalid: { [key: string]: boolean } = {};
    var message = "Please address the following errors:\n";

    Object.keys(data).map((key: string) => {
      switch (key) {
        case "username":
          invalid = getInputError("username", data[key], true);
          if (invalid.error) {
            inputsInvalid.username = invalid.error;
            message += `- Username: ${invalid.message}\n`;
          }
          break;

        case "surname":
          invalid = getInputError("name", data[key], true);
          if (invalid.error) {
            inputsInvalid.surname = invalid.error;
            message += `- Surname: ${invalid.message}\n`;
          }
          break;

        case "firstName":
          invalid = getInputError("name", data[key], true);
          if (invalid.error) {
            inputsInvalid.firstName = invalid.error;
            message += `- FirstName: ${invalid.message}\n`;
          }
          break;

        case "permissions":
          var err: boolean = data[key]?.length === 0;
          if (err) {
            inputsInvalid.permissions = true;
            message += `- Permissions: At least one value is required.\n`;
          }

          data[key]?.forEach((p) => {
            if (err) return;
            invalid = getInputError("number", p, true);
            if (invalid.error) {
              inputsInvalid.permissions = invalid.error;
              message += `- Permissions: ${invalid.message}\n`;
            }
          });
          break;

        case "companyId":
          invalid = getInputError("mongoId", data[key], false);
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
    <form ref={formRef} className={`hyve-form ${loading ? "loading" : ""}`} onSubmit={(event: any) => event.preventDefault()}>
      <div className="content-container">
        <div className="inputs">
          <div className="w-full">
            <TextInput name="username" required={true} label="Username" error={!!inputErrors.username} defaultValue={storageValue?.value?.username} />
          </div>

          <div className="w-full flex flex-row gap-2 items-center justify-between">
            <TextInput
              required={true}
              name="firstName"
              label="First name"
              error={!!inputErrors.firstName}
              defaultValue={storageValue?.value?.firstName}
            />

            <TextInput name="surname" required={true} label="Surname" error={!!inputErrors.surname} defaultValue={storageValue?.value?.surname} />
          </div>

          <div className="w-full flex flex-row gap-2 items-start justify-between">
            <CompanyDropdown
              label="Company"
              required={false}
              name="companyId"
              error={!!inputErrors.companyId}
              defaultValue={storageValue?.value?.companyId}
            />

            <PermissionsMultiDropdown
              required={true}
              name="permissions"
              label="Permissions"
              error={!!inputErrors.permissions}
              defaultValue={storageValue?.value?.permissions}
            />
          </div>
        </div>

        <ButtonContainer disabled={loading} callback={handleFormSubmission} text="Submit" />
      </div>

      {loading && <LoadingContainer />}
      {error.error && error.message && <ErrorContainer error={error} />}
      {complete && <CompletionContainer title="User Created Successfully" />}
    </form>
  );
};

export default UserCreationForm;
