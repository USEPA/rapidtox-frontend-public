import type {Workflow} from '~~/types';

export interface RenameSessionRequest {
  sessionTitle: string;
}

export interface PreviousSession {
  sessionTitle: string;
  username: string;
  updateTimestamp: string;
  workflow: Workflow;
  sessionKey: string;
}

export interface BaseSession {
  activeTab: TabKey;
  username: string;
  chemicalSearch: string | null;
  hazard: string | null;
  physchem: string | null;
  analogue: string | null;
  bioactivity: string | null;
  pod: string | null;
  report: string | null;
  envFate: string | null;
}

export interface SessionResponse extends BaseSession {
  sessionKey: string;
  sessionTitle: string;
  createTimestamp: string;
  updateTimestamp: string;
  originalUsername: string | null;
  workflow: Workflow;
  originalSessionKey: string;
}

export interface UserGridItem {
  username: string;
  badTitle: boolean;
}
