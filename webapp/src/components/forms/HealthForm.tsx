"use client";
import { useRef, useState } from "react";
import LoadingIcon from "@/components/LoadingIcon";
import ErrorContainer from "@/components/forms/ErrorContainer";
import { defaultSimpleError, header_internal } from "@/globals";
import ButtonContainer from "@/components/forms/ButtonContainer";
import CompletionContainer from "@/components/forms/CompletionContainer";

const Form: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [complete, setComplete] = useState<boolean>(false);
  const [error, setError] = useState<SimpleError>(defaultSimpleError);

  const handleFormSubmission = async (): Promise<void> => {
    const form = formRef.current;
    if (!form) return;

    setLoading(true);
    setComplete(false);
    setError(defaultSimpleError);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/health`, {
        method: "GET",
        headers: header_internal,
      }).then((res: any) => res.json());

      if (response.error) {
        setLoading(false);
        return setError({ error: true, message: response.message, title: "Error" });
      }

      setComplete(true);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError({ error: true, message: "An unexpected error occurred, please try again.", title: `Unexpected Error` });
    }
  };

  return (
    <form
      ref={formRef}
      className={`hyve-form ${loading ? "loading" : ""} min-h-[75px] justify-center`}
      onSubmit={(event: any) => {
        event.preventDefault();
      }}
    >
      <ButtonContainer disabled={loading} callback={handleFormSubmission} text="Submit" />

      {loading && <LoadingIcon />}
      {error.error && error.message && <ErrorContainer error={error} />}
      {complete && <CompletionContainer title="Api is up & running" />}
    </form>
  );
};

export default Form;
