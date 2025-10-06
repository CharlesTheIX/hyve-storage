export const adminTableHeaders: TableHeader[] = [
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

export const mongoPopulationFields: string[] = ["companyId"];

export const mongoSelectionFields: string[] = ["username", "firstName", "surname", "permissions", "companyId", "createdAt", "updatedAt"];

export const tableHeaders: TableHeader[] = [
  {
    value: "username",
    label: "Username",
    sortable: false,
    visible: true,
  },
  {
    value: "firstName",
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
    value: "companyId",
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

export const storageKey: string = "users_table_headers";
