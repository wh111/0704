<!----------------------------------
****-- 大病历模板
****--@date     2017/7/4
****--@author   gx
---------------------------------->
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
              {{formValidate.createUserNmae}}
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
        <el-row class="table-back-two-d">
          <el-col :span="20" >
            <el-form-item  label="相关证明材料:" >
              <div>为证实填写的大病历为本人管床的真实病历，请上传带有学员姓名的病历首页或病程记录照片。</div>
              <upload-file accept="'png|jpg|jpeg|bmp|gif'" :uploadFiles="formValidate.fileList"  :show="true" ></upload-file>
            </el-form-item>
          </el-col>
        </el-row>

        <!--评分表-->
     <!--   <el-table
          align="center"
          :data="tableData"
          tooltip-effect="dark"
          highlight-current-row
          border
          style="width: 100%;height: 100%">
          <el-table-column
            align="center"
            label="序号"
            type="index"
            width="75">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="detailClassification"
            label="考核项目">
          </el-table-column>
          <el-table-column
            prop="detailInspectionItem"
            label="考核内容"
            align="center"
            :show-overflow-tooltip="addMarkData.type==1"
            class-name="clearPadding">
            <template scope="scope">
              <div v-for="(item, index) in scope.row.configurationDetails">
                <div :class="{'div-noborder':scope.row.configurationDetails.length-1==index}" class="div-border" >
                  <el-tooltip  v-if="addMarkData.type!=1&&item.detailInspectionItem.length>16" effect="dark" :content="item.detailInspectionItem" placement="top">
                    <div class="overflow-txt1">{{item.detailInspectionItem}}</div>
                  </el-tooltip>
                  <div v-else>{{item.detailInspectionItem}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="detailNote"
            class-name="clearPadding"
            label="考核备注"
            :show-overflow-tooltip="addMarkData.type==1"
            align="center">
            <template scope="scope">
              <div v-for="(item, index) in scope.row.configurationDetails">
                <div :class="{'div-noborder':scope.row.configurationDetails.length-1==index}" class="div-border" >
                  <el-tooltip  v-if="addMarkData.type!=1&&item.detailNote.length>16" effect="dark" :content="item.detailNote" placement="top">
                    <div class="overflow-txt1">{{item.detailNote}}</div>
                  </el-tooltip>
                  <div v-else>{{item.detailNote}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            class-name="clearPadding"
            prop="detailScore"
            label="标准分值"
            width="100"
            align="center">
            <template scope="scope">
              <div v-for="(item, index) in scope.row.configurationDetails">
                <div :class="{'div-noborder':scope.row.configurationDetails.length-1==index}" class="div-border" >
                  {{item.detailScore}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            class-name="valiTableStyle clearPadding"
            prop="detailScore"
            label="得分"
            width="150"
            align="center">
            <template scope="scope">
              <div v-for="(item, index) in scope.row.configurationDetails">
                <div :class="{'div-noborder2':scope.row.configurationDetails.length-1==index}" class="div-border1" >
                    <el-form :model="item" ref="formValidate"  :rules="entityAudit">
                    <el-form-item  prop="mark" label-width="0">
                      <div >
                        <el-input v-model="item.mark"> </el-input>
                      </div>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>-->
        <!--评分表-->
        <myEvaluation  :getUrl="evaluatedUrl.templateGet+tempDetailId"
                       :operailityData="{}"
                       :hideAppraiserName="true"
                       :type="'noScoreList'"
                       where="DBL"
                       :submitBeforeFun="submitBeforeFun"
                       ref="evaluation"
                       :url="evaluateAdd"
                       :getBeforeFun="evaluatedGetFun"></myEvaluation>
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
        <el-col :span="8" >
          <el-form-item label="粘贴比例:" prop="phone" >
            {{formValidate.copyBl*100+'%'}}
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

      <br>
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
  import baseRules from '../../../../../formRules/base'; // 公共规则
  import {entityAudit} from '../../rules'
  import evaluatedUrl from '../../../../teach/teachingEvaluation/app.js'
  //当前组件引入全局的util
  import myEvaluation from '../../../../common/myEvaluation/myEvaluation.vue'
    //前台业务字典组件引入
    import dictionary from '../../../../../libs/dictionary.js';
    let Util = null;
    export default{
        props:['operailityData','url','podId'],
        data() {
            return {
              baseRules,
              entityAudit,
              evaluatedUrl,
              evaluateAdd:this.url.evaluateAdd+this.operailityData.cid,//评价大病历
              isEvaluation:false, // 是否显示评分表
              saveBtn: {title: '批注', callParEvent: 'postilSubEvent'},
              loadBtn: {title: '保存', callParEvent: 'saveSubEvent'},
              name: '',
              activeNames: [],
              dictionary: dictionary,
              formValidate: {
                spState:'',
                "copyBl": 0
              },
              tempDetailId:'-117', // 大病历评价模板id
              template: {
                "czs": "反复四肢关节肿痛半年。",
                "cxbs": "患者自诉半年前无明显诱因出现双膝关节肿痛，持续性关节，关节活动受限，行走困难，逐渐波及双腕、双手掌指、近端指间关节、双肘、双肩关节，伴晨僵，持续时间大于1小时，无发热、畏寒，无皮疹、口腔溃疡、光过敏，无口干、眼干，无肌痛、肌无力，于私人诊所药物治疗及自服药物治疗（具体不详），关节疼痛反复发作并逐渐加重，现为系统诊治到我院就诊，门诊拟“类风湿关节炎”收入院。入院症见：双膝、双腕、双手掌指及近端指间、双肩关节疼痛，活动受限，行走困难，偶有咳嗽，痰粘难咳出，无发热、畏寒，无胸闷、心悸、气喘，纳寐欠佳，二便调。近2月体重下降约10余斤。",
                "cjwsYbjkqk": "既往体健。否认有“高血压”、“高血脂”、“糖尿病”、“冠心病”、“肝炎”、“结核”、“胃炎”等重大疾病史。",
                "cjwsCrbs": "否认”乙肝“、“结核”等重大传染病史。",
                "cjwsSswss": "否认重大外伤及手术史。",
                "cjwsYwgms": "否认药物及食物过敏史。",
                "cxthgHxxt": "无咳嗽、咯痰、呼吸困难、咯血、发热、盗汗。",
                "cxthgXuhxt": "无心悸、气促、咯血、发绀，无心前区痛、晕厥、水肿及高血压。",
                "cxthgXihxt": "无腹胀、腹痛、嗳气、反酸、呕血、便血。",
                "cxthgMlxt": "无尿频、尿急、尿痛、排尿不畅。尿色未见异常。",
                "cxthgXyxt": "无头晕、乏力，皮肤或粘膜瘀斑、紫癜、血肿，无反复鼻出血。",
                "cxthgNfmxt": "无畏寒、怕热、多汗、食欲异常、烦渴、多饮、多尿、头痛、视力障碍、肌肉震颤。",
                "cxthgSjxt1": "无头痛、失眠或意识障碍、昏厥、痉挛、瘫痪、视力障碍。",
                "cxthgSzxt": "未检。",
                "cxthgGgjxt": "无关节疼痛，活动障碍，无红肿、肢体麻木、痉挛、萎缩、瘫痪。",
                "cxthgGrs": "出生本地，居于本市，居住环境良好，无潮湿之弊，否认放射物、毒物、疫区等接触史。否认职业病史及病毒暴露史，无吸烟饮酒的嗜好，无精神创伤及冶游史。",
                "cxthgYjhys": "适龄结婚，子女及配偶体健。",
                "cxthgJts": "否认家族遗传病史、传染病史、精神病史。",
                "ctgjcSmtzT": "36.4",
                "ctgjcSmtzC": "",
                "ctgjcSmtzP": "75",
                "ctgjcSmtzCf1": "",
                "ctgjcSmtzR": "20",
                "ctgjcSmtzCf2": "",
                "ctgjcSmtzBp": "140/80",
                "ctgjcYbqk1": "神清，精神可，发育正常，营养中等，形体适中，正常面容。自动体位，查体合作。言语不利，语声有力，对答切题，呼吸均匀，无异常气味闻及。舌暗淡，苔薄白，脉沉滑。",
                "ctgjcPfnm": "全身皮肤黏膜未见明显黄染及出血点，未见肝掌、蜘蛛痣。皮肤弹性可。温度、湿度适中。",
                "ctgjcQblbj": "全身浅表淋巴结未触及肿大",
                "ctgjcTbqg": "头颅大小正常，无畸形，头发分布正常。眉毛、眼睑、结膜、眼球正常，双侧巩膜无黄染，瞳孔等大等圆2.5mm，双侧瞳孔对光反射未见异常。双耳外观未见异常，乳突无压痛，外耳道未见分泌物。鼻部外观未见异常，无鼻翼扇动，鼻旁窦无压痛，鼻腔无分泌物。唇，舌，牙齿，牙龈正常。咽部未见异常，声音正常。扁桃体未见肿大，表面未见分泌物。",
                "ctgjcJb": "颈软无抵抗，颈动脉脉搏正常，颈静脉无怒张，气管居中，肝-颈静脉回流征阴性，甲状腺无肿大。无血管杂音。",
                "ctgjcXb": "胸部",
                "ctgjcXl": "对称，未见明显畸形，无皮下气肿，无静脉怒张及回流异常，胸骨无压痛，胸廊挤压征阴性。呼吸活动一致。",
                "ctgjcRx": "未扪及包块",
                "ctgjcFei": "双侧呼吸运动均匀对称，无增强或者减弱。双肺触觉语颤对称无异常，未触及胸膜摩擦感，未触及皮下捻发感。双肺叩诊呈清音。双肺呼吸音清，未闻及干湿啰音及胸膜摩擦音。",
                "ctgjcSz1": "呼吸动度对称，节律规则，胸式呼吸为主。",
                "ctgjcCz1": "两侧语颤对等，无胸膜摩擦感及皮下捻发感。",
                "ctgjcKz1": "两肺清音，肺下界于肩胛线第十肋隙，肺下缘移动度3厘米。",
                "ctgjcTz1": "双肺呼吸音清晰，未闻及干湿罗音，语音传导正常。",
                "ctgjcXz": "心钱区无隆起，未触及震颤，心界不大，心律84次/分，心律整齐，心音正常，未闻及奔马律，各瓣膜区未闻及病理性杂音，未闻及心包摩擦音。",
                "ctgjcSz2": "心前区无隆起，心尖搏动在第5肋间隙锁骨中线内1.5厘米，范围约1.5×1.5厘米。",
                "ctgjcCz2": "心尖搏动位置与范围同视诊，搏动有利，无震颤及心包摩擦感。",
                "ctgjcKzy1": "2.5",
                "ctgjcKzy2": "2.5",
                "ctgjcKzy3": "4",
                "ctgjcKzy4": "",
                "ctgjcKzz1": "2.5",
                "ctgjcKzz2": "4",
                "ctgjcKzz3": "5.5",
                "ctgjcKzz4": "8",
                "ctgjcTz2": "心率90次/分，心律整齐，心音正常，未闻及奔马律，各瓣膜区未闻及病理性杂音，无心包摩擦音。",
                "ctgjcRdm": "脉率、节律规则，无奇脉、交替脉。",
                "ctgjcZwxg": "未见毛细血管搏动征，未闻及水冲脉，未闻及枪击音等。",
                "ctgjcFb": "腹部",
                "ctgjcSz3": "形状对称平坦，呼吸运动，胃肠蠕动波未见异常，无皮疹、色素、条纹、瘢痕，无腹壁静脉曲张、疝或局部隆起。",
                "ctgjcCz3": "腹壁紧张度未见异常，无压痛、反跳痛、液波震颤、包块。肝脏、胆囊、脾脏未触及，肾脏未触及，无叩击痛、无压痛，膀胱未触及，输尿管压痛点无压痛。",
                "ctgjcYbqk2": "腹部外形正常，腹式呼吸正常，未见胃形，未见肠形，未见蠕动波，脐部正常。腹壁静脉无曲张，无手术瘢痕，腹软，全腹无压痛及反跳痛，未触及液波震颤，全腹未触及包块，肝脏肋下未触及，胆囊未触及，Murphy征阴性，脾脏肋下未触及，肾脏未触及。肝浊音界正常，肝上界位于锁骨中线第五肋间，移动性浊音阴性，肾区无叩痛。肠鸣音正常，未闻及血管杂音及振水音。",
                "ctgjcGz": "肝浊音界正常，肝上界位于锁骨中线第五肋间，移动性浊音阴性。",
                "ctgjcPz": "未触及，脾区无压痛。",
                "ctgjcSz": "双肾无叩击痛，无腰酸痛。",
                "ctgjcQt": "肠鸣音正常，膀胱未触及，输尿管无压痛。",
                "ctgjcKz3": "肝区无叩击痛，无移动性浊音、高度鼓音、肾区叩击痛。",
                "ctgjcTz3": "肠鸣音正常，4次/分，无振水音、血管杂音。",
                "ctgjcGzc": "未检。",
                "ctgjcWszq": "未检。",
                "ctgjcJz": "脊柱未见明显畸形。无棘突压痛。",
                "ctgjcShiz": "四肢肌力正常，肌张力正常，双下肢无水肿，肤温正常，未见溃疡。关节活动正常。",
                "ctgjcSjxt2": "四肢肌力、肌张力正常。双侧肱二、三头肌腱反射正常引出。双膝反射（++），踝反射（++）。Babinski征阴性。Kerning征阴性。踝阵挛阴性。",
                "ctgjcZkqk": "高级神经活动：神清，精神可，认知功能正常，语音流利清晰，右利手。颅神经检查：嗅觉检查正常。双眼视力及视野粗查正常，眼底未窥入。双侧瞳孔等大瞪圆，直径2.5mm，直接和间接对光反射正常。双眼闭目有力，眼动充分，无复视及眼震，双侧眼角膜反射正常，面部感觉对称，咀嚼肌有力，张口下颌居中，额纹对称，示齿鼻唇沟对称，伸舌居中，味觉正常。软腭提升良好，咽反射存在。声音清晰，转颈耸肩有力。舌肌无萎缩。运动神经：四肢肌肉无萎缩，四肢肌力、肌张力正常。无不自主运动。共济运动：指鼻试验、轮替试验、跟膝胫试验均正常。感觉系统：四肢痛触觉、音叉振动觉、关节位置未见异常。反射系统：双上肢肱二、三肌腱反射（++），挠骨摸反射（++），双膝反射（+），踝反射（+），髌阵挛、踝阵挛阴性。掌颌反应阳性，双上肢Hoffmann及Rossolimo征阴性。左侧Babinski阳性，双侧Chaddock、Openhein和Gordon征阴性。颈无抵抗，Kerning征和Brudzinski征阴性。Lasegue征、臂丛牵拉试验阴性。植物神经系统：皮肤黏膜色泽，温度，毛发分布，指甲形态，汗液分布正常，汗液分布正常，排尿排便无障碍。",
                "ctgjcSysjc": "入院随机血糖：mmol/L。",
                "cblzy": "患者，女，岁，因“”入院。入院症见：查体：",

              },
              //当前组件提交(add)数据时,ajax处理的 基础信息设置
              addMessTitle: {},
              listMessTitle:{
                ajaxSuccess:'SuccessGetCurrData',
                ajaxParams:{
                  url:this.url.caseRecordGet+this.operailityData.cid,
                }
              },

              addMarkData:{},
              tableData:[],
              //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
              getConfigurationMessTitle:{
                ajaxSuccess:'ConfigurationData',
                ajaxParams:{
                  url:this.url.configurationGet+'DBL',
                }
              },
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
//            this.ajax(this.getConfigurationMessTitle);
          },

          SuccessGetCurrData(res){
            let data = res.data;
            if(!data) return;
            data.spState = 'PASS';
            data.reviewMess = '';
            if(!this.operailityData.podType){
              this.operailityData.podType = data.podType
            }
            this.formValidate = data;
          },

          ConfigurationData(res){
            let data = res.data;
            if(!data){
              this.errorMess('无评分表,请添加评分表');
              return;
            }
            this.hasConfiguration = true;
            this.addMarkData = data;
            let configurationDetails = data.configurationDetails;

            let temArr = [];
            let index = -1;
            let flag;
            if(data.type==1){
              flag = true;
            }
            let detailClassification = '';///项目名称
            for(let i=0;i<configurationDetails.length;i++){
              if(flag || detailClassification!=configurationDetails[i].detailClassification){
                index++;
                temArr[index] = {
                  detailClassification:'',
                  configurationDetails:[],
                };
                detailClassification = configurationDetails[i].detailClassification;
                temArr[index].detailClassification = configurationDetails[i].detailClassification;
                configurationDetails[i].mark = '';
                temArr[index].configurationDetails.push(configurationDetails[i]);
              }else {
                configurationDetails[i].mark = '';
                temArr[index].configurationDetails.push(configurationDetails[i]);
              }
            }
            this.tableData = temArr;

          },
          /*
           * 点击提交按钮 监听是否提交数据
           * @param isLoadingFun boolean  form表单验证是否通过
           * */
          listenSubEvent(isLoadingFun){
            let isSubmit = this.submitForm("formValidate");
            if(isSubmit){
//              if(!this.hasConfiguration){
//                this.errorMess('无评分表,请添加评分表');
//                return;
//              }

              if(!isLoadingFun) isLoadingFun=function(){};

//              this.addMarkData.userId =  this.formValidate.createUserId;
//              this.addMarkData.userName =  this.formValidate.createUserNmae;
//              this.addMarkData.businessId = this.formValidate.caseId;
//              let tempArr = []
//              let index = 0;
//              for (let i=0;i<this.tableData.length;i++){
//                let item = this.tableData[i];
//                for (let l=0;l <item['configurationDetails'].length;l++){
//                  index++;
//                  if(+item['configurationDetails'][l].detailScore<+item['configurationDetails'][l].mark){
//                    this.errorMess(`第${index}行得分不能大于标准分`);
//                    return;
//                  }
//                  item['configurationDetails'][l].detailsId =  item['configurationDetails'][l].detailId;
//                  tempArr.push(item['configurationDetails'][l]);
//                }
//              }
//              isLoadingFun(true);
//              this.addMarkData.configurationDetails = tempArr;
//              let  addMarkMessTitle={
//                ajaxSuccess:(res)=>{
//                  this.addMessTitle.ajaxParams.data=this.getFormData(this.formValidate);
//                  this.ajax(this.addMessTitle,isLoadingFun);
//                },
//                  ajaxParams:{
//                    method:'post',
//                  url:this.url.configurationAddMark,
//                    jsonString:true,
//                    data:this.addMarkData,
//                }
//              }
//              this.ajax(addMarkMessTitle);


              console.log(this.formValidate);
              this.$refs.evaluation[0].listenSubEvent()

            }
          },

          submit(){
            this.addMessTitle.ajaxParams.data=this.getFormData(this.formValidate);
            this.ajax(this.addMessTitle);
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


          //批注
          postilSubEvent(isLoadingFun){
            let addMessTitle={
              type:'audit',
              successTitle:'批注成功!',
              errorTitle:'批注失败!',
              ajaxSuccess:'ajaxSuccess',
              ajaxError:'ajaxError',
              ajaxParams:{
                jsonString:true,
                url:this.url.caseRecordManageBigCasesModifyComment,
                method:'put',
                data:{},
              }
            };
            this.addMessTitle = addMessTitle;
            this.listenSubEvent(isLoadingFun)
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
                url:this.url.caseRecordManageBigCasesReview+this.operailityData.cid,
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



          //获取评分数据成功处理函数
          evaluatedGetFun(data){
            let tempObj = {
              totalScore:0,
              evaluateResultDtoList:[],
              templateDto :data
            }
            return tempObj;
          },

          //提交前处理函数
          submitBeforeFun(data){
            let tempArr = [];
              data.evaluateResultDtoList.map(item=>{
              tempArr.push({
                bigCaseId:this.operailityData.cid,
                tempDetailId:this.tempDetailId,
                ...item,
              })
            })
            this.submit()
            return tempArr;
          }
        },
        created(){
            this.init();
        },
        mounted(){
        },
        components: {
          myEvaluation,
        }
    }
</script>
