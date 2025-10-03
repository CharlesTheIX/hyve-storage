"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { defaultFormError } from "@/globals";
import Button from "@/components/buttons/Button";
import getInputHasError from "@/lib/getInputHasError";
import TextInput from "@/components/inputs/TextInput";
import EmailInput from "@/components/inputs/EmailInput";
import SelectInput from "@/components/inputs/SelectInput";
import LoadingContainer from "@/components/LoadingContainer";
import TextareaInput from "@/components/inputs/TextareaInput";
import TelephoneInput from "@/components/inputs/TelephoneInput";

type RequestData = {
  email: string;
  fullname: string;
  queryType?: string;
  companyName?: string;
  telephoneNumber?: string;
  additionalInformation?: string;
};

const ContactForm: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [complete, setComplete] = useState<boolean>(false);
  const [error, setError] = useState<FormError>(defaultFormError);
  const [inputErrors, setInputErrors] = useState<{ [key: string]: boolean }>({});
  const queryTypeOptions: Option[] = [
    { label: "Type 1", value: "type_1" },
    { label: "Type 2", value: "type_2" },
    { label: "Type 3", value: "type_3" },
  ];

  const handleFormSubmission = async (): Promise<void> => {
    const form = formRef.current;
    if (!form) return;

    setLoading(true);
    setInputErrors({});
    setError(defaultFormError);
    const formData = new FormData(form);
    const email = formData.get("email")?.toString() || "";
    const fullname = formData.get("fullname")?.toString() || "";
    const companyName = formData.get("companyName")?.toString() || "";
    const telephoneNumber = formData.get("telephoneNumber")?.toString() || "";
    const additionalInformation = formData.get("additionalInformation")?.toString() || "";
    const queryType = JSON.parse(formData.get("queryType")?.toString() || "").value || "";
    const requestData: RequestData = {
      email,
      fullname,
      queryType,
      companyName,
      telephoneNumber,
      additionalInformation,
    };

    const validationError = validateRequest(requestData);
    if (validationError.error) {
      setLoading(false);
      return setError(validationError);
    }

    try {
      //TODO: implement the create lead endpoint if / when needed
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}api/forms/create-lead`, {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: { "Content-Type": "application/json" },
      }).then((res: any) => res.json());

      if (response.error) {
        setLoading(false);
        return setError({ error: true, message: response.message, title: "Error" });
      }

      setLoading(false);
      setComplete(true);
    } catch (err: any) {
      setLoading(false);
      setError({ error: true, message: "An unexpected error occurred, please try again.", title: `Unexpected Error` });
    }
  };

  const validateRequest = (data: RequestData): FormError => {
    var invalid = false;
    const inputsInvalid: { [key: string]: boolean } = {};
    var message = "Please address the following errors:\n";
    Object.keys(data).map((key: string) => {
      switch (key) {
        case "email":
          invalid = getInputHasError("email", data[key], true);
          if (invalid) {
            inputsInvalid.email = invalid;
            message += "- A valid email is required.\n";
          }
          break;
        case "fullname":
          invalid = getInputHasError("name", data[key], true);
          if (invalid) {
            inputsInvalid.fullname = invalid;
            message += "- A valid fullname is required.\n";
          }
          break;
        case "companyName":
          invalid = getInputHasError("text", data[key]);
          if (invalid) {
            inputsInvalid.companyName = invalid;
            message += "- Ensure the company name is valid.\n";
          }
          break;
        case "telephoneNumber":
          invalid = getInputHasError("telephone", data[key], false);
          if (invalid) {
            inputsInvalid.telephoneNumber = invalid;
            message += "- Ensure the telephone number is valid.\n";
          }
          break;
        case "additionalInformation":
          invalid = getInputHasError("text", data[key], false);
          if (invalid) {
            inputsInvalid.additionalInformation = invalid;
            message += "- Ensure the additional information is valid.\n";
          }
          break;
        case "queryType":
          invalid = getInputHasError("text", data[key], true);
          if (invalid) {
            inputsInvalid.queryType = invalid;
            message += "- Ensure the query type is valid.\n";
          }
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
      onSubmit={async (event: any) => {
        event.preventDefault();
        if (loading) return;
        await handleFormSubmission();
      }}
    >
      {complete ? (
        <div className="completion-container">
          <div>
            <h6>Inquiry Sent</h6>
            <p>Your inquiry has been sent to Hyve representative ans will be in contact with you as soon as possible.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="content-container">
            <div className="flex flex-row gap-2 justify-between">
              <TextInput name="fullname" required={true} label="Full name" error={!!inputErrors.fullname} />
              <TextInput name="companyName" required={false} label="Company name" error={!!inputErrors.companyName} />
            </div>

            <div className="flex flex-row gap-2 justify-between w-full">
              <TelephoneInput name="telephoneNumber" required={false} label="Telephone number" error={!!inputErrors.telephoneNumber} />
              <EmailInput name="email" required={true} label="Email" error={!!inputErrors.email} />
            </div>

            <div className="w-full">
              <SelectInput name="queryType" required={true} label="Query type" error={!!inputErrors.queryType} options={queryTypeOptions} />
            </div>

            <div className="w-full">
              <TextareaInput
                required={false}
                name="additionalInformation"
                error={!!inputErrors.additionalInformation}
                placeholder="Please share information about your requirements..."
              />
            </div>

            <div className="button-container">
              <Button onClick={handleFormSubmission} disabled={loading}>
                <p>Get in touch</p>
              </Button>
            </div>
          </div>

          {loading && <LoadingContainer />}

          {error.error && error.message && (
            <div className="error-container">
              <div>
                {error.title && <h6>{error.title}</h6>}

                <p>{error.message}</p>

                <p>
                  If this issue persists, please contact our support team{" "}
                  <Link href="" target="_blank">
                    here
                  </Link>
                  .
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </form>
  );
};

export default ContactForm;
