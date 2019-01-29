<!----------------------------------
****--@name     培训工作量
****--@role     ${*}
****--@date     2017/12/7
****--@author   gx
----------------------------------->
<template>
    <div>
      <el-table
        align="center"
        :data="tableData"
        tooltip-effect="dark"
        highlight-current-row
        border
        style="width: 100%;height: 100%">
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="75">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="require"
          label="要求例数">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="frequency"
          label="实际完成次数">
          <template scope="scope">
            <span :style="{color:(+scope.row.frequency==+scope.row.require||+scope.row.frequency>+scope.row.require)?'#34FF3E':'#fa5180'}">{{+scope.row.frequency}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>
<script>
    /*当前组件必要引入*/

    //当前组件引入全局的util
    let Util = null;
    export default {
      props:['operailityData'],
        data() {
            return {
              tableData:[],
              //教学查房
              teachingRounds:[
                {
                  name:'鼻出血',
                  require:1,
                  frequency:1,
                },
                {
                  name:'胃癌术后治疗护理',
                  require:2,
                  frequency:2,
                },
              ],
              //小讲座
              miniLecture:[
                {
                  name:'急性胰腺炎',
                  require:'2',
                  frequency:'2',
                },
                {
                  name:'甲状腺癌治疗规范',
                  require:'3',
                  frequency:'3',
                },
              ],
              //病例讨论
              caseDiscussion:[
                {
                  name:'急性胆源性胰腺炎',
                  require:'3',
                  frequency:'3',
                },
                {
                  name:'急性胆源性胰腺炎',
                  require:'2',
                  frequency:'2',
                },
              ],
              //技能培训
              skillTraining:[
                {
                  name:'胸腔穿刺',
                  require:'3',
                  frequency:'3',
                },
                {
                  name:'胸腔穿刺',
                  require:'2',
                  frequency:'2',
                },
                {
                  name:'氧疗',
                  require:10,
                  frequency:8,
                },
              ],
            }
        },
        methods: {
            //初始化请求列表数据
            init() {
              if(this.operailityData.datum){
                this.tableData = this[this.operailityData.datum];
              }

            },

        },
        created() {
            this.init();
        },
        mounted() {
        },
        computer:{

        },
        components: {}
    }
</script>
