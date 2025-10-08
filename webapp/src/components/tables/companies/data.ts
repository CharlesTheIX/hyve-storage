export const mongo_population_fields: string[] = [];
export const storage_key: string = "companies_table_headers";
export const mongo_selection_fields = ["name", "user_ids", "bucket_ids", "createdAt", "updatedAt"];
export const table_headers: TableHeader[] = [
  {
    value: "name",
    label: "Company Name",
    sortable: true,
    visible: true,
  },
  {
    value: "user_ids",
    label: "User Count",
    sortable: true,
    visible: true,
  },
  {
    value: "bucket_ids",
    label: "Bucket Count",
    sortable: true,
    visible: true,
  },
  {
    value: "createdAt",
    label: "Creation Date",
    sortable: true,
    visible: false,
  },
  {
    value: "updatedAt",
    label: "Last Updated",
    sortable: true,
    visible: false,
  },
  {
    value: "_id",
    label: "_id",
    sortable: false,
    visible: true,
    permissions: [9],
  },
  {
    value: "delete",
    label: "Delete",
    sortable: false,
    visible: true,
    permissions: [9],
  },
];
