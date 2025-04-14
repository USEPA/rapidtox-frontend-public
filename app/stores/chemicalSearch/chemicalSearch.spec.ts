import {
  beforeEach, describe, expect, it, vi,
} from 'vitest';
import {mockNuxtImport} from '@nuxt/test-utils/runtime';
import {useChemicalSearchStore} from '~/stores/chemicalSearch/chemicalSearch';
import {
  MultiSelectedChemicalSearchSessionDataMock,
  SingleSelectedChemicalSearchSessionDataMock,
} from '~/test/mocks/ChemicalSearch/ChemicalSearchSessionDataMocks';
import {BisphenolASelectedChemicalMock, BisphenolBSelectedChemicalMock} from '~/test/mocks/SelectedChemicalMocks';
import type {SelectedChemical} from '~/stores/chemicalSearch/types';
import {oidcUserMock} from '~/test/mocks/UserMocks';

const MockResetWorkflowState = vi.fn();
const Mock$patch = vi.fn();
mockNuxtImport('useAppBaseStore', () => () => ({
  resetWorkflowState: MockResetWorkflowState,
  $patch: Mock$patch,
}));

const Mock$repositoriesChemicalSearchSaveRecentChemicalSearch = vi.fn();
mockNuxtImport('useNuxtApp', () => () => ({
  $repositories: {
    recentSearch: {
      saveRecentChemicalSearch: Mock$repositoriesChemicalSearchSaveRecentChemicalSearch,
    },
  },
}));
mockNuxtImport('useOidcAuth', () => () => oidcUserMock);

let subject: ReturnType<typeof useChemicalSearchStore>;

