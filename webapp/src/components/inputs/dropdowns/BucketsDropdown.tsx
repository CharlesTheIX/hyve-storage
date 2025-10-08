"use client";
import { null_option } from "@/globals";
import SelectInput from "../SelectInput";
import { useEffect, useState } from "react";
import getBucketsByCompanyId from "@/lib/buckets/getBucketsByCompanyId";

type Props = {
  name: string;
  label?: string;
  error?: boolean;
  company_id: string;
  required?: boolean;
  disabled?: boolean;
  default_value?: Option;
  onChange?: (event: any) => void;
};

const BucketDropdown: React.FC<Props> = (props: Props) => {
  var { name, label, company_id, error = false, disabled = false, required = false, onChange = () => {}, default_value = null_option } = props;
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    (async () => {
      const fields = ["name"];
      const filters = { fields };
      try {
        const res = await getBucketsByCompanyId(company_id, filters);
        if (res.error) return;
        if (res.data.length > 0) setOptions(res.data.map((i: Partial<Company>) => ({ value: i._id, label: i.name })));
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

export default BucketDropdown;
