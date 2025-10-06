"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { defaultSimpleError } from "@/globals";
import getInputError from "@/lib/getInputError";
import TextInput from "@/components/inputs/TextInput";
import FileInput from "@/components/inputs/FileInput";
import LoadingContainer from "@/components/LoadingIcon";
import ErrorContainer from "@/components/forms/ErrorContainer";
import ButtonContainer from "@/components/forms/ButtonContainer";
import CompletionContainer from "@/components/forms/CompletionContainer";

type Props = {
  redirect?: string;
  data: Partial<Bucket>;
};

const ObjectUploadForm: React.FC<Props> = (props: Props) => {
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
    const fromSource = "webapp";
    const bucketName = data.name;
    const formData = new FormData(form);
    const file = formData.get("file") || undefined;
    const objectName = formData.get("objectName")?.toString() || "";
    const requestData: Partial<MinioObjectUploadRequest> = {
      objectName,
      fromSource,
      bucketName: data.name,
      file: file as File | undefined,
    };

    const validationError = validateRequest(requestData);
    if (validationError.error) {
      setLoading(false);
      return setError(validationError);
    }

    const formRequest = new FormData();
    formRequest.append("file", file as File);
    formRequest.append("objectName", objectName);
    formRequest.append("fromSource", fromSource);
    formRequest.append("bucketName", bucketName as string);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/buckets/objects/upload`, {
        method: "PUT",
        body: formRequest,
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

  const validateRequest = (data: Partial<MinioObjectUploadRequest>): SimpleError => {
    var invalid;
    const inputsInvalid: { [key: string]: boolean } = {};
    var message = "Please address the following errors:\n";

    Object.keys(data).map((key: string) => {
      switch (key) {
        case "objectName":
          invalid = getInputError("username", data[key], false);
          if (invalid.error) {
            inputsInvalid.objectName = invalid.error;
            message += `- Object name: ${invalid.message}\n`;
          }
          break;

        case "file":
          if (!data.file?.name && !data.file?.size) {
            inputsInvalid.file = true;
            message += "- File: Please select a file.\n";
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
    <form ref={formRef} encType="multipart/form-data" className={`hyve-form ${loading ? "loading" : ""}`}>
      <div className="content-container">
        <div className="inputs">
          <div className="w-full">
            <TextInput name="bucketName" disabled={true} label="Bucket Name" defaultValue={data.name} />
          </div>

          <div className="w-full flex flex-row gap-2 items-center">
            <TextInput name="objectName" required={false} label="Object Name" error={!!inputErrors.objectName} />

            <FileInput name="file" required={true} label="File" error={!!inputErrors.file} />
          </div>
        </div>

        <ButtonContainer text="Upload" disabled={loading} callback={handleFormSubmission} />
      </div>

      {loading && <LoadingContainer />}
      {error.error && error.message && <ErrorContainer error={error} />}
      {complete && <CompletionContainer title="Object uploaded" />}
    </form>
  );
};

export default ObjectUploadForm;
