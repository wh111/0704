<template>
  <!-- 新建申请 -->
  <div>
    <el-form>
      <fieldset>
        <legend>&nbsp;&nbsp;可选项目&nbsp;&nbsp;</legend>
        <h3 v-if="!projectData.length">暂无可预约项目</h3>
        <el-radio-group v-model="reservePoject" @change="selectProject" class="baProBox">
          <el-radio v-for="item in projectData" :key="item.reservePojectId" :label="item">{{ item.name }}</el-radio>
        </el-radio-group>
      </fieldset>
    </el-form>

    <el-row>
      <el-col :span="16">
        <div class="bpaColorBox">
          <span class="optional">可预约</span>
          <span class="tenancyEnds">已约满</span>
          <span class="NO">未开放</span>
          <span class="select">已预约</span>
        </div>
      </el-col>
      <el-col :span="8" align="right">
        <el-date-picker v-if="showSelectDay" v-model="pickerSelectDay" type="date" placeholder="选择日期" :picker-options="pickerOptions" @change="getAllDay" style="margin-top: 5px;"> </el-date-picker>
      </el-col>
    </el-row>


    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in days" :key="index" :label="item" :name="item+''"></el-tab-pane>
    </el-tabs>

    <template v-if="projectData.length">
      <table class="el-table el-table--border" >
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
                <p v-if="isObsolete(tableBody.timeSetList[index].courseTime)" class="NO" title="未开放">X</p>
                <p v-else-if="selRoomIndex === roomIndex && setTimeSlotIndex === index" class="select" title="已预约" @click="initSelectTime(false)">约</p>
                <p v-else :class="dataItem" :title="getTitle(dataItem)" @click="selectThisTime(roomItem,roomIndex,index,dataItem)">{{ dataItem | dataListType }}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div align="center" style="margin-top:20px;">
        <el-button type="success" @click="subData('UNREPORTED')">保存</el-button>
        <el-button type="primary" @click="subData('START')">上报</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </template>
  </div>
</template>

