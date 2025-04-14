import type {GridOptions, IRowNode} from 'ag-grid-community';
import type {BerCalcRow} from '~/stores/bioActivity/types';

// eslint-disable-next-line no-unused-vars
const {floatingFiltersHeight, ...restBaseOptions} = baseGridOptions;

const gridOptions: GridOptions<BerCalcRow> = {
  ...restBaseOptions,
  rowHeight: 50,
  rowSelection: 'multiple',
  rowMultiSelectWithClick: true,
  groupSelectsChildren: true,
  context: {
    componentParent: this,
  },
  autoGroupColumnDef: {
    headerName: 'Chemical Name (Data)',
    headerTooltip: 'Group',
    colId: 'group',
    suppressHeaderMenuButton: true,
    comparator: gridUtil.comparators.baseComparator,
    tooltipValueGetter: () => null,
    filter: 'agSetColumnFilter',
    minWidth: 375,
    cellStyle: gridUtil.cellStyles.indentExpandableColumn,
    onCellClicked: gridUtil.colDefEvents.expandRowOnCellClick,
  },

};

gridOptions.defaultColDef!.sortable = true;
gridOptions.defaultColDef!.resizable = true;

export default gridOptions;
