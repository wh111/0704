<template>
  <!-- 预约项目管理 - 增加 -->
  <div>
    <el-form label-width="130px" :model="formValidate" ref="formValidate" :rules="rules">
      <el-row>
        <el-col>
          <el-form-item label="名称：" prop="name">
            <el-input v-model="formValidate.name" style="width:400px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="选择房间：">
            <!--<el-button style="margin-bottom: 10px" v-for="(item,index) in roomList" :key="item.id"-->
            <!--@click="showRoomInfo(item.id)">-->
            <!--{{ item.roomNum }}（承载量：{{ item.bearingCapacity }}）-->
            <!--</el-button>-->

            <template v-for="item in roomList">
              <el-tooltip :key="item.id" v-if="hoverRoomId===item.id" effect="light" placement="left" :open-delay="600">
                <template slot="content">
                  <room-view style="width: 500px;" isShowLoading="true" :id="item.id" :that="self"></room-view>
                </template>
                <span style="cursor: pointer;">{{ item.roomNum }}（承载量：{{ item.bearingCapacity }}）</span>
              </el-tooltip>
              <span style="cursor: pointer;" :key="item.id" v-else @mouseleave="roomMouseleave()" @mouseenter="roomMouseenter(item)">{{ item.roomNum }}（承载量：{{ item.bearingCapacity }}）</span>
            </template>

            <el-button type="primary" @click="selectRoom">选择房间</el-button>
          </el-form-item>
        </el-col>
        <!--<el-col>-->
        <!--<el-form-item label="选择模型：">-->
        <!--<el-tooltip class="item" effect="light" placement="bottom-start" v-for="(item,index) in deviceList"-->
        <!--:key="index">-->
        <!--<div slot="content" style="max-width:200px;">-->
        <!--<p>设备名称：{{ item.deviceTypeName }}</p>-->
        <!--<p>设备数量：{{ item.deviceNum || 0 }}</p>-->
        <!--<p>设备简介：{{ item.describe || '暂无简介' }}</p>-->
        <!--</div>-->
        <!--<el-button>{{ item.deviceTypeName }}</el-button>-->
        <!--</el-tooltip>-->
        <!--<el-button type="primary" @click="selectDevice">选择模型</el-button>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col>
          <el-form-item label="本房间中的设备：">
            <el-tag class="brsdItem" :key="item.id" v-for="(item,index) in roomDevice"
                    :closable="true"
                    :close-transition="false"
                    @close="handleClose('room',index)"
            >{{ item.deviceTypeName + '(' + item.deviceIdentifier + ')' }}
            </el-tag>
            <el-tag class="brsdSelBtn brsdItem" type="primary" @click.native="selectDevice('room')">+选择设备
            </el-tag>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="设备库：">
            <el-tag class="brsdItem" :key="item.id" v-for="(item,index) in otherDevice"
                    :closable="true"
                    :close-transition="false"
                    @close="handleClose('other',index)"
            >{{ item.deviceTypeName + '(' + item.deviceIdentifier + ')' }}
            </el-tag>
            <el-tag class="brsdSelBtn brsdItem" type="primary" @click.native="selectDevice('other')">+选择设备
            </el-tag>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item label="预约简介：" prop="summary">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容"
                      v-model="formValidate.summary">
            </el-input>
          </el-form-item>
        </el-col>


        <!-- <el-col :span="12">
          <el-form-item label="是否开放预约：">
            <el-radio v-model="formValidate.isOpen" label="YES">开放</el-radio>
            <el-radio v-model="formValidate.isOpen" label="NO">关闭</el-radio>
          </el-form-item>
        </el-col> -->
        <!-- <template v-if="formValidate.isOpen === 'YES'"> -->
        <el-col :span="12">
          <el-form-item label="选择开放日期：">
            <el-radio v-model="formValidate.timeModel" label="ALL">全天候</el-radio>
            <el-radio v-model="formValidate.timeModel" label="SPECIFIC">特定日期</el-radio>
          </el-form-item>
        </el-col>
        <!--<el-col v-if="formValidate.timeModel === 'SPECIFIC'">-->
        <el-col>
          <el-form-item label="设置开放时间：" class="bespeakSettingTimeSlot">
            <el-checkbox-group v-model="allDayTimeSlot" style="display: inline;">
              <el-checkbox v-for="(item,index) in timeSlot" :key="item.timeId" :label="index"
                           class="roomTimeSlot">
                <timeQuantum :index="index" :range="range" :data="item"></timeQuantum>
              </el-checkbox>
            </el-checkbox-group>
            <el-button class="roomTimeSlotAddBtn" type="text" @click="addTimeSlot">添加时间段</el-button>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item label="开放预约对象：" class="bespeakSettingActivityUserType">
            <el-radio-group v-model="formValidate.activityUserType">
              <el-col>
                <div class="grid-content-ptop">
                  <el-radio :label="'ROTARYDEP'">人员类型</el-radio>
                  <el-select v-show="formValidate.activityUserType=='ROTARYDEP'"
                             @change="activityDepUserTypeChange"
                             multiple v-model="formValidate.userType" clearable placeholder="请选择">
                    <!--<el-option label="所有" value="SXS,JXS,ZYY,YJS"></el-option>-->
                    <!--<el-option label="实习生" value="SXS"></el-option>-->
                    <!--<el-option label="进修生" value="JXS"></el-option>-->
                    <!--<el-option label="住院医" value="ZYY"></el-option>-->
                    <!--<el-option label="研究生" value="YJS"></el-option>-->
                    <el-option v-for="item in activityUserType" v-if="item.value" :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                </div>
              </el-col>
              <el-col>
                <div style="margin-top: 20px">
                  <el-radio label="PARTUSER" v-model="selPeople">部分人员</el-radio>
                  <!--<el-select  style="max-width: 350px;max-height: 100px;overflow: auto;display: inline-block;vertical-align: middle"-->
                  <!--@remove-tag="userRemove"-->
                  <!--v-show="formValidate.activityUserType == 'PARTUSER'" placeholder multiple-->
                  <!--v-model="partuser.activityUserTypeValue" filterable placeholder="请选择">-->
                  <!--<el-option-->
                  <!--v-for="item in options"-->
                  <!--:key="item.id"-->
                  <!--:label="item.label"-->
                  <!--:value="item.value">-->
                  <!--</el-option>-->
                  <!--</el-select>-->
                  <div v-show="formValidate.activityUserType == 'PARTUSER'"
                       style="max-height: 100px;overflow: auto;display: inline-block;vertical-align: middle">
                    <el-tag v-for="(tag,index) in partuser.activityUserTypeValue" @close="userRemove(index)" :key="tag" style="margin: 5px" type="primary" :closable="true">
                      {{tag}}
                    </el-tag>
                    <el-button size="mini" @click="openAndColseUser('selectUser')">选择人员</el-button>
                  </div>
                </div>
              </el-col>
              <!-- <el-row>
                 <el-col :span="24">
                   <div class="grid-content-ptop">
                     <el-radio :label="'PARTROLE'">指定角色</el-radio>
                     <template>
                       <el-select style="margin-left: 10px" v-show="formValidate.activityUserType=='PARTROLE'" v-model="partrole.activityUserTypeValue" multiple filterable placeholder="请选择">
                         <select-option :type="'role'" :unAll="true"></select-option>
                       </el-select>
                     </template>
                   </div>
                 </el-col>
               </el-row>
               <el-row>
                 <el-col :span="24">
                   <div class="grid-content-ptop"><el-radio :label="'ALLUSER'">所有人</el-radio></div>
                 </el-col>
               </el-row>-->
            </el-radio-group>
            <!--<el-radio-group v-model="formValidate.userType">-->
            <!--<div class="bpProjectBox">-->
            <!--<div class="bpProjectItem">-->
            <!--<el-radio label="ALL">全体人员</el-radio>-->
            <!--</div>-->
            <!--<div class="bpProjectItem">-->
            <!--<el-radio label="ZYY">住院医</el-radio>-->
            <!--<el-radio label="JXS">进修生</el-radio>-->
            <!--<el-radio label="SXS">实习生</el-radio>-->
            <!--<el-radio label="YJS">研究生</el-radio>-->
            <!--</div>-->
            <!--<div class="bpProjectItem">-->
            <!--<el-radio label="SPECIFIC">特定人员</el-radio>-->
            <!--<template v-if="formValidate.userType === 'SPECIFIC'">-->
            <!--<el-tag type="success" class="bpUserItem" :closable="true"-->
            <!--v-for="(item,index) in formValidate.userList" @close="removeUser(index)"-->
            <!--:key="item.userId">{{ item.userName }}-->
            <!--</el-tag>-->
            <!--<el-button type="info" size="small" style="margin-left:10px;"-->
            <!--@click="selectUser">选择人员-->
            <!--</el-button>-->
            <!--</template>-->
            <!--</div>-->
            <!--</div>-->
            <!--</el-radio-group>-->
          </el-form-item>
        </el-col>

        <div style="clear:both;" class="newCalendar" v-if="formValidate.timeModel === 'SPECIFIC'">
          <full-calendar ref="newCalendar" class="test-fc" :tpl="calendarSet.tpl"
                         :itemLimit="calendarSet.itemLimit"
                         :events="calendarSet.fcEvents" first-day='1'
                         locale="zh-cn" @changeMonth="changeMonth" @eventClick="eventClick"
                         @dayClick="dayClick"
                         @moreClick="moreClick"
                         @goPrev="goPrev" @goNext="goNext">
            <template slot="fc-header-left" scope="p">
              <span style="font-size: 16px;">{{monthTitle}}</span>
            </template>
            <template slot="fc-header-center" scope="p">
              <span v-if="false">周-历</span>
            </template>
            <template slot="fc-header-right" scope="p">
              <div style="float: right">
                <el-button-group>
                  <el-button type="primary" icon="arrow-left" @click="goPrev"></el-button>
                  <el-button type="primary" icon="arrow-right" @click="goNext"></el-button>
                </el-button-group>
              </div>
            </template>
            <template slot="fc-event-card" scope="p">
              <p>{{ p.event.title }}</p>
            </template>
          </full-calendar>
        </div>
        <!--</template>-->

        <el-col align="center" style="margin-top:10px;">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        </el-col>
      </el-row>

    </el-form>

    <!-- 模态框 查看（view） -->
    <Modal :mask-closable="false" v-model="showModal" class-name="vertical-center-modal" :loading="true"
           :width="800">
      <modal-header slot="header" :parent="self" :content="contentHeader.showId"></modal-header>
      <room-view v-if="showModal" @cancel="cancel" :operaility-data="operailityData" :id="todoId"></room-view>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 选择房间 -->
    <Modal :mask-closable="false" v-model="selectRoomModal" class-name="vertical-center-modal" :loading="true"
           :width="800">
      <modal-header slot="header" :parent="self" :content="contentHeader.selectRoomId"></modal-header>
      <select-room v-if="selectRoomModal" :select="selectRoomId" @cancel="cancel"
                   @select="selectRoomCall"></select-room>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 选择设备 -->
    <Modal :mask-closable="false" v-model="selectDeviceModal" class-name="vertical-center-modal" :loading="true"
           :width="900">
      <modal-header slot="header" :parent="self" :content="contentHeader.selectDeviceId"></modal-header>
      <select-device v-if="selectDeviceModal" :select="selectDeviceType === 'room' ? roomDeviceId : otherDeviceId"
                     @cancel="cancel" @select="selectDeviceCall" :url="selectDeviceUrl" :selectDeviceType="selectDeviceType"></select-device>
      <div slot="footer"></div>
    </Modal>
    <!--&lt;!&ndash;选择人员&ndash;&gt;-->
    <Modal :mask-closable="false" width="890" v-model="selectUserModal" title="添加人员"
           class-name="vertical-center-modal">
      <modal-header slot="header" :content="contentHeader.selectUserId"></modal-header>
      <select-user v-if="selectUserModal" @cancel="cancel" @setUsers="selectUserCallback"
                   :initUser="selectUser"></select-user>
      <div slot="footer"></div>
    </Modal>
    <!--选择人员-->
    <!--<Modal-->
    <!--close-on-click-modal="false"-->
    <!--width="890"-->
    <!--v-model="selectUserModal"-->
    <!--title="新建教学活动"-->
    <!--class-name="vertical-center-modal"-->
    <!--:loading="loading">-->
    <!--<modal-header slot="header" :content="selectUserId"></modal-header>-->
    <!--<select-user v-if="selectUserModal" @cancel="openAndColseHost('selectUser',false)" @setUsers="selectUserCallback"-->
    <!--:initUser="selectUser"></select-user>-->
    <!--<div slot="footer"></div>-->
    <!--</Modal>-->
  </div>
