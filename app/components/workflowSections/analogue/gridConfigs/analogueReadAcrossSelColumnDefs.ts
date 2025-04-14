import type {ColDef, ICellRendererParams} from 'ag-grid-community';
import type {ReadAcross} from '~/api/Analogue/types';

const colDefs: ColDef<ReadAcross>[] = [
  {
    headerName: 'Chemical Name',
    field: 'preferredName',
    tooltipField: 'preferredName',
    filter: 'agSetColumnFilter',
    sortable: true,
    comparator: gridUtil.comparators.baseComparator,
    minWidth: 400,
    cellRenderer: (params: ICellRendererParams<ReadAcross>) => gridUtil.renderers
      .basicLinkRenderer({
        link: `${ccdDashboardUrl()}chemical/details/${params.data?.dtxsid}`,
        displayText: params.value || '',
        isExternalLink: true,
        shouldShowLink: !!(params.data?.dtxsid && params.value),
      }),
    cellStyle: params => (params.data?.isTarget ?
      {'background-color': '#ffcc80'} :
      null),
  },
  {
    headerName: 'Structure',
    colId: 'imagePopupCol',
    cellRenderer: 'ChemicalImagePopover',
    cellRendererParams: (params: ICellRendererParams<ReadAcross>) => ({
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
    minWidth: 150,
    cellStyle: params => gridUtil.cellStyles.targetCellStyle(params),
  },
  {
    headerName: 'DTXSID',
    field: 'dtxsid',
    tooltipField: 'dtxsid',
    sortable: true,
    comparator: gridUtil.comparators.baseComparator,
    cellStyle: params => gridUtil.cellStyles.targetCellStyle(params),
    hide: true,
    minWidth: 200,
  },
  {
    headerName: 'Similarity',
    headerTooltip: 'Tanimoto Chemical Similarity Factor',
    colId: 'similarity',
    cellRenderer: (params: ICellRendererParams<ReadAcross>) => {
      const currentAnalogue = useAnalogueStore().analogueChemicalsStepInfo;
      const stepIdx = useAnalogueStore().analogueToUpdateIdx;

      const selectedStepInfo = currentAnalogue[stepIdx];

      if (selectedStepInfo && params.data?.dtxsid) {
        const selectedChemicalSimilarity = selectedStepInfo.selectedAnalogues
          .find(({dtxsid}) => dtxsid === params.data?.dtxsid)?.similarity;
        if (!selectedChemicalSimilarity) { return 1; }
        return Math.round((selectedChemicalSimilarity + Number.EPSILON) * 100) / 100 || 1;
      }
      return 1;
    },
    minWidth: 155,
    cellStyle: params => gridUtil.cellStyles.targetCellStyle(params),
  },
  {
    headerName: 'Log Kow',
    headerTooltip: 'LogKow: Octanol-Water: A measure of the extent of chemical partitioning between water and octanol at equilibrium. The greater the Kow the more likely a chemical is to partition to octanol than to remain in water. Octanol is used as a surrogate for lipids (fat), and Kow can be used to predict bioconcentration of chemical(s) in organisms via exposure to water.',
    field: 'phychemLogkow',
    filter: 'agSetColumnFilter',
    cellRenderer: (params: ICellRendererParams<ReadAcross>) => roundedValueFormatter(params.data?.phychemLogkow || null),
    sortable: true,
    comparator: gridUtil.comparators.baseComparator,
    minWidth: 100,
    cellStyle: params => gridUtil.cellStyles.targetCellStyle(params),
  },
  {
    headerName: 'Water Solubility',
    headerTooltip: 'Water Solubility: An upper limit on a chemical\'s dissolved concentration in water at a specified temperature. Aqueous concentrations in excess of solubility may indicate sorption onto sediments, the presence of solubilizing chemicals such as solvents, or the presence of a nonaqueous phase liquid.',
    field: 'phychemWaterSolubility',
    filter: 'agSetColumnFilter',
    cellRenderer: (params: ICellRendererParams<ReadAcross>) => roundedValueFormatter(params.data?.phychemWaterSolubility ||
      null),
    sortable: true,
    comparator: gridUtil.comparators.baseComparator,
    minWidth: 160,
    cellStyle: params => gridUtil.cellStyles.targetCellStyle(params),
  },
  {
    headerName: 'Log Koa',
    headerTooltip: 'LogKoa: Octanol-Air: A measure of the extent of chemical partitioning between air and octanol at equilibrium. The greater the Koa the more likely a chemical is to partition to octanol than to remain in air. Octanol is used as a surrogate for lipids (fat), and Koa can be used to predict bioconcentration of chemical(s) in organisms via exposure to air.',
    field: 'phychemLogkoa',
    filter: 'agSetColumnFilter',
    cellRenderer: (params: ICellRendererParams<ReadAcross>) => roundedValueFormatter(params.data?.phychemLogkoa ||
      null),
    sortable: true,
    comparator: gridUtil.comparators.baseComparator,
    minWidth: 100,
    cellStyle: params => gridUtil.cellStyles.targetCellStyle(params),
  },
  {
    headerName: 'Vapor Pressure',
    headerTooltip: 'Vapor Pressure: The pressure exerted by a chemical vapor in equilibrium with its solid or liquid form at any given temperature. It is used to calculate the rate of volatilization of a pure substance from a surface or in estimating a Henry\'s Law constant for chemicals with low water solubility. The higher the vapor pressure, the more likely a chemical is to exist in a gaseous state.',
    field: 'phychemVp',
    filter: 'agSetColumnFilter',
    cellRenderer: (params: ICellRendererParams<ReadAcross>) => roundedValueFormatter(params.data?.phychemVp ||
      null),
    sortable: true,
    comparator: gridUtil.comparators.baseComparator,
    minWidth: 150,
    cellStyle: params => gridUtil.cellStyles.targetCellStyle(params),
  },
  {
    headerName: 'ADME Vol of Distribution',
    headerTooltip: 'ADME Volume of Distribution',
    field: 'admeVolOfDist',
    filter: 'agSetColumnFilter',
    cellRenderer: (params: ICellRendererParams<ReadAcross>) => roundedValueFormatter(params.data?.admeVolOfDist ||
      null),
    sortable: true,
    comparator: gridUtil.comparators.baseComparator,
    minWidth: 190,
    cellStyle: params => gridUtil.cellStyles.targetCellStyle(params),
  },
  {
    headerName: 'ADME PK Half-life',
    headerTooltip: 'ADME PK Half-life',
    field: 'admePkHalflife',
    cellRenderer: (params: ICellRendererParams<ReadAcross>) => roundedValueFormatter(params.data?.admePkHalflife ||
      null),
    filter: 'agSetColumnFilter',
    sortable: true,
    comparator: gridUtil.comparators.baseComparator,
    minWidth: 170,
    cellStyle: params => gridUtil.cellStyles.targetCellStyle(params),
  },
  {
    headerName: 'ADME HSSPC',
    headerTooltip: 'Human Steady-State Plasma Concentration (HSSPC)',
    field: 'admeHsspc',
    filter: 'agSetColumnFilter',
    cellRenderer: (params: ICellRendererParams<ReadAcross>) => roundedValueFormatter(params.data?.admeHsspc ||
      null),
    sortable: true,
    comparator: gridUtil.comparators.baseComparator,
    minWidth: 140,
    cellStyle: params => gridUtil.cellStyles.targetCellStyle(params),
  },
  {
    headerName: 'ADME FUHP',
    field: 'admeFuhp',
    filter: 'agSetColumnFilter',
    headerTooltip: 'Fraction Unbound in Human Plasma (FUHP)',
    cellRenderer: (params: ICellRendererParams<ReadAcross>) => roundedValueFormatter(Number
      .parseFloat(params.data?.admeFuhp || '') || null),
    sortable: true,
    comparator: gridUtil.comparators.baseComparator,
    minWidth: 125,
    cellStyle: params => gridUtil.cellStyles.targetCellStyle(params),
  },
  {
    headerName: 'ADME Invitro HC',
    field: 'admeInvitroHc',
    filter: 'agSetColumnFilter',
    headerTooltip: 'Intrinsic Hepatic Clearance (HC)',
    cellRenderer: (params: ICellRendererParams<ReadAcross>) => roundedValueFormatter(params.data?.admeInvitroHc ||
      null),
    cellRendererParams: {value: 'admeInvitroHc'},
    sortable: true,
    comparator: gridUtil.comparators.baseComparator,
    minWidth: 165,
    cellStyle: params => gridUtil.cellStyles.targetCellStyle(params),
  },
  {
    headerName: 'Surrogate DRSVs',
    headerTooltip: 'Select Surrogate DRSVs',
    colId: 'pod',
    cellRenderer: 'AnalogueReadAcrossPodSelection',
    cellRendererParams: () => {
      return {
        currentStepDetails: () => useAnalogueStore().analogueChemicalsStepInfo[useAnalogueStore().analogueToUpdateIdx],
        currentAnalogueSelectedChemical: () => useAnalogueStore().currentAnalogueSelectedChemical,
        updateSelections: (stepInfo: UpdateStepInfoParams) => useAnalogueStore().updateAnalogueChemicalsStepInfo(stepInfo),
      };
    },
    minWidth: 125,
    cellStyle: params => gridUtil.cellStyles.targetCellStyle(params),
  },
  {
    headerName: 'Justification',
    headerTooltip: 'Add a Surrogate Justification',
    minWidth: 190,
    cellRenderer: 'AnalogueJustificationRenderer',
    cellRendererParams: (params: ICellRendererParams<ReadAcross>) => {
      const currentAnalogueIdx = () => useAnalogueStore().analogueToUpdateIdx;
      const currentStepInfo = () => useAnalogueStore().analogueChemicalsStepInfo[currentAnalogueIdx()];
      const hasDataSelected = () => !!currentStepInfo()?.selectedPODS
        .some(({dtxsid}) => dtxsid === params.data?.dtxsid);
      return {
        hasDataSelected,
        currentStepInfo,
        updateSelections: (stepInfo: UpdateStepInfoParams) => useAnalogueStore().updateAnalogueChemicalsStepInfo(stepInfo),
        hasJustification: () => hasDataSelected() &&
          useAnalogueStore().analogueChemicalsStepInfo[currentAnalogueIdx()]?.PODJustifications?.length,

      };
    },
    cellStyle: params => gridUtil.cellStyles.targetCellStyle(params),
  },
];

export default colDefs;
