<template>
  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules.teachingActivitiesSet" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="活动时间 :" prop="activityTime">
            <el-date-picker @change="upDataIsplan" type="date" :editable="false" placeholder="选择日期"
                            v-model="formValidate.activityTime" style="width: 100%;"></el-date-picker>
          </el-form-item>


          <el-form-item label="计划 :" prop="isPlan">
            <el-radio-group @change="isPlanChange" v-model="formValidate.isPlan">
              <el-radio label="Y">计划内</el-radio>
              <el-radio label="N">计划外</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item style="width:284px;" label="类型 :" prop="activityType">
            <el-select disabled style="width:284px;" v-model="formValidate.activityType" placeholder="请选择">
              <select-option :unAll="true" :id="'value'" :isCode="true" :type="'teachActivityType'"></select-option>
            </el-select>
          </el-form-item>

          <el-form-item label="授课老师 :" prop="hostUserName">
            <el-input readonly @focus="openAndColseHost('host')" v-model="formValidate.hostUserName"></el-input>
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item style="width:284px;" label="科室 :" :prop="fromWhere?'depId':''">
            <el-select @change="upDataIsplan" style="width:284px;" v-model="formValidate.depId" placeholder="请选择">
              <!--<select-option  :unAll="true"></select-option>-->
              <select-option :type="'byUserType'" :unAll="fromWhere"></select-option>
            </el-select>
          </el-form-item>

          <div v-if="isPlan" style="display: inline-block">
            <el-form-item style="width:284px;" label="月度计划 :" prop="planDetailId">
              <el-select @change="planChange" style="width:284px;" v-model="activityPlan" placeholder="请选择">
                <el-option
                  v-for="item in planData"
                  :key="item.id"
                  :label="item.planActivityTitle"
                  :value="item.planDetailId+'-'+item.activityPlanId">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item v-show="!isPlan" style="width:284px;">
            &nbsp;
          </el-form-item>

          <el-form-item label="活动名称 :" prop="activityName">
            <el-input disabled v-model="formValidate.activityName"></el-input>
          </el-form-item>

          <el-form-item label="活动地点 :" prop="activitySite">
            <el-input v-model="formValidate.activitySite"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="时间段 :" prop="recordTimes">
            <el-time-picker
              is-range
              :editable="false"
              v-model="formValidate.recordTimes"
              placeholder="选择时间范围">
            </el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参加主体对象:" prop="participantSubject">
            <el-select v-model="formValidate.participantSubject" clearable placeholder="请选择">
              <el-option label="所有" value="ALL"></el-option>
              <el-option label="实习生" value="SXS"></el-option>
              <el-option label="进修生" value="JXS"></el-option>
              <el-option label="住院医" value="ZYY"></el-option>
              <el-option label="研究生" value="YJS"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!--  <el-row>
          <el-col :span="12">
            <el-form-item label="病例 :" prop="whetherNeedCases">
              <el-radio-group v-model="formValidate.whetherNeedCases">
                <el-radio :label="'YES'">需要</el-radio>
                <el-radio :label="'NO'">不需要</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="病例名称 :" prop="casesName"  v-show="formValidate.whetherNeedCases=='YES'">
              <el-input v-model="formValidate.casesName" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>-->
      <el-row>
        <el-col :span="24">
          <el-form-item label="活动内容 :" prop="activityContent">
            <div class="grid-content">
              <el-input type="textarea" :rows="6" resize="none" v-model="formValidate.activityContent"></el-input>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="参加人 :" prop="name9">
            <el-radio-group v-model="formValidate.activityUserType">
              <el-row>
                <el-col :span="24">
                  <div class="grid-content-ptop">
                    <el-radio :label="'ROTARYDEP'">轮转科室</el-radio>
                    <el-select v-show="formValidate.activityUserType=='ROTARYDEP'"
                               @change="activityUserTypeChange"
                               v-model="rotarydep.activityUserTypeValue" multiple placeholder="请选择">
                      <el-option v-for="(item,index) in depDta" :key="index" :label="item.name"
                                 :value="item.id"></el-option>
                    </el-select>
                    <div v-show="formValidate.activityUserType=='ROTARYDEP'"
                         style="display:inline-block;width: 100px;font-size:14px;text-align: right">人员类型:
                    </div>
                    <el-select v-show="formValidate.activityUserType=='ROTARYDEP'" multiple
                               @change="activityDepUserTypeChange" v-model="formValidate.activityDepUserType" clearable
                               placeholder="请选择">
                      <el-option label="所有" value="SXS,JXS,ZYY,YJS"></el-option>
                      <el-option label="实习生" value="SXS"></el-option>
                      <el-option label="进修生" value="JXS"></el-option>
                      <el-option label="住院医" value="ZYY"></el-option>
                      <el-option label="研究生" value="YJS"></el-option>
                    </el-select>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div class="grid-content-ptop">
                    <el-radio :label="'PARTUSER'">部分人员</el-radio>
                    <!--<el-select style="margin-left: 10px;height: 50px" @remove-tag="userRemove"  v-show="formValidate.activityUserType == 'PARTUSER'" placeholder multiple v-model="partuser.activityUserTypeValue" filterable placeholder="请选择">-->
                    <!--<el-option-->
                    <!--v-for="item in options"-->
                    <!--:key="item.id"-->
                    <!--:label="item.label"-->
                    <!--:value="item.value">-->
                    <!--</el-option>-->
                    <!--</el-select>-->
                    <div v-show="formValidate.activityUserType == 'PARTUSER'"
                         style="max-width: 350px;max-height: 100px;overflow: auto;display: inline-block;vertical-align: middle">
                      <el-tag
                        v-for="(tag,index) in partuser.activityUserTypeValue"
                        @close="userRemove(index)"
                        :key="tag"
                        style="margin: 5px"
                        type="primary"
                        :closable="true">
                        {{tag}}
                      </el-tag>
                    </div>
                    <el-button v-show="formValidate.activityUserType=='PARTUSER'"
                               @click="openAndColseUser('selectUser')">选择人员
                    </el-button>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div class="grid-content-ptop">
                    <el-radio :label="'ALLUSER'">所有人员</el-radio>
                  </div>
                </el-col>
              </el-row>
              <!-- <el-row >
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
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="相关证明材料:">
            <upload-file :uploadFiles="data.activityFileList" @setUploadFiles="expenseFileEvent"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="10" :offset="10">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
    <!--选择人员-->
    <Modal
      close-on-click-modal="false"
      width="890"
      v-model="selectUserModal"
      title="新建教学活动"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="selectUserId"></modal-header>
      <select-user v-if="selectUserModal" @cancel="openAndColseHost('selectUser',false)" @setUsers="selectUserCallback"
                   :initUser="selectUser"></select-user>
      <div slot="footer"></div>
    </Modal>
    <!--选择主持人-->
    <Modal
      close-on-click-modal="false"
      width="890"
      v-model="hostModal"
      title="新建教学活动"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="hostId"></modal-header>
      <select-user v-if="hostModal" @cancel="openAndColseHost('host',false)" @setUsers="selectHostCallback"
                   :isOnlyOne="true" :initUser="selectHost"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<style>

