import type {
  CellClassParams,
  CellClickedEvent,
  CellKeyDownEvent, CellStyle, Column, ICellRendererParams, IRowNode, SuppressKeyboardEventParams, ValueGetterParams,
} from 'ag-grid-community';
import type {GridApi} from 'ag-grid-enterprise';
import {SUPER_CATEGORY_ORDER} from './constants';
import type {PhyschemSummary} from '~/api/Physchem/types';
import type {ScatterPlotToolTipParams} from '~/stores/hazard/types';

// TODO: Add generics once the column defs/rows are typed

/** Column Def Events */

const expandRowOnCellClick = (params: CellClickedEvent) => {
  if (params.node.group) {
    // params.node.getRowClass = 'viewed';
    const row = params.api.getDisplayedRowAtIndex(<number>params.node.rowIndex);
    params.api.redrawRows({rowNodes: [<IRowNode>row]});
    if (params.node.expanded) {
      params.node.setExpanded(false);
    } else {
      params.node.setExpanded(true);
    }
  }
};

const suppressKeyboardEvent = (params: SuppressKeyboardEventParams) => {
  const e = params.event;
  if (e.code === 'Tab' || e.key === 'Tab') {
    const target = e.target as HTMLElement;
    // get focusable children of parent cell
    const focusableChildrenOfParent = target?.closest('.ag-cell')
      ?.querySelectorAll('[tabindex]:not([tabindex="-1"])') || [];
    if (focusableChildrenOfParent.length === 0 ||
      (e.shiftKey === false && target === focusableChildrenOfParent[focusableChildrenOfParent.length - 1]) ||
      (e.shiftKey === true && target === focusableChildrenOfParent[0]) ||
      (e.shiftKey === true && target.classList.contains('ag-cell'))) {
      // do not suppress
      return false;
    }
    // suppress
    return true;
  }
  // do not suppress by default
  return false;
};

/** Grid Events */

const refocusElementOnEnter = ({
  ev, gridApi,
}: {
  ev: CellKeyDownEvent;
  gridApi: GridApi;
}) => {
  if ((<KeyboardEvent>ev?.event)?.key === 'Enter' && ev.colDef.colId === 'ag-Grid-AutoColumn' && ev.node.group) {
    gridApi.setFocusedCell(ev.rowIndex as number, ev.colDef.colId);
  }
};

const refocusElementOnDialogClose = (params: ICellRendererParams) => {
  nextTick(() => {
    params.api.setFocusedCell(params.node.rowIndex!, params.column as Column);
  });
};

/** Comparators */

const baseComparator = <T> (valueone: T | null | undefined, valuetwo: T | null | undefined) => {
  const valOne = valueone || null;
  const valTwo = valuetwo || null;
  if (valOne === null && valTwo === null) {
    return 0;
  }
  if (valOne === null) {
    return 0;
  }
  if (valTwo === null) {
    return 0;
  }
  return (valOne as string).toLowerCase().localeCompare((valTwo as string).toLowerCase());
};

const realNumericalComparator = <T> (valueone: number | null | undefined, valuetwo: number | null | undefined) => {
  const valOne = valueone || null;
  const valTwo = valuetwo || null;
  if (valOne === null && valTwo === null) {
    return 0;
  }
  if (valOne === null) {
    return 1;
  }
  if (valTwo === null) {
    return -1;
  }

  return valOne - valTwo;
};

const numericalComparator = <T> (valueone: T | null | undefined, valuetwo: T | null | undefined) => {
  const valOne = valueone || null;
  const valTwo = valuetwo || null;
  if (valOne === null && valTwo === null) {
    return 0;
  }
  if (valOne === null) {
    return 0;
  }
  if (valTwo === null) {
    return 0;
  }
  const valOneRounded = (Math.round(parseFloat((valOne as string)) * 100) / 100);
  const valTwoRounded = (Math.round(parseFloat((valTwo as string)) * 100) / 100);
  // eslint-disable-next-line no-undefined
  return valOneRounded.toString().localeCompare(valTwoRounded.toString(), undefined, {numeric: true});
};

export function superCategoryComparator(a: string, b: string) {
  // if both are undefined/null, they're obviously equal, so...
  if (!a && !b) {
    return 0;
  }

  // force unknown categories to the "end" or "bottom" of the list
  const idx1 = SUPER_CATEGORY_ORDER.indexOf(a) >= 0 ? SUPER_CATEGORY_ORDER.indexOf(a) : 10000;
  const idx2 = SUPER_CATEGORY_ORDER.indexOf(b) >= 0 ? SUPER_CATEGORY_ORDER.indexOf(b) : 10000;
  return idx1 - idx2;
}

/** Renderers */

// TODO: Refactor imcoming types once columns/rows are typed.
const toolTipRenderer = (params: ScatterPlotToolTipParams) => {
  const header = (params.type === 'toxicity values' || params.type === 'custom toxicity value') ? 'Toxicity Value' : 'Point of Departure';
  const bgColor = header === 'Toxicity Value' ? 'orange' : 'purple';
  return `<div>
<div style="background-color: ${bgColor}; color: white; font-weight: bold; font-size: 18px; padding: 5px;">${header}</div>
<p style="font-size: 15px; padding: 3px; margin: 2px;"> <span style="font-weight: bold;">Study </span>: ${params.study}</p>
<p style="font-size: 15px; padding: 3px;margin: 2px; "> <span style="font-weight: bold;">Toxicity Value: </span> ${roundedValueFormatter(params.toxVal)}</p>
<p style="font-size: 15px; padding: 3px;margin: 2px; "> <span style="font-weight: bold;">Species: </span> ${params.species}</p>
<p style="font-size: 15px; padding: 3px;margin: 2px; "> <span style="font-weight: bold;">Source: </span> ${params.source}</p>
</div>`;
};

