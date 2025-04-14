import type {ColDef, ICellRendererParams} from 'ag-grid-community';
import type {BioactivityToxcastRes} from '~/api/Bioactivity/types';

const colDefs: ColDef<BioactivityToxcastRes>[] = [
  {
    headerName: 'Preferred Name',
    rowGroup: true,
    hide: true,
    field: 'chemicalName',
    cellRenderer: 'ChemicalNameRenderer',
  },
  {
    headerName: 'DTXSID',
    field: 'dtxsid',
    checkboxSelection: rowNode => !rowNode.node.group,
    minWidth: 230,
  },
  {
    headerName: 'Model',
    field: 'model',
    filter: 'agSetColumnFilter',
    cellRenderer: 'BasicFocusableDialogRenderer',
    cellRendererParams: (params: ICellRendererParams<BioactivityToxcastRes>) => {
      const returnObj = {
        text: '',
        tooltip: '',
        id: '',
      };
      if (params.node.group) {
        return returnObj;
      }
      const description = params.data?.helpTx;

      if (!description) {
        return returnObj;
      }
      return {
        tooltip: description,
        text: params.value,
        id: params.node.rowIndex?.toString() || '',
        dottedUnderline: true,
      };
    },
    minWidth: 275,
  },
  {
    headerName: 'Receptor',
    field: 'receptor',
    filter: 'agSetColumnFilter',
    minWidth: 225,
  },
  {
    headerName: 'Agonist',
    field: 'agonist',
    filter: 'agSetColumnFilter',
    minWidth: 225,
  },
  {
    headerName: 'Antagonist',
    field: 'antagonist',
    filter: 'agSetColumnFilter',
    minWidth: 225,
  },
  {
    headerName: 'Binding',
    field: 'binding',
    filter: 'agSetColumnFilter',
    minWidth: 225,
  },
];

export default colDefs;
