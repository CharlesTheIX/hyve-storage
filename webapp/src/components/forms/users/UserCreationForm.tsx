"use client";
import parseJSON from "@/lib/parseJSON";
import Storage from "@/lib/classes/Storage";
import { useRouter } from "next/navigation";
import validateRequest from "./validateRequest";
import { useRef, useState, useEffect } from "react";
import TextInput from "@/components/inputs/TextInput";
import LoadingContainer from "@/components/LoadingIcon";
import { useToastContext } from "@/contexts/toastContext";
import ErrorContainer from "@/components/forms/ErrorContainer";
import getErrorResponseTitle from "@/lib/getErrorResponseTitle";
import ButtonContainer from "@/components/forms/ButtonContainer";
import CompletionContainer from "@/components/forms/CompletionContainer";
import CompanyDropdown from "@/components/inputs/dropdowns/CompanyDropdown";
import { default_simple_error, default_toast_item, header_internal } from "@/globals";
import PermissionsMultiDropdown from "@/components/inputs/dropdowns/PermissionsMultiDropdown";

type Props = { redirect?: string };

const storage_key = "user_creation_form_data";
const UserCreationForm: React.FC<Props> = (props: Props) => {
  const { redirect = "/users" } = props;
  const router = useRouter();
  const { setToastItems } = useToastContext();
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
    const surname = form_data.get("surname")?.toString() || "";
    const username = form_data.get("username")?.toString() || "";
    const first_name = form_data.get("first_name")?.toString() || "";
    const permissions = parseJSON(form_data.get("permissions")?.toString()) ?? [];
    const company_id = parseJSON(form_data.get("company_id")?.toString()) ?? undefined;
    const request_data: Partial<User> = {
      surname,
      username,
      first_name,
      company_id: company_id?.value,
      permissions: permissions.map((p: Option) => p.value),
    };

    const validation = validateRequest(request_data);
    setInputErrors(validation.invalid_inputs);
    Storage.setStorageValue(storage_key, { ...request_data, company_id, permissions });
    if (validation.simple_error.error) {
      setLoading(false);
      return setError(validation.simple_error);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/create`, {
        method: "PUT",
        headers: header_internal,
        body: JSON.stringify(request_data),
      }).then((res: any) => res.json());

      if (response.error) {
        setLoading(false);
        return setError({ error: true, message: response.message, title: getErrorResponseTitle(response.status) });
      }

      Storage.clearStorageValue(storage_key);
      setToastItems((prev) => {
        const item: ToastItem = {
          ...default_toast_item,
          title: "User created successfully",
        };
        const next = [...prev, item];
        return next;
      });

      if (redirect) return router.push(redirect);
      setComplete(true);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      return setError({ error: true, message: "An unexpected error occurred, please try again.", title: `Unexpected Error` });
    }
  };

  useEffect(() => {
    const saved_data = Storage.getStorageValue(storage_key);
    if (!saved_data) return;
    setStorageValue(saved_data);
  }, []);

  return (
    <form ref={form_ref} className={`hyve-form ${loading ? "loading" : ""}`} onSubmit={(event: any) => event.preventDefault()}>
      <div className="content-container">
        <div className="inputs">
          <div className="w-full">
            <TextInput
              name="username"
              required={true}
              label="Username"
              error={!!inputErrors.username}
              default_value={storageValue?.value?.username}
            />
          </div>

          <div className="w-full flex flex-row gap-2 items-center justify-between">
            <TextInput
              required={true}
              name="first_name"
              label="First name"
              error={!!inputErrors.first_name}
              default_value={storageValue?.value?.first_name}
            />

            <TextInput name="surname" required={true} label="Surname" error={!!inputErrors.surname} default_value={storageValue?.value?.surname} />
          </div>

          <div className="w-full flex flex-row gap-2 items-start justify-between">
            <CompanyDropdown
              label="Company"
              required={false}
              name="company_id"
              error={!!inputErrors.company_id}
              default_value={storageValue?.value?.company_id}
            />

            <PermissionsMultiDropdown
              required={true}
              name="permissions"
              label="Permissions"
              error={!!inputErrors.permissions}
              default_value={storageValue?.value?.permissions}
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
