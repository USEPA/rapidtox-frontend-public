import type {GridOptions} from 'ag-grid-community';
import type {BioactivityToxcastRes} from '~/api/Bioactivity/types';

// eslint-disable-next-line no-unused-vars
const {floatingFiltersHeight, ...restBaseOptions} = baseGridOptions;

const gridOptions: GridOptions<BioactivityToxcastRes> = {
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
    headerCheckboxSelection: true,
    comparator: gridUtil.comparators.baseComparator,
    filter: 'agSetColumnFilter',
    checkboxSelection: rowNode => !!rowNode.node.group,
    minWidth: 375,
    cellRendererParams: {
      suppressCount: true,
    },

    cellStyle: gridUtil.cellStyles.indentExpandableColumn,
    onCellClicked: gridUtil.colDefEvents.expandRowOnCellClick,
  },

};

gridOptions.defaultColDef!.sortable = true;
gridOptions.defaultColDef!.resizable = true;
gridOptions.defaultColDef!.tooltipValueGetter = () => undefined;

export default gridOptions;
