import {
  describe, expect, it, vi,
} from 'vitest';
import {mountSuspended} from '@nuxt/test-utils/runtime';
import type {VueWrapper} from '@vue/test-utils';
import ChemicalSearch from '~/components/workflowSections/chemicalSearch/ChemicalSearch.vue';
import {TYPEAHEAD_SEARCH_LABEL} from '~/components/layout/UI/Search/constants';

// Mock the ResizeObserver for vuetify and v-tabs
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

let chemicalSearchWrapper: VueWrapper<InstanceType<typeof ChemicalSearch>>;

describe('ChemicalSearch', () => {
  it('should init with the Single Chemical Search showing', async() => {
    // Arrange & Act
    chemicalSearchWrapper = await mountSuspended(ChemicalSearch);

    // Assess
    // Found in SingleChemicalSearch.vue but not MultiChemicalSearch.vue so should be showing
    expect(chemicalSearchWrapper.html()).toContain(TYPEAHEAD_SEARCH_LABEL);

    // And oppositely found in MultiChemicalSearch.vue but not SingleChemicalSearch.vue so should not be showing
    expect(chemicalSearchWrapper.html()).not.toContain('Recent Searches');
  });

  it('should switch to Multiple Chemical Search tab', async() => {
    // Arrange
    chemicalSearchWrapper = await mountSuspended(ChemicalSearch);

    // Act
    await chemicalSearchWrapper.get('[data-testid="select-multi-chemical-search-tab"]').trigger('click');

    // Assess
    // Now MultiChemicalSearch.vue should be showing
    expect(chemicalSearchWrapper.html()).toContain('Recent Searches');
  });
});
