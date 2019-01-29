<template>

  <div>


    <el-form ref="formValidate"  class="demo-form-inline" label-width="90px">
      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="名称 :" prop="title">
            {{formValidate.name}}
          </el-form-item>
        </el-col>
        <el-col :span="10" v-if="!unShowStyle">
          <el-form-item label="分类 :" prop="title">
            {{operailityData.treeName}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item label="用途 :" prop="title">
            {{formValidate.remark}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row >
        <fieldset class="layui-elem-field" v-if="!unShowStyle">
          <legend>评分表样式设置</legend>
          <el-row>
            <el-col :span="6" :offset="2">
              <el-form-item label="是否包含分类 :" prop="title" label-width="110px">
                <el-switch
                  disabled
                  @change="groupChange"
                  v-model="formValidate.hasGroup"
                  on-color="#13ce66"
                  off-color="#ff4949"
                  on-text="是"
                  off-text="否"
                  on-value="Y"
                  off-value="N">
                </el-switch>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10" >
              <el-form-item v-if="formValidate.hasGroup=='Y'" label="是否按照分类评分 :" prop="title" label-width="12 0px">
                <el-switch
                  disabled
                  @change="groupScoreChange"
                  v-model="formValidate.hasGroupScore"
                  on-color="#13ce66"
                  off-color="#ff4949"
                  on-text="是"
                  off-text="否"
                  on-value="Y"
                  off-value="N">
                </el-switch>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20" :offset="2">
              <el-form-item label="是否显示备注:" prop="title" label-width="110px">
                <el-switch
                  disabled
                  @change="hasRemarkChange"
                  v-model="formValidate.hasRemark"
                  on-color="#13ce66"
                  off-color="#ff4949"
                  on-text="是"
                  off-text="否"
                  on-value="Y"
                  off-value="N">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="20" :offset="2">
              <el-form-item  label="评分方式 :" prop="title" label-width="110px">
                <el-switch
                  disabled
                  @change="scoreTypeChange"
                  v-model="formValidate.scoreType"
                  on-color="#13ce66"
                  off-color="#ff4949"
                  on-text="输入"
                  off-text="选择"
                  on-value="INPUT"
                  off-value="SELECT">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <!--选择SELECT时显示候选项-->
          <div v-if="formValidate.scoreType == 'SELECT'">
            <el-row v-for="(item,index) in formValidate._scoreLevel" :key="index">
              <el-col :span="10" :offset="2">
                <el-form-item  :label="`候选项 ${index+1}:`" prop="title" label-width="110px">
                 {{item.label}}
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </fieldset>

        </br>
        <fieldset class="layui-elem-field selfBody" style="width: 100%">
          <legend>评分表内容设置</legend>
          <div   v-if="body[0]"  style="border: 1px solid #dfe6ec;width: 902px;overflow: auto;margin: 0 auto" class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">


            <table :width="header.length*150>900?header.length*150:900">

              <colgroup  v-for="(item,index) in header">
                <col :name="'el-table_1_column_'+index" :width="header.length*150>900?900/header.length:150">
              </colgroup>

              <thead >
              <tr  >
                <th class="cell" v-for="(item,index) in header">
                  {{item.label}}
                </th>
              </tr>
              </thead>
            </table>
            <div class="el-table__body-wrapper" style="max-height:400px;overflow-x: hidden;overflow-y: auto;" :style="'width:'+(header.length*150>900?header.length*150:900)+'px'">
              <table   :width="header.length*150>900?header.length*150:900">
                <colgroup  v-for="(item,index) in header">
                  <col name="'el-table_1_column_'+index" :width="header.length*150>900?900/header.length:150">
                </colgroup>

                <tbody  class="add-scope">
                  <tr v-for="(item,index) in body">
                    <td v-if="isShow(item,head['key'])"  :rowspan="item[head['key']+'Row']" v-for="(head,i) in header" :key="i">

                      <div v-if="head['key']== 'operateSub'" style="text-align: center">
                        <el-button size="mini" type="primary" icon="plus" @click="operateSubAdd(item,head['key'],index)"></el-button>
                        <el-button  size="mini" type="warning" icon="minus" @click="operateSubRemove(item,head['key'],index)"></el-button>
                      </div>
                      <div v-else-if="head['key']== 'operateParent' " style="text-align: center">
                        <el-button  type="primary" icon="plus" @click="operateParentAdd(item,head['key'],index)"></el-button>
                        <el-button   type="warning" icon="minus" @click="operateParentRemove(item,head['key'],index)"></el-button>
                      </div>
                      <el-form-item v-else  prop="title" label-width="0">
                        <div style="text-align: center"> {{item[head.key]}}</div>
                      </el-form-item>
                    </td>
                  </tr>
                <!--总分-->
                <tr>
                  <td style="text-align: center;color: #000;font-size: 18px" :colspan="scoreCol()">
                    <span>总分</span>
                  </td >

                  <td style="text-align: center;color: #000;font-size: 18px" :colspan="formValidate.hasScoreLevel=='Y'?select.length:1">
                   {{formValidate.score}}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </fieldset>
      </el-row >

    </el-form>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  import myTable from '../../../common/customTable.vue'
  import cell from '../../../common/customCell.vue'
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData','url','unShowStyle'],
    data (){
      return{
        //保存按钮基本信息
        saveBtn:{title:'保存',callParEvent:'listenSubEvent'},
        setTableStyle:'height:300px;overflow-x: hidden;overflow-y: auto;',
        //form表单bind数据
        formValidate: {
          /*  name:"",   //类型名称
           "typeId":this.operailityData.id,               //所属类型ID
           "remark":"住院医用的",                           //评分表用途、描述
           "score":"100",                                  //评分表总分 int
           "hasGroup":"Y",                                 //是否包含分类 取值范围：是（Y），否（N） 。
           "hasGroupScore":"Y",                            //是否按照分类评分 取值范围：是（Y），否（N）。
           "hasRemark":"Y",                                //是否有备注 取值范围：是（Y），否（N）。
           "scoreType":"INPUT",                           //评分方式：输入分数/选择 取值范围：输入（INPUT），选择（SELECT）。
           "hasScoreLevel":"Y",                            //是否有分值等级 取值范围：是（Y），否（N）。 当scoreType取值SELECT，该字段必须有值
           "scoreLevel":"优|良|中|差",                     //分值等级 当hasScoreLevel取值Y，该字段必须有值
           _scoreLevel:[{label:'',key:'select1'}]  ,                              //候选项数组
           "templateItemList":[
           ],*/
        },
        header:[
        ],
        idCount:50, //累计数，防止重复
        body:[

        ],
        select:[],
        constructionMerge:{ //项目合并数，key为ID
          '1':2,
        },
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        addMessTitle:{
          type:'add',
          successTitle:'保存成功',
          errorTitle:'保存失败',

          ajaxSuccess:'ajaxSuccess',
          ajaxParams:{
            jsonString:true,
            url:this.url.templateModify+this.operailityData.id,
            method:'post',
            data:{},
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:this.url.templateGet+this.operailityData.id,
          }
        }

      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      //初始化

      this.init();
    },
    methods:{
      /** ----------------ajax-------------*/
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);

      },

      //初始请求数据
      SuccessGetCurrData(res){
        let data = res.data;
        if(!data) return;
       /* data = {
          "id":1000,
          "typeId":1000,
          "name":"住院医专用的评分模板01",
          "remark":"住院医用的",
          "score":"100",
          "hasGroup":"Y",
          "hasGroupScore":"Y",
          "hasRemark":"Y",
          "scoreType":"SELECT",
          "hasScoreLevel":"Y",
          "scoreLevel":"优|良|中|差",
          "templateItemList":[
            {
              "id":1,
              "title":"评分第一条",
              "hasRemark":"Y",
              "remark":"随便打分",
              "maxScore":"80",
              "score":"0",
              "hasScore":"Y",
              "scoreType":"SELECT",
              "templateItemOptionList":[
                {
                  "id":2,
                  "title":"优",
                  "val":80
                },
                {
                  "id":2,
                  "title":"良",
                  "val":70
                },
                {
                  "id":2,
                  "title":"中",
                  "val":60
                },
                {
                  "id":2,
                  "title":"差",
                  "val":30
                }
              ],
              "child":[
                {
                  "id":1,
                  "title":"评分第一条",
                  "hasRemark":"Y",
                  "remark":"随便打分",
                  "maxScore":"80",
                  "score":"0",
                  "hasScore":"Y",
                  "scoreType":"INPUT",
                  "templateItemOptionList":[
                    {
                      "id":2,
                      "title":"优",
                      "val":80
                    },
                    {
                      "id":2,
                      "title":"良",
                      "val":70
                    },
                    {
                      "id":2,
                      "title":"中",
                      "val":60
                    },
                    {
                      "id":2,
                      "title":"差",
                      "val":30
                    }]
                },
                {
                  "id":1,
                  "title":"评分第一条",
                  "hasRemark":"Y",
                  "remark":"随便打分",
                  "maxScore":"80",
                  "score":"0",
                  "hasScore":"Y",
                  "scoreType":"INPUT",
                  "templateItemOptionList":[
                    {
                      "id":2,
                      "title":"优",
                      "val":80
                    },
                    {
                      "id":2,
                      "title":"良",
                      "val":70
                    },
                    {
                      "id":2,
                      "title":"中",
                      "val":60
                    },
                    {
                      "id":2,
                      "title":"差",
                      "val":30
                    }]
                }
              ]
            },

          ]
        }*/
        data.score = data.score/100;
        this.formValidate =data;//使基础数据显示
        this.formValidate = this.conductData(data);
      },

      //处理获取到的数据
      conductData(data){
        let select = [];
        let _scoreLevel = [];
        let scoreTypeArr = [];//头部使用
        if(data.scoreType == 'SELECT'){
          data.scoreLevel.split('|').forEach( (item,index)=> {
            let key = ++this.idCount;
            _scoreLevel.push({
              key:`select${key}`,
              label:item
            });
            select.push(`select${key}`);
            scoreTypeArr.push({
              label:`候选项${index+1}`,
              key:`select${key}`
            })
          })
          this.select  = select
        }else {
          _scoreLevel = [{label:'',key:'select1'}];
          this.select = ['select1'];
          scoreTypeArr =[ {
            key :'score',
            label :'标准分',
          }]
        }
        data._scoreLevel =_scoreLevel;

        if(data.hasGroup == 'Y'){
          this.conductDataHasGroup(data,scoreTypeArr)

        }else {
          this.conductDataNoGroup(data,scoreTypeArr)

        }
        return data
      },

      //返回的数据存在分组
      conductDataHasGroup(data,scoreTypeArr){
        //定义头部header
        let header = [{
          key :'parentTitle',
          label :'考核项目',
        },{
          key :'titleSub',
          label :'考核内容',
        },{
          key :'remark',
          label :'备注',
        },
          ...scoreTypeArr
          ,

        ];
        //是否有备注
        if(data.hasRemark =='N'){
          header.splice(2,1)
        }
        this.header = header;

        //
        //定义内容
        let body = [];
        let index = 0;
        let isScore=false;
        if(data.hasGroupScore == 'Y'){
          isScore = true
        }


        //如果是选择的，为返回的选择的数据进行排序和匹配
        let scoreLevelObj={}
        for(let l=0;l<data._scoreLevel.length;l++){
          scoreLevelObj[data._scoreLevel[l].label] = data._scoreLevel[l].key;
        }

        let obj;
        let parentId;
        let flag=true;//如果不是否按照分类评分的，则k=0时是true，只允许进一次;如果是否按照分类评分的，则此项为true,判断条件是，是否是hasScore为‘Y’；
          let templateItemList = data.templateItemList;  //传过来的内容主体
        for(let i=0;i<templateItemList.length;i++){
          let child=templateItemList[i].child;
          if(!child) continue;
          let tempArr = [];//临时放置处理的当前child的子项
          for(let k=0;k<child.length;k++){
            if(k==0){
              parentId = ++this.idCount;
              this.constructionMerge[parentId] = child.length;//父元素要合并的单元格数
            }
            if(!isScore){
                flag = k==0;
            }else {
              flag=true;
            }
            if(flag && child[k].hasScore=='Y') {
              if(isScore)child[k].templateItemOptionList = templateItemList[i].templateItemOptionList;
              obj = {
                parentTitle:templateItemList[i].title||'',
                parentTitleRow:child.length,
                titleSub:child[k].title||'',
                _isParent:true,
                _id:parentId,
                score:child[k].score/100||'',
                scoreRow:isScore?child.length:1,
                remark:child[k].remark||'',
                operateSub:'',
                operateParent:'',
                operateParentRow:child.length,
                select1:'',
                select1Row:isScore?child.length:1,
              }
              if(child[k].templateItemOptionList!=0) {
//                for (let l = 0; l < this.select.length; l++) {
//                  obj[this.select[l]] = child[k].templateItemOptionList[l].val
//                }
                for(let j=0;j<child[k].templateItemOptionList.length;j++){
                  let title = child[k].templateItemOptionList[j].title;
                  let label = child[k].templateItemOptionList[j].val/100;
                  obj[scoreLevelObj[title]] = label;
                }
              }else {
                for(let l=0;l<this.select.length;l++){
                  if(child[k].templateItemOptionList[l]==null){
                    obj[this.select[l]] = '';
                  }else {
                    obj[this.select[l]] = child[k].templateItemOptionList[l].val/100
                  }
                }
              }

              tempArr.unshift(obj);
            }else {
              obj = {
                  titleSub:child[k].title||'',
                  _isParent:false,
                  _parentId:parentId,
                  score:child[k].score/100||'',
                  remark:child[k].remark||'',
                  operateSub:'',
                  select1:'',
                }
              if(child[k].templateItemOptionList!=0) {
                //                for (let l = 0; l < this.select.length; l++) {
//                  obj[this.select[l]] = child[k].templateItemOptionList[l].val
//                }

                for(let j=0;j<child[k].templateItemOptionList.length;j++){
                  let title = child[k].templateItemOptionList[j].title;
                  let label = child[k].templateItemOptionList[j].val/100;
                  obj[scoreLevelObj[title]] = label;
                }
              }else {
                for(let l=0;l<this.select.length;l++){
                  if(child[k].templateItemOptionList[l]==null){
                    obj[this.select[l]] = '';
                  }else {
                    obj[this.select[l]] = child[k].templateItemOptionList[l].val/100
                  }
                }
              }
              tempArr.push(obj)
            }
          }
          body = body.concat(tempArr);
          tempArr = [];
        }
        this.body = body;
        //根据当前评分分组决定评分项是否合并单元格
        this.groupScoreChange(this.formValidate.hasGroupScore);
      },

      //返回的数据不存在分组
      conductDataNoGroup(data,scoreTypeArr){
        //定义头部header
        let header = [{
          key :'titleSub',
          label :'考核内容',
        },{
          key :'remark',
          label :'备注',
        },
          ...scoreTypeArr

        ];
        if(data.hasRemark =='N'){
          header.splice(1,1)
        }
        this.header = header;

        //定义内容
        let body = [];
        let index = 0;
        let isScore=false;
        if(data.hasGroupScore == 'Y'){
          isScore = true
        }

        //如果是选择的，为返回的选择的数据进行排序和匹配
        let scoreLevelObj={}
        for(let l=0;l<data._scoreLevel.length;l++){
          scoreLevelObj[data._scoreLevel[l].label] = data._scoreLevel[l].key;
        }

        let parentId;
        let obj;
        let templateItemList = data.templateItemList;  //传过来的内容主体
        for(let i=0;i<templateItemList.length;i++){
          parentId = ++this.idCount;
          this.constructionMerge[parentId] = 1;
          obj= {
            parentTitle:'',
            parentTitleRow:1,
            titleSub:templateItemList[i].title||'',
            _isParent:true,
            _id:parentId,
            score:templateItemList[i].score/100||'',
            scoreRow:1,
            remark:templateItemList[i].remark||'',
            operateSub:'',
            operateParent:'',
            operateParentRow:1,
            select1:'',
            select1Row:1,
          }
          if(templateItemList[i].templateItemOptionList!=0){
//            for(let l=0;l<this.select.length;l++){
//              obj[this.select[l]] =  templateItemList[i].templateItemOptionList[l].val
//            }
            for(let j=0;j<templateItemList[i].templateItemOptionList.length;j++){
              let title = templateItemList[i].templateItemOptionList[j].title;
              let label = templateItemList[i].templateItemOptionList[j].val/100;
              obj[scoreLevelObj[title]] = label;
            }
          }else {
            for (let l = 0; l < this.select.length; l++) {
              if(templateItemList[i].templateItemOptionList[l]==null) {
                obj[this.select[l]] = '';
              }else {
                obj[this.select[l]] = templateItemList[i].templateItemOptionList[l].val/100
              }
            }
          }

          body.push(obj)
        }


        this.body = body;
        //根据当前评分分组决定评分项是否合并单元格
        this.groupScoreChange(this.formValidate.hasGroupScore);
      },





      /**----------------------------------------------操作处理*/
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','show');
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep([],data);
        return myData;
      },

      //上传附件
      addFileEvent(ids){
        this.formValidate.fileIds = ids;
      },
      /**---------------------操作 ---------------------------*/
      //总分占多少单元格
      scoreCol(){
        let scoreCol = this.formValidate.hasScoreLevel=='Y'?this.select.length:1;
        if(this.formValidate.hasGroup=='Y'){
          return this.header.length-(+scoreCol)
        }else {
          return this.header.length-(+scoreCol)

        }
      },


      //添加候选项
      addLevel(index){
        let count = ++this.idCount;
        if(this.formValidate._scoreLevel[this.formValidate._scoreLevel.length-1].label){
          this.formValidate._scoreLevel.push({label:'',key:`select${count}`})  //添加候选层级
          this.select.push(`select${count}`);  //添加候选数组
          for (let i=0;i<this.body.length;i++){  //向body内部添加候选数据
            this.body[i][`select${count}`] = '';
            this.groupScoreChange(this.formValidate.hasGroupScore) //是否需要合并单元格
          }

          for(let i=0;i<this.header.length;i++){ //向头部添加候选
            if(this.header[i].key == 'operateSub'){
              this.header.splice(i,0,{
                key:`select${count}`,
                label:`候选项${this.formValidate._scoreLevel.length}`
              });
              i++;
            }
          }
        }else {
          this.showMess( `候选项${this.formValidate._scoreLevel.length}内容不能为空`)
        }
      },

      //移除候选项
      removeLevel(index){
        if(this.formValidate._scoreLevel.length>1){
          let key = this.formValidate._scoreLevel.splice(index,1)[0].key; //移除的key 'select1'
          if(~this.select.indexOf(key)){
            this.select.splice(this.select.indexOf(key),1);
          }

          for(let i=0;i<this.header.length;i++){ //移除头部的候选项
            if(this.header[i].key == key){
              this.header.splice(i,1);
              i--;
            }
            let index = this.select.indexOf(this.header[i].key);
            if(~index){
              this.header[i].label=`候选项${index+1}`
            }

          }
        }else {
          this.showMess('无法移除')
        }
      },



      //改变分类
      groupChange(val){
        if(val=='Y'){

          //更改头部
          this.header.unshift({
            key :'parentTitle',
            label :'考核项目',
          });
          this.header.push(
            {
              key :'operateParent',
              label :'',
            },
          );

          //更改body
          for(let i=0;i<this.body.length;i++){
            if(this.body[i]._id) {
              this.body[i]._isParent = true;
            }
          }
        }else {
          //改变是否按照分组评分为N,并调用方法
          this.formValidate.hasGroupScore='N'; //评分变成N
          this.groupScoreChange('N')
          //更改头部
          this.header.shift();
          this.header.pop();
          //更改body
          for(let i=0;i<this.body.length;i++){
            this.body[i]._isParent = false;
          }

        }
      },

      //改变是否按照分组评分
      groupScoreChange(val){
        if(val=='Y'){

          for(let i=0;i<this.body.length;i++){
            let _id=this.body[i]._id;
            if(_id){//存在id为父元素 评分项单元格
              this.body[i].scoreRow = this.constructionMerge[_id];
              for(let k=0;k<this.select.length;k++){
                this.body[i][this.select[k]+'Row'] = this.constructionMerge[_id]
              }
            }
          }

        }else {
          for(let i=0;i<this.body.length;i++){
            if(this.body[i]._id){//存在id为父元素 评分项不合并单元格
              this.body[i].scoreRow = 1;
              for(let k=0;k<this.select.length;k++){
                this.body[i][this.select[k]+'Row'] = 1
              }
            }
          }

        }

      },

      //改变是否有备注
      hasRemarkChange(val){
        if(val=='Y'){
          for (let i=0;i<this.header.length;i++){

            if(this.header[i].key =='titleSub'){
              this.header.splice(i+1,0,{
                key:'remark',
                label :'备注'
              })
            }
          }
        }else {
          for (let i=0;i<this.header.length;i++){

            if(this.header[i].key =='remark'){
              this.header.splice(i,1)
            }
          }
        }

      },

      //评分方式
      scoreTypeChange(val){
        this.formValidate.scoreType =val;
        if(val=='INPUT'){
          this.formValidate.hasScoreLevel ='N';
          for(let i=0;i<this.header.length;i++){

            if((this.header[i].key).includes('select')){
              this.header.splice(i,1);
              i--
            }
            if(this.header[i].key =='operateSub'){
              this.header.splice(i,0,{
                key:'score',
                label :'标准分'
              })
              i++;
            }
          }
        }else {
          this.formValidate.hasScoreLevel ='Y';
          for(let i=0;i<this.header.length;i++){
            if(this.header[i].key =='score'){
              this.header.splice(i,1);//移除评分
              //添加候选项
              let tempSelect =[];
              for(let k=0;k<this.select.length;k++){
                tempSelect.push({
                  key:this.select[k],
                  label :`候选项${k+1}`
                })
              }
              this.header.splice(i,0,...tempSelect);
            }
          }
        }

      },




      //内容添加
      operateSubAdd(item,key,index){
        let count;
        let id='' ;
        if(item._id){
          id = item._id

          if(this.formValidate.hasGroup=='Y'){
            this.constructionMerge[id]+=1;
            count = this.constructionMerge[id]//合并的单元格数，index+count也是要放的位置
            item.parentTitleRow = count;
            item.operateParentRow = count;
          }else {
            count = this.constructionMerge[id]
          }

        }else {
          id = item._parentId;
          if(this.formValidate.hasGroup=='Y') {
            this.constructionMerge[id] += 1;
            count = this.constructionMerge[id]//合并的单元格数，index+count也是要放的位置
            for (let i = 0; i < this.body.length; i++) {
              if (this.body[i]._id == id) {
                this.body[i].parentTitleRow = count;
                this.body[i].operateParentRow = count;
                break;
              }
            }
          }else {
            count = this.constructionMerge[id]
          }
        }
        index = index+1;
        let obj = {};
        if(this.formValidate.hasGroup=='Y'){
          obj ={
            titleSub:'',
            _isParent:false,
            _parentId:id,
            score:'',
            remark:'',
            operateSub:'',
          }
        }else {
          let _id = ++this.idCount;
          obj ={
            parentTitle:'',
            parentTitleRow:1,
            titleSub:'',
            _isParent:true,
            _id:_id,
            score:'',
            scoreRow:1,
            remark:'',
            operateSub:'',
            operateParent:'',
            operateParentRow:1,
          }
          this.constructionMerge[_id] = 1;
          index= this.body.length
        }
        for(let i=0;i<this.select.length;i++){
          obj[this.select[i]] = '';
          if(obj._id){
            obj[this.select[i]+'Row'] = count;
          }
        }

        ///标准分决定插入的位置
        this.body.splice(index,0,obj);
        this.groupScoreChange(this.formValidate.hasGroupScore) // 标准分合并

      },

      //内容移除
      operateSubRemove(item,key,index){
        if(this.body.length<2){
          this.showMess('无法移除');
          return;
        }
        //是否有分类
        let hasGroup = false;
        if(this.formValidate.hasGroup=='Y') {
          hasGroup = true
        }
        let count;
        let id='' ;
        if(item._id){
          id = item._id
          if( this.constructionMerge[id]==1){
            delete this.constructionMerge[id];
            this.body.splice(index,1);
            return;
          }else {

            this.constructionMerge[id] = this.constructionMerge[id] - 1;
            count = this.constructionMerge[id]//合并的单元格数，index+count也是要放的位置
            item.parentTitleRow = count;
            item.operateParentRow = count;
            this.body[index + 1] = {
              parentTitle:this.body[index].parentTitle,
              parentTitleRow: count,
              titleSub:this.body[index + 1].titleSub,
              _isParent: hasGroup,
              _id: id,
              score:this.body[index + 1].score,
              scoreRow: count,
              remark: this.body[index + 1].titleSub,
              operateSub: this.body[index + 1].titleSub,
              operateParent: '',
              operateParentRow: count,
            }
          }
        }else {
          id = item._parentId;
          this.constructionMerge[id]= this.constructionMerge[id] - 1;
          count = this.constructionMerge[id]//合并的单元格数，index+count也是要放的位置
          for (let i = 0; i < this.body.length; i++) {
            if (this.body[i]._id == id) {
              this.body[i].parentTitleRow = count;
              this.body[i].operateParentRow = count;
              break;
            }
          }
        }
        this.body.splice(index,1);
        this.groupScoreChange(this.formValidate.hasGroupScore) // 标准分合并
      },

      //项目添加
      operateParentAdd(item,key,index){
        let indexId = ++this.idCount;
        let Group = 1;
        let score = 1;
        if(this.formValidate.hasGroup=='Y'){
          Group = 2;
        }
        if(this.formValidate.hasGroupScore == 'Y'){
          score = 2
        }

        let tempArr = [{
          parentTitle:'',
          parentTitleRow:Group,
          titleSub:'',
          _isParent:true,
          _id:indexId,
          score:'',
          scoreRow:score,
          remark:'',
          operateSub:'',
          operateParent:'',
          operateParentRow:Group,
        }  ,
          {
            titleSub:'',
            _isParent:false,
            _parentId:indexId,
            score:'',
            remark:'',
            operateSub:'',
          }];
        this.constructionMerge[indexId] = 2;

        for(let i=0;i<this.select.length;i++){
          for(let k=0;k<tempArr.length;k++){
            tempArr[k][this.select[i]] = '';
            if(tempArr._id){
              tempArr[k][this.select[i]+'Row'] = score;
            }
          }

        }
        this.body=this.body.concat(tempArr);
        this.groupScoreChange(this.formValidate.hasGroupScore) // 标准分合并


      },

      //项目移除
      operateParentRemove(item,key,index){
        if(Object.keys(this.constructionMerge).length<2){ //如果项目还剩最后一个无法删除
          this.showMess('无法移除');
          return
        }
        let count = this.constructionMerge[item._id];
        delete this.constructionMerge[item._id];
        this.body.splice(index,count);

      },

      //是否显示单元格
      isShow(item,key){
        let undefined;
        if(item._isParent){
          return true
        }
        if(this.formValidate.hasGroupScore=='Y'&&key=='score'){

          return false;
        }
        if(this.formValidate.hasGroupScore=='Y'&&key.includes('select')){

          return false;
        }

        if(typeof item[key] == 'undefined' || 'parentTitle operateParent'.includes(key)){
          return false
        }else {
          return true
        }


      }

    },
    components:{
      myTable,cell
    }
  }
</script>
