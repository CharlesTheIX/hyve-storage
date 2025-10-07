export type InputRegexPattern = { string: string; regex: RegExp; message: string };
export type InputRegexPatternType =
  | "bucket_name"
  | "company_name"
  | "email"
  | "mongo_id"
  | "name"
  | "number"
  | "object_name"
  | "password"
  | "telephone"
  | "text"
  | "username";

//TODO: update the regex values
export const bucket_name_regex: InputRegexPattern = {
  string: "^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$",
  regex: new RegExp("^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$"),
  message: "Bucket name must be 3–63 characters, use only lowercase letters, numbers, '.', '-' & start/end with a letter or number.",
};

export const company_name_regex: InputRegexPattern = {
  string: "^[A-Za-z0-9][A-Za-z0-9.-]{1,61}[A-Za-z0-9]$",
  regex: new RegExp("^[A-Za-z0-9][A-Za-z0-9.-]{1,61}[A-Za-z0-9]$"),
  message: "Company name must be 3–63 characters & can contain letters, numbers, '.', '-' & start/end with a letter or number.",
};

export const email_regex: InputRegexPattern = {
  string: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
  regex: new RegExp("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"),
  message: "Please enter a valid email address.",
};

const mongo_id_regex: InputRegexPattern = {
  string: "^[a-f0-9]{24}$",
  regex: new RegExp("^[a-f0-9]{24}$"),
  message: "Invalid MongoDB object_id. Must be a 24-character hexadecimal string.",
};

export const name_regex: InputRegexPattern = {
  string: "^[A-Za-z]+(?:[ '\\-][A-Za-z]+)*$",
  regex: new RegExp("^[A-Za-z]+(?:[ '\\-][A-Za-z]+)*$"),
  message: "Name can only contain letters, spaces, apostrophes & hyphens.",
};

export const number_regex: InputRegexPattern = {
  string: "^\\d+$",
  regex: new RegExp("^\\d+$"),
  message: "Only numeric digits are allowed.",
};

export const object_name_unsafe_chars_regex: InputRegexPattern = {
  string: "[\\x00-\\x1F\\x7F]",
  regex: new RegExp("[\\x00-\\x1F\\x7F]"),
  message: "Object name contains unsafe or non-printable characters.",
};

export const password_regex: InputRegexPattern = {
  string: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
  regex: new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"),
  message: "Password must be at least 8 characters long & include uppercase, lowercase, number & special character.",
};

export const telephone_regex: InputRegexPattern = {
  string: "^\\+?[0-9]{1,3}?[-.\\s]?\\(?[0-9]{1,4}\\)?([-.\\s]?[0-9]{1,4}){1,3}$",
  regex: new RegExp("^\\+?[0-9]{1,3}?[-.\\s]?\\(?[0-9]{1,4}\\)?([-.\\s]?[0-9]{1,4}){1,3}$"),
  message: "Please enter a valid phone number.",
};

export const text_regex: InputRegexPattern = {
  string: "^[A-Za-z0-9.,'\"!?()\\s\\-_/]*$",
  regex: new RegExp("^[A-Za-z0-9.,'\"!?()\\s\\-_/]*$"),
  message: "Text contains invalid characters.",
};

export const username_regex: InputRegexPattern = {
  string: "^[A-Za-z0-9][A-Za-z0-9_-]{1,61}[A-Za-z0-9]$",
  regex: new RegExp("^[A-Za-z0-9][A-Za-z0-9_-]{1,61}[A-Za-z0-9]$"),
  message: "Username must be 3–63 characters & can contain letters, digits, '-', '_' & must start/end with a letter or number.",
};

export const getRegexPattern = (patternType: InputRegexPatternType): InputRegexPattern => {
  switch (patternType) {
    case "bucket_name":
      return bucket_name_regex;
    case "company_name":
      return company_name_regex;
    case "email":
      return email_regex;
    case "mongo_id":
      return mongo_id_regex;
    case "name":
      return name_regex;
    case "number":
      return number_regex;
    case "object_name":
      return object_name_unsafe_chars_regex;
    case "password":
      return password_regex;
    case "telephone":
      return telephone_regex;
    case "text":
      return text_regex;
    case "username":
      return username_regex;
  }
};
