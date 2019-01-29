<template>
  <div class="editForm">
    <el-form :model="info" ref="info" label-width="120px" class="resetFormItemHeight esBasicInfo">
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="考站名称：" prop="stationName">
            <el-input v-model="info.stationName" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="考站类型：" prop="stationType">
            <el-select v-model="info.stationType" filterable placeholder="请选择">
              <el-option v-for="(item,index) in typeOption" v-if="item.value !== ''" :key="index" :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
            <!--<el-radio class="radio" v-for="(item,index) in typeOption" :key="index" v-model="info.stationType" v-if="item.value" :label="item.value">{{ item.label }}</el-radio>-->
          </el-form-item>
        </el-col>

        <!--<el-col :span="8" :offset="2">
          <el-form-item label="单次考核人数：" prop="number">
            <el-input v-model="info.number" placeholder="单次考核人数"></el-input>
          </el-form-item>
        </el-col>-->

        <el-col :span="8" :offset="2">
          <el-form-item label="考试时间：" prop="timeCount">
            <template v-if="sceneType === 'STANDARD'">
              <el-select v-model="info.timeCount" placeholder="请选择">
                <el-option v-for="item in 10" :key="item" :label="Number((item * basicsTime).toFixed(1))" :value="item">
                </el-option>
              </el-select>
            </template>
            <el-input v-model.number="info.timeCount" :maxlength="3" v-else></el-input>
          </el-form-item>
        </el-col>

        <template v-if="info.stationType==='ORDINARY'">
          <el-col :span="8" :offset="2">
            <el-form-item label="抽题类型：" prop="randomType">
              <el-select v-model="info.randomType" filterable placeholder="请选择">
                <el-option v-for="item in randomTypeOption" v-if="item.value !== ''" :key="item.value"
                           :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!--<el-col :span="8" :offset="2">
            <el-form-item label="抽题数量：" prop="randomNum">
              <el-input v-model="info.randomNum" placeholder="抽题数量"></el-input>
            </el-form-item>
          </el-col>-->
        </template>

        <el-col :span="8" :offset="2">
          <el-form-item label="专业：" prop="randomType">
            <el-select v-model="room.specialty" filterable placeholder="请选择">
              <el-option label="全部" :value="0"></el-option>
              <template v-if="specialtyList.length">
                <el-option v-for="item in specialtyList" :key="item" :label="item" :value="item"></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item label="房间：" prop="roomId" style="height: 37.5px">
            <span class="roomNumber">{{ room.roomNum }}</span>
            <el-button type="info" @click="openSelectRoom">选择房间</el-button>
          </el-form-item>
        </el-col>

        <el-col align="center" style="margin-top:10px;">
          <el-button type="success" @click="next">下一步</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- 模态框 选择房间（selectRoom） -->
    <Modal :mask-closable="false" v-model="selectRoomModal" height="200" class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="contentHeader.selectRoomId"></modal-header>
      <select-room v-if="selectRoomModal" :unSelectRoom="unSelectRoom" @cancel="cancel" @select="selectRoom" :selectOne="true" :disSelect="true"></select-room>
      <div slot="footer"></div>
    </Modal>

  </div>
</template>

<script>
  let Util = null
  import typeOption from './typeOption' // 选项
  import randomTypeOption from '../randomTypeOption' // 抽题类型
  import selectRoom from '../../../common/selectRoom' // 选择房间
  // import selectTeacher from '../../../common/selectUserMoreSearch'; // 选择人员
  // import selectTeacher from './examineIntervalSetInfo_selectTeacher'; // 选择人员

  export default {
    data () {
      return {
        sceneType: '', // 当前考站类型
        basicsTime: '', // 当前考核场次的考试基础时间
        typeOption,
        randomTypeOption,
        specialtyList: [], // 专业
        unSelectRoom: [],
//        unSelectUser: [],
        selectRoomModal: false,
//        selectTeacherModal: false,
        info: {}, // 考站信息
        room: {}, // 考场房间
//        initUser: [], // 选中的监考老师
//        teacher: [], // 监考老师
//        sumWeigth: '', // 权重
        contentHeader: {
          selectRoomId: {
            id: 'selectRoomId',
            title: '选择房间',
          },
//          selectTeacherId: {
//            id: 'selectTeacherId',
//            title: '选择监考老师',
//          },
        },
      }
    },
    methods: {
      // 下一步
      next () {
        if (!this.checkData()) {return}
        this.$emit('goStep', 2)
      },
      /**************** 数据检测 ********************/
      checkData () {
        // 考站名称
        if (!this.info.stationName) {
          this.errorMess('请填写考站名称！')
          return false
        }
        // 考试时间
        if (this.sceneType !== 'ORDINARY' && !(+this.info.timeCount) > 0) {
          this.errorMess('考试时间必须大于0！')
          return false
        }
        // 房间
        if (!this.room.roomId) {
          this.errorMess('请选择房间！')
          return false
        }
        return true
      },
      /**************** 选择房间 ********************/
      selectRoom (val) {
        let roomVal = val[0] || val
        let room = this.room // room 信息
        // 缓存操作不进行禁止选择，因为不点击完成是不会记录该数据的
        if (room.roomId !== roomVal.id) { // 当前房间更换
          // 从禁止选择房间数组中删除该房间
          this.$store.commit('examineInterval/temp/removeUnSelectRoom', room.roomId)
        }
        room.roomId = roomVal.id
        room.roomNum = roomVal.roomNum
        room.roomName = roomVal.roomName
        // 把选中的房间加入到不可再次选择的数据中
        this.$store.commit('examineInterval/temp/addUnSelectRoom', room.roomId)
        this.cancel('selectRoom')
      },
      /*----------- 模态框 -------------*/
      // 选择房间
      openSelectRoom () {
        this.openModel('selectRoom')
      },
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true
      },
    },
    components: {
      selectRoom,
    },
    created () {
      Util = this.$util
      let temp = this.$store.state.examineInterval.temp // 从缓存中读取数据
      let info = this.$store.state.examineInterval.station.info // 从缓存中获取当前考核场次的公共信息
      this.info = temp.info // 考站信息
      this.room = temp.room // 当前考站对应的房间
      this.basicsTime = info.basicsTime // 考核时间基础
      this.sceneType = info.sceneType // 考核场次类型
      this.unSelectRoom = temp.unSelectRoom
      this.specialtyList = this.$store.state.examineInterval.room.specialtyList // 专业
    },
  }

</script>

<style lang="scss">
  .roomNumber {
    margin-right: 10px;
    &:empty {
      display: none;
    }
  }

  .esBasicInfo {
    .el-form-item {
      height: 38px !important;
    }
  }
</style>
