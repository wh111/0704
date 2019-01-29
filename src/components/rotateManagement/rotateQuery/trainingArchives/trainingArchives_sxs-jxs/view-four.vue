<!----------------------------------
****--@name     ${*}
****--@role     ${*}
****--@date     2017/11/22
****--@author   gx
----------------------------------->
<template>
    <div>
      <!--考核表-->
      <div class="manual" >
        <!--医德医风-->
        <div v-show="[4,'4-1'].includes(index)">
          <h3 class="headline"><strong>{{operailityData.ydyf.name}}</strong></h3>
          <table class="ir-table"  borderColor=#000000 height=40 cellPadding=1 width=250 align=center border=1>
            <colgroup>
              <col>
              <col>
              <col>
              <col>
              <col>
              <col>
              <col>
              <col>
              <col>
              <col>
              <col>
              <col>
            </colgroup>
            <tr>
              <td colspan="2" class="ir-table-td">教学时间</td>
              <td colspan="2" class="ir-table-td">自定</td>
              <td colspan="2" class="ir-table-td">负责科室</td>
              <td colspan="2" class="ir-table-td">{{operailityData.ydyf.depName}}</td>
              <td colspan="2" class="ir-table-td">总完成时间</td>
              <td colspan="2" class="ir-table-td">{{operailityData.ydyf.sumTs}}</td>
            </tr>
            <tr>
              <td colspan="2" class="ir-table-td">教学目标</td>
              <td colspan="10" class="ir-table-td">{{operailityData.ydyf.jxmb}}</td>
            </tr>
            <tr>
              <td colspan="2" class="ir-table-td">考核内容</td>
              <td colspan="10" class="ir-table-td">{{operailityData.ydyf.khnr}}</td>
            </tr>
            <tr>
              <td colspan="2" :rowspan="operailityData.ydyf.jxjl?operailityData.ydyf.jxjl.length+1:1"
                  class="ir-table-td">教学记录
              </td>
              <td colspan="2" class="ir-table-td">时间</td>
              <td colspan="2" class="ir-table-td">教师</td>
              <td colspan="2" class="ir-table-td">形式</td>
              <td colspan="4" class="ir-table-td">教学主要内容</td>
            </tr>
            <tr v-if="operailityData.ydyf.jxjl!=0" v-for="(item,index) in operailityData.ydyf.jxjl">
              <td colspan="2" class="ir-table-td">{{item.time}}</td>
              <td colspan="2" class="ir-table-td">{{item.teachName}}</td>
              <td colspan="2" class="ir-table-td">{{item.xs}}</td>
              <td colspan="4" class="ir-table-td">{{item.jxnr}}</td>
            </tr>

            <tr v-if="operailityData.ydyf.jxjl==0">
              <td colspan="12" style="text-align:center" class="ir-table-td">暂无数据</td>
            </tr>
            <tr>
              <td colspan="12"  style="text-align: center" class="ir-table-td">调查报告或经验总结</td>
            </tr>
            <tr>
              <td colspan="12"  style="text-align: center" class="ir-table-td">{{operailityData.ydyf.jyzj}}</td>
            </tr>
          </table>
        </div>
        <!---->
        <!--医学文案-->
        <div v-show="[4,'4-2'].includes(index)">
          <h3 class="headline"><strong>{{operailityData.yxwa.name}}</strong></h3>
          <table class="ir-table"  borderColor=#000000 height=40 cellPadding=1 width=250 align=center border=1>
            <colgroup>
              <col>
              <col>
              <col>
              <col>
              <col>
              <col>
              <col>
              <col>
              <col>
              <col>
              <col>
              <col>
            </colgroup>
            <tr>
              <td colspan="2" class="ir-table-td ">教学时间</td>
              <td colspan="2" class="ir-table-td">自定</td>
              <td colspan="2" class="ir-table-td">负责科室</td>
              <td colspan="2" class="ir-table-td">{{operailityData.yxwa.depName}}</td>
              <td colspan="2" class="ir-table-td">总完成时间</td>
              <td colspan="2" class="ir-table-td">{{operailityData.yxwa.sumTs}}</td>
            </tr>
            <tr>
              <td colspan="2" class="ir-table-td">教学目标</td>
              <td colspan="10" class="ir-table-td">{{operailityData.yxwa.jxmb?operailityData.yxwa.jxmb:"暂无数据"}}</td>
            </tr>
            <tr>
              <td colspan="2" class="ir-table-td">考核内容</td>
              <td colspan="10" class="ir-table-td">{{operailityData.yxwa.khnr?operailityData.yxwa.khnr:"暂无数据"}}</td>
            </tr>
            <tr>
              <td colspan="2" :rowspan="operailityData.ydyf.jxjl?operailityData.ydyf.jxjl.length+1:1"
                  class="ir-table-td">教学记录
              </td>
              <td colspan="2" class="ir-table-td">时间</td>
              <td colspan="2" class="ir-table-td">教师</td>
              <td colspan="2" class="ir-table-td">形式</td>
              <td colspan="4" class="ir-table-td">教学主要内容</td>
            </tr>
            <tr v-if="operailityData.yxwa.jxjl!=0" v-for="(item,index) in operailityData.yxwa.jxjl" :key="index">
              <td colspan="2" class="ir-table-td">{{item.time}}</td>
              <td colspan="2" class="ir-table-td">{{item.teachName}}</td>
              <td colspan="2" class="ir-table-td">{{item.xs}}</td>
              <td colspan="4" class="ir-table-td">{{item.jxnr}}</td>
            </tr>

            <tr v-if="operailityData.yxwa.jxjl==0">
              <td colspan="12" style="text-align:center" class="ir-table-td">暂无数据</td>
            </tr>
            <tr>
              <td colspan="12"  style="text-align: center" class="ir-table-td">专题综述</td>
            </tr>
            <tr>
              <td colspan="12"  style="text-align: center" class="ir-table-td">{{operailityData.yxwa.ztgs?operailityData.yxwa.ztgs:"暂无数据"}}</td>
            </tr>

            <tr ><td colspan="12"  class="ir-table-td">病例完成情况总表:</td></tr>
            <tr>
              <td colspan="1"  class="ir-table-td  ir-table-th">序号</td>
              <td colspan="2" class="ir-table-td  ir-table-th">实习科室</td>
              <td colspan="2" class="ir-table-td  ir-table-th">病案号</td>
              <td colspan="2" class="ir-table-td  ir-table-th">姓名</td>
              <td colspan="2" class="ir-table-td   ir-table-th">完成时间</td>
              <td colspan="3" class="ir-table-td  ir-table-th">诊断</td>
            </tr>
            <tr v-if="operailityData.yxwa.blwcqk!=0" v-for="(item,index) in operailityData.yxwa.blwcqk" :key="index">
              <td colspan="1" class="ir-table-td">{{index+1}}</td>
              <td colspan="2" class="ir-table-td">{{item.depName}}</td>
              <td colspan="2" class="ir-table-td">{{item.binganhao}}</td>
              <td colspan="2" class="ir-table-td">{{item.binganhao}}</td>
              <td colspan="2" class="ir-table-td">{{item.time}}</td>
              <td colspan="3" class="ir-table-td">{{item.zhenduan}}</td>
            </tr>

            <tr v-if="operailityData.yxwa.blwcqk==0">
              <td colspan="12" style="text-align:center" class="ir-table-td">暂无数据</td>
            </tr>
          </table>
        </div>
        <!--其他子项-->

        <div v-for="(item,inx) in operailityData.depSubKhList" :key="inx" v-show="[4,`4-${inx+3}`].includes(index)">
          <h3 class="headline"><strong>{{item.depName}}</strong></h3>
          <table class="ir-table"  borderColor=#000000 height=40 cellPadding=1 width=250 align=center border=1>
            <colgroup>
              <col>
              <col>
              <col>
              <col>
              <col>
              <col>
              <col>
              <col>
              <col>
              <col>
              <col>
              <col>
            </colgroup>
            <tr>
              <td colspan="2" class="ir-table-td">教学时间</td>
              <td colspan="2" class="ir-table-td">{{item.jiaoxueshijian}}</td>
              <td colspan="2" class="ir-table-td">负责科室</td>
              <td colspan="2" class="ir-table-td">{{item.depName}}</td>
              <td colspan="2" class="ir-table-td">总完成时间</td>
              <td colspan="2" class="ir-table-td">{{item.sumts}}</td>
            </tr>
            <tr>
              <td colspan="2" class="ir-table-td">教学目标</td>
              <td colspan="10" class="ir-table-td">{{item.jxmb?item.jxmb:"暂无数据"}}</td>
            </tr>
            <tr>
              <td colspan="2" class="ir-table-td">考核内容</td>
              <td colspan="10" class="ir-table-td">{{item.khnr?item.khnr:"暂无数据"}}</td>
            </tr>
            <tr>
              <td colspan="2" :rowspan="item.jxjl?item.jxjl.length+1:1" class="ir-table-td">教学记录</td>
              <td colspan="2" class="ir-table-td">时间</td>
              <td colspan="2" class="ir-table-td">教师</td>
              <td colspan="2" class="ir-table-td">形式</td>
              <td colspan="4" class="ir-table-td">教学主要内容</td>
            </tr>
            <tr v-if="item.jxjl!=0" v-for="(value,i) in item.jxjl" :key="i">
              <td colspan="2" class="ir-table-td">{{value.time}}</td>
              <td colspan="2" class="ir-table-td">{{value.teachName}}</td>
              <td colspan="2" class="ir-table-td">{{value.xs}}</td>
              <td colspan="4" class="ir-table-td">{{value.jxnr}}</td>
            </tr>
            <tr v-if="item.jxjl==0">
              <td colspan="12" style="text-align:center" class="ir-table-td">暂无数据</td>
            </tr>

            <!---->
            <tr ><td colspan="12"  class="ir-table-td">管理病床记录:</td></tr>
            <tr>
              <td colspan="2"  class="ir-table-td  ir-table-th">科室</td>
              <td colspan="2" class="ir-table-td  ir-table-th">时间</td>
              <td colspan="2" class="ir-table-td  ir-table-th">病名</td>
              <td colspan="3" class="ir-table-td  ir-table-th">病例号</td>
              <td colspan="3" class="ir-table-td  ir-table-th">教师签名</td>
            </tr>
            <tr v-if="item.glbcjl!=0" v-for="(value,i) in item.glbcjl" :key="i">
              <td colspan="2" class="ir-table-td">{{value.depName}}</td>
              <td colspan="2" class="ir-table-td">{{value.tubeTime}}</td>
              <td colspan="2" class="ir-table-td">{{value.name}}</td>
              <td colspan="3" class="ir-table-td">{{value.number}}</td>
              <td colspan="3" class="ir-table-td">{{value.teacherName}}</td>
            </tr>

            <tr v-if="item.glbcjl==0" >
              <td colspan="12" style="text-align:center" class="ir-table-td">暂无数据</td>
            </tr>
            <!---->
            <!---->
            <tr ><td colspan="12"  class="ir-table-td">书写病例记录:</td></tr>
            <tr>
              <td colspan="2"  class="ir-table-td  ir-table-th">科室</td>
              <td colspan="2" class="ir-table-td  ir-table-th">时间</td>
              <td colspan="2" class="ir-table-td  ir-table-th">病名</td>
              <td colspan="3" class="ir-table-td  ir-table-th">病例号</td>
              <td colspan="3" class="ir-table-td  ir-table-th">教师签名</td>
            </tr>
            <tr v-if="item.sxbl!=0" v-for="(value,i) in item.sxbl" :key="i">
              <td colspan="2" class="ir-table-td">{{value.depName}}</td>
              <td colspan="2" class="ir-table-td">{{value.time}}</td>
              <td colspan="2" class="ir-table-td">{{value.name}}</td>
              <td colspan="3" class="ir-table-td">{{value.number}}</td>
              <td colspan="3" class="ir-table-td">{{value.teacherName}}</td>
            </tr>
            <tr v-if="item.sxbl==0">
              <td colspan="12" style="text-align:center" class="ir-table-td">暂无数据</td>
            </tr>
            <!---->

            <!---->
            <tr ><td colspan="12"  class="ir-table-td">参加抢救危重病人记录:</td></tr>
            <tr>
              <td colspan="2" class="ir-table-td  ir-table-th">科室</td>
              <td colspan="2" class="ir-table-td  ir-table-th">时间</td>
              <td colspan="2" class="ir-table-td  ir-table-th">病名</td>
              <td colspan="3" class="ir-table-td  ir-table-th">病例号</td>
              <td colspan="3" class="ir-table-td  ir-table-th">教师签名</td>
            </tr>
            <tr v-if="item.cjqjwzbrjl!=0" v-for="(value,i) in item.cjqjwzbrjl" :key="i">
              <td colspan="2" class="ir-table-td">{{value.depName}}</td>
              <td colspan="2" class="ir-table-td">{{value.time}}</td>
              <td colspan="2" class="ir-table-td">{{value.name}}</td>
              <td colspan="3" class="ir-table-td">{{value.number}}</td>
              <td colspan="3" class="ir-table-td">{{value.teacherName}}</td>
            </tr>

            <tr v-if="item.cjqjwzbrjl==0">
              <td colspan="12" style="text-align:center" class="ir-table-td">暂无数据</td>
            </tr>
            <!---->
            <!---->
            <tr ><td colspan="12"  class="ir-table-td">临床操作记录:</td></tr>
            <tr>
              <td colspan="2" rowspan="2" class="ir-table-td  ir-table-th">临床操作名称</td>
              <td colspan="2" rowspan="2" class="ir-table-td ir-table-th">科室</td>
              <td colspan="2" rowspan="2" class="ir-table-td ir-table-th">时间</td>
              <td colspan="3"  class="ir-table-td ir-table-th">操作方式</td>
              <td colspan="3" rowspan="2" class="ir-table-td ir-table-th">指导教师签名</td>
            </tr>
            <tr>
              <td  class="ir-table-td ir-table-th">主要完成</td>
              <td  class="ir-table-td ir-table-th">助手</td>
              <td   class="ir-table-td ir-table-th">观摩</td>
            </tr>
            <tr v-if="item.lczjl!=0" v-for="(value,i) in item.lczjl" :key="i">
              <td colspan="2" class="ir-table-td">{{value.name}}</td>
              <td colspan="2" class="ir-table-td">{{value.depName}}</td>
              <td colspan="2" class="ir-table-td">{{value.time}}</td>
              <td colspan="1" class="ir-table-td">{{value.clinicalType=='MAIN_COMPLETED'?'√':''}}</td>
              <td colspan="1" class="ir-table-td">{{value.clinicalType=='ASSISTANT'?'√':''}}</td>
              <td colspan="1" class="ir-table-td">{{value.clinicalType=='WATCH'?'√':''}}</td>
              <td colspan="3" class="ir-table-td">{{value.teacherName}}</td>
            </tr>

            <tr v-if="item.lczjl==0" >
              <td colspan="12" style="text-align:center" class="ir-table-td">暂无数据</td>
            </tr>
            <!---->


            <!---->
            <tr ><td colspan="12"  class="ir-table-td">参加过得讲座或学术活动:</td></tr>
            <tr>
              <td colspan="2" class="ir-table-td  ir-table-th">日期</td>
              <td colspan="8" class="ir-table-td  ir-table-th">讲座题目</td>
              <td colspan="2" class="ir-table-td  ir-table-th">教书签名</td>
            </tr>
            <tr v-if="item.jznr!=0" v-for="(value,i) in item.jznr" :key="i">
              <td colspan="2" class="ir-table-td">{{value.time}}</td>
              <td colspan="8" class="ir-table-td">{{value.name}}</td>
              <td colspan="2" class="ir-table-td">{{value.teacherName}}</td>
            </tr>
            <tr v-if="item.jznr==0">
              <td colspan="12" style="text-align:center" class="ir-table-td">暂无数据</td>
            </tr>
            <!---->

            <!---->
            <tr ><td colspan="12"  class="ir-table-td">特殊情况记录（表扬、批评、差错、事故等）:</td></tr>
            <tr v-if="item.tsqkjl!=0" v-for="(value,i) in item.tsqkjl" :key="i">
              <td colspan="4" class="ir-table-td">{{value.time}}</td>
              <td colspan="8" class="ir-table-td">{{value.name}}</td>
            </tr>
            <tr v-if="item.tsqkjl==0">
              <td colspan="12" style="text-align:center" class="ir-table-td">暂无数据</td>
            </tr>
            <!---->
          </table>
        </div>
      </div>
    </div>
</template>
<script>
    /*当前组件必要引入*/

    //当前组件引入全局的util
    let Util = null;
    export default {
      props:['operailityData','index'],
        data() {
            return {}
        },
        methods: {
            //初始化请求列表数据
            init() {

            },

        },
        created() {
            this.init();
        },
        mounted() {
        },
        components: {}
    }
</script>
