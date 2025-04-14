import type {GridOptions} from 'ag-grid-community';
import type {BioactivityBerRes} from '~/api/Bioactivity/types';

// eslint-disable-next-line no-unused-vars
const {floatingFiltersHeight, ...restBaseOptions} = baseGridOptions;

const gridOptions: GridOptions<BioactivityBerRes> = {
  ...restBaseOptions,
  rowHeight: 50,
  rowSelection: 'multiple',
  rowMultiSelectWithClick: true,
  groupSelectsChildren: true,
  isRowSelectable: params => !!params.data?.berLowerbound || !!params.data?.berMedian,
  tooltipShowDelay: 0,
  context: {
    componentParent: this,
  },
};

gridOptions.defaultColDef!.sortable = true;
gridOptions.defaultColDef!.resizable = true;
gridOptions.defaultColDef!.width = 300;

export default gridOptions;
