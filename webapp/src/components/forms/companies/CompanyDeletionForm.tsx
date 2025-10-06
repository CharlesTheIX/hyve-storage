"use client";
import parseJSON from "@/lib/parseJSON";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { defaultSimpleError } from "@/globals";
import getInputError from "@/lib/getInputError";
import LoadingContainer from "@/components/LoadingIcon";
import ErrorContainer from "@/components/forms/ErrorContainer";
import ButtonContainer from "@/components/forms/ButtonContainer";
import deleteCompanyById from "@/lib/companies/deleteCompanyById";
import CompletionContainer from "@/components/forms/CompletionContainer";
import CompanyDropdown from "@/components/inputs/dropdowns/CompanyDropdown";

type Props = {
  redirect?: string;
};

const CompanyDeletionForm: React.FC<Props> = (props: Props) => {
  const { redirect = "/companies" } = props;
  const router = useRouter();
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
    const companyId = parseJSON(formData.get("companyId")?.toString()) ?? "";
    const requestData: Partial<Company> = {
      _id: companyId?.value,
    };

    const validationError = validateRequest(requestData);
    if (validationError.error) {
      setLoading(false);
      return setError(validationError);
    }

    try {
      const response = await deleteCompanyById(requestData._id || "");
      if (response.error) {
        setLoading(false);
        return setError({ error: true, message: response.message, title: "Error" });
      }

      if (redirect) return router.push(redirect);
      setComplete(true);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError({ error: true, message: "An unexpected error occurred, please try again.", title: `Unexpected Error` });
    }
  };

  const validateRequest = (data: Partial<Company>): SimpleError => {
    var invalid;
    const inputsInvalid: { [key: string]: boolean } = {};
    var message = "Please address the following errors:\n";
    Object.keys(data).map((key: string) => {
      switch (key) {
        case "_id":
          invalid = getInputError("mongoId", data[key], true);
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
          <div className="w-full flex flex-row gap-2 items-center justify-between">
            <CompanyDropdown label="Company" name="companyId" required={true} error={!!inputErrors.companyId} />
          </div>
        </div>

        <ButtonContainer disabled={loading} callback={handleFormSubmission} text="Submit" />
      </div>

      {loading && <LoadingContainer />}
      {error.error && error.message && <ErrorContainer error={error} />}
      {complete && <CompletionContainer title="Company Deleted Successfully" />}
    </form>
  );
};

export default CompanyDeletionForm;
