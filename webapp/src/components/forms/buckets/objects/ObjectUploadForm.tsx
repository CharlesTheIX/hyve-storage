"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import getInputError from "@/lib/getInputError";
import { default_simple_error } from "@/globals";
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
    const from_source = "webapp";
    const bucket_name = data.name;
    const form_data = new FormData(form);
    const file = form_data.get("file") || undefined;
    const object_name = form_data.get("object_name")?.toString() || "";
    const request_data: Partial<MinioObjectUploadRequest> = {
      object_name,
      from_source,
      bucket_name: data.name,
      file: file as File | undefined,
    };

    const validation_error = validateRequest(request_data);
    if (validation_error.error) {
      setLoading(false);
      return setError(validation_error);
    }

    const form_request = new FormData();
    form_request.append("file", file as File);
    form_request.append("object_name", object_name);
    form_request.append("from_source", from_source);
    form_request.append("bucket_name", bucket_name as string);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/buckets/objects/upload`, {
        method: "PUT",
        body: form_request,
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
    const inputs_invalid: { [key: string]: boolean } = {};
    var message = "Please address the following errors:\n";

    Object.keys(data).map((key: string) => {
      switch (key) {
        case "object_name":
          invalid = getInputError("username", data[key], false);
          if (invalid.error) {
            inputs_invalid.object_name = invalid.error;
            message += `- Object name: ${invalid.message}\n`;
          }
          break;

        case "file":
          if (!data.file?.name && !data.file?.size) {
            inputs_invalid.file = true;
            message += "- File: Please select a file.\n";
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
    <form ref={form_ref} encType="multipart/form-data" className={`hyve-form ${loading ? "loading" : ""}`}>
      <div className="content-container">
        <div className="inputs">
          <div className="w-full">
            <TextInput name="bucket_name" disabled={true} label="Bucket Name" default_value={data.name} />
          </div>

          <div className="w-full flex flex-row gap-2 items-center">
            <TextInput name="object_name" required={false} label="Object Name" error={!!inputErrors.object_name} />

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
