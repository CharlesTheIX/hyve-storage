const default_error = { data: null, error: true };
const default_success = { data: null, error: false };
export const status = {
  OK: 200,
  DB_UPDATED: 201,
  NO_CONTENT: 204,
  PARTIAL_UPDATE: 222,
  BAD: 400,
  UNAUTHORISED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

export const BAD: ApiResponse = {
  ...default_error,
  status: status.BAD,
  message: "An error occurred whilst processing the request",
};

export const CONFLICT: ApiResponse = {
  ...default_error,
  status: status.CONFLICT,
  message: "An error occurred whilst processing the request",
};

export const DB_UPDATED: ApiResponse = {
  ...default_success,
  status: status.DB_UPDATED,
  message: "Database updated",
};

export const FORBIDDEN: ApiResponse = {
  ...default_error,
  status: status.FORBIDDEN,
  message: "Forbidden",
};

export const NO_CONTENT: ApiResponse = {
  ...default_success,
  status: status.NO_CONTENT,
  message: "No content available",
};

export const NOT_FOUND: ApiResponse = {
  ...default_error,
  status: status.NOT_FOUND,
  message: "No content found",
};

export const OK: ApiResponse = {
  ...default_success,
  status: status.OK,
  message: "Success",
};

export const PARTIAL_UPDATE: ApiResponse = {
  ...default_success,
  status: status.PARTIAL_UPDATE,
  message: "Database partially updated updated",
};

export const SERVER_ERROR: ApiResponse = {
  ...default_error,
  status: status.SERVER_ERROR,
  message: "An error occurred on the server - refer to the data for more details",
};

export const UNAUTHORISED: ApiResponse = {
  ...default_error,
  status: status.UNAUTHORISED,
  message: "Unauthorised",
};
