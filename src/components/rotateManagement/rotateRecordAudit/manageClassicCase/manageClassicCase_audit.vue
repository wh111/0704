<!----------------------------------
****-- 大病历模板
****--@date     2017/7/4
****--@author   gx
----------------------------------->
<template>
    <div>
      <el-form  v-for="item in 1" :key="item" :model="formValidate" ref="formValidate" :rules="entityAudit"  class="demo-form-inline" label-width="130px" >
        <el-row class="table-back-one">
          <!--批注-->

          <el-col :span="6" >
            <el-form-item label="姓名:" prop="cname" >
              {{formValidate.cname}}
            </el-form-item>
          </el-col>

          <el-col :span="6" >
            <el-form-item label="性别:" prop="csex" >
              {{formValidate.csex}}
            </el-form-item>
          </el-col >

          <el-col :span="6" >
            <el-form-item label="年龄:" prop="cage" >
              {{formValidate.cage}}
            </el-form-item>
          </el-col >

          <el-col :span="6" >
            <el-form-item label="婚姻:" prop="cisMarry" >
              {{formValidate.cisMarry | typeText}}
            </el-form-item>
          </el-col >

        </el-row >

        <el-row class="table-back-two" >
          <!--批注-->

          <el-col :span="6" >
            <el-form-item label="民族:" prop="cnation" >
              {{formValidate.cnation}}
            </el-form-item>
          </el-col>

          <el-col :span="6" >
            <el-form-item label="职业:" prop="czhiye" >
              {{formValidate.czhiye}}
            </el-form-item>
          </el-col >

          <el-col :span="6" >
            <el-form-item label="住址:" prop="caddress" >
              {{formValidate.caddress}}
            </el-form-item>
          </el-col >

        </el-row >


        <el-row class="table-back-two" >
          <el-col :span="6" >
            <el-form-item label="籍贯:" prop="cnation">
              {{formValidate.cbirthPlace}}
            </el-form-item>
          </el-col>

          <el-col :span="6" >
            <el-form-item label="工作单位:" prop="workAddress" >
              {{formValidate.workAddress}}
            </el-form-item>
          </el-col >

          <el-col :span="6" >
            <el-form-item label="联系电话:" prop="phone" >
              {{formValidate.phone}}
            </el-form-item>
          </el-col >
          <el-col :span="6" >
            <el-form-item label="可靠程度:" prop="reliability" >
              {{formValidate.reliability}}
            </el-form-item>
          </el-col >
        </el-row >



        <el-row class="table-back-one">
          <!--批注-->

          <el-col :span="6" >
            <el-form-item label="床号:" prop="cbedNo" >
              {{formValidate.cbedNo}}
            </el-form-item>
          </el-col>

          <el-col :span="6" >
            <el-form-item label="住院号:" prop="czyNo" >
              {{formValidate.czyNo}}
            </el-form-item>
          </el-col >

          <el-col :span="12" >
            <el-form-item label="病区:" prop="clesion" >
              {{formValidate.clesion}}
            </el-form-item>
          </el-col >
        </el-row >

        <el-row class="table-back-two">
          <!--批注-->
          <el-col :span="6" >
            <el-form-item label="病史陈述者:" prop="cbscsz" >
              {{formValidate.cbscsz}}
            </el-form-item>
          </el-col >
          <el-col :span="6" >
            <el-form-item label="与患者关系:" prop="chuanzheUser" >
              {{formValidate.chuanzheUser}}
            </el-form-item>
          </el-col >
          <el-col :span="12">
            <el-form-item label="入院日期:" prop="cruyuanDate">
              {{formValidate.cruyuanDate}}
            </el-form-item>
          </el-col>
        </el-row >

        <el-row class="table-back-one">
          <el-col :span="6" >
            <el-form-item label="病历采写时间:" prop="cjlDate">
              {{formValidate.cjlDate}}
            </el-form-item>
          </el-col>
          <el-col :span="6" >
            <el-form-item label="住院医师:" prop="phone" >
              {{name}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="科室:" prop="cdepName">
              {{formValidate.cdepName}}
            </el-form-item>
          </el-col>
        </el-row >

        <el-row class="table-back-two">
          <el-col :span="24" >
            <el-form-item label="主诉:" prop="czs" >
              <el-input type="textarea" readonly v-model="formValidate.czs"></el-input>
            </el-form-item>
          </el-col>
        </el-row >

        <el-row class="table-back-one">
          <el-col :span="24" >
            <el-form-item label="现病史:" prop="cxbs" >
              <el-input type="textarea" readonly v-model="formValidate.cxbs"></el-input>
            </el-form-item>
          </el-col>
        </el-row >

        <el-row class="table-back-one">
          <el-col :span="24" >
            <el-form-item label="既往史:" >
              <el-input type="textarea" readonly v-model="formValidate.cjbs"></el-input>
            </el-form-item>
          </el-col>
        </el-row >

        <el-row >
          <el-col :span="24" >
            <el-collapse v-model="activeNames" >
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
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="呼吸系统:" prop="cxthgHxxt" >
                      {{formValidate.cxthgHxxt}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >

                    <el-form-item label="循环系统:" prop="cxthgXuhxt" >
                      {{formValidate.cxthgXuhxt}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="消化系统:" prop="cxthgXihxt" >
                      {{formValidate.cxthgXihxt}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="泌尿生殖系统:" prop="cxthgMlxt" >
                      {{formValidate.cxthgMlxt}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="造血系统:" prop="cxthgXyxt" >
                      {{formValidate.cxthgXyxt}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="内分泌系统及代谢:" prop="cxthgNfmxt" >
                      {{formValidate.cxthgNfmxt}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="神经精神系统:" prop="cxthgSjxt1" >
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
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="肌肉骨骼系统:" prop="cxthgGgjxt" >
                      {{formValidate.cxthgGgjxt}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="个人史:" prop="cxthgGrs" >
                      {{formValidate.cxthgGrs}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="月经史:" prop="cxthgYjhys" >
                      {{formValidate.cxthgYjhys}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="婚姻史:" prop="cxthgHys" >
                      {{formValidate.cxthgHys}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="生育史:" prop="cxthgSys" >
                      {{formValidate.cxthgSys}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="家族史:" prop="cxthgJts" >
                      {{formValidate.cxthgJts}}
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
              <!---->
              <el-collapse-item title=" 体格检查" name="2">
                <el-row >
                  <el-col :span="24">
                    <el-form-item label="生命体征:"  >
                      <el-row >
                        <el-col :span="6">
                          <el-form-item label="体温(T):" prop="ctgjcSmtzT" label-width="80px">
                            {{formValidate.ctgjcSmtzT}} °C
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="脉搏(P):" prop="ctgjcSmtzP" label-width="80px">
                            {{formValidate.ctgjcSmtzP}} 次/分
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="呼吸(R):" prop="ctgjcSmtzR" label-width="80px">
                            {{formValidate.ctgjcSmtzR}} 次/分
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="血压(BP):" prop="ctgjcSmtzBp" label-width="80px">
                            {{formValidate.ctgjcSmtzBp}} mmHg(kPa)
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="一般状况:" prop="ctgjcYbqk1" >
                      {{formValidate.ctgjcYbqk1}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="皮肤粘膜:" prop="ctgjcPfnm" >
                      {{formValidate.ctgjcPfnm}}
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="淋巴结:" prop="ctgjcQblbj" >
                      {{formValidate.ctgjcQblbj}}
                    </el-form-item>
                  </el-col>
                </el-row>

                <!--头部五官-->
                <el-collapse v-model="activeNames" >
                  <el-collapse-item title=" 头部五官" name="2-1">
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="头颅:" prop="ctgjcTbqg" >
                          {{formValidate.ctgjcTbqg}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="眼:" prop="ctgjcYan" >
                          {{formValidate.ctgjcYan}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="耳:" prop="ctgjcEr" >
                          {{formValidate.ctgjcEr}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="鼻:" prop="ctgjcBi" >
                          {{formValidate.ctgjcBi}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="口:" prop="ctgjcKou" >
                          {{formValidate.ctgjcKou}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-collapse-item>
                </el-collapse>
                <br>

                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="颈部:" prop="ctgjcJb" >
                      {{formValidate.ctgjcJb}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="胸部:" prop="ctgjcXb" >
                      {{formValidate.ctgjcXb}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <!--<el-row >
                  <el-col :span="24" >
                    <el-form-item label="胸廊:" prop="ctgjcXl" >
                      {{formValidate.ctgjcXl}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="乳腺:" prop="ctgjcRx" >
                      {{formValidate.ctgjcRx}}
                    </el-form-item>
                  </el-col>
                </el-row>
-->
                <!--肺-->
                <el-collapse v-model="activeNames" >
                  <el-collapse-item title=" 肺" name="2-3">
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="视诊:" prop="ctgjcSz1" >
                          {{formValidate.ctgjcSz1}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="触诊:" prop="ctgjcCz1" >
                          {{formValidate.ctgjcCz1}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="叩诊:" prop="ctgjcKz1" >
                          {{formValidate.ctgjcKz1}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="听诊:" prop="ctgjcTz1" >
                          {{formValidate.ctgjcTz1}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-collapse-item>
                </el-collapse>
                <br>


                <!--心脏-->
                <el-collapse v-model="activeNames" >
                  <el-collapse-item title="心脏" name="2-4">
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="视诊:" prop="ctgjcSz2" >
                          {{formValidate.ctgjcSz2}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="触诊:" prop="ctgjcCz2" >
                          {{formValidate.ctgjcCz2}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp; &nbsp; &nbsp;   叩诊：心脏相对浊音界如下况：
                    <el-row>
                      <el-col :span="3" :offset="2">
                        <div style="text-align: center">右(Cm)</div>
                      </el-col>
                      <el-col  style="text-align: center" :span="3" :offset="2">
                        <div>肋间</div>
                      </el-col>
                      <el-col :span="3" :offset="2">
                        <div  style="text-align: center">左(Cm)</div>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="3" :offset="2">
                        <el-form-item label-width="0" prop="ctgjcKzy1" >
                          {{formValidate.ctgjcKzy1}}
                        </el-form-item>
                      </el-col>
                      <el-col  style="text-align: center" :span="3" :offset="2">
                        <div>II</div>
                      </el-col>
                      <el-col :span="3" :offset="2">
                        <el-form-item label-width="0" prop="ctgjcKzz1" >
                          {{formValidate.ctgjcKzz1}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="3" :offset="2">
                        <el-form-item label-width="0" prop="ctgjcKzy2" >
                          {{formValidate.ctgjcKzy2}}
                        </el-form-item>
                      </el-col>
                      <el-col  style="text-align: center" :span="3" :offset="2">
                        <div>III</div>
                      </el-col>
                      <el-col :span="3" :offset="2">
                        <el-form-item  prop="ctgjcKzz2" label-width="0">
                          {{formValidate.ctgjcKzz2}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="3" :offset="2">
                        <el-form-item  prop="ctgjcKzy3" label-width="0">
                          {{formValidate.ctgjcKzy3}}
                        </el-form-item>
                      </el-col>
                      <el-col  style="text-align: center" :span="3" :offset="2">
                        <div>IV</div>
                      </el-col>
                      <el-col :span="3" :offset="2">
                        <el-form-item  prop="ctgjcKzz3" label-width="0">
                          {{formValidate.ctgjcKzz3}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="3" :offset="2">
                        <el-form-item  prop="ctgjcKzy4" label-width="0">
                          {{formValidate.ctgjcKzy4}}
                        </el-form-item>
                      </el-col>
                      <el-col  style="text-align: center" :span="3" :offset="2">
                        <div>V</div>
                      </el-col>
                      <el-col :span="3" :offset="2">
                        <el-form-item  prop="ctgjcKzz4" label-width="0">
                          {{formValidate.ctgjcKzz4}}
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="听诊:" prop="ctgjcTz2" >
                          {{formValidate.ctgjcTz2}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="双侧桡动脉:" prop="ctgjcRdm" >
                          {{formValidate.ctgjcRdm}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="周围血管征:" prop="ctgjcZwxg">
                          {{formValidate.ctgjcZwxg}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-collapse-item>
                </el-collapse>
                <br>



                <!--腹部-->
                <el-collapse v-model="activeNames" >
                  <el-collapse-item title=" 腹部" name="2-5">
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="腹部:" prop="ctgjcFb" >
                          腹围: {{formValidate.ctgjcFb}} cm

                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="视诊:" prop="ctgjcSz3" >
                          {{formValidate.ctgjcSz3}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="触诊:" prop="ctgjcCz3" >
                          {{formValidate.ctgjcCz3}}
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="叩诊:" prop="ctgjcKz3" >
                          {{formValidate.ctgjcKz3}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="听诊:" prop="ctgjcTz3" >
                          {{formValidate.ctgjcTz3}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-collapse-item>
                </el-collapse>
                <br>


                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="肛门直肠:" prop="ctgjcGzc" >
                      {{formValidate.ctgjcGzc}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="外生殖器:" prop="ctgjcWszq" >
                      {{formValidate.ctgjcWszq}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="脊柱及四肢:" prop="ctgjcJz" >
                      {{formValidate.ctgjcJz}}
                    </el-form-item>
                  </el-col>
                </el-row>

                <!--神经系统-->
                <el-collapse v-model="activeNames" >
                  <el-collapse-item title="神经系统" name="2-6">
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="生理反射:" prop="ctgjcSjxt2" >
                          {{formValidate.ctgjcSjxt2}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="病理反射:" prop="ctgjcSjxtblfs" >
                          {{formValidate.ctgjcSjxtblfs}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="脑膜刺激征:" prop="ctgjcSjxtnmcjz" >
                          {{formValidate.ctgjcSjxtnmcjz}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-collapse-item>
                </el-collapse>
                <br>

                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="专科检查:" prop="ctgjcZkqk" >
                      {{formValidate.ctgjcZkqk}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="实验室及器械检查:" prop="ctgjcSysjc" >
                      {{formValidate.ctgjcSysjc}}
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row >

        <el-row class="table-back-one">
          <el-col :span="24" >
            <el-form-item label="病例摘要:" prop="cblzy" >
              <el-input type="textarea" readonly v-model="formValidate.cblzy"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="table-back-two">
          <el-col :span="24" >
            <el-form-item label="初步诊断:" prop="ccbzd" >
              <el-input type="textarea" readonly v-model="formValidate.ccbzd"></el-input>
            </el-form-item>

          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="医师签名:" prop="cysqm1" >
              {{formValidate.cysqm1}}
            </el-form-item>
          </el-col>
          <el-col :span="5" >
            <el-form-item label="时间:" prop="cysqm1Date" label-width="70px">
              {{formValidate.cysqm1Date}}
            </el-form-item>
          </el-col>
        </el-row>

      <!--审核信息-->
      <!--审核历史列表-->
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
          width="75">
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
          width="150">
        </el-table-column>
        <el-table-column
          prop="reviewMess"
          label="审核意见"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="spState"
          label="审核状态"
          width="100"
        >
          <template scope="scope">
            {{ scope.row.spState | typeText}}
          </template>
        </el-table-column>
      </el-table>

      <!--审核项-->

      <el-row >
        <el-col :span="8" >
          <el-form-item label="审核结果:" prop="spState" >
            <el-radio-group v-model="formValidate.spState">
              <el-radio class="radio"  label="PASS">通过</el-radio>
              <el-radio class="radio"  label="REJECT">未通过</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="16" >
          <el-form-item label="审核意见:" prop="reviewMess" >
            <el-input type="textarea"  v-model="formValidate.reviewMess"></el-input>
          </el-form-item>
        </el-col >
      </el-row >

        </br>
        <el-row>
          <el-col :span="24" style="text-align: center">
            <!--<load-btn @postilSubEvent="postilSubEvent" :btnData="saveBtn"></load-btn>-->
            <load-btn @saveSubEvent="saveSubEvent" :btnData="loadBtn"></load-btn>
            <el-button  @click="cancel">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
</template>
<script>
  /*当前组件必要引入*/
  import baseRules from '../../../../formRules/base'; // 公共规则
  import {entityAudit} from '../../rules'
  //当前组件引入全局的util
    //前台业务字典组件引入
    import dictionary from '../../../../libs/dictionary.js';
    let Util = null;
    export default{
        props:['operailityData','url','podId'],
        data() {
            return {
              baseRules,
              entityAudit,
              saveBtn: {title: '批注', callParEvent: 'postilSubEvent'},
              loadBtn: {title: '保存', callParEvent: 'saveSubEvent'},
              name: '',
              activeNames: [],
              dictionary: dictionary,
              formValidate: {
                spState:'',
                /*"caseId": '',
//                "ctype": "DBL 大病例 MJJL 麻醉记录 YXZL 影像资料",
                "cname": "姓名",
                "csex": "男",
                "cage": "13",
                "cisMarry": "YES",
                "cnation": "汉族",
                "czhiye": "职业",
                "caddress": "住址",
                "cbirthPlace": "出生地",
                "cbedNo": "床号",
                "czyNo": "住院号",
                "clesion": "病区",
                "cruyuanDate": "2012-02-01",
                "cjlDate": "2012-02-01",
                "cbscsz": "病史陈述者",
                "chuanzheUser": "与患者关系",
                "cdepId": this.depId,
                "cdepName": this.depName,
                "cpodId": this.podId,
                "czs": "主诉",
                "cxbs": "现病史",
                "cjwsYbjkqk": "平时一般健康情况",
                "cjwsCrbs": "传染病史",
                "cjwsSswss": "手术外伤史",
                "cjwsYwgms": "药物过敏史",
                "cxthgHxxt": "呼吸系统",
                "cxthgXuhxt": "循环系统",
                "cxthgXihxt": "消化系统",
                "cxthgMlxt": "泌尿系统",
                "cxthgXyxt": "血液系统",
                "cxthgNfmxt": "内分泌系统",
                "cxthgSjxt1": "神经系统",
                "cxthgSzxt": "生殖系统",
                "cxthgGgjxt": "肌肉骨关节系统",
                "cxthgGrs": "个人史",
                "cxthgYjhys": "月经婚育史",
                "cxthgJts": "家庭史",
                "ctgjcSmtzT": "生命体征T",
                "ctgjcSmtzC": "生命体征C",
                "ctgjcSmtzP": "生命体征P",
                "ctgjcSmtzCf1": "生命特征 次/分",
                "ctgjcSmtzR": "生命体征R",
                "ctgjcSmtzCf2": "生命特征 次/分2",
                "ctgjcSmtzBp": "生命特征bp",
                "ctgjcYbqk1": "一般情况",
                "ctgjcPfnm": "皮肤粘膜",
                "ctgjcQblbj": "浅表淋巴结",
                "ctgjcTbqg": "头部及其器官",
                "ctgjcJb": "颈部",
                "ctgjcXb": "胸部",
                "ctgjcXl": "胸廊",
                "ctgjcRx": "乳腺",
                "ctgjcFei": "肺",
                "ctgjcSz1": "视诊",
                "ctgjcCz1": "触诊",
                "ctgjcKz1": "叩诊",
                "ctgjcTz1": "听诊",
                "ctgjcXz": "心脏",
                "ctgjcSz2": "视诊",
                "ctgjcCz2": "触诊",
                "ctgjcKzy1": "叩右1",
                "ctgjcKzy2": "叩右2",
                "ctgjcKzy3": "叩右3",
                "ctgjcKzy4": "叩右4",
                "ctgjcKzz1": "叩左1",
                "ctgjcKzz2": "叩左2",
                "ctgjcKzz3": "叩左3",
                "ctgjcKzz4": "叩左4",
                "ctgjcTz2": "听诊",
                "ctgjcRdm": "桡动脉",
                "ctgjcZwxg": "周围血管征",
                "ctgjcFb": "腹部",
                "ctgjcSz3": "视诊",
                "ctgjcCz3": "触诊",
                "ctgjcYbqk2": "一般情况",
                "ctgjcGz": "肝脏",
                "ctgjcPz": "脾脏",
                "ctgjcSz": "肾脏",
                "ctgjcQt": "其他",
                "ctgjcKz3": "叩诊",
                "ctgjcTz3": "听诊",
                "ctgjcGzc": "肛门、直肠",
                "ctgjcWszq": "外生殖器",
                "ctgjcJz": "脊柱",
                "ctgjcShiz": "四肢",
                "ctgjcSjxt2": "神经系统",
                "ctgjcZkqk": "专科情况",
                "ctgjcSysjc": "实验室及特殊检查",
                "cblzy": "病例摘要",
                "ccbzd": "初步诊断",
                "cysqm1": "医师签名",
                "cysqm1Date": "2012-02-01",
                "cryzd": "入院诊断",
                "cysqm2": "医师签名1",
                "cysqm2Date": "2012-02-01",
                "copyField": [
                  {
                    "fieldName": "cjwsYbjkqk",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "cjwsCrbs",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "cjwsSswss",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "cjwsYwgms",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "cxthgHxxt",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "cxthgXuhxt",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "cxthgXihxt",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "cxthgMlxt",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "cxthgXyxt",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "cxthgNfmxt",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "cxthgSjxt1",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "cxthgSzxt",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "cxthgGgjxt",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "cxthgGrs",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "cxthgYjhys",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "cxthgJts",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcSmtzT",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcSmtzC",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcSmtzP",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcSmtzCf1",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcSmtzR",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcSmtzCf2",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcSmtzBp",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcYbqk1",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcPfnm",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcQblbj",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcTbqg",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcJb",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcXb",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcXl",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcRx",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcFei",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcSz1",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcCz1",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcKz1",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcTz1",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcXz",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcSz2",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcCz2",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcKzy1",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcKzy2",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcKzy3",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcKzy4",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcKzz1",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcKzz2",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcKzz3",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcKzz4",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcTz2",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcRdm",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcZwxg",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcFb",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcSz3",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcCz3",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcYbqk2",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcGz",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcPz",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcSz",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcQt",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcKz3",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcTz3",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcGzc",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcWszq",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcJz",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcShiz",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcSjxt2",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcZkqk",
                    "isCopy": 0
                  },
                  {
                    "fieldName": "ctgjcSysjc",
                    "isCopy": 0
                  }
                ],
                "mapBigLog": {
                  "cname": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cSex": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cage": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cisMarry": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cnation": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "czhiye": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "caddress": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cbirthPlace": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cbedNo": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "czyNo": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "clesion": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cruyuanDate": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cjlDate": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cbscsz": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "chuanzheUser": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "czs": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cxbs": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cjwsYbjkqk": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cjwsCrbs": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cjwsSswss": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cjwsYwgms": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cxthgHxxt": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cxthgXuhxt": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cxthgXihxt": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cxthgMlxt": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cxthgXyxt": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cxthgNfmxt": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cxthgSjxt1": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cxthgSzxt": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cxthgGgjxt": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cxthgGrs": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cxthgYjhys": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cxthgJts": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcSmtzT": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcSmtzC": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcSmtzP": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcSmtzCf1": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcSmtzR": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcSmtzCf2": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcSmtzBp": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcYbqk1": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcPfnm": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcQblbj": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcTbqg": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcJb": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcXb": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcXl": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcRx": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcFei": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcSz1": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcCz1": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcKz1": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcTz1": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcXz": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcSz2": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcCz2": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcKzy1": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcKzy2": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcKzy3": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcKzy4": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcKzz1": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcKzz2": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcKzz3": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcKzz4": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcTz2": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcRdm": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcZwxg": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcFb": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcSz3": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcCz3": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcYbqk2": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcGz": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcPz": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcSz": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcQt": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcKz3": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcTz3": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcGzc": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcWszq": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcJz": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcShiz": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcSjxt2": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcZkqk": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ctgjcSysjc": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cblzy": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "ccbzd": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cysqm1": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cysqm1Date": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cryzd": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cysqm2": {
                    "bcValue": "",
                    "bcValueIng": ""
                  },
                  "cysqm2Date": {
                    "bcValue": "",
                    "bcValueIng": ""
                  }
                },
                "fileList": [
                  {
                    "id": 1,
                    "fileName": "123",
                    "fileType": "txt",
                    "fileUrl": "www.baidu.com"
                  }
                ],
                "review": [
                  {
                    "createUserName": "审核人",
                    "createTime": "审核时间",
                    "reviewMess": "审核意见",
                    "spState": "审核状态(PASS 通过 REJECT 驳回)"
                  }
                ],*/
                "copyBl": 0
              },
              template: {},
              //当前组件提交(add)数据时,ajax处理的 基础信息设置
              addMessTitle: {},
              listMessTitle:{
                ajaxSuccess:'SuccessGetCurrData',
                ajaxParams:{
                  url:this.url.classicCaseRecordGet.path+this.operailityData.cid,
                }
              },

              addMarkData:{},
              tableData:[],
              hasConfiguration:false,
          }
        },
        methods: {
          //初始化请求列表数据
          init(){
//              获取当前登录人的信息
            let userInfo = this.$store.getters.getUserInfo;
            this.name= userInfo.name;
            this.ajax(this.listMessTitle);
          },

          SuccessGetCurrData(res){
            let data = res.data;
            if(!data) return;
            data.spState = 'PASS';
            data.reviewMess = '';
            this.formValidate = data;
          },

          /*
           * 点击提交按钮 监听是否提交数据
           * @param isLoadingFun boolean  form表单验证是否通过
           * */
          listenSubEvent(isLoadingFun){
            let isSubmit = this.submitForm("formValidate");
            if(isSubmit){
              if(!isLoadingFun) isLoadingFun=function(){};
              isLoadingFun(true);
              this.addMessTitle.ajaxParams.data=this.getFormData(this.formValidate);
              this.ajax(this.addMessTitle,isLoadingFun);
            }
          },

          /*
           * 点击提交按钮 监听是否验证通过
           * @param formName string  form表单v-model数据对象名称
           * @return flag boolean   form表单验证是否通过
           * */
          submitForm(formName){
            let flag = true;
            for(let i=0;i< this.$refs[formName].length;i++){
              this.$refs[formName][i].validate((valid) => {
                if (!valid) {
                  flag= false;
                }
              });
            }

            return flag;
          },

          //保存 审核
          saveSubEvent(isLoadingFun){
            let addMessTitle={
              type:'audit',
              successTitle:'保存成功!',
              errorTitle:'保存失败!',
              ajaxSuccess:'ajaxSuccess',
              ajaxError:'ajaxError',
              ajaxParams:{
                url:this.url.classicCasesReview.path+this.operailityData.cid,
                method:'put',
                data:{},
              }
            };
            this.addMessTitle = addMessTitle;
            this.listenSubEvent(isLoadingFun)
          },


         //取消
          cancel(){
            this.$emit('cancel','audit');
          },

         //上传文件
          expenseFileEvent(ids){

            this.formValidate.fileIds = ids;
          },

          /*
           * 获取表单数据
           * @return string  格式:id=0&name=aa
           * */
          getFormData(data){
            let myData = this.$util._.defaultsDeep({},data);
            return myData;
          },

          templateFilling(){
          this.formValidate = Object.assign(this.formValidate,this.template)
          },
        },
        created(){
            this.init();


        },
        mounted(){
        },
        components: {}
    }
</script>
