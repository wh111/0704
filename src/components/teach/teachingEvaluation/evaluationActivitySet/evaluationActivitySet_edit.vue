<!--新建评价-->
<template>
  <div ref="content">
    <el-row >
      <el-col :span="20"  :offset="1">
        <el-steps :space="200" :active="active" finish-status="success">
          <el-step title="第一步：填写基本信息">

          </el-step>
          <el-step title="第二步：设置评价关系"></el-step>
          <el-step title="第三步：选择参与人"></el-step>
          <el-step title="第四步：设置评价时间"></el-step>
          <el-step title="第五步：预览"></el-step>
        </el-steps>

      </el-col>

    </el-row>
    </br>
    <hr>
    </br>
    <!--第一步：填写基本信息-->
    <base-info  v-show="active==0" :url="url" @next="next" :operaility-data="formValidate" :update="update"> </base-info>

    <!--第二步：设置评价关系-->
    <relation v-if="count>=1"    v-show="active==1" :url="url" @next="next" @last="last" :operaility-data="formValidate"></relation>

    <!--第三步选择参与人-->
    <participant  v-if="count>=2"    v-show="active==2" :url="url" @next="next" @last="last" :appraiserRole="appraiserRole" :evaluatedRole="evaluatedRole" :operaility-data="formValidate"></participant>

    <!--第四步设置评价时间-->
    <date  v-if="count>=3"   v-show="active==3" :url="url" @next="next" @last="last" :operaility-data="formValidate"></date>

    <!--第五步预览-->
    <show v-if="count>=4"   v-show="active==4" @edit="editCallBack" :url="url" @next="next" @last="last" :operaility-data="formValidate"></show>


  </div>
</template>
<script>
  /*当前组件必要引入*/
  import url from '../app'
  /*---引入基本信息-----*/
  import baseInfo from  './evaluationActivitySet_edit/edit_baseInfo.vue'
  /*---引入设置评价关系-----*/
  import relation from  './evaluationActivitySet_edit/edit_relation.vue'
  /*---引入选择参与人-----*/
  import participant from  './evaluationActivitySet_edit/edit_participant.vue'
  /*---引入设置时间-----*/
  import date from  './evaluationActivitySet_edit/edit_date.vue'
  /*---引入预览-----*/
  import show from  './evaluationActivitySet_edit/edit_view.vue'
  let Util=null;
  export default {
      props:['operailityData'],
    data() {
      return {
          url:url,
        update:0,
        active:0,
        count:0,
        appraiserRole:[],
        evaluatedRole:[],
        formValidate:{
          id:'',
          name:'',                //名称
          type:'',                //类别
          tempId:'',              //评价表ID
          tempName:"",
          remark:'',              //用途
          relationship:'',      //评价人与被评价对象关系
          loopType:'',            //轮转关系   当 评价人与被评价对象关系 选择 轮转关系(LOOP)时，该项必填。
          appraiserType:'',       //评价对象类型 当 评价人与被评价对象关系 选择 无直接关系(NO) 或者 本部门或本科室(DEPT) 时，该项必填。
          appraiser:'',           //评价对象 根据 评价对象类型 所选不同，该项取值不同.
          appraiserPart:[],       //部分人PART评价对象 ，如：1000=张三,1000=张三 或 100=住院医,101=教学秘书 或 12=角色A,13=角色B
          appraiserRole:[],       //指定角色ROLE评价对象 ，如：1000=张三,1000=张三 或 100=住院医,101=教学秘书 或 12=角色A,13=角色B
          appraiserDept:[],       //科室DEPT评价对象(本部门或本科室) ，如：1000=张三,1000=张三 或 100=住院医,101=教学秘书 或 12=角色A,13=角色B
          curAppraiserDept:[],
          evaluatedType:'',       //被评对象类型 当 评价人与被评价对象关系 选择 无直接关系(NO) 或者 本部门或本科室(DEPT) 时，该项必填。
          evaluated:'',           //被评对象 根据 被评对象类型 所选不同，该项取值不同.
          evaluatedPart:[],       //部分人PART被评对象 ，，如：1000=张三,1000=张三 或 100=住院医,101=教学秘书 或 12=角色A,13=角色B
          evaluatedRole:[],       //指定角色ROLE被评对象 ，，如：1000=张三,1000=张三 或 100=住院医,101=教学秘书 或 12=角色A,13=角色B
          evaluatedDept:[],       //科室DEPT被评对象(本部门或本科室) ，，如：1000=张三,1000=张三 或 100=住院医,101=教学秘书 或 12=角色A,13=角色B
          dateType:'',            //评价时间
          curEvaluatedDept:[],
          startDay:'',            //
          endDay:'',              //
          startDate:'',           //开始时间（yyyy-MM-dd）
          endDate:'',             //截止时间（yyyy-MM-dd）
        },
        //查询项
        /*--按钮button--*/
        //表格数据

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
            url: url.activityGet+this.operailityData.id,
            params: {},
          }
        },

      };

    },
    created(){
          this.setTableData();
    },
    methods:{

      //点击查询按钮调用
      onSubmitSearch() {
//        console.log(this.getFormData(this.formSearch))
        //查询成功后 this.setTableData()
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
        let flag =false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            flag =true;
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
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

        if(data.relationship=='NO'){
          if(data.appraiserType == 'PART'){//类型为部分人
            data.appraiserPart=this.conductRelationship(data.appraiser);
          }else if(data.appraiserType == 'ROLE') {//类型为指定角色
            data.appraiserRole=this.conductRelationship(data.appraiser);
            this.appraiserRole=this.conductRole(data.appraiser);
          }

          if(data.evaluatedType == 'PART'){//类型为部分人
            data.evaluatedPart=this.conductRelationship(data.evaluated);
          }else if(data.evaluatedType == 'ROLE') {//类型为指定角色
            data.evaluatedRole=this.conductRelationship(data.evaluated);
            this.evaluatedRole=this.conductRole(data.evaluated);
          }
        }

        if(data.relationship=='DEPT'){
          data.appraiserDept=this.conductRelationship(data.appraiser);

          data.curAppraiserDept = this.conductRole(data.appraiser).join(',');
          data.evaluatedDept=this.conductRelationship(data.evaluated);
          data.curEvaluatedDept=this.conductRole(data.evaluated).join(',');
        }
        this.update++;
        let undefined;
        for (let i=0 ;i<data.length;i++){
            if(data[i]==undefined){
              data[i] = '';
            }
        }
        this.formValidate = this.getFormValidate(this.formValidate,data);
      },

      conductRole(data){
          let tempArr=[]
        if(typeof data == 'string'){
          data=data.split(',')
          for(let i=0;i<data.length;i++){
            let temp=data[i].split('=');
            tempArr.push(temp[0]);
          }
        }
        return tempArr;
      },
      //类型不同，做不同处理
      conductRelationship(data){
          if(typeof data == 'string'){
              data=data.split(',')
            for(let i=0;i<data.length;i++){
                  let temp=data[i].split('=');
              data[i]={
                  key:temp[0],
                  label:temp[1],
              }
            }
          }
          return data;

      },
      setTableData(){
        this.ajax(this.listMessTitle);
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


      //下一步next
      next(data){
          if(data)this.formValidate = Object.assign(this.formValidate,data);
          if(this.active == 4) return;
          this.active++;
          if(this.count<this.active){
            this.count=this.active;
          }

      },

      last(){
          if(this.active==0) return;
        this.active--
      },


      editCallBack(type,tag){
          this.$emit(type,type,tag);
      },

    },
    mounted(){
    },
    components:{
      baseInfo,relation,participant,date,show
    }
  };
</script>
