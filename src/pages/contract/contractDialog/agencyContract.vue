<template>
    <div class="container">
        <div class="box" :style="{ height: clientHei }">
        <div class="msg">
            <div class="title">合同信息</div>
            <div class="content">
                <div class="one_">
                    <p>
                        <span>合同编号：</span>
                        <span class="color-blue">{{defaultInfo.code}}</span>
                    </p>
                    <p>
                        <span>合同类型：</span>
                        <span v-if="defaultInfo.contType.value===2&&!defaultInfo.loanType">买卖</span>
                        <span v-if="defaultInfo.contType.value===2&&defaultInfo.loanType">{{defaultInfo.loanType===7?"全款买卖":"贷款买卖"}}</span>
                        <span v-if="defaultInfo.contType.value===3">代办</span>
                    </p>
                </div>
                <div class="one_ input-val">
                    <p>
                        <span><i>*</i>签约时间：</span>
                        <el-date-picker
                        style="width:180px"
                        size="small"
                        v-model="signDate"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                        :picker-options="pickerOptions"
                        default-time="12:00:00"
                        :disabled="defaultInfo.contractEntrust&&defaultInfo.contractEntrust.id?true:false">
                        </el-date-picker>
                    </p>
                    <p>
                        <span><i>*</i>交易服务费(元)：</span>
                        <el-input placeholder="请输入" size="small" class="w140" v-model="tradeFee" @input="cutNumber('tradeFee')" :disabled="entrustBtn"></el-input>  
                    </p>
                    <p>
                        <span><i>*</i>交易服务费佣金(元)：</span>
                        <el-input placeholder="请输入" size="small" class="w140" v-model="tradeFeeCommission" @input="cutNumber('tradeFeeCommission')" :disabled="entrustBtn"></el-input>  
                    </p>
                </div>
            </div>
        </div>
        <div class="msg">
            <div class="title">房源信息</div>
            <div class="content">
                <div class="one_">
                    <p>
                        <span>房源编号：</span>
                        <span class="color-blue">{{defaultInfo.houseinfoCode}}</span>
                    </p>
                    <div class="text-long" style="width: 600px;">
                        <span class="w-70">物业地址：</span>
                        <span>{{defaultInfo.propertyAddr}}</span>
                    </div>
                </div>
                <div class="one_" v-if="defaultInfo.recordVersion==2">
                    <div class="text-long">
                        <span class="w-70">产权地址：</span>
                        <span>{{defaultInfo.propertyRightAddr}}</span>
                    </div>
                </div>
                <div class="one_">
                    <p>
                        <span>建筑面积：</span>
                        <span>{{defaultInfo.houseInfo.Square}} m²</span>
                    </p>
                    <p>
                        <span>套内面积：</span>
                        <span>{{defaultInfo.houseInfo.SquareUse}} m²</span>
                    </p>
                </div>
                <div v-for="(item,i) in houseArr" :key="i" class="one_">
                    <p class="text-long">
                        <span :class="[i==0?'':'w-84']">{{i==0?'业主':'共有人'}}姓名：</span>
                        <span>{{item.name}}</span>
                    </p>
                    <p>
                        <span>{{i==0?'业主':'共有人'}}电话：</span>
                        <span>{{item.mobile}}</span>
                    </p>
                    <p v-if="defaultInfo.recordVersion==2">
                        <span>{{getCardLabel(item.cardType)}}：</span>
                        <span>{{item.encryptionCode}}</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="msg">
            <div class="title">客源信息</div>
            <div class="content">
                <div class="one_">
                    <p>
                        <span>客源编号：</span>
                        <span class="color-blue">{{defaultInfo.guestinfoCode?defaultInfo.guestinfoCode:'--'}}</span>
                    </p>
                </div>
                <div v-for="(item,i) in guestArr" :key="i" class="one_">
                    <p class="text-long">
                        <span :class="[i==0?'':'w-84']">{{i==0?'客户':'共有人'}}姓名：</span>
                        <span>{{item.name}}</span>
                    </p>
                    <p>
                        <span>{{i==0?'客户':'共有人'}}电话：</span>
                        <span>{{item.mobile}}</span>
                    </p>
                    <p v-if="defaultInfo.recordVersion==2">
                        <span>{{getCardLabel(item.cardType)}}：</span>
                        <span>{{item.encryptionCode}}</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="msg">
            <div class="title">备注栏</div>
            <div class="content remark-box">
                <el-input type="textarea" placeholder="请输入备注内容" :rows="3" v-model.trim="entrustRemark" maxlength="200" resize="none" :disabled="entrustBtn"></el-input>
                <span>{{entrustRemark.length}}/200</span>
            </div>
        </div>
        </div>
        <div class="btn" v-if="!entrustBtn">
            <el-button type="primary" round @click="isSave" v-loading.fullscreen.lock="fullscreenLoading">{{defaultInfo.recordType.value==2?'保存':'保存并进入下一步'}}</el-button>
        </div>
        <!-- 单公司提示框 -->
        <el-dialog title="提示" :visible.sync="singleCompany" width="460px" :closeOnClickModal="$tool.closeOnClickModal" :showClose="false">
            <div class="single-company">{{singleCompanyName}}未设置公章，请联系管理员设置！</div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="toH5">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        defaultInfo: {
            type: Object,
            default: function() {
                return {}
            }
        }
    },
    data() {
        return {
            clientHei: "",
            signDate: "",
            tradeFee: "",
            tradeFeeCommission: "",
            entrustRemark: "",
            houseArr: [], //业主信息
            guestArr: [], //客户信息
            //日期选择器禁止选择未来时间
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            fullscreenLoading: false,
            singleCompany: false,
            singleCompanyName: "",
            entrustBtn: false
        }
    },
    created() {
        this.clientHei= document.documentElement.clientHeight -190 + 'px'
        // 判断有无录过委托合同
        let _date = this.defaultInfo.contractEntrust ? this.defaultInfo.contractEntrust.signDate : ''
        if(_date){
            this.signDate = _date
        }else{
            this.getTimeNow()
        }
        let bool = this.defaultInfo.contractEntrust&&this.defaultInfo.contractEntrust.id
        this.tradeFee = bool ? this.defaultInfo.contractEntrust.tradeFee : ''
        let _tradeFeeCommission = this.defaultInfo.contractEntrust.tradeFeeCommission
        this.tradeFeeCommission = bool&&_tradeFeeCommission ? _tradeFeeCommission : ''
        let _entrustRemark = this.defaultInfo.contractEntrust.entrustRemark
        this.entrustRemark = bool&&_entrustRemark ? _entrustRemark : ''
        // 判断委托合同状态是否为已签约
        this.entrustBtn = this.defaultInfo.contractEntrust&&this.defaultInfo.contractEntrust.entrustState===3
        this.houseArr = this.defaultInfo.contPersons.filter(item => item.personType.value === 1)
        this.guestArr = this.defaultInfo.contPersons.filter(item => item.personType.value === 2)
    },
    methods: {
        getCardLabel(val) {
            if(val==1){
                return '身份证'
            }else if(val==2){
                return '护照'
            }else if(val==3){
                return '营业执照'
            }else{
                return '军官证'
            }
        },
        //获取当前日期
        getTimeNow() {
            let time = new Date()
            let y = time.getFullYear()
            let M = time.getMonth() + 1
            let D = time.getDate()
            let h = time.getHours()
            let m = time.getMinutes()
            let s = time.getSeconds()
            let _time = `${y}-${M > 9 ? M : '0' + M}-${D > 9 ? D : '0' + D} ${h > 9 ? h : '0' + h}:${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`;
            this.signDate = _time
        },
        cutNumber(val) {
            this.$nextTick(()=>{
                this[val] = this.$tool.cutFloat({val:this[val],max:999999999.99})
            })
        },
        isSave() {
            if(!this.signDate){
                this.$message("签约时间不能为空")
                return
            }
            if(this.tradeFee == ''){
                this.$message("交易服务费不能为空")
                return
            }
            if(this.tradeFeeCommission == ''){
                this.$message("交易服务费佣金不能为空")
                return
            }
            if(this.defaultInfo.recordType.value == 2) {
                // 线下合同直接保存
                this.saveCon(2)
            } else {
                // 线上合同保存前先验证是否有委托合同模板
               this.$ajax.get('/api/contract/checkContTemplate',{
                    type: 6, //委托合同类型
                    recordType: 1 //线上合同
                }).then(res => {
                    if(res.data.status === 200) {
                        this.saveCon()
                    }
                }).catch(error => {
                    this.$message({
                        message: error,
                        type: "error"
                    })
                })
            }
        },
        saveCon(type=1) {
            this.fullscreenLoading = true
            this.$ajax.post('/api/contract/entrust/addContract', {
                signDate: this.signDate,
                tradeFee: this.tradeFee,
                tradeFeeCommission: this.tradeFeeCommission,
                entrustRemark: this.entrustRemark,
                id: this.defaultInfo.id,
                code: this.defaultInfo.code
            }).then(res => {
                res = res.data
                if(res.status === 200){
                    this.fullscreenLoading = false
                    if(type == 1) { //线上
                        let contractMsg = res.data
                        sessionStorage.setItem("contractMsg", JSON.stringify(contractMsg))
                        if(contractMsg.singleCompany){
                            this.singleCompany = true
                            this.singleCompanyName = contractMsg.singleCompany
                        }else{
                            this.$router.push({
                                path: "/extendParams"
                            })
                        }
                    } else { //线下
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        })
                        this.$emit('goToMainData')
                    }
                }
            }).catch(error => {
                this.fullscreenLoading = false
                this.$message({
                    message: error,
                    type: "error"
                })
            })
        },
        //跳转H5页面
        toH5() {
            this.singleCompany = false
            this.$router.push({
                path: "/extendParams"
            })
        },
    }
}
</script>

