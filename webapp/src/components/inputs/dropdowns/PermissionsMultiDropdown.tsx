"use client";
import Permissions from "@/lib/classes/Permissions";
import MultiSelectInput from "../multi/MultiSelectInput";

type Props = {
  name: string;
  label?: string;
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  slice_limit?: number;
  default_value?: Option[];
  onChange?: (event: any) => void;
};

const PermissionsMultiDropdown: React.FC<Props> = (props: Props) => {
  var { name, label, error = false, slice_limit = 4, disabled = false, required = false, default_value = [], onChange = () => {} } = props;
  const options = Permissions.getBucketPermissionOptions();

  return (
    <MultiSelectInput
      name={name}
      error={error}
      label={label}
      options={options}
      required={required}
      disabled={disabled}
      onChange={onChange}
      slice_limit={slice_limit}
      default_value={default_value}
    />
  );
};

export default PermissionsMultiDropdown;
