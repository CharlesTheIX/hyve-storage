"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { defaultFormError } from "@/globals";
import Button from "@/components/buttons/Button";
import { useRef, useState, useEffect } from "react";
// import getInputHasError from "@/lib/getInputHasError";
import TextInput from "@/components/inputs/TextInput";
import LoadingContainer from "@/components/LoadingContainer";

type Props = {
  data: Partial<Bucket>;
};

const ObjectUploadForm: React.FC<Props> = (props: Props) => {
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
    console.log(formData);

    // try {
    //   const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/buckets/objects/upload`, {
    //     method: "PUT",
    //     body: JSON.stringify(formData),
    //     headers: { "Content-Type": "multipart/form-data" },
    //   }).then((res: any) => res.json());

    //   if (response.error) {
    //     setLoading(false);
    //     return setError({ error: true, message: response.message, title: "Error" });
    //   }

    //   router.push(`/buckets/${data._id}`);
    // } catch (err: any) {
    //   setLoading(false);
    //   setError({ error: true, message: "An unexpected error occurred, please try again.", title: `Unexpected Error` });
    // }
  };

  // const validateRequest = (data: Partial<Bucket>): FormError => {
  //   var invalid = false;
  //   const inputsInvalid: { [key: string]: boolean } = {};
  //   var message = "Please address the following errors:\n";
  //   Object.keys(data).map((key: string) => {
  //     switch (key) {
  //       case "name":
  //         invalid = getInputHasError("name", data[key], true);
  //         if (invalid) {
  //           inputsInvalid.name = invalid;
  //           message += "- Ensure the name is valid.\n";
  //         }
  //         break;
  //       case "maxSize_bytes":
  //         invalid = getInputHasError("number", data[key], true);
  //         if (invalid) {
  //           inputsInvalid.maxSize_bytes = invalid;
  //           message += "- Ensure the max size is valid.\n";
  //         }
  //         break;
  //       case "permissions":
  //         //TODO: update for an array of values
  //         const value = data[key] || [0];
  //         invalid = getInputHasError("number", value[0], true);
  //         if (invalid) {
  //           inputsInvalid.permissions = invalid;
  //           message += "- Ensure the permissions is valid.\n";
  //         }
  //         break;
  //       case "companyId":
  //         invalid = getInputHasError("text", data[key], true);
  //         if (invalid) {
  //           inputsInvalid.companyId = invalid;
  //           message += "- Ensure the company is valid.\n";
  //         }
  //         break;
  //     }
  //   });

  //   const title = "Input error";
  //   const error = Object.keys(inputsInvalid).length > 0;
  //   if (!error) message = "";
  //   setInputErrors(inputsInvalid);
  //   return { error, message, title };
  // };

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
          <TextInput name="bucketName" disabled={true} label="Bucket Name" defaultValue={data.name} />
        </div>

        <div className="w-full flex flex-row gap-2 items-center">
          <TextInput name="objectName" required={true} label="Object Name" error={!!inputErrors.objectName} />
          <input type="file" name="file" id="" />
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

export default ObjectUploadForm;
