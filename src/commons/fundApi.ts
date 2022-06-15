import { append } from 'fast-qs';

function jsonp(url: string, params: any, opts: any): void {
  const script = document.createElement('script');
  const callbackName = `jsonp_${Math.random().toString(36).slice(2)}`;
  script.src = append(url, Object.assign({
    callback: callbackName
  }, params));
  script.onerror = () => {
    delete (window as any)[callbackName];
    document.body.removeChild(script);
    opts.reject(new Error(`请求接口异常: ${script.src}`));
  };
  (window as any)[callbackName] = (res: any) => {
    opts.resolve(res);
  };
  script.onload = () => {
    delete (window as any)[callbackName];
    document.body.removeChild(script);
  };
  document.body.appendChild(script);
}

export function queryFundSuggestions(key: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jsonp(`https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?_=${Date.now()}`,
      {
        m: 1,
        key
      },
      {
        resolve(info: any) {
          if (info && info.Datas) {
            resolve(info.Datas);
          } else {
            reject(new Error('基金检索数据结构异常'));
          }
        }, 
        reject
      });
  });
}

export function queryFundLSJZ(params: any): Promise<any> {
  return new Promise((resolve, reject) => {
    jsonp(`https://api.fund.eastmoney.com/f10/lsjz?_=${Date.now()}`,
      {
        fundCode: params.code,
        pageIndex: params.pageNo || 1,
        pageSize: params.pageSize || 99999999,
        startDate: params.startDate,
        endDate: params.endDate
      },
      {
        resolve(info: any) {
          let LSJZList: any[];
          if ((LSJZList = info && info.Data && info && info.Data.LSJZList)) {
            resolve(LSJZList);
          } else {
            reject(new Error('基金历史净值数据结构异常'));
          }
        }, 
        reject
      });

      // jsonp(`https://stock.finance.sina.com.cn/fundInfo/api/openapi.php/CaihuiFundInfoService.getNav?_=${Date.now()}`,
      // {
      //   symbol: params.code,
      //   page: params.pageNo || 1,
      //   pageSize: params.pageSize || 99999999,
      //   datefrom: params.startDate,
      //   dateto: params.endDate
      // },
      // {
      //   resolve(info: any) {
      //     let LSJZList: any[];
      //     if ((LSJZList = info?.result?.data?.data)) {
      //       resolve(LSJZList);
      //     } else {
      //       reject(new Error('基金历史净值数据结构异常'));
      //     }
      //   }, 
      //   reject
      // });
  });
}
