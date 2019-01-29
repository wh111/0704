<template>
  <!-- 考站预览信息 -->
  <div class="roomHoverInfo">
    <div class="basicInfo">
      <span :class="{'noData':!info.stationName}">房间名称：{{ info.stationName || '未填写' }}</span>
      <span class="noData" v-if="!info.timeCount">考试时间：时间未填写</span>
      <span class="noData" v-else-if="!basicsTime">考试时间：考试基数时间未填写</span>
      <span v-else :class="{'noData':!basicsTime}">考试时间：{{ (info.timeCount * basicsTime).toFixed(1) }}分钟</span>
      <span>抽题类型：{{ (info.randomType + '-q') | typeTexts }}</span>
      <!--<span :class="{'noData':!info.number}">单次考核人数：{{ info.number || '未填写' }}</span>-->
      <span :class="{'noData':!room.roomNum}">房间信息：{{ room.roomNum || '未选择房间' }}</span>
      <span>专业：{{ info.specialty || room.specialty || '全部' }}</span>
      <span>是否是SP考站：{{ info.stationType == 'SP' ? '是' : '否' }}</span>
    </div>
    <p class="title"><b>监考老师：</b></p>
    <el-table border show-summary :summary-method="getSummaries" :data="teacher">
      <el-table-column label="监考老师" prop="teacherName" show-overflow-tooltip></el-table-column>
      <el-table-column label="评分表" show-overflow-tooltip v-if="info.stationType !== 'THEORY'">
        <template scope="scope">
          {{ getContentScoreTableText(scope.row.contentScoreTableObj) }}
        </template>
      </el-table-column>
      <el-table-column label="权重" prop="weight">
        <template scope="scope">
          {{ scope.row.weight }}%
        </template>
      </el-table-column>
    </el-table>
    <!--<ul class="teacher">-->
    <!--<template v-if="teacher.length > 0">-->
    <!--<li class="tList" v-for="(item,index) in teacher" :key="index"><span>{{ item.teacherName }}</span><span>{{ item.weight }}%</span>-->
    <!--</li>-->
    <!--</template>-->
    <!--<template v-else>-->
    <!--<li class="noData">还未选择监考老师</li>-->
    <!--</template>-->
    <!--</ul>-->
    <p class="title"><b>考核内容：</b></p>
    <el-table border :data="info.stationContentList" max-height="200px" style="width: 100%">
      <el-table-column prop="contentName" label="内容名称" show-overflow-tooltip>
        <template scope="scope">
          {{ scope.row.contentName || '-' }}
        </template>
      </el-table-column>
      <template v-if="info.stationType === 'THEORY'">
        <el-table-column label="试题数量" width="180" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.paperContentList.length || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="试题总分" width="180" show-overflow-tooltip>
          <template scope="scope">
            <template v-if="scope.row.paperContentList.length">
              {{ getPaperContentScore(scope.row.paperContentList) }}
            </template>
            <template v-else>
              -
            </template>
          </template>
        </el-table-column>
      </template>
      <template v-else>
        <el-table-column prop="scoreTableName" label="评分表" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.scoreTableList | getArrText('scoreTableName') }}
          </template>
        </el-table-column>
        <el-table-column prop="caseName" label="病例" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.caseName || '-' }}
          </template>
        </el-table-column>
      </template>
      <template v-if="info.stationType === 'SP' || info.randomType == 'NO'">
        <template v-if="info.stationType === 'SP'">
          <el-table-column label="剧本" prop="scriptName" show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.scriptName || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="SP评分表" prop="spScoreTableName" show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.spScoreTableName || '-' }}
            </template>
          </el-table-column>
        </template>
        <el-table-column label="考核时间" prop="timeCount" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.timeCount * basicsTime }}
          </template>
        </el-table-column>
      </template>
    </el-table>
    <slot name="footer"></slot>
  </div>
</template>

<script>
  export default {
    props: {
      info: { // 基本信息
        type: Object,
        default: () => {}
      },
      room: { // 房间信息
        type: Object,
        default: () => {}
      },
      teacher: { // 监考老师信息
        type: Array,
        default: () => {}
      },
      basicsTime: {
        type: [String, Number],
        default: 0
      }
    },
    data () {
      return {
        // basicsTime: 0
      };
    },
    methods: {
      // 获取每项理论考核的分数
      getPaperContentScore (row) {
        let sum = 0;
        row.map(item => sum += +item.optionScore);
        return sum;
      },
      getContentScoreTableText (obj) {
        let textArr = [];
        Object.keys(obj).map(key => textArr.push(obj[key].scoreTableName));
        return textArr.join('、') || '未选择评分表';
      },
      // 权重统计
      getSummaries (param) {
        const {
          columns,
          data
        } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            this.sumWeigth = sums[index];
            sums[index] += '%';
          }
        });

        return sums;
      }
    },
    filters: {
      typeTexts (val) {
        const typeNames = { // 声明全局类型描述文本
          // 是否
          'YES': '是',
          'NO': '否',
          // 抽题类型
          'SYSTEM-q': '自动抽题',
          'EXAMINEE-q': '考生抽题',
          'TEACHER-q': '考官随机抽题',
          'TEACHER_SELECT-q': '考官手工抽题',
          'NO-q': '不用抽题',
          // 房间使用类型
          'PRACTISE': '练习',
          'EXAM': '考核',
          'OTHER': '其他',
          // 考核状态
          'NOARRANGED': '未生成轮转表',
          'UNPUBLISH': '未发布',
          'PUBLISH': '已发布',
          'ONGOING': '考核中',
          'FINISH': '考核结束',
          // 考核类型
          'STANDARD': '规范考核',
          'FREE': '自由考核'
        };
        return typeNames[val];
      }
    },
    created () {
      console.log(this.info);
    }
  };

</script>

<style lang="scss">
  @import '../../../../assets/ambuf/css/examineInterval_v1.0/roomHoverInfo';

</style>
