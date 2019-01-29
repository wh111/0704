<!--选择房间-->
<template>
  <div id="content" ref="content" class="modal">
    <el-form ref="formValidate" label-width="100px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="大楼信息" prop="buildingName">
            <el-select v-model="buildId" placeholder="请选择">
              <el-option v-for="item in optionData" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--表格数据-->
    <el-table align="center" :height="400" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%;height: 100%">
      <el-table-column width="100">
        <template scope="scope">
          <el-radio :disabled="scope.row.buildId==build.id && scope.row.id==selectRoom.id" v-model="selectRoomOne" :label="scope.$index">
          {{ ' '}}</el-radio>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="序号" type="index" width="75">
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="no" label="房间号">
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="bedNum" label="床位数">
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="yetBedNum" label="已入住人数">
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="bedCount" label="空床数">
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="sex" label="房间类型">
        <template scope="scope">
          {{scope.row.sex | roomSex}}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="status" label="状态">
      </el-table-column>

    </el-table>
    <div style="margin-left: 100px">
      <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //引入--新建--组件

  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData', 'selectRoom', 'url', 'build','selectRoomData'],
    data() {
      return {
        selectRoomOne:'',
        optionData: [],
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        //查询表单
        buildId: '',
        multipleSelection: [],
        tableData: [],
        loading: false,
        totalCount: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: this.url.queryChangeRoom,
            params: {}
          }
        },

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        buildMessTitle: {
          ajaxSuccess: 'getBuildData',
          ajaxParams: {
            url: this.url.allBuild, //向后台请求数据的地址

          }
        }

      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.ajax(this.buildMessTitle)
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        this.$emit('selectRoom', this.tableData[this.selectRoomOne])
      },

      //初始化请求大楼数据
      getBuildData(responseData) {
        let data = responseData.data;
        this.buildId = data[0].id;
        this.optionData = data;

      },
      //通过get请求列表数据
      updateListData(responseData) {
        let data = responseData.data;
        if(!data) return;
        let flag = true;
        for(let i=0;i<data.length;i++){
            if(data[i].id == this.selectRoomData.id){
              this.selectRoomOne = i;
              flag = false;
            }
        }
        if(flag)this.selectRoomOne = '';
        this.tableData = responseData.data
      },
      setTableData() {

        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions, {
          buildId: this.buildId
        });
        this.ajax(this.listMessTitle);
      },

      //搜索监听回调
      searchEvent(isLoading) {
        //        isLoading(true);
        let isSubmit = this.handleSubmit('formValidate');
        if (isSubmit) {
          this.setTableData()
        }
      },


      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name) {
        let flag = false
        this.$refs[name].validate((valid) => {
          if (valid) {
            flag = true;
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
        return flag
      },


      /*--点击--添加--按钮--*/
      add() {
        this.openModel("add");
      },

      /*--点击--批量添加--按钮--*/
      batchAdd() {
        this.openModel("batchAdd");
      },


      /*--点击--修改--按钮--*/
      edit(data) {
        this.operailityData = data;
        this.openModel("edit");
      },
      /*--点击--删除--按钮--*/
      remove() {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('remove');
      },
      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(data) {
        this.operailityData = data;
        this.openModel("show");
      },
      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer) {
        this.$emit('cancel', 'selectRoom')
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
      subCallback(target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },

    },
    created() {
      this.init();
    },
    components: {
      //当前组件引入的子组件
    },
    watch: {
      buildId(val) {
        this.setTableData();
      }
    }

  }

</script>
