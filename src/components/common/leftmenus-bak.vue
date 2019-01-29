<template>
<div id="leftwrapperid" ref="leftwrapperid">
    <div v-for="(item,pIdx) in menusData" class="sidebar-nav" :class="{'sidebar-nav-fold':!item.expand}" v-show="item.children.length>0">        
        <div class="sidebar-title" :title="item.name" @click="showAndHide(item)">
            <span class="sidebar-title-icon icon-arrow-down">&nbsp;</span>
            <span class="sidebar-title-text ng-binding">{{item.title}}</span>
            <span type="button" class="sidebar-manage icon-module-set" :alt="item.name"></span>
        </div>
        <ul class="sidebar-trans" v-show="item.expand">
            <li class="nav-item" :class="{active:(index+pIdx)==0}" @click="selectedMenus(index+pIdx)" v-for="(subitem,index) in item.children"><router-link @click="" :to="'/'+router+'/'+subitem.modName+'/'+subitem.children[0].modName">
                <div class="nav-icon sidebar-trans" data-container="body" data-toggle="tooltip" data-placement="right" data-content="住院医规培"><span class="icon-zpyq"></span></div>
                <span class="nav-title ng-binding">{{subitem.title}}</span></router-link></li>
        </ul>
    </div>
    <el-pagination
      :current-page="1"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
</div>
</template>
<script>
import $ from 'jquery';
    export default{
        props: ["leftNavData","dataStructure"],
        data(){
            return{
                selected:0,
                menusData:this.getMenusData()
            }
        },
        computed:{
            router(){
               let route = this.$route;
               let matched = route.matched;
               let currentRoute = matched[0].name;
                   //url = url.substring(0,url.lastIndexOf("index/"));   
                return currentRoute;
            }
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'fetchData'
        },
        methods:{
            fetchData(){
                
            },
            getMenusData(){
                let data = [];
                data = this.leftNavData;
                return data;
            },
            showAndHide(item){          
                item.expand = !item.expand;
            },
            selectedMenus(n){
                let myElt = this.$refs.leftwrapperid;
               $(myElt).find("li").removeClass("active");
               $(myElt).find("li").eq(n).addClass("active");
            }
        }
    }
</script>