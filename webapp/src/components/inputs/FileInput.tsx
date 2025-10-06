"use client";
import { useState } from "react";

type Props = {
  name: string;
  label?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  onChange?: (files: File) => void;
};

const FileInput: React.FC<Props> = (props: Props) => {
  const { disabled = false, required = false, onChange = () => {}, error = false, name, label } = props;
  const [value, setValue] = useState<File>();
  const [focused, setFocused] = useState<boolean>(false);

  const handleDrag = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    if (event.type === "dragenter" || event.type === "dragover") setFocused(true);
    else if (event.type === "dragleave") setFocused(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    setFocused(false);

    const files = Array.from(event.dataTransfer.files)[0];
    setValue(files);
    onChange(files);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (disabled) return;
    const file = event.target.files ? Array.from(event.target.files) : [];
    setValue(file[0]);
    onChange(file[0]);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDrag}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      className={`hyve-input file ${focused ? "focused" : ""} ${error ? "error" : ""} ${!!value ? "active" : ""}`}
    >
      {label && (
        <p
          className="label"
          onClick={() => {
            document.getElementById(name)?.click();
          }}
        >
          {label}
          {required && <sup>*</sup>}
        </p>
      )}

      <input type="file" id={name} name={name} className="hidden" onChange={handleFileChange} />
      {/* <input type="file" id={name} name={name} multiple className="hidden" onChange={handleFileChange} /> */}
      <div
        className="select-value"
        onClick={() => {
          document.getElementById(name)?.click();
        }}
      >
        <p>
          {!!value && (
            <span>
              📄 {value.name} ({(value.size / 1024).toFixed(2)} KB)
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default FileInput;
