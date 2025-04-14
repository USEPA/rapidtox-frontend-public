import {
  describe, expect, it, vi,
} from 'vitest';
import {
  mockNuxtImport, mountSuspended,
} from '@nuxt/test-utils/runtime';
import type {VueWrapper} from '@vue/test-utils';
import ChemicalSearchResultsGrid from './ChemSearchResultsGrid.vue';
import ChemicalSearchResults from '~/components/workflowSections/chemicalSearch/ChemicalSearchResults.vue';
import {BisphenolASelectedChemicalMock, BisphenolBSelectedChemicalMock} from '~/test/mocks/SelectedChemicalMocks';
import {MultiSelectedChemicalSearchSessionDataMock} from '~/test/mocks/ChemicalSearch/ChemicalSearchSessionDataMocks';

// TODO - if @nuxt/test-utils is upgraded, look to useNuxtImport for mocking like in chemicalSearch.spec.ts
const Mock$repositoriesChemicalSearchChemicalMultiSearch =
    vi.spyOn(useNuxtApp().$repositories.chemicalSearch, 'chemicalMultiSearch');
mockNuxtImport('useChemicalSearchStore', () => () => ({
  identifiers: ref(MultiSelectedChemicalSearchSessionDataMock.identifiers),
  hasChemSearchVisited: ref(true),
}));
vi.mock('~/components/workflowSections/shared/helpers');

let chemicalSearchResultsWrapper: VueWrapper<InstanceType<typeof ChemicalSearchResults>>;

describe('ChemicalSearchResults', () => {
  it('should initially show results loading', async() => {
    // Arrange & Act
    chemicalSearchResultsWrapper = await mountSuspended(ChemicalSearchResults, {
      global: {
        stubs: ['ChemicalSearchResultsGrid'],
      },
    });

    // Assess
    expect(Mock$repositoriesChemicalSearchChemicalMultiSearch)
      .toHaveBeenCalledWith(MultiSelectedChemicalSearchSessionDataMock.identifiers);
    expect(chemicalSearchResultsWrapper.html()).toContain('Your results are loading');
  });

  it('should show results', async() => {
    // Arrange & Act
    Mock$repositoriesChemicalSearchChemicalMultiSearch.mockImplementation(() => Promise.resolve([
      BisphenolASelectedChemicalMock,
      BisphenolBSelectedChemicalMock,
    ]));
    chemicalSearchResultsWrapper = await mountSuspended(ChemicalSearchResults, {
      global: {
        stubs: ['ChemicalSearchResultsGrid'],
      },
    });

    // Assess
    expect(Mock$repositoriesChemicalSearchChemicalMultiSearch)
      .toHaveBeenCalledWith(MultiSelectedChemicalSearchSessionDataMock.identifiers);
    expect(chemicalSearchResultsWrapper.findComponent(ChemicalSearchResultsGrid).props()).toEqual({rowData: [
      BisphenolASelectedChemicalMock,
      BisphenolBSelectedChemicalMock,
    ]});
  });

  it('should not show results if there is an error loading grid data', async() => {
    // Arrange & Act
    Mock$repositoriesChemicalSearchChemicalMultiSearch.mockImplementation(() => Promise.reject(new Error('Error: oh no')));
    chemicalSearchResultsWrapper = await mountSuspended(ChemicalSearchResults, {
      global: {
        stubs: ['ChemicalSearchResultsGrid'],
      },
    });

    // Assess
    expect(Mock$repositoriesChemicalSearchChemicalMultiSearch)
      .toHaveBeenCalledWith(MultiSelectedChemicalSearchSessionDataMock.identifiers);
    expect(chemicalSearchResultsWrapper.html()).toContain('Error Loading Grid Data.');
  });
});
