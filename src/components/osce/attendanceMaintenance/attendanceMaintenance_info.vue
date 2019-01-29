<template>
  <!-- 考生考核信息 -->
  <div class="exmUserContent modalContent">
    <!-- 老师信息 -->
    <div class="teacherInfo leftCon" v-if="stationData.stationType !== 'THEORY'">
      <el-row class="border">
        <el-col :span="6" class="teacherInfoItem" v-for="(item,index) in teacherData" :key="index"
                @click.native="selectTeacher(item)">
          <img :src="getPhotoPath(item.userPhoto)" onerror="javascript:this.src='/static/image/defAvatar.png';" style="margin:0 auto;"/>
          <p :class="{'active':teacherUserId === item.teacherId}">{{ item.userName }}</p>
        </el-col>
      </el-row>
      <!-- 教师头像 -->
      <div class="phontoContent">
        <img :src="getPhotoPath(selectTeaData.userPhoto)" onerror="javascript:this.src='/static/image/defAvatar.png';" style="margin:0 auto;">
      </div>
      <!-- 其他内容 -->
      <p class="otherInfo">考站名称：{{stationData.stationName}}</p>
      <p class="otherInfo">考官姓名：{{selectTeaData.userName}}</p>
      <p class="otherInfo">最高分：{{selectTeaData.maxMark}}</p>
      <p class="otherInfo">最低分：{{selectTeaData.minMark}}</p>
      <p class="otherInfo">平均分：{{selectTeaData.avgMark}}</p>
    </div>
    <!-- 考核信息 -->
    <div class="contentMain">
      <!-- 理论考核 -->
      <el-table v-if="stationData.stationType === 'THEORY'" align="center" :height="520" border :data="stationPaperData"
                tooltip-effect="dark" highlight-current-row>
        <el-table-column align="center" label="序号" type="index" width="75">
        </el-table-column>
        <el-table-column label="操作" align="center" width="70">
          <template scope="scope">
            <el-button size="small" :disabled="!scope.row.scheduleId" @click="show(scope.row)">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="userName" label="考生姓名" width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="mark" label="得分" align="center" width="75" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.mark === null ? '-' : scope.row.mark }}
          </template>
        </el-table-column>
        <el-table-column prop="contentName" label="考核内容" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <!-- 非理论考核 -->
      <el-table v-else align="center" :height="520" border :data="scheduleData" tooltip-effect="dark"
                highlight-current-row>
        <el-table-column align="center" label="序号" type="index" width="75">
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template scope="scope">
            <el-button size="small" v-if="scope.row.scheduleId" @click="show(scope.row)">详情</el-button>
            <el-button size="small" v-if="scope.row.scheduleId" @click="edit(scope.row)">修改</el-button>
            <el-button size="small" v-if="scope.row.scheduleId" @click="remove(scope.row)">删除</el-button>
            <el-button size="small" v-if="!scope.row.scheduleId" @click="addScore(scope.row)">添加评分</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="考生姓名" width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="contentName" label="考核内容" width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="mark" label="得分" align="center" width="75" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.mark || 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="evaluate" label="教师评语" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.evaluate || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="teacherName" label="评分教师" width="120" align="center" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <!--新建-->
      <Modal close-on-click-modal="false" width="1100" v-model="addModal" class-name="vertical-center-modal"
             @on-cancel="cancel">
        <modal-header slot="header" :content="addId"></modal-header>
        <addScore v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"
                  :url="url"></addScore>
        <div slot="footer"></div>
      </Modal>
      <!--修改-->
      <Modal close-on-click-modal="false" width="1100" v-model="editModal" class-name="vertical-center-modal"
             @on-cancel="cancel">
        <modal-header slot="header" :content="editId"></modal-header>
        <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData" :url="url"></edit>
        <div slot="footer"></div>
      </Modal>
      <!--删除弹窗-->
      <Modal close-on-click-modal="false" height="200" v-model="removeModal" class-name="vertical-center-modal"
             :width="500" @on-cancel="cancel">
        <modal-header slot="header" :content="removeId"></modal-header>
        <remove v-if="removeModal" :delete-url="url.examUserRemove.path" @remove="subCallback" @cancel="cancel"
                :operaility-data="operailityData"></remove>
        <div slot="footer"></div>
      </Modal>
      <!--查看弹窗-->
      <Modal width="1100" v-model="showModal" title="查看档案管理弹窗" class-name="vertical-center-modal" @on-cancel="cancel">
        <modal-header slot="header" :content="viewId"></modal-header>
        <show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData" :url="url"></show>
        <div slot="footer"></div>
      </Modal>
    </div>
  </div>
</template>

