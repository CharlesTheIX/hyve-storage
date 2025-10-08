"use client";
import { useState } from "react";
import Chevron from "../svgs/Chevron";
import { colors, null_option } from "@/globals";

type Props = {
  name: string;
  label?: string;
  error?: boolean;
  options: Option[];
  disabled?: boolean;
  required?: boolean;
  default_value?: Option;
  onChange?: (value: Option) => void;
};

const SelectInput: React.FC<Props> = (props: Props) => {
  var { name, label, options, error = false, required = false, onChange = () => {}, default_value = null_option, disabled = false } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [value, setValue] = useState<Option>(default_value);

  return (
    <div className={`hyve-input select ${focused && open ? "focused" : ""} ${error ? "error" : ""} ${!!value.value ? "active" : ""}`}>
      {label && (
        <p
          className="label"
          onClick={() => {
            if (disabled) return;
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
        className={`select-value ${disabled ? "disabled" : ""}`}
        onClick={() => {
          if (disabled) return;
          setOpen(!open);
          setFocused(!focused);
        }}
      >
        <p>{value.label}</p>
        <Chevron direction="down" size={24} primary_color={colors.white} />
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
              {!required && (
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

              {options.map((option, key) => {
                return (
                  <li
                    key={key}
                    onClick={(event: any) => {
                      setOpen(false);
                      onChange(option);
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
