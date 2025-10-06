export default (fields?: string[]): MongoProjection => {
  if (!fields || !fields.length) return { _id: 1 };
  const selection: MongoProjection = {};
  fields?.forEach((item: string) => {
    const exclude = item.indexOf("-") === 0;
    selection[item] = exclude ? 0 : 1;
  });
  return selection;
};
