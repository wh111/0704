<!--组织投票-->
<!-- 新建-->

<template>

  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item label="标题：" prop="title">
            <el-input v-model="formValidate.title" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <!--<el-col :span="14" :offset="2">-->
          <!--<el-form-item label="时间：" prop="startDate">-->
            <!--<el-date-picker v-model="formValidate.startDate" type="date" placeholder="选择日期"-->
                            <!--:editable="false"-->
                            <!--:picker-options="pickerOptions0" @change="handleStartTime">-->
            <!--</el-date-picker>-->
            <!--到-->
            <!--<el-date-picker v-model="formValidate.endDate" align="right" type="date" placeholder="选择日期"-->
                            <!--:editable="false"-->
                            <!--:picker-options="pickerOptions1" @change="handleEndTime">-->
            <!--</el-date-picker>-->
              <!---->
          <!--</el-form-item>-->
        <!--</el-col>-->
          <date-group :dateGroup="{text:'',startDate:formValidate.startDate,endDate:formValidate.endDate}" style="display:inline-block;margin-left: 75px">
          <el-form-item style="float: left"  label="时间：" prop="startDate">
          <el-date-picker name="start" v-model="formValidate.startDate" :editable="false" type="datetime" format="yyyy-MM-dd HH：mm" placeholder="选择日期" :picker-options="pickerOptions0" @change="handleStartTime"></el-date-picker>
          </el-form-item>
          <el-form-item style="float: left;" class="OrganizationaVoting-gang" label="-" prop="endDate">
          <el-date-picker name="end" v-model="formValidate.endDate" :editable="false" type="datetime" format="yyyy-MM-dd HH：mm"  placeholder="选择日期" :picker-options="pickerOptions1" @change="handleEndTime"></el-date-picker>
          </el-form-item>
          </date-group>
          <el-col :span="6" style="float: right;margin-right: 77px">
              <el-form-item label="票权：" prop="votePower">
                  <el-input v-model="formValidate.votePower" placeholder="请输入"></el-input>
              </el-form-item>
          </el-col>

      </el-row>
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item label="投票人：" prop="voterScope">
            <el-radio-group v-model="formValidate.voterScope" @change="changeVoterScope()">
              <el-radio label="GROUP">本班</el-radio>
              <el-row>
                <el-col>

                  <div class="grid-content-ptop">
                    <el-radio label="DEP">轮转科室</el-radio>
                    <!--<keep-alive>-->
                      <!--<el-select v-if="formValidate.voterScope == 'DEP'" filterable v-model="formValidate.depId"-->
                                 <!--style="margin-left: 10px" filterable placeholder="请选择">-->
                        <!--<select-option url="/hospital/dept/getByDepth" :params="{depth:2}"></select-option>-->
                      <!--</el-select>-->
                    <!--</keep-alive>-->
                    <el-select  v-show="formValidate.voterScope=='DEP'" v-model="apartment" placeholder="请选择" multiple @change="changeDepartment">
                      <el-option-group
                        v-for="group in depData"
                        :key="group.id"
                        :label="group.name">
                        <el-option
                          v-for="item in group.childList"
                          :key="item.id"
                          :label="item.name"
                          :value='`${item.id}_${item.name}`'>
                        </el-option>
                      </el-option-group>
                    </el-select>
                  </div>

                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <div class="grid-content-ptop">
                    <el-radio label="ROLE">角色</el-radio>
                    <el-select v-show="formValidate.voterScope=='ROLE'" @change="activityDepUserTypeChangeItem"
                    multiple v-model="scopeIds"  placeholder="请选择">
                      <el-option v-for="(item,index) in roleList" :key="index" :label="item.name" :value="`${item.id}_${item.name}`"></el-option>
                    </el-select>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <div class="grid-content-ptop">
                    <el-radio label="PART">部分人</el-radio>
                    <div v-show="formValidate.voterScope == 'PART'"
                         style="max-width: 350px;max-height: 100px;overflow: auto;display: inline-block;vertical-align: middle">
                      <el-tag
                        v-for="(tag,index) in formValidate.appraisingVoteScopeDtoList"
                        @close="userRemove(index)"
                        :key="tag.scopeId"
                        style="margin: 5px"
                        type="primary"
                        :closable="true">
                        {{tag.scopeName}}
                      </el-tag>
                    </div>
                    <el-button v-show="formValidate.voterScope=='PART'"
                               @click="selectUserClick">选择人员
                    </el-button>
                  </div>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item label="规则：" prop="voteRule">
            <el-input v-model="formValidate.voteRule" type="textarea" :rows="5" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item v-model="formValidate.userIds" label="被投对象：" prop="userIds">
            {{ userName }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
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
    <!--选择人员-->
    <Modal :mask-closable="false" width="890" v-model="selectUserModal" title="添加人员" class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectUserId"></modal-header>
      <select-user v-if="selectUserModal" @cancel="cancel" @setUsers="selectUserCall" :initUser="initUserArr"></select-user>
      <div slot="footer"></div>
    </Modal>
    <!--<load-btn class="OrganizationaVoting" @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>-->
    <!--:initUser="initUser"-->
  </div>
</template>
<script>
  let Util = null;
  import {organizationaVotingRditNew as rules} from '../../../rules';
  import selectUser from '../../../../../common/selectUser.vue';
  export default {
    props: ['recommendPerson', 'selectProjectId', 'getData', 'voteId'],
    data() {
      return {
        roleList:[],
        num:0,
        apartment:[],
        depData:[],
        initUserArr:[],
        partName:'',
        selectUserModal:false,
        selectUserId: {
          id: "selectUserId",
          title: "选择人员"
        },
        rules,
        dep: false,
        //保存按钮基本信息
//        loadBtn: {
//          title: '完成',
//          callParEvent: 'listenSubEvent'
//        },
        userName: '',
        countDate: 0,
        //form表单bind数据
        scopeIds:[],
        formValidate: {
          appraisingId: '', //评优项目id
          title: '', //投票项目标题
          startDate: '', //开始时间
          endDate: '', //结束时间
          voterScope: '', //投票人范围
          depId: '', //科室id
          userIds: '', //被投票人id字符串
          grade: '', //年级
          voteGroup: '', //班级
          voteRule: '', //规则
          votePower:'1',//票权
          appraisingVoteScopeDtoList: [],
          projectId: '',
          scopeId: '',//科室id或角色id或用户id
          scopeName: ''//科室名称或角色名称或用户名称
        },
        selectUser: [],
        loading: true,
        //部分人员
        partuser: {
          activityUserTypeValue: [],
          activityUserTypeValueId: []
        },
        columnModal: false,
        columnId: {
          title: '提交',
          callParEvent: 'searchEvent'
        },

        api: {
          add: {
            path: 'appraising/vote/project/add',
            method: 'post'
          },
          edit: {
            path: 'appraising/vote/project/modify/',
            method: 'put'
          },
        },
        editType: 'add',
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted() {
      //暂时没有初始化,预留初始化入口
      this.init();
      this.getByDepth()
      this.getRoleList()
    },
    methods: {
      changeDepartment(val){
        console.log(val,this.depData)
        this.formValidate.appraisingVoteScopeDtoList=[];
        val.map((item)=>{
                 this.formValidate.appraisingVoteScopeDtoList.push({
                  scopeId:item.split('_')[0],
                  scopeName:item.split('_')[1],
                  projectId:''
                })
        })
      },
      /*
       * 组件初始化入口
       * */
      init() {
        if (this.voteId && this.getData) {
          this.editType = 'edit';
          this.getEditData()
        }
        this.initUser()
      },
      getByDepth(){
        let opt = {
          ajaxSuccess: (res) => this.depData=res.data,
          ajaxError: () => this.errorMess(msg[this.editType] + '失败'),
          ajaxParams: {
              url:'/hospital/dept/getByDepth',
              params:{
                depth:'2',
              }
          }
        };
        this.ajax(opt)
      },
      getRoleList(){
        let opt = {
          ajaxSuccess: (res) => this.roleList=res.data,
          ajaxParams: {
            url:'/role/list',
          }
        };
        this.ajax(opt)
      },
      selectUserClick(){
        this.selectUserModal=true;
      },
      // 选择人员回调
      selectUserCall(res) {
//        this.formValidate.voterScope=
//        this.formValidate.userList.length = 0;
//        this.$util._.forEach(res, val => {
//          this.formValidate.userList.push({
//            userId: val.key,
//            userName: val.label,
//          })
//        })
        this.initUserArr=res;
        let tempName=[];
        this.formValidate.appraisingVoteScopeDtoList=[];
        res.map((item)=>{
          this.formValidate.appraisingVoteScopeDtoList.push({
            scopeId:item.key,
            scopeName:item.label,
            projectId:''
          })
          tempName.push(item.label);

        })
        console.log(this.formValidate.appraisingVoteScopeDtoList)
//        this.setInitUser(this.formValidate.appraisingVoteScopeDtoList);
        this.selectUserModal=false;
      },
      initUser() {
        let user = [];
        let userId = [];
        if (this.recommendPerson) {
          this.recommendPerson.map(item => {
            user.push(item.userName);
            userId.push(item.userId);
          })
        }
        this.userName = user.join('、')
        this.formValidate.userIds = userId.join(',')
          if(this.formValidate.depId==null){
              this.formValidate.depId=''
          }
      },

      getEditData() {
        for (let key in this.formValidate) {
          this.formValidate[key] = this.getData[key]
        }
        this.formValidate.appraisingVoteScopeDtoList = this.formValidate.appraisingVoteScopeDtoList||[];
        if(this.formValidate.voterScope=='PART'){
            this.setInitUser(this.formValidate.appraisingVoteScopeDtoList);
        }else if(this.formValidate.voterScope=='DEP'){
          this.formValidate.appraisingVoteScopeDtoList.map((item)=>{
            this.apartment.push(item.scopeId+'_'+item.scopeName)
          })

        }else if(this.formValidate.voterScope == 'ROLE'){
          this.formValidate.appraisingVoteScopeDtoList.map((item)=>{
            this.scopeIds.push(item.scopeId+'_'+item.scopeName)
          })
        }
      },
      setInitUser(res){
        res.map(item=>{
          this.initUserArr.push({
            label:item.scopeId,
            key:item.scopeName,
            description: '人员id---' + item.scopeId + '的描述信息',
            disabled: false
          })
        })
      },
      changeVoterScope() {
         if(this.num){
           this.formValidate.appraisingVoteScopeDtoList=[];
         }
        this.num++
        if (this.formValidate.voterScope == 'GROUP') {
          this.formValidate.depId = ''
        }else if(this.formValidate.voterScope == 'DEP'){
          this.changeDepartment(this.apartment)
        }
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent() {
        let isSubmit = this.submitForm("formValidate");
        let msg = {
          add: "添加",
          edit: "修改"
        };
        console.log(this.formValidate.appraisingVoteScopeDtoList)
        if (isSubmit) {
          let userIdArr = this.formValidate.userIds.split(',');
          if(+this.formValidate.votePower>userIdArr.length){
           this.errorMess('票权不能大于被投对象数');
            return;
          }
          let opt = {
            ajaxSuccess: () => this.$emit(this.editType),
            ajaxError: () => this.errorMess(msg[this.editType] + '失败'),

            ajaxParams: {
              jsonString:true,
              url: this.api[this.editType].path + (this.editType === 'add' ? '' : this.voteId),
              method: this.api[this.editType].method,
              data: this.conductFormValidate(this.getFormData(this.formValidate))
            }
          };
          this.ajax(opt)
        }
        return isSubmit
      },
      selectUserCallback (data) {
        this.selectUser = data;
        let users = [];
        let userIds = [];
        for (let i = 0; i < data.length; i++) {
          userIds.push(data[i].key);
          users.push(data[i].label);
        }
        this.formValidate.activityUserTypeValue = userIds;
//        this.partuser.activityUserTypeValue = users;
//        this.partuser.activityUserTypeValueId = userIds;
        this.openAndColseHost('selectUser', false);

      },
      //点击选择人员按钮触发
      openAndColseHost (targer, flag) {
        if (typeof flag == 'undefined') flag = true;
        this[targer + 'Modal'] = flag;
      },
       activityDepUserTypeChangeItem(res) {
         this.formValidate.appraisingVoteScopeDtoList=[];
         res.map((item)=>{
           this.formValidate.appraisingVoteScopeDtoList.push({
             scopeId:item.split('_')[0],
             scopeName:item.split('_')[1],
             projectId:''
           })
         })
//         if (item.includes("SXS,JXS,ZYY,YJS") && !this.activityDepUserType.includes("SXS,JXS,ZYY,YJS")) {
//           this.formValidate.activityDepUserType = ["SXS,JXS,ZYY,YJS"];
//         } else if (item.includes("SXS,JXS,ZYY,YJS") && item.length >= 2) {
//           let index = item.indexOf("SXS,JXS,ZYY,YJS");
//           this.formValidate.activityDepUserType.splice(index, 1);
//         }
//         this.activityDepUserType = this.formValidate.activityDepUserType;
       },
      //移除人员的标签
      userRemove (i) {
        this.formValidate.appraisingVoteScopeDtoList.splice(i, 1);
        this.selectUser.splice(i, 1);
      },
      //为提交处理数据
      conductFormValidate(data) {
        data = this.formDate(data, ['startDate', 'endDate'], 'yyyy-MM-dd HH:mm');
        data.appraisingId = this.selectProjectId;
//        data.userIds = this.conductUserIds(this.recommendPerson);
        data.grade = this.recommendPerson[0].grade;
        data.voteGroup = this.recommendPerson[0].group;
        return data;

      },

      conductUserIds(data) {
        if (typeof data != 'object' || typeof data.length == 'undefined') return;
        let ids = [];
        for (let i = 0; i < data.length; i++) {
          data[i].userId && ids.push(data[i].userId)
        }
        return ids.join(',')
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
      oneDataSuccess(res) {

      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', this.addMessTitle.type);
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },

      columnCallback() {

      },
      subCancel() {
        this.columnModal = false;
      },
    },
    watch: {
      recommendData() {
        this.initUser()
      },

    },
    components: {
      selectUser
    }
  }

</script>
<style>
    .OrganizationaVoting-gang  .el-form-item__label:before{
                display: none;
    }
    .OrganizationaVoting-gang  .el-form-item__label{
        width: 20px !important;
        padding: 5px 0px !important;
        line-height: 20px !important;
    }
    .OrganizationaVoting-gang  .el-form-item__content{
        margin-left: 30px !important;
    }
</style>
