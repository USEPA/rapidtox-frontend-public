import type {GridOptions} from 'ag-grid-community';
import type {ERAnalogue, HHRAnalogue} from '~/api/Analogue/types';

const gridOptions: GridOptions<ERAnalogue | HHRAnalogue> = {
  ...baseGridOptions,
  rowSelection: 'multiple',
  rowMultiSelectWithClick: true,
  isRowSelectable: rowNode => !rowNode.data?.isTarget,
};

export default gridOptions;
