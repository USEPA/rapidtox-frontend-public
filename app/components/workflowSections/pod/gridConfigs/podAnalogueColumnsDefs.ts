import type {ColDef, ICellRendererParams} from 'ag-grid-community';
import type {AnaloguePodDataSelection} from '~/stores/pod/types';

const colDefs: ColDef<AnaloguePodDataSelection>[] = [
  {
    headerName: 'Input',
    rowGroup: true,
    hide: true,
    field: 'preferredName',
  },
  {
    headerName: 'Chart',
    headerClass: 'plotHeader',
    cellRenderer: 'ChartRenderer',
    cellRendererParams: {
      section: 'analogue',
      hazardDataSelected: () => useHazardStore().hazardDataSelected,
      hazardChartData: () => useHazardStore().hazardChartData,
      physchemDataSelected: () => usePhyschemStore().physchemDataSelected,
      analogueStepsData: () => useAnalogueStore().analogueChemicalsStepInfo,
    },
    suppressHeaderMenuButton: true,
    minWidth: 130,
    maxWidth: 130,
  },
  {
    checkboxSelection: rowNode => !rowNode.node.group && !!rowNode.node,
    minWidth: 50,
    maxWidth: 50,
    suppressHeaderMenuButton: true,
    cellStyle: {
      lineHeight: '35px',
    },
  },
  {
    headerName: 'Analogue',
    headerClass: 'nameHeader',
    field: 'readAcrossPrefName',
    tooltipField: 'readAcrossPrefName',
    filter: 'agSetColumnFilter',
    minWidth: 350,
  },
  {
    headerName: 'Type',
    headerClass: 'typeHeader',
    field: 'readAcrossType',
    filter: 'agSetColumnFilter',
    minWidth: 175,
  },
  {
    headerName: 'Value',
    headerClass: 'valueHeader',
    field: 'readAcrossValue',
    filter: 'agSetColumnFilter',
    cellRenderer: (params: ICellRendererParams<AnaloguePodDataSelection>) => {
      if (!params.node.group) {
        return roundedValueFormatter(params.value);
      }
      return '';
    },
    comparator: gridUtil.comparators.numericalComparator,
    minWidth: 150,
  },
  {
    headerName: 'Units',
    headerClass: 'unitsHeader',
    field: 'toxvalUnits',
    filter: 'agSetColumnFilter',
    minWidth: 135,
  },
  {
    headerName: 'Effect',
    headerClass: 'criticalEffectHeader',
    field: 'readAcrossCE',
    tooltipField: 'readAcrossCE',
    filter: 'agSetColumnFilter',
    cellStyle: {
      lineHeight: '35px',
    },
    minWidth: 250,
  },
  {
    headerName: 'Source',
    headerClass: 'sourceHeaderClass',
    field: 'readAcrossSource',
    tooltipField: 'readAcrossSource',
    filter: 'agSetColumnFilter',
    minWidth: 275,
  },
];

export default colDefs;
