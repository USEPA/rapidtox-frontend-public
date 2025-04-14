import {mockNuxtImport, renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
  vi,
} from 'vitest';
import type {ICellRendererParams} from 'ag-grid-community';
import {fireEvent, screen} from '@testing-library/vue';
import BasicFocusableDialogRenderer, {type BasicFocusableDialogRendererParams} from './BasicFocusableDialogRenderer.vue';

// Mock refocusElementOnDialogClose from gridUtil.gridEvents
mockNuxtImport('gridUtil', () => ({
  gridEvents: {
    refocusElementOnDialogClose: vi.fn(),
  },
}));

describe('Basic Focusable Dialog Renderer Unit Tests', () => {
  type paramsMockType = ICellRendererParams & BasicFocusableDialogRendererParams;

  it('renders with props and handles span onClick', async() => {
    // @ts-expect-error
    const paramsMock: paramsMockType = {
      tooltip: 'tooltipMock',
      text: 'textMock',
      id: 'idMock',
      dottedUnderline: true,
    };

    await renderSuspended(BasicFocusableDialogRenderer, {
      props: {
        params: paramsMock,
      },
    });

    const span = await screen.findByText(paramsMock.text);

    expect(span.getAttribute('class')).toEqual(expect.stringContaining('dotted-underline'));
    expect(span.getAttribute('id')).toEqual(`hazard-source-${paramsMock.id}`);
    expect(span.getAttribute('tabindex')).toEqual('0');

    await fireEvent.click(span);

    expect(await screen.findByText(paramsMock.tooltip)).toBeTruthy();
  });

  it('handles span keyup', async() => {
    // @ts-expect-error
    const paramsMock: paramsMockType = {
      tooltip: 'tooltipMock',
      text: 'textMock',
      id: 'idMock',
    };

    await renderSuspended(BasicFocusableDialogRenderer, {
      props: {
        params: paramsMock,
      },
    });

    const span = await screen.findByText(paramsMock.text);
    await fireEvent.keyUp(span, {
      key: 'Enter', code: 'Enter', charCode: 13,
    });

    expect(await screen.findByText(paramsMock.tooltip)).toBeTruthy();
  });

  it('handles Close button onClick', async() => {
    // @ts-expect-error
    const paramsMock: paramsMockType = {
      tooltip: 'tooltipMock',
      text: 'textMock',
      id: 'idMock',
    };

    const spy = vi.spyOn(gridUtil.gridEvents, 'refocusElementOnDialogClose');

    await renderSuspended(BasicFocusableDialogRenderer, {
      props: {
        params: paramsMock,
      },
    });

    const span = await screen.findByText(paramsMock.text);
    await fireEvent.click(span);

    expect(await screen.findByText(paramsMock.tooltip)).toBeTruthy();

    const closeButton = await screen.findByText('Close');
    await fireEvent.click(closeButton);

    expect(spy).toHaveBeenCalledWith(paramsMock);
  });

  it('handles icon button onClick', async() => {
    // @ts-expect-error
    const paramsMock: paramsMockType = {
      tooltip: 'tooltipMock',
      text: 'textMock',
      id: 'idMock',
    };

    const spy = vi.spyOn(gridUtil.gridEvents, 'refocusElementOnDialogClose');

    await renderSuspended(BasicFocusableDialogRenderer, {
      props: {
        params: paramsMock,
      },
    });

    const span = await screen.findByText(paramsMock.text);
    await fireEvent.click(span);

    expect(await screen.findByText(paramsMock.tooltip)).toBeTruthy();

    const iconButton = await screen.findByLabelText('Close');
    await fireEvent.click(iconButton);

    expect(spy).toHaveBeenCalledWith(paramsMock);
  });
});
