import type {GridOptions} from 'ag-grid-community';
import type {SelectedChemical} from '~/stores/chemicalSearch/types';

const gridOptions: GridOptions<SelectedChemical> = {
  ...baseGridOptions,
};

export default gridOptions;
