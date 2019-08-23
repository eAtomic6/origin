<template>
    <div>
        <div class="com-box" :style="{ height: clientHeight() }">
        <div class="mark-red">
            <label>体系：</label>
            <el-select size="small" class="w400" v-model="commissionForm.systemTag" :disabled=systemNoEdit>
                <el-option v-for="item in systemTagList" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
        </div>
        <div>
            <p class="mark-blue">
                <span class="size-16">收佣手续费</span>
                <span class="color-red">收取手续费金额（元）= 实际收佣金额（元）* 手续费率（%）</span>
            </p>
            <div class="mark-red">手续费率：</div>
            <div class="table-box">
                <table class="table">
                    <thead>
                        <tr>
                            <th>支付方式</th>
                            <th>手续费率（%）</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>储蓄卡</td>
                            <td><input type="text" v-model="commissionForm.cash" class="no-style input-tac" placeholder="请输入" @input="cutNumber(1,'cash')"></td>
                        </tr>
                        <tr>
                            <td>信用卡</td>
                            <td><input type="text" v-model="commissionForm.credit" class="no-style input-tac" placeholder="请输入" @input="cutNumber(1,'credit')"></td>
                        </tr>
                        <tr>
                            <td>微信</td>
                            <td><input type="text" v-model="commissionForm.wechat" class="no-style input-tac" placeholder="请输入" @input="cutNumber(1,'wechat')"></td>
                        </tr>
                        <tr>
                            <td>支付宝</td>
                            <td><input type="text" v-model="commissionForm.aliPay" class="no-style input-tac" placeholder="请输入" @input="cutNumber(1,'aliPay')"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div>
            <p class="mark-blue">
                <span class="size-16">分账/付款手续费</span>
                <span class="color-red">分账/付款手续费分对公和对私账户，按每笔来计算</span>
            </p>
            <div>
                <div class="mark-red">手续费金额：</div>
                <div class="table-box">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>账户类型</th>
                                <th>手续费金额（元/笔）</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>对公账户</td>
                                <td><input type="text" v-model="commissionForm.public" class="no-style input-tac" placeholder="请输入" @input="cutNumber(2,'public')"></td>
                            </tr>
                            <tr>
                                <td>对私账户</td>
                                <td><input type="text" v-model="commissionForm.private" class="no-style input-tac" placeholder="请输入" @input="cutNumber(2,'private')"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>  
            </div>
        </div>
        <div class="color-red tip-msg"> 注：设置新的手续费值成功后，原来的手续费值被替换。</div>
        </div>
        <div class="btn">
            <el-button plain @click="cancelFn" round>取 消</el-button>
            <el-button type="primary" @click="saveFn" round>保 存</el-button>
        </div>
        <!-- 确认保存弹窗 -->
        <el-dialog title="确认保存" :closeOnClickModal="$tool.closeOnClickModal" :close-on-press-escape="$tool.closeOnClickModal" width="500px" :visible.sync="saveDialog">
            <div class="save-txt">
                <p style="margin-bottom:10px;">确认保存新的手续费设置？</p>
                <p class="color-red">新的手续费率会覆盖原来的手续费率</p>
                <p>当前收佣手续费率 储蓄卡{{commissionForm.cash}}% 信用卡{{commissionForm.credit}}% 微信{{commissionForm.wechat}}% 支付宝{{commissionForm.aliPay}}%</p>
                <p>当前分账/付款手续费 对公{{commissionForm.public}}元/笔 对私{{commissionForm.private}}元/笔</p>
            </div>
            <div class="save-btn">
                <el-button plain @click="saveDialog=false" round>取 消</el-button>
                <el-button type="primary" @click="sureFn" round>确 认</el-button>
            </div>
        </el-dialog>
    </div>    
</template>

