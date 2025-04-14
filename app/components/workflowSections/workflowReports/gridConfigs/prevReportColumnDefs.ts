import type {ColDef, ICellRendererParams} from 'ag-grid-community';
import type {PreviousReport} from '~/api/Report/types';

const colDefs: ColDef<PreviousReport>[] = [
  {
    headerName: 'Report Name',
    field: 'reportDesc',
    tooltipField: 'reportDesc',
    filter: 'agTextColumnFilter',
    flex: 1,
    minWidth: 350,
    sortable: true,
    cellStyle: {
      lineHeight: '55px',
    },
  },
  {
    headerName: 'Report Type',
    field: 'reportType',
    filter: 'agTextColumnFilter',
    sortable: true,
    minWidth: 250,
    maxWidth: 250,
    cellStyle: {
      lineHeight: '55px',
    },

  },
  {
    headerName: 'Download',
    field: 'clowderId',
    sortable: false,
    minWidth: 300,
    maxWidth: 300,
    cellRenderer: (params: ICellRendererParams<PreviousReport>) => gridUtil.renderers
      .basicLinkRenderer({
        link: `https://clowder.edap-cluster.com/api/files/${params.value}/blob?key=20475380-fbd7-476c-8d78-0c261c250c98`,
        displayText: params.value ? 'Download Report' : '',
        shouldShowLink: true,
        isExternalLink: false,
      }),
    cellStyle: {
      lineHeight: '55px',
    },

  },
  {
    headerName: 'Created',
    field: 'createdAt',
    sortable: true,
    minWidth: 300,
    cellRenderer: (params: ICellRendererParams<PreviousReport>) => formatDate(params.value),
    cellStyle: {
      lineHeight: '55px',
    },

  },
  {
    headerName: 'Report ID',
    field: 'reportId',
    hide: true,
    cellStyle: {
      lineHeight: '55px',
    },
  },
];

export default colDefs;
