import type {ColDef, ICellRendererParams} from 'ag-grid-community';
import type {UserGridItem} from '~/api/Session/types';

const colDefs: ColDef<UserGridItem>[] = [
  {
    headerName: 'Username',
    filter: 'agTextColumnFilter',
    checkboxSelection: (params) => {
      if (params.data?.badTitle === true) {
        return false;
      }
      return true;
    },
    cellRenderer(params: ICellRendererParams<UserGridItem>) {
      if (params.data?.badTitle === true) {
        return `<span tabindex="0" title="This user already has a session with this title." style="text-decoration: line-through;">${params.data?.username}</span>`;
      }

      return params.data?.username;
    },
    suppressHeaderMenuButton: true,
  },
];

export default colDefs;
