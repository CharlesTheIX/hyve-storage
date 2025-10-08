"use client";
import { null_option } from "@/globals";
import SelectInput from "../SelectInput";
import Permissions from "@/lib/classes/Permissions";

type Props = {
  name: string;
  label?: string;
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  default_value?: Option;
  onChange?: (event: any) => void;
};

const PermissionsDropdown: React.FC<Props> = (props: Props) => {
  var { name, label, error = false, disabled = false, required = false, onChange = () => {}, default_value = null_option } = props;
  const options = Permissions.getBucketPermissionOptions();

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

export default PermissionsDropdown;
