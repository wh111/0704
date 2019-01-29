<template>
  <!-- 设置考站信息 -->
  <div>
    <!-- 顶部步骤条 -->
    <el-steps v-if="showSteps" :active="active" finish-status="success" :align-center="true" :center="true" space="160px">
      <el-step title="基本信息"></el-step>
      <el-step title="考核内容"></el-step>
      <el-step title="监考老师"></el-step>
      <el-step title="信息预览"></el-step>
    </el-steps>
    <!-- 视图 -->
    <info-basic v-if="active === 1" @goStep="goStep" @done="done" @showStep="showStep" style="margin-top:30px;"></info-basic>
    <info-content v-if="active === 2" @goStep="goStep"></info-content>
    <info-teacher v-if="active === 3" @goStep="goStep"></info-teacher>
    <info-view v-if="active === 4" @goStep="goStep" :basicsTime="basicsTime" :info="info" :room="room" :teacher="teacher"
               style="margin-top:20px;font-size:14px;">
      <div slot="footer">
        <el-row>
          <el-col :span="8" :offset="4" align="center" style="margin-top:20px;">
            <el-button type="warning" @click="goStep(3)">上一步</el-button>
          </el-col>
          <el-col :span="8" align="center" style="margin-top:20px;">
            <el-button type="success" @click="done">完成</el-button>
          </el-col>
        </el-row>
      </div>
    </info-view>
  </div>
</template>

<script>
  import infoBasic from './examineIntervalSetInfo_basic'; // 基本信息
  import infoContent from './examineIntervalSetInfo_content'; // 考核内容
  import infoTeacher from './examineIntervalSetInfo_teacher'; // 监考老师
  import infoView from '../examineIntervalInfo/examineIntervalInfo'; // 信息查看

  export default {
    data () {
      return {
        self: this,
        index: 0,
        cIndex: 0,
        showSteps: true,
        basicsTime: 1, // 考试基数时间
        active: 1,
        info: {}, // 基本信息
        room: {}, // 考站房间
        teacher: [] // 监考老师
      };
    },
    methods: {
      goStep (setp) {
        if (setp == 4) {
          this.teacher = this.$store.state.examineInterval.temp.teacher;
        }
        this.active = setp;
      },
      done () {
        // 数据同步到状态中
        this.saveData();
        this.$emit('cancel', 'setInfo');
      },
      showStep (b) {
        if (this.showSteps == b) {
          return;
        }
        this.showSteps = b;
      },
      // 操作的数据保存到状态中
      saveData () {
        let exm = this.$store.state.examineInterval;
        let temp = exm.temp;
        let info = this.$util._.defaultsDeep({}, temp.info);
        let room = this.$util._.defaultsDeep({}, temp.room);
        let teacher = this.$util._.defaultsDeep([], temp.teacher);
        console.log(teacher, temp.teacher);
        let station = exm.room;
        let roomInfo = station.roomInfo;
        let unSelectRoom = this.$util._.defaultsDeep([], temp.unSelectRoom);
        let unSelectUser = this.$util._.defaultsDeep({}, temp.unSelectUser);
        // let allRoom = this.$util._.defaultsDeep({}, temp.allRoom || null);

        // SP考站重新计算时间
        let stationType = info.stationType;
        if (stationType === 'SP') {
          info.timeCount = 0; // 重置时间
          info.stationContentList.map(item => {
            info.timeCount += item.timeCount;
          });
        }

        // 同步数据到公共状态中
        station.roomInfo[this.index] = info;
        station.roomList[this.index].room[this.cIndex] = room;
        station.roomList[this.index].teacher[this.cIndex] = teacher;
        station.unSelectRoom = unSelectRoom;
        station.unSelectUser = unSelectUser;

        // 获取当前已有考站的考站信息
        let scriptList = {};
        roomInfo.map(item => {
          item.stationContentList.map(sItem => {
            if (sItem.scriptId && !scriptList[sItem.scriptId]) {
              scriptList[sItem.scriptId] = {
                scriptId: sItem.scriptId,
                scriptName: sItem.scriptName
              };
            }
          });
        });

        // 更新可选择的剧本
        this.$store.commit('examineInterval/room/initScriptList', scriptList);
        // 更新所有房间
        // this.$store.commit('examineInterval/room/initAllRoom', allRoom);
        this.$emit('done');
      }
    },
    created () {
      let todoIndex = this.$store.getters['examineInterval/roomIndex/get']; // 获取当前操作索引
      let examineInterval = this.$store.state.examineInterval;
      let thisRoom = examineInterval.room;
      let thisStation = thisRoom.roomList[todoIndex.index]; // 当前考站
      let info = thisRoom.roomInfo[todoIndex.index]; // 考站共用信息
      let room = thisStation.room[todoIndex.cIndex]; // 考站所在房间
      let teacher = thisStation.teacher[todoIndex.cIndex]; // 考站的监考老师
      let unSelectRoom = thisRoom.unSelectRoom;
      let unSelectUser = thisRoom.unSelectUser;
      let allRoom = thisRoom.allRoom;
      // 缓存当前操作的考站的信息
      this.$store.commit('examineInterval/temp/initData', {
        info,
        room,
        teacher,
        unSelectRoom,
        unSelectUser,
        // allRoom
      });
      let tempData = examineInterval.temp;
      this.info = tempData.info;
      this.room = tempData.room;
      this.teacher = tempData.teacher;
      this.index = todoIndex.index;
      this.cIndex = todoIndex.cIndex;
      this.basicsTime = examineInterval.station.info.basicsTime;
    },
    components: {
      infoBasic,
      infoContent,
      infoTeacher,
      infoView
    },
    destroyed () {
      this.$store.commit('examineInterval/temp/destroy');
    }
  };

</script>
