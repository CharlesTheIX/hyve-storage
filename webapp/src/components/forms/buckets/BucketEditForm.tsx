"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import getInputError from "@/lib/getInputError";
import TextInput from "@/components/inputs/TextInput";
import LoadingContainer from "@/components/LoadingIcon";
import NumberInput from "@/components/inputs/NumberInput";
import ErrorContainer from "@/components/forms/ErrorContainer";
import { defaultSimpleError, header_internal } from "@/globals";
import ButtonContainer from "@/components/forms/ButtonContainer";
import CompletionContainer from "@/components/forms/CompletionContainer";

type Props = {
  redirect?: string;
  data: Partial<Bucket>;
};

const BucketEditForm: React.FC<Props> = (props: Props) => {
  const { data, redirect = `/buckets/${data._id}` } = props;
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
    const maxSize_bytes = parseInt(formData.get("maxSize_bytes")?.toString() || "0");
    //TODO: update for an array of values
    const permissions = parseInt(formData.get("permissions")?.toString() || "1") as BucketPermission;
    const update: Partial<Bucket> = {
      maxSize_bytes,
      permissions: [permissions],
    };

    const validationError = validateRequest(update);
    if (validationError.error) {
      setLoading(false);
      return setError(validationError);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/buckets/by-id`, {
        method: "PATCH",
        headers: header_internal,
        body: JSON.stringify({ _id: data._id, update }),
      }).then((res: any) => res.json());

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

  const validateRequest = (data: Partial<Bucket>): SimpleError => {
    var invalid;
    const inputsInvalid: { [key: string]: boolean } = {};
    var message = "Please address the following errors:\n";
    Object.keys(data).map((key: string) => {
      switch (key) {
        case "maxSize_bytes":
          invalid = getInputError("number", data[key], true);
          if (invalid.error) {
            inputsInvalid.maxSize_bytes = invalid.error;
            message += `- Max size: ${invalid.message}\n`;
          }
          break;
        case "permissions":
          //TODO: update for an array of values
          const value = data[key] || [0];
          invalid = getInputError("number", value[0], true);
          if (invalid.error) {
            inputsInvalid.permissions = invalid.error;
            message += `- Permissions: ${invalid.message}\n`;
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
            <TextInput name="name" disabled={true} label="Name" defaultValue={data.name} />
          </div>

          <div className="w-full flex flex-row gap-2 items-center justify-between">
            <NumberInput
              min={1}
              max={9}
              required={true}
              label="Max size"
              name="maxSize_bytes"
              defaultValue={data.maxSize_bytes}
              error={!!inputErrors.maxSize_bytes}
            />

            {/* //TODO: update for an array of values */}
            <NumberInput
              min={1}
              max={9}
              required={true}
              name="permissions"
              label="Permissions"
              error={!!inputErrors.permissions}
              defaultValue={data.permissions ? data.permissions[0] : 1}
            />
          </div>

          <div className="w-full">
            <TextInput
              label="Company"
              disabled={true}
              name="companyId"
              defaultValue={data.companyId ? (typeof data.companyId === "string" ? data.companyId : data.companyId.name) : undefined}
            />
          </div>
        </div>

        <ButtonContainer disabled={loading} callback={handleFormSubmission} text="Update" />
      </div>

      {loading && <LoadingContainer />}
      {error.error && error.message && <ErrorContainer error={error} />}
      {complete && <CompletionContainer title="Bucket updated" />}
    </form>
  );
};

export default BucketEditForm;
