import {
  beforeEach, describe, expect, it,
} from 'vitest';
import {usePhyschemStore} from '~/stores/physchem/physchem';
import {SelectedPhyschemSessionDataMock} from '~/test/mocks/Physchem/PhyschemSessionDataMocks';
import type {PhyschemSessionData} from '~/stores/physchem/types';

let subject: ReturnType<typeof usePhyschemStore>;

describe('usePhyschemStore', () => {
  beforeEach(() => {
    // Arrange
    subject = usePhyschemStore();
  });

  it('should provide the expected default physchem values and functions', () => {
    expect(subject.hasVisited).toBe(false);
    expect(typeof subject.loadPhyschemSession).toEqual('function');
    expect(typeof subject.resetPhyschem).toEqual('function');
    expect(subject.chemicalsWorkedOnCount).toBe(0);
    expect(subject.chemicalsReviewedCount).toBe(0);
    expect(subject.totalChemicalsCount).toEqual(0);
    expect(subject.physchemDataSelected).toEqual({});
    expect(subject.physchemChemsWithNoData).toEqual([]);
  });

  it('should not load an empty physchem session', () => {
    // Act
    subject.loadPhyschemSession(null as unknown as PhyschemSessionData);

    // Assess
    expect(subject.hasVisited).toBe(false);
    expect(subject.chemicalsWorkedOnCount).toBe(0);
    expect(subject.chemicalsReviewedCount).toBe(0);
    expect(subject.totalChemicalsCount).toEqual(0);
    expect(subject.physchemDataSelected).toEqual({});
    expect(subject.physchemChemsWithNoData).toEqual([]);
  });

  it('should load a physchem session', () => {
    // Act
    subject.loadPhyschemSession(SelectedPhyschemSessionDataMock);

    // Assess
    expect(subject.hasVisited).toBe(true);
    expect(subject.chemicalsReviewedCount).toBe(1);
    expect(subject.totalChemicalsCount).toEqual(1);
    expect(subject.physchemDataSelected).toEqual({
      DTXSID7020182: [183051047, 183051048, 183051051, 183051053, 183051054, 183051055, 183051063, 183051065],
    });
    expect(subject.physchemChemsWithNoData).toEqual(['DTXSID7020182']);

    // Assess additional side effects after Act above
    expect(subject.chemicalsWorkedOnCount).toBe(1);
  });

  it('should reset a physchem session', () => {
    // Act
    subject.resetPhyschem();

    // Assess
    expect(subject.hasVisited).toBe(false);
    expect(subject.chemicalsReviewedCount).toBe(0);
    expect(subject.totalChemicalsCount).toEqual(0);
    expect(subject.physchemDataSelected).toEqual({});
    expect(subject.physchemChemsWithNoData).toEqual([]);

    // Assess additional side effects after Act above
    expect(subject.chemicalsWorkedOnCount).toBe(0);
  });
});
