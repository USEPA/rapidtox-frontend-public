import type {ColDef, ICellRendererParams} from 'ag-grid-community';
import type {PodData} from '~~/types';

export const colDefs: ColDef<PodData>[] = [
  {
    headerName: 'Preferred Name',
    rowGroup: true,
    hide: true,
    field: 'preferredName',
    chartDataType: 'category',

  },
  {
    headerName: 'Chart',
    headerClass: 'plotHeader',
    cellRenderer: 'ChartRenderer',
    cellRendererParams: {
      section: 'In Vivo Toxicity',
      hazardDataSelected: () => useHazardStore().hazardDataSelected,
      hazardChartData: () => useHazardStore().hazardChartData,
      physchemDataSelected: () => usePhyschemStore().physchemDataSelected,
      analogueStepsData: () => useAnalogueStore().analogueChemicalsStepInfo,
    },
    minWidth: 130,
  },
  {
    headerName: 'Datasets',
    rowGroup: true,
    hide: true,
    field: 'superCategory',
    filter: false,
    sort: 'asc',
    comparator: gridUtil.comparators.superCategoryComparator,
  },
  {
    checkboxSelection: rowNode => !rowNode.node.group &&
      !!rowNode.node &&
      (rowNode.data?.superCategory === SUPER_HAZARD_TYPES.CUSTOM_POD_NAME ||
        rowNode.data?.superCategory === SUPER_HAZARD_TYPES.POD_NAME),
    minWidth: 50,
    maxWidth: 50,
    suppressHeaderMenuButton: true,
    cellStyle: {
      lineHeight: '35px',
    },
  },
  {
    headerName: 'Type',
    headerClass: 'typeHeader',
    field: 'toxvalType',
    filter: 'agSetColumnFilter',
    tooltipValueGetter: () => null,
    cellRenderer: 'BasicFocusableTooltipRenderer',
    cellRendererParams: (params: ICellRendererParams<PodData>): {
      tooltip: string;
      text: string;
      focusable?: boolean;
      dottedUnderline?: boolean;
    } => {
      const description = 'toxvalTypDefn';
      const source = params.data?.[description as keyof PodData];
      return {
        tooltip: source as string || '',
        text: params.value,
        focusable: true,
        dottedUnderline: !!source && source !== '-',
      };
    },
    minWidth: 175,
  },
  {
    headerName: 'Value',
    headerClass: 'valueHeader',
    field: 'toxvalNumeric',
    filter: 'agSetColumnFilter',
    sort: 'asc',
    cellRenderer: (params: ICellRendererParams<BerCalcRow>) => {
      if (!params.node.group) {
        return roundedValueFormatter(params.value);
      }
      return '';
    },
    comparator: gridUtil.comparators.realNumericalComparator,
    minWidth: 150,
    chartDataType: 'series',
  },
  {
    headerName: 'Units',
    headerClass: 'unitsHeader',
    field: 'toxvalUnits',
    filter: 'agSetColumnFilter',
    minWidth: 175,
  },
  {
    headerName: 'Effect',
    headerClass: 'criticalEffectHeader',
    field: 'criticalEffNt',
    tooltipField: 'criticalEffNt',
    filter: 'agSetColumnFilter',
    cellStyle: {
      lineHeight: '35px',
    },
    width: 700,
  },
  {
    headerName: 'Source',
    headerClass: 'sourceHeaderClass',
    field: 'source',
    filter: 'agSetColumnFilter',
    tooltipField: 'source',
    minWidth: 200,
    chartDataType: 'series',
  },
];

export default colDefs;
