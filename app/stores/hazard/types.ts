import type {
  BaseSessionData, Dtxsid, DtxsidMap, PodData,
} from '~~/types';

export interface ExposureChartData {
  dtxsid: Dtxsid;
  type: string;
  value: string | number;
}

export interface HazardSessionData extends BaseSessionData {
  chartExposure: ExposureChartData[];
  hazardChartData: PodData[];
  hazardDataSelected: DtxsidMap;
  hazardToxChemsWithNoData: Dtxsid[];
  hazardPodChemsWithNoData: Dtxsid[];
  totalChemicalsCount: number;
}

export interface ScatterPlotToolTipParams {
  'ScatterSeries-1': {
    study: string;
    toxVal: number;
  };
  source: string;
  species: string;
  study: string;
  toxVal: number;
  type: string;
}
