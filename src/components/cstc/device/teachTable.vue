
<template>
  <my-table  :height="height" v-if="headers[0]"   border :columns="headers" :data="list"></my-table>
</template>
<script>
  import myTable from '../../../components/common/myTable.vue';
  export default {
    props:['height','tableList','width'],
        data () {
        let headers = [];
        let list = [];
        if(this.tableList){
          headers = this.conductHead(this.tableList);
          list = this.conductList(this.tableList.stationRoomList);
        }
        return {
          headers:headers,
          list: list,
        }
    },
    mounted(){
      if(typeof this.config == 'object'){
        this.defaultParams = Object(this.defaultParams,this.config)
      }
    },
    methods: {

      conductHead(data){
        let headerList = [];
        headerList['0'] = [];
        let val = ['站点名称','房间号',data.statrTime.split(' ')[1]+'-'+data.endTime.split(' ')[1]];
        let keys = ['stationName','roomNum','teacherNames'];
        for(let i=0;i<val.length;i++){
          headerList[0].push({
            title : val[i],
            key:keys[i],
            width:this.width||200
          })
        }
        return headerList;
      },

      //data需要处理的源数据
      conductList(data){
        //处理list数据
        let list=[];
        let oldVal = '' ;
        let index =0;
        for(let i=0;i<data.length;i++){
          let row = 1;
          let stationName='';
            //如果考站名称相同，则合并单元格
            if(data[i].stationName == oldVal){
              list[index].stationNameRow = list[index].stationNameRow+1;

            }else {
              oldVal = data[i].stationName;
              index = i;
              stationName = data[i].stationName;
            }

          list.push({
            stationName :stationName,
            stationNameRow :row,    //想要使哪个合并，则再哪个key值后面添加Row
            "roomNum":data[i].roomNum,
            "teacherNames":data[i].teacherNames
          })

        }
        return list

      },
    },
    components:{
      myTable,
    },
    watch:{
      tableList(val){
          if(!val)return;
          this.headers = this.conductHead(val);
          this.list = this.conductList(val.stationRoomList);
      },

    }
  }
</script>
