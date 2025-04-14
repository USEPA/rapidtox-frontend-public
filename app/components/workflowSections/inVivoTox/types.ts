import type {PodData} from '~~/types';

export interface CustomDataInputPodKeyI extends PodData {
  action: string;
}

export interface CustomDataInputTableConfig {
  header: string;
  value: string;
  podKey: keyof CustomDataInputPodKeyI;
  inputType: string;
  cellStyle?: string;
  required?: boolean;
  props?: {
    type?: string;
    items?: string[] | {
      value: string; title: string;
    }[];
    // eslint-disable-next-line no-unused-vars
    required?: (value: string) => boolean | string;
    readonly?: boolean;
    label?: string;
    rows?: string | number;
  };
}

export interface ConvertDoseInput extends Pick<CustomDataInputTableConfig, 'podKey' | 'inputType' | 'props'> {
  value?: string;
  cols?: number;
  offset?: number;
  class?: string;
}

export type AllowedConversionUnits = 'ppm' | 'ppb' | 'mg/m3' | 'ug/m3';
