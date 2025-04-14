import Repository from '../Repository';
import {addBearerToRequest} from '../utility/utility';
import type {
  BioactivityToxcastRes,
  BioactivityBerRes, BioactivityBaseRes, BioactivitySummaryPlotRes,
} from './types';
import type {Dtxsid} from '~~/types';

export default class BioactivityRepository {
  #repo: Repository;

  constructor() {
    const {APPLICATION_REPORT_BASE_API: baseURL} = useRuntimeConfig().public;
    this.#repo = new Repository({baseURL, onRequest: addBearerToRequest});
  }

  async getBioactivityData(dtxsids: Dtxsid[]) {
    try {
      const results = await this.#repo.fetch<BioactivityBaseRes[]>('/bioactivity-summary/search/by-dtxsids', {
        method: 'POST',
        body: dtxsids,
      });
      return results;
    } catch (e) {
      this.#repo.showErrorModal();
      throw e;
    }
  }

  async getBioactivityBerData(dtxsids: Dtxsid[]) {
    try {
      const results = await this.#repo.fetch<BioactivityBerRes[]>('/bioactivity-summary/ber/search/by-dtxsids', {
        method: 'POST',
        body: dtxsids,
      });
      return results;
    } catch (e) {
      this.#repo.showErrorModal();
      throw e;
    }
  }

  async getSummaryPlotInfo(dtxsid: Dtxsid) {
    try {
      const results = await this.#repo.fetch<BioactivitySummaryPlotRes[]>(`/bioactivity-summary/plot/search/by-dtxsid/${dtxsid}`);
      if (results.length && results[0]?.downloadUrl) {
        return results[0].downloadUrl;
      }
      return '';
    } catch (e) {
      this.#repo.showErrorModal();
      throw e;
    }
  }

  async getToxCastBioactvityData(dtxsids: Dtxsid[]) {
    try {
      const results = await this.#repo.fetch<BioactivityToxcastRes[]>('/bioactivity/toxcast/by-dtxsids', {
        method: 'POST',
        body: dtxsids,
      });
      return results;
    } catch (e) {
      this.#repo.showErrorModal();
      throw e;
    }
  }
}
