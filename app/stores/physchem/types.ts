import type {
  BaseSessionData, Dtxsid, DtxsidMap,
} from '~~/types';

export interface PhyschemSessionData extends BaseSessionData {
  chemicalsReviewedCount: number;
  totalChemicalsCount: number;
  physchemDataSelected: DtxsidMap;
  physchemChemsWithNoData: Dtxsid[];
}
