import type {Dtxsid, DtxsidMap} from '~~/types';

export interface EnvFateSessionData {
  chemicalsReviewedCount: number;
  totalChemicalsCount: number;
  envFateChemsWithNoData: Dtxsid[];
  envFateDataSelected: DtxsidMap;
  hasVisited: boolean;
}
