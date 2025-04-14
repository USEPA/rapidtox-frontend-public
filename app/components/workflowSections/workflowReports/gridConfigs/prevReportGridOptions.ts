import type {GridOptions} from 'ag-grid-community';
import type {PreviousReport} from '~/api/Report/types';

const gridOptions: GridOptions<PreviousReport> = {
  rowHeight: 60,
  suppressPropertyNamesCheck: true,
  enableCellTextSelection: true,
  floatingFiltersHeight: 60,
  suppressMenuHide: true,
};

gridOptions.defaultColDef = baseGridOptions.defaultColDef;

export default gridOptions;
