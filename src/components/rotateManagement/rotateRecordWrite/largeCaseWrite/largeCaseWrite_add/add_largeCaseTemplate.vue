<!----------------------------------
****-- 大病历模板
****--@date     2017/7/4
****--@author   gx
----------------------------------->
<template>
  <div class="addzjbj">
    <el-form :model="formValidate" ref="formValidate" :rules="largeCaseTemplate" class="demo-form-inline"
             label-width="120px">
      <el-button style="float: right" type="primary" @click="selectTemplate">选择模板</el-button>
      <div style="font-size: 24px;text-align: center; height: 60px;">入院病例</div>
      <el-row class="table-back-two">
        <el-col :span="6">
          <el-form-item label="姓名:" prop="cname">
            <el-input v-model="formValidate.cname" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="性别:" prop="csex">
            <el-radio class="radio" v-model="formValidate.csex" label="男"></el-radio>
            <el-radio class="radio" v-model="formValidate.csex" label="女"></el-radio>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="年龄:" prop="cage">
            <el-input v-model="formValidate.cage" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="婚姻:" prop="cisMarry">
            <el-radio class="radio" v-model="formValidate.cisMarry" label="YES">已婚</el-radio>
            <el-radio class="radio" v-model="formValidate.cisMarry" label="NO">未婚</el-radio>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row class="table-back-one">
        <el-col :span="6">
          <el-form-item label="民族:" prop="cnation">
            <el-select v-model="formValidate.cnation" style="width:121px" filterable placeholder="请选择">
              <el-option
                v-for="item in dictionary.nation"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="职业:" prop="czhiye">
            <el-input v-model="formValidate.czhiye" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="住址:" prop="caddress">
            <el-input v-model="formValidate.caddress" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!---->
      <el-row class="table-back-two">
        <el-col :span="6">
          <el-form-item label="籍贯:" prop="cnation">
            <el-input v-model="formValidate.cbirthPlace" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="工作单位:" prop="workAddress">
            <el-input v-model="formValidate.workAddress" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="联系电话:" prop="phone">
            <el-input v-model="formValidate.phone" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="可靠程度:" prop="reliability">
            <el-input v-model="formValidate.reliability" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!---->
      <el-row class="table-back-one">
        <el-col :span="6">
          <el-form-item label="床号:" prop="cbedNo">
            <el-input v-model="formValidate.cbedNo" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="住院号:" prop="czyNo">
            <el-input v-model="formValidate.czyNo" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="病区:" prop="clesion">
            <el-input v-model="formValidate.clesion" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

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
        <el-col :span="24">
          <el-form-item label="主诉:" prop="czs">
            <el-input type="textarea" v-model="formValidate.czs"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="table-back-one">
        <el-col :span="24">
          <el-form-item label="现病史:" prop="cxbs">
            <el-input type="textarea" v-model="formValidate.cxbs"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="table-back-one">
        <el-col :span="24">
          <el-form-item label="既往史:" prop="cjbs">
            <el-input type="textarea" v-model="formValidate.cjbs"></el-input>
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
                  <el-form-item label="呼吸系统:" prop="cxthgHxxt">
                    <el-input @keydown.native="keydown('cxthgHxxt',$event)"
                              @paste.native="contextmenu('cxthgHxxt',$event)" type="textarea"
                              v-model="formValidate.cxthgHxxt"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="循环系统:" prop="cxthgXuhxt">
                    <el-input @keydown.native="keydown('cxthgXuhxt',$event)"
                              @paste.native="contextmenu('cxthgXuhxt',$event)" type="textarea"
                              v-model="formValidate.cxthgXuhxt"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="消化系统:" prop="cxthgXihxt">
                    <el-input @keydown.native="keydown('cxthgXihxt',$event)"
                              @paste.native="contextmenu('cxthgXihxt',$event)" type="textarea"
                              v-model="formValidate.cxthgXihxt"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="泌尿生殖系统:" prop="cxthgMlxt">
                    <el-input @keydown.native="keydown('cxthgMlxt',$event)"
                              @paste.native="contextmenu('cxthgMlxt',$event)" type="textarea"
                              v-model="formValidate.cxthgMlxt"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="造血系统:" prop="cxthgXyxt">
                    <el-input @keydown.native="keydown('cxthgXyxt',$event)"
                              @paste.native="contextmenu('cxthgXyxt',$event)" type="textarea"
                              v-model="formValidate.cxthgXyxt"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="内分泌系统及代谢:" prop="cxthgNfmxt">
                    <el-input @keydown.native="keydown('cxthgNfmxt',$event)"
                              @paste.native="contextmenu('cxthgNfmxt',$event)" type="textarea"
                              v-model="formValidate.cxthgNfmxt"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="神经精神系统:" prop="cxthgSjxt1">
                    <el-input @keydown.native="keydown('cxthgSjxt1',$event)"
                              @paste.native="contextmenu('cxthgSjxt1',$event)" type="textarea"
                              v-model="formValidate.cxthgSjxt1"></el-input>
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
                  <el-form-item label="肌肉骨骼系统:" prop="cxthgGgjxt">
                    <el-input @keydown.native="keydown('cxthgGgjxt',$event)"
                              @paste.native="contextmenu('cxthgGgjxt',$event)" type="textarea"
                              v-model="formValidate.cxthgGgjxt"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="个人史:" prop="cxthgGrs">
                    <el-input @keydown.native="keydown('cxthgGrs',$event)"
                              @paste.native="contextmenu('cxthgGrs',$event)" type="textarea"
                              v-model="formValidate.cxthgGrs"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="月经史:" prop="cxthgYjhys">
                    <el-input @keydown.native="keydown('cxthgYjhys',$event)"
                              @paste.native="contextmenu('cxthgYjhys',$event)" type="textarea"
                              v-model="formValidate.cxthgYjhys"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="婚姻史:" prop="cxthgHys">
                    <el-input @keydown.native="keydown('cxthgHys',$event)"
                              @paste.native="contextmenu('cxthgHys',$event)" type="textarea"
                              v-model="formValidate.cxthgHys"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="生育史:" prop="cxthgSys">
                    <el-input @keydown.native="keydown('cxthgSys',$event)"
                              @paste.native="contextmenu('cxthgSys',$event)" type="textarea"
                              v-model="formValidate.cxthgSys"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="家族史:" prop="cxthgJts">
                    <el-input @keydown.native="keydown('cxthgJts',$event)"
                              @paste.native="contextmenu('cxthgJts',$event)" type="textarea"
                              v-model="formValidate.cxthgJts"></el-input>
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
                        <el-form-item label="体温(T):" prop="ctgjcSmtzT" label-width="80px">
                          <el-input @keydown.native="keydown('ctgjcSmtzT',$event)"
                                    @paste.native="contextmenu('ctgjcSmtzT',$event)" style="width:150px;"
                                    v-model="formValidate.ctgjcSmtzT">
                            <el-button slot="append">°C</el-button>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="脉搏(P):" prop="ctgjcSmtzP" label-width="80px">
                          <el-input @keydown.native="keydown('ctgjcSmtzP',$event)"
                                    @paste.native="contextmenu('ctgjcSmtzP',$event)" style="width:150px;"
                                    v-model="formValidate.ctgjcSmtzP">
                            <el-button slot="append"> 次/分</el-button>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="呼吸(R):" prop="ctgjcSmtzR" label-width="80px">
                          <el-input @keydown.native="keydown('ctgjcSmtzR',$event)"
                                    @paste.native="contextmenu('ctgjcSmtzR',$event)" style="width:150px;"
                                    v-model="formValidate.ctgjcSmtzR">
                            <el-button slot="append"> 次/分</el-button>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="血压(BP):" prop="ctgjcSmtzBp" label-width="80px">
                          <el-input @keydown.native="keydown('ctgjcSmtzBp',$event)"
                                    @paste.native="contextmenu('ctgjcSmtzBp',$event)" style="width:150px;"
                                    v-model="formValidate.ctgjcSmtzBp">
                            <el-button slot="append"> mmHg(kPa)</el-button>
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="一般状况:" prop="ctgjcYbqk1">
                    <el-input @keydown.native="keydown('ctgjcYbqk1',$event)"
                              @paste.native="contextmenu('ctgjcYbqk1',$event)" type="textarea"
                              v-model="formValidate.ctgjcYbqk1"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="皮肤粘膜:" prop="ctgjcPfnm">
                    <el-input @keydown.native="keydown('ctgjcPfnm',$event)"
                              @paste.native="contextmenu('ctgjcPfnm',$event)" type="textarea"
                              v-model="formValidate.ctgjcPfnm"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <el-form-item label="淋巴结:" prop="ctgjcQblbj">
                    <el-input @keydown.native="keydown('ctgjcQblbj',$event)"
                              @paste.native="contextmenu('ctgjcQblbj',$event)" type="textarea"
                              v-model="formValidate.ctgjcQblbj"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <!--头部五官-->
              <el-collapse v-model="activeNames">
                <el-collapse-item title=" 头部五官" name="2-1">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="头颅:" prop="ctgjcTbqg">
                        <el-input @keydown.native="keydown('ctgjcTbqg',$event)"
                                  @paste.native="contextmenu('ctgjcTbqg',$event)" type="textarea"
                                  v-model="formValidate.ctgjcTbqg"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="眼:" prop="ctgjcYan">
                        <el-input @keydown.native="keydown('ctgjcYan',$event)"
                                  @paste.native="contextmenu('ctgjcYan',$event)" type="textarea"
                                  v-model="formValidate.ctgjcYan"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="耳:" prop="ctgjcEr">
                        <el-input @keydown.native="keydown('ctgjcEr',$event)"
                                  @paste.native="contextmenu('ctgjcEr',$event)" type="textarea"
                                  v-model="formValidate.ctgjcEr"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="鼻:" prop="ctgjcBi">
                        <el-input @keydown.native="keydown('ctgjcBi',$event)"
                                  @paste.native="contextmenu('ctgjcBi',$event)" type="textarea"
                                  v-model="formValidate.ctgjcBi"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="口:" prop="ctgjcKou">
                        <el-input @keydown.native="keydown('ctgjcKou',$event)"
                                  @paste.native="contextmenu('ctgjcKou',$event)" type="textarea"
                                  v-model="formValidate.ctgjcKou"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
              <br>

              <el-row>
                <el-col :span="24">
                  <el-form-item label="颈部:" prop="ctgjcJb">
                    <el-input @keydown.native="keydown('ctgjcJb',$event)" @paste.native="contextmenu('ctgjcJb',$event)"
                              type="textarea" v-model="formValidate.ctgjcJb"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="胸部:" prop="ctgjcXb">
                    <el-input @keydown.native="keydown('ctgjcXb',$event)" @paste.native="contextmenu('ctgjcXb',$event)"
                              type="textarea" v-model="formValidate.ctgjcXb"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <!--肺-->
              <el-collapse v-model="activeNames">
                <el-collapse-item title=" 肺" name="2-3">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="视诊:" prop="ctgjcSz1">
                        <el-input @keydown.native="keydown('ctgjcSz1',$event)"
                                  @paste.native="contextmenu('ctgjcSz1',$event)" type="textarea"
                                  v-model="formValidate.ctgjcSz1"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="触诊:" prop="ctgjcCz1">
                        <el-input @keydown.native="keydown('ctgjcCz1',$event)"
                                  @paste.native="contextmenu('ctgjcCz1',$event)" type="textarea"
                                  v-model="formValidate.ctgjcCz1"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="叩诊:" prop="ctgjcKz1">
                        <el-input @keydown.native="keydown('ctgjcKz1',$event)"
                                  @paste.native="contextmenu('ctgjcKz1',$event)" type="textarea"
                                  v-model="formValidate.ctgjcKz1"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="听诊:" prop="ctgjcTz1">
                        <el-input @keydown.native="keydown('ctgjcTz1',$event)"
                                  @paste.native="contextmenu('ctgjcTz1',$event)" type="textarea"
                                  v-model="formValidate.ctgjcTz1"></el-input>
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
                      <el-form-item label="视诊:" prop="ctgjcSz2">
                        <el-input @keydown.native="keydown('ctgjcSz2',$event) "
                                  @paste.native="contextmenu('ctgjcSz2',$event)" type="textarea"
                                  v-model="formValidate.ctgjcSz2"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="触诊:" prop="ctgjcCz2">
                        <el-input @keydown.native="keydown('ctgjcCz2',$event)"
                                  @paste.native="contextmenu('ctgjcCz2',$event)" type="textarea"
                                  v-model="formValidate.ctgjcCz2"></el-input>
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
                      <el-form-item label-width="0" prop="ctgjcKzy1">
                        <el-input @keydown.native="keydown('ctgjcKzy1',$event)"
                                  @paste.native="contextmenu('ctgjcKzy1',$event)"
                                  v-model="formValidate.ctgjcKzy1"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col style="text-align: center" :span="3" :offset="2">
                      <div>II</div>
                    </el-col>
                    <el-col :span="3" :offset="2">
                      <el-form-item label-width="0" prop="ctgjcKzz1">
                        <el-input @keydown.native="keydown('ctgjcKzz1',$event)"
                                  @paste.native="contextmenu('ctgjcKzz1',$event)"
                                  v-model="formValidate.ctgjcKzz1"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="3" :offset="2">
                      <el-form-item label-width="0" prop="ctgjcKzy2">
                        <el-input @keydown.native="keydown('ctgjcKzy2',$event)"
                                  @paste.native="contextmenu('ctgjcKzy2',$event)"
                                  v-model="formValidate.ctgjcKzy2"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col style="text-align: center" :span="3" :offset="2">
                      <div>III</div>
                    </el-col>
                    <el-col :span="3" :offset="2">
                      <el-form-item prop="ctgjcKzz2" label-width="0">
                        <el-input @keydown.native="keydown('ctgjcKzz2',$event)"
                                  @paste.native="contextmenu('ctgjcKzz2',$event)"
                                  v-model="formValidate.ctgjcKzz2"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="3" :offset="2">
                      <el-form-item prop="ctgjcKzy3" label-width="0">
                        <el-input @keydown.native="keydown('ctgjcKzy3',$event)"
                                  @paste.native="contextmenu('ctgjcKzy3',$event)"
                                  v-model="formValidate.ctgjcKzy3"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col style="text-align: center" :span="3" :offset="2">
                      <div>IV</div>
                    </el-col>
                    <el-col :span="3" :offset="2">
                      <el-form-item prop="ctgjcKzz3" label-width="0">
                        <el-input @keydown.native="keydown('ctgjcKzz3',$event)"
                                  @paste.native="contextmenu('ctgjcKzz3',$event)"
                                  v-model="formValidate.ctgjcKzz3"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="3" :offset="2">
                      <el-form-item prop="ctgjcKzy4" label-width="0">
                        <el-input @keydown.native="keydown('ctgjcKzy4',$event)"
                                  @paste.native="contextmenu('ctgjcKzy4',$event)"
                                  v-model="formValidate.ctgjcKzy4"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col style="text-align: center" :span="3" :offset="2">
                      <div>V</div>
                    </el-col>
                    <el-col :span="3" :offset="2">
                      <el-form-item prop="ctgjcKzz4" label-width="0">
                        <el-input @keydown.native="keydown('ctgjcKzz4',$event)"
                                  @paste.native="contextmenu('ctgjcKzz4',$event)"
                                  v-model="formValidate.ctgjcKzz4"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="听诊:" prop="ctgjcTz2">
                        <el-input @keydown.native="keydown('ctgjcTz2',$event)"
                                  @paste.native="contextmenu('ctgjcTz2',$event)" type="textarea"
                                  v-model="formValidate.ctgjcTz2"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="双侧桡动脉:" prop="ctgjcRdm">
                        <el-input @keydown.native="keydown('ctgjcRdm',$event)"
                                  @paste.native="contextmenu('ctgjcRdm',$event)" type="textarea"
                                  v-model="formValidate.ctgjcRdm"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="周围血管征:" prop="ctgjcZwxg">
                        <el-input @keydown.native="keydown('ctgjcZwxg',$event)"
                                  @paste.native="contextmenu('ctgjcZwxg',$event)" type="textarea"
                                  v-model="formValidate.ctgjcZwxg"></el-input>
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
                      <el-form-item label="腹部:" prop="ctgjcFb">
                        腹围:
                        <el-input style="width: 100px" v-model="formValidate.ctgjcFb"></el-input>
                        cm

                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="视诊:" prop="ctgjcSz3">
                        <el-input @keydown.native="keydown('ctgjcSz3',$event)"
                                  @paste.native="contextmenu('ctgjcSz3',$event)" type="textarea"
                                  v-model="formValidate.ctgjcSz3"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="触诊:" prop="ctgjcCz3">
                        <el-input @keydown.native="keydown('ctgjcCz3',$event)"
                                  @paste.native="contextmenu('ctgjcCz3',$event)" type="textarea"
                                  v-model="formValidate.ctgjcCz3"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="叩诊:" prop="ctgjcKz3">
                        <el-input @keydown.native="keydown('ctgjcKz3',$event)"
                                  @paste.native="contextmenu('ctgjcKz3',$event)" type="textarea"
                                  v-model="formValidate.ctgjcKz3"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="听诊:" prop="ctgjcTz3">
                        <el-input @keydown.native="keydown('ctgjcTz3',$event)"
                                  @paste.native="contextmenu('ctgjcTz3',$event)" type="textarea"
                                  v-model="formValidate.ctgjcTz3"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
              <br>


              <el-row>
                <el-col :span="24">
                  <el-form-item label="肛门直肠:" prop="ctgjcGzc">
                    <el-input @keydown.native="keydown('ctgjcGzc',$event)"
                              @paste.native="contextmenu('ctgjcGzc',$event)" type="textarea"
                              v-model="formValidate.ctgjcGzc"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="外生殖器:" prop="ctgjcWszq">
                    <el-input @keydown.native="keydown('ctgjcWszq',$event)"
                              @paste.native="contextmenu('ctgjcWszq',$event)" type="textarea"
                              v-model="formValidate.ctgjcWszq"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="脊柱及四肢:" prop="ctgjcJz">
                    <el-input @keydown.native="keydown('ctgjcJz',$event)" @paste.native="contextmenu('ctgjcJz',$event)"
                              type="textarea" v-model="formValidate.ctgjcJz"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <!--神经系统-->
              <el-collapse v-model="activeNames">
                <el-collapse-item title="神经系统" name="2-6">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="生理反射:" prop="ctgjcSjxt2">
                        <el-input @keydown.native="keydown('ctgjcSjxt2',$event)"
                                  @paste.native="contextmenu('ctgjcSjxt2',$event)" type="textarea"
                                  v-model="formValidate.ctgjcSjxt2"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="病理反射:" prop="ctgjcSjxtblfs">
                        <el-input @keydown.native="keydown('ctgjcSjxtblfs',$event)"
                                  @paste.native="contextmenu('ctgjcSjxtblfs',$event)" type="textarea"
                                  v-model="formValidate.ctgjcSjxtblfs"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="脑膜刺激征:" prop="ctgjcSjxtnmcjz">
                        <el-input @keydown.native="keydown('ctgjcSjxtnmcjz',$event)"
                                  @paste.native="contextmenu('ctgjcSjxtnmcjz',$event)" type="textarea"
                                  v-model="formValidate.ctgjcSjxtnmcjz"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
              <br>

              <el-row>
                <el-col :span="24">
                  <el-form-item label="专科检查:" prop="ctgjcZkqk">
                    <el-input @keydown.native="keydown('ctgjcZkqk',$event)"
                              @paste.native="contextmenu('ctgjcZkqk',$event)" type="textarea"
                              v-model="formValidate.ctgjcZkqk"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="实验室及器械检查:" prop="ctgjcSysjc">
                    <el-input @keydown.native="keydown('ctgjcSysjc',$event)"
                              @paste.native="contextmenu('ctgjcSysjc',$event)" type="textarea"
                              v-model="formValidate.ctgjcSysjc"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>

      <el-row class="table-back-one">
        <el-col :span="24">
          <el-form-item label="病例摘要:" prop="cblzy">
            <el-input type="textarea" v-model="formValidate.cblzy"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="table-back-two">
        <el-col :span="24">
          <el-form-item label="初步诊断:" prop="ccbzd">
            <el-input type="textarea" v-model="formValidate.ccbzd"></el-input>
          </el-form-item>

        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="医师签名:" prop="cysqm1">
            <el-input v-model="formValidate.cysqm1"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
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
      <!--  <el-row class="table-back-one">
          <el-col :span="24" >
            <el-form-item label="入院诊断:" prop="cryzd" >
              <el-input type="textarea" v-model="formValidate.cryzd"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-form-item label="医师签名:" prop="cysqm2" >
              <el-input  v-model="formValidate.cysqm2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" >
            <el-form-item label-width="70px" label="时间:" prop="cysqm2Date" >
              <el-date-picker
                :editable="false"
                v-model="formValidate.cysqm2Date"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>-->
      <el-row class="table-back-one-d">
        <el-col :span="20">
          <el-form-item label="相关证明材料:">
            <div>为证实填写的大病历为本人管床的真实病历，请上传带有学员姓名的病历首页或病程记录照片。</div>
            <upload-file accept="'png|jpg|jpeg|bmp|gif'" @setUploadFiles="expenseFileEvent"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <br>

    <!--新建-->
    <Modal
      close-on-click-modal="false"
      :width="900"
      v-model="selectTempModal"
      title="对话框标题"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectTempId"></modal-header>
      <select-temp v-show="selectTempModal" @templateCancel="templateCancel" @selectTemp="templateFilling"
                   :url="url"></select-temp>
      <div slot="footer"></div>
    </Modal>

    <div style="text-align:center">
      <load-btn @saveSubEvent="saveSubEvent" :btnData="saveBtn"></load-btn>
      <load-btn @appearSubEvent="appearSubEvent" :btnData="loadBtn"></load-btn>
      <el-button @click="addTemplate" type="info">添加模板</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<style>
  .addzjbj .table-back-one,.addzjbj .table-back-two{
    padding: 5px 0 22px 0;
  }
