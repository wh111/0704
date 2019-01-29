<!----------------------------------
****--@name     ${*}
****--@role     ${*}
****--@date     2017/8/4
****--@author   gx
----------------------------------->
<template>
    <div>
      <el-form :model="formValidate" ref="formValidate" label-width="90px">

        <el-row>
          <el-col :span="20" :offset="2">
            <el-form-item label="名称:" prop="podId">
              <el-input  v-model="formValidate.name" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8" :offset="2">
            <el-form-item label="标签：:" prop="tags">
              <el-input v-model="formValidate.tags" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="分类:" prop="typeId">
              {{'s'}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" :offset="2">
            <el-form-item label="时长:" prop="length">
              <el-input v-model="formValidate.length" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="大小:" prop="size">
              {{}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8" :offset="2">
            <el-form-item label="播放次数:" prop="count">
              <el-input v-model="formValidate.count" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="20" :offset="2">
            <el-form-item label="简介:" prop="remark">
              <el-input type="textarea"  v-model="formValidate.remark" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>



        <el-row>
          <el-col :span="16" :offset="2">
            <el-form-item label="视频文件:" >
              <upload-file @setUploadFiles="expenseFileEvent"></upload-file>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="16" :offset="2">
            <el-form-item label="封面:" >
              <upload-file @setUploadFiles="expenseLogoEvent"></upload-file>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="16" :offset="2">
            <el-form-item label="缩略图:" >
              <upload-file @setUploadFiles="expenseImgsEvent"></upload-file>
            </el-form-item>
          </el-col>
        </el-row>


      </el-form>

      <el-row>
        <el-col :span="16" :offset="2">
          <div style="margin-left: 100px">
            <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
            <el-button @click="cancel">取消</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
</template>
<script>
    /*当前组件必要引入*/

    //当前组件引入全局的util
    let Util = null;
    export default{
        data() {
            return {
              loadBtn:{title:'保存',callParEvent:'listenSubEvent'},
              formValidate:{
                typeId:'',       //资源分类ID
                name:'',         //视频名称
                tags:'',         //标签
                length:'',       //时长
                size:'',         //视频大小
                count:'',        //播放次数
                remark:'',       //简介
                fileId:'',       //视频ID
                filePath:'',     //视频地址(相对到文件)
                logoPath:'',     //封面图
                imgsPath:'',     //其他图片
              },
              //当前组件提交(add)数据时,ajax处理的 基础信息设置
              addMessTitle: {
                type: 'add',
                successTitle: '添加成功!',
                errorTitle: '添加失败!',
                ajaxSuccess: 'ajaxSuccess',
                ajaxError: 'ajaxError',
                ajaxParams: {
                  url: '',
                  method: 'post',
                  data: {},
                }
              },
            }
        },
        methods: {
            //初始化请求列表数据
            init(){

            },

          /*
           * 保存或上报按钮会调用这个公共函数
           * @param isLoadingFun boolean  form表单验证是否通过
           * */
          listenSubEvent(isLoadingFun){
            if(!isLoadingFun) isLoadingFun=function(){};
            isLoadingFun(true);
            this.formValidate.content = this.ueditorVal["ud1"];
            this.addMessTitle.ajaxParams.data = this.formValidate;
            this.ajax(this.addMessTitle,isLoadingFun)
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
           * 当前组件发送事件给父组件
           * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
           * */
          cancel(){
            this.$emit('cancel',this.addMessTitle.type);
          },


          //上传视频文件
          expenseFileEvent(){

          },


          //封面图
          expenseLogoEvent(){


          },

          //imgsPath
          expenseImgsEvent(){


          },

        },
        created(){
            this.init();
        },
        mounted(){
        },
        components: {}
    }
</script>
