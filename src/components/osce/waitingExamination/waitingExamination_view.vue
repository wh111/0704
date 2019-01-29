<!--
****--@file     waitingExamination_view
****--@date     2018/4/23 19:31
****--@author   YC
****--@describe 候考信息查看
-->
<template>
  <div class="waitingExaminationBox" @click="esc">
    <template v-if="showData">
      <div class="freeBox" v-if="showData.sceneType === 'FREE'">
        <h2 class="esName">{{ showData.esName }}</h2>
        <p class="time">开始时间：<span>{{ showData.startTime | formatDate('yyyy-MM-dd HH:mm:ss') }}</span></p>
      </div>
      <div v-else class="waitingExaminationTable">
        <div class="waitingExaminationTableHead" ref="tableHeader">
          <p class="static">考生姓名</p>
          <p class="static">开始时间</p>
          <p v-for="index in rotaryMapLen" :key="index">{{ index }}</p>
        </div>
        <div class="waitingExaminationTableBodyBox" :id="'waitingExaminationTableBodyBox'+type" :style="{'top': tableHeadHeight + 'px'}">
          <div class="waitingExaminationTableBody" ref="tableBody" :style="style">
            <template v-for="(user,index) in showData.userList">
              <div class="waitingExaminationTableBodyItem" :key="index">
                <p class="static">{{ user.userName }}</p>
                <p class="static">{{ user.startTime.split(' ')[1].split('.')[0] }}</p>
                <p v-for="(rotaryMap,cIndex) in user.rotaryMap" :key="index+'_'+cIndex">{{ rotaryMap.stationName }}</p>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
    <p v-else style="text-align: center;line-height: 400px;">
      {{ rotaryMapLen === null ? '数据加载中!' : '暂无候考信息' }}
    </p>
  </div>
</template>
<style lang="scss">
  .waitingExaminationBox {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    top: 0;
    overflow: hidden;

    .freeBox {
      text-align: center;
      width: 100%;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      h2 {
        font-size: 30px;
      }
      p {
        font-size: 20px;
        margin-top: 16px;
      }
      span {
        color: red;
      }
    }
  }

  .waitingExaminationTable {
    width: 100%;
    height: 100%;
    background-color: #fff;
    border: 1px solid #e1e1e1;
    position: relative;
    p {
      width: 100%;
      padding: 12px;
      font-size: 16px;
      border: 1px solid #e1e1e1;
      &:not(.name) {
        text-align: center;
      }
    }
    .static {
      min-width: 90px;
    }
    .name {
      min-width: 80px;
    }
  }

  .waitingExaminationTableHead {
    display: flex;
    z-index: 2;
    background: #fff;
    width: 100%;
    justify-content: space-between;
    position: absolute;
    top: 0;
    left: 0;
  }

  .waitingExaminationTableBodyBox {
    position: absolute;
    left: 0;
    right: -17px;
    top: 40px;
    bottom: 0;
    overflow-y: scroll;
  }

  .waitingExaminationTableBody {
  }

  .waitingExaminationTableBodyItem {
    display: flex;
    justify-content: space-between;
    &:nth-child(2n) {
      background-color: #f4f4f4;
    }
  }

