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
        <el-col :span="8">
          <el-form-item label="培养类型:" label-width="100px" prop="traininType">
            <el-select filterable style="width: 100%;" v-model="formValidate.traininType" @change="changeSelect"
                       placeholder="请选择">
              <el-option v-for="(item,index) in traininType" v-if="item.value" :value="item.value" :label="item.label"
                         :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="学位类型:" label-width="100px" prop="degree">
            <el-select filterable style="width: 100%;" v-model="formValidate.degree" @change="changeSelect" clearable
                       placeholder="请选择">
              <el-option v-for="(item,index) in degree" :value="item.value" :label="item.label"
                         :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="复试专业:" label-width="100px" prop="majorCode">
            <el-select filterable style="width: 100%;" v-model="formValidate.majorCode" @change="changeSelect" clearable
                       placeholder="请选择">
              <major></major>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
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
              prop="degree"
              label="培养类型"
              align="center"
              width="100">
              <template scope="scope">
                {{ scope.row.traininType | typeText }}
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
        <el-col>
          <el-form-item label="已选中人员:" prop="userIds">
            <template v-if="selectPerson instanceof Object">
              <el-tag class="ptorPersonItem" v-for="(item,index) in selectPerson" :key="index" :closable="true"
                      type="primary" @close="delPerson(index)">
                {{ item.name || item.userName }}
              </el-tag>
            </template>
            <span v-else>（请选择复试专业之后选择需要复试的人员）</span>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <!--科室-->
          <el-form-item label="接收对象:" prop="receptionObject" labelWidth="100px">
            <el-radio-group v-model="formValidate.receptionObject" @change="receptionObjectChange">
              <el-radio label="KEZR">科室</el-radio>
              <el-radio label="DS" v-if="formValidate.traininType==='BS'">导师</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="接收人:" prop="receptionUserid" label-width="100px">
            <el-select v-model="formValidate.receptionUserid" filterable v-if="formValidate.receptionObject==='KEZR'"
                       clearable placeholder="请选择">
              <el-option v-for="item in majorOptions" :key="item.id" :label="item.name+`(${item.code})`"
                         :value="item.id"></el-option>
            </el-select>
            <el-input v-if="formValidate.receptionObject==='DS'" v-model="formValidate.receptionUserName" readonly
                      @focus="receptionUserfocus"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!--录取人数-->
          <el-form-item label="录取人数:" prop="number" labelWidth="100px">
            <el-input v-model="formValidate.number" placeholder="请输入录取人数"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="备注:" prop="remarks" label-width="100px">
            <el-input type="textarea" :autosize="{minRows:4,maxRows:8}" v-model="formValidate.remarks"
                      placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col style="text-align: center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>

    <Modal
      :mask-closable="false"
      width="890"
      v-model="UserModal"
      title="新建导师选择"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="UserId"></modal-header>
      <selectU v-if="UserModal" @cancel="UserClose " :isOnlyOne="true" :url="treeUrl" :ajaxData="{rootId:-102}"
               @setUsers="selectHostCallback" :initUser="selectUserMentor"
               :searchParams="{url:'/archives/list/teach'}"></selectU>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<style>
  .ptorPersonItem {
    margin: 5px;
  }
