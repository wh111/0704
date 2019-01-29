<template>

  <div >
    <el-form ref="formValidate"    class="demo-form-inline" label-width="80px" >

      <el-row >
        <el-col :span="9" :offset="2">
          <el-form-item label="字典名称" prop="parentName" >
            <el-input v-model="formValidate.parentName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="9" >
          <el-form-item label="字典代码" prop="parentCode" >
            {{formValidate.parentCode}}
            <!--<el-input v-model="" placeholder="请输入"></el-input>-->
          </el-form-item>
        </el-col>
      </el-row >
      <el-row >
        <el-col :span="20" :offset="2">
          <fieldset>
            <legend style="font-size:16px"> 字典项 </legend>
            <el-row >
              <el-col :span="9" :offset="1">
                <el-button  type="primary" size="mini" @click="addTerm" icon="plus"></el-button>
              </el-col>
            </el-row >
            <el-row v-for="(value,index) in formValidate.child" :key="index" :gutter="10">
              <el-col :span="6">
                <el-form-item label="字典名称" prop="name" >
                  <el-input v-model="value.name" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" >
                <el-form-item label="字典Code" prop="code" >
                  <template v-if="value.parentId">
                    {{value.code}}
                  </template>
                  <el-input v-else v-model="value.code" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" >
                <el-form-item label="字典值" prop="value" >
                  <el-input  v-model="value.value" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-input title="排序" @blur="sort(index,value.sequence)" style="width: 50px" v-model="value.sequence" placeholder="请输入"></el-input>
              </el-col>
              <el-col :span="3">
                <div style="padding: 6px 0">
                  <!--<el-button type="primary" @click="down(index)" size="mini" icon="caret-bottom"></el-button>
                  <el-button type="primary" @click="up(index)" size="mini" icon="caret-top"></el-button>-->
                  <el-button type="danger" @click="removeItem(index)" size="mini" icon="close"></el-button>
                </div>
              </el-col>
            </el-row >
          </fieldset>
        </el-col >
      </el-row >
    </el-form>

    <el-row class="but-space">
      <el-col :span="9" :offset="10">
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
        countDate:0,
        //form表单bind数据
        formValidate: {
          "parentName":'',
          "parentCode":'',
          "child":[{
            "name":"",
            "code":"",
            "value":"",
            "sequence":"1"
          }]
        },


        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:'/dictionary/get/'+this.operailityData.id,
          }
        },


        //当前组件提交(eidt)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'edit',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:'/dictionary/modify/'+this.operailityData.id,
            method:'put',
            jsonString:true
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
      this.init();

    },
    methods:{

      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },


      //通过get请求列表数据
      updateListData(responseData){
        let data = responseData.data;
        this.formValidate=data;
      },


      //添加
      addTerm (){
        this.formValidate.child.push({
          "name":"",
          "code":"",
          "value":"",
          "sequence":(this.formValidate.child.length+1)
        })
      },


      //删除添加项
      removeItem(index){
        if(this.formValidate.child.length==1) return;
        this.formValidate.child.splice(index,1)
      },


      //排序
      sort(currIdx,gotoIdx){
        let idx = parseInt(gotoIdx);
        let coursesChild = this.formValidate.child;
        if(idx<0){
          idx = 1
        }
        if(idx>coursesChild.length){
          idx = coursesChild.length;
        }
        let saveVal = coursesChild[currIdx];
        coursesChild.splice(currIdx,1);
        coursesChild.splice(gotoIdx-1, 0, saveVal);

        Util._.forEach(coursesChild,function(n, key) {
          n["sequence"] = ++key;
        })
      },


      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        isSubmit = true;
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          this.editMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.editMessTitle, isLoadingFun)
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
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let type = [];
        let data = responseData.data;
        type.push(data.type+"");
        this.formValidate = data;
        this.formValidate.type = type;
      },


      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','edit');
      },


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        return myData;
      }



    }
  }
</script>
