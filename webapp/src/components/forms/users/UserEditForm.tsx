"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import getInputError from "@/lib/getInputError";
import TextInput from "@/components/inputs/TextInput";
import LoadingContainer from "@/components/LoadingIcon";
import ErrorContainer from "@/components/forms/ErrorContainer";
import { defaultSimpleError, header_internal } from "@/globals";
import ButtonContainer from "@/components/forms/ButtonContainer";
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
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [complete, setComplete] = useState<boolean>(false);
  const [error, setError] = useState<SimpleError>(defaultSimpleError);
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
    const firstName = formData.get("firstName")?.toString() || "";
    const update: Partial<User> = {
      surname,
      firstName,
    };

    const validationError = validateRequest(update);
    if (validationError.error) {
      setLoading(false);
      return setError(validationError);
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

      setToastItems((prevValue) => {
        const newItem: ToastItem = {
          content: "",
          timeout: 3000,
          visible: true,
          type: "success",
          title: "User updated successfully",
        };
        const newValue = [...prevValue, newItem];
        return newValue;
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
    const inputsInvalid: { [key: string]: boolean } = {};
    var message = "Please address the following errors:\n";
    Object.keys(data).map((key: string) => {
      switch (key) {
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
            message += `- First name: ${invalid.message}\n`;
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
            <TextInput name="username" disabled={true} label="Username" defaultValue={data.username} />
          </div>

          <div className="w-full flex flex-row gap-2 items-center justify-between">
            <TextInput name="firstName" required={true} label="First name" error={!!inputErrors.firstName} defaultValue={data.firstName} />
            <TextInput name="surname" required={true} label="Surname" error={!!inputErrors.surname} defaultValue={data.surname} />
          </div>

          <div className="w-full flex flex-row gap-2 items-center justify-between">
            <TextInput
              label="Company"
              disabled={true}
              name="companyId"
              defaultValue={data.companyId ? (typeof data.companyId === "string" ? data.companyId : data.companyId.name) : undefined}
            />

            <TextInput name="permissions" disabled={true} label="Permissions" defaultValue={data.permissions?.toString()} />
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
