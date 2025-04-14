import type {BaseChemical} from '~~/types';

interface BaseDetail extends Pick<BaseChemical, 'dtxsid' | 'id'> {
  property: string;
  source: string | null;
  result: number | null;
  unit: string | null;
  envFateInd: string;
}

export interface PhyschemExperimental extends BaseDetail {
  experimentalDetails: string | null;
}

export interface PhyschemPredicted extends BaseDetail {
  modelDesc: string;
  calculationDetails: string | null;
}

export interface PhyschemSummary extends Omit<BaseChemical, 'dtxcid' | 'casrn'> {
  property: string;
  unit: string | null;
  envFateInd: string;
  experimentalAverage: number | null;
  experimentalMedian: number | null;
  experimentalMinimum: number | null;
  experimentalMaximum: number | null;
  predictedAverage: number | null;
  predictedMedian: number | null;
  predictedMinimum: number | null;
  predictedMaximum: number | null;
  experimentalData: PhyschemExperimental[];
  predictedData: PhyschemPredicted[];
}
