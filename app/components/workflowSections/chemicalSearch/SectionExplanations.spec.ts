import {renderSuspended} from '@nuxt/test-utils/runtime';
import {
  describe, expect, it,
} from 'vitest';
import SectionExplanations from './SectionExplanations.vue';

describe('Section Explanations Unit Tests', () => {
  it('mounts with proper props', async() => {
    const props = {
      title: 'Single Chemical Search',
      subtitle: 'This workflow mode will target information for a specific chemical of interest.',
      type: 'Single',
    };

    const sectionExplanationsComponent = await renderSuspended(SectionExplanations, {
      props: {
        title: props.title,
        subtitle: props.subtitle,
        type: props.type,
      },
    });

    expect(sectionExplanationsComponent.html()).toContain(props.title);
    expect(sectionExplanationsComponent.html()).toContain(props.subtitle);
    expect(sectionExplanationsComponent.getByRole('region').getAttribute('aria-label')).toBe(`${props.type} Search Header`);
  });
});
