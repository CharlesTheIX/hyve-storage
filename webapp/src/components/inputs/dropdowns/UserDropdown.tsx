"use client";
import { null_option } from "@/globals";
import SelectInput from "../SelectInput";
import getUsers from "@/lib/users/getUsers";
import { useEffect, useState } from "react";

type Props = {
  name: string;
  label?: string;
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  default_value?: Option;
  onChange?: (event: any) => void;
};

const UserDropdown: React.FC<Props> = (props: Props) => {
  var { name, label, error = false, disabled = false, required = false, onChange = () => {}, default_value = null_option } = props;
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    (async () => {
      const fields = ["username"];
      const filters = { fields };
      try {
        const res = await getUsers(filters);
        if (res.error) return;
        if (res.data.length > 0) setOptions(res.data.map((i: Partial<User>) => ({ value: i._id, label: i.username })));
      } catch (err: any) {
        return;
      }
    })();
  }, []);

  return (
    <SelectInput
      name={name}
      label={label}
      error={error}
      options={options}
      required={required}
      disabled={disabled}
      onChange={onChange}
      default_value={default_value}
    />
  );
};

export default UserDropdown;
