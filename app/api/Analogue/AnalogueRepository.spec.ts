import {
  describe, expect, it, type Mock, vi,
} from 'vitest';
import {mockNuxtImport} from '@nuxt/test-utils/runtime';
import AnalogueRepository from '~/api/Analogue/AnalogueRepository';
import Repository from '~/api/Repository';
import {BisphenolASelectedChemicalMock} from '~/test/mocks/SelectedChemicalMocks';
import {AnaloguesMock} from '~/test/mocks/Analogue/AnalogueMocks';
import {addBearerToRequest} from '~/api/utility/utility';

vi.mock('../Repository', () => ({
  default: vi.fn(),
}));

const MockRepository = Repository as Mock;

mockNuxtImport('useRuntimeConfig', () => () => ({
  public: {
    APPLICATION_REPORT_BASE_API: process.env.APPLICATION_REPORT_BASE_API,
    APPLICATION_CHEMICAL_MOL_FILE_API: process.env.APPLICATION_CHEMICAL_MOL_FILE_API,
  },
}));

describe('AnalogueRepository', () => {
  it('should construct', () => {
    const analogueRepository = new AnalogueRepository();
    expect(MockRepository.mock.calls).toEqual([
      [
        {
          baseURL: process.env.APPLICATION_REPORT_BASE_API,
          onRequest: addBearerToRequest,
        },
      ],
      [
        {
          baseURL: process.env.APPLICATION_CHEMICAL_MOL_FILE_API,
          onRequest: addBearerToRequest,
        },
      ],
    ]);
    expect(analogueRepository).toHaveProperty('getAnalogues');
    expect(analogueRepository).toHaveProperty('getReadAcross');
  });

  describe('getAnalogues', () => {
    const analogueSmiles = 'CC(C)(C1=CC=C(O)C=C1)C1=CC=C(O)C=C1';
    const analogueTanimoto = '0.6';
    const analogueWorkflow = 'hha';

    it('should fetch results', async() => {
      // Arrange
      const mockFetch = vi.fn().mockImplementation(() => Promise.resolve(AnaloguesMock));
      MockRepository.mockImplementation(() => ({
        fetch: mockFetch,
      }));
      const analogueRepository = new AnalogueRepository();

      // Act
      const result = await analogueRepository.getAnalogues(BisphenolASelectedChemicalMock.dtxsid,
        analogueSmiles,
        analogueTanimoto,
        analogueWorkflow);

      // Assess
      expect(result).toEqual(AnaloguesMock);
      expect(mockFetch).toHaveBeenCalledWith('/analogue/hha/by-similarity/DTXSID7020182/0.6/?smiles=CC(C)(C1%253DCC%253DC(O)C%253DC1)C1%253DCC%253DC(O)C%253DC1');
    });

    it('should throw an unknown error', async() => {
      // Arrange
      const mockFetch = vi.fn().mockImplementation(() => Promise.reject(new Error('Error: oh no')));
      const mockShowErrorModal = vi.fn();
      MockRepository.mockImplementation(() => ({
        fetch: mockFetch,
        showErrorModal: mockShowErrorModal,
      }));
      const analogueRepository = new AnalogueRepository();

      // Act & Assess
      await expect(analogueRepository.getAnalogues(BisphenolASelectedChemicalMock.dtxsid,
        analogueSmiles,
        analogueTanimoto,
        analogueWorkflow)).rejects.toThrow('Error: oh no');
      expect(mockShowErrorModal).toHaveBeenCalled();
    });
  });

  describe('getMolFile', () => {
    it('should fetch results', async() => {
      // Arrange
      const mockFetch = vi.fn().mockImplementation(() => Promise.resolve([]));
      MockRepository.mockImplementation(() => ({
        fetch: mockFetch,
      }));
      const analogueRepository = new AnalogueRepository();
      // Act
      const result = await analogueRepository.getMolFile(BisphenolASelectedChemicalMock.dtxsid);
      // Assess
      expect(result).toEqual([]);
      expect(mockFetch).toHaveBeenCalledWith(`/${BisphenolASelectedChemicalMock.dtxsid}`);
    });
    it('should throw an unknown error', async() => {
      // Arrange
      const mockFetch = vi.fn().mockImplementation(() => Promise.reject(new Error('Error: oh no')));
      const mockShowErrorModal = vi.fn();
      MockRepository.mockImplementation(() => ({
        fetch: mockFetch,
        showErrorModal: mockShowErrorModal,
      }));
      const analogueRepository = new AnalogueRepository();
      // Act
      const result = await analogueRepository.getMolFile(BisphenolASelectedChemicalMock.dtxsid);
      // Assess
      expect(result).toEqual(null);
      expect(mockShowErrorModal).toHaveBeenCalled();
    });
  });
});
