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
            <el-input v-model="formValidate.parentCode" placeholder="请输入"></el-input>
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
                  <el-input  v-model="value.code" placeholder="请输入"></el-input>
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
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle:{
          type:'add',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:'/dictionary/add',
            method:'post',
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
        //this.ajax(this.addMessTitle);
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
          isLoadingFun(true)
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.addMessTitle, isLoadingFun)
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
        this.$emit('cancel','add');
      },


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        return myData;
      },

      //业务字典修改逻辑
      add(){

        this.courses.push({
          type:'',
          bizDict:''
        })
      },
      down(index){
        if(index==this.courses.length-1){
          return
        }
        let last = this.courses[index];
        this.courses.splice(index,1);
        let nex = this.courses[index];
        this.courses.splice(index,1,nex,last);

      },
      up(index){
        if(index==0){
          return
        }

        let last = this.courses[index];
        this.courses.splice(index,1);
        let nex = this.courses[index-1];
        this.courses.splice(index-1,1,last,nex);
      },
      remove(index){
        this.courses.splice(index,1)
      }

    }
  }
</script>
