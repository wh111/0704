<!---迁入迁出-->
<template>
  <div id="content" ref="content" class="modal in-and-out-content"  >
    <steps  v-if="isShowBuild"></steps>
    <el-form  v-if="isShowBuild" :model="formValidate" ref="formValidate" :rules="rules.buildingMessList" label-width="100px">
      <el-row >
        <el-col :span="2"  >
          <el-form-item  prop="title">
            <el-button @click="addAutoList" type="primary">自动安排</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="12" >
          <el-form-item  prop="name">
            <input class="hidden">
            <el-input   v-model="formValidate.name" placeholder="输入大楼名称搜索">
              <el-button @click="searchEvent"  slot="append"  icon="search"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div
      id="myTable"
      ref="myTable"
    >
      <div v-if="isShowBuild">
        <ul :style="{height:dynamicHt+'px'}">
          <li v-for="(item,index) in tableData" :key="index" class="build-list"><img src="../../../assets/ambuf/images/build.png" alt="大楼">
            <span class="pointer" style="width:166px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" v-text="item.name" @click="buildClick(item)"></span> </li>
        </ul>
        <div v-if="!tableData[0]">暂无数据</div>
      </div>


    </div>
    <div v-if="!isShowBuild" >
      <room-list :rules="rules" :parentDara="operailityData" @cancel="goBack"></room-list>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import url from '../app';
  //引入--验证--组件
  import rules from "../rules.js";
  /*引入房间列表*/
  import steps from '../dormitory_common/steps.vue'

  import roomList from './inAndOut_roomList.vue'
  //当前组件引入全局的util
  let Util=null;
  export default{
    data() {
      return {
        rules:rules,
        url:url,
        //查询表单
        formValidate: {
          name: '',       //大楼名称模糊检索
          sortby: '',//排序列
          order: ''     //升序、降序
        },
        isShowBuild:true,
        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        tableData: [],
        totalCount:0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:url.allBuild,
            params:{}
          }
        },
        /*--按钮button--*/
        addId:{id:'addId',title:'新建'},
        editId:{id:'editId',title:'修改'},
        removeId:{id:'removeId',title:'删除'},
        viewId:{id:'viewId',title:'查看'},

      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util;
        //ajax请求参数设置

        this.setTableData();
      },


      //所有房间自动安排
      addAutoList(){
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        let addAutoList={
            errorTitle:'自动安排失败!',
            ajaxSuccess:'addAutoListSuccess',
            ajaxError:'ajaxError',
            ajaxParams:{
            url:this.url.bedPersonAddAutoList,
              method:'post',
              data:{},
          }
        };
        this.ajax(addAutoList);

      },
      addAutoListSuccess(){
        this.successMess('自动安排成功')
      },


      //设置表格及分页的位置
      setTableDynHeight(){
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },

      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected(isOnly){
        let len = this.multipleSelection.length;
        let flag = true;
        if(len==0){
          this.showMess("请选择数据!");
          flag = false;
        }
        if(len>1 && isOnly){
          this.showMess("只能修改一条数据!")
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData(responseData){
        this.tableData = responseData.data
        this.totalCount = responseData.totalCount || 0;
      },
      setTableData(){
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.formValidate);
        this.ajax(this.listMessTitle);
      },

      //搜索监听回调
      searchEvent(isLoading){
        //        isLoading(true);
        let isSubmit = this.handleSubmit('formValidate');
        if(isSubmit){
          this.setTableData()
        }
      },


      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name){
        let flag =false
        this.$refs[name].validate((valid) => {
          if (valid) {
            flag =true;
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
        return flag
      },


      /*--点击--添加--按钮--*/
      add(){
        this.openModel("add");
      },
      /*--点击--修改--按钮--*/
      edit(data){
        this.operailityData = data;
        this.openModel("edit");
      },
      /*--点击--删除--按钮--*/
      remove(){
        if(!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('remove') ;
      },
      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(data){
        this.operailityData = data;
        this.openModel("show");
      },
      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer){
        this[targer+'Modal'] = false;
      },
      /*
       * 监听子组件通讯的方法
       * 作用:ajax请求成功回调,该监听方法在libs/util 中的混合模式下定义回调
       * @param targer string example:"add"、"edit"
       * @param targer string 提示返回的ajax回调返回的信息改信息在对应的子组件中定义
       * 例如:errorTitle、errorTitle
       *addMessTitle:{
       *    type:'add',
       *    successTitle:'添加成功!',
       *    errorTitle:'添加失败!',
       *    ajaxSuccess:'ajaxSuccess',
       *    ajaxError:'ajaxError',
       *    ajaxParams:{
       *      url:'/role/add',
       *      method:'post'
       *    }
       *    }
       * @param udata boolean 默认false  是否不需要刷新当前表格数据
       * */
      subCallback(target,title,updata){
        this.cancel(target);
        if(title){
          this.successMess(title);
        }
        if(!updata){
          this.setTableData();
        }
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options){
        this[options+'Modal'] = true;
      },


      //点击大楼事件
      buildClick(data){
        this.operailityData = data;
        this.isShowBuild = false;
      },


      //点击按钮返回到大楼列表
      goBack(){
        this.isShowBuild = true;
      },



    },
    created(){
      this.init();
    },
    mounted(){
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    components:{
      //当前组件引入的子组件
      roomList,steps
    }
  }
</script>
