export const bucket_storage_key: string = "buckets_table_headers";
export const bucket_table_headers: TableHeader[] = [
  {
    value: "name",
    label: "Name",
    sortable: false,
    visible: true,
  },
  {
    value: "company_id",
    label: "Company",
    sortable: false,
    visible: true,
  },
  {
    value: "object_count",
    label: "Object Count",
    sortable: false,
    visible: true,
  },
  {
    value: "max_size_bytes",
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
export const bucket_admin_table_headers: TableHeader[] = [
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
export const bucket_mongo_population_fields: string[] = ["company_id"];
export const bucket_mongo_selection_fields: string[] = [
  "createdAt",
  "company_id",
  "consumption_bytes",
  "max_size_bytes",
  "name",
  "object_count",
  "permissions",
  "updatedAt",
];

export const object_storage_key: string = "buckets_objects_table_headers";
export const object_table_headers: TableHeader[] = [
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
export const object_admin_table_headers: TableHeader[] = [
  {
    value: "delete",
    label: "Delete",
    sortable: false,
    visible: true,
  },
];
export const object_mongo_population_fields: string[] = [];
export const object_mongo_selection_fields: string[] = [];
