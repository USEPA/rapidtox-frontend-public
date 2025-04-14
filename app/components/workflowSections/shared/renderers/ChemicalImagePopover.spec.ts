import {renderSuspended} from '@nuxt/test-utils/runtime';
import type {ICellRendererParams} from 'ag-grid-community';
import {
  describe, expect, it,
} from 'vitest';
import {within} from '@testing-library/vue';
import type {TypeAheadSearchItem} from '../../chemicalSearch/types';
import {CHEMICAL_IMAGE_POPOVER_DEFAULTS} from '../constants';
import ChemicalImagePopover from './ChemicalImagePopover.vue';
import {AtrazineSelectedChemicalMock} from '~/test/mocks/SelectedChemicalMocks';

const structureDataFixture: TypeAheadSearchItem = {
  ...AtrazineSelectedChemicalMock,
  value: 'test',
  title: AtrazineSelectedChemicalMock.searchWord,
};

const noStructureFixture = 'No Structure';

const ariaLabelFixture = (preferredName: string | undefined) => `Image of ${preferredName}`;

const altTextFixture = (dtxsid: `DTXSID${string}` | undefined) => `Image of ${dtxsid}`;

const defaultHeightAndWidthFixture = CHEMICAL_IMAGE_POPOVER_DEFAULTS;

describe('Chemical Image Popover Unit Tests', () => {
  it('renders with correct props', async() => {
    // @ts-expect-error
    const paramsMock: ICellRendererParams<SelectedChemical> & {
      imgHeight?: string;
      imgWidth?: string;
      popoverImgHeight?: string;
      popoverImgWidth?: string;
      centerImg?: boolean;
      hasStructureImage?: boolean;
    } = {
      imgHeight: '50',
      imgWidth: '60',
      popoverImgHeight: '150',
      popoverImgWidth: '160',
      centerImg: true,
      hasStructureImage: true,
      data: AtrazineSelectedChemicalMock,
      value: 'test',
    };

    const chemicalImagePopoverComponent = await renderSuspended(ChemicalImagePopover, {
      props: {
        params: paramsMock,
      },
    });

    expect(chemicalImagePopoverComponent.setupState.hasStructureImage.value)
      .toBe(AtrazineSelectedChemicalMock.hasStructureImage);
    expect(chemicalImagePopoverComponent.setupState.structureData.value).toEqual(structureDataFixture);
    expect(await chemicalImagePopoverComponent.findByLabelText(ariaLabelFixture(paramsMock.data?.preferredName)))
      .toBeTruthy();

    const img = chemicalImagePopoverComponent.container.querySelector('[aria-describedby^="v-tooltip-"]')
      ?.querySelector(`[alt="${altTextFixture(paramsMock.data?.dtxsid)}"]`);

    expect(img?.getAttribute('height')).toBe(paramsMock.imgHeight);
    expect(img?.getAttribute('width')).toBe(paramsMock.imgWidth);

    const popoverContainer = await chemicalImagePopoverComponent
      .findByLabelText(ariaLabelFixture(paramsMock.data?.preferredName));
    const popoverImg = await within(popoverContainer).findByAltText(altTextFixture(paramsMock.data?.dtxsid));

    expect(popoverImg?.getAttribute('height')).toBe(paramsMock.popoverImgHeight);
    expect(popoverImg?.getAttribute('width')).toBe(paramsMock.popoverImgWidth);
  });

  it('displays "no structure" if hasStructureImage is false', async() => {
    // @ts-expect-error
    const paramsMock: ICellRendererParams<SelectedChemical> & {
      imgHeight?: string;
      imgWidth?: string;
      popoverImgHeight?: string;
      popoverImgWidth?: string;
      centerImg?: boolean;
      hasStructureImage?: boolean;
    } = {
      centerImg: true,
      hasStructureImage: false,
      data: {...AtrazineSelectedChemicalMock,
        hasStructureImage: false},
      value: 'test',
    };

    const chemicalImagePopoverComponent = await renderSuspended(ChemicalImagePopover, {
      props: {
        params: paramsMock,
      },
    });

    expect(await chemicalImagePopoverComponent.findByText(noStructureFixture)).toBeTruthy();
  });

  it('renders with default height and width when not provided', async() => {
    // @ts-expect-error
    const paramsMock: ICellRendererParams<SelectedChemical> & {
      imgHeight?: string;
      imgWidth?: string;
      popoverImgHeight?: string;
      popoverImgWidth?: string;
      centerImg?: boolean;
      hasStructureImage?: boolean;
    } = {
      centerImg: true,
      hasStructureImage: false,
      data: AtrazineSelectedChemicalMock,
      value: 'test',
    };

    const chemicalImagePopoverComponent = await renderSuspended(ChemicalImagePopover, {
      props: {
        params: paramsMock,
      },
    });

    const img = chemicalImagePopoverComponent.container.querySelector('[aria-describedby^="v-tooltip-"]')
      ?.querySelector(`[alt="${altTextFixture(paramsMock.data?.dtxsid)}"]`);

    expect(img?.getAttribute('height')).toBe(defaultHeightAndWidthFixture.imgHeight);
    expect(img?.getAttribute('width')).toBe(defaultHeightAndWidthFixture.imgWidth);

    const popoverContainer = await chemicalImagePopoverComponent
      .findByLabelText(ariaLabelFixture(paramsMock.data?.preferredName));
    const popoverImg = await within(popoverContainer).findByAltText(altTextFixture(paramsMock.data?.dtxsid));

    expect(popoverImg?.getAttribute('height')).toBe(defaultHeightAndWidthFixture.popoverImgHeight);
    expect(popoverImg?.getAttribute('width')).toBe(defaultHeightAndWidthFixture.popoverImgWidth);
  });
});
