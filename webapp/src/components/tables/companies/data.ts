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

export const mongoPopulationFields: string[] = [];

export const mongoSelectionFields = ["name", "userIds", "bucketIds", "createdAt", "updatedAt"];

export const storageKey: string = "companies_table_headers";

export const tableHeaders: TableHeader[] = [
  {
    value: "name",
    label: "Company Name",
    sortable: false,
    visible: true,
  },
  {
    value: "userIdCount",
    label: "User Count",
    sortable: false,
    visible: true,
  },
  {
    value: "bucketIdCount",
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
