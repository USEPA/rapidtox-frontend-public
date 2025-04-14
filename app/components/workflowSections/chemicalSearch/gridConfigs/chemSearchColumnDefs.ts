import type {ColDef, ICellRendererParams} from 'ag-grid-community';
import type {SelectedChemical} from '~/stores/chemicalSearch/types';

const colDefs: ColDef<SelectedChemical>[] = [
  {
    headerClass: 'selectedHeader',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    minWidth: 54,
    maxWidth: 54,
    cellStyle: (params) => {
      const isNotFound = params.data?.searchGroup === 'NOT FOUND';
      return {
        ...(isNotFound && {color: 'black'}),
        ...(isNotFound && {backgroundColor: '#e0e0e0'}),
        lineHeight: '35px',
      };
    },
  },
  {
    headerName: 'Input',
    headerClass: 'inputHeader',
    field: 'searchWord',
    tooltipField: 'searchWord',
    filter: 'agSetColumnFilter',
    sortable: true,
    comparator: gridUtil.comparators.baseComparator,
    minWidth: 225,
    cellStyle: params => (params.data?.searchGroup === 'NOT FOUND' ?
      {
        color: 'black', backgroundColor: '#e0e0e0', lineHeight: '35px',
      } :
      null),
  },
  {
    headerName: 'Preferred Name',
    headerClass: 'preferrredNameHeader',
    field: 'preferredName',
    tooltipField: 'preferredName',
    filter: 'agSetColumnFilter',
    sortable: true,
    comparator: gridUtil.comparators.baseComparator,
    minWidth: 400,
    maxWidth: 400,
    cellStyle: (params) => {
      const isNotFound = params.data?.searchGroup === 'NOT FOUND';
      return {
        ...(isNotFound && {color: 'black'}),
        ...(isNotFound && {backgroundColor: '#e0e0e0'}),
        lineHeight: '35px',
      };
    },
  },
  {
    headerName: 'Structure',
    colId: 'imagePopupCol',
    cellRenderer: 'ChemicalImagePopover',
    cellRendererParams: {hasStructureImage: 'hasStructureImage'},
    tooltipComponent: 'Tooltip',
    suppressHeaderMenuButton: true,
    minWidth: 160,
    maxWidth: 160,
    cellStyle: (params) => {
      const isNotFound = params.data?.searchGroup === 'NOT FOUND';
      return {
        ...(isNotFound && {'pointer-events': 'none'}),
        ...(isNotFound && {color: 'black'}),
        ...(isNotFound && {backgroundColor: '#e0e0e0'}),
        lineHeight: '35px',
      };
    },
  },
  {
    headerName: 'CASRN',
    headerClass: 'casrnHeaderClass',
    field: 'casrn',
    tooltipField: 'casrn',
    filter: 'agSetColumnFilter',
    sortable: true,
    comparator: gridUtil.comparators.baseComparator,
    cellStyle: (params) => {
      const isNotFound = params.data?.searchGroup === 'NOT FOUND';
      return {
        ...(isNotFound && {'pointer-events': 'none'}),
        ...(isNotFound && {color: 'black'}),
        ...(isNotFound && {backgroundColor: '#e0e0e0'}),
        lineHeight: '35px',
      };
    },
    minWidth: 180,
    maxWidth: 180,
  },
  {
    headerName: 'DTXSID',
    headerClass: 'dxtsidHeaderClass',
    field: 'dtxsid',
    tooltipField: 'dtxsid',
    filter: 'agSetColumnFilter',
    sortable: true,
    comparator: gridUtil.comparators.baseComparator,
    cellRenderer: (params: ICellRendererParams<SelectedChemical>) => gridUtil.renderers
      .basicLinkRenderer({
        link: `${ccdDashboardUrl()}chemical/details/${params.value}`,
        displayText: params.value || '',
        isExternalLink: true,
        shouldShowLink: !!params.value,
      }),
    cellStyle: (params) => {
      const isNotFound = params.data?.searchGroup === 'NOT FOUND';
      return {
        ...(isNotFound && {'pointer-events': 'none'}),
        ...(isNotFound && {color: 'black'}),
        ...(isNotFound && {backgroundColor: '#e0e0e0'}),
        lineHeight: '35px',
      };
    },
    minWidth: 200,
    maxWidth: 200,
  },
  {
    headerName: 'Found By',
    headerClass: 'foundByHeader',
    field: 'searchGroup',
    tooltipField: 'searchGroup',
    filter: 'agSetColumnFilter',
    sortable: true,
    comparator: gridUtil.comparators.baseComparator,
    minWidth: 175,
    cellStyle: (params) => {
      if (params.data?.searchGroup === 'NOT FOUND') {
        return {
          color: 'black', backgroundColor: '#e0e0e0', lineHeight: '35px',
        };
      }
      if (params.data?.searchGroup.includes('WARNING')) {
        return {
          color: '#9e0f05', lineHeight: '35px', backgroundColor: '',
        };
      }
      return null;
    },
  },
  {
    headerName: 'NIOSH',
    headerTooltip: 'The National Institute of Occupational Safety and Health (NIOSH) is part of the Centers for Disease Control and Prevention, in the Department of Health and Human Services. As part of their mission, NIOSH publishes a pocket guide to chemical hazards where summary level data (e.g., names/synonyms, physicochemical properties, health hazards, suggested personal protective equipment/measures) are provided. Accessing the link here takes you to the landing page of the specific chemical in the NIOSH pocket guide.',
    field: 'nioshLink',
    tooltipField: 'nioshLink',
    cellRenderer: 'LinkRenderer',
    suppressHeaderMenuButton: true,
    sortable: true,
    minWidth: 100,
    width: 100,
    cellStyle: (params) => {
      if (params.data?.searchGroup === 'NOT FOUND') {
        return {
          color: 'black', backgroundColor: '#e0e0e0', lineHeight: '35px',
        };
      }
      if (params.data?.searchGroup.includes('WARNING')) {
        return {
          color: '#9e0f05', lineHeight: '35px', backgroundColor: '',
        };
      }
      return null;
    },
  },
  {
    headerName: 'Safety',
    headerTooltip: 'The ’Safety’ data provided via this link have been sourced from PubChem and assembled into a database by U.S. EPA. The assembled data for a chemical are provided as a PDF generated via the link and are not integrated directly into this RapidTox session. The user should save and/or print separately the safety data file for chemical(s) as needed.',
    field: 'safetyLink',
    tooltipField: 'safetyLink',
    cellRenderer: 'LinkRenderer',
    suppressHeaderMenuButton: true,
    sortable: true,
    minWidth: 100,
    width: 100,
    cellStyle: (params) => {
      if (params.data?.searchGroup === 'NOT FOUND') {
        return {
          color: 'black', backgroundColor: '#e0e0e0', lineHeight: '35px',
        };
      }
      if (params.data?.searchGroup.includes('WARNING')) {
        return {
          color: '#9e0f05', lineHeight: '35px', backgroundColor: '',
        };
      }
      return null;
    },
  },
  {
    headerName: 'Odor Threshold',
    headerTooltip: 'The provided ’Odor Threshold’ data have been sourced from PubChem and assembled into a database by U.S. EPA. If data is available for a given chemical, the data is inserted into your report automatically.',
    colId: 'odorThreshold',
    cellRenderer: 'DataCheckMark',
    cellRendererParams:
    {
      type: 'odorThreshold',
      tooltipText: 'This chemical record contains Odor Threshold data which will be inserted into your report.',
    },
    suppressHeaderMenuButton: true,
    minWidth: 200,
    width: 200,
    cellStyle: (params) => {
      const isNotFound = params.data?.searchGroup === 'NOT FOUND';
      return {
        ...(isNotFound && {'pointer-events': 'none'}),
        ...(isNotFound && {color: 'black'}),
        ...(isNotFound && {backgroundColor: '#e0e0e0'}),
        lineHeight: '35px',
      };
    },
  },
  {
    headerName: 'Markush',
    colId: 'markush',
    cellRenderer: 'DataCheckMark',
    cellRendererParams: {
      type: 'isMarkush',
      tooltipText: 'The chemical searched is represented by a Markush structure, a genericized chemical representation where there may be variations in substituents or their position; as such, no specific chemical is default selected to perform a structural similarity search or read-across. In order to perform a similarity search or read-across, consider entering a more specific name, synonym, CASRN, or DTXSID in the chemical search on the previous page.',
    },
    suppressHeaderMenuButton: true,
    minWidth: 150,
    cellStyle: (params) => {
      const isNotFound = params.data?.searchGroup === 'NOT FOUND';
      return {
        ...(isNotFound && {'pointer-events': 'none'}),
        ...(isNotFound && {color: 'black'}),
        ...(isNotFound && {backgroundColor: '#e0e0e0'}),
        lineHeight: '35px',
      };
    },
  },
  {
    headerName: 'Assessment Values',
    colId: 'hasTox',
    cellRenderer: 'DataCheckMark',
    cellRendererParams: {
      type: 'hasTox',
      tooltipText: 'This chemical record contains toxicity data.',
    },
    suppressHeaderMenuButton: true,
    minWidth: 245,
    width: 245,
    cellStyle: (params) => {
      const isNotFound = params.data?.searchGroup === 'NOT FOUND';
      return {
        ...(isNotFound && {'pointer-events': 'none'}),
        ...(isNotFound && {color: 'black'}),
        ...(isNotFound && {backgroundColor: '#e0e0e0'}),
        lineHeight: '35px',
      };
    },
  },
];

export default colDefs;
