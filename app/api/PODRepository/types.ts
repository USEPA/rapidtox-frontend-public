import type {PodSectionName} from '~/components/workflowSections/pod/types';
import type {ReportArrItem} from '~/stores/report/types';

interface PodChartParamsData extends Omit<ReportData, 'toxcast' | 'ber' | 'podDataSelected'> {
  toxcast?: number[];
  ber?: BerCalcRow[];
  podDataSelected?: PodDataTypes[];
  predictedExposure?: number;

}

export interface PodChartParams extends Omit<ReportArrItem, 'hasEnvData' | 'data' | 'hasToxcastData' | 'hasBerData' | 'workflowTitle' | 'safetyLink' | 'isBioactivitySummarySelected'> {
  chartType: string;
  height: number;
  width: number;
  section?: PodSectionName;
  data: PodChartParamsData;
}
