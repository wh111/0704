<template>

    <div class="leaveManagement-show">
        <div class="qjxx">
            <el-row>
                <el-col :span="9" :offset="2">
                    <p class="center"><span class="name">姓名</span><span>{{data.applicantName}}</span></p>
                </el-col>

                <el-col :span="9">
                    <p class="center"><span class="name">科室</span><span>{{data.depName}}</span></p>

                </el-col>
            </el-row>
            <el-row>
                <el-col :span="18" :offset="2">
                    <p class="center"><span class="name">请假事由</span><span>{{converterLeaveType(data.leaveType)}}</span>
                    </p>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="18" :offset="2">
                    <p class="center">
                        <span class="name">请假时间</span>
                        <span style="padding-right: 25px"></span>
                        共<span class="border">{{data.timeLength}}</span>天
                    </p>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="18" :offset="2">
                    <div class="center">
                        <span class="shiy-text">事由说明</span>
                        <div class="shiy">{{data.explains}}</div>
                    </div>
                </el-col>
            </el-row>
        </div>

        <div class="shxx">
            <el-row class="step">
                <el-col :span="20" :offset="2">
                    <el-steps :space="350" :active="2">
                        <el-step title="带教老师" description="已审批"></el-step>
                        <el-step title="教学秘书" description="审批中"></el-step>
                        <el-step title="教育处" description="待审批"></el-step>
                    </el-steps>
                </el-col>
            </el-row>

            <el-row class="lose-margin2">
                <el-col :span="18" :offset="2">
                    <el-row>
                        <fieldset class="layui-elem-field">
                            <legend>审核</legend>
                            <div class="layui-field-box">
                                <el-col :span="8">
                                    <p class="center"><span class="name">审核人</span><span>张三</span></p>
                                </el-col>
                                <el-col :span="8">
                                    <p class="center"><span class="name">审核时间</span><span>2017/12/29   12：00</span></p>
                                </el-col>
                                <el-col :span="8">
                                    <p class="center"><span class="name">审核时间</span><span>2017/12/29   12：00</span></p>
                                </el-col>
                            </div>
                        </fieldset>
                    </el-row>
                </el-col>
            </el-row>

            <el-form ref="formValidate" label-width="80px">
                <el-row>
                    <el-col :span="18" :offset="2">
                        <el-form-item label="审核结果" prop="status">
                            <el-radio-group v-model="formValidate.status">
                                <el-radio label="TG">通过</el-radio>
                                <el-radio label="BTG">不通过</el-radio>
                                <el-radio label="BH">驳回修改</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="18" :offset="2">
                        <el-form-item label="审核意见" prop="auditInfo">
                            <el-input type="textarea" v-model="formValidate.auditInfo" :rows="6"
                                      resize="none"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-row>
            <el-col :span="9" :offset="10">
                <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
                <el-button @click="cancel">取消</el-button>
            </el-col>
        </el-row>

    </div>