describe('useChemicalSearchStore', () => {
  beforeEach(() => {
    // Arrange
    subject = useChemicalSearchStore();
  });

  it('should provide the expected default chemicalSearchStore values and functions', () => {
    expect(subject.hasChemSearchVisited).toBe(false);
    expect(subject.hasChemSearchResultsVisited).toBe(false);
    expect(typeof subject.loadChemicalSearchSession).toEqual('function');
    expect(typeof subject.resetChemical).toEqual('function');
    expect(subject.isSingleSearch).toBe(false);
    expect(subject.chemSearchDisabled).toBe(true);
    expect(subject.multiSearchInput).toEqual('');
    expect(subject.selectedDtxsids).toEqual([]);
    expect(subject.selectedChemicals).toEqual([]);
    expect(subject.selectedChemicalsNameList).toEqual([]);
    expect(subject.selectedMatchedChemicals).toEqual([]);
    expect(subject.selectedUnmatchedChemicals).toEqual([]);
    expect(subject.unmatchedChemicalsCount).toEqual(0);
    expect(subject.identifiers).toEqual({});
    expect(subject.identifiersCount).toEqual(0);
    expect(typeof subject.chemicalSelect).toEqual('function');
    expect(subject.matchedCount).toEqual(0);
  });

  describe('single search', () => {
    it('should load a single chemical search session', () => {
      // Act
      subject.loadChemicalSearchSession(SingleSelectedChemicalSearchSessionDataMock);

      // Assess
      expect(subject.hasChemSearchVisited).toBe(true);
      expect(subject.hasChemSearchResultsVisited).toBe(true);
      expect(subject.multiSearchInput).toEqual(BisphenolASelectedChemicalMock.dtxsid);
      subject.selectedChemicals.forEach((chemical: SelectedChemical) => {
        expect(chemical).toEqual(expect.objectContaining({dtxsid: BisphenolASelectedChemicalMock.dtxsid}));
      });
      expect(subject.identifiers).toEqual({searchItems: BisphenolASelectedChemicalMock.dtxsid});

      // Assess additional side effects after Act above
      expect(subject.identifiersCount).toEqual(1);
      expect(subject.chemSearchDisabled).toBe(false);
      expect(subject.selectedMatchedChemicals).toEqual([BisphenolASelectedChemicalMock]);
      expect(subject.selectedUnmatchedChemicals).toEqual([]);
      expect(subject.unmatchedChemicalsCount).toEqual(0);
      expect(subject.selectedChemicalsNameList).toEqual([BisphenolASelectedChemicalMock.preferredName]);
      expect(subject.selectedDtxsids).toEqual([BisphenolASelectedChemicalMock.dtxsid]);
      expect(subject.isSingleSearch).toBe(true);
    });

    it('should reset the chemical search session', () => {
      // Act
      subject.loadChemicalSearchSession(SingleSelectedChemicalSearchSessionDataMock);
      subject.resetChemical();

      // Assess
      expect(subject.selectedChemicals).toEqual([]);
      expect(subject.hasChemSearchResultsVisited).toBe(false);
      expect(subject.identifiers).toEqual({});

      // Assess additional side effects after Act above
      expect(subject.chemSearchDisabled).toBe(true);
      expect(subject.selectedMatchedChemicals).toEqual([]);
      expect(subject.selectedUnmatchedChemicals).toEqual([]);
      expect(subject.unmatchedChemicalsCount).toEqual(0);
      expect(subject.selectedChemicalsNameList).toEqual([]);
      expect(subject.selectedDtxsids).toEqual([]);
      expect(subject.isSingleSearch).toBe(false);
      expect(subject.multiSearchInput).toEqual(BisphenolASelectedChemicalMock.dtxsid);
      expect(subject.identifiersCount).toEqual(0);
    });

    it('should save the selected chemical search for that user', () => {
      // Act
      subject.chemicalSelect({searchText: BisphenolASelectedChemicalMock.dtxsid,
        searchIdentifiers: [BisphenolASelectedChemicalMock.dtxsid]});

      // Assess
      expect(MockResetWorkflowState).toHaveBeenCalled();
      expect(Mock$repositoriesChemicalSearchSaveRecentChemicalSearch)
        .toHaveBeenCalledWith(BisphenolASelectedChemicalMock.dtxsid);
      expect(subject.multiSearchInput).toEqual(BisphenolASelectedChemicalMock.dtxsid);
      expect(subject.hasChemSearchResultsVisited).toBe(false);
      expect(subject.identifiers).toEqual({searchItems: BisphenolASelectedChemicalMock.dtxsid});
      expect(subject.identifiersCount).toEqual(1);
      expect(Mock$patch).toHaveBeenCalledWith({activeTab: 'chemSearchResults'});
    });
  });

  describe('multi search', () => {
    it('should load a multi chemical search session', () => {
      // Act
      subject.loadChemicalSearchSession(MultiSelectedChemicalSearchSessionDataMock);

      // Assess
      expect(subject.hasChemSearchVisited).toBe(true);
      expect(subject.hasChemSearchResultsVisited).toBe(true);
      expect(subject.multiSearchInput).toEqual(`${BisphenolASelectedChemicalMock.dtxsid}\n${BisphenolBSelectedChemicalMock.dtxsid}`);
      expect(subject.selectedChemicals
        .find((chemical: SelectedChemical) => chemical.dtxsid === BisphenolASelectedChemicalMock.dtxsid))
        .toEqual(BisphenolASelectedChemicalMock);
      expect(subject.selectedChemicals
        .find((chemical: SelectedChemical) => chemical.dtxsid === BisphenolBSelectedChemicalMock.dtxsid))
        .toEqual(BisphenolBSelectedChemicalMock);
      expect(subject.identifiers).toEqual({searchItems: `${BisphenolASelectedChemicalMock.dtxsid}\n${BisphenolBSelectedChemicalMock.dtxsid}`});

      // Assess additional side effects after Act above
      expect(subject.identifiersCount).toEqual(2);
      expect(subject.chemSearchDisabled).toBe(false);
      expect(subject.selectedMatchedChemicals).toEqual([BisphenolASelectedChemicalMock, BisphenolBSelectedChemicalMock]);
      expect(subject.selectedUnmatchedChemicals).toEqual([]);
      expect(subject.unmatchedChemicalsCount).toEqual(0);
      expect(subject.selectedChemicalsNameList).toEqual([
        BisphenolASelectedChemicalMock.preferredName,
        BisphenolBSelectedChemicalMock.preferredName,
      ]);
      expect(subject.selectedDtxsids).toEqual([
        BisphenolASelectedChemicalMock.dtxsid,
        BisphenolBSelectedChemicalMock.dtxsid,
      ]);
      expect(subject.isSingleSearch).toBe(false);
    });

    it('should reset the chemical search session', () => {
      // Act
      subject.loadChemicalSearchSession(MultiSelectedChemicalSearchSessionDataMock);
      subject.resetChemical();

      // Assess
      expect(subject.selectedChemicals).toEqual([]);
      expect(subject.hasChemSearchResultsVisited).toBe(false);
      expect(subject.identifiers).toEqual({});

      // Assess additional side effects after Act above
      expect(subject.chemSearchDisabled).toBe(true);
      expect(subject.selectedMatchedChemicals).toEqual([]);
      expect(subject.selectedUnmatchedChemicals).toEqual([]);
      expect(subject.unmatchedChemicalsCount).toEqual(0);
      expect(subject.selectedChemicalsNameList).toEqual([]);
      expect(subject.selectedDtxsids).toEqual([]);
      expect(subject.isSingleSearch).toBe(false);
      expect(subject.multiSearchInput).toEqual(`${BisphenolASelectedChemicalMock.dtxsid}\n${BisphenolBSelectedChemicalMock.dtxsid}`);
      expect(subject.identifiersCount).toEqual(0);
    });

    it('should save the selected chemicals search for that user', () => {
      // Act
      subject.chemicalSelect({searchText: `${BisphenolASelectedChemicalMock.dtxsid} ${BisphenolBSelectedChemicalMock.dtxsid}`,
        searchIdentifiers: [
          BisphenolASelectedChemicalMock.dtxsid,
          BisphenolBSelectedChemicalMock.dtxsid,
        ]});

      // Assess
      expect(MockResetWorkflowState).toHaveBeenCalled();
      expect(Mock$repositoriesChemicalSearchSaveRecentChemicalSearch)
        .toHaveBeenCalledWith(`${BisphenolASelectedChemicalMock.dtxsid} ${BisphenolBSelectedChemicalMock.dtxsid}`);
      expect(subject.multiSearchInput).toEqual(`${BisphenolASelectedChemicalMock.dtxsid}\n${BisphenolBSelectedChemicalMock.dtxsid}`);
      expect(subject.hasChemSearchResultsVisited).toBe(false);
      expect(subject.identifiers).toEqual({searchItems: `${BisphenolASelectedChemicalMock.dtxsid}\n${BisphenolBSelectedChemicalMock.dtxsid}`});
      expect(subject.identifiersCount).toEqual(2);
      expect(Mock$patch).toHaveBeenCalledWith({activeTab: 'chemSearchResults'});
    });
  });
});
