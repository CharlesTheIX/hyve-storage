export default (query: any, populate?: string[]) => {
  populate?.forEach((p) => query.populate(p));
  return query;
};
