export const application_mime_types = [
  "application/pdf",
  "application/xml",
  "application/zip",
  "application/json",
  "application/x-tar",
  "application/msword",
  "application/graphql",
  "application/vnd.ms-excel",
  "application/octet-stream",
  "application/x-7z-compressed",
  "application/x-rar-compressed",
  "application/vnd.ms-powerpoint",
  "application/x-www-form-urlencoded",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation"
];

export const audio_mime_types = [
  "audio/wav",
  "audio/ogg",
  "audio/aac",
  "audio/mp4",
  "audio/webm",
  "audio/flac",
  "audio/mpeg" // MP3
];

export const font_mime_types = [
  "font/ttf",
  "font/otf",
  "font/woff",
  "font/woff2",
  "application/font-woff",
  "application/font-woff2",
  "application/x-font-ttf",
  "application/x-font-opentype",
  "application/vnd.ms-fontobject"
];

export const form_mime_types = ["multipart/form-data", "application/x-www-form-urlencoded"];

export const image_mime_types = [
  "image/png",
  "image/gif",
  "image/bmp",
  "image/webp",
  "image/jpeg",
  "image/tiff",
  "image/svg+xml",
  "image/vnd.microsoft.icon"
];

export const text_mime_types = [
  "text/css",
  "text/csv",
  "text/xml",
  "text/html",
  "text/plain",
  "text/markdown",
  "text/javascript"
];

export const video_mime_types = [
  "video/mp4",
  "video/ogg",
  "video/webm",
  "video/3gpp",
  "video/3gpp2",
  "video/x-ms-wmv", // WMV
  "video/x-msvideo" // AVI
];

export const mime_types_record: Record<string, string> = {
  pdf: "application/pdf",
  xml: "application/xml",
  zip: "application/zip",
  json: "application/json",
  tar: "application/x-tar",
  doc: "application/msword",
  xls: "application/vnd.ms-excel",
  ppt: "application/vnd.ms-powerpoint",
  "7z": "application/x-7z-compressed",
  rar: "application/x-rar-compressed",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  wav: "audio/wav",
  ogg: "audio/ogg",
  aac: "audio/aac",
  mp4: "audio/mp4", // can be video/mp4 too, but keep for audio here
  webm: "audio/webm",
  flac: "audio/flac",
  mp3: "audio/mpeg",

  ttf: "font/ttf",
  otf: "font/otf",
  woff: "font/woff",
  woff2: "font/woff2",

  png: "image/png",
  gif: "image/gif",
  bmp: "image/bmp",
  webp: "image/webp",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  ico: "image/vnd.microsoft.icon",

  css: "text/css",
  csv: "text/csv",
  html: "text/html",
  txt: "text/plain",
  md: "text/markdown",
  js: "text/javascript",

  "3gp": "video/3gpp",
  "3g2": "video/3gpp2",
  wmv: "video/x-ms-wmv",
  avi: "video/x-msvideo"
};

export default [
  ...application_mime_types,
  ...audio_mime_types,
  ...font_mime_types,
  ...form_mime_types,
  ...image_mime_types,
  ...text_mime_types,
  ...video_mime_types
];