
<!--第四步设置评价时间-->

<template>
  <div ref="content">
    <el-form   inline label-width="100px" class="demo-ruleForm">
      <el-row >
        <el-col :span="22"  :offset="1">
          <el-form-item label="评价时间：" label-width="200px">
            <el-radio-group  v-model="formValidate.dateType">
              <el-form  ref="formValidate1" :model="date"  :rules="evaluationActivitySetDate" inline label-width="100px" class="demo-ruleForm">
               <div v-if="relationship=='LOOP'" style="height:50px;line-height: 40px">
                 <!--1-->
                 <el-radio label="1">出科前
                 <el-form-item prop="startDay">
                  <el-input v-model="date.startDay" style="width: 100px"></el-input>
                 </el-form-item>
                 天——后
                 <el-form-item prop="endDay">
                   <el-input v-model="date.endDay" style="width: 100px"></el-input>
                 </el-form-item>天 评价一次</el-radio>
               </div>
              </el-form >
              <!--2-->
              <el-form  ref="formValidate2" :model="date"  :rules="evaluationActivitySetDate" inline label-width="100px" class="demo-ruleForm">
                <div style="height:50px;line-height: 40px"><el-radio label="2">
                 每周
                 <el-form-item prop="startWeek">
                   <el-input v-model="date.startWeek" style="width: 100px"></el-input>
                 </el-form-item>
                 ——
                 <el-form-item prop="endWeek">
                  <el-input v-model="date.endWeek" style="width: 100px"></el-input>
                 </el-form-item>
                 评价一次
               </el-radio>
                </div>
              </el-form>
              <!--3-->
              <el-form  ref="formValidate3" :model="date"  :rules="evaluationActivitySetDate" inline label-width="100px" class="demo-ruleForm">
                <div style="height:50px;line-height: 40px"><el-radio label="3">
                 每月
                 <el-form-item prop="startMonth">
                   <el-input v-model="date.startMonth" style="width: 100px"></el-input>
                 </el-form-item>
                 ——
                 <el-form-item prop="endMonth">
                  <el-input v-model="date.endMonth" style="width: 100px"></el-input>
                 </el-form-item>
                 评价一次
               </el-radio>
                </div>
              </el-form>
              <!--4-->
              <el-form  ref="formValidate4" :model="formValidate"  :rules="evaluationActivitySetDate" inline label-width="100px" class="demo-ruleForm">
                <div style="height:50px;line-height: 35px"><el-radio label="4">
                  <el-form-item label-width="90px" prop="startDate" label="特定时间段:">
                    开始时间
                    <el-date-picker
                      v-model="formValidate.startDate"
                      type="date"
                      :editable="false"
                      placeholder="选择日期"
                      :picker-options="pickerOptions0"
                      @change="handleStartTime"
                    >
                    </el-date-picker>
                  </el-form-item>
                    结束时间
                    <el-form-item label-width="0" prop="endDate" >
                    <el-date-picker
                      v-model="formValidate.endDate"
                      align="right"
                      type="date"
                      :editable="false"
                      placeholder="选择日期"
                      :picker-options="pickerOptions1"
                      @change="handleEndTime">
                    </el-date-picker>
                  </el-form-item></el-radio>
                </div>
              </el-form>
              <!--&lt;!&ndash;5&ndash;&gt;-->
              <!--<div style="height:50px;line-height: 40px"><el-radio label="5">每天评价一次</el-radio></div>-->
              <!--<div style="height:50px;line-height: 40px"><el-radio label="6">每季度评价一次</el-radio></div>-->
              <!--&lt;!&ndash;6&ndash;&gt;-->
              <!--<div style="height:50px;line-height: 40px"><el-radio label="7">每半年评价一次</el-radio></div>-->
              <!--&lt;!&ndash;7&ndash;&gt;-->
              <!--<div style="height:50px;line-height: 40px"><el-radio label="8">每一年评价一次</el-radio></div>-->
              <!--8-->

            </el-radio-group>
          </el-form-item>
        </el-col>

      </el-row>
      </br>
      <el-row >
        <el-col :span="10"  :offset="9">
          <el-button  @click="$emit('last') ">上一步</el-button>
          <el-button  @click="relation">确认并继续</el-button>
        </el-col>

      </el-row>
    </el-form>
    <div>

      <!--<Modal-->
      <!--:mask-closable="false"-->
      <!--v-model="editTypeModal"-->
      <!--height="200"-->
      <!--title="对话框标题"-->
      <!--class-name="vertical-center-modal"-->
      <!--:width="1100">-->
      <!--&lt;!&ndash;<div slot="header"> &ndash;&gt;-->
      <!--&lt;!&ndash;</div>&ndash;&gt;-->
      <!--<modal-header slot="header" :content="editTypeId"></modal-header>-->
      <!--<edit-type v-if="editTypeModal"   @cancel="cancel" :url="url"  @editType="treeSubCallback" :operaility-data="treeOperailityData"></edit-type>-->
      <!--<div slot="footer"></div>-->
      <!--</Modal>-->
      <!---->



    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  /*---引入--新建-- */
  import {evaluationActivitySetDate} from '../../../rules'
  let Util=null;
  export default {
    props:['url','operailityData'],
    data() {
      return {
        evaluationActivitySetDate,
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        date:{
          startDay:'',
          endDay:'',
          startWeek:'',
          endWeek:'',
          startMonth:'',
          endMonth:'',
        },
        formValidate:{
          dateType:'2',      //评价时间   1 2 3 4 5 6 7 8
          startDay:''  ,    //该项的取值，因评价时间(dateType) 取值不同而不同. 前X天(int)、每周X(int)、每月X日(int)、开始时间YMD(date)
          endDay:'',        //该项的取值，因评价时间(dateType) 取值不同而不同. 后X天(int)、到周X(int)、到每月X日(int)、结束时间YMD(date)
          startDate:'' ,    //该项的取值，因评价时间(dateType) 取值不同而不同. 后X天(int)、到周X(int)、到每月X日(int)、结束时间YMD(date)
          endDate:'' ,      //该项的取值，因评价时间(dateType) 取值不同而不同. 后X天(int)、到周X(int)、到每月X日(int)、结束时间YMD(date)
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
        /*--按钮button--*/
        addId:{id:'add',title:'添加'},
        editId:{id:'edit',title:'修改'},
        viewId:{id:'view',title:'查看'},
        removeId:{id:'remove',title:'删除'},
        publishId:{id:'publishId',title:'发布'},
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateList',
          ajaxParams: {
            url: this.url.activityQuery,
            params: {},
          }
        },

      };

    },
    created(){
    },
    methods:{
      //初始化请求列表数据
      init(){
        Util = this.$util;
        //ajax请求参数设置
        this.myPages =  Util.pageInitPrams;

        this.queryQptions = {
          curPage: 1,pageSize: Util.pageInitPrams.pageSize
        }

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
        if(!data) return;
        this.tableData = data;
        this.totalCount = responseData.totalCount || 0;
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
      relation(){
//       更新基础数据
//       继续下一步
        let  index =  this.formValidate.dateType;
        let isSubmit = this.submitForm(`formValidate${index}`);

        if(isSubmit) {
          switch (this.formValidate.dateType) {
            case '1':
              this.formValidate.startDay = this.date.startDay;
              this.formValidate.endDay = this.date.endDay;
              break;
            case '2':
              if(this.date.startWeek>this.date.endWeek){
                this.errorMess('每周开始时间不能大于结束时间')
                return;
              }
              this.formValidate.startDay = this.date.startWeek;
              this.formValidate.endDay = this.date.endWeek;
              break;
            case '3':
              if(+this.date.startMonth>+this.date.endMonth){
                this.errorMess('每月开始时间不能大于结束时间');
                return;
              }
              this.formValidate.startDay = this.date.startMonth;
              this.formValidate.endDay = this.date.endMonth;
              break;
            case '4':
              this.formValidate.startDate = this.yearMonthData(this.formValidate.startDate);
              this.formValidate.endDate = this.yearMonthData(this.formValidate.endDate);
              break;
          }
          this.$emit('next',this.formValidate);
        }

      },


      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName){
        let flag = true;
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            flag = false;
          }
        });

        return flag;
      },
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
