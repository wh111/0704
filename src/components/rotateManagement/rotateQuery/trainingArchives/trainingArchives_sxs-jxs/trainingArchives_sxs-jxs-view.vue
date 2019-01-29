<!----------------------------------
****--培训档案   （实习生和进修生 轮转手册）
****--@date     2017/7/3
****--@author   gx
----------------------------------->
<template>
    <div class="trainingArchives">
      <div style="margin-bottom: 5px;text-align: right">
        <el-button type="primary" size="small" @click="derive">导出word</el-button>
      </div>
      <div style="height: 550px;">
        <el-menu
          default-active="1"
          @open="handleOpen"
          @close="handleClose"
          class="menu"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item class="text" index="1" @click="saveIndex(1)">一、时间与科目</el-menu-item>
            <el-menu-item class="text" index="2" @click="saveIndex(3)"><span>二、教学计划</span></el-menu-item>
            <el-menu-item class="text" index="3" @click="saveIndex(2)"><span>三、实施细则</span></el-menu-item>
          <el-submenu index="4">
            <template slot="title">
              <span class="text" @click="saveIndex(4)">四、考核表</span>
            </template>
            <el-menu-item class="text"  index="4-1" @click="saveIndex('4-1')"><a href="#" style="color:inherit;">医德医风</a></el-menu-item>
            <el-menu-item class="text"  index="4-2" @click="saveIndex('4-2')"><a href="#" style="color:inherit;">医学文案</a></el-menu-item>
            <el-menu-item v-for="(item,index) in getData.depSubKhList" :key="index" class="text"  :index="`4-${index+3}`" @click="saveIndex(`4-${index+3}`)"><a href="#" style="color:inherit;">{{item.depName}}</a></el-menu-item>
          </el-submenu>
          <el-menu-item class="text"  index="5" @click="saveIndex(5)">五、临床技术操作项目完成情况统计表</el-menu-item>
          <el-menu-item class="text"  index="6" @click="saveIndex(6)">六、课程成绩单</el-menu-item>
          <el-menu-item class="text"  index="7" @click="saveIndex(7)">七、毕业总鉴定</el-menu-item>
          <el-menu-item  class="text"  index="8" @click="saveIndex(8)">八、请假记录</el-menu-item>
          <el-menu-item class="text"  index="9" @click="saveIndex(9)">九、补轮转纪录</el-menu-item>
        </el-menu>
        <div class="right-meue" style="height:inherit;overflow: auto;border: 1px solid #e7eaef;">
          <!--一、实习时间与科目-->
          <div class="manual" v-if="index==1">
            <h3 class="headline"><strong>一、时间与科目</strong></h3>
            <div class="right-meue-text">(一)总时间按51周计划</div>
            <div class="right-meue-text">(二)科目、时间分配及分组轮转方案</div>
            <br>
            <table class="ir-table"  borderColor=#000000 height=40 cellPadding=1 width=250 align=center border=1>
              <tr>
                <th class="ir-table-td ir-table-th" v-for="(item,index) in outlineHead" :key="index">{{item.label}}</th>
              </tr>
              <template v-for="(value1,index) in getData.sxdg&&getData.sxdg.outlineRequiresTemp" >
                <tr v-for="(value,ix) in value1" :key="ix">
                  <td v-for="(item,i) in outlineHead"  :key="i"  v-if="value[item.key]!=null" :rowspan="['greatName'].includes(item.key)?value1.length:1"  class="ir-table-td">{{value[item.key]}}</td>
                </tr>
              </template>
              <tr v-if="!getData.sxdg||getData.sxdg.outlineRequiresTemp==0">
                <td style="text-align: center;height: 100px;font-size: 18px;"  :colspan="outlineHead.length"><strong>暂无数据</strong></td>
              </tr>
            </table>
            <br>
            <div class="right-meue-text">(三)毕业理论考试时间安排</div>
            <div class="right-meue-text">第一次：十月中旬，第二次：次年三月，第三次，次年六月初</div>
            <div class="right-meue-text">(三)毕业技能操作考核时间</div>
            <div class="right-meue-text">结束返校后进行</div>
          </div>
          <!--教学计划-->
          <div class="manual"  v-if="index==2">
              <div class="headline"><strong>《临床医学专业毕业课程教学计划》实施细则</strong></div>
            <div class="jxjh" style="font-size: 15px;text-indent:2rem;" v-html="getData.jxjh"> </div>
          </div>
          <!--实施细则-->
          <div class="manual"  v-if="index==3">
              <div class="headline"><strong>临床医学专业毕业课程教学计划 </strong></div>
              <div class="jxjh" style="font-size: 15px;text-indent:0rem;" v-html="getData.ssxz"></div>
          </div>
          <div  v-show="(index+'').split('-')[0]==4" >
            <four :operailityData="getData" :index="index"></four>
          </div>
          <!--五 临床技术操作项目完成情况统计表-->
          <div class="manual" v-if="index==5">
            <div class="headline"><strong>临床技术操作项目完成情况统计表</strong> </div>
            <table class="ir-table"  borderColor=#000000 height=40 cellPadding=1 width=250 align=center border=1>
              <tr>
                <th colspan="6" class="ir-table-td ir-table-th">操作项目</th>
                <th colspan="2" class="ir-table-td ir-table-th">大纲规定次数</th>
                <th colspan="2"  class="ir-table-td ir-table-th">完成次数</th>
                <th colspan="2" class="ir-table-td ir-table-th">达成率</th>
              </tr>
              <template v-if="getData.jsczwcqk!=0" v-for="(item,index) in getData.jsczwcqk">
                <tr v-for="(value,i) in item.czxm">
                  <td v-if="i==0" colspan="2"  :rowspan="item.czxm.length" class="ir-table-td">{{item.groupName}}</td>
                  <td colspan="4" class="ir-table-td">{{value.czxm_name}}</td>
                  <td colspan="2" class="ir-table-td">{{value.num}}</td>
                  <td colspan="2" class="ir-table-td">{{value.user_num}}</td>
                  <td colspan="2" class="ir-table-td">{{value.dcl}}</td>
                </tr>
              </template>
              <tr  v-if="getData.jsczwcqk==0">
                <td colspan="12" style="text-align:center" class="ir-table-td">暂无数据</td>
              </tr>
            </table>
          </div>

          <!--实习课程成绩单-->
          <div class="manual" v-if="index==6">
            <div class="headline"><strong>课程成绩单</strong> </div>
            <br>
            <table class="ir-table"  borderColor=#000000 height=40 cellPadding=1 width=250 align=center border=1>
              <tr>
                <th  class="ir-table-td ir-table-th">课程</th>
                <th  class="ir-table-td ir-table-th">成绩</th>
              </tr>
              <tr v-if="getData.sxcj!=0" v-for="(item,index) in getData.sxcj">
                <td class="ir-table-td">{{item.depName}}</td>
                <td  class="ir-table-td">{{item['mark']}}</td>
              </tr>

              <tr v-if="getData.sxcj==0">
                <td colspan="2" style="text-align:center" class="ir-table-td">暂无数据</td>
              </tr>
            </table>
          </div>

          <div class="manual" v-if="index==7">
            <div class="headline"><strong>毕业总鉴定 </strong></div>
            <br>
            <table class="ir-table"  borderColor=#000000 height=40 cellPadding=1 width=250 align=center border=1>
              <colgroup>
                <col>
                <col>
                <col>
                <col>
                <col>
              </colgroup>
              <tr>
                <td colspan="5" class="ir-table-td ">共科目：{{getData.jyjd.practiceSubject}}</td>
              </tr>
              <tr>
                <td colspan="2" class="ir-table-td">共缺时间 {{getData.jyjd.absenceDays}}</td>
                <td colspan="3" class="ir-table-td">其中病假（ {{getData.jyjd.sickDays}}）天；事假（{{getData.jyjd.personalDays}} ）天；旷（{{getData.jyjd.minerDays}} ）天</td>
              </tr>
              <tr>
                <td colspan="5" class="ir-table-td">
                  <span>自我鉴定:</span>
                  <br>
                  <div  style="min-height: 250px">{{getData.jyjd.selfComment}}</div>
                </td>
              </tr>
            </table>
          </div>

          <!--请假记录-->
          <div class="manual"  v-if="index==8">
            <div class="headline"><strong>请假记录</strong> </div>
            <br>
            <table class="ir-table" borderColor=#000000 height=40 cellPadding=1 width=250 align=center border=1>
              <tr>
                <th  class="ir-table-td ir-table-th">请假事由</th>
                <th  class="ir-table-td ir-table-th">请假时间</th>
                <th  class="ir-table-td ir-table-th">科室</th>
                <th  class="ir-table-td ir-table-th">审批信息</th>
                <th  class="ir-table-td ir-table-th">销假日期</th>
              </tr>
              <tr v-if="getData.qjjl!=0" v-for="(item,index) in getData.qjjl">
                <td class="ir-table-td">{{item.qjsy}}</td>
                <td class="ir-table-td">{{item.time}}</td>
                <td class="ir-table-td">{{item.depName}}</td>
                <td class="ir-table-td">{{item.message}}</td>
                <td class="ir-table-td">{{item.xjTime}}</td>
              </tr>
              <tr v-if="getData.qjjl==0">
                <td colspan="5" style="text-align:center" class="ir-table-td">暂无数据</td>
              </tr>
            </table>
          </div>

          <div class="manual" v-if="index==9">
            <div class="headline"><strong>补轮转记录</strong> </div>
            <br>
            <table class="ir-table"  borderColor=#000000 height=40 cellPadding=1 width=250 align=center border=1>
              <tr>
                <th  class="ir-table-td ir-table-th">姓名</th>
                <th  class="ir-table-td ir-table-th">科室</th>
                <th  class="ir-table-td ir-table-th">带教老师</th>
                <th  class="ir-table-td ir-table-th">科室主任</th>
                <th  class="ir-table-td ir-table-th">医教部门</th>
              </tr>
              <tr v-if="getData.bsx!=0" v-for="(item,index) in getData.bsx">
                <td class="ir-table-td">{{item.userName}}</td>
                <td class="ir-table-td">{{item.depName}}</td>
                <td class="ir-table-td">{{item.teacherName}}</td>
                <td class="ir-table-td">{{item.kszrName}}</td>
                <td class="ir-table-td">{{item.yjbmName}}</td>
              </tr>
              <tr v-if="getData.bsx==0">
                <td colspan="5" style="text-align:center" class="ir-table-td">暂无数据</td>
              </tr>
            </table>
          </div>

       </div>
      </div>

      <!--导出弹窗-->
      <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal" class-name="vertical-center-modal" :width="500">
        <modal-header slot="header" :content="deriveId"></modal-header>
        <div>
          <div class="remove">确认导出吗</div>
          <el-row>
            <el-col :span="10" :offset="14">
              <a :href="derivePath">
                <el-button @click="affirmDerive" type="primary">确定</el-button>
              </a>
              <el-button class="but-col" @click=" deriveModal=false">取消</el-button>
            </el-col>
          </el-row>
        </div>
        <div slot="footer"></div>
      </Modal>
    </div>
