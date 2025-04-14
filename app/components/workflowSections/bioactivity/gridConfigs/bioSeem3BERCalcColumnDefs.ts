import type {ColDef} from 'ag-grid-community';
import type {BerCalcRow} from '~/stores/bioActivity/types';

const colDefs: ColDef<BerCalcRow>[] = [
  {
    headerName: 'DRSV-NAM',
    field: 'podDropDown',
    cellRenderer: 'BerCalcAddRowAndPodNamRenderer',
    minWidth: 200,
    enableCellChangeFlash: true,
    cellClass: params => params.node.rowIndex !== params.api.getDisplayedRowCount() - 1 ? 'seem3-ber-pod-nam-col' : '',
    cellEditorPopup: true,
    cellRendererSelector: (params) => {
      if (params.node?.rowIndex === params.api.getDisplayedRowCount() - 1) {
        return {
          component: 'Seem3BerCalcAddRowRenderer',
        };
      }

      return {
        component: 'Seem3BerCalcPodNameRenderer',
      };
    },
    colSpan: (params) => {
      if (params.node?.rowIndex === params.api.getDisplayedRowCount() - 1) {
        const totalColumns = params.api?.getColumnDefs()?.length;
        return totalColumns as number;
      }
      return 1;
    },
    cellStyle: (params) => {
      if (params.node.rowIndex === params.api.getDisplayedRowCount() - 1) {
        return {
          textAlign: 'center', backgroundColor: 'darkgreen', borderTop: '1px #003354 solid', borderBottom: '1px #003354 solid',
        };
      }
      return null;
    },
  },
  {
    headerName: 'Exposure Value',
    field: 'exposureValue',
    cellClass: params => params.node.rowIndex !== params.api.getDisplayedRowCount() - 1 ? 'seem3-ber-pod-nam-col' : '',
    headerTooltip: 'All oral exposure values must be in mg/kg-day regardless of media (e.g., water, soil). User-provided exposure values should be properly converted to mg/kg-day before manually entering below.',
    cellRenderer: 'Seem3BerCalcExposureValRenderer',
    minWidth: 220,
  },
  {
    headerName: 'Exposure Units',
    field: 'exposureUnits',
    headerTooltip: 'Oral exposure in mg/kg-day',
    minWidth: 215,
  },
  {
    headerName: 'BER',
    field: 'ber',
    headerTooltip: 'Bioactivity:Exposure Ratio (BER) = DRSV-NAM (mg/kg-day) / Exposure (mg/kg-day)',
    minWidth: 120,
    cellRenderer: 'Seem3BerCalcBerRenderer',
  },
];

export default colDefs;
