import type {BaseChemical} from '~~/types';

export interface BaseAnalogue extends Omit<BaseChemical, 'id'> {
  isTarget: boolean;
}

export interface ReadAcross extends Omit<BaseAnalogue, 'casrn'> {
  admeFuhp: string;
  admeVolOfDist: number;
  admeHsspc: number;
  admePkHalflife: number;
  admeInvitroHc: number;
  phychemLogkow: number;
  phychemLogkoa: number;
  phychemVp: number;
  phychemWaterSolubility: number;
  hasStructureImage: number;
}

export interface ERAnalogue extends Omit<BaseAnalogue, 'dtxcid'> {
  atsdrTotal: number;
  calepaTotal: number;
  doeTotal: number;
  otherTotal: number;
  similarity: number;
}

export interface HHRAnalogue extends Omit<BaseAnalogue, 'dtxcid'> {
  irisTotal: number;
  pprtvTotal: number;
  atsdrTotal: number;
  otherTotal: number;
  similarity: number;
  oppTotal: number;
}
