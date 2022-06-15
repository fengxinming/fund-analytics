<template lang="pug">
.container(ref="containerRef")
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue';
// import dayjs from 'dayjs';
import { Chart } from '@antv/g2';

const containerRef = ref<HTMLDivElement>();

const props = defineProps({
  data: {
    type: Array,
    default() {
      return [];
    },
  },
  xField: {
    type: String,
    required: true,
  },
  yField: {
    type: String,
    required: true,
  },
  colorField: {
    type: String,
    required: true,
  },
});

onMounted(() => {
  const chart = new Chart({
    container: containerRef.value as HTMLDivElement,
    autoFit: true,
  });

  watch(
    () => props.data,
    (newValue: any[]) => {
      const { xField, yField, colorField } = props;
      // chart.clear();
      chart.data(newValue);
      chart.annotation().line({
        start: ['min', 0],
        end: ['max', 0],
        style: {
          stroke: '#ff0000',
          lineWidth: 1,
          lineDash: [3, 3],
        },
      });
      chart.scale({
        [yField]: {
          nice: true,
        },
      });
      chart
        .interval()
        .position(`${xField}*${yField}`)
        .color(colorField)
        .label('value', {
          content(item: any){
            return `${item[yField]}%`;
          },
          offset: 10,
        });
      chart.axis(yField, {
        label: {
          formatter(text: string) {
            return `${text}%`;
          },
        },
      });
      chart.tooltip({
        showMarkers: false,
        customItems(items: any[]) {
          items.forEach((n) => {
            n[yField] = `${n[yField]}%`;
          });
          return items;
        },
      });

      chart.render();
    }
  );
});
</script>

<style lang="stylus" scoped>
.container
  width: 100%;
  height: 500px;
</style>
