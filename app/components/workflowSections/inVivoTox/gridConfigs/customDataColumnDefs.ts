import type {ColDef, ICellRendererParams} from 'ag-grid-community';
import type {PodData} from '~~/types';

const colDefs: ColDef<PodData>[] = [
  {
    headerName: 'Action',
    cellRenderer: 'DeleteUserValueRenderer',
  },
  {
    headerName: 'Super Category',
    headerClass: 'sourceHeaderClass',
    field: 'superCategory',
  },
  {
    headerName: 'Study Type',
    headerClass: 'studyTypeHeader',
    field: 'studyType',
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: 'Study Duration',
    headerClass: 'studyDurationHeader',
    field: 'studyDuration',
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: 'Study Duration Units',
    headerClass: 'studyDurationUnitsHeader',
    field: 'studyDurationUnits',
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: 'Species',
    headerClass: 'speciesHeader',
    field: 'speciesCommon',
  },
  {
    headerName: 'Type',
    headerClass: 'typeHeader',
    field: 'toxvalType',
    minWidth: 100,
  },
  {
    headerName: 'Value',
    headerClass: 'valueHeader',
    field: 'toxvalNumeric',
    tooltipField: 'toxvalNumeric',
    cellRenderer: (params: ICellRendererParams<PodData>) => {
      if (params.node.group) {
        return '';
      }
      const description = params.column?.getColId();
      const val = params.node.data?.[description as keyof PodData];
      if (!val) {
        return '-';
      }
      const text = roundedValueFormatter(typeof val === 'string' ? parseFloat(val) : val).toString();
      return text;
    },
    cellRendererParams: {value: 'toxvalNumeric'},
    comparator: gridUtil.comparators.numericalComparator,
  },
  {
    headerName: 'Units',
    headerClass: 'unitsHeader',
    field: 'toxvalUnits',
    minWidth: 100,
  },
  {
    headerName: 'Exposure Route',
    headerClass: 'exposureRouteHeader',
    field: 'exposureRoute',
    minWidth: 250,
  },
  {
    headerName: 'Exposure Method',
    headerClass: 'exposureMethodHeader',
    field: 'exposureMethod',
    minWidth: 250,
  },
  {
    headerName: 'Effect',
    headerClass: 'criticalEffectHeader',
    field: 'effect',
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: 'Source',
    headerClass: 'sourceHeaderClass',
    field: 'superSource',
  },
];

export default colDefs;