<script>
    import {FILTER} from "@/assets/js/filter";
    import {MIXINS} from "@/assets/js/mixins";
    const RULE = {
        systemTag: {
            name: '体系'
        },
        cash: {
            name: '收佣储蓄卡手续费率'
        },
        credit: {
            name: '收佣信用卡手续费率'
        },
        wechat: {
            name: '收佣微信手续费率'
        },
        aliPay: {
            name: '收佣支付宝手续费率'
        },
        public: {
            name: '分账/付款对公账户手续费金额'
        },
        private: {
            name: '分账/付款对私账户手续费金额'
        }
    }
    export default {
        name: "commissionDialog",
        mixins: [FILTER,MIXINS],
        data() {
            return {
                clientHei: document.documentElement.clientHeight, //窗体高度
                saveDialog: false,
                commissionForm: {
                    systemTag: '',
                    cash: '',
                    credit: '',
                    wechat: '',
                    aliPay: '',
                    public: '',
                    private: ''
                },
                rowId: 0,
                systemNoEdit: false,
                systemTagList: []
            }
        },
        created(){
            let type = this.$route.query.type
            // 获取体系
            this.getSystemTag()
            if(type==1) {
                this.$tool.clearForm(this.commissionForm)
            }else if(type==2){
                this.systemNoEdit = true
                let rowInfo = JSON.parse(localStorage.getItem('row'))
                this.rowId = rowInfo.id
                this.commissionForm = {
                    systemTag: rowInfo.systemTag,
                    cash: rowInfo.commissionFee[0].fee,
                    credit: rowInfo.commissionFee[1].fee,
                    wechat: rowInfo.commissionFee[2].fee,
                    aliPay: rowInfo.commissionFee[3].fee,
                    public: rowInfo.sepaFee[0].feeMoney,
                    private: rowInfo.sepaFee[1].feeMoney
                }
            }
        },
        mounted(){
            var _this = this
            window.onresize = function(){
                _this.clientHei = document.documentElement.clientHeight
            }
        },
        methods: {
            cutNumber(type,item) {
                this.$nextTick(() =>{
                    this.commissionForm[item]=this.$tool.cutFloat({val:this.commissionForm[item],max:type===1?1:100})
                })
            },
            cancelFn() {
                this.$router.go(-1)
            },
            saveFn() {
                this.$tool.checkForm(
                    this.commissionForm,
                    RULE
                ).then(() => {
                    this.saveDialog = true
                }).catch(error => {
                    this.$message({message:`${error.title}${error.msg}`})
                })
            },
            sureFn() {
                let arr1 = [
                    {
                        payType: 0,
                        fee: this.commissionForm.cash
                    },
                    {
                        payType: 1,
                        fee: this.commissionForm.credit
                    },
                    {
                        payType: 2,
                        fee: this.commissionForm.wechat
                    },
                    {
                        payType: 3,
                        fee: this.commissionForm.aliPay
                    }
                ]
                let arr2 = [
                    {
                        accountType: 0,
                        feeMoney: this.commissionForm.public
                    },
                    {
                        accountType: 1,
                        feeMoney: this.commissionForm.private
                    }
                ]
                let param = {
                    cityId: this.userInfo.cityId,
                    systemTag: this.commissionForm.systemTag,
                    commissionFee: arr1,
                    sepaFee: arr2
                }

                let type = this.$route.query.type
                let url
                if(type===1){
                    url = '/api/feesetting/operateInsert'
                }else{
                    url = '/api/feesetting/operateUpdate'
                    param.id = this.rowId
                }
                this.$ajax.postJSON(url,
                    param
                ).then(res => {
                    res = res.data
                    if(res.status === 200) {
                        this.$message(res.message)
                        this.saveDialog = false
                        this.$router.push('/commission')
                    }
                }).catch(error => {
                    this.$message({message:error})
                })
            },
            // 控制弹框body内容高度，超过显示滚动条
            clientHeight() {        
                return this.clientHei - 200 + 'px'
            },
        },
        computed: {
            userInfo(){
                return this.getUser.user
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "~@/assets/common.less";
    .com-box {
        font-size: @size-14;
        padding: 20px 40px 20px 20px;
        overflow-y: auto;
        .size-16 {
            font-size: @size-16;
        }
        .mark-red::before {
            content: '*';
            position: relative;
            color: @color-red;
            top: 3px;
            margin-right: 1px;
        }
        .mark-blue {
            position: relative;
            padding-left: 8px;
            margin-bottom: 5px;
            &::before {
                content: '';
                position: absolute;
                width: 2px;
                height: 12px;
                left: 0;
                top: 5px;
                background-color: @color-blue;
            }
        }
        .input-tac {
            text-align: center;
        }
        >div:nth-child(-n+3) {
            margin-bottom: 20px;
        }
        .table-box {
            margin-top: 5px;
            .table {
                width: 100%;
                border-collapse:collapse;
                border-spacing:1;
                border-top: 1px solid #EBEEF5;
                border-left: 1px solid #EBEEF5;
                text-align: center;
                tr:hover td{
                    background: @border-F5;
                }
                tr th,tr td{
                    border-right: 1px solid #EBEEF5;
                    border-bottom: 1px solid #EBEEF5;
                    line-height: 36px;
                    height: 36px;
                }
                tr th{
                    background-color: @bg-th;
                    color: #909399;
                }
                tr td{
                    color: #606266;
                    &:last-child{
                        padding: 0 10px;
                    }
                }
            }
        }
        .tip-msg {
            padding: 10px 0;
            border-bottom: 1px solid #EDECF0;
        }
    }
    .color-red {
        color: @color-red;
    }
    .btn {
        padding-right: 50px;
        text-align: right;
    }
    .el-button {
        min-width:80px;
    }
    /deep/ .el-dialog__body{
        padding: 0;
    }
    .save-txt {
        padding: 40px 0;
        text-align: center;
        border-bottom: 1px solid #EDECF0;
    }
    .save-btn {
        padding: 10px;
        text-align: right;
    }
</style>
