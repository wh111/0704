<!----------------------------------
****--查看课程大纲
****--@date     2014-04-12
****--@author   gx
----------------------------------->
<template>
  <div>

    <el-form :model="formValidate"
             class="demo-form-inline" label-width="120px">
      <br/>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="学校名称：">
            {{formValidate.schoolName}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-form-item label="大纲名称：" prop="outlineName">
            {{formValidate.outlineName}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="教研室：" prop="outlineName">
            {{formValidate.researchSectionName}}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <br>
    <el-table
      align="center"
      :height="400"
      :data="tableData"
      tooltip-effect="dark"
      highlight-current-row
      max-height="500"
      style="width: 100%;height: 100%">
      <el-table-column
        align="center"
        label="序号"
        type="index"
        width="75">
      </el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        prop="courseName"
        class-name="valiTableStyle"
        label="课程"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        prop="depName"
        class-name="valiTableStyle"
        label="授课科室"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        prop="courseType"
        class-name="valiTableStyle"
        label="类型">
      </el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        prop="courseTime"
        class-name="valiTableStyle"
        label="课时数">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //引入当前组件字典api
  import api from '../api.js';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data () {
      return {
        formValidate: {
          'outlineId': '',
          'schoolId': '',
          'schoolName': '',
          'outlineName': '',
          'researchSectionId': '',
          'outlineState': '',
          'schoolOutlineDetailDtoList': [
            {
              'outlineDetailId': '',
              'outlineId': '',
              'courseName': '',
              'depId': '',
              'depName': '',
              'courseType': '',
              'courseTime': ''
            }
          ]
        },
        tableData: [],
        //获取单个教学大纲
        getMainTitle: {
          ajaxSuccess: 'getMainData',
          ajaxParams: {
            url: api.OutlineGetAlll.path,
            params: {
              outlineId: this.operailityData && this.operailityData.outlineId,
            }
          }
        },

      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        this.ajax(this.getMainTitle);
      },

      //获取初始化数据成功
      getMainData (res) {
        let data = res.data;
        this.formValidate = data;
        this.tableData = data.schoolOutlineDetailDtoList;
      },
    },
    computed: {},
    created () {
      this.init();
    },
    watch: {},
    mounted () {},
    components: {}
  }
</script>
