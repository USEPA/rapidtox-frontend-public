import {
  describe, expect, it, vi,
} from 'vitest';
import {
  mountSuspended, renderSuspended,
} from '@nuxt/test-utils/runtime';
import type {VueWrapper} from '@vue/test-utils';
import type {RenderResult} from '@testing-library/vue';
// eslint-disable-next-line no-duplicate-imports
import {fireEvent, waitFor} from '@testing-library/vue';
import RecentChemicalSearches from '~/components/workflowSections/chemicalSearch/RecentChemicalSearches.vue';
import {getRecentChemicalSearchesMock} from '~/test/mocks/ChemicalSearch/RecentSearchMocks';
import type {RecentSearch} from '~/api/ChemicalSearch/types';

// TODO - if @nuxt/test-utils is upgraded, look to useNuxtImport for mocking like in chemicalSearch.spec.ts
const Mock$repositoriesRecentSearchGetRecentChemicalSearches =
    vi.spyOn(useNuxtApp().$repositories.recentSearch, 'getRecentChemicalSearches');
const Mock$repositoriesRecentSearchDeleteRecentChemicalSearch =
    vi.spyOn(useNuxtApp().$repositories.recentSearch, 'deleteRecentChemicalSearch');

let recentChemicalSearchesWrapper: VueWrapper<InstanceType<typeof RecentChemicalSearches>>;
let recentChemicalSearchesRendered: RenderResult;

describe('RecentChemicalSearches', () => {
  it('should be loading with linear progress on mount', async() => {
    // Arrange & Act
    recentChemicalSearchesWrapper = await mountSuspended(RecentChemicalSearches);

    // Assess
    expect(recentChemicalSearchesWrapper.get('.v-progress-linear__buffer').element).toBeDefined();
  });

  it('should display error message if problem fetching recent searches', async() => {
    // Arrange & Act
    Mock$repositoriesRecentSearchGetRecentChemicalSearches
      .mockImplementation(() => Promise.reject(new Error('Error: oh no')));
    recentChemicalSearchesRendered = await renderSuspended(RecentChemicalSearches);

    // Assess
    expect(recentChemicalSearchesRendered.getByText('Error loading recent searches.')).toBeVisible();
  });

  it('should have the expected fill, count, timestamp, and delete elements', async() => {
    // Arrange & Act
    Mock$repositoriesRecentSearchGetRecentChemicalSearches
      .mockImplementation(() => Promise.resolve(getRecentChemicalSearchesMock));
    recentChemicalSearchesRendered = await renderSuspended(RecentChemicalSearches);

    // Assess
    await waitFor(() => expect(recentChemicalSearchesRendered
      .getByText(getRecentChemicalSearchesMock.length + ' most recent chemical searches')).toBeVisible());
    const sampleExpectedRecentSearchMock = getRecentChemicalSearchesMock[7] as RecentSearch;
    expect(recentChemicalSearchesRendered.getByTestId(`text-area-search-fill-btn-${sampleExpectedRecentSearchMock.id}`)).toBeVisible();
    expect(recentChemicalSearchesRendered.getAllByText(`${sampleExpectedRecentSearchMock.searchText.split('\n').length}`).length).toBe(2);
    expect(recentChemicalSearchesRendered.getAllByText(`${useDateFormat(sampleExpectedRecentSearchMock.searchedOn, 'MMMM Do YYYY h:mm a', {locales: 'en-US'}).value}`).length).toBe(1);
    expect(recentChemicalSearchesRendered.getByTestId(`delete-recent-search-btn-${sampleExpectedRecentSearchMock.id}`)).toBeVisible();
  });

  it('should emit recent item(s) used to fill the search textarea', async() => {
    // Arrange
    Mock$repositoriesRecentSearchGetRecentChemicalSearches
      .mockImplementation(() => Promise.resolve(getRecentChemicalSearchesMock));
    recentChemicalSearchesWrapper = await mountSuspended(RecentChemicalSearches);
    const sampleExpectedRecentSearchMock = getRecentChemicalSearchesMock[7] as RecentSearch;

    // Act
    await recentChemicalSearchesWrapper.get(`[data-testid="text-area-search-fill-btn-${sampleExpectedRecentSearchMock.id}"`).trigger('click');

    // Assess
    expect(recentChemicalSearchesWrapper.emitted()).toEqual({fillTextArea: [
      [
        {
          ...sampleExpectedRecentSearchMock,
          searchedOn: useDateFormat(sampleExpectedRecentSearchMock.searchedOn, 'MMMM Do YYYY h:mm a', {locales: 'en-US'}).value,
        },
      ],
    ]});
  });

  it('should delete a recent item and get the search items again for the latest list', async() => {
    // Arrange
    Mock$repositoriesRecentSearchGetRecentChemicalSearches
      .mockImplementation(() => Promise.resolve(getRecentChemicalSearchesMock));
    recentChemicalSearchesRendered = await renderSuspended(RecentChemicalSearches);
    const sampleExpectedRecentSearchMock = getRecentChemicalSearchesMock[7] as RecentSearch;

    // Act
    await fireEvent.click(recentChemicalSearchesRendered.getByTestId(`delete-recent-search-btn-${sampleExpectedRecentSearchMock.id}`));

    // Assess
    await waitFor(() => expect(recentChemicalSearchesRendered.getByRole('progressbar')).toBeDefined());
    expect(Mock$repositoriesRecentSearchDeleteRecentChemicalSearch)
      .toHaveBeenCalledWith(sampleExpectedRecentSearchMock.id);
    await waitFor(() => expect(recentChemicalSearchesRendered.getByText('most recent chemical searches')).toBeVisible());
  });
});
