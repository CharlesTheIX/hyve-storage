export const admin_table_headers: TableHeader[] = [
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

export const mongo_population_fields: string[] = [];

export const mongo_selection_fields = ["name", "user_ids", "bucket_ids", "createdAt", "updatedAt"];

export const storage_key: string = "companies_table_headers";

export const table_headers: TableHeader[] = [
  {
    value: "name",
    label: "Company Name",
    sortable: false,
    visible: true,
  },
  {
    value: "user_idCount",
    label: "User Count",
    sortable: false,
    visible: true,
  },
  {
    value: "bucket_idCount",
    label: "Bucket Count",
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
