import type {GridOptions} from 'ag-grid-community';
import type {SelectedChemical} from '~/stores/chemicalSearch/types';

const gridOptions: GridOptions<SelectedChemical> = {
  ...baseGridOptions,
  headerHeight: 60,
  statusBar: {
    statusPanels: [
      {statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'},
      {statusPanel: 'IdentifiersAndResultsStatusPanel', align: 'left'},
      {statusPanel: 'agSelectedRowCountComponent'},
      {statusPanel: 'UnmatchedCountStatusPanel'},
    ],
  },
  suppressContextMenu: true,
  rowSelection: 'multiple',
  rowMultiSelectWithClick: true,
  tooltipInteraction: true,
  tooltipShowDelay: 0,
};

export default gridOptions;