<script>
  let Util;
  let atmTime = null;
  //引入组件--添加评分
  import addScore from './info/info_addScore.vue';
  //修改
  import edit from './info/info_edit.vue';
  //查看详情
  import show from './info/info_view.vue';

  export default {
    props: ['nowIndex', 'index', 'url', 'stationData'],
    data () {
      return {
        teacherUserId: '',
        //老师列表请求数据
        teacherForm: {
          roomId: this.stationData.roomId, //房间id
          sceneId: this.stationData.sceneId, //场次id
          stationId: this.stationData.stationId //站点id
        },
        operailityData: '',
        //获取到的老师数据
        teacherData: [],
        selectTeaData: [],
        //获取老师获取考站监考老师列表
        teacherList: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: this.url.teacherList.path,
            params: {}
          }
        },

        //获取考站监考老师评分列表,通过
        scheduleForm: {
          roomId: this.stationData.roomId, //房间id
          sceneId: this.stationData.sceneId, //场次id
          stationId: this.stationData.stationId, //站点id
          teacherId: ''
        },
        scheduleData: [], // 非理论考核数据
        stationPaperData: [], // 理论考核数据
        //获取老师获取考站监考老师列表
        scheduleList: {
          ajaxSuccess: 'scheduleListData',
          ajaxParams: {
            url: this.url.scheduleList.path,
            params: {}
          }
        },

        /*--按钮button--*/
        addId: {
          id: 'addId',
          title: '添加评分'
        },
        editId: {
          id: 'editId',
          title: '修改'
        },
        removeId: {
          id: 'removeId',
          title: '删除'
        },
        viewId: {
          id: 'viewId',
          title: '查看'
        }

      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        console.log(this.stationData);
        if (this.stationData.stationType === 'THEORY') { // 理论考核
          this.getStationPaperList();
        } else { // 非理论考核
          this.setTableData();
        }
      },

      // 获取考站理论成绩列表
      getStationPaperList () {
        let opt = {
          ajaxSuccess: res => this.stationPaperData = res.data || [],
          ajaxParams: {
            url: this.url.stationPaperList.path,
            params: {
              roomId: this.stationData.roomId, //房间id
              sceneId: this.stationData.sceneId, //场次id
              stationId: this.stationData.stationId //站点id
            }
          }
        };
        this.ajax(opt);
      },

      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        this.multipleSelection = val;
      },
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected (isOnly) {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len == 0) {
          this.showMess('请选择数据!');
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess('只能修改一条数据!');
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData (responseData) {
        let data = responseData.data;
        this.teacherData = data;
        if (!data[0]) return;
        //初始化选择老师
        this.selectTeacher(data[0]);
      },
      //获取老师列表
      setTableData () {
        this.teacherList.ajaxParams.params = Object.assign(this.teacherList.ajaxParams.params, this.teacherForm);
        this.ajax(this.teacherList);
      },

      //选择老师获取列表数据
      scheduleListData (responseData) {
        let data = responseData.data;
        this.scheduleData = data;
        // 间隔连接 30s
        atmTime = setTimeout(() => this.selectTeacher(this.selectTeaData), 30000);
      },
      //获取右侧列表 选择老师的时候调用
      selectTeacher (data) {
        this.teacherUserId = data.teacherId;
        clearTimeout(atmTime);
        this.selectTeaData = data;
        this.scheduleForm.teacherId = data.teacherId;
        this.scheduleList.ajaxParams.params = Object.assign(this.scheduleList.ajaxParams.params, this.scheduleForm);
        this.ajax(this.scheduleList);
      },
      //搜索监听回调
      searchEvent (isLoading) {
        //        isLoading(true);
        //        let isSubmit = this.handleSubmit('formValidate');
        //        if(isSubmit){
        this.setTableData();
        //        }
      },

      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit (name) {
        let flag = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            flag = true;
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
        return flag;
      },

      /*--点击--添加--按钮--*/
      addScore (data) {
        clearTimeout(atmTime);
        this.operailityData = data;
        this.openModel('add');
      },
      /*--点击--修改--按钮--*/
      edit (data) {
        clearTimeout(atmTime);
        this.operailityData = data;
        this.openModel('edit');
      },
      /*--点击--删除--按钮--*/
      remove (data) {
        clearTimeout(atmTime);
        data.id = data.scheduleId;
        this.operailityData = [data];
        this.openModel('remove');
      },
      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show (data) {
        data.stationType = this.stationData.stationType; // 记录该考站的考站类型提供查看中对考站类型的检测
        this.operailityData = data;
        this.openModel('show');
      },
      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel (targer) {
        clearTimeout(atmTime);
        this[targer + 'Modal'] = false;
        // this.selectTeacher(this.selectTeaData)
        if (this.stationData.stationType === 'THEORY') {
          this.init();
        } else {
          this.setTableData();
        }
      },
      /*
       * 监听子组件通讯的方法
       * 作用:ajax请求成功回调,该监听方法在libs/util 中的混合模式下定义回调
       * @param targer string example:"add"、"edit"
       * @param targer string 提示返回的ajax回调返回的信息改信息在对应的子组件中定义
       * 例如:errorTitle、errorTitle
       *addMessTitle:{
       *    type:'add',
       *    successTitle:'添加成功!',
       *    errorTitle:'添加失败!',
       *    ajaxSuccess:'ajaxSuccess',
       *    ajaxError:'ajaxError',
       *    ajaxParams:{
       *      url:'/role/add',
       *      method:'post'
       *    }
       *    }
       * @param udata boolean 默认false  是否不需要刷新当前表格数据
       * */
      subCallback (target, title, updata) {
        clearTimeout(atmTime);
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          if (this.stationData.stationType === 'THEORY') {
            this.init();
          } else {
            this.selectTeacher(this.selectTeaData);
          }
        }
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      // 获取头像地址
      getPhotoPath (path) {
        return path && this.$store.getters.getEnvPath.http + path || '/static/image/defAvatar.png';
      }
    },
    created () {
      this.init();
    },
    destroyed () {
      clearTimeout(atmTime);
    },
    components: {
      //当前组件引入的子组件
      addScore,
      edit,
      show
    }
  };

</script>

<style lang="scss">
  @import '~@/assets/ambuf/css/examineMonitor_v1.0/studentInfo';

</style>
