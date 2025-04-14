import {
  describe, expect, it,
} from 'vitest';
import {mountSuspended} from '@nuxt/test-utils/runtime';
import type {VueWrapper} from '@vue/test-utils';
import ChemicalSearchResultsGrid from './ChemSearchResultsGrid.vue';
import {BisphenolASelectedChemicalMock, BisphenolBSelectedChemicalMock} from '~/test/mocks/SelectedChemicalMocks';

let chemicalSearchResultsGridWrapper: VueWrapper<InstanceType<typeof ChemicalSearchResultsGrid>>;

describe('ChemicalSearchResultsGrid', () => {
  it('should hold the right attribute keys for the ChemicalSearchResultsGrid', async() => {
    // Arrange & Act
    chemicalSearchResultsGridWrapper = await mountSuspended(ChemicalSearchResultsGrid, {
      global: {
        stubs: ['ag-grid-vue'],
      },
      props: {
        rowData: [
          BisphenolASelectedChemicalMock,
          BisphenolBSelectedChemicalMock,
        ],
      },
    });

    // Assess
    const chemicalSearchResultsGridAttributeKeys =
        Object.keys(chemicalSearchResultsGridWrapper.findComponent({name: 'ag-grid-vue'}).attributes());
    expect(chemicalSearchResultsGridAttributeKeys).toContain('grid-options');
    expect(chemicalSearchResultsGridAttributeKeys).toContain('column-defs');
    expect(chemicalSearchResultsGridAttributeKeys).toContain('row-data');
  });
});
