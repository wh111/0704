<!----------------------------------
****--@name     培养计划审核
****--@role     教育处
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
    <div id="content" ref="content">
      <!--搜索form-->
      <el-form :inline="true" :model="formInline" :rules="queryAudit" class="demo-form-inline">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formInline.name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="专业方向">
          <el-select v-model="formInline.major" placeholder="">
            <el-option label="内科学" value="100201"></el-option>
            <el-option label="神经病学" value="100204"></el-option>
            <el-option label="外科学" value="100210"></el-option>
            <el-option label="妇产科学" value="100211"></el-option>
            <el-option label="肿瘤学" value="100214"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formInline.status" placeholder="">
            <el-option label="全部" value=""></el-option>
            <el-option label="待审核" value="AUDIT"></el-option>
            <el-option label="通过" value="ADOPT"></el-option>
            <el-option label="驳回" value="NOTPASS"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>

      <!--列表操作按钮-->

      <div style="margin-bottom: 20px;">
        <el-button v-if="isPass" type="primary" @click="auditing('ADOPT')">审核通过</el-button>
        <el-button v-else type="primary" :disabled="true">审核通过</el-button>
        <el-button v-if="isNotpass" type="danger" @click="auditing('NOTPASS')">审核不通过</el-button>
        <el-button v-else type="danger" :disabled="true">审核不通过</el-button>
      </div>

      <!--- 培养计划列表 --->
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
              width="55">
            </el-table-column>
            <el-table-column
              align="center"
              label="序号"
              prop="index"
              width="100">
              <template scope="scope">
                <span>{{scope.row.index}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="160">
              <template scope="scope">
                <el-button size="small" @click="lookUp(scope.row)">查看</el-button>
                <el-button v-if="scope.row.status == 'AUDIT' " size="small" @click="revise(scope.row)">审核</el-button>
                <el-button v-else size="small" @click="revise(scope.row)" :disabled="true">审核</el-button>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="name"
              label="姓名">
            </el-table-column>
            <el-table-column
              prop="teacher"
              label="指导老师">
            </el-table-column>
            <el-table-column
              prop="major"
              label="专业方向"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="school"
              label="所在学院"
            >
            </el-table-column>
            <el-table-column
              prop="direction"
              label="研究方向"
            ></el-table-column>
            <el-table-column
              prop="statusStr"
              label="状态"
            >
              <template scope="scope">
                {{scope.row.status | typeText}}
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
        <!--查看弹窗-->
        <Modal
          :mask-closable="false"
          v-model="showModal"
          height="200"
          title="对话框标题"
          class-name="vertical-center-modal"
          :loading="true"
          :width="800"
        >
          <modal-header slot="header" :parent="self" :content="showId"></modal-header>
          <show v-if="showModal"  @cancel="cancel" :operaility-data="operailityData"></show>
          <div slot="footer"></div>
        </Modal>
        <Modal
          :mask-closable="false"
          v-model="editModal"
          height="200"
          title="对话框标题"
          class-name="vertical-center-modal"
          :loading="true"
          :width="800">
          <modal-header slot="header" :parent="self" :content="reviseId"></modal-header>
          <revise v-if="editModal" :showState="changeState" @edit="subCallback" @cancel="cancel" :operaility-data="operailityData1"></revise>
          <div slot="footer"></div>
        </Modal>
      </div>

    </div>
</template>
<script>
    /*当前组件必要引入*/
    import api from '../api'
    //引入查看组件
    import show from "../components/lookUp.vue";
    //引入--修改--组件
    import revise from "../components/revise.vue";
    //引入验证规则
//    import {queryAudit} from '../rules';
    //当前组件引入全局的util
    let Util = null;
    export default{
        data() {
            return {
              queryAudit:{},
              formInline:{
                name:'',
                major:'',
                status:''
              },
              isPass:true,
              isNotpass:true,
              operailityData:{},
              operailityData1:{},
              multipleSelection: [],
              dynamicHt: 100,
              self: this,
              loading:false,
              listTotal:0,
              tableData1 : [],
              showId:{
                id:'auditId',
                title:'查看'
              },
              reviseId:{
                id:'auditId',
                title:'审核'
              },
              listMessTitle:{
                ajaxSuccess:'successGetList',
                ajaxParams:{
                  url:api.getPlanlist.path,
                  params:{
                    name:"",
                    major:""
                  }
                }
              },
            }
        },
        methods: {
            //初始化请求列表数据
            init(){
              Util = this.$util;
              //ajax请求参数设置
              this.myPages =  Util.pageInitPrams;
              this.queryQptions = {
                //url:this.listUrl,
                params:{curPage: 1,pageSize: Util.pageInitPrams.pageSize}
              }
              this.setTableData()
            },
            setTableData () {
              this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.queryQptions.params);
              this.ajax(this.listMessTitle);
            },
            successGetList (res){
              let data = res.data;
              data = this.addIndex(data);
              this.tableData1 = data;
              this.listTotal = res.totalCount;
            },

        //设置表格及分页的位置
          setTableDynHeight(){
            let content = this.$refs.content;
            let parHt = content.parentNode.offsetHeight;
            let myTable = this.$refs.myTable;
            let paginationHt = 50;
            this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
          },

          /*
         * checkbox 选择后触发事件
         * @param val Array 存在所有的选择每一个行数据
         */
          handleSelectionChange(val) {
            this.multipleSelection = val;
            if(this.multipleSelection.length > 0){
              for(let i = 0; i < this.multipleSelection.length; i++){
                if(this.multipleSelection[i].status == 'AUDIT'){
                  this.isPass = true;
                  this.isNotpass = true;
                }else{
                  this.isPass = false;
                  this.isNotpass = false;
                }
              }
            }else{
              this.isPass = true;
              this.isNotpass = true;
            }

          },
          /*
           * 列表数据只能选择一个
           * @param isOnly true  是否只选择一个
           */
          isSelected(isOnly){
            let len = this.multipleSelection.length;
            let flag = true;
            if(len==0){
              this.showMess("请选择数据!");
              flag = false;
            }
            if(len>1 && isOnly){
              this.showMess("只能修改一条数据!")
              flag = false;
            }
            return flag;
          },

          /**
           * 页面列表查询
           */
          onSubmit(){
            this.queryQptions = {
              //url:this.listUrl,
              params:{curPage: 1,pageSize: Util.pageInitPrams.pageSize,name : this.formInline.name,major : this.formInline.major,status : this.formInline.status}
            }
            this.setTableData()
          },
          //状态修改
          auditing(status){
              this.$confirm('确定进行该操作吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                let arr = [];
                let that = this;
                if(this.multipleSelection.length > 0){
                  for( let i = 0; i<this.multipleSelection.length; i++){
                    arr.push(this.multipleSelection[i].id);
                  }
                  let ids = arr.join();
                  this.ajax({
                    ajaxParams: {
                      url: api.examinePlan.path ,
                      method: api.examinePlan.method,
                      data:{
                        status:status,
                        ids:ids,
                      }
                    },
                    ajaxSuccess: res => {
                      if(res.status.code == 0){
                        that.$message({
                          type: 'info',
                          message: '操作成功'
                        });
                        that.init()
                      }
                    }
                  })
                }
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '操作失败'
                });
              });

          },

          /*
         * 监听子组件通讯的方法
         * 作用:根据不同的参数关闭对应的模态
         * @param targer string example:"add"、"edit"
         * */
          cancel(targer){
            this[targer+'Modal'] = false;
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
          subCallback(target,title,updata){
            this.cancel(target);
            if(title){
              this.successMess(title);
            }
            if(!updata){
              this.setTableData();
            }
          },
          /*
           * 打开指定的模态窗体
           * @param options string 当前指定的模态:"add"、"edit"
           * */
          openModel(options){
            this[options+'Modal'] = true;
          },
          /*
            * 查看培养计划得回掉函数
           */

          lookUp (row){
            this.operailityData = row;
            this.showModal = true;
          },
          revise (row){
            this.operailityData1 = row;
            this.editModal = true;
          },
          changeState (data){
            console.log(data)
          }


        },
        created(){
            this.init();
        },
        mounted(){
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
          show,revise
        }
    }
</script>
