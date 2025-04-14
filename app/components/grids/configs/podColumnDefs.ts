import type {ColDef, ICellRendererParams} from 'ag-grid-community';
import type {BasicFocusableDialogRendererParams} from '~/components/workflowSections/shared/renderers/BasicFocusableDialogRenderer.vue';
import type {PodData} from '~~/types';

const colDefs: ColDef<PodData>[] = [
  {
    headerName: 'Type',
    headerClass: 'typeHeader',
    field: 'toxvalType',
  },
  {
    headerName: 'Value',
    headerClass: 'valueHeader',
    field: 'toxvalNumeric',
    filter: 'agSetColumnFilter',
    checkboxSelection: true,
    cellRenderer: (params: ICellRendererParams<PodData>) => {
      if (!params.node.group) {
        const val = params.value as PodData['toxvalNumeric'] | null;
        return roundedValueFormatter(val);
      }
      return '';
    },
    comparator: gridUtil.comparators.numericalComparator,
    minWidth: 150,
    maxWidth: 150,
  },
  {
    headerName: 'Units',
    headerClass: 'unitsHeader',
    field: 'toxvalUnits',
    filter: 'agSetColumnFilter',
    cellStyle: {
      lineHeight: '25px',
    },
    minWidth: 150,
    maxWidth: 150,
  },
  {
    headerName: 'Exposure Route',
    headerClass: 'exposureRouteHeader',
    field: 'exposureRoute',
    tooltipField: 'exposureRoute',
    filter: 'agSetColumnFilter',
    cellStyle: {
      lineHeight: '25px',
    },
    maxWidth: 400,
  },
  {
    headerName: 'Species',
    headerClass: 'speciesHeader',
    field: 'speciesCommon',
    hide: false,
  },
  {
    headerName: 'Effect',
    headerClass: 'criticalEffectHeader',
    field: 'effect',
    tooltipField: 'effect',
    filter: 'agSetColumnFilter',
    cellStyle: {
      lineHeight: '25px',
    },
    maxWidth: 575,
  },
  {
    headerName: 'Study Type',
    headerClass: 'studyTypeHeader',
    field: 'studyType',
  },
  {
    headerName: 'Source',
    headerClass: 'sourceHeaderClass',
    field: 'superSource',
    filter: 'agSetColumnFilter',
    cellRenderer: 'BasicFocusableDialogRenderer',
    cellRendererParams: (params: ICellRendererParams<PodData>): BasicFocusableDialogRendererParams => {
      const returnObj = {
        text: '',
        tooltip: '',
        id: '',
      };
      if (params.node.group) {
        return returnObj;
      }
      const description = params.data?.superSourceDescription;

      if (!description) {
        return returnObj;
      }
      return {
        tooltip: description,
        text: params.value,
        id: params.node.rowIndex?.toString() || '',
        dottedUnderline: true,
      };
    },
    minWidth: 175,
  },
];

export default colDefs;
