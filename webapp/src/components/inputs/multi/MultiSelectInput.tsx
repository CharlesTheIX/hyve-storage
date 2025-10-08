"use client";
import { useState } from "react";
import { colors } from "@/globals";
import Chevron from "@/components/svgs/Chevron";
import Checkbox from "@/components/svgs/Checkbox";

type Props = {
  name: string;
  label?: string;
  error?: boolean;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
  slice_limit?: number;
  default_value?: Option[];
  onChange?: (event: any) => void;
};

const MultiSelectInput: React.FC<Props> = (props: Props) => {
  var { name, label, slice_limit = 4, options, error = false, disabled = false, required = false, default_value = [], onChange = () => {} } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [value, setValue] = useState<Option[]>(default_value);

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
            {value
              .map((i) => i.label)
              .slice(0, slice_limit)
              .join(", ")}
            {value.length > slice_limit && <span>{` +${value.length - slice_limit}`}</span>}
          </p>
        ) : (
          <p></p>
        )}

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
              {options.map((option, key) => {
                const selected = !!value.find((v) => option.value === v.value);
                return (
                  <li
                    key={key}
                    className="flex flex-row items-center gap-2"
                    onClick={(event: any) => {
                      if (disabled) return;
                      onChange(event);
                      setValue((prev) => {
                        var new_value;
                        if (!selected) new_value = [...prev, option];
                        else new_value = prev.filter((item) => item.value !== option.value) || [];
                        return new_value;
                      });
                    }}
                  >
                    <div className="checkbox">
                      <Checkbox size={16} primary_color={colors.white} checked={selected} />
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

export default MultiSelectInput;
