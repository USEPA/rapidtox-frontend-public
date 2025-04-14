import type {ChemicalSearchSessionData} from '~/stores/chemicalSearch/types';
import {BisphenolASelectedChemicalMock, BisphenolBSelectedChemicalMock} from '~/test/mocks/SelectedChemicalMocks';

export const SingleSelectedChemicalSearchSessionDataMock: ChemicalSearchSessionData = {
  hasChemSearchVisited: true,
  hasChemSearchResultsVisited: true,
  multiSearchInput: BisphenolASelectedChemicalMock.dtxsid,
  selectedChemicals: [BisphenolASelectedChemicalMock],
  identifiers: {searchItems: BisphenolASelectedChemicalMock.dtxsid},
};

export const MultiSelectedChemicalSearchSessionDataMock: ChemicalSearchSessionData = {
  hasChemSearchVisited: true,
  hasChemSearchResultsVisited: true,
  multiSearchInput: `${BisphenolASelectedChemicalMock.dtxsid}\n${BisphenolBSelectedChemicalMock.dtxsid}`,
  selectedChemicals: [BisphenolASelectedChemicalMock, BisphenolBSelectedChemicalMock],
  identifiers: {searchItems: `${BisphenolASelectedChemicalMock.dtxsid}\n${BisphenolBSelectedChemicalMock.dtxsid}`},
};
