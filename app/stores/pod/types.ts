import type {AnalogueStepInfo} from '../analogue/types';
import type {
  PodData, Dtxsid, BaseSessionData,
} from '~~/types';

export interface UncertaintyFactorData {
  title: string;
  value: number;
  justStatement: string;
  tooltip: string;
}

export interface BasePodSelection {
  section: string;
  rfvLabel: string;
  rfvLabelOptions: string[];
  podId?: number | string;
  uncertaintyFactorData: UncertaintyFactorData[];
  podValue?: string | number;
  compositeUf?: number;
  interimRfV?: string;
  dupRow?: boolean;
}

interface ConversionData {
  convertedValue: number | null;
  adjustmentFactor: number | null;
  podhed: number | null;
}

export interface UpdatePodCalcParams extends Pick<BasePodSelection, 'podId' | 'uncertaintyFactorData'> {
  compositeUf: number;
  interimRfV: string;
  conversionData: ConversionData;
}

export interface HazardPodDataSelection extends Omit<PodData, 'id'>, BasePodSelection {
  id?: string;
}

export interface AnaloguePodDataSelection extends Omit<AnalogueStepInfo, 'id'>, BasePodSelection {
  toxvalUnits: string;
  readAcrossDtxsid: Dtxsid;
  id: string;
  readAcrossPrefName: string;
  readAcrossType: string;
  readAcrossValue: number | string;
  readAcrossUnits: string;
  readAcrossExpoRoute: string;
  readAcrossSpecies: string;
  readAcrossCE: string;
  readAcrossSource: string;
}

export type PodDataTypes = HazardPodDataSelection | AnaloguePodDataSelection;

export interface PodSessionData extends BaseSessionData {
  podDataSelected: PodDataTypes[];
  podChemsWithNoUncertaintyData: Dtxsid[];
}

export type PodUncertaintyData = PodDataTypes & {
  podValue: number | string;
  convertedValue?: number | null;
  adjustmentFactor?: number | null;
  podhed?: number | null;
  adjustmentFactorName?: string | null;
  hazardObj: {
    source: string;
    species: string;
    criticalEffect: string;
    exposureRoute: string;
    type: string;
  };
};
