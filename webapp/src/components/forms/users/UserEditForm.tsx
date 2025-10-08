"use client";
import parseJSON from "@/lib/parseJSON";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import validateRequest from "./validateRequest";
import Permissions from "@/lib/classes/Permissions";
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

type Props = { redirect?: string; data: Partial<User> };

const UserEditForm: React.FC<Props> = (props: Props) => {
  const { data, redirect = `/users/${data._id}` } = props;
  const router = useRouter();
  const { setToastItems } = useToastContext();
  const form_ref = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [complete, setComplete] = useState<boolean>(false);
  const [error, setError] = useState<SimpleError>(default_simple_error);
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
    const first_name = form_data.get("first_name")?.toString() || "";
    const permissions = parseJSON(form_data.get("permissions")?.toString()) ?? [];
    const company_id = parseJSON(form_data.get("company_id")?.toString()) ?? undefined;
    const update: Partial<User> = {
      surname,
      first_name,
      company_id: company_id?.value,
      permissions: permissions.map((p: Option) => p.value),
    };

    const validation = validateRequest(update);
    setInputErrors(validation.invalid_inputs);
    if (validation.simple_error.error) {
      setLoading(false);
      return setError(validation.simple_error);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/by-id`, {
        method: "PATCH",
        headers: header_internal,
        body: JSON.stringify({ _id: data._id, update }),
      }).then((res: any) => res.json());

      if (response.error) {
        setLoading(false);
        return setError({ error: true, message: response.message, title: getErrorResponseTitle(response.status) });
      }

      setToastItems((prev) => {
        const item: ToastItem = {
          ...default_toast_item,
          title: "User updated successfully",
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

  return (
    <form ref={form_ref} className={`hyve-form ${loading ? "loading" : ""}`} onSubmit={(event: any) => event.preventDefault()}>
      <div className="content-container">
        <div className="inputs">
          <div className="w-full">
            <TextInput name="username" disabled={true} label="Username" default_value={data.username} />
          </div>

          <div className="w-full flex flex-row gap-2 items-center justify-between">
            <TextInput name="first_name" required={true} label="First name" error={!!inputErrors.first_name} default_value={data.first_name} />
            <TextInput name="surname" required={true} label="Surname" error={!!inputErrors.surname} default_value={data.surname} />
          </div>

          <div className="w-full flex flex-row gap-2 items-center justify-between">
            <CompanyDropdown
              label="Company"
              required={false}
              name="company_id"
              error={!!inputErrors.company_id}
              default_value={
                data.company_id && typeof data.company_id !== "string"
                  ? { value: data.company_id._id as string, label: data.company_id.name as string }
                  : undefined
              }
            />

            <PermissionsMultiDropdown
              required={true}
              name="permissions"
              label="Permissions"
              error={!!inputErrors.permissions}
              default_value={Permissions.getBucketPermissionOptions(data.permissions)}
            />
          </div>
        </div>

        <ButtonContainer disabled={loading} callback={handleFormSubmission} text="Update" />
      </div>

      {loading && <LoadingContainer />}
      {error.error && error.message && <ErrorContainer error={error} />}
      {complete && <CompletionContainer title="User updated" />}
    </form>
  );
};

export default UserEditForm;
