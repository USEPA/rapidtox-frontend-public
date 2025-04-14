import type {
  ColDef, ICellRendererParams,
} from 'ag-grid-community';
import type {HHRAnalogue} from '~/api/Analogue/types';

const colDefs: ColDef<HHRAnalogue>[] = [
  {
    headerName: 'Chemical Name',
    headerClass: 'chemicalHeaderClass',
    field: 'preferredName',
    tooltipField: 'preferredName',
    filter: 'agSetColumnFilter',
    sortable: true,
    comparator: gridUtil.comparators.baseComparator<HHRAnalogue>,
    minWidth: 400,
    headerCheckboxSelection: true,
    checkboxSelection: true,
    cellStyle: params => (params.data?.isTarget ?
      {backgroundColor: '#ffcc80'} :
      null),
  },
  {
    headerName: 'Structure',
    colId: 'imagePopupCol',
    cellRenderer: 'ChemicalImagePopover',
    cellRendererParams: (params: ICellRendererParams<HHRAnalogue>) => ({
      imgHeight: '55',
      imgWidth: '55',
      centerImg: true,
      hasStructureImage: true,
      data: {
        ...params.data,
        hasStructureImage: true,
      },
    }),
    suppressHeaderMenuButton: true,
    minWidth: 160,
    maxWidth: 160,
    cellStyle: params => gridUtil.cellStyles.targetCellStyle(params),
  },
  {
    headerName: 'DTXSID',
    headerClass: 'dtxsidHeaderClass',
    field: 'dtxsid',
    sortable: true,
    comparator: gridUtil.comparators.baseComparator,
    cellRenderer: (params: ICellRendererParams<HHRAnalogue>) => gridUtil.renderers
      .basicLinkRenderer({
        link: `${ccdDashboardUrl()}chemical/details/${params.data?.dtxsid}`,
        displayText: params.value || '',
        isExternalLink: true,
        shouldShowLink: !!(params.data?.dtxsid && params.value),
      }),
    cellStyle: params => gridUtil.cellStyles.targetCellStyle(params),
    minWidth: 200,
  },
  {
    headerName: 'CASRN',
    headerClass: 'casrnHeaderClass',
    field: 'casrn',
    sortable: true,
    comparator: gridUtil.comparators.baseComparator,
    cellStyle: params => gridUtil.cellStyles.targetCellStyle(params),
    minWidth: 150,
    maxWidth: 150,
  },
  {
    headerName: 'Similarity',
    headerClass: 'similarityHeaderClass',
    field: 'similarity',
    filter: 'agSetColumnFilter',
    sortable: true,
    minWidth: 175,
    maxWidth: 175,
    cellStyle: params => gridUtil.cellStyles.targetCellStyle(params),
    cellRenderer(params: ICellRendererParams<HHRAnalogue>) {
      return `<div>${Math.round((params.value + Number.EPSILON) * 100) / 100}</div>`;
    },
  },
  {
    headerName: 'IRIS',
    headerTooltip: 'Integrated Risk Information System',
    colId: 'iris',
    cellRenderer: 'AnalogueSelCheckRenderer',
    cellRendererParams: {section: 'iris'},
    suppressHeaderMenuButton: true,
    minWidth: 125,
    maxWidth: 125,
    cellStyle: params => gridUtil.cellStyles.targetCellStyle(params),
  },
  {
    headerName: 'PPRTV',
    headerTooltip: 'Provisional Peer Reviewed Toxicity Value',
    colId: 'pprtv',
    cellRenderer: 'AnalogueSelCheckRenderer',
    cellRendererParams: {section: 'pprtv'},
    suppressHeaderMenuButton: true,
    minWidth: 150,
    maxWidth: 150,
    cellStyle: params => gridUtil.cellStyles.targetCellStyle(params),
  },
  {
    headerName: 'ATSDR',
    headerTooltip: 'Agency for Toxic Substances and Disease Registry',
    colId: 'atsdr',
    cellRenderer: 'AnalogueSelCheckRenderer',
    cellRendererParams: {section: 'atsdr'},
    suppressHeaderMenuButton: true,
    minWidth: 150,
    maxWidth: 150,
    cellStyle: params => gridUtil.cellStyles.targetCellStyle(params),
  },
  {
    headerName: 'Other',
    colId: 'other',
    cellRenderer: 'AnalogueSelCheckRenderer',
    cellRendererParams: {section: 'other'},
    suppressHeaderMenuButton: true,
    minWidth: 150,
    cellStyle: params => gridUtil.cellStyles.targetCellStyle(params),
  },
];

export default colDefs;
