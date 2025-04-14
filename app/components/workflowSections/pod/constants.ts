/* eslint-disable no-unused-vars */
import type {PodSectionName} from './types';

type PodSectionKey = 'UNCERTAINTY' | 'IN_VIVO_TOX' | 'ANALOGUE' | 'BIOACTIVITY';
type PodSection = {
  [key in PodSectionKey]: PodSectionName;
};

export const POD_SECTIONS: PodSection = {
  UNCERTAINTY: 'uncertainty',
  IN_VIVO_TOX: 'In Vivo Toxicity',
  ANALOGUE: 'Analogue',
  BIOACTIVITY: 'Bioactivity',
};

type UnitConversionKeys = 'SOURCE_DRSV' | 'SPECIES' | 'ADJ_RATE' | 'DRSVHED' | 'DRSV_UNITS';
export type UnitConversionTitles = 'Species' |
  'Adj. Factor' |
  'DRSV<sub>HED</sub>' |
  'DRSV Units' |
  'Source DRSV';
type UnitConversionFields = {
  [key in UnitConversionKeys]: UnitConversionTitles
};
export const UNIT_CONV_EDITABLE_FIELDS: UnitConversionFields = {
  SOURCE_DRSV: 'Source DRSV',
  SPECIES: 'Species',
  ADJ_RATE: 'Adj. Factor',
  DRSVHED: 'DRSV<sub>HED</sub>',
  DRSV_UNITS: 'DRSV Units',
};

type AdjustmentRateTitleKeys = 'RAT' | 'HUMAN' | 'CUSTOM' | 'DOG' | 'MOUSE';
export type AdjustmentRateTitles = 'Rat' |
  'Mouse' |
  'Dog' |
  'Human' |
  'Custom';
type AdjustmentRateTitleFields = {
  [key in AdjustmentRateTitleKeys]: AdjustmentRateTitles
};

export const ADJUSTMENT_RATE_TITLES: AdjustmentRateTitleFields = {
  RAT: 'Rat',
  DOG: 'Dog',
  HUMAN: 'Human',
  MOUSE: 'Mouse',
  CUSTOM: 'Custom',
};
