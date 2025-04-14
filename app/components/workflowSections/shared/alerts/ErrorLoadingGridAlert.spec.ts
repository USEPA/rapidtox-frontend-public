import {
  describe, it, expect,
} from 'vitest';
import {mountSuspended} from '@nuxt/test-utils/runtime';
import ErrorLoadingGridAlert from './ErrorLoadingGridAlert.vue';

const errorMessage = 'Error Loading Grid Data.';

describe('ErrorLoadingGridAlert Tests', () => {
  it('mounts with correct message', async() => {
    const component = await mountSuspended(ErrorLoadingGridAlert);
    expect(component.html()).toContain(errorMessage);
  });
});
