<!--
****--@file     examineIntervalSetInfo_teacher
****--@date     2018/4/18 16:54
****--@author   YC
****--@describe 考站基本信息_选择监考老师
-->
<template>
  <el-row>
    <el-form onsubmit="return false">
      <el-col>
        <el-form-item label="监考老师：" prop="roomTeacherList">
          <el-table border show-summary :summary-method="getSummaries" :data="teacher">
            <el-table-column label="监考老师" prop="teacherName" show-overflow-tooltip></el-table-column>
            <el-table-column label="评分表" show-overflow-tooltip v-if="info.stationType !== 'THEORY'">
              <template scope="scope">
                {{ getContentScoreTableText(scope.row.contentScoreTableObj) }}
              </template>
            </el-table-column>
            <el-table-column label="权重（合计必须为100%）" prop="weight">
              <template scope="scope">
                <el-input style="width:60px;" :maxlength="3" v-model="scope.row.weight" size="small"></el-input>
                <span style="margin:0 10px;">%</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140">
              <template scope="scope">
                <el-button v-if="info.stationType !== 'THEORY'" type="info" size="mini"
                           @click="setScoreTable(scope.$index)">评分表
                </el-button>
                <el-button type="danger" size="mini" @click="removeTeacher(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="info" style="margin-top:10px;" @click="openSelectTeacher">选择老师</el-button>
        </el-form-item>
      </el-col>
    </el-form>

    <el-col :span="8" :offset="4" align="center" style="margin-top:20px;">
      <el-button type="warning" @click="pre">上一步</el-button>
    </el-col>
    <el-col :span="8" align="center" style="margin-top:20px;">
      <el-button type="success" @click="next">下一步</el-button>
    </el-col>
    <!--选择人员-->
    <Modal :mask-closable="false" width="890" v-model="selectTeacherModal" class-name="vertical-center-modal">
      <modal-header slot="header" :content="contentHeader.selectTeacherId"></modal-header>
      <!--<select-teacher v-if="selectTeacherModal" :initData="selectTeacherId" :search="[{label: '姓名',keys: 'test'}, {label: '工号',keys: 'name'}]"
        @cancel="cancel('selectTeacher')" @setData="setData" :readerList="readerList"></select-teacher>-->
      <!--<select-teacher v-if="selectTeacherModal" @cancel="closeUser" @setUsers="setUsers" :initUser="initUser"></select-teacher>-->
      <select-user v-if="selectTeacherModal" @cancel="closeUser" @setUsers="setUsers" :unSelect="unSelectUser"
                   :initUser="initUser"></select-user>
      <div slot="footer"></div>
    </Modal>
    <!--选择人员-->
    <Modal :mask-closable="false" width="600" v-model="selectScoreTableModal" class-name="vertical-center-modal">
      <modal-header slot="header" :content="contentHeader.selectScoreTableId"></modal-header>
      <select-teacher-score-table v-if="selectScoreTableModal" @cancel="cancel('selectScoreTable')"
                                  @set="setTeacherScore" :teacherIndex="teacherIndex"></select-teacher-score-table>
      <div slot="footer"></div>
    </Modal>
  </el-row>
