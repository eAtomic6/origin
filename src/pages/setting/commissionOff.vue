<template>
    <div ref="tableComView">
        <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
            <div class="content">
                <div>
                    <label>体系</label>
                    <el-select size="small" v-model="searchForm.systemTag">
                        <el-option v-for="item in systemTagSelect" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </div>
                <div>
                    <label>设置时间</label>
                    <el-date-picker
                    size="small"
                    v-model="settingTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
                <div>
                    <label>最新修改时间</label>
                    <el-date-picker
                    size="small"
                    v-model="updateTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
            </div>
        </ScreeningTop>
        <!-- table表格 -->
        <div class="table-box">
            <p v-if="power['sign-set-bg-sxf-add'].state">
                <span><i class="iconfont icon-tubiao-11 mr-8"></i>数据列表</span>
                <el-button icon="el-icon-plus" @click="openFn(1)" round type="primary">新增手续费</el-button>
            </p>
            <el-table
            :data="list"
            style="width: 100%"
            border
            ref="tableCom"
            :max-height="tableNumberCom">
                <el-table-column label="体系" prop="systemTag">
                    <template slot-scope="scope">
                        <span v-for="item in systemTagSelect" :key="item.key" v-if="item.key===scope.row.systemTag">{{item.value}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="收佣手续费" width="450">
                    <template slot-scope="scope">
                        <span :class="i!=scope.row.commissionFee.length-1?'mr-10':''" v-for="(item,i) in scope.row.commissionFee" :key="i">{{addSignFn(item.payType.label,item,i)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="设置时间" prop="settingTime">
                    <template slot-scope="scope">{{scope.row.settingTime|formatTime}}</template>
                </el-table-column>
                <el-table-column label="最新修改时间" prop="updateTime">
                    <template slot-scope="scope">{{scope.row.updateTime|formatTime}}</template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="openFn(2,scope.row)" v-if="power['sign-set-bg-sxf-add'].state">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 新增 编辑 弹窗 -->
        <el-dialog
        :title="com_title+'手续费'"
        :closeOnClickModal="$tool.closeOnClickModal"
        :close-on-press-escape="$tool.closeOnClickModal"
        :visible.sync="addVisible"
        width="900px"
        >
        <div class="com-box">
            <div class="com-select">
                <div class="mark-red">
                    <label>体系：</label>
                    <el-select size="small" class="w240" v-model="commissionForm.systemTag" :disabled="this.com_title=='编辑'">
                        <el-option v-for="item in systemTagSelect" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </div>
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
                                <th>封顶手续费（元/笔）</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>储蓄卡</td>
                                <td><input type="text" v-model="commissionForm.cash" class="no-style input-tac" placeholder="请输入" @input="cutNumber(1,'cash')"></td>
                                <td><input type="text" v-model="commissionForm.amount" class="no-style input-tac" placeholder="请输入" @input="cutNumber(2,'amount')"></td>
                            </tr>
                            <tr>
                                <td>信用卡</td>
                                <td><input type="text" v-model="commissionForm.credit" class="no-style input-tac" placeholder="请输入" @input="cutNumber(1,'credit')"></td>
                                <td>/</td>
                            </tr>
                            <tr>
                                <td>微信</td>
                                <td><input type="text" v-model="commissionForm.wechat" class="no-style input-tac" placeholder="请输入" @input="cutNumber(1,'wechat')"></td>
                                <td>/</td>
                            </tr>
                            <tr>
                                <td>支付宝</td>
                                <td><input type="text" v-model="commissionForm.aliPay" class="no-style input-tac" placeholder="请输入" @input="cutNumber(1,'aliPay')"></td>
                                <td>/</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="color-red tip-msg"> 注：设置新的手续费率成功后，新创建的合同以新设置的手续费率为准。</div>
        </div>
        <div class="btn">
            <el-button @click="addVisible=false" round>取 消</el-button>
            <el-button type="primary" @click="saveFn" round>保 存</el-button>
        </div>
        </el-dialog>
        <!-- 确认保存弹窗 -->
        <el-dialog title="确认保存" :closeOnClickModal="$tool.closeOnClickModal" :close-on-press-escape="$tool.closeOnClickModal" width="500px" :visible.sync="saveDialog">
            <div class="save-txt">
                <p style="margin-bottom:10px;">确认保存新的手续费设置？</p>
                <p class="color-red">新创建的合同以新设置的手续费率为准</p>
                <p>当前收佣手续费率 储蓄卡{{commissionForm.cash}}% 信用卡{{commissionForm.credit}}% 微信{{commissionForm.wechat}}% 支付宝{{commissionForm.aliPay}}%</p>
                <p>当前收佣封顶手续费 储蓄卡{{commissionForm.amount}}元/笔</p>
            </div>
            <div class="save-btn">
                <el-button @click="saveDialog=false" round>取 消</el-button>
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
        amount: {
            name: '收佣储蓄卡封顶手续费'
        },
        credit: {
            name: '收佣信用卡手续费率'
        },
        wechat: {
            name: '收佣微信手续费率'
        },
        aliPay: {
            name: '收佣支付宝手续费率'
        }
    }
    export default {
        name: "commissionOff",
        mixins: [MIXINS, FILTER],
        data() {
            return {
                searchForm: {
                    systemTag: ''
                },
                settingTime: [],
                updateTime: [],
                list: [], //列表
                power: {
                    'sign-set-bg-sxf-add': {
                        name: '新增/编辑',
                        state: false
                    }
                },
                addVisible: false, //新增编辑弹窗
                saveDialog: false, //确认保存弹窗
                // 新增编辑 表单
                commissionForm: {
                    systemTag: '',
                    cash: '',
                    amount: '',
                    credit: '',
                    wechat: '',
                    aliPay: ''
                },
                rowId: 0,
                com_title: ''
            }
        },
        created() {
            //获取体系
            this.getSystemTagSelect()
            let res = this.getDataList
            if(res&&(res.route === this.$route.path)){
                let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
                let query = session.query
                this.searchForm.systemTag = query.systemTag
                this.list = res.data
                this.settingTime = query.settingTimeStart ? [query.settingTimeStart,query.settingTimeEnd] : []
                this.updateTime = query.updateTimeStart ? [query.updateTimeStart,query.updateTimeEnd] : []
            } else {
                // 列表
                this.getData()
            }
        },
        methods: {
            addSignFn(m,n,i) {
                return (n.maxLimit||n.maxLimit===0)&&i===0 ? `${m}${n.fee}%-封顶手续费${n.maxLimit}元/笔` : `${m}${n.fee}%`
            },
            // 列表
            getData(type='init') {
                let bool1 = this.settingTime!=null&&this.settingTime.length
                let bool2 = this.updateTime!=null&&this.updateTime.length
                let param = {
                    cityId: this.userInfo.cityId,
                    systemTag: this.searchForm.systemTag,
                    settingTimeStart: bool1 ? this.settingTime[0] : '',
                    settingTimeEnd: bool1 ? this.settingTime[1] : '',
                    updateTimeStart: bool2 ? this.updateTime[0] : '',
                    updateTimeEnd: bool2 ? this.updateTime[1] : '',
                    tradeType: 1 //线下
                }

                //点击查询时，缓存筛选条件
                if(type==='search'){
                    sessionStorage.setItem('sessionQuery',JSON.stringify({
                        path:'/commissionOff',
                        url:'/offlinefeesetting/operateQry',
                        query:param
                    }))
                }

                this.$ajax.get('/api/offlinefeesetting/operateQry',
                    param
                ).then(res => {
                    res = res.data
                    if(res.status === 200) {
                        this.list = res.data
                    }
                }).catch(err=>{
                    this.$message({message:err})
                })
            },
            openFn(type,row) {
                this.addVisible = true
                if(type == 1) {
                    this.com_title = "新增"
                    this.$tool.clearForm(this.commissionForm)
                }else{
                    this.com_title = "编辑"
                    this.rowId = row.id
                    let limit = row.commissionFee[0].maxLimit
                    this.commissionForm = {
                        systemTag: row.systemTag,
                        cash: row.commissionFee[0].fee + '',
                        amount: limit||limit===0 ? limit + '' : '',
                        credit: row.commissionFee[1].fee + '',
                        wechat: row.commissionFee[2].fee + '',
                        aliPay: row.commissionFee[3].fee + ''
                    }
                }
            },
            cutNumber(type,item) {
                this.$nextTick(() =>{
                    this.commissionForm[item]=this.$tool.cutFloat({val:this.commissionForm[item],max:type===1?1:100})
                })
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
                let arr = [
                    {
                        payType: 0,
                        fee: this.commissionForm.cash,
                        maxLimit: this.commissionForm.amount
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
                let param = {
                    cityId: this.userInfo.cityId,
                    systemTag: this.commissionForm.systemTag,
                    commissionFee: arr,
                    tradeType: 1 //线下
                }

                let url
                if(this.com_title==='新增'){
                    url = '/api/offlinefeesetting/operateInsert'
                }else{
                    url = '/api/offlinefeesetting/operateUpdate'
                    param.id = this.rowId
                }
                this.$ajax.postJSON(url,
                    param
                ).then(res => {
                    res = res.data
                    if(res.status === 200) {
                        this.$message(res.message)
                        this.saveDialog = false
                        this.addVisible = false
                        this.getData()
                    }
                }).catch(error => {
                    this.$message({message:error})
                })
            },
            // 查询
            queryFn() {
                this.getData('search')
            },
            // 重置
            resetFormFn() {
                this.searchForm.systemTag = ''
                this.settingTime = []
                this.updateTime = []
            }
        },
        computed: {
            userInfo() {
                return this.getUser.user
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "~@/assets/common.less";
    .content {
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 10px;
        >div {
            margin-right: 20px;
            margin-bottom: 18px;
            >label {
                margin-right: 5px;
            }
        }
    }
    .table-box {
        background-color: #fff;
        padding: 0 10px;
        margin-top: 20px;
        > p {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: @size-14;
            .mr-8 {
                margin-right: 8px;
            }
            > .el-button {
                width:120px;
                padding: 9px 15px;
                display: flex;
                justify-content: center;
                color: #fff;
            }
        }
        .mr-10 {
            margin-right: 10px;
        }
    }
    /deep/ .el-table th {
        background: @bg-th;
    }
    .com-box {
        font-size: @size-14;
        padding: 10px 20px 0 20px;
        overflow-y: auto;
        .com-select {
            display: flex;
            &-city {
                margin-right: 50px;
            }
        }
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
            margin-bottom: 10px;
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
                    line-height: 30px;
                    height: 30px;
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
        }
    }
    .color-red {
        color: @color-red;
    }
    .btn {
        padding: 10px 20px 10px 0;
        text-align: right;
        border-top: 1px solid #EDECF0;
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
