<!----------------------------------
****--课程资料-上传(syllabusData_upload)
****--@date     2017/6/17
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
    <div>
      <el-form :model="formValidate" :rules="syllabusData" ref="formValidate" label-width="10px" class="demo-ruleForm">
        <el-row>
          <el-col :span="3" style="text-align: right;line-height: 30px;">课程名称</el-col>
          <el-col :span="15" style="line-height: 30px;padding-left: 10px">
            {{operailityData.courseContent}}
            <!--<el-form-item label="" prop="courseNames">-->
              <!--<el-input readonly v-model="courseNames" @focus="setCourse"></el-input>-->
            <!--</el-form-item>-->
          </el-col>
          <!--<el-col :span="5">-->
            <!--<el-form-item label="">-->
              <!--<el-button type="primary" icon="plus" @click="setCourse"></el-button>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
        </el-row>
        <el-row>
          <el-col :span="3" style="text-align: right;line-height: 30px;">相关证明材料</el-col>
          <el-col :span="20">
            <el-form-item label="">
              <upload-file @setUploadFiles="addFileEvent"></upload-file>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" style="text-align: right;line-height: 30px;">备  注</el-col>
          <el-col :span="20">
            <el-form-item label="" prop="desc">
              <el-input type="textarea" v-model="formValidate.courseDataNote"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="textCenter">&nbsp;</el-col>
          <el-col :span="4" class="textCenter"><load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn></el-col>
          <el-col :span="4" class="textCenter"><el-button @click="cancelUpload">取消</el-button></el-col>
          <el-col :span="8" class="textCenter">&nbsp;</el-col>
        </el-row>
      </el-form>
      <!--增加弹窗-->
      <Modal
        :mask-closable="false"
        v-model="addModal"
        height="200"
        title="对话框标题"
        class-name="vertical-center-modal"
        :width="600">
        <!--<div slot="header"> -->
        <!--</div>-->
        <modal-header slot="header" :content="addId"></modal-header>
        <select-course   @cancel="cancel" @setCourseMess="setCourseMess" :set-course-data="setCourseData"></select-course>
        <div slot="footer"></div>
      </Modal>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    import selectCourse from './syllabusData_selectCourse.vue';
    import api from '../api';
    import {syllabusData} from "../../rules"
    //当前组件引入全局的util
    let Util = null;
    export default{
        props:["operailityData"],
        data() {
            return {
              syllabusData,
              //保存按钮基本信息
              loadBtn:{title:'提交',callParEvent:'listenSubEvent'},

              /*--按钮button--*/
              addId:{
                id:'add',
                title:'添加'},
              courseNames:"",
              formValidate: {
                courseTimeRecordIds:'',
                courseArrangeIds:'',
                courseDataNote:'',
                fileIds:'',
              },
              listMessTitle:{
                ajaxSuccess:'updateListData',
                ajaxParams:{
                  url: api.teacherCourse.path,
                  params:{
                    sortby:'',
                    order:'',
                    courseContent:'',
                    courseType:'',
                    courseDateBegin:'',
                    courseDateEnd:'',
                  }
                }
              },

              //当前已经选择的课程内容
              setCourseData:"",

              //当前组件提交(add)数据时,ajax处理的 基础信息设置
              addMessTitle:{
                type:'upload',
                successTitle:'添加成功!',
                errorTitle:'添加失败!',
                ajaxSuccess:'ajaxSuccess',
                ajaxError:'ajaxError',
                ajaxParams:{
                  url: api.teacherCourseFileAdd.path,
                  method:'post',
                  data:{
                    courseTimeRecordIds:'',
                    courseArrangeIds:'',
                    courseDataNote:'',
                    fileIds:'',
                  }
                },
              },
            }
        },
        methods: {
            //初始化请求列表数据
            init(){
              console.log(this.operailityData)
              this.ajax(this.listMessTitle);
            },



          //上传附件
          addFileEvent(ids){
            this.formValidate.fileIds = ids;
          },
          updateListData(res){
            res.data.map((item)=>{
              if(item.courseArrangeId==this.operailityData.courseArrangeId){
                this.formValidate.courseArrangeIds=item.courseArrangeId;
                this.formValidate.courseTimeRecordIds=item.courseTimeRecordId;
              }
            })
          },

          //设置选择的课程内容
          setCourseMess(data){
            this.formValidate.courseTimeRecordIds = data.courseTimeRecordIds;
            this.formValidate.courseArrangeIds = data.courseArrangeIds;
            this.courseNames = data.courseContent;
            //设置已经选中的课程
            this.setCourseData = data.courseArrangeIds;
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
           * 点击提交按钮 监听是否提交数据
           * @param isLoadingFun boolean  form表单验证是否通过
           * */
          listenSubEvent(isLoadingFun){
            let isSubmit = this.submitForm("formValidate");
//            if(this.courseNames==""){
//              this.showMess("请填写课程名称!");
//              return;
//            }
            if(this.formValidate.fileIds==""){
              this.showMess("请上传课程资料!");
              return;
            }
            isSubmit = true;
            if(isSubmit) {
              if (!isLoadingFun) isLoadingFun = function () {};
              isLoadingFun(true)
              this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
              this.ajax(this.addMessTitle)
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


          //打开设置课程模态弹窗
          setCourse(){
            this.openModel("add");
          },

          /*
           * 监听子组件通讯的方法
           * 作用:根据不同的参数关闭对应的模态
           * @param targer string example:"add"、"edit"
           * */
          cancel(targer){
            this[targer+'Modal'] = false;
          },


          cancelUpload(){
            this.$emit("cancel","upload");
          },


          /*
           * 监听子组件通讯的方法
           * 作用:ajax请求成功回调,该监听方法在libs/util 中的混合模式下定义回调
           * @param targer string example:"add"、"edit"
           * @param targer string 提示返回的ajax回调返回的信息改信息在对应的子组件中定义
           * 例如:errorTitle、errorTitle
           *addMessTitle:{
           *    type:'add',
           *    successTitle:'添加成功!',
           *    errorTitle:'添加失败!',
           *    ajaxSuccess:'ajaxSuccess',
           *    ajaxError:'ajaxError',
           *    ajaxParams:{
           *      url:'/role/add',
           *      method:'post'
           *    }
           *    }
           * @param udata boolean 默认false  是否不需要刷新当前表格数据
           * */
          subCallback(target,title,updata){
            this.cancel(target);
            if(title){
              this.successMess(title);
            }
            if(!updata){
              //this.setTableData();
            }
          },


          /*
           * 打开指定的模态窗体
           * @param options string 当前指定的模态:"add"、"edit"
           * */
          openModel(options){
            this[options+'Modal'] = true;
          }

        },
        created(){
            Util = this.$util;
            this.init();
        },
        mounted(){
        },
        components: {
          selectCourse
        }
    }
</script>
