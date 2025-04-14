import type {ColDef, ICellRendererParams} from 'ag-grid-community';
import {allowedUnits} from '../helpers/convertDoseHelpers';
import type {Dtxsid, PodData} from '~~/types';
import {useHazardStore} from '#imports';

const colDefs: ColDef<PodData>[] = [
  {
    headerName: 'Preferred Name',
    headerCheckboxSelection: true,
    rowGroup: true,
    hide: true,
    field: 'preferredName',
    filter: false,
    cellRenderer: 'ChemicalNameRenderer',
    tooltipField: 'preferredName',
    minWidth: 350,
  },
  {
    headerName: 'Chart',
    filter: false,
    cellRendererParams: {
      getDataSelected: () => useHazardStore().hazardDataSelected,
      getChartData: () => useHazardStore().hazardChartData,
      hazardApiResponse: () => useHazardStore().hazardApiResponse,
      exposureData: () => useHazardStore().chartExposure,
      updateExposureData: (exposure: {
        dtxsid: Dtxsid;
        type: string;
        value: string | number;
      }) => useHazardStore().$patch((state) => {
        const exposureIdxToUpdate = useHazardStore().chartExposure?.findIndex(({dtxsid}) => dtxsid === exposure.dtxsid);
        if (exposureIdxToUpdate >= 0) {
          state.chartExposure[exposureIdxToUpdate] = exposure;
        } else {
          state.chartExposure.push(exposure);
        }
      }),
    },
    cellRenderer: 'ChemDataPlotRenderer',
    minWidth: 215,
  },
  {
    headerName: 'Custom Data',
    filter: false,
    cellRendererSelector: (params) => {
      const showConvertDoseCalc = params.node.level === 2 &&
        params?.data?.toxvalUnits &&
        allowedUnits.includes(params.data.toxvalUnits) &&
        params.data.exposureRoute.toLowerCase() === 'inhalation' &&
        ALLOWED_SUPER_HAZARD_CONVERSIONS
          .map(hazard => hazard.toLowerCase())
          .includes(params.data.superCategory.toLowerCase());

      const showRemoveConvertedRow = params.node.level === 2 &&
        params.data?.superCategory?.toLowerCase()?.startsWith('converted');

      if (showConvertDoseCalc) {
        return {
          component: 'ConvertDoseRenderer',
        };
      }

      if (showRemoveConvertedRow) {
        return {
          component: 'RemoveConvertedDoseRenderer',
        };
      }

      return {
        component: 'CustomDataRenderer',
        params: {
          getChartData: () => useHazardStore().hazardChartData,
        },
      };
    },
    minWidth: 250,
  },
  {
    headerName: 'Datasets',
    field: 'superCategory',
    filter: false,
    rowGroup: true,
    sort: 'asc',
    comparator: gridUtil.comparators.superCategoryComparator,
    hide: true,
  },
  {
    filter: false,
    checkboxSelection: rowNode => !(rowNode.node.group) && !!rowNode.node,
    minWidth: 50,
    maxWidth: 50,
    suppressHeaderMenuButton: true,
    cellStyle: {
      lineHeight: '35px',
    },
  },
  {
    headerName: 'Study Type',
    headerClass: 'studyTypeHeader',
    field: 'studyType',
    filter: 'agTextColumnFilter',
    cellStyle: {
      lineHeight: '35px',
    },
    minWidth: 200,
  },
  {
    headerName: 'Study Duration',
    headerClass: 'studyDurationHeader',
    field: 'studyDuration',
    filter: 'agNumberColumnFilter',
    cellStyle: {
      lineHeight: '35px',
    },
    cellRenderer: (params: ICellRendererParams<PodData>) => {
      // Only return value for child nodes.
      if (params.node.level !== 2) {
        return '';
      }

      return params.value || '-';
    },
    minWidth: 200,
  },
  {
    headerName: 'Study Duration Units',
    headerClass: 'studyDurationUnitsHeader',
    field: 'studyDurationUnits',
    filter: 'agTextColumnFilter',
    cellStyle: {
      lineHeight: '35px',
    },
    minWidth: 200,
  },
  {
    headerName: 'Species',
    headerClass: 'speciesHeader',
    field: 'speciesCommon',
    filter: 'agTextColumnFilter',
    cellStyle: {
      lineHeight: '35px',
    },
    minWidth: 175,
  },
  {
    headerName: 'Type',
    headerClass: 'typeHeader',
    field: 'toxvalType',
    filter: 'agTextColumnFilter',
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
        dottedUnderline: true,
      };
    },
    minWidth: 200,
  },
  {
    headerName: 'Subtype',
    headerClass: 'subtypeHeader',
    field: 'toxvalSubtype',
    filter: 'agTextColumnFilter',
    minWidth: 200,
  },
  {
    headerName: 'Value',
    headerClass: 'valueHeader',
    field: 'toxvalNumeric',
    filter: 'agNumberColumnFilter',
    sort: 'asc',
    comparator: gridUtil.comparators.realNumericalComparator,
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
    minWidth: 175,
  },
  {
    headerName: 'Units',
    headerClass: 'unitsHeader',
    field: 'toxvalUnits',
    filter: 'agTextColumnFilter',
    cellStyle: {
      lineHeight: '35px',
    },
    minWidth: 175,
  },
  {
    headerName: 'Exposure Route',
    headerClass: 'exposureRouteHeader',
    field: 'exposureRoute',
    filter: 'agTextColumnFilter',
    cellStyle: {
      lineHeight: '35px',
    },
    minWidth: 235,
  },
  {
    headerName: 'Exposure Method',
    headerClass: 'exposureMethodHeader',
    field: 'exposureMethod',
    filter: 'agTextColumnFilter',
    cellStyle: {
      lineHeight: '35px',
    },
    minWidth: 235,
  },
  {
    headerName: 'Effect',
    headerClass: 'criticalEffectHeader',
    field: 'effect',
    filter: 'agTextColumnFilter',
    cellStyle: {
      lineHeight: '35px',
      display: 'block',
      alignContent: 'center',
    },
    minWidth: 275,
  },
  {
    headerName: 'Source',
    headerClass: 'sourceHeaderClass',
    field: 'superSource',
    filter: 'agTextColumnFilter',
    cellRenderer: (params: ICellRendererParams<PodData>) => gridUtil.renderers
      .basicLinkRenderer({
        link: params.data?.sourceUrl && params.data.sourceUrl !== '-' ? params.data.sourceUrl : '',
        displayText: params.value,
        shouldShowLink: true,
        isExternalLink: true,
      }),
    tooltipField: 'superSourceDescription',
    minWidth: 200,
  },
  {
    headerName: 'Source Document',
    headerClass: 'clowderIdClass',
    field: 'clowderId',
    filter: false,
    cellRenderer: (params: ICellRendererParams<PodData>) => gridUtil.renderers
      .basicLinkRenderer({
        link: params.data?.clowderId && params.data.clowderId !== '-' ? params.data.clowderId : '',
        displayText: params.value ? 'Clowder Document' : '',
        shouldShowLink: true,
        isExternalLink: true,
      }),
    headerTooltip: 'Click the link to navigate to the Clowder source document',
    tooltipValueGetter: () => { return ''; },
    minWidth: 250,
  },
];

export default colDefs;
