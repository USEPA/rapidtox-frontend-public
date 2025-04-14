import type {GridOptions} from 'ag-grid-community';
import {usePhyschemStore} from '../../../../stores/physchem/physchem';
import type {PhyschemSummary} from '~/api/Physchem/types';

// eslint-disable-next-line no-unused-vars
const {rowHeight, ...restBaseOptions} = baseGridOptions;

const gridOptions: GridOptions<PhyschemSummary> = {
  ...restBaseOptions,
  getRowHeight: params => (params.node.group ? 60 : 72),
  floatingFiltersHeight: 60,
  debounceVerticalScrollbar: true,
  headerHeight: 60,
  statusBar: {
    statusPanels: [
      {
        statusPanel: 'ChemsReviewedStatusPanel',
        align: 'right',
        statusPanelParams: {
          chemsReviewedCount: () => usePhyschemStore().chemicalsReviewedCount,
          totalChemicalsCount: () => usePhyschemStore().totalChemicalsCount,
        },
      },
      {
        statusPanel: 'ChemsWorkedOnStatusPanel',
        align: 'right',
        statusPanelParams: {
          chemsWorkedOnCount: () => usePhyschemStore().chemicalsWorkedOnCount,
          totalChemicalsCount: () => usePhyschemStore().totalChemicalsCount,
        },
      },
    ],
  },
  autoGroupColumnDef: {
    headerName: 'Chemical Name (Data)',
    headerTooltip: 'Group',
    suppressHeaderMenuButton: true,
    headerCheckboxSelection: true,
    sortable: true,
    comparator: gridUtil.comparators.baseComparator,
    tooltipValueGetter: () => null,
    filter: 'agSetColumnFilter',
    minWidth: 375,
    checkboxSelection: rowNode => !!rowNode.node.group,
    cellStyle: gridUtil.cellStyles.indentExpandableColumn,
    onCellClicked: gridUtil.colDefEvents.expandRowOnCellClick,
  },
  rowSelection: 'multiple',
  rowMultiSelectWithClick: true,
  groupSelectsChildren: true,
  suppressAggFuncInHeader: true,
  groupRowRendererParams: {
    checkbox: true,
  },
};

gridOptions.defaultColDef!.cellStyle = {lineHeight: '35px'};

export default gridOptions;
