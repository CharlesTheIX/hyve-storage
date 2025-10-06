export const bucketStorageKey: string = "buckets_table_headers";
export const bucketTableHeaders: TableHeader[] = [
  {
    value: "name",
    label: "Name",
    sortable: false,
    visible: true,
  },
  {
    value: "companyId",
    label: "Company",
    sortable: false,
    visible: true,
  },
  {
    value: "objectCount",
    label: "Object Count",
    sortable: false,
    visible: true,
  },
  {
    value: "maxSize_bytes",
    label: "Size Limit (KB)",
    sortable: false,
    visible: true,
  },
  {
    value: "consumption_bytes",
    label: "Consumption (KB)",
    sortable: false,
    visible: true,
  },
  {
    value: "permissions",
    label: "Permissions",
    sortable: false,
    visible: true,
  },
  {
    value: "createdAt",
    label: "Creation Date",
    sortable: false,
    visible: true,
  },
  {
    value: "updatedAt",
    label: "Last Updated",
    sortable: false,
    visible: true,
  },
];
export const bucketAdminTableHeaders: TableHeader[] = [
  {
    value: "_id",
    label: "_id",
    sortable: false,
    visible: true,
  },
  {
    value: "delete",
    label: "Delete",
    sortable: false,
    visible: true,
  },
];
export const bucketMongoPopulationFields: string[] = ["companyId"];
export const bucketMongoSelectionFields: string[] = [
  "createdAt",
  "companyId",
  "consumption_bytes",
  "maxSize_bytes",
  "name",
  "objectCount",
  "permissions",
  "updatedAt",
];

export const objectStorageKey: string = "buckets_objects_table_headers";
export const objectTableHeaders: TableHeader[] = [
  {
    value: "name",
    label: "Name",
    sortable: false,
    visible: true,
  },
  {
    value: "size",
    label: "Size (KB)",
    sortable: false,
    visible: true,
  },
  {
    value: "etag",
    label: "Etag",
    sortable: false,
    visible: true,
  },
  {
    value: "lastModified",
    label: "Last Modified",
    sortable: false,
    visible: true,
  },
];
export const objectAdminTableHeaders: TableHeader[] = [
  {
    value: "delete",
    label: "Delete",
    sortable: false,
    visible: true,
  },
];
export const objectMongoPopulationFields: string[] = [];
export const objectMongoSelectionFields: string[] = [];
