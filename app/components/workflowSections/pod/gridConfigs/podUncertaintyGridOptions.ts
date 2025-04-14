import type {GridOptions} from 'ag-grid-community';
import type {PodUncertaintyData} from '~/stores/pod/types';

// eslint-disable-next-line no-unused-vars
const {floatingFiltersHeight, ...restBaseOptions} = baseGridOptions;

const gridOptions: GridOptions<PodUncertaintyData> = {
  ...restBaseOptions,
  rowSelection: 'multiple',
  rowMultiSelectWithClick: true,
  groupSelectsChildren: true,
  getRowId: params => params.data.id as string,
  rowHeight: 70,
  suppressContextMenu: true,
  tooltipShowDelay: 0,
  autoGroupColumnDef: {
    headerName: 'Chemical Name (Data)',
    headerTooltip: 'Chemical -- Data',
    colId: 'group',
    suppressHeaderMenuButton: true,
    tooltipValueGetter: () => null,
    comparator: gridUtil.comparators.baseComparator,
    filter: 'agSetColumnFilter',
    minWidth: 350,
    cellStyle: gridUtil.cellStyles.indentExpandableColumn,
    onCellClicked: gridUtil.colDefEvents.expandRowOnCellClick,
  },
};

gridOptions.defaultColDef!.sortable = true;
gridOptions.defaultColDef!.resizable = true;

export default gridOptions;
