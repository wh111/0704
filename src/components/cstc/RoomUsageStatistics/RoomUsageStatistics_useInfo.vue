<!--
****--房间使用情况统计(uploadPhotoWall)
-->
<template>
  <div ref="roomUse" style="height: 100%" class="RoomUsageStatistics">
    <div ref="searchForm" align="right">
      <el-form :inline="true" :model="searchObj" label-width="66px" class="el-form-item-search" style="margin-top:10px">
        <el-form-item label="时间">
          <date-group :dateGroup="{text:'',startDate:searchObj.beginTime,endDate:searchObj.endTime}">
            <el-date-picker style="width: 110px;" name="start" v-model="searchObj.beginTime" :editable="false" type="date" placeholder="选择日期"
                            :picker-options="pickerOptions0"
                            @change="handleStartTime"></el-date-picker>
            <span>-</span>
            <el-date-picker style="width: 110px;" name="end" v-model="searchObj.endTime" :editable="false" type="date" placeholder="选择日期"
                            :picker-options="pickerOptions1"
                            @change="handleEndTime"></el-date-picker>
          </date-group>
        </el-form-item>
        <el-form-item label="房间号">
          <el-select style="width: 80px" placeholder="请选择" v-model="searchObj.roomNum" clearable>
            <el-option v-for="(item,index) in typeOption" :key="index" :label="item.name" :value="item.num"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="次数>=">
          <el-input style="width: 50px" v-model="searchObj.useCount"></el-input>
        </el-form-item>
        <el-form-item label="时长>=">
          <el-input style="width: 50px" v-model="searchObj.useTime"></el-input>
        </el-form-item>
        <el-form-item label="频率>=">
          <el-input style="width: 50px" v-model="searchObj.rusage"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div id="myTable" ref="myTable" class="statisticsBox" :style="{top:searchFormHeight+'px'}">
      <div class="statistics-pic-top">
        <el-table align="center" :context="self" height="300" :data="tableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column width="80" label="编号" type="index"></el-table-column>
          <el-table-column label="房间号" prop="roomNum" align="center"></el-table-column>
          <el-table-column label="使用时长" prop="useTime" show-overflow-tooltip></el-table-column>
          <el-table-column label="使用次数" prop="useCount" show-overflow-tooltip></el-table-column>
          <el-table-column label="使用频率" prop="rusage" show-overflow-tooltip>
            <template scope="scope">
              {{scope.row['rusage']}}%
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="statisticsBox-statis">
        <!--房间使用时长-->
        <div id="whenLong" class="statistics-pic-box chart-panel"></div>
        <!--房间使用次数-->
        <div id="frequency" class="statistics-pic-box chart-panel"></div>
        <!--房间使用率-->
        <div id="usageRate" class="statistics-pic-box chart-panel"></div>
        <!--房间使用率趋势图-->
        <div id="trendMap" class="statistics-pic-box chart-panel" style="height: 650px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
  let Util = null;
  // api
  import api from './api';

  import echarts from 'echarts';

  export default {
    name: 'room-usage-statistics_list',
    data () {
      return {
        api,
        searchFormHeight: 0,
        // 搜索
        searchObj: {
          beginTime: '', // 开始时间
          endTime: '', // 结束时间
          roomNum: '', //房间号
          useCount: '', //使用次数
          useTime: '', //使用时长
          rusage: '' //使用频率
        },

        //房间号
        typeOption: [],

        // 表格数据
        totalCount: 0,
        tableData: [],
        self: this,
        loading: false,
        dynamicHt: 100,
        tabHeight: 0,

        //接口返回的原始数据
        defaultData: [],

        //统计图
        myChart: ['whenLong', 'frequency', 'usageRate', 'trendMap'],  //,'trendMap'
        whenLongOption: null,  //房间使用时长
        frequencyOption: null, //房间使用次数
        usageRateOption: null, //房间使用率
        trendMapOption: null  //房间使用率趋势图

      };
    },
    methods: {
      init: function () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: this.api.list.path,
          method: this.api.list.method,
          data: {}
        };

        this.setTableData();
      },

      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData (isLoading) {
        Object.assign(this.queryQptions.data, this.searchObj);
        let params = this.queryQptions.data;
        params.beginTime = this.conductDate(params.beginTime, 'yyyy-MM-dd') || '';
        params.endTime = this.conductDate(params.endTime, 'yyyy-MM-dd') || '';
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading);
      },

      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        let data = res.data['roomList'] || [];  //查询的房间信息(列表数据用)
        let myListRoom = {};   //以房间号为key存储查询的房间信息
        let zstatic = res.data['zstatic'] || {};      //折线图统计 {"2017-01":{"201":9.5}}  {"年-月":{"房间号":"使用率"}}
        let listTime = res.data['listTime'] || [];   //折线图年和月 X轴
        //let listRoomMap = res.data["listRoomMap"] || [];   //所有的房间号和名称  [{"201":"穿刺"}……]   [{"房间号":"房间名称"}……]

        this.defaultData = res.data;

        this.totalCount = res.totalCount || 0;
        for (var i = 0, item; i < data.length; i++) {
          item = data[i];
          item['useCount'] = item['useCount'] ? item['useCount'] : 0;
          item['useTime'] = item['useTime'] ? item['useTime'] : 0;
          item['rusage'] = item['rusage'] ? item['rusage'] : 0;
          myListRoom[item['roomNum']] = item;
        }

        this.tableData = data;

        this.setColumnOption(myListRoom, data);
        this.setBrokenLine(zstatic, listTime);
        this.createStatistics();
      },

      /**
       * 获取所有房间信息
       * @param {} listRoom  后台接受的所有房间信息
       * @return [] roomNum  返回所有的房间号
       */
      getRoomInfo (listRoom) {
        let tempArr = [];
        let tempRoomNum = [{num: '', name: '全部'}];
        this.$util._.map(listRoom, (item, key) => {
          tempArr.push(key);
          tempRoomNum.push({num: key, name: key + '(' + item['roomName'] + ')'});
        });
        this.typeOption = tempRoomNum;
        return tempArr;
      },

      /**
       * 柱状图统计: 通过echarts统计房间使用时长  房间使用次数  房间使用率
       * @param {} myData   以房间号为key存储查询的房间信息
       * @param {} responseData   后台返回roomList
       */
      setColumnOption (myData, responseData) {
        let data = responseData;
        let roomNum = this.getRoomInfo(this.defaultData['listRoomMap']);

        let labelOption = {
          normal: {
            show: false,
            position: 'insideBottom',
            distance: 10,
            align: 'left',
            verticalAlign: 'middle',
            rotate: 90,
            formatter: '{c}  {name|{a}}',
            fontSize: 12,
            rich: {
              name: {
                textBorderColor: '#fff'
              }
            }
          }
        };

        let whenLongSeriesData = [];
        let frequencySeriesData = [];
        let usageRateSeriesData = [];
        let option = {
          title: {
            subtext: '（滚动鼠标滚轮可调整房间视图大小）'
          },
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '0%',
            right: '5%',
            bottom: '0%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          dataZoom: [
            {
              type: 'inside'
            }
          ],
          xAxis: [
            {
              name: '房间号',
              type: 'category',
              data: [],
              axisTick: {
                alignWithLabel: true
              },
              axisLine: {
                show: false
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '',
              type: 'bar',
              label: labelOption,
              barWidth: '100%',
              data: []
            }
          ]
        };

        option['xAxis'][0].data = roomNum;

        roomNum.forEach((item, index, array) => {
          if (myData.hasOwnProperty(item)) {
            let useTime = myData[item]['useTime'];
            let useCount = myData[item]['useCount'];
            let rusage = myData[item]['rusage'];

            whenLongSeriesData.push(useTime ? useTime : 0);
            frequencySeriesData.push(useCount ? useCount : 0);
            usageRateSeriesData.push(rusage ? rusage : 0);
          } else {
            whenLongSeriesData.push(0);
            frequencySeriesData.push(0);
            usageRateSeriesData.push(0);
          }
        });

        this.whenLongOption = Util._.defaultsDeep({}, option);
        this.whenLongOption['series'][0].data = whenLongSeriesData;
        this.whenLongOption['yAxis'][0].name = '使用时长(小时)';

        this.frequencyOption = Util._.defaultsDeep({}, option);
        this.frequencyOption['series'][0].data = frequencySeriesData;
        this.frequencyOption['yAxis'][0].name = '使用次数';

        let axisLabel = {
          formatter: '{value} %'
        };
        this.usageRateOption = Util._.defaultsDeep({}, option);
        this.usageRateOption['series'][0].data = usageRateSeriesData;
        this.usageRateOption['yAxis'][0].name = '使用率';
        this.usageRateOption['yAxis'][0].axisLabel = axisLabel;

      },

      /**
       * 折线统计图: 通过echarts 房间使用率趋势
       * @param zstatic 后台返回折线图统计 {"2017-01":{"201":9.5}}  {"年-月":{"房间号":"使用率"}}
       * @param listTime 后台返回折线图年和月 X轴
       */
      setBrokenLine (zstatic, listTime) {
        let option = {
          title: {
            text: '' // 图表标题
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params, ticket, callback) {
              let dom = [];
              params.sort((a, b) => +b.value - +a.value);
              params.map(item => (+item.value > 0) && dom.push(item.marker + item.seriesName + '：' + (+item.value) + '%' + '<br>'));
              dom.unshift(params[0].axisValue + '月房间使用率' + (dom.length ? '<br>' : '为0%'));
              (dom.length > 1) && dom.push('　其他房间：0%');
              return dom.join('');
            }
          },
          legend: {
//            orient: 'vertical',
//            x: 'left',
            data: [] //
          },
          grid: {
            top: '20%',
            left: '0%',
            right: '5%',
            bottom: '2%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            name: '年、月份',
            type: 'category',
            boundaryGap: false,
            data: listTime // X轴年、月份
          },
          yAxis: {
            name: '使用率',
            type: 'value',
            axisLabel: {
              formatter: '{value} %'
            }
          },
          series: []
        };
        let tempArr = [];
        this.$util._.map(zstatic, (val, key) => {
          tempArr.push(val);
        });

        let trendMapObj = {};
        tempArr.forEach((val, index, array) => {
          Object.keys(val).map((item, cindex) => {
            if (!trendMapObj.hasOwnProperty(item)) {
              trendMapObj[item] = [];
            }
            trendMapObj[item].push(val[item]);
          });
        });

        this.$util._.map(trendMapObj, (val, key) => {
          option.legend.data.push(key);
          option.series.push({
            name: key,
            type: 'line',
            // stack: '总量',
            data: val
          });
        });
        this.trendMapOption = option;
      },

      //创建统计图
      createStatistics () {
        this.myChart.forEach((val, i, array) => {
          let myEcharts = echarts.init(document.getElementById(val));
          myEcharts.showLoading();
          myEcharts.setOption(this[val + 'Option']);
          myEcharts.hideLoading();
        });
      },

      //设置表格及分页的位置
      setTableDynHeight () {
        let contenHeight = this.$refs.roomUse.parentNode.offsetHeight;
        let tableData = this.$refs.myTable;
        let paginationHt = 50;
        this.searchFormHeight = this.$refs.searchForm.offsetHeight + this.$refs.searchForm.offsetTop;
        this.dynamicHt = contenHeight - tableData.offsetTop - paginationHt;
        this.tabHeight = this.dynamicHt;
      },

      // 搜索
      search () {
        this.setTableData();
      }
    },
    created () {
      this.init();
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      });
    },
    components: {}
  };
</script>

<style lang="scss">
  .RoomUsageStatistics {
    .statisticsBox {
      position: absolute;
      top: 70px;
      right: 16px;
      left: 16px;
      bottom: 0;
      overflow: auto;
    }

    /*.statisticsBox-left{
      width: 500px;
    }*/
    .statisticsBox-statis {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 320px;
    }

    .statistics-pic-top {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }

    .statistics-pic-box {
      margin: 0 auto;
      width: 100%;
      height: 360px;
      border: 2px solid #f5f5f5;
      position: relative;
      top: 16px;
      left: 0;
      bottom: 0;
      float: left;
      z-index: 100000;
    }
  }
</style>
