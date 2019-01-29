<template>

  <div>
    <el-form :model="formValidate" ref="formValidate" class="demo-form-inline" label-width="90px">

      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="标题:" prop="title">
            {{formValidate.title}}
            <!--<el-input v-model="formValidate.title" placeholder="请输入"></el-input>-->
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="研究生:" prop="graduateName">
            <el-tag
              v-for="(tag,index) in graduateName"
              :key="index"
              style="margin: 0 5px"
              type="success">
              {{tag}}
            </el-tag>
            <!--<el-button  size="small" type="primary" icon="plus" @click="graduateClick"></el-button>-->
          </el-form-item>
        </el-col>
      </el-row>

      <!--<el-row >-->
      <!--<el-col :span="8"  :offset="2">-->
      <!--<el-form-item label="开题时间" prop="openTime" >-->
      <!--{{formValidate.openTime}}~ {{formValidate.closingDate}}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--</el-row>-->

      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="开题要求:" prop="requirement">
            <el-input v-model="formValidate.requirement" readonly type="textarea" resize="none" :rows="8"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="开题须知:" prop="notice">
            <el-input v-model="formValidate.notice" readonly type="textarea" resize="none" :rows="8"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>
<script>
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData', 'view'],
    data () {
      return {

        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        //form表单bind数据
        formValidate: {
          title: '',     //标题
          noticeType: 'OPENTOPIC',        //通知类型 OPENTOPIC开题通知 REPORT开题报告通知 MIDSEMESTER中期考核通知 DEFENSE答辩通知
          graduateName: '',      //研究生名字
          graduateId: '',      //研究生id
          openTime: '',      //开题时间
          requirement: '',      //开题要求
          notice: '',      //开题须知
          publishStatus: 'UNPUBLISH',      //发布状态
          closingDate: ''      //截止时间
        },
        userData: [],
        personModal: false,
        personId: {
          id: 'personId',
          title: '选择研究生',
          usersData: ''
        },
        graduateName: [],
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: api.noticeGet.path + this.operailityData.id
          }
        }
      };
    },
    created () {
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted () {
      //初始化
      this.init();
    },
    methods: {
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData (responseData) {
        let data = responseData.data;
        let names = [];
        let personData = [];
        let graduateId = data.graduateId.split(',');
        let graduateName = data.graduateName.split(',');
        for (let i = 0; i < graduateId.length; i++) {
          personData.push({
            key: graduateId[i],
            label: graduateName[i],
            disabled: false
          });
          names.push(graduateName[i]);

        }
        this.userData = personData;
        this.graduateName = names;
        this.formValidate = this.getFormValidate(this.formValidate, data);
        // 更新工作台
        if (this.view === 'work') {
          this.$emit('view');
        }
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel () {
        this.$emit('cancel', 'edit');
      },

      /*
       * 组件初始化入口
       * */
      init () {
        //默认请求加载数据
        if (this.view === 'work') {
          this.listMessTitle.ajaxParams.url = api.noticeGetForWork.path + this.operailityData.id
        }
        this.ajax(this.listMessTitle);
      }

    }

  };
</script>

