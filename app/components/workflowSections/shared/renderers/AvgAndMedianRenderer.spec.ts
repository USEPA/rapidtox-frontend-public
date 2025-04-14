import {
  describe, expect, it,
} from 'vitest';
import {renderSuspended} from '@nuxt/test-utils/runtime';
import {screen} from '@testing-library/vue';
import type {ICellRendererParams} from 'ag-grid-community';
import AvgAndMedianRenderer from './AvgAndMedianRenderer.vue';
import type {PhyschemSummary} from '~/api/Physchem/types';

describe('Avg and Median Renderer Unit Tests', () => {
  const paramsMock: ICellRendererParams<PhyschemSummary> = {
    // @ts-expect-error
    node: {
      group: false,
    },
    value: 'experimentalAverage',
    // @ts-expect-error
    data: {
      experimentalAverage: 174.432,
    },
  };

  it('renders 0 if value === 0', async() => {
    await renderSuspended(AvgAndMedianRenderer, {
      props: {
        params: {...paramsMock,
          // @ts-expect-error
          data: {
            experimentalAverage: 0,
          }},
      },
    });

    expect(await screen.findByText(0)).toBeTruthy();
  });

  it('renders "-" if !value', async() => {
    await renderSuspended(AvgAndMedianRenderer, {
      props: {
        params: {...paramsMock,
          // @ts-expect-error
          data: {
            experimentalAverage: null,
          }},
      },
    });

    expect(await screen.findByText('-')).toBeTruthy();
  });

  it('renders value if isNan(Number(value)) is true', async() => {
    await renderSuspended(AvgAndMedianRenderer, {
      props: {
        params: {...paramsMock,
          data: {
            // @ts-expect-error
            experimentalAverage: 'test',
          }},
      },
    });

    expect(await screen.findByText('test')).toBeTruthy();
  });

  it('renders roundedValue with given props', async() => {
    await renderSuspended(AvgAndMedianRenderer, {
      props: {
        params: paramsMock,
      },
    });

    expect(await screen.findByText(174)).toBeTruthy();
  });

  it('alt (parsedVal < 0) renders roundedValue with given props', async() => {
    await renderSuspended(AvgAndMedianRenderer, {
      props: {
        params: {...paramsMock,
          // @ts-expect-error
          data: {
            experimentalAverage: -174.432,
          }},
      },
    });

    expect(await screen.findByText(-174)).toBeTruthy();
  });

  it('alt (parsedval === 0) renders roundedValue with given props', async() => {
    await renderSuspended(AvgAndMedianRenderer, {
      props: {
        params: {...paramsMock,
          data: {
            // @ts-expect-error
            experimentalAverage: '0',
          }},
      },
    });

    expect(await screen.findByText('0.00')).toBeTruthy();
  });

  it('alt (parsedVal > 1000) renders roundedValue with given props', async() => {
    await renderSuspended(AvgAndMedianRenderer, {
      props: {
        params: {...paramsMock,
          // @ts-expect-error
          data: {
            experimentalAverage: 1523.43,
          }},
      },
    });

    expect(await screen.findByText('1.52e+3')).toBeTruthy();
  });

  it('does not render if params.node.group is true', async() => {
    await renderSuspended(AvgAndMedianRenderer, {
      props: {
        params: {...paramsMock,
          // @ts-expect-error
          node: {
            group: true,
          }},
      },
    });

    expect(screen.queryByText(174)).toBeNull();
  });
});
