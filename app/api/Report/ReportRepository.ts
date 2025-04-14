import Repository from '../Repository';
import {addBearerToRequest} from '../utility/utility';
import type {
  LandscapeResponse, ChemicalParams, PreviousReport,
} from './types';
import type {Dtxsid, Workflow} from '~~/types';

export default class ReportRepository {
  #repo: Repository;

  constructor() {
    const {APPLICATION_REPORT_BASE_API: baseURL} = useRuntimeConfig().public;
    this.#repo = new Repository({baseURL, onRequest: addBearerToRequest});
  }

  async getSingleChemicalReport(selectedChemical: ChemicalParams) {
    const response = await this.#repo.fetch<string>('/report/single-chemical', {
      method: 'POST',
      body: selectedChemical,
    });
    return response;
  }

  async getMultiChemicalsReport(selectedChemicals: ChemicalParams[]) {
    const response = await this.#repo.fetch<string>('/report/multi-chemicals', {
      method: 'POST',
      body: selectedChemicals,
    });
    return response;
  }

  async getChemReportList(selectedChemicals: {
    dtxsids: Dtxsid[]; sessionKey: string; workflow: Workflow;
  }) {
    const response = await this.#repo.fetch<LandscapeResponse[]>('/landscape/landscape-reports-check', {
      method: 'POST',
      body: selectedChemicals,
    });
    return response;
  }

  async generateLandscapeReports(generateLandscapeObj: {
    dtxsid: Dtxsid;
    sessionKey: string;
    username: string;
    workflow: Workflow;
  }) {
    await this.#repo.fetch<string>('/landscape/generate-landscape-report', {
      method: 'POST',
      body: generateLandscapeObj,
    });

    return 'success';
  }

  async getPrevReports(sessionKey: string) {
    const response = await this.#repo.fetch<PreviousReport[]>(`/report/generated-reports/${sessionKey}`);
    return response;
  }
}
