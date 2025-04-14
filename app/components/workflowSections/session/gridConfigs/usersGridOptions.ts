import type {GridOptions} from 'ag-grid-community';
import type {UserGridItem} from '~/api/Session/types';

const gridOptions: GridOptions<UserGridItem> = {
  rowSelection: 'multiple',
  rowHeight: 45,
  floatingFiltersHeight: 25,
  // showHeader: false, -- does not exist?
  suppressPropertyNamesCheck: true,
  suppressRowClickSelection: true,
  suppressHorizontalScroll: true,
  defaultColDef: {
    floatingFilter: true,
  },
};

gridOptions.onGridSizeChanged = baseGridOptions.onGridSizeChanged;

export default gridOptions;
