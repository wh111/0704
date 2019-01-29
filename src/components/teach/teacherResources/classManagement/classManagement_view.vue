<template>

  <div class="showWrapper">
    <el-form class="demo-form-inline">

      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="科室:" class="feildFontweight">
            {{showData.deptName}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="姓名:" class="feildFontweight">
            {{showData.teachName}}
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item label="职称:" class="feildFontweight">
            {{showData.teachTitle}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="课程类型:" class="feildFontweight">
            {{showData.courseTypes}}
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item label="总课时:" class="feildFontweight">
            {{showData.totalHour}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="评分:" class="feildFontweight">
            {{showData.score}}
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item label="评价结果:" class="feildFontweight">
            {{showData.evaluateResult}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="单次课时费:" class="feildFontweight">
            {{showData.cost}}
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item label="应付:" class="feildFontweight">
            {{showData.totalFee}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="支付时间:" class="feildFontweight">
            {{showData.payTimes |formatDate('yyyy-MM-dd')}}
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item label="状态:" class="feildFontweight">
            {{showData.payStatus | payStatus}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row >
          <el-col :span="20" :offset="2">


            <fieldset class="layui-elem-field">
              <legend>评分情况</legend>
              <el-row >
                <el-col :span="4" :offset="20">
                  <el-button @click="classFee">课时费标准</el-button>
                </el-col>
              </el-row >
              <div class="layui-field-box">
                <!--&lt;!&ndash;表格数据&ndash;&gt;-->
                <el-table
                  align="center"
                  :data="evaluate"
                  tooltip-effect="dark"
                  highlight-current-row
                  style="width: 100%;height:100%"
                >
                  <el-table-column
                    prop="evaluatedName"
                    label="评价对象">
                  </el-table-column>
                  <el-table-column
                    prop="sumScore"
                    label="总分"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="num"
                    label="人数"
                  >
                  </el-table-column>
                  <!--<el-table-column-->
                    <!--prop="type"-->
                    <!--label="权重">-->
                  <!--</el-table-column>-->
                  <el-table-column
                    prop="average"
                    label="平均分">
                  </el-table-column>
                </el-table>
              </div>

              <el-row >
                <el-col :span="4" :offset="1">
                  <el-form-item label="评分:" class="feildFontweight">
                    {{showData.score}}
                  </el-form-item>
                </el-col>

                <el-col :span="4" >
                  <el-form-item label="结果:" class="feildFontweight">
                    {{showData.evaluateResult}}
                  </el-form-item>
                </el-col>
              </el-row >
            </fieldset>
          </el-col>
        </el-row >

      <el-row >
          <el-col :span="20" :offset="2">
            <fieldset class="layui-elem-field">
              <legend>课程情况</legend>
              <div class="layui-field-box">
                <!--&lt;!&ndash;表格数据&ndash;&gt;-->
                <el-table
                  align="center"
                  :data="course"
                  tooltip-effect="dark"
                  highlight-current-row
                  style="width: 100%;height: 100%"
                >
                  <el-table-column
                    prop="courseDateCreateTime"
                    label="时间">
                  </el-table-column>
                  <el-table-column
                    prop="timeInfo"
                    label="起始时间"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="totalHour"
                    label="课时">
                  </el-table-column>
                  <el-table-column
                    prop="classNum"
                    label="班级">
                  </el-table-column>
                  <el-table-column
                    prop="courseAddress"
                    label="地点">
                  </el-table-column>
                  <el-table-column
                    prop="teacherUserName"
                    label="授课教师">
                  </el-table-column>
                </el-table>
              </div>
            </fieldset>

          </el-col>
        </el-row >

    </el-form>

    <div>
      <!--课时费标准弹窗-->
      <Modal
        close-on-click-modal="false"
        width="1000"
        v-model="classFeeModal"
        title="导出"
        style="height:600px;"
        class-name="vertical-center-modal">
        <modal-header slot="header" :content="classFeeId"></modal-header>
        <classFee v-if="classFeeModal"  style="height:500px;" viewType="classManagement" :operaility-data="operailityData"></classFee>
        <div slot="footer"></div>
      </Modal>
    </div>
  </div>
</template>
<script>
  import classFee from '../classSetting/classSetting_list.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data() {
      return {
        classFeeId: {id: 'classFeeId', title: '课时费标准'},
        classFeeModal: false,
        tableData1: [{"id": 1}],
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        showData: {},
        course:[], //课程
        evaluate:[], //评分
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: '/teachFee/get/' + this.operailityData.id,
          }
        }
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted() {
      //初始化
      this.init();
    },
    methods: {
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData) {
        let data = responseData.data;
        this.showData = data;
        if(data.course){
          this.course =[data.course];
        }
        if(data.evaluate){
          this.evaluate = [data.evaluate];
        }
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'show');
      },
      /*
       * 组件初始化入口
       * */
      init() {
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },


      //课时费标准点击
      classFee() {
        this.classFeeModal = true;
      },
    },
    components: {
      classFee
    }
  }
</script>
<style>
  .showWrapper {
    height: 100%;
    padding: 20px;
    border: 1px solid #eee;
  }

  .feildFontweight {
    font-weight: bold;
  }
</style>
