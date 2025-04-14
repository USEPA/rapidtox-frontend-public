import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  afterAll,
  describe, expect, it, vi,
} from 'vitest';
import {type ICellRendererParams} from 'ag-grid-community';
import {fireEvent} from '@testing-library/vue';
import LinkRenderer from './LinkRenderer.vue';

describe('Link Renderer Unit Tests', () => {
  const hasLinkNioshFixture = {
    linkUrl: 'https://www.cdc.gov/niosh/npg/npgd0043.html',
    labelText: 'NIOSH External Link',
    iconType: 'b/flask-solid',
  };

  const safetyLinkUrl = useRuntimeConfig().public.APPLICATION_SAFETY_LINKS_API;

  const hasLinkSafetyFixture = {
    linkUrl: `${safetyLinkUrl}DTXSID9020112`,
    labelText: 'Safety External Link',
    iconType: 'mdi/safety-goggles',
  };

  const nioshParamsMock: ICellRendererParams<SelectedChemical> = {
    value: 'https://www.cdc.gov/niosh/npg/npgd0043.html',
    // @ts-expect-error
    column: {getColId: () => 'nioshLink'},
  };

  vi.stubGlobal('open', vi.fn());

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('mounts with safety link', {timeout: 5000}, async() => {
    const paramsMock: ICellRendererParams<SelectedChemical> = {
      value: 'DTXSID9020112',
      // @ts-expect-error
      column: {getColId: () => 'safetyLink'},
    };

    const component = await renderSuspended(LinkRenderer, {
      props: {
        params: paramsMock,
      },
    });

    await vi.dynamicImportSettled();
    expect(component.setupState.hasLink.value).toEqual(hasLinkSafetyFixture);
    expect(await component.findByLabelText(hasLinkSafetyFixture.labelText)).toBeTruthy();
  });

  it('renders with niosh link', {timeout: 5000}, async() => {
    const component = await renderSuspended(LinkRenderer, {
      props: {
        params: nioshParamsMock,
      },
    });

    await vi.dynamicImportSettled();
    expect(component.setupState.hasLink.value).toEqual(hasLinkNioshFixture);
    expect(await component.findByLabelText(hasLinkNioshFixture.labelText)).toBeTruthy();
  });

  it('does not render with null hasLink', async() => {
    const paramsMock: ICellRendererParams<SelectedChemical> = {
      value: '',
      // @ts-expect-error
      column: {getColId: () => 'nioshLink'},
    };

    const component = await renderSuspended(LinkRenderer, {
      props: {
        params: paramsMock,
      },
    });

    expect(component.setupState.hasLink.value).toEqual(null);
    expect(component.queryByRole('button')).toBeNull();
  });

  it('handles click event', async() => {
    const component = await renderSuspended(LinkRenderer, {
      props: {
        params: nioshParamsMock,
      },
    });

    const spy = vi.spyOn(window, 'open');

    const button = await component.findByRole('button');

    await fireEvent.click(button);

    expect(spy).toBeCalledWith(`${nioshParamsMock.value}`, '_blank', '');
  });

  it('handles keyup event', async() => {
    const component = await renderSuspended(LinkRenderer, {
      props: {
        params: nioshParamsMock,
      },
    });

    const spy = vi.spyOn(window, 'open');

    const button = await component.findByRole('button');

    await fireEvent.keyUp(button, {
      key: 'Enter', code: 'Enter', charCode: 13,
    });

    expect(spy).toBeCalledWith(`${nioshParamsMock.value}`, '_blank', '');
  });
});
