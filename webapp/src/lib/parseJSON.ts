export default (value?: string): any | null => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (err: any) {
    return null;
  }
};
