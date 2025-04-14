import type {SelectedChemical} from '~/stores/chemicalSearch/types';
import type {BaseChemical} from '~~/types';

export interface RecentSearch extends Pick<BaseChemical, 'id'> {
  searchText: string;
  searchedOn: string;
  userName: string;
}

export interface ApiStartsWithResponse {
  result: SelectedChemical[] | null;
  suggestions: SelectedChemical[] | null;
}

export interface StartsWith {
  results: SelectedChemical[] | null;
  suggestions?: SelectedChemical[] | null;
}
