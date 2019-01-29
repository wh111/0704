<template>

  <div >
    <el-form :model="formValidate" :rules="rules" ref="formValidate"   class="demo-form-inline"  label-width="100px" >

      <el-row >
        <el-col :span="13" :offset="1">
          <el-form-item label="姓名:" prop="name" >
            {{name}}
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="科室:"   prop="school">
            <el-select v-model="formValidate.depId" placeholder="请选择">
                <el-option  v-for="item in optionData" :key="item.id" :label="item.label" :value="item.depId"></el-option>
            </el-select>
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="13" :offset="1">
          <el-form-item label="发生时间:" prop="occurrenceTime">
            <el-date-picker
              v-model="formValidate.occurrenceTime"
              type="date"
              :editable="false"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9" >
          <el-form-item label="奖惩类型:">
            <el-radio-group v-model="formValidate.rewardAndPunishmentType">
              <el-radio label="0">奖励</el-radio>
              <el-radio label="1">惩罚</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="22" :offset="1">
          <el-form-item label="事项描述:" prop="rewardAndPunishmentDescribe">
            <el-input v-model="formValidate.rewardAndPunishmentDescribe" type="textarea"  resize="none" :rows="8"></el-input>
          </el-form-item>
        </el-col>
      </el-row >
    </el-form>
    <el-row >
      <el-col :span="24" style="text-align: center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button  @click="cancel">取消</el-button>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  import {practiceRecords as rules} from '../rules'
  export default {
    props: ['operailityData','type'],
    data (){
      return{
        rules,
        options:[{
          value: '0',
          label: '待审核'
        }, {
          value: '1',
          label: '审核通过'
        }, {
          value: '2',
          label: '未审核'
        }],
        optionData:[],
        /*--按钮button--*/
        selectUserId:{id:'selectUserId',title:'选择人员'},
        selectUserModal:false,

        formValidate:{
          userId:'',                        //用户id
          depId:'',                       //科室ID
          occurrenceTime:'',                //发生时间（格式:yyyy-MM-dd）
          rewardAndPunishmentType:'0',     //奖惩类型(0.奖励, 1惩罚)
          rewardAndPunishmentDescribe:'',     //事项描述
          rewardAndPunishmentStatus:'WSB',      //wsb.未上报、dsh.审核中(待审)...
          fileIds:'',                           //附件id字符串
        },
        name:'',
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        countDate:0,

        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle:{
          type:'add',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:'rewardAndPunishment/add',
            method:'post'
          }
        },
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: '', //向后台请求数据的地址
          }
        },
      }
    },

      created(){
        //给当前组件注入全局util
        Util = this.$util;
        let userInfo = this.$store.getters.getUserInfo;
        let userType = userInfo.studentTypes;
        this.listMessTitle.ajaxParams.url = '/traineeRotary/arrangeRotary/userRotaryDeptlistTreeData/' + userType + '-' + userInfo.id;
  //      this.listMessTitle.ajaxParams.url = this.url.userRotaryDeptlistTree +'ZYY-12703';

        this.ajax(this.listMessTitle);
      },
      mounted(){
        //暂时没有初始化,预留初始化入口  todo 获取的当前登录人
        let userInfo = this.$store.getters.getUserInfo;
        this.formValidate.userId = userInfo.id;
        this.name = userInfo.name;
        //this.init();
      },
      methods:{
          updateListData(res) {
            let data = res.data;
            if (!data) return;
            data  = this.getQTBObj(res.data);
            for(let i=0;i<data.length;i++){
              let item = data[i];
              if(item.arrangeDepState=='P'){
                data.splice(i,1);
                i--;
              }else {
                if(item.podState==99){
                  this.formValidate.podId = item.podId; //给depid绑定podId 因为poied唯一
                }
              }
            }
            this.optionData =data
          },

          // 处理科室数据结构（三级以下）
          getQTBObj(arr,res,depth=-1){
            depth++;
            let t = res || [];
            if(arr && arr.length) {
              arr.map(item => {
                item.label='　'.repeat(depth)+item.depName+'('+(item.beginTime||'')+')';
                t.push(item);
                if (item.childList){
                  return t.concat(this.getQTBObj(item.childList,t,depth))
                }
              })
            }
            return t
          },
        /*
         * 点击提交按钮 监听是否提交数据
         * @param isLoadingFun boolean  form表单验证是否通过
         * */
        listenSubEvent(isLoadingFun){
          let isSubmit = this.submitForm("formValidate");
          if(isSubmit){
            if(!isLoadingFun) isLoadingFun=function(){};
            isLoadingFun(true);
            this.addMessTitle.ajaxParams.data=this.formDate(this.getFormData(this.formValidate),['occurrenceTime'],this.yearMonthData);
            this.addMessTitle.ajaxParams.data.rewardAndPunishmentType = this.addMessTitle.ajaxParams.data.rewardAndPunishmentType+'';
            //todo  (惩奖记录)如果是教育全则通过  否则WSB
            this.addMessTitle.ajaxParams.data.rewardAndPunishmentStatus =  'WSB';
            this.ajax(this.addMessTitle,isLoadingFun)
          }
        },
        /*
         * 点击提交按钮 监听是否验证通过
         * @param formName string  form表单v-model数据对象名称
         * @return flag boolean   form表单验证是否通过
         * */
        submitForm(formName){
          let flag = false;
          this.$refs[formName].validate((valid) => {
            if (valid) {
              flag= true;
            }
          });
          return flag;
        },
        /*
         * 当前组件发送事件给父组件
         * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
         * */
        cancel(){
          this.$emit('cancel',this.addMessTitle.type);
        },


        /*
         * 获取表单数据
         * @return string  格式:id=0&name=aa
         * */
        getFormData(data){
          let myData = Util._.defaultsDeep({},data);
          return myData;
        },


        /*
         * 组件初始化入口
         * */
        init(){
          //this.ajax(this.listMessTitle)
        },


        selecrUserCancel(){
          this.selectUserModal = false;
        },
        //点击选择人员输入时调用
        selectUser(){
            this.selectUserModal = true;
        },
        //确定选择人员调用
        subCallback(target,title,updata){
          this.cancel(target);
          if(title){
            this.successMess(title);
          }
//          if(!updata){
//            this.setTableData();
//          }
        },

      }

  }
</script>
