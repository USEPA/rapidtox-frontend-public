import type {ColDef} from 'ag-grid-community';
import type {PhyschemExperimental} from '~/api/Physchem/types';

const colDefs: ColDef<PhyschemExperimental>[] = [
  {
    headerName: 'Source',
    headerClass: 'sourceHeader',
    field: 'source',
    tooltipField: 'source',
    filter: 'agSetColumnFilter',
    sortable: true,
    wrapText: true,
    autoHeight: true,
    flex: 1,
    maxWidth: 200,
    minWidth: 800,
  },
  {
    headerName: 'Result',
    headerClass: 'resultHeader',
    field: 'result',
    tooltipField: 'result',
    filter: 'agSetColumnFilter',
    cellRenderer: 'PhyschemValueRenderer',
    cellRendererParams: {value: 'result'},
    sortable: true,
    wrapText: true,
    autoHeight: true,
    flex: 1,
    maxWidth: 200,
    minWidth: 200,
  },
  {
    headerName: 'Experimental Details',
    headerClass: 'experimentalDetailsHeader',
    field: 'experimentalDetails',
    tooltipField: 'experimentalDetails',
    filter: 'agSetColumnFilter',
    wrapText: true,
    autoHeight: true,
    flex: 1,
    minWidth: 800,
    maxWidth: 1400,
  },
];

export default colDefs;
