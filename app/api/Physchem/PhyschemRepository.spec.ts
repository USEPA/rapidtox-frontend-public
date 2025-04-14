import {
  describe, expect, it, type Mock, vi,
} from 'vitest';
import {mockNuxtImport} from '@nuxt/test-utils/runtime';
import Repository from '~/api/Repository';
import PhyschemRepository from '~/api/Physchem/PhyschemRepository';
import {BisphenolASelectedChemicalMock} from '~/test/mocks/SelectedChemicalMocks';
import {
  ApiEnvfatetransportSummaryDataResponseMock,
  ApiPhyschemSummaryDataResponseMock,
} from '~/test/mocks/Physchem/ApiResponseMocks';

// Mocks
vi.mock('../Repository');
const MockRepository = Repository as Mock;

mockNuxtImport('useRuntimeConfig', () => () => ({
  public: {
    APPLICATION_PHYSCHEM_BASE_API: process.env.APPLICATION_PHYSCHEM_BASE_API,
  },
}));

describe('PhyschemRepository', () => {
  it('should construct', () => {
    // Assign
    MockRepository.mockImplementation(() => ({
      default: vi.fn(),
    }));

    // Act
    const physchemRepository = new PhyschemRepository();

    // Assess
    expect(MockRepository.mock.calls).toEqual([[{baseURL: process.env.APPLICATION_PHYSCHEM_BASE_API}]]);
    expect(physchemRepository).toHaveProperty('getPhyschemSummaryData');
    expect(physchemRepository).toHaveProperty('getEnvfatetransportSummaryData');
  });

  describe('getPhyschemSummaryData', () => {
    it('should fetch results', async() => {
      // Assign
      const mockFetch = vi.fn().mockImplementation(() => Promise.resolve(ApiPhyschemSummaryDataResponseMock));
      MockRepository.mockImplementation(() => ({
        fetch: mockFetch,
      }));
      const physchemRepository = new PhyschemRepository();

      // Act
      const result = await physchemRepository.getPhyschemSummaryData([BisphenolASelectedChemicalMock.dtxsid]);

      // Assess
      expect(result).toEqual(ApiPhyschemSummaryDataResponseMock);
      expect(mockFetch).toHaveBeenCalledWith('/physiochemical/summary/with-details', {
        method: 'POST',
        body: [BisphenolASelectedChemicalMock.dtxsid],
      });
    });

    it('should throw an unknown error', async() => {
      // Assign
      const mockFetch = vi.fn().mockImplementation(() => Promise.reject(new Error('Error: oh no')));
      const mockShowErrorModal = vi.fn();
      MockRepository.mockImplementation(() => ({
        fetch: mockFetch,
        showErrorModal: mockShowErrorModal,
      }));
      const physchemRepository = new PhyschemRepository();

      // Act & Assess
      await expect(physchemRepository.getPhyschemSummaryData([BisphenolASelectedChemicalMock.dtxsid])).rejects.toThrow('Error: oh no');
      expect(mockShowErrorModal).toHaveBeenCalled();
    });
  });

  describe('getEnvfatetransportSummaryData', () => {
    it('should fetch results', async() => {
      // Assign
      const mockFetch = vi.fn().mockImplementation(() => Promise.resolve(ApiEnvfatetransportSummaryDataResponseMock));
      MockRepository.mockImplementation(() => ({
        fetch: mockFetch,
      }));
      const physchemRepository = new PhyschemRepository();

      // Act
      const result = await physchemRepository.getEnvfatetransportSummaryData([BisphenolASelectedChemicalMock.dtxsid]);

      // Assess
      expect(result).toEqual(ApiEnvfatetransportSummaryDataResponseMock);
      expect(mockFetch).toHaveBeenCalledWith('/envfatetransport/summary/with-details', {
        method: 'POST',
        body: [BisphenolASelectedChemicalMock.dtxsid],
      });
    });

    it('should throw an unknown error', async() => {
      // Assign
      const mockFetch = vi.fn().mockImplementation(() => Promise.reject(new Error('Error: oh no')));
      const mockShowErrorModal = vi.fn();
      MockRepository.mockImplementation(() => ({
        fetch: mockFetch,
        showErrorModal: mockShowErrorModal,
      }));
      const physchemRepository = new PhyschemRepository();

      // Act
      try {
        await physchemRepository.getEnvfatetransportSummaryData([BisphenolASelectedChemicalMock.dtxsid]);
      } catch (err) {
        // Assess
        expect(err).toEqual(new Error('Error: oh no'));
        expect(mockShowErrorModal).toHaveBeenCalled();
      }
    });
  });
});
