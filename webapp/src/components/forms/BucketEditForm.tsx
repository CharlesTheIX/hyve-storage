"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { defaultFormError } from "@/globals";
import Button from "@/components/buttons/Button";
import getInputHasError from "@/lib/getInputHasError";
import TextInput from "@/components/inputs/TextInput";
import NumberInput from "@/components/inputs/NumberInput";
import LoadingContainer from "@/components/LoadingContainer";

type Props = {
  data: Partial<Bucket>;
};

const BucketEditForm: React.FC<Props> = (props: Props) => {
  const { data } = props;
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<FormError>(defaultFormError);
  const [inputErrors, setInputErrors] = useState<{ [key: string]: boolean }>({});

  const handleFormSubmission = async (): Promise<void> => {
    const form = formRef.current;
    if (!form) return;

    setLoading(true);
    setInputErrors({});
    setError(defaultFormError);
    const formData = new FormData(form);
    const maxSize_bytes = parseInt(formData.get("max-size")?.toString() || "0");
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
      const fields = ["_id"];
      const options = { fields };
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/buckets/by-id`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: data._id, update, options }),
      }).then((res: any) => res.json());

      if (response.error) {
        setLoading(false);
        return setError({ error: true, message: response.message, title: "Error" });
      }

      router.push(`/buckets/${data._id}`);
    } catch (err: any) {
      setLoading(false);
      setError({ error: true, message: "An unexpected error occurred, please try again.", title: `Unexpected Error` });
    }
  };

  const validateRequest = (data: Partial<Bucket>): FormError => {
    var invalid = false;
    const inputsInvalid: { [key: string]: boolean } = {};
    var message = "Please address the following errors:\n";
    Object.keys(data).map((key: string) => {
      switch (key) {
        case "maxSize_bytes":
          invalid = getInputHasError("number", data[key], true);
          if (invalid) {
            inputsInvalid.permissions = invalid;
            message += "- Ensure the max size is valid.\n";
          }
          break;
        case "permissions":
          //TODO: update for an array of values
          const value = data[key] || [0];
          invalid = getInputHasError("number", value[0], true);
          if (invalid) {
            inputsInvalid.permissions = invalid;
            message += "- Ensure the permissions is valid.\n";
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
        <div className="w-full">
          <TextInput name="name" disabled={true} label="Name" defaultValue={data.name} />
        </div>

        <div className="w-full flex flex-row gap-2 items-center justify-between">
          <NumberInput
            min={1}
            max={9}
            name="max-size"
            required={true}
            label="Max Size"
            error={!!inputErrors.maxSize_bytes}
            defaultValue={`${data.maxSize_bytes}`}
          />

          {/* //TODO: update for an array of values */}
          <NumberInput
            min={1}
            max={9}
            required={true}
            name="permissions"
            label="Permissions"
            error={!!inputErrors.permissions}
            defaultValue={data.permissions ? `${data.permissions[0]}` : "1"}
          />
        </div>

        <div className="w-full">
          <TextInput
            label="Company"
            disabled={true}
            name="company-id"
            defaultValue={data.companyId ? (typeof data.companyId === "string" ? data.companyId : data.companyId.name) : undefined}
          />
        </div>

        <div className="button-container">
          <Button
            type="submission"
            disabled={loading}
            onClick={async () => {
              if (loading) return;
              await handleFormSubmission();
            }}
          >
            Update
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
    </form>
  );
};

export default BucketEditForm;
