import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
} from 'vitest';
import type {ICellRendererParams} from 'ag-grid-community';
import {screen} from '@testing-library/vue';
import PropertyRenderer from './PropertyRenderer.vue';
import type {PhyschemSummary} from '~/api/Physchem/types';
import {bisphenolAPhyschemSummaryMock} from '~/test/mocks/Physchem/PhyschemSummaryMocks';
import physchemPropertyTooltips from '~/assets/fixtures/physchemPropertyTooltips.json';

describe('Property Renderer Unit Tests', () => {
  it('renders with property and unit', async() => {
    // @ts-expect-error
    const paramsMock: ICellRendererParams<PhyschemSummary> = {
      value: 'test',
      data: bisphenolAPhyschemSummaryMock,
    };

    const text = 'Boiling Point (°C)';
    const tooltip = physchemPropertyTooltips['Boiling Point'];

    await renderSuspended(PropertyRenderer, {
      props: {
        params: paramsMock,
      },
    });

    expect(await screen.findByText(text)).toBeTruthy();
    expect(await screen.findByLabelText(tooltip)).toBeTruthy();
    expect(await screen.findByText(tooltip)).toBeTruthy();
  });

  it('renders without property and unit', async() => {
    // @ts-expect-error
    const paramsMock: ICellRendererParams<PhyschemSummary> = {
      value: 'test',
      data: {
        ...bisphenolAPhyschemSummaryMock,
        property: '',
        unit: null,
      },
    };

    const text = 'Boiling Point (°C)';
    const tooltip = physchemPropertyTooltips['Boiling Point'];

    await renderSuspended(PropertyRenderer, {
      props: {
        params: paramsMock,
      },
    });

    expect(screen.queryByText(text)).toBeNull();
    expect(screen.queryByLabelText(tooltip)).toBeNull();
    expect(screen.queryByText(tooltip)).toBeNull();
  });

  it('renders with property not in physchemPropertyTooltips', async() => {
    // @ts-expect-error
    const paramsMock: ICellRendererParams<PhyschemSummary> = {
      value: 'test',
      data: {
        ...bisphenolAPhyschemSummaryMock,
        property: 'propertyMock',
        unit: 'unitMock',
      },
    };

    const text = 'propertyMock (unitMock)';
    const tooltip = 'propertyMock';

    await renderSuspended(PropertyRenderer, {
      props: {
        params: paramsMock,
      },
    });

    expect(await screen.findByText(text)).toBeTruthy();
    expect(await screen.findByLabelText(tooltip)).toBeTruthy();
    expect(await screen.findByText(tooltip)).toBeTruthy();
  });

  // TODO: alt test cases may need to be removed/refactored when PropertyRenderer.vue is refactored
  it('alt renders with Atmos. Hydroxylation Rate', async() => {
    // @ts-expect-error
    const paramsMock: ICellRendererParams<PhyschemSummary> = {
      value: 'test',
      data: {
        ...bisphenolAPhyschemSummaryMock,
        property: 'Atmos. Hydroxylation Rate',
        unit: 'LogOH',
      },
    };

    const text = 'Atmos. Hydroxylation Rate (LogOH)';
    const tooltip = physchemPropertyTooltips['Atmospheric Hydroxylation Rate'];

    await renderSuspended(PropertyRenderer, {
      props: {
        params: paramsMock,
      },
    });

    expect(await screen.findByText(text)).toBeTruthy();
    expect(await screen.findByLabelText(tooltip)).toBeTruthy();
    expect(await screen.findByText(tooltip)).toBeTruthy();
  });

  it('alt renders with Biodeg. Half-Life', async() => {
    // @ts-expect-error
    const paramsMock: ICellRendererParams<PhyschemSummary> = {
      value: 'test',
      data: {
        ...bisphenolAPhyschemSummaryMock,
        property: 'Biodeg. Half-Life',
        unit: 'days',
      },
    };

    const text = 'Biodeg. Half-Life (days)';
    const tooltip = physchemPropertyTooltips['Biodegradation Half-Life'];

    await renderSuspended(PropertyRenderer, {
      props: {
        params: paramsMock,
      },
    });

    expect(await screen.findByText(text)).toBeTruthy();
    expect(await screen.findByLabelText(tooltip)).toBeTruthy();
    expect(await screen.findByText(tooltip)).toBeTruthy();
  });

  it('alt renders with Fish Biotrans. Half-Life (Km)', async() => {
    // @ts-expect-error
    const paramsMock: ICellRendererParams<PhyschemSummary> = {
      value: 'test',
      data: {
        ...bisphenolAPhyschemSummaryMock,
        property: 'Fish Biotrans. Half-Life (Km)',
        unit: 'days',
      },
    };

    const text = 'Fish Biotrans. Half-Life (Km) (days)';
    const tooltip = physchemPropertyTooltips['Fish Biotransformation Half-Life (Km)'];

    await renderSuspended(PropertyRenderer, {
      props: {
        params: paramsMock,
      },
    });

    expect(await screen.findByText(text)).toBeTruthy();
    expect(await screen.findByLabelText(tooltip)).toBeTruthy();
    expect(await screen.findByText(tooltip)).toBeTruthy();
  });

  it('alt renders with Soil Adsorp. Coeff. (Koc)', async() => {
    // @ts-expect-error
    const paramsMock: ICellRendererParams<PhyschemSummary> = {
      value: 'test',
      data: {
        ...bisphenolAPhyschemSummaryMock,
        property: 'Soil Adsorp. Coeff. (Koc)',
        unit: 'L/kg',
      },
    };

    const text = 'Soil Adsorp. Coeff. (Koc) (L/kg)';
    const tooltip = physchemPropertyTooltips['Soil Adsorption Coefficient (Koc)'];

    await renderSuspended(PropertyRenderer, {
      props: {
        params: paramsMock,
      },
    });

    expect(await screen.findByText(text)).toBeTruthy();
    expect(await screen.findByLabelText(tooltip)).toBeTruthy();
    expect(await screen.findByText(tooltip)).toBeTruthy();
  });
});
