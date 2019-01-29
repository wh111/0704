<!--短信通知-->

<template>

  <div >
    <el-form ref="formValidate"   class="demo-form-inline" label-width="110px" >

      <el-row >
        <el-col :span="22" :offset="1">
          <el-form-item  label="通知内容:">
            <el-input type="textarea" resize="none" :rows="6"></el-input>
          </el-form-item>
        </el-col>
      </el-row >
      <el-row >
        <el-col :span="22" :offset="1">
          <el-form-item label="手机号:">
            <el-input type="textarea" resize="none" :rows="5"></el-input>
          </el-form-item>
        </el-col>
      </el-row >
      <el-row>
        <el-col :span="24">
          <el-form-item label="参加人" prop="name9">
            <el-radio-group @change="setParticipant">
              <el-row>
                <el-col :span="24">
                  <div class="grid-content-ptop"><el-radio :label="3">本科室</el-radio></div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div class="grid-content-ptop">
                    <el-radio :label="6">部分人员</el-radio>
                    <template>
                      <el-select style="margin-left: 10px" v-show="partPer" filterable placeholder="请选择">
                        <el-option
                          v-for="item in options"
                          :key="item.id"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </template>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div class="grid-content-ptop">
                    <el-radio :label="9">指定角色</el-radio>
                    <template>
                      <el-select style="margin-left: 10px" v-show="designatedPer"  filterable placeholder="请选择">
                        <el-option
                          v-for="item in options"
                          :key="item.id"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </template>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div class="grid-content-ptop"><el-radio :label="8">所有人</el-radio></div>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row >
      <el-col :span="10" :offset="10">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button  @click="cancel">取消</el-button>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data (){
      return{

        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        //form表单bind数据
        formValidate: {
          name:'',
          identify:null,
          remark:'',
          type:[]
        },
        options:[{
          value: '0',
          label: '男'
        }, {
          value: '1',
          label: '女'
        }],
        designatedPer:false,
        partPer:false,
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        shortNoteMessTitle:{
          type:'edit',
          successTitle:'修改成功',
          errorTitle:'修改失败',
          ajaxSuccess:'ajaxSuccess',
          ajaxParams:{
//            url:'/role/modify/'+this.operailityData.id,
            url:'/role/modify/1',
            method:'put',
          }
        },

      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      //初始化
    },
    methods:{
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true)
          this.shortNoteMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.shortNoteMessTitle, isLoadingFun)
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
        this.$emit('cancel','shortNote');
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        myData.type = data.type.join(",");
        return myData;
      },

      setParticipant(){

      },



    }
  }
</script>
<style>
</style>

