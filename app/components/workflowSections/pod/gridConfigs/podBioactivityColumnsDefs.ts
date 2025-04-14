import type {ColDef, ICellRendererParams} from 'ag-grid-community';
import type {BerCalcRow} from '~/stores/bioActivity/types';

const colDefs: ColDef<BerCalcRow>[] = [
  {
    headerName: 'Preferred Name',
    rowGroup: true,
    hide: true,
    field: 'dtxsid',
    cellRenderer: 'ChemicalNameRenderer',
  },
  {
    headerName: '5th %ile AED95',
    headerComponentParams: {
      template: gridUtil.templates.subScriptTemplate({val: '5th %ile AED95', subLen: 2}),
    },
    headerTooltip: 'The 5th %ile of the distribution of available AED­95 values for a given chemical, where each AED95 is the estimated external dose (mg/kg/day) required to achieve a steady state plasma concentration for sensitive individuals (the 95th %ile, or Css,95) equivalent to the nominal assay concentration associated with in vitro bioactivity in ToxCast.',
    tooltipComponent: 'CustomHeaderTooltipSubSupScript',
    headerClass: 'podNamHeader',
    field: 'podDropDown',
    filter: 'agSetColumnFilter',
    cellRenderer: (params: ICellRendererParams<BerCalcRow>) => {
      if (!params.node.group) {
        const value = typeof params.data?.podDropDown === 'object' && (params.data?.podDropDown as {
          val: number;
        }).val ?
          roundedValueFormatter((params.data?.podDropDown as {
            val: number;
          }).val) :
          roundedValueFormatter(params.data?.podDropDown || '');
        return value ? `${value} mg/kg/day` : '';
      }
      return '';
    },
    cellRendererParams: {podDropDown: 'podDropDown'},
    minWidth: 275,
    maxWidth: 275,
  },
  {
    headerName: 'Exposure Value',
    headerClass: 'exposureValueHeader',
    field: 'exposureValue',
    filter: 'agSetColumnFilter',
    cellRenderer: (params: ICellRendererParams<BerCalcRow>) => {
      if (!params.node.group) {
        return roundedValueFormatter(params.data?.exposureValue || '');
      }
      return '';
    },
    cellRendererParams: {value: 'exposureValue'},
    minWidth: 225,
    maxWidth: 225,
  },
  {
    headerName: 'Exposure Units',
    headerClass: 'exposureUnitsHeader',
    field: 'exposureUnits',
    filter: 'agSetColumnFilter',
    minWidth: 225,
    maxWidth: 225,
  },
  {
    headerName: 'BER',
    headerClass: 'berHeader',
    headerTooltip: 'The ratio of the 5th %ile AED95 to the median (row 1) or lower bound (row 2) SEEM 3 ExpoCast modeled exposure values.',
    tooltipComponent: 'CustomHeaderTooltipSubSupScript',
    field: 'ber',
    filter: 'agSetColumnFilter',
    cellRenderer: (params: ICellRendererParams<BerCalcRow>) => {
      if (!params.node.group) {
        return roundedValueFormatter(params.data?.ber || '');
      }
      return '';
    },
    minWidth: 175,
    maxWidth: 175,
  },
  {
    headerName: 'BER Type',
    headerClass: 'defaultHeader',
    field: 'type',
    filter: 'agSetColumnFilter',
    minWidth: 200,
    maxWidth: 200,
  },
];

export default colDefs;
