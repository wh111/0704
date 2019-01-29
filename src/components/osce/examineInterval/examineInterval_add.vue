<template>
  <!-- 添加考核 -->
  <div style="height:100%;" id="stationMain" ref="stationMain">
    <!-- 基本信息 -->
    <div class="editForm">
      <el-form :model="info" :rules="rules" ref="info" label-width="84px" class="resetFormItemHeight">
        <el-row class="stationInfo">
          <!-- 自由考核 -->
          <el-col :span="5">
            <el-form-item label="考核名称：" prop="sceneName" :required="false">
              <el-input v-model="info.sceneName" :maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-form-item label="开始时间：" prop="startTime">
              <el-date-picker v-model="info.startTime" :editable="false" format="yyyy-MM-dd HH:mm:ss" type="datetime"
                              placeholder="选择考核开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1" v-if="addType !== 'STANDARD'">
            <el-form-item label="结束时间：" prop="endTime">
              <el-date-picker v-model="info.endTime" :editable="false" format="yyyy-MM-dd HH:mm:ss" type="datetime"
                              placeholder="选择考核结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="addType === 'STANDARD' ? 12 : 5" align="right">
            <el-form-item label-width="0">
              <!--<el-button type="success" @click="save">保存考核</el-button>-->
              <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
              <el-button type="danger" @click="back">取消</el-button>
            </el-form-item>
          </el-col>

          <!-- 规范化考核 -->
          <template v-if="addType === 'STANDARD'">
            <el-col :span="6">
              <el-form-item label-width="0" prop="restNum">
                <span style="float:left;">每考</span>
                <el-col :span="5" style="height: 37.5px">
                  <el-input v-model="info.restNum" size="small"></el-input>
                </el-col>
                <span>站休息一次</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="0" prop="restTime">
                <span style="float:left;">每次休息</span>
                <el-col :span="5">
                  <el-input v-model="info.restTime" size="small"></el-input>
                </el-col>
                <span>分钟</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="0" prop="moveTime">
                <span style="float:left;">换站时间：</span>
                <el-col :span="5">
                  <el-input v-model="info.moveTime" size="small"></el-input>
                </el-col>
                <span>分钟</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="0" prop="basicsTime">
                <span style="float:left;">考试时间基数：</span>
                <el-col :span="5">
                  <el-input v-model="info.basicsTime" size="small"></el-input>
                </el-col>
                <span>分钟</span>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="5">
            <el-form-item label="评分步长：" prop="step">
              <el-input v-model="info.step" placeholder="步长区间：0.1-10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-form-item label-width="0" prop="scoringMethod">
              <span style="float:left;">评分方式：</span>
              <el-radio class="radio" v-model="info.scoringMethod" label="SCORE">得分制</el-radio>
              <el-radio class="radio" v-model="info.scoringMethod" label="DEDUCTION">扣分制</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="0" prop="hasRemind">
              <span style="float:left;">是否提醒：</span>
              <el-radio class="radio" v-model="info.hasRemind" :label="true">是</el-radio>
              <el-radio class="radio" v-model="info.hasRemind" :label="false">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="5" v-if="info.hasRemind">
            <el-form-item label="提醒时间：" prop="remindTime">
              <el-input v-model="info.remindTime" placeholder="时长区间：0.1-10分钟"></el-input>
            </el-form-item>
          </el-col>
          <template v-if="addType === 'STANDARD'">
            <el-col :span="6">
              <el-form-item label-width="0">
                <span style="float:left;">是否SP轮转：</span>
                <el-radio class="radio" v-model="info.isSpMove" label="YES">是</el-radio>
                <el-radio class="radio" v-model="info.isSpMove" label="NO">否</el-radio>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
    </div>
    <div style="overflow:hidden;">
      <el-col :span="15">
        <!-- 考场管理员 -->
        <div class="el-form selectUserBox">
          <fieldset style="height:90px;">
            <legend style="font-size:16px">&nbsp;&nbsp;考场管理员
              <el-button type="primary" size="mini" @click="addManager" icon="plus"></el-button>&nbsp;&nbsp;
            </legend>
            <div style="height:40px;overflow:auto;" v-if="managerList.length">
              <el-tag v-for="(item,index) in managerList" :key="item.managerId" :closable="true" type="success"
                      @close="handleMClose(index)">
                {{item.userName}}
              </el-tag>
            </div>
            <p v-else>请选择考场管理员</p>
          </fieldset>
        </div>
        <!-- 参考人员 -->
        <div class="el-form selectUserBox" style="margin-top:20px;">
          <fieldset style="height:128px;">
            <legend style="font-size:16px">&nbsp;&nbsp;参考人员
              <el-button type="primary" size="mini" @click="addUser" icon="plus"></el-button>&nbsp;&nbsp;
            </legend>
            <template v-if="userList.length">
              <div :style="{height:(addType === 'STANDARD' ? 40 : 80) + 'px',overflow:'auto'}">
                <el-tag v-for="(item,index) in userList" :key="item.userId" :closable="true" type="success"
                        @close="handleClose(index)">
                  {{item.userName}}
                </el-tag>
              </div>
              <p align="right" v-if="addType === 'STANDARD' && userList.length">
                <el-button type="info" @click="viewTable">排考预览</el-button>
              </p>
            </template>
            <p v-else>请选择参考人员</p>
          </fieldset>
        </div>
      </el-col>
      <el-col :span="8" :offset="1">
        <!-- 考场管理员 -->
        <div class="el-form selectUserBox">
          <fieldset style="height:238px;">
            <legend style="font-size:16px">&nbsp;&nbsp;SP设置
              <el-button type="primary" size="mini" @click="addSP" icon="plus"></el-button>&nbsp;&nbsp;
            </legend>
            <div style="height:180px;overflow:auto;" v-if="spList.length">
              <el-collapse accordion>
                <el-collapse-item v-for="(item,index) in spList" :key="item.managerId">
                  <template slot="title">
                    {{item.userName}}
                  </template>
                  <el-checkbox-group v-model="item.scriptIds" v-if="!hasScriptList()">
                    <el-checkbox v-for="cItem in scriptList" :label="cItem.scriptId" :key="cItem.scriptId">{{
                      cItem.scriptName
                      }}
                    </el-checkbox>
                  </el-checkbox-group>
                  <p v-else>暂无病例</p>
                </el-collapse-item>
              </el-collapse>
            </div>
            <p v-else>暂无SP人员</p>
          </fieldset>
        </div>
      </el-col>
    </div>

    <!-- 考站相关按钮 -->
    <div style="margin-top:20px;">
      <el-button size="small" type="success" @click="addRoom">添加考站</el-button>
      <el-button size="small" type="primary" @click="openModel('setDraw')">抽签设置</el-button>
      <!-- 规范化考核 -->
      <template v-if="addType === 'STANDARD'">
        <el-button size="small" type="warning" @click="openModel('setQueue')">队列设置</el-button>
      </template>
      <el-button size="small" type="danger" @click="openModel('setWeight')">权重设置</el-button>
    </div>
    <!-- 考站 -->
    <div ref="stationRoomBox" id="stationRoomBox" :style="stationRoomStyle">
      <el-row>
        <template v-for="(item,index) in roomList">
          <template v-for="(cItem,cIndex) in item.children">
            <el-tooltip placement="right-start" :open-delay="1500" effect="light" :key="index + '-' + cIndex">
              <room-info slot="content" :basicsTime="info.basicsTime" :info="roomData[index]"
                         :room="roomList[index].room[cIndex]" :teacher="roomList[index].teacher[cIndex]"
                         :key="index+'_'+cIndex" style="max-width:400px;"></room-info>
              <room :option="{hasMore: cIndex > 0,type:'edit'}"
                    :initData="{index: index,cIndex:cIndex,name:roomData[index].stationName,roomNum:item.room[cIndex].roomNum,roomSpecialty:item.room[cIndex].specialty,roomType:roomData[index].stationType === 'SP' ? 'SP' : ''}"
                    :key="index+'_'+cIndex" @roomClick="roomClick" @iconAdd="addRoomChildren(index)"
                    @iconRemove="removeRoomChildren(index,cIndex)" style="width:80px;margin-left:40px;"></room>
            </el-tooltip>
          </template>
        </template>
      </el-row>
    </div>
    <!--选择人员-->
    <Modal :mask-closable="false" width="890" v-model="selectUserModal" title="添加人员" class-name="vertical-center-modal">
      <modal-header slot="header" :content="contentHeader.selectUserId"></modal-header>
      <!-- 此处人员还未对应 -->
      <select-user v-if="selectUserModal" @cancel="closeSltUser" @setUsers="setUsers" :unSelect="unSelectUser"
                   :initUser="initUser"></select-user>
      <div slot="footer"></div>
    </Modal>
    <!--选择考场管理员-->
    <Modal :mask-closable="false" width="890" v-model="selectManagerModal" title="添加考场管理员"
           class-name="vertical-center-modal">
      <modal-header slot="header" :content="contentHeader.selectManagerId"></modal-header>
      <!-- 此处人员还未对应 -->
      <select-user v-if="selectManagerModal" @cancel="closeSltMUser" @setUsers="setMUsers" :unSelect="unSelectUser"
                   :initUser="initUser"></select-user>
      <div slot="footer"></div>
    </Modal>
    <!--设置考站信息-->
    <Modal :mask-closable="false" width="1000" v-model="setInfoModal" title="设置考站信息" class-name="vertical-center-modal">
      <modal-header slot="header" :content="contentHeader.setInfoId"></modal-header>
      <set-info v-if="setInfoModal" @cancel="cancel" @done="updateScripts"></set-info>
      <div slot="footer"></div>
    </Modal>
    <!--设置考站SP信息-->
    <Modal :mask-closable="false" width="890" v-model="setSPModal" title="考站信息SP设置" class-name="vertical-center-modal">
      <modal-header slot="header" :content="contentHeader.setSPId"></modal-header>
      <select-user v-if="setSPModal" @cancel="closeSPUser" @setUsers="setSP" :unSelect="unSelectUser"
                   :initUser="initUser"></select-user>
      <div slot="footer"></div>
    </Modal>
    <!--设置考站抽签信息-->
    <Modal :mask-closable="false" width="890" v-model="setDrawModal" title="考站抽签设置" class-name="vertical-center-modal">
      <modal-header slot="header" :content="contentHeader.setDrawId"></modal-header>
      <set-draw v-if="setDrawModal" @cancel="cancel" @set="setDraw"></set-draw>
      <div slot="footer"></div>
    </Modal>
    <!--设置考站队列信息-->
    <Modal :mask-closable="false" width="890" v-model="setQueueModal" title="考站队列设置" class-name="vertical-center-modal">
      <modal-header slot="header" :content="contentHeader.setQueueId"></modal-header>
      <set-queue v-if="setQueueModal" @cancel="cancel" @set="setQueue"></set-queue>
      <div slot="footer"></div>
    </Modal>
    <!--设置考站权重信息-->
    <Modal :mask-closable="false" width="600" v-model="setWeightModal" title="考站队列设置" class-name="vertical-center-modal">
      <modal-header slot="header" :content="contentHeader.setWeightId"></modal-header>
      <set-weight v-if="setWeightModal" @cancel="cancel" @set="setWeight"></set-weight>
      <div slot="footer"></div>
    </Modal>
    <!--排考预览-->
    <Modal :mask-closable="false" width="890" v-model="previewModal" title="考站队列设置" class-name="vertical-center-modal">
      <modal-header slot="header" :content="contentHeader.previewId"></modal-header>
      <preview v-if="previewModal" @cancel="cancel" :previewData="previewData"></preview>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  let Util = null;
  import { mapMutations } from 'vuex';

  import api from './api'; // api
  import { getSaveData, getBasicInfo } from './formatData'; // 获取提交数据

  import room from './examineInterval_room'; // 单个考站
  import roomInfo from './examineIntervalInfo/examineIntervalInfo'; // hover显示考站信息
  import selectUser from '../../common/selectUser'; // 选择人员
  import setInfo from './examineIntervalSetInfo/examineIntervalSetInfo'; // 考站设置
  import setDraw from './examineIntervalDraw/examineIntervalDraw'; // 抽签设置
  import setQueue from './examineIntervalQueue/examineIntervalQueue'; // 队列设置
  import setWeight from './examineIntervalSetWeight/index'; // 权重设置
  import preview from './examineInterval_preview'; // 排考预览

  import {
    examineIntervalFREE, // 自由考核基本信息规则
    examineIntervalSTANDARD // 规范考核基本信息规则
  } from '../rules'; // 考站基本信息验证

  import * as stationWeight from './examineIntervalSetWeight/formatData'; // 考站权重

  import * as moreRules from './verification';

  export default {
    props: {
      id: { // 复制场次的id
        type: [Number, String],
        default: 0
      },
      contenHeight: { // 内容区域高度
        type: Number,
        default: 100
      },
      addType: { // 增加考核的类型
        type: String,
        required: true
      },
      skillType: { //skillOutdepExam 技能出科试卷设置
        type: String,
        required: ''
      },
      dept: { // 增加考核的类型
        type: Object,
        required: {}
      },
      url: { // skillOutdepExam 的 url
        type: Object,
        default: () => ({assessmentAdd: {path: '', method: ''}})
      }
    },
    data () {
      return {
        api,
        self: this,
        rules: {}, // 验证规则

        unSelectUser: [], // 禁选人员

        info: {}, // 场次信息
        roomList: {}, // 考站
        roomData: {}, // 考站信息
        previewData: {}, // 考核预览数据

        stationRoomStyle: {
          marginTop: '20px',
          height: '100px',
          overflow: 'auto'
        },

        selectUserModal: false,
        selectManagerModal: false,
        setInfoModal: false,
        setSPModal: false,
        setDrawModal: false,
        setQueueModal: false,
        previewModal: false,
        setWeightModal: false,

        //保存按钮基本信息
        loadBtn: {
          title: '保存考核',
          callParEvent: 'listenSubEvent'
        },

        // 模态框信息
        contentHeader: {
          selectUserId: {
            id: 'selectUserId',
            title: '选择人员',
            usersData: ''
          },
          selectManagerId: {
            id: 'selectManagerId',
            title: '选择考场管理员'
          },
          setInfoId: {
            id: 'setInfoId',
            title: '考站信息设置'
          },
          setSPId: {
            id: 'setSPId',
            title: '考站SP设置'
          },
          setDrawId: {
            id: 'setDrawId',
            title: '考站抽签设置'
          },
          setQueueId: {
            id: 'setQueueId',
            title: '考站队列设置'
          },
          setWeightId: {
            id: 'setWeightId',
            title: '考站权重设置'
          },
          previewId: {
            id: 'previewId',
            title: '排考预览'
          }
        },
        // 考场管理员
        managerList: [],
        //存储已选择人员的信息
        userList: [],
        spList: [], // SP人员
        scriptList: [], // SP人员选择的剧本列表

        //给选择人员框传递的已选人员信息
        initUser: [],

        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'saveSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
            url: api.add.path,
            method: api.add.method
          }
        },
        saved: false,

        //新增静态模板的资源
        checked: '',
        formInline: {
          GLXK: '内科',
          GLKS: '心血管内科',
          KHLB: '出科考核'
        },
        GLXK: ['内科', '儿科', '急诊科', '皮肤科', '精神科', '神经内科', '全科', '康复医学科', '外科', '骨科', '妇产科', '眼科', '耳鼻喉科', '麻醉科'],
        GLKS: ['心血管内科', '肾脏内科', '呼吸内科', '血液内科', '消化内科', '内分泌科', '感染科', '神经内科', '风湿免疫科', '急诊科'],
        KHLB: ['出科考核', '结业考核', '日常考核', '中期考核']

      };
    },
    methods: {
      /************************** ajax回调 *********************************/
      // 保存成功
      saveSuccess () {
        this.$emit('show', { // 打开默认（index）视图并更新
          look: 'index',
          update: true
        });
      },
      /************************** 数据处理 ********************************/
      // 格式化提交数据
      getAjaxParamsData () {
        let {
          info,
          roomList,
          roomData,
          managerList,
          userList,
          spList
        } = this;
        let spListVal = [];
        let scriptList = Util._.defaultsDeep({}, this.scriptList);
        // 剧本有效值
        Util._.mapKeys(scriptList, (item, key) => {
          spListVal.push(+key);
        });
        console.log(scriptList, spListVal);

        return getSaveData({
          info,
          roomList,
          roomData,
          managerList,
          userList,
          spList,
          spListVal
        });
      },
      //************************* 保存 ************************************/
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        // 检测数据
        if (!this.checkData()) {
          return;
        }
//        console.log(this.getAjaxParamsData())
//        return
        if (!isLoadingFun) isLoadingFun = function () {};
        isLoadingFun(true);
        let data = this.getAjaxParamsData();
        if (this.skillType == 'skillOutdepExam') {
          data.deptName = this.dept.deptName;
          data.deptId = this.dept.deptId;
          this.addMessTitle.ajaxParams.url = this.url.assessmentAdd.path;
        }
        this.addMessTitle.ajaxParams.data = data;
//        this.addMessTitle.ajaxParams.data.stationList.map((item)=>{
//          item.timeCount=item.timeCount*60
//
//        })
//        console.log(data);
//        return;
        this.ajax(this.addMessTitle, isLoadingFun);
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm (formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },
      // 保存考核
      save () {
        if (this.saved) {
          this.$message({
            message: '数据正在保存中',
            type: 'warning'
          });
          return;
        }
        this.saved = true;
        this.addMessTitle.ajaxParams.data = this.getAjaxParamsData();
        this.ajax(this.addMessTitle);
        // 数据提交1S后才可继续操作，如果成功自动返回列表页，保存失败则1S后可以继续保存
        setTimeout(function () {
          this.saved = false;
        }, 1000);
      },
      // 检测填写数据
      checkData () {
        // 基本信息校验
        if (!this.submitForm('info')) {
          this.errorMess('基本信息填写不完整！');
          return false;
        }
        // 参考人员
        if (!moreRules.stationHasUser(this.userList)) {
          this.errorMess('请添加参考人员！');
          return false;
        }
        // 是否有考站
        if (!moreRules.hasRoom(this.roomList)) {
          this.errorMess('请添加考站！');
          return false;
        }
        // 考站是否都命名
        let roomHasName = moreRules.roomHasName(this.roomData);
        if (roomHasName !== -1) {
          this.errorMess(`第${roomHasName + 1}个考站没有命名！`);
          return false;
        }
        // 有SP考站
        if ((moreRules.hasSPRoom(this.roomData) > -1)) {
          // 是否有SP人员
          let hasSPUser = moreRules.hasSPUser(this.spList);
          if (!hasSPUser) {
            this.errorMess('有SP考站，需要添加SP人员！');
            return false;
          }
          // SP人员数量必须大于等已有的SP考站
          let spStationNum = moreRules.spStationNum(this.roomData);
          if (spStationNum > this.spList.length) {
            this.errorMess('当前添加的SP人员数量小于SP考站数量，您还需再添加' + (spStationNum - this.spList.length) + '个SP人员！');
            return false;
          }
          // SP人员是否都有剧本
          let spsIndex = moreRules.spUserHasScript(this.spList);
          if (spsIndex > -1) {
            this.errorMess(`SP人员“${this.spList[spsIndex].userName}”没有剧本，请选择剧本！`);
            return false;
          }
          // SP人员剧本是否跟SP考站剧本对应
          let spScripts = moreRules.spScriptIsHasSpStationScript(this.roomData, this.spList);
          if (spScripts.length > 0) {
            this.errorMess('SP人员中没有对应SP考站中的剧本：' + spScripts.join(',') + '，请在SP人员中选择剧本！');
            return false;
          }
        }

        // 所有考站都有房间（所有考站都有数据）
        let hasRoomId = moreRules.stationHasRoom(this.roomList);
        if (hasRoomId.index > -1) {
          let stationName = this.roomData[hasRoomId.index].stationName; // 考站名称
          let hasMore = hasRoomId.cIndex > 0 ? '平行站的第' + (hasRoomId.cIndex + 1) + '个考站' : '';
          this.errorMess(`“${stationName + hasMore}”没有选择房间！`);
          return false;
        }

        if (!stationWeight.checkWeigthRoomsData(stationWeight.getWeigthRooms(this))) {
          this.errorMess('请检查权重是否合计为100且权重不能为0');
          return false;
        }
        return true;
      },
      /*************************** room 组件 *******************************/
      // 添加平行站
      addRoomChildren (index) {
        this.$store.commit('examineInterval/room/addRoomChildren', index);
      },
      // 删除平行站
      removeRoomChildren (index, cIndex) {
        let thisRoom = this.roomList[index];
        // 删除考站对应的老师
        let teacher = thisRoom.teacher[cIndex];
        teacher.map(item => this.$store.commit('examineInterval/room/removeUnSelectUserById', {
          type: 'teacher',
          id: item.teacherId
        }));
        // 删除考站对应的房间
        let room = thisRoom.room[cIndex];
        this.$store.commit('examineInterval/room/removeUnSelectRoom', room.roomId);
        // 删除考站
        this.$store.commit('examineInterval/room/removeRoomChildren', {
          index,
          cIndex
        });
        if (thisRoom.children.length < 1) {
          this.$store.commit('examineInterval/room/removeRoom', index); // 删除考站索引
        }
      },
      ...mapMutations({
        addRoom: 'examineInterval/room/addRoom' // 添加考站
      }),
      // 考站点击
      roomClick (data) {
        this.openModel('setInfo');
        this.$store.commit('examineInterval/roomIndex/set', data);
      },
      /**************************** 人员相关 ********************************/
      // 删除已选择的参考人员
      handleClose (index) {
        this.userList.splice(index, 1);
        this.$store.commit('examineInterval/room/removeUnSelectUser', {
          type: 'user',
          index
        });
        // 参考人员专业
        let specialtyList = [];
        for (let i = 0, list = this.userList, len = list.length; i < len; i++) {
          if (list[i].specialty && !(specialtyList.indexOf(list[i].specialty) > -1)) {
            specialtyList.push(list[i].specialty);
          }
        }
        this.$store.commit('examineInterval/room/initSpecialtyList', specialtyList);
        // 参考人员删除同步删除对应房间的专业
        for (let i = 0, roomList = this.roomList, leng = roomList.length; i < leng; i++) {
          for (let j = 0, roomItem = roomList[i].room, roomItemLen = roomItem.length; j < roomItemLen; j++) {
            if (roomItem[j].specialty && !(specialtyList.indexOf(roomItem[j].specialty) > -1)) {
              this.$store.commit('examineInterval/room/removeRoomSpecialty', {
                index: i,
                cIndex: j
              });
            }
          }
        }
      },
      //添加人员
      addUser () {
        let userList = this.userList;
        this.initUser = [];
        if (userList.length > 0) {
          for (var i = 0, item; i < userList.length; i++) {
            item = userList[i];
            this.initUser.push({
              key: item.userId,
              label: item.userName,
              description: '人员id---' + item.userId + '的描述信息',
              specialty: item.specialty,
              disabled: false
            });
          }
        }
        this.unSelectUser = this.getUnSelectUser('user');
        this.openModel('selectUser');
      },
      /*
       * 获取选择人员的人员信息并赋值
       * @param users [{id:'',name:''},{}]  已选人员信息
       * */
      setUsers (users) {
        // 初始化禁选人员
        let unSelUser = [];
        // 专业
        let specialtyList = [];
        this.userList = [];
        Util._.forEach(users, (val, k) => {
          this.userList.push({
            userId: val.key,
            userName: val.label,
            specialty: val.specialty
          });
          unSelUser.push(val.key);
          specialtyList.push(val.specialty);
        });
        this.closeSltUser();
        // 加入禁选
        this.$store.commit('examineInterval/room/updateUnSelectUser', {
          user: unSelUser
        });
        // 参考人员专业
        this.$store.commit('examineInterval/room/updateSpecialtyList', specialtyList);
        // 参考人员删除同步删除对应房间的专业
        for (let i = 0, roomList = this.roomList, leng = roomList.length; i < leng; i++) {
          for (let j = 0, roomItem = roomList[i].room, roomItemLen = roomItem.length; j < roomItemLen; j++) {
            if (roomItem[j].specialty && !(specialtyList.indexOf(roomItem[j].specialty) > -1)) {
              this.$store.commit('examineInterval/room/removeRoomSpecialty', {
                index: i,
                cIndex: j
              });
            }
          }
        }
      },
      //关闭选择人员弹窗
      closeSltUser () {
        this.cancel('selectUser');
      },
      /*************************** 考场管理员 *********************************/
      // 删除已选择的参考人员
      handleMClose (index) {
        this.managerList.splice(index, 1);
        this.$store.commit('examineInterval/room/removeUnSelectUser', {
          type: 'manager',
          index
        });
      },
      //添加人员
      addManager () {
        let managerList = this.managerList;
        this.initUser = [];
        if (managerList.length > 0) {

          for (var i = 0, item; i < managerList.length; i++) {
            item = managerList[i];
            this.initUser.push({
              key: item.userId,
              label: item.userName,
              description: '人员id---' + item.userId + '的描述信息',
              disabled: false
            });
          }
        }
        this.unSelectUser = this.getUnSelectUser('manager');
        this.openModel('selectManager');
      },
      /*
       * 获取选择人员的人员信息并赋值
       * @param users [{id:'',name:''},{}]  已选人员信息
       * */
      setMUsers (users) {
        let unMUser = [];
        this.managerList = [];
        Util._.forEach(users, (val, k) => {
          this.managerList.push({
            userId: val.key,
            userName: val.label,
            specialty: val.specialty
          });
          unMUser.push(val['key']);
        });
        this.$store.commit('examineInterval/room/updateUnSelectUser', {
          manager: unMUser
        });
        this.closeSltMUser();
      },
      //关闭选择管理人员弹窗
      closeSltMUser () {
        this.cancel('selectManager');
      },
      /*************************** 队列设置 ***********************************/
      setQueue () {
        this.cancel('setQueue');
      },
      /*************************** 权重设置 ***********************************/
      setWeight () {
        this.cancel('setWeight');
      },
      /*************************** SP设置 *************************************/
      addSP () {
        let spList = this.spList;
        this.initUser = [];
        if (spList.length > 0) {
          for (var i = 0, item; i < spList.length; i++) {
            item = spList[i];
            this.initUser.push({
              key: item.userId,
              label: item.userName,
              description: '人员id---' + item.userId + '的描述信息',
              disabled: false
            });
          }
        }
        this.unSelectUser = this.getUnSelectUser('sp');
        this.openModel('setSP');
      },
      // sp设置
      setSP (users) {
        this.spList = [];
        let unSpUser = [];
        Util._.forEach(users, (val, k) => {
          this.spList.push({
            userId: val.key,
            userName: val.label,
            specialty: val.specialty,
            scriptIds: []
          });
          unSpUser.push(val['key']);
        });
        this.$store.commit('examineInterval/room/updateUnSelectUser', {
          sp: unSpUser
        });
        this.closeSPUser();
      },
      //关闭选择SP人员弹窗
      closeSPUser () {
        this.cancel('setSP');
      },
      // 是否有病例
      hasScriptList () {
        var t;
        for (t in this.scriptList) return !1;
        return !0;
      },
      // 更新SP可选剧本列表
      updateScripts () {
        this.scriptList = this.$store.state.examineInterval.room.scriptList; // 剧本列表
      },

      //是否需要更新剧本
      isUpdateScripts () {

      },

      /************************** 排除禁选人员 *********************************/
      // 获取禁选人员
      getUnSelectUser (type) {
        let temp = this.$store.state.examineInterval.room.unSelectUser;
        let unSelArr = [];
        Util._.map(temp, (arr, key) => {
          if (key !== type) {
            unSelArr = unSelArr.concat(arr);
          }
        });
        return unSelArr;
      },

      /************************** 抽签设置 *************************************/
      // 操作已保存到状态
      setDraw () {
        this.cancel('setDraw');
      },
      /************************** 排考预览 *************************************/
      viewTable () {
        // 检测数据
        if (!this.checkData()) {
          return;
        }
        let ajaxObj = {
          ajaxSuccess: 'viewTableData',
          ajaxParams: {
            jsonString: true,
            url: api.preview.path,
            method: api.preview.method,
            data: this.getAjaxParamsData()
          }
        };
        this.ajax(ajaxObj);
      },
      // 排考预览数据请求回调，加载预览表
      viewTableData (res) {
        if (res.data) {
          this.previewData = res.data;
        } else {
          this.previewData = {
            stationRoomList: [],
            timeList: []
          };
        }
        this.openModel('preview');
      },
      /************************** 其他逻辑 *************************************/
      // 点击取消返回列表视图
      back () {
        this.$emit('show', {
          look: 'index'
        });
      },
      /************************** 模态框逻辑 *************************************/
      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
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
      /************************* 底部 *********************************************/
      getContentHeight () {
        let contenHeight = this.$refs.stationMain.offsetHeight - 10;
        let roomHeight = this.$refs.stationRoomBox.offsetTop;
        let stationHeight = contenHeight - roomHeight;
        this.stationRoomStyle.height = (stationHeight < 140 ? 140 : stationHeight) + 'px';
      },
      /************************* 复制 *********************************************/
      copy () {
        // 获取基本信息
        this.getInfo();
        // 获取考站数据
        this.getStationData();
      },
      // 获取数据
      getInfo () {
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        this.ajax({
          ajaxSuccess: 'initInfoData',
          ajaxParams: {
            url: api.getBasic.path + '/' + this.id,
            method: api.getBasic.method
          }
        });
      },
      // 从服务器获取最新数据
      getStationData () {
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        this.ajax({
          ajaxSuccess: 'initGetStation',
          ajaxParams: {
            url: api.getStationInfo.path + this.id,
            method: api.getStationInfo.method
          }
        });
      },
      // 初始化数据
      initInfoData (res) {
        let info = getBasicInfo(res.data);
        // 场次名称、开始时间、结束时间都不需要
        info.sceneName = '';
        info.startTime = '';
        info.endTime = '';
        this.$store.commit('examineInterval/station/setInfo', info);
      },
      // 初始化考站数据
      initGetStation (res) {
        let data = res.data;
        data.sceneType = this.info.sceneType;
        // 数据还原(防止复制考站的时候只复制考站结构引起错误)
        data.stationList.map(station => {
          if (!station.roomList) {
            station.roomList = [];
          } else {
            station.roomList.map(room => {
              if (!room.teacherList) {
                room.teacherList = [];
              }
            });
          }

          if (!station.stationContentList) {
            station.stationContentList = [];
          } else {
            station.stationContentList.map(stationContent => {
              if (!stationContent.scoreTableList) {
                stationContent.scoreTableList = [];
              }
            });
          }
        });

        this.$store.commit('examineInterval/room/setInitData', data);

        this.roomList = this.$store.state.examineInterval.room.roomList; // 考站
        this.roomData = this.$store.state.examineInterval.room.roomInfo; // 考站信息
        this.spList = [];

        let spList = data.spList || [];
        let scriptList = {};

        if (spList.length) {
          for (var i = 0, item; i < spList.length; i++) {
            item = spList[i];
            let tempArr = [];
            if (!item.scriptList) {
              continue;
            }
            for (var k = 0; k < (item.scriptList || []).length; k++) {
              tempArr.push(parseInt(item.scriptList[k].scriptId));
              scriptList[item.scriptList[k].scriptId] = item.scriptList[k];
            }
            item.scriptIds = tempArr;
          }
        }

        this.spList = spList;

        // 更新SP人员的可选择剧本
        this.$store.commit('examineInterval/room/initScriptList', scriptList);
        // 初始化临时状态
        this.$store.commit('examineInterval/temp/initData');
        this.updateScripts();
        this.$nextTick(function () {
          this.getContentHeight();
        });

        // 初始化禁选人员
        this.getUnSelectUserByGetStationData(res.data);

        // 获取专业列表
        this.ajax({
          ajaxSuccess: (res) => {
            if (res.data.length && res.data[0]) {
              this.$store.commit('examineInterval/room/initSpecialtyList', res.data || []);
            }
          },
          ajaxParams: {
            url: api.specialtyList.path,
            method: api.specialtyList.method,
            params: {
              id: this.id
            }
          }
        });
      },

      // 通过复制的考站数据获取sp，teacher的禁选人员
      getUnSelectUserByGetStationData (data) {
        let sp = []; // SP 人员
        let teacher = []; // 监考老师

        (data.spList || []).map(item => sp.push(item.userId));
        (data.stationList || []).map(stationItem => (stationItem.roomList || []).map(roomItem => (roomItem.teacherList || []).map(teacherItem => teacher.push(teacherItem.teacherId))));

        // 加入禁选
        this.$store.commit('examineInterval/room/updateUnSelectUser', {sp, teacher});
      }
    },
    components: {
      room,
      roomInfo,
      selectUser,
      setInfo,
      setDraw,
      setQueue,
      setWeight,
      preview
    },
    created () {
      Util = this.$util;
      let exm = this.$store.state.examineInterval;
      this.info = exm.station.info; // 场次信息
      this.roomList = exm.room.roomList; // 考站
      this.roomData = exm.room.roomInfo; // 考站信息
      this.scriptList = exm.room.scriptList; // 剧本列表
      // 初始化增加场次的类型（规范化|自由）
      this.$store.commit('examineInterval/station/setInfo', {
        sceneType: this.addType
      });
      this.rules = this.addType === 'FREE' ? examineIntervalFREE : examineIntervalSTANDARD;
      this.unSelectUser = this.$store.getters['examineInterval/room/unSelectUser'];

      // 获取专业列表
      // this.ajax({
      //   ajaxSuccess: (res) => {
      //     this.$store.commit('examineInterval/room/initSpecialtyList', res.data || []);
      //   },
      //   ajaxParams: {
      //     url: api.specialtyList.path,
      //     method: api.specialtyList.method,
      //   }
      // });

      // 复制指定场次的数据
      this.id && this.copy();
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.getContentHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.getContentHeight);
      });
    },
    destroyed () {
      this.$store.commit('examineInterval/room/destroy');
      this.$store.commit('examineInterval/station/destroy');
    }
  };

</script>

<style lang="scss">
  @import '../../../assets/ambuf/css/manage_v1.0/editForm';

  #interval {
    .stationInfo .el-form-item__label::before {
      content: '';
      margin: 0;
    }
  }

  .selectUserBox {
    .el-tag {
      margin: 6px;
    }
  }

</style>
