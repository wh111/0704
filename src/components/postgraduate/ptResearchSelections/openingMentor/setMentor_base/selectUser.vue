<template>
  <div>
    <!--左侧树-->
    <layout-tree style="height: 550px">
      <left slot="left" @tree-click="treeClick" :ajaxData="ajaxData" :treeOptions="treeDefaults"
            :fromWhereTreeType="fromWhereTree"></left>
      <div slot="right" id="content" ref="content" class="modal">
        <!--查询-->
        <div>
          <el-input
            placeholder="请选输入相关查询信息"
            icon="search"
            v-model="searchUserInfo"
            :on-icon-click="handleIconClick">
          </el-input>
        </div>
        <br/>
        <div style="margin: 0 auto;width: 630px;">
          <Transfer
            :data="leftListData"
            :target-keys="rightTargetKeys"
            :list-style="listStyle"
            :render-format="render3"
            :operations="['向左移动','向右移动']"
            not-found-text="无信息,请选择左侧菜单!"
            filterable
            @on-change="handleChange3">
          </Transfer>
        </div>
        <br/>
        <div class="ivu-tabs-bar"></div>
        <div style="text-align: center">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <el-button @click="cancel">取消</el-button>
        </div>
      </div>
    </layout-tree>
  </div>
</template>
<script>
  import layoutTree from "../../../../common/layoutTree.vue";
  import left from "./leftTree.vue";
  import {getConfigByProps, getSearchParamsVal} from '../../../../base/plugins/selecteUser';

  let Util = null;
  export default {
    props: ["initUser", 'isOnlyOne', 'url', 'unSelect', 'ajaxData', 'treeOptions', 'searchParams'],
    data() {
      return {
        //tree默认项设置
        treeDefaults: {
          ajaxData: this.ajaxData,
          selectUser: true,
          getDataUrl: '',
          isShowMenus: false,
          isInitSltedNode: false, //是否需要默认选中tree节点
        },
        fromWhereTree: "other",

        searchUserInfo: "", //全局查询人员信息
        leftListData: [], //左侧列表的数据
        rightTargetKeys: [], //右侧选中数据的id
        splitDataToObject: {}, //将源数据转化为以源数据key为对象的key的数据对象
        rightSltedData: [], //存储右侧框中选中的数据
        onlyOne: this.isOnlyOne || false,
        listStyle: {
          width: '260px',
          height: '400px'
        },
        loadBtn: {title: '提交', callParEvent: "listenSubEvent"},
        selectTreeData: {
          id: '',// 当前选中的树节点id,
          node: null, self: null, isLeaf: null
        }
      }
    },
    created() {
      Util = this.$util;
      this.init();
    },
    components: {
      layoutTree, left
    },
    methods: {

      //初始化
      init() {
        if (typeof this.treeOptions != "undefined") {
          this.treeDefaults = Object.assign(this.treeDefaults, this.treeOptions);
        }

        if (typeof this.initUser != "undefined") {
          this.rightSltedData = this.initUser;
        }
        if (this.url) {
          this.treeDefaults.getTreeUrl = this.url;
        }
        this.getMockData();
      },

      //点击查询图标调用
      handleIconClick() {
        if (this.searchUserInfo === '') {
          return;
        }
        let ajaxParams = getConfigByProps(this.searchParams); // 获取ajax配置
        let params = getSearchParamsVal(this.searchUserInfo); // 根据输入值智能判断类型
        params.deptIds = this.selectTreeData.id;
        if (ajaxParams.method == 'post') { // 根据ajax请求方式进行赋值
          ajaxParams.data = Object.assign(ajaxParams.data || {}, params);
        } else {
          ajaxParams.params = Object.assign(ajaxParams.params || {}, params);
        }
        let opt = {
          ajaxSuccess: 'setLeftData',
          ajaxParams
        };
        this.ajax(opt);
      },

      /**
       * 设置左侧框中选择的数据
       * @param res {}  ajax返回的数据
       */
      setLeftData(res) {
        let rawData = res.data;
        let node = this.selectTreeData.node;
        /*[{
          id:12,
          name:"123",
          specialty:"内科"
        }]*/
        let tempArr = [];
        if (node && node.childNodes.length > 0) {
          for (var i = 0, item; i < node.childNodes.length; i++) {
            item = node.childNodes[i];
            if (typeof item.specialty == 'undefined') {
              item.specialty = '';
            }
            tempArr.push({
              isParent: true,
              key: item.key,
              label: '<i dep="dep" class="ivu-icon ivu-icon-android-folder ambuf-tree-icon" style="margin-left:0;font-size:16px;"></i>' + item.label,
              specialty: item.specialty,
              codeNumber: item.codeNumber,
              description: '内容---' + item.key + '的描述信息',
              disabled: false
            });
          }
        }
        /*Util._.forEach(rawData,function (val,key) {
          tempArr.push({
            key:key,
            label:val,
            description: '人员id---' + key + '的描述信息',
            disabled: false
          })
        })*/
        for (var i = 0, item; i < rawData.length; i++) {
          item = rawData[i];
          let codeNumber = '';  //人员编号
          if (item['codeNumber'] !== null || typeof item['codeNumber'] != 'undefined') {
            codeNumber = item['codeNumber'];
          }
          tempArr.push({
            isParent: false,
            key: item.id,
            label: item.name,
            specialty: item.specialty,
            codeNumber: item.codeNumber,
            description: '人员id---' + item.id + '的描述信息',
            disabled: false,
            data: item
          });
        }
        if (this.rightSltedData.length > 0) {
          let userObj = this.splitDataToObjFun(tempArr);
          for (var i = 0, item; i < this.rightSltedData.length; i++) {
            item = this.rightSltedData[i];
            delete(userObj[item['key']]);
          }
          tempArr = [];
          Util._.forEach(userObj, function (n, key) {
            tempArr.push(n);
          });
        }

        this.leftListData = this.removeSelected(this.rightSltedData.concat(tempArr));
        this.setSltCatinerVal();
      },

      /*
       * 初始化时获取左侧框中的数据
       * @return mockData [{},{}]  左侧框的源数据
       * */
      getMockData() {
        if (this.rightSltedData.length == 0) return;
        let keys = []
        this.leftListData = this.rightSltedData;

        for (var i = 0, item; i < this.initUser.length; i++) {
          item = this.initUser[i];
          if (typeof item.specialty == "undefined") {
            item.specialty = "";
          }
          this.splitDataToObject[item["key"]] = item;
          keys.push(item["key"]);
        }
        this.rightTargetKeys = keys;
      },

      //点击查询图标调用

      //保存成功回调
      listenSubEvent() {
        let users = []; //需要提交的id信息
        let depIds = []; //选中的所有部门id
        let tempObj = {} //临时存储的所有人员信息
        Util._.forEach(this.rightSltedData, function (obj, key) {
          if (obj["label"].indexOf("dep=") > -1) {
            depIds.push(obj["key"]);
          } else {
            tempObj[obj["key"]] = obj;
          }
        });
        //请求ajax
        let userList = {
          ajaxSuccess: (res) => {
            let rawData = res.data;
            let tempArr = [];
            /*if(!Util.isEmptyObject(rawData)){
              Util._.forEach(rawData, (v,k)=> {
                let mykey = parseInt(k);
                tempObj[k] = {
                  key:parseInt(k),
                  label:v,
                  description: '人员id---' + mykey + '的描述信息',
                  disabled: false
                }
              })
            }*/
            for (var i = 0, item; i < rawData.length; i++) {
              item = rawData[i];
              let codeNumber = "";  //人员编号
              if (item["codeNumber"] !== null || typeof item["codeNumber"] != "undefined") {
                codeNumber = item["codeNumber"];
              }
              tempObj[item["id"]] = {
                key: item.id,
                label: item.name,
                specialty: item.specialty,
                codeNumber: codeNumber,
                description: '编号---' + codeNumber,
                disabled: false
              }
            }
            Util._.forEach(tempObj, (n, key) => {
              users.push(n);
            })
            this.$emit('setUsers', users);
          },
          ajaxParams: {
            url: '/user/query/usedByDeptIds/' + depIds.join(",")
          }
        }
        if (depIds.length > 0) {
          this.ajax(userList);
        } else {
          Util._.forEach(tempObj, (n, key) => {
            users.push(n);
          })
          this.$emit('setUsers', users);
        }
      },

      //调用父组件关闭当前模态框
      cancel() {
        this.$emit("cancel", "selectUser", false)
      },

      /*
       * 左侧目录树节点click调用方法
       *
       * @param obj {} 当前选中节点的一级数据
       *
       * @param node  {}  整个tree节点所有数据
       *
       * @param  self  {}  当前tree vue实例
       *
       * @param isLeaf boolean  当前节点是否为叶子节点
       * */
      treeClick(obj, node, self, isLeaf) {
        this.clickId = obj.id;
        let id = obj.id;
        this.selectTreeData = {id, node, self, isLeaf};
        this.searchUserInfo = '';
        this.formateTreeData(obj, isLeaf, node);
      },

      /*
       * 设置右侧框中选择的数据
       * @param obj {}  右侧框中的数据
       * */
      setRightSltedData(obj) {
        this.rightSltedData = [];
        Util._.forEach(obj, (n, key) => {
          this.rightSltedData.push(n);
        })
      },

      /*
       * 查询叶子节点数据
       * @param id number | string  当前选中的节点的ID
       * */
      searchLeafData(id, isLeaf, node) {
        let userList = {
          ajaxSuccess: (res) => {
            let rawData = res.data;
            /*[{
              id:12,
              name:"123",
              specialty:"内科"
            }]*/
            let tempArr = [];
            if (node.childNodes.length > 0) {
              for (var i = 0, item; i < node.childNodes.length; i++) {
                item = node.childNodes[i];
                if (typeof item.specialty == "undefined") {
                  item.specialty = "";
                }
                tempArr.push({
                  isParent: true,
                  key: item.key,
                  label: '<i dep="dep" class="ivu-icon ivu-icon-android-folder ambuf-tree-icon" style="margin-left:0;font-size:16px;"></i>' + item.label,
                  specialty: item.specialty,
                  codeNumber: item.codeNumber,
                  description: '内容---' + item.key + '的描述信息',
                  disabled: false
                })
              }
            }
            /*Util._.forEach(rawData,function (val,key) {
              tempArr.push({
                key:key,
                label:val,
                description: '人员id---' + key + '的描述信息',
                disabled: false
              })
            })*/
            for (var i = 0, item; i < rawData.length; i++) {
              item = rawData[i];
              let codeNumber = "";  //人员编号
              if (item["codeNumber"] !== null || typeof item["codeNumber"] != "undefined") {
                codeNumber = item["codeNumber"];
              }
              tempArr.push({
                isParent: false,
                key: item.archivesId,
                label: item.name,
                specialty: item.specialty,
                codeNumber: item.codeNumber,
                description: '人员id---' + item.id + '的描述信息',
                disabled: false
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
            url: '/archives/list/teach',
            params: {typeId: id}
          }
        }
        this.ajax(userList);
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
       * 格式化左侧列表的数据展示形式
       *
       * @param obj {} 当前选中节点的一级数据
       *
       * @param isLeaf boolean  当前节点是否为叶子节点
       *
       * @param node {}  当前节点、当前节点下所有子节点
       * */
      formateTreeData(obj, isLeaf, node) {
        //去重:右侧框中已经有当前的值
        this.searchLeafData(obj.id, isLeaf, node);
        /*if(!isLeaf){
          if(this.splitDataToObject.hasOwnProperty(obj.id)){
            this.leftListData = this.rightSltedData;
            this.setSltCatinerVal();
            return;
          }
          let tempArr = [];
          tempArr.push({
            key: obj.id,
            label: '<i dep="dep" class="ivu-icon ivu-icon-android-folder ambuf-tree-icon" style="margin-left:0;font-size:16px;"></i>' + obj.name,
            description: '内容---' + obj.id + '的描述信息',
            disabled: false
          })
          this.leftListData = this.rightSltedData.concat(tempArr);
          this.setSltCatinerVal();
        }else{

        }*/
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

      /*
       * 设置默认右侧已选数据
       * @return [] 返回当前需要设置右侧已经选择的id
       * */
      getTargetKeys() {
        /*let initRightData = ["99","100"];
        this.setRightSltedData(initRightData);
        return ["99","100"];*/
        return [];
      },

      /*
       * 选项在两栏之间转移时的回调函数
       * @param targetKeys  string  右侧选择框中的值
       * @param direction   string  移动的方向left right
       * @param moveKeys    string  移动过程中的值
       */
      handleChange3(targetKeys, direction, moveKeys) {
        if (this.onlyOne) { //如果选择一个
          if (targetKeys.length > 1) {
            this.showMess('只能选择一个人员');
            return;
          } else {
            let temp = {}
            for (let i = 0, item; i < this.leftListData.length; i++) {
              item = this.leftListData[i];
              if (item["key"] == targetKeys[0] && item.isParent) {
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
       * 格式化数据的展示形式
       * @param item {} 左侧列表的数据
       * todo  描述信息暂时没有,用到selectUser的地方可以先把描述信息传递过来,这里不做展示
       * */
      render3(item) {
        if (typeof item.codeNumber == "undefined" || item.codeNumber === null || item.codeNumber == "") {
          item.codeNumber = "无"
        }
        return item.label + ' - 编号(' + item.codeNumber + ')' //item.description;
      },

    },
  }
</script>
