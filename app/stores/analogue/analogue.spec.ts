import {
  beforeEach, describe, expect, it, vi,
} from 'vitest';
import {mockNuxtImport} from '@nuxt/test-utils/runtime';
import {useAnalogueStore} from '~/stores/analogue/analogue';
import {BisphenolASelectedChemicalMock} from '~/test/mocks/SelectedChemicalMocks';
import {
  SelectedAnalogueSessionDataMock,
  BisphenolAUpdatedAnalogueChemicalStepInfoMock,
} from '~/test/mocks/Analogue/AnalogueSessionDataMocks';
import type {AnalogueSessionData, SelectedAnalogue} from '~/stores/analogue/types';

// Mocks
vi.mock('../chemicalSearch/chemicalSearch', () => ({
  useChemicalSearchStore: () => ({
    selectedChemicals: [BisphenolASelectedChemicalMock],
  }),
}));

const Mock$repositoriesAnalogueGetMolFile = vi.fn();
mockNuxtImport('useNuxtApp', () => () => ({
  $repositories: {
    analogue: {
      getMolFile: Mock$repositoriesAnalogueGetMolFile,
    },
  },
}));

let subject: ReturnType<typeof useAnalogueStore>;

describe('useAnalogueStore', () => {
  beforeEach(() => {
    // Arrange
    subject = useAnalogueStore();
  });

  it('should provide the expected default analogueStore values and functions', () => {
    expect(subject.showAnaloguePodModal).toBe(false);
    expect(subject.currentAnalogueSelectedChemical).toEqual({});
    expect(subject.ketcher).toBe(null);
    expect(subject.showAnalogueModal).toBe(false);
    expect(typeof subject.displayAnalogueModal).toBe('function');
    expect(subject.currentAnaloguePodData).toEqual({
      title: '',
      dtxsid: '',
      podData: [],
    });
    expect(typeof subject.closeAnalogueModal).toBe('function');
    expect(subject.analogueChemicalsStepInfo).toEqual([]);
    expect(subject.analogueToUpdateIdx).toBe(-1);
    expect(typeof subject.setCurrentUnmatchedDtxsid).toBe('function');
    expect(typeof subject.updateAnalogueChemicalsStepInfo).toBe('function');
    expect(typeof subject.removeSelectedAnalogue).toBe('function');
    expect(typeof subject.setupAnalogueChemicalsStepInfo).toBe('function');
    expect(typeof subject.checkAndUpdateAnalogueChemicalsStepInfo).toBe('function');
    expect(subject.errorMolFile).toBe(false);
    expect(subject.errorMessage).toBe('');
    expect(typeof subject.clearMolFileError).toBe('function');
    expect(subject.hasVisited).toBe(false);
    expect(typeof subject.loadAnalogueSession).toBe('function');
    expect(typeof subject.setCurrentSmileString).toBe('function');
    expect(typeof subject.loadKetcherImage).toBe('function');
    expect(typeof subject.setKetcher).toBe('function');
    expect(typeof subject.resetAnalogue).toBe('function');
  });

  describe('loadAnalogueSession', () => {
    it('should load an Analogue session and not an empty one', () => {
      // Act
      subject.loadAnalogueSession(SelectedAnalogueSessionDataMock);
      // Loading null should do nothing and keep the values loaded above
      subject.loadAnalogueSession(null as unknown as AnalogueSessionData);

      // Assert
      expect(subject.analogueChemicalsStepInfo).toEqual(SelectedAnalogueSessionDataMock.analogueChemicalsStepInfo);
      expect(subject.currentAnaloguePodData).toEqual({
        title: '',
        dtxsid: '',
        podData: [],
      });
      expect(subject.currentAnalogueSelectedChemical)
        .toEqual(SelectedAnalogueSessionDataMock.currentAnalogueSelectedChemical);
      expect(subject.errorMessage).toBe('');
      expect(subject.errorMolFile).toBe(false);
      expect(subject.ketcher).toBe(null);
      expect(subject.showAnalogueModal).toBe(true);
      // eslint-disable-next-line no-undefined
      expect(subject.showAnaloguePodModal).toBe(undefined);
      expect(subject.hasVisited).toBe(true);

      // Assess additional side effects after Act above
      expect(subject.analogueToUpdateIdx).toBe(0);
    });
  });

  describe('resetAnalogue', () => {
    it('should reset an analogue session', () => {
      // Act
      subject.loadAnalogueSession(SelectedAnalogueSessionDataMock);
      subject.resetAnalogue();

      // Assess
      expect(subject.showAnaloguePodModal).toBe(false);
      expect(subject.currentAnalogueSelectedChemical).toEqual({});
      expect(subject.ketcher).toBe(null);
      expect(subject.showAnalogueModal).toBe(false);
      expect(subject.currentAnaloguePodData).toEqual({
        title: '',
        dtxsid: '',
        podData: [],
      });
      expect(subject.analogueChemicalsStepInfo).toEqual([]);
      expect(subject.analogueToUpdateIdx).toBe(-1);
      expect(subject.errorMolFile).toBe(false);
      expect(subject.errorMessage).toBe('');
      expect(subject.hasVisited).toBe(false);
    });
  });

  describe('displayAnalogueModal', () => {
    it('should set values for displaying the Analogue modal', () => {
      // Act
      subject.displayAnalogueModal({
        ...BisphenolASelectedChemicalMock,
        rowIndex: 0,
        colId: '0',
      });

      // Assert
      expect(subject.currentAnalogueSelectedChemical).toEqual({
        ...BisphenolASelectedChemicalMock,
        rowIndex: 0,
        colId: '0',
      });
      expect(subject.showAnalogueModal).toBe(true);
    });
  });

  describe('closeAnalogueModal', () => {
    it('should no longer show the Analogue modal', () => {
      // Act
      subject.closeAnalogueModal();

      // Assert
      expect(subject.showAnalogueModal).toBe(false);
    });
  });

  describe('setCurrentUnmatchedDtxsid', () => {
    it('should set the currentUnmatchedDtxsid in step info', () => {
      // Act
      subject.loadAnalogueSession(SelectedAnalogueSessionDataMock);
      subject.setCurrentUnmatchedDtxsid(BisphenolASelectedChemicalMock.dtxsid);

      // Assert
      expect(subject.analogueChemicalsStepInfo[0]?.unmatchedDtxsid)
        .toBe(BisphenolASelectedChemicalMock.dtxsid);
    });
  });

  describe('updateAnalogueChemicalsStepInfo', () => {
    it('should update the analogueChemicalStepInfo', () => {
      // Act
      subject.loadAnalogueSession(SelectedAnalogueSessionDataMock);
      subject.updateAnalogueChemicalsStepInfo({
        finishedStepOne: true,
        nextStep: 1,
        selectedAnalogues: BisphenolAUpdatedAnalogueChemicalStepInfoMock.selectedAnalogues,
      });

      // Assert
      expect(subject.analogueChemicalsStepInfo[0]).toEqual(BisphenolAUpdatedAnalogueChemicalStepInfoMock);
    });
  });

  describe('removeSelectedAnalogue', () => {
    it('should remove a selected Analogue', () => {
      // Act
      subject.loadAnalogueSession(SelectedAnalogueSessionDataMock);
      subject.updateAnalogueChemicalsStepInfo({
        finishedStepOne: true,
        nextStep: 1,
        selectedAnalogues: BisphenolAUpdatedAnalogueChemicalStepInfoMock.selectedAnalogues,
      });
      subject.removeSelectedAnalogue(BisphenolAUpdatedAnalogueChemicalStepInfoMock.selectedAnalogues[0] as SelectedAnalogue);

      // Assert
      expect(subject.analogueChemicalsStepInfo[0]?.selectedAnalogues
        .find((selectedAnalogue: SelectedAnalogue) => selectedAnalogue.dtxsid ===
          BisphenolAUpdatedAnalogueChemicalStepInfoMock.selectedAnalogues[0]?.dtxsid))
        .toBeUndefined();
    });
  });

  describe('setupAnalogueChemicalsStepInfo', () => {
    it('should call the check and update method with existing analogueChemicalStepInfo', () => {
      // Act
      subject.loadAnalogueSession(SelectedAnalogueSessionDataMock);
      subject.setupAnalogueChemicalsStepInfo();

      // Assert
      expect(subject.analogueChemicalsStepInfo[0]).toEqual({
        analogueChemId: null,
        currentStep: 0,
        searchWord: 'DTXSID7020182',
        preferredName: 'Bisphenol A',
        finishedStepOne: false,
        dtxsid: 'DTXSID7020182',
        smileString: 'CC(C)(C1=CC=C(O)C=C1)C1=CC=C(O)C=C1',
        finishedStepTwo: false,
        finishedAnalogueSelection: false,
        selectedAnalogues: [],
        selectedReadAcross: [],
        selectedPODS: [],
        PODJustifications: [],
      });
    });

    it('should call the init method without existing analogueChemicalStepInfo', () => {
      // Act
      subject.resetAnalogue();
      subject.setupAnalogueChemicalsStepInfo();

      // Assert
      expect(subject.analogueChemicalsStepInfo[0]).toEqual({
        analogueChemId: 0,
        currentStep: 0,
        searchWord: 'DTXSID7020182',
        preferredName: 'Bisphenol A',
        finishedStepOne: false,
        dtxsid: 'DTXSID7020182',
        smileString: 'CC(C)(C1=CC=C(O)C=C1)C1=CC=C(O)C=C1',
        finishedStepTwo: false,
        finishedAnalogueSelection: false,
        selectedAnalogues: [],
        selectedReadAcross: [],
        selectedPODS: [],
        PODJustifications: [],
      });
    });
  });

  describe('checkAndUpdateAnalogueChemicalsStepInfo', () => {
    it('should check for values and update the AnalogueChemicalStepInfo for selectedChemicals', () => {
      // Act
      subject.loadAnalogueSession(SelectedAnalogueSessionDataMock);
      subject.checkAndUpdateAnalogueChemicalsStepInfo([BisphenolASelectedChemicalMock]);

      // Assert
      expect(subject.analogueChemicalsStepInfo[0]).toEqual({
        analogueChemId: null,
        currentStep: 0,
        searchWord: 'DTXSID7020182',
        preferredName: 'Bisphenol A',
        finishedStepOne: false,
        dtxsid: 'DTXSID7020182',
        smileString: 'CC(C)(C1=CC=C(O)C=C1)C1=CC=C(O)C=C1',
        finishedStepTwo: false,
        finishedAnalogueSelection: false,
        selectedAnalogues: [],
        selectedReadAcross: [],
        selectedPODS: [],
        PODJustifications: [],
      });
    });
  });

  describe('clearMolFileError', () => {
    it('should remove errors from session', () => {
      // Act
      subject.loadAnalogueSession({
        ...SelectedAnalogueSessionDataMock, errorMolFile: true, errorMessage: 'test error',
      });
      subject.clearMolFileError();

      // Assert
      expect(subject.errorMolFile).toBe(false);
      expect(subject.errorMessage).toBe('');
    });
  });
});
