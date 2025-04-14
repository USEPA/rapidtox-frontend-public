import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
  vi,
} from 'vitest';
import type {ICellRendererParams} from 'ag-grid-community';
import {screen} from '@testing-library/vue';
import SelectionCheck from './SelectionCheck.vue';

describe('Selection Check Unit Tests', () => {
  type paramsMockType = ICellRendererParams<SelectedChemical> & {
    section: string;
    hasData: () => boolean;
    containsData: () => boolean;
  };

  it('renders with containsData', async() => {
    // @ts-expect-error
    const paramsMock: paramsMockType = {
      section: 'Physchem',
      hasData: () => false,
      containsData: () => true,
    };

    await renderSuspended(SelectionCheck, {
      props: {
        params: paramsMock,
      },
      global: {
        stubs: ['nuxt-icon'],
      },
    });

    await vi.dynamicImportSettled();

    expect(await screen.findByText(`${paramsMock.section} data selected for this chemical`)).toBeTruthy();
    expect((await screen.findByTestId('selection-check-icon')).getAttribute('name')).toBe('b/check2');
  });

  it('renders with hasData', async() => {
    // @ts-expect-error
    const paramsMock: paramsMockType = {
      section: 'Physchem',
      hasData: () => true,
      containsData: () => false,
    };

    await renderSuspended(SelectionCheck, {
      props: {
        params: paramsMock,
      },
      global: {
        stubs: ['nuxt-icon'],
      },
    });

    await vi.dynamicImportSettled();

    expect(await screen.findByText(`${paramsMock.section} data was available but was not selected for this chemical`)).toBeTruthy();
    expect((await screen.findByTestId('selection-check-icon')).getAttribute('name')).toBe('b/info-circle');
  });

  it('does not render with hasData and containsData false', async() => {
    // @ts-expect-error
    const paramsMock: paramsMockType = {
      section: 'Physchem',
      hasData: () => false,
      containsData: () => false,
    };

    await renderSuspended(SelectionCheck, {
      props: {
        params: paramsMock,
      },
      global: {
        stubs: ['nuxt-icon'],
      },
    });

    expect(screen.queryByText(`${paramsMock.section} data selected for this chemical`)).toBeNull();
    expect(screen.queryByText(`${paramsMock.section} data was available but was not selected for this chemical`)).toBeNull();
    expect(screen.queryByTestId('selection-check-icon')).toBeNull();
  });
});
