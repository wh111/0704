<!--
****--@file     midtermExaminationNotice_view
****--@date     2018/8/9 20:16
****--@author   YC
****--@describe 中期考核通知-查看
-->
<template>
  <el-row>
    <el-form ref="formInline" label-width="100px">
      <el-row>
        <!--<el-col>-->
          <!--<el-form-item label="专业方向："  prop="majorCode">-->
            <!--{{ formInline.majorName }}-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col>
          <el-form-item label="导师：" >
            {{ formInline.teacherNames.replace(/,/g,'、') }}
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item label="学员：" >
            {{ formInline.userNames.replace(/,/g,'、') }}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="开放时间：">
            {{ formInline.examStartDate | formatDate('yyyy-MM-dd')}} - {{ formInline.examEndDate | formatDate('yyyy-MM-dd')}}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="通知内容：" prop="content" >
            {{ formInline.content }}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="发布状态：" >
            {{ (formInline.publishStatus || 'UNPUBLISH') | typeText }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-row>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'midtermExaminationNoticeView',
    props: ['operailityData'],
    data () {
      return {
        formInline: {
          majorName: '', // 专业名称
          majorCode: '', // 专业代码
          teacherIds: '', // 导师id字符串
          teacherNames: '', // 导师姓名字符串
          studentIds: '', // 学生id字符串
          userNames: '', // 学生姓名字符串
          examStartDate: '', // 结束时间
          examEndDate: '', // 开始时间
          content: '' // 通知内容
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.getViewData();
      },
      // 获取查看数据
      getViewData () {
        let opt = {
          ajaxSuccess: res => this.formInline = res.data,
          ajaxParams: {
            url: api.get.path + this.operailityData.id
          }
        };
        this.ajax(opt);
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  };

</script>
