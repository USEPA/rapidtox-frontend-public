import {FetchError} from 'ofetch';
import Repository from '../Repository';
import {addBearerToRequest} from '../utility/utility';
import type {
  BaseSession,
  PreviousSession, SessionResponse,
} from './types';

export default class SessionRepository {
  readonly #repo: Repository;

  constructor() {
    const {APPLICATION_REPORT_BASE_API: baseURL} = useRuntimeConfig().public;

    this.#repo = new Repository({baseURL, onRequest: addBearerToRequest});
  }

  async updateSession(sessionObj: BaseSession, sessionKey: string) {
    try {
      const results = await this.#repo.fetch<SessionResponse>(`/session-recall/${sessionKey}`, {
        body: sessionObj,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return results;
    } catch (error) {
      if (error instanceof FetchError && error?.response?.status === 400) {
        return [];
      }
      this.#repo.showErrorModal();
      return null;
    }
  }

  async renameSession(request: PreviousSession, sessionKey: string) {
    try {
      const results = await this.#repo.fetch<SessionResponse>(`/session-recall/${sessionKey}`, {
        body: request,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return results;
    } catch (error) {
      if (error instanceof FetchError && error?.response?.status === 400) {
        return [];
      }
      this.#repo.showErrorModal();
      return null;
    }
  }

  async deleteSession(sessionKey: string) {
    try {
      const result = await this.#repo.fetch<SessionResponse>(`/session-recall/${sessionKey}`, {
        method: 'DELETE',
      });
      return result;
    } catch (error) {
      if (error instanceof FetchError && error?.response?.status === 404) { return []; }
      this.#repo.showErrorModal();
      return null;
    }
  }

  async getUserPreviousSessions() {
    const prevSessions = await this.#repo.fetch<PreviousSession[]>('/session-recall/search/prev-session-by-username');
    return prevSessions;
  }

  async createUserSession({
    sessionTitle, username, workflow,
  }: {
    sessionTitle: string; username: string; workflow: string;
  }) {
    const createdSession = await this.#repo.fetch<SessionResponse>('/session-recall', {method: 'POST',
      body: {
        sessionTitle,
        username,
        workflow,
        activeTab: 'chemSearch',
      }});
    return createdSession;
  }

  async loadUserSession(sessionKey: string) {
    const previousSession = await this.#repo.fetch<SessionResponse>(`/session-recall/${sessionKey}`);
    return previousSession;
  }
}
