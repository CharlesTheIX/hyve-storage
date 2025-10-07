"use client";
import { useState } from "react";
import Button from "@/components/buttons/Button";

type Props = {
  name: string;
  label?: string;
  error?: boolean;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  default_value?: Option[];
  onChange?: (event: any) => void;
};

const SelectInput: React.FC<Props> = (props: Props) => {
  var {
    name,
    label,
    options,
    error = false,
    disabled = false,
    required = false,
    default_value = [],
    onChange = () => {},
    placeholder = "Select an option",
  } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [value, setValue] = useState<Option[]>(default_value);
  const [currentValue, setCurrentValue] = useState<Option>({ value: "", label: "" });

  const addItem = (): void => {
    if (disabled) return;
    const new_value = [...value, currentValue];
    setValue(new_value);
    setCurrentValue({ value: "", label: "" });
  };

  const removeItem = (index: number): void => {
    if (disabled) return;
    const new_value = value.filter((_, key) => key === index);
    setValue(new_value);
  };

  return (
    <div
      className={`hyve-input select ${focused && !currentValue.value ? "focused" : ""} ${error ? "error" : ""} ${
        !!currentValue.value ? "active" : ""
      }`}
    >
      <input type="hidden" value={JSON.stringify(value)} name={name} id={name} />

      {value.length && (
        <div className="flex flex-row flex-wrap gap-2 items-center">
          {value.map((item, key) => {
            return (
              <Button
                key={key}
                type="default"
                disabled={false}
                callback={() => {
                  removeItem(key);
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </div>
      )}

      <div>
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

        <div className="flex flex-row w-full">
          <div
            className="select-value"
            onClick={() => {
              if (disabled) return;
              setOpen(!open);
              setFocused(!focused);
            }}
          >
            <p>{currentValue.label}</p>
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
                          setFocused(false);
                          setCurrentValue(option);
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

        <div className="w-auto">
          <Button type="default" disabled={disabled} callback={addItem}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectInput;
