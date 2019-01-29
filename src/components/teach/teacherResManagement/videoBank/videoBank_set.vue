<!----------------------------------
****--权限设置-(jurisdiction_set)
****--@date     2017/8/4
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
    <div style="min-height: 300px;">
      <el-row>

        <el-col :span="15" :offset="5">
          <el-radio-group   v-model="formValidate.openStatus">
            <!--<el-radio label="PRIVATE">仅自己可看</el-radio>-->
            <el-radio  label="OPEN">公开</el-radio>
            <el-radio label="SYSTEM_USER">系统人员</el-radio>
            <el-radio @click.native="radioUser" label="SOME_USER">部分人员</el-radio>
            <el-radio label="SOME_ROLE">部分角色</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      </br>
      <div style="min-height: 250px;">


      <fieldset style="min-height: 250px;"  v-show="formValidate.openStatus=='SOME_ROLE'" class="select-W layui-elem-field">
        <legend>选择角色</legend>
        <div class="layui-field-box">
          <el-select  style="width: 100%;"  v-model="role" multiple filterable placeholder="请选择角色">
            <select-option  style="width: 100%;" :type="'role'" :unAll="true"></select-option>
          </el-select>
      </div>
      </fieldset>


      <fieldset style="min-height: 250px;"  v-show="formValidate.openStatus=='SOME_USER'" class="layui-elem-field">
        <legend>选择人员</legend>
        <div class="layui-field-box">
          <el-tag
            v-for="(tag,index) in selectUser"
            :key="index"
            :closable="true"
            :type="'success'"
            @close="handleClose(index)">
            {{tag.label}}
          </el-tag>
      </div>
      </fieldset>
      </div>
      </br>
      <el-row >
        <el-col :span="16" :offset="6">
          <div style="margin-left: 100px">
            <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
            <el-button @click="cancel">取消</el-button>
          </div>
        </el-col>
      </el-row>

      <!--选择人员-->
      <Modal
        width="890"
        v-model="selectUserModal"
        title="新建教学活动"
        class-name="vertical-center-modal">
        <modal-header slot="header" :content="selectUserId"></modal-header>
        <select-user v-if="selectUserModal" @cancel="selectUserModal = false" @setUsers="selectUserCallback" :initUser="selectUser"></select-user>
        <div slot="footer"></div>
      </Modal>
    </div>
</template>
<script>
    /*当前组件必要引入*/

    //当前组件引入全局的util
    let Util = null;
    export default{
      props:['operailityData','url'],
        data() {
            return {
              selectUser:[],
              formValidate:{
                openStatus:'OPEN',     //视频公开情况
                userIds:'',     //多个人员ID，隔开 当openStatus选择OPEN、SYSTEM_USER时，改数组可以为空[]，当openStatus选择的是SOM_USER、SOME_ROLE时，改数组必须有值）
              },
              loadBtn:{title:'保存',callParEvent:'listenSubEvent'},

              role:[],

              selectUserModal:false,
              selectUserId:{
                id:"selectUserId",
                title:"选择人员",
                usersData:''
              },
              //当前组件提交(add)数据时,ajax处理的 基础信息设置
              editMessTitle: {
                type: 'jurisdictionSet',
                successTitle: '权限设置成功!',
                errorTitle: '权限设置失败!',
                ajaxSuccess: 'ajaxSuccess',
                ajaxError: 'ajaxError',
                ajaxParams: {
                  url: this.url.save.path,
                  method: 'post',
                  data: {},
                }
              }

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



            let formValidate = this.getFormData(this.formValidate);
            formValidate = this.conductData(formValidate); // 如果验证失败则返回false
            if(!formValidate)return;
              let ids = [];
              for(let i=0 ;i<this.operailityData.length;i++){
                  ids.push(this.operailityData[i].id)
              }
            this.editMessTitle.ajaxParams.url = this.url.save.path+ids.join(',');
            this.editMessTitle.ajaxParams.data = formValidate;
            isLoadingFun(true);
            this.ajax(this.editMessTitle,isLoadingFun)
          },


          //处理要提交的数据
          conductData(data){
              //如果是部分人员的时候
              if(data.openStatus=='SOME_USER'){
                 let userIds=[];
                 let selectUser = this.selectUser
                for(let i=0;i<selectUser.length;i++){
                 userIds.push(selectUser[i].key) ;
                 }
                data.userIds = userIds.join(',');
                if(!data.userIds){
                    this.errorMess('请选择人员');
                    return false;
                }
              }else if(data.openStatus=='SOME_ROLE'){ //部分角色

                data.userIds = this.role.join(',');
                if(!data.userIds){
                  this.errorMess('请选择角色');
                  return false;
                }
              }else {
                  data.userIds = '';
              }
              return data;
          },

          /*
           * 获取表单数据
           * @return string  格式:id=0&name=aa
           * */
          getFormData(data) {
            let myData = this.$util._.defaultsDeep({}, data);
            return myData;
          },
          /*
           * 当前组件发送事件给父组件
           * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
           * */
          cancel(){
            this.$emit('cancel',this.editMessTitle.type);
          },

          //选择人员
          selectUserCallback(data){
            this.selectUser = data;
            this.selectUserModal = false;
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


          //移除人员
          handleClose(index){
              this.selectUser.splice(index,1);
          },


          radioUser(){
           this.selectUserModal = true
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
