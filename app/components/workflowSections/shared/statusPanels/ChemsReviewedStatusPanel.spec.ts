import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
} from 'vitest';
import type {IStatusPanelParams} from 'ag-grid-community';
import {screen} from '@testing-library/vue';
import ChemsReviewedStatusPanel from './ChemsReviewedStatusPanel.vue';

describe('Chems Reviewed Status Panel Unit Tests', () => {
  it('renders with correct counts', async() => {
    // @ts-expect-error
    const paramsMock: IStatusPanelParams & {
      chemsReviewedCount: () => number;
      totalChemicalsCount: () => number;
    } = {
      chemsReviewedCount: () => 3,
      totalChemicalsCount: () => 6,
    };

    await renderSuspended(ChemsReviewedStatusPanel, {
      props: {
        params: paramsMock,
      },
    });

    expect(await screen.findByText('3 of 6 chemicals viewed |')).toBeTruthy();
  });
});
