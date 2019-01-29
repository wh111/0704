<template>
  <!-- 教学质量评价表 - 管理 -->
  <div class="tqviMange">
    <el-row>
      <el-col>
        <el-form :inline="true" class="tqviMangeScore">
          <el-form-item label="总体得分：">{{ viewData.ztdf }}</el-form-item>
          <el-form-item label="最高得分：">{{ viewData.zgdf }}</el-form-item>
          <el-form-item label="最低得分：">{{ viewData.zddf }}</el-form-item>
        </el-form>
      </el-col>
      <el-col class="tqviMangeItem">
        <h3>分数组成</h3>
        <el-table :data="scoreData" style="width: 100%">
          <el-table-column prop="user" label="打分">

          </el-table-column>
          <el-table-column prop="df" label="打分">
            <template scope="scope">
              {{ scope.row.df || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="dfrs" label="打分人数">
            <template scope="scope">
              {{ scope.row.dfrs || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="qz" label="权重">
            <template scope="scope">
              {{ scope.row.qz || '-' }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col class="tqviMangeItem">
        <el-tabs v-model="showTypes" @tab-click="initViewData">
          <el-tab-pane label="学生" name="xs"></el-tab-pane>
          <el-tab-pane label="同行" name="th"></el-tab-pane>
          <el-tab-pane label="上级" name="sj"></el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col>
        <h3>意见或者建议</h3>
        <template v-if="fkList.length">
          <el-col v-for="(item,index) in fkList" :key="index">
            <p class="tqvijkItem">{{ index + 1 }}. {{ item }}</p>
          </el-col>
        </template>
        <p v-else class="tqviMangeTips">暂无</p>
      </el-col>
      <el-col class="tqviMangeItem">
        <h3>各项分数</h3>
        <el-table ref="singleTable" :data="optionList" style="width: 100%">
          <el-table-column type="index" label="编号" width="70">
          </el-table-column>
          <el-table-column property="title" label="项目" oshow-overflow-tooltip>
          </el-table-column>
          <el-table-column property="remark" label="内容" width="120">
          </el-table-column>
          <el-table-column property="great" label="优">
            <template scope="scope">
              <el-radio-group v-model="scope.row.pjdf">
                <el-radio :label="scope.row.great">{{ scope.row.great }}</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column property="good" label="良">
            <template scope="scope">
              <el-radio-group v-model="scope.row.pjdf">
                <el-radio :label="scope.row.good">{{ scope.row.good }}</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column property="avg" label="中">
            <template scope="scope">
              <el-radio-group v-model="scope.row.pjdf">
                <el-radio :label="scope.row.avg">{{ scope.row.avg }}</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column property="bad" label="差">
            <template scope="scope">
              <el-radio-group v-model="scope.row.pjdf">
                <el-radio :label="scope.row.bad">{{ scope.row.bad }}</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import api from './api';
  export default {
    data() {
      return {
        showTypes: 'xs',
        scoreData: [],
        fkList: [],
        optionList: [],
        viewData: {
          ztdf: "-", // 总体得分
          zgdf: "-", // 最高得分
          zddf: "-", // 最低得分
          xs: { // 学生
            df: "", // 打分
            qz: '', // 权重
            dfrs: '', // 打分人数
            fkList: [], // 意见或建议 的集合
            optionList: [] // 评价项 集合
          },
          th: { // 同行
            df: "", // 打分
            qz: '', // 权重
            dfrs: '', // 打分人数
            fkList: [], // 意见或建议 的集合
            optionList: [] // 评价项 集合
          },
          sj: { // 上级
            df: "", // 打分
            qz: '', // 权重
            dfrs: '', // 打分人数
            fkList: [], // 意见或建议 的集合
            optionList: [] // 评价项 集合
          },
        }
      }
    },
    methods: {
      init() {
        this.initView();
      },
      // 初始化数据
      initView() {
        let opt = {
          ajaxSuccess: res => {
              if(res.data[0]) {
                  this.viewData = res.data[0]
              }
              this.initViewData()

          },
          ajaxParams: {
            url: api.get.path,
            params: {
              courseId: this.$store.state.curriculum.look.course.id
            }
          }
        };
        this.ajax(opt)
      },
      // 初始化查看数据
      initViewData() {
        this.initScoreData()
        this.fkList = this.viewData[this.showTypes].fkList;
        this.optionList = this.viewData[this.showTypes].optionList;
      },
      // 初始化打分组成
      initScoreData() {
        let temp = [];
        let user = ['xs', 'th', 'sj'];
        let userText = ['学生', '同行', '上级'];
        this.$util._.mapKeys(user, (val, index) => {
          temp.push({
            user: userText[index], // 用户角色
            df: this.viewData[val].df || '', // 打分
            dfrs: this.viewData[val].dfrs || 0, // 打分人数
            qz: this.viewData[val].qz || '', // 权重
          })
        })
        this.scoreData = temp;
      }
    },
    created() {
      this.init()
    }
  }

</script>

<style lang="scss">
  /* 教学质量评价表管理 */

  .tqviMangeScore {
    .el-form-item {
      margin-bottom: 0;
    }
  }

  .tqviMangeItem {
    margin-top: 16px;
  }

  .tqviMangeTips,
  .tqvijkItem {
    line-height: 32px;
  }

</style>
