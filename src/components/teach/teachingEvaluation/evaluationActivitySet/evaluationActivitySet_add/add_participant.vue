
<!--第三步选择参与人-->

<template>
  <div ref="content">
    <el-form  ref="formValidate"  label-width="100px" class="demo-ruleForm">
      <!--无直接关系-->
      <el-row v-if="relationship=='NO'">
        <el-col :span="20"  :offset="1">
          <fieldset class="layui-elem-field">
            <legend>评价人</legend>

            <div class="layui-field-box">
              <el-radio-group v-model="formValidate.appraiserType">
                <!--<el-radio label="ALL">所有人</el-radio>-->
                <el-radio label="PART">部分人</el-radio>
                <el-radio label="ROLE">指定角色</el-radio>
              </el-radio-group>
              </br>
              </br>
              <hr>
              </br>
              <!--评价人选择人员-->
              <div v-if="formValidate.appraiserType=='PART'">
                <div>
                  <el-button  type="primary" @click="appraiserPartPerson">按人员选择</el-button>
                </div>
                </br>

                <hr>
                </br>
                <div>
                  <el-tag
                    :key="index"
                    v-for="(item,index) in formValidate.appraiserPart"
                    :closable="true"
                    :close-transition="false"
                    type="success"
                    @close="appraiserPartClose(index)"
                    style="margin: 0 5px;"
                  >
                  {{item.label}}
                  </el-tag>
                </div>
              </div>
                  <!--评价人选择角色-->
               <div v-if="formValidate.appraiserType=='ROLE'">
                 <el-select
                   multiple
                   style="width: 100%"
                   allow-create
                   @change="setAppraiserRole"

                   v-model="appraiserRole"
                   placeholder="请选择角色">
                   <el-option
                     v-for="item in optionData"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
                   </el-option>
                 </el-select>
              </div>
          </div>
          </fieldset>
          </br>
          <fieldset class="layui-elem-field">
            <legend>被评价人</legend>
            <div class="layui-field-box">
              <el-radio-group v-model="formValidate.evaluatedType">
                <!--<el-radio label="ALL">所有人</el-radio>-->
                <el-radio label="PART">部分人</el-radio>
                <el-radio label="ROLE">指定角色</el-radio>
              </el-radio-group>
              </br>
              </br>
              <hr>
              </br>
              <!--被评价人选择人员-->
              <div v-if="formValidate.evaluatedType=='PART'">
                <div>
                  <el-button  type="primary" @click="evaluatedPartPerson">按人员选择</el-button>
                </div>
                </br>
                <hr>
                </br>
                <div>
                  <el-tag
                    :key="index"
                    v-for="(item,index) in formValidate.evaluatedPart"
                    :closable="true"
                    :close-transition="false"
                    type="success"
                    @close="evaluatedPartClose(index)"
                    style="margin: 0 5px;">
                    {{item.label}}
                  </el-tag>
                </div>
              </div>

              <!--被评价人选择角色-->
              <div v-if="formValidate.evaluatedType=='ROLE'">
                <el-select
                  multiple
                  style="width: 100%"
                  allow-create
                  v-model="evaluatedRole"
                  @change="setEvaluatedRole"
                  placeholder="请选择角色">
                  <el-option
                    v-for="item in optionData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
          </fieldset>
        </el-col>
      </el-row>
      <!--有轮转关系-->
      <el-row v-if="relationship=='LOOP'">
        <el-col :span="20"  :offset="3">
            <el-radio-group v-model="formValidate.loopType">
              <div style="height:50px;line-height: 50px"><el-radio label="1">学生评价老师</el-radio></div>
              <div style="height:50px;line-height: 50px"><el-radio label="2">学生评价科室</el-radio></div>
              <div style="height:50px;line-height: 50px"><el-radio label="3">老师评价学生</el-radio></div>
            </el-radio-group>
        </el-col>
      </el-row>
      <!--本部门或本科室（同一个组织架构）-->
      <el-row v-if="relationship=='DEPT'">
        <el-col :span="20"  :offset="1">
          <fieldset class="layui-elem-field">
            <legend>评价人与被评价人</legend>
            <div class="layui-field-box" style="height: 300px">
              <left-tree @tree-click="appraiserTree" @setCurrSltNodeId="appraiserCurrSltNodeId" :treeOptions="treeOptions"> </left-tree>
            </div>
            <!--<el-input v-model=""></el-input>-->
          </fieldset>
          <br>
          <!--<fieldset class="layui-elem-field">-->
            <!--<legend>被评价人</legend>-->
            <!--<div class="layui-field-box" style="height: 300px">-->
              <!--<left-tree @tree-click="evaluatedTree" @setCurrSltNodeId="evaluatedCurrSltNodeId" :treeOptions="treeOptions"> </left-tree>-->
            <!--</div>-->
          <!--</fieldset>-->
        </el-col>
      </el-row>
      <br>
      <el-row >
        <el-col :span="10"  :offset="9">
          <el-button  @click="$emit('last') ">上一步</el-button>
          <el-button  @click="participant">确认并继续</el-button>
        </el-col>

      </el-row>
    </el-form>
    <div>

      <Modal
      v-model="appraiserPartModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="1100">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="selectUserId"></modal-header>
      <select-user v-if="appraiserPartModal"   @cancel="cancel('appraiserPart')" :unSelect="unSelect.appraiser"   @setUsers="setAppraiserPart" :initUser="formValidate.appraiserPart"></select-user>
      <div slot="footer"></div>
      </Modal>

      <Modal
      v-model="evaluatedPartModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="1100">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="selectUserId"></modal-header>
      <select-user v-if="evaluatedPartModal"    @cancel="cancel('evaluatedPart')"   @setUsers="setEvaluatedPart" :unSelect="unSelect.evaluated"  :initUser="formValidate.evaluatedPart"></select-user>
      <div slot="footer"></div>
      </Modal>




    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  /*---引入--新建-- */

  let Util=null;
  export default {
    props:['url','operailityData'],
    data() {
      return {
        treeOptions:{
          url:'/hospital/dept/list'
        },
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        unSelect:{//评价人和被评价人人员 不能重复 ，过滤
          appraiser:[],
          evaluated:[],
        },
        person :{  //选择人员
          appraiserPart:[],   //
          evaluatedPart:[],   //
        },
        appraiserRole:[],
        evaluatedRole:[],
        formValidate:{
          loopType:this.operailityData.loopType,                                       //轮转相关LOOP 值为：1学生评价老师,2学生评价科室,3老师评价学生
          appraiserType:this.operailityData.appraiserType,   //评价对象类型 值为：所有人ALL、部分人PART、指定角色ROLE、科室DEPT
          appraiser:'',                                      //评价对象 根据 评价对象类型 所选不同，该项取值不同.
          appraiserPart:[],                                  //部分人PART评价对象 ，如：1000=张三,1000=张三 或 100=住院医,101=教学秘书 或 12=角色A,13=角色B
          appraiserRole:[],                                  //指定角色ROLE评价对象 ，如：1000=张三,1000=张三 或 100=住院医,101=教学秘书 或 12=角色A,13=角色B
          appraiserDept:[],                                  //科室DEPT评价对象(本部门或本科室) ，如：1000=张三,1000=张三 或 100=住院医,101=教学秘书 或 12=角色A,13=角色B
          evaluatedType:this.operailityData.evaluatedType,   //被评价对象类型 ，值为：所有人ALL、部分人PART、指定角色ROLE、科室DEPT
          appraiserCount:'',                                 //评价人总数
          evaluated:'',                                      //被评对象 根据 被评对象类型 所选不同，该项取值不同.
          evaluatedPart:[],                                  //部分人PART被评对象 ，，如：1000=张三,1000=张三 或 100=住院医,101=教学秘书 或 12=角色A,13=角色B
          evaluatedRole:[],                                  //指定角色ROLE被评对象 ，，如：1000=张三,1000=张三 或 100=住院医,101=教学秘书 或 12=角色A,13=角色B
          evaluatedDept:[],                                  //科室DEPT被评对象(本部门或本科室) ，，如：1000=张三,1000=张三 或 100=住院医,101=教学秘书 或 12=角色A,13=角色B
          evaluatedCount:"",                                 //被评价人总数
          counts:"",                                         //已评价人总数
        },
        //查询项
        /*--按钮button--*/
        //表格数据
        loading:false,
        tableData: [],
        selectTreeData:[],
        dynamicHt:100,
        totalCount:0,
        multipleSelection: [],

        publishModal:false,
        appraiserPartModal:false,
        evaluatedPartModal:false,
        /*--按钮button--*/
        optionData:[],
        addId:{id:'add',title:'添加'},
        editId:{id:'edit',title:'修改'},
        viewId:{id:'view',title:'查看'},
        removeId:{id:'remove',title:'删除'},
        selectUserId:{id:'selectUserId',title:'选择人员'},
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateList',
          ajaxParams: {
            url: '/role/list?name=&identify=&type=',
            params: {},
          }
        },

      };

    },
    created(){
        this.ajax(this.listMessTitle)
    },
    methods:{
      //初始化请求列表数据
      init(){
        Util = this.$util;
        //ajax请求参数设置
        this.myPages =  Util.pageInitPrams;

      },

      //点击查询按钮调用
      onSubmitSearch() {
//        console.log(this.getFormData(this.formSearch))
        //查询成功后 this.setTableData()
      },
      //表格数据
      //设置表格及分页的位置
      setTableDynHeight(){
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },

      //搜索监听回调
      searchEvent(isLoading){
        //        isLoading(true);
        let isSubmit = this.handleSubmit('formValidate');
        if(isSubmit){
//          this.setTableData()
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
        return flag;
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
      /*
       * 更新列表数据
       * @param JSON 后台返回的data
       */
      updateList(responseData){

        let data = responseData.data;
        this.optionData = data;
      },

      /*
       * 点击--修改角色--按钮
       * @param index string|number  当前行索引
       * */
      edit(data){
        this.operailityData = data;
        this.openModel('edit')
      },
      /*--点击--查看--按钮--*/
      show(data){
        this.operailityData = data;
        this.openModel('show');

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
//          this.setTableData();
        }
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



      /*
       *
       * */
      participant(){
//       更新基础数据
//       继续下一步
        if(this.relationship=='NO'){
          if(this.formValidate.appraiserType=='ALL'){
            this.formValidate.appraiser = [];
          }else if(this.formValidate.appraiserType == 'PART'){//类型为部分人
          if(this.formValidate.appraiserPart==0){
            this.errorMess('请选择评价人');
            return;
          }
            this.formValidate.appraiser=this.formValidate.appraiserPart;
          }else if(this.formValidate.appraiserType == 'ROLE') {//类型为指定角色
            if(this.formValidate.appraiserRole==0){
              this.errorMess('请选择评价人');
              return;
            }
            this.formValidate.appraiser=this.formValidate.appraiserRole;
          }

          if(this.formValidate.evaluatedType=='ALL'){
            this.formValidate.evaluated = [];
          }else if(this.formValidate.evaluatedType == 'PART'){//类型为部分人
            if(this.formValidate.evaluatedPart==0){
              this.errorMess('请选择被评价人');
              return;
            }
            this.formValidate.evaluated=this.formValidate.evaluatedPart;
          }else if(this.formValidate.evaluatedType == 'ROLE') {//类型为指定角色
            if(this.formValidate.evaluatedRole==0){
              this.errorMess('请选择被评价人');
              return;
            }
            this.formValidate.evaluated=this.formValidate.evaluatedRole;
          }

          if(this.formValidate.appraiserType=='PART'&&this.formValidate.evaluatedType == 'PART'){ //当评价人和被贫家人为部分人时
            this.setEvaluatedUnSelect(); //设置评价人的id
            this.setAppraiserUnSelect();//设置被评价人过滤的id
            let flag = false;
            this.unSelect.appraiser.map(item=>{
              if(this.unSelect.evaluated.includes(item)){
                flag = true;
              }
            })
            if(flag){
              this.errorMess('评价人和被评价人 人员重复');
              return;
            }
          }

        }else if(this.relationship=='DEPT'){

          this.formValidate.appraiser = this.formValidate.appraiserDept;
          this.formValidate.evaluated = this.formValidate.appraiserDept;
//          this.formValidate.evaluated = this.formValidate.evaluatedDept;

        } else{
          this.formValidate.appraiser = [];
          this.formValidate.evaluated=[];
        }

        this.$emit('next',this.formValidate);

      },


      //删除选中的人员
      appraiserPartClose(index){
        this.formValidate.appraiserPart.splice(index,1);
      },

      //评价人 选择人员
      appraiserPartPerson(){
        this.setAppraiserUnSelect();
        this.openModel('appraiserPart');
      },

      //设置评价人需要过滤的id
      setAppraiserUnSelect(){
        let unSelect = [];
        this.formValidate.evaluatedPart.map(item=>{
          unSelect.push(+item.key);
        })
        this.unSelect.appraiser = unSelect;
      },

      setAppraiserPart(userList){
        this.formValidate.appraiserPart = userList;
        this.cancel('appraiserPart')
      },


      //删除选中的被评价人员选中的人员
      evaluatedPartClose(index){
        this.formValidate.evaluatedPart.splice(index,1);
      },

      //被评价人员 选择人员
      evaluatedPartPerson(){
        this.setEvaluatedUnSelect();
        this.openModel('evaluatedPart');
      },

      //设置被评价人需要过滤的id
      setEvaluatedUnSelect(){
        let unSelect = []
        this.formValidate.appraiserPart.map(item=>{
          unSelect.push(+item.key);
        })
        this.unSelect.evaluated = unSelect;
      },

      //设置选中被评价人员
      setEvaluatedPart(userList){

        this.formValidate.evaluatedPart = userList;
        this.cancel('evaluatedPart')
      },

      //评价人默认选中的节点node
      appraiserCurrSltNodeId(id,sltedTreeData){
          this.formValidate.appraiserDept= [{key:id,label:sltedTreeData.name}];
      },

      //评价人点击选择的树节点
      appraiserTree(obj, node, self, isLeaf){
        this.formValidate.appraiserDept=[{key:obj.id,label:obj.name}];

      },
      //被评价人点击选择的树节点
      evaluatedTree(obj, node, self, isLeaf){
          this.formValidate.evaluatedDept=[{key:obj.id,label:obj.name}];

      },

      //被评价人默认选中的节点node
      evaluatedCurrSltNodeId(id,sltedTreeData){
        this.formValidate.evaluatedDept= [{key:id,label:sltedTreeData.name}];

      },

      //设置被评价人角色
      setEvaluatedRole(val){
          let tempArr=[];
          for(let i=0;i<this.optionData.length;i++){
              if(val.includes(this.optionData[i].id)){
                  tempArr.push({
                    key:this.optionData[i].id,
                    label:this.optionData[i].name
                  })
              }
          }
        this.formValidate.evaluatedRole=tempArr;

      },

      //设置评价人角色
      setAppraiserRole(val){
        let tempArr=[];
        for(let i=0;i<this.optionData.length;i++){
          if(val.includes(this.optionData[i].id)){
            tempArr.push({
              key:this.optionData[i].id,
              label:this.optionData[i].name
            })
          }
        }
        this.formValidate.appraiserRole=tempArr;
      }
    },
    mounted(){

    },
    components:{
    },
    computed:{
      relationship(){
        return this.operailityData.relationship;
      }
    }
  };
</script>
