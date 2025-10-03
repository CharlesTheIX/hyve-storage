export type ByteFormat = "KB" | "MB" | "GB" | "TB" | "PB";

export default (bytes: number, format: ByteFormat): number => {
  var exponent: number = 0;
  switch (format) {
    case "KB":
      exponent = 3;
      break;
    case "MB":
      exponent = 6;
      break;
    case "GB":
      exponent = 9;
      break;
    case "TB":
      exponent = 12;
      break;
    case "PB":
      exponent = 15;
      break;
  }
  return Number((bytes / 10 ** exponent).toFixed(2));
};
