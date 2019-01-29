<template>
  <div>
    <el-row>
      <el-col :span="10">
        <el-date-picker v-model="dateGroup.teachingBeginTime" :type="type" :editable="false" placeholder="选择日期"
                        :picker-options="date==='week'?pickerOptions:pickerOptions0" @change="handleStartTime"
                        style="width:130px;">
        </el-date-picker>
      </el-col>
      <el-col :span="4">
        <!--{{'到'}}-->
        <div style="float:none; text-align: center; padding-top: 10px">到</div>
      </el-col>
      <el-col :span="10">
        <el-date-picker v-model="dateGroup.teachingEndTime" align="right" :editable="false" :type="type" placeholder="选择日期"
                        :picker-options="date==='week'?endOptions:endOptions0"
                        @change="handleEndTime" style="width:130px;">
        </el-date-picker>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    props: ["dateGroup", 'type', 'date'],
    data() {
      return {
        pickerOptions0: {
          disabledDate:(time)=> {
            let endTime = this.dateGroup.teachingEndTime&& (typeof this.dateGroup.teachingEndTime==='string'?this.parseDate(this.dateGroup.teachingEndTime,'yyyy-MM-dd').getTime() : this.dateGroup.teachingEndTime.getTime());
            // let endTime = this.dateGroup.teachingEndTime&& parseInt(this.dateGroup.teachingEndTime) != NAN ?this.parseDate(this.dateGroup.teachingEndTime,'yyyy-MM-dd').getTime() : this.dateGroup.teachingEndTime.getTime();
            let currentTime=time.getTime();
            let currentDate = time.getDate()
            return endTime?(currentTime>endTime|| currentDate !== 1 && currentDate !== 16): (currentDate !== 1 && currentDate !== 16);
          }
        },
        endOptions0:{
          disabledDate:(time)=> {
            let startTime = this.dateGroup.teachingBeginTime&& (typeof this.dateGroup.teachingBeginTime==='string'?this.parseDate(this.dateGroup.teachingBeginTime,'yyyy-MM-dd').getTime() : this.dateGroup.teachingBeginTime.getTime());
            let currentTime=time.getTime();
            let currentDate = time.getDate()//保存当前时间
            let lastDate = new Date(time.setMonth(time.getMonth()+1,0)).getDate()//改变时间,获取最后一天
            return startTime?(startTime>currentTime||currentDate != 15&& currentDate != lastDate) :(currentDate != 15&& currentDate != lastDate);
          }
        },

        //实习生时间范围
        pickerOptions: {
          disabledDate: (time) => {
            let endTime = this.dateGroup.teachingEndTime && (typeof this.dateGroup.teachingEndTime === 'string' ? this.parseDate(this.dateGroup.teachingEndTime, 'yyyy-MM-dd').getTime() : this.dateGroup.teachingEndTime.getTime());
            // let endTime = this.dateGroup.teachingEndTime&& parseInt(this.dateGroup.teachingEndTime) != NAN ?this.parseDate(this.dateGroup.teachingEndTime,'yyyy-MM-dd').getTime() : this.dateGroup.teachingEndTime.getTime();
            let currentTime = time.getTime();
            let currentDay = time.getDay()//星期几
            return endTime ? (currentTime > endTime || currentDay !== 1 ) : (currentDay !== 1 );
          }
        },
        endOptions: {
          disabledDate: (time) => {
            let startTime = this.dateGroup.teachingBeginTime && (typeof this.dateGroup.teachingBeginTime === 'string' ? this.parseDate(this.dateGroup.teachingBeginTime, 'yyyy-MM-dd').getTime() : this.dateGroup.teachingBeginTime.getTime());
            let currentTime = time.getTime();
            let currentDay = time.getDay()//星期几
//            let lastDate = new Date(time.setMonth(time.getMonth()+1,0)).getDate()//改变时间,获取最后一天
            return startTime ? (startTime > currentTime || currentDay !== 0) : (currentDay != 0);
          }
        },
      }
    },
    created() {

    },
    watch: {

    },
    mounted() {
    },
    methods: {
    }
  }

</script>
