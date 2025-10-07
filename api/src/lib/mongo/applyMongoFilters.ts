import { Query, SortOrder } from "mongoose";

export default (query: Query<any[] | any, any>, filters?: Partial<ApiRequestFilters>): Query<any[], any> => {
  const skip = filters?.skip || 0;
  const limit = filters?.limit || 100;
  var fields: MongoProjection = { _id: 1 };
  var sort: { [key: string]: SortOrder } = filters?.sort ? { [filters.sort.field]: filters?.sort?.order } : { createdAt: "desc" };
  if (filters?.fields && filters?.fields.length > 0) filters?.fields?.forEach((i: string) => (fields[i] = i.indexOf("-") === 0 ? 0 : 1));

  query.select(fields);
  filters?.populate?.forEach((p) => query.populate(p));

  if ((query as any).op === "find") {
    query.skip(skip);
    query.sort(sort);
    query.limit(limit);
  }

  return query;
};
