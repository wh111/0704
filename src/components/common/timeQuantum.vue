<!----------------------------------
****--@name     时间段公用组件
****--@role     ${*}
****--@date     2017/10/31
****--@author   gx
----------------------------------->
<template>
  <div class="my-time">
    <el-time-picker
      style="width: 100px"
      v-model="data.start"
      :picker-options="startRange"
      @focus="startFocus"
      :editable="false"
      format="HH:mm"
      :clearable="false"
      @blur="startBlur"
      placeholder="开始">
    </el-time-picker>
    -
    <el-time-picker
      v-model="data.end"
      style="width: 100px"
      @focus="endFocus"
      @blur="endBlur"
      :editable="false"
      format="HH:mm"
      :clearable="false"
      :picker-options="endRange"
      placeholder="结束">
    </el-time-picker>
  </div>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    /**
     * @param {Array} range : 时间范围 []
     * @param {String} startDate : 开始时间 '08:00'
     * @param {String} endDate : 结束时间 '08:00'
     * @param {String} time : 结束时间 '08:00-09:00'
     * @param {Object} data : 数据对象 {}
     * */
    props: ['index', 'range', 'startDate', 'endDate', 'data', 'time'],
    data () {
      return {
        start: this.startDate,
        end: this.endDate,
        startRange: {selectableRange: ''}, //限制开始时间范围
        endRange: {selectableRange: ''} //限制结束时间范围
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        /**
         * time '08:00-09:00'  优先级最高
         * startDate '08:00'
         * endDate '08:00'
         * */
        if (this.data.time) {
          let time = this.data.time.split('-');
          let start = time[0];
          let end = time[1];
          if (start) {
            this.data.start = this.conductTime(start);
          } else {
            this.data.start = this.conductTime(this.data.start);
          }

          if (end) {
            this.data.end = this.conductTime(end);
          } else {
            this.data.end = this.conductTime(this.data.end);
          }

          this.data = Object.assign(this.data, {time: start + '-' + end, _start: start, _end: end, _time: start + '-' + end, _index: this.index});
        } else {
          let start = this.data.start;
          let end = this.data.end;
          this.data.start = this.conductTime(this.data.start);
          this.data.end = this.conductTime(this.data.end);
          this.data = Object.assign(this.data, {time: start + '-' + end, _start: start, _end: end, _time: start + '-' + end, _index: this.index});
        }
        //限制范围
        if (this.range) {
          this.range[(this.index * 2 || 0)] = this.data.start && this.parseTimestamp(this.data.start);
          this.range[(this.index * 2 + 1 || 1)] = this.data.end && this.parseTimestamp(this.data.end);
        }
      },
      parseTimestamp(date) {
        return date.getTime();
      },
      conductTime (time) {
        if (!time) return '';
        time = time.split(':');
        return new Date(2017, 9, 10, time[0], time[1]);
      },

      //开始时间获取焦点
      startFocus () {
        let limitLange = this.limitLange((this.index * 2 || 0)); // 从时间范围 限制开始时间
//            if(!this.start){
//              this.start = limitLange.start;
//            }
        this.startRange.selectableRange = limitLange.selectableRange;
      },

      //开始时间失去焦点
      startBlur () {
        let start = this.conductDate(this.data.start, 'HH:mm');
        let end = this.conductDate(this.data.end, 'HH:mm');
        let timeData;
        if (this.data) {
          timeData = this.data = Object.assign(this.data, {time: start + '-' + end, _start: start, _end: end, _time: start + '-' + end, _index: this.index});
        } else {
          timeData = {time: start + '-' + end, _start: start, _end: end, _time: start + '-' + end, _index: this.index};
        }
        this.$emit('dateChange', timeData);
        //保存当前时间到时间范围
        if (this.range) {
          this.range[(this.index * 2 || 0)] = this.parseTimestamp(this.data.start);
        }
      },

      //结束时间获取焦点
      endFocus () {
        let limitLange = this.limitLange((this.index * 2 + 1 || 1)); //从时间范围 限制结束时间
//            if(!this.end){
//              this.end = limitLange.end;
//            }
        this.endRange.selectableRange = limitLange.selectableRange;

      },

      //结束时间失去焦点
      endBlur () {
        let start = this.conductDate(this.data.start, 'HH:mm');
        let end = this.conductDate(this.data.end, 'HH:mm');
        let timeData;
        if (this.data) {
          timeData = this.data = Object.assign(this.data, {time: start + '-' + end, _start: start, _end: end, _time: start + '-' + end, _index: this.index});
        } else {
          timeData = {time: start + '-' + end, _start: start, _end: end, _time: start + '-' + end, _index: this.index};
        }
        this.$emit('dateChange', timeData);
        //保存当前时间到时间范围
        if (this.range) {
          this.range[(this.index * 2 + 1 || 1)] = this.parseTimestamp(this.data.end);
        }
      },

      /**
       * 时间范围限制
       * @param {string|number} index range的索引
       * @return {string|Array}
       * */
      limitLange (index) {
        if (!this.range) return '';
        let leftRange = 0;
        let rightRange = 0;
        let start = 0;
        let end = 0;
        for (let i = 0; i < this.range.length; i++) { //i<index 为开始时间；i>index 为结束时间
          let item = this.range[i];
          if (!item) continue;
          if (i < index && item > leftRange) {  //开始时间如果比当前时间大则替换
            leftRange = item;
          }
          if (i > index) { //结束时间如果比当前时间小则替换
            if (!rightRange) {
              rightRange = item;
            } else if (item < rightRange) {
              rightRange = item;
            }
          }
        }
        if (!leftRange) {
          leftRange = '00:01';
          start = this.conductTime(leftRange);
        } else {
          start = this.conductDate(leftRange + 60000, 'HH:mm');
          start = this.conductTime(start);
          leftRange = this.conductDate(leftRange, 'HH:mm');
        }
        if (!rightRange) {
          rightRange = '23:59';
          end = this.conductTime(rightRange);
        } else {
          end = this.conductDate(rightRange + 60000, 'HH:mm');
          end = this.conductTime(end);
          rightRange = this.conductDate(rightRange, 'HH:mm');
        }

        let obj = {
          selectableRange: leftRange + ':00 - ' + rightRange + ':00',
          start: start, //时间对象
          end: end    //时间对象
        };
        return obj;
      }

    },
    created () {
      this.init();
    },
    watch: {},

    mounted () {
    },
    components: {}
  };
</script>
<style>
  .my-time .cancel {
    display: none;
  }

</style>
