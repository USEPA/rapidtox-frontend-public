import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
} from 'vitest';
import {screen} from '@testing-library/vue';
import {createTestingPinia} from '@pinia/testing';
import IdentifiersAndResultsStatusPanel from './IdentifiersAndResultsStatusPanel.vue';
import {MultiSelectedChemicalSearchSessionDataMock} from '~/test/mocks/ChemicalSearch/ChemicalSearchSessionDataMocks';
import {useChemicalSearchStore} from '~/stores/chemicalSearch/chemicalSearch';

const identifiersCountFixture = (identifiersCount: number) => `| ${identifiersCount} searched terms`;
const matchedCountFixture = (matchedCount: number) => `| ${matchedCount} chemicals matched`;

describe('Identifiers and Results Status Panel Unit Tests', () => {
  it('renders with correct identifiersCount and matchedCount text', async() => {
    await renderSuspended(IdentifiersAndResultsStatusPanel, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              chemicalSearch: MultiSelectedChemicalSearchSessionDataMock,
            },
          }),
        ],
      },
    });

    const store = useChemicalSearchStore();

    expect(await screen.findByText(identifiersCountFixture(store.identifiersCount))).toBeTruthy();
    expect(await screen.findByText(matchedCountFixture(store.matchedCount))).toBeTruthy();
  });
});
