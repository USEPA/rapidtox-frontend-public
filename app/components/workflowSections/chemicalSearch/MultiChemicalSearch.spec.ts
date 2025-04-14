import {
  describe, expect, it, vi,
} from 'vitest';
import {
  mockNuxtImport, mountSuspended, renderSuspended,
} from '@nuxt/test-utils/runtime';
import {type VueWrapper} from '@vue/test-utils';
import {
  fireEvent, type RenderResult, waitFor,
} from '@testing-library/vue';
import MultiChemicalSearch from '~/components/workflowSections/chemicalSearch/MultiChemicalSearch.vue';
import {BisphenolASelectedChemicalMock, BisphenolBSelectedChemicalMock} from '~/test/mocks/SelectedChemicalMocks';
import SectionExplanations from '~/components/workflowSections/chemicalSearch/SectionExplanations.vue';
import RecentChemicalSearches from '~/components/workflowSections/chemicalSearch/RecentChemicalSearches.vue';

const MockChemicalSelect = vi.fn();
mockNuxtImport('useChemicalSearchStore', () => () => ({
  chemicalSelect: MockChemicalSelect,
}));

let multiChemicalSearchWrapper: VueWrapper<InstanceType<typeof MultiChemicalSearch>>;
let multiChemicalSearchRendered: RenderResult;

describe('MultiChemicalSearch', () => {
  it('should have the expected textarea, buttons, and SectionExplanations components but not showing RecentChemicalSearches', async() => {
    // Arrange & Act
    multiChemicalSearchWrapper = await mountSuspended(MultiChemicalSearch);

    // Assess
    expect(multiChemicalSearchWrapper.get('textarea').html()).toContain('aria-label="Multiple Chemical Search"');
    expect(multiChemicalSearchWrapper.get('[data-testid="clear-btn"]').text()).toBe('Clear');
    expect(multiChemicalSearchWrapper.get('[data-testid=recent-searches-btn]').text()).toBe('Show Recent Searches');

    const searchButton = multiChemicalSearchWrapper.get('[data-testid=multi-search-btn]');
    expect(searchButton.text()).toBe('Search');
    expect(searchButton.element).toBeDisabled();

    const sectionExplanationsWrapper = multiChemicalSearchWrapper.findComponent(SectionExplanations);
    expect(sectionExplanationsWrapper.html()).toContain('Multiple Chemical Search');
    expect(sectionExplanationsWrapper.html()).toContain('This style of workflowId will allow you to search and compare multiple chemicals at once.');

    expect(multiChemicalSearchWrapper.findComponent(RecentChemicalSearches).exists()).toBeFalsy();
  });

  it('should enable search after any textarea input', async() => {
    // Arrange
    multiChemicalSearchRendered = await renderSuspended(MultiChemicalSearch, {
      global: {
        stubs: ['RecentChemicalSearches', 'SectionExplanations'],
      },
    });

    // Act
    await fireEvent.update(multiChemicalSearchRendered.getByRole('textbox'),
      `${BisphenolASelectedChemicalMock.dtxsid}\n${BisphenolBSelectedChemicalMock.dtxsid}`);

    // Assess
    expect(multiChemicalSearchRendered.getByTestId('multi-search-btn')).toBeEnabled();
  });

  it('should clear the input and disable the search again', async() => {
    // Arrange
    multiChemicalSearchRendered = await renderSuspended(MultiChemicalSearch, {
      global: {
        stubs: ['RecentChemicalSearches', 'SectionExplanations'],
      },
    });
    await fireEvent.update(multiChemicalSearchRendered.getByRole('textbox'),
      `${BisphenolASelectedChemicalMock.dtxsid}\n${BisphenolBSelectedChemicalMock.dtxsid}`);
    await waitFor(() => expect(multiChemicalSearchRendered.getByTestId('multi-search-btn')).toBeEnabled());

    // Act
    await fireEvent.click(multiChemicalSearchRendered.getByTestId('clear-btn'));

    // Assess
    expect(multiChemicalSearchRendered.getByRole('textbox')).toHaveValue('');
    expect(multiChemicalSearchRendered.getByTestId('multi-search-btn')).toBeDisabled();
  });

  it('should not send to store if missing chemicals and search is disabled', async() => {
    // Arrange
    multiChemicalSearchWrapper = await mountSuspended(MultiChemicalSearch, {
      global: {
        stubs: ['RecentChemicalSearches', 'SectionExplanations'],
      },
    });

    // Act
    await multiChemicalSearchWrapper.get('[data-testid=multi-search-btn]').trigger('click');

    // Assess
    expect(MockChemicalSelect).not.toHaveBeenCalled();
  });

  it('should send chemical(s) to store', async() => {
    // Arrange
    multiChemicalSearchWrapper = await mountSuspended(MultiChemicalSearch, {
      global: {
        stubs: ['RecentChemicalSearches', 'SectionExplanations'],
      },
    });

    // Act
    await multiChemicalSearchWrapper.get('textarea')
      .setValue(`${BisphenolASelectedChemicalMock.dtxsid}\n${BisphenolBSelectedChemicalMock.dtxsid}`);
    await multiChemicalSearchWrapper.get('[data-testid=multi-search-btn]').trigger('click');

    // Assess
    expect(MockChemicalSelect).toHaveBeenCalledWith({
      searchText: `${BisphenolASelectedChemicalMock.dtxsid}\n${BisphenolBSelectedChemicalMock.dtxsid}`,
      searchIdentifiers: [BisphenolASelectedChemicalMock.dtxsid, BisphenolBSelectedChemicalMock.dtxsid],
    });
  });

  it('should toggle button text to Hide and show RecentChemicalSearches component', async() => {
    // Arrange
    multiChemicalSearchWrapper = await mountSuspended(MultiChemicalSearch);

    // Act
    await multiChemicalSearchWrapper.get('[data-testid=recent-searches-btn]').trigger('click');

    // Assess
    expect(multiChemicalSearchWrapper.get('[data-testid=recent-searches-btn]').text()).toBe('Hide Recent Searches');
    expect(multiChemicalSearchWrapper.findComponent(RecentChemicalSearches).exists()).toBeTruthy();
  });

  it('should fill textarea with searched chemical(s) upon selecting a recent search', async() => {
    // Arrange
    multiChemicalSearchRendered = await renderSuspended(MultiChemicalSearch, {
      global: {
        stubs: {
          RecentChemicalSearches: {
            // minimal template since we just need it to emit
            template: '<div></div>',
            setup(_, {emit}) {
              emit('fillTextArea', {
                searchText: `${BisphenolASelectedChemicalMock.dtxsid}\n${BisphenolBSelectedChemicalMock.dtxsid}`,
              });
            },
          },
          SectionExplanations: true,
        },
      },
    });

    // Act
    await fireEvent.click(multiChemicalSearchRendered.getByTestId('recent-searches-btn'));

    // Assess
    // The waitFor here is not entirely necessary but we know the button text changes once clicked
    await waitFor(() => expect(multiChemicalSearchRendered.getByText('Hide Recent Searches')).toBeVisible());
    expect(multiChemicalSearchRendered.getByRole('textbox'))
      .toHaveValue(`${BisphenolASelectedChemicalMock.dtxsid}\n${BisphenolBSelectedChemicalMock.dtxsid}`);
  });
});
