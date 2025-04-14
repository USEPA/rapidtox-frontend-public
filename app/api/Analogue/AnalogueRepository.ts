import Repository from '../Repository';
import {addBearerToRequest} from '../utility/utility';
import type {
  HHRAnalogue, ERAnalogue, ReadAcross,
} from './types';
import type {Dtxsid, Workflow} from '~~/types';

export default class AnalogueRepository {
  #repo: Repository;

  #moleRepo: Repository;

  constructor() {
    const {APPLICATION_REPORT_BASE_API: baseURL, APPLICATION_CHEMICAL_MOL_FILE_API: moleBaseUrl} = useRuntimeConfig().public;
    this.#repo = new Repository({baseURL, onRequest: addBearerToRequest});
    this.#moleRepo = new Repository({baseURL: moleBaseUrl, onRequest: addBearerToRequest});
  }

  async getAnalogues(dtxsid: Dtxsid, smiles: string, tanimoto: string, workflow: Workflow = 'er') {
    try {
      const encodedSmiles = encodeURIComponent(smiles);
      const response = await this.#repo.fetch<ERAnalogue[] | HHRAnalogue[]>(`/analogue/${workflow}/by-similarity/${dtxsid}/${tanimoto}/?smiles=${encodeURIComponent(encodedSmiles)}`);
      return response;
    } catch (e) {
      this.#repo.showErrorModal();
      throw e;
    }
  }

  async getReadAcross(dtxsid: Dtxsid, dtxsidArr: Dtxsid[], workflow: Workflow = 'er') {
    try {
      const results = await this.#repo.fetch<ReadAcross[]>(`/readacross/${workflow}/by-dtxsids/${dtxsid}`, {
        method: 'POST',
        body: dtxsidArr,
      });
      return results;
    } catch (e) {
      this.#repo.showErrorModal();
      throw e;
    }
  }

  async getMolFile(dtxsid: string) {
    try {
      const molFile = await this.#moleRepo.fetch<string>(`/${dtxsid}`);
      return molFile;
    } catch {
      this.#moleRepo.showErrorModal();
      return null;
    }
  }
}
