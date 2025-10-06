import { getRegexPattern, InputRegexPatternType } from "@/lib/regexPatterns";
type InputError = {
  error: boolean;
  message: string;
};
export default (type: InputRegexPatternType, value: any, required?: boolean): InputError => {
  if (!value) return { error: !!required, message: `${!!required ? "A value is required." : ""}` };
  const regexPattern = getRegexPattern(type);
  const error = !regexPattern.regex.test(value);
  return { error, message: error ? regexPattern.message : "" };
};
