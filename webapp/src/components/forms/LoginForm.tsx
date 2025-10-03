"use client";
import Link from "next/link";
import { defaultFormError } from "@/globals";
import Button from "@/components/buttons/Button";
import { useState, useRef, useEffect } from "react";
import TextInput from "@/components/inputs/TextInput";
import getInputHasError from "@/lib/getInputHasError";
import { useUserContext } from "@/contexts/userContext";
import EmailInput from "@/components/inputs/EmailInput";
import { useRouter, useSearchParams } from "next/navigation";
import PasswordInput from "@/components/inputs/PasswordInput";
import { ToastItem, useToastContext } from "@/contexts/toastContext";

type LoginRequestData = {
  username: string;
  password: string;
};
type LoginState = "login" | "forgottenPassword";

const LoginForm: React.FC = () => {
  const router = useRouter();
  const toast = useToastContext();
  const { setUserData } = useUserContext();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [state, setState] = useState<LoginState>("login");
  const [error, setError] = useState<FormError>(defaultFormError);
  const redirect = useSearchParams()?.get("redirect") || "/dashboard";
  const [inputErrors, setInputErrors] = useState<{ [key: string]: boolean }>({});

  const handleForgottenPassword = async (formData: FormData): Promise<void> => {
    const email = formData.get("email")?.toString() || "";
    const forgottenPasswordValidationError = validateForgottenPasswordRequest(email);
    if (forgottenPasswordValidationError.error) {
      setLoading(false);
      return setError(forgottenPasswordValidationError);
    }

    try {
      //TODO: implement the forgotten email endpoint if / when needed
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}api/emails/forgotten-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }).then((res: any) => res.json());

      if (response.error) {
        setLoading(false);
        return setError({ error: true, message: response.message, title: "Error" });
      }

      setState("login");
      setLoading(false);
      toast.setToastItems((prev: ToastItem[]) => {
        const newValue: ToastItem[] = [
          ...prev,
          {
            timeout: 50000,
            visible: true,
            type: "error",
            title: "Success",
            content: "Some content.",
          },
        ];
        return newValue;
      });
    } catch (err: any) {
      setLoading(false);
      setError({ error: true, message: "An unexpected error occurred, please try again.", title: `Unexpected Error` });
    }
  };

  const handleFormSubmission = async (): Promise<void> => {
    const form = formRef.current;
    if (!form) return;

    setLoading(true);
    setInputErrors({});
    setError(defaultFormError);

    const formData = new FormData(form);
    switch (state) {
      case "login":
        return await handleLogin(formData);
      case "forgottenPassword":
        return await handleForgottenPassword(formData);
    }
  };

  const handleLogin = async (formData: FormData): Promise<void> => {
    const username = formData.get("username")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
    const requestData: LoginRequestData = { username, password };
    const loginValidationError = validateLoginRequest(requestData);
    if (loginValidationError.error) {
      setLoading(false);
      return setError(loginValidationError);
    }

    try {
      //TODO: implement the login endpoint if / when needed
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}api/users/login`, {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: { "Content-Type": "application/json" },
      }).then((res: any) => res.json());

      if (response.error) {
        setLoading(false);
        return setError({ error: true, message: response.message, title: "Error" });
      }

      //TODO: set user Data to userData user data
      setUserData({ _id: "test", token: "test", username: "test" });
      router.replace(redirect);
    } catch (err: any) {
      setLoading(false);
      setError({ error: true, message: "An unexpected error occurred, please try again.", title: `Unexpected Error` });
    }
  };

  const validateForgottenPasswordRequest = (email: string): FormError => {
    const title = "Input error";
    const inputsInvalid: { [key: string]: boolean } = {};
    const invalid = getInputHasError("email", email, true);
    var message = "Please address the following errors:\n";
    if (invalid) {
      inputsInvalid.email = invalid;
      message += "- A valid email is required.\n";
    }

    const error = Object.keys(inputsInvalid).length > 0;
    if (!error) message = "";
    setInputErrors(inputsInvalid);
    return { error, message, title };
  };

  const validateLoginRequest = (data: LoginRequestData): FormError => {
    var invalid = false;
    const inputsInvalid: { [key: string]: boolean } = {};
    var message = "Please address the following errors:\n";
    Object.keys(data).map((key: string) => {
      switch (key) {
        case "username":
          invalid = getInputHasError("username", data[key], true);
          if (invalid) {
            inputsInvalid.email = invalid;
            message += "- A valid username or email is required.\n";
          }
          break;
        case "password":
          invalid = getInputHasError("password", data[key], true);
          if (invalid) {
            inputsInvalid.fullname = invalid;
            message += "- A valid password is required.\n";
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

  useEffect(() => {
    var target: HTMLElement | null = null;
    switch (state) {
      case "login":
        target = document.getElementById("username");
        break;
      case "forgottenPassword":
        target = document.getElementById("email");
        break;
    }
    if (!target) return;
    target.focus();
  }, [state]);

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
      <div className="content-container">
        {state === "login" && (
          <>
            <div className="w-full">
              <TextInput name="username" required={true} label="Username / Email" error={!!inputErrors.username} />
            </div>

            <div className="w-full">
              <PasswordInput name="password" required={true} label="Password" error={!!inputErrors.username} />
            </div>

            <div className="w-full">
              <p
                className="link-text text-sm"
                onClick={() => {
                  setInputErrors({});
                  setError(defaultFormError);
                  setState("forgottenPassword");
                }}
              >
                Forgot your password?
              </p>
            </div>
          </>
        )}

        {state === "forgottenPassword" && (
          <>
            <div className="w-full">
              <EmailInput name="email" required={true} label="Email" error={!!inputErrors.email} />
            </div>
          </>
        )}

        <div className="button-container">
          {state === "forgottenPassword" && (
            <Button
              type="cancel"
              disabled={loading}
              onClick={() => {
                setState("login");
                setInputErrors({});
                setError(defaultFormError);
              }}
            >
              Cancel
            </Button>
          )}

          <Button type="submission" onClick={handleFormSubmission} disabled={loading}>
            {state === "login" && <p>Login</p>}
            {state === "forgottenPassword" && <p>Submit</p>}
          </Button>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-icon" />
        </div>
      )}

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

export default LoginForm;
