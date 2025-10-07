"use client";
import { useState } from "react";

type Props = {
  name: string;
  label?: string;
  error?: boolean;
  required?: boolean;
  placeholder?: string;
  default_value?: string;
  onInput?: (event: any) => void;
};

const TextareaInput: React.FC<Props> = (props: Props) => {
  var { name, label, error = false, required = false, placeholder = "", default_value = "", onInput = () => {} } = props;
  const [focused, setFocused] = useState<boolean>(false);
  const [value, setValue] = useState<string>(default_value);

  return (
    <div className={`hyve-input ${focused ? "focused" : ""} ${error ? "error" : ""} ${!!value ? "active" : ""}`}>
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <sup>*</sup>}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        value={value}
        required={required}
        placeholder={placeholder}
        onFocus={() => {
          error = false;
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
        }}
        onInput={(evt: any) => {
          const target = (evt.currentTarget || evt.target) as HTMLTextAreaElement;
          setValue(target.value);
          onInput(evt);
        }}
      ></textarea>
    </div>
  );
};

export default TextareaInput;
