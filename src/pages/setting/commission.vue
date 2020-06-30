<template>
    <div ref="tableComView">
        <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
            <div class="content">
                <div>
                    <label>城市选择</label>
                    <el-select size="small" v-model="searchForm.cityId" @change="getTixi($event,1)">
                        <el-option v-for="item in cityList" :key="item.cityId" :label="item.name" :value="item.cityId"></el-option>
                    </el-select>
                </div>
                <div>
                    <label>体系</label>
                    <el-select size="small" v-model="searchForm.systemTag" @change="selectTixi">
                        <el-option v-for="item in systemArr1" v-if="item.isDel==0" :key="item.key" :label="item.value" :value="item.key"></el-option>
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
            <p>
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
                        <span v-for="item in systemArr1" :key="item.key" v-if="item.key===scope.row.systemTag">{{item.value}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="收佣手续费" width="350">
                    <template slot-scope="scope">
                        <span :class="i!=scope.row.commissionFee.length-1?'mr-10':''" v-for="(item,i) in scope.row.commissionFee" :key="i">{{addSignFn(item.payType.label,item.fee)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="分账/付款手续费" width="350">
                    <template slot-scope="scope">
                        <span :class="i!=scope.row.sepaFee.length-1?'mr-10':''" v-for="(item,i) in scope.row.sepaFee" :key="i">{{addTextFn(item.accountType.label,item.feeMoney)}}</span>
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
                        <el-button type="text" @click="openFn(2,scope.row)">编辑</el-button>
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
                <div class="mark-red com-select-city">
                    <label>城市：</label>
                    <el-select size="small" class="w240" v-model="commissionForm.cityId" @change="getTixi($event,2)" :disabled="this.com_title=='编辑'">
                        <el-option v-for="item in cityList" :key="item.cityId" :label="item.name" :value="item.cityId"></el-option>
                    </el-select>
                </div>
                <div class="mark-red">
                    <label>体系：</label>
                    <el-select size="small" class="w240" v-model="commissionForm.systemTag" :disabled="this.com_title=='编辑'">
                        <el-option v-for="item in systemArr2" v-if="item.isDel==0" :key="item.key" :label="item.value" :value="item.key"></el-option>
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
            <el-button @click="addVisible=false" round>取 消</el-button>
            <el-button type="primary" @click="saveFn" round>保 存</el-button>
        </div>
        </el-dialog>
        <!-- 确认保存弹窗 -->
        <el-dialog title="确认保存" :closeOnClickModal="$tool.closeOnClickModal" :close-on-press-escape="$tool.closeOnClickModal" width="500px" :visible.sync="saveDialog">
            <div class="save-txt">
                <p style="margin-bottom:10px;">确认保存新的手续费设置？</p>
                <p class="color-red">新的手续费率会覆盖原来的手续费率</p>
                <p>当前收佣手续费率 储蓄卡{{commissionForm.cash}}% 信用卡{{commissionForm.credit}}% 微信{{commissionForm.wechat}}% 支付宝{{commissionForm.aliPay}}%</p>
                <p>当前分账/付款手续费 对公{{commissionForm.public}}元/笔 对私{{commissionForm.private}}元/笔</p>
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
        cityId: {
            name: '城市'
        },
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
        name: "commission",
        mixins: [MIXINS, FILTER],
        data() {
            return {
                searchForm: {
                    cityId: '',
                    systemTag: ''
                },
                settingTime: [],
                updateTime: [],
                list: [], //列表
                power: {
                    'sign-set-sxf': {
                        name: '查询',
                        state: false
                    }
                },
                cityList: [],
                systemArr1: [], //筛选体系
                systemArr2: [], //新增编辑体系
                addVisible: false, //新增编辑弹窗
                saveDialog: false, //确认保存弹窗
                // 新增编辑 表单
                commissionForm: {
                    systemTag: '',
                    cash: '',
                    credit: '',
                    wechat: '',
                    aliPay: '',
                    public: '',
                    private: '',
                    cityId: ''
                },
                rowId: 0,
                com_title: ''
            }
        },
        created() {
            // 获取城市
            this.getCity()
            let res = this.getDataList
            if(res&&(res.route === this.$route.path)){
                let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
                let query = session.query
                this.searchForm.cityId = query.cityId
                this.searchForm.systemTag = query.systemTag
                this.list = res.data
                this.settingTime = query.settingTimeStart ? [query.settingTimeStart,query.settingTimeEnd] : []
                this.updateTime = query.updateTimeStart ? [query.updateTimeStart,query.updateTimeEnd] : []
            }
        },
        methods: {
            getCity() {
                this.$ajax.get('/api/organize/cities').then(res => {
                    res = res.data
                    if(res.status === 200) {
                        this.cityList = res.data
                    }
                })
            },
            // 超级管理员获取体系
            getTixi(e,type) {
                if(type===1) {
                    this.searchForm.systemTag = ""
                    this.list = []
                }
                this.$ajax.get('/api/organize/getSystemTag',{cityId: e}).then(res => {
                    res = res.data
                    if(res.status === 200){
                        type==1 ? this.systemArr1 = res.data : this.systemArr2 = res.data
                    }
                })
            },
            // 超级管理员列表
            selectTixi() {
                this.getData()
            },
            addSignFn(n,i) {
                return `${n}${i}%`
            },
            addTextFn(n,i) {
                return `${n}${i}元/笔`
            },
            // 列表
            getData(type='init') {
                let bool1 = this.settingTime!=null&&this.settingTime.length
                let bool2 = this.updateTime!=null&&this.updateTime.length
                let param = {
                    cityId: this.searchForm.cityId,
                    systemTag: this.searchForm.systemTag,
                    settingTimeStart: bool1 ? this.settingTime[0] : '',
                    settingTimeEnd: bool1 ? this.settingTime[1] : '',
                    updateTimeStart: bool2 ? this.updateTime[0] : '',
                    updateTimeEnd: bool2 ? this.updateTime[1] : '',
                    tradeType: 0 //线上
                }

                //点击查询时，缓存筛选条件
                if(type==='search'){
                    sessionStorage.setItem('sessionQuery',JSON.stringify({
                        path:'/commission',
                        url:'/feesetting/operateQry',
                        query:param
                    }))
                }

                this.$ajax.get('/api/feesetting/operateQry',
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
                    this.systemArr2 = []
                }else{
                    this.com_title = "编辑"
                    this.rowId = row.id
                    this.getTixi(row.cityId,2)
                    this.commissionForm = {
                        cityId: row.cityId,
                        systemTag: row.systemTag,
                        cash: row.commissionFee[0].fee + '',
                        credit: row.commissionFee[1].fee + '',
                        wechat: row.commissionFee[2].fee + '',
                        aliPay: row.commissionFee[3].fee + '',
                        public: row.sepaFee[0].feeMoney + '',
                        private: row.sepaFee[1].feeMoney + ''
                    }
                }
            },
            cutNumber(type,item) {
                this.$nextTick(() =>{
                    this.commissionForm[item]=this.$tool.cutFloat({val:this.commissionForm[item],max:type===1?1:100})
                })
                let regex=/^\./g
                regex.test(this.commissionForm[item])&&(this.commissionForm[item]='')
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
                    cityId: this.commissionForm.cityId,
                    systemTag: this.commissionForm.systemTag,
                    commissionFee: arr1,
                    sepaFee: arr2,
                    tradeType: 0 //线上
                }

                let url
                if(this.com_title==='新增'){
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
                        this.addVisible = false
                        if(!this.searchForm.cityId) return
                        this.getData()
                    }
                }).catch(error => {
                    this.$message({message:error})
                })
            },
            // 查询
            queryFn() {
                if(this.searchForm.cityId&&this.searchForm.systemTag) this.getData('search')
            },
            // 重置
            resetFormFn() {
                this.searchForm.systemTag = ''
                this.settingTime = []
                this.updateTime = []
                this.searchForm.cityId = ''
                this.list = []
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
