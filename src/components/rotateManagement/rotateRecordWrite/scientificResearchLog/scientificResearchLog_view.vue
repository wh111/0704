<template>

  <div>
    <el-form ref="formValidate" :model="formValidate" :rules="saveRecordWrite"  class="demo-form-inline" label-width="100px" >
      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label=" 标题:" prop="logTitle" >
            {{formValidate.logTitle}}
          </el-form-item>
        </el-col>
      </el-row >


      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label="填写时间:" prop="editTime" >
            {{formValidate.editTime}}
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label="附件:" prop="fid" >
            <img v-for="(item,index) in formValidate.fileList" :key="index" :src="item.url" alt="" style="width:120px;height: 120px;margin: 5px;">
            <!--<upload-photo :fileList="formValidate.fileList" @upladSuccess="upladSuccess"></upload-photo>-->
          </el-form-item>
        </el-col>
      </el-row >
      <br>
      <el-row>
        <el-col :span="20" :offset="2">
          <el-table
            v-if="tableData!=0"
            align="center"
            :max-height="250"
            :data="tableData"
            tooltip-effect="dark"
            highlight-current-row
            style="width: 100%;height: 100%">
            <el-table-column
              align="center"
              label="序号"
              type="index"
              width="100">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="createTime"
              label="审核时间">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="reviewMess"
              label="审核意见">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="spState"
              label="审核状态">
              <template scope="scope">
                {{scope.row.state | typeText}}
              </template>
            </el-table-column>

          </el-table>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
//  import uploadPhoto from '../../../common/uploadPhotoWall.vue'
import config from "../../../../config/config.js";
  import {saveRecordWrite} from '../../rules.js'
  //当前组件引入全局的util
  let Util=null;
  export default {
    props:['operailityData','url'],
    data (){
      return{
        saveRecordWrite,
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        reportedBtn:{title:'上报',callParEvent:'listenSubEvent'},
        //form表单bind数据
        formValidate: {

        },
        getData:{

        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle:{
          type:'edit',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:this.url.rescuePatientRecordModify.path+this.operailityData.id,
            method:'put',
            data:{},
          }
        },

        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url:this.url.scientificResearchLogGet.path+this.operailityData.id, //向后台请求数据的地址

          }
        },
        tableData:[],
        optionData:[],
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
      this.init();
    },
    mounted(){
      //暂时没有初始化,预留初始化入口
    },
    methods:{
      updateListData(res) {

        let data = res.data;
        if (!data) return;
        //处理附件
        let urlPrefix = config.urlPrefix
        let env = this.$store.getters.getEnvPath;
        let http = env['http'];
        let fid = [];
        let fileList = data.fileList;

        for(let i=0;i<fileList.length;i++){
          let item = fileList[i];
          fid.push(item.id);
          item.response= {
            data:item.id,
          }
          item.url =  urlPrefix+item.fileUrl;
        }
        data.fid = fid.join(',');

        this.tableData = data.reviewMess;
        this.formValidate = data

      },

      // 修改 改变url
      editEvent(isLoadingFun){
        this.addMessTitle.ajaxParams.url = this.url.scientificResearchLogModify.path+this.operailityData.id;
        this.listenSubEvent(isLoadingFun);
      },

      //修改上报 改变url
      editReportedEvent(isLoadingFun){
        this.addMessTitle.ajaxParams.url = this.url.scientificResearchLogModifySubmit.path+this.operailityData.id;
        this.listenSubEvent(isLoadingFun);
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
          let formValidate = this.getFormData(this.formValidate);
          formValidate = this.formDate(formValidate,['editTime'],'yyyy-MM-dd');
          this.addMessTitle.ajaxParams.data=formValidate;
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
        //请求科室数据
        this.ajax(this.listMessTitle)
      },

    },

    components:{
//      uploadPhoto
    }
  }
</script>

