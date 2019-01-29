<!----------------------------------
****--@name     住院医实施管理
****--@role     ${*}
****--@date     2018/1/11
****--@author   gx
----------------------------------->
<template>
  <div>
    <el-row class="but-space">
      <el-col :span="3" :offset="2">
        <Icon style="font-size: 50px" type="arrow-down-a"/>
      </el-col>
      <el-col :span="16">
        <p>填写导入轮转表模板</p></br>
        <a :href="http">
          <el-button size="mini" type="primary">下载模板<i class="ivu-icon ivu-icon-arrow-down-a"></i></el-button>
        </a>
      </el-col>
    </el-row>
    <el-row class="but-space">
      <el-col :span="3" :offset="2">
        <Icon style="font-size: 50px" type="upload"/>
      </el-col>
      <el-col :span="16">
        <p>上传填好的轮转表信息表 ( 仅支持.xls/.xlsx格式)</p></br>
        <xlsx @on-select-file="handleSelectedFile" :row="0">上传</xlsx>
      </el-col>
    </el-row>
    <!--<el-row class="but-space">-->
    <!--<el-col :span="10" :offset="9">-->
    <!--<el-button @click="success">完成</el-button>-->
    <!--<el-button @click="cancel">取消</el-button>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--导入-->
    <Modal
      :mask-closable="false"
      width="1100"
      v-model="toChannelModal"
      title="对话框标题"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="toChannelId"></modal-header>
      <div v-if="toChannelModal">
        <el-form inline>
          <fieldset style="min-height:90px;">
            <legend style="font-size:16px">&nbsp;&nbsp;导入轮转表</legend>
            <el-row>
              <el-col :span="12">
                <el-form-item label="生源类型 :" prop="activityType">
                  <el-select v-model="formValidate.userRole" placeholder="请选择">
                    <el-option
                      v-for="(item,index) in userRole"
                      :key="index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否校验院内科室与标准科室对应关系 :">
                  <el-radio-group v-model="formValidate.isCheckDepRelation">
                    <el-radio label="0">否</el-radio>
                    <el-radio label="1">是</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <hr>
            <el-row>
              <el-col :span="12">
                <el-form-item label="要导入Excel中轮转科室 的轮转时间是否有合并单元格情况 :">
                  <el-radio-group v-model="formValidate.isHaveMergeCell">
                    <el-radio label="0">无</el-radio>
                    <el-radio label="1">有</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="要导入Excel中表头的单元格代表时间 :">
                  <el-radio-group v-if="formValidate.userRole!='SXS'" v-model="formValidate.isHalfMonth">
                    <el-radio label="0">一个月</el-radio>
                    <el-radio label="1">半个月</el-radio>
                  </el-radio-group>
                  <div v-else>一周</div>
                </el-form-item>
              </el-col>
            </el-row>
            <hr>
            <el-row>
              <el-col :span="24">
                <el-form-item label="要导入Excel中轮转时间表示方式:">
                  <el-radio-group v-model="formValidate.isShowTimeType">
                    <el-radio label="0">在表头设定时间，统一标示每列科室对应时间段。</el-radio>
                    <el-radio label="1">以每个人员时间在科室上一行的方式，代表科室对应时间段</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </fieldset>
        </el-form>
        <br>
        <to-channel :handsontableOptions="handsontableOptions" :unFormat="true" @cancel="closeChannel"
                    :commitBefFun="commitBefFun" :validate="validate"
                    url="/traineeRotary/arrangeRotary/importUserRtDepTableFromExcel"
                    :unShowError="true"
                    @success="subHandelEvent" :unSelfHeader="true" @hot="hot" :data="convertedData"
                    :errorBefFun="errorBefFun"></to-channel>

        <div v-if="error" style="font-size: 14px">
          <el-form>
            <fieldset style="min-height:90px;">
              <legend style="font-size:16px">&nbsp;&nbsp;错误提示</legend>
              {{error}}
            </fieldset>
          </el-form>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import toChannel from '../../common/toChannel_base-handsontable.vue';
  import {implementationManagement as rules} from './rules.js'
  //当前组件引入全局的util
  let Util = null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData', 'deptId'],
    data() {
      return {
        active: 0,
        //保存按钮基本信息
        //导入条件
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        toChannelId: {id: 'toChannelId', title: '人员信息表'},
        convertedData: {},
        userRole: [//生源类型
          {
            label: '住院医',
            value: 'ZYY',
          },
          {
            label: '研究生',
            value: 'YJS',
          },
          {
            label: '实习生',
            value: 'SXS',
          },
          {
            label: '进修生',
            value: 'JXS',
          },
        ],

        //记录总条数
        totalNumber: 0,
        toChannelModal: false,
        //form表单bind数据
        formValidate: {
          userRole: 'ZYY',
          isCheckDepRelation: '1',
          isHaveMergeCell: '1',
          isShowTimeType: '0',
          isHalfMonth: '0',
          excelData: [],
        },
        error: '',

        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: '/role/add',
            method: 'post'
          }
        },
        //table
        dynamicHt: 100,
        tableData1: [{l: '1'}, {l: '1'}],
        http: '',
      }
    },
    created() {
      this.handsontableOptions = {
        columns: rules,
        fixedColumnsLeft: 4,
        fixedRowsTop: 1,   //固定表头
      }
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted() {
      //初始化
      let http = this.$store.getters.getEnvPath.http;
      this.http = http + 'static/template/userOldRtInfo.xls';
      this.init();
    },
    methods: {
      /*
       * 组件初始化入口
       * */
      init() {
        //默认请求加载数据

      },

      //导入验证 验证信息（第二次验证，验证头部）
      validate(data, header) {
        let error = [];
        let needHeader = ['工号（编号）', '姓名', '学校', '录取学科'];
        for (let i = 0; i < 3; i++) {
          let item = header[i];
          if (needHeader[i] !== item) {
            error.push(`第${i + 1}列应为${needHeader[i]}`);
          }
        }
        this.error = error.join(',')
      },

      //提交前的数据处理，
      commitBefFun(data, xlsHeader, header) {
        if(this.formValidate.userRole=='SXS' ){
          this.formValidate.isHalfMonth = '0';
        }
        this.formValidate.excelData = data;
        return this.formValidate;
      },

      //禁止性别单元格进行编辑
      hot(hot) {
        hot.updateSettings({
          cells: function (row, col, prop) {
            let cellProperties = {};
            if (hot.getSourceData()[row][prop] === '性别') {
              cellProperties.readOnly = true;
            }
            return cellProperties;
          }
        })
      },

      //处理获取到的错误信息
      errorBefFun(data) {
        this.error = data[0].errorMsgList[0];
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.addMessTitle, isLoadingFun)
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },

      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      success() {
        this.$emit('toChannel', 'toChannel', `导入${this.totalNumber}条数据`);
      },

      cancel() {
        this.$emit('cancel', 'toChannel');
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        myData.type = data.type.join(",");
        return myData;
      },
      //下一步
      next() {

        this.active = this.active + 1
      },
      load() {
        this.active = 0
      },


      closeChannel() {
        this.toChannelModal = false;
      },
      //点击上传获取文件回调函数
      handleSelectedFile(convertedData) {
        if (convertedData.body == 0) {
          this.errorMess('导入数据为空，请重新选择数据');
          return;
        }
        this.convertedData = convertedData;
        this.error = ''
        this.toChannelModal = true
      },


      //导入成功回调函数
      subHandelEvent(data) {
        this.closeChannel()
        this.totalNumber += data.length;
      },


    },
    components: {
      toChannel
    }

  }
</script>

