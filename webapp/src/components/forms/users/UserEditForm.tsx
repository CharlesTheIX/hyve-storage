"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import getInputError from "@/lib/getInputError";
import TextInput from "@/components/inputs/TextInput";
import LoadingContainer from "@/components/LoadingIcon";
import ErrorContainer from "@/components/forms/ErrorContainer";
import ButtonContainer from "@/components/forms/ButtonContainer";
import { default_simple_error, header_internal } from "@/globals";
import { useToastContext, ToastItem } from "@/contexts/toastContext";
import CompletionContainer from "@/components/forms/CompletionContainer";

type Props = {
  redirect?: string;
  data: Partial<User>;
};

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
    const update: Partial<User> = {
      surname,
      first_name,
    };

    const validation_error = validateRequest(update);
    if (validation_error.error) {
      setLoading(false);
      return setError(validation_error);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/by-id`, {
        method: "PATCH",
        headers: header_internal,
        body: JSON.stringify({ _id: data._id, update }),
      }).then((res: any) => res.json());

      if (response.error) {
        setLoading(false);
        return setError({ error: true, message: response.message, title: "Error" });
      }

      setToastItems((prev) => {
        const new_item: ToastItem = {
          content: "",
          timeout: 3000,
          visible: true,
          type: "success",
          title: "User updated successfully",
        };
        const new_value = [...prev, new_item];
        return new_value;
      });

      if (redirect) return router.push(redirect);
      setComplete(true);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError({ error: true, message: "An unexpected error occurred, please try again.", title: `Unexpected Error` });
    }
  };

  const validateRequest = (data: Partial<User>): SimpleError => {
    var invalid;
    const inputs_invalid: { [key: string]: boolean } = {};
    var message = "Please address the following errors:\n";
    Object.keys(data).map((key: string) => {
      switch (key) {
        case "surname":
          invalid = getInputError("name", data[key], true);
          if (invalid.error) {
            inputs_invalid.surname = invalid.error;
            message += `- Surname: ${invalid.message}\n`;
          }
          break;
        case "first_name":
          invalid = getInputError("name", data[key], true);
          if (invalid.error) {
            inputs_invalid.first_name = invalid.error;
            message += `- First name: ${invalid.message}\n`;
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
            <TextInput name="username" disabled={true} label="Username" default_value={data.username} />
          </div>

          <div className="w-full flex flex-row gap-2 items-center justify-between">
            <TextInput name="first_name" required={true} label="First name" error={!!inputErrors.first_name} default_value={data.first_name} />
            <TextInput name="surname" required={true} label="Surname" error={!!inputErrors.surname} default_value={data.surname} />
          </div>

          <div className="w-full flex flex-row gap-2 items-center justify-between">
            <TextInput
              label="Company"
              disabled={true}
              name="company_id"
              default_value={data.company_id ? (typeof data.company_id === "string" ? data.company_id : data.company_id.name) : undefined}
            />

            <TextInput name="permissions" disabled={true} label="Permissions" default_value={data.permissions?.toString()} />
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
