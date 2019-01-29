<template>
  <div>
    <!--<select-project @selProjectCall="selProjectCall" :appraisingId="selectProjectId"-->
                    <!--v-if="active == 1"></select-project>-->
    <!--自荐列表依赖评优项目列表的id-->
    <queue :selectProjectId="selectProjectId" :sellOneself="sellOneselfIds" @recommendPerson="recommendPerson"
           v-if="active == 2"></queue>
    <template v-if="active == 3">
      <!--新建项投票项目依赖自荐选择的人员-->
      <news v-if="editType === 'edit'" :recommendPerson="recommendData" @edit="editHandel" :getData="formValidate"
            :voteId="operailityData.id" :selectProjectId="selectProjectId" ref="news"></news>
      <news v-else :recommendPerson="recommendData" @add="editHandel"
            :selectProjectId="selectProjectId" ref="news"></news>
    </template>
    <br>
    <el-row>
      <el-col align="center">
        <!--上一步-->
        <el-button type="info" v-show="active > 2" @click="loat">上一步</el-button>
        <!--下一步-->
        <el-button type="success" v-show="active < 3" @click="next">下一步</el-button>
        <!--完成-->
        <load-btn v-if="active === 3" @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import api from './api';
  /*引入 -- 选择项目列表--*/
  //import selectProject from './OrganizationaVoting_edit/OrganizationaVoting_edit_selectProject_list.vue';
  /*引入 -- 列表--*/
  import queue from './OrganizationaVoting_edit/OrganizationaVoting_edit_queue.vue';
  /*引入 -- 新建--*/
  import news from './OrganizationaVoting_edit/OrganizationaVoting_edit_new.vue';

  let Util = null;
  let LoadingFunCall = null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data() {
      return {
        //保存按钮基本信息
        loadBtn: {
          title: '完成',
          callParEvent: 'listenSubEvent'
        },
        active: 0,

        selectProjectId: '',   //选择项目id
        recommendData: [],         //自荐人员

        //获取的项目详情数据
        "formValidate": {
          "id": "",                   //投票项目id
          "appraisingId": "",         //评优项目id
          "title": "",           //标题
          "startDate": "",     //开始时间
          "endDate": "",         //结束时间
          "voterScope": "",         //投票人范围
          "grade": "",               //年级
          "voteGroup": "",           //班级
          "depId": "",                 //科室id
          "depName": "",               //科室名称
          "voteRule": "",      //投票规则
          "userList": [            //被投票人列表
//            {
//              "sellOneselfId": "",   //自荐id
//              "voteResultId": "",      //投票结果id
//              "userId": "",                //人员id
//              "userName": ""            //考生姓名
//            }
          ]
        },
        sellOneselfIds: '',
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
    },
    methods: {
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let news = this.$refs.news;
        let isSubmit = news.listenSubEvent();
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          LoadingFunCall = isLoadingFun
        }
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
       * */
      SuccessGetCurrData(responseData) {
        this.selectProjectId = responseData.data.appraisingId;
        this.sellOneselfIds = responseData.data.userList && this.disposeSellOneselfIds(responseData.data.userList);
        this.active=2;
        this.recommendData = responseData.data.userList;
        this.formValidate = responseData.data;
      },
      /*
      *  把选中的自荐id挑出来并添加数组里 返回数组
      *
      * */
      disposeSellOneselfIds(userList) {
        if (!userList || !userList.length) return;
        let arr = []
        for (let i = 0; i < userList.length; i++) {
          arr.push(+userList[i].userId);
        }
        return arr;
      },

      editHandel() {
        let msg = {add: '添加', edit: '修改'};
        LoadingFunCall(false);
        this.$emit(this.editType, this.editType, msg[this.editType] + '成功')
      },

      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', this.editType);
      },

      //提取人员id
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
        //默认请求加载数据
        if (this.operailityData) {
          this.editType = 'edit';
          this.getEditData()
        }
      },

      getEditData() {
        let opt = {
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
          }
        };
        this.ajax(opt)
      },

      //上一步
      loat() {
        this.active--
        if(this.active === 2){
          this.recommendData = []
        }
      },

      //下一步
      next() {
        if (!this.isNext(this.active)) return;
        ++this.active;
      },


      //选择评优项目类列表调用， 传过来一个id 供自荐列表使用
//      selProjectCall(id) {
//          console.log(id)
//        this.recommendData = [];
//        if (id != this.selectProjectId) {
//          this.sellOneselfIds = '';
//        }
//        this.selectProjectId = id;
//      },
      //自荐列表调用， 传过来人员数据数组 供自荐列表使用
      recommendPerson(personData) {
        this.recommendData = personData;
      },

      //下一步操作 获取子组件的信息并保存id
      isNext(active) {
        if (!this.selectProjectId) {
          this.errorMess('请选择数据');
          return false
        }  //如果项目id为空则不能进行下一步
        if (active == 2 && !this.recommendData.length) {
          this.errorMess('请选择人员');
          return false;
        }
        return true;
      },

      subCancel() {
        this.columnModal = false;
      },
    },
    components: {
      queue, news
    }
  }
</script>