</template>
<script>
    import api from './api'
    let Util = null;
    export default {
        props: ['operailityData', 'rules'],
        data() {
            return {
                loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
                options: [{
                    value: '0',
                    label: '待审核'
                }, {
                    value: '1',
                    label: '审核通过'
                }, {
                    value: '2',
                    label: '未审核'
                }],
                formValidate: {
                    id: this.operailityData.id,
                    status: '',
                    auditInfo: '',
                },
                "data": [
                    {
                        "explains": "有事",
                        "applicantName": "蒋国华",
                        "applicantId": "2",
                        "depName": "呼吸科",
                        "timeLength": "1",
                        "leaveType": "事假",
                        "createTime": "2016-04-25",
                        "depId": "2",
                        "id": 1,
                        "beginData": "2016-05-01",
                        "endData": "2016-05-03",
                        "fileList": [
                            {
                                "fileName": "文件名称",
                                "id": "1",
                                "fileType": "text"
                            }
                        ],
                        "status": "WSB",
                        auditInfo: '',
                    }
                ],
                //当前组件提交(edit)数据时,ajax处理的 基础信息设置
                auditMessTitle: {
                    type: 'audit',
                    successTitle: '审核成功',
                    errorTitle: '审核失败',
                    ajaxSuccess: 'ajaxSuccess',
                    ajaxParams: {
                        url: '/leave/modify/' + this.operailityData.id,
                        method: 'put',
                    }
                },
                //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
                listMessTitle: {
                    paramsData: 'listUrl',
                    ajaxSuccess: 'SuccessGetCurrData',
                    ajaxParams: {
                        url: 'leave/get/' + this.operailityData.id,
                    }
                },
                //当前组件默认请求(Task)数据时,ajax处理的 基础信息设置(已办理事项）
                taskMessTitle: {
                    ajaxSuccess: 'SuccessGetTask',
                    ajaxParams: {
                        url: 'workflow/gethistoryTask/' + this.operailityData.id,
                    }
                },

            }
        },
        created() {
            //给当前组件注入全局util
            Util = this.$util;
//            let userInfo = this.$store.getters.getUserInfo;
//            let userId = this.userId = userInfo.id;
//            let userType = this.userType = userInfo.studentTypes;
//            this.listMessTitle.ajaxParams.url = api.userRotaryDeptlistTree + userType + '-' + userInfo.id;
        },
        mounted() {
            //初始化
            this.init();
        },
        methods: {
            /*
             * 点击提交按钮 监听是否提交数据
             * @param isLoadingFun boolean  form表单验证是否通过
             * */
            listenSubEvent(isLoadingFun) {
                let isSubmit = this.submitForm("formValidate");
                if(isSubmit) {
                    if(!isLoadingFun) isLoadingFun = function() {
                    };
                    isLoadingFun(true)
                    this.auditMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
                    this.ajax(this.auditMessTitle, isLoadingFun)
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
                    if(valid) {
                        flag = true;
                    }
                });
                return flag;
            },


            /*
             * 默认组件第一次请求数据
             * @param res JSON  数据请求成功后返回的数据
             * */
            SuccessGetCurrData(responseData) {

                this.data = this.getFormData(this.data, responseData.data)
            },


            SuccessGetTask(responseData) {

                this.data.tasks = responseData.data;
            },


            /*
             * 当前组件发送事件给父组件
             * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
             * */
            cancel() {
                this.$emit('cancel', 'audit');
            },
            /*
             * 获取表单数据
             * @return string  格式:id=0&name=aa
             * */
            getFormData(data) {
                let myData = Util._.defaultsDeep({}, data);
                myData.type = data.type.join(",");
                return myData;
            },
            /*
             * 组件初始化入口
             * */
            init() {
                //默认请求加载数据
                this.ajax(this.listMessTitle);
                this.ajax(this.taskMessTitle);
            },

            //转换
            converterLeaveType(leaveType) {
                switch(leaveType) {
                    case 'SHI' :
                        leaveType = '事假';
                        break;
                    case 'BING' :
                        leaveType = '病假';
                        break;
                    case 'SANG' :
                        leaveType = '丧假';
                        break;
                    case 'CHAN' :
                        leaveType = '产假';
                        break;
                    case 'TAN' :
                        leaveType = '探亲假';
                        break;
                    case 'HUN' :
                        leaveType = '婚假';
                        break;
                    case 'OTHER' :
                        leaveType = '其他';
                        break;

                }
                return leaveType
            },
            //转换请假条状态
            converterStatus(status) {
                switch(status) {
                    case 'WSB' :
                        status = '未上报';
                        break;
                    case 'DSH' :
                        status = '审核中(待审)';
                        break;
                    case 'TG' :
                        status = '通过';
                        break;
                    case 'BTG' :
                        status = '不通过';
                        break;
                    case 'BH' :
                        status = '驳回修改';
                        break;
                }
                return status
            },

            /*
             * 获取表单数据
             * @return string  格式:id=0&name=aa
             * */
            getFormData(data, data1) {
                let arr = Array.prototype.slice.call(arguments).reverse();
                arr.unshift({})
                let myData = Util._.defaultsDeep.apply(null, arr);
                return myData;
            },
        }

    }
</script>
