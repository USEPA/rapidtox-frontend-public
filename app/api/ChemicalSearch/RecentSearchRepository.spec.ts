import {
  describe, expect, it, type Mock, vi,
} from 'vitest';
import {mockNuxtImport} from '@nuxt/test-utils/runtime';
import RecentSearchRepository from '~/api/ChemicalSearch/RecentSearchRepository';
import Repository from '~/api/Repository';
import {addBearerToRequest} from '~/api/utility/utility';
import {getRecentChemicalSearchesMock} from '~/test/mocks/ChemicalSearch/RecentSearchMocks';

// Mocks
vi.mock('../Repository');
const MockRepository = Repository as Mock;

mockNuxtImport('useRuntimeConfig', () => () => ({
  public: {
    APPLICATION_REPORT_BASE_API: process.env.APPLICATION_REPORT_BASE_API,
  },
}));

describe('RecentSearchRepository', () => {
  it('should construct', () => {
    // Assign
    MockRepository.mockImplementation(() => ({
      default: vi.fn(),
    }));

    // Act
    const recentSearchRepository = new RecentSearchRepository();

    // Assess
    expect(MockRepository.mock.calls).toEqual([
      [
        {
          baseURL: process.env.APPLICATION_REPORT_BASE_API, onRequest: addBearerToRequest,
        },
      ],
    ]);
    expect(recentSearchRepository).toHaveProperty('saveRecentChemicalSearch');
    expect(recentSearchRepository).toHaveProperty('getRecentChemicalSearches');
    expect(recentSearchRepository).toHaveProperty('deleteRecentChemicalSearch');
  });

  it('should fetch recent searches', async() => {
    // Assign
    const mockFetch = vi.fn().mockImplementation(() => Promise.resolve(getRecentChemicalSearchesMock));
    MockRepository.mockImplementation(() => ({
      fetch: mockFetch,
    }));
    const recentSearchRepository = new RecentSearchRepository();

    // Act
    const result = await recentSearchRepository.getRecentChemicalSearches();

    // Assess
    expect(result).toEqual(getRecentChemicalSearchesMock);
    expect(mockFetch).toHaveBeenCalledWith('/recent-search', {});
  });

  describe('deleteRecentChemicalSearch', () => {
    it('should show an error message about failing to delete', async() => {
      // Assign
      const mockFetch = vi.fn().mockImplementation(() => Promise.reject(new Error('Error: oh no')));
      const mockShowErrorModal = vi.fn();
      MockRepository.mockImplementation(() => ({
        fetch: mockFetch,
        showErrorModal: mockShowErrorModal,
      }));
      const recentSearchRepository = new RecentSearchRepository();

      // Act
      const result = await recentSearchRepository.deleteRecentChemicalSearch(1234);

      // Assess
      expect(result).toEqual(null);
      expect(mockShowErrorModal).toHaveBeenCalledWith({errorMsg: 'Sorry, your request to delete this recent search failed.', redirectHome: false});
    });
  });
});
