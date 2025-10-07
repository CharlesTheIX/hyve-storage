"use client";
import parseJSON from "@/lib/parseJSON";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import getInputError from "@/lib/getInputError";
import { default_simple_error } from "@/globals";
import deleteUserById from "@/lib/users/deleteUserById";
import LoadingContainer from "@/components/LoadingIcon";
import ErrorContainer from "@/components/forms/ErrorContainer";
import ButtonContainer from "@/components/forms/ButtonContainer";
import { useToastContext, ToastItem } from "@/contexts/toastContext";
import UserDropdown from "@/components/inputs/dropdowns/UserDropdown";
import CompletionContainer from "@/components/forms/CompletionContainer";

type Props = {
  redirect?: string;
};

const UserDeletionForm: React.FC<Props> = (props: Props) => {
  const { redirect = "/users" } = props;
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
    const user_id = parseJSON(form_data.get("user_id")?.toString()) ?? "";
    const request_data: Partial<User> = {
      _id: user_id?.value,
    };

    const validation_error = validateRequest(request_data);
    if (validation_error.error) {
      setLoading(false);
      return setError(validation_error);
    }

    try {
      const response = await deleteUserById(request_data._id || "");
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
          title: "User deleted successfully",
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
        case "_id":
          invalid = getInputError("mongo_id", data[key], true);
          if (invalid.error) {
            inputs_invalid.user_id = invalid.error;
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
          <div className="w-full flex flex-row gap-2 items-center justify-between">
            <UserDropdown label="User" name="user_id" required={true} error={!!inputErrors.user_id} />
          </div>
        </div>

        <ButtonContainer disabled={loading} callback={handleFormSubmission} text="Submit" />
      </div>

      {loading && <LoadingContainer />}
      {error.error && error.message && <ErrorContainer error={error} />}
      {complete && <CompletionContainer title="User Deleted Successfully" />}
    </form>
  );
};

export default UserDeletionForm;
