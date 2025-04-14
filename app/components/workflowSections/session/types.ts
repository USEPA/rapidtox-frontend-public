import type {ColDef, GridOptions} from 'ag-grid-community';
import type {UserGridItem, PreviousSession} from '~/api/Session/types';

export interface SelectablePreviousSession extends PreviousSession {
  title: string;
  value: string;
}

export interface UsersGridConfigObj {
  gridColumnDefs: ColDef<UserGridItem>[];
  gridOptions: GridOptions<UserGridItem>;
}

export interface SessionSnackbarConfig {
  snackbarMsg: string;
  snackbarBtnColor: string;
  snackbarTimeout?: number;
}
