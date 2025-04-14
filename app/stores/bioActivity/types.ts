import type {BioactivityBaseRes} from '~/api/Bioactivity/types';
import type {
  BaseChemical, BaseSessionData, Dtxsid, DtxsidMap,
} from '~~/types';

interface PodDropDownOptionValue {
  label: string;
  val: string | number;
}

interface PodDropDownOption {
  text: string;
  value: PodDropDownOptionValue;
  key: string;
}

export interface BerCalcRow extends Pick<BaseChemical, 'dtxsid' | 'preferredName'> {
  exposureValue: number | string;
  exposureUnits: string;
  ber: string | number;
  podDropDown?: string | number | {
    label: string; val: number;
  };
  type: string;
  addRow?: boolean;
  default?: boolean;
  uniqueId?: number;
  hide?: boolean;
  podDropDownOptions?: PodDropDownOption[];
}

export interface BerCalcData extends Pick<BaseChemical, 'dtxsid' | 'preferredName'> {
  rows: BerCalcRow[];
}

export interface SelectedChemicalsParams extends BioactivityBaseRes {
  aed50Pctile05: string;
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

export interface BioactivitySessionData extends BaseSessionData {
  selectedToxcastChemicals: DtxsidMap;
  berCalcData: BerCalcData[];
  selectedBerCalcData: BerCalcData[];
  selectedBioactivitySummaryChemicals: Dtxsid[];
  bioActivityChemsWithNoSummary: Dtxsid[];
  bioActivityChemsWithNoToxcast: Dtxsid[];
  bioActivityChemsWithNoBer: Dtxsid[];
}

export interface SaveBerCalcEntryParams {
  dtxsid: Dtxsid; rowData: BerCalcRow[];
}
