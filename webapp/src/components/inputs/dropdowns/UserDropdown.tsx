"use client";
import getUsers from "@/lib/users/getUsers";
import { useEffect, useState } from "react";

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

const UserDropdown: React.FC<Props> = (props: Props) => {
  var {
    name,
    label,
    error = false,
    disabled = false,
    required = false,
    onChange = () => {},
    placeholder = "Select an option",
    defaultValue = { value: "", label: "" },
  } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [focused, setFocused] = useState<boolean>(false);
  const [value, setValue] = useState<Option>(defaultValue);

  useEffect(() => {
    (async () => {
      const fields = ["username"];
      const options = { fields };
      try {
        const res = await getUsers(options);
        if (res.error) return;
        if (res.data.length > 0) setOptions(res.data.map((i: Partial<User>) => ({ value: i._id, label: i.username })));
      } catch (err: any) {
        return;
      }
    })();
  }, []);

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

export default UserDropdown;
