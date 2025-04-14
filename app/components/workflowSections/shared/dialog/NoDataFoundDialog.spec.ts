import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
  vi,
} from 'vitest';
import {fireEvent, screen} from '@testing-library/vue';
import NoDataFoundDialog from './NoDataFoundDialog.vue';

describe('No Data Found Dialog Unit Tests', () => {
  const alertFixture = (section: string) => `${section} Data Selection Alert`;
  const cardTextFixture = (section: string) => `There is no ${section} data for your selected chemicals. There may be data for these chemicals within other sections. Please continue to the next section.`;

  it('renders with props', async() => {
    const component = await renderSuspended(NoDataFoundDialog, {
      props: {
        id: 'physchem-no-data-found',
        show: true,
        section: 'Physchem',
      },
    });

    expect(component.setupState.showDialog.value).toBe(true);
    expect(await screen.findByText(alertFixture('Physchem'))).toBeTruthy();
    expect(await screen.findByText(cardTextFixture('Physchem'))).toBeTruthy();
  });

  it('does not render when show is false', async() => {
    const component = await renderSuspended(NoDataFoundDialog, {
      props: {
        id: 'physchem-no-data-found',
        show: false,
        section: 'Physchem',
      },
    });

    expect(component.setupState.showDialog.value).toBe(false);
    expect(screen.queryByText(alertFixture('Physchem'))).toBeNull();
    expect(screen.queryByText(cardTextFixture('Physchem'))).toBeNull();
  });

  it('handles onClick for "x" button', async() => {
    const component = await renderSuspended(NoDataFoundDialog, {
      props: {
        id: 'physchem-no-data-found',
        show: true,
        section: 'Physchem',
      },
    });

    expect(component.emitted()).not.toHaveProperty('closeDialog');

    const xButton = await screen.findByLabelText('Close');
    await fireEvent.click(xButton);

    expect(component.emitted()).toHaveProperty('closeDialog');
  });

  it('handles onClick for Close button', async() => {
    const component = await renderSuspended(NoDataFoundDialog, {
      props: {
        id: 'physchem-no-data-found',
        show: true,
        section: 'Physchem',
      },
    });

    expect(component.emitted()).not.toHaveProperty('closeDialog');

    const closeButton = await screen.findByText('Close');
    await fireEvent.click(closeButton);

    expect(component.emitted()).toHaveProperty('closeDialog');
  });

  it('handles onClick for Okay button', async() => {
    const spy = vi.spyOn(useAppBaseStore(), 'nextStep');

    const component = await renderSuspended(NoDataFoundDialog, {
      props: {
        id: 'physchem-no-data-found',
        show: true,
        section: 'Physchem',
      },
    });

    expect(component.emitted()).not.toHaveProperty('closeDialog');

    const closeButton = await screen.findByText('Okay');
    await fireEvent.click(closeButton);

    expect(component.emitted()).toHaveProperty('closeDialog');
    expect(spy).toHaveBeenCalled();
  });
});
