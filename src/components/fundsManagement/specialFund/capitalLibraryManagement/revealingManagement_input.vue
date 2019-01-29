<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-row>
      <el-form class="editForm" :model="formValidate" ref="formValidate" :rules="rules" label-width="100px">
        <el-col :span="12">
          <el-form-item label="经费名称:" prop="accountingName">
            <el-input v-model="formValidate.accountingName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="资金库名称:" prop="fundName">
            <template v-if="isEdit">{{formValidate.fundName}}</template>
            <el-input v-else v-model="formValidate.fundName" @focus="selectFunds" icon="search"
                      :on-icon-click="selectFunds" placeholder="请选择资金库"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-col :span="12">
            <el-form-item label="记录类型:" prop="accountingType">
              <el-select v-model="formValidate.accountingType" placeholder="请选择">
                <el-option v-for="(item,index) in accountingType" :key="index" :label="item.value" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出账/入账:" prop="outOrEnter" style="height: 37px;">
              <el-radio label="OUT" v-model="formValidate.outOrEnter">出账</el-radio>
              <el-radio label="ENTER" v-model="formValidate.outOrEnter">入账</el-radio>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-form-item label="报销人:" prop="userName">
            <el-input v-model="formValidate.userName" @focus="selectUser" icon="search"
                      :on-icon-click="selectUser" placeholder="请选择"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门:" prop="depName">
            <el-input v-model="formValidate.depName" readonly placeholder="自动关联报销人所在的部门"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="报销总额:" prop="accountingMoney">
            <el-input v-model="formValidate.accountingMoney" readonly placeholder="自动计算明细列表的金额和"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="报销时间:" prop="expenseTime">
            <el-date-picker name="start" v-model="formValidate.expenseTime" :editable="false" type="datetime"
                            placeholder="选择时间" @change="handleExpenseTime"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="经费描述:" prop="explains">
            <el-input v-model="formValidate.explains" type="textarea"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <el-col>
        <h3>明细列表</h3>
      </el-col>
      <el-table align="center" :maxHeight="300" :data="formValidate.fundAccountingDetialList" show-summary
                :summary-method="getSummaries" tooltip-effect="dark">
        <el-table-column prop="projectName" label="项目名称">
          <template scope="scope">
            <el-input v-model="scope.row.projectName" :maxlength="50"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="invoiceQuantity" label="单据数量">
          <template scope="scope">
            <el-input v-model="scope.row.invoiceQuantity" :maxlength="6"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="money" label="金额">
          <template scope="scope">
            <el-input v-model="scope.row.money" :maxlength="10"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="detatilExplain" label="备注">
          <template scope="scope">
            <el-input v-model="scope.row.detatilExplain" :maxlength="250"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template scope="scope">
            <el-button type="danger" size="small" icon="delete"
                       v-if="scope.$index != formValidate.fundAccountingDetialList.length - 1"
                       @click="removeTable(scope.$index)"></el-button>
            <el-button type="success" size="small" icon="plus" v-else @click="addTable"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col style="margin-top: 20px;">
        <el-form>
          <el-form-item label="附件:">
            <upload-file :uploadFiles="formValidate.fileList" @setUploadFiles="expenseFileEvent"></upload-file>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancelEdit">取消</el-button>
      </el-col>
    </el-row>

    <!--选择资金库-->
    <Modal :mask-closable="false" v-model="selectFundsModal" height="200" class-name="vertical-center-modal"
           :width="900">
      <modal-header slot="header" :parent="self" :content="headerContent.selectFundsId"></modal-header>
      <select-funds v-if="selectFundsModal" @cancel="cancel('selectFunds')" @select="selectFundsCall" :onlyOne="true"
                    :select="[formValidate.fundId]"></select-funds>
      <div slot="footer"></div>
    </Modal>
    <!--选择报销人-->
    <Modal :mask-closable="false" v-model="selectUserModal" height="200" class-name="vertical-center-modal"
           :width="900">
      <modal-header slot="header" :parent="self" :content="headerContent.selectUserId"></modal-header>
      <select-user v-if="selectUserModal" @cancel="cancel('selectUser')" @setUsers="selectUserCall" :isOnlyOne="true"
                   :initUser="user"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import {revealingManagement as rules} from '../../rules';
  import selectFunds from '../capitalLibraryManagement/capitalLibraryManagement_select.vue';
  import selectUser from '../../../common/selectUser.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        rules,
        self: this,
        selectFundsModal: false,
        selectUserModal: false,
        headerContent: {
          selectFundsId: {id: 'selectFundsId', title: '选择资金库'},
          selectUserId: {id: 'selectUserId', title: '选择报销人'},
        },
        user: [], // 已选择的人员
        accountingType: [], // 记录类型
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        formValidate: {
          "accountingId": "", // 出入账记录id
          "fundId": "", // 经费库id
          "fundName": "", // 经费库名称
          "accountingName": "", // 经费名称
          "accountingType": "", // 记录类型
          "depId": "", // 部门id
          "depName": "", // 部门名称
          "outOrEnter": "OUT", // 出账或入账 OUT/ENTER
          "explains": "", // 经费描述
          "userId": "", // 报销人Id
          "userName": "", // 报销人名称
          "expenseTime": "", // 报销时间2017-10-16 12:00:00
          "accountingMoney": "", // 报销总额10000.2
          "fileIds": "", // 附件id字符串1,2
          "fileList": [ // 附件文件列表
//            {
//              "fileId":"1",
//              "filePath":"",
//            }
          ], // 附件列表
          "fundAccountingDetialList": [ // 明细列表
            {
              "projectName": "", // 项目名称
              "invoiceQuantity": "", // 单据数量
              "money": "", // 金额
              "detatilExplain": "" // 备注
            }
          ]
        },
        isEdit: false,
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.getAccountingType();
        if (this.operailityData) {
          this.getEditData();
          this.isEdit = true;
        } else {
          let thisUser = this.$store.state.userInfo;
          // 人员信息
          this.formValidate.userId = thisUser.id;
          this.formValidate.userName = thisUser.name;
          // 部门信息
          this.formValidate.depId = thisUser.dept.id;
          this.formValidate.depName = thisUser.dept.name;
        }
      },
      // 时间
      handleExpenseTime(val) {
        console.log(val)
        this.formValidate.expenseTime = val
      },
      //上传文件
      expenseFileEvent(ids) {
        this.formValidate.fileIds = ids;
      },
      // 选择资金库
      selectFunds() {
        this.openModel('selectFunds')
      },
      // 选择资金库
      selectFundsCall(arr) {
        this.formValidate.fundId = arr[0].id;
        this.formValidate.fundName = arr[0].fundName;
        this.cancel('selectFunds')
      },
      // 选择人员
      selectUser() {
        this.openModel('selectUser')
      },
      // 选择人员
      selectUserCall(arr) {
        this.user = arr || [];
        if (arr.length) {
          let {key, label, data: {dept: {id, name}}} = arr[0];
          // 人员信息
          this.formValidate.userId = key;
          this.formValidate.userName = label;
          // 部门信息
          this.formValidate.depId = id;
          this.formValidate.depName = name;
        } else {
          this.formValidate.userId = '';
          this.formValidate.userName = '';
          this.formValidate.depId = '';
          this.formValidate.depName = '';
        }
        this.cancel('selectUser')
      },
      /****************** 弹窗相关 *****************/
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },
      /****************** 表格相关 *****************/
      // 添加
      addTable() {
        this.formValidate.fundAccountingDetialList.push({
          "projectName": "", // 项目名称
          "invoiceQuantity": "", // 单据数量
          "money": "", // 金额
          "detatilExplain": "" // 备注
        })
      },
      // 删除
      removeTable(index) {
        this.formValidate.fundAccountingDetialList.splice(index, 1)
      },
      // 求和
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0 || index === 3 || index === 4) {
            sums[index] = index === 0 ? '合计' : '';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          } else {
            sums[index] = '该列存在无效数值';
          }
        });
        if (typeof sums[2] == 'number') {
          sums[2] = (sums[2]).toFixed(2)
        }
        this.formValidate.accountingMoney = sums[2];
        return sums;
      },
      /****************** 其他逻辑 *****************/
      // 获取经费记录类型
      getAccountingType() {
        let opt = {
          ajaxSuccess: res => this.accountingType = res.data || [],
          ajaxError: () => this.errorMess('获取经费记录类型失败，请重试...'),
          ajaxParams: {
            url: api.getAccountingType.path,
            method: api.getAccountingType.method
          }
        };
        this.ajax(opt)
      },
      // 获取编辑数据
      getEditData() {
        let opt = {
          ajaxSuccess: res => {
            let selectUser = {
              key: res.data.userId,
              label: res.data.userName,
              data: {
                dept: {
                  id: res.data.depId,
                  name: res.data.depName
                }
              }
            };
            // 还原选择的人员信息
            this.user[0] = selectUser;
            for (let key in this.formValidate) {
              this.formValidate[key] = res.data[key];
            }
          },
          ajaxError: () => this.errorMess('获取资金库资料失败'),
          ajaxParams: {
            url: api.get.path + this.operailityData.accountingId,
            method: api.get.method
          }
        };
        this.ajax(opt)
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate") && this.checkTableData();
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          let opt = {
            type: this.isEdit ? 'edit' : 'add',
            successTitle: (this.isEdit ? '修改' : '增加') + '成功',
            errorTitle: (this.isEdit ? '修改' : '增加') + '失败',
            ajaxSuccess: "ajaxSuccess",
            ajaxError: "ajaxError",
            ajaxParams: {
              jsonString: true,
              url: this.isEdit ? api.modify.path + this.formValidate.accountingId : api.add.path,
              method: this.isEdit ? api.modify.method : api.add.method,
              data: this.getFormData(this.formValidate)
            }
          };
          this.ajax(opt, isLoadingFun)
        }
      },
      // 检查表格输入项
      checkTableData() {
        for (let i = 0, d = this.formValidate.fundAccountingDetialList, l = d.length; i < l; i++) {
          if (!d[i].projectName) {
            this.errorMess(`第 ${i + 1} 行的“项目名称”必须填写`);
            return false
          }
          if (!/^\d+$/.test(d[i].invoiceQuantity)) {
            this.errorMess(`第 ${i + 1} 行的“单据数量”必须是整数`);
            return false
          }
          if (!/^(0|[1-9](\d+|))(\.\d{1,2}|)$/.test(d[i].money)) {
            this.errorMess(`第 ${i + 1} 行的“金额”必须是有效的整数或者二位小数`);
            return false
          }
        }
        return true
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
      cancelEdit() {
        this.$emit('cancel', this.isEdit ? 'edit' : 'add');
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = this.$util._.defaultsDeep({}, data);
        return myData;
      },
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      selectFunds,
      selectUser,
    }
  }

</script>
