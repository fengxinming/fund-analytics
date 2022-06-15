import { queryFundLSJZ, queryFundSuggestions } from '@/commons/fundApi';
import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import { roundToUp } from 'round-to';
import type { FundStore } from './type';

export const useFundStore = defineStore({
  id: 'fund',
  state: (): FundStore => {
    const fundPeriod = 30;
    const today = dayjs();
    const lastMonth = dayjs(today).subtract(fundPeriod, 'day');

    return {
      fundSuggestion: '',
      fundSuggestions: [],
      fundSuggestionLoading: false,
      selectedFunds: [],
      fundJZs: [],
      fundPeriod,
      fundRange: [lastMonth.format('YYYY-MM-DD'), today.format('YYYY-MM-DD')],
    };
  },
  getters: {
    JZZZL(state: FundStore) {
      const newArr: any[] = [];

      const { selectedFunds } = state;
      state.fundJZs.forEach((m: any, i: number) => {
        const name = selectedFunds[i].NAME;
        m.forEach((o: any) => {
          newArr.push({
            date: o.FSRQ,
            name,
            value: +o.JZZZL,
          });
        });
      });

      return newArr;
    },

    LJJZZZL(state: FundStore) {
      const { selectedFunds } = state;
      return state.fundJZs.map((m: any, i: number) => {
        let value = 0;
        const { length } = m;
        if (length > 2) {
          const first = m[0].DWJZ;
          const last = m[length - 1].DWJZ;
          value = roundToUp(((first - last) / last) * 100, 2);
        }
        const fund = selectedFunds[i];
        return {
          name: fund.NAME,
          code: fund.CODE,
          value,
        };
      });
    },
  },
  actions: {
    searchFund(key: string): Promise<any> {
      this.fundSuggestionLoading = true;
      return queryFundSuggestions(key).then(
        (res: any) => {
          this.fundSuggestionLoading = false;
          this.fundSuggestions = res;
        },
        () => {
          this.fundSuggestionLoading = false;
        }
      );
    },

    searchLSJZ(selectedFunds: any[]): Promise<any> {
      const { fundRange } = this;
      return Promise.all(
        selectedFunds.map((n) =>
          queryFundLSJZ({
            code: n.CODE,
            startDate: fundRange[0],
            endDate: fundRange[1],
          })
        )
      ).then((arr: any[][]) => {
        this.fundJZs = arr;
      });
    },
  },
});
