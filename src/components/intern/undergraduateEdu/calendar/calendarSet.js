/**
 * 全日历
 *
 * 默认属性及事件设置
 *
 * @date     2014-04-12
 * @author   zyc<332533011@qq.com>
 */
const calendar = {
  fcEvents : [],
  tpl:0,           //0为分两列显示数据  1为单行显示
  itemLimit:7,     //显示几个后显示更多
  lang:"zh",       //语言包使用
  setCalData(data){
    this.fcEvents = data;
    /*for(var i in data){
      this.fcEvents.push(data[i]);
    }*/
  }
}
calendar.fcEvents = [];
export default calendar
