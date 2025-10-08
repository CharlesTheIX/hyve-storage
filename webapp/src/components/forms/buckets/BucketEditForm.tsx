"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import getInputError from "@/lib/getInputError";
import TextInput from "@/components/inputs/TextInput";
import LoadingContainer from "@/components/LoadingIcon";
import NumberInput from "@/components/inputs/NumberInput";
import ErrorContainer from "@/components/forms/ErrorContainer";
import getErrorResponseTitle from "@/lib/getErrorResponseTitle";
import ButtonContainer from "@/components/forms/ButtonContainer";
import { default_simple_error, header_internal } from "@/globals";
import CompletionContainer from "@/components/forms/CompletionContainer";

type Props = {
  redirect?: string;
  data: Partial<Bucket>;
};

const BucketEditForm: React.FC<Props> = (props: Props) => {
  const { data, redirect = `/buckets/${data._id}` } = props;
  const router = useRouter();
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
    const max_size_bytes = parseInt(form_data.get("max_size_bytes")?.toString() || "0");
    //TODO: update for an array of values
    const permissions = parseInt(form_data.get("permissions")?.toString() || "1") as BucketPermission;
    const update: Partial<Bucket> = {
      max_size_bytes,
      permissions: [permissions],
    };

    const validation_error = validateRequest(update);
    if (validation_error.error) {
      setLoading(false);
      return setError(validation_error);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/buckets/by-id`, {
        method: "PATCH",
        headers: header_internal,
        body: JSON.stringify({ _id: data._id, update }),
      }).then((res: any) => res.json());

      if (response.error) {
        setLoading(false);
        return setError({ error: true, message: response.message, title: getErrorResponseTitle(response.status) });
      }

      if (redirect) return router.push(redirect);
      setComplete(true);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      return setError({ error: true, message: "An unexpected error occurred, please try again.", title: `Unexpected Error` });
    }
  };

  const validateRequest = (data: Partial<Bucket>): SimpleError => {
    var invalid;
    const inputs_invalid: { [key: string]: boolean } = {};
    var message = "Please address the following errors:\n";
    Object.keys(data).map((key: string) => {
      switch (key) {
        case "max_size_bytes":
          invalid = getInputError("number", data[key], true);
          if (invalid.error) {
            inputs_invalid.max_size_bytes = invalid.error;
            message += `- Max size: ${invalid.message}\n`;
          }
          break;
        case "permissions":
          //TODO: update for an array of values
          const value = data[key] || [0];
          invalid = getInputError("number", value[0], true);
          if (invalid.error) {
            inputs_invalid.permissions = invalid.error;
            message += `- Permissions: ${invalid.message}\n`;
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
            <TextInput name="name" disabled={true} label="Name" default_value={data.name} />
          </div>

          <div className="w-full flex flex-row gap-2 items-center justify-between">
            <NumberInput
              min={1}
              max={9}
              required={true}
              label="Max size"
              name="max_size_bytes"
              default_value={data.max_size_bytes}
              error={!!inputErrors.max_size_bytes}
            />

            {/* //TODO: update for an array of values */}
            <NumberInput
              min={1}
              max={9}
              required={true}
              name="permissions"
              label="Permissions"
              error={!!inputErrors.permissions}
              default_value={data.permissions ? data.permissions[0] : 1}
            />
          </div>

          <div className="w-full">
            <TextInput
              label="Company"
              disabled={true}
              name="company_id"
              default_value={data.company_id ? (typeof data.company_id === "string" ? data.company_id : data.company_id.name) : undefined}
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
