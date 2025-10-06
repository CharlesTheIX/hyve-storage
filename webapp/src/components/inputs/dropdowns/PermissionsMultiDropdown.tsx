"use client";
import { useState } from "react";
import { colors } from "@/globals";
import Chevron from "@/components/svgs/Chevron";
import Checkbox from "@/components/svgs/Checkbox";
import Permissions from "@/lib/classes/Permissions";

type Props = {
  name: string;
  label?: string;
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  sliceLimit?: number;
  placeholder?: string;
  customSelect?: boolean;
  defaultValue?: Option[];
  onChange?: (event: any) => void;
};

const options = Permissions.getBucketPermissionOptions();
console.log(options);
const PermissionsMultiDropdown: React.FC<Props> = (props: Props) => {
  var {
    name,
    label,
    error = false,
    sliceLimit = 4,
    disabled = false,
    required = false,
    defaultValue = [],
    onChange = () => {},
    placeholder = "Select an option",
  } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [value, setValue] = useState<Option[]>(defaultValue);

  return (
    <div className={`hyve-input select ${focused && open ? "focused" : ""} ${error ? "error" : ""} ${value.length > 0 ? "active" : ""}`}>
      <input type="hidden" name={name} id={name} value={JSON.stringify(value)} />

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

      <div
        className={`select-value ${disabled ? "disabled" : ""}`}
        onClick={() => {
          if (disabled) return;
          setOpen(!open);
          setFocused(!focused);
        }}
      >
        {value.length > 0 ? (
          <p>
            {Permissions.getFlatPermissionOptions(value, "label", [0, sliceLimit]).join(", ")}
            {value.length > sliceLimit && <span>{` +${value.length - sliceLimit}`}</span>}
          </p>
        ) : (
          <p></p>
        )}

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
                const selected = !!value.find((v) => option.value === v.value);
                return (
                  <li
                    key={key}
                    className="flex flex-row items-center gap-2"
                    onClick={(event: any) => {
                      if (disabled) return;
                      onChange(event);
                      setValue((prevValue) => {
                        var newValue;
                        if (!selected) newValue = [...prevValue, option];
                        else newValue = prevValue.filter((item) => item.value !== option.value) || [];
                        return newValue;
                      });
                    }}
                  >
                    <div className="checkbox">
                      <Checkbox size={16} primaryColor={colors.white} checked={selected} />
                    </div>

                    <p>{option.label}</p>
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

export default PermissionsMultiDropdown;
