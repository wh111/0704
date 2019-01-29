<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-tabs class="printHidden" v-model="show" type="card" @tab-click="handleClick">
      <el-tab-pane label="全部" name="all"></el-tab-pane>
      <el-tab-pane label="工服费" name="gff"></el-tab-pane>
      <el-tab-pane label="住宿费" name="zsf"></el-tab-pane>
      <el-tab-pane label="银行办卡证明" name="bkzm"></el-tab-pane>
    </el-tabs>
    <div class="printBPMain yjs" v-for="(item,index) in printDatas" :key="index">
      <!-- 工服费 -->
      <template v-if="['all','gff'].includes(show)">
        <div class="printBPItem">
          <div class="printMain">
            <p>财务处：</p>
            <div class="printCon">
              请收研究生
              <div>{{ item.name }}</div>
              工作服费，收费
              <div>{{ item.money }}</div>
              （{{ item.price }}元/天租赁）;
              导师签名
              <div></div>
              。课题编号：
              <div></div>
              ，请收押金
              <div>{{ item.deposit }}</div>
              元整。（研究生自付）
            </div>
            <div class="signature">
              <p>教育处</p>
              <p class="time">{{ now | formatDate('yyyy-MM-dd') }}</p>
            </div>
          </div>
        </div>
        <div class="printBPItem">
          <div class="printMain">
            <p>物资组：</p>
            <div class="printCon">
              请给研究生：
              <div>{{ item.name }}</div>
              发放工作服，已收费
              <div>{{ item.money }}</div>
              。
              <br>
              工作服型号（男、女　L、 M、 S　）
            </div>
            <div class="signature">
              <p>教育处</p>
              <p class="time">{{ now | formatDate('yyyy-MM-dd') }}</p>
            </div>
          </div>
        </div>
      </template>

      <!--住宿费-->
      <template v-if="['all','zsf'].includes(show)">
        <div class="printBPItem">
          <div class="printMain">
            <p>财务处：</p>
            <div class="printCon">
              请给予我院研究生 {{ item.name }} 办理住宿费，收住宿费
              <div>{{ yearNum(item.zsTime) * hotelExpense }}</div>
              元，住宿时间：
              <el-date-picker class="ptPrintReceiptsRoomInput printHidden" v-model="item.zsTime[0]" type="date" placeholder="选择住宿开始日期"></el-date-picker>
              -
              <el-date-picker class="ptPrintReceiptsRoomInput printHidden" v-model="item.zsTime[1]" type="date" placeholder="选择住宿结束日期"></el-date-picker>
              <!--<input class="ptPrintReceiptsRoomInput printHidden" v-model="item.zsTime" placeholder="请输入住宿时间"/>-->
              <div class="ptPrintReceiptsRoomTime printShowInline">{{ item.zsTime[0] | formatDate('yyyy.MM.dd') }} - {{ item.zsTime[1] |
                formatDate('yyyy.MM.dd') }}
              </div>
              ，押金
              <div>{{ item.deposit }}</div>
              元，谢谢！
            </div>
            <div class="signature">
              <p>教育处</p>
              <p class="time">{{ now | formatDate('yyyy-MM-dd') }}</p>
            </div>
          </div>
        </div>
      </template>

      <!--银行办卡证明-->
      <template v-if="['all','bkzm'].includes(show)">
        <div class="printBPItem">
          <div class="printMain">
            <h3 align="center">证明</h3>
            <br>
            <p style="text-indent: 2em;">
              您好，以下研究生为我院研究生，请给予办理银行卡和开通门禁卡， 谢谢！
            </p>
            <p align="center">{{ item.name }}</p>
            <div class="signature">
              <p>教育处</p>
              <p class="time">{{ now | formatDate('yyyy-MM-dd') }}</p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<style lang="scss">
  @import "../../../../assets/ambuf/css/common/print_charge";

  .ptPrintReceiptsRoomInput {
    .el-input__inner {
      margin-left: -24px;
    }
    .el-input__icon {
      &:after, &:before {
        position: relative;
        line-height: 36px;
        left: -13px;
      }
    }
  }

  .printMain .printCon div.ptPrintReceiptsRoomTime {
    display: none;
  }
</style>
<script>
  /*当前组件必要引入*/
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data () {
      return {
        now: new Date(),
        show: 'all',
        hotelExpense: 0, // 住宿费
        printDatas: []
      };
    },
//    computed:{
//    },
    methods: {
      //初始化请求列表数据
      init () {
        this.getHotelExpense();
        this.getPrintData();
      },
      // 计算年份
      yearNum (arr) {
        let end = arr[1] && new Date(arr[1] || '').getTime() || 0;
        let start = arr[0] && new Date(arr[0] || '').getTime() || 0;
        let n = end && start && Math.floor((end - start) / (24 * 60 * 60 * 365 * 1000)) || 0;
        console.log(n);
        return (n || 0) + 1;
      },
      handleClick () {

      },
      // 打印前
      beforePrint () {
        let hasTime = this.printDatas.every(item => item.zsTime[0] && item.zsTime[0]);
        !hasTime && this.errorMess('请输入住宿时间才能打印！');
        return hasTime;
      },
      // 获取住宿费
      getHotelExpense () {
        let opt = {
          ajaxSuccess: res => {
            if (res.data instanceof Object) {
              this.hotelExpense = res.data.configValue;
            }
          },
          ajaxParams: {
            url: '/rotaryConfig/getByKey/yjs_hotel_expense-YJS'
          }
        };
        this.ajax(opt);
      },
      // 获取打印数据
      getPrintData () {
        let opt = {
          ajaxSuccess: res => {
            let data = [];
            if (res.data instanceof Object) {
              let item = res.data;
              item.zsTime = ['', ''];
              data = [item];
            }
            this.printDatas = data;
          },
          ajaxError: () => this.errorMess('获取打印数据失败'),
          ajaxParams: {
            url: api.printData.path + this.operailityData.id,
            method: api.printData.method
          }
        };
        this.ajax(opt);
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  };

</script>
