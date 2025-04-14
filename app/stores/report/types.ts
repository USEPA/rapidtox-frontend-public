import type {BerCalcRow} from '../bioActivity/types';
import type {PodDataTypes} from '../pod/types';
import type {PodJustification} from '../analogue/types';
import type {Dtxsid, PodData} from '~~/types';

interface ReportAnalogueDetails {
  dtxsidList: Dtxsid[];
  similarityList: string[] | number[];
  podIdsList: number[];
  podJustifications: PodJustification[];
}

export interface ReportData {
  hazard: number[];
  physchem: number[];
  customData: PodData[];
  toxcast: number[];
  ber: BerCalcRow[];
  podDataSelected: PodDataTypes[];
  reportAnalogueDetails: ReportAnalogueDetails;
  predictedExposure?: number | string;
}

export interface ReportArrItem {
  username: string;
  dtxsid: Dtxsid;
  safetyLink: string;
  workflowTitle: string;
  isBioactivitySummarySelected: boolean;
  hasHazardToxData: boolean;
  hasHazardPodData: boolean;
  hasPhyschemData: boolean;
  hasEnvData: boolean;
  hasToxcastData: boolean;
  hasBerData: boolean;
  data: ReportData;
}
