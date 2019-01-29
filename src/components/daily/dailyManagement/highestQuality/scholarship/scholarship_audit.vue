<template>
    <div>
        <show :operailityData="operailityData"></show>
        <el-form ref="formValidate" :model="formValidate" label-width="100px">
            <el-row>
                <el-col :span="21" :offset="1">
                    <el-form-item label="审核结果:" prop="status" class="feildFontweight">
                        <el-radio-group v-model="formValidate.status">
                            <el-radio label="BTG">不通过</el-radio>
                            <el-radio label="TG">通过</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="21" :offset="1">
                    <el-form-item label="发放金额:" prop="number" class="feildFontweight">
                        <el-input type="number" @change="setBonusAmount" min="0"
                                  v-model.number="formValidate.bonusAmount"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="21" :offset="1">
                    <el-form-item label="审批意见:" prop="opinion" class="feildFontweight">
                        <el-input type="textarea" v-model="formValidate.opinion" :rows="8" resize="none"></el-input>
                    </el-form-item>
                </el-col>

            </el-row>
        </el-form>
        <el-row>
            <el-col align="center">
                <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
                <el-button @click="cancel">取消</el-button>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    //当前组件引入全局的util
    import show from './scholarship_view.vue';

    let Util = null;
    export default {
        //props接收父组件传递过来的数据
        props: ['operailityData'],
        data() {
            return {
                //保存按钮基本信息
                loadBtn: {
                    title: '提交',
                    callParEvent: 'listenSubEvent'
                },
                //form表单bind数据
                formValidate: {
                    status: 'BTG', //状态
                    opinion: '', //审批意见
                    bonusAmount: '' //获奖金额
                },
                //获取的数据
                tableData: [],
                //当前组件提交(edit)数据时,ajax处理的 基础信息设置
                auditMessTitle: {
                    type: 'audit',
                    successTitle: '审核成功',
                    errorTitle: '审核失败',
                    ajaxSuccess: 'ajaxSuccess',
                    ajaxParams: {
                        url: 'bursary/modifyStatus/approval/' + this.operailityData.id,
                        method: 'put',
                    }
                },
                //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
                listMessTitle: {
                    paramsData: 'listUrl',
                    ajaxSuccess: 'SuccessGetCurrData',
                    ajaxParams: {
                        url: 'bursary/get/' + this.operailityData.id,
                    }
                }
            }
        },
        created() {
            //给当前组件注入全局util
            Util = this.$util;
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
            setBonusAmount() {
                var m = this.formValidate.bonusAmount.toString();
                this.formValidate.bonusAmount = parseInt(m.replace(/\./g, ""))
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
                this.formValidate = this.getFormValidate(this.formValidate, responseData.data);
                this.data = responseData.data
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
                return myData;
            },
            /*
             * 组件初始化入口
             * */
            init() {
                //默认请求加载数据
//        this.ajax(this.listMessTitle);
            },
        },
        components: {
            show
        }
    }

</script>

