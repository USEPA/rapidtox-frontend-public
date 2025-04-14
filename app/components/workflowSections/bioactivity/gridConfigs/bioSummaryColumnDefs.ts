import type {ColDef, ICellRendererParams} from 'ag-grid-community';
import type {BioactivityBaseRes} from '~/api/Bioactivity/types';

const colDefs: ColDef<BioactivityBaseRes>[] = [
  {
    headerName: 'Chemical Name',
    field: 'chemicalName',
    cellRenderer: 'ChemicalNameRenderer',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    minWidth: 300,
  },
  {
    headerName: 'DTXSID',
    field: 'dtxsid',
    tooltipValueGetter: () => 'Click here to view CCD\'s Bioactivity - TOXCAST Summary page for this chemical.',
    cellRenderer: (params: ICellRendererParams<SelectedChemical>) => gridUtil.renderers
      .basicLinkRenderer({
        link: `${ccdDashboardUrl()}chemical/invitrodb/${params.data?.dtxsid}`,
        displayText: params.value || '',
        isExternalLink: true,
        shouldShowLink: !!params.value,
      }),
    minWidth: 230,

  },
  {
    headerName: 'Assays Screened',
    field: 'totalAssaysScreened',
    filter: 'agSetColumnFilter',
    minWidth: 250,
  },
  {
    headerName: 'Inactive Count',
    field: 'inactiveCount',
    headerTooltip: 'Of the bioactivity assays employed for this chemical, the value represents the number of assays in which there was no measurable activity compared to controls.',
    filter: 'agSetColumnFilter',
    minWidth: 230,
  },
  {
    headerName: 'Active Count',
    field: 'activeCount',
    headerTooltip: 'Of the bioactivity assays employed for this chemical, the value represents the number of assays in which there was measurable activity compared to controls.',
    filter: 'agSetColumnFilter',
    minWidth: 200,
  },

  {
    headerName: 'Active Percent',
    headerTooltip: 'Represents the percentage of assays screened in which the chemical was found to be active.',
    field: 'hitRate',
    filter: 'agSetColumnFilter',
    minWidth: 230,
    cellRenderer: (params: ICellRendererParams<BioactivityBaseRes>) => {
      const val = params.data?.hitRate;
      if (!val) {
        return '-';
      }
      const text = roundedValueFormatter(typeof val === 'string' ? parseFloat(val) : val).toString();
      return text;
    },
  },
  {
    headerName: 'In Vitro DRSV 5th Percentile',
    headerTooltip: 'When available, this value represents the 5th %ile on a distribution of concentrations at which a chemical was bioactive at half the maximal response (e.g., AC50) across assays.',
    headerComponentParams: {
      template: `<div class="ag-cell-label-container" role="presentation">
                  <span data-ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>
                  <span data-ref="eFilterButton" class="ag-header-icon ag-header-cell-filter-button"></span>
                  <div data-ref="eLabel" class="ag-header-cell-label" role="presentation">
                    <span data-ref="eSortOrder" class="ag-header-icon ag-sort-order"></span>
                    <span data-ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>
                    <span data-ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>
                    <span data-ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>
                    <span data-ref="" class="ag-header-cell-text" role="columnheader"><i>In Vitro</i> DRSV 5th %ile</span>
                    <span data-ref="eFilter" class="ag-header-icon ag-filter-icon"></span>
                  </div>
                </div>`,
    },
    tooltipComponent: 'CustomHeaderTooltipSubSupScript',
    field: 'aed50Pctile05',
    filter: 'agSetColumnFilter',
    minWidth: 350,
    cellRenderer: (params: ICellRendererParams<BioactivityBaseRes>) => {
      const val = params.data?.aed50Pctile05;
      if (!val) {
        return '-';
      }
      const text = roundedValueFormatter(typeof val === 'string' ? parseFloat(val) : val).toString();
      return text;
    },
  },
  {
    headerName: 'Plot',
    cellRenderer: 'SummaryPlotRenderer',
    suppressHeaderMenuButton: true,
    minWidth: 120,
  },
];

export default colDefs;
