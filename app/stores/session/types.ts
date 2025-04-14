import type {PreviousSession} from '~/api/Session/types';

export interface CreateSessionParams extends Omit<PreviousSession, 'updateTimestamp' | 'sessionKey' | 'username'> {
  redirectUrl: string;
}

export type SnackBarMsg = 'Your session has been saved.' | 'Session successfully loaded.' | 'Session successfully created.' | 'Session has successfully been reset.' | '';
