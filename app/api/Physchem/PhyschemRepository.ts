import Repository from '../Repository';
import type {PhyschemSummary} from './types';
import type {Dtxsid} from '~~/types';

export default class PhyschemRepository {
  #repo: Repository;

  constructor() {
    const {APPLICATION_PHYSCHEM_BASE_API: baseURL} = useRuntimeConfig().public;
    this.#repo = new Repository({baseURL});
  }

  async getPhyschemSummaryData(dtxsidArr: Dtxsid[]) {
    try {
      const results = await this.#repo.fetch<PhyschemSummary[]>('/physiochemical/summary/with-details', {
        method: 'POST',
        body: dtxsidArr,
      });
      return results;
    } catch (e) {
      this.#repo.showErrorModal();
      throw e;
    }
  }

  async getEnvfatetransportSummaryData(dtxsidArr: Dtxsid[]) {
    try {
      const results = await this.#repo.fetch<PhyschemSummary[]>('/envfatetransport/summary/with-details', {
        method: 'POST',
        body: dtxsidArr,
      });
      return results;
    } catch (e) {
      this.#repo.showErrorModal();
      throw e;
    }
  }
}
