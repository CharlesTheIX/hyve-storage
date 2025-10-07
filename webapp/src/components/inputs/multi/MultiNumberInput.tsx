"use client";
import { useState } from "react";
import Button from "@/components/buttons/Button";

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
  default_value?: number[];
  onInput?: (event: any) => void;
};

const MultiNumberInput: React.FC<Props> = (props: Props) => {
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
    default_value = [],
    onInput = () => {},
  } = props;
  const [focused, setFocused] = useState<boolean>(false);
  const [value, setValue] = useState<number[]>(default_value);
  const [currentValue, setCurrentValue] = useState<number>(min);

  const addItem = (): void => {
    if (disabled) return;
    const new_value = [...value, currentValue];
    setValue(new_value);
    setCurrentValue(min);
  };

  const removeItem = (index: number): void => {
    if (disabled) return;
    const new_value = value.filter((_, key) => key === index);
    setValue(new_value);
  };

  return (
    <div className={`hyve-input multi ${focused ? "focused" : ""} ${error ? "error" : ""} ${!!currentValue || currentValue === 0 ? "active" : ""}`}>
      <input type="hidden" value={JSON.stringify(value)} name={name} id={name} />

      <div className="input-container w-full">
        {label && (
          <label htmlFor={`${name}-current`}>
            {label}
            {required && <sup>*</sup>}
          </label>
        )}

        <div className="flex flex-row w-full gap-2">
          <input
            min={min}
            max={max}
            step={step}
            type="number"
            className="w-full"
            required={required}
            disabled={disabled}
            id={`${name}-current`}
            name={`${name}-current`}
            placeholder={placeholder}
            value={`${currentValue}`}
            onFocus={() => {
              setFocused(true);
            }}
            onBlur={() => {
              setFocused(false);
            }}
            onInput={(evt: any) => {
              const target = (evt.currentTarget || evt.target) as HTMLInputElement;
              setCurrentValue(parseInt(target.value));
              onInput(evt);
            }}
          />

          <div className="w-auto">
            <Button type="default" disabled={disabled} callback={addItem}>
              Add
            </Button>
          </div>
        </div>
      </div>

      {value.length > 0 && (
        <div className="selection flex flex-row flex-wrap gap-2 items-center">
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
                {item}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultiNumberInput;
