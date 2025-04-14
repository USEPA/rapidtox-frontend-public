import type {GridOptions} from 'ag-grid-community';
import {isInVivoSelectable} from '../helpers/helpers';
import type {PodData} from '~~/types';

// eslint-disable-next-line no-unused-vars
const {floatingFiltersHeight, ...restBaseOptions} = baseGridOptions;

const gridOptions: GridOptions<PodData> = {
  ...restBaseOptions,
  rowHeight: 50,
  rowSelection: 'multiple',
  rowMultiSelectWithClick: true,
  groupSelectsChildren: true,
  groupRowRendererParams: {
    suppressCount: true,
    innerRenderer: () => {
      return 'hello';
    },
  },
  isRowSelectable: (rowNode) => {
    return rowNode.data?.superCategory ?
      isInVivoSelectable(rowNode.data?.superCategory) :
      false;
  },
  context: {
    componentParent: this,
  },
  autoGroupColumnDef: {
    headerName: 'Chemical Name (Data)',
    headerTooltip: 'Group',
    colId: 'group',
    suppressHeaderMenuButton: true,
    headerCheckboxSelection: true,
    filter: 'agSetColumnFilter',
    checkboxSelection: (rowNode) => {
      const isRowHeaderGroup = !!rowNode.node.group && rowNode.node.level === 0;
      // Only dose response & custom dose response should be selectable.
      const isSelectableRowHeaderSubGroup = (!!rowNode.node.group && rowNode.node.level === 1 &&
        isInVivoSelectable(rowNode.node.key as string));
      return isRowHeaderGroup || isSelectableRowHeaderSubGroup;
    },
    minWidth: 375,
    cellStyle: gridUtil.cellStyles.indentExpandableColumn,
    onCellClicked: gridUtil.colDefEvents.expandRowOnCellClick,
  },
};

gridOptions.defaultColDef!.sortable = true;
gridOptions.defaultColDef!.resizable = true;

export default gridOptions;
