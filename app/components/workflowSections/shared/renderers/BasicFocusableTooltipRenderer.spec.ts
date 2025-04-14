import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
} from 'vitest';
import type {ICellRendererParams} from 'ag-grid-community';
import {screen} from '@testing-library/vue';
import BasicFocusableTooltipRenderer from './BasicFocusableTooltipRenderer.vue';

describe('Basic Focusable Tooltip Renderer Unit Tests', () => {
  type paramsMockType = ICellRendererParams & {
    tooltip: string;
    text: string;
    focusable?: boolean;
    dottedUnderline?: boolean;
    width?: string;
  };

  it('renders with default width and tabindex', async() => {
    // @ts-expect-error
    const paramsMock: paramsMockType = {
      tooltip: 'tooltipMock',
      text: 'textMock',
    };

    await renderSuspended(BasicFocusableTooltipRenderer, {
      props: {
        params: paramsMock,
      },
    });

    expect((await screen.findByText(paramsMock.tooltip)).getAttribute('style')).toEqual(expect.stringContaining('width: 400px'));
    expect((await screen.findByText(paramsMock.text))).toHaveAttribute('tabindex', '-1');
    expect((await screen.findByText(paramsMock.text)).getAttribute('class')).toEqual(expect.not.stringContaining('tooltip-dotted-underline'));
  });

  it('renders with given width and tabindex', async() => {
    // @ts-expect-error
    const paramsMock: paramsMockType = {
      tooltip: 'tooltipMock',
      text: 'textMock',
      focusable: true,
      dottedUnderline: true,
      width: '560',
    };

    await renderSuspended(BasicFocusableTooltipRenderer, {
      props: {
        params: paramsMock,
      },
    });

    expect((await screen.findByText(paramsMock.tooltip)).getAttribute('style')).toEqual(expect.stringContaining('width: 560px'));
    expect((await screen.findByText(paramsMock.text))).toHaveAttribute('tabindex', '0');
    expect((await screen.findByText(paramsMock.text)).getAttribute('class')).toEqual(expect.stringContaining('tooltip-dotted-underline'));
  });

  it('renders text instead of tooltip when tooltip === "-"', async() => {
    // @ts-expect-error
    const paramsMock: paramsMockType = {
      tooltip: '-',
      text: 'textMock',
    };

    await renderSuspended(BasicFocusableTooltipRenderer, {
      props: {
        params: paramsMock,
      },
    });

    expect(screen.queryByText(paramsMock.tooltip)).toBeNull();
    expect((await screen.findAllByText(paramsMock.text)).length).toBe(2);
  });

  it('does not render if params.text is falsy', async() => {
    // @ts-expect-error
    const paramsMock: paramsMockType = {
      tooltip: 'tooltipMock',
      text: '',
    };

    await renderSuspended(BasicFocusableTooltipRenderer, {
      props: {
        params: paramsMock,
      },
    });

    expect(screen.queryByText(paramsMock.tooltip)).toBeNull();
  });
});
