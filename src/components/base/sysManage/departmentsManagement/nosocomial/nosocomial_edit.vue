<template>

  <div >
    <el-form :model="formValidate" ref="formValidate" :rules="rules" class="nosocomial" label-width="110px" >

      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="科室编号：" prop="code" >
            <el-input v-model="formValidate.code" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col >

        <el-col :span="10" >
          <el-form-item label="科室名称：" prop="name" >
            <el-input v-model="formValidate.name" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="上级科室：">
            {{formValidate.parentName}}
          </el-form-item>
        </el-col >

        <el-col :span="8" >
          <el-form-item label="科室主任：" prop="director" >
            <el-input :readonly="true" @focus="addUser('director')" v-model="formValidate.director" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col >
        <el-col :span="1" :offset="1">
          <i class="el-icon-plus" @click="addUser('director')"></i>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="教学秘书：" prop="secretary" >
            <el-input :readonly="true" @focus="addUser('secretary')" v-model="formValidate.secretary" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col >
        <el-col :span="1" :offset="1">
          <i class="el-icon-plus" @click="addUser('secretary')"></i>
        </el-col >
        <el-col :span="8">
          <el-form-item label="护士长：" prop="nurse" >
            <el-input :readonly="true" @focus="addUser('nurse')" v-model="formValidate.nurse" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1" :offset="1">
          <i class="el-icon-plus" @click="addUser('nurse')"></i>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="20" :offset="2">
          <el-form-item label="科室要求：" prop="explains" >
            <el-input type="textarea" v-model="formValidate.depIntroduce" resize="none" :rows="5"></el-input>
          </el-form-item>
        </el-col>
      </el-row >

      <div class="itemLayout">
        <fieldset>
          <legend style="font-size:16px">&nbsp;&nbsp;科室承载量&nbsp;&nbsp;</legend>
          <el-row style="text-align: center;margin-bottom: 5px;font-size: 16px;">
            <el-col :span="3" :offset="3">
              最大
            </el-col >
            <el-col :span="3">
              <span style="color:#ff4949;">*</span>
              最优
            </el-col >
            <el-col :span="3" :offset="5">
              最大
            </el-col >
            <el-col :span="3">
              <span style="color:#ff4949;">*</span>
              最优
            </el-col >
          </el-row>

          <el-row >
            <el-col :span="11" >
              <el-form-item label="实习生：" prop="ssyCapacity" >
                <el-input v-model="formValidate.ssyCapacity" class="nosocomial-input" placeholder="请输入"></el-input>
                <el-input v-model="formValidate.ssyOptimalCapacity" class="nosocomial-input" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col >
            <el-col :span="11">
              <el-form-item label="研究生：" prop="yjsCapacity" >
                <el-input v-model="formValidate.yjsCapacity" class="nosocomial-input" placeholder="请输入"></el-input>
                <el-input v-model="formValidate.yjsOptimalCapacity" class="nosocomial-input" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col >
          </el-row >
          <el-row >
            <el-col :span="11" >
              <el-form-item label="住院医：" prop="zyyCapacity" >
                <el-input v-model="formValidate.zyyCapacity" class="nosocomial-input" placeholder="请输入"></el-input>
                <el-input v-model="formValidate.zzyOptimalCapacity" class="nosocomial-input" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col >

            <el-col :span="11" >
              <el-form-item label="进修生：" prop="jxsCapacity" >
                <el-input v-model="formValidate.jxsCapacity" class="nosocomial-input" placeholder="请输入"></el-input>
                <el-input v-model="formValidate.jxsOptimalCapacity" class="nosocomial-input" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col >
          </el-row >
        </fieldset>
      </div>
    </el-form>
    <br />
    <el-row >
      <el-col :span="10" :offset="10">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button  @click="cancel">取消</el-button>
      </el-col>
    </el-row >

    <!--选择人员-->
    <Modal
      width="890"
      v-model="selectUserModal"
      title="新建教学活动"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectUserId"></modal-header>
      <select-user v-if="selectUserModal" @cancel="closeUserModal"  @setUsers="setUsers" :initUser="initUser"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import {nosocomial as rules} from '../../rules'
  import selectUser from "../../../../common/selectUser.vue"
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data (){
      return{
        rules,
        courses: [{
          type: '',
          bizDict: ''
        }],
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        countDate:0,
        //form表单bind数据
        formValidate: {
          "name":"",
          "code":"",
          "directorId":"",
          "director":"",
          "secretaryId":"",
          "secretary":"",
          "nurseId":"",
          "nurse":"",
          "zyyCapacity":"",
          "ssyCapacity":"",
          "yjsCapacity":"",
          "jxsCapacity":"",
          depIntroduce:'',
          "path":this.operailityData.path,   //深度路径
          "depth":this.operailityData.depth,  //深度级别
          "parentId":this.operailityData.parentId,
          "parentName":this.operailityData.parentName,
          ssyOptimalCapacity:'',
          yjsOptimalCapacity:'',
          zzyOptimalCapacity:'',
          jxsOptimalCapacity:'',
        },


        //当前操作的选择人员
        currSltUserName:"",
        //选择人员
        selectUserId:{
          id:"selectUserId",
          title:"选择人员",
          usersData:''
        },
        //给选择人员框传递的已选人员信息
        initUser:[],

        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'edit',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:'/hospital/dept/modify/'+this.operailityData.id,
            method:'put',
            jsonString: true,
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
        let getEditTitle = {
           ajaxSuccess:(res)=>{
              this.formValidate = res.data;
           },
          ajaxParams:{
            url:'/hospital/dept/get/'+this.operailityData.id,
          }
        }
        this.ajax(getEditTitle);
      },


      //添加人员
      addUser(itmeName){
        this.currSltUserName = itmeName;
        this.initUser=[];
        if(this.formValidate[this.currSltUserName]!="") {
          let names = this.formValidate[this.currSltUserName].split(",");
          let ids = this.formValidate[this.currSltUserName + "Id"].split(",");
          for(var i=0;i<names.length;i++){
            if(names[i]!=""){
              this.initUser.push({
                key:ids[i],
                label:names[i],
                description: '人员id---' + ids[i] + '的描述信息',
                disabled: false
              })
            }
          }
        }

        this.openModel('selectUser');
      },


      //关闭选择人员弹窗
      closeUserModal(){
        this.selectUserModal = false;
      },


      /*
       * 获取选择人员的人员信息并赋值
       * @param users [{id:'',name:''},{}]  已选人员信息
       * */
      setUsers(users){
        let namesArr = [];
        let idsArr = [];
        for(var i=0;i<users.length;i++){
          namesArr.push(users[i].label);
          idsArr.push(users[i].key);
        }
        this.formValidate[this.currSltUserName] = namesArr.join(",");
        this.formValidate[this.currSltUserName+"Id"] = idsArr.join(",");
        this.closeUserModal();
      },


      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          if(!this.rule())return;
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          this.editMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.editMessTitle, isLoadingFun)
        }
      },

      rule(){
        let ruleArr = [
          {
            key:'ssyCapacity',
            label:'实习生最大承载量'
          },
          {
            key:'ssyOptimalCapacity',
            label:'实习生最优承载量'
          },
          {
            key:'zyyCapacity',
            label:'住院医最大承载量'
          },
          {
            key:'zzyOptimalCapacity',
            label:'住院医最优承载量'
          },
          {
            key:'yjsCapacity',
            label:'研究生最大承载量'
          },
          {
            key:'yjsOptimalCapacity',
            label:'研究生最优承载量'
          },
          {
            key:'jxsCapacity',
            label:'进修生最大承载量'
          },
          {
            key:'jxsOptimalCapacity',
            label:'进修生最优承载量'
          },
        ];
        let formValidate =  this.formValidate;
        for(let i=0;i<ruleArr.length;i++){
          let item = ruleArr[i];
          let value = formValidate[item.key];
          //必填验证
          if(['ssyOptimalCapacity','zzyOptimalCapacity','yjsOptimalCapacity','jxsOptimalCapacity'].includes(item.key)){
            if(!value){
              this.errorMess(item.label+' : 必填');
              return false;
            }
          }
          if (value&&!/^\+?[0-9]\d*$/.test(value)) {
            this.errorMess(item.label+' : 必须正整数且大于等于零');
            return false;
          }
        }

        if(formValidate.ssyCapacity&&formValidate.ssyOptimalCapacity&&+formValidate.ssyCapacity<+formValidate.ssyOptimalCapacity){
          this.errorMess('实习生最大承载量不能小于实习生最优承载量')
          return false;
        }
        if(formValidate.zyyCapacity&&formValidate.zzyOptimalCapacity&&+formValidate.zyyCapacity<+formValidate.zzyOptimalCapacity){
          this.errorMess('住院医最大承载量不能小于住院医最优承载量')
          return false;
        }
        if(formValidate.yjsCapacity&&formValidate.zzyOptimalCapacity&&+formValidate.yjsCapacity<+formValidate.zzyOptimalCapacity){
          this.errorMess('研究生最大承载量不能小于研究生最优承载量')
          return false;
        }
        if(formValidate.jxsCapacity&&formValidate.jxsOptimalCapacity&&+formValidate.jxsCapacity<+formValidate.jxsOptimalCapacity){
          this.errorMess('进修生最大承载量不能小于进修生最优承载量')
          return false;
        }
        return true;

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
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options){
        this[options+'Modal'] = true;
      },


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        return myData;
      },
    },
    components:{
      selectUser
    }
  }
</script>
<style lang="scss">
  .nosocomial{
    .nosocomial-input{
      width:100px;
    }
  }
</style>