</style>
<script>
  /*当前组件必要引入*/
  import selectTemp from './largeSelectTemplate/largeSelectTemplate_list.vue';
  import {largeCaseTemplate} from '../../../rules';
  //当前组件引入全局的util
  //前台业务字典组件引入
  import dictionary from '../../../../../libs/dictionary.js';

  let Util = null;
  export default {
    props: ['depId', 'depName', 'url', 'podId'],
    data() {
      return {
        largeCaseTemplate,
        saveBtn: {title: '提交', callParEvent: 'saveSubEvent'},
        loadBtn: {title: '上报', callParEvent: 'appearSubEvent'},
        name: '',
        activeNames: [],
        dictionary: dictionary,
        formValidate: {
          workAddress: '',
          reliability: '',
          phone: '',
          cbirthPlace: '',
          cjbs: '',
          cxthgHys: '',
          cxthgSys: '',
          "ctgjcYan": "",
          "ctgjcEr": "",
          "ctgjcBi": "",
          "ctgjcKou": "",
          "ctgjcSjxtblfs": "",
          "ctgjcSjxtnmcjz": "",

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
          "cdepId": this.depId,
          "cdepName": this.depName,
          "cpodId": this.podId,
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
          "copyField": [
            {
              "fieldName": "cjwsYbjkqk",
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
              "fieldName": "cxthgHys",
              "isCopy": 0
            },
            {
              "fieldName": "cxthgSys",
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
              "fieldName": "ctgjcSmtzP",
              "isCopy": 0
            },
            {
              "fieldName": "ctgjcSmtzR",
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
              "fieldName": "ctgjcYan",
              "isCopy": 0
            },
            {
              "fieldName": "ctgjcEr",
              "isCopy": 0
            },
            {
              "fieldName": "ctgjcBi",
              "isCopy": 0
            },
            {
              "fieldName": "ctgjcKou",
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
              "fieldName": "ctgjcSjxt2",
              "isCopy": 0
            },
            {
              "fieldName": "ctgjcSjxtblfs",
              "isCopy": 0
            },
            {
              "fieldName": "ctgjcSjxtnmcjz",
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

        },
        copyField: {},
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
        //获取是否黏贴信息
        getBigcaseIscopy: {
          ajaxSuccess: 'getBigcaseIscopyData',
          ajaxParams: {
            url: this.url.bigcaseIscopy,
          }
        },
        isCopy: '',
        selectTempModal: false,
        selectTempId: {id: 'selectTempId', title: '选择模板'},
        configValue: 0,
      }
    },
    methods: {

      //通过get请求列表数据
      getBigcaseIscopyData(responseData) {
        let data = responseData.data;
        console.log(data)
        this.isCopy = data["configValue"];
        if (this.isCopy) {
          this.getCopyRates();
        }

      },
      getCopyRates() {
        this.ajax({
          ajaxSuccess: (res) => {
            console.log(res)
            this.configValue = res.data['configValue'];
          },
          ajaxParams: {
            url: '/rotaryConfig/getByKey/rotary_bigcase_copyscale-' + this.$store.getters.getUserInfo.studentTypes,
          }
        });

      },
      //初始化请求列表数据
      init() {
//              获取当前登录人的信息
        let userInfo = this.$store.getters.getUserInfo;
        this.name = userInfo.name;
        console.log(this.url);
        //获取当前登录人来判定调用那个接口来获取技能和病种名称
        let studentTypes = userInfo.studentTypes;
        this.getBigcaseIscopy.ajaxParams.url = this.url.bigcaseIscopy + studentTypes;
        this.ajax(this.getBigcaseIscopy);
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        console.log(isLoadingFun)
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          let formValidate = this.getFormData(this.formValidate);
          formValidate.copyField = this.conductCopyField(formValidate.copyField);
          formValidate = this.formDate(formValidate, ['cruyuanDate'], 'yyyy-MM-dd HH:mm');
          this.addMessTitle.ajaxParams.data = this.formDate(formValidate, ['cysqm1Date', 'cysqm2Date', 'cjlDate'], 'yyyy-MM-dd');
          this.ajax(this.addMessTitle, isLoadingFun)
        }
      },

      //处理要提交的的数据 ，，粘贴数据
      conductCopyField(data) {
        console.log(data)
        console.log(this.copyField)
        let temp = 0;
        for (let i = 0; i < data.length; i++) {
          if (this.copyField[data[i].fieldName]) {
            data[i].isCopy = 1;
            temp++;
          }
        }
        //61
        console.log(this.formValidate.copyField.length)
        console.log(this.configValue)
        if (temp / this.formValidate.copyField.length * 100 >= this.configValue) {
          this.isCopy = 0;
          this.showMess('粘贴比率已到上限');
        }
        return data;
      },

      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },

      //添加为模板
      addTemplate() {
        let isSubmit = this.submitForm("formValidate");
        if (!isSubmit) {
          this.errorMess('数据有误，请重新填写');
          return;
        }
        if (this.formValidate.fileIds) {
          this.showMess('模板不能保存上传的附件');
          this.formValidate.fileIds = '';
        }
        let addMessTitle = {
          type: 'add',
          successTitle: '添加模板成功!',
          errorTitle: '添加模板失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
            url: this.url.bigCasesAddTemplate,
            method: 'post',
            data: {},
          }
        };
        let formValidate = this.getFormData(this.formValidate);
        formValidate = this.formDate(formValidate, ['cruyuanDate'], 'yyyy-MM-dd HH:mm');
        addMessTitle.ajaxParams.data = this.formDate(formValidate, ['cysqm1Date', 'cysqm2Date', 'cjlDate'], 'yyyy-MM-dd');
        this.ajax(addMessTitle)
      },

      //保存
      saveSubEvent(isLoadingFun) {
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
        };
        this.addMessTitle = addMessTitle;
        this.listenSubEvent(isLoadingFun)
      },

      //上报
      appearSubEvent(isLoadingFun) {
        let addMessTitle = {
          type: 'add',
          successTitle: '上报成功!',
          errorTitle: '上报失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
            url: this.url.caseRecordBigCasesAddRelease,
            method: 'post',
            data: {},
          }
        };
        this.addMessTitle = addMessTitle;
        this.listenSubEvent(isLoadingFun)
      },

      //取消
      cancel() {
        this.$emit('cancel', this.addMessTitle.type);
      },

      //上传文件
      expenseFileEvent(ids) {

        this.formValidate.fileIds = ids;
      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = this.$util._.defaultsDeep({}, data);
        return myData;
      },

      /**
       * 选择模板
       * */

      selectTemplate() {
        this.selectTempModal = true;

      },

      //填充模板
      templateFilling(data) {
        if (data.copyField) delete data.copyField;

        this.formValidate = Object.assign(this.formValidate, data);
        this.selectTempModal = false;
      },

      templateCancel() {
        this.selectTempModal = false;
      },

      //键盘监听事件，监听是否按下ctrl + v
      keydown(key, event) {
        event = event || window.event;
        if (event.keyCode == 86 && event.ctrlKey) {
          if (!(+this.isCopy)) {
            this.showMess('不允许粘贴');
            event.returnValue = false;
            return;
          }
          this.copyField[key] = 1;
          let formValidate = this.getFormData(this.formValidate);
          this.conductCopyField(formValidate.copyField);
        }
      },

      //监听右键，粘贴
      contextmenu(key, event) {
        event = event || window.event;
        console.log(event.returnValue)
        if (!(+this.isCopy)) {
          this.showMess('不允许粘贴');
          event.returnValue = false;
          return;
        }
        console.log(this.copyField)
        this.copyField[key] = 1;
        console.log(this.copyField[key])
        let formValidate = this.getFormData(this.formValidate);
        console.log(formValidate)
        this.conductCopyField(formValidate.copyField);
      },

    },

    created() {
      this.init();

    },
    mounted() {
    },
    components: {
      selectTemp
    }
  }
</script>
