<!--第五步：预览-->
<template>
  <div>
    <el-form  label-width="200px">
      <el-row>
        <el-col :span="20" :offset="1">

          <el-form-item label="名称:">
            {{formValidate.name}}
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="10" :offset="1">

          <el-form-item label="类别:">
            {{formValidate.type}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="评价表:">
            {{formValidate.tempName}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="1">
          <el-form-item label="类别:">
            <el-input type="textarea" readonly v-model="formValidate.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="1">
          <el-form-item label="评价人与被评价人关系:" label-width="200px">
            {{formValidate.relationship | relation}}
          </el-form-item>
        </el-col>

      </el-row>
      <el-row v-if="formValidate.relationship=='LOOP'">
        <el-col :span="20" :offset="1"  >
          <el-form-item  label-width="200px" label="评价人与被评价人:">
            <el-tag type="primary">{{formValidate.loopType | loopType}}
            </el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="formValidate.relationship!='LOOP'">
        <el-col :span="20" :offset="1">
          <el-form-item v-if="formValidate.relationship=='NO' && formValidate.appraiserType=='ALL'" label="评价人:">
            <el-tag type="primary">所有人</el-tag>
          </el-form-item>
          <el-form-item v-else label="评价人:">
            <el-tag
              v-for="item in formValidate.appraiser"
              :key="item.id"
              type="success"
              style="margin:0 5px">
              {{item.label}}
            </el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="formValidate.relationship!='LOOP'">
        <el-col :span="20" :offset="1">
          <el-form-item v-if="formValidate.relationship=='NO'&&formValidate.evaluatedType=='ALL'" label="被评价人:">
            <el-tag type="primary" >所有人</el-tag>
          </el-form-item>
          <el-form-item v-else label="被评价人:" >
            <el-tag
              v-for="item in formValidate.evaluated"
              :key="item.id"
              type="success"
              style="margin:0 5px"
            >
              {{item.label}}
            </el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="1">
          <el-form-item label="评价时间:">
            {{conductDateType(formValidate)}}
          </el-form-item>
        </el-col>

      </el-row>

    </el-form>
  </div>
</template>
<script >
  export default {
    props:['url','operailityData'],
    data(){
      return {

        formValidate:{
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
        listMessTitle: {
          ajaxSuccess: 'updateList',
          ajaxParams: {
            url: this.url.activityGet+this.operailityData.id,
            params: {},
          }
        },
      }
    },
    created(){
        this.setTableData()

    },
    methods:{
      setTableData(){
        this.ajax(this.listMessTitle);
      },
      updateList(responseData){
        let data = responseData.data;
        if(!data)return;
        data.appraiser=this.conductRelationship(data.appraiser);
        data.evaluated=this.conductRelationship(data.evaluated);
        this.formValidate = data;
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
      //列表的评价时间处理
      conductDateType({dateType,startDay,endDay,startDate,endDate}){
        let date='' ;
        switch (+dateType){
          case 1:date = `出科前${startDay}天——后${endDay}天评价一次`;
            break;
          case 2:date = `每周${startDay}——周${endDay}评价一次`;
            break;
          case 3:date = `每月${startDay}日——${endDay}日评价一次`;
            break;
          case 4:date = `${startDate}~${endDate}`;
            break;
          case 5:date = `每天评价一次`;
            break;
          case 6:date = `每季度评价一次`;
            break;
          case 7:date = `每半年评价一次`;
            break;
          case 8:date = `每年评价一次`;
            break;
        }
        return date;
      },
    },
  }

</script>
