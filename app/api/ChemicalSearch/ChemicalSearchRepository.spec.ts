import {
  describe, expect, it, type Mock, vi,
} from 'vitest';
import {mockNuxtImport} from '@nuxt/test-utils/runtime';
import ChemicalSearchRepository from '~/api/ChemicalSearch/ChemicalSearchRepository';
import Repository from '~/api/Repository';
import {ApiStartsWithResponseMock} from '~/test/mocks/ChemicalSearch/ApiResponseMocks';
import {
  StartsWithMock, StartsWithMockWithSuggestions, StartsWithMockWithoutSuggestions,
} from '~/test/mocks/ChemicalSearch/ChemicalSearchMocks';

// Mocks
vi.mock('../Repository');
const MockRepository = Repository as Mock;

mockNuxtImport('useRuntimeConfig', () => () => ({
  public: {
    APPLICATION_CHEMICAL_BASE_API: process.env.APPLICATION_CHEMICAL_BASE_API,
  },
}));

describe('ChemicalSearchRepository', () => {
  it('should construct', () => {
    // Assign
    MockRepository.mockImplementation(() => ({
      default: vi.fn(),
    }));

    // Act
    const chemicalSearchRepository = new ChemicalSearchRepository();

    // Assess
    expect(MockRepository.mock.calls).toEqual([[{baseURL: process.env.APPLICATION_CHEMICAL_BASE_API}]]);
    expect(chemicalSearchRepository).toHaveProperty('startsWith');
    expect(chemicalSearchRepository).toHaveProperty('chemicalMultiSearch');
  });

  describe('startsWith search', () => {
    it('should fetch results', async() => {
      // Assign
      const mockFetch = vi.fn().mockImplementation(() => Promise.resolve(ApiStartsWithResponseMock[0]));
      MockRepository.mockImplementation(() => ({
        fetch: mockFetch,
      }));
      const chemicalSearchRepository = new ChemicalSearchRepository();

      // Act
      const result = await chemicalSearchRepository.startsWith('glys');

      // Assess
      expect(result).toEqual(StartsWithMock);
      expect(mockFetch).toHaveBeenCalledWith('/search/start-with2/glys?top=50');
    });

    it('should fetch empty results with suggestions', async() => {
      // Assign
      const mockFetch = vi.fn().mockImplementation(() => Promise.resolve(ApiStartsWithResponseMock[1]));
      MockRepository.mockImplementation(() => ({
        fetch: mockFetch,
      }));
      const chemicalSearchRepository = new ChemicalSearchRepository();

      // Act
      const result = await chemicalSearchRepository.startsWith('ciaphenol');

      // Assess
      expect(result).toEqual(StartsWithMockWithSuggestions);
      expect(mockFetch).toHaveBeenCalledWith('/search/start-with2/ciaphenol?top=50');
    });

    it('should fetch empty results without suggestions', async() => {
      // Assign
      const mockFetch = vi.fn().mockImplementation(() => Promise.resolve(ApiStartsWithResponseMock[2]));
      MockRepository.mockImplementation(() => ({
        fetch: mockFetch,
      }));
      const chemicalSearchRepository = new ChemicalSearchRepository();

      // Act
      const result = await chemicalSearchRepository.startsWith('asdfglk');

      // Assess
      expect(result).toEqual(StartsWithMockWithoutSuggestions);
      expect(mockFetch).toHaveBeenCalledWith('/search/start-with2/asdfglk?top=50');
    });

    it('should throw an unknown error', async() => {
      // Assign
      const mockFetch = vi.fn().mockImplementation(() => Promise.reject(new Error('Error: oh no')));
      const mockShowErrorModal = vi.fn();
      MockRepository.mockImplementation(() => ({
        fetch: mockFetch,
        showErrorModal: mockShowErrorModal,
      }));
      const chemicalSearchRepository = new ChemicalSearchRepository();

      // Act
      const result = await chemicalSearchRepository.startsWith('glys');

      // Assess
      expect(result).toEqual(null);
      expect(mockShowErrorModal).toHaveBeenCalled();
    });
  });
});
