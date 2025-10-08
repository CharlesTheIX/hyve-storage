import { Metadata, Viewport } from "next";
const default_error = { data: null, error: true };
const default_success = { data: null, error: false };
export const site_name = "Hyve Storage";
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
export const default_404_metadata: Metadata = {
  title: `404 | ${site_name}`,
  robots: "noindex, nofollow",
  description: "Data not found",
};

export const default_simple_error = { error: false, message: "" };

export const default_metadata: Metadata = {
  title: site_name,
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

export const default_null_label: string = "N/A";

export const default_toast_item: ToastItem = {
  title: "",
  content: "",
  timeout: 3000,
  visible: true,
  type: "success",
};

export const default_viewport: Viewport = {
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

export const null_option: Option = { value: "", label: "" };

/* R */
export const BAD: ApiResponse = {
  ...default_error,
  status: status.BAD,
  message: "An error occurred whilst processing the request.",
};

export const DB_UPDATED: ApiResponse = {
  ...default_success,
  status: status.DB_UPDATED,
  message: "Database updated.",
};

export const OK: ApiResponse = {
  ...default_success,
  status: status.OK,
  message: "Success.",
};

export const SERVER_ERROR: ApiResponse = {
  ...default_error,
  status: status.SERVER_ERROR,
  message: "An error occurred on the server - refer to the data for more details.",
};

export const UNAUTHORISED: ApiResponse = {
  ...default_error,
  status: status.UNAUTHORISED,
  message: "Unauthorised.",
};

/* S */
export const storage_prefix = "__hyve_storage";
