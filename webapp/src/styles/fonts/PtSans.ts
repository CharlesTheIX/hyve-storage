import localFont from "next/font/local";

const PtSans = localFont({
  display: "swap",
  variable: "--font-PtSans",
  src: [
    {
      weight: "400",
      style: "normal",
      path: "./PtSans-Regular.woff2"
    },
    {
      weight: "700",
      style: "normal",
      path: "./PtSans-Bold.woff2"
    },
    {
      weight: "400",
      style: "italic",
      path: "./PtSans-Italic.woff2"
    },
    {
      weight: "700",
      style: "italic",
      path: "./PtSans-Bold-Italic.woff2"
    }
  ]
});

export default PtSans;