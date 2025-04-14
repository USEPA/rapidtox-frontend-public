import {renderSuspended} from '@nuxt/test-utils/runtime';
import type {ICellRendererParams} from 'ag-grid-community';
import {
  describe, expect, it,
} from 'vitest';
import DataCheckMark from './DataCheckMark.vue';
import {AtrazineSelectedChemicalMock} from '~/test/mocks/SelectedChemicalMocks';

const cellRendererParamsFixture = {
  type: 'hasTox',
  tooltipText: 'This chemical record contains toxicity data.',
};

describe('Data Check Mark Unit Tests', () => {
  it('renders with tooltipDisplay if hasData', async() => {
    // @ts-expect-error
    const paramsMock: ICellRendererParams<SelectedChemical> & {
      tooltipText: string; type: string;
    } = {
      data: AtrazineSelectedChemicalMock,
      type: cellRendererParamsFixture.type,
      tooltipText: cellRendererParamsFixture.tooltipText,
    };

    const dataCheckMarkComponent = await renderSuspended(DataCheckMark, {
      props: {
        params: paramsMock,
      },
    });

    expect(dataCheckMarkComponent.setupState.hasData.value).toBe(true);
    expect(await dataCheckMarkComponent.findByLabelText(paramsMock.tooltipText)).toHaveTextContent(paramsMock.tooltipText);
  });

  it('renders with empty tooltipDisplay', async() => {
    // @ts-expect-error
    const paramsMock: ICellRendererParams<SelectedChemical> & {
      tooltipText: string; type: string;
    } = {
      data: AtrazineSelectedChemicalMock,
      type: cellRendererParamsFixture.type,
    };

    const dataCheckMarkComponent = await renderSuspended(DataCheckMark, {
      props: {
        params: paramsMock,
      },
    });

    expect(dataCheckMarkComponent.setupState.tooltipDisplay.value).toBe('');
    expect(await dataCheckMarkComponent.findByLabelText('')).toBeInTheDocument();
  });

  it('does not render if hasData is false', async() => {
    // @ts-expect-error
    const paramsMock: ICellRendererParams<SelectedChemical> & {
      tooltipText: string; type: string;
    } = {
      data: AtrazineSelectedChemicalMock,
      type: '',
      tooltipText: cellRendererParamsFixture.tooltipText,
    };

    const dataCheckMarkComponent = await renderSuspended(DataCheckMark, {
      props: {
        params: paramsMock,
      },
    });

    expect(dataCheckMarkComponent.setupState.hasData.value).toBe(false);
    expect(dataCheckMarkComponent.queryByLabelText(paramsMock.tooltipText)).toBeNull();
  });
});
