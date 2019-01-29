
<!--自选科室-->
<template>
  <div>
    <el-form :model="formValidate" ref="formValidate"  class="demo-form-inline" label-width="90px" >
      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="学校:" prop="name" >
            {{formValidate.schoolName}}
          </el-form-item>
        </el-col>
        <el-col :span="8" >
          <el-form-item label="姓名:" prop="phone" >
            {{userInfo.name}}
          </el-form-item>
        </el-col>
        </el-col >

        <el-col :span="16" :offset="2">
          <el-form-item label="专业:" prop="address">
            {{userInfo.specialty}}
          </el-form-item>
        </el-col >
      </el-row >
    </el-form>
    <fieldset class="layui-elem-field" style="margin-bottom: 20px" v-for="(groupNo,i) in formValidate.groupNo" :key="i">
      <legend>{{greatName[i]}}</legend>
      <el-row :gutter="10" >
        <el-col v-for="(item,index) in groupNo" :key="index" :span="6">
          <div class="cal-schools">
            <el-row>
              <el-col :span="20">
                <el-button :type="item.isSelcet?'success':''" @click="handleCheckGroupNo(item,index)" style="width: 100%">{{item.depName}}</el-button>
              </el-col>
              <el-col :span="4">
                <div v-show="item.isSelcet" class="cal-check"><i class="el-icon-check"></i></div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </fieldset>
    <el-row v-if="isAdd">
      <el-col :span="10" :offset="11">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  /*---引入url*/
  import api from '../api';


  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData','url'],
    data (){
      return{
          isSubmit:true,   //是否允许提交
          isAdd:false,
        groupNum:{}, // 保存的组id
        greatName:[], // 保存的组名
        optionalNum:[], // 保存的组数
        userInfo:{},
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        countDate:0,
        //form表单bind数据
        formValidate: {
          "outlineId":"",         //
          "schoolId":"",
          "schoolName":"",//学校名称
          "gradeNum":"",
        },
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:api.selectCourseGet.path,
          }
        }
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;

      //获取当前登录人的信息
      this.userInfo = this.$store.getters.getUserInfo;

    },
    mounted(){
      //初始化
      this.init();
    },
    methods:{
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        let that = this;
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
         let addMessTitle={
            type:'edit',
           ajaxSuccess:function (res) {
                that.isAdd=false;
                that.groupNum={};
                that.greatName=[];
                that.optionalNum = [];
                that.successMess('保存成功');
                that.init();
              },
              errorTitle:'保存失败',
              ajaxParams:{
              jsonString:true,       //使用Content-Type: application/json
                url:api.selectCourseAdd.path,
                method:api.selectCourseAdd.method,
                data:{}
            }
          };
          let formValidate = this.getFormData(this.formValidate);
          formValidate = this.conductSubEvent(formValidate);
          if(!this.isSubmit){
            this.isSubmit = true;
            isLoadingFun(false);
            return;
          }
          addMessTitle.ajaxParams.data = formValidate ;
          this.ajax(addMessTitle, isLoadingFun)
        }
      },


      //处理提交的数据
      conductSubEvent(data){
        let optionalNum = this.optionalNum;
        let tempArr = [];
        let outlineId = data.outlineId;
        let groupNos = data.groupNo;
        for(let i=0 ;i<groupNos.length;i++){
          let item = groupNos[i];
          let depIds = [];
          let depNames = [];
          let groupNo = '';
          let name = this.greatName[i];
          let nums = optionalNum[i] //当前组最多选几个
          let count = 0; //计数 记录当前组已经选择了几个
          for(let k=0;k<item.length;k++){
              if(item[k].isSelcet){
                count++;
                groupNo = item[k].groupId;
                depIds.push(item[k].depId);
                depNames.push(item[k].depName);

              }
          }
          if(count!=nums){
            this.isSubmit = false;
            this.showMess(name+'必须选'+nums+'个');
          }
          let Tempobj = {
            "outlineId":outlineId,
            "groupNo":groupNo,
            "selectDep":{
              depIds:depIds.join(','),
              depNames:depNames.join(','),
            }
          };
          tempArr.push(Tempobj);
        }
          return tempArr;
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
        let data = responseData.data;
        if(!data) return;
        /*data={
          "outlineId":1,
            "schoolId":1,
            "schoolName":"南京大学",
            "gradeNum":2017,
            "groupNo":[
            {
              "groupId":111,
              "depId":1,
              "depName":"depName",
              "depCycle":1,
              "depIndex":1,
              "groupNum":"1",
              "greatName":"1",
              "optionalNum":1
            },
            {
              "groupId":111,
              "depId":2,
              "depName":"depName",
              "depCycle":1,
              "depIndex":1,
              "groupNum":"1",
              "greatName":"1",
              "optionalNum":1
            },
            {
              "groupId":222,
              "depId":1,
              "depName":"depName",
              "depCycle":1,
              "depIndex":1,
              "groupNum":"1",
              "greatName":"1",
              "optionalNum":1
            }
          ],
            "userSelectDep":[],
        };*/
        if(data.groupNo&&data.groupNo != 0){
          data.groupNo = this.conductGroupNo(data.groupNo);
        }else {
          this.showMess('当前没有待选科室');
          this.formValidate = data ;
          return;
        }
        if(!data.userSelectDep||data.userSelectDep == 0){
          this.isAdd = true;
        }else{
          data.groupNo = this.conductUserSelectDep(data.groupNo,data.userSelectDep)
        }
        this.formValidate = data;
      },


      //处理获取的数据，把获取到的零散数据分成按组排列的数据
      conductGroupNo(data){
          let tempArr = []  //保存最终出来的数据；
          let groupNum = this.groupNum; //保存组号,{}
          let index = 0;   //记录当前是数组的索引
          let undefined;

          for(let i=0;i<data.length;i++){

            data[i]['isSelcet'] = false; // 是否已选
            if(groupNum[data[i].groupId]==undefined){
              tempArr[index]=[];//初始化数组
              this.greatName.push(data[i].greatName || '');
              this.optionalNum.push(data[i].optionalNum || 0);
              groupNum[data[i].groupId] = index;//组号对应索引
              tempArr[index].push(data[i]);//把当前信息添加到当前索引找到的数组下
              index++;
            }else{
              let newIndex = groupNum[data[i].groupId];//当前组号对应的索引
              tempArr[newIndex].push(data[i])
            }
          }
          return tempArr ;
      },

      //处理用户选择的科室
      conductUserSelectDep(groupNo,userSelectDep){
          let groupNum = this.groupNum;
        for(let i=0;i<userSelectDep.length;i++){
            let item =  userSelectDep[i];
            let index = groupNum[item.groupNo] ||0 ; //当前所对应的索引
            let group =   groupNo[index];   //当前组号所对应的组 [],
            let depIds = item.depIds;   //选中的科室
            for(let k=0 ;k<group.length ;k++){
              if(depIds.includes(group[k].depId+'')){
                group[k].isSelcet = true;
              }
            }
          }
          return groupNo;

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
      },
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },

      handleCheckGroupNo(item){
        if(!this.isAdd)return;
        item.isSelcet = !item.isSelcet;
      },
    }
  }
</script>
<style>
  .date{
    line-height: 25px;
  }
  .date .countDate{
    display: inline-block;
    width:70px;
    text-align: center;
    border-bottom: 1px solid;
  }
</style>
