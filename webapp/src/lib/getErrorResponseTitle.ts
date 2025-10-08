import { status } from "@/globals";

export default (error_code: number): string => {
  var title = "Error";

  switch (error_code) {
    case status.BAD:
      title = "User input error";
      break;
    case status.UNAUTHORISED:
      title = "Authorisation error";
      break;
    case status.FORBIDDEN:
      title = "Forbidden";
      break;
    case status.NOT_FOUND:
      title = "Data not found";
      break;
    case status.CONFLICT:
      title = "Conflict error";
      break;
  }
  return title;
};