</style>
<script>
  /*当前组件必要引入*/
  import api                                  from '../api';
  import major                                from '../../common/major.vue';
  import selectU
    from '../../../postgraduate/ptResearchSelections/openingMentor/setMentor_base/selectUser.vue';   //选择主持人
  import traininType                          from './traininType'; // 培养类型
  import degree                               from './degree'; // 学术学位
  import { ptOrganizationReexamine as rules } from '../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data () {
      return {
        api,
        rules,
        degree,
        traininType,
        //保存按钮基本信息
        treeUrl: '/teacherType/tree/', //目录树结构请求地址
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        fileList: [],
        selectUserMentor: [],///选择人员返回的数据
        majorOptions: [],
        majorObject: {},
        //form表单bind数据
        formValidate: {
          id: '',
          degree: '', // 学位类型
          traininType: '', // 培养类型
          receptionObject: 'KEZR',//接收对象	DS 	KEZR 科室主任
          receptionUserid: '',	//接收人id
          major: '',
          receptionUserName: '',
          majorCode: '',
          number: '', // 录取人员数量
          remarks: '' // 备注
        },

        oldData: {}, // 服务器获取到的数据
        totalCount: 0,
        majorData: {}, // 专业
        personData: [],  // 人员表
        selectPerson: null, // 储存获取到的人员信息
        multipleSelection: [], // 临时表格存储
        editType: 'add', // 编辑类型
        UserModal: false,
        UserId: {
          id: 'UserId',
          title: '选择导师'
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        if (this.operailityData) {
          this.editType = 'edit';
        }
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          curPage: 1, pageSize: Util.pageInitPrams.pageSize
        };

//        this.setTableData();
        this.getMajor();
      },
      // 获取编辑数据
      getEditData () {
        let opt = {
          ajaxSuccess: res => {
            this.oldData = res.data;

            // 字段还原
            for (let key in this.formValidate) {
              if (res.data[key]) {
                if (key === 'time') {
                  this.formValidate[key] = this.conductDate(res.data[key], 'yyyy-MM-dd HH:mm:ss');
                } else {
                  this.formValidate[key] = res.data[key];
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
              fileId.push(item.id);
            });
            this.fileList = fileList;
            this.formValidate.fileIds = fileId.join(',');
          },
          ajaxError: () => this.errorMess('获取数据失败'),
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        };
        this.ajax(opt);
      },

      // 设置选中人员
      setSelectPerson (arr) {
        // 人员处理
        let user = {};
        arr.map(item => user[item.userId] = item);
        return arr.length ? user : null;
      },

      // 获取专业
      getMajor () {
        let opt = {
            ajaxSuccess: (res) => {
              let data = res.data;
              let majorObject = {};//保存教研室信息
              this.majorOptions = data;
              data.map((item => {
//                majorObject[item.id] = item.directorList && item.directorList[0];
                majorObject[item.id] = item.directorList;
              }));
              this.majorObject = majorObject;
            },
            ajaxError: () => this.errorMess('获取专业失败'),
            ajaxParams: {
//            url: api.majorList,
              url: api.getDepth,
              params:
                {
                  depth: 3
                }
            }
          }
        ;
        this.ajax(opt);
      },
      // 获取人员列表
      setTableData () {
        if (!this.formValidate.traininType) {
          this.showMess('请选择培养类型!');
          return false;
        }
        let opt = {
          ajaxSuccess: res => {
            let data = [];
            if (res.data instanceof Array) {
              data = this.addIndex(res.data);
            }
            this.totalCount = res.totalCount || 0;
            this.personData = data;
          },
          ajaxError: () => this.errorMess('获取人员列表失败'),
          ajaxParams: {
            url: api.personList,
            // 该专业下状态为“未组织”的人员
            params: Object.assign({}, this.queryQptions, {
              majorCode: this.formValidate.majorCode,
              whetherReception: 'N',
              degree: this.formValidate.degree,
              traininType: this.formValidate.traininType
            })
          }
        };
        this.ajax(opt);
      },

      // 选择专业
      changeSelect () {
        // 如果是博士则接受对象只能为科室主任
        if (this.formValidate.traininType === 'SS') {
          this.formValidate.receptionObject = 'KEZR';
        }
        // 切换专业清空人员
        // 编辑状态切换专业到原专业时还原选择人员
        this.selectPerson = (this.editType === 'edit' && this.oldData.majorCode === val) ? this.setSelectPerson(
          this.oldData.userList) : null;
        // 只有专业存在时才能获取数据
        this.setTableData();
      },
      // 表格选择
      handleSelectionChange (val) {
        let t = this.getFormData(this.selectPerson);
        val.map(item => t[item.id] = item);
        this.selectPerson = Object.keys(t).length ? t : null;
      },
      // 删除选中人员
      delPerson (index) {
        let t = this.getFormData(this.selectPerson);
        delete t[index];
        this.selectPerson = Object.keys(t).length ? t : null;
      },
      // 选择时间
      changeTime (val) {
        this.formValidate.time = val;
      },
      // 上传附件
      expenseFileEvent (ids) {
        this.formValidate.fileIds = ids;
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        this.formValidate.userIds = Object.keys(this.selectPerson || {}).join(',');
        if (this.submitForm('formValidate')) {
          let majorObject = this.majorObject;
          let formValidate = this.getFormData(this.formValidate);
          if (this.formValidate.receptionObject === 'KEZR') {//当前为科室的时候查找科室主任id并判断是否存在
            let receptionUserid = [];
            (majorObject[formValidate.receptionUserid] || []).map(item => receptionUserid.push(item.userId));
            console.log(majorObject);
            if (!receptionUserid.length) {
              this.errorMess('当前所选科室还未分配科室主任');
              return;
            } else {
              formValidate.receptionUserid = receptionUserid.join(',');
            }
          }

          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          let opt = {
            type: 'add',
            successTitle: '添加成功!',
            errorTitle: '添加失败!',
            ajaxSuccess: 'ajaxSuccess',
            ajaxError: 'ajaxError',
            ajaxParams: {
              url: api.modifyReception.path + formValidate.userIds,
              method: api.modifyReception.method,
              data: formValidate
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
      submitForm (formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        if (flag && !Object.keys(this.selectPerson || {}).length) {
          this.errorMess('请选择复试人员');
          flag = false;
        }
        if (flag && !this.formValidate.number) {
          this.errorMess('录取人数最少为1！');
          flag = false;
        }
        if (flag && Number(this.formValidate.number) > Object.keys(this.selectPerson || {}).length) {
          this.errorMess('录取人数不能超过所选人数总数！');
          flag = false;
        }
        return flag;
      },

      /**打开弹窗*/
      user () {

      },

      openModel (options) {
        this[options + 'Modal'] = true;
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel () {
        this.$emit('cancel', this.editType);
      },

      UserClose () {
        this.UserModal = false;
      },

      //改变接收对象
      receptionObjectChange () {
        this.selectUserMentor = [];
        Object.assign(this.formValidate, {
          receptionUserid: '',	//接收人id
          receptionUserName: ''
        });
      },

      //接收人选择人员
      receptionUserfocus () {
        this.openModel('User');
      },

      //选择人员的回调
      selectHostCallback (list) {
        this.selectUserMentor = list;
        let UserObj = list[0] || {};
        Object.assign(this.formValidate, {
          receptionUserid: UserObj.key,
          receptionUserName: UserObj.label
        });
        this.UserClose();
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {
      major, selectU
    }
  };

</script>
