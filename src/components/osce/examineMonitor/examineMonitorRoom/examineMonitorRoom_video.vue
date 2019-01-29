<!--
****--@file     examineMonitorRoom_video
****--@date     2017/12/22 15:57
****--@author   YC
****--@describe 监控视频
-->
<template>
    <div class="examineMonitorRoom">
        <el-form :inline="true">
            <el-form-item label="摄像头：">
                <el-select size="small" v-model="selectVideo" placeholder="请选择" @change="changeVideo">
                    <el-option v-for="(item,index) in stationVideoList" :key="index"
                               :label="item.roomNum+'('+item.id+')'"
                               :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <debug-video :videoId="selectVideo" :configData="stationVideoConfigData"
                     :onlyPlayer="onlyPlayerData"></debug-video>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    import debugVideo from '../../../cstc/hardware/video/player/debug.vue'; // 监控摄像头

    //当前组件引入全局的util
    let Util = null;
    export default {
        props: ['roomId', 'onlyPlayer'],
        data() {
            return {
                selectVideo: '', // 选择的摄像头id
                stationVideoConfigData: {id: ''}, // 选择的摄像头配置信息
                stationVideoList: {}, // 当前房间的所有摄像头
                onlyPlayerData: true,
            }
        },
        methods: {
            //初始化请求列表数据
            init() {
                if(this.onlyPlayer != undefined) {
                    this.onlyPlayerData = this.onlyPlayer
                }
                if(this.roomId) {
                    this.getStationVideo();
                }
            },
            // 切换摄像头
            changeVideo(val) {
                this.stationVideoConfigData = this.stationVideoList[val];
            },
            // 获取当前考站内的摄像头
            getStationVideo() {
                let opt = {
                    ajaxSuccess: res => {
                        if(res.data.length) {
                            let videoList = {};
                            if(res.data instanceof Array) {
                                res.data.map(item => videoList[item.id] = item);
                            }
                            this.stationVideoList = videoList;
                            if(res.data instanceof Array) {
                                this.selectVideo = res.data[0].id
                            }
                        }
                    },
                    ajaxParams: {
                        url: 'video/room/camera/list',
                        params: {
                            id: this.roomId
                        }
                    }
                };
                this.ajax(opt)
            },
        },
        created() {
            this.init();
        },
        mounted() {
        },
        watch: {
            roomId(val) {
                this.init()
            }
        },
        components: {
            debugVideo
        }
    }

</script>
<style lang="scss">
    .examineMonitorRoom {
        .debugVideoBox-left {
            width: 100%;
            float: initial;
        }
        .debugVideoBox-right {
            width: 100%;
            height: auto;
            float: initial;
        }
        .debugPlugin {
            height: 350px
        }
        .el-form-item {
            margin-bottom: 10px;
        }
    }
</style>
