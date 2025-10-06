"use client";
import { useRef, useState } from "react";
import getInputError from "@/lib/getInputError";
import TextInput from "@/components/inputs/TextInput";
import LoadingContainer from "@/components/LoadingIcon";
import ErrorContainer from "@/components/forms/ErrorContainer";
import { defaultSimpleError, header_internal } from "@/globals";
import ButtonContainer from "@/components/forms/ButtonContainer";
import CompletionContainer from "@/components/forms/CompletionContainer";

const UserExistsForm: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [exists, setExists] = useState<boolean>(false);
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
    const username = formData.get("username")?.toString() || "";
    const requestData: Partial<User> = { username };

    const validationError = validateRequest(requestData);
    if (validationError.error) {
      setLoading(false);
      return setError(validationError);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/exists`, {
        method: "POST",
        headers: header_internal,
        body: JSON.stringify(requestData),
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