</template>
<script>
  /*当前组件必要引入*/
  import selectTeacher           from '../../../common/selectUser'; // 选择人员
  import selectTeacherScoreTable from './examineIntervalSetInfo_selectTeacherScoreTable'; // 选择评分表

  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'examineIntervalSetInfoTeacher',
    data () {
      return {
        teacherIndex: '',
        sceneType: '', // 当前考站类型
        unSelectUser: [],
        selectTeacherModal: false,
        selectScoreTableModal: false,
        info: {}, // 考站信息
        room: {}, // 考场房间
        initUser: [], // 选中的监考老师
        teacher: [], // 监考老师
        sumWeigth: '', // 权重
        contentHeader: {
          selectTeacherId: {
            id: 'selectTeacherId',
            title: '选择监考老师'
          },
          selectScoreTableId: {
            id: 'selectScoreTableId',
            title: '选择评分表'
          }
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        let temp = this.$store.state.examineInterval.temp; // 从缓存中读取数据
        let info = this.$store.state.examineInterval.station.info; // 从缓存中获取当前考核场次的公共信息
        Util = this.$util;
        this.info = temp.info; // 考站信息
        this.room = temp.room; // 当前考站对应的房间
        this.teacher = temp.teacher; // 当前考站对应的监考老师
        this.sceneType = info.sceneType; // 考核场次类型
        this.specialtyList = this.$store.state.examineInterval.room.specialtyList; // 专业
        this.autoSetTeacherScoreTable();
      },
      // 上一步
      pre () {
        if (this.checkData(false)) { // 如果数据验证通过就保存，不然就不保存
          this.saveTeacher(false);
        }
        this.$emit('goStep', 2);
      },
      // 下一步
      next () {
        this.saveTeacher() && this.$emit('goStep', 4);
      },
      saveTeacher (mustCheck = true) {
        if (!mustCheck || !this.checkData()) return false;
        // 保存老师信息到状态中
        this.$store.commit('examineInterval/temp/initTeacher', this.teacher);
        let teacherArr = [];
        for (let i = 0, item = this.teacher, l = item.length; i < l; i++) {
          teacherArr.push(item[i].teacherId);
        }
        this.$store.commit('examineInterval/temp/addUnSelectUser', {
          teacher: teacherArr
        });
        return true;
      },
      getContentScoreTableText (obj) {
        let textArr = [];
        Object.keys(obj).map(key => textArr.push(obj[key].scoreTableName));
        return textArr.join('、') || '请选择评分表';
      },
      /**************** 数据自动赋值 ********************/
      // 自动对老师进行评分表配置
      autoSetTeacherScoreTable () {
        let {info: {stationContentList}, teacher: teachers} = this;
        // 如果没有老师则不处理
        if (!teachers.length) {
          return false;
        }
        // 每位老师都需要处理
        teachers.map(teacher => {
          console.log(teacher);
          let oldData = Object.keys(teacher.contentScoreTableObj);
          if (!oldData.length) { // 如果有旧数据就使用旧数据，否则就重新处理对应的评分表
            let contentScoreTableObj = {};
            // 每个考核内容
            stationContentList.map(content => {
              // 如果此考核内容只有一个评分表就给老师默认选择上
              if (content.scoreTableList.length === 1) {
                let {scoreTableId, oldScoreTableId, scoreTableName} = content.scoreTableList[0];
                contentScoreTableObj[content._id] = {scoreTableId, oldScoreTableId, scoreTableName};
              }
            });
            teacher.contentScoreTableObj = contentScoreTableObj;
          }
        });
      },
      /**************** 数据检测 ********************/
      checkData (showMsg = true) {
        // 理论考核可以不选老师不设置监考权重
        if (this.info.stationType !== 'THEORY') {
          let teacher = this.teacher;
          // 监考老师
          if (!teacher.length) {
            showMsg && this.errorMess('请选择选择监考老师！');
            return false;
          }
          // 权重
          if (this.sumWeigth !== 100) {
            showMsg && this.errorMess('监考老师权重和必须为100！');
            return false;
          }
          // 评分表
          let stationContentListLen = this.info.stationContentList.length;
          for (let i = 0, l = teacher.length; i < l; i++) {
            if (Object.keys(teacher[i].contentScoreTableObj).length != stationContentListLen) {
              showMsg && this.errorMess(`监考老师“${teacher[i].teacherName}”的评分表还没有选择完成！`);
              return false;
            }
          }
        }
        return true;
      },
      /************* 选择监考老师 *********/
      /*
       * 获取选择人员的人员信息并赋值
       * @param users [{id:'',name:''},{}]  已选人员信息
       * */
      setUsers (users) {
        let oldTeacher = Util._.defaultsDeep([], this.teacher);
        let teacherObj = {};
        oldTeacher.map(item => teacherObj[item.teacherId] = item);
        this.teacher.length = 0;
        Util._.forEach(users, (val, k) => {
          // 如果原来已经选择过此老师则保存原来此老师的数据
          this.teacher.push(teacherObj[val['key']] ? teacherObj[val['key']] : {
            teacherId: val['key'], // 教师id
            teacherName: val['label'], // 监考老师名称 【需要根据接口设置键，目前为测试使用键】
            weight: '', // 权重
            contentScoreTableObj: {} // 评分表(存放评分表内容)
          });
        });
        // 监考老师列表
        this.closeUser();
        this.updataWeight();
        this.autoSetTeacherScoreTable();
      },
      // 删除老师
      removeTeacher (index) {
        let delId = this.teacher[index].teacherId;
        this.teacher.splice(index, 1);
        this.$store.commit('examineInterval/temp/removeUnSelectUserById', {
          type: 'teacher',
          id: delId
        });
        this.updataWeight();
      },
      // 更新权重
      updataWeight () {
        for (let i in this.teacher) {
          this.teacher[i].weight = this.getWeightByTeacherNumber(i);
        }
      },
      // 根据选择老师的数据计算权重值
      getWeightByTeacherNumber (index) {
        let weight = 100; // 默认权重为100
        let len = this.teacher.length;
        let m = weight % len;
        let num = parseInt(weight / len);
        let arr = [];
        if (m === 0) { // 整除
          return parseInt(num);
        } else if (m - index > 0) { // 有余平均+1
          return num + 1;
        } else { // 整数
          return num;
        }
      },
      /*----------- 数据处理 -----------*/
      // 权重统计
      getSummaries (param) {
        const {
          columns,
          data
        } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            this.sumWeigth = sums[index];
            sums[index] += ' %';
          }
        });

        return sums;
      },
      /*----------- 模态框 -------------*/
      // 设置评分表
      setScoreTable (index) {
        this.teacherIndex = index;
        this.openModel('selectScoreTable');
      },
      // 设置老师的评分表
      setTeacherScore (scoreTable) {
        let teacher = this.$util._.defaultsDeep([], this.teacher);
        teacher[this.teacherIndex].contentScoreTableObj = scoreTable;
        this.teacher = teacher;
        console.log(scoreTable);
        this.cancel('selectScoreTable');
      },
      // 选择老师
      openSelectTeacher () {
        let userList = this.teacher;
        let selTeacher = [];
        this.initUser = [];
        if (userList.length > 0) {
          for (var i = 0, item; i < userList.length; i++) {
            item = userList[i];
            this.initUser.push({
              key: item['teacherId'],
              label: item['teacherName'],
              description: '',
              disabled: false
            });
            selTeacher.push(item['teacherId']);
          }
        }
        this.unSelectUser = this.getUnSelectUser(selTeacher);
        this.openModel('selectTeacher');
      },
      //关闭选择老师弹窗
      closeUser () {
        this.cancel('selectTeacher');
      },
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      /************************** 排除禁选人员 *********************************/
      // 获取禁选人员
      getUnSelectUser (selTeacher) {
        let temp = this.$store.state.examineInterval.temp.unSelectUser;
        let unSelArr = []; // 所有禁选
        Util._.map(temp, (arr, key) => {
          unSelArr = unSelArr.concat(arr);
        });
        return Util._.difference(unSelArr, selTeacher);
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {
      selectTeacher,
      selectTeacherScoreTable
    }
  };

</script>
