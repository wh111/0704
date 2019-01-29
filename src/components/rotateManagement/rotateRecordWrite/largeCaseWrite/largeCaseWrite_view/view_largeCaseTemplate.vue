<!----------------------------------
****-- 大病历模板
****--@date     2017/7/4
****--@author   gx
---------------------------------->
<template>
  <div>
    <el-form class="demo-form-inline" label-width="130px">
      <el-row class="table-back-one">
        <!--批注-->
        <el-col :span="24" v-if="mapBigLog.cname||mapBigLog.cSex||mapBigLog.cage||mapBigLog.cisMarry">
          <el-col :span="6">
            <el-form-item>
              <div class="postil-text">{{mapBigLog.cname || '' | placeholder}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <div class="postil-text">{{mapBigLog.cSex || '' | placeholder}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <div class="postil-text">{{mapBigLog.cage || '' | placeholder}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <div class="postil-text">{{mapBigLog.cisMarry || '' | typeText | placeholder}}</div>
            </el-form-item>
          </el-col>
        </el-col>


        <el-col :span="6">
          <el-form-item label="姓名:">
            {{formValidate.cname}}
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="性别:" prop="csex">
            {{formValidate.csex}}
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="年龄:" prop="cage">
            {{formValidate.cage}}
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="婚姻:" prop="cisMarry">
            {{formValidate.cisMarry | typeText}}
          </el-form-item>
        </el-col>

      </el-row>

      <el-row class="table-back-two">
        <!--批注-->
        <el-col :span="24" v-if="mapBigLog.cnation||mapBigLog.czhiye||mapBigLog.caddress">
          <el-col :span="6">
            <el-form-item>
              <div class="postil-text">{{mapBigLog.cnation || '' | placeholder}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <div class="postil-text">{{mapBigLog.czhiye || '' | placeholder}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <div class="postil-text">{{mapBigLog.caddress || '' | placeholder}}</div>
            </el-form-item>
          </el-col>
        </el-col>


        <el-col :span="6">
          <el-form-item label="民族:" prop="cnation">
            {{formValidate.cnation}}
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="职业:" prop="czhiye">
            {{formValidate.czhiye}}
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="住址:" prop="caddress">
            {{formValidate.caddress}}
          </el-form-item>
        </el-col>

      </el-row>


      <el-row class="table-back-two">
        <!--批注-->
        <el-col :span="24" v-if="mapBigLog.cbirthPlace||mapBigLog.workAddress||mapBigLog.phone||mapBigLog.reliability">
          <el-col :span="6">
            <el-form-item>
              <div class="postil-text">{{mapBigLog.cbirthPlace || '' | placeholder}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <div class="postil-text">{{mapBigLog.workAddress || '' | placeholder}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <div class="postil-text">{{mapBigLog.phone || '' | placeholder}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <div class="postil-text">{{mapBigLog.reliability || '' | placeholder}}</div>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="6">
          <el-form-item label="籍贯:" prop="cnation">
            {{formValidate.cbirthPlace}}
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="工作单位:" prop="workAddress">
            {{formValidate.workAddress}}
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="联系电话:" prop="phone">
            {{formValidate.phone}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="可靠程度:" prop="reliability">
            {{formValidate.reliability}}
          </el-form-item>
        </el-col>
      </el-row>


      <el-row class="table-back-one">
        <!--批注-->
        <el-col :span="24" v-if="mapBigLog.cbedNo||mapBigLog.czyNo||mapBigLog.clesion">
          <el-col :span="6">
            <el-form-item>
              <div class="postil-text">{{mapBigLog.cbedNo || '' | placeholder}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <div class="postil-text">{{mapBigLog.czyNo || '' | placeholder}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <div class="postil-text">{{mapBigLog.clesion || '' | placeholder}}</div>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="6">
          <el-form-item label="床号:" prop="cbedNo">
            {{formValidate.cbedNo}}
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="住院号:" prop="czyNo">
            {{formValidate.czyNo}}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="病区:" prop="clesion">
            {{formValidate.clesion}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="table-back-two">
        <!--批注-->
        <el-col :span="24" v-if="mapBigLog.cbscsz||mapBigLog.chuanzheUser||mapBigLog.cruyuanDate">
          <el-col :span="6">
            <el-form-item>
              <div class="postil-text">{{mapBigLog.cbscsz || '' | placeholder}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <div class="postil-text">{{mapBigLog.chuanzheUser || '' | placeholder}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <div class="postil-text">{{mapBigLog.cruyuanDate || '' | placeholder}}</div>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="6">
          <el-form-item label="病史陈述者:" prop="cbscsz">
            {{formValidate.cbscsz}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="与患者关系:" prop="chuanzheUser">
            {{formValidate.chuanzheUser}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入院日期:" prop="cruyuanDate">
            {{formValidate.cruyuanDate}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="table-back-one">
        <!--批注-->
        <el-col :span="24" v-if="mapBigLog.cjlDate||mapBigLog.createUserNmae||mapBigLog.cdepName">
          <el-col :span="6">
            <el-form-item>
              <div class="postil-text">{{mapBigLog.cjlDate || '' | placeholder}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <div class="postil-text">{{mapBigLog.createUserNmae || '' | placeholder}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <div class="postil-text">{{mapBigLog.cdepName || '' | placeholder}}</div>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="6">
          <el-form-item label="病历采写时间:" prop="cjlDate">
            {{formValidate.cjlDate}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="住院医师:" prop="phone">
            {{formValidate.createUserNmae}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="科室:" prop="cdepName">
            {{formValidate.cdepName}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="table-back-two">
        <el-col :span="24">
          <el-form-item>
            <div class="postil-text">{{mapBigLog.czs}}</div>
          </el-form-item>
          <el-form-item label="主诉:" prop="czs">
            <el-input type="textarea" readonly v-model="formValidate.czs"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="table-back-one">
        <el-col :span="24">
          <el-form-item>
            <div class="postil-text">{{mapBigLog.cxbs}}</div>
          </el-form-item>
          <el-form-item label="现病史:" prop="cxbs">
            <el-input type="textarea" readonly v-model="formValidate.cxbs"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="table-back-one">
        <el-col :span="24">
          <el-form-item>
            <div class="postil-text">{{mapBigLog.cjbs}}</div>
          </el-form-item>
          <el-form-item label="既往史:">
            <el-input type="textarea" readonly v-model="formValidate.cjbs"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-collapse v-model="activeNames">
            <!---->
            <!--<el-collapse-item title="既往史" name="1">
              <el-row >
                <el-col :span="24" >
                  <el-form-item label="平时一般健康情况:" prop="cjwsYbjkqk" >
                    <el-input @keydown.native="keydown('cjwsYbjkqk',$event)" @paste.native="contextmenu('cjwsYbjkqk',$event)" type="textarea" v-model="formValidate.cjwsYbjkqk"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row >
                <el-col :span="24" >
                  <el-form-item label="传染病史:" prop="cjwsCrbs" >
                    <el-input @keydown.native="keydown('cjwsCrbs',$event)"  @paste.native="contextmenu('cjwsCrbs',$event)" type="textarea" v-model="formValidate.cjwsCrbs"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row >
                <el-col :span="24" >
                  <el-form-item label="手术外伤史:" prop="cjwsSswss" >
                    <el-input @keydown.native="keydown('cjwsSswss',$event)"  @paste.native="contextmenu('cjwsSswss',$event)" type="textarea" v-model="formValidate.cjwsSswss"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row >
                <el-col :span="24" >
                  <el-form-item label="药物过敏史:" prop="cjwsYwgms" >
                    <el-input @keydown.native="keydown('cjwsYwgms',$event)"  @paste.native="contextmenu('cjwsYwgms',$event)" type="textarea" v-model="formValidate.cjwsYwgms"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>-->
            <!---->
            <el-collapse-item title="系统回顾" name="1">
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <div class="postil-text">{{mapBigLog.cxthgHxxt}}</div>
                  </el-form-item>
                  <el-form-item label="呼吸系统:" prop="cxthgHxxt">
                    {{formValidate.cxthgHxxt}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <div class="postil-text">{{mapBigLog.cxthgXuhxt}}</div>
                  </el-form-item>
                  <el-form-item label="循环系统:" prop="cxthgXuhxt">
                    {{formValidate.cxthgXuhxt}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <div class="postil-text">{{mapBigLog.cxthgXihxt}}</div>
                  </el-form-item>
                  <el-form-item label="消化系统:" prop="cxthgXihxt">
                    {{formValidate.cxthgXihxt}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <div class="postil-text">{{mapBigLog.cxthgMlxt}}</div>
                  </el-form-item>
                  <el-form-item label="泌尿生殖系统:" prop="cxthgMlxt">
                    {{formValidate.cxthgMlxt}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <div class="postil-text">{{mapBigLog.cxthgXyxt}}</div>
                  </el-form-item>
                  <el-form-item label="造血系统:" prop="cxthgXyxt">
                    {{formValidate.cxthgXyxt}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <div class="postil-text">{{mapBigLog.cxthgNfmxt}}</div>
                  </el-form-item>
                  <el-form-item label="内分泌系统及代谢:" prop="cxthgNfmxt">
                    {{formValidate.cxthgNfmxt}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <div class="postil-text">{{mapBigLog.cxthgSjxt1}}</div>
                  </el-form-item>
                  <el-form-item label="神经精神系统:" prop="cxthgSjxt1">
                    {{formValidate.cxthgSjxt1}}
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- <el-row >
                 <el-col :span="24" >
                   <el-form-item label="生殖系统:" prop="cxthgSzxt" >
                     <el-input @keydown.native="keydown('cxthgSzxt',$event)"  @paste.native="contextmenu('cxthgSzxt',$event)" type="textarea" v-model="formValidate.cxthgSzxt"></el-input>
                   </el-form-item>
                 </el-col>
               </el-row>-->
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <div class="postil-text">{{mapBigLog.cxthgGgjxt}}</div>
                  </el-form-item>
                  <el-form-item label="肌肉骨骼系统:" prop="cxthgGgjxt">
                    {{formValidate.cxthgGgjxt}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <div class="postil-text">{{mapBigLog.cxthgGrs}}</div>
                  </el-form-item>
                  <el-form-item label="个人史:" prop="cxthgGrs">
                    {{formValidate.cxthgGrs}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <div class="postil-text">{{mapBigLog.cxthgYjhys}}</div>
                  </el-form-item>
                  <el-form-item label="月经史:" prop="cxthgYjhys">
                    {{formValidate.cxthgYjhys}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <div class="postil-text">{{mapBigLog.cxthgHys}}</div>
                  </el-form-item>
                  <el-form-item label="婚姻史:" prop="cxthgHys">
                    {{formValidate.cxthgHys}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <div class="postil-text">{{mapBigLog.cxthgSys}}</div>
                  </el-form-item>
                  <el-form-item label="生育史:" prop="cxthgSys">
                    {{formValidate.cxthgSys}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <div class="postil-text">{{mapBigLog.cxthgJts}}</div>
                  </el-form-item>
                  <el-form-item label="家族史:" prop="cxthgJts">
                    {{formValidate.cxthgJts}}
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
            <!---->
            <el-collapse-item title=" 体格检查" name="2">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="生命体征:">
                    <el-row>
                      <el-col :span="6">
                        <el-form-item>
                          <div class="postil-text">{{mapBigLog.ctgjcSmtzT}}</div>
                        </el-form-item>
                        <el-form-item label="体温(T):" prop="ctgjcSmtzT" label-width="80px">
                          {{formValidate.ctgjcSmtzT}} °C
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item>
                          <div class="postil-text">{{mapBigLog.ctgjcSmtzP}}</div>
                        </el-form-item>
                        <el-form-item label="脉搏(P):" prop="ctgjcSmtzP" label-width="80px">
                          {{formValidate.ctgjcSmtzP}} 次/分
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item>
                          <div class="postil-text">{{mapBigLog.ctgjcSmtzR}}</div>
                        </el-form-item>
                        <el-form-item label="呼吸(R):" prop="ctgjcSmtzR" label-width="80px">
                          {{formValidate.ctgjcSmtzR}} 次/分
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item>
                          <div class="postil-text">{{mapBigLog.ctgjcSmtzBp}}</div>
                        </el-form-item>
                        <el-form-item label="血压(BP):" prop="ctgjcSmtzBp" label-width="80px">
                          {{formValidate.ctgjcSmtzBp}} mmHg(kPa)
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <div class="postil-text">{{mapBigLog.ctgjcYbqk1}}</div>
                  </el-form-item>
                  <el-form-item label="一般状况:" prop="ctgjcYbqk1">
                    {{formValidate.ctgjcYbqk1}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <div class="postil-text">{{mapBigLog.ctgjcPfnm}}</div>
                  </el-form-item>
                  <el-form-item label="皮肤粘膜:" prop="ctgjcPfnm">
                    {{formValidate.ctgjcPfnm}}
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <div class="postil-text">{{mapBigLog.ctgjcQblbj}}</div>
                  </el-form-item>
                  <el-form-item label="淋巴结:" prop="ctgjcQblbj">
                    {{formValidate.ctgjcQblbj}}
                  </el-form-item>
                </el-col>
              </el-row>

              <!--头部五官-->
              <el-collapse v-model="activeNames">
                <el-collapse-item title=" 头部五官" name="2-1">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item>
                        <div class="postil-text">{{mapBigLog.ctgjcTbqg}}</div>
                      </el-form-item>
                      <el-form-item label="头颅:" prop="ctgjcTbqg">
                        {{formValidate.ctgjcTbqg}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item>
                        <div class="postil-text">{{mapBigLog.ctgjcYan}}</div>
                      </el-form-item>
                      <el-form-item label="眼:" prop="ctgjcYan">
                        {{formValidate.ctgjcYan}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item>
                        <div class="postil-text">{{mapBigLog.ctgjcEr}}</div>
                      </el-form-item>
                      <el-form-item label="耳:" prop="ctgjcEr">
                        {{formValidate.ctgjcEr}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item>
                        <div class="postil-text">{{mapBigLog.ctgjcBi}}</div>
                      </el-form-item>
                      <el-form-item label="鼻:" prop="ctgjcBi">
                        {{formValidate.ctgjcBi}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item>
                        <div class="postil-text">{{mapBigLog.ctgjcKou}}</div>
                      </el-form-item>
                      <el-form-item label="口:" prop="ctgjcKou">
                        {{formValidate.ctgjcKou}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
              <br>

              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <div class="postil-text">{{mapBigLog.ctgjcJb}}</div>
                  </el-form-item>
                  <el-form-item label="颈部:" prop="ctgjcJb">
                    {{formValidate.ctgjcJb}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <div class="postil-text">{{mapBigLog.ctgjcXb}}</div>
                  </el-form-item>
                  <el-form-item label="胸部:" prop="ctgjcXb">
                    {{formValidate.ctgjcXb}}
                  </el-form-item>
                </el-col>
              </el-row>

              <!--肺-->
              <el-collapse v-model="activeNames">
                <el-collapse-item title=" 肺" name="2-3">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item>
                        <div class="postil-text">{{mapBigLog.ctgjcSz1}}</div>
                      </el-form-item>
                      <el-form-item label="视诊:" prop="ctgjcSz1">
                        {{formValidate.ctgjcSz1}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item>
                        <div class="postil-text">{{mapBigLog.ctgjcCz1}}</div>
                      </el-form-item>
                      <el-form-item label="触诊:" prop="ctgjcCz1">
                        {{formValidate.ctgjcCz1}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item>
                        <div class="postil-text">{{mapBigLog.ctgjcKz1}}</div>
                      </el-form-item>
                      <el-form-item label="叩诊:" prop="ctgjcKz1">
                        {{formValidate.ctgjcKz1}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item>
                        <div class="postil-text">{{mapBigLog.ctgjcTz1}}</div>
                      </el-form-item>
                      <el-form-item label="听诊:" prop="ctgjcTz1">
                        {{formValidate.ctgjcTz1}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
              <br>


              <!--心脏-->
              <el-collapse v-model="activeNames">
                <el-collapse-item title="心脏" name="2-4">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item>
                        <div class="postil-text">{{mapBigLog.ctgjcSz2}}</div>
                      </el-form-item>
                      <el-form-item label="视诊:" prop="ctgjcSz2">
                        {{formValidate.ctgjcSz2}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item>
                        <div class="postil-text">{{mapBigLog.ctgjcCz2}}</div>
                      </el-form-item>
                      <el-form-item label="触诊:" prop="ctgjcCz2">
                        {{formValidate.ctgjcCz2}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 叩诊：心脏相对浊音界如下况：
                  <el-row>
                    <el-col :span="3" :offset="2">
                      <div style="text-align: center">右(Cm)</div>
                    </el-col>
                    <el-col style="text-align: center" :span="3" :offset="2">
                      <div>肋间</div>
                    </el-col>
                    <el-col :span="3" :offset="2">
                      <div style="text-align: center">左(Cm)</div>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="3" :offset="2">
                      <el-form-item label-width="0">
                        <div class="postil-text">{{mapBigLog.ctgjcKzy1}}</div>
                      </el-form-item>
                      <el-form-item label-width="0" prop="ctgjcKzy1">
                        {{formValidate.ctgjcKzy1}}
                      </el-form-item>
                    </el-col>
                    <el-col style="text-align: center" :span="3" :offset="2">
                      <div>II</div>
                    </el-col>
                    <el-col :span="3" :offset="2">
                      <el-form-item label-width="0">
                        <div class="postil-text">{{mapBigLog.ctgjcKzz1}}</div>
                      </el-form-item>
                      <el-form-item label-width="0" prop="ctgjcKzz1">
                        {{formValidate.ctgjcKzz1}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="3" :offset="2">
                      <el-form-item label-width="0">
                        <div class="postil-text">{{mapBigLog.ctgjcKzy2}}</div>
                      </el-form-item>
                      <el-form-item label-width="0" prop="ctgjcKzy2">
                        {{formValidate.ctgjcKzy2}}
                      </el-form-item>
                    </el-col>
                    <el-col style="text-align: center" :span="3" :offset="2">
                      <div>III</div>
                    </el-col>
                    <el-col :span="3" :offset="2">
                      <el-form-item label-width="0">
                        <div class="postil-text">{{mapBigLog.ctgjcKzz2}}</div>
                      </el-form-item>
                      <el-form-item prop="ctgjcKzz2" label-width="0">
                        {{formValidate.ctgjcKzz2}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="3" :offset="2">
                      <el-form-item label-width="0">
                        <div class="postil-text">{{mapBigLog.ctgjcKzy3}}</div>
                      </el-form-item>
                      <el-form-item prop="ctgjcKzy3" label-width="0">
                        {{formValidate.ctgjcKzy3}}
                      </el-form-item>
                    </el-col>
                    <el-col style="text-align: center" :span="3" :offset="2">
                      <div>IV</div>
                    </el-col>
                    <el-col :span="3" :offset="2">
                      <el-form-item label-width="0">
                        <div class="postil-text">{{mapBigLog.ctgjcKzz3}}</div>
                      </el-form-item>
                      <el-form-item prop="ctgjcKzz3" label-width="0">
                        {{formValidate.ctgjcKzz3}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="3" :offset="2">
                      <el-form-item label-width="0">
                        <div class="postil-text">{{mapBigLog.ctgjcKzy4}}</div>
                      </el-form-item>
                      <el-form-item prop="ctgjcKzy4" label-width="0">
                        {{formValidate.ctgjcKzy4}}
                      </el-form-item>
                    </el-col>
                    <el-col style="text-align: center" :span="3" :offset="2">
                      <div>V</div>
                    </el-col>
                    <el-col :span="3" :offset="2">
                      <el-form-item label-width="0">
                        <div class="postil-text">{{mapBigLog.ctgjcKzz4}}</div>
                      </el-form-item>
                      <el-form-item prop="ctgjcKzz4" label-width="0">
                        {{formValidate.ctgjcKzz4}}
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="24">
                      <el-form-item>
                        <div class="postil-text">{{mapBigLog.ctgjcTz2}}</div>
                      </el-form-item>
                      <el-form-item label="听诊:" prop="ctgjcTz2">
                        {{formValidate.ctgjcTz2}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item>
                        <div class="postil-text">{{mapBigLog.ctgjcRdm}}</div>
                      </el-form-item>
                      <el-form-item label="双侧桡动脉:" prop="ctgjcRdm">
                        {{formValidate.ctgjcRdm}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item>
                        <div class="postil-text">{{mapBigLog.ctgjcZwxg}}</div>
                      </el-form-item>
                      <el-form-item label="周围血管征:" prop="ctgjcZwxg">
                        {{formValidate.ctgjcZwxg}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
              <br>


              <!--腹部-->
              <el-collapse v-model="activeNames">
                <el-collapse-item title=" 腹部" name="2-5">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item>
                        <div class="postil-text">{{mapBigLog.ctgjcFb}}</div>
                      </el-form-item>
                      <el-form-item label="腹部:" prop="ctgjcFb">
                        腹围: {{formValidate.ctgjcFb}} cm

                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item>
                        <div class="postil-text">{{mapBigLog.ctgjcSz3}}</div>
                      </el-form-item>
                      <el-form-item label="视诊:" prop="ctgjcSz3">
                        {{formValidate.ctgjcSz3}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item>
                        <div class="postil-text">{{mapBigLog.ctgjcCz3}}</div>
                      </el-form-item>
                      <el-form-item label="触诊:" prop="ctgjcCz3">
                        {{formValidate.ctgjcCz3}}
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="24">
                      <el-form-item>
                        <div class="postil-text">{{mapBigLog.ctgjcKz3}}</div>
                      </el-form-item>
                      <el-form-item label="叩诊:" prop="ctgjcKz3">
                        {{formValidate.ctgjcKz3}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item>
                        <div class="postil-text">{{mapBigLog.ctgjcTz3}}</div>
                      </el-form-item>
                      <el-form-item label="听诊:" prop="ctgjcTz3">
                        {{formValidate.ctgjcTz3}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
              <br>


              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <div class="postil-text">{{mapBigLog.ctgjcGzc}}</div>
                  </el-form-item>
                  <el-form-item label="肛门直肠:" prop="ctgjcGzc">
                    {{formValidate.ctgjcGzc}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <div class="postil-text">{{mapBigLog.ctgjcWszq}}</div>
                  </el-form-item>
                  <el-form-item label="外生殖器:" prop="ctgjcWszq">
                    {{formValidate.ctgjcWszq}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <div class="postil-text">{{mapBigLog.ctgjcJz}}</div>
                  </el-form-item>
                  <el-form-item label="脊柱及四肢:" prop="ctgjcJz">
                    {{formValidate.ctgjcJz}}
                  </el-form-item>
                </el-col>
              </el-row>

              <!--神经系统-->
              <el-collapse v-model="activeNames">
                <el-collapse-item title="神经系统" name="2-6">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item>
                        <div class="postil-text">{{mapBigLog.ctgjcSjxt2}}</div>
                      </el-form-item>
                      <el-form-item label="生理反射:" prop="ctgjcSjxt2">
                        {{formValidate.ctgjcSjxt2}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item>
                        <div class="postil-text">{{mapBigLog.ctgjcSjxtblfs}}</div>
                      </el-form-item>
                      <el-form-item label="病理反射:" prop="ctgjcSjxtblfs">
                        {{formValidate.ctgjcSjxtblfs}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item>
                        <div class="postil-text">{{mapBigLog.ctgjcSjxtnmcjz}}</div>
                      </el-form-item>
                      <el-form-item label="脑膜刺激征:" prop="ctgjcSjxtnmcjz">
                        {{formValidate.ctgjcSjxtnmcjz}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
              <br>

              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <div class="postil-text">{{mapBigLog.ctgjcZkqk}}</div>
                  </el-form-item>
                  <el-form-item label="专科检查:" prop="ctgjcZkqk">
                    {{formValidate.ctgjcZkqk}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <div class="postil-text">{{mapBigLog.ctgjcSysjc}}</div>
                  </el-form-item>
                  <el-form-item label="实验室及器械检查:" prop="ctgjcSysjc">
                    {{formValidate.ctgjcSysjc}}
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>

      <el-row class="table-back-one">
        <el-col :span="24">
          <el-form-item>
            <div class="postil-text">{{mapBigLog.cblzy}}</div>
          </el-form-item>
          <el-form-item label="病例摘要:" prop="cblzy">
            <el-input type="textarea" readonly v-model="formValidate.cblzy"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="table-back-two">
        <el-col :span="24">
          <el-form-item>
            <div class="postil-text">{{mapBigLog.ccbzd}}</div>
          </el-form-item>
          <el-form-item label="初步诊断:" prop="ccbzd">
            <el-input type="textarea" readonly v-model="formValidate.ccbzd"></el-input>
          </el-form-item>

        </el-col>
        <template v-if="mapBigLog.cysqm1||mapBigLog.cysqm1Date">
          <el-col :span="10" :offset="1">
            <el-form-item>
              <div class="postil-text">{{mapBigLog.cysqm1 || '' | placeholder}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item>
              <div class="postil-text">{{mapBigLog.cysqm1Date || '' | placeholder}}</div>
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="10" :offset="1">
          <el-form-item label="医师签名:" prop="cysqm1">
            {{formValidate.cysqm1}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="时间:" prop="cysqm1Date" label-width="70px">
            {{formValidate.cysqm1Date}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="table-back-two-d">
        <el-col :span="20">
          <el-form-item label="相关证明材料:">
            <div>为证实填写的大病历为本人管床的真实病历，请上传带有学员姓名的病历首页或病程记录照片。</div>
            <upload-file accept="'png|jpg|jpeg|bmp|gif'" :uploadFiles="formValidate.fileList"
                         :show="true"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <br>
    <!--审核历史列表-->
    <!--评分表-->
    <myEvaluation :getUrl="evaluatedUrl.templateGet+tempDetailId"
                  :operailityData="{}"
                  v-if="isShowEvaluate"
                  :hideAppraiserName="true"
                  :evaluatedGetFun="evaluatedGetFun"
                  where="DBL"
                  :getBeforeFun="evaluatedGetFun"></myEvaluation>
    <br>
    <el-table
      v-if="formValidate.review && formValidate.review[0]"
      align="center"
      :height="200"
      :data="formValidate.review"
      tooltip-effect="dark"
      highlight-current-row
      style="width: 100%;height: 100%">
      <el-table-column
        align="center"
        label="序号"
        type="index"
        width="100">
      </el-table-column>
      <el-table-column
        align="center"
        prop="createUserName"
        label="审核人"
        width="200">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="审核时间"
        width="300">
      </el-table-column>
      <el-table-column
        prop="reviewMess"
        label="审核意见"
        align="center"
        width="200"
      >
      </el-table-column>
      <el-table-column
        prop="spState"
        label="审核状态"
      >
        <template scope="scope">
          {{ scope.row.spState | typeText}}
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-row>
      <el-col :span="10" :offset="9">
        <div style="margin-left: 100px">
          <el-button class="but-col" @click="derive" type="primary">导出到word</el-button>
        </div>
      </el-col>
    </el-row>

    <!--导出弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal" title="对话框标题"
           class-name="vertical-center-modal"
           :width="500">
      <modal-header slot="header" :content="deriveId"></modal-header>
      <div>
        <div class="remove">确认导出吗</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="config.urlPrefix+url.caseRecordExportToWord+operailityData.cid">
              <el-button @click="affirmDerive" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click="deriveModal=false">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!---->


  </div>
</template>
<script>
  /*当前组件必要引入*/
  /*获取评分模板api*/
  import evaluatedUrl from '../../../../teach/teachingEvaluation/app.js'
  //  评价组件
  import myEvaluation from '../../../../common/myEvaluation/myEvaluation.vue'

  import config from '../../../../../config/config.js'
  //当前组件引入全局的util
  //前台业务字典组件引入
  import dictionary from '../../../../../libs/dictionary.js'

  let Util = null
  export default {
    props: ['url', 'operailityData'],
    data () {
      return {
        config,
        evaluatedUrl,
        saveBtn: {title: '提交', callParEvent: 'saveSubEvent'},
        loadBtn: {title: '上报', callParEvent: 'appearSubEvent'},
        name: '',
        tableData: [],
        activeNames: [],
        tempDetailId: '-117', // 大病历评价模板id
        dictionary: dictionary,
        formValidate: {},
        isShowEvaluate: false,// 是否显示评分
        Evaluate: [],//评分数据
        'mapBigLog': {},
        addMarkData: {},
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {},
        listMessTitle: {
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: this.url.caseRecordGet + this.operailityData.cid,
          }
        },
        deriveModal: false,
        deriveId: {
          id: 'deriveId',
          title: '导出'
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        getConfigurationMessTitle: {
          ajaxSuccess: 'ConfigurationData',
          ajaxParams: {
            url: this.url.configurationGet + 'DBL',
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        getMarkMessTitle: {
          ajaxSuccess: 'getMarkData',
          ajaxParams: {
            url: this.url.getMark + this.operailityData.cid + '_DBL',
          }
        },

        //获取大病历评分
        evaluateListMessTitle: {
          ajaxSuccess: 'getEvaluateData',
          ajaxParams: {
            url: this.url.evaluateList + this.operailityData.cid,
          }
        },
        configurationDetails: '',
        getMark: '',
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
//          获取当前登录人的信息
        let userInfo = this.$store.getters.getUserInfo
        this.name = userInfo.name
        this.ajax(this.listMessTitle)
        if (this.operailityData.cstate == 'REJECT' || this.operailityData.cstate == 'PASS' || this.operailityData.cstate == null) {
//          this.ajax(this.getConfigurationMessTitle);  //this.operailityData.cstate==null  从代办过来的
//          this.ajax(this.getMarkMessTitle);
          this.ajax(this.evaluateListMessTitle)
        }

      },

      //获取评分成功
      getEvaluateData (res) {
        let data = res.data
        this.Evaluate = data
        this.isShowEvaluate = true
      },

      SuccessGetCurrData (res) {
        let data = res.data
        if (!data) return
//              this.mapBigLog =this.getFormValidate(this.mapBigLog,data.mapBigLog);
        if (!data.mapBigLog) data.mapBigLog = {}
        let mapBigLog = {}
        for (let key in  data.mapBigLog) {
          mapBigLog[key] = data.mapBigLog[key].bcValueIng
        }
        this.mapBigLog = mapBigLog
        this.formValidate = data
      },

      //获取打分详情
      getMarkData (res) {
        let data = res.data
        if (!data) return
        this.getMark = data.configurationDetails
        this.conductScore()
      },
      ConfigurationData (res) {
        let data = res.data
        if (!data) return
        this.addMarkData = data
        this.configurationDetails = data.configurationDetails
        this.conductScore()
      },

      //处理评分
      conductScore () {
        if (!this.configurationDetails || !this.getMark) return
        let getMarkObj = {}
        for (let l = 0; l < this.getMark.length; l++) {
          let getMark = this.getMark[l]
          getMarkObj[getMark.detailsId] = getMark.mark
        }
        let configurationDetails = this.configurationDetails
        let temArr = []
        let index = -1
        let flag
        if (this.addMarkData.type == 1) {
          flag = true
        }
        let detailClassification = ''///项目名称
        for (let i = 0; i < configurationDetails.length; i++) {
          configurationDetails[i].mark = getMarkObj[configurationDetails[i].detailId]
          if (flag || detailClassification != configurationDetails[i].detailClassification) {
            index++
            temArr[index] = {
              detailClassification: '',
              configurationDetails: [],
            }
            detailClassification = configurationDetails[i].detailClassification
            temArr[index].detailClassification = configurationDetails[i].detailClassification

            temArr[index].configurationDetails.push(configurationDetails[i])
          } else {
            temArr[index].configurationDetails.push(configurationDetails[i])
          }
        }
        this.tableData = temArr
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate')
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {}
          isLoadingFun(true)
          this.addMessTitle.ajaxParams.data = this.formDate(this.getFormData(this.formValidate), ['cysqm1Date', 'cysqm2Date', 'cruyuanDate', 'cjlDate'], 'yyyy-MM-dd')
          this.ajax(this.addMessTitle, isLoadingFun)
        }
      },

      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm (formName) {
        let flag = false
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true
          }
        })
        return flag
      },
      //保存
      saveSubEvent (isLoadingFun) {
        let addMessTitle = {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
            url: this.url.caseRecordBigCasesAdd,
            method: 'post',
            data: {},
          }
        }
        this.addMessTitle = addMessTitle
        this.listenSubEvent(isLoadingFun)
      },

      //上报
      appearSubEvent (isLoadingFun) {
        let addMessTitle = {
          type: 'add',
          successTitle: '上报成功!',
          errorTitle: '上报失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: this.url.caseRecordBigCasesAddRelease,
            method: 'post',
            data: {},
          }
        }
        this.addMessTitle = addMessTitle
        this.listenSubEvent(isLoadingFun)
      },

      //取消
      cancel () {
        this.$emit('cancel', this.addMessTitle.type)
      },

      //上传文件
      expenseFileEvent (ids) {

        this.formValidate.fileIds = ids
      },

      //导出
      derive () {
        this.deriveModal = true
      },

      //确定导出
      affirmDerive () {
        //        let http = this.$store.getters.getEnvPath.http;
        //        window.open() ;
        this.deriveModal = false
      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = this.$util._.defaultsDeep({}, data)
        return myData
      },

      //获取评分数据成功处理函数
      evaluatedGetFun (data) {
        let totalScore = 0
        let Evaluate = this.Evaluate
        Evaluate.map(item => {
          totalScore += item.score
          // item.score = item.score *100;
        })
        let tempObj = {
          totalScore: totalScore,
          evaluateResultDtoList: Evaluate,
          templateDto: data
        }
        return tempObj
      },
    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {
      myEvaluation
    }
  }
</script>
