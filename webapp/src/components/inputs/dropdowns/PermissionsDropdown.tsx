"use client";
import { useState } from "react";
import { colors } from "@/globals";
import Chevron from "@/components/svgs/Chevron";
import Permissions from "@/lib/classes/Permissions";

type Props = {
  name: string;
  label?: string;
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  defaultValue?: Option;
  customSelect?: boolean;
  onChange?: (event: any) => void;
};

const options = Permissions.getBucketPermissionOptions();
const PermissionsDropdown: React.FC<Props> = (props: Props) => {
  var {
    name,
    label,
    error = false,
    disabled = false,
    required = false,
    onChange = () => {},
    placeholder = "Select an option",
    defaultValue = { value: 1, label: "Read" },
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
        className={`select-value ${disabled ? "disabled" : ""}`}
        onClick={() => {
          if (disabled) return;
          setOpen(!open);
          setFocused(!focused);
        }}
      >
        <p>{value.label}</p>
        <Chevron direction="down" size={16} primaryColor={colors.white} />
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
              <li className="blank-option" style={{ opacity: 0.8 }}>
                {placeholder}
              </li>

              {options.map((option, key: number) => {
                return (
                  <li
                    key={key}
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

export default PermissionsDropdown;
