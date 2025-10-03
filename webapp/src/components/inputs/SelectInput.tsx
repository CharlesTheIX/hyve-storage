"use client";
import { useState } from "react";

type Props = {
  name: string;
  label?: string;
  error?: boolean;
  options: Option[];
  required?: boolean;
  placeholder?: string;
  defaultValue?: Option;
  customSelect?: boolean;
  onChange?: (event: any) => void;
};

const SelectInput: React.FC<Props> = (props: Props) => {
  var {
    name,
    label,
    options,
    error = false,
    required = false,
    onChange = () => {},
    placeholder = "Select an option",
    defaultValue = { value: "", label: "" },
  } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [value, setValue] = useState<Option>(defaultValue);

  return (
    <div className={`hyve-input select ${focused && !value.value ? "focused" : ""} ${error ? "error" : ""} ${!!value.value ? "active" : ""}`}>
      {label && (
        <p
          className="label"
          onClick={() => {
            setOpen(!open);
            setFocused(!focused);
          }}
        >
          {label}
          {required && <sup>*</sup>}
        </p>
      )}

      <input type="hidden" value={JSON.stringify(value)} id={name} name={name} />

      <div
        className="select-value"
        onClick={() => {
          setOpen(!open);
          setFocused(!focused);
        }}
      >
        <p>{value.label}</p>
      </div>

      {open && (
        <>
          <div
            className="options-background"
            onClick={() => {
              setOpen(false);
              setFocused(false);
            }}
          />

          <div className={`options-container`}>
            <ul>
              <li className="blank-option">{placeholder}</li>
              {options.map((option) => {
                return (
                  <li
                    onClick={(event: any) => {
                      setOpen(false);
                      onChange(event);
                      setValue(option);
                      setFocused(false);
                    }}
                  >
                    {option.label}
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default SelectInput;
