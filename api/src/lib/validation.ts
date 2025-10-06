import mimeTypes from "./mimeTypes";

export const isValidBucketName = (name: string): SimpleError => {
  const valid: SimpleError = { error: false, message: "" };
  const valid_pattern = new RegExp(/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/);
  const ip_address_pattern = new RegExp(/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/);

  if (!name || name.length < 3 || name.length > 63) {
    valid.message = `Bucket name ${name} must have a length between 3 & 63 characters long`;
  }

  if (name.includes("..")) {
    valid.message = `Bucket name ${name} must not contain consecutive '.' characters`;
  }

  if (!valid_pattern.test(name)) {
    valid.message = `Bucket name ${name} is not valid. It must only contain only upper & lowercase letters, numbers, '.', '-' & must start & end with a letter or number`;
  }

  if (!ip_address_pattern.test(name)) {
    valid.message = `Bucket name ${name} is not valid. It must not have the same pattern as an IP address`;
  }

  if (valid.message) valid.error = true;
  return valid;
};

export const isValidCompanyName = (name: string): SimpleError => {
  const valid: SimpleError = { error: false, message: "" };
  const valid_pattern = new RegExp(/^[A-Za-z0-9][A-Za-z0-9.-]{1,61}[A-Za-z0-9]$/);

  if (!name || name.length < 3 || name.length > 63) {
    valid.message = `Company name ${name} must have a length between 3 & 63 characters long`;
  }

  if (!valid_pattern.test(name)) {
    valid.message = `Company name ${name} is not valid. It must only contain only upper & lowercase letters, numbers, '.', '-' & must start & end with a letter or number`;
  }

  if (valid.message) valid.error = true;
  return valid;
};

export const isValidMimeType = (file: Express.Multer.File): SimpleError => {
  const mimeType = file.mimetype;
  const valid: SimpleError = { error: false, message: "" };
  if (!mimeType || !mimeTypes.includes(mimeType)) valid.message = `Mime type for file ${file.filename} is invalid`;
  if (valid.message) valid.error = true;
  return valid;
};

export const isValidName = (name: string): SimpleError => {
  const valid: SimpleError = { error: false, message: "" };
  const valid_pattern = new RegExp(/^[A-Za-z][A-Za-z\-]{1,61}[A-Aa-z]$/);

  if (!name || name.length < 3 || name.length > 63) {
    valid.message = `Name ${name} must have a length between 3 & 63 characters long`;
  }

  if (!valid_pattern.test(name)) {
    valid.message = `Name ${name} is not valid. It must only contain only upper & lowercase letters, '-' & must start & end with a letter`;
  }

  if (valid.message) valid.error = true;
  return valid;
};

export const isValidObjectName = (name: string): SimpleError => {
  const valid: SimpleError = { error: false, message: "" };
  const byteLength = Buffer.byteLength(name, "utf8");
  const unsafeCharsPattern = new RegExp(/[\x00-\x1F\x7F]/);

  if (!name || typeof name !== "string") valid.message = "Object name must be a non-empty string";

  if (byteLength < 1 || byteLength > 1024) {
    valid.message = `Object name "${name}" must be between 1 & 1024 bytes`;
  }

  if (unsafeCharsPattern.test(name)) {
    valid.message = `Object name "${name}" contains unsafe or non-printable characters`;
  }

  if (valid.message) valid.error = true;
  return valid;
};

export const isValidUsername = (name: string): SimpleError => {
  const valid: SimpleError = { error: false, message: "" };
  const valid_pattern = new RegExp(/^[A-Za-z0-9][A-Za-z0-9_-]{1,61}[A-Za-z0-9]$/);

  if (!name || name.length < 3 || name.length > 63) {
    valid.message = `Username ${name} must have a length between 3 & 63 characters long`;
  }

  if (!valid_pattern.test(name)) {
    valid.message = `Username ${name} is not valid. It must only contain only upper & lowercase letters, '_', '-' & must start & end with a letter or number`;
  }

  if (valid.message) valid.error = true;
  return valid;
};
