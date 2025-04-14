import {FetchError} from 'ofetch';
import Repository from '../Repository';
import type {
  ApiStartsWithResponse, StartsWith,
} from './types';
import type {SelectedChemical} from '~/stores/chemicalSearch/types';

export default class ChemicalSearchRepository {
  readonly #repo: Repository;

  constructor() {
    const {APPLICATION_CHEMICAL_BASE_API: baseURL} = useRuntimeConfig().public;
    this.#repo = new Repository({baseURL});
  }

  async startsWith(searchTerm: string): Promise<StartsWith | null> {
    try {
      const encodedSearchTerm = encodeURIComponent(searchTerm);
      const response = await this.#repo.fetch<ApiStartsWithResponse>(`/search/start-with2/${encodedSearchTerm}?top=50`);
      if (response.result?.length) {
        return {results: response.result};
      }
      if (!response.result?.length && response.suggestions?.length) {
        return {results: [], suggestions: response.suggestions};
      }
      return {results: []};
    } catch (error) {
      if (error instanceof FetchError && error?.response?.status === 400) { return {results: []}; }
      this.#repo.showErrorModal();
      return null;
    }
  }

  async chemicalMultiSearch(searchParams: {
    searchItems: string;
  }) {
    try {
      const results = await this.#repo.fetch<SelectedChemical[]>('/search', {
        body: searchParams,
        method: 'POST',
      });
      return results;
    } catch (error) {
      this.#repo.showErrorModal();
      throw error;
    }
  }
}
