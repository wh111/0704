<template>
  <!-- 新建申请 -->
  <el-form>
    <el-form-item label="项目：">{{ showData.reservePojectName }}</el-form-item>
    <el-form-item label="日期：">{{ showData.reserveDate }}</el-form-item>
    <el-form-item label="房间：">
      <el-tooltip v-if="hoverRoomId===showData.roomId" effect="light" placement="left" :open-delay="600">
        <template slot="content">
          <room-view style="width: 500px;" isShowLoading="true" :id="showData.roomId" :that="self"></room-view>
        </template>
        <span style="cursor: pointer;">{{ showData.roomNum }}</span>
      </el-tooltip>
      <span style="cursor: pointer;" v-else @mouseleave="roomMouseleave()" @mouseenter="roomMouseenter()">
        {{ showData.roomNum }}
      </span>
    </el-form-item>
    <el-form-item label="时间：">{{ showData.startTime + '-' + showData.endTime }}
    </el-form-item>
  </el-form>
</template>

<script>
  import api from './api';
  import roomView from '../room/roomManage/roomManage_view'; // 房间查看

  export default {
    props: ['operailityData'],
    data () {
      return {
        self: this,
        hoverRoomId: '',
        // 临时数据
        reservePoject: '', // 项目
        activeName: '', // 日期视图
        selRoomIndex: -1, // 房间
        selTimeSlotIndex: -1, // 时间段
        // 展示数据
        days: [], // 日期
        tableBody: [], // 房间预约
        showData: {
          reserveProjectName: ''
        }
      };
    },
    methods: {
      init () {
        this.getProject();
      },
      // 房间划入事件
      roomMouseenter () {
        this.hoverRoomId = this.showData.roomId;
      },
      // 房间滑出事件
      roomMouseleave () {
        this.hoverRoomId = '';
      },
      /*********************************************** 数据获取 ***********************************/
      // 获取当前登录用户所能申请的项目列表
      getProject () {
        this.ajax({
          ajaxSuccess: res => {
            this.showData = res.data || {};
//            this.days = [res.data.reserveDate];
//            this.activeName = res.data.reserveDate;
//            this.getRoomInfoByDay()
          },
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        });
      },
      // 获取项目日期对应的房间信息
      getRoomInfoByDay () {
        this.ajax({
          ajaxSuccess: res => {
            this.tableBody = res.data || {};
            // 时间段
            for (let i in res.data.timeSetList) {
              if (this.showData.timeSetId === res.data.timeSetList[i].timeSetId) {
                this.selTimeSlotIndex = i;
                break;
              }
            }
            // 房间
            for (let j in res.data.roomList) {
              if (this.showData.roomId === res.data.roomList[j].roomId) {
                this.selRoomIndex = j;
                break;
              }
            }
          },
          ajaxParams: {
            url: api.dateGet.path,
            method: api.dateGet.method,
            params: {
              date: this.days[0],
              reserveProjectId: this.showData.reserveProjectId
            }
          }
        });
      }
    },
    created () {
      this.init();
    },
    components: {
      roomView
    }
  };

</script>

<style lang="scss">
  /* 新建申请 */

  .el-table th > div.bpatHeader {
    height: 100px;
    width: 100px;
    text-align: center;
    line-height: 100px;
    background: url(~@/assets/ambuf/images/tHeadBg.png) top left 100% no-repeat;
    background-size: 100%;
    position: relative;
    &::before {
      content: '时间';
      line-height: 1;
      position: absolute;
      right: 10px;
      top: 10px;
    }
    &::after {
      content: '房间';
      line-height: 1;
      position: absolute;
      left: 10px;
      bottom: 10px;
    }
  }

  .bpaBody {
    .NO {
      background-color: #c6c6c6;
    }
    .select {
      background-color: #fb882a;
    }
    .optional {
      background-color: #34ff3e;
    }
    .tenancyEnds {
      background-color: #fa0017;
    }
    .el-table__row {
      p {
        width: 24px;
        height: 24px;
        text-align: center;
        line-height: 24px;
        border: 1px solid #dfe6ec;
        border-radius: 12px;
        cursor: pointer;
      }
    }
  }

  .bpaColorBox {
    padding: 16px 0 10px 0;
    span {
      position: relative;
      margin-right: 20px;
      line-height: 20px;
      font-size: 14px;
      &::before {
        content: '　';
        width: 20px;
        height: 20px;
        display: inline-block;
        margin-right: 5px;
      }
    }
    .NO::before {
      background-color: #c6c6c6;
    }
    .select::before {
      background-color: #fb882a;
    }
    .optional::before {
      background-color: #34ff3e;
    }
    .tenancyEnds::before {
      background-color: #fa0017;
    }
  }

</style>
