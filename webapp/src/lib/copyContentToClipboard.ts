export default (content: string): SimpleError => {
  try {
    navigator.clipboard.writeText(content);
    return { error: false, title: "Copied to clipboard", message: "" };
  } catch (err: any) {
    return { error: true, title: "Failed to copy to clipboard", message: err.message };
  }
};