</template>
<script>
    /*当前组件必要引入*/
  import four from './view-four.vue'
    import config from '../../../../../config/config';

    //当前组件引入全局的util
    let Util = null;
    export default{
      props:['operailityData','url'],
        data() {
            return {
              //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
              listMessTitle:{
                paramsData:'listUrl',
                ajaxSuccess:'updateListData',
                ajaxParams:{
                  url:this.url.rotaryManulGet.path+this.operailityData.userId,
                  params:{}
                }
              },
              deriveModal: false,
              derivePath:'',

              outlineHead :[ //sxdg
                {
                  label:'分类名称',
                  key:'greatName',
                },
                {
                  label:'科室',
                  key:'depName',
                },
                {
                  label:'周期',
                  key:'ts',
                },
                {
                  label:'备注',
                  key:'remark',
                },
              ],
              depSubKhList:[],

              index:1,
              getData:{
                "sxdg":{
                  "specialty":"",
                  "outlineRequires":[]
                },
                "jxjh":"",
                "ssxz":"",
                "ydyf":{
                  "name":"",
                  "depName":"",
                  "sumTs":"",
                  "jxmb":"",
                  "khnr":"",
                  "jxjl":[],
                  "jyzj":""
                },
                "yxwa":{
                  "name":"",
                  "depName":"",
                  "sumTs":"",
                  "jxmb":"",
                  "khnr":"",
                  "jxjl":[],
                  "ztgs":"",
                  "blwcqk":[]
                },
                "depSubKhList":[

                ],
                "jsczwcqk":[],
                "sxcj":[],
                "jyjd":{
                  "practiceSubject":"",
                  "absenceDays":'',
                  "sickDays":'',
                  "personalDays":'',
                  "minerDays":'',
                  "selfComment":""
                },
                "qjjl":[],
                "bsx":[]
              },
              deriveId:{id:'deriveId',title:'导出'},
            }
        },
        methods: {
            //初始化请求列表数据
            init(){
              this.ajax(this.listMessTitle)
            },

          /** ajax请求
           * */
          //获取数据成功
          updateListData(res){
            let data = res.data;
            //处理实习时间与科目
            let outlineRequires = data.sxdg.outlineRequires;
            let outlineRequiresTemp = [];
//            outlineRequires.sort(function (a,b) {
//              return a.groupNo>b.groupNo;
//            })
            let groupNo;
            outlineRequires.map(function (item) {
              if(item.groupNo == groupNo){
                outlineRequiresTemp[outlineRequiresTemp.length-1].push({
                  depName:item.depName||'',
                  ts:item.ts||'',
                  remark:item.remark||'',
                })
              }else {
                groupNo = item.groupNo;
                outlineRequiresTemp.push([{
                  greatName:item.greatName||'',
                  depName:item.depName||'',
                  ts:item.ts||'',
                  remark:item.remark||'',
                }])
              }
            })
            this.depSubKhList = data.depSubKhList;
            data.sxdg.outlineRequiresTemp = outlineRequiresTemp;
            this.getData = data;
          },


          /**  点击操作*/
          handleOpen(key, keyPath) {
          },

          handleClose(key, keyPath) {
          },

          saveIndex(index){
            this.index = index;
          },

          //导出
          derive() {
            let item = this.operailityData;
            this.derivePath =config.urlPrefix+ this.url.rotaryManulExport.path+item.userId;
            this.openModel('derive')
          },
          //确定导出
          affirmDerive() {
            this.cancel('derive')
          },

          /*
      * 打开指定的模态窗体
      * @param options string 当前指定的模态:"add"、"edit"
      * */
          openModel(options){
            this[options+'Modal'] = true;
          },

          /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
          cancel(targer){
            this[targer+'Modal'] = false;
          },

        },
        created(){
            this.init();
        },
        mounted(){
        },
        components: {
          four,
        }
    }
