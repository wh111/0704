<!----------------------------------
****--@name     遴选进修生
****--@role     教学秘书
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content">
    <!--搜索form-->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="申请人" prop="userName">
        <el-input v-model="formInline.userName" placeholder=""></el-input>
      </el-form-item>

      <el-form-item label="职称">
        <el-input v-model="formInline.title" placeholder=""></el-input>
        <!--<el-select v-model="formInline.title" placeholder="">-->
        <!--<el-option label="2015" value="2015"></el-option>-->
        <!--<el-option label="2016" value="2016"></el-option>-->
        <!--<el-option label="2017" value="2017"></el-option>-->
        <!--</el-select>-->
      </el-form-item>
      <el-form-item label="进修科目">
        <el-select v-model="formInline.managementId" clearable placeholder="请选择">
          <el-option v-for="(item,index) in studysubjectOption" :key="index" :label="item.courseName"
                     :value="item.managementId"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="申请时间" prop="specialtyName">
        <date-group :dateGroup="{text:'',startDate:formInline.createTimeBegin,endDate:formInline.createTimeEnd}">
          <el-date-picker name="start" v-model="formInline.createTimeBegin" :editable="false" type="date"
                          placeholder="选择日期" :picker-options="pickerOptions0"
                          @change="handleStartTime"></el-date-picker>
          <span>-</span>
          <el-date-picker name="end" v-model="formInline.createTimeEnd" :editable="false" type="date" placeholder="选择日期"
                          :picker-options="pickerOptions1"
                          @change="handleEndTime"></el-date-picker>
        </date-group>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formInline.wehterSelection" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="通过" value="Y"></el-option>
          <el-option label="不通过" value="N"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>

      </el-form-item>
    </el-form>

    <!--列表操作按钮-->

    <div style="margin-bottom: 20px;" v-if="where!='selectionEducationSeach'">
      <el-button type="primary" @click="add">通过</el-button>
      <el-button type="primary" @click="del">不通过</el-button>
    </div>
    <div style="margin-bottom: 20px;" v-if="where =='selectionEducationSeach'">
      <el-button type="primary" @click="shortNote">发送短信</el-button>
    </div>

    <!--- 列表 --->
    <div>
      <!--表格数据-->
      <div
        id="myTable"
        ref="myTable"
      >
        <el-table
          align="center"
          :height="dynamicHt"
          :context="self"
          :data="tableData1"
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%;height: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55"
            :selectable="canTodo">
          </el-table-column>
          <el-table-column
            label="操作"
            :width="where!='selectionEducationSeach'?140:80">
            <template scope="scope">
              <el-button size="small" type="info" @click="show(scope.row)">查看</el-button>
              <!--<el-button size="small" type="success" :disabled="scope.row.wehterSelection == 1"-->
                         <!--v-if="where!='selectionEducationSeach'&&!scope.row.changeStudyTime" @click="edit(scope.row)">编辑-->
              <!--</el-button>-->
              <!--<el-button v-if="where!='selectionEducationSeach'" size="small" type="success" v-else @click="save(scope.row)">保存</el-button>-->
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="申请人"
            show-overflow-tooltip
            prop="userName">
          </el-table-column>

          <el-table-column
            align="center"
            show-overflow-tooltip
            prop="title"
            label="职称"
          >
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="professionalQualification"
            label="执业资格"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <!--<el-table-column-->
          <!--show-overflow-tooltip-->
          <!--prop="selectionDepName"-->
          <!--label="遴选科室"-->
          <!--&gt;-->
          <!--<template scope="scope">-->
          <!--<template v-if="scope.row.changeStudyTime">-->
          <!--<el-select v-model="formValidate.depId" placeholder="请选择" @change="changeAllName">-->
          <!--<el-option-->
          <!--v-for="(item,index) in queryTreeByManager"-->
          <!--:key="item.id"-->
          <!--:label="item.name"-->
          <!--:value="item.id">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</template>-->
          <!--<span v-else>{{ scope.row.selectionDepName || '——' }}</span>-->
          <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column
            show-overflow-tooltip
            prop="courseNames"
            label="进修科目"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="studyTime"
            label="进修时间"
          >
            <template scope="scope">
              {{ scope.row.studyTime | recruit }}
            </template>
          </el-table-column>
          <el-table-column
            prop="checkInTime"
            label="报到时间"
            show-overflow-tooltip
          >
            <template scope="scope">
              <template v-if="scope.row.changeStudyTime">
                <el-date-picker :editable="false" style="width: 100%;" v-model="formValidate.checkInTime" type="date"
                                placeholder="选择日期"></el-date-picker>
              </template>
              <span v-else>{{ scope.row.checkInTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="80"
          >
            <template scope="scope">
              {{ scope.row.wehterSelection | wehterSelection }}
            </template>
          </el-table-column>
        </el-table>
      </div>
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
            :total="listTotal">
          </el-pagination>
        </div>
      </div>
      <!-- 模态框  安排面试 -->
      <Modal :mask-closable="false" v-model="addModal" height="200" class-name="vertical-center-modal" :width="500">
        <modal-header slot="header" :content="button.addId"></modal-header>
        <div>
          <div class="modalTips">确认通过遴选“{{ addTips.name.join('，') }}”
            {{ addTips.name.length > 3 ? '等' : '' }}
            {{ addTips.name.length > 1 ? addTips.name.length + '人' : '' }}？
          </div>
          <el-row>
            <el-col :span="10" :offset="14">
              <el-button @click="addCall" type="primary" >确定</el-button>
              <el-button class="but-col" @click="cancel('add')">取消</el-button>
            </el-col>
          </el-row>
        </div>
        <!--<arrange v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></arrange>-->
        <div slot="footer"></div>
      </Modal>
      <!-- 模态框  拒绝遴选 -->
      <Modal :mask-closable="false" v-model="delModal" height="200" class-name="vertical-center-modal" :width="500">
        <modal-header slot="header" :content="button.delId"></modal-header>
        <div>
          <div class="modalTips">确认不通过遴选“{{ addTips.name.join('，') }}”
            {{ addTips.name.length > 3 ? '等' : '' }}
            {{ addTips.name.length > 1 ? addTips.name.length + '人' : '' }}？
          </div>
          <el-row>
            <el-col :span="10" :offset="14">
              <el-button @click="delCall" type="primary" >确定</el-button>
              <el-button class="but-col" @click="cancel('del')">取消</el-button>
            </el-col>
          </el-row>
        </div>
        <div slot="footer"></div>
      </Modal>
      <!--&lt;!&ndash; 模态框  安排面试 &ndash;&gt;-->
      <!--<Modal :mask-closable="false" v-model="addModal" height="200" class-name="vertical-center-modal" :width="1000">-->
      <!--<modal-header slot="header" :content="button.addId"></modal-header>-->
      <!--<arrange v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></arrange>-->
      <!--<div slot="footer"></div>-->
      <!--</Modal>-->
      <!-- 模态框 查看（view） -->
      <Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题" class-name="vertical-center-modal"
             :loading="true"
             :width="1000">
        <modal-header slot="header" :parent="self" :content="button.showId"></modal-header>
        <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
        <div slot="footer"></div>
      </Modal>
      <!--短信通知弹窗-->
      <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="shortNoteModal"
             class-name="vertical-center-modal" :width="800">
        <modal-header slot="header" :content="button.shortNoteId"></modal-header>
        <shortNote v-if="shortNoteModal" @shortNote="subCallback" @cancel="cancel"
                   :operaility-data="operailityData"></shortNote>
        <div slot="footer"></div>
      </Modal>
    </div>

  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import shortNote from "../../../common/shortNote.vue";//短信通知
  import show from '../OnlinePrequalification/OnlinePrequalification_view.vue';
  //  import  arrange from './selectionEducation_arrange.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    //where="selectionEducationSeach" 来自遴选进修查询
    props:['where'],
    data() {
      return {
        isPass: false,
        addTips: { // 遴选人员
          name: [],
          id: [],
        },
//        queryTreeByManager:{},
        formInline: {
          createTimeEnd: '',
          createTimeBegin: '',
          managementId: '',
          title: '',
          wehterSelection:'',
        },
        formValidate: {
          checkInTime: "",
//          subjectsIds: '',
//          depId: '',
//          depName: '',
        },

        //弹窗类型
        modal: {
          type: ''
        },
        button: {
          shortNoteId: {
            id: 'shortNoteId',
            title: '发送短信'
          },
          addId: {
            id: 'addId',
            title: '审核'
          },
          delId: {
            id: 'delId',
            title: '不通过'
          },
          showId: {
            id: 'showId',
            title: '查看'
          }
        },
        studysubjectOption: [],
        operailityData: {},
        multipleSelection: [],
        dynamicHt: 100,
        delModal:false,
        self: this,
        loading: false,
        shortNoteModal: false,
        listTotal: 0,
        tableData1: [],
        listMessTitle: {
          ajaxSuccess: 'successGetList',
          ajaxParams: {
            url: api.list.path,
            params: {}
          }
        },
        queryListTitle: {
          ajaxSuccess: 'successGetList',
          ajaxParams: {
            url: api.list.path,
            params: {}
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;
        this.queryQptions = {
          //url:this.listUrl,
          params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
        }
        this.setTableData();
        this.getStudysubject();
//        this.getQueryTreeByManager();
      },

      edit(row) {
        row.changeStudyTime = true;
        this.formValidate.checkInTime = row.checkInTime;
      },

      save(row) {
        let data = this.$util._.defaultsDeep({}, this.formValidate);
        if (!data.checkInTime) {
          this.errorMess('请选择报到日期');
          return
        }
        data.checkInTime = this.conductDate(data.checkInTime, 'yyyy-MM-dd');
        let opt = {
          ajaxSuccess: (res) => {
            if (res.status.code == 0) {
//              this.setTableData();
//              this.formValidate.depId = '';
//              this.formValidate.depName = '';
              this.formValidate.checkInTime = '';
              row.changeStudyTime = false;
              row.checkInTime = data.checkInTime;
//              row.selectionDepId = params.depId;
//              row.selectionDepName = params.depName;
              this.successMess('保存成功');
            } else {
              this.errorMess(res.status.msg)
            }
          },
          ajaxError: () => this.errorMess('保存失败'),
          ajaxParams: {
            url: api.modifyUserCheckInTime.path + row.subjectsId,
            method: api.modifyUserCheckInTime.method,
            data
          }
        };

        this.ajax(opt)
      },

      changeAllName(val) {
        this.formValidate.depName = this.queryTreeByManager[val].name
      },

//      getQueryTreeByManager(){
//        let opt ={
//          ajaxSuccess:res=>{
//            this.queryTreeByManager={};
//            (res.data || []).map(item=>{
//              this.queryTreeByManager[item.id] = {
//                id:item.id,
//                name:item.name
//              }
//            });
//          },
//          ajaxParams:{
//            url:api.getQueryTreeByManager.path,
//            method:api.getQueryTreeByManager.method,
//          },
//        };
//        this.ajax(opt)
//      },

      getStudysubject() {
        let opt = {
          ajaxSuccess: res => {
            let data = res.data;
            if (!data) data = [];
            let tempData = [];
            data.map(item => {
              item.courseName = item.name;
              item.managementId = item.id;
              tempData.push(item);
              if (item.childList != 0) {
                item.childList.map(obj => {
                  obj.courseName = '　　' + obj.name;
                  obj.managementId = obj.id;
                  tempData.push(obj)
                })
              }
            })
            data = tempData
            this.studysubjectOption = data || [];
          },
          ajaxParams: {
//            url:"/studysubject/list",
            url: "/hospital/dept/getThreeFourDepthHosiptalDep",
          }
        };
        this.ajax(opt)
      },

      setTableData() {
        Object.assign(this.queryQptions.params, this.formInline);
        let params = this.queryQptions.params;
        params.createTimeBegin = this.conductDate(params.createTimeBegin, 'yyyy-MM-dd');
        params.createTimeEnd = this.conductDate(params.createTimeEnd, 'yyyy-MM-dd');
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions.params);
        this.ajax(this.listMessTitle);
      },
      successGetList(res) {
        let data = res.data;
        data = this.addIndex(data);
        data.map(item => item.changeStudyTime = false);
        this.tableData1 = data;
        this.listTotal = res.totalCount || 0;
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },
      //*----------- 表格 ------------*//
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        console.log(val)
        this.multipleSelection = val;
      },
      // 是否允许参与选择
      canTodo(row) {

        return row.wehterSelection == -1
      },
      //遴选
      add() {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.addTips.name.length = 0;
        this.addTips.id.length = 0;
        if (this.isSelected()) {
          this.multipleSelection.map(item => {
            this.addTips.name.push(item.userName);
            this.addTips.id.push(item.subjectsId);
            console.log(item)
          })
        }
          this.addModal = true;
        //   this.openModel('add')

        // console.log(this.isSelected());
      },
      //不遴选
      del() {
        this.addTips.name.length = 0;
        this.addTips.id.length = 0;
        if (this.isSelecteds()) {
          this.multipleSelection.map(item => {
            this.addTips.name.push(item.userName);
            this.addTips.id.push(item.subjectsId);
          })
          this.openModel('del')
        }
      },

      // 遴选通过回调
      addCall() {
        let opt = {
          ajaxSuccess: res => this.subCallback('add', '通过成功！'),
          ajaxParams: {
            url: api.modifyWehterSelection.path,
            method: api.modifyWehterSelection.method,
            params: {
              subjectsIds: this.addTips.id.join(','),
              wehterSelection:1
            }
          }
        };
        this.ajax(opt)
      },
      // 遴选不通过回调
      delCall() {
        // console.log(data.paymentStatus)
        // if(data.paymentStatus=="N"){
        //   console.log(111)
        // }
        let opt = {
          ajaxSuccess: res => this.subCallback('del', '不通过！'),
          ajaxParams: {
            url: api.modifyWehterSelection.path,
            method: api.modifyWehterSelection.method,
            params: {
              subjectsIds: this.addTips.id.join(','),
              wehterSelection:0
            }
          }
        };
        this.ajax(opt)
      },
      // 查看
      show(row) {
        this.operailityData = row;
        this.openModel('show');
      },

      //短信通知
      shortNote() {
        this.operailityData = this.multipleSelection;
        this.openModel('shortNote')
      },
      // 增加回调
      subCallback(target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
      },
      //查询
      onSubmit() {
        this.setTableData()
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },

      /*
       * 列表数据选择
       */
      isSelected() {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len < 1) {
          this.showMess("请选择数据!");
          flag = false;
        }
        return flag;
      },
      isSelecteds() {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len < 1) {
          this.showMess("请选择数据!");
          flag = false;
        }
        return flag;
      },
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
    },
    created() {
      this.init();
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    components: {
//      arrange,
      show, shortNote,
    }
  }
</script>
