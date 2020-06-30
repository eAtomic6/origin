<template>
    <div class="view-container"
        ref="tableComView">
        <ScreeningTop @propQueryFn="queryFn"
            @propResetFormFn="resetFormFn">
            <el-form :inline="true"
                :model="contractForm"
                class="prop-form"
                size="small">
                <el-form-item label="关键字">
                    <el-tooltip class="item"
                        effect="dark"
                        content="物业地址/业主/客户/手机号/合同编号/房源编号/客源编号/审核人姓名"
                        placement="top">
                        <el-input v-model="keyword"
                            style="width:150px"
                            placeholder="请输入"
                            :clearable="true"></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="签约日期">
                    <el-date-picker v-model="signDate"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']"
                        format="yyyy-MM-dd"
                        value-format="yyyy/MM/dd"
                        style="width:330px">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="合同类型">
                    <el-select v-model="contractForm.contTypes"
                        multiple
                        placeholder="全部"
                        style="width:200px"
                        :class="{'width300':contractForm.contTypes&&contractForm.contTypes.length>3}">
                        <el-option v-for="item in dictionary['10']"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="合同状态">
                    <el-select v-model="contractForm.contState"
                        placeholder="全部"
                        :clearable="true"
                        style="width:150px">
                        <el-option v-for="item in dictionary['9']"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key"
                            v-if="item.key!==0&&item.key!==-1">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门">
                    <select-tree :data="DepList"
                        :init="contractForm.depName"
                        @checkCell="depHandleClick"
                        @clear="clearDep"
                        @search="searchDep"></select-tree>
                </el-form-item>
                <el-form-item>
                    <el-select style="width:100px"
                        :clearable="true"
                        v-loadmore="moreEmploye"
                        class="margin-left"
                        size="small"
                        v-model="contractForm.dealAgentId"
                        @change="handleEmpNodeClick"
                        placeholder="请选择">
                        <el-option v-for="item in EmployeList"
                            :key="item.empId"
                            :label="item.name"
                            :value="item.empId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核状态">
                    <el-select v-model="contractForm.toExamineState"
                        placeholder="全部"
                        :clearable="true"
                        style="width:150px">
                        <el-option v-for="item in dictionary['51']"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key"
                            v-if="item.key!==-1">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="变更/解约">
                    <el-select v-model="contractForm.contChangeState"
                        placeholder="全部"
                        :clearable="true"
                        style="width:150px">
                        <el-option v-for="item in dictionary['6']"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="合作方式">
                    <el-select v-model="contractForm.dealAgentStoreAttr"
                        placeholder="全部"
                        :clearable="true"
                        style="width:150px">
                        <el-option v-for="item in dictionary['53']"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="签约方式">
                    <el-select v-model="contractForm.recordType"
                        placeholder="全部"
                        :clearable="true"
                        style="width:150px">
                        <el-option v-for="item in dictionary['76']"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </ScreeningTop>
        <!-- 合同列表 -->
        <div class="contract-list">
            <div class="listTitle">
                <p><span class="title"><i class="iconfont icon-tubiao-11"></i>数据列表</span></p>
                <div class="float-right">
                    <el-button class="btn-info"
                        v-if="power['sign-ht-htsh-export'].state"
                        round
                        type="primary"
                        size="small"
                        @click="getExcel">导出</el-button>
                </div>
            </div>
            <el-table ref="tableCom"
                class="info-scrollbar"
                :span-method="objectSpanMethod"
                :data="combineList"
                border
                style="width: 100%"
                @row-dblclick='toDetail'
                :max-height="tableNumberCom">
                <el-table-column label="合同信息"
                    label-class-name="pdl"
                    min-width="200"
                    fixed>
                    <template slot-scope="scope">
                        <div class="contract_msg">
                            <div class="riskLabel">
                                <!-- 风险单 -->
                                <el-popover placement="top-start"
                                    width="50"
                                    trigger="hover"
                                    content="风险单"
                                    v-if="scope.row.isRisk">
                                    <i slot="reference"
                                        class="iconfont icon-tubiao_shiyong-1 risk"></i>
                                </el-popover>
                            </div>
                            <ul class="contract-msglist">
                                <li>合同：<span @click="toDetail(scope.row)">{{scope.row.code}}</span></li>
                                <li v-if="scope.row.houseinfoCode">房源：<span>{{scope.row.houseinfoCode}}</span> {{scope.row.showOwnerName}}</li>
                                <li>客源：<span>{{scope.row.guestinfoCode}}</span> {{scope.row.showCustName}}</li>
                            </ul>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="合同类型"
                    min-width="70"
                    fixed>
                    <template slot-scope="scope">
                        <span v-if="scope.row.loanType">{{scope.row.loanType===7?"全款买卖":"贷款买卖"}}</span>
                        <span v-else>{{scope.row.isCombine?"委托合同":scope.row.contType.label}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="物业地址"
                    prop="propertyAddr"
                    min-width="160"
                    fixed>
                    <template slot-scope="scope">
                        <span v-if="!scope.row.propertyAddr">-</span>
                        <template>
                            <p>{{scope.row.propertyAddr.split(' ')[0]}}</p>
                            <p>{{scope.row.propertyAddr.split(' ')[1]}}</p>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="成交总价"
                    prop="dealPrice"
                    min-width="90"
                    fixed>
                    <template slot-scope="scope">
                        <div v-if="!scope.row.isCombine">
                            <span>{{scope.row.dealPrice}} 元</span>
                            <span v-for="item in dictionary['507']"
                                :key="item.key"
                                v-if="item.key===scope.row.timeUnit&&scope.row.contType.value===1"> / {{item.value}}</span>
                        </div>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column label="成交经纪人"
                    min-width="120">
                    <template slot-scope="scope">
                        <p>{{scope.row.dealAgentStoreName}}</p>
                        <p>{{scope.row.dealAgentName}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="签约时间"
                    min-width="110">
                    <template slot-scope="scope">
                        <!-- {{Number(scope.row.signDate)|timeFormat_}} -->
                        <span v-if="scope.row.isCombine">{{scope.row.signDate.substr(0, 16)}}</span>
                        <span v-else>{{Number(scope.row.signDate)|timeFormat_}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="签约方式"
                    min-width="110">
                    <template slot-scope="scope">
                        {{scope.row.recordType.label}}
                    </template>
                </el-table-column>
                <el-table-column label="可分配业绩 (元)"
                    min-width="110">
                    <template slot-scope="scope">
                        <span v-if="scope.row.contType.value<4">{{scope.row.distributableAchievement}}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column label="合同状态"
                    min-width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.contState.value>0">{{scope.row.contState.label}}</span>
                        <el-popover trigger="hover"
                            placement="top"
                            v-else>
                            <div style="width:160px">
                                {{scope.row.delReason}}
                            </div>
                            <div slot="reference"
                                class="name-wrapper isFlex">
                                {{scope.row.contState.label}}
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="审核状态"
                    prop="toExamineState.label"
                    min-width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.toExamineState.value===-1"
                            class="blue">{{scope.row.toExamineState.label}}</span>
                        <span v-if="scope.row.toExamineState.value===0"
                            class="yellow">{{scope.row.toExamineState.label}}</span>
                        <span v-if="scope.row.toExamineState.value===1"
                            class="green">{{scope.row.toExamineState.label}}</span>
                        <span v-if="scope.row.toExamineState.value===2"
                            class="red">{{scope.row.toExamineState.label}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="审核时间"
                    min-width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.auditTime&&scope.row.auditTime!='-'">{{Number(scope.row.auditTime)|timeFormat_}}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column label="上传合同主体时间"
                    min-width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.uploadTime">{{Number(scope.row.uploadTime)|timeFormat_}}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column label="当前审核人"
                    min-width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.auditId>0&&scope.row.toExamineState.value===0">
                            <p>{{scope.row.auditStoreName}}</p>
                            <p>{{scope.row.auditName}}</p>
                            <!-- v-if="userMsg&&scope.row.auditId===userMsg.empId" -->
                        </span>
                        <p v-else>-</p>
                        <el-button type="text"
                            v-if="getUserMsg&&(scope.row.auditId===getUserMsg.empId||scope.row.preAuditId===getUserMsg.empId)&&scope.row.toExamineState.value===0"
                            @click="choseCheckPerson(scope.row,scope.row.preAuditId===getUserMsg.empId?1:2)">{{getUserMsg&&getUserMsg.empId===scope.row.auditId?'转交审核人':'设置审核人'}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="下一步审核人"
                    min-width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.nextAuditId>0">
                            <p>{{scope.row.nextAuditStoreName}}</p>
                            <p>{{scope.row.nextAuditName}}</p>
                        </span>
                        <p v-else>-</p>
                        <el-button type="text"
                            v-if="getUserMsg&&(scope.row.nextAuditId!==0&&scope.row.auditId===getUserMsg.empId&&scope.row.toExamineState.value===0)"
                            @click="choseCheckPerson(scope.row,3)"
                            :class="{'error_':scope.row.nextAuditId===0}">设置审核人</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="变更/解约"
                    min-width="80">
                    <template slot-scope="scope">
                        <div v-if="!scope.row.isCombine">
                            <span v-if="scope.row.contChangeState.label==='未变更/解约'">-</span>
                            <el-button type="text"
                                size="medium"
                                v-else
                                @click="goChangeCancel(scope.row)">{{scope.row.contChangeState.label}}</el-button>
                        </div>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作"
                    min-width="100"
                    fixed="right">
                    <template slot-scope="scope">
                        <div class="btn"
                            v-if="power['sign-ht-info-view'].state"
                            @click="goPreview(scope.row)">预览</div>
                        <div style="color:red"
                            v-if="scope.row.toExamineState.value===0&&scope.row.auditId>0&&getUserMsg&&scope.row.auditId!==getUserMsg.empId">{{scope.row.auditName}}正在审核</div>
                        <div class="btn"
                            v-if="scope.row.toExamineState.value===0&&( ((!(scope.row.auditId>0))&&getUserMsg&&scope.row.grabDept==='true') || (((scope.row.contType.value===1||scope.row.contType.value===4||scope.row.contType.value===5)&&getUserMsg&&scope.row.auditId===getUserMsg.empId) || ((scope.row.contType.value===2||scope.row.contType.value===3)&&((scope.row.auditId===getUserMsg.empId))) ) )"
                            @click="goCheck(scope.row)">审核</div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 固定滚动条 -->
            <div class="pagination"
                v-if="tableData.length>0">
                <el-pagination class="pagination-info"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    layout="total, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>

        </div>
        <!-- 变更/解约查看 合同主体上传弹窗 -->
        <changeCancel :dialogType="dialogType"
            :dialogContType="dialogContType"
            :cancelDialog="changeCancel"
            operationType="look"
            :dialogOperation="dialogOperation"
            :contId="contId"
            @close="ChangeCancelDialog"
            v-if="changeCancel"></changeCancel>
        <!-- 设置/转交审核人 -->
        <checkPerson :show="checkPerson.state"
            page="list"
            :type="checkPerson.type"
            :showLabel="checkPerson.label"
            :bizCode="checkPerson.code"
            :flowType="checkPerson.flowType"
            @close="closeCheckPerson"
            @submit="closeCheckPerson"
            v-if="checkPerson.state"></checkPerson>
    </div>
</template>

<script>
import ScreeningTop from "@/components/ScreeningTop";
import changeCancel from "../contractDialog/changeCancel";
import { TOOL } from "@/assets/js/common";
import { MIXINS } from "@/assets/js/mixins";
import checkPerson from "@/components/checkPerson";
let printParam = {};
let rows = {};

export default {
    mixins: [MIXINS],
    components: {
        ScreeningTop,
        changeCancel,
        checkPerson
    },
    data() {
        return {
            tableBox: null,
            contractForm: {
                dealAgentId: "",
                recordType: ""
            },
            keyword: "",
            signDate: [],
            tableData: [],
            total: 0,
            currentPage: 1,
            pageSize: 10,
            contractCode: "",
            changeCancel: false,
            dialogContType: 1, //变更解约弹窗是否是意向定金合同
            dialogOperation: "details",
            dictionary: {
                //数据字典
                "10": "", //合同类型
                "9": "", //合同状态
                "51": "", //审核状态
                "6": "", //变更/解约
                "14": "", //结算状态
                "13": "", //收佣状态
                "53": "", //合作方式
                "54": "", //业绩状态
                "76": "", //线上, 无纸化
                "538": "", //用途
                "507": "" //租赁时间单位
            },
            //部门选择列表
            options: [],
            //经纪人列表
            brokersList: [],
            //合同id
            contId: "",
            //合同状态
            contState: 99,
            settleId: "",
            dialogType: "",
            isSubmitAudit: false,
            checkPerson: {
                state: false,
                type: 1,
                code: "",
                flowType: 3,
                label: false,
                current: false
            },
            //权限配置
            power: {
                "sign-ht-info-view": {
                    state: false,
                    name: "预览"
                },
                "sign-com-htdetail": {
                    state: false,
                    name: "合同详情"
                },
                "sign-ht-htsh-export": {
                    state: false,
                    name: "导出"
                }
            }
        };
    },
    created() {
        //判断是否为u+跳转 u+跳转列表展示审核中数据
        if (this.$route.query.source && this.$route.query.source === "uplus") {
            // this.contractForm.toExamineState=0
            this.$set(this.contractForm, "toExamineState", 0);
        }
        this.getDictionary(); //字典
        this.remoteMethod(); //部门
        // this.getAdmin();//获取当前登录人信息
        let res = this.getDataList;
        if (res && res.route === this.$route.path) {
            this.tableData = res.data.list;
            this.total = res.data.count;
            let session = JSON.parse(sessionStorage.getItem("sessionQuery"));
            this.contractForm = Object.assign(
                {},
                this.contractForm,
                session.query,
                {
                    contTypes:
                        session.query.contTypes.length > 0
                            ? session.query.contTypes.split(",")
                            : ""
                }
            );
            if (this.contractForm.contTypes) {
                this.contractForm.contTypes = this.contractForm.contTypes.map(
                    item => {
                        return Number(item);
                    }
                );
            }
            // this.contractForm.dealAgentStoreId=''
            // this.contractForm.dealAgentId=''
            delete this.contractForm.keyword;
            delete this.contractForm.pageNum;
            delete this.contractForm.beginDate;
            delete this.contractForm.endDate;
            this.keyword = session.query.keyword;
            this.currentPage = session.query.pageNum;
            if (session.query.beginDate) {
                this.signDate[0] = session.query.beginDate;
                this.signDate[1] = session.query.endDate;
            }
            if (this.contractForm.dealAgentId) {
                this.dep = Object.assign({}, this.dep, {
                    id: this.contractForm.dealAgentStoreId,
                    empId: this.contractForm.dealAgentId,
                    empName: this.contractForm.empName
                });
                this.EmployeList.unshift({
                    empId: this.contractForm.dealAgentId,
                    name: this.contractForm.empName
                });
                this.getEmploye(this.contractForm.dealAgentStoreId);
            }
        } else {
            this.getContractList(); //合同列表
        }
    },
    methods: {
        //委托合同合并单元格
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                if (
                    row.contractEntrust &&
                    row.contractEntrust.id &&
                    !row.isCombine
                ) {
                    rows = {
                        index: rowIndex,
                        id: row.contractEntrust.id
                    };
                    return {
                        rowspan: 2,
                        colspan: 1
                    };
                } else {
                    if(row.contractEntrust){
                         if (
                             rowIndex === rows.index + 1 &&
                             rows.id === row.contractEntrust.id
                         ) {
                             return {
                                 rowspan: 0,
                                 colspan: 0
                             };
                         } else {
                             return {
                                 rowspan: 1,
                                 colspan: 1
                             };
                     }
                    }
              
                }
            } else {
                return {
                    rowspan: 1,
                    colspan: 1
                };
            }
        },
        getExcel: function() {
            this.excelCreate("/input/contractAuditExcel", printParam);
        },
        //获取合同列表
        getContractList(type = "init") {
            let param = {
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                keyword: this.keyword,
                isCheckList: 1
            };
            param = Object.assign({}, param, this.contractForm);
            if (this.signDate) {
                if (this.signDate.length > 0) {
                    param.beginDate = this.signDate[0];
                    param.endDate = this.signDate[1];
                }
            }
            if (
                this.contractForm.contTypes &&
                this.contractForm.contTypes.length > 0
            ) {
                param.contTypes = this.contractForm.contTypes.join(",");
            } else {
                param.contTypes = "";
            }
            // delete param.depName
            // console.log(param)
            if (type === "search" || type === "page") {
                sessionStorage.setItem(
                    "sessionQuery",
                    JSON.stringify({
                        path: "/contractCheck",
                        url: "/contract/auditList",
                        query: Object.assign({}, param, {
                            empName: this.dep.empName
                        }),
                        methods: "postJSON"
                    })
                );
            }
            printParam = Object.assign({}, param);

            this.$ajax.postJSON("/api/contract/auditList", param).then(res => {
                res = res.data;
                if (res.status === 200) {
                    this.tableData = res.data.list;
                    this.total = res.data.count;
                }
            });
        },
        //翻页
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getContractList("page");
        },
        //重置
        resetFormFn() {
            TOOL.clearForm(this.contractForm);
            this.keyword = "";
            this.signDate = [];
            this.EmployeList = [];
        },
        // 查询
        queryFn() {
            this.currentPage = 1;
            this.getContractList("search");
        },
        //字典查询
        getDictionaries() {
            this.$ajas.get("/api/dictionary/batchQuery", param).then(res => {});
        },
        //变更解约弹窗
        goChangeCancel(item) {
            if (item.contChangeState.value === 1) {
                this.changeCancel = true;
                this.dialogType = "bg";
                this.contId = item.id;
                console.log(this.contId);
            } else if (item.contChangeState.value === 2) {
                this.changeCancel = true;
                this.dialogType = "jy";
                this.contId = item.id;
            }
            if (item.contType.value > 3) {
                this.dialogContType = 2;
            } else {
                this.dialogContType = 1;
            }
        },
        //关闭变更解约弹窗
        ChangeCancelDialog() {
            this.changeCancel = false;
            this.contId = "";
            this.getContractList();
        },
        //合同预览
        goPreview(item) {
            this.$router.push({
                path: "/contractPreview",
                query: {
                    id: item.id,
                    code: item.code,
                    isentrust: item.isCombine ? 1 : 0
                }
            });
        },
        //合同审核
        goCheck(item) {
            let param = {
                bizCode: item.code,
                flowType: 3
            };
            if (item.isCombine) {
                param.flowType = 11;
            }
            //登录人部门等于设置部门  法务  登录人是审核人
            if (item.auditId === this.getUserMsg.empId) {
                //登录人是审核人不走抢单模式
                this.$router.push({
                    path: "/contractPreview",
                    query: {
                        code: item.code,
                        id: item.id,
                        isentrust: item.isCombine ? 1 : 0
                    }
                });
            } else {
                //登录人部门等于设置部门  法务  走抢单
                this.$ajax
                    .get("/api/machine/getAuditAuth", param)
                    .then(res => {
                        res = res.data;
                        if (res.status === 200) {
                            if (this.power["sign-ht-info-view"].state) {
                                this.$router.push({
                                    path: "/contractPreview",
                                    query: {
                                        code: item.code,
                                        id: item.id,
                                        isentrust: item.isCombine ? 1 : 0
                                    }
                                });
                            } else {
                                this.noPower("合同预览");
                            }
                        }
                    })
                    .catch(error => {
                        this.$message({
                            message: error,
                            type: "error"
                        });
                    });
            }
        },
        //合同详情
        toDetail(value) {
            if (this.power["sign-com-htdetail"].state) {
                if (
                    value.contType.value === 1 ||
                    value.contType.value === 2 ||
                    value.contType.value === 3
                ) {
                    this.$router.push({
                        path: "/contractDetails",
                        query: {
                            id: value.id, //合同id
                            code: value.code, //合同编号
                            contType: value.contType.value //合同类型
                        }
                    });
                } else {
                    this.$router.push({
                        path: "/detailIntention",
                        query: {
                            id: value.id,
                            contType: value.contType.value
                        }
                    });
                }
            } else {
                this.noPower("合同详情查看");
            }
        },
        //获取当前部门
        initDepList: function(val) {
            if (!val) {
                this.remoteMethod();
            }
        },
        clearDep: function() {
            this.contractForm.dealAgentStoreId = "";
            this.contractForm.depName = "";
            // this.EmployeList=[]
            this.contractForm.dealAgentId = "";
            this.clearSelect();
        },
        depHandleClick(data) {
            // this.getEmploye(data.depId)
            this.contractForm.dealAgentStoreId = data.depId;
            this.contractForm.depName = data.name;
            this.contractForm.dealAgentId = "";

            this.handleNodeClick(data);
        },
        searchDep: function(payload) {
            /*this.DepList=payload.list;
      this.contractForm.depName=payload.depName;*/
        },
        // 选择审核人
        choseCheckPerson: function(row, type) {
            this.checkPerson.code = row.code;
            this.checkPerson.type = type;
            if (row.nextAuditId >= 0) {
                this.checkPerson.label = false;
            } else {
                this.checkPerson.label = true;
            }
            if (row.isCombine) {
                this.checkPerson.flowType = 11;
            } else {
                this.checkPerson.flowType = 3;
            }
            this.checkPerson.state = true;
        },
        //关闭设置审核人弹窗
        closeCheckPerson() {
            this.checkPerson.state = false;
            this.getContractList();
        }
    },
    computed: {
        fawu: function() {
            let host = window.location.host;
            let url = false;
            switch (host) {
                case "localhost:8080":
                case "sign2.jjw.com:28879":
                    url =
                        this.getUserMsg.depId === 594 ||
                        this.getUserMsg.depId === 838;
                    break;
                case "sign2.jjw.com":
                    url =
                        this.getUserMsg.depId === 900 ||
                        this.getUserMsg.depId === 2257;
                    break;
            }
            return url;
        },
        getUserMsg() {
            return this.getUser.user;
        },
        combineList() {
            let arr = JSON.parse(JSON.stringify(this.tableData));
            this.tableData.forEach((element, index) => {
                if (element.contractEntrust && element.contractEntrust.id) {
                    //在指定位置添加元素,第一个参数指定位置,第二个参数指定要删除的元素,如果为0,则追加
                    let combineItem = JSON.parse(JSON.stringify(element));
                    combineItem.isCombine = true; //是否是插入的数据
                    combineItem.loanType = 0; //武汉买卖类型
                    combineItem.signDate = combineItem.contractEntrust.signDate; //签约日期
                    combineItem.distributableAchievement =
                        combineItem.contractEntrust.tradeFeeCommission; //可分配业绩
                    combineItem.contState.value =
                        combineItem.contractEntrust.entrustState; //合同状态
                    combineItem.contState.label =
                        combineItem.contractEntrust.entrustState === 1
                            ? "起草中"
                            : combineItem.contractEntrust.entrustState === 2
                            ? "已签章"
                            : "已签约";
                    combineItem.toExamineState.value =
                        combineItem.contractEntrust.examineState; //审核状态
                    combineItem.toExamineState.label =
                        combineItem.contractEntrust.examineState === -1
                            ? "待提审"
                            : combineItem.contractEntrust.examineState === 0
                            ? "审核中"
                            : combineItem.contractEntrust.examineState === 1
                            ? "已通过"
                            : "已驳回";
                    combineItem.uploadTime = combineItem.contractEntrust
                        .uploadTime
                        ? combineItem.contractEntrust.uploadTime
                        : "-"; //合同主体上传时间
                    combineItem.achievementState.value =
                        combineItem.contractEntrust.achievementState; //业绩状态
                    combineItem.achievementState.label =
                        combineItem.contractEntrust.achievementState === -2
                            ? "未录入"
                            : combineItem.contractEntrust.achievementState ===
                              -1
                            ? "待提审"
                            : combineItem.contractEntrust.achievementState === 0
                            ? "审核中"
                            : combineItem.contractEntrust.achievementState === 1
                            ? "已通过"
                            : "已驳回";
                    combineItem.isCanAudit = combineItem.contractEntrust
                        .isCanAudit
                        ? combineItem.contractEntrust.isCanAudit
                        : 0; //H5是否填写完整
                    combineItem.auditTime = combineItem.contractEntrust
                        .auditTime
                        ? combineItem.contractEntrust.auditTime
                        : "-"; //审核时间
                    //当前审核人信息
                    combineItem.auditId = combineItem.contractEntrust.auditId;
                    combineItem.auditName =
                        combineItem.contractEntrust.auditName;
                    combineItem.auditStoreName =
                        combineItem.contractEntrust.auditStoreName;
                    //下一步审核人信息
                    combineItem.nextAuditId =
                        combineItem.contractEntrust.nextAuditId;
                    combineItem.nextAuditName =
                        combineItem.contractEntrust.nextAuditName;
                    combineItem.nextAuditStoreName =
                        combineItem.contractEntrust.nextAuditStoreName;
                    //抢单部门字段
                    combineItem.grabDept = combineItem.contractEntrust.grabDept;
                    arr.forEach((ele, i) => {
                        if (
                            ele.contractEntrust &&
                            ele.contractEntrust.id ===
                                element.contractEntrust.id &&
                            !ele.isCombine
                        ) {
                            arr.splice(i + 1, 0, combineItem);
                        }
                    });
                }
            });
            console.log(arr);
            return arr;
        }
    },
    filters: {
        timeFormat_: function(val) {
            if (!val) {
                return "-";
            } else {
                let time = new Date(val);
                let y = time.getFullYear();
                let M = time.getMonth() + 1;
                let D = time.getDate();
                let h = time.getHours();
                let m = time.getMinutes();
                let s = time.getSeconds();
                let time_ = `${y}-${M > 9 ? M : "0" + M}-${
                    D > 9 ? D : "0" + D
                } ${h > 9 ? h : "0" + h}:${m > 9 ? m : "0" + m}:${
                    s > 9 ? s : "0" + s
                }`;
                return time_.substr(0, 16);
            }
        }
    }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.listTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 8px;
    .float-right {
        float: right;
    }
}

.width300 {
    width: 325px !important;
}
/deep/.pdl {
    &.cell {
        padding-left: 30px !important;
    }
}
/deep/.el-form-item {
    margin-bottom: 10px;
}
/deep/.paper-box {
    /*padding-top: 10px !important;
  margin-bottom: 10px;*/
    background-color: #fff;
    border-radius: 2px;
    box-sizing: border-box;
    // box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
    .paper-set-tit {
        padding-bottom: 10px;
    }
}
/deep/.margin-left {
    margin-left: 0;
}
.pagination {
    /deep/.pagination-info {
        text-align: right;
        margin-top: 0;
    }
}
.contract-list {
    // padding-top: 10px;
    background-color: #fff;
    padding: 8px 10px 0 10px;
    border-radius: 2px;
    // box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
    > p {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
        .title {
            font-size: 14px;
            color: @color-blank;
            i {
                padding-right: 8px;
            }
        }
        .text {
            font-size: 14px;
            color: @color-6c;
            padding-left: 10px;
        }
        .data {
            font-size: 14px;
            color: @color-blue;
        }
    }
    .name-wrapper {
        min-width: 80px;
        height: 65px;
        display: -webkit-box;
        /*!autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
        -webkit-line-clamp: 3;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .isFlex {
        display: flex;
        align-items: center;
    }
    .shell {
        width: 100%;
        height: 100%;
        display: inline-block;
    }
    .error_ {
        color: red;
    }
}
.contract_msg {
    display: flex;
    align-items: center;
    .riskLabel {
        width: 20px;
        padding-right: 20px;
        color: @color-orange;
        font-size: 18px;
        .risk {
            color: @color-warning;
            position: relative;
            .remarksExamine {
                background: #fff;
                font-size: 14px;
                color: #606266;
                position: absolute;
                left: 0;
                top: 0;
                display: inline-block;
                width: 60px;
            }
        }
    }
    .contract-msglist {
        > li {
            text-align: left;
            &:first-of-type {
                > span {
                    color: @color-blue;
                    cursor: pointer;
                }
            }
        }
    }
}

.blue {
    color: @color-blue;
}
.yellow {
    color: @color-yellow;
}
.green {
    color: @color-green;
}
.red {
    color: @color-warning;
}
.btn {
    color: @color-blue;
    cursor: pointer;
}
/deep/ .el-table th {
    background: @bg-th;
}
</style>
