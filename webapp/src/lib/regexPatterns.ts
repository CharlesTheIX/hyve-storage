export type InputRegexPattern = { string: string | undefined; regex: RegExp | undefined };
export type InputRegexPatternType = "name" | "email" | "telephone" | "text" | "username" | "password" | "number";

//TODO: update the regex values
export const emailRegex: InputRegexPattern = {
  string: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
  regex: new RegExp("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"),
};

export const nameRegex: InputRegexPattern = {
  string: "^[A-Za-z]+(?:[ -][A-Za-z]+)*$",
  regex: new RegExp("^[A-Za-z]+(?:[ -][A-Za-z]+)*$"),
};

export const telephoneRegex: InputRegexPattern = {
  string: "^\\+?[0-9]{1,3}?[-.\\s]?(\\(?[0-9]{1,4}\\)?[-.\\s]?)*[0-9]{1,4}$",
  regex: new RegExp("^\\+?[0-9]{1,3}?[-.\\s]?(\\(?[0-9]{1,4}\\)?[-.\\s]?)*[0-9]{1,4}$"),
};

export const textRegex: InputRegexPattern = {
  string: "^[A-Za-z0-9._() -]+$",
  regex: new RegExp("^[A-Za-z0-9._() -]+$"),
};

export const passwordRegex: InputRegexPattern = {
  string: "^[A-Za-z0-9._() -]+$",
  regex: new RegExp("^[A-Za-z0-9._() -]+$"),
};

export const usernameRegex: InputRegexPattern = {
  string: "^[A-Za-z0-9._() -]+$",
  regex: new RegExp("^[A-Za-z0-9._() -]+$"),
};

export const getRegexPattern = (patternType?: InputRegexPatternType): InputRegexPattern => {
  switch (patternType) {
    case "name":
      return nameRegex;
    case "email":
      return emailRegex;
    case "telephone":
      return telephoneRegex;
    case "text":
      return textRegex;
    case "password":
      return passwordRegex;
    case "username":
      return usernameRegex;
    default:
      return { string: undefined, regex: undefined };
  }
};
