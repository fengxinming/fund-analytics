<template lang="pug">
a-layout
  a-layout-content(class="main")
    a-tabs(
      default-active-key="1"
    )
      a-tab-pane(
        key="1"
        title="日增长率"
      )
        LineChart(
          x-field="date"
          y-field="value"
          color-field="name"
          :data="fundInfo.JZZZL"
        )
      a-tab-pane(
        key="2"
        title="累计增长率"
      )
        BarChart(
          x-field="name"
          y-field="value"
          color-field="code"
          :data="fundInfo.LJJZZZL"
        )
  a-layout-sider(class="sider")
    a-space(direction="vertical")
      a-space(direction="vertical")
        a-space
          a-select(
            style="width: 300px"
            placeholder="请输入基金代码、名称或简拼"
            allow-search
            allow-clear
            value-key="_id"
            :search-delay="1000"
            :filter-option="false"
            :loading="fundInfo.suggestionLoading"
            :model-value="fundInfo.suggestion"
            @search="onSearch"
            @change="onSelectFund"
          )
            a-option(
              v-for="item of fundInfo.suggestions" 
              :key="item._id"
              :value="item"
            ) {{ item.NAME }} {{item.CATEGORYDESC}}
          a-button(@click="onClear") 清除
        a-radio-group(
          :model-value="fundInfo.fundPeriod"
          @change="onPeriodChange"
        )
          a-radio(:value="7") 近7天
          a-radio(:value="15") 近15天
          a-radio(:value="30") 近30天
          a-radio(:value="90") 近90天
          a-radio(:value="180") 近180天
          a-radio(:value="365") 近365天
          a-radio(:value="0") 自定义
        a-space
          a-range-picker(
            style="width: 300px;"
            format="YYYY-MM-DD"
            :model-value="fundInfo.fundRange"
            :disabled="fundInfo.fundPeriod!==0"
            @change="onDateChange"
          )
          a-button(type="primary" @click="onRenderChart") 统计
      a-tag(
        closable
        v-for="fund in fundInfo.selectedFunds"
        :key="fund._id"
        @close="onSelectedFundRemove(fund._id)"
      ) {{ fund.NAME }} - {{ fund.CODE }}
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
import dayjs from 'dayjs';
import LineChart from './components/LineChart.vue';
import BarChart from './components/BarChart.vue';
import { useFundStore } from './stores/fund';

const fundStore = useFundStore();
const fundInfo = computed(() => ({
  suggestion: fundStore.fundSuggestion,
  suggestions: fundStore.fundSuggestions,
  suggestionLoading: fundStore.fundSuggestionLoading,
  selectedFunds: fundStore.selectedFunds,
  fundPeriod: fundStore.fundPeriod,
  fundRange: fundStore.fundRange,
  JZZZL: fundStore.JZZZL,
  LJJZZZL: fundStore.LJJZZZL,
}));
const onSearch = (value: string): void => {
  fundStore.searchFund(value);
};
const onSelectFund = (value: any): any => {
  if (!value) {
    return;
  }
  fundStore.fundSuggestion = '';
  const { selectedFunds } = fundStore;
  if (selectedFunds.some((n) => n._id === value._id)) {
    vm?.appContext.config.globalProperties.$message.warning('重复选择');
    return;
  }
  selectedFunds.push(value);
};
const vm = getCurrentInstance();
const onRenderChart = (): void => {
  const { selectedFunds } = fundStore;
  if (!selectedFunds.length) {
    vm?.appContext.config.globalProperties.$message.warning(
      '请选出需要统计的基金'
    );
    return;
  }
  fundStore.searchLSJZ(selectedFunds);
};
const onSelectedFundRemove = (id: string): void => {
  fundStore.fundSuggestion = '';

  const { selectedFunds, fundJZs } = fundStore;
  const index = selectedFunds.findIndex((n) => n._id === id);
  selectedFunds.splice(index, 1);
  fundJZs.splice(index, 1);
};
const onClear = (): void => {
  fundStore.fundSuggestion = '';
  fundStore.selectedFunds = [];
  fundStore.fundJZs = [];
};
const onDateChange = (values: any) => {
  fundStore.fundRange = values;
};
const onPeriodChange = (value: any) => {
  fundStore.fundPeriod = value;
  const endDate = dayjs();
  const startDate = value
    ? dayjs(endDate).subtract(value, 'day')
    : dayjs(endDate).subtract(30, 'day');
  onDateChange([startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]);
};
</script>

<style lang="stylus">
#app
  max-width 1280px
  margin 0 auto
  padding 2rem
  font-weight normal
</style>
<style lang="stylus" scoped>
.sider
  width 33.33333% !important
  box-shadow none
  padding-left 16px
.main
  width 66.66666%
</style>
