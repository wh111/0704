<template>

  <div style="padding: 0 10px;">
    <other-basic-viewds v-if="type=='DS'" :operailityData="showUserInfo" ref="OTHER" :add-rules="rules" @storeSubData="storeSubData">
      <el-input slot="name" placeholder="请选择人员" icon="plus" v-model="showUserInfo.name" :on-icon-click="selectUser"
                @focus="selectUser"></el-input>
    </other-basic-viewds>
    <other-basic-view v-else :operailityData="showUserInfo" ref="OTHER" :add-rules="rules">
      <el-input slot="name" placeholder="请选择人员" icon="plus" v-model="showUserInfo.name" :on-icon-click="selectUser"
                @focus="selectUser"></el-input>
    </other-basic-view>
    <br/>
    <el-row>
      <el-col :span="10" :offset="10">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
    <!--选择人员-->
    <Modal
      width="890" v-model="selectUserModal" class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectUserId"></modal-header>
      <select-user v-if="selectUserModal" @cancel="closeUserModal" @setUsers="setUsers" :isOnlyOne="true"
                   :initUser="selectUserId.usersData"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import api from './api';
  import {teachersManagement as rules} from '../../rules';
  //导师
  import otherBasicViewds from "../../../common/archivesManagement/archivesManagement_basic/other/viewDS.vue";
  //带教老师
  import otherBasicView from "../../../common/archivesManagement/archivesManagement_basic/other/view.vue";
  import selectUser from '../../../common/selectUser.vue';
  let Util = null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData', 'deptId','type'],
    data() {
      return {
        rules,
        showUserInfo: {name: ''}, // 选择人员的基本信息
        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        //form表单bind数据
        formData: {
          archivesId: "",
          typeId: this.deptId,  //导师-102   带教老师-101
        },

        //2018.6.12 导师新增字段
        dsOtherData:{
          teachTitle: '', //职称（导师）
          specialtyName: '', //	学科专业（导师）
          tutorType: '', //	博导/硕导（导师）
          serveTutor: '', //	担任导师（导师）
          researchDirection: '', //	主要研究方向（导师）
        },

        //选择人员
        selectUserId: {
          id: "selectUserId",
          title: "选择人员",
          usersData: []
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.add.path,
            method: api.add.method,
            data: {}
          }
        },
      }
    },
    created() {
      //初始化
      Util = this.$util;
//      this.init();
    },
    mounted() {

    },
    methods: {
      /*
       * 组件初始化入口
       * */
      init() {
        //默认请求加载数据
        if (typeof this.operailityData != "undefined") {
          this.formData = Object.assign(this.formData, this.operailityData);
        }
      },

      /*
       * 导师新建增加的字段内容
       * @param data Object 新增字段数据
       * */
      storeSubData(data){
        let {teachTitle,specialtyName,tutorType,serveTutor,researchDirection} = data;
        this.dsOtherData = {
          teachTitle: teachTitle, //职称（导师）
          specialtyName: specialtyName, //	学科专业（导师）
          tutorType: tutorType, //	博导/硕导（导师）
          serveTutor: serveTutor, //	担任导师（导师）
          researchDirection: researchDirection, //	主要研究方向（导师）
        }
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
//        let data = this.$refs.OTHER.getInputData();
        if (this.deptId=='-102') {  //当为导师增加验证
          if(this.dsOtherData.specialtyName===''){
            this.errorMess('请填写学科专业')
            return
          }
          if(this.dsOtherData.teachTitle===''){
            this.errorMess('请填写职称')
            return
          }
          if(this.dsOtherData.tutorType===''){
            this.errorMess('请选择博导/硕导')
            return
          }
          if(this.dsOtherData.serveTutor===''){
            this.errorMess('请填写担任导师')
            return
          }
          if(this.dsOtherData.researchDirection===''){
            this.errorMess('请填写主要研究方向')
            return
          }
        }
        if (this.formData.archivesId) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true)
          this.addMessTitle.ajaxParams.url = api.add.path + this.formData.archivesId;
          let data = Util._.defaultsDeep({},this.formData);
          if(this.deptId=='-102'){
            data = Object.assign(data,this.dsOtherData)
          }
          this.addMessTitle.ajaxParams.data = data;
          this.ajax(this.addMessTitle, isLoadingFun)
        } else {
          this.errorMess('请选择人员')
        }
      },

      // 选择人员
      selectUser() {
        this.openModel('selectUser');
      },

      /*
      * 获取选择人员的人员信息并赋值
      * @param users [{id:'',name:''},{}]  已选人员信息
      * */
      setUsers(users) {
        this.selectUserId.usersData = users || [];
        this.formData.archivesId = users.length && users[0].key || '';
        if (this.formData.archivesId) {
          this.getUserInfo()
        } else {
          this.showUserInfo = null;
        }
        this.closeUserModal();
      },

      // 获取人员数据
      getUserInfo() {
        let opt = {
          ajaxSuccess: res => this.showUserInfo = res.data,
          ajaxParams: {
            url: api.getUserInfo.path + this.formData.archivesId,
            method: api.getUserInfo.method
          }
        };
        this.ajax(opt)
      },

      //关闭选择人员弹窗
      closeUserModal() {
        this.selectUserModal = false;
      },

      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'add');
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },
    },
    components: {
      otherBasicView,
      otherBasicViewds,
      selectUser,
    }
  }
</script>
