
<template>
  <my-table  :height="height" v-if="headers[0]"   border  :columns="headers" :data="list"></my-table>
</template>
<script>
  import myTable from '../../../components/common/myTable.vue';
  export default {
      props:['height','tableList','headerList','config'],
          data () {
            let list=[]
            let headers=[]
            if(this.headerList){
             headers=this.conductHead(this.headerList);
          }
          if(this.tableList){
           list =  this.conductList(this.tableList);
          }
            return {
            defaultParams:{
              keys:['stationName','roomNum','teacherNames'],  //头部排列顺序
              headLeft:['站点名称','房间号','监考老师'] ,        //左侧第一列显示的信息
              headLeftKey:'time',                             //左侧第一列匹配的key
              width:'200',                                    //单元格的宽度
              key:'roomNum',                                  //主题内容拼配的名，通过名来获取值当匹配项
              rowSpanKey:'timeCount',                              // 合并单元格的key
              cellKey:'userName' ,                            // cell的key
              tableBodyKey:'arrangementList' ,                           // 获取的数据内容主题列表的key
            },
            listMessTitle:{
              ajaxSuccess:'listDataSuccess',
              ajaxParams:{
                url:'scene/arrangement/preview',
                params:{}
              }
            },
            headers:headers,
            list: list,
          }

    },
    mounted(){
    },
    methods: {

      conductHead(data){
          let headerList=[];

          let defaultParams = {
              keys:['stationName','roomNum','teacherNames'],  //头部排列顺序
              headLeft:['站点名称','房间号','监考老师'] ,        //左侧第一列显示的信息
              headLeftKey:'time',                             //左侧第一列匹配的key
              width:'200',                                    //单元格的宽度
              key:'roomNum',                                  //主题内容拼配的名，通过名来获取值当匹配项
              rowSpanKey:'timeCount',                              // 合并单元格的key
              cellKey:'userName' ,                            // cell的key
              tableBodyKey:'arrangementList' ,                           // 获取的数据内容主题列表的key
          };
        defaultParams = Object({},defaultParams,this.config)
        //头部对象的名
          let keys  = defaultParams.keys;
          let headLeft  = defaultParams.headLeft ;  //头部左侧第一列
          let headLeftKey = defaultParams.headLeftKey;
          let width = defaultParams.width;
          let key = defaultParams.key;

        for(let i=0;i<keys.length;i++){
            headerList[i] = [];
            headerList[i].push({
                title :headLeft[i],
                key:headLeftKey,
                width:width
            })

            for(let k=0;k<data.length;k++){
                  headerList[i].push({
                    title :data[k][keys[i]],
                    key:data[k][key],
                    width:width
                  })
                }
            }
            return headerList;
          },
      conductList(data){
        let defaultParams = {
          keys:['stationName','roomNum','teacherNames'],  //头部排列顺序
          headLeft:['站点名称','房间号','监考老师'] ,        //左侧第一列显示的信息
          headLeftKey:'time',                             //左侧第一列匹配的key
          width:'200',                                    //单元格的宽度
          key:'roomNum',                                  //主题内容拼配的名，通过名来获取值当匹配项
          rowSpanKey:'timeCount',                              // 合并单元格的key
          cellKey:'userName' ,                            // cell的key
          tableBodyKey:'arrangementList' ,                           // 获取的数据内容主题列表的key
        };
        defaultParams = Object({},defaultParams,this.config)
        //处理list数据
        let list=[];
        let key = defaultParams.key;
        let headLeftKey = defaultParams.headLeftKey;
        let cellKey =defaultParams.cellKey;
        let rowSpanKey = defaultParams.rowSpanKey;
        let tableBodyKey = defaultParams.tableBodyKey;
        for(let i=0;i<data.length;i++){
          let arrangementList
            if(this.valDataType(data[i],'Array')){
              arrangementList = data[i];
            }else {
              list[i] ={};
              list[i][headLeftKey] = data[i][headLeftKey];
              arrangementList = data[i][tableBodyKey];//提取data里的每一个arrangementList，最终生成一个对象，房间号+'Row'为合并的数值
            }
          for(let k=0;k<arrangementList.length;k++){
            list[i][arrangementList[k][key]]  = arrangementList[k][cellKey];
            list[i][arrangementList[k][key]+'Row']  = arrangementList[k][rowSpanKey];
          }
        }
        return list;
      },
    },
    components:{
      myTable,
    },
    watch:{
      tableList(val){
          if(!val)return;
          this.list = this.conductList(val);
      },
      headerList(val){
        if(!val)return;
        this.headers =this.conductHead(val) ;
      },

    }
  }
</script>