<style lang="less" scoped>
    @import "~@/assets/common.less";
    .box {
        overflow-y: auto;
    }
    .msg {
        display: flex;
        padding: 20px 0 20px 0;
        .title {
            width: 70px;
            font-weight: bold;
            color: @color-blank;
            white-space: nowrap;
        }
        .content {
            padding-left: 10px;
            .one_ {
                display: flex;
                margin-bottom: 20px;
                &:last-of-type {
                    margin-bottom: 0;
                }
                > p {
                    width: 300px;
                    padding-right: 20px;
                }
                .text-long {
                    display: flex;
                    .w-84 {
                        min-width: 84px;
                    }
                    .w-70 {
                        min-width: 70px;
                    }
                }
                &.input-val {
                    display: flex;
                    align-items: center;
                }
                i {
                    color: red;
                }
            }
            &.remark-box {
                width: 900px;
                position: relative;
                span {
                    position: absolute;
                    right: 15px;
                    bottom: 5px;
                }
            }
        }
        .color-blue {
            color: #478DE3;
            font-weight: bold;
        }
        &:nth-child(-n+3) {
            border-bottom: 1px solid @border-ED;
        }
    }
    .single-company{
        padding: 20px 0 10px 10px;
    }
    .btn {
        text-align: right;
        padding-right: 10px;
    }
</style>