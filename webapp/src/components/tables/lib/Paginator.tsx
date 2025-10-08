import { colors } from "@/globals";
import Chevron from "@/components/svgs/Chevron";
import SelectInput from "@/components/inputs/SelectInput";
import PaginationEnd from "@/components/svgs/PaginationEnd";

type P = {
  list_length: number;
  collection_count: number;
  filters: ApiRequestFilters;
  updateFilters: (filters: ApiRequestFilters) => void;
  getTableData: (filters: ApiRequestFilters) => Promise<void>;
};

const options: Option[] = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

const Paginator: React.FC<P> = (props: P) => {
  const { updateFilters, getTableData, collection_count, filters, list_length } = props;
  const default_value = options.find((i) => i.value === filters.limit) || options[options.length - 1];

  return (
    <div className="hyve-paginator">
      <p>Rows:</p>

      <div className="limit-container">
        <SelectInput
          name="limit"
          required={true}
          options={options}
          default_value={default_value}
          onChange={(option: Option) => {
            const next = { ...filters, skip: 0, limit: option.value as number };
            updateFilters(next);
            getTableData(next);
          }}
        />
      </div>

      <div className="button-container">
        <div
          className={`pagination-button ${filters.skip === 0 ? "disabled" : ""}`}
          onClick={() => {
            if (filters.skip === 0) return;
            const next = { ...filters, skip: 0 };
            getTableData(next);
            updateFilters(next);
          }}
        >
          <PaginationEnd size={24} primary_color={colors.green} direction="left" />
        </div>

        <div
          className={`pagination-button ${filters.skip === 0 ? "disabled" : ""}`}
          onClick={() => {
            if (filters.skip === 0) return;
            const skip = filters.skip - filters.limit < 0 ? 0 : filters.skip - filters.limit;
            const next = { ...filters, skip: skip };
            getTableData(next);
            updateFilters(next);
          }}
        >
          <Chevron size={24} primary_color={colors.green} direction="left" />
        </div>

        {filters.skip >= 0 && (
          <p>
            <strong>
              {list_length === 1 ? filters.skip + 1 : `${filters.skip + 1} - ${filters.skip + list_length}`}
              {collection_count && ` / ${collection_count}`}
            </strong>
          </p>
        )}

        <div
          className={`pagination-button ${filters.skip + list_length >= collection_count ? "disabled" : ""}`}
          onClick={() => {
            if (filters.skip + list_length >= collection_count) return;
            const skip = filters.skip + filters.limit > collection_count ? collection_count : filters.skip + filters.limit;
            const next = { ...filters, skip: skip };
            getTableData(next);
            updateFilters(next);
          }}
        >
          <Chevron size={24} primary_color={colors.green} direction="right" />
        </div>

        <div
          className={`pagination-button ${filters.skip + list_length >= collection_count ? "disabled" : ""}`}
          onClick={() => {
            if (filters.skip + list_length >= collection_count) return;
            const next = { ...filters, skip: collection_count - filters.limit };
            getTableData(next);
            updateFilters(next);
          }}
        >
          <PaginationEnd size={24} primary_color={colors.green} direction="right" />
        </div>
      </div>
    </div>
  );
};

export default Paginator;
