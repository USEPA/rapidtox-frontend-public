import mitt from 'mitt';
import type {UpdateBerSeem3CalcEvent} from '~/components/workflowSections/bioactivity/types';
import type {SessionSnackbarConfig} from '~/components/workflowSections/session/types';

type AppEvents = {
  'session-modal-feedback-snackbar': SessionSnackbarConfig;
  'hide-prev-reports': undefined;
  'update-seem3-ber-calc-row': UpdateBerSeem3CalcEvent;
  'update-seem3-ber-calc-remove-row': Pick<UpdateBerSeem3CalcEvent, 'rowData' | 'rowIndex'>;
  'update-seem3-ber-value': Pick<UpdateBerSeem3CalcEvent, 'rowData' | 'rowIndex'> & {
    ber: number;
  };
};

const emitter = mitt<AppEvents>();

export const useEvent = emitter.emit;
export const useOn = emitter.on;
// usage:
// emit event: useEvent('toggled', {action: 'toggled'})
// listen for event: useOn('toggled', action => console.log(action))
