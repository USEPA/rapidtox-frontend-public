import type {SelectedChemical} from '../chemicalSearch/types';
import type {
  BaseChemical, BaseSessionData, Dtxsid, PodData,
} from '~~/types';

export interface AnalogueSelectedChemical extends SelectedChemical {
  rowIndex: number;
  colId: string;
}

export interface AnaloguePodData {
  title: string;
  dtxsid: string;
  podData: PodData[];
}

export interface SelectedAnalogue {
  dtxsid: Dtxsid;
  name: string;
  similarity: number;
}

export interface PodJustification {
  podId: number;
  dtxsid: Dtxsid;
  justification: string;
}

export interface SelectedPod extends PodData {
  raPreferredName: string;
  type: string;
  value: string;
  units: string;
  criticalEffect: string;
  source: string;
}

export interface AnalogueStepInfo extends Omit<BaseChemical, 'dtxcid' | 'casrn' | 'id'> {
  analogueChemId: number | null;
  id?: number;
  currentStep: number;
  searchWord: string;
  preferredName: string;
  smileString: string;
  unmatchedDtxsid?: Dtxsid;
  finishedStepOne: boolean;
  finishedStepTwo: boolean;
  finishedAnalogueSelection: boolean;
  selectedAnalogues: SelectedAnalogue[];
  selectedReadAcross: unknown[];
  selectedPODS: SelectedPod[];
  PODJustifications: PodJustification[];
}

export interface UpdateStepInfoParams {
  searchWord?: string;
  unselectedAnalogues?: Dtxsid[];
  unselectedPODS?: number[];
  selectedPODS?: SelectedPod[];
  finishedStepOne?: boolean;
  finishedStepTwo?: boolean;
  nextStep?: number;
  selectedAnalogues?: SelectedAnalogue[];
  PODJustifications?: PodJustification[];
  selectedReadAcross?: unknown[];
  unselectedReadAcross?: unknown[];
}

export interface AnalogueSessionData extends BaseSessionData {
  analogueChemicalsStepInfo: AnalogueStepInfo[];
  currentAnaloguePodData: AnaloguePodData;
  currentAnalogueSelectedChemical: AnalogueSelectedChemical;
  errorMessage: string;
  currentKetcherSmileString?: string;
  errorMolFile: boolean;
  ketcher: object | null;
  showAnalogueModal: boolean;
  showAnaloguePodModal?: boolean;
}
