"use client";
import { useState } from "react";

type Props = {
  min?: number;
  max?: number;
  name: string;
  step?: number;
  label?: string;
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  default_value?: number;
  onInput?: (event: any) => void;
};

const NumberInput: React.FC<Props> = (props: Props) => {
  var {
    name,
    label,
    min = 0,
    step = 1,
    max = 100,
    error = false,
    required = false,
    placeholder = "",
    disabled = false,
    default_value = 0,
    onInput = () => {},
  } = props;
  const [focused, setFocused] = useState<boolean>(false);
  const [value, setValue] = useState<number>(default_value);

  return (
    <div className={`hyve-input ${focused ? "focused" : ""} ${error ? "error" : ""} ${!!value ? "active" : ""}`}>
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <sup>*</sup>}
        </label>
      )}

      <input
        min={min}
        max={max}
        id={name}
        step={step}
        name={name}
        type="number"
        value={value}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
        }}
        onInput={(evt: any) => {
          const target = (evt.currentTarget || evt.target) as HTMLInputElement;
          setValue(parseInt(target.value));
          onInput(evt);
        }}
      />
    </div>
  );
};

export default NumberInput;
