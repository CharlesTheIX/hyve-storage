"use client";
import { colors } from "@/globals";
import ColumnFilters from "./ColumnFilters";
import Refresh from "@/components/svgs/Refresh";

type Props = {
  loading: boolean;
  storage_key: string;
  headers: TableHeader[];
  filters: ApiRequestFilters;
  getTableData: (filters: ApiRequestFilters) => Promise<void>;
  setHeaders: React.Dispatch<React.SetStateAction<TableHeader[]>>;
};

const TableControls: React.FC<Props> = (props: Props) => {
  const { loading, storage_key, headers, filters, getTableData, setHeaders } = props;
  return (
    <div className="table-controls">
      <ColumnFilters filters={filters} headers={headers} setHeaders={setHeaders} storage_key={storage_key} />

      <div
        className="refresh-button"
        onClick={async () => {
          if (loading) return;
          await getTableData(filters);
        }}
      >
        <Refresh size={32} primary_color={colors.green} />
      </div>
    </div>
  );
};

export default TableControls;
