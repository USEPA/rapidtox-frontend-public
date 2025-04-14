import {
  describe, expect, it, vi,
} from 'vitest';
import {
  mockNuxtImport, mountSuspended,
} from '@nuxt/test-utils/runtime';
import type {VueWrapper} from '@vue/test-utils';
import SingleChemicalSearch from '~/components/workflowSections/chemicalSearch/SingleChemicalSearch.vue';
import {BisphenolASelectedChemicalMock} from '~/test/mocks/SelectedChemicalMocks';
import TypeAheadSearch from '~/components/layout/UI/Search/TypeAheadSearch.vue';
import SectionExplanations from '~/components/workflowSections/chemicalSearch/SectionExplanations.vue';
import {TYPEAHEAD_SEARCH_LABEL} from '~/components/layout/UI/Search/constants';

const MockChemicalSelect = vi.fn();
mockNuxtImport('useChemicalSearchStore', () => () => ({
  chemicalSelect: MockChemicalSelect,
}));

let singleChemicalSearchWrapper: VueWrapper<InstanceType<typeof SingleChemicalSearch>>;

describe('SingleChemicalSearch', () => {
  it('should have the expected TypeAheadSearch and SectionExplanations components', async() => {
    // Arrange & Act
    singleChemicalSearchWrapper = await mountSuspended(SingleChemicalSearch);

    // Assess
    const typeAheadSearchWrapper = singleChemicalSearchWrapper.findComponent(TypeAheadSearch);
    expect(typeAheadSearchWrapper.html()).toContain(TYPEAHEAD_SEARCH_LABEL);

    const sectionExplanationsWrapper = singleChemicalSearchWrapper.findComponent(SectionExplanations);
    expect(sectionExplanationsWrapper.html()).toContain('Single Chemical Search');
    expect(sectionExplanationsWrapper.html()).toContain('This workflow mode will target information for a specific chemical of interest.');
  });

  it('should send a selected chemical to store', async() => {
    // Arrange
    singleChemicalSearchWrapper = await mountSuspended(SingleChemicalSearch, {
      global: {
        stubs: ['TypeAheadSearch', 'SectionExplanations'],
      },
    });
    const chem = {
      value: 'testVal', title: 'testTitle', ...BisphenolASelectedChemicalMock,
    };
    const searchText = 'testSearchText';

    // Act
    singleChemicalSearchWrapper.findComponent(TypeAheadSearch).vm.$emit('onSelect', {chem, searchText});

    // Assess
    expect(MockChemicalSelect).toHaveBeenCalledWith({
      searchText: 'testSearchText',
      searchIdentifiers: [BisphenolASelectedChemicalMock.dtxsid],
    });
  });
});
