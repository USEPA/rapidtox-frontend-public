import type {WritableComputedRef} from 'vue';
import type {UnitConversionTitles} from './constants';
import type {BaseChemical, DynamicComponentMap} from '~~/types';

export type PodSectionName = 'In Vivo Toxicity' | 'Bioactivity' | 'Analogue' | 'uncertainty';
export interface PodSection {
  section: PodSectionName;
  label: string;
  disabled: boolean;
}

export type ChartDialogImgType = 'oral' | 'inhalation';

export interface PodTempObj extends
  Pick<BasePodSelection, 'section' | 'rfvLabel' | 'rfvLabelOptions' | 'podId' | 'uncertaintyFactorData'>,
  Pick<BaseChemical, 'dtxsid' | 'preferredName'>,
  Pick<AnaloguePodDataSelection, 'readAcrossDtxsid' | 'toxvalUnits'> {
  readAcrossValue: number | string;
  id: string;
  toxvalNumeric?: string | number;
}

export interface PodConversionData {
  convertedValue: number | null;
  adjustmentFactor: number | null;
  podhed: number | null;
  adjustmentFactorName?: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface InternalItem<T = any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  raw: T;
}

export interface EditableFields {
  title: UnitConversionTitles;
  tooltip?: boolean | string;
  inputType: keyof DynamicComponentMap;
  value: string | number |
    Ref<string | null, string>
    | Ref<null, null> | WritableComputedRef<number, number> | ComputedRef<string | number> | Ref<number | null, number>;
  props?: {
    readonly?: boolean;
    min?: number;
    items?: {
      title: string; value: number;
    }[];
    'item-value'?: string;
  };
}
