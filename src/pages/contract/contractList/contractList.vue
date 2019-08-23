<template>
  <div class="view-container" ref="tableComView">
    <!-- 筛选查询 -->
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
      <el-form :inline="true" :model="contractForm" class="prop-form" size="small">
        <el-form-item label="关键字">
          <el-tooltip class="item" effect="dark" content="物业地址/业主/客户/房产证号/手机号/合同编号/房源编号/客源编号" placement="top">
            <el-input v-model="keyword" style="width:150px" placeholder="请输入" :clearable="true"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="签约日期">
          <el-date-picker v-model="signDate" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy/MM/dd" style="width:330px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同类型">
          <!-- <el-select v-model="contractForm.contType" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['10']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select> -->
          <el-select v-model="contractForm.contTypes" multiple placeholder="全部" style="width:200px" :class="{'width300':contractForm.contTypes&&contractForm.contTypes.length>3}">
            <el-option
              v-for="item in dictionary['10']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="合同状态">
          <el-select v-model="contractForm.contState" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['9']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用途">
          <el-select v-model="contractForm.housePurpose" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in housePurpose" :key="item.key" :label="item.value" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <!-- <el-select v-model="contractForm.dealAgentStoreId" filterable placeholder="全部" :clearable="true" style="width:150px" @change="selectDep">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select> -->

          <!-- <el-select style="width:160px" :clearable="true" ref="tree" size="small" :loading="Loading" :remote-method="remoteMethod" @visible-change="initDepList" @clear="clearDep" v-model="contractForm.depName" placeholder="请选择">
            <el-option class="drop-tree" value="">
              <el-tree :data="DepList" :props="defaultProps" @node-click="depHandleClick"></el-tree>
            </el-option>
          </el-select> -->
          <select-tree :data="DepList" :init="contractForm.depName" @checkCell="depHandleClick" @clear="clearDep" @search="searchDep"></select-tree>
        </el-form-item>
        <el-form-item>
          <el-select style="width:100px" :clearable="true" v-loadmore="moreEmploye" class="margin-left" size="small" v-model="contractForm.dealAgentId" @change="handleEmpNodeClick" placeholder="请选择">
            <el-option
              v-for="item in EmployeList"
              :key="item.empId"
              :label="item.name"
              :value="item.empId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="contractForm.toExamineState" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['51']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变更/解约">
          <el-select v-model="contractForm.contChangeState" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['6']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算状态">
          <el-select v-model="contractForm.resultState" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['14']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收佣状态">
          <el-select v-model="contractForm.receiveAmountState" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['13']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业绩状态">
          <el-select v-model="contractForm.achievementState" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['54']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合作方式">
          <el-select v-model="contractForm.dealAgentStoreAttr" placeholder="全部" :clearable="true" style="width:150px">
            <el-option v-for="item in dictionary['53']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="后期状态">
          <el-select v-model="contractForm.laterStageState" placeholder="全部" :clearable="true">
            <el-option v-for="item in dictionary['11']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="佣金比例">
          <el-input class="percent" v-model="contractForm.beginRatio" @input.native="changeRatio('begin')" style="width:85px" placeholder="请输入" :clearable="true"></el-input> -
          <el-input class="percent" v-model="contractForm.endRatio" @input.native="changeRatio('end')" style="width:85px" placeholder="请输入" :clearable="true"></el-input>
        </el-form-item>
      </el-form>
    </ScreeningTop>
    <!-- 合同列表 -->
    <div class="contract-list">
      <div class="listTitle">
        <div>
          <span class="title"><i class="iconfont icon-tubiao-11"></i>数据列表</span>
          <!-- <span class="text">有效成分汇总 </span>
          <span class="text">租赁：</span> <span class="data">123165</span>
          <span class="text">买卖：</span> <span class="data">75454</span>
          <span class="text">代办：</span> <span class="data">5565</span>
          <span class="text">意向：</span> <span class="data">0</span>
          <span class="text">定金：</span> <span class="data">0</span>
          <span class="text">可分配业绩汇总：</span> <span class="data">564654</span>
          <span class="text">单数：</span> <span class="data">13</span> -->
        </div>
        <div>
          <el-dropdown placement="bottom" @command="toAddcontract" v-if="power['sign-ht-info-add'].state">
            <el-button round type="primary" size="small">
              创建线上合同<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in dictionary['10']" :key="item.key" :command="item.key">
                {{item.value}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown placement="bottom" @command="toAddcontract" v-if="power['sign-ht-info-addoffline'].state">
            <el-button round type="primary" size="small">
              录入线下合同<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in dictionary['65']" :key="item.key" :command="item.key+'offline'">
                {{item.value}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown placement="bottom" @command="printCont" v-if="power['sign-ht-info-print'].state"><!--  @command="printCont" -->
            <el-button round size="small">
              打印空白合同<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in dictionary['10']" :key="item.key" :command="item.key">
                {{item.value}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button class="btn-info" v-if="power['sign-ht-info-export'].state"  round type="primary" size="small" @click="getExcel">导出</el-button>
        </div>
      </div>
      <el-table ref="tableCom" class="info-scrollbar" :data="tableData" style="width: 100%" @row-dblclick='toDetail' border :max-height="tableNumberCom">
        <el-table-column align="center" label="合同信息" min-width="200" fixed>
          <template slot-scope="scope">
            <div class="contract_msg">
              <div class="riskLabel">
                <!-- 风险单 -->
                <el-popover
                  placement="top-start"
                  width="50"
                  trigger="hover"
                  content="风险单"
                  v-if="scope.row.isRisk">
                  <i slot="reference" class="iconfont icon-tubiao_shiyong-1 risk"></i>
                </el-popover>
                <!-- 代办 -->
                <!-- <i class="iconfont icon-tubiao_shiyong-2 replace" v-if="scope.row.contMarkState&&scope.row.contMarkState.value===1"></i> -->
                <!-- 低佣 -->
                <!-- <i class="iconfont icon-tubiao_shiyong-3 low" v-if="scope.row.contMarkState&&scope.row.contMarkState.value===1"></i> -->
                <!-- <el-popover
                  placement="top-start"
                  width="10"
                  trigger="hover"
                  content="低佣"
                  v-if="scope.row.contMarkState&&scope.row.contMarkState.value===1">
                  <i slot="reference" class="iconfont icon-tubiao_shiyong-3 low"></i>
                </el-popover> -->
              </div>
              <ul class="contract-msglist">
                <li>合同：<span @click="toDetail(scope.row)">{{scope.row.code}}</span></li>
                <li>房源：<span>{{scope.row.houseinfoCode}}</span> {{scope.row.showOwnerName}}</li>
                <li>客源：<span>{{scope.row.guestinfoCode}}</span> {{scope.row.showCustName}}</li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="合同类型" prop="contType.label" min-width="50">
        </el-table-column>
        <el-table-column align="center" label="物业地址" prop="propertyAddr" min-width="160">
        </el-table-column>
        <el-table-column align="center" label="成交总价" prop="dealPrice" min-width="90">
          <template slot-scope="scope">
            <span>{{scope.row.dealPrice}}元</span>
            <span v-for="item in dictionary['507']" :key="item.key" v-if="item.key===scope.row.timeUnit&&scope.row.contType.value===1"> / {{item.value}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="佣金比例(%)" min-width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.contType.value===2||scope.row.contType.value===3">{{((scope.row.receivableCommission/scope.row.dealPrice)*100).toFixed(2)}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="财务收付" min-width="50">
          <template slot-scope="scope">
            <div class="btn" @click="runningWater(scope.row)">流水</div>
            <div class="btn" @click="gathering(scope.row)">收款</div>
            <div class="btn" @click="payment(scope.row)">付款</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="成交经纪人" min-width="120">
          <template slot-scope="scope">
            <p>{{scope.row.dealAgentStoreName}}</p>
            <p>{{scope.row.dealAgentName}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="签约日期" min-width="90">
          <template slot-scope="scope">
            <!-- {{scope.row.signDate.substr(0, 10)}} -->
            {{Number(scope.row.signDate)|timeFormat_}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="可分配业绩 (元)" min-width="80">
          <template slot-scope="scope">
            <!-- {{scope.row.contType.value<4 ? scope.row.distributableAchievement:'-'}} -->
              <span v-if="scope.row.contType.value<4">{{scope.row.distributableAchievement}}</span>
              <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="合同状态" min-width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.contType.value<4">
              <span v-if="scope.row.contState.value>0">{{scope.row.contState.label}}</span>
              <el-popover trigger="hover" placement="top" v-else>
                <div style="width:160px">
                  {{scope.row.delReason}}
                </div>
                <div slot="reference" class="name-wrapper">
                  {{scope.row.contState.label}}
                </div>
              </el-popover>
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="打印次数">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="selectPrintInfo(scope.row)" v-if="scope.row.printCount>0">{{scope.row.printCount}}</el-button>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核状态" prop="toExamineState.label" min-width="80">
          <template slot-scope="scope">
            <!-- {{scope.row.contType.value<4 ? scope.row.distributableAchievement:'-'}} -->
              <span v-if="scope.row.contType.value<4">
                <span v-if="scope.row.toExamineState.value===-1" class="blue">{{scope.row.toExamineState.label}}</span>
                <span v-if="scope.row.toExamineState.value===0" class="yellow">{{scope.row.toExamineState.label}}</span>
                <span v-if="scope.row.toExamineState.value===1" class="green">{{scope.row.toExamineState.label}}</span>
                <span v-if="scope.row.toExamineState.value===2" class="red">{{scope.row.toExamineState.label}}</span>
              </span>
              <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="变更/解约" min-width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.contChangeState.label==='未变更/解约'">-</span>
            <el-button type="text" size="medium" v-else @click="goChangeCancel(scope.row)">{{scope.row.contChangeState.label}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="后期状态" min-width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.contType.value<4&&scope.row.contType.value!==1">
              <el-button v-if="scope.row.laterStageState.label==='已拒绝'" type="text" size="medium" @click="uploadData(scope.row)">已拒绝</el-button>
              <span v-else>{{scope.row.laterStageState.label}}</span>
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="后期进度" min-width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.contType.value<4">
              <span v-if="scope.row.stepInstanceName==='-'">-</span>
              <!-- <el-button v-else type="text" size="medium" @click="showStepInstance(scope.row)">{{scope.row.stepInstanceName}}</el-button> -->
              <el-tooltip class="item" v-else effect="dark" :content="scope.row.stepInstanceName" placement="top">
                <span class="stepInstanceName" @click="showStepInstance(scope.row)">{{scope.row.stepInstanceName}}</span>
              </el-tooltip>
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="实收/应收(佣金)" min-width="80">
          <template slot-scope="scope">
            <!-- <div class="btn" @click="runningWater(scope.row)">流水</div> -->
            <div class="btn" @click="runningWater(scope.row)" v-if="scope.row.contType.value<4">{{scope.row.receivedCommission}}/{{scope.row.receivableCommission}}</div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="结算状态" min-width="80">
          <template slot-scope="scope">
            <!-- <el-button v-if="scope.row.contType.value<4" type="text" size="medium" @click="closeAccount(scope.row)">{{scope.row.resultState.label}}</el-button> -->
            <span v-if="scope.row.contType.value<4">{{scope.row.resultState.label}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="业绩状态" min-width="80">
          <template slot-scope="scope">
            <!-- {{scope.row.achievementState.label}} -->
            <span v-if="scope.row.contType.value<4">{{scope.row.achievementState.label}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="120">
          <template slot-scope="scope">
            <!-- <div style="text-align:center"> -->
              <el-button type="text" size="medium" v-if="power['sign-ht-info-view'].state&&scope.row.recordType.value===1" @click="goPreview(scope.row)">预览</el-button>
              <el-button type="text" size="medium" v-if="power['sign-ht-xq-main-add'].state&&(scope.row.contState.value>1||scope.row.contState.value!=0&&scope.row.recordType.value===2)" @click="upload(scope.row)">上传</el-button>
              <!-- <el-button type="text" size="medium" v-if="scope.row.toExamineState.value===0&&scope.row.contType.value<4&&userMsg&&scope.row.auditId===userMsg.empId" @click="goCheck(scope.row)">审核</el-button> -->
              <!-- <span v-if="power['sign-ht-view-toverify'].state&&(scope.row.toExamineState.value<0||scope.row.toExamineState.value===2)&&scope.row.contType.value<4"> -->
              <el-button type="text" size="medium" v-if="power['sign-ht-view-toverify'].state&&(scope.row.toExamineState.value<0||scope.row.toExamineState.value===2)&&scope.row.contType.value<4&&scope.row.isCanAudit===1" @click="goSave(scope.row)">提审</el-button>
              <!-- </span> -->
              <el-button type="text" size="medium" v-if="scope.row.contState.value===3&&scope.row.contType.value===1&&scope.row.contChangeState.value!=2&&scope.row.isHaveData===1&&scope.row.isCanChangeCommission===1" @click="toLayerAudit(scope.row)">调佣</el-button>
            <!-- </div> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 固定滚动条 -->
      <div class="pagination" v-if="tableData.length>0">
        <el-pagination
         class="pagination-info"
         @current-change="handleCurrentChange"
         :current-page="currentPage"
         layout="total, prev, pager, next, jumper"
         :total="total">
        </el-pagination>
      </div>

    </div>
    <!-- 流水明细弹框 -->
    <flowAccount :dialogTableVisible="water" :contCode="contCode" :contId="waterContId" @closeRunningWater="closeWater" v-if="water"></flowAccount>
    <!-- 调佣弹框 -->
    <layerAudit :dialogVisible="tiaoyong" :layerAudit="layerAudit" @closeCentCommission="closeCommission" v-if='tiaoyong'></layerAudit>
    <!-- 结算弹窗 -->
    <layerSettle :settleDialog="jiesuan" :contId="settleId" :layerAudit="layerSettle" @closeSettle="closeSettle" v-if='settleId'></layerSettle>
    <!-- 变更/解约查看 合同主体上传弹窗 -->
    <changeCancel :dialogType="dialogType" :contState="contState" :cancelDialog="changeCancel" :contId="contId" :code="uploadCode" @closeChangeCancel="ChangeCancelDialog" v-if="changeCancel"></changeCancel>
    <!-- 后期进度查看 -->
    <lateProgress title="查看交易流程" ref="lateProgress"></lateProgress>
    <!-- 提审确认框 -->
    <el-dialog title="提示" :visible.sync="isSubmitAudit" width="460px">
      <span>确定提审？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isSubmitAudit = false">取 消</el-button>
        <el-button type="primary" @click="submitAudit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 打印详情弹窗 -->
    <el-dialog title="打印详情" :visible.sync="isHavePrint" width="460px">
      <div>
        <el-table :data="printData" border>
          <el-table-column label="操作人">
            <template slot-scope="scope">
              {{scope.row.createDeptName+'-'+scope.row.createByName}}
            </template>
          </el-table-column>
          <el-table-column label="打印时间">
            <template slot-scope="scope">
              {{scope.row.createTime|formatTime}}
            </template>
          </el-table-column>
          <el-table-column label="类型">
            <template slot-scope="scope">
              {{scope.row.printType.label}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="isSubmitAudit = false">取 消</el-button>
        <el-button type="primary" @click="submitAudit">确 定</el-button> -->
      </span>
    </el-dialog>
    <!-- 打印 -->
    <PdfPrint :url="pdfUrl" ref="pdfPrint" v-if="haveUrl" @closePrint="closePrint"></PdfPrint>
    <!-- <iframe :src="pdfUrl" frameborder="0" style="width:100px" id="dayin"></iframe> -->
    <div class="printMaskLayer" v-if="haveUrl"></div>
    <!-- <span @click="dayin">打印</span> -->
    <!-- 设置/转交审核人 -->
    <checkPerson :show="checkPerson.state" :type="checkPerson.type" :showLabel="checkPerson.label" :bizCode="checkPerson.code" :flowType="checkPerson.flowType" @close="closeCheckPerson" @submit="closeCheckPerson" v-if="checkPerson.state"></checkPerson>
  </div>
</template>

<script>
import ScreeningTop from "@/components/ScreeningTop";
import flowAccount from "@/components/flowAccount";
import layerAudit from "../contractDialog/layerAudit";
import layerSettle from "../contractDialog/layerSettle";
import changeCancel from "../contractDialog/changeCancel";
import lateProgress from '../contractDialog/lateProgress';
import { TOOL } from "@/assets/js/common";
import { MIXINS } from "@/assets/js/mixins";
import PdfPrint from '@/components/PdfPrint';
import checkPerson from '@/components/checkPerson';

export default {
  mixins: [MIXINS],
  components: {
    ScreeningTop,
    flowAccount,
    layerAudit,
    layerSettle,
    changeCancel,
    lateProgress,
    PdfPrint,
    checkPerson
  },
  data() {
    return {
      tableBox:null,
      contractForm: {},
      keyword: "",
      signDate: [],
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      water: false,
      // contractCode: "",
      tiaoyong: false,
      layerAudit:{},
      jiesuan: false,
      changeCancel: false,
      dialogType: "",
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
        "538": "", //用途
        "507": "",
        "11": "",//后期状态
        "65":"",//线下合同类型
      },
      loading:false,
      //部门选择列表
      options:[],
      //经纪人列表
      brokersList:[],
      //合同id
      contId:'',
      //合同状态
      contState:99,
      settleId:'',
      layerSettle:{
        contarctType:{
          label: ""
        },
        laterStageStatus: {
          lable: ""
        }
      },
      //流水用合同编号
      contCode:'',
      //上传用合同编号
      uploadCode:'',
      waterContId:'',
      housePurpose:[],
      isSubmitAudit:false,
      submitAuditData:{},
      blankPdf1:'',
      blankPdf2:'',
      blankPdf3:'',
      blankPdf4:'',
      blankPdf5:'',
      pdfUrl:'',
      haveUrl:false,
      http:'',
      //业绩状态
      achStatuArr:[
        {
          key:-1,
          value:"待提审"
        },
        {
          key:0,
          value:"审核中"
        },
        {
          key:1,
          value:"已通过"
        },
        {
          key:2,
          value:"已驳回"
        }
      ],
      checkPerson: {
        state:false,
        type:1,
        code:'',
        flowType:3,
        label:false
      },
      printData:'',//打印次数详情
      isHavePrint:false,
      //权限配置
      power: {
        'sign-com-bill': {
          state: false,
          name: '流水'
        },
        'sign-ht-info-collect': {
          state: false,
          name: '收款'
        },
        'sign-ht-info-pay': {
          state: false,
          name: '付款'
        },
        'sign-ht-info-print': {
          state: false,
          name: '打印空白合同'
        },
        'sign-ht-info-add': {
          state: false,
          name: '创建正式合同'
        },
        'sign-ht-info-addoffline': {
          state: false,
          name: '创建线下合同'
        },
        'sign-ht-info-view': {
          state: false,
          name: '预览'
        },
        'sign-ht-view-toverify': {
          state: false,
          name: '提审'
        },
        'sign-ht-xq-main-add': {
          state: false,
          name: '上传'
        },
        'sign-ht-info-adjust': {
          state: false,
          name: '调佣'
        },
        'sign-ht-info-end': {
          state: false,
          name: '结算状态'
        },
        'sign-ht-info-rec': {
          state: false,
          name: '收佣状态'
        },
        'sign-com-hqstep': {
          state: false,
          name: '后期进度'
        },
        'sign-com-htdetail': {
          state: false,
          name: '合同详情'
        },
        'sign-com-house': {
          state: false,
          name: '房源详情'
        },
        'sign-com-cust': {
          state: false,
          name: '客源详情'
        },
        'sign-ht-info-export': {
          state: false,
          name: '导出'
        }
      }
    };
  },
  // mounted() {
  //   this.$nextTick(()=>{
  //     this.tableBox=this.$refs.dataList;
  //   })
  // },
  created() {
    if (!window.location.origin) {
      window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
    }
    this.http = window.location.origin
    this.getAdmin();//获取当前登录人信息
    this.getDictionary();//字典
    this.getHousePurpose();//用途
    this.remoteMethod();//部门
    let res=this.getDataList
    if(res&&(res.route===this.$route.path)){
      this.tableData = res.data.list
      this.total = res.data.count
      let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
      this.contractForm = Object.assign({},this.contractForm,session.query,{contTypes:session.query.contTypes.length>0?session.query.contTypes.split(','):''})
      if(this.contractForm.contTypes){
        this.contractForm.contTypes = this.contractForm.contTypes.map(item=>{
          return Number(item)
        })
      }
      // this.contractForm.dealAgentStoreId=''
      // this.contractForm.dealAgentId=''
      delete this.contractForm.keyword
      delete this.contractForm.pageNum
      delete this.contractForm.beginDate
      delete this.contractForm.endDate
      this.keyword=session.query.keyword
      this.currentPage=session.query.pageNum
      if(session.query.beginDate){
        this.signDate[0]=session.query.beginDate
        this.signDate[1]=session.query.endDate
      }
      if(this.contractForm.dealAgentId){
        this.dep=Object.assign({},this.dep,{id:this.contractForm.dealAgentStoreId,empId:this.contractForm.dealAgentId,empName:this.contractForm.empName})
        this.EmployeList.unshift({
          empId:this.contractForm.dealAgentId,
          name:this.contractForm.empName
        })
        this.getEmploye(this.contractForm.dealAgentStoreId)
      }
    }else{
      this.getContractList();//合同列表
    }
  },
  methods: {
    dayin(){
      debugger
      document.querySelector('#dayin').contentWindow.print()
    },
    //用途
    getHousePurpose(){
      let param = {
        type:'HousePurpose'
      }
      this.$ajax.get('/api/dictionary/uplus',param).then(res=>{
        res=res.data;
        if(res.status===200){
          this.housePurpose=res.data;
        }
      })
    },
    //获取合同列表
    getContractList(type='init') {
      let param = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.keyword
      };
      param = Object.assign({}, param, this.contractForm);
      if(this.signDate){
        if (this.signDate.length > 0) {
          param.beginDate = this.signDate[0];
          param.endDate = this.signDate[1];
        }
      }
      if(this.contractForm.contTypes&&this.contractForm.contTypes.length>0){
        param.contTypes=this.contractForm.contTypes.join(',')
      }else{
        param.contTypes=''
      }

      // delete param.depName
      //console.log(param)
      if(type==="search"||type==="page"){
        sessionStorage.setItem('sessionQuery',JSON.stringify({
          path:'/contractList',
          url:'/contract/contractList',
          query:Object.assign({},param,{empName:this.dep.empName}),
          methods:"postJSON"
        }))
      }
      this.$ajax.postJSON("/api/contract/contractList", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.tableData = res.data.list;
          this.total = res.data.count;
        }
      });
    },
    //重置
    resetFormFn() {
      TOOL.clearForm(this.contractForm);
      this.keyword = "";
      this.signDate = [];
      this.EmployeList = []
    },
    // 查询
    queryFn() {
      this.currentPage=1;
      this.getContractList("search");
    },
    //佣金比例
    changeRatio(type){
      if(type==="begin"){
        this.$nextTick(()=>{
          this.contractForm.beginRatio=this.$tool.cutFloat({val:this.contractForm.beginRatio,max:100})
        })
      }else if(type==="end"){
        this.$nextTick(()=>{
          this.contractForm.endRatio=this.$tool.cutFloat({val:this.contractForm.endRatio,max:100})
        })
      }
    },
    //流水
    runningWater(item) {
      if(this.power['sign-com-bill'].state){
        this.water = true;
        this.contCode=item.code;
        this.waterContId=item.id;
      }else{
        this.noPower('流水查看')
      }
    },
    //关闭流水弹窗
    closeWater() {
      this.water = false;
      this.contCode='';
      this.waterContId='';
    },
    //收款
    gathering(item) {
      if(this.power['sign-ht-info-collect'].state){
        this.setPath(this.$tool.getRouter(['合同','合同列表','创建收款'],'contractList'));
        this.$router.push({
          path:'/receiptBill',
          query:{
            contId:item.id,
            code:item.code
          }
        })
      }else{
        this.noPower('收款')
      }
    },
    //付款
    payment(item) {
      if(this.power['sign-ht-info-pay'].state){
        this.setPath(this.$tool.getRouter(['合同','合同列表','创建付款'],'contractList'));
        this.$router.push({
          path:'/payBill',
          query:{
            contId:item.id,
            code:item.code,
            address:item.propertyAddr
          }
        })
      }else{
        this.noPower('付款')
      }
    },
    //打印次数详情
    selectPrintInfo(item){
      let param = {
        contId:item.id
      }
      this.$ajax.get("/api/contract/selectPrintInfo", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          if(res.data.length>0){
            this.printData=res.data
            this.isHavePrint=true
          }
          // else{
          //   this.$message({
          //     message: '该合同暂无打印详情',
          //     type: "warning"
          //   });
          // }
        }
      });
    },
    //合同详情页
    toDetail(value) {
      if(this.power['sign-com-htdetail'].state){
        this.setPath(this.$tool.getRouter(['合同','合同列表','合同详情'],'contractList'));
        if(value.contType.value===1||value.contType.value===2||value.contType.value===3){
          // this.$router.push({
          //   path: "/contractDetails",
          //   query: {
          //     id: value.id,//合同id
          //     code: value.code,//合同编号
          //     contType: value.contType.value//合同类型
          //   }
          // });
          let newPage = this.$router.resolve({
            path: "/contractDetails",
            query: {
              id: value.id,//合同id
              // code: value.code,//合同编号
              contType: value.contType.value//合同类型
            }
          });
          window.open(newPage.href, '_blank');
        }else{
          // this.$router.push({
          //   path: "/detailIntention",
          //   query: {
          //     id: value.id,
          //     contType: value.contType.value
          //   }
          // });
          let newPage = this.$router.resolve({
            path: "/detailIntention",
            query: {
              id: value.id,
              contType: value.contType.value
            }
          });
          window.open(newPage.href, '_blank');
        }
      }else{
        this.noPower('合同详情查看')
      }
    },
    uploadData(value) {
        if(this.power['sign-com-htdetail'].state){
          this.setPath(this.$tool.getRouter(['合同','合同列表','合同详情'],'contractList'));
          this.$router.push({
            path: "/contractDetails",
            query: {
              type: "dataBank",
              id: value.id,
              code:value.code,
              contType: value.contType.value
            }
          });
        }else{
          this.noPower('合同详情')
        }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getContractList("page");
    },
    //新增合同
    toAddcontract(command) {
      let isOffline = 0;
      let recordType=1;
      if(typeof(command)==="string"){
        isOffline=1;
        recordType=2;
        command=Number(command.replace("offline",""))
      }
      let param = {
        type:command,
        recordType:recordType
      };
      this.$ajax.get('/api/contract/checkContTemplate',param).then(res=>{
        res=res.data;
        if(res.status===200){
          localStorage.removeItem('backMsg')
          this.setPath(this.$tool.getRouter(['合同','合同列表','新增合同'],'contractList'));
          if (command === 1 || command === 2 || command === 3) {
            this.$router.push({
              path: "/addContract",
              query: {
                type: command,
                operateType:1,
                isOffline:isOffline
              }
            });
          } else if (command === 4 || command === 5) {
            this.$router.push({
              path: "/newIntention",
              query: {
                contType: command,
                operateType:1,
                isOffline:isOffline
              }
            });
          }
        }else{
          this.$message({
            message:'该类型合同模板未上传,请上传后再创建',
            type: "warning"
          })
        }
      }).catch(error => {
          this.$message({
            message: '该类型合同模板未上传,请上传后再创建',
            type: "warning"
          });
        });
    },
    //合同预览
    goPreview(item) {
      this.setPath(this.$tool.getRouter(['合同','合同列表','合同预览'],'contractList'));
      this.$router.push({
        path: "/contractPreview",
        query: {
          id: item.id,
          code:item.code
        }
      });
    },
    //合同审核
    goCheck(item) {
      if(this.power['sign-ht-info-view'].state){
        this.setPath(this.$tool.getRouter(['合同','合同列表','合同预览'],'contractList'));
        this.$router.push({
          path:'/contractPreview',
          query:{
            code:item.code,
            id:item.id,
            operationType:2
          }
        })
      }else{
        this.noPower('合同预览')
      }

    },
    //调佣弹窗
    toLayerAudit(item) {
      let param = {
        contractCode: item.code
      }
      this.$ajax.get("/api/commission/detail", param).then(res => {
        let data = res.data;
        if (res.data.status === 200) {
          this.layerAudit = data.data
          this.tiaoyong = true;
        }
      }).catch(error => {
          this.$message({
            message: error,
            type:"error"
          })
      })
    },
    //关闭调佣弹窗
    closeCommission() {
      this.tiaoyong = false;
      this.layerAudit={}
      this.getContractList();
    },
    //关闭变更解约弹窗
    ChangeCancelDialog() {
      this.changeCancel = false;
      this.contId='';
      this.getContractList();
    },
    //字典查询
    getDictionaries() {
      this.$ajas.get("/api/dictionary/batchQuery", param).then(res => {});
    },
    //变更解约弹窗
    goChangeCancel(item) {
      console.log(item.contChangeState.value);
      //debugger
      if (item.contChangeState.value === 1) {
        this.changeCancel = true;
        this.dialogType = "changeLook";
        this.contId=item.id;
        console.log(this.contId)
      } else if (item.contChangeState.value === 2) {
        this.changeCancel = true;
        this.dialogType = "cancelLook";
        this.contId=item.id;
      }
    },
    //上传合同主体
    upload(item) {
      //console.log(code);
      this.changeCancel = true;
      this.dialogType = "upload";
      this.contId = item.id,
      this.uploadCode=item.code,
      this.contState=item.contState.value
    },
    //获取当前部门
    initDepList:function (val) {
      if(!val){
        this.remoteMethod()
      }
    },
    clearDep:function () {
      this.contractForm.dealAgentStoreId=''
      this.contractForm.depName=''
      // this.EmployeList=[]
      this.contractForm.dealAgentId=''
      this.clearSelect()
    },
    depHandleClick(data) {
      // this.getEmploye(data.depId)
      this.contractForm.dealAgentStoreId=data.depId
      this.contractForm.depName=data.name

      this.handleNodeClick(data)
    },
    searchDep:function (payload) {
      /*this.DepList=payload.list
      this.contractForm.depName=payload.depName*/
    },
    //提审
    goSave(item){
      this.isSubmitAudit=true;
      this.submitAuditData=item;
    },
    submitAudit(){
      let param = {
        cityId:this.submitAuditData.cityCode,
        flowType:3,
        bizCode:this.submitAuditData.code
      }
      this.$ajax.get('/api/machine/submitAduit', param).then(res=>{
        this.isSubmitAudit=false;
        res=res.data;
        if(res.status===200){
          this.$message({
            message:"提审成功",
            type:'success'
          })
          this.getContractList()
        }else{
          this.$message({
            message:res.message
          })
        }
      }).catch(error => {
          this.isSubmitAudit=false;
          if(error.message==='下一节点审批人不存在'){
            this.checkPerson.code=this.submitAuditData.code;
            this.checkPerson.state=true;
            // this.checkPerson.type=error.data.type===1?'set':'init';
            this.checkPerson.label=true;
          }else{
            this.$message({
              message:error,
              type: "error"
            })
          }
        })
    },
    closeCheckPerson(){
      this.checkPerson.state=false;
      this.getContractList();
    },
    //发起结算弹窗
    closeAccount(item){
      if(this.power['sign-ht-info-end'].state){
        if(item.contChangeState.value!==2){
          // if(item.resultState.value===2){
          // this.$message({
          //   message:'已结算完成，无需发起结算'
          // })
        // }else{
          // if(item.isCanChangeCommission===1){
          let param = {
            id: item.id
          }
          this.$ajax.get("/api/settlement/getSettlById", param).then(res => {
            // console.log(res);
            let data = res.data;
            if (res.data.status === 200) {
              this.jiesuan=true;
              this.settleId=item.id;
              this.layerSettle = data.data
            }
          }).catch(error => {
              this.$message({
                message: error,
                type: "warning"
              })
            })
          // }else{
          //   this.$message({
          //     message:"存在未审核的调佣,无法发起结算",
          //     type: "warning"
          //   })
          // }
          // }
        }else{
          this.$message({
            message:'合同已解约，无法发起结算',
            type: "warning"
          })
        }
      }else{
        this.noPower('结算')
      }
    },
    //关闭结算弹窗
    closeSettle(){
      this.jiesuan = false;
      this.settleId = "";
      this.getContractList();
    },
    //后期流程查看
    showStepInstance(item){
      if(this.power['sign-com-hqstep'].state){
        let value = {
          id:item.id,
          transFlowName:item.stepInstanceName,
          statusReceiveAmount:item.receiveAmountState
        }
        this.$refs.lateProgress.show(value);
      }else{
        this.noPower('后期流程查看')
      }
    },
    closePrint(){
       this.pdfUrl='';
       this.haveUrl=false;
    },
    //打印空白合同
    printCont(command){
      // this.pdfUrl='';
      // this.haveUrl=false;
      let param = {
        type:command
      }
      this.$ajax.get("/api/setting/contractTemplate/checkBlankPdf",param).then(res=>{
        res=res.data
        if(res.status===200){
          let dayRandomTime=new Date().getTime()
          this.pdfUrl=`${this.http}/api/setting/contractTemplate/getBlankPdf?type=${command}&dayRandomTime=${dayRandomTime}`
          this.haveUrl=true
        }
      }).catch(error=>{
        this.$message({
          message:error,
          type:"error"
        })
      })

      // if(command===1){
      //   if(this.blankPdf1){
      //     this.getUrl(this.blankPdf1);
      //   }else{
      //     this.$message({
      //       message:'该类型合同模板未上传,请上传后再打印',
      //       type: "warning"
      //     })
      //   }
      // }else if(command===2){
      //   if(this.blankPdf2){
      //     this.getUrl(this.blankPdf2);
      //   }else{
      //     this.$message({
      //       message:'该类型合同模板未上传,请上传后再打印',
      //       type: "warning"
      //     })
      //   }
      // }else if(command===3){
      //   if(this.blankPdf3){
      //     this.getUrl(this.blankPdf3);
      //   }else{
      //     this.$message({
      //       message:'该类型合同模板未上传,请上传后再打印',
      //       type: "warning"
      //     })
      //   }
      // }else if(command===4){
      //   if(this.blankPdf4){
      //     this.getUrl(this.blankPdf4);
      //   }else{
      //     this.$message({
      //       message:'该类型合同模板未上传,请上传后再打印',
      //       type: "warning"
      //     })
      //   }
      // }else if(command===5){
      //   if(this.blankPdf5){
      //     this.getUrl(this.blankPdf5);
      //   }else{
      //     this.$message({
      //       message:'该类型合同模板未上传,请上传后再打印',
      //       type: "warning"
      //     })
      //   }
      // }
    },
    //获取空白合同pdf
    getBlankPdf(){
      this.$ajax.get('/api/setting/contractTemplate/getBlankPdf').then(res=>{
        res=res.data;
        if(res.status===200){
          if(res.data){
            let addData = res.data;
            addData.forEach(element => {
              if(element.type.value===1){
                this.blankPdf1=element.blankPdf;
              }else if(element.type.value===2){
                this.blankPdf2=element.blankPdf;
              }else if(element.type.value===3){
                this.blankPdf3=element.blankPdf;
              }else if(element.type.value===4){
                this.blankPdf4=element.blankPdf;
              }else if(element.type.value===5){
                this.blankPdf5=element.blankPdf;
              }
            });
          }
        }
      }).catch(error=>{
        this.$message({
          message:error
        })
      })
    },
    //获取签名
    getUrl(url){
      let param = {
        url:url
      }
      this.$ajax.get("/api/load/generateAccessURL",param).then(res=>{
        res = res.data
        if(res.status ===200){
          this.pdfUrl = res.data.url;
          this.haveUrl=true;
        }
      })
    },
    //导出
    getExcel(){
      let param = {
        // pageNum: this.currentPage,
        // pageSize: this.pageSize,
        keyword: this.keyword
      };
      param = Object.assign({}, param, this.contractForm);
      if(this.signDate){
        if (this.signDate.length > 0) {
          param.beginDate = this.signDate[0];
          param.endDate = this.signDate[1];
        }
      }
      if(this.contractForm.contTypes&&this.contractForm.contTypes.length>0){
        param.contTypes=this.contractForm.contTypes.join(',')
      }else{
        param.contTypes=''
      }

      delete param.depName
      //console.log(param)
      this.excelCreate("/input/contractExcel",param)
      // this.$ajax.postJSON("/api/input/contractExcel", param).then(res => {
      //   res = res.data;
      //   if (res.status === 200) {

      //   }
      // });
    }
  },
  filters: {
    timeFormat_: function (val) {
      if (!val) {
        return '--'
      } else {
        let time = new Date(val)
        let y = time.getFullYear()
        let M = time.getMonth() + 1
        let D = time.getDate()
        let h = time.getHours()
        let m = time.getMinutes()
        let s = time.getSeconds()
        let time_ = `${y}-${M > 9 ? M : '0' + M}-${D > 9 ? D : '0' + D} ${h > 9 ? h : '0' + h}:${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`;
        return time_.substr(0, 10)
      }
    }
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.width300{
  width: 325px !important;
}
.percent{
  position: relative;
  &::before{
    content: "%";
    position: absolute;
    right: 8px;
    color: #ccc;
  }
}
/deep/.el-form-item{
  margin-bottom: 10px;
}
/deep/.paper-box {
  /*padding-top: 10px !important;
  margin-bottom: 10px;*/
  background-color: #fff;
  border-radius: 2px;
  box-sizing: border-box;
  box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
  .paper-set-tit {
    padding-bottom: 10px;
  }
}
/deep/.margin-left{
  margin-left: 0;
}
.pagination{
  /deep/.pagination-info{
    text-align: right;
    margin-top: 0;
  }
}
.printMaskLayer{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  // display: none;
  z-index: 8888;
}
.contract-list {
  background-color: #fff;
  padding: 0 10px;
  border-radius: 2px;
  box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
  > .listTitle {
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
    // min-width: 80px;
    height: 65px;
    line-height: 65px;
    text-align: center;
    display: -webkit-box;
    /*!autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow:ellipsis;
  }
  .isFlex{
    display: flex;
    align-items: center;
  }
  .shell{
    width: 100%;
    height: 100%;
    display: inline-block;
  }
  .stepInstanceName{
    max-width: 130px;
    color: @color-blue;
    cursor: pointer;
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden;
    display: inline-block;
  }
}
.contract_msg{
  display: flex;
   align-items: center;
  .riskLabel{
    width: 20px;
    padding-right: 20px;
    color: @color-orange;
    font-size: 18px;
    .risk{
      color: @color-warning;
      position: relative;
      .remarksExamine{
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
      &:first-of-type{
        > span{
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
