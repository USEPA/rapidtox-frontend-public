import type {ColDef, ICellRendererParams} from 'ag-grid-community';
import type {PodUncertaintyData} from '~/stores/pod/types';

const colDefs: ColDef<PodUncertaintyData>[] = [
  {
    headerName: 'Chemical (section)',
    rowGroup: true,
    hide: true,
    field: 'preferredName',
    cellRenderer: 'ChemicalNameRenderer',
  },

  {
    headerName: 'Section',
    rowGroup: true,
    hide: true,
    field: 'section',
  },
  {
    headerName: 'Duplicate/Remove',
    cellRenderer: 'UncertaintyDuplicateRemoveRowRenderer',
    cellRendererParams: {
      podDataSelected: () => usePodStore().podDataSelected,
      setPodDataSelected: (podData: PodDataTypes[]) => usePodStore().$patch((state) => { state.podDataSelected = podData; }),
    },
    filter: 'agSetColumnFilter',
    minWidth: 275,
  },
  {
    headerName: 'In Vivo Toxicity',
    field: 'hazardObj',
    minWidth: 240,
    tooltipValueGetter: () => null,
    cellRenderer: 'InVivoToxicityRenderer',
  },
  {
    headerName: 'DRSV Value',
    field: 'podValue',
    filter: 'agSetColumnFilter',
    minWidth: 170,
  },
  {
    headerName: 'Units',
    field: 'toxvalUnits',
    filter: 'agSetColumnFilter',
    minWidth: 190,
  },
  {
    headerName: 'Converted DRSVHED',
    headerComponentParams: {
      template: gridUtil.templates.subScriptTemplate({val: 'Converted DRSVHED', subLen: 3}),
    },
    filter: 'agSetColumnFilter',
    minWidth: 260,
    cellRenderer: (params: ICellRendererParams<PodUncertaintyData>) => (params?.data?.podhed ? `${decimalScientificNotation(params.data.podhed)} mg/kg/day` : ''),
  },
  {
    headerName: 'RFV Calculator',
    cellRenderer: 'RfvCalculatorRenderer',
    cellRendererParams: {
      updatePod: (updatedData: UpdatePodCalcParams) => usePodStore().updateSelectedPodCalc(updatedData),
    },
    minWidth: 225,
  },
  {
    headerName: 'RFV Type',
    filter: 'agSetColumnFilter',
    field: 'rfvLabel',
    cellRenderer: 'UncertaintyLabelSelectRenderer',
    cellRendererParams: {
      addRfVLabelOptions: (rfvLabel: {
        id: string; newTag: string;
      }) => usePodStore().addRfVLabelOptions(rfvLabel),
      podDataSelected: () => usePodStore().podDataSelected,
      updateRfvLabel: (rfvLabel: string, podIdx: number) => usePodStore().$patch((state) => {
        state.podDataSelected[podIdx]!.rfvLabel = rfvLabel;
      }),
    },
    cellClass: 'overflow-visible',
    minWidth: 380,
  },
  {
    headerName: 'Composite UF',
    field: 'compositeUf',
    filter: 'agSetColumnFilter',
    minWidth: 220,
  },
  {
    headerName: 'Interim Rapidtox RFV',
    field: 'interimRfV',
    filter: 'agSetColumnFilter',
    minWidth: 290,
    cellStyle: () => ({
      fontWeight: '900',
    }),
  },

];

export default colDefs;
