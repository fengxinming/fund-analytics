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
    required: true
  },
  yField: {
    type: String,
    required: true
  },
  colorField: {
    type: String,
    required: true
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
        [xField]: {
          tickCount: newValue.length / 2,
        },
        [yField]: {
          nice: true,
        },
      });
      chart
        .line()
        .position(`${xField}*${yField}`)
        .color(colorField) /*.shape('smooth')*/;
      chart.axis(yField, {
        grid: {
          line: {
            style: {
              stroke: 'rgba(0,0,0,0.09)',
              lineDash: [4, 2],
            },
          },
        },
        label: {
          formatter(text: string) {
            return `${text}%`;
          },
        },
      });
      chart.axis(xField, {
        label: {
          formatter(text: string, item: any, index: number) {
            return index === 0 ? text : text.slice(text.indexOf('-') + 1);
          },
        },
      });
      chart.tooltip({
        showCrosshairs: true,
        shared: true,
        customItems(items: any[]) {
          items.forEach((n) => {
            n[yField] = `${n[yField]}%`;
          });
          return items;
        },
        title(title: string) {
          return `${title} 涨幅`;
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
