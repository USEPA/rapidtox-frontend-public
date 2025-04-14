<template>
  <figure
    :class="props.figureClass"
  >
    <img
      src="~/assets/images/spinner.gif"
      alt="spinner"
      :height="props.height"
      :width="props.width"
    >
    <figcaption v-if="props.showCaption">
      {{ props.captionMsg }}
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
interface IProps {
  height?: string;
  width?: string;
  figureClass?: string;
  showCaption?: boolean;
  captionMsg?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  height: '400',
  width: '400',
  figureClass: 'loading-figure',
  showCaption: true,
  captionMsg: 'Your results are loading',
});
</script>

<style scoped>

</style>
