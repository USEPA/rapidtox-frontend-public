import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
} from 'vitest';
import type {ICellRendererParams} from 'ag-grid-community';
import {screen} from '@testing-library/vue';
import RangeRenderer from './RangeRenderer.vue';
import type {PhyschemSummary} from '~/api/Physchem/types';
import {bisphenolAPhyschemSummaryMock} from '~/test/mocks/Physchem/PhyschemSummaryMocks';

describe('Range Renderer Unit Tests', () => {
  type paramsMockType = ICellRendererParams<PhyschemSummary> & {
    min: keyof PhyschemSummary;
    max: keyof PhyschemSummary;
  };

  it('renders range', async() => {
    const paramsMock: paramsMockType = {
      // @ts-expect-error
      node: {
        group: false,
      },
      data: bisphenolAPhyschemSummaryMock,
      min: 'predictedMinimum',
      max: 'predictedMaximum',
    };

    await renderSuspended(RangeRenderer, {
      props: {
        params: paramsMock,
      },
    });

    expect(screen.queryByTestId('range-span-activator')).toBeTruthy();
    expect(await screen.findAllByText('343 to 401')).toBeTruthy();
  });

  it('does not render if params.node.group is truthy', async() => {
    const paramsMock: paramsMockType = {
      // @ts-expect-error
      node: {
        group: true,
      },
    };

    await renderSuspended(RangeRenderer, {
      props: {
        params: paramsMock,
      },
    });

    expect(screen.queryByTestId('range-span-activator')).toBeNull();
  });

  it('does not render if min and max are null', async() => {
    const paramsMock: paramsMockType = {
      // @ts-expect-error
      node: {
        group: false,
      },
      data: {
        ...bisphenolAPhyschemSummaryMock,
        predictedMinimum: null,
        predictedMaximum: null,
      },
      min: 'predictedMinimum',
      max: 'predictedMaximum',
    };

    await renderSuspended(RangeRenderer, {
      props: {
        params: paramsMock,
      },
    });

    expect(screen.queryByTestId('range-span-activator')).toBeNull();
  });

  it('alt renders max when min is null', async() => {
    const paramsMock: paramsMockType = {
      // @ts-expect-error
      node: {
        group: false,
      },
      data: {
        ...bisphenolAPhyschemSummaryMock,
        predictedMinimum: null,
      },
      min: 'predictedMinimum',
      max: 'predictedMaximum',
    };

    await renderSuspended(RangeRenderer, {
      props: {
        params: paramsMock,
      },
    });

    expect(screen.queryByTestId('range-span-activator')).toBeTruthy();
    expect(await screen.findAllByText('401')).toBeTruthy();
  });

  it('alt renders min when max is null ', async() => {
    const paramsMock: paramsMockType = {
      // @ts-expect-error
      node: {
        group: false,
      },
      data: {
        ...bisphenolAPhyschemSummaryMock,
        predictedMaximum: null,
      },
      min: 'predictedMinimum',
      max: 'predictedMaximum',
    };

    await renderSuspended(RangeRenderer, {
      props: {
        params: paramsMock,
      },
    });

    expect(screen.queryByTestId('range-span-activator')).toBeTruthy();
    expect(await screen.findAllByText('343')).toBeTruthy();
  });

  it('alt renders when min === max', async() => {
    const paramsMock: paramsMockType = {
      // @ts-expect-error
      node: {
        group: false,
      },
      data: bisphenolAPhyschemSummaryMock,
      min: 'experimentalMinimum',
      max: 'experimentalMaximum',
    };

    await renderSuspended(RangeRenderer, {
      props: {
        params: paramsMock,
      },
    });

    expect(screen.queryByTestId('range-span-activator')).toBeTruthy();
    expect(await screen.findAllByText('200')).toBeTruthy();
  });
});
