<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules">
      <el-row>
        <el-col :span="8" :offset="1">
          <el-form-item label="复试专业:" prop="majorCode">
            <el-select filterable v-model="formValidate.majorCode" @change="majorChange" placeholder="请选择">
              <el-option v-for="(item,key) in majorData" :key="key" :label="item.value + '（'+ item.code +'）'"
                         :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="22" :offset="1">
          <el-table
            align="center"
            ref="multipleTable"
            :maxHeight="400"
            :data="personData"
            tooltip-effect="dark"
            highlight-current-row
            style="width:100%;height:100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              align="center"
              label="序号"
              type="index"
              width="75">
              <template scope="scope">
                <span>{{scope.row.index}}</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="studentId"
              label="学号"
              width="150">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="name"
              label="姓名"
              width="150">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="sex"
              width="75"
              label="性别">
              <template scope="scope">
                {{ scope.row.sex | typeText }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="phone"
              label="电话号码"
              width="150">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="majorCode"
              label="专业代码"
              width="150">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="major"
              label="专业方向"
              width="150">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="degree"
              label="学位类型"
              align="center"
              width="100">
              <template scope="scope">
                {{ scope.row.degree | degree }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="remarks"
              label="备注">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="initialScore"
              label="初试成绩"
              width="100">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="strtus"
              label="状态">
              <template scope="scope">
                {{ scope.row.strtus | typeText }}
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <div style="margin: 10px;">
            <div style="float: right;">
              <el-pagination
                @size-change="changePageSize"
                @current-change="changePage"
                :current-page="myPages.currentPage"
                :page-sizes="myPages.pageSizes"
                :page-size="myPages.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
              </el-pagination>
            </div>
          </div>
        </el-col>
      </el-row>
      <br>
      <el-row>
        <el-col :span="22" :offset="1">
          <el-form-item label="已选中人员:" prop="userIds">
            <template v-if="selectPerson">
              <el-tag class="ptorPersonItem" v-for="(item,index) in selectPerson" :key="index" :closable="true"
                      type="primary" @close="delPerson(index)">
                {{ item.name || item.userName }}
              </el-tag>
            </template>
            <span v-else>（请选择复试专业之后选择需要复试的人员）</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="11" :offset="1">
          <el-form-item label="复试地点:" prop="address" labelWidth="86px">
            <el-input v-model="formValidate.address" placeholder="请输入复试地点"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="复试时间:" prop="time">
            <el-date-picker v-model="formValidate.time" type="datetime" :editable="false" placeholder="请选择日期及时间"
                            @change="changeTime"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="22" :offset="1">
          <el-form-item label="复试要求:" prop="require">
            <el-input v-model="formValidate.require" type="textarea" resize="none" :rows="8"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22" :offset="1">
          <el-form-item label="复试资料:" prop="fileIds">
            <upload-file @setUploadFiles="expenseFileEvent" :uploadFiles="fileList"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row>
      <el-col :span="24" style="text-align: center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<style>
  .ptorPersonItem {
    margin: 5px;
  }
</style>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import {ptOrganizationReexamine as rules} from '../rules'
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        rules,
        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        fileList: [],
        //form表单bind数据
        formValidate: {
          id: "",
          require: '',       //复试要求
          fileIds: '',     //复试附件
          userIds: '',       //复试人员IDS
          major: '',       //专业
          majorCode: '',       //专业代码
          address: '', // 地点
          time: '', // 时间
        },
        oldData: {}, // 服务器获取到的数据
        totalCount: 0,
        majorData: {}, // 专业
        personData: [],  // 人员表
        selectPerson: null, // 储存获取到的人员信息
        multipleSelection: [], // 临时表格存储
        editType: 'add', // 编辑类型
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        if (this.operailityData) {
          this.editType = 'edit';
        }
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          curPage: 1, pageSize: Util.pageInitPrams.pageSize
        }

        this.getMajor();
      },
      // 获取编辑数据
      getEditData() {
        let opt = {
          ajaxSuccess: res => {
            this.oldData = res.data;

            // 字段还原
            for (let key in this.formValidate) {
              if (res.data[key]) {
                if (key === 'time') {
                  this.formValidate[key] = this.conductDate(res.data[key], 'yyyy-MM-dd HH:mm:ss');
                } else {
                  this.formValidate[key] = res.data[key]
                }
              }
            }
            // 附件处理
            let fileId = [];
            let fileList = [];
            res.data.fileList.map(item => {
              fileList.push({
                fileId: item.id,
                fileName: item.oldName,
                filePath: api.down.path + item.id
              });
              fileId.push(item.id)
            })
            this.fileList = fileList;
            this.formValidate.fileIds = fileId.join(',');
          },
          ajaxError: () => this.errorMess('获取数据失败'),
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        };
        this.ajax(opt)
      },

      // 设置选中人员
      setSelectPerson(arr) {
        // 人员处理
        let user = {};
        arr.map(item => user[item.userId] = item);
        return user
      },

      // 获取专业
      getMajor() {
        let opt = {
          ajaxSuccess: res => {
//            if (res.data && res.data instanceof Object) {
//              let t = {};
//              (((res.data.child instanceof Array) && res.data.child) || []).map(item => t[item.code] = item)
//              this.majorData = t;
//            }
            if (res.data) {
              let t = {};
              res.data.map(item => {
                item.value = item.name;
                t[item.code] = item;
              })
              this.majorData = t;
            }
            if (this.editType === 'edit') {
              // 获取编辑数据
              this.getEditData()
            }
          },
          ajaxError: () => this.errorMess('获取专业失败'),
          ajaxParams: {
//            url: api.majorList,
            url: api.getByDepth,
            params: {
              depth: 2,
            }
          }
        };
        this.ajax(opt)
      },
      // 获取人员列表
      setTableData() {
        let opt = {
          ajaxSuccess: res => {
            let data = [];
            if (res.data instanceof Array) {
              data = this.addIndex(res.data);
            }
            this.totalCount = res.totalCount || 0;
            this.personData = data
          },
          ajaxError: () => this.errorMess('获取人员列表失败'),
          ajaxParams: {
            url: api.personList,
            // 该专业下状态为“未组织”的人员
            params: Object.assign({}, this.queryQptions, {major: this.formValidate.major, strtus: 'UNORGANIZED'}),
          }
        }
        this.ajax(opt)
      },

      // 选择专业
      majorChange(val) {
        // 切换专业清空人员
        // 编辑状态切换专业到原专业时还原选择人员
        this.selectPerson = (this.editType === 'edit' && this.oldData.majorCode === val) ? this.setSelectPerson(this.oldData.userList) : {};
        // 只有专业存在时才能获取数据
        if (this.majorData[val]) {
          this.formValidate.major = this.majorData[val].value || '';
          this.setTableData();
        }
      },
      // 表格选择
      handleSelectionChange(val) {
        let t = this.getFormData(this.selectPerson);
        val.map(item => t[item.id] = item);
        this.selectPerson = t;
      },
      // 删除选中人员
      delPerson(index) {
        let t = this.getFormData(this.selectPerson);
        delete t[index];
        this.selectPerson = t;
      },
      // 选择时间
      changeTime(val) {
        this.formValidate.time = val
      },
      // 上传附件
      expenseFileEvent(ids) {
        this.formValidate.fileIds = ids;
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let user = [];
        let msg = {add: '添加', edit: '修改'};
        for (let id in (this.selectPerson || {})) {
          user.push(id)
        }
        this.formValidate.userIds = user.join(',');
        if (this.submitForm("formValidate")) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          let opt = {
            type: this.editType,
            successTitle: msg[this.editType] + '成功!',
            errorTitle: msg[this.editType] + '失败!',
            ajaxSuccess: 'ajaxSuccess',
            ajaxError: 'ajaxError',
            ajaxParams: {
              url: api[this.editType].path + (this.editType === 'edit' ? this.formValidate.id : ''),
              method: api[this.editType].method,
              data: this.getFormData(this.formValidate),
            }
          };
          this.ajax(opt, isLoadingFun);
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
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', this.editType);
      },
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {}
  }

</script>
