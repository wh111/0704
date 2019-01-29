<!--评优项目管理-->

<template>
  <div id="nosocomial" ref="nosocomial" class="modal">
    <el-form ref="data" class="demo-form-inline" label-width="100px">
      <fieldset class="layui-elem-field">
        <legend>基本情况</legend>
        <div class="layui-field-box">
          <el-row class="table-back-one">
            <el-col :span="7" :offset="1">
              <el-form-item label="姓名:" prop="name" class="feildFontweight">
                {{showData.name}}
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="性别:" prop="name" class="feildFontweight">
                {{showData.sex | typeText }}
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="出生年月:" prop="name" class="feildFontweight">
                {{showData.birth}}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="table-back-two">
            <el-col :span="7" :offset="1">
              <el-form-item label="政治面貌:" prop="name" class="feildFontweight">
                {{showData.political}}
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="民族:" prop="name" class="feildFontweight">
                {{showData.nation}}
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="年级:" prop="name" class="feildFontweight">
                {{showData.grade}}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="table-back-one">
            <el-col :span="7" :offset="1">
              <el-form-item label="专业:" prop="name" class="feildFontweight">
                {{showData.specialty}}
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="学制:" prop="name" class="feildFontweight">
                {{showData.length}}
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="联系电话:" prop="name" class="feildFontweight">
                {{showData.mobile }}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="table-back-two-d">
            <el-col :span="21" :offset="1">
              <el-form-item label="身份证号:" prop="name" class="feildFontweight">
                {{showData.idNumber }}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </fieldset>

      <fieldset class="layui-elem-field">
        <legend>家庭经济情况</legend>
        <div class="layui-field-box">
          <el-row class="table-back-one">
            <el-col :span="7" :offset="1">
              <el-form-item label="家庭月总收入:" prop="name" class="feildFontweight">
                {{showData.grossIncome}}
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="人均月收入:" prop="name" class="feildFontweight">
                {{showData.averageIncome}}
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="收入来源:" prop="name" class="feildFontweight">
                {{showData.sourceIncome}}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="table-back-two">
            <el-col :span="11" :offset="1">
              <el-form-item label="家庭户口:" prop="name" class="feildFontweight">
                {{showData.registerType | typeText}}
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="家庭总人数:" prop="name" class="feildFontweight">
                {{showData.peopleNum}}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="table-back-one-d">
            <el-col :span="11" :offset="1">
              <el-form-item label="家庭住址:" prop="name" class="feildFontweight">
                {{showData.address}}
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item label="邮政编码:" prop="name" class="feildFontweight">
                {{showData.postCode}}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </fieldset>

      <fieldset class="layui-elem-field">
        <legend>学习等情况</legend>
        <div class="layui-field-box">
          <el-row class="table-back-one">
            <el-col :span="11" :offset="1">
              <el-form-item label="成绩排名:" prop="name" class="feildFontweight">
                {{showData.scoreRank}}
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="实行综合考评排名:" prop="name" class="feildFontweight">
                {{showData.isComprehensive}}
              </el-form-item>
            </el-col>

          </el-row>

          <el-row class="table-back-two-d" style="line-height: 36px">
            <el-col :span="11" :offset="1">
              必修课
              <span class="underline">{{showData.courseNum}}</span> 门，其中及格以上
              <span class="underline">{{showData.passNum}}</span> 门
            </el-col>
            <el-col :span="10">
              如是，排名
              <span class="underline">{{showData.comprehensiveRank}}</span> （名次/总人数）
            </el-col>
          </el-row>

        </div>
      </fieldset>

      <fieldset class="layui-elem-field">
        <legend>获奖情况</legend>
        <el-row>
          <el-col :span="21" :offset="1">
            <div class="layui-field-box">
              <div id="nosocomialTable" ref="nosocomialTable">
                <el-table align="center" :height="200" :data="showData.awardList" tooltip-effect="dark"
                          style="width: 100%">
                  <el-table-column prop="winTime" label="日期" align="center" show-overflow-tooltip width="200">
                  </el-table-column>
                  <el-table-column prop="awardSituation" label="奖项名称  " show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="awardUnit" label="颁奖单位" width="200" show-overflow-tooltip>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-col>
        </el-row>
      </fieldset>

      <fieldset class="layui-elem-field ">
        <legend>申请理由</legend>
        <div class="layui-field-box">
          <el-row>
            <el-col :span="21" :offset="1">
              <el-form-item prop="name" class="feildFontweight" label-width="0px">
                <el-input type="textarea" v-model="showData.reason" :rows="8" readonly resize="none"></el-input>
              </el-form-item>
            </el-col>

          </el-row>
        </div>
      </fieldset>
      <br>
      <!--教育处查看的时候不显示审核信息-->
      <div v-if="!~['WSB','DSH'].indexOf(showData.status)">
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="审核结果:" prop="name" class="feildFontweight">
              {{showData.status | typeText }}
            </el-form-item>
          </el-col>

          <el-col :span="10" :offset="1">
            <el-form-item label="发放金额:" prop="name" class="feildFontweight">
              {{showData.bonusAmount}}
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="21" :offset="1">
            <el-form-item label="审批意见:" prop="name" class="feildFontweight">
              <el-form-item prop="opinion" class="feildFontweight" label-width="0px">
                <el-input type="textarea" v-model="showData.opinion" :rows="5" readonly resize="none"></el-input>
              </el-form-item>
            </el-form-item>
          </el-col>

        </el-row>

      </div>
    </el-form>
  </div>
</template>

<script>
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  let store = null;
  export default {
    props: ['operailityData', 'isStudy'],
    data() {
      return {
        showData: {
          "id": "", //奖学金申请id
          "userId": "", //申请人id
          "name": "", //申请人姓名
          "sex": "", //性别
          "nation": "", //民族
          "birth": "", //出生年月日
          "political": "", //政治面貌
          "specialty": "", //专业
          "length": "", //学制
          "mobile": "", //联系电话
          "idNumber": "", //身份证号
          "grade": "", //年级
          registerType: '', //家庭户口类型
          peopleNum: '', //家庭人口
          grossIncome: '', //家庭月总收入
          averageIncome: '', //人均月收入
          sourceIncome: '', //收入来源
          address: '', //家庭住址
          postCode: '', //邮政编码
          scoreRank: '', //成绩排名
          "isComprehensive": "", //是否有综合排名
          comprehensiveRank: '', //综合排名
          courseNum: '', //必修课数量
          passNum: '', //是否实行综合排名
          reason: '', //申请理由
          "bonusAmount": "",
          "status": "",
          "opinion": "",
          "awardList": [
//            {
//              "id": "",
//              "bursaryId": "",
//              "winTime": "",
//              "awardSituation": "",
//              "awardUnit": ""
//            }
          ]
        },
        showModal: false,
        multipleSelection: [],
        listMessTitle: {
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: {
            url: api.get.path + (this.operailityData.bursaryId || this.operailityData.id),
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
          curPage: 1,
          pageSize: Util.pageInitPrams.pageSize
        }

        this.setTableData();
      },


      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },


      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected(isOnly) {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len == 0) {
          this.showMess("请选择数据!");
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess("只能修改一条数据!")
          flag = false;
        }
        return flag;
      },


      /*
       *点击姓名，查看信息
       *
       * */

      show() {
        this.showModal = true;
      },


      //通过get请求列表数据
      listDataSuccess(res) {
        this.showData = res.data
      },
      setTableData(isLoading) {
        this.ajax(this.listMessTitle, isLoading)
      },


    },
    created() {
      this.init();
    },


  }

</script>

