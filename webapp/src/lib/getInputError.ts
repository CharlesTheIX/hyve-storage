import { getRegexPattern, InputRegexPatternType } from "@/lib/regexPatterns";
type InputError = {
  error: boolean;
  message: string;
};
export default (type: InputRegexPatternType, value: any, required?: boolean): InputError => {
  if (!value) return { error: !!required, message: `${!!required ? "A value is required." : ""}` };
  const regex_pattern = getRegexPattern(type);
  const error = !regex_pattern.regex.test(value);
  return { error, message: error ? regex_pattern.message : "" };
};
