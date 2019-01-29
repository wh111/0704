<template>
  <!-- 新建分析策略 -->
  <div>
    <el-form :inline="true" v-for="item in 1" :key="item" :model="formValidate" ref="formValidate" :rules="synthesizeStatistics">
      <el-form-item label="策略名称：" prop="title">
        <el-input v-model.trim="formValidate.title" placeholder="请输入" :maxlength="50"></el-input>
      </el-form-item>

      <fieldset>
        <legend style="font-size:16px">&nbsp;&nbsp;分析对象设置&nbsp;&nbsp;</legend>
        <el-form-item label="分析对象：">
          <el-radio-group v-model="formValidate.objType" @change="changeObjType">
            <el-radio v-for="(item,index) in typeOption" v-if="item.value !== ''" :label="item.value" :key="index">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <p></p>
        <el-form-item label="分析报告基本信息展示：">
          <el-checkbox-group v-model="viewContent">
            <el-checkbox label="培训专业"></el-checkbox>
            <el-checkbox label="年度"></el-checkbox>
            <el-checkbox label="培训年限"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="分析报告数据查询内容：">
          <el-checkbox-group v-model="queryContent">
            <el-checkbox label="培训专业"></el-checkbox>
            <el-checkbox label="年度"></el-checkbox>
            <el-checkbox label="培训年限"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

      </fieldset>
    </el-form>
      <fieldset style="margin-top:20px">
        <legend style="font-size:16px">&nbsp;&nbsp;分析数据来源&nbsp;&nbsp;</legend>
        <p align="right">
          <el-button size="small" type="info" @click="addScoreToTable">添加评价</el-button>
        </p>
        <el-table v-for="item in 1" :key="item" align="center" :context="self" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
          <el-table-column  class-name="valiTableStyle" label="名称" prop="activityId" show-overflow-tooltip>
            <template scope="scope">
              <el-form :inline="true" :model="scope.row" ref="formValidate" :rules="synthesizeStatistics">
                <el-form-item prop="activityId" label-width="0">
                  <el-select v-model="scope.row.activityId" placeholder="请选择" @change="getSelectDataInfo(scope.$index,scope.row.activityId)">
                    <el-option v-for="item in scoreSelectData" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="评价时间" prop="timeText" show-overflow-tooltip></el-table-column>
          <el-table-column label="评价人" prop="appraiser" show-overflow-tooltip>
            <!--<template scope="scope">-->
              <!--{{ scope.row.appraiser && scope.row.appraiser.split('=')[1] }}-->
            <!--</template>-->
          </el-table-column>
          <el-table-column label="被评价人" prop="evaluated" show-overflow-tooltip>
            <!--<template scope="scope">-->
              <!--{{ scope.row.evaluated && scope.row.evaluated.split('=')[1] }}-->
            <!--</template>-->
          </el-table-column>
          <el-table-column  class-name="valiTableStyle" label="权重" prop="weight">
            <template scope="scope">
              <el-form :inline="true" :model="scope.row" ref="formValidate" :rules="synthesizeStatistics">
                <el-form-item prop="weight" label-width="0">
                   <el-input v-model="scope.row.weight" :maxlength="3"></el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template scope="scope">
              <el-button size="small" type="danger" icon="close" @click="removeScoreToTable(scope.$index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </fieldset>

    <div style="margin-top:20px;" align="center">
      <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
  let Util;
  import {synthesizeStatistics} from '../../rules'
  import api from './api';
  import typeOption from './objTypeOption';
  export default {
    data() {
      return {
        synthesizeStatistics,
        typeOption,
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        viewContent: [], // 分析报告基本信息展示
        queryContent: [], // 分析报告数据查询内容
        //form表单bind数据
        formValidate: {
          "title": "",
          "objType": "ALL",
          "obj": "",
          "viewContent": "",
          "queryContent": "",
          "strategyResourceDtoList": [
            // {
            //   "activityId": 2,
            //   "weight": 1
            // },
            // {
            //   "activityId": 2,
            //   "weight": 3
            // }
          ]
        },
        // 表格
        self: this,
        tableData: [], // 表格数据
        scoreSelectData: [], // 评分项

        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '保存成功!',
          errorTitle: '保存失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
            url: api.add.path,
            method: api.add.method
          }
        },
      }
    },
    methods: {
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        let DtoList = [];
        let tag = true;
        if (!isSubmit) {
          this.errorMess('填写的数据有误，请修改！')
          return
        }
        if(!this.tableData.length){
          this.errorMess('至少需要一条评价！')
          return
        }
        this.tableData.map(item => {
          if (!item.activityId) {
            this.errorMess('还有未选择的评价！');
            tag = false;
            return
          }
          if (!(item.weight > 0 && item.weight < 101)) {
            this.errorMess('权重只能为1 - 100！');
            tag = false;
            return
          }
          DtoList.push({
            activityId: item.activityId,
            weight: item.weight
          })
        });
        if (!tag) {
          return;
        }
        if (!isLoadingFun) isLoadingFun = function () {};
        isLoadingFun(true);
        this.formValidate.viewContent = this.viewContent.join(',');
        this.formValidate.queryContent = this.queryContent.join(',');

        this.formValidate.strategyResourceDtoList = DtoList;
        this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
        this.ajax(this.addMessTitle,
          isLoadingFun)
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName){
        let flag = true;
        for(let i=0;i<this.$refs[formName].length;i++){
          this.$refs[formName][i].validate((valid) => {
            if (!valid) {
              flag= false;
            }
          });
        }

        return flag;
      },
      // 更换分析对象
      changeObjType() {
        this.getSelectData()
      },
      // 添加评价
      addScoreToTable() {
        if (!this.scoreSelectData.length) {
          this.errorMess('当前分析对象暂无评价可设置！');
          return;
        }
        this.tableData.push({
          weigth: '',
          activityId: '',
          appraiser: '',
          evaluated: '',
          timeText: '',
        })
      },
      // 删除评价
      removeScoreToTable(index) {
        this.tableData.splice(index, 1)
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', this.addMessTitle.type);
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
      // 根据分析对象获取对应的评分表
      getSelectData() {
        this.ajax({
          ajaxSuccess: res => {
            this.scoreSelectData = res.data;
            this.tableData = [];
            if (res.data.length && !this.tableData.length) {
              this.addScoreToTable()
            }
          },
          ajaxParams: {
            url: api.queryByAppraiserType.path,
            method: api.queryByAppraiserType.method,
            params: {
              appraiserType: this.formValidate.objType
            }
          }
        })
      },
      // 根据分析对象获取对应的评分表
      getDataBySelect() {
        this.ajax({
          ajaxSuccess: res => {},
          ajaxParams: {
            url: api.queryByAppraiserType.path,
            method: api.queryByAppraiserType.method,
            params: {
              appraiserType: this.formValidate.objType
            }
          }
        })
      },
      // 根据选择的评分表获取详细信息
      getSelectDataInfo(index, id) {
          if(id=='')return;
        this.ajax({
          ajaxSuccess: res => {
            this.tableData[index].appraiser =this.conductRole(res.data.appraiser,res.data,0) ; // 评价对象
            this.tableData[index].evaluated =this.conductRole(res.data.evaluated,res.data,1) ; // 评价对象
            this.tableData[index].timeText = this.getTimeText(res.data); // 评价时间
          },
          ajaxParams: {
            url: api.getActivity.path + id,
            method: api.getActivity.method,
            params: {
              id
            }
          }
        })
      },
      // 获取评价时间描述文本
      getTimeText({dateType,startDay,endDay,startDate,endDate}){
        let date='' ;
        switch (dateType){
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

      conductRole(data,item,index){
        if(item.relationship== 'NO'&&!data){
          return '所有人'
        }
        if(item.relationship== 'LOOP'){
          let tempArr=[['学生','老师'],['学生','科室'],['老师','学生']];
          return tempArr[item.loopType-1][index]
        }

        let tempArr=[]
        if(typeof data == 'string'){
          data=data.split(',')
          for(let i=0;i<data.length;i++){
            let temp=data[i].split('=');
            tempArr.push(temp[1]);
          }
        }
        return tempArr.join(' ; ');
      },
      /*
       * 组件初始化入口
       * */
      init() {
        Util = this.$util;
        this.getSelectData()
        //this.ajax(this.listMessTitle)
      },
    },
    created() {
      this.init()
    }
  }

</script>

<style>
  /* 新建分析策略 */

</style>
