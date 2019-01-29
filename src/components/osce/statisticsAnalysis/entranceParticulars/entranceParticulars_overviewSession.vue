<!--场次概况-->
<template>
  <div id="content" ref="content" class="modal" style="height: 100%">
    <div class="overviewSession">
      <div class="overviewSession-content">
        <p class="overviewSession-lh">总人数: <span class="overviewSession-text">{{data.userNum}}</span></p>
        <p class="overviewSession-lh">分站数: <span class="overviewSession-text">{{data.stationNum}}</span></p>
        <p class="overviewSession-lh">考官数: <span class="overviewSession-text">{{data.teacherNum}}</span></p>
        <p class="overviewSession-lh">最高分: <span class="overviewSession-text">{{data.maxMark}}</span></p>
        <p class="overviewSession-lh">最低分: <span class="overviewSession-text">{{data.minMark}}</span></p>
        <p class="overviewSession-lh">平均分: <span class="overviewSession-text">{{data.averageMark}}</span></p>
      </div>

    </div>
    <div ref="main" id="myChart" class="chart-panel"></div>
  </div>
</template>
<script>
  // let echarts = require('echarts');
  import echarts from 'echarts';
  // 基于准备好的dom，初始化echarts实例

  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData', 'url'],
    data() {
      return {
        //查询表单
        formValidate: {
          sceneId: this.operailityData.sceneId, //场次id
          statisticsId: this.operailityData.statisticsId, //统计id
        },

        data: {}, //获取到的数据

        option: null,

        myChart: null,

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: this.url.sceneGet,
            params: {}
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.setTableData();
      },

      echartInit() {
        this.myChart = echarts.init(document.getElementById('myChart'));
        this.myChart.showLoading();
        this.ajax(this.listMessTitle).then(() => {
          this.myChart.setOption(this.option);
          this.myChart.hideLoading();
        })
      },

      //通过get请求列表数据
      updateListData(responseData) {
        let data = responseData.data;
        let oldKey = 1;
        this.data = data;
        this.option = {
          title: {
            text: '' // 图表标题
          },
          tooltip: {
            trigger: 'axis',
            // formatter: function (params, ticket, callback) {
            //   return 'Loading';
            // }
          },
          legend: {
            data: [] // 考站名称
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            name: '得分',
            type: 'category',
            boundaryGap: false,
            data: [] // 分数区间
          },
          yAxis: {
            name: '人数',
            type: 'value'
          },
          series: []
        };

        this.$util._.map(data.data, (item, index) => {
          this.option.legend.data.push(item.chartName);
          this.option.series.push({
            name: item.chartName,
            type: 'line',
            // stack: '总量',
            data: []
          })
          this.$util._.map(item.data, (val, key) => {
            if(!index){
              this.option.xAxis.data.push(+key ? (+oldKey + 1) + '-' + key : key);
            }
            this.option.series[index].data.push(val);
            oldKey = key;
          })
        })
      },

      setTableData() {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.formValidate);
      },
    },
    created() {
      this.init();
    },
    mounted() {
      this.$nextTick(function () {
        this.echartInit() // 绘制
      })
    },
    components: {
      //当前组件引入的子组件
    }
  }

</script>
