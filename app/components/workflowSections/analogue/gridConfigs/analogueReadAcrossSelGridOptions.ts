import type {
  CellFocusedEvent, Column, GridOptions,
} from 'ag-grid-community';
import type {ReadAcross} from '~/api/Analogue/types';

const gridOptions: GridOptions<ReadAcross> = {
  ...baseGridOptions,
  // Group columns
  groupHeaderHeight: 90,

  // Label columns
  headerHeight: 90,
};
gridOptions.onCellFocused = (params: CellFocusedEvent<ReadAcross>) => {
  if (params.column && (params.column as Column)?.getColId() === 'pod') {
    gridOptions.suppressRowClickSelection = true;
  } else {
    gridOptions.suppressRowClickSelection = false;
  }
};
gridOptions.defaultColDef!.headerClass = 'read-across-header';
export default gridOptions;
