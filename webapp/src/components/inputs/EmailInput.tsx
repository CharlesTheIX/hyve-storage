"use client";
import { useState } from "react";

type Props = {
  name: string;
  label?: string;
  error?: boolean;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  onInput?: (event: any) => void;
};

const EmailInput: React.FC<Props> = (props: Props) => {
  var { name, label, error = false, required = false, placeholder = "", defaultValue = "", onInput = () => {} } = props;
  const [focused, setFocused] = useState<boolean>(false);
  const [value, setValue] = useState<string>(defaultValue);

  return (
    <div className={`hyve-input ${focused ? "focused" : ""} ${error ? "error" : ""} ${!!value ? "active" : ""}`}>
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <sup>*</sup>}
        </label>
      )}

      <input
        id={name}
        name={name}
        type="email"
        value={value}
        required={required}
        autoComplete="true"
        placeholder={placeholder}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
        }}
        onInput={(evt: any) => {
          const target = (evt.currentTarget || evt.target) as HTMLInputElement;
          setValue(target.value);
          onInput(evt);
        }}
      />
    </div>
  );
};

export default EmailInput;
