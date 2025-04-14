import type {ColDef, ICellRendererParams} from 'ag-grid-community';
import type {SelectedChemical} from '~/stores/chemicalSearch/types';
import type {Dtxsid, DtxsidMap} from '~~/types';

const colDefs: ColDef<SelectedChemical>[] = [
  {
    headerName: 'Chemical Name',
    headerClass: 'preferrredNameHeader',
    headerCheckboxSelection: true,
    checkboxSelection: true,
    field: 'preferredName',
    tooltipField: 'preferredName',
    filter: 'agSetColumnFilter',
    sortable: true,
    cellRenderer: 'ChemicalNameRenderer',
    comparator: gridUtil.comparators.baseComparator,
    minWidth: 400,
    cellStyle: () => ({
      lineHeight: '35px',
    }),
  },
  {
    headerName: 'CASRN',
    headerClass: 'casrnHeaderClass',
    field: 'casrn',
    tooltipField: 'casrn',
    filter: 'agSetColumnFilter',
    sortable: true,
    comparator: gridUtil.comparators.baseComparator,
    cellStyle: () => ({
      lineHeight: '35px',
    }),
    minWidth: 150,
  },
  {
    headerName: 'DTXSID',
    headerClass: 'dxtsidHeaderClass',
    field: 'dtxsid',
    tooltipField: 'dtxsid',
    filter: 'agSetColumnFilter',
    sortable: true,
    comparator: gridUtil.comparators.baseComparator,
    cellStyle: () => ({
      lineHeight: '35px',
    }),
    minWidth: 200,
    width: 200,
  },
  {
    headerName: 'Safety',
    cellRenderer: 'SelectionCheck',
    cellRendererParams: (params: ICellRendererParams<SelectedChemical>) => {
      return {
        section: 'Safety',
        hasData: () => false,
        containsData: () => {
          const chemical = useChemicalSearchStore().selectedChemicals.find(({dtxsid}) => dtxsid === params.data?.dtxsid);
          return !!chemical?.safetyLink;
        },
      };
    },
    minWidth: 180,
  },
  {
    headerName: 'In Vivo Toxicity',
    headerComponentParams: {
      template: gridUtil.templates.hazardHeaderTemplate(),
    },
    cellRenderer: 'SelectionCheck',
    cellRendererParams: (params: ICellRendererParams<SelectedChemical>) => {
      return {
        section: 'Hazard',
        hasData: () => !!useHazardStore().hazardToxChemsWithNoData.includes(params.data?.dtxsid as Dtxsid),
        containsData: () => params.data?.dtxsid &&
          (params.data?.dtxsid as Dtxsid) in useHazardStore().hazardDataSelected,
      };
    },
    minWidth: 235,
  },
  {
    headerName: 'Physchem',
    cellRenderer: 'SelectionCheck',
    cellRendererParams: (params: ICellRendererParams<SelectedChemical>) => {
      return {
        section: 'Physchem',
        hasData: () => !!usePhyschemStore().physchemChemsWithNoData.includes(params.data?.dtxsid as Dtxsid),
        containsData: () => params.data?.dtxsid &&
          (params.data?.dtxsid as Dtxsid) in usePhyschemStore().physchemDataSelected,
      };
    },
    minWidth: 180,
  },
  {
    headerName: 'Env. Fate',
    cellRenderer: 'SelectionCheck',
    cellRendererParams: (params: ICellRendererParams<SelectedChemical>) => {
      return {
        section: 'Env Fate',
        hasData: () => !!useEnvFateStore().envFateChemsWithNoData.includes(params.data?.dtxsid as Dtxsid),
        containsData: () => params.data?.dtxsid &&
          (params.data?.dtxsid as Dtxsid) in useEnvFateStore().envFateDataSelected,
      };
    },
    minWidth: 160,
  },
  {
    headerName: 'Analogue',
    cellRenderer: 'SelectionCheck',
    cellRendererParams: (params: ICellRendererParams<SelectedChemical>) => {
      return {
        section: 'Analogue',
        hasData: () => false,
        containsData: () => {
          const chemical = useAnalogueStore().analogueChemicalsStepInfo.find(({dtxsid}) => dtxsid === params.data?.dtxsid);
          return !!chemical?.selectedPODS.length;
        },
      };
    },
    minWidth: 175,
  },
  {
    headerName: 'Bioactivity',
    cellRenderer: 'SelectionCheck',

    cellRendererParams: (params: ICellRendererParams<SelectedChemical>) => {
      return {
        section: 'Bioactivity',
        hasData: () => {
          const dtxsid = params.data?.dtxsid;
          if (!dtxsid) { return false; }
          return !(useBioactivityStore().bioActivityChemsWithNoToxcast.includes(dtxsid) ||
            useBioactivityStore().bioActivityChemsWithNoBer.includes(dtxsid) ||
            useBioactivityStore().bioActivityChemsWithNoSummary.includes(dtxsid));
        },
        containsData: () => {
          const dtxsid = params.data?.dtxsid;
          if (!dtxsid) { return false; }
          const hasBerCalcDataSelections = useBioactivityStore().selectedBerCalcData
            .some(({dtxsid: berDtxsid}) => params.data?.dtxsid === berDtxsid);
          const hasToxSelections = params.data?.dtxsid && useBioactivityStore()
            .selectedToxcastChemicals && dtxsid in useBioactivityStore()
            .selectedToxcastChemicals;
          const hasSummarySelections = !!useBioactivityStore().selectedBioactivitySummaryChemicals?.includes(dtxsid);
          return (hasToxSelections || hasBerCalcDataSelections || hasSummarySelections);
        },
      };
    },
    minWidth: 180,
  },
  {
    headerName: 'DRSV',
    cellRenderer: 'SelectionCheck',
    cellRendererParams: (params: ICellRendererParams<SelectedChemical>) => {
      return {
        section: 'DRSV',
        hasData: () => false,
        containsData: () => usePodStore().podDataSelected.map(({dtxsid}) => dtxsid).includes(params.data?.dtxsid as Dtxsid),
      };
    },
    minWidth: 125,
  },
];

export default colDefs;
