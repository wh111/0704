/**
 * 全日历
 *
 * 默认属性及事件设置
 *
 * @date     2014-04-12
 * @author   zyc<332533011@qq.com>
 */
const calendar = {
  fcEvents: [ // 
    // {
    //   title: "上一（10:00 - 11:00）",
    //   start: '2017-07-07',
    //   end: '2017-07-07',
    // },
  ],
  tpl: 1, //0为分两列显示数据  1为单行显示
  itemLimit: 3, //显示几个后显示更多
  lang: "zh", //语言包使用
  setCalData(data) {
    this.fcEvents = data;
    /*for(var i in data){
      this.fcEvents.push(data[i]);
    }*/
  }
}
//calendar.fcEvents = [];
export default calendar
