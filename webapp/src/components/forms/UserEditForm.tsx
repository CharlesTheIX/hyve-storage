"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { defaultFormError } from "@/globals";
import Button from "@/components/buttons/Button";
import getInputHasError from "@/lib/getInputHasError";
import TextInput from "@/components/inputs/TextInput";
import LoadingContainer from "@/components/LoadingContainer";

type Props = {
  data: Partial<User>;
};

const UserEditForm: React.FC<Props> = (props: Props) => {
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
    const surname = formData.get("surname")?.toString() || "";
    const firstName = formData.get("first-name")?.toString() || "";
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
      const fields = ["_id"];
      const options = { fields };
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/by-id`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: data._id, update, options }),
      }).then((res: any) => res.json());

      if (response.error) {
        setLoading(false);
        return setError({ error: true, message: response.message, title: "Error" });
      }

      router.push(`/users/${data._id}`);
    } catch (err: any) {
      setLoading(false);
      setError({ error: true, message: "An unexpected error occurred, please try again.", title: `Unexpected Error` });
    }
  };

  const validateRequest = (data: Partial<User>): FormError => {
    var invalid = false;
    const inputsInvalid: { [key: string]: boolean } = {};
    var message = "Please address the following errors:\n";
    Object.keys(data).map((key: string) => {
      switch (key) {
        case "surname":
          invalid = getInputHasError("text", data[key], true);
          if (invalid) {
            inputsInvalid.surname = invalid;
            message += "- Ensure the surname is valid.\n";
          }
          break;
        case "firstName":
          invalid = getInputHasError("text", data[key], true);
          if (invalid) {
            inputsInvalid.firstName = invalid;
            message += "- Ensure the first name is valid.\n";
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
          <TextInput name="username" disabled={true} label="Username" defaultValue={data.username} />
        </div>

        <div className="w-full flex flex-row gap-2 items-center justify-between">
          <TextInput name="first-name" required={true} label="First name" error={!!inputErrors.firstName} defaultValue={data.firstName} />
          <TextInput name="surname" required={true} label="Surname" error={!!inputErrors.surname} defaultValue={data.surname} />
        </div>

        <div className="w-full flex flex-row gap-2 items-center justify-between">
          <TextInput
            label="Company"
            disabled={true}
            name="company-id"
            defaultValue={data.companyId ? (typeof data.companyId === "string" ? data.companyId : data.companyId.name) : undefined}
          />
          <TextInput name="permissions" disabled={true} label="Permissions" defaultValue={data.permissions?.toString()} />
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

export default UserEditForm;
