<template>

  <div>
    <el-form :model="formValidate" ref="formValidate"  :rules="entityAudit" class="demo-form-inline" label-width="120px" >
      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label="填写人:" prop="diseaseName">
            {{getData.userName}}
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label="填写时间:" prop="diseaseName">
            {{getData.createTime}}
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label="报告经验与总结:" prop="diseaseName">
            <viewUEditor v-if="isShow" style="width: 700px;" :name="'ud2'" @storeUE="storeUE" @getUeditorVal="getUeditorVal" :ueditor-val="ueditorVal" :ueditor-config="ueditorConfig"></viewUEditor>

          </el-form-item>
        </el-col>
      </el-row >

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
                {{scope.row.spState | typeText}}
              </template>
            </el-table-column>

          </el-table>
        </el-col>
      </el-row>

      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label="审核结果:" prop="spState">
            <el-radio-group v-model="formValidate.spState">
              <el-radio label="PASS" >通过</el-radio>
              <el-radio label="REJECT" >驳回</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row >
      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label="审核意见:" prop="reviewMess">
            <el-input v-model="formValidate.reviewMess" type="textarea" resize="none" :rows="8"></el-input>
          </el-form-item>
        </el-col>
      </el-row >
    </el-form>

    <el-row style="padding-top: 20px">
      <el-col :span="10" :offset="8">
        <div style="margin-left: 100px">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <el-button  @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  import api from '../api';
  import viewUEditor from '../../../common/showUeditor.vue';
  //当前组件引入全局的util
  import {entityAudit} from '../rules'
  let Util=null;
  export default {
    props: ['operailityData'],
    data (){
      return{
        entityAudit,
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        //form表单bind数据
        formValidate: {
          spState:"PASS",   //审核状态
          reviewMess:"",   //审核意见
        },
        getData:{

        },
        isShow:false,


        UE:{},
        ueditorVal:{
          ud2:"",
        },  //
        ueditorConfig:{
          //详细配置参考UEditor 官网api
          initialFrameHeight:220,  //初始化编辑器高度,默认320
        },

        tableData:[],
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle:{
          type:'audit',
          successTitle:'审核成功!',
          errorTitle:'审核失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url: api.medicalEthicsReview + this.operailityData.id,
            method:'post',
            data:{},
          }
        },

        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.medicalEthicsGetId + this.operailityData.id, //向后台请求数据的地址

          }
        },
        optionData:[]
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
      this.init()
    },
    mounted(){
      //暂时没有初始化,预留初始化入口
    },
    methods:{

      updateListData(res) {
        let data = res.data;
        if (!data) return;
        this.ueditorVal.ud2 = data.content;
        this.getData = data;
        this.isShow = true;
        if(data.reviewMess){
          this.tableData = data.reviewMess
        }
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
          let formValidate = this.formValidate;
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


      /**
       *
       * 存储编辑器的value值
       * @param name {string}  编辑器的name
       *
       * @param val  {string}  编辑器的内容
       *
       */
      getUeditorVal(name,val){
        this.ueditorVal[name] = val;
        if(this.getData.content){
          this.ueditorVal.ud2 = this.getData.content;
        }
      },

      //保存 改变url
      save(isLoadingFun){
        this.addMessTitle.ajaxParams.url = api.thematicReviewAdd;
        this.listenSubEvent(isLoadingFun);
      },

      //保存上报 改变url
      saveReportedEvent(isLoadingFun){
        this.addMessTitle.ajaxParams.url = api.thematicReviewAddSubmit;
        this.listenSubEvent(isLoadingFun);
      },

      /**
       *
       * 存储编辑器的UE.editor对象
       * @param name {string}  编辑器的name
       *
       * @param editor {}      编辑器的对象
       *
       */
      storeUE(name,editor){
        this.UE[name] = editor;
        editor.setDisabled()
      },

      setMyVal(name,v){
        this.UE[name].setContent(v);
      }



    },

    components:{
      //当前组件引入的子组件
      viewUEditor
    },
  }
</script>

