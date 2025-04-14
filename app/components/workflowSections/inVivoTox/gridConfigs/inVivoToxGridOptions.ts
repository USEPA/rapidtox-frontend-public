import type {GridOptions} from 'ag-grid-community';
import type {PodData} from '../../../../../types';

// eslint-disable-next-line no-unused-vars
const {floatingFiltersHeight, ...restBaseOptions} = baseGridOptions;

const gridOptions: GridOptions<PodData> = {
  ...restBaseOptions,
  statusBar: {
    statusPanels: [
      {
        statusPanel: 'ChemsReviewedStatusPanel',
        align: 'right',
        statusPanelParams: {
          chemsReviewedCount: () => useHazardStore().chemicalsReviewedCount,
          totalChemicalsCount: () => useHazardStore().totalChemicalsCount,
        },
      },
      {
        statusPanel: 'ChemsWorkedOnStatusPanel',
        align: 'right',
        statusPanelParams: {
          chemsWorkedOnCount: () => useHazardStore().chemicalsWorkedOnCount,
          totalChemicalsCount: () => useHazardStore().totalChemicalsCount,
        },
      },
    ],
  },
  groupMaintainOrder: true,
  autoGroupColumnDef: {
    headerName: 'Chemical Name (Data)',
    colId: 'group',
    suppressHeaderMenuButton: true,
    headerCheckboxSelection: true,
    minWidth: 575,
    tooltipValueGetter: () => null,
    checkboxSelection: rowNode => !!rowNode.node.group,
    cellStyle: gridUtil.cellStyles.indentExpandableColumn,
    onCellClicked: gridUtil.colDefEvents.expandRowOnCellClick,
  },
  defaultColDef: {
    suppressKeyboardEvent: baseGridOptions.defaultColDef?.suppressKeyboardEvent,
    filter: true,
    floatingFilter: true,
    floatingFilterComponent: 'TextFloatingFilterComponent',
    suppressFloatingFilterButton: true,
  },
  suppressContextMenu: true,
  rowSelection: 'multiple',
  groupSelectsChildren: true,
  groupSelectsFiltered: true,
  rowMultiSelectWithClick: true,
};

gridOptions.defaultColDef!.sortable = true;
gridOptions.defaultColDef!.resizable = true;
gridOptions.defaultColDef!.tooltipValueGetter = (params) => {
  if (!params.value || params.value === '-') {
    // eslint-disable-next-line no-undefined
    return undefined;
  }
  return params.value;
};

export default gridOptions;
