import type {ColDef, ICellRendererParams} from 'ag-grid-community';

import type {BioactivityBerRes} from '~/api/Bioactivity/types';

const columnDefs: ColDef<BioactivityBerRes>[] = [
  {
    headerName: 'Chemical Name',
    field: 'chemicalName',
    cellRenderer: 'ChemicalNameRenderer',
    headerCheckboxSelection: true,
    checkboxSelection: params => !(params.data?.berLowerbound == null || params.data.berMedian == null),
    minWidth: 300,
  },
  {
    headerName: 'DTXSID',
    field: 'dtxsid',
    minWidth: 230,
  },
  {
    headerName: 'BER Calculator',
    cellRenderer: 'BerCalculatorRenderer',
    suppressHeaderMenuButton: true,
    cellRendererParams: {
      berCalcData: () => useBioactivityStore().berCalcData,
      saveBerCalcEntry: (data: SaveBerCalcEntryParams) => useBioactivityStore().saveBerCalcEntry(data),
    },
    headerTooltip: 'If desired, the user can select the icon below to calculate additional BERs using media- or site-specific exposure(s).',
    minWidth: 225,
  },
  {
    headerName: 'BER',
    field: 'berLowerbound',
    headerTooltip: 'The ratio of the 5th %ile AED95 (i.e., calculated using the 95th %ile steady state plasma concentration) to the 95th %ile estimate of the total US population median exposure from the SEEM3 ExpoCast model.',
    filter: 'agSetColumnFilter',
    cellRenderer: 'BioactivityValueRenderer',
    cellRendererParams: (params: ICellRendererParams<BioactivityBerRes>) => ({
      val: params.data?.berLowerbound,
    }),
    tooltipComponent: 'CustomHeaderTooltipSubSupScript',
    minWidth: 275,
  },
  {
    headerName: 'BER Median',
    field: 'berMedian',
    filter: 'agSetColumnFilter',
    headerTooltip: 'The ratio of the 5th %ile AED95 (i.e., calculated using the 95th %ile steady state plasma concentration) to the median estimate of total US population exposure from the SEEM3 ExpoCast model.',
    tooltipComponent: 'CustomHeaderTooltipSubSupScript',
    cellRenderer: 'BioactivityValueRenderer',
    cellRendererParams: (params: ICellRendererParams<BioactivityBerRes>) => ({
      val: params.data?.berMedian,
    }),
    minWidth: 210,
  },
  {
    headerName: '5th %ile AED95',
    headerComponentParams: {
      template: gridUtil.templates.subScriptTemplate({val: '5th %ile AED95', subLen: 2}),
    },
    field: 'aed95Pctile05',
    filter: 'agSetColumnFilter',
    headerTooltip: 'The 5th %ile of the distribution of available AED­95 values for a given chemical, where each AED95 is the estimated external dose (mg/kg/day) required to achieve a steady state plasma concentration for sensitive individuals (the 95th %ile, or Css,95) equivalent to the nominal assay concentration associated with in vitro bioactivity in ToxCast.',
    tooltipComponent: 'CustomHeaderTooltipSubSupScript',
    cellRenderer: 'BioactivityValueRenderer',
    cellRendererParams: (params: ICellRendererParams<BioactivityBerRes>) => ({
      val: params.data?.aed95Pctile05,
      units: params.data?.aedUnit,
    }),
    minWidth: 250,
  },
  {
    headerName: '50th %ile AED95',
    headerComponentParams: {
      template: gridUtil.templates.subScriptTemplate({val: '50 %ile AED95', subLen: 2}),
    },
    field: 'aed95Pctile50',
    filter: 'agSetColumnFilter',
    headerTooltip: 'The median (50th %ile) in the distribution of the AED95 values for a given chemical, where each AED95  is the estimated external dose (mg/kg/day) required to achieve a steady state plasma concentration for sensitive individuals (the 95th %ile, or Css,95) equivalent to the nominal assay concentration associated with in vitro bioactivity in ToxCast.',
    tooltipComponent: 'CustomHeaderTooltipSubSupScript',
    cellRenderer: 'BioactivityValueRenderer',
    cellRendererParams: (params: ICellRendererParams<BioactivityBerRes>) => ({
      val: params.data?.aed95Pctile50,
      units: params.data?.aedUnit,
    }),
    minWidth: 250,
  },
  {
    headerName: '95th %ile AED95',
    headerComponentParams: {
      template: gridUtil.templates.subScriptTemplate({val: '95th %ile AED95', subLen: 2}),
    },
    field: 'aed95Pctile95',
    filter: 'agSetColumnFilter',
    headerTooltip: 'The 95th %ile in the distribution of the AED95 values for a given chemical, where each AED95  is the estimated external dose (mg/kg/day) required to achieve a steady state plasma concentration for sensitive individuals (the 95th %ile, or Css,95) equivalent to the nominal assay concentration associated with in vitro bioactivity in ToxCast.',
    tooltipComponent: 'CustomHeaderTooltipSubSupScript',
    cellRenderer: 'BioactivityValueRenderer',
    cellRendererParams: (params: ICellRendererParams<BioactivityBerRes>) => ({
      val: params.data?.aed95Pctile95,
      units: params.data?.aedUnit,
    }),
    minWidth: 250,
  },
  {
    headerName: 'Median Exposure',
    field: 'exposureMedian',
    headerTooltip: 'The median exposure estimated for the total US population from the SEEM3 ExpoCast model.',
    filter: 'agSetColumnFilter',
    cellRenderer: 'BioactivityValueRenderer',
    cellRendererParams: (params: ICellRendererParams<BioactivityBerRes>) => ({
      val: params.data?.exposureMedian,
    }),
    minWidth: 250,
  },
  {
    headerName: '95th %ile Exposure',
    field: 'exposure95PercentMedian',
    headerTooltip: 'The upper bound on the credible interval for the estimated median exposure for the total US population from the SEEM3 ExpoCast model.',
    filter: 'agSetColumnFilter',
    cellRenderer: 'BioactivityValueRenderer',
    cellRendererParams: (params: ICellRendererParams<BioactivityBerRes>) => ({
      val: params.data?.exposure95PercentMedian,
    }),
    minWidth: 350,
  },
];

export default columnDefs;