<script>
  import api from './api';
  export default {
    data() {
      return {
        // 临时数据
        reservePoject: '', // 项目
        activeName: '', // 日期视图
        selRoomIndex: -1, // 房间
        setTimeSlotIndex: -1, // 时间段
        // 展示数据
        showSelectDay: false, // 是否显示日期选框
        pickerSelectDay: '', // 选择的日期
        days: [], // 日期
        projectData: {}, // 可预约项目
        tableBody: [], // 房间预约
        // 提交数据
        formValidate: {
          reserveProjectId: "", // 预约项目id
          reserveProjectName: "", // 预约项目名称
          roomId: "", // 房间id
          roomNum: "", // 房间号
          reserveDate: "", // 预约日期
          timeSetId: "", // 时间段id
          status: "", // 预约状态 UNREPORTED|待上报 START|待使用
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
      }
    },
    methods: {
      init() {
        this.getProjectList();
      },
      /*********************************************** 数据获取 ***********************************/
      // 获取当前登录用户所能申请的项目列表
      getProjectList() {
        this.ajax({
          ajaxSuccess: res => {
            this.projectData = res.data || [];
            if (res.data.length) { // 默认选中第一个
              this.reservePoject = res.data[0];
            }
          },
          ajaxParams: {
            url: api.myList.path,
            method: api.myList.method
          }
        })
      },
      // 获取日期
      getDaysForServer() {
        this.ajax({
          ajaxSuccess: res => {
            this.days = res.data || [];
            this.showSelectDay = false;
            if (!this.days.length) {
              this.getAllDay() // 全天候计算日期
            }else{
              this.activeName = this.days[0];
              this.selectDay(this.days[0]); // 指定日期
            }
          },
          ajaxParams: {
            url: api.dateList.path,
            method: api.dateList.method,
            params: {
              reserveProjectId: this.formValidate.reserveProjectId
            }
          }
        })
      },
      /**
       * 计算全天候的日期
       * 指定日期后的五天日期
       * */
      getAllDay(day){
        let now = (day ? new Date(day) : new Date()).getTime();
        this.days.length = 0;
        for(let i=0;i<5;i++){
          this.days.push(this.conductDate(new Date(now + (i * 24*60*60*1000)),'yyyy-MM-dd'))
        }
        this.showSelectDay = true;
        this.activeName = this.days[0];
        this.selectDay(this.days[0]); // 指定日期
      },
      // 获取项目日期对应的房间信息
      getRoomInfoByDay() {
        this.ajax({
          ajaxSuccess: res => this.tableBody = res.data || {},
          ajaxParams: {
            url: api.dateGet.path,
            method: api.dateGet.method,
            params: {
              date: this.formValidate.reserveDate,
              reserveProjectId: this.formValidate.reserveProjectId
            }
          }
        })
      },
      /************************************* 数据选择 **********************************/
      // 选择项目
      selectProject(data) {
        this.formValidate.reserveProjectId = data.reservePojectId;
        this.formValidate.reserveProjectName = data.name;
        // 加载项目的日期
        this.getDaysForServer()
      },
      // 选择日期
      selectDay(date) {
        this.formValidate.reserveDate = date;
        this.initSelectTime();
        this.getRoomInfoByDay();
      },
      // 时间段在今天是否已过期
      isObsolete(dataItem) {
        let selectTime = new Date(this.activeName + ' ' + dataItem.split('-')[0]).getTime();
        let now = new Date().getTime();
        return now > selectTime
      },
      /************************************* 按钮事件 **********************************/
      // 日期选择
      handleClick() {
        this.selectDay(this.activeName)
      },
      /**
       * 选择时间段
       * roomInfo 房间信息
       * roomIndex 房间索引
       * timeSlotIndex 时间段索引
       * timeSlotType 时间段状态
       * */
      selectThisTime(roomInfo, roomIndex, timeSlotIndex, timeSlotType) {
        if (timeSlotType === 'tenancyEnds' || timeSlotType === 'NO') { // 未开放和已约满
          return
        }
        this.formValidate.roomId = roomInfo.roomId;
        this.formValidate.roomNum = roomInfo.roomNum;
        this.formValidate.timeSetId = this.tableBody.timeSetList[timeSlotIndex].timeSetId;
        this.selRoomIndex = roomIndex;
        this.setTimeSlotIndex = timeSlotIndex;
      },
      // 提交数据
      subData(status) {
        let msg = status === 'START' ? '上报' : '保存';
        this.formValidate.status = status;
        if (this.checkSub()) {
          this.ajax({
            type: 'add',
            successTitle: `${msg}成功`,
            errorTitle: `${msg}失败`,
            ajaxParams: {
              url: api.add.path,
              method: api.add.method,
              data: this.$util._.defaultsDeep({}, this.formValidate)
            }
          })
        }
      },
      // 取消
      cancel() {
        this.$emit('cancel', 'add')
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
      // 初始化预约数据
      initSelectTime() {
        this.selRoomIndex = -1;
        this.setTimeSlotIndex = -1;
        this.formValidate.roomId = '';
        this.formValidate.roomNum = '';
        this.formValidate.timeSetId = '';
      },
      // 检测是否可提交
      checkSub() {
        if (!this.formValidate.reserveProjectId) {
          this.errorMess('请选择预约项目');
          return false
        }
        if (!this.formValidate.reserveDate) {
          this.errorMess('请选择预约项目日期');
          return false
        }
        if (!this.formValidate.roomId) {
          this.errorMess('请选择预约项目房间');
          return false
        }
        if (!this.formValidate.timeSetId) {
          this.errorMess('请选择预约项目时间段');
          return false
        }
        return true
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

  .baProBox{
    .el-radio{
      margin: 8px;
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
