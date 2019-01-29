<!--短信通知-->
<!--2017/11/20 修改参与人-->
<template>

  <div>
    <el-form ref="formValidate" v-model="formValidate" class="demo-form-inline" label-width="110px">

      <el-row>
        <el-col :span="22" :offset="1">
          <el-form-item label="通知内容:" prop="content">
            <el-input v-model="formValidate.content" type="textarea" resize="none" :rows="6"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22" :offset="1">
          <el-form-item label="手机号:">
            <div class="phone-wrap">
              <span class="phone-item" v-for="item in participantData">{{item.name}}:{{item.mobile}}</span>
              &nbsp;<el-button icon="plus" type="primary" @click="participant"></el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row>
      <el-col :span="10" :offset="10">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="$emit('cancel', 'shortNote')">取消</el-button>
      </el-col>
    </el-row>

    <!--选择参与人-->
    <Modal
      close-on-click-modal="false"
      width="890"
      v-model="participantModal"
      title="新建教学活动"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="participantId"></modal-header>
      <select-user v-if="participantModal" @cancel="cancel('participant')"  @setUsers="setParticipant"  :initUser="selectParticipant"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util = null;
  export default {
    //props接收父组件传递过来的数据
    /**
     * operailityData 行数据
     * content 短信内容
     */
    props: ['operailityData','content','initParticipant'],
    data() {
      return {
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        //form表单bind数据
        formValidate: {
          content: '',
          mobiles: ''
        },
        selectParticipant:[],
        mobiles:'',
        participantModal:false,
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        shortNoteMessTitle: {
          type: 'shortNote',
          successTitle: '发送成功',
          errorTitle: '发送失败',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: '/sms/send/signContent',
            method: 'post',
          }
        },
        participantData:[],
        participantId:{
        id:"participantId",
          title:"选择人员",
          usersData:''
      },

      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
//      if (this.operailityData.length == 1) {
//        this.formValidate.mobiles = this.operailityData[0].mobile
//      } else if (this.operailityData.length > 0) {
//        for (let i = 0; i < this.operailityData.length; i++) {
//          this.formValidate.mobiles.push(this.operailityData[i].mobile)
//        }
//        this.formValidate.mobiles = this.formValidate.mobiles.join()
//      }
      if(this.initParticipant){
        let selectParticipant = [];
        let participantData = [];
        let mobiles = [];
        this.operailityData.map(item=>{
          selectParticipant.push({
            data:item,
            codeNumber:item.codeNumber,
            description:`人员id---${item.id}的描述信息`,
            disabled:false,
            isParent:false,
            key:item.id,
            label:item.name,
            specialty:'',
          })
          mobiles.push(item.mobile);
          participantData.push(item)
        })
        this.mobiles = mobiles.join(',');
        this.participantData = participantData;
        this.selectParticipant = selectParticipant;
      }

      if(this.content){
        this.formValidate.content = this.content
      }
    },
    mounted() {
      //初始化
    },
    methods: {
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        if(this.participantData==0||!this.mobiles){
          this.errorMess('请选择人员');
          return;
        }
//        let isSubmit = this.submitForm("formValidate");
        if (this.formValidate.content == '') {
          this.errorMess('请编辑短信内容！')
          return false
        } else {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true)
          this.formValidate.mobiles = this.mobiles;
          this.shortNoteMessTitle.ajaxParams.data = this.formValidate;
          this.ajax(this.shortNoteMessTitle, isLoadingFun)
        }

      },
//      ajaxSuccess(res) {
//        if (res.status.code == '0') {
//          this.successMess('短信发送成功！');
//          this.$emit('cancel', 'shortNote');
//        }
//      },
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


      //设置参与人
      setParticipant(data){
        let participantData = [];
        let mobiles= [];
        let mobileError = [];//没有手机号的
        for(let i=0;i<data.length;i++){
          let item = data[i];
          if(item.data.mobile){
            participantData.push(item.data);
            mobiles.push(item.data.mobile);
          }else {
            mobileError.push(item.data.name);
            data.splice(i,1);
            i--
          }
        }
        if(mobileError.length>0){
          this.errorMess(`${mobileError.join(',')}:没有电话号码，无法通知`)
        }
        this.selectParticipant = data;
        this.participantData = participantData;
        this.mobiles = mobiles.join(',');
        this.cancel('participant');
      },


      //打开
      participant(){
        this.openModel('participant');
      },

      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
      /*
     * 打开指定的模态窗体
     * @param options string 当前指定的模态:"add"、"edit"
     * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },

    }
  }

</script>
<style>
  .phone-item {
    display: inline-block;
    padding: 0px 11px;
    border: 1px solid rgb(67, 210, 25);
    line-height: 30px;
    margin-top: 0px;
    margin-bottom: 0px;
    margin-left: 8px;
    border-radius: 10px;
  }

</style>
