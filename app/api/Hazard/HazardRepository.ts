import {FetchError} from 'ofetch';
import Repository from '../Repository';
import type {
  PodData, Dtxsid, Workflow,
} from '~~/types';

export default class HazardRepository {
  #repo: Repository;

  constructor() {
    const {APPLICATION_HAZARD_BASE_API: baseURL} = useRuntimeConfig().public;
    this.#repo = new Repository({baseURL});
  }

  async getHazardData(dtxsidArr: Dtxsid[], workflow: Workflow) {
    try {
      const results = await this.#repo.fetch<PodData[]>(`/by-workflow/${workflow}`, {
        method: 'POST',
        body: dtxsidArr,
      });
      return results;
    } catch (e) {
      this.#repo.showErrorModal();
      throw e;
    }
  }

  async getPODData(dtxsid: Dtxsid, workflow: Workflow) {
    try {
      const response = await this.#repo.fetch<PodData[]>(`/pod/dtxsid/${dtxsid}/workflow/${workflow}`, {
      });
      return response;
    } catch (error) {
      if (error instanceof FetchError && error?.response?.status === 400) { return []; }
      this.#repo.showErrorModal();
      throw error;
    }
  }
}
