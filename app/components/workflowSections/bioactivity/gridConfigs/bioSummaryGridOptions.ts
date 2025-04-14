import type {GridOptions} from 'ag-grid-community';
import type {BioactivityBaseRes} from '~/api/Bioactivity/types';

// eslint-disable-next-line no-unused-vars
const {floatingFiltersHeight, ...restBaseOptions} = baseGridOptions;

const gridOptions: GridOptions<BioactivityBaseRes> = {
  ...restBaseOptions,
  rowHeight: 50,
  rowSelection: 'multiple',
  rowMultiSelectWithClick: true,
  groupSelectsChildren: true,
  tooltipShowDelay: 0,
  context: {
    componentParent: this,
  },
};

gridOptions.defaultColDef!.sortable = true;
gridOptions.defaultColDef!.resizable = true;
gridOptions.defaultColDef!.width = 300;
gridOptions.defaultColDef!.tooltipValueGetter = () => undefined;

export default gridOptions;
