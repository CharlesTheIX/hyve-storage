import { getRegexPattern, InputRegexPatternType } from "@/lib/regexPatterns";

export default (type: InputRegexPatternType, value: any, required?: boolean): boolean => {
  if (!value && type !== "number") return !!required;
  switch (type) {
    case "password":
      return !getRegexPattern(type).regex?.test(value);
    case "username":
      const username = !getRegexPattern(type).regex?.test(value);
      if (!username) return username;
      return !getRegexPattern("email").regex?.test(value);
    case "number":
      if (!required && !value) return true;
      return isNaN(value);
    default:
      return !getRegexPattern(type).regex?.test(value);
  }
};
