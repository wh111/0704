<!--
****--@file     substation_chart
****--@date     2018/6/26 14:45
****--@author   YC
****--@describe 分站得分总览-图表分析
-->
<template>
  <div class="substationChart">
    <div class="substationChartItem" id="pieBox"></div>
    <div class="substationChartItem" id="lineBox"></div>
  </div>
</template>
<style lang="scss">
  .substationChart {
    height: 400px;
    overflow: auto;
  }

  .substationChartItem {
    height: 400px;
    & ~ & {
      margin-top: 20px;
    }
  }
</style>
<script>
  /*当前组件必要引入*/
  import echarts from 'echarts/lib/echarts'; // 图表
  // 引入柱状图
  require('echarts/lib/chart/pie');
  require('echarts/lib/chart/line');
  // 引入提示框和标题组件
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'substationChart',
    props: ['stationId', 'scoreTableId', 'url'],
    data () {
      return {
        // myChart: {
        //   pie: null,
        //   line: null
        // }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
      },
      getChartData () {
        let myChart = {
          pie: echarts.init(document.getElementById('pieBox')),
          line: echarts.init(document.getElementById('lineBox'))
        };
        myChart.pie.showLoading();
        myChart.line.showLoading();
        this.getPieData(res => {
          myChart.pie.setOption(this.getPieOption(res.data));
          myChart.pie.hideLoading();
        });
        this.getLineData(res => {
          myChart.line.setOption(this.getLineOption(res.data));
          myChart.line.hideLoading();
        });
      },
      getPieOption (data) {
        let opt = {
          title: {
            text: '考核二三级知识结构（分级占比）',
            subtext: ''
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          series: [
            {
              name: '知识结构',
              type: 'pie',
              selectedMode: 'single',
              radius: [0, '39%'],

              label: {
                normal: {
                  position: 'inner'
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                // {value:335, name:'直达'},
              ]
            },
            {
              name: '知识结构',
              type: 'pie',
              radius: ['40%', '55%'],
              label: {
                normal: {
                  formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                  backgroundColor: '#eee',
                  borderColor: '#aaa',
                  borderWidth: 1,
                  borderRadius: 4,
                  rich: {
                    a: {
                      color: '#999',
                      lineHeight: 22,
                      align: 'center'
                    },
                    hr: {
                      borderColor: '#aaa',
                      width: '100%',
                      borderWidth: 0.5,
                      height: 0
                    },
                    b: {
                      fontSize: 16,
                      lineHeight: 33
                    },
                    per: {
                      color: '#eee',
                      backgroundColor: '#334455',
                      padding: [2, 4],
                      borderRadius: 2
                    }
                  }
                }
              },
              data: [
                // {value:335, name:'直达'},
              ]
            }
          ]
        };

        if (data && data.length) {
          data.map(item => {
            let sum = 0;
            item.detail.map(cItem => {
              sum += cItem.num;
              opt.series[1].data.push({value: cItem.num, name: cItem.content});
            });
            opt.series[0].data.push({value: sum, name: item.classify});
          });
        }

        return opt;
      },
      getLineOption (data) {
        let opt = {
          title: {
            text: '单站点年级成绩频数分布图',
            subtext: ''
          },
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              name: '分',
              nameLocation: 'end',
              data: [/*'[0,59]', '[60,69]', '[70,79]', '[80,89]', '[90,100]'*/],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '分数区间人数'
            }
          ],
          series: [
            {
              name: '人数',
              type: 'bar',
              data: []
            }
          ]
        };
        if (data instanceof Object) {
          Object.keys(data).
            sort((a, b) => Number(a.split(',')[1] || 100) > Number(b.split(',')[0] || 100)).
            map(key => {
              opt.xAxis[0].data.push(`[${key}]`);
              opt.series[0].data.push(Number(data[key]));
            });
        }
        return opt;
      },
      getPieData (callFun) {
        let opt = {
          ajaxSuccess: res => callFun(res),
          ajaxParams: {
            url: this.url.pipeData,
            params: {
              scoreTableId: this.scoreTableId
            }
          }
        };
        this.ajax(opt);
      },
      getLineData (callFun) {
        let opt = {
          ajaxSuccess: res => callFun(res),
          ajaxParams: {
            url: this.url.lineData + this.stationId
          }
        };
        this.ajax(opt);
      }
    },
    created () {
      this.init();
    },
    mounted () {
      this.$nextTick(() => {
        this.getChartData();
      });
    },
    components: {}
  };

</script>
