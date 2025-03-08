<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ColorChip from './ColorChip.svelte';

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'Example/ColorChip',
    component: ColorChip,
    tags: ['autodocs'],
    argTypes: {
      color: { control: 'color' },
    },
  });
</script>

<Story name="Basic" args={{ color: 'red' }} />
