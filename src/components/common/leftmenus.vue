<template>
  <div id="leftwrapperid" ref="leftwrapperid">
    <div v-for="(item,pIdx) in menusData" class="sidebar-nav" :class="{'sidebar-nav-fold':!item.expand}" v-show="item.children.length>0">
      <div class="sidebar-title" :title="item.name" @click="showAndHide(item)">
        <span class="sidebar-title-icon icon-arrow-down">&nbsp;</span>
        <span class="sidebar-title-text ng-binding">{{item.name}}</span>
        <span type="button" class="sidebar-manage icon-module-set" :alt="item.name"></span>
      </div>
      <ul class="sidebar-trans" v-if="item.expand&&!item.leaf">
        <li class="nav-item" :class="{active:(subitem.index)==selected}" @click="selectedMenus(subitem.index,parIdx)" v-for="(subitem,index) in item.children">
          <router-link v-if="typeof subitem.children!='undefined'" @click="" :to="'/'+router+'/'+subitem.modName+'/'+subitem.children[0].modName">
          <div class="nav-icon sidebar-trans" data-container="body" data-toggle="tooltip" data-placement="right" :title="subitem.name"><span class="icon-zpyq"></span></div>
          <span class="nav-title ng-binding" v-text="subitem.name"></span>
          </router-link>
          <router-link v-else @click="" :to="'/'+router+'/'+subitem.modName">
            <div class="nav-icon sidebar-trans" data-container="body" data-toggle="tooltip" data-placement="right" :title="subitem.name"><span class="icon-zpyq"></span></div>
            <span class="nav-title ng-binding" v-text="subitem.name"></span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery';
    export default{
        props: ["leftNavData","subIndex","dataStructure"],
        data(){
            return{
                parIdx:0,
                selected:-1,
                onlyOnce:true,
                menusData:[{
                    children:[],
                    name:""
                }],
            }
        },
        computed:{
            router(){
              let getStrIndex = this.getStructureIndex(2);
              let currSubIdx = getStrIndex.currSubIdx;
              let parIdx = getStrIndex.parIdx;

              this.selectedMenus(currSubIdx,parIdx);
              return this.getRouterName(0);
            }
        },
        created(){
          this.init();
        },
        methods:{
            init(){
              if(this.leftNavData.length>1){
                this.leftNavData.splice(0,1);
              }

              this.getMenusData();
              let getStrIndex = this.getStructureIndex(2);
              let parIdx = getStrIndex.parIdx;

                if(this.onlyOnce){
                  this.menusData[parIdx].expand=true;
                }
              this.onlyOnce = false;
            },
            getStructureIndex(n){
              let currentRoute = this.getRouterName(n);
              let currSubIdx = this.dataStructure["structureIndex"][currentRoute].index;
              let parIdx = this.dataStructure["structureIndex"][currentRoute].parIdx;
              if(currentRoute!="workbench"){
                parIdx--;
              }
              return {currSubIdx:currSubIdx,parIdx:parIdx};
            },
            getMenusData(){
                let data = [];
                data = this.leftNavData;
                this.menusData = data;
            },
            showAndHide(item){
              item.expand = !item.expand;
            },
            selectedMenus(currSubIdx,parIdx){
              this.selected = currSubIdx;
              this.parIdx= parIdx;
            },
            getRouterName(n){
              let len = 0;
              let route = this.$route;
              let matched = route.matched
              if(n!=0){
                len = matched.length-n;
              }
              let currentRoute = matched[len].name;

              return currentRoute;
            }
        }
    }
</script>
