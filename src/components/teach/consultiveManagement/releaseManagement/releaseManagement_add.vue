<template>

    <div>
        <el-form ref="formValidate" :model="formValidate" :rules="releaseManagement" class="demo-form-inline"
                 label-width="90px">
            <el-row>
                <el-col :span="17" :offset="2">
                    <el-form-item label="标题:" prop="title" class="feildFontweight">
                        <el-input v-model="formValidate.title" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="8" :offset="2">
                    <el-form-item label="发布人:" class="feildFontweight" prop="publisher">
                        <el-input v-model="formValidate.publisher" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8" :offset="1">
                    <el-form-item label="是否需要回执:" prop="isReceipt" label-width="110px" class="feildFontweight">
                        <el-radio-group v-model="formValidate.isReceipt">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="17" :offset="2">
                    <el-form-item label="浏览权限:" class="feildFontweight">
                        <!--<el-select  v-model="formValidate.notice_user_type"   placeholder="请选择">-->
                        <!--<select-option :type="'role'"></select-option>-->
                        <!--</el-select>-->

                        <el-radio-group v-model="formValidate.noticeUserType">
                            <el-row>
                                <el-col :span="24">
                                    <div class="grid-content-ptop">
                                        <el-radio label="PARTROLE">角色　</el-radio>
                                        <el-select v-show="formValidate.noticeUserType=='PARTROLE'" style="width: 500px"
                                                   v-model="userType.role" multiple placeholder="请选择">
                                            <select-option :unAll="true" :type="'role'"></select-option>
                                        </el-select>
                                    </div>
                                </el-col>
                            </el-row>

                            <el-row>
                                <el-col :span="24">
                                    <div class="grid-content-ptop">
                                        <el-radio label="PARTUSER">人员　</el-radio>
                                        <div style="display: inline-block" v-show="formValidate.noticeUserType=='PARTUSER'">
                                            <el-tag
                                                    v-for="(tag,index) in userType.partUser"
                                                    :key="index"
                                                    style="margin:0 5px"
                                                    type="success"
                                            >{{tag.label}}
                                            </el-tag>
                                            <el-button style="margin: 0 10px" @click="selectUsers">选择人员</el-button>

                                        </div>

                                    </div>
                                </el-col>
                            </el-row>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="17" :offset="2">
                    <el-row class="lose-margin2">
                        <el-col :span="20" :offset="2">
                            <viewUEditor style="width:600px;" :name="'ud1'" @storeUE="storeUE" @getUeditorVal="getUeditorVal"
                                         :ueditor-val="ueditorVal" :ueditor-config="ueditorConfig"></viewUEditor>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="17" :offset="2">
                    <el-form-item label="附件:" class="feildFontweight">
                        <upload-file @setUploadFiles="setFiles"></upload-file>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-row>
            <el-col :span="24" style="text-align: center">
                <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
                <el-button @click="cancel">取消</el-button>
            </el-col>
        </el-row>

        <!--选择人员-->
        <Modal
                close-on-click-modal="false"
                width="890"
                v-model="userModal"
                title="新建教学活动"
                class-name="vertical-center-modal">
            <modal-header slot="header" :content="userId"></modal-header>
            <select-user v-if="userModal" @cancel="userModal=false" @setUsers="selectUserCallBack"
                         :initUser="userType.partUser"></select-user>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
    let Util = null;
    import {releaseManagement} from '../rules'
    import viewUEditor from '../../../common/showUeditor.vue';

    export default {
        props: ['operailityData', 'url'],
        data() {
            return {
                releaseManagement,
                UE: {},
                ueditorVal: {
                    ud1: "",
                },  //
                ueditorConfig: {
                    //详细配置参考UEditor 官网api
                    initialFrameHeight: 220,  //初始化编辑器高度,默认320
                },

                //保存按钮基本信息
                loadBtn: {title: '确定', callParEvent: 'listenSubEvent'},
                countDate: 0,
                //form表单bind数据
                formValidate: {
                    title: '',     //标题
                    publisher: '',     //发布人
                    isReceipt: 0,     //是否需要回执
                    roleId: '',     //浏览人角色Id
                    content: '',
                    fileIds: '',
                    noticeUserType: 'PARTROLE',
                    noticeUserTypeValue: '',
                },
                userType: {
                    role: [],
                    partUser: [],
                    groupOrCaptain: [],
                },
                userModal: false,
                columnModal: false,
                userId: {
                    id: 'userId',
                    title: '选择人员'
                },
                //当前组件提交(add)数据时,ajax处理的 基础信息设置
                addMessTitle: {
                    type: 'add',
                    successTitle: '添加成功!',
                    errorTitle: '添加失败!',
                    ajaxSuccess: 'ajaxSuccess',
                    ajaxError: 'ajaxError',
                    ajaxParams: {
                        jsonString: true,
                        url: this.url.noticeAdd,
                        method: 'post'
                    }
                },
            }
        },
        created() {
            //给当前组件注入全局util
            Util = this.$util;
        },
        mounted() {
            //暂时没有初始化,预留初始化入口
            //this.init();
        },
        methods: {
            /*
            * 点击提交按钮 监听是否提交数据
            * @param isLoadingFun boolean  form表单验证是否通过
            * */
            listenSubEvent(isLoadingFun) {
                let isSubmit = this.submitForm("formValidate");
                if (isSubmit) {
                    if (!isLoadingFun) isLoadingFun = function () {
                    };

                    this.formValidate.content = this.ueditorVal.ud1;
                    let formValidate = this.getFormData(this.formValidate);
                    //处理数据
                    let noticeUserTypeValue = [];
                    if (this.formValidate.noticeUserType === 'PARTROLE') {//部分角色
                        let role = this.userType.role;
                        if (!role.length) {
                            this.errorMess('角色必选');
                            return
                        }
                        role.map(item => {
                            noticeUserTypeValue.push(item);
                        })
                    } else if (this.formValidate.noticeUserType === 'PARTUSER') {//部分人员
                        let partUser = this.userType.partUser;
                        if (!partUser.length) {
                            this.errorMess('人员必选');
                            return
                        }
                        partUser.map(item => {
                            noticeUserTypeValue.push(item.key);
                        })
                    } else if (this.formValidate.noticeUserType === 'GROUPORCAPTAIN') {//组长或队长
                        let groupOrCaptain = this.userType.groupOrCaptain;
                        if (!groupOrCaptain.length) {
                            this.errorMess('组长或队长必选');
                            return
                        }
                        groupOrCaptain.map(item => {
                            noticeUserTypeValue.push(item);
                        })
                    }
                    //在id前后都加逗号
                    noticeUserTypeValue.unshift(null);
                    noticeUserTypeValue.push(null);
                    formValidate.noticeUserTypeValue = noticeUserTypeValue.join(',');
                    this.addMessTitle.ajaxParams.data = formValidate
                    isLoadingFun(true);
                    this.addMessTitle.ajaxParams.data.isReceipt = this.addMessTitle.ajaxParams.data.isReceipt + '';
                    this.ajax(this.addMessTitle, isLoadingFun)
                }
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
            /*
             * 默认组件第一次请求数据
             * @param res JSON  数据请求成功后返回的数据
             * 注:当前为添加页面暂时未用到,属于预留
             * */
            oneDataSuccess(res) {
                /*let responseData = res.data;
                if(this.$util._.isObject(responseData["status"])&&responseData["status"]["code"]==0) {
                  let type = [];
                  let data = responseData.data;
                  type.push(data.type+"");
                  this.formValidate = data;
                  this.formValidate.type = type;
                }*/
            },
            /*
             * 当前组件发送事件给父组件
             * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
             * */
            cancel() {
                this.$emit('cancel', this.addMessTitle.type);
            },
            /*
             * 获取表单数据
             * @return string  格式:id=0&name=aa
             * */
            getFormData(data) {
                let myData = Util._.defaultsDeep({}, data);
                return myData;
            },
            /*
             * 组件初始化入口
             * */
            init() {
                //this.ajax(this.listMessTitle)
            },

            columnCallback() {

            },
            subCancel() {
                this.columnModal = false;
            },


//附件
            setFiles(ids) {
                this.formValidate.fileIds = ids;
            },

            //点击选择人员
            selectUsers() {
                this.userModal = true;
            },

            //选择人
            selectUserCallBack(list) {
                this.userType.partUser = list;
                this.userModal = false;
            },

            /**
             *
             * 存储编辑器的UE.editor对象
             * @param name {string}  编辑器的name
             *
             * @param editor {}      编辑器的对象
             *
             */
            storeUE(name, editor) {
                this.UE[name] = editor;
            },

            setMyVal(name, v) {
                this.UE[name].setContent(v);
            },
            /**
             *
             * 存储编辑器的value值
             * @param name {string}  编辑器的name
             *
             * @param val  {string}  编辑器的内容
             *
             */
            getUeditorVal(name, val) {
                this.ueditorVal[name] = val;
            },

        },
        components: {
            viewUEditor
        }
    }
</script>
