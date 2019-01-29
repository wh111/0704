<!--第五步：预览-->
<template>
  <div>
    <el-form  label-width="200px">
      <el-row>
        <el-col :span="20" :offset="1">

            <el-form-item label="名称:">
              {{operailityData.name}}
            </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="10" :offset="1">

            <el-form-item label="类别:">
              {{operailityData.type}}
            </el-form-item>
        </el-col>
        <el-col :span="10">

            <el-form-item label="评价表:">
              {{operailityData.tempName}}
            </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="1">
            <el-form-item label="用途:">
              <el-input type="textarea" readonly v-model="operailityData.remark"></el-input>
            </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="1">
            <el-form-item label="评价人与被评价人关系:" label-width="200px">
              {{operailityData.relationship | relation}}
            </el-form-item>
        </el-col>

      </el-row>
      <el-row v-if="operailityData.relationship=='LOOP'">
        <el-col :span="20" :offset="1"  >
          <el-form-item  label-width="200px" label="评价人与被评价人:">
            <el-tag type="primary">{{operailityData.loopType | loopType}}
            </el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="operailityData.relationship!='LOOP'">
        <el-col :span="20" :offset="1">
          <el-form-item   v-if="operailityData.relationship=='NO'&&operailityData.appraiserType=='ALL'" label="评价人:">
            <el-tag type="primary">所有人</el-tag>
          </el-form-item>
          <el-form-item v-else label="评价人:">
            <el-tag
              v-for="item in operailityData.appraiser"
              :key="item.id"
              type="success"
              style="margin:0 5px">
              {{item.label}}
            </el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="operailityData.relationship!='LOOP'">
        <el-col :span="20" :offset="1">
          <el-form-item  label-width="200px" v-if="operailityData.relationship=='NO'&&operailityData.evaluatedType=='ALL'" label="被评价人:">
            <el-tag type="primary" >所有人</el-tag>
          </el-form-item>
          <el-form-item   v-else label="被评价人:" >
            <el-tag
              v-for="item in operailityData.evaluated"
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
              {{conductDateType(operailityData)}}
            </el-form-item>
        </el-col>

      </el-row>

      <el-row >
        <el-col :span="10"  :offset="10">
          <el-button  @click="$emit('last') ">上一步</el-button>
          <el-button  @click="success">完成</el-button>
        </el-col>

      </el-row>
    </el-form>
  </div>
</template>
<script >

  export default {

    props:['url','operailityData'],

    methods:{

      success(){
        let query = this.$util._.defaultsDeep({},this.operailityData);
        let appraiser = []
        for (let i=0;i<query.appraiser.length;i++){
          appraiser.push(query.appraiser[i].key+'='+query.appraiser[i].label)
        }
        let evaluated = []
        for (let i=0;i<query.evaluated.length;i++){
          evaluated.push(query.evaluated[i].key+'='+query.evaluated[i].label)
        }
          query.appraiser = appraiser.join(',');
          query.evaluated = evaluated.join(',');


        let addMessTitle={
          type:'edit',
          successTitle:'修改成功',
          errorTitle:'修改失败',
          ajaxSuccess:'ajaxSuccess',
          ajaxParams:{
            url:this.url.activityModify+this.operailityData.id,
            method:'put',
            data:query,
          }
        };
          this.ajax(addMessTitle)
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
