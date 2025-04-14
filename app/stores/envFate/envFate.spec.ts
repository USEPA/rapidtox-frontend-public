import {
  describe, expect, it, beforeEach,
} from 'vitest';
import type {EnvFateSessionData} from '~/stores/envFate/types';
import {useEnvFateStore} from '~/stores/envFate/envFate';
import {SelectedEnvFateSessionDataMock} from '~/test/mocks/envFate/EnvFateSessionDataMock';

let subject: ReturnType<typeof useEnvFateStore>;

describe('useEnvFateStore', () => {
  beforeEach(() => {
    // Arange
    subject = useEnvFateStore();
  });

  it('should provide the expected default envFate values and functions', () => {
    expect(subject.hasVisited).toBe(false);
    expect(typeof subject.loadEnvFateSession).toEqual('function');
    expect(typeof subject.resetEnvFate).toEqual('function');
    expect(subject.totalChemicalsCount).toEqual(0);
    expect(subject.chemicalsReviewedCount).toBe(0);
    expect(subject.envFateDataSelected).toEqual({});
    expect(subject.envFateChemsWithNoData).toEqual([]);
    expect(subject.chemicalsWorkedOnCount).toBe(0);
  });

  it('should not load an empty envFate session', () => {
    // Act
    subject.loadEnvFateSession(null as unknown as EnvFateSessionData);

    // Assess
    expect(subject.hasVisited).toBe(false);
    expect(subject.totalChemicalsCount).toEqual(0);
    expect(subject.chemicalsReviewedCount).toBe(0);
    expect(subject.envFateDataSelected).toEqual({});
    expect(subject.envFateChemsWithNoData).toEqual([]);
    expect(subject.chemicalsWorkedOnCount).toBe(0);
  });

  it('should load a envFate session', () => {
    // Act
    subject.loadEnvFateSession(SelectedEnvFateSessionDataMock);

    // Assess
    expect(subject.hasVisited).toBe(true);
    expect(subject.totalChemicalsCount).toEqual(1);
    expect(subject.chemicalsReviewedCount).toBe(1);
    expect(subject.envFateDataSelected).toEqual({DTXSID7020182: [183051046, 183051060]});
    expect(subject.envFateChemsWithNoData).toEqual(['DTXSID7020182']);

    // Assess additional side effects after Act above
    expect(subject.chemicalsWorkedOnCount).toBe(1);
  });

  it('should reset a envFate session', () => {
    // Act
    subject.resetEnvFate();

    // Assess
    expect(subject.hasVisited).toBe(false);
    expect(subject.totalChemicalsCount).toEqual(0);
    expect(subject.chemicalsReviewedCount).toBe(0);
    expect(subject.envFateDataSelected).toEqual({});
    expect(subject.envFateChemsWithNoData).toEqual([]);

    // Assess additional side effects after Act above
    expect(subject.chemicalsWorkedOnCount).toBe(0);
  });
});
