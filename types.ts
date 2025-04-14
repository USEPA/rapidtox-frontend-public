export type Dtxsid = `DTXSID${string}`;

export type Dtxcid = `DTXCID${string}`;

export interface BaseChemical {
  dtxsid: Dtxsid;
  id: number;
  dtxcid: Dtxcid | null;
  casrn: string;
  preferredName: string;
}

export interface DtxsidMap {
  [key: Dtxsid]: number[];
}

export interface PodData extends Omit<BaseChemical, 'dtxcid'> {
  toxvalType: string;
  toxvalSubtype: string;
  riskAssessmentClass: string;
  toxvalNumeric: number;
  toxvalUnits: string;
  studyType: string;
  studyDuration: number;
  studyDurationUnits: string;
  exposureRoute: string;
  exposureMethod: string;
  speciesCommon: string;
  source: string;
  effect: string;
  toxvalTypDefn: string;
  createTimestamp: string;
  superCategory: string;
  workflow: string;
  superSource: string;
  superSourceDescription: string;
  sourceUrl: string;
  clowderId: string;
  molWgt: number;
  criticalEffNt?: string;
  molecularWeight?: number;
  podId?: string | number;
  originalHazardId?: number; // Only used for converted entries on In Vivo Toxicity section.
}

export interface BaseSessionData {
  hasVisited: boolean;
}

export type Workflow = 'er' | 'hha' | 'ma' | 'home';

export interface DynamicComponentMap {
  [key: string]: Component;
}

export type ValueOf<T> = T[keyof T];