</template>

<script>
  import api from './api';
  import selectDeviceApi from '../room/api';

  import roomView from '../../room/roomManage/roomManage_view'; // 房间查看
  import activityUserType from './activityUserType';
  import selectRoom from '../../../common/selectRoom'; // 选择房间
  import selectUser from '../../../common/selectUser'; // 选择人员
  import selectDevice from '../room/device_select.vue'; // 选择设备
  import fullCalendar from 'vue-ambuf-fullcalendar'; // 周历
  //引入日历相关的配置
  import calendarSet from './calendarSet';
  // 时间段插件
  import timeQuantum from '../../../common/timeQuantum.vue';
  // 验证规则
  import {
    bespeakSetProject as rules
  } from '../../rules';

  export default {
    props: ['opData'],
    data () {
      return {
        hoverRoomId: '',
        selectUser: [],
        rules,
        activityUserType,
        loading: true,
        self: this,
        options: [],
        range: [],
        item: [{
          start: '',
          end: '',
          time: ''
        }],
        //部分人员
        partuser: {
          activityUserTypeValue: [],
          activityUserTypeValueId: []
        },
        todoId: '', // 查看房间id
        //保存按钮基本信息
        loadBtn: {
          title: '保存设置',
          callParEvent: 'listenSubEvent'
        },
        initUser: [],
        selectRoomId: [],
        roomList: [], // 已选房间
//        selectDeviceId: [],
//        deviceList: [], // 设备列表
        //form表单bind数据
        formValidate: {
          id: '',
          name: '', // 预约项目名称
          summary: '', // 预约简介
          userType: '', // 开放预约对象类型
          activityUserType: 'ROTARYDEP',
          roleId: '', // 可预约角色id
          userIds: '', // 可预约人id字符串，多个id以逗号分隔
//          deviceTypeIds: '', // 设备ids字符串，多个id以逗号分隔
          isCourse: 'NO', // 是否课程
          status: 'ADOPT', // 预约项目状态
          // isOpen: 'YES', // 是否开放预约
          timeModel: 'SPECIFIC', // 选择开放日期
          deviceList: [ // 设备列表
//            {
//              "deviceId":"1",
//              "inRoom":"0,1(0房间外 1房间内)"
//            }
          ],
          userList: [ // 人员列表
            // {
            //   userId:'',
            //   userName:''
            // }
          ],
          openTimeList: [ // 开放时间列表
            // {
            //   "reserveSetType": "ROOM", // 预约设置类型
            //   "date": "2017-01-02", // 日期
            //   "timeSetIds": "1,2,3" // 时间段id字符串
            // },
          ],
          roomList: [ // 房间列表
            // {
            //   "roomId": "1", // 房间id
            //   "bearingCapacity": "5" // 承载量
            // }
          ]
        },

        // 选择设备
        roomDeviceId: [],
        otherDeviceId: [],
        roomDevice: [], // 房间内的设备
        otherDevice: [], // 房间外的设备
        selectDeviceUrl: '',
        selectDeviceType: '', // room|other

        openTimeList: {}, // 开放日期
        allDayTimeSlot: [], // 全天开放时间段(只记录索引)
        timeSlot: [{
          start: '',
          end: '',
          time: ''
        }], // 时间段
        //当前组件提交(add)数据时,ajax处理的 基础信息设置

        // 模态窗
        selectDeviceModal: false,
        selectRoomModal: false,
        selectUserModal: false,
        contentHeader: {
          showId: {
            id: 'showId',
            title: '查看房间'
          },
          selectRoomId: {
            id: 'selectRoomId',
            title: '选择房间'
          },
          selectDeviceId: {
            id: 'selectDeviceId',
            title: '选择模型'
          },
          selectUserId: {
            id: 'selectUserId',
            title: '选择人员'
          }
        },

        // 周历
        calendarSet,
        monthTitle: '',
        //是否显示全日历
        isShowCalendar: false,
        operailityData: {},
        selPeople: '',
        editType: 'add' // 编辑类型
      };
    },

    methods: {
      // 初始化
      init () {
        calendarSet.setCalData([]);
//        this.getTimeSlotList();
        if (this.opData) {
          this.editType = 'edit';
          this.timeSlot = [];
          this.getDataForServer();
        }

      },

      //移除人员的标签
      userRemove (index) {
        let delId = this.partuser.activityUserTypeValueId[index];
        for (let i = 0, l = this.selectUser.length; i < l; i++) {
          if (this.selectUser[i].key == delId) {
            this.selectUser.splice(i, 1);
            break;
          }
        }
        this.partuser.activityUserTypeValueId.splice(index, 1);
        this.partuser.activityUserTypeValue.splice(index, 1);
      },
      //改变参加人人员类型
      activityDepUserTypeChange (item) {
        if (item.includes('SXS,JXS,ZYY,YJS') && !this.userType.includes('SXS,JXS,ZYY,YJS')) {
          this.formValidate.userType = ['SXS,JXS,ZYY,YJS'];
        } else if (item.includes('SXS,JXS,ZYY,YJS') && item.length >= 2) {
          let index = item.indexOf('SXS,JXS,ZYY,YJS');
          this.formValidate.userType.splice(index, 1);
        }
        this.userType = this.formValidate.userType;
      },
      selectUserCallback (data) {
        this.selectUser = data;
        let users = [];
        let userIds = [];
        for (let i = 0; i < data.length; i++) {
          if (!~this.partuser.activityUserTypeValueId.indexOf(data[i].key)) {
            userIds.push(data[i].key);
            users.push(data[i].label);
          }
        }
        this.formValidate.userIds = userIds;
        console.log(this.formValidate.userIds);
        this.partuser.activityUserTypeValue = this.partuser.activityUserTypeValue.concat(users);
        this.partuser.activityUserTypeValueId = this.partuser.activityUserTypeValueId.concat(userIds);
        this.cancel('selectUser');
      },
      //点击选择人员按钮触发
      openAndColseUser (targer, flag) {
        if (typeof flag == 'undefined') flag = true;
        this[targer + 'Modal'] = flag;
      },
      /*
     * 点击提交按钮 监听是否提交数据
     * @param isLoadingFun boolean  form表单验证是否通过
     * */
      listenSubEvent (isLoadingFun) {
        if (!this.submitForm('formValidate')) {
          return false;
        }

        // 设备处理
        this.formValidate.deviceList = [];
        this.roomDeviceId.map(deviceId => {
          this.formValidate.deviceList.push({
            deviceId,
            inRoom: 1
          });
        });

        this.otherDeviceId.map(deviceId => {
          this.formValidate.deviceList.push({
            deviceId,
            inRoom: 0
          });
        });

        // 房间处理
        let roomList = [];
        this.roomList.map(item => {
          roomList.push({
            roomId: item.id,
            bearingCapacity: item.bearingCapacity
          });
        });
        this.formValidate.roomList = roomList;

        if (!this.checkData()) {
          return;
        }

        if (!isLoadingFun) isLoadingFun = function () {
        };
        isLoadingFun(true);

        let str = this.editType === 'add' ? '添加' : '修改';

        let opt = {
          type: this.editType,
          successTitle: str + '成功!',
          errorTitle: str + '失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
            url: api[this.editType].path,
            method: api[this.editType].method,
            data: this.getSendData()
          }
        };

//        console.log(this.getSendData());
//        isLoadingFun();
        this.ajax(opt, isLoadingFun);
      },

      getSendData () {
        let data = this.getFormData(this.formValidate);
        let userIdArr = [];
        data.userType = data.userType.toString() || ''; // 预约对象

        //当设置的时间为全天候的时候
        if (this.formValidate.timeModel === 'ALL') {
          data.openTimeList = this.setAllOpenTimeList();
        } else {
          data.openTimeList = this.setOpenTimeList();
        }
        // 人员处理
        if (data.activityUserType == 'PARTUSER') { // 部分人员
          userIdArr = this.partuser.activityUserTypeValueId;
        }
        data.userIds = userIdArr.join(',');

        return data;
      },

      setOpenTimeList () {
        // 开放时间
        let openTimeList = this.$util._.defaultsDeep({}, this.openTimeList);
        let openTimeListArr = [];
        this.$util._.map(openTimeList, item => {
          item.timeSlot.map(time => {
            let t = time.split('-');
            openTimeListArr.push({
              'reserveSetType': 'PROJECT',
              'date': item.date,
              'startTime': t[0],
              'endTime': t[1]
            });
          });
        });
        return openTimeListArr;
      },

      //当设置的时间为全天候的时候调用此函数设置时间       timeModel ALL
      setAllOpenTimeList () {
        let tempArr = [];
        let allDayTimeSlot = this.$util._.defaultsDeep([], this.allDayTimeSlot);
        if (this.allDayTimeSlot.length) {
          let item;
          allDayTimeSlot.sort((a, b) => a < b).map(i => {
            item = this.timeSlot[i];
            // 只有开始和结束时间都设置了才能设置对应的日期
            item._start && item._end && tempArr.push({
              'reserveSetType': 'PROJECT',
              'date': '',
              'startTime': item._start,
              'endTime': item._end
            }); // 选中的时间段
          });
        }
        return tempArr;
      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = this.$util._.defaultsDeep({}, data);
        return myData;
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
      // 检测数据是否合理
      checkData () {
        if (!this.formValidate.roomList.length) {
          this.errorMess('至少选择一个房间');
          return false;
        }
        if (!(this.roomDeviceId.length || this.otherDeviceId.length)) {
          this.errorMess('至少选择一台设备');
          return false;
        }
//        for (let list = this.formValidate.roomList, item, l = list.length, i = 0; i < l; i++) {
//          item = list[i];
//          if (isNaN(item.bearingCapacity) || item.bearingCapacity > 10000 || item.bearingCapacity < 1) {
//            this.errorMess(`房间号“${this.roomList[i].roomNum}”承载量 1-10000 之间`)
//            return false
//          }
//        }
        if (this.formValidate.activityUserType == 'ROTARYDEP' && !this.formValidate.userType.length) { // 人员类型
          this.errorMess('至少选择一个人员类型！');
          return false;
        }
        if (this.formValidate.activityUserType == 'PARTUSER' && !this.partuser.activityUserTypeValueId.length) { // 部分人
          this.errorMess('至少选择一个人！');
          return false;
        }
        if (this.formValidate.timeModel === 'SPECIFIC' && this.$util.isEmptyObject(this.openTimeList)) { // 特定日期
          this.errorMess('开放日期至少要有一天');
          return false;
        }
        if (this.formValidate.timeModel === 'ALL' && !this.allDayTimeSlot.length) { // 全天候
          this.errorMess('开放时间不能为空');
          return false;
        }
        return true;
      },
      /*********************************************************** 周历 ***********************************************/
      goPrev () {
        this.$refs['newCalendar'].goPrev();
      },
      goNext () {
        this.$refs['newCalendar'].goNext();
      },
      changeMonth (start, end, current, foramatData) {
        this.monthTitle = foramatData(current, 'MMMM YYYY');
        this.currMonth = this.conductDate(current, 'yyyy-MM');
      },
      /**
       * 日期格式化内容被点击时触发
       * @param event      {}  当前被点击内容对象
       * @param jsEvent    {}  被点击的鼠标事件对象
       * @param pos        {}  当前位置对象
       */
      eventClick (event, jsEvent, pos) {
        this.dayClick(event.start, jsEvent);
      },
      /**
       * @param day
       * @param jsEvent
       */
      dayClick (day, jsEvent) {
        let date = (this.conductDate(day, 'yyyy-MM-dd')).toString();
        let allDayTimeSlot = this.$util._.defaultsDeep([], this.allDayTimeSlot);
        if (this.openTimeList[date] && !this.allDayTimeSlot.length) {
          delete this.openTimeList[date]; // 如果当前日期没有选择时间段则删除此日期
        } else if (this.allDayTimeSlot.length) {
          let item;
          let timeSlot = [];
          allDayTimeSlot.sort((a, b) => a < b).map(i => {
            item = this.timeSlot[i];
            // 只有开始和结束时间都设置了才能设置对应的日期
            item._start && item._end && timeSlot.push(item._time); // 选中的时间段
          });
          this.openTimeList[date] = {
            date,
            timeSlot
          };
        }
        this.setAllDayTimeSlot();
      },
      // 设置日期对应的时间段
      setAllDayTimeSlot () {
        let data = this.openTimeList;
        let showData = [];
        this.$util._.map(data, (item, key) => {
          if (item.timeSlot.length) {
            item.timeSlot.map(tItem => {
              showData.push({
                title: tItem,
                start: item.date,
                end: item.date
              });
            });
          } else {
            delete data[key];
          }
        });
        calendarSet.setCalData(showData);
      },
      /**
       * @param day
       * @param events
       * @param jsEvent
       */
      moreClick (day, events, jsEvent) {
        //console.log('moreCLick', day, events, jsEvent)
      },

      // 添加时间段
      addTimeSlot () {
        this.timeSlot.push( // 开放时间段
          {
            start: '',
            end: '',
            time: ''
          });
      },

      // 选择房间
      selectRoom () {
        this.openModel('selectRoom');
      },

      // 选择房间
      selectRoomCall (res) {
        this.selectRoomId.length = 0;
        (res || []).map(item => {
          this.selectRoomId.push(item.id);
          item.bearingCapacity = item.capacity || 0; // 可容量
        });
        this.roomList = res;
        this.cancel('selectRoom');
      },

      // 选择设备模型
      selectDevice (type) {
        if (!this.selectRoomId.length) {
          this.errorMess('请先选择房间！');
          return false;
        }
        this.selectDeviceUrl = selectDeviceApi[type].path + this.selectRoomId.join(',');
        this.selectDeviceType = type;
        this.openModel('selectDevice');
      },

      // 选择设备模型
      selectDeviceCall (arr) {
        (arr || []).map(item => {
          if (this.selectDeviceType == 'room') {
//            this.roomDevice[item.id] = item;
//            roomDeviceId:[],
//              otherDeviceId:[],
            if (this.roomDeviceId.indexOf(item.id) == -1) {
              this.roomDeviceId.push(item.id);
              this.roomDevice.push(item);
            }
          } else {
//            this.otherDevice[item.id] = item;
            if (this.otherDeviceId.indexOf(item.id) == -1) {
              this.otherDeviceId.push(item.id);
              this.otherDevice.push(item);
            }
          }
        });
        this.cancel('selectDevice');
      },

      // 删除选择的数据
      handleClose (type, index) {
//        let obj = {};
        if (type == 'room') {
//          obj = this.$util._.defaultsDeep({}, this.roomDevice);
//          delete (obj[id]);
//          this.roomDevice = obj;
          this.roomDevice.splice(index, 1);
          this.roomDeviceId.splice(index, 1);
        } else {
//          obj = this.$util._.defaultsDeep({}, this.otherDevice);
//          delete (obj[id]);
//          this.otherDevice = obj;
          this.otherDevice.splice(index, 1);
          this.otherDeviceId.splice(index, 1);
        }
      },

      // 选择人员
      selectUser () {
        let userList = this.formValidate.userList;
        this.initUser.length = 0;
        if (userList.length > 0) {
          for (var i = 0, item; i < userList.length; i++) {
            item = userList[i];
            this.initUser.push({
              key: item.userId,
              label: item.userName,
              description: '人员id---' + item.userId + '的描述信息',
              disabled: false
            });
          }
        }
        this.openModel('selectUser');
      },

      // 选择人员回调
      selectUserCall (res) {
        console.log(res);
        this.formValidate.userList.length = 0;
        this.$util._.forEach(res, val => {
          this.formValidate.userList.push({
            userId: val.key,
            userName: val.label
          });
        });
        console.log(this.formValidate.userList);
        this.cancel('selectUser');
      },

      // 删除人员
      removeUser (index) {
        this.formValidate.userList.splice(index, 1);
      },

      // 房间查看
      showRoomInfo (id) {
        this.todoId = id;
        this.openModel('show');
      },

      // 房间划入事件
      roomMouseenter (item) {
        this.hoverRoomId = item.id;
      },
      // 房间滑出事件
      roomMouseleave () {
        this.hoverRoomId = '';
      },

      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      // 模态窗关闭
      cancel (options) {
        this[options + 'Modal'] = false;
      },

      // 获取周历标题
      getDataTitle (obj) {
        return obj.name + '（' + obj.startTime + ' - ' + obj.endTime + '）';
      },

      // 获取时间段
      getTimeSlotList () {
        this.ajax({
          ajaxSuccess: res => {
            this.timeSlot = res.data || [];
            this.getDataForServer();
          },
          ajaxParams: {
            url: api.teachCourseTime.path,
            method: api.teachCourseTime.method
          }
        });
      },

      // 获取数据
      getDataForServer () {
        this.ajax({
          ajaxSuccess: 'getDataSuccess',
          ajaxParams: {
            url: api.get.path + this.opData.id,
            method: api.get.method
          }
        });
      },

      // 初始化数据
      getDataSuccess (res) {
        if (res.data.userType) {
          this.formValidate.userType = res.data.userType.split(',');
          if (this.formValidate.userType[0] == 'SPECIFIC') {
            this.formValidate.activityUserType = 'PARTUSER';
            var that = this;
            res.data.userList.map(function (item) {
              that.partuser.activityUserTypeValue.push(item.name);
            });
            that.partuser.activityUserTypeValue.join(',');
            this.formValidate.userType = [];
          }
          console.log(this.formValidate.userType);
        }
//                if(res.data.userIds){
//                    this.formValidate.userIds=res.data.userIds.split(',');
//                }

        let fData = this.formValidate;
        let rData = res.data;
        let openTimeList = {};

        // 数组初始化
        this.selectRoomId.length = 0;
        this.roomList.length = 0;
        this.roomDeviceId.length = 0;
        this.otherDeviceId.length = 0;
//        this.deviceList.length = 0;
        this.formValidate.userList.length = 0;

        // 基本数据
        fData.id = rData.id;
        fData.name = rData.name;
        fData.summary = rData.summary;

        fData.status = rData.status;
        fData.timeModel = rData.timeModel;

        // 房间数据
        rData.roomList.map(item => {
          this.selectRoomId.push(item.roomId);
          this.roomList.push({
            id: item.roomId,
            roomNum: item.roomNum,
            bearingCapacity: item.bearingCapacity
          });
        });

        // 设备数据
        rData.deviceList.map(item => {
          if (item.inRoom) {
            this.roomDeviceId.push(item.deviceId);
            this.roomDevice.push(item);
          } else {
            this.otherDeviceId.push(item.deviceId);
            this.otherDevice.push(item);
          }
        });

//        rData.deviceList.map(item => {
//          this.selectDeviceId.push(item.deviceTypeId);
//          this.deviceList.push(item)
//        })

        // 指定人员
        rData.userList.map(item => {
          this.formValidate.userList.push({
            userId: item.id,
            userName: item.name
          });
        });

        // 日期时间处理
        // 根据日期设置对应的时间段
        if (rData.timeModel == 'SPECIFIC') {
          rData.openTimeList.map(item => {
            if (!openTimeList[item.date]) {
              openTimeList[item.date] = {
                date: item.date,
                timeSlot: [item.startTime + '-' + item.endTime]
              };
            } else {
              openTimeList[item.date].timeSlot.push(item.startTime + '-' + item.endTime);
            }
          });
          this.timeSlot = [{
            start: '',
            end: '',
            time: ''
          }];
        } else {
          let timeSlot = [];
          let index = [];
          rData.openTimeList.map((item, i) => {
            timeSlot.push({
              start: '',
              end: '',
              time: item.startTime + '-' + item.endTime
            });
            index.push(i);
          });
          this.allDayTimeSlot = index;
          if (timeSlot != 0) {
            this.timeSlot = timeSlot;
          } else {
            this.timeSlot = [{
              start: '',
              end: '',
              time: ''
            }];
          }
        }

        this.openTimeList = openTimeList;
        this.setAllDayTimeSlot();
      }
    },
    components: {
      fullCalendar,
      roomView,
      selectUser,
      selectRoom,
      selectDevice,
      timeQuantum
    },
    created () {
      this.init();
    }
  };

