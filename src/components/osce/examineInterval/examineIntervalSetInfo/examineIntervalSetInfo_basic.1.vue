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

        <el-col :span="8" :offset="2" v-if="info.stationType !== 'SP'">
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

        <el-col :span="18" :offset="2">
          <el-form-item label="监考老师：" prop="roomTeacherList">
            <el-table border show-summary :summary-method="getSummaries" :data="teacher">
              <el-table-column label="监考老师" prop="teacherName" show-overflow-tooltip></el-table-column>
              <el-table-column label="权重（合计必须为100%）" prop="weight">
                <template scope="scope">
                  <el-input style="width:60px;" :maxlength="3" v-model="scope.row.weight" size="small"></el-input>
                  <span style="margin:0 10px;">%</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template scope="scope">
                  <el-button type="danger" @click="removeTeacher(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="info" style="margin-top:10px;" @click="openSelectTeacher">选择老师</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col align="center" style="margin-top:10px;">
          <el-button type="success" @click="next">下一步</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- 模态框 选择房间（selectRoom） -->
    <Modal :mask-closable="false" v-model="selectRoomModal" height="200" class-name="vertical-center-modal"
           :width="800">
      <modal-header slot="header" :content="contentHeader.selectRoomId"></modal-header>
      <select-room v-if="selectRoomModal" :unSelectRoom="unSelectRoom" @cancel="cancel" @select="selectRoom"
                   :selectOne="true"
                   :disSelect="true"></select-room>
      <div slot="footer"></div>
    </Modal>
    <!--选择人员-->
    <Modal :mask-closable="false" width="890" v-model="selectTeacherModal" class-name="vertical-center-modal">
      <modal-header slot="header" :content="contentHeader.selectTeacherId"></modal-header>
      <!--<select-teacher v-if="selectTeacherModal" :initData="selectTeacherId" :search="[{label: '姓名',keys: 'test'}, {label: '工号',keys: 'name'}]"
        @cancel="cancel('selectTeacher')" @setData="setData" :readerList="readerList"></select-teacher>-->
      <!--<select-teacher v-if="selectTeacherModal" @cancel="closeUser" @setUsers="setUsers" :initUser="initUser"></select-teacher>-->
      <select-user v-if="selectTeacherModal" @cancel="closeUser" @setUsers="setUsers" :unSelect="unSelectUser"
                   :initUser="initUser"></select-user>
      <div slot="footer"></div>
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
  import selectTeacher from '../../../common/selectUser' // 选择人员

  export default {
    data () {
      return {
        sceneType: '', // 当前考站类型
        basicsTime: '', // 当前考核场次的考试基础时间
        typeOption,
        randomTypeOption,
        specialtyList: [], // 专业
        unSelectRoom: [],
        unSelectUser: [],
        selectRoomModal: false,
        selectTeacherModal: false,
        info: {}, // 考站信息
        room: {}, // 考场房间
        initUser: [], // 选中的监考老师
        teacher: [], // 监考老师
        sumWeigth: '', // 权重
        contentHeader: {
          selectRoomId: {
            id: 'selectRoomId',
            title: '选择房间',
          },
          selectTeacherId: {
            id: 'selectTeacherId',
            title: '选择监考老师',
          },
        },
      }
    },
    methods: {
      // 下一步
      next () {
        if (!this.checkData()) return
        // 保存老师信息到状态中
        this.$store.commit('examineInterval/temp/initTeacher', this.teacher)
        let teacherArr = []
        for (let i = 0, item = this.teacher, l = item.length; i < l; i++) {
          teacherArr.push(item[i].teacherId)
        }
        this.$store.commit('examineInterval/temp/addUnSelectUser', {
          teacher: teacherArr,
        })
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
        // 理论考核可以不选老师不设置监考权重
        if (this.info.stationType !== 'THEORY') {
          // 监考老师
          if (!this.teacher.length) {
            this.errorMess('请选择选择监考老师！')
            return false
          }
          // 权重
          if (this.sumWeigth !== 100) {
            this.errorMess('监考老师权重和必须为100！')
            return false
          }
        }
        return true
      },
      /**************** 选择房间 ********************/
      selectRoom (val) {
        let roomVal = val[0] || val
        let room = this.room // room 信息
        // 缓存操作不进行禁止选择，因为不点击完成是不会记录该数据的
        if (room.roomId !== roomVal.id) { // 当前房间更换
          //   // 从禁止选择房间数组中删除该房间
          this.$store.commit('examineInterval/temp/removeUnSelectRoom', room.roomId)
        }
        room.roomId = roomVal.id
        room.roomNum = roomVal.roomNum
        room.roomName = roomVal.roomName
        // 把选中的房间加入到不可再次选择的数据中
        this.$store.commit('examineInterval/temp/addUnSelectRoom', room.roomId)
        this.cancel('selectRoom')
      },
      /************* 选择监考老师 *********/
      /*
       * 获取选择人员的人员信息并赋值
       * @param users [{id:'',name:''},{}]  已选人员信息
       * */
      setUsers (users) {
        this.teacher.length = 0
        Util._.forEach(users, (val, k) => {
          this.teacher.push({
            teacherId: val['key'], // 教师id
            teacherName: val['label'], // 监考老师名称 【需要根据接口设置键，目前为测试使用键】
            weight: '' // 权重
          })
        })
        // 监考老师列表
        this.closeUser()
        this.updataWeight()
      },
      // 删除老师
      removeTeacher (index) {
        let delId = this.teacher[index].teacherId
        this.teacher.splice(index, 1)
        this.$store.commit('examineInterval/temp/removeUnSelectUserById', {
          type: 'teacher',
          id: delId,
        })
        this.updataWeight()
      },
      // 更新权重
      updataWeight () {
        for (let i in this.teacher) {
          this.teacher[i].weight = this.getWeightByTeacherNumber(i)
        }
      },
      // 根据选择老师的数据计算权重值
      getWeightByTeacherNumber (index) {
        let weight = 100 // 默认权重为100
        let len = this.teacher.length
        let m = weight % len
        let num = parseInt(weight / len)
        let arr = []
        if (m === 0) { // 整除
          return parseInt(num)
        } else if (m - index > 0) { // 有余平均+1
          return num + 1
        } else { // 整数
          return num
        }
      },
      /*----------- 数据处理 -----------*/
      // 权重统计
      getSummaries (param) {
        const {
          columns,
          data,
        } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            this.sumWeigth = sums[index]
            sums[index] += ' %'
          }
        })

        return sums
      },
      /*----------- 模态框 -------------*/
      // 选择房间
      openSelectRoom () {
        this.openModel('selectRoom')
      },
      // 选择老师
      openSelectTeacher () {
        let userList = this.teacher
        let selTeacher = []
        this.initUser = []
        if (userList.length > 0) {
          for (var i = 0, item; i < userList.length; i++) {
            item = userList[i]
            this.initUser.push({
              key: item['teacherId'],
              label: item['teacherName'],
              description: '',
              disabled: false,
            })
            selTeacher.push(item['teacherId'])
          }
        }
        this.unSelectUser = this.getUnSelectUser(selTeacher)
        this.openModel('selectTeacher')
      },
      //关闭选择老师弹窗
      closeUser () {
        this.cancel('selectTeacher')
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
      /************************** 排除禁选人员 *********************************/
      // 获取禁选人员
      getUnSelectUser (selTeacher) {
        let temp = this.$store.state.examineInterval.temp.unSelectUser
        let unSelArr = [] // 所有禁选
        Util._.map(temp, (arr, key) => {
          unSelArr = unSelArr.concat(arr)
        })
        return Util._.difference(unSelArr, selTeacher)
      },
    },
    components: {
      selectRoom,
      selectTeacher,
    },
    created () {
      Util = this.$util
      let todoIndex = this.$store.getters['examineInterval/roomIndex/get'] // 获取当前操作索引
      let temp = this.$store.state.examineInterval.temp // 从缓存中读取数据
      let info = this.$store.state.examineInterval.station.info // 从缓存中获取当前考核场次的公共信息
      this.info = temp.info // 考站信息
      this.room = temp.room // 当前考站对应的房间
      this.teacher = temp.teacher // 当前考站对应的监考老师
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
      /*height: 38px !important;*/
    }
  }
</style>
