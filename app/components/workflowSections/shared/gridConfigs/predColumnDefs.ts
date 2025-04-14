import type {ColDef} from 'ag-grid-community';
import type {PhyschemPredicted} from '~/api/Physchem/types';

const colDefs: ColDef<PhyschemPredicted>[] = [
  {
    headerName: 'Source',
    headerClass: 'sourceHeader',
    field: 'source',
    cellRenderer: 'PhyschemSourceDisplay',
    cellRendererParams: {modelDesc: 'modelDesc'},
    filter: 'agSetColumnFilter',
    sortable: true,
    flex: 1,
    maxWidth: 500,
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
    flex: 1,
    minWidth: 100,
  },
];

export default colDefs;