</script>

<style lang="scss">
  /* 预约项目管理 - 增加 */

  .newCalendar .comp-full-calendar {
    max-width: 1280px;
    padding: 10px 0;
  }

  .newCalendar .full-calendar-body .dates .dates-events .events-week .events-day {
    min-height: 90px;
  }

  .newCalendar .full-calendar-body .dates .dates-events .events-week .events-day .event-box {
    overflow: hidden;
    width: 95%;
    position: relative;
    top: -18px;
  }

  .bpProjectBox {
    display: inline-block; // padding-top: 10px;
    .bpProjectItem {
      height: 36px;
      line-height: 36px;
      .el-input {
        width: 250px;
        margin-left: 20px;
        display: inline-block;
      }
      & ~ .bpProjectItem {
        margin-top: 16px;
      }
    }
    .bpUserItem {
      margin-left: 6px;
      margin-top: -9px;
    }
  }

  .bpProjectSelectRoom {
    margin-bottom: 10px;
    .el-input {
      width: 80px;
    }
  }

  .bespeakSettingActivityUserType {
    .el-radio-group {
      width: 100%;
    }
    .el-select {
      width: 88%;
      margin-left: 1%;
    }
  }

  .bespeakSettingTimeSlot {
    .roomTimeSlot {
      margin-left: 0;
      margin-right: 16px;
    }
  }

</style>
