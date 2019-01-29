<template>
  <div class="showWrapper">
    <el-row class="lose-margin2">
      <el-col :span="11" :offset="10">
        {{data.title}}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20" :offset="2">
        投票规则 ：
      </el-col>
    </el-row>
    <el-row class="lose-margin2">
      <el-col :span="20" :offset="2">
        <el-input type="textarea" :rows="5" readonly resize="none" v-model="data.voteRule">
        </el-input>
      </el-col>
    </el-row>

    <el-row v-for="item in data.voteResultList" :key="item" class="lose-margin2">
      <el-col :span="20" :offset="2">
        <div style="width: 50px;height: 50px;">
          <user-avatar :src="getUserPhotoUrl(item.photo)" :border="true"></user-avatar>
        </div>
        <div
          style="height: 20px; vertical-align: middle; display: inline-block;width: 100px; overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
          {{item.userName}}
        </div>
        <i style="margin: 0 25px; font-size: 16px;cursor: pointer"
           :class="{'el-icon-star-off':!formValidate.userIds.includes(item.userId),'el-icon-star-on':formValidate.userIds.includes(item.userId)}"
           @click="cote(item)"></i>
        <div style="margin:0 25px;display: inline-block;background: palegreen;height: 20px; vertical-align: middle"
             :style="{width:item.voteNum*3+'px'}"></div>
        {{item.voteNum || 0}} 票
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24" style="text-align: center">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import userAvatar from '../../../../common/userAvatar.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data() {
      return {
        //保存按钮基本信息
        loadBtn: {
          title: '确定',
          callParEvent: 'listenSubEvent'
        },
        //form表单bind数据
        formValidate: {
          voterId: '10000', //投票人id
          userIds: [], //被投票人id
          resultId: '', //投票结果id
          voteId: this.operailityData.id, //投票项目id
        },

        //投票数据
        //投票数据
        "data": {
          votePower: '',
          "voteId": "", //投票项目id
          "title": "", //标题
          "voteRule": "", //规则
          "voteResultList": [ //投票结果列表
//            {
//              "id": "", //投票结果id
//              "userId": "", //被投票人id
//              "userName": "", //被投票人姓名
//              "voteNum": "" //得票数
//            }
          ],
          "voteUserId": "" //我投票的被投票人id
        },
        voteResult: {userId: "", resultId: ""}, //保存投中的
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        voteMessTitle: {
          type: 'vote',
          successTitle: '投票成功',
          errorTitle: '投票失败',
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            url: 'appraising/vote/project/vote',
            method: 'post',
          }
        },

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: 'appraising/vote/project/getMyResult/' + this.operailityData.id,
          }
        },
        http: "",
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
      //设置投票人id
      let userInfo = this.$store.getters.getUserInfo;
      this.formValidate.voterId = userInfo.id;
      this.http = this.$store.state.envPath.http;
    },
    mounted() {
      //初始化
      this.init();
    },
    methods: {
      cote(item) {
        if (this.data.voteUserIdList.includes(item.userId)) { //已经投过并提交了，不能再投
          return;
        }
        if (this.formValidate.userIds.includes(item.userId)) {
          let index = this.formValidate.userIds.indexOf(item.userId);
          this.formValidate.userIds.splice(index, 1);
          item.voteNum--;
          return;
        } else {
          if (this.formValidate.userIds.length < this.data.votePower) { //通过票权判断投票数
            item.voteNum++;
            this.formValidate.userIds.push(item.userId);
          } else {
            this.errorMess(`最大投票数: ${this.data.votePower || 0}`);
            return;
          }
          // this.voteResult.voteNum--;
//          this.voteResult = item;
        }
//        this.formValidate.resultId = item.id;

      },


      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {

        if(this.data.voteUserIdList.length == this.data.votePower){
          this.showMess(`投票机会已用完，不能继续投票`)
          return;
        }
        if (!isLoadingFun) isLoadingFun = function () {

        };

        let formValidate = this.getFormData(this.formValidate)

        let userIds = []  //去掉已经提交的票数；
        formValidate.userIds.map((item) => {
          if (!this.data.voteUserIdList.includes(item)) {
            userIds.push(item)
          }
        })
        if (!userIds.length) { //如果没有投票
          this.errorMess('请投票');
          return;
        }
        formValidate.userIds = userIds.join(',');
        this.voteMessTitle.ajaxParams.data =formValidate;
        isLoadingFun(true)
        this.ajax(this.voteMessTitle, isLoadingFun)
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
//        this.addIsVote(responseData.data.voteResultList);
        if (!responseData.data) return;
        this.data = responseData.data;
         responseData.data.voteUserIdList = responseData.data.voteUserIdList || [];
        this.formValidate.userIds = Util._.defaultsDeep([],  responseData.data.voteUserIdList);
        this.showMess(`有${responseData.data.votePower - responseData.data.voteUserIdList.length}次投票机会`);
      },


      /*
       * 添加投票状态
       * */
      addIsVote(data) {
        for (let i = 0; i < data.length; i++) {
          data[i].isVote = false;
        }
      },

      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'vote');
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
      getUserPhotoUrl(url) {
        return url ? this.http + url : ''
      },
      /*
       * 组件初始化入口
       * */
      init() {
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },
    },
    components: {
      userAvatar
    }
  }
</script>

