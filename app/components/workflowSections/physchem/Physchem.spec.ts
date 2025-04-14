import {mountSuspended, renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
  vi,
} from 'vitest';
import {
  fireEvent, screen,
  waitFor,
} from '@testing-library/vue';
import {createTestingPinia} from '@pinia/testing';
import Physchem from './Physchem.vue';
import {ApiPhyschemSummaryDataResponseMock} from '~/test/mocks/Physchem/ApiResponseMocks';
import {MultiSelectedChemicalSearchSessionDataMock} from '~/test/mocks/ChemicalSearch/ChemicalSearchSessionDataMocks';
import {MagnesiumAluminumSilicateSelectedChemicalMock} from '~/test/mocks/SelectedChemicalMocks';

const Mock$repositoriesPhyschemGetPhyschemSummaryData =
    vi.spyOn(useNuxtApp().$repositories.physchem, 'getPhyschemSummaryData');

// Unit Tests for links are located in LinkRenderer.spec.ts
describe('Physchem Unit Tests', () => {
  const headerFixture = 'Physchem Data Selection';
  const spinnerAltTextFixture = 'spinner';
  const noDataDialogFixture = 'There is no Physchem data for your selected chemicals. There may be data for these chemicals within other sections. Please continue to the next section.';
  const chemicalsNotFoundFixture = (chemNumber: number) => `${chemNumber} chemicals - No Physchem data`;

  it('renders with Section Header and loading spinner', async() => {
    await renderSuspended(Physchem);

    expect(Mock$repositoriesPhyschemGetPhyschemSummaryData).toHaveBeenCalledTimes(1);
    expect(await screen.findByAltText(spinnerAltTextFixture)).toBeTruthy();
    expect(await screen.findByText(headerFixture)).toBeTruthy();
    expect(screen.queryByText(noDataDialogFixture)).toBeNull();
  });

  it('mounts with NoDataDialog when given empty PhyschemSummaryData', async() => {
    Mock$repositoriesPhyschemGetPhyschemSummaryData
      .mockImplementation(() => Promise.resolve([]));

    const wrapper = await mountSuspended(Physchem, {
      shallow: true,
    });

    expect(wrapper.findComponent('no-data-found-dialog-stub')).toBeTruthy();
  });

  it('sets showNoDataDialog to false on click', async() => {
    Mock$repositoriesPhyschemGetPhyschemSummaryData
      .mockImplementation(() => Promise.resolve([]));

    const component = await renderSuspended(Physchem, {
      global: {
        stubs: {
          PhyschemGrid: true,
        },
      },
    });

    expect(component.setupState.showNoDataDialog.value).toBe(true);
    expect(await screen.findByText(noDataDialogFixture)).toBeVisible();

    const closeButton = await screen.findByText('Close');
    await fireEvent.click(closeButton);

    expect(component.setupState.showNoDataDialog.value).toBe(false);
    await waitFor(() => {
      expect(screen.getByText(noDataDialogFixture)).not.toBeVisible();
    });
  });

  it('mounts with Error Loading Grid Alert when given an Error', async() => {
    Mock$repositoriesPhyschemGetPhyschemSummaryData
      .mockImplementation(() => { throw new Error(); });

    const wrapper = await mountSuspended(Physchem, {
      shallow: true,
    });

    expect(wrapper.findComponent('error-loading-grid-alert-stub')).toBeTruthy();
  });

  it('renders Physchem Grid with rowData', async() => {
    Mock$repositoriesPhyschemGetPhyschemSummaryData
      .mockImplementation(() => Promise.resolve(ApiPhyschemSummaryDataResponseMock));

    const component = await renderSuspended(Physchem, {
      global: {
        stubs: {
          PhyschemGrid: true,
        },
      },
    });

    expect(screen.queryByAltText(spinnerAltTextFixture)).toBeNull();

    expect(await screen.findByTestId('physchem-grid-test-id')).toBeTruthy();
    expect(component.setupState.rowData.value).toEqual(ApiPhyschemSummaryDataResponseMock);
  });

  it('renders with message for matchedChemicalsWithoutPhyschemData', async() => {
    Mock$repositoriesPhyschemGetPhyschemSummaryData
      .mockImplementation(() => Promise.resolve(ApiPhyschemSummaryDataResponseMock));

    await renderSuspended(Physchem, {
      global: {
        stubs: {
          PhyschemGrid: true,
        },
        plugins: [
          createTestingPinia({
            initialState: {
              chemicalSearch: {
                // Chemical Search Session Data mock with two selectedChemicals without Physchem Data
                ...MultiSelectedChemicalSearchSessionDataMock,
                selectedChemicals: [
                  ...MultiSelectedChemicalSearchSessionDataMock.selectedChemicals,
                  MagnesiumAluminumSilicateSelectedChemicalMock,
                ],
              },
            },
          }),
        ],
      },
    });

    expect(await screen.findByText(chemicalsNotFoundFixture(2))).toBeTruthy();
  });
});