const basicLinkRenderer = ({
  link, displayText, shouldShowLink, isExternalLink,
}: {
  link: string;
  displayText: string;
  shouldShowLink: boolean;
  isExternalLink: boolean;
}) => {
  if (link && displayText && shouldShowLink) {
    return `<a href="${link}" ${isExternalLink ? 'target="_blank" rel="noopener noreferrer"' : ''} tabindex="0" style="color: darkblue; text-decoration: underline">${displayText}</a>`;
  }
  return `<div>${displayText || ''}</div>`;
};

/** Value Getters */

// TODO: Refactor all type assertions once Rows/Columns are typed
const customExpRangeFilterValueGetter = (params: ValueGetterParams<PhyschemSummary>) => {
  if (!params?.node?.group) {
    const min = params?.data?.experimentalMinimum as number | string;

    const max = params?.data?.experimentalMaximum as number | string;

    let text = '';

    if ((min === null || min === '' || typeof min === 'undefined') && (max === null || max === '' || typeof max === 'undefined')) {
      text = '';
    } else if (min === null || min === '' || typeof min === 'undefined') {
      text = roundedValueFormatter((max as number)).toString();
    } else if (max === null || max === '' || typeof max === 'undefined') {
      text = roundedValueFormatter((min as number)).toString();
    } else if (min === max) {
      text = roundedValueFormatter((max as number)).toString();
    } else {
      text = `${roundedValueFormatter((min as number)).toString()} to ${roundedValueFormatter((max as number)).toString()}`;
    }

    return text;
  }
  return null;
};

// TODO: Refactor all type assertions once Rows/Columns are typed
const customPredRangeFilterValueGetter = (params: ValueGetterParams<PhyschemSummary>) => {
  if (!params?.node?.group) {
    const min = params?.data?.predictedMinimum as number | string;

    const max = params?.data?.predictedMaximum as number | string;

    let text = '';

    if ((min === null || min === '' || typeof min === 'undefined') && (max === null || max === '' || typeof max === 'undefined')) {
      text = '';
    } else if (min === null || min === '' || typeof min === 'undefined') {
      text = roundedValueFormatter((max as number)).toString();
    } else if (max === null || max === '' || typeof max === 'undefined') {
      text = roundedValueFormatter((min as number)).toString();
    } else if (min === max) {
      text = roundedValueFormatter((max as number)).toString();
    } else {
      text = `${roundedValueFormatter((min as number)).toString()} to ${roundedValueFormatter((max as number)).toString()}`;
    }

    return text;
  }
  return null;
};

/** Cell Styles */

const indentExpandableColumn = (params: CellClassParams): CellStyle | null => {
  const {level} = params.node;
  const groupCell = params.value === params.node.key;
  // change this value to your liking
  const indent = 28;

  if (groupCell && level === 1) {
    return {
      paddingLeft: `${(level + 2) * indent}px`, paddingRight: '0px',
    };
  }
  return null;
};

const targetCellStyle = <TData extends {
  isTarget?: boolean;
}> (params: CellClassParams<TData>): CellStyle => (params.data?.isTarget ?
  {backgroundColor: '#ffcc80', lineHeight: '35px'} :
  {lineHeight: '35px'});

/** Templates */
const hazardHeaderTemplate = () => `<div class="ag-cell-label-container" role="presentation">
  <span data-ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>
  <span data-ref="eFilterButton" class="ag-header-icon ag-header-cell-filter-button"></span>
  <div data-ref="eLabel" class="ag-header-cell-label" role="presentation">
    <span data-ref="eSortOrder" class="ag-header-icon ag-sort-order"></span>
    <span data-ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>
    <span data-ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>
    <span data-ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>
    <span data-ref="" class="ag-header-cell-text" role="columnheader"><i>In Vivo</i> Toxicity</span>
    <span data-ref="eFilter" class="ag-header-icon ag-filter-icon"></span>
  </div>
</div>`;

const subScriptTemplate = ({val, subLen}: {
  val: string; subLen: number;
}) => `<div class="ag-cell-label-container" role="presentation">
  <span data-ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>
  <span data-ref="eFilterButton" class="ag-header-icon ag-header-cell-filter-button"></span>
  <div data-ref="eLabel" class="ag-header-cell-label" role="presentation">
    <span data-ref="eSortOrder" class="ag-header-icon ag-sort-order"></span>
    <span data-ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>
    <span data-ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>
    <span data-ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>
    <span data-ref="" class="ag-header-cell-text" role="columnheader">${val.substring(0, val.length - subLen)}<sub>${val.substring(val.length - subLen)}</sub></span>
    <span data-ref="eFilter" class="ag-header-icon ag-filter-icon"></span>
  </div>
</div>`;

export default {
  colDefEvents: {
    suppressKeyboardEvent,
    expandRowOnCellClick,
  },
  comparators: {
    baseComparator,
    numericalComparator,
    realNumericalComparator,
    superCategoryComparator,
  },
  gridEvents: {
    refocusElementOnEnter,
    refocusElementOnDialogClose,
  },
  renderers: {
    toolTipRenderer,
    basicLinkRenderer,
  },
  cellStyles: {
    targetCellStyle,
    indentExpandableColumn,
  },
  templates: {
    subScriptTemplate,
    hazardHeaderTemplate,
  },
  valueGetters: {
    customPredRangeFilterValueGetter,
    customExpRangeFilterValueGetter,
  },
};
