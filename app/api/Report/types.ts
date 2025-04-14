import type {ReportArrItem} from '~/stores/report/types';
import type {BaseChemical} from '~~/types';

export interface ChemicalParams extends ReportArrItem {
  sessionKey: string;
  reportDesc: string;
}

export interface LandscapeResponse extends Pick<BaseChemical, 'dtxsid' | 'preferredName'> {
}

export interface PreviousReport {
  clowderId: string;
  createdAt: string;
  reportId?: number;
  createdBy: string;
  reportDesc: string;
  reportType: string;
  sessionKey: string;
}
