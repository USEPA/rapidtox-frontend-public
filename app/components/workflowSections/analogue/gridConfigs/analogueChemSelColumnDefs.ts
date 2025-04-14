import type {ColDef, ICellRendererParams} from 'ag-grid-community';
import type {SelectedChemical} from '~/stores/chemicalSearch/types';

const colDefs: ColDef<SelectedChemical>[] = [
  {
    headerName: 'Selection',
    colId: 'analogueSelCol',
    cellRenderer: 'AnalogueSelectionRenderer',
    cellRendererParams: (params: ICellRendererParams<SelectedChemical>) => ({
      hasSelections: () => !!useAnalogueStore().analogueChemicalsStepInfo.find((analogue) => {
        if (params.data?.dtxsid) {
          return analogue.dtxsid === params.data.dtxsid;
        }
        return analogue.searchWord === params.data?.searchWord;
      })?.selectedPODS?.length,
      openAnalogue: (analogueData: AnalogueSelectedChemical) => useAnalogueStore().displayAnalogueModal(analogueData),
    }),
    suppressHeaderMenuButton: true,
    minWidth: 160,
    maxWidth: 160,
  },
  {
    headerName: 'Input',
    headerClass: 'inputHeader',
    field: 'searchWord',
    tooltipField: 'searchWord',
    filter: 'agSetColumnFilter',
    sortable: true,
    comparator: gridUtil.comparators.baseComparator<SelectedChemical>,
    minWidth: 400,
  },
  {
    headerName: 'Chemical Name',
    headerClass: 'preferrredNameHeader',
    field: 'preferredName',
    cellRenderer: 'ChemicalNameRenderer',
    tooltipValueGetter: () => null,
    filter: 'agSetColumnFilter',
    sortable: true,
    comparator: gridUtil.comparators.baseComparator<SelectedChemical>,
    minWidth: 350,
    maxWidth: 350,
    cellStyle: () => ({
      lineHeight: '35px',
    }),
  },
  {
    headerName: 'Structure',
    colId: 'imagePopupCol',
    cellRenderer: 'ChemicalImagePopover',
    cellRendererParams: {
      imgHeight: '55',
      imgWidth: '55',
      centerImg: true,
    },
    minWidth: 225,
    maxWidth: 225,
  },
  {
    headerName: 'CASRN',
    headerClass: 'casrnHeaderClass',
    field: 'casrn',
    filter: 'agSetColumnFilter',
    sortable: true,
    comparator: gridUtil.comparators.baseComparator<SelectedChemical>,
    cellStyle: () => ({
      lineHeight: '35px',
    }),
    minWidth: 200,
    maxWidth: 250,
  },
  {
    headerName: 'DTXSID',
    headerClass: 'dxtsidHeaderClass',
    field: 'dtxsid',
    filter: 'agSetColumnFilter',
    sortable: true,
    comparator: gridUtil.comparators.baseComparator<SelectedChemical>,
    cellRenderer: (params: ICellRendererParams<SelectedChemical>) => gridUtil.renderers
      .basicLinkRenderer({
        link: `${ccdDashboardUrl()}chemical/details/${params.value}`,
        displayText: params.value || '',
        isExternalLink: true,
        shouldShowLink: !!params.value,
      }),
    cellStyle: () => ({
      lineHeight: '35px',
    }),
    minWidth: 200,
  },
  {
    headerName: 'Found By',
    headerClass: 'foundByHeaderClass',
    field: 'searchGroup',
    filter: 'agSetColumnFilter',
    tooltipField: 'searchGroup',
    sortable: true,
    comparator: gridUtil.comparators.baseComparator<SelectedChemical>,
    cellStyle: () => ({
      lineHeight: '35px',
    }),
    hide: true,
    minWidth: 200,
  },
];

export default colDefs;
