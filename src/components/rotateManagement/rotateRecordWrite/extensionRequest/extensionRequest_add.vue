<template>

  <div>
    <el-form ref="formValidate" :model="formValidate" :rules="delayGiven"  class="demo-form-inline" label-width="140px" >
      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="科室名称:" prop="podId">
            <el-select @change="changeSltVal" v-model="formValidate.podId" placeholder="请选择" >
              <el-option  v-for="item in optionData" :key="item.id" :label="item.label" :value="item.depId+'-'+item.depName+'-'+item.podId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="轮转开始日期:" >
            {{formValidate.rtStartTime==''?'请选择科室':formValidate.rtStartTime}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="轮转结束日期:" >
            {{formValidate.rtEndTime==''?'请选择科室':formValidate.rtEndTime}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="相关证明材料:" >
            <upload-file @setUploadFiles="expenseFileEvent"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="延期说明:" prop="note">
            <el-input v-model="formValidate.note" type="textarea" resize="none" :rows="8"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row >
      <el-col :span="24">
        <div style="text-align: center">
          <load-btn @listenSubEvent="save" :btnData="loadBtn"></load-btn>
          <load-btn @listenSubEvent="saveReportedEvent" :btnData="saveReported"></load-btn>
          <el-button  @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  import {delayGiven} from '../../rules.js'
  //当前组件引入全局的util
  let Util=null;
  export default {
      props:['operailityData','url'],
    data (){
      return{
        delayGiven,
        //保存按钮基本信息
        loadBtn:{title:'保存',callParEvent:'listenSubEvent'},
        saveReported:{title:'上报',callParEvent:'listenSubEvent'},
        options:[
          {id:"PERFORMER",name:"术者"},
          {id:"AHELP",name:"一助"},
          {id:"BHELP",name:"二助"}
        ],
        //form表单bind数据
        formValidate: {
          "depId":"",  //科室ID
          "depName":"",  //科室名称
          "rtStartTime":"",  //手术名称
          "rtEndTime":"",  //手术日期
          "note":"",  //备注
          "podId":"",  //轮转ID
          "fileIds":""  //附件IDs
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle:{
          type:'add',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:this.url.delayGivenAdd.path,
            method:this.url.delayGivenAdd.method,
            data:{},
          }
        },

        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: '', //向后台请求数据的地址

          }
        },
        optionData:[],
        optionObjData:{
            //"item.depId-item.depName-item.podId":""
        },
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
      let userInfo = this.$store.getters.getUserInfo;
      let userType = userInfo.studentTypes;
      this.listMessTitle.ajaxParams.url = this.url.userRotaryByUserId.path + userType + '-' + userInfo.id;
      this.init()
    },
    mounted(){
      //暂时没有初始化,预留初始化入口
    },
    methods:{

      updateListData(res) {
        let data = res.data;
        if (!data) return;
        data = this.optionData = data;
        data  = this.getQTBObj(res.data);
        for(let i=0;i<data.length;i++){
          let item = data[i];
          if(item.arrangeDepState=='P'){
            data.splice(i,1);
            i--;
          }else {
            if(item.podState==99){
              this.formValidate.podId = item.depId+'-'+item.depName+'-'+item.podId;
            }
            this.optionObjData[item.depId+'-'+item.depName+'-'+item.podId]=item;
          }
        }
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
       * 保存或上报按钮会调用这个公共函数
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit){
          if(!isLoadingFun) isLoadingFun=function(){};
          isLoadingFun(true);
          let formValidate = this.getFormData(this.formValidate);
          if(formValidate.podId){
            let deps = formValidate.podId.split('-');
            formValidate.depId = deps[0];
            formValidate.depName = deps[1];
            formValidate.podId = deps[2];
          }
          formValidate = this.formDate(formValidate,['rtStartTime','rtEndTime'],'yyyy-MM-dd');
          this.addMessTitle.ajaxParams.data=formValidate;
          this.ajax(this.addMessTitle,isLoadingFun)
        }
      },

      //当选择的科室值发生改变是调用
      changeSltVal(val){
        let obj = this.optionObjData[val];
        this.formValidate.rtStartTime = obj.beginTime;
        this.formValidate.rtEndTime = obj.endTime;

      },

      expenseFileEvent(ids) {
        this.formValidate.fileIds = ids;
      },


      //保存 改变url
      save(isLoadingFun){
        this.addMessTitle.ajaxParams.url = this.url.delayGivenAdd.path;
        this.listenSubEvent(isLoadingFun);
      },

      //保存上报 改变url
      saveReportedEvent(isLoadingFun){
        this.addMessTitle.ajaxParams.url = this.url.delayGivenAddSubmit.path;
        this.listenSubEvent(isLoadingFun);
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
          //请求科室数据
        this.ajax(this.listMessTitle)
      },

    }
  }
</script>
