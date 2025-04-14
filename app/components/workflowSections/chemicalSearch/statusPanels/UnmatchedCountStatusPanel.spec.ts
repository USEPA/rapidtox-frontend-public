import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
} from 'vitest';
import {screen} from '@testing-library/vue';
import {createTestingPinia} from '@pinia/testing';
import UnmatchedCountStatusPanel from './UnmatchedCountStatusPanel.vue';
import {
  MultiSelectedChemicalSearchSessionDataMock, SingleSelectedChemicalSearchSessionDataMock,
} from '~/test/mocks/ChemicalSearch/ChemicalSearchSessionDataMocks';
import {AtrazineSelectedChemicalMock, BisphenolASelectedChemicalMock} from '~/test/mocks/SelectedChemicalMocks';

const countIsUnmatchedFixture = (count: number) => `(${count} is unmatched)`;

const countAreUnmatchedFixture = (count: number) => `(${count} are unmatched)`;

describe('Unmatched Count Status Panel Unit Tests', () => {
  it('does not render message when unmatchedChemicalsCount is 0', async() => {
    await renderSuspended(UnmatchedCountStatusPanel, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              chemicalSearch: SingleSelectedChemicalSearchSessionDataMock,
            },
          }),
        ],
      },
    });

    const store = useChemicalSearchStore();
    expect(screen.queryByText(store.unmatchedChemicalsCount)).toBeNull();
  });

  it('renders with correct message for unmatchedChemicalsCount of 1', async() => {
    let altMultiSelectedChemicalSearchSessionDataMock: ChemicalSearchSessionData = {
      ...MultiSelectedChemicalSearchSessionDataMock,
      selectedChemicals: [
        {...AtrazineSelectedChemicalMock,
          searchGroup: 'NOT FOUND'},
      ],
    };
    await renderSuspended(UnmatchedCountStatusPanel, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              chemicalSearch: altMultiSelectedChemicalSearchSessionDataMock,
            },
          }),
        ],
      },
    });

    const store = useChemicalSearchStore();
    expect(await screen.findByText(countIsUnmatchedFixture(store.unmatchedChemicalsCount))).toBeTruthy();
  });

  it('renders with correct message for unmatchedChemicalsCount of 2', async() => {
    let altMultiSelectedChemicalSearchSessionDataMock: ChemicalSearchSessionData = {
      ...MultiSelectedChemicalSearchSessionDataMock,
      selectedChemicals: [
        {...AtrazineSelectedChemicalMock,
          searchGroup: 'NOT FOUND'},
        {...BisphenolASelectedChemicalMock,
          searchGroup: 'NOT FOUND'},
      ],
    };
    await renderSuspended(UnmatchedCountStatusPanel, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              chemicalSearch: altMultiSelectedChemicalSearchSessionDataMock,
            },
          }),
        ],
      },
    });

    const store = useChemicalSearchStore();
    expect(await screen.findByText(countAreUnmatchedFixture(store.unmatchedChemicalsCount))).toBeTruthy();
  });
});
