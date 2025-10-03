export default (fields?: string[]): MongoProjection => {
  const selection: MongoProjection = {};
  fields?.forEach((item: string) => {
    const exclude = item.indexOf("-") === 0;
    selection[item] = exclude ? 0 : 1;
  });
  return selection;
};
