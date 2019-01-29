<!----------------------------------
****--分组设置(groupSet_edit)
****--@date     2017/7/3
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="4">
        <div class="cal-schoolTit" style="text-align: right;">分组名称：</div>
      </el-col>
      <el-col :span="6">
      <el-input v-model="groupData.groupName" placeholder="请输入"></el-input>
      </el-col>
      <el-col :span="4">
        <div class="cal-schoolTit" style="text-align: right;">分组顺序：</div>
      </el-col>
      <el-col :span="6">
        <el-select
          v-model="groupData.groupIndexId"
          :filterable="true"
          placeholder="选择或输入匹配搜索">
          <el-option
            v-for="item in groupData.groupIndxList"
            :key="item.depGroupIndex"
            :label="item.depGroupIndexName"
            :value="item.depGroupIndex">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="22">
        <div class="el-form selectUserBox">
          <fieldset style="min-height:90px;">
            <legend style="font-size:16px">&nbsp;&nbsp;组员名单&nbsp;</legend>
            <el-row>
              <el-col :span="16">
                <el-input readonly></el-input>
              </el-col>
              <el-col :span="4" :push="1">
                <el-tooltip content="点击添加人员" placement="top">
                  <el-button type="primary" icon="plus" @click="addUser"></el-button>
                </el-tooltip>
              </el-col>
            </el-row>
            <br />
            <div style="height:40px;overflow:auto;" v-if="typeof groupData.groupUserNames!='undefined'">
              <el-tag style="margin: 2px;" v-for="(item,idx) in groupData.groupUserNames" :key="idx" type="success">
                {{item}}
              </el-tag>
            </div>
            <p v-else>没有组员</p>
          </fieldset>
        </div>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
    </el-row>
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
      <select-user-group v-if="selectUserModal" @cancel="closeUserModal" :treeUrl="getTreeUrl" :selectOption="selectOption"   @setUsers="setUsers" :initUser="users" :unSelect="unSelect"></select-user-group>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import selectUserGroup from '../../../common/selectUserGroup.vue'

  //引入当前组件字典api
  import api from "../api.js";
  //当前组件引入全局的util
  let Util = null;
  export default{
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data() {
      return {
        //选择人员目录树参数设置
        selectOption:{
          url:'/user/search/list',
          params:{
            schoolName:'',
          }
        },
        getTreeUrl: '/dept/tree-by-SXS', //目录树结构请求地址
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        //查看分组
        groupData:{
          depGroupIndex:"",
          groupId:"",
          groupIndexName:"",
          groupName:"",
          groupUserIds:"",
          groupUserNames:"",
          outlineId:"",
        },

        //大组顺序数据
        bigGroupData:[],

        //当前操作的选择人员的已选人员
        users:[],
        unSelect:[],
        selectUserModal:false,
        //选择人员
        selectUserId:{
          id:"selectUserId",
          title:"选择人员",
          usersData:''
        },

        //获取当前组的信息
        getGroupMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: api.groupShow.path+"/"+this.operailityData["groupId"],
          }
        },

        //根据当前组的大纲信息获取该大纲下关联的所有大组的顺序
        bigGroupMessTitle:{
          ajaxSuccess:'getBigGroupData',
          ajaxParams:{
            url: api.getBigGroup.path,
            params:{
              schoolId:"",
              specialty:"",
              depOutlineId:this.operailityData["outlineId"],
            }
          }
        },


        //修改分组信息
        editMessTitle:{
          type:'edit',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url: api.groupEdit.path+"/"+this.operailityData["groupId"],
            method:'put'
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        this.ajax(this.getGroupMessTitle);
      },


      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        //let isSubmit = this.submitForm("formValidate");
        //if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true)
          this.editMessTitle.ajaxParams.data = this.getFormData(this.groupData);
          this.ajax(this.editMessTitle, isLoadingFun)
        //}
      },


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        myData["groupUserNames"] = myData["groupUserNames"].join(",");
        return myData;
      },


      //根据当前组的大纲信息获取该大纲下关联的所有大组的顺序
      getBigGroupData(responseData){
        let data = responseData.data;
        this.formateData(data);
      },


      //格式化传递服务端获取的大组的数据
      formateData(data){
        /*data = {
         "depOutlineId":1111,
         "schoolName":"学校",
         "gradeNum":"年级",
         "specialty":"临床医学",
         "groupInfo":[
         {
         "groupNo":1,
         "greatName":"内"
         },
         {
         "groupNo":2,
         "greatName":"外"
         }
         ],
         "outlineGroupIndex":[
         {
         "groupIndexId":1,
         "groupNoOrder":"1,2"
         },
         {
         "groupIndexId":2,
         "groupNoOrder":"2,1"
         }
         ]
         }*/
        if(!Util.isEmptyObject(data)){
          let groupInfo = {};
          for(var i=0,item;i<data["groupInfo"].length;i++){
            item = data["groupInfo"][i];
            groupInfo[item["groupNo"]] = item["greatName"];
          }

          //循环大组的数量
          this.bigGroupData = [];
          for(var i=0,item,rotateOrder;i<data["outlineGroupIndex"].length;i++){

            rotateOrder = "";
            item = data["outlineGroupIndex"][i];
            if(item["groupNoOrder"].indexOf(",")>-1){
              let tempArr = [];
              for(var k=0,subItem,str;k<item["groupNoOrder"].split(",").length;k++){
                subItem = item["groupNoOrder"].split(",")[k];
                str=groupInfo[subItem]||"";
                tempArr.push(str);
              }
              rotateOrder = tempArr.join("-->");
            }else{
              subItem = item["groupNoOrder"];
              str=groupInfo[subItem]||"";
              rotateOrder = str;
            }

            this.bigGroupData.push({
              groupIndexId:item["groupIndexId"],
              groupNoOrder:rotateOrder,
            })
          }
        }
      },


      /**
       * 添加人员
       * @param index {number}  当前组的索引
       */
      addUser(index){
        this.users = [];
        for(var i=0,item,idItem;i<this.groupData["groupUserNames"].length;i++){
          item = this.groupData["groupUserNames"][i];
          idItem = this.groupData["groupUserIds"][i];
          this.users.push({
            description:"人员id---"+idItem+"的描述信息",
            disabled:false,
            key:idItem,
            label:item,
          })
        }
        this.openModel('selectUser');
      },


      /**
       * 获取选择人员的人员信息并赋值
       * @param users [{key:'10204',label:'内科01'},{}]  已选人员信息
       * */
      setUsers(users){
        this.users = users;
        this.setGroupPeople(users);
        this.closeUserModal();
      },

      /**
       * 当前选择人员框的已选人员给组(group)bind数据
       * @param users [{key:'10204',label:'内科01'},{}]  已选人员信息
       * */
      setGroupPeople(users){
        this.groupData["groupUserIds"] = [];
        this.groupData["groupUserNames"] = [];
        for(var i=0;i<users.length;i++){
          this.groupData["groupUserIds"].push(users[i]["key"]);
          this.groupData["groupUserNames"].push(users[i]["label"]);
        }
      },

      //获取服务端分组信息
      updateListData(responseData){
        let data = responseData.data;
        this.selectOption.params.schoolName = data.schoolName;
        this.groupData = this.formateQuestData(data);

        //查询大组的轮转顺序
        //this.ajax(this.bigGroupMessTitle);
      },


      //关闭选择人员弹窗
      closeUserModal(){
        this.selectUserModal = false;
      },


      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','edit');
      },


      /**
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options){
        this[options+'Modal'] = true;
      },


      /**
       * 格式化请求的数据
       * @param data  {Object}  服务端请求的源数据
       * @return obj  {Object}  页面视图展示需要的数据
       * */
      formateQuestData(data){
        let obj = {}
        if(!Util.isEmptyObject(data)){
          data["groupIndexId"]=data["depGroupIndex"];
          if(data["groupUserNames"].indexOf(",")>-1){
            data["groupUserNames"] = data["groupUserNames"].split(",");
            data["groupUserIds"] = data["groupUserIds"].split(",");
          }else{
            data["groupUserNames"] = [data["groupUserNames"]];
            data["groupUserIds"] = [data["groupUserIds"]];
          }
          obj = data;
        }
        return obj;
      },

    },
    created(){
      Util = this.$util;
      this.init();
    },
    mounted(){
    },
    components: {
      selectUserGroup
    }
  }
</script>
