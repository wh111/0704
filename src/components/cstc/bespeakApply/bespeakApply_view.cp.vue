<template>
  <!-- 新建申请 -->
  <div>
    <el-form>
      <fieldset>
        <legend>&nbsp;&nbsp;项目&nbsp;&nbsp;</legend>
        <h3>{{ showData.reservePojectName }}</h3>
      </fieldset>
    </el-form>
    <div class="bpaColorBox">
      <span class="optional">可预约</span>
      <span class="tenancyEnds">已约满</span>
      <span class="NO">未开放</span>
      <span class="select">已预约</span>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="(item,index) in days" :key="index" :label="item" :name="item+''"></el-tab-pane>
    </el-tabs>
    <table class="el-table el-table--border">
      <thead>
        <tr>
          <th class="is-leaf">
            <div class="cell bpatHeader">
              预约
            </div>
          </th>
          <th class="is-leaf" v-for="item in tableBody.timeSetList" :key="item.timeSetId">
            <div class="cell">{{ item.courseTime }}</div>
          </th>
        </tr>
      </thead>
      <tbody class="bpaBody">
        <tr class="el-table__row" v-for="(roomItem,roomIndex) in tableBody.roomList" :key="roomItem.roomId">
          <td>
            <div class="cell">{{ roomItem.roomNum }}</div>
          </td>
          <td v-for="(dataItem,index) in roomItem.dataList" :key="roomItem.roomId + '-' + index" align="center">
            <div class="cell">
              <p v-if="selRoomIndex == roomIndex && selTimeSlotIndex == index" class="select" title="已预约">约</p>
              <p v-else :class="dataItem" :title="getTitle(dataItem)">{{ dataItem | dataListType }}</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import api from './api';
  export default {
    props: ['operailityData'],
    data() {
      return {
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
      }
    },
    methods: {
      init() {
        this.getProject();
      },
      /*********************************************** 数据获取 ***********************************/
      // 获取当前登录用户所能申请的项目列表
      getProject() {
        this.ajax({
          ajaxSuccess: res => {
            this.showData = res.data || {};
            this.days = [res.data.reserveDate];
            this.activeName = res.data.reserveDate;
            this.getRoomInfoByDay()
          },
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        })
      },
      // 获取项目日期对应的房间信息
      getRoomInfoByDay() {
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
        })
      },
      /************************************* 其他 **************************************/
      // 获取提示
      getTitle(val) {
        let type = {
          optional: "可预约",
          tenancyEnds: "已约满",
          NO: "未开放"
        }
        return type[val] || val
      },
    },
    filters: {
      // 可预约简写
      dataListType(val) {
        let type = {
          optional: "预",
          tenancyEnds: "满",
          NO: "X"
        }
        return type[val] || val
      }
    },
    created() {
      this.init()
    }
  }

</script>

<style lang="scss">
  /* 新建申请 */

  .el-table th>div.bpatHeader {
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
