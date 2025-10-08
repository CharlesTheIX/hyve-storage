import * as users from "../users/data";
import * as buckets from "../buckets/data";
import * as companies from "../companies/data";

export const getTableHeaders = (type: TableType): TableHeader[] => {
  switch (type) {
    case "buckets":
      return buckets.bucket_table_headers;
    case "companies":
      return companies.table_headers;
    case "objects":
      return buckets.object_table_headers;
    case "users":
      return users.table_headers;
  }
};

export const getTableStorageKey = (type: TableType): string => {
  switch (type) {
    case "buckets":
      return buckets.bucket_storage_key;
    case "companies":
      return companies.storage_key;
    case "objects":
      return buckets.object_storage_key;
    case "users":
      return users.storage_key;
  }
};

export const getTableMongoFilters = (type: TableType): ApiRequestFilters => {
  const data: ApiRequestFilters = {
    skip: 0,
    limit: 10,
    fields: [],
    populate: [],
    sort: { field: "createdAt", order: "asc" },
  };
  switch (type) {
    case "buckets":
      data.fields = buckets.bucket_mongo_selection_fields;
      data.populate = buckets.bucket_mongo_population_fields;
      return data;

    case "companies":
      data.fields = companies.mongo_selection_fields;
      data.populate = companies.mongo_population_fields;
      return data;

    case "objects":
      data.fields = buckets.object_mongo_selection_fields;
      data.populate = buckets.object_mongo_population_fields;
      return data;

    case "users":
      data.fields = users.mongo_selection_fields;
      data.populate = users.mongo_population_fields;
      return data;
  }
};
