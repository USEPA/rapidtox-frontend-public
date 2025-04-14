import type {GridOptions, IRowNode} from 'ag-grid-community';
import type {AnaloguePodDataSelection} from '~/stores/pod/types';

// eslint-disable-next-line no-unused-vars
const {floatingFiltersHeight, ...restBaseOptions} = baseGridOptions;

const gridOptions: GridOptions<AnaloguePodDataSelection> = {
  ...restBaseOptions,
  rowSelection: 'multiple',
  rowMultiSelectWithClick: true,
  groupSelectsChildren: true,
  suppressContextMenu: true,
  autoGroupColumnDef: {
    headerName: 'Input (Data)',
    headerTooltip: 'Group',
    colId: 'group',
    comparator: gridUtil.comparators.baseComparator,
    suppressHeaderMenuButton: true,
    headerCheckboxSelection: true,
    filter: 'agSetColumnFilter',
    tooltipValueGetter(params) {
      const count = params.node?.allChildrenCount;
      if (count != null) {
        return `${params.value} (${count})`;
      }
      return params.value;
    },
    checkboxSelection: rowNode => !!rowNode.node.group,
    minWidth: 375,
    cellStyle: gridUtil.cellStyles.indentExpandableColumn,
    onCellClicked: gridUtil.colDefEvents.expandRowOnCellClick,
  },

};

gridOptions.defaultColDef!.sortable = true;
gridOptions.defaultColDef!.resizable = true;

export default gridOptions;
