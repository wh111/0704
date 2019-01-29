<template>
    <div class="viewFramework-main-body viewFramework-main-navbar-full">
            <div class="viewFramework-main-navbar">
                <div class="main-nav-stage">
                    <div class="main-nav-scene main-nav-main-scene">
                        <div id="nav-title" class="main-nav-title ng-binding">住院医规培</div>
                        <div  class="ng-isolate-scope"></div>
                        <div class="main-nav-list">
                            <ul>
                                <li class="active">
                                    <div  class="ng-isolate-scope">
                                        <router-link to="/index/zyy/subMod1">
                                            <div class="nav-icon"></div>
                                            <div ng-bind="item.title" class="nav-title ng-binding">住陪要求</div>
                                        </router-link>
                                    </div>
                                </li>
                                <li>
                                    <div  class="ng-isolate-scope">
                                        <router-link to="/index/zyy/subMod2">

                                                <div class="nav-icon">
                                                    <span class="icon-arrow-right"></span>
                                                </div>
                                                <div ng-bind="item.title" class="nav-title ng-binding">培训手册记录</div>

                                        </router-link>
                                    </div>
                                    <ul class="ng-scope ng-hide">
                                        <li>
                                            <div class="ng-isolate-scope"><a href="http://www.163.com" target="showMainIframe" class="ng-scope">
                                                <div class="nav-icon"></div>
                                                <div class="nav-title">权限设置</div>
                                            </a></div>
                                        </li>
                                        <li>
                                            <div class="ng-isolate-scope"><a href="#/" class="ng-scope">
                                                <div class="nav-icon"></div>
                                                <div class="nav-title">账户设置</div>
                                            </a></div>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="viewFramework-main-navbar-collapse">
                <span class="icon-collapse-left"></span>
            </div>
            <div class="viewFramework-main-content" id="zyyMain">
                <router-view></router-view>
            </div>
        </div>
</template>