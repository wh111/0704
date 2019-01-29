<!----------------------------------
****--分组设置(groupSet_addFour)
****--@date     2017/7/3
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <el-row :gutter="10" class="myCard">
      <el-col style="margin: 10px 0;" :span="12" v-for="(o, index) in bigGroupData" :key="o">
        <el-card :body-style="{ padding: '0px', margin:'0 auto' }">
          <div slot="header" class="clearfix">
            <div class="headerBox">
              <span style="line-height: 36px;font-size: 14px;font-weight: 700;">{{o.groupNoOrder}}</span>
            </div>
          </div>
          <div style="padding: 14px;">
            <div class="el-form selectUserBox">
              <fieldset style="min-height:140px;">
                <legend style="font-size:16px">&nbsp;&nbsp;已分配小组&nbsp;</legend>
                <div style="height:40px;overflow:auto;" v-if="o.subGroup.length>0">
                  <el-tag style="margin: 2px;" v-for="(item,idx) in o.subGroup" :key="idx" :closable="true" type="success" @close="handleMClose(index,idx)">
                    {{item.groupName}}
                  </el-tag>
                </div>
                <p v-else>请选择组员</p>
                <el-row :gutter="10">
                  <el-col :span="24" style="text-align: center;">
                    <el-button type="primary" @click="addGroup(index)">添加分组</el-button>
                  </el-col>
                </el-row>
              </fieldset>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <p v-if="!isHashGroupIndex" style="text-align: center;color: #FF0000">
          您选择的大纲分组顺序已被删除，不能设置顺序,建议在第三步"勾上跳过顺序设置"!
        </p>
      </el-col>
    </el-row>
    <!--增加弹窗-->
    <Modal
      :mask-closable="false"
      v-model="setGroupModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="700">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="addId"></modal-header>
      <add v-if="setGroupModal" :sltedGroup="sltedGroup" @cancel="cancelGroupModal" @filterAddGroupData="filterAddGroupData" :operaility-data="operailityData"></add>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //引入当前组件字典api
  import api from "../api.js";
  import add from "./groupSet_addFourAdd.vue";
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:["params","groupData"],
    data() {
      return {
        //已经选择的小组不含本次新建的
        sltedGroup:[],
        //添加小组
        setGroupModal:false,
        operailityData:"",
        addId:{
          id:'add',
          title:'添加分组'},

        //大组信息
        isHashGroupIndex:true,
        currGroupIndex:"",
        bigGroupData:[
          /*{
            groupIndexId:"1",
            groupNoOrder:"内-->外",
            subGroup:[{

            }]
          }*/
        ],

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: api.getBigGroup.path,
            params:this.params
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util;
        this.ajax(this.listMessTitle);
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
          if(data["outlineGroupIndex"].length==0){
            this.isHashGroupIndex = false;
          }
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
              subGroup:[],
            })
          }

          //将第三设置的小组1,2,3,1,2,3  平均分配到大组中
          let bigGroupLen = this.bigGroupData.length;
          if(bigGroupLen==0) return;
          for(var i=0,item;i<this.groupData.length;i++){
            item = this.groupData[i];
            this.bigGroupData[i%bigGroupLen]["subGroup"].push(item);
          }
        }
      },


      /**
       * 删除已选择的小组
       * @param index  {number}   当前组索引
       * @param idx    {number}   当前人员split(',')后的索引
       */
      handleMClose(index,idx) {
        this.bigGroupData[index]["subGroup"].splice(idx,1);
      },


      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      cancelGroupModal(options){
        this[options+'Modal'] = false;
      },


      /**
       * 添加组列表---filter添加的数据
       */
      filterAddGroupData(data){
        this.bigGroupData[this.currGroupIndex]["subGroup"] = this.bigGroupData[this.currGroupIndex]["subGroup"].concat(data);
        this.$emit("setGroupData",this.bigGroupData);
      },

      //通过get请求列表数据
      updateListData(responseData){
        let data = responseData.data;
        this.formateData(data);
      },



      /**
       * 添加分组
       * @param currGroupIndex {number}  当前组的索引
       */
      addGroup(currGroupIndex){
        this.currGroupIndex = currGroupIndex;
        this.operailityData = this.params;
        this.operailityData["groupIndexId"] = this.bigGroupData[currGroupIndex]["groupIndexId"];
        this.openModel("setGroup");
      },


      /**
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','add');
      },


      /**
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options){
        this[options+'Modal'] = true;
      },



    },
    watch:{
      bigGroupData(val){
        if(val.length>0){
          this.$emit("setGroupData",val);
        }
      }
    },
    created(){
      this.init();
    },
    mounted(){
    },
    components: {
      add
    }
  }
</script>
