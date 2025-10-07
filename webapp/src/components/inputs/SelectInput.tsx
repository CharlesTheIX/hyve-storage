"use client";
import { useState } from "react";
import { null_option } from "@/globals";

type Props = {
  name: string;
  label?: string;
  error?: boolean;
  options: Option[];
  required?: boolean;
  placeholder?: string;
  default_value?: Option;
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
    default_value = null_option,
    placeholder = "Select an option",
  } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [value, setValue] = useState<Option>(default_value);

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
              {required ? (
                <li style={{ opacity: 0.8, cursor: "default" }}>{placeholder}</li>
              ) : (
                <li
                  onClick={(event: any) => {
                    setOpen(false);
                    onChange(event);
                    setFocused(false);
                    setValue(null_option);
                  }}
                >
                  None
                </li>
              )}

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
