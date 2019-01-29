<!--分配带教老师-->
<template>
  <div>
    <el-row>
      <el-form :inline="true">
        <el-col :span="10" :offset="2">
          <el-form-item label="姓名：">{{ viewData.userName }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="科室：">{{ viewData.depName }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="入科时间：">{{ viewData.rotaryBeginTime }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="报到时间：">{{ viewData.registerTime }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="轮转开始时间：">{{ viewData.rotaryBeginTime }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="轮转结束时间：">{{ viewData.rotaryEndTime }}
          </el-form-item>
        </el-col>
        <el-col :span="20" :offset="2">
          <el-form-item label="带教老师：">
            <!--<span class="deptReported">{{ selectTeacherNames.concat(teacherNames).join('，') }}</span>-->
            <el-button type="success" size="mini" @click="selectUser">选择带教老师</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="20" :offset="2">
          <el-table
            width="550"
            :data="teachtableData"
            border
          >
            <el-table-column
              label="序号"
              type="index"
              width="65">
            </el-table-column>
            <el-table-column
              prop="teacherNames"
              label="带教老师"
              width="90">
            </el-table-column>
            <el-table-column
              prop="teachingBeginTime"
              label="开始时间 一 结束时间"
              align="center">
              <template scope="scope">
                <dateGroup
                  type="date"
                  :date="operailityData.podClass==='SXS'?'week':'month'"
                  :dateGroup="scope.row">
                </dateGroup>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="65">
              <template scope="scope">
                <el-button @click="deleteRow(scope.$index, teachtableData,scope.row)" type="text" size="small">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-form>
      <div align="center" style="margin-top:10px;">
        <el-col :span="6" :offset="6">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        </el-col>
        <el-col :span="6">
          <el-button @click="cancel">取消</el-button>
        </el-col>
      </div>
    </el-row>
    <!--选择考场管理员-->
    <Modal :mask-closable="false" width="890" v-model="selectUserModal" class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectUserId"></modal-header>
      <!-- 此处人员还未对应 -->
      <getRotaryTeachers v-if="selectUserModal" @cancel="closeSltUser" @setUsers="setUsers"
                         :initUser="initUser"
                         :url="api"
                         :podClass="podClass"
                         :treeOptions="treeDefaults"
                         :selectOption="selectOption"></getRotaryTeachers>
      <div slot="footer"></div>
    </Modal>
    <!--删除弹窗-->
    <Modal
      :mask-closable="false"
      height="200"
      v-model="removeModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="500"
    class="distributionTeach">
      <modal-header slot="header" :content="removeId"></modal-header>
      <remove v-if="removeModal" :delete-url="delUrl" @remove="removeCallback" @cancel="removeModal=false"
              :operaility-data="operailityData" :title="title">
        <!--<div class="remove" style="color: red">将从系统中删除，确定要删除吗？</div>-->
      </remove>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import api from '../deptReported/api';
  import getRotaryTeachers from './sign_getRotaryTeachers.vue';
  // import selectUser from '../../../common/selectUser';
  import dateGroup from './deptReported_dateGroup.vue'

  export default {
    props: ['operailityData', 'signType'],
    data () {
      return {
        api,
        initUser: [],
        teacherIds: [],
        selectTeacherIds: [],
        teacherNames: [],
        // selectTeacherNames: [],
        teachtableData:[],
        removeModal: false,
        removeId: {id: 'removeId', title: '删除'},
        viewData: {},
        title:'将从系统中删除，确定要删除吗？',
        deleRowL: {},//保存需要删除的数据
        loadBtn: {
          title: '确定',
          callParEvent: 'listenSubEvent'
        },
        treeDefaults: {
          getTreeUrl: 'teacherType/tree?rootId=-101',
          getDataUrl: '',
          isShowMenus: true,
        },
        //搜索option
        selectOption: {
          url: '/archives/query/teachNoPage?typeId='
        },
        addMessTitle: {
          type: 'depSign',
          successTitle: '报到成功!',
          errorTitle: '报到失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
            url: api.signDep.path + this.operailityData.podId,
            method: api.signDep.method
          }
        },
        editMessTitle: {
          type: 'depSign',
          successTitle: '更换成功!',
          errorTitle: '更换失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
            url: api.modifyDjTeacher.path + this.operailityData.podId,
            method: api.modifyDjTeacher.method,
            data: {}
          }
        },
        selectUserModal: false,
        selectUserId: {
          id: 'selectUserId',
          title: '选择带教老师'
        },
        podClass:this.operailityData.podClass
      }
    },
    methods: {
      getInfo () {
        let opt = {
          ajaxSuccess: res => {
            this.viewData = res.data;
            // this.selectTeacherIds = res.data.teacherIds && res.data.teacherIds.split(',') || [];
            // this.selectTeacherNames = res.data.teacherNames && res.data.teacherNames.split(',') || [];
            if (res.data.teacherUserList == null) {
              this.teachtableData = []
            } else {
              this.teachtableData = res.data.teacherUserList
              res.data.teacherUserList.map(item => {
                this.teacherNames.push(item.teacherNames);
                this.teacherIds.push(item.teacherIds)
              })
            }

          },
          ajaxParams: {
            url: api.get.path + this.operailityData.podId,
            method: api.get.method,
          }
        }
        this.ajax(opt)
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        for (var i = 0; i < this.teachtableData.length; i++) {
          if (this.teachtableData[i].teachingBeginTime == '' || this.teachtableData[i].teachingEndTime == '') {
            //判断带教时间不能为空
            this.errorMess('请选择带教老师' + this.teachtableData[i].teacherNames + '带教时间')
            return;
          } else {
            //转换带教老师id格式
            this.teachtableData[i].teacherIds = this.teachtableData[i].teacherIds + ''
          }
        }
        // 如果一开始没有选择带教老师，那么必须选择一位带教老师，否则可以直接提交
        if (!this.selectTeacherIds.length && !this.teacherIds.length) {
          this.errorMess('请选择带教老师！')
          return
        }
        if (!isLoadingFun) isLoadingFun = function () {
        };
        isLoadingFun(true);
        let teachtableData = this.formDate(this.$util._.defaultsDeep([], this.teachtableData), ['teachingBeginTime', 'teachingEndTime'], 'yyyy-MM-dd')
        let begintimes = [];
        let endtimes = []
        // 提取出来所有开始时间和结束时间
        teachtableData.map(item => {
          begintimes.push(item.teachingBeginTime)
          endtimes.push(item.teachingEndTime)
        })
        // 如果时间段连续  且时间段没有交集 才可以提交请求
        if (!this.compareDate(begintimes, endtimes)) {
          isLoadingFun(false);
          return;
        }
        let messTitle = this.signType == 'modifyDjTeacher' ? this.editMessTitle : this.addMessTitle;
        messTitle.ajaxParams.data = teachtableData
        this.ajax(messTitle, isLoadingFun)
      },
      // 取消
      cancel () {
        this.$emit('cancel', this.addMessTitle.type)
      },
      // 取消选择带教老师
      closeSltUser () {
        this.selectUserModal = false
      },
      // 选择人员
      selectUser () {

        // let teacherIds = this.teacherIds;
        // let teacherNames = this.teacherNames;
        this.initUser.length = 0;
        console.log(this.teacherNames);
        // if (teacherIds.length) {
        //   teacherIds.map((key, index) => {
        //     this.initUser.push({
        //       key:+key,
        //       label: teacherNames[index],
        //       description: '人员id---' + key + '的描述信息',
        //       disabled: false
        //     })
        //   })
        // }
        // console.log(this.initUser);
        this.selectUserModal = true;
      },
      // 选择人员
      setUsers (res) {
        // this.teacherIds.length = 0;
        // this.teacherNames.length = 0;
        res.map(item => {
          if (!this.teacherIds.includes(item.id)) {
            this.teacherNames.push(item.name);
            this.teacherIds.push(item.id);
          }
        })
        if (!this.teachtableData.length) {
          //如果表格为空 直接放入新选择带教老师
          // for (var i = 0; i < this.teacherNames.length; i++) {
          //   let objdata = {}
          //   objdata.teacherNames = this.teacherNames[i]
          //   objdata.teacherIds = this.teacherIds[i];
          //   objdata.teachingBeginTime = '';
          //   objdata.teachingEndTime = '';
          //   this.teachtableData.push(objdata)
          // }
          this.teacherNames.forEach((item,index)=>{
            let objdata = {}
            objdata.teacherNames = this.teacherNames[index];
            objdata.teacherIds = this.teacherIds[index];
            objdata.teachingBeginTime = '';
            objdata.teachingEndTime = '';
            this.teachtableData.push(objdata)
          })

        } else {
          //arr 方便判断新数据
          let arr = [];
          // for (var j = 0; j < this.teachtableData.length; j++) {
          //   arr.push(parseInt(this.teachtableData[j].teacherIds))
          // }
          this.teachtableData.forEach((item)=>{
            arr.push(parseInt(item.teacherIds))
          });
          //表格不为空 则判断新旧数据 并且组装数据 重新渲染数据
          let newtabledata = [];
          for (var i = 0; i < this.teacherNames.length; i++) {
            //拼接老数据end
            if (!(arr.includes(this.teacherIds[i]))) {
              //如果老数据不包含新数据 取新选择带教老师组装数据
              let newobj = {
                teacherIds: this.teacherIds[i],
                teacherNames: this.teacherNames[i],
                teachingBeginTime: '',
                teachingEndTime: '',
              };
              newtabledata.push(newobj)
            } else {
              //如果老数据包含新数据 取以前选择的带教老师数据组装数据
              for (var j = 0; j < this.teachtableData.length; j++) {
                if (parseInt(this.teachtableData[j].teacherIds) == this.teacherIds[i]) {
                  newtabledata.push(this.teachtableData[j])
                }
              }
            }
          }
          // 选择带教老师重新渲染数据
          this.teachtableData = newtabledata
        }
        this.closeSltUser()
      },
      // 删除一行数据
      deleteRow (index, rows, row) {
        this.deleRowL = {
          index,
          rows,
          row,
        }
        if (row.id) {
          this.delUrl = api.delTeacher.path + row.id + '-' + this.operailityData.podId;
          console.log(this.delUrl);
          this.removeModal = true;
        } else {
          this.remove()
        }
      },
      //执行删除
      remove () {
        let {index, rows, row} = this.deleRowL

        //删除表格
        rows.splice(index, 1);
        //删除上面数据带教名称
        this.teacherNames.splice(index, 1);
        //删除上面数据带教id
        this.teacherIds.splice(index, 1);
      },
      //删除弹窗回调
      removeCallback () {
        console.log(111);
        this.removeModal = false;
        this.remove()
      },
      // 判断时间是否连续
      compareDate (begin, over) {
        begin = begin.sort();
        over = over.sort();
        var flag = [];
        if (begin.length > 1) {
          for (var i = 1; i < begin.length; i++) {
            // console.log((new Date(begin[i]) - new Date(over[i-1])) / (1000 * 60 * 60 * 24) != 1)
            if ((new Date(begin[i]) - new Date(over[i - 1])) / (1000 * 60 * 60 * 24) != 1 || begin[i - 1] == begin[i] || over[i - 1] == over[i]) {
              flag.push('false')
            } else {
              flag.push('true')
            }
          }
        } else {
          flag.push('true')
        }
        var result = flag.some(function (value) {
          return value == 'false'
        })
        if (result == true) {
          this.errorMess('带教时间不连续或有重复时间,请重新选择时间!')
        }
        return !result;
      },
    },
    components: {
      getRotaryTeachers,dateGroup
    },
    created () {
      this.getInfo()
    }
  }

</script>

<style lang="scss">
  .deptReported {
    margin-right: 10px;
    &:empty {
      margin-right: 0
    }
  }
  .distributionTeach .remove {
    color: red
  }
</style>
