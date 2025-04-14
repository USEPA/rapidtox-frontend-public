import type {BaseChemical} from '~~/types';

export interface BioactivityBaseRes extends Pick<BaseChemical, 'id' | 'dtxsid'> {
  chemicalName: string;
  inactiveCount: number;
  activeCount: number;
  totalAssaysScreened: number;
  hitRate: number;
  aed50Pctile05: string;
  aed95Pctile05: string;
  invitroVersion: string;
}

export interface BioactivityBerRes extends BioactivityBaseRes {
  aed50Pctile95: string;
  aed50Pctile50: string;
  aed95Pctile50: string;
  aed95Pctile95: string;
  aedUnit: string;
  berLowerbound: string;
  berMedian: string;
  modelParam: string;
  exposureMedian: number;
  exposure95PercentMedian: number;
}

export interface BioactivitySummaryPlotRes extends Pick<BaseChemical, 'dtxsid'> {
  clowderFileUid: '61cb8592e4b0d5d4d1e483f3';
  downloadUrl: string;
  clowderFilename: string;
  clowderFileCreatedBy: string;
  sourceSystem: string;
}

export interface BioactivityToxcastRes extends Pick<BaseChemical, 'dtxsid' | 'id'> {
  chemicalName: string;
  model: string;
  receptor: string;
  agonist: string;
  antagonist: string;
  binding: string;
  helpTx: string;
  createTimestamp: string;
}
