"use client";
import { useRef, useState } from "react";
import getInputError from "@/lib/getInputError";
import TextInput from "@/components/inputs/TextInput";
import LoadingContainer from "@/components/LoadingIcon";
import ErrorContainer from "@/components/forms/ErrorContainer";
import ButtonContainer from "@/components/forms/ButtonContainer";
import { default_simple_error, header_internal } from "@/globals";
import CompletionContainer from "@/components/forms/CompletionContainer";

const UserExistsForm: React.FC = () => {
  const form_ref = useRef<HTMLFormElement>(null);
  const [exists, setExists] = useState<boolean>(false);
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
    const username = form_data.get("username")?.toString() || "";
    const request_data: Partial<User> = { username };

    const validation_error = validateRequest(request_data);
    if (validation_error.error) {
      setLoading(false);
      return setError(validation_error);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/exists`, {
        method: "POST",
        headers: header_internal,
        body: JSON.stringify(request_data),
      }).then((res: any) => res.json());

      if (response.error) {
        setLoading(false);
        return setError({ error: true, message: response.message, title: "Error" });
      }

      setComplete(true);
      setLoading(false);
      setExists(response.data);
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
        case "username":
          invalid = getInputError("username", data[key], true);
          if (invalid.error) {
            inputs_invalid.username = invalid.error;
            message += `- Username: ${invalid.message}\n`;
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
            <TextInput name="username" required={true} label="Username" error={!!inputErrors.username} />
          </div>
        </div>

        <ButtonContainer disabled={loading} callback={handleFormSubmission} text="Submit" />
      </div>

      {loading && <LoadingContainer />}
      {error.error && error.message && <ErrorContainer error={error} />}
      {complete && <CompletionContainer title={`Username does${!exists ? " not " : " "}Exists`} />}
    </form>
  );
};

export default UserExistsForm;
