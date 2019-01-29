<!----------------------------------
****-- 大病历模板
****--@date     2017/7/4
****--@author   gx
----------------------------------->
<template>
    <div class="bladdzjbj">
      <el-form :model="formValidate" ref="formValidate" :rules="largeCaseTemplate"  class="demo-form-inline" label-width="120px" >
        <!--<el-button style="float: right" type="primary" @click="templateFilling">填充模板</el-button>-->
        <div  style="font-size: 24px;text-align: center; height: 60px;">入院病例</div>
        <el-row class="table-back-two">
          <el-col :span="6" >
            <el-form-item label="姓名:" prop="cname" >
              <el-input  v-model="formValidate.cname" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6" >
            <el-form-item label="性别:" prop="csex" >
              <el-radio class="radio" v-model="formValidate.csex" label="男"></el-radio>
              <el-radio class="radio" v-model="formValidate.csex" label="女"></el-radio>
            </el-form-item>
          </el-col >

          <el-col :span="6" >
            <el-form-item label="年龄:" prop="cage" >
              <el-input v-model="formValidate.cage" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col >

          <el-col :span="6" >
            <el-form-item label="婚姻:" prop="cisMarry" >
              <el-radio class="radio" v-model="formValidate.cisMarry" label="YES">已婚</el-radio>
              <el-radio class="radio" v-model="formValidate.cisMarry" label="NO">未婚</el-radio>
            </el-form-item>
          </el-col >

        </el-row >

        <el-row class="table-back-one" >
          <el-col :span="6" >
            <el-form-item label="民族:" prop="cnation" >
              <el-select v-model="formValidate.cnation"  style="width:121px" filterable placeholder="请选择">
                <el-option
                  v-for="item in dictionary.nation"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6" >
            <el-form-item label="职业:" prop="czhiye" >
              <el-input v-model="formValidate.czhiye" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col >

          <el-col :span="6" >
            <el-form-item label="住址:" prop="caddress" >
              <el-input v-model="formValidate.caddress" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col >
        </el-row >
        <!---->
        <el-row class="table-back-two" >
          <el-col :span="6" >
            <el-form-item label="籍贯:" prop="cnation">
              <el-input v-model="formValidate.cbirthPlace" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6" >
            <el-form-item label="工作单位:" prop="workAddress" >
              <el-input v-model="formValidate.workAddress" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col >

          <el-col :span="6" >
            <el-form-item label="联系电话:" prop="phone" >
              <el-input v-model="formValidate.phone" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col >
          <el-col :span="6" >
            <el-form-item label="可靠程度:" prop="reliability" >
              <el-input v-model="formValidate.reliability" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col >
        </el-row >
        <!---->
        <el-row class="table-back-one">
          <el-col :span="6" >
            <el-form-item label="床号:" prop="cbedNo" >
              <el-input v-model="formValidate.cbedNo" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6" >
            <el-form-item label="住院号:" prop="czyNo" >
              <el-input v-model="formValidate.czyNo" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col >

          <el-col :span="12" >
            <el-form-item label="病区:" prop="clesion" >
              <el-input v-model="formValidate.clesion" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col >
        </el-row >

        <el-row class="table-back-two">
          <el-col :span="6">
            <el-form-item label="病史陈述者:" prop="cbscsz">
              <el-input v-model="formValidate.cbscsz" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="与患者关系:" prop="chuanzheUser">
              <el-input v-model="formValidate.chuanzheUser" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入院日期:" prop="cruyuanDate">
              <el-date-picker
                :editable="false"
                v-model="formValidate.cruyuanDate"
                type="datetime"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="table-back-one">
          <el-col :span="6">
            <el-form-item label="病历采写时间:" prop="cjlDate">
              <el-date-picker
                :editable="false"
                style="width:125px"
                v-model="formValidate.cjlDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="住院医师:">
              {{name}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="科室:">
              {{formValidate.cdepName}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="table-back-two">
          <el-col :span="24" >
            <el-form-item label="主诉:" prop="czs" >
              <el-input type="textarea" v-model="formValidate.czs"></el-input>
            </el-form-item>
          </el-col>
        </el-row >

        <el-row class="table-back-one">
          <el-col :span="24" >
            <el-form-item label="现病史:" prop="cxbs" >
              <el-input type="textarea" v-model="formValidate.cxbs"></el-input>
            </el-form-item>
          </el-col>
        </el-row >
        <el-row class="table-back-one">
          <el-col :span="24" >
            <el-form-item label="既往史:" prop="cjbs" >
              <el-input type="textarea" v-model="formValidate.cjbs"></el-input>
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
                      <el-input @keydown.native="keydown('cxthgHxxt',$event)"  @paste.native="contextmenu('cxthgHxxt',$event)" type="textarea" v-model="formValidate.cxthgHxxt"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="循环系统:" prop="cxthgXuhxt" >
                      <el-input @keydown.native="keydown('cxthgXuhxt',$event)"  @paste.native="contextmenu('cxthgXuhxt',$event)" type="textarea" v-model="formValidate.cxthgXuhxt"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="消化系统:" prop="cxthgXihxt" >
                      <el-input @keydown.native="keydown('cxthgXihxt',$event)"  @paste.native="contextmenu('cxthgXihxt',$event)" type="textarea" v-model="formValidate.cxthgXihxt"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="泌尿生殖系统:" prop="cxthgMlxt" >
                      <el-input @keydown.native="keydown('cxthgMlxt',$event)"  @paste.native="contextmenu('cxthgMlxt',$event)" type="textarea" v-model="formValidate.cxthgMlxt"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="造血系统:" prop="cxthgXyxt" >
                      <el-input @keydown.native="keydown('cxthgXyxt',$event)"  @paste.native="contextmenu('cxthgXyxt',$event)" type="textarea" v-model="formValidate.cxthgXyxt"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="内分泌系统及代谢:" prop="cxthgNfmxt" >
                      <el-input @keydown.native="keydown('cxthgNfmxt',$event)"  @paste.native="contextmenu('cxthgNfmxt',$event)" type="textarea" v-model="formValidate.cxthgNfmxt"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="神经精神系统:" prop="cxthgSjxt1" >
                      <el-input @keydown.native="keydown('cxthgSjxt1',$event)"  @paste.native="contextmenu('cxthgSjxt1',$event)" type="textarea" v-model="formValidate.cxthgSjxt1"></el-input>
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
                      <el-input @keydown.native="keydown('cxthgGgjxt',$event)"  @paste.native="contextmenu('cxthgGgjxt',$event)" type="textarea" v-model="formValidate.cxthgGgjxt"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="个人史:" prop="cxthgGrs" >
                      <el-input @keydown.native="keydown('cxthgGrs',$event)"  @paste.native="contextmenu('cxthgGrs',$event)" type="textarea" v-model="formValidate.cxthgGrs"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="月经史:" prop="cxthgYjhys" >
                      <el-input @keydown.native="keydown('cxthgYjhys',$event)"  @paste.native="contextmenu('cxthgYjhys',$event)" type="textarea" v-model="formValidate.cxthgYjhys"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="婚姻史:" prop="cxthgHys" >
                      <el-input @keydown.native="keydown('cxthgHys',$event)"  @paste.native="contextmenu('cxthgHys',$event)" type="textarea" v-model="formValidate.cxthgHys"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="生育史:" prop="cxthgSys" >
                      <el-input @keydown.native="keydown('cxthgSys',$event)"  @paste.native="contextmenu('cxthgSys',$event)" type="textarea" v-model="formValidate.cxthgSys"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="家族史:" prop="cxthgJts" >
                      <el-input @keydown.native="keydown('cxthgJts',$event)"  @paste.native="contextmenu('cxthgJts',$event)" type="textarea" v-model="formValidate.cxthgJts"></el-input>
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
                            <el-input @keydown.native="keydown('ctgjcSmtzT',$event)"  @paste.native="contextmenu('ctgjcSmtzT',$event)" style="width:150px;"  v-model="formValidate.ctgjcSmtzT">
                              <el-button  slot="append">°C</el-button>
                            </el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="脉搏(P):" prop="ctgjcSmtzP" label-width="80px">
                            <el-input  @keydown.native="keydown('ctgjcSmtzP',$event)"  @paste.native="contextmenu('ctgjcSmtzP',$event)" style="width:150px;"  v-model="formValidate.ctgjcSmtzP">
                              <el-button  slot="append"> 次/分</el-button>
                            </el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="呼吸(R):" prop="ctgjcSmtzR" label-width="80px">
                            <el-input @keydown.native="keydown('ctgjcSmtzR',$event)"  @paste.native="contextmenu('ctgjcSmtzR',$event)" style="width:150px;"  v-model="formValidate.ctgjcSmtzR">
                              <el-button  slot="append"> 次/分</el-button>
                            </el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="血压(BP):" prop="ctgjcSmtzBp" label-width="80px">
                            <el-input @keydown.native="keydown('ctgjcSmtzBp',$event)"  @paste.native="contextmenu('ctgjcSmtzBp',$event)" style="width:150px;"  v-model="formValidate.ctgjcSmtzBp">
                              <el-button  slot="append"> mmHg(kPa)</el-button>
                            </el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="一般状况:" prop="ctgjcYbqk1" >
                      <el-input @keydown.native="keydown('ctgjcYbqk1',$event)"  @paste.native="contextmenu('ctgjcYbqk1',$event)" type="textarea" v-model="formValidate.ctgjcYbqk1"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="皮肤粘膜:" prop="ctgjcPfnm" >
                      <el-input @keydown.native="keydown('ctgjcPfnm',$event)"  @paste.native="contextmenu('ctgjcPfnm',$event)" type="textarea" v-model="formValidate.ctgjcPfnm"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="淋巴结:" prop="ctgjcQblbj" >
                      <el-input @keydown.native="keydown('ctgjcQblbj',$event)"  @paste.native="contextmenu('ctgjcQblbj',$event)" type="textarea" v-model="formValidate.ctgjcQblbj"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <!--头部五官-->
                <el-collapse v-model="activeNames" >
                  <el-collapse-item title=" 头部五官" name="2-1">
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="头颅:" prop="ctgjcTbqg" >
                          <el-input @keydown.native="keydown('ctgjcTbqg',$event)"   @paste.native="contextmenu('ctgjcTbqg',$event)" type="textarea" v-model="formValidate.ctgjcTbqg"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="眼:" prop="ctgjcYan" >
                          <el-input @keydown.native="keydown('ctgjcYan',$event)"   @paste.native="contextmenu('ctgjcYan',$event)" type="textarea" v-model="formValidate.ctgjcYan"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="耳:" prop="ctgjcEr" >
                          <el-input @keydown.native="keydown('ctgjcEr',$event)"   @paste.native="contextmenu('ctgjcEr',$event)" type="textarea" v-model="formValidate.ctgjcEr"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="鼻:" prop="ctgjcBi" >
                          <el-input @keydown.native="keydown('ctgjcBi',$event)"   @paste.native="contextmenu('ctgjcBi',$event)" type="textarea" v-model="formValidate.ctgjcBi"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="口:" prop="ctgjcKou" >
                          <el-input @keydown.native="keydown('ctgjcKou',$event)"   @paste.native="contextmenu('ctgjcKou',$event)" type="textarea" v-model="formValidate.ctgjcKou"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-collapse-item>
                </el-collapse>
                <br>

                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="颈部:" prop="ctgjcJb" >
                      <el-input @keydown.native="keydown('ctgjcJb',$event)"  @paste.native="contextmenu('ctgjcJb',$event)" type="textarea" v-model="formValidate.ctgjcJb"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="胸部:" prop="ctgjcXb" >
                      <el-input @keydown.native="keydown('ctgjcXb',$event)"  @paste.native="contextmenu('ctgjcXb',$event)" type="textarea" v-model="formValidate.ctgjcXb"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <!--肺-->
                <el-collapse v-model="activeNames" >
                  <el-collapse-item title=" 肺" name="2-3">
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="视诊:" prop="ctgjcSz1" >
                          <el-input @keydown.native="keydown('ctgjcSz1',$event)"  @paste.native="contextmenu('ctgjcSz1',$event)" type="textarea" v-model="formValidate.ctgjcSz1"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="触诊:" prop="ctgjcCz1" >
                          <el-input @keydown.native="keydown('ctgjcCz1',$event)"  @paste.native="contextmenu('ctgjcCz1',$event)" type="textarea" v-model="formValidate.ctgjcCz1"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="叩诊:" prop="ctgjcKz1" >
                          <el-input @keydown.native="keydown('ctgjcKz1',$event)"  @paste.native="contextmenu('ctgjcKz1',$event)" type="textarea" v-model="formValidate.ctgjcKz1"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="听诊:" prop="ctgjcTz1" >
                          <el-input @keydown.native="keydown('ctgjcTz1',$event)"  @paste.native="contextmenu('ctgjcTz1',$event)" type="textarea" v-model="formValidate.ctgjcTz1"></el-input>
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
                          <el-input @keydown.native="keydown('ctgjcSz2',$event) "  @paste.native="contextmenu('ctgjcSz2',$event)" type="textarea" v-model="formValidate.ctgjcSz2"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="触诊:" prop="ctgjcCz2" >
                          <el-input @keydown.native="keydown('ctgjcCz2',$event)"  @paste.native="contextmenu('ctgjcCz2',$event)" type="textarea" v-model="formValidate.ctgjcCz2"></el-input>
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
                          <el-input @keydown.native="keydown('ctgjcKzy1',$event)"  @paste.native="contextmenu('ctgjcKzy1',$event)"  v-model="formValidate.ctgjcKzy1"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col  style="text-align: center" :span="3" :offset="2">
                        <div>II</div>
                      </el-col>
                      <el-col :span="3" :offset="2">
                        <el-form-item label-width="0" prop="ctgjcKzz1" >
                          <el-input @keydown.native="keydown('ctgjcKzz1',$event)"  @paste.native="contextmenu('ctgjcKzz1',$event)"  v-model="formValidate.ctgjcKzz1"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="3" :offset="2">
                        <el-form-item label-width="0" prop="ctgjcKzy2" >
                          <el-input  @keydown.native="keydown('ctgjcKzy2',$event)"  @paste.native="contextmenu('ctgjcKzy2',$event)" v-model="formValidate.ctgjcKzy2"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col  style="text-align: center" :span="3" :offset="2">
                        <div>III</div>
                      </el-col>
                      <el-col :span="3" :offset="2">
                        <el-form-item  prop="ctgjcKzz2" label-width="0">
                          <el-input @keydown.native="keydown('ctgjcKzz2',$event)"   @paste.native="contextmenu('ctgjcKzz2',$event)" v-model="formValidate.ctgjcKzz2"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="3" :offset="2">
                        <el-form-item  prop="ctgjcKzy3" label-width="0">
                          <el-input @keydown.native="keydown('ctgjcKzy3',$event)"  @paste.native="contextmenu('ctgjcKzy3',$event)" v-model="formValidate.ctgjcKzy3"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col  style="text-align: center" :span="3" :offset="2">
                        <div>IV</div>
                      </el-col>
                      <el-col :span="3" :offset="2">
                        <el-form-item  prop="ctgjcKzz3" label-width="0">
                          <el-input  @keydown.native="keydown('ctgjcKzz3',$event)"  @paste.native="contextmenu('ctgjcKzz3',$event)" v-model="formValidate.ctgjcKzz3"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="3" :offset="2">
                        <el-form-item  prop="ctgjcKzy4" label-width="0">
                          <el-input @keydown.native="keydown('ctgjcKzy4',$event)"   @paste.native="contextmenu('ctgjcKzy4',$event)" v-model="formValidate.ctgjcKzy4"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col  style="text-align: center" :span="3" :offset="2">
                        <div>V</div>
                      </el-col>
                      <el-col :span="3" :offset="2">
                        <el-form-item  prop="ctgjcKzz4" label-width="0">
                          <el-input @keydown.native="keydown('ctgjcKzz4',$event)"   @paste.native="contextmenu('ctgjcKzz4',$event)" v-model="formValidate.ctgjcKzz4"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="听诊:" prop="ctgjcTz2" >
                          <el-input @keydown.native="keydown('ctgjcTz2',$event)"  @paste.native="contextmenu('ctgjcTz2',$event)" type="textarea" v-model="formValidate.ctgjcTz2"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="双侧桡动脉:" prop="ctgjcRdm" >
                          <el-input @keydown.native="keydown('ctgjcRdm',$event)"  @paste.native="contextmenu('ctgjcRdm',$event)" type="textarea" v-model="formValidate.ctgjcRdm"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="周围血管征:" prop="ctgjcZwxg">
                          <el-input @keydown.native="keydown('ctgjcZwxg',$event)"  @paste.native="contextmenu('ctgjcZwxg',$event)" type="textarea" v-model="formValidate.ctgjcZwxg"></el-input>
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
                          腹围: <el-input  style="width: 100px"   v-model="formValidate.ctgjcFb"></el-input>cm

                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="视诊:" prop="ctgjcSz3" >
                          <el-input @keydown.native="keydown('ctgjcSz3',$event)"  @paste.native="contextmenu('ctgjcSz3',$event)" type="textarea" v-model="formValidate.ctgjcSz3"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="触诊:" prop="ctgjcCz3" >
                          <el-input @keydown.native="keydown('ctgjcCz3',$event)"  @paste.native="contextmenu('ctgjcCz3',$event)" type="textarea" v-model="formValidate.ctgjcCz3"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="叩诊:" prop="ctgjcKz3" >
                          <el-input @keydown.native="keydown('ctgjcKz3',$event)"  @paste.native="contextmenu('ctgjcKz3',$event)" type="textarea" v-model="formValidate.ctgjcKz3"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="听诊:" prop="ctgjcTz3" >
                          <el-input @keydown.native="keydown('ctgjcTz3',$event)"  @paste.native="contextmenu('ctgjcTz3',$event)" type="textarea" v-model="formValidate.ctgjcTz3"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-collapse-item>
                </el-collapse>
                <br>


                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="肛门直肠:" prop="ctgjcGzc" >
                      <el-input @keydown.native="keydown('ctgjcGzc',$event)"  @paste.native="contextmenu('ctgjcGzc',$event)" type="textarea" v-model="formValidate.ctgjcGzc"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="外生殖器:" prop="ctgjcWszq" >
                      <el-input @keydown.native="keydown('ctgjcWszq',$event)"  @paste.native="contextmenu('ctgjcWszq',$event)" type="textarea" v-model="formValidate.ctgjcWszq"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="脊柱及四肢:" prop="ctgjcJz" >
                      <el-input @keydown.native="keydown('ctgjcJz',$event)"  @paste.native="contextmenu('ctgjcJz',$event)" type="textarea" v-model="formValidate.ctgjcJz"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <!--神经系统-->
                <el-collapse v-model="activeNames" >
                  <el-collapse-item title="神经系统" name="2-6">
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="生理反射:" prop="ctgjcSjxt2" >
                          <el-input @keydown.native="keydown('ctgjcSjxt2',$event)"  @paste.native="contextmenu('ctgjcSjxt2',$event)" type="textarea" v-model="formValidate.ctgjcSjxt2"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="病理反射:" prop="ctgjcSjxtblfs" >
                          <el-input @keydown.native="keydown('ctgjcSjxtblfs',$event)"  @paste.native="contextmenu('ctgjcSjxtblfs',$event)" type="textarea" v-model="formValidate.ctgjcSjxtblfs"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="24" >
                        <el-form-item label="脑膜刺激征:" prop="ctgjcSjxtnmcjz" >
                          <el-input @keydown.native="keydown('ctgjcSjxtnmcjz',$event)"  @paste.native="contextmenu('ctgjcSjxtnmcjz',$event)" type="textarea" v-model="formValidate.ctgjcSjxtnmcjz"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-collapse-item>
                </el-collapse>
                <br>

                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="专科检查:" prop="ctgjcZkqk" >
                      <el-input @keydown.native="keydown('ctgjcZkqk',$event)"  @paste.native="contextmenu('ctgjcZkqk',$event)" type="textarea" v-model="formValidate.ctgjcZkqk"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row >
                  <el-col :span="24" >
                    <el-form-item label="实验室及器械检查:" prop="ctgjcSysjc" >
                      <el-input @keydown.native="keydown('ctgjcSysjc',$event)"  @paste.native="contextmenu('ctgjcSysjc',$event)" type="textarea" v-model="formValidate.ctgjcSysjc"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row >

        <el-row class="table-back-one-d">
          <el-col :span="24" >
            <el-form-item label="病例摘要:" prop="cblzy" >
              <el-input  type="textarea" v-model="formValidate.cblzy"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="table-back-two">
          <el-col :span="24" >
            <el-form-item label="初步诊断:" prop="ccbzd" >
              <el-input type="textarea" v-model="formValidate.ccbzd"></el-input>
            </el-form-item>

          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="医师签名:" prop="cysqm1" >
              <el-input  v-model="formValidate.cysqm1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" >
            <el-form-item label="时间:" prop="cysqm1Date" label-width="70px">
              <el-date-picker
                :editable="false"
                v-model="formValidate.cysqm1Date"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <br>
      <div style="text-align:center">
        <load-btn @saveSubEvent="saveSubEvent" :btnData="saveBtn"></load-btn>
        <!--<load-btn @appearSubEvent="appearSubEvent" :btnData="loadBtn"></load-btn>-->
        <el-button  @click="cancel">取消</el-button>
      </div>
    </div>
</template>
<style>
  .bladdzjbj .table-back-one,.bladdzjbj .table-back-two{
    padding: 5px 0 22px 0;
  }
</style>
<script>
    /*当前组件必要引入*/
    import {largeCaseTemplate} from '../../rules';
    //当前组件引入全局的util
    //前台业务字典组件引入
    import dictionary from '../../../../libs/dictionary.js';
    let Util = null;
    export default{
        props:['operailityData','url','podId','dept'],
        data() {
            return {
              largeCaseTemplate,
              saveBtn: {title: '提交', callParEvent: 'saveSubEvent'},
              loadBtn: {title: '上报', callParEvent: 'appearSubEvent'},
              name: '',
              activeNames: [],
              dictionary: dictionary,
              formValidate: {
                workAddress:'',
                reliability:'',
                phone:'',
                cjbs:'',
                cxthgHys:'',
                cxthgSys:'',
                "ctgjcYan":"",
                "ctgjcEr":"",
                "ctgjcBi":"",
                "ctgjcKou":"",
                "ctgjcSjxtblfs":"",
                "ctgjcSjxtnmcjz":"",


                "caseId": '',
                "cname": "",
                "csex": "男",
                "cage": "",
                "cisMarry": "YES",
                "cnation": "汉族",
                "czhiye": "",
                "caddress": "",
                "cbirthPlace": "",
                "cbedNo": "",
                "czyNo": "",
                "clesion": "",
                "cruyuanDate": "",
                "cjlDate": "",
                "cbscsz": "",
                "chuanzheUser": "",
                "cdepId": this.dept.depId,
                "cdepName": this.dept.depName,
                "cpodId": this.dept.podId,
                "czs": "",
                "cxbs": "",
                "cjwsYbjkqk": "",
                "cjwsCrbs": "",
                "cjwsSswss": "",
                "cjwsYwgms": "",
                "cxthgHxxt": "",
                "cxthgXuhxt": "",
                "cxthgXihxt": "",
                "cxthgMlxt": "",
                "cxthgXyxt": "",
                "cxthgNfmxt": "",
                "cxthgSjxt1": "",
                "cxthgSzxt": "",
                "cxthgGgjxt": "",
                "cxthgGrs": "",
                "cxthgYjhys": "",
                "cxthgJts": "",
                "ctgjcSmtzT": "",
                "ctgjcSmtzC": "",
                "ctgjcSmtzP": "",
                "ctgjcSmtzCf1": "",
                "ctgjcSmtzR": "",
                "ctgjcSmtzCf2": "",
                "ctgjcSmtzBp": "",
                "ctgjcYbqk1": "",
                "ctgjcPfnm": "",
                "ctgjcQblbj": "",
                "ctgjcTbqg": "",
                "ctgjcJb": "",
                "ctgjcXb": "",
                "ctgjcXl": "",
                "ctgjcRx": "",
                "ctgjcFei": "",
                "ctgjcSz1": "",
                "ctgjcCz1": "",
                "ctgjcKz1": "",
                "ctgjcTz1": "",
                "ctgjcXz": "",
                "ctgjcSz2": "",
                "ctgjcCz2": "",
                "ctgjcKzy1": "",
                "ctgjcKzy2": "",
                "ctgjcKzy3": "",
                "ctgjcKzy4": "",
                "ctgjcKzz1": "",
                "ctgjcKzz2": "",
                "ctgjcKzz3": "",
                "ctgjcKzz4": "",
                "ctgjcTz2": "",
                "ctgjcRdm": "",
                "ctgjcZwxg": "",
                "ctgjcFb": "",
                "ctgjcSz3": "",
                "ctgjcCz3": "",
                "ctgjcYbqk2": "",
                "ctgjcGz": "",
                "ctgjcPz": "",
                "ctgjcSz": "",
                "ctgjcQt": "",
                "ctgjcKz3": "",
                "ctgjcTz3": "",
                "ctgjcGzc": "",
                "ctgjcWszq": "",
                "ctgjcJz": "",
                "ctgjcShiz": "",
                "ctgjcSjxt2": "",
                "ctgjcZkqk": "",
                "ctgjcSysjc": "",
                "cblzy": "",
                "ccbzd": "",
                "cysqm1": "",
                "cysqm1Date": "",
                "cryzd": "",
                "cysqm2": "",
                "cysqm2Date": "",
              },
              template:{},
              copyField:{},
              //当前组件提交(add)数据时,ajax处理的 基础信息设置
              addMessTitle: {},
              listMessTitle:{
                ajaxSuccess:'SuccessGetCurrData',
                ajaxParams:{
//                  url:this.url.caseRecordGet.path+this.operailityData.cid,
                }
              },
              isCopy:'',
          }
        },
        methods: {
          //通过get请求列表数据 是否允许粘贴
          getBigcaseIscopyData(responseData){
            let data = responseData.data;
            this.isCopy = data["configValue"];
          },

          //初始化请求列表数据
          init(){
//              获取当前登录人的信息
            let userInfo = this.$store.getters.getUserInfo;
            this.name= userInfo.name;
            let studentTypes = userInfo.studentTypes;
            if(this.operailityData){
              this.listMessTitle.ajaxParams.url = this.url.caseRecordGet+this.operailityData.cid;
              //获取当前登录人来判定调用那个接口来获取技能和病种名称
              this.ajax(this.listMessTitle);
            }
          },

          SuccessGetCurrData(res){
            let data = res.data;
            if(!data) return;
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
              let formValidate = this.getFormData(this.formValidate);
//              formValidate.copyField = this.conductCopyField( formValidate.copyField);
              formValidate = this.formDate(formValidate,['cruyuanDate'],'yyyy-MM-dd HH:mm');
              formValidate.cstate='NO_SUBMIT';
              this.addMessTitle.ajaxParams.data=this.formDate(formValidate,['cysqm1Date','cysqm2Date','cjlDate'],'yyyy-MM-dd');
              this.ajax(this.addMessTitle,isLoadingFun);
            }
          },

          //处理要提交的的数据 ，，粘贴数据
          conductCopyField(data){
            for(let i=0 ;i<data.length;i++){
              if(this.copyField[data[i].fieldName]){
                data[i].isCopy = 1
              }
            }
            return data;
          },

          /*
           * 点击提交按钮 监听是否验证通过
           * @param formName string  form表单v-model数据对象名称
           * @return flag boolean   form表单验证是否通过
           * */
          submitForm(formName){
            let flag = false;
            this.$refs[formName].validate((valid) => {
              if (valid) {
                flag= true;
              }
            });
            return flag;
          },
          //保存
          saveSubEvent(isLoadingFun){
            let addMessTitle={
              type:'add',
              successTitle:'修改成功!',
              errorTitle:'修改失败!',
              ajaxSuccess:'ajaxSuccess',
              ajaxError:'ajaxError',
              ajaxParams:{
                jsonString:true,
                url:this.url.classicCaseAdd.path,
                method:'post',
                data:{},
              }
            };
            this.addMessTitle = addMessTitle;
            this.listenSubEvent(isLoadingFun)
          },

          //上报
          appearSubEvent(isLoadingFun){
            let addMessTitle={
              type:'edit',
              successTitle:'上报成功!',
              errorTitle:'上报失败!',
              ajaxSuccess:'ajaxSuccess',
              ajaxError:'ajaxError',
              ajaxParams:{
                jsonString:true,
                url:this.url.classicCasesModifyRelease.path+this.operailityData.cid,
                method:'put',
                data:{},
              }
            };
            this.addMessTitle = addMessTitle;
            this.listenSubEvent(isLoadingFun)
          },

         //取消
          cancel(){
            this.$emit('cancel','edit');
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


          //键盘监听事件，监听是否按下ctrl + v
          keydown(key,event){
            event = event || window.event;
            if(event.keyCode==86 &&event.ctrlKey){
              if(!(+this.isCopy)) {
                this.showMess('不允许粘贴');
                event.returnValue=false;
                return ;
              }
              this.copyField[key] = 1;
            }
          },


          //监听右键，粘贴
          contextmenu(key,event){
            event = event || window.event;
            if (!(+this.isCopy)) {
              this.showMess('不允许粘贴');
              event.returnValue=false;
              return ;
            }
            this.copyField[key] = 1;
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
