<template>
  <!-- 查看信息 - 规范化考核场次（可编辑） -->
  <div id="interval">
    <el-form :model="info" :rules="rules" ref="info" labeWidth="80px"
             :inline="true" class="resetFormItemHeight">
      <el-row class="stationInfo">
        <el-col :span="8">
          <el-form-item label="考核名称：" prop="sceneName">
            <el-input v-model="info.sceneName" placeholder="请输入考核名称"
                      :maxlength="50" :disabled="!canEdit"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="开始时间：" prop="startTime">
            <el-date-picker v-model="info.startTime" :editable="false"
                            type="datetime" placeholder="选择考核开始时间"
                            :disabled="!canEdit">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="viewType === 'FREE'">
          <el-form-item label="结束时间：" prop="endTime">
            <el-date-picker v-model="info.endTime" :editable="false"
                            type="datetime" placeholder="选择考核结束时间"
                            :disabled="!canEdit">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <template v-if="viewType === 'STANDARD'">
          <el-col :span="8">
            <el-form-item label-width="0">
              <span style="float:left;">是否SP轮转：</span>
              <el-radio class="radio" v-model="info.isSpMove" label="YES"
                        :disabled="!canEdit">是
              </el-radio>
              <el-radio class="radio" v-model="info.isSpMove" label="NO"
                        :disabled="!canEdit">否
              </el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="0" prop="restNum">
              <span style="float:left;">每考 </span>
              <el-col :span="5">
                <el-input v-model="info.restNum" size="small"
                          :disabled="!canEdit"></el-input>
              </el-col>
              <span> 站休息一次 </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="0" prop="restTime">
              <span style="float:left;">每次休息 </span>
              <el-col :span="5">
                <el-input v-model="info.restTime" size="small"
                          :disabled="!canEdit"></el-input>
              </el-col>
              <span> 分钟</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="0" prop="moveTime">
              <span style="float:left;">换站时间：</span>
              <el-col :span="5">
                <el-input v-model="info.moveTime" size="small"
                          :disabled="!canEdit"></el-input>
              </el-col>
              <span>分钟</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="0" prop="basicsTime">
              <span style="float:left;">考试时间基数：</span>
              <el-col :span="5">
                <el-input v-model="info.basicsTime" size="small"
                          :disabled="!canEdit"></el-input>
              </el-col>
              <span>分钟</span>
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="8">
          <el-form-item label="评分步长：" prop="step">
            <el-input v-model="info.step" placeholder="步长区间：0.1-10"
                      :disabled="!canEdit"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="0" prop="scoringMethod">
            <span style="float:left;">评分方式：</span>
            <el-radio class="radio" v-model="info.scoringMethod" label="SCORE"
                      :disabled="!canEdit">得分制
            </el-radio>
            <el-radio class="radio" v-model="info.scoringMethod"
                      label="DEDUCTION" :disabled="!canEdit">扣分制
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="0" prop="hasRemind">
            <span style="float:left;">是否提醒：</span>
            <el-radio class="radio" v-model="info.hasRemind" :label="true" :disabled="!canEdit">是</el-radio>
            <el-radio class="radio" v-model="info.hasRemind" :label="false" :disabled="!canEdit">否</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="info.hasRemind">
          <el-form-item label="提醒时间：" prop="remindTime">
            <el-input v-model="info.remindTime" placeholder="时长区间：0.1-10分钟" :disabled="!canEdit"></el-input>
          </el-form-item>
        </el-col>
        <!-- 考场管理员 -->
        <el-col>
          <div class="el-form selectUserBox">
            <fieldset>
              <legend style="font-size:16px">&nbsp;&nbsp;考场管理员
                <el-button type="primary" size="mini" @click="addManager"
                           :disabled="!canEdit" icon="plus"></el-button>&nbsp;&nbsp;
              </legend>
              <template v-if="managerList.length">
                <el-tag v-for="(item,index) in managerList"
                        :key="item.managerId" :closable="canEdit" type="success"
                        @close="handleMClose(index)">
                  {{item.userName}}
                </el-tag>
              </template>
              <p v-else>暂无考场管理员</p>
            </fieldset>
          </div>
        </el-col>
        <el-col style="margin-top:20px;">
          <load-btn v-if="info.status!='PUBLISH'" @listenSubEvent="saveInfo"
                    :btnData="loadBtn" :disabled="!canEdit"
                    :class="{'is-disabled':!canEdit}"></load-btn>
        </el-col>
      </el-row>
    </el-form>
    <!--选择考场管理员-->
    <Modal :mask-closable="false" width="890" v-model="selectManagerModal"
           title="添加考场管理员"
           class-name="vertical-center-modal">
      <modal-header slot="header"
                    :content="contentHeader.selectManagerId"></modal-header>
      <!-- 此处人员还未对应 -->
      <select-user v-if="selectManagerModal" @cancel="closeSltMUser"
                   @setUsers="setMUsers" :unSelect="unSelectUser"
                   :initUser="initUser"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  let Util = null;

  import api from '../api'; // API

  import selectUser from '../../../common/selectUser'; // 选择人员

  import {
    examineIntervalFREE, // 自由考核基本信息规则
    examineIntervalSTANDARD // 规范考核基本信息规则
  } from '../../rules'; // 考站基本信息验证

  import { getM2S, getBasicInfo } from '../formatData';

  export default {
    props: {
      id: {
        type: Number,
        required: true
      }
    },
    data () {
      return {
        canEdit: true,
        viewType: '', // 当前操作类视图
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        unSelectUser: [],
        selectManagerModal: false,
        rules: {}, // 验证规则
        info: {
          sceneName: '', // 考核名称
          startTime: '', // 开始时间
          endTime: '', // 结束时间
          setupTime: '', // 时间表生成时间
          restNum: '', // 间隔时间
          restTime: '', // 休息时间
          isSpMove: '', // 是否SP
          moveTime: '', // 换站时间
          basicsTime: '', // 考试时间基数
          status: '' // 状态
          // managerList: [], // 考场管理员
        },
        // 模态框信息
        contentHeader: {
          selectManagerId: {
            id: 'selectManagerId',
            title: '选择考场管理员'
          }
        },
        //给选择人员框传递的已选人员信息
        initUser: [],
        // 考场管理员
        managerList: []
      };
    },
    methods: {
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
      // 获取禁选人员
      getUnSelUser () {
        this.ajax({
          ajaxSuccess: res => {
            this.$store.commit('examineInterval/room/initUnSelectUser',
              res.data);
          },
          ajaxParams: {
            url: api.queryAllUserList.path,
            params: {
              sceneId: this.id
            }
          }
        });
      },
      // 初始化数据
      initInfoData (res) {
        let info = getBasicInfo(res.data);
        this.info = info;
        this.$store.commit('examineInterval/station/setInfo', this.info);
        this.managerList = res.data.managerList;
        this.viewType = res.data.sceneType;
        this.canEdit = this.$store.getters['examineInterval/station/edit'];
      },
      // 保存基本信息
      saveInfo (isLoadingFun) {
        if (!this.canEdit) {
          this.errorMess('当前考站正在考核或者考核结束，不能进行修改！');
          this.getInfo();
          return;
        }
        let isSubmit = this.submitForm('info');
        if (!isSubmit) {
          this.errorMess('请填写完整资料再提交！');
          return;
        }
        let info = Util._.defaultsDeep({}, this.info);
        let managerList = Util._.defaultsDeep([], this.managerList);
        info.startTime = this.conductDate(info.startTime, 'yyyy-MM-dd HH:mm:ss').replace(/\d{2}$/, '00');
        info.endTime = this.conductDate(info.endTime, 'yyyy-MM-dd HH:mm:ss').replace(/\d{2}$/, '00');

        info.basicsTime = getM2S(info.basicsTime); // 考试时间基数
        info.remindTime = info.hasRemind ? getM2S(info.remindTime) : 0; // 提醒时长
        if (info.sceneType === 'STANDARD') { // 理论考核
          info.restTime = getM2S(info.restTime); // 中场休息时间
          info.moveTime = getM2S(info.moveTime); // 换站时间
        }

        let params = Util._.assign(info, {
          managerList
        });
        // 数据更新到状态
        this.saveInfoToState(info, managerList);
        if (!isLoadingFun) isLoadingFun = function () {};
        isLoadingFun(true);
        this.ajax({
          type: 'edit',
          successTitle: '保存成功!',
          errorTitle: '保存失败!',
          ajaxSuccess: () => {
            this.$message.success('保存成功');
            this.getInfo();
            this.getUnSelUser();
          },
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
            url: api.modifyBasic.path + '/' + this.id,
            method: api.modifyBasic.method,
            data: params
          }
        }, isLoadingFun);
      },
      // 保存数据到状态
      saveInfoToState (info) {
        this.$store.commit('examineInterval/station/setInfo', info);
        this.$emit('updateInfo');
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
      /*************************** 考场管理员 *********************************/
      // 删除已选择的参考人员
      handleMClose (index) {
        this.managerList.splice(index, 1);
      },
      //添加人员
      addManager () {
        this.initUser = [];
        let managerList = this.managerList;
        if (managerList.length > 0) {

          for (var i = 0, item; i < managerList.length; i++) {
            item = managerList[i];
            this.initUser.push({
              key: item['userId'],
              label: item['userName'],
              description: '人员id---' + item['userId'] + '的描述信息',
              disabled: false
            });
          }
        }
        this.getUnSelectUser();
        this.openModel('selectManager');
      },
      /*
       * 获取选择人员的人员信息并赋值
       * @param users [{key:'',label:''},{}]  已选人员信息
       * */
      setMUsers (users) {
        this.managerList = [];
        Util._.forEach(users, (val, k) => {
          this.managerList.push({
            'userId': val['key'],
            'userName': val['label']
          });
        });
        //this.managerList = users;
        this.closeSltMUser();
      },
      //关闭选择管理人员弹窗
      closeSltMUser () {
        this.cancel('selectManager');
      },
      // 获取禁选人员
      getUnSelectUser () {
        let temp = this.$store.state.examineInterval.room.unSelectUser;
        let unSelArr = [];
        Util._.map(temp, (arr, key) => {
          if (key !== 'manager') {
            unSelArr = unSelArr.concat(arr);
          }
        });
        this.unSelectUser = unSelArr;
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
      }
    },
    components: {
      selectUser
    },
    created () {
      Util = this.$util;
      this.viewType = this.$store.state.examineInterval.station.info.sceneType;
      this.rules = this.viewType == 'FREE' ? examineIntervalFREE : examineIntervalSTANDARD;
      this.getInfo();
    }
  };

</script>

<style lang="scss">
  #interval {
    .stationInfo .el-form-item__label::before {
      content: '';
      margin: 0;
    }
  }

</style>
