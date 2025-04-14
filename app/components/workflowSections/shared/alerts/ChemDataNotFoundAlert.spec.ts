import {
  describe, it, expect,
} from 'vitest';
import {mountSuspended, renderSuspended} from '@nuxt/test-utils/runtime';
import {
  fireEvent, waitForElementToBeRemoved,
} from '@testing-library/vue';
import ChemDataNotFoundAlert from './ChemDataNotFoundAlert.vue';

const sectionMock = 'Physchem';
const chemicalsNotFoundMock = ['BPA', 'Atrazine'];
const alertText = `${chemicalsNotFoundMock.length} chemicals - No ${sectionMock} data`;
const modalHeader = `Chemicals with no ${sectionMock} data`;

describe('ChemDataNotFoundAlert Tests', () => {
  it('Does not mount if there are 0 chemicals', async() => {
    const component = await mountSuspended(ChemDataNotFoundAlert, {
      props: {
        section: sectionMock,
        chemicalsNotFound: [],
      },
    });
    expect(component.html()).not.toContain(alertText);
  });

  it('mounts with correct title', async() => {
    const component = await mountSuspended(ChemDataNotFoundAlert, {
      props: {
        section: sectionMock,
        chemicalsNotFound: chemicalsNotFoundMock,
      },
    });
    expect(component.html()).toContain(alertText);
  });

  it('triggers modal on click', async() => {
    const component = await renderSuspended(ChemDataNotFoundAlert, {
      props: {
        section: sectionMock,
        chemicalsNotFound: chemicalsNotFoundMock,
      },
    });
    const modalHeaderText = () => component.queryByText(modalHeader);
    expect(modalHeaderText()).toBeNull();

    const activatorBtn = component.getByTestId('chem-data-not-found-dialog-activator');
    await fireEvent.click(activatorBtn);
    expect(modalHeaderText()).toBeTruthy();
  });

  it('header x button closes dialog', async() => {
    const component = await renderSuspended(ChemDataNotFoundAlert, {
      props: {
        section: sectionMock,
        chemicalsNotFound: chemicalsNotFoundMock,
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    const modalHeaderText = () => component.queryByText(modalHeader);
    expect(modalHeaderText()).toBeNull();

    const activatorBtn = component.getByTestId('chem-data-not-found-dialog-activator');
    await fireEvent.click(activatorBtn);
    expect(modalHeaderText()).toBeTruthy();

    const headerXBtn = component.getByTestId('chem-data-not-found-x-btn');
    await fireEvent(headerXBtn, new MouseEvent('click', {bubbles: true}));
    await waitForElementToBeRemoved(modalHeaderText());
    expect(modalHeaderText()).toBeFalsy();
  });

  it('footer close button closes dialog', async() => {
    const component = await renderSuspended(ChemDataNotFoundAlert, {
      props: {
        section: sectionMock,
        chemicalsNotFound: chemicalsNotFoundMock,
      },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    const modalHeaderText = () => component.queryByText(modalHeader);
    expect(modalHeaderText()).toBeNull();

    const activatorBtn = component.getByTestId('chem-data-not-found-dialog-activator');
    await fireEvent.click(activatorBtn);
    expect(modalHeaderText()).toBeTruthy();

    const footerCloseBtn = component.getByTestId('chem-data-not-found-footer-close-btn');
    await fireEvent(footerCloseBtn, new MouseEvent('click', {bubbles: true}));
    await waitForElementToBeRemoved(modalHeaderText());
    expect(modalHeaderText()).toBeFalsy();
  });

  it('renders list in modal according to input props', async() => {
    const component = await renderSuspended(ChemDataNotFoundAlert, {
      props: {
        section: sectionMock,
        chemicalsNotFound: chemicalsNotFoundMock,
      },
    });
    const link = component.getByTestId('chem-data-not-found-dialog-activator');
    await fireEvent.click(link);

    chemicalsNotFoundMock.forEach((chemical) => {
      expect(component.getByText(chemical)).toBeTruthy();
    });
  });
});
