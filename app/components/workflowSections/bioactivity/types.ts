import type {ValueOf} from '~~/types';

export type BioactivitySectionTitle = 'Bioactivity Summary' | 'ToxCast Models' | 'SEEM3 BER Summary';

type BioactivitySectionKey = 'SUMMARY' | 'TOXCAST' | 'SEEM3BER';

export interface BioactivitySectionBreadcrumb {
  section: BioactivitySectionTitle;
  disabled: boolean;
}

export type BioactivitySection = {
  [key in BioactivitySectionKey]: BioactivitySectionTitle;
};

export type BioactivitySectionError = {
  [key in BioactivitySectionKey]: boolean;
};

export interface UpdateBerSeem3CalcEvent {
  rowData: BerCalcRow;
  valueToUpdate?: keyof BerCalcRow;
  newVal?: ValueOf<BerCalcRow>;
  rowIndex: number;
}
