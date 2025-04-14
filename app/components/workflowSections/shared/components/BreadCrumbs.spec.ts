import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
} from 'vitest';
import {fireEvent, screen} from '@testing-library/vue';
import BreadCrumbs from './BreadCrumbs.vue';
import type {BreadcrumbItem, InternalBreadcrumbItem} from './types';

const items = {
  inVivoTox: {title: 'In Vivo Toxicity', disabled: false},
  analogue: {title: 'Analogue', disabled: false},
  bioactivity: {title: 'Bioactivity', disabled: true},
  uncertainty: {title: 'Uncertainty', disabled: true},
};

const itemsMock: BreadcrumbItem[] = [
  items.inVivoTox,
  items.analogue,
  items.bioactivity,
  items.uncertainty,
];

const activeItemMock: InternalBreadcrumbItem = items.analogue;

const tabindexValue = (disabled: boolean) => disabled ? '-1' : '0';

const activeClass = 'active-section';
const pointerClass = 'cursor-pointer';

describe('Bread Crumbs Unit Tests', () => {
  it('renders breadcrumb items with correct tabindex and classes', async() => {
    await renderSuspended(BreadCrumbs, {
      props: {
        items: itemsMock,
        activeItem: activeItemMock,
      },
    });

    // check tabindex is correct based on disabled value
    expect((await screen.findByText(items.inVivoTox.title)).getAttribute('tabindex'))
      .toBe(tabindexValue(items.inVivoTox.disabled));
    expect((await screen.findByText(items.analogue.title)).getAttribute('tabindex'))
      .toBe(tabindexValue(items.analogue.disabled));
    expect((await screen.findByText(items.bioactivity.title)).getAttribute('tabindex'))
      .toBe(tabindexValue(items.bioactivity.disabled));
    expect((await screen.findByText(items.uncertainty.title)).getAttribute('tabindex'))
      .toBe(tabindexValue(items.uncertainty.disabled));

    // check active item has correct class
    expect(await screen.findByText(items.inVivoTox.title)).toHaveClass(pointerClass);
    expect(await screen.findByText(items.analogue.title)).toHaveClass(activeClass);
    expect(await screen.findByText(items.bioactivity.title)).not.toHaveClass(pointerClass);
    expect(await screen.findByText(items.uncertainty.title)).not.toHaveClass(pointerClass);
  });

  it('renders with activeItem as string', async() => {
    await renderSuspended(BreadCrumbs, {
      props: {
        items: itemsMock,
        activeItem: items.inVivoTox.title,
      },
    });

    // check active item has correct class
    expect(await screen.findByText(items.inVivoTox.title)).toHaveClass(activeClass);
    expect(await screen.findByText(items.analogue.title)).toHaveClass(pointerClass);
    expect(await screen.findByText(items.bioactivity.title)).not.toHaveClass(pointerClass);
    expect(await screen.findByText(items.uncertainty.title)).not.toHaveClass(pointerClass);
  });

  it('handles click event', async() => {
    const component = await renderSuspended(BreadCrumbs, {
      props: {
        items: itemsMock,
        activeItem: activeItemMock,
      },
    });

    const span = await component.findByText(items.bioactivity.title);

    await fireEvent.click(span);

    expect(component.emitted()).toHaveProperty('updateActiveItem');
    expect(component.emitted().updateActiveItem).toEqual([[items.bioactivity.title]]);
  });

  it('handles keyup event', async() => {
    const component = await renderSuspended(BreadCrumbs, {
      props: {
        items: itemsMock,
        activeItem: activeItemMock,
      },
    });

    const span = await component.findByText(items.uncertainty.title);

    await fireEvent.keyUp(span, {
      key: 'Enter', code: 'Enter', charCode: 13,
    });

    expect(component.emitted()).toHaveProperty('updateActiveItem');
    expect(component.emitted().updateActiveItem).toEqual([[items.uncertainty.title]]);
  });
});
