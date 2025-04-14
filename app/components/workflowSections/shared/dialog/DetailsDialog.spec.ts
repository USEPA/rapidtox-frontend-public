import {mountSuspended, renderSuspended} from '@nuxt/test-utils/runtime';
import {
  afterEach, describe, expect, it,
  vi,
} from 'vitest';
import {fireEvent, screen} from '@testing-library/vue';
import type {VueWrapper} from '@vue/test-utils';
import type {DefineComponent} from 'vue';
import DetailsDialog from './DetailsDialog.vue';

describe('Details Dialog Unit Tests', () => {
  let wrapper: VueWrapper;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it('renders with props', async() => {
    const component = await renderSuspended(DetailsDialog, {
      props: {
        show: true,
        title: 'test',
        type: 'predictedData',
        rowData: [],
        columnDefs: [],
      },
      global: {
        stubs: ['AgGridVue'],
      },
    });

    expect(component.setupState.showDialog.value).toBe(true);
    expect(await screen.findByText('test')).toBeTruthy();
    expect(component.setupState.gridWidth.value).toBe('500px');
  });

  it('does not render when show is false', async() => {
    const component = await renderSuspended(DetailsDialog, {
      props: {
        show: false,
        title: 'test',
        type: 'predictedData',
        rowData: [],
        columnDefs: [],
      },
      global: {
        stubs: ['AgGridVue'],
      },
    });

    expect(component.setupState.showDialog.value).toBe(false);
    expect(screen.queryByText('test')).toBeNull();
  });

  it('mounts with proper grid width if props.type === experimentalData', async() => {
    wrapper = await mountSuspended(DetailsDialog, {
      props: {
        show: true,
        title: 'test',
        type: 'experimentalData',
        rowData: [],
        columnDefs: [],
      },
      global: {
        stubs: ['AgGridVue'],
      },
    });

    expect(wrapper.findComponent('ag-grid-vue-stub').attributes('style')).toBe('height: 400px; width: 850px;');
  });

  it('mounts with proper grid width if props.type !=== experimentalData', async() => {
    wrapper = await mountSuspended(DetailsDialog, {
      props: {
        show: true,
        title: 'test',
        type: 'predictedData',
        rowData: [],
        columnDefs: [],
      },
      global: {
        stubs: ['AgGridVue'],
      },
    });

    expect(wrapper.findComponent('ag-grid-vue-stub').attributes('style')).toBe('height: 400px; width: 500px;');
  });

  it('handles onClick for Close button', async() => {
    const component = await renderSuspended(DetailsDialog, {
      props: {
        show: true,
        title: 'test',
        type: 'predictedData',
        rowData: [],
        columnDefs: [],
      },
      global: {
        stubs: ['AgGridVue'],
      },
    });

    expect(component.emitted()).not.toHaveProperty('closeDialog');

    const closeButton = await screen.findByText('Close');
    await fireEvent.click(closeButton);

    expect(component.emitted()).toHaveProperty('closeDialog');
  });

  it('handles onClick for "x" button', async() => {
    const component = await renderSuspended(DetailsDialog, {
      props: {
        show: true,
        title: 'test',
        type: 'predictedData',
        rowData: [],
        columnDefs: [],
      },
      global: {
        stubs: ['AgGridVue'],
      },
    });

    expect(component.emitted()).not.toHaveProperty('closeDialog');

    const xButton = await screen.findByTestId('chem-data-not-found-x-btn');
    await fireEvent.click(xButton);

    expect(component.emitted()).toHaveProperty('closeDialog');
  });

  it('calls sizeColumnsToFit() on-grid-ready', async() => {
    const sizeColumnsToFit = vi.fn();
    const gridReadyEventMock = {
      api: {
        sizeColumnsToFit,
      },
    };

    wrapper = await mountSuspended(DetailsDialog, {
      props: {
        show: true,
        title: 'test',
        type: 'predictedData',
        rowData: [],
        columnDefs: [],
      },
      global: {
        stubs: ['AgGridVue'],
      },
    });

    wrapper.findComponent<DefineComponent>('ag-grid-vue-stub')
      .vm.$emit('on-grid-ready', gridReadyEventMock);
    expect(sizeColumnsToFit).toHaveBeenCalled();
  });
});
