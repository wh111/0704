<template>

  <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
    <div style="display: none" ref="hideColumn"><slot> </slot></div>
    <table style="width:100%">
      <colgroup>
      <col name="el-table_1_column_1" width="150">
      <col name="el-table_1_column_1" width="150">
    </colgroup>
      <thead>
        <tr v-html="theadHtml">

        </tr>
      </thead>

    <tbody>
    <!--<customTbody >-->

    <!--</customTbody>-->
    <!--<customTbody >-->
      <tr v-html="tbody">
        <!--<slot :name="key"  v-for="(value,key) in item" :row="item">-->
          <!--&lt;!&ndash;<td>11</td>&ndash;&gt;-->
        <!--</slot>-->
      </tr>

    <!--</customTbody>-->
    </tbody>
    </table>
  </div>




</template>

<script type="text/javascript">
  import customCell from './customCell.vue'
  import customTbody from './customTbody.vue'
  export default {
  props:['tableData'],

  data(){
      return{
          tdBody:[],
          thHead:[],
        rowLen:1,
        theadHtml:null,
        tbody:null,
        rowObj:null,
      }
  },


    components:{
      customTbody
    },
    created(){
      this.$nextTick(function(){
        let ref=this.$refs.hideColumn;
        this.theadHtml = ref.innerHTML;
        this.rowObj = ref;
        this.getTbody(this.tableData,ref)

      })
    },
    methods:{
      createColumn(data,type){
        this.rowLen = data[0].length;

      },
      getTbody(data,obj){
        let templateArr = [];
        let childNode = obj.childNodes;

        for (var i = 1; i < childNode.length; i++) {
          console.log(childNode[i].nodeName);
          if(childNode[i].nodeName == '#text' && !/\S/.test(childNode[i].nodeValue)){//文本节点并且是空的文本节点时，将空文本节点删除
            obj.removeChild(childNode[i]);
          }
        }
        for(var i=0,item;i<data.length;i++){
          item=data[i];
//          if(childNode[i].nodeType == '1'){
//            templateArr.push("<td>"+item.name+"</td>");
//          }else{
            templateArr.push("<td>"+childNode[i].innerHTML+"</td>");
//          }

        }
        this.tbody = templateArr.join("");
        //return templateArr.join("");
      }

    },
    computed:{
      getColumn(){
        /*let rowChildren=this.rowObj.children;
        let tempArr = [];
        for(var i=0,item;i<rowChildren.length;i++){
          item = rowChildren[i].innerHTML;
          tempArr.push("<td>"+item+"</td>");
        }
        tempArr = tempArr.join("")*/
        //return this.rowObj.innerHTML;
      }
    },
    mounted(){

      console.log('1',this);
    }


  }



</script>
