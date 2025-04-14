import {
  mockNuxtImport, mountSuspended, renderSuspended,
} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
} from 'vitest';
import {screen} from '@testing-library/vue';
import WorkflowButton from './WorkflowButton.vue';

const workflowColor = 'blue';
const slotTest = 'Test slot';

describe('Workflow Button Unit Tests', () => {
  mockNuxtImport('getWorkflowColor', () => () => (
    workflowColor
  ));

  it('mounts with workflow color', async() => {
    const wrapper = await mountSuspended(WorkflowButton, {
      shallow: true,
    });

    expect(wrapper.findComponent('v-btn-stub').attributes('color')).toBe(workflowColor);
  });

  it('renders with slots', async() => {
    await renderSuspended(WorkflowButton, {
      slots: {
        default: () => h('span', {}, slotTest),
      },
    });

    expect(await screen.findByText(slotTest)).toBeTruthy();
  });
});
