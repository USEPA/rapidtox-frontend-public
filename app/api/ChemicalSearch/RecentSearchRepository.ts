import Repository from '../Repository';
import {addBearerToRequest} from '../utility/utility';
import type {
  RecentSearch,
} from './types';

export default class RecentSearchRepository {
  #repo: Repository;

  constructor() {
    const {APPLICATION_REPORT_BASE_API: baseURL} = useRuntimeConfig().public;
    this.#repo = new Repository({baseURL, onRequest: addBearerToRequest});
  }

  async saveRecentChemicalSearch(searchText: string) {
    try {
      const searchTextFormatted = searchText.replaceAll('"', '\'');

      const results = await this.#repo.fetch<string>('/recent-search', {
        body: searchTextFormatted,
        method: 'POST',
      });
      return results;
    } catch {
      // catching and ignoring - possibly change later
      return null;
    }
  }

  async getRecentChemicalSearches() {
    const response = await this.#repo.fetch<RecentSearch[]>('/recent-search', {
    });
    return response;
  }

  async deleteRecentChemicalSearch(id: number) {
    try {
      const response = await this.#repo.fetch<string>(`/recent-search/${id}`, {
        method: 'DELETE',
      });
      return response;
    } catch {
      this.#repo.showErrorModal({errorMsg: 'Sorry, your request to delete this recent search failed.', redirectHome: false});
      return null;
    }
  }
}
