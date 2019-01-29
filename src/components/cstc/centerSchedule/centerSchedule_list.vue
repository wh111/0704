<template>
  <!-- 中心日程 -->
  <div ref="roomContent">
    <el-row>
      <el-form label-width="80px" :inline="true" :model="formValidate" ref="formValidate" :rules="rules">
        <el-col :span="4">
          <el-form-item labelWidth="0">
            <el-button @click="changeView('cad')" :type="showType==='cad'?'success':''">CAD视图</el-button>
          </el-form-item>
          <el-form-item labelWidth="0">
            <el-button @click="changeView('')" :type="showType===''?'success':''">普通视图</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="20" align="right">
          <el-form-item label="日期：" prop="date" required>
            <el-date-picker v-model="formValidate.date" type="date" placeholder="选择日期" :editable="false">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="时间：" prop="startTime">
            <el-time-select placeholder="起始时间" v-model="formValidate.startTime"
                            :picker-options="{start: '06:30',step: '00:05',end: '22:00'}">
            </el-time-select>
          </el-form-item>
          <el-form-item label-width="0" prop="endTime">
            <el-time-select placeholder="结束时间" v-model="formValidate.endTime"
                            :picker-options="{ start: formValidate.startTime || '06:30',step: '00:05', end: '22:30'}"></el-time-select>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="search">搜索</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div class="cRoomType">
      <span class="PRACTISE">练习</span>
      <span class="EXAM">考核</span>
      <span class="OTHER">其他</span>
    </div>
    <div ref="roomBox" class="cRoomBox" :style="{height:roomContentHeight + 'px'}">
      <!-- CAD图 -->
      <cad-view class="cRoomCadBox" v-if="showType === 'cad'" :floorData="floorData" :dataNum="getDataNum"></cad-view>
      <!-- 其他房间 -->
      <el-row v-else>
        <p v-if="noDataTips" class="cRoomNoDataTips">暂无相关日程</p>
        <el-col v-else>
          <el-col v-for="(item,index) in showData" class="cRoomItem" :key="index">
            <el-col :span="2" class="cRoomFloor">
              {{ index }}楼
            </el-col>
            <el-col :span="22" class="cRoomList">
              <div class="cRoomIconItem" v-for="(room,rIndex) in item" :key="rIndex" :class="[room.employType]">
                <p>{{ room.roomNum }}</p>
              </div>
            </el-col>
          </el-col>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {
    centerSchedule as rules
  } from '../rules';
  import cadView from './centerSchedule_cad';

  export default {
    data() {
      return {
        rules,
        showType: 'cad',
        roomContentHeight: 0,
        getDataNum: 0,
        //form表单bind数据
        formValidate: {
          date: new Date(), // 日期
          startTime: '06:30', // 开始时间
          endTime: '06:35', // 结束时间
        },
        noDataTips: false,
        showData: {},
        floorData: {
          // f1:{ // 楼层
          //   101: '' // 房间号对应当前状态
          // }
        },
      }
    },
    methods: {
      init() {
        this.getDataForServer();
      },
      // 切换视图
      changeView(type) {
        type !== this.showType && (this.showType = type)
      },
      // 搜索
      search() {
        if (!this.submitForm('formValidate')) {
          return
        }
        this.getDataForServer()
      },
      // 获取数据
      getDataForServer() {
        let opt = {
          ajaxSuccess: "getDataSuccess",
          ajaxParams: {
            url: 'center/schedule',
            method: 'get',
            params: this.$util._.defaultsDeep({}, this.formValidate),
          }
        };
        opt.ajaxParams.params.date = this.conductDate(opt.ajaxParams.params.date, 'yyyy-MM-dd')
        opt.ajaxParams.params.startTime += ':00';
        opt.ajaxParams.params.endTime += ':00';
        this.ajax(opt);
      },
      // 数据处理
      getDataSuccess(res) {
        let temp = {};
        if (res.data && res.data.length) {
          res.data.map(item => {
            if (temp[item.floor] instanceof Array) {
              temp[item.floor].push(item)
            } else {
              temp[item.floor] = [item];
            }
            if (!this.floorData['f' + item.floor]) {
              this.floorData['f' + item.floor] = {};
            }
            this.floorData['f' + item.floor][item.roomNum] = item.employType
          })
          this.noDataTips = false;
        } else {
          this.noDataTips = true;
        }
        this.showData = temp;
        this.getDataNum++;
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let roomContent = this.$refs.roomContent.parentNode.offsetHeight;
        let roomBox = this.$refs.roomBox.offsetTop;
        this.roomContentHeight = roomContent - roomBox - 16;
      },
    },
    created() {
      this.init()
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = this.$util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    components: {
      cadView
    },
  }

</script>

<style lang="scss">
  /* 中心日程 */
  .cRoomItem {
    border-bottom: 1px solid #bfcbd9;
  }

  .cRoomList {
    padding: 20px;
    border-left: 1px solid #bfcbd9;
  }

  .cRoomBox {
    overflow: auto;
  }

  .cRoomType {
    padding-bottom: 20px;
    span {
      font-size: 14px;
      margin-right: 10px;
      &:before {
        content: ' ';
        width: 16px;
        height: 16px;
        display: block;
        float: left;
        margin: 2px 4px 0;
        background-color: #8e8e8e;
      }
      &.PRACTISE:before {
        background-color: #38c57d;
      }
      &.EXAM:before {
        background-color: #e83548;
      }
      &.OTHER:before {
        background-color: #8e8e8e;
      }
    }
  }

  .cRoomFloor {
    text-align: center;
    line-height: 126px;
  }

  .cRoomIconItem {
    width: 80px;
    height: 80px;
    position: relative;
    display: inline-block;
    z-index: 1;
    background-image: url(/static/img/room.08b0856.png);
    background-size: 100%;
    margin: 10px;
    p {
      text-align: center;
      margin-top: 34px;
    }
    &.PRACTISE {
      background-image: url(~@/assets/ambuf/images/room_ONGOING.png);
    }
    &.EXAM {
      background-image: url(~@/assets/ambuf/images/room_FINISH.png);
    }
    // &.OTHER {
    //  background-image: url(~@/assets/ambuf/images/room_ONGOING.png);
    // }
  }

  .cRoomNoDataTips {
    text-align: center;
    line-height: 400px;
  }

</style>