</style>
<script>
  /*当前组件必要引入*/
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'waitingExaminationView',
    props: ['viewType', 'type'],
    data () {
      return {
        Y: 0,
        style: {},
        showData: null,
        marqueeInt: null,
        marqueeTime: null,
        rotaryMapLen: null, // 考站数量
        tableHeadHeight: 40, // 顶部高度
        numText: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
//        rotaryMapTimeObj: {}, // 时间与考站之间的对应
//        rotaryMapRoomArr: [], // 考站
//        rotaryMapTimeArr: [], // 时间
        waitingExaminationTableBodyBox: null,
        stationStatusInt: null,
        stationInt: null,
        oldStationStatus: '',
        oldStationId: ''
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
      },
      getShowData () {
        let opt = {
          ajaxLoading: false,
          ajaxSuccess: res => {
            let isObj = res.data instanceof Object;
            if (!isObj || res.data.sceneStatus === 'FINISH') {
              this.rotaryMapLen = '';
              this.showData = null;
            } else {
              this.rotaryMapLen = res.data && res.data.userList.length && res.data.userList[0].rotaryMap.length || 0;
              this.showData = res.data.sceneType === 'FREE' ? res.data : (this.rotaryMapLen ? res.data : null);
            }

            if (res.data.sceneType !== 'FREE' && this.rotaryMapLen) {
              this.$nextTick(() => {
                this.setTableDynHeight();
                this.marquee();
              });
              this.loadStationStatus();
            } else {
              this.stationInt = setTimeout(() => this.getShowData(), 1000);
            }
          },
          ajaxParams: {
            url: api.list.path,
            method: api.list.method
          }
        };
        this.stopMarquee();
        this.Y = 0;
        this.waitingExaminationTableBodyBox = null;
        clearInterval(this.stationStatusInt);
        clearTimeout(this.stationInt);
        this.ajax(opt);
      },
      marquee () {
        this.stopMarquee();
        this.marqueeTime = setTimeout(() => this.startMarqueeUp(), 3000);
      },
      startMarqueeUp () {
        console.log(this.type + ' 开始正向滚动');
        clearInterval(this.marqueeInt);
        if (!this.waitingExaminationTableBodyBox) {
          this.waitingExaminationTableBodyBox = document.getElementById('waitingExaminationTableBodyBox' + this.type);
        }
        this.marqueeInt = setInterval(() => {
          this.Y += 1;
          this.scrollTop(this.waitingExaminationTableBodyBox, this.Y);
          if (this.Y - 1 >= this.scrollTop(this.waitingExaminationTableBodyBox)) {
            this.stopMarquee();
            if (this.Y > 2) {
              this.marqueeTime = setTimeout(() => this.startMarqueeDown(), 3000);
            }
          }
        }, 50);
      },
      startMarqueeDown () {
        console.log(this.type + ' 开始反向滚动');
        clearInterval(this.marqueeInt);
        if (!this.waitingExaminationTableBodyBox) {
          this.waitingExaminationTableBodyBox = document.getElementById('waitingExaminationTableBodyBox' + this.type);
        }
        this.marqueeInt = setInterval(() => {
          this.Y -= 1;
          this.scrollTop(this.waitingExaminationTableBodyBox, this.Y);
          if (this.Y <= 0) {
            this.stopMarquee();
//            this.marqueeTime = setTimeout(() => this.startMarqueeUp(), 3000)
            this.marqueeTime = setTimeout(() => this.getShowData(), 3000); // 重新获取数据
          }
        }, 50);
      },
      stopMarquee () {
        clearInterval(this.marqueeInt);
        clearTimeout(this.marqueeTime);
        console.log(this.type + ' 结束滚动');
      },
      scrollTop (obj, len) {
        if (typeof len === 'undefined') {
          return obj.scrollTop;
        } else {
          obj.scrollTop = len;
        }
      },
      setTableDynHeight () {
        this.tableHeadHeight = this.$refs.tableHeader.offsetHeight;
      },
      esc () {
        this.$emit('esc');
      },
      getNowStationStatus () {
        let opt = {
          ajaxLoading: false,
          ajaxSuccess: 'setNowStationStatus',
          ajaxParams: {
            url: api.basic.path,
            method: api.basic.method
          }
        };
        this.ajax(opt);
      },
      setNowStationStatus (res) {
        if (this.oldStationStatus === '') {
          this.oldStationStatus = res.data.status;
          this.oldStationId = res.data.id;
        }
        if (res.data.status === 'FINISH') {
          clearInterval(this.stationStatusInt);
          this.stopMarquee();
          this.showData = null;
          return;
        }
        if (this.oldStationStatus != res.data.status || this.oldStationId != res.data.id) {
          this.getShowData();
          this.oldStationStatus = res.data.status;
          this.oldStationId = res.data.id;
        }
      },
      loadStationStatus () {
        clearInterval(this.stationStatusInt);
        let that = this;
        this.getNowStationStatus();
        this.stationStatusInt = setInterval(() => {
          that.getNowStationStatus();
        }, 1000);
      }
    },
    created () {
      this.init();
    },
    activated () {
      console.log(this.type + ' 启用');
      if (this.waitingExaminationTableBodyBox) {
        this.getShowData();
      }
    },
    deactivated () {
      console.log(this.type + ' 停用');
      clearTimeout(this.stationInt);
      clearInterval(this.stationStatusInt);
      this.stopMarquee();
    },
    destroyed () {
      console.log(this.type + ' 注销');
      clearTimeout(this.stationInt);
      clearInterval(this.stationStatusInt);
      this.stopMarquee();
    },
    mounted () {
      this.getShowData();
      //页面dom稳定后调用
      this.$nextTick(function () {
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      });
      console.log(this.type + ' 初始化');
    },
//    watch: {
//      viewType (val) {
//        console.log(val + '--->' + this.type)
//        this.stopMarquee()
//        if (val == this.type) {
//          this.$nextTick(() => this.startMarqueeUp())
//        }
//      },
//    },
    components: {}
  };

</script>
