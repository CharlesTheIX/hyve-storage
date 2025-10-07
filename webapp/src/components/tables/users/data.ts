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

export const mongo_population_fields: string[] = ["company_id"];

export const mongo_selection_fields: string[] = ["username", "first_name", "surname", "permissions", "company_id", "createdAt", "updatedAt"];

export const table_headers: TableHeader[] = [
  {
    value: "username",
    label: "Username",
    sortable: false,
    visible: true,
  },
  {
    value: "first_name",
    label: "First Name",
    sortable: false,
    visible: true,
  },
  {
    value: "surname",
    label: "Surname",
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

export const storage_key: string = "users_table_headers";
