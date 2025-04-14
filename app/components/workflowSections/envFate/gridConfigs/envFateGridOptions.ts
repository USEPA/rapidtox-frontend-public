import type {GridOptions} from 'ag-grid-community';
import type {PhyschemSummary} from '~/api/Physchem/types';

const gridOptions: GridOptions<PhyschemSummary> = {
  ...physchemGridOptions,
  statusBar: {
    statusPanels: [
      {
        statusPanel: 'ChemsReviewedStatusPanel',
        align: 'right',
        statusPanelParams: {
          chemsReviewedCount: () => useEnvFateStore().chemicalsReviewedCount,
          totalChemicalsCount: () => useEnvFateStore().totalChemicalsCount,
        },
      },
      {
        statusPanel: 'ChemsWorkedOnStatusPanel',
        align: 'right',
        statusPanelParams: {
          chemsWorkedOnCount: () => useEnvFateStore().chemicalsWorkedOnCount,
          totalChemicalsCount: () => useEnvFateStore().totalChemicalsCount,
        },
      },
    ],
  },
};

export default gridOptions;
