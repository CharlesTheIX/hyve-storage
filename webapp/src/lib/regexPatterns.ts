export type InputRegexPattern = { string: string; regex: RegExp; message: string };
export type InputRegexPatternType =
  | "bucketName"
  | "companyName"
  | "email"
  | "mongoId"
  | "name"
  | "number"
  | "objectName"
  | "password"
  | "telephone"
  | "text"
  | "username";

//TODO: update the regex values
export const bucketNameRegex: InputRegexPattern = {
  string: "^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$",
  regex: new RegExp("^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$"),
  message: "Bucket name must be 3–63 characters, use only lowercase letters, numbers, '.', '-' & start/end with a letter or number.",
};

export const companyNameRegex: InputRegexPattern = {
  string: "^[A-Za-z0-9][A-Za-z0-9.-]{1,61}[A-Za-z0-9]$",
  regex: new RegExp("^[A-Za-z0-9][A-Za-z0-9.-]{1,61}[A-Za-z0-9]$"),
  message: "Company name must be 3–63 characters & can contain letters, numbers, '.', '-' & start/end with a letter or number.",
};

export const emailRegex: InputRegexPattern = {
  string: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
  regex: new RegExp("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"),
  message: "Please enter a valid email address.",
};

const mongoObjectIdRegex: InputRegexPattern = {
  string: "^[a-f0-9]{24}$",
  regex: new RegExp("^[a-f0-9]{24}$"),
  message: "Invalid MongoDB ObjectID. Must be a 24-character hexadecimal string.",
};

export const nameRegex: InputRegexPattern = {
  string: "^[A-Za-z]+(?:[ '\\-][A-Za-z]+)*$",
  regex: new RegExp("^[A-Za-z]+(?:[ '\\-][A-Za-z]+)*$"),
  message: "Name can only contain letters, spaces, apostrophes & hyphens.",
};

export const numberRegex: InputRegexPattern = {
  string: "^\\d+$",
  regex: new RegExp("^\\d+$"),
  message: "Only numeric digits are allowed.",
};

export const objectNameUnsafeCharsRegex: InputRegexPattern = {
  string: "[\\x00-\\x1F\\x7F]",
  regex: new RegExp("[\\x00-\\x1F\\x7F]"),
  message: "Object name contains unsafe or non-printable characters.",
};

export const passwordRegex: InputRegexPattern = {
  string: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
  regex: new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"),
  message: "Password must be at least 8 characters long & include uppercase, lowercase, number & special character.",
};

export const telephoneRegex: InputRegexPattern = {
  string: "^\\+?[0-9]{1,3}?[-.\\s]?\\(?[0-9]{1,4}\\)?([-.\\s]?[0-9]{1,4}){1,3}$",
  regex: new RegExp("^\\+?[0-9]{1,3}?[-.\\s]?\\(?[0-9]{1,4}\\)?([-.\\s]?[0-9]{1,4}){1,3}$"),
  message: "Please enter a valid phone number.",
};

export const textRegex: InputRegexPattern = {
  string: "^[A-Za-z0-9.,'\"!?()\\s\\-_/]*$",
  regex: new RegExp("^[A-Za-z0-9.,'\"!?()\\s\\-_/]*$"),
  message: "Text contains invalid characters.",
};

export const usernameRegex: InputRegexPattern = {
  string: "^[A-Za-z0-9][A-Za-z0-9_-]{1,61}[A-Za-z0-9]$",
  regex: new RegExp("^[A-Za-z0-9][A-Za-z0-9_-]{1,61}[A-Za-z0-9]$"),
  message: "Username must be 3–63 characters & can contain letters, digits, '-', '_' & must start/end with a letter or number.",
};

export const getRegexPattern = (patternType: InputRegexPatternType): InputRegexPattern => {
  switch (patternType) {
    case "bucketName":
      return bucketNameRegex;
    case "companyName":
      return companyNameRegex;
    case "email":
      return emailRegex;
    case "mongoId":
      return mongoObjectIdRegex;
    case "name":
      return nameRegex;
    case "number":
      return numberRegex;
    case "objectName":
      return objectNameUnsafeCharsRegex;
    case "password":
      return passwordRegex;
    case "telephone":
      return telephoneRegex;
    case "text":
      return textRegex;
    case "username":
      return usernameRegex;
  }
};
