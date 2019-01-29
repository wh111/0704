<template>
  <!-- 设置考站信息 -->
  <div>
    <!-- 顶部步骤条 -->
    <el-steps :space="100" :active="active" finish-status="success" :align-center="true" :center="true" space="200px">
      <el-step title="基本信息"></el-step>
      <el-step title="考核内容"></el-step>
      <el-step title="信息预览"></el-step>
    </el-steps>
    <!-- 视图 -->
    <infoBasic v-if="active === 1" @goStep="goStep" style="margin-top:30px;"></infoBasic>
    <infoContent v-if="active === 2" @goStep="goStep"></infoContent>
    <infoView v-if="active === 3" @goStep="goStep" :basicsTime="basicsTime" :info="info" :room="room" :teacher="teacher" style="margin-top:20px;font-size:14px;">
      <div slot="footer">
        <el-row>
          <el-col :span="8" :offset="4" align="center" style="margin-top:20px;">
            <el-button type="warning" @click="goStep(2)">上一步</el-button>
          </el-col>
          <el-col :span="8" align="center" style="margin-top:20px;">
            <el-button type="success" @click="done">完成</el-button>
          </el-col>
        </el-row>
      </div>
    </infoView>
  </div>
</template>

<script>
  import infoBasic from './examineIntervalSetInfo_basic'; // 基本信息
  import infoContent from './examineIntervalSetInfo_content'; // 考核内容
  import infoView from '../examineIntervalInfo/examineIntervalInfo'; // 信息查看

  export default {
    data() {
      return {
        self: this,
        index: 0,
        cIndex: 0,
        basicsTime: 1, // 考试基数时间
        active: 1,
        info: {}, // 基本信息
        room: {}, // 考站房间
        teacher: [] // 监考老师
      }
    },
    methods: {
      goStep(setp) {
        this.active = setp
      },
      done() {
        // 数据同步到状态中
        this.saveData();
        this.$emit('cancel', 'setInfo');
      },
      // 操作的数据保存到状态中
      saveData() {
        let exm = this.$store.state.examineInterval;
        let temp = exm.temp;
        let info = this.$util._.defaultsDeep({}, temp.info);
        let room = this.$util._.defaultsDeep({}, temp.room);
        let teacher = this.$util._.defaultsDeep([], temp.teacher);
        let station = exm.room;
        let roomInfo = station.roomInfo;
        let unSelectRoom = this.$util._.defaultsDeep([], temp.unSelectRoom);
        let unSelectUser = this.$util._.defaultsDeep({}, temp.unSelectUser);

        // SP考站重新计算时间
        let stationType = info.stationType;
        if (stationType === 'SP') {
          info.timeCount = 0; // 重置时间
          info.stationContentList.map(item => {
            info.timeCount += item.timeCount;
          })
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
              }
            }
          })
        })

        // 更新可选择的剧本
        this.$store.commit('examineInterval/room/initScriptList', scriptList)
        this.$emit('done')
      }
    },
    created() {
      let todoIndex = this.$store.getters['examineInterval/roomIndex/get']; // 获取当前操作索引
      let thisStation = this.$store.state.examineInterval.room.roomList[todoIndex.index]; // 当前考站
      let info = this.$store.state.examineInterval.room.roomInfo[todoIndex.index]; // 考站共用信息
      let room = thisStation.room[todoIndex.cIndex]; // 考站所在房间
      let teacher = thisStation.teacher[todoIndex.cIndex]; // 考站的监考老师
      let unSelectRoom = this.$store.state.examineInterval.room.unSelectRoom;
      let unSelectUser = this.$store.state.examineInterval.room.unSelectUser;
      // 缓存当前操作的考站的信息
      this.$store.commit('examineInterval/temp/initData', {
        info,
        room,
        teacher,
        unSelectRoom,
        unSelectUser,
      });
      let tempData = this.$store.state.examineInterval.temp;
      this.info = tempData.info;
      this.room = tempData.room;
      this.teacher = tempData.teacher;
      this.index = todoIndex.index;
      this.cIndex = todoIndex.cIndex;
      this.basicsTime = this.$store.state.examineInterval.station.info.basicsTime;
    },
    components: {
      infoBasic,
      infoContent,
      infoView
    },
    destroyed() {
      this.$store.commit('examineInterval/temp/destroy');
    },
  }

</script>
