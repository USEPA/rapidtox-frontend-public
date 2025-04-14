import type {BaseChemical, Dtxsid} from '~~/types';

export interface Idenitifer {
  searchItems: string;
}

export interface SelectedChemical extends BaseChemical {
  selected: boolean | null;
  nioshLink: string | null;
  safetyLink: string | null;
  searchMatch: string;
  searchGroup: string;
  searchWord: string;
  modifiedValue: string;
  unmatchedDtxsid?: Dtxsid;
  rank: number;
  hasStructureImage: boolean | string;
  smiles: string | null;
  isMarkush: boolean;
  odorThreshold: string | null;
  hasPod?: boolean;
  hasTox: boolean | null;
}

export interface ChemicalSearchSessionData {
  hasChemSearchVisited: boolean;
  hasChemSearchResultsVisited: boolean;
  multiSearchInput: string;
  selectedChemicals: SelectedChemical[];
  identifiers: Idenitifer;
}
