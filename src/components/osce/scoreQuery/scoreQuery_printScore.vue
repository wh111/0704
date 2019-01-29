<!--
****--@file     scoreQuery_printScore
****--@date     2018/5/22 11:50
****--@author   YC
****--@describe 打印评分表
-->
<template>
  <div>
    <el-row class="printScoreItem printPageNext" v-for="(item,index) in showData" :key="index">
      <h2 align="center">{{ item.sceneName }}</h2>
      <el-form>
        <el-col :span="8">
          <el-form-item label="考生姓名：">{{ item.userName }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="学号：">{{ item.userNum }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="得分：">{{ item.totalMark }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item><b>{{ item.stationName }}</b></el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item><b>{{ item.contentName }}(满分{{ item.totalScore }})</b></el-form-item>
        </el-col>
      </el-form>
      <table width="100%" border="0" cellspacing="5" cellpadding="5" style="table-layout: fixed;border: 1px solid #dfe6ec;">
        <thead>
        <tr>
          <th bgcolor="#eef1f6" style="width: 20%;padding: 8px;text-align: center;min-width: 80px;line-height: 30px;border: 1px solid #dfe6ec;">项目</th>
          <th bgcolor="#eef1f6" style="width: 60%;padding: 8px;text-align: center;min-width: 80px;line-height: 30px;border: 1px solid #dfe6ec;">评分标准及要求</th>
          <th bgcolor="#eef1f6" style="width: 10%;padding: 8px;text-align: center;min-width: 80px;line-height: 30px;border: 1px solid #dfe6ec;">满分</th>
          <th bgcolor="#eef1f6" style="width: 10%;padding: 8px;text-align: center;min-width: 80px;line-height: 30px;border: 1px solid #dfe6ec;">得分</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(dataItem,index) in item.detailsList" :key="index">
          <td style="padding: 8px;line-height: 30px;border: 1px solid #dfe6ec;">{{dataItem.classify}}</td>
          <td style="padding: 8px;line-height: 30px;border: 1px solid #dfe6ec;">{{dataItem.content}}</td>
          <td style="padding: 8px;line-height: 30px;border: 1px solid #dfe6ec;">{{dataItem.score}}</td>
          <td style="padding: 8px;line-height: 30px;border: 1px solid #dfe6ec;">{{dataItem.mark}}</td>
        </tr>
        <tr>
          <td style="padding: 8px;line-height: 30px;border: 1px solid #dfe6ec;">总分</td>
          <td style="padding: 8px;line-height: 30px;border: 1px solid #dfe6ec;">&nbsp;</td>
          <td style="padding: 8px;line-height: 30px;border: 1px solid #dfe6ec;">{{item.totalScore}}</td>
          <td style="padding: 8px;line-height: 30px;border: 1px solid #dfe6ec;">{{item.totalMark}}</td>
        </tr>
        </tbody>
      </table>
      <template v-if="item.deductList.length">
        <br>
        <table width="100%" border="0" cellspacing="5" cellpadding="5" style="table-layout: fixed;border: 1px solid #dfe6ec;">
          <thead>
          <tr>
            <th bgcolor="#eef1f6" style="width: 20%;padding: 8px;text-align: center;min-width: 80px;line-height: 30px;border: 1px solid #dfe6ec;">项目</th>
            <th bgcolor="#eef1f6" style="width: 60%;padding: 8px;text-align: center;min-width: 80px;line-height: 30px;border: 1px solid #dfe6ec;">扣分标准及要求</th>
            <th bgcolor="#eef1f6" style="width: 10%;padding: 8px;text-align: center;min-width: 80px;line-height: 30px;border: 1px solid #dfe6ec;">分数</th>
            <th bgcolor="#eef1f6" style="width: 10%;padding: 8px;text-align: center;min-width: 80px;line-height: 30px;border: 1px solid #dfe6ec;">扣分</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(dataItem,index) in item.deductList" :key="index">
            <td style="padding: 8px;line-height: 30px;border: 1px solid #dfe6ec;">{{dataItem.classify}}</td>
            <td style="padding: 8px;line-height: 30px;border: 1px solid #dfe6ec;">{{dataItem.content}}</td>
            <td style="padding: 8px;line-height: 30px;border: 1px solid #dfe6ec;">{{dataItem.score}}</td>
            <td style="padding: 8px;line-height: 30px;border: 1px solid #dfe6ec;">{{dataItem.mark ? '✔' : ''}}</td>
          </tr>
          </tbody>
        </table>
      </template>
      <el-col align="right" class="teacherScoreFooter">
        <div class="teacherScoreAutograph">
          考官签名：
          <div>
            <img :src="getPhotoPath(item.signImage)" alt="">
          </div>
        </div>
        <p>记录日期：{{ item.endTime | formatDate('yyyy年MM月dd日') }}</p>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss">
  .teacherScoreFooter {
    padding-right: 30px;
  }

  .teacherScoreAutograph {
    padding: 8px;
    div {
      width: 130px;
      display: inline-block;
    }
    img {
      max-height: 60px;
    }
  }

  .printScoreItem + .printScoreItem {
    margin-top: 30px;
  }
</style>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'scoreQueryPrintScore',
    props: {
      printData: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        showData: [
//          {
//            'userName': '考生姓名',
//            'userNum': '考生编号',
//            'stationName': '考站名称',
//            'contentName': '考核内容名称',
//            'teacherName': '教师姓名',
//            'signImage': '签名图片地址',
//            'endTime': '考核结束时间2018-05-07',
//            'scoreTableId': '1',
//            'scheduleId': '1',
//            'markId': '1',
//            'caseName': '儿科评分表',
//            'totalScore': '100',
//            'totalMark': '50',
//            'evaluate': '',
//            'detailsList': [
//              {
//                'tableDetailsId': '1',
//                'classify': '分类',
//                'content': '考核内容',
//                'score': '5',
//                'detailOrder': '1',
//                'scheduleDetailsId': '1',
//                'mark': '2.5'
//              }
//            ]
//          }
        ]
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        let arr = this.$util._.defaultsDeep([], this.printData);
        arr.map(item => {
          let temp = item;
          let deductListArr = []; // 扣分项
          let detailsListArr = []; // 评分项
          (temp.detailsList || []).map(cItem => Array.push.call(null, cItem.isPoints ? deductListArr : detailsListArr, cItem));
          temp.detailsList = detailsListArr;
          temp.deductList = deductListArr;
        });
        this.showData = arr;
      },
      // 获取头像地址
      getPhotoPath (path) {
        return path && this.$store.getters.getEnvPath.http + path || '';
      }
    },
    watch: {
      printData () {
        this.init();
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  };

</script>