</script>
<style lang="scss">
  .trainingArchives .menu{
    width: 250px;
    background: #ECEFF4;
    height:inherit;
    overflow: auto;
    float: left;

    .text{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
  .trainingArchives{
    .right-meue{
      margin-left: 254px;
    }
    .right-meue .right-meue-text{
      padding: 5px ;
      margin-left: 10px;
      font-size: 16px;
    }

    .right-meue .headline{
      text-align: center;
      font-size: 18px;
      padding: 5px;
    }
    .right-meue .jxjh{
      padding: 20px;
    }

    .ir-table {
      width:100%;margin: 0 auto; table-layout: fixed; BORDER-RIGHT: #B9B9B9 1px dashed; BORDER-TOP: #B9B9B9 1px dashed; BORDER-LEFT: #B9B9B9 1px dashed; BORDER-BOTTOM: #B9B9B9 1px dashed; BORDER-COLLAPSE: collapse
    }
    .ir-table .ir-table-th{
      padding: 10px;
      word-wrap:break-word;
      background: #d2d2d2;
    }
    .ir-table-th.gender, .ir-table-th.examMark, .ir-table-th.lqexamMarkState,.ir-table-th.age {
      width: 70px;
    }
    .ir-table .ir-table-td{
      padding: 10px;
      word-wrap:break-word;
    }
      .jxjh span {
          display: inline;
      }
  }



</style>
