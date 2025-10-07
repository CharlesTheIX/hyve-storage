import * as users from "./users/data";
import * as buckets from "./buckets/data";
import * as companies from "./companies/data";

export const getTableHeaders = (type: TableType): TableHeader[] => {
  var table_headers: TableHeader[] = [];
  switch (type) {
    case "buckets":
      table_headers = buckets.bucket_table_headers;
      // if (admin) table_headers = [...table_headers, ...buckets.bucket_admin_table_headers];
      table_headers = [...table_headers, ...buckets.bucket_admin_table_headers];
      break;
    case "companies":
      table_headers = companies.table_headers;
      // if (admin) table_headers = [...table_headers, ...companies.admin_table_headers];
      table_headers = [...table_headers, ...companies.admin_table_headers];
      break;
    case "objects":
      table_headers = buckets.object_table_headers;
      // if (admin) table_headers = [...table_headers, ...buckets.object_admin_table_headers];
      table_headers = [...table_headers, ...buckets.object_admin_table_headers];
      break;
    case "users":
      table_headers = users.table_headers;
      // if (admin) table_headers = [...table_headers, ...users.admin_table_headers];
      table_headers = [...table_headers, ...users.admin_table_headers];
      break;
  }
  return table_headers;
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

export const getTableMongoData = (type: TableType): Partial<ApiRequestFilters> => {
  const data: Partial<ApiRequestFilters> = {
    fields: [],
    populate: [],
  };
  switch (type) {
    case "buckets":
      data.fields = buckets.bucket_mongo_selection_fields;
      data.populate = buckets.bucket_mongo_population_fields;
      break;

    case "companies":
      data.fields = companies.mongo_selection_fields;
      data.populate = companies.mongo_population_fields;
      break;

    case "objects":
      data.fields = buckets.object_mongo_selection_fields;
      data.populate = buckets.object_mongo_population_fields;
      break;

    case "users":
      data.fields = users.mongo_selection_fields;
      data.populate = users.mongo_population_fields;
      break;
  }
  return data;
};
