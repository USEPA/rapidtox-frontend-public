import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
} from 'vitest';
import type {IStatusPanelParams} from 'ag-grid-community';
import {screen} from '@testing-library/vue';
import ChemsWorkedOnStatusPanel from './ChemsWorkedOnStatusPanel.vue';

describe('Chems Worked On Status Panel Unit Tests', () => {
  it('renders with correct counts', async() => {
    // @ts-expect-error
    const paramsMock: IStatusPanelParams & {
      chemsWorkedOnCount: () => number;
      totalChemicalsCount: () => number;
    } = {
      chemsWorkedOnCount: () => 4,
      totalChemicalsCount: () => 8,
    };

    await renderSuspended(ChemsWorkedOnStatusPanel, {
      props: {
        params: paramsMock,
      },
    });

    expect(await screen.findByText('data selected from 4 of 8 chemicals'));
  });
});
