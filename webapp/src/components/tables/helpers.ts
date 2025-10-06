import * as users from "./users/data";
import * as buckets from "./buckets/data";
import * as companies from "./companies/data";

export const getTableHeaders = (type: TableType): TableHeader[] => {
  var tableHeaders: TableHeader[] = [];
  switch (type) {
    case "buckets":
      tableHeaders = buckets.bucketTableHeaders;
      // if (admin) tableHeaders = [...tableHeaders, ...buckets.bucketAdminTableHeaders];
      tableHeaders = [...tableHeaders, ...buckets.bucketAdminTableHeaders];
      break;
    case "companies":
      tableHeaders = companies.tableHeaders;
      // if (admin) tableHeaders = [...tableHeaders, ...companies.adminTableHeaders];
      tableHeaders = [...tableHeaders, ...companies.adminTableHeaders];
      break;
    case "objects":
      tableHeaders = buckets.objectTableHeaders;
      // if (admin) tableHeaders = [...tableHeaders, ...buckets.objectAdminTableHeaders];
      tableHeaders = [...tableHeaders, ...buckets.objectAdminTableHeaders];
      break;
    case "users":
      tableHeaders = users.tableHeaders;
      // if (admin) tableHeaders = [...tableHeaders, ...users.adminTableHeaders];
      tableHeaders = [...tableHeaders, ...users.adminTableHeaders];
      break;
  }
  return tableHeaders;
};

export const getTableStorageKey = (type: TableType): string => {
  switch (type) {
    case "buckets":
      return buckets.bucketStorageKey;
    case "companies":
      return companies.storageKey;
    case "objects":
      return buckets.objectStorageKey;
    case "users":
      return users.storageKey;
  }
};

export const getTableMongoData = (type: TableType): Partial<ApiRequestOptions> => {
  const data: Partial<ApiRequestOptions> = {};
  switch (type) {
    case "buckets":
      data.fields = buckets.bucketMongoSelectionFields;
      data.populate = buckets.bucketMongoPopulationFields;
      break;

    case "companies":
      data.fields = companies.mongoPopulationFields;
      data.populate = companies.mongoSelectionFields;
      break;

    case "objects":
      data.fields = buckets.objectMongoPopulationFields;
      data.populate = buckets.objectMongoSelectionFields;
      break;

    case "users":
      data.fields = users.mongoPopulationFields;
      data.populate = users.mongoSelectionFields;
      break;
  }
  return data;
};
