export const storage_key: string = "users_table_headers";
export const mongo_population_fields: string[] = ["company_id"];
export const mongo_selection_fields: string[] = ["username", "first_name", "surname", "permissions", "company_id", "createdAt", "updatedAt"];
export const table_headers: TableHeader[] = [
  {
    value: "username",
    label: "Username",
    sortable: true,
    visible: true,
  },
  {
    value: "first_name",
    label: "First Name",
    sortable: true,
    visible: true,
  },
  {
    value: "surname",
    label: "Surname",
    sortable: true,
    visible: true,
  },
  {
    value: "company_id",
    label: "Company",
    sortable: true,
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