</style>
<script>
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['url', 'operailityData', 'rules', 'fromWhere'],
    data() {
      return {
        //科室需要的数据
        type: '',  //科室类型
        unAll: false,  //是否全部不显示
        isPlan: true,
        selectHost: [],
        selectUser: [],
        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        countDate: 0,
        options: [],

        activityPlan: '',
        getRecordTimes: '',

        "formValidate": {
          "depId": '',
          "activityName": "",
          "activityType": "",
          "hostUserId": '',
          "hostUserName": "",
          "activityTime": "",
          "activitySite": "",
          "activityUser": "",
          "whetherNeedCases": "",
          "casesName": "",
          "activityContent": "",
          "activityUserType": "",
          "activityUserTypeValue": "",
          "activityDepUserType": [],
          "shouldUserCount": '',
          "actuallyUserCount": '',
          "timeIds": "",
          "recordTimes": [],
          "activityState": "",  //新增

          isPlan: '',  //是否计划内
          activityPlanId: '', //月度计划ID
          planDetailId: '', //计划详情ID
          activityFileIds: '',
          activityFileList: [],

          participantSubject: 'ALL' //参加主体对象（默认ALL）(新增2017-11-13)(SXS-实习生、YJS-研究生、ZYY-住院医、JXS-进修生、ALL所有类型)
        },

        "data": {
          "id": '',
          "depId": '',
          "depName": "",
          "activityName": "",
          "activityType": "",
          "hostUserId": '',
          "hostUserName": "",
          "activityTime": "",
          "activitySite": "",
          "activityUser": "",
          "whetherNeedCases": "",
          "casesName": "",
          "activityContent": "",
          "activityUserType": "",
          "activityUserTypeValue": " ",
          "activityUserTypeValueName": " ",
          "activityDepUserType": "",
          "shouldUserCount": '',
          "actuallyUserCount": '',
          "timeIds": "",
          "recordTimes": "",
          "activityState": "",
          "fileList": [],
          "activityFileList": []
        },

        //轮转科室
        rotarydep: {
          activityUserTypeValue: [],
        },
        //部分人员
        partuser: {
          activityUserTypeValue: [],
          activityUserTypeValueId: [],
        },
        //部分角色
        partrole: {
          activityUserTypeValue: [],
        },

        //查看
        addmodal: false,
        hostModal: false,
        //轮转科室
        lzDep: true,
        //部分人员控制
        partPer: true,
        //指定人员控制
        designatedPer: false,
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: this.url.teachctivityAdd,
            method: 'post'
          }
        },
        //选择人员
        selectUserModal: false,
        selectUserId: {
          id: "selectUserId",
          title: "选择人员",
          usersData: ''
        },
        hostId: {
          id: "hostId",
          title: "选择主持人",
          usersData: ''
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle: {
          type: 'edit',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: this.url.teachctivityModify + '/' + this.operailityData.id,
            method: 'put'
          }
        },
        loading: false,

        //计划
        isPlanMessTitle: {
          ajaxSuccess: 'isPlanSuccess',
          ajaxParams: {
            url: this.url.getList,
            params: {
              activityPlanTime: '',
              activityPlanDepId: '',
            }
          }
        },
        isFirst: true,
        planData: [],   //计划数据
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'oneDataSuccess',
          ajaxParams: {
            url: this.url.teachctivityGet + '/' + this.operailityData.id,
            params: {},
          }
        },
        activityDepUserType: [],//科室下的  选择的人员类型  和新选择的进行对比
        //当前组件默认请求(头部)数据时,ajax处理的 基础信息设置
        timeListMessTitle: {
          ajaxSuccess: 'updateHeaderList',
          ajaxParams: {
            url: this.url.teachCourseTime,
            params: {},
          }
        },

        //当前组件默认请求(头部)数据时,ajax处理的 基础信息设置
        depMessTitle: {
          ajaxSuccess: 'depListSuccess',
          ajaxParams: {
            url: this.url.getByDepth,
            params: {
              depth: 3,
            },
          }
        },
        depDta: [], //获取的科室数据
        allDepId: '', //获取的科室数据id
        depDtaType: [],//科室下的  选择的科室类型  和新选择的进行对比
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;

      let userInfo = this.$store.getters.getUserInfo;
      let role = userInfo.roleList[0].identify;
      if (role == 'JXMS' || role == 'KEZR') {
        this.type = 'byNowUser';
        this.unAll = true;
      } else {
        this.type = 'dep';
      }
      this.ajax(this.depMessTitle)

    },
    mounted() {
      //暂时没有初始化,预留初始化入口
//      this.init();
//      this.ajax(this.timeListMessTitle)

    },
    methods: {

      //获取科室列表
      depListSuccess(res) {
        //先获取科室 再获取数据
        this.ajax(this.listMessTitle);

        let data = res.data;
        let all = []
        data.map((item) => {
          all.push(item.id)
        })
        all = all.join(',');
        data.unshift({
          id: all,
          name: '所有'
        })
        this.allDepId = all;
        this.depDta = data

      },

      //获取时间段
      updateHeaderList(res) {
        let data = res.data;
        if (!data) return;
        this.getRecordTimes = data

      },

      //点击选择人员按钮触发
      openAndColseUser(targer, flag) {
        if (typeof flag == "undefined") flag = true;
        this[targer + 'Modal'] = flag;
      },

      //点击选择人员按钮触发
      openAndColseHost(targer, flag) {
        if (typeof flag == "undefined") flag = true;
        this[targer + 'Modal'] = flag;
      },
      //获取计划（ajax）——
      getIsPlan() {
        this.activityPlan = ''
        this.formValidate.planDetailId = '';
        this.formValidate.activityPlanId = '';
        this.isPlanMessTitle.ajaxParams.params = {
          activityPlanTime: this.yearMonthData(this.formValidate.activityTime),
          activityPlanDepId: this.formValidate.depId,
        }
        this.ajax(this.isPlanMessTitle);
      },

      //获取计划成功
      isPlanSuccess(res) {
        this.activityPlan = '';
        this.planData = [];
        let data = res.data;
        if (!data) return;

        /* data = [
         {
         "planDetailId":"活动详情ID",
         "activityPlanId":111,
         "activityPlanDepId":"计划科室ID",
         "activityPlanDepName":"计划科室名称",
         "planActivityTitle":"活动名称",
         "planActivityType":"活动类型",
         "planActivityHostUserId":"主持人ID",
         "planActivityHostUserName":"主持人姓名",
         "planActivityTime":"活动时间(yyyy-MM-dd)",
         "planActivityTimeids":"1,2,3",
         "planActivitySite":"活动地点",
         "planActivityContent":"活动内容",
         "planActivityFiles":[
         {
         "id":11,
         "fileUrl":"http://www.baidu.com",
         "fileName":"附件",
         "fileType":"txt"
         }
         ]
         }
         ]*/

        this.planData = data;
        if (this.isFirst) {
          this.activityPlan = this.formValidate.planDetailId + '-' + this.formValidate.activityPlanId;
          this.isPlan = true;
          this.$nextTick(function () {
            setTimeout(() => {
              this.isFirst = false;
            }, 1);
          })
        }

      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          let data = this.disposeData(this.getFormData(this.formValidate));
          if (!data) return;
          this.editMessTitle.ajaxParams.data = data;
          isLoadingFun(true);
          this.ajax(this.editMessTitle, isLoadingFun)
        }
      },

      //处理提交的数据
      disposeData(data) {
        //activityUserType
        let activityUserType = data.activityUserType.toLowerCase();
        if (activityUserType == 'alluser') {
          data.activityUserTypeValue = '';
          data.activityDepUserType = ''
        } else if (activityUserType == 'partuser') {
          let Value;
          if (typeof this[activityUserType].activityUserTypeValueId == 'object') {
            Value = this[activityUserType].activityUserTypeValueId.join(',');
          }
          if (!Value) {
            this.errorMess('部分人员不能为空');
            return;
          }
          data.activityUserTypeValue = Value || this[activityUserType].activityUserTypeValueId;
        } else {
          if (activityUserType != 'rotarydep') {
            data.activityDepUserType = '';
          } else {
            data.activityDepUserType = data.activityDepUserType.join(',');
            if (!data.activityDepUserType) {
              this.errorMess('人员类型不能为空');
              return;
            }
          }
          let Value;
          if (typeof this[activityUserType].activityUserTypeValue == 'object') {
            Value = this[activityUserType].activityUserTypeValue.join(',');
          }
          if (!Value) {
            this.errorMess(`${activityUserType == 'rotarydep' ? '轮转科室' : '部分角色'}不能为空`);
            return;
          }
          data.activityUserTypeValue = Value || this[activityUserType].activityUserTypeValue;
        }
        //处理whetherNeedCases
        if (data.whetherNeedCases == 'NO') {
          data.casesName = '';
        }

        if (data.recordTimes.length != 2) {
          this.errorMess('请选择时间段')
          return;
        }
        data.activityTimeInfo = this.conductDate(data.recordTimes[0], 'HH:mm') + '-' + this.conductDate(data.recordTimes[1], 'HH:mm');
        this.formDate(data, ['activityTime']);

        return data
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

      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * 注:当前为添加页面暂时未用到,属于预留
       * */
      oneDataSuccess(responseData) {
        let data = responseData.data;
        if (!data) return;
        //根据参加人不同来做不同出来
        let activityUserType = data.activityUserType.toLowerCase();
        if (activityUserType) {
          if (activityUserType != 'alluser') {
            if (activityUserType == 'rotarydep') {
              let tempArr = [];
              if (data.activityUserTypeValue == this.allDepId) {
                tempArr = data.activityUserTypeValue = [data.activityUserTypeValue]
              } else {
                data.activityUserTypeValue = data.activityUserTypeValue && data.activityUserTypeValue.split(',');
                for (let i = 0; i < data.activityUserTypeValue.length; i++) {
                  tempArr.push(+data.activityUserTypeValue[i])
                }
              }

              data.activityUserTypeValue = tempArr;
              this[activityUserType].activityUserTypeValue = data.activityUserTypeValue || [];
              //人员类型 （可多选）
              if (data.activityDepUserType == "SXS,JXS,ZYY,YJS") { //是全选
                this.activityDepUserType = data.activityDepUserType = ["SXS,JXS,ZYY,YJS"];
              } else {
                this.activityDepUserType = data.activityDepUserType = data.activityDepUserType.split(',');
              }

            } else if (activityUserType == 'partuser') {
              let value = [];
              let activityUserTypeValue = data.activityUserTypeValue.split(',');
              let activityUserTypeValueName = data.activityUserTypeValueName.split(',');

              //修改时轮转科室默认选择当前活动科室
              this.rotarydep.activityUserTypeValue = [data.depId];

              if (data.activityUserTypeValue) {
                for (let i = 0; i < activityUserTypeValue.length; i++) {
                  value.push({
                    label: activityUserTypeValueName[i],
                    key: +activityUserTypeValue[i],
                    description: '',
                    disabled: false
                  })
                }
              }
              data.activityDepUserType = [];
              this[activityUserType].activityUserTypeValue = data.activityUserTypeValueName && data.activityUserTypeValueName.split(',') || [];
              this[activityUserType].activityUserTypeValueId = data.activityUserTypeValue && data.activityUserTypeValue.split(',') || [];
              this.selectUser = value;
            } else {
              data.activityUserTypeValue = data.activityUserTypeValue && data.activityUserTypeValue.split(',');
              let tempArr = []
              for (let i = 0; i < data.activityUserTypeValue.length; i++) {
                tempArr.push(+data.activityUserTypeValue[i])
              }
              data.activityUserTypeValue = tempArr;
              this[activityUserType].activityUserTypeValue = data.activityUserTypeValue || [];
            }
          } else {
            data.activityDepUserType = []
          }
        }

        let host = [];

        this.selectHost.push(
          {
            key: data.hostUserId,
            label: data.hostUserName,
            description: '',
            disabled: false
          }
        )
        this.formValidate = this.disposeGetData(data);
        if (this.formValidate.isPlan == 'Y') {
          this.isPlanMessTitle.ajaxParams.params = {
            activityPlanTime: this.yearMonthData(this.formValidate.activityTime),
            activityPlanDepId: this.formValidate.depId,
          }
          this.ajax(this.isPlanMessTitle);
        } else {
          this.isFirst = false;
          this.isPlan = false;
        }
        this.data = data;

      },

      //处理获取到的数据
      disposeGetData(data) {
        if (!data) return;
        let time = data.activityTimeInfo.split('-');
        let start = time[0].split(':');
        let end = time[1].split(':');
        data.recordTimes = [new Date(2017, 9, 10, start[0], start[1]), new Date(2017, 9, 10, end[0], end[1])];
        return data
      },

      //移除人员的标签
      userRemove(i) {
        this.partuser.activityUserTypeValue.splice(i, 1);
        this.partuser.activityUserTypeValueId.splice(i, 1);
        this.selectUser.splice(i, 1);
//        console.log(this.selectUser);
//       /* //部分人员
//        partuser:{
//          activityUserTypeValue:[],
//            activityUserTypeValueId:[],
//        },*/
//       console.log(this.partuser);
      },

      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'edit');
      },

      /*
      * 选择人员回调*/
      selectUserCallback(data) {
        this.selectUser = data;
        let users = [];
        let userIds = [];
        for (let i = 0; i < data.length; i++) {
          userIds.push(data[i].key);
          users.push(data[i].label);
        }
        this.formValidate.activityUserTypeValue = userIds;
        this.partuser.activityUserTypeValue = users;
        this.partuser.activityUserTypeValueId = userIds;
        this.openAndColseHost('selectUser', false)

      },

      /*
       * 选择主持人回调*/
      selectHostCallback(data) {
        this.selectHost = data;
        if (data.length === 0) data = [{}]
        this.formValidate.hostUserId = data[0].key || '';
        this.formValidate.hostUserName = data[0].label || '';
        this.openAndColseHost('host', false)

      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
      /*
       * 组件初始化入口
       * */
      init() {
        this.ajax(this.listMessTitle)
      },

      //选择科室
      selectDpeID(val) {
        this.formValidate.depId = val;

      },

      //改变计划
      isPlanChange(val) {
        if (this.isFirst) return;
        this.activityPlan = '';
        this.formValidate.planDetailId = '';
        this.formValidate.activityPlanId = '';
        if (val == 'Y') {
          if (!this.formValidate.activityTime) {
            this.showMess('请选择活动时间')
          } else if (!this.formValidate.depId) {
            this.showMess('请选择科室')
          } else {
            this.isPlan = true;
            this.upDataIsplan()
            return;
          }
          this.formValidate.isPlan = 'N';
        } else {
          this.isPlan = false;
        }

      },

      //时间和科室改变更新计划
      upDataIsplan() {
        if (this.isPlan) {
          if (this.formValidate.activityTime && this.formValidate.depId) {
            if (this.isFirst) return;
            this.getIsPlan();
          }
        }
      },

      //计划选项发生改变
      planChange(val) {
        if (this.isFirst) return;
        if (!val) return;
        let selectPlanData = {};
        for (let i = 0; i < this.planData.length; i++) {
          let item = this.planData[i];
          let value = item.planDetailId + '-' + item.activityPlanId
          if (value == this.activityPlan) {
            selectPlanData = item;
            continue;
          }
        }

//        "formValidate":{
//          "depId":'',
//            "activityName":"",
//            "activityType":"",
//            "hostUserId":'',
//            "hostUserName":"",
//            "activityTime":"",
//            "activitySite":"",
//            "activityUser":"",
//            "whetherNeedCases":"YES",
//            "casesName":"",
//            "activityContent":"",
//            "activityUserType":"ALLUSER",
//            "activityUserTypeValue":",",
//            "activityDepUserType":"",
//            "shouldUserCount":'',
//            "actuallyUserCount":'',
//            "timeIds":"",
//            "recordTimes":[],
//            "activityState":"",
//            activityPlan:'',
//
//            //新增
//            isPlan:'N',  //是否计划内
//            activityPlanId:'', //月度计划ID
//            planDetailId:'', //计划详情ID
//        }
        let formValidate = this.formValidate
        formValidate.activityName = selectPlanData.planActivityTitle; //活动名称
        formValidate.activityType = selectPlanData.planActivityType;//活动类型

        formValidate.hostUserId = selectPlanData.planActivityHostUserId;
        formValidate.hostUserName = selectPlanData.planActivityHostUserName;
        this.selectHost = [{
          key: selectPlanData.planActivityHostUserId,
          label: selectPlanData.planActivityHostUserName,
          disabled: false,
        }];

        //活动时间
//        formValidate.activityTime = selectPlanData.planActivityTime;
        //活动时间段
//        item.courseTime+'/'+item.timeId
        let times = []
        if (!selectPlanData.planActivityTimeids) selectPlanData.planActivityTimeids = '';
        let planActivityTimeids = selectPlanData.planActivityTimeids.split(',');
        let time = planActivityTimeids.split('-');
        let start = time[0].split(':');
        let end = time[1].split(':');
        formValidate.recordTimes = [new Date(2017, 9, 10, start[0], start[1]), new Date(2017, 9, 10, end[0], end[1])];

        //活动地点
        formValidate.activitySite = selectPlanData.planActivitySite;
        //活动内容
        formValidate.activityContent = selectPlanData.planActivityContent;
        formValidate.planDetailId = selectPlanData.planDetailId;
        formValidate.activityPlanId = selectPlanData.activityPlanId;

      },

      expenseFileEvent(ids) {
        this.formValidate.activityFileIds = ids;
      },

      //改变参加人人员类型
      activityDepUserTypeChange(item) {
        if (item.includes("SXS,JXS,ZYY,YJS") && !this.activityDepUserType.includes("SXS,JXS,ZYY,YJS")) {
          this.formValidate.activityDepUserType = ["SXS,JXS,ZYY,YJS"];
        } else if (item.includes("SXS,JXS,ZYY,YJS") && item.length >= 2) {
          let index = item.indexOf("SXS,JXS,ZYY,YJS");
          this.formValidate.activityDepUserType.splice(index, 1);
        }
        this.activityDepUserType = this.formValidate.activityDepUserType;
      },

      //改变参加人科室
      activityUserTypeChange(item) {
        if (item.includes(this.allDepId) && !this.depDtaType.includes(this.allDepId)) {
          this.rotarydep.activityUserTypeValue = [this.allDepId];
        } else if (item.includes(this.allDepId) && item.length >= 2) {
          let index = item.indexOf(this.allDepId);
          this.rotarydep.activityUserTypeValue.splice(index, 1);
        }
        this.depDtaType = this.rotarydep.activityUserTypeValue;
      },
    }
  }
</script>
