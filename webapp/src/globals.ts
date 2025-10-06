import { Metadata, Viewport } from "next";
const defaultError = { data: null, error: true };
const defaultSuccess = { data: null, error: false };
export const siteName = "Hyve Storage";
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

/* C */
export const colors = {
  black: "#222629",
  blue: "#03c1de",
  green: "#8ac53f",
  grey: "#4d5154",
  red: "#d02b2b",
  white: "#b5b5b5",
};

/* D */
export const default404Metadata: Metadata = {
  title: `404 | ${siteName}`,
  robots: "noindex, nofollow",
  description: "Data not found",
};

export const defaultSimpleError = { error: false, message: "" };

export const defaultMetadata: Metadata = {
  title: siteName,
  description: "A microsite to host the Hyve Storage service.",
  icons: {
    // apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    icon: [
      { url: "/favicon.ico" },
      // { url: "/favicon.svg", type: "image/svg+xml" },
      // {
      //   sizes: "192x192",
      //   type: "image/png",
      //   url: "/android-chrome-192x192.png",
      // },
      // {
      //   sizes: "512x512",
      //   type: "image/png",
      //   url: "/android-chrome-512x512.png",
      // },
    ],
  },
};

export const defaultTableNullValue: string = "N/A";

export const defaultViewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: true,
  viewportFit: "cover",
  width: "device-width",
  themeColor: colors.black,
};

/* H */
export const header_external = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.AUTH_TOKEN || ""}`,
};

export const header_internal = {
  "Content-Type": "application/json",
};

/* R */
export const response_BAD: ApiResponse = {
  ...defaultError,
  status: status.BAD,
  message: "An error occurred whilst processing the request.",
};

export const response_DB_UPDATED: ApiResponse = {
  ...defaultSuccess,
  status: status.DB_UPDATED,
  message: "Database updated.",
};

export const response_OK: ApiResponse = {
  ...defaultSuccess,
  status: status.OK,
  message: "Success.",
};

export const response_SERVER_ERROR: ApiResponse = {
  ...defaultError,
  status: status.SERVER_ERROR,
  message: "An error occurred on the server - refer to the data for more details.",
};

export const response_UNAUTHORISED: ApiResponse = {
  ...defaultError,
  status: status.UNAUTHORISED,
  message: "Unauthorised.",
};

/* S */
export const storagePrefix = "__hyve_storage";
