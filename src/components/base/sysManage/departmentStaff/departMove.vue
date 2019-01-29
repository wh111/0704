<!----------------------------------
****--系统管理-部门调动(departMove)
****--@date     2018/3/29
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <el-form :model="formValidate" :rules="depMoveUser" ref="formValidate" label-width="90px">
    <el-row :gutter="20">
      <el-col :span="2">&nbsp;</el-col>
      <el-col :span="8">
        <el-form-item label="原科室:" prop="originalName">
          <el-input v-model="formValidate.originalName" @focus="openSltDepModal('originalTree')" placeholder="请选择原科室" readonly></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="3">&nbsp;</el-col>
      <el-col :span="8">
        <el-form-item label="目标室:" prop="targetDepName">
          <el-input v-model="formValidate.targetDepName" @focus="openSltDepModal('targetTree')" placeholder="请选择目标室" readonly></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="22">
        <el-form-item label=" " style="width: 100%" prop="userIds">
        <Transfer
          :data="leftListData"
          :target-keys="rightTargetKeys"
          :list-style="listStyle"
          :titles="['待选人员', '已选人员']"
          :render-format="render3"
          :operations="['向左移动','向右移动']"
          not-found-text="无信息,请选相应科室及人员!"
          filterable
          class="my-select-user"
          @on-change="handleChange3">
        </Transfer>
        </el-form-item>
      </el-col>
    </el-row>
    </el-form>
    <el-row>
      <el-col :span="10" :offset="10">
        <div >
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row>
    <!--树弹窗-->
    <Modal
      :mask-closable="false"
      v-model="treeModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="400">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="typeId"></modal-header>
      <div style="height:500px;">
        <div style="height:450px;">
          <left-tree  slot="left" @setCurrSltNodeId="setTreeDepId" @tree-click="treeClick" :treeOptions="treeDefaults" :fromWhereTreeType="fromWhereTree"></left-tree>
        </div>
        <br />
        <el-row>
          <el-col :span="16" :offset="2">
            <div style="margin-left: 100px">
              <load-btn @listenSubEvent="treeSubEvent" :btnData="treeBtn"></load-btn>
              <el-button @click="treeModal = false">取消</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  let Util = null;
  import {depMoveUser} from "../rules.js";
  export default {
    name: 'depart-move',
    props: ["operailityData", 'parentTreeDefaults'],
    data(){
      return {

        leftListData: [], //左侧列表的数据
        rightTargetKeys: [], //右侧选中数据的id
        splitDataToObject: {}, //将源数据转化为以源数据key为对象的key的数据对象
        rightSltedData: [], //存储右侧框中选中的数据
        onlyOne: this.isOnlyOne || false,
        listStyle: {
          width: '320px',
          height: '400px'
        },
        firstInit:true,  //第一次加载

        //选择部门tree模态框
        treeModal:false,

        treeType:"originalTree",  //originalTree targetTree

        //tree默认项设置
        treeDefaults: this.parentTreeDefaults || {
          getTreeUrl: '/dept/tree-by-manager',
          getDataUrl: '',
          isShowMenus: false,
          isShowSearch: false, //是否显示目录树查询
        },
        fromWhereTree : "user",

        loadBtn:{title:'保存',callParEvent:'listenSubEvent'},
        treeBtn:{title:'保存',callParEvent:'listenSubEvent'},

        //验证
        depMoveUser,
        formValidate:{
          userIds:"", //调动人员IDs  多个逗号分隔
          //目标科室
          targetDepId:"", //目标科室ID
          targetDepName:"",

          //原科室
          originalId:"",
          originalName:"",
        },

        typeId:{
          id:'typeId',
          title:'部门调动'
        },

        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'depMove',
          successTitle: '人员调动成功!',
          errorTitle: '人员调动失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: "/user/departmentMobilize",
            method: 'post',

          }
        },
      }
    },
    created() {
      Util = this.$util;
      this.init();
    },
    methods: {
      //初始化
      init(){
        if(typeof this.operailityData.deptId!="undefined"){
          if(this.operailityData.deptId!=""){
            this.searchUsersData(this.operailityData.deptId);
            this.formValidate.targetDepId = this.operailityData.deptId;
            this.formValidate.originalName = this.operailityData.deptName;
          }
        }
        //this.getMockData();
      },

      /*
       * 初始化时获取左侧框中的数据
       * @return mockData [{},{}]  左侧框的源数据
       * */
      getMockData() {
        if (this.rightSltedData.length == 0) return;
        this.leftListData = this.rightSltedData;
      },

      /*
       * 查询叶子节点数据
       * @param id number | string  当前选中的节点的ID
       * */
      searchUsersData(id) {
        this.getMockData();
        let userList = {
          ajaxSuccess: (res) => {
            let rawData = res.data;
            let tempArr = [];

            for (var i = 0, item; i < rawData.length; i++) {
              item = rawData[i];
              let codeNumber = "";  //人员编号
              if(item["codeNumber"]!==null||typeof item["codeNumber"]!="undefined"){
                codeNumber = item["codeNumber"];
              }
              tempArr.push({
                isParent:false,
                key: item.id,
                label: item.name,
                specialty: item.specialty,
                codeNumber:item.codeNumber,
                description: '人员id---' + item.id + '的描述信息',
                disabled: false,
                data: item
              })
            }
            if (this.rightSltedData.length > 0) {
              let userObj = this.splitDataToObjFun(tempArr);
              for (var i = 0, item; i < this.rightSltedData.length; i++) {
                item = this.rightSltedData[i];
                delete(userObj[item["key"]]);
              }
              tempArr = [];
              Util._.forEach(userObj, function (n, key) {
                tempArr.push(n);
              })
            }
            this.leftListData = this.removeSelected(this.rightSltedData.concat(tempArr));
            this.setSltCatinerVal();
          },
          ajaxParams: {
            url: '/user/query/usedByDeptIds/' + id,
          }
        }
        this.ajax(userList);
      },

      /*
       * 将源数据转化为以源数据key为对象的key的数据对象
       * @param data [{},{}]  源数据转data
       * */
      splitDataToObjFun(data) {
        let myData = data;
        let keyValUser = {};
        for (var i = 0, item, myKey; i < myData.length; i++) {
          item = myData[i]
          myKey = item["key"] + "";
          keyValUser[myKey] = item;
        }
        return keyValUser;
      },

      /*如果有禁止选择的则在列表上清空，
       * unSelect   为 [123,233] id数组
       * */
      removeSelected(data) {
        if (!this.unSelect) return data;
        for (let i = 0; i < data.length; i++) {
          if (~this.unSelect.indexOf(data[i].key)) {
            data.splice(i--, 1)
          }
        }
        return data
      },

      /*
       * 设置左右选中框中的值
       *
       * */
      setSltCatinerVal() {
        let arr = this.rightTargetKeys;
        this.rightTargetKeys = [];
        setTimeout(
          () => {
            if (arr.length > 0) {
              this.rightTargetKeys = arr;
            }
          }, 1)
      },

      //点击树的回调函数
      treeSubEvent(){
        if(this.treeType=="originalTree") {
          this.searchUsersData(this.formValidate.originalId);
        }
        this.treeModal = false;

      },

      /*
       * 保存或上报按钮会调用这个公共函数
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        if(!isLoadingFun) isLoadingFun=function(){};
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          isLoadingFun(true);
          let {userIds,targetDepId} = this.formValidate;
          this.addMessTitle.ajaxParams.data = {userIds:userIds,targetDepId:targetDepId};
          this.ajax(this.addMessTitle, isLoadingFun);
        }
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
       *  初始化或者刷新数列表的时候  调用treeClick函数 为deptId赋值
       * */
      treeClickInit(obj) {
        this.treeClick(obj)
      },


      /*
       * 左侧目录树节点click调用父组件方法
       *
       * @param obj {} 当前选中节点的一级数据
       *
       * @param node  {}  整个tree节点所有数据
       *
       * @param  self  {}  当前tree vue实例
       *
       * */
      treeClick(obj, node, self) {
        // 记录视图
        this.setTreeDepId(obj.id,obj);
      },


      /*
       * 设置当前部门Id
       * */
      setTreeDepId(id,obj) {
        if (id&&!this.firstInit) {
          if(this.treeType=="originalTree"){
            this.formValidate.originalId = id;
            this.formValidate.originalName  = obj.name;
``
          }else{
            this.formValidate.targetDepId = id;
            this.formValidate.targetDepName  = obj.name;
          }
        }
        this.firstInit = false;
      },

      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel',this.addMessTitle.type);
      },
      /**
       * 打开选择的目录树  openSltDepModal
       * @param String type    //originalTree targetTree
       */
      openSltDepModal(type){
        this.treeType = type;
        this.treeModal = true;
      },

      /*
       * 选项在两栏之间转移时的回调函数
       * @param targetKeys  string  右侧选择框中的值
       * @param direction   string  移动的方向left right
       * @param moveKeys    string  移动过程中的值
       */
      handleChange3(targetKeys, direction, moveKeys) {
        if (this.onlyOne ) { //如果选择一个
          if( targetKeys.length > 1){
            this.showMess('只能选择一个人员');
            return;
          }else {
            let temp = {}
            for (let i = 0, item; i < this.leftListData.length; i++) {
              item = this.leftListData[i];
              if(item["key"]==targetKeys[0]&&item.isParent){
                this.showMess('只能选择一个人员');
                return;
              }
            }
          }
        }

        this.rightTargetKeys = targetKeys;
        if (direction == "right") {
          //向对象中添加
          let tempObj = {}
          for (var i = 0, item; i < this.leftListData.length; i++) {
            item = this.leftListData[i];
            tempObj[item["key"]] = item;
          }
          for (var i = 0, item; i < moveKeys.length; i++) {
            item = moveKeys[i];
            this.splitDataToObject[item] = tempObj[item];
          }

        } else {
          for (var i = 0, item; i < moveKeys.length; i++) {
            item = moveKeys[i];
            delete(this.splitDataToObject[item]);
          }
        }
        this.setRightSltedData(this.splitDataToObject);
      },

      /*
       * 设置右侧框中选择的数据
       * @param obj {}  右侧框中的数据
       * */
      setRightSltedData(obj) {
        this.rightSltedData = [];
        let tempArr = [];
        Util._.forEach(obj, (n, key) => {
          this.rightSltedData.push(n);
          tempArr.push(key)
        })
        this.formValidate.userIds = tempArr.join(",");
      },

      /*
       * 格式化数据的展示形式
       * @param item {} 左侧列表的数据
       * todo  描述信息暂时没有,用到selectUser的地方可以先把描述信息传递过来,这里不做展示
       * */
      render3(item) {
        if(typeof item.codeNumber=="undefined"||item.codeNumber===null||item.codeNumber==""){
          item.codeNumber = "无"
        }
        return item.label + ' - 编号(' + item.codeNumber + ')' //item.description;
      },
    },
  }
</script>

<style lang="scss">

</style>
