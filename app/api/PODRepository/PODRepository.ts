import Repository from '../Repository';
import {addBearerToRequest} from '../utility/utility';
import type {PodChartParams} from './types';
import type {PodData} from '~~/types';

export default class PODRepository {
  #repo: Repository;

  constructor() {
    const {APPLICATION_REPORT_BASE_API: baseURL} = useRuntimeConfig().public;
    this.#repo = new Repository({baseURL});
  }

  async getPODHazardData(idArr: number[]) {
    try {
      const results = await this.#repo.fetch<PodData[]>('/hazard/ids', {method: 'POST', body: idArr});
      return results;
    } catch (e) {
      this.#repo.showErrorModal();
      throw e;
    }
  }

  async getChemicalChart(podChartParams: PodChartParams) {
    try {
      const response = await this.#repo.fetch.raw<string>('/chart/proxy/single-chemical', {
        method: 'POST',
        body: podChartParams,
        responseType: 'arrayBuffer',
        headers: {
          Accept: 'image/png',
        },
      });
      const descriptiveText = response.headers.get('descriptive_text');
      const imageBuffer = Buffer.from(response._data as string, 'binary').toString('base64');

      return {
        imageBuffer,
        descriptiveText,
      };
    } catch {
      return null;
    }
  }
}
