const defaultError = { data: null, error: true };

const defaultSuccess = { data: null, error: false };

export const status = {
  OK: 200,
  DB_UPDATED: 201,
  NO_CONTENT: 204,

  BAD: 400,
  UNAUTHORISED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,

  SERVER_ERROR: 500,
};

/* A */
export const apiPermissions: { [key: string]: BucketPermission } = {
  read: 1,
  write: 2,
  update: 3,
  delete: 4,
  full: 9,
};

/* R */
export const response_BAD: ApiResponse = {
  ...defaultError,
  status: status.BAD,
  message: "An error occurred whilst processing the request",
};

export const response_DB_UPDATED: ApiResponse = {
  ...defaultSuccess,
  status: status.DB_UPDATED,
  message: "Database updated",
};

export const response_NO_CONTENT: ApiResponse = {
  ...defaultSuccess,
  status: status.NO_CONTENT,
  message: "No content available",
};

export const response_OK: ApiResponse = {
  ...defaultSuccess,
  status: status.OK,
  message: "Success",
};

export const response_SERVER_ERROR: ApiResponse = {
  ...defaultError,
  status: status.SERVER_ERROR,
  message: "An error occurred on the server - refer to the data for more details",
};

export const response_UNAUTHORISED: ApiResponse = {
  ...defaultError,
  status: status.UNAUTHORISED,
  message: "Unauthorised",
};
