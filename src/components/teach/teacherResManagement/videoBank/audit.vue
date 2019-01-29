<!----------------------------------
****--批量审核-病历库(audit)
****--@date     2017/8/4
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
    <div>
      <el-form :model="formValidate" ref="formValidate" label-width="90px">

        <el-row>
          <el-col :span="8" :offset="4">
            <el-form-item label="审核结果:" prop="disState" >
              <el-radio-group v-model="formValidate.auditStatus">
                <el-radio class="radio"  label="AUDIT_SUCCESS">通过</el-radio>
                <el-radio class="radio"  label="AUDIT_FAILURE">未通过</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

        <!--<el-col :span="8" :offset="2">-->
          <!--<el-form-item label="资源分类:" >-->
            <!--<el-input v-model="type.typeName" @focus="typeClick" readonly></el-input>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        </el-row>

        <el-row >
          <el-col :span="16" :offset="4">
            <el-form-item label="审核意见:" prop="reason">
              <el-input v-model="formValidate.reason" type="textarea" resize="none" :rows="8"></el-input>
            </el-form-item>
          </el-col>
        </el-row >

      </el-form>
      <el-row >
        <el-col :span="16" :offset="2">
          <div style="margin-left: 100px">
            <load-btn @listenSubEvent="listenSubEvent" :btnData="saveBtn"></load-btn>
            <el-button  @click="cancel">取消</el-button>
          </div>
        </el-col>
      </el-row >
      <!--增加弹窗-->
      <Modal
        :mask-closable="false"
        v-model="typeModal"
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
          </br>
          <el-row>
            <el-col :span="16" :offset="2">
              <div style="margin-left: 100px">
                <load-btn @listenSubEvent="treeSubEvent" :btnData="treeBtn"></load-btn>
                <el-button @click="typeModal = false">取消</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div slot="footer"></div>
      </Modal>


    </div>
</template>
<script>
    /*当前组件必要引入*/

    //当前组件引入全局的util
    let Util = null;
    export default{
      props:['fromWhereTree','url','operailityData','id','url'],
        data() {
            return {
              saveBtn:{title:'提交',callParEvent:'listenSubEvent'}, //保存
              treeBtn:{title:'保存',callParEvent:'listenSubEvent'},

              type:{
                typeName:this.name,   //资源分类名称
                updateTypeName:this.name,    //随时更新的资源分类名称
              },

              viewTypes: '', // 视图类型
              //tree默认项设置
              treeDefaults: {
//          getTreeUrl: api.resourceTypeTree.path,
                getDataUrl: '',
                isShowMenus: false,
                isShowSearch: false, //是否显示目录树查询
              },
              formValidate:{
                auditStatus:'AUDIT_SUCCESS',  //审核结果
                reason:'',                    //审核意见
              },

              typeId:{
                id:'typeId',
                title:'资源分类'
              },

              typeModal:false,
              //当前组件提交(add)数据时,ajax处理的 基础信息设置
              addMessTitle: {
                type: 'audit',
                successTitle: '审核成功!',
                errorTitle: '审核失败!',
                ajaxSuccess: 'ajaxSuccess',
                ajaxError: 'ajaxError',
                ajaxParams: {
                  url: this.url.audit.path,
                  method: this.url.audit.method,
                  data: {

                  },
                }
              },



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
            isLoadingFun(true);
            let formValidate = this.getFormData(this.formValidate);
            let ids = [];
            for(let i=0 ;i<this.operailityData.length;i++){
              ids.push(this.operailityData[i].id)
            }
            this.addMessTitle.ajaxParams.url = this.url.audit.path+ids.join(',');
            this.addMessTitle.ajaxParams.data = formValidate;
            this.ajax(this.addMessTitle,isLoadingFun)
          },
          //点击分类
          typeClick(){
            this.typeModal = true;
          },
          /*
           * 获取表单数据
           * @return string  格式:id=0&name=aa
           * */
          getFormData(data) {
            let myData = this.$util._.defaultsDeep({}, data);
            return myData;
          },
          //点击数的回调函数
          treeSubEvent(){

            this.type.typeName = this.type.updateTypeName;
            this.typeModal = false;
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
            this.viewTypes = obj.types;
            this.setTreeDepId(obj.id,obj);
          },


          /*
           * 设置当前部门Id
           * */
          setTreeDepId(id,obj) {
            if (id) {
              this.deptId = id;
              this.type.updateTypeName = obj.name;
            }
          },
          /*
           * 当前组件发送事件给父组件
           * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
           * */
          cancel(){
            this.$emit('cancel',this.addMessTitle.type);
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
