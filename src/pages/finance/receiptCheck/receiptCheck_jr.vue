<template>
    <el-table class="info-scrollbar" :max-height="tableHeight" border :data="getList" header-row-class-name="theader-bg" style="width: 100%;" @row-dblclick="toDetails">
      <el-table-column min-width="120" label="收款ID" prop="payCode"
                       :formatter="nullFormatter"></el-table-column>
      <el-table-column label="合同信息" min-width="200px" prop="cityName" :formatter="nullFormatter">
        <template slot-scope="scope">
          <ul class="contract-msg">
            <li>合同:<span @click="toLink(scope.row,'jr')">{{scope.row.cCode}}</span></li>
            <li class="code-paper" v-if="scope.row.cPaperCode">纸质合同编号:<span @click="toLink(scope.row,'jr')">{{scope.row.cPaperCode}}</span></li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column min-width="120" label="项目类型" prop="projectType"
                       :formatter="nullFormatter"></el-table-column>
      <el-table-column min-width="120" label="放款日期" prop="contType" :formatter="nullFormatter">
        <template slot-scope="scope">
          <span>{{scope.row.loanDate|formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="90" label="放款金额(元)" prop="loanAmount" :formatter="nullFormatter"></el-table-column>
      <el-table-column min-width="120" label="期限开始时间" prop="moneyType" :formatter="nullFormatter">
        <template slot-scope="scope">
          <span>{{scope.row.termStart|formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120" label="期限结束时间" prop="moneyType" :formatter="nullFormatter">
        <template slot-scope="scope">
          <span>{{scope.row.termEnd|formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="90" label="收入金额（元）" prop="incomeAmount" :formatter="nullFormatter"></el-table-column>
      <el-table-column min-width="90" label="金融成本比例" prop="financeCostRatio" :formatter="nullFormatter"></el-table-column>
      <el-table-column min-width="90" label="金融成本（元）" prop="financeCost" :formatter="nullFormatter"></el-table-column>
      <el-table-column min-width="90" label="实收佣金（元）" prop="receivedCommission" :formatter="nullFormatter"></el-table-column>
      <el-table-column min-width="90" label="杂费（元）" prop="sundryAmount" :formatter="nullFormatter"></el-table-column>
      <el-table-column min-width="80" label="收佣状态">
        <template slot-scope="scope">
          <span>{{scope.row.statusReceiveAmount|getLabel}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120" label="金融专员">
        <template slot-scope="scope">
          <span>{{scope.row.financeCommissioner}}</span>
        </template>
      </el-table-column>
      <el-table-column label="经办人" min-width="120">
        <template slot-scope="scope">
          <span>{{scope.row.transactor}}</span>
        </template>
      </el-table-column>
      <el-table-column label="受理人" min-width="120">
        <template slot-scope="scope">
          <span>{{scope.row.acceptor}}</span>
        </template>
      </el-table-column>
      <el-table-column label="成交经纪人" min-width="120">
        <template slot-scope="scope">
          <span>{{scope.row.dealAgentStoreName}}-{{scope.row.dealAgentName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="店长" min-width="120">
        <template slot-scope="scope">
          <span>{{scope.row.dealAgentStoreName}}-{{scope.row.shopOwnerName}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80" label="岗位名称" prop="positionName" :formatter="nullFormatter"></el-table-column>
      <el-table-column min-width="80" label="客户姓名" prop="customerName" :formatter="nullFormatter"></el-table-column>
      <el-table-column min-width="80" label="所属区域" prop="customerArea" :formatter="nullFormatter"></el-table-column>
      <el-table-column min-width="80" label="房源编号" prop="houseinfoCode" :formatter="nullFormatter"></el-table-column>
      <el-table-column min-width="140" label="产权地址" prop="propertyRightAddr" :formatter="nullFormatter"></el-table-column>
      <el-table-column min-width="120" label="收款人">
        <template slot-scope="scope">
          <span>{{scope.row.deptName}}-{{scope.row.employeeName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前审核人" min-width="120">
        <template slot-scope="scope">
          <p v-if="!scope.row.auditDepName&&!scope.row.auditName||(scope.row.state&&scope.row.state.value===2)">-</p>
          <template v-else>
            <span>{{scope.row.auditDepName}}</span>
            <p>{{scope.row.auditName}}</p>
          </template>
          <!--审核状态为审核中3，当前登录人为当前审核人auditId或当前登录人为上一节点审核人preAuditId-->
          <p class="btn-text-info" type="text" v-if="getUser.user&&(getUser.user.empId===scope.row.preAuditId||getUser.user.empId===scope.row.auditId)&&scope.row.state&&scope.row.state.value===3" @click="choseCheckPerson(scope.row,getUser.user.empId===scope.row.auditId?2:1)">{{getUser.user.empId===scope.row.auditId?'转交审核人':'设置审核人'}}</p>
        </template>
      </el-table-column>
      <el-table-column label="下一步审核人" min-width="120">
        <template slot-scope="scope">
          <p v-if="!scope.row.nextAuditDepName&&!scope.row.nextAuditName">-</p>
          <template v-else>
            <span>{{scope.row.nextAuditDepName}}</span>

            <p>{{scope.row.nextAuditName}}</p>
          </template>
          <!--审核状态为审核中3，当前登录人为当前审核人auditId-->
          <p class="btn-text-info color-red" type="text" v-if="getUser.user&&(scope.row.nextAuditId!==0&&getUser.user.empId===scope.row.auditId)&&scope.row.state&&scope.row.state.value===3" @click="choseCheckPerson(scope.row,3)">设置审核人</p>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" :formatter="nullFormatter" min-width="120">
        <template slot-scope="scope">
          <span>{{scope.row.createTime|formatTime(false)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="收款时间" prop="toAccountTime" :formatter="nullFormatter" min-width="120">
        <template slot-scope="scope">
          <span>{{scope.row.skTime|formatTime(false)}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80" label="状态" prop="payStatus">
        <template slot-scope="scope">
          <span>{{scope.row.state|getLabel}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="120">
        <template slot-scope="scope">
          <div class="null-context">
            <el-button type="text" @click="cellOpera(scope.row,'edit')" v-if="scope.row.state.value!==1&&power['sign-jr-cw-rev-edit'].state&&scope.row.edit===1">编辑</el-button><el-button type="text" @click="cellOpera(scope.row)" v-if="scope.row.state.value===3&&(getUser.user&&(getUser.user.empId===scope.row.auditId)||scope.row.grabDept)">审核</el-button><div style="color:red" v-if="scope.row.state.value===3&&scope.row.auditId>0&&getUser.user&&scope.row.auditId!==getUser.user.empId">{{scope.row.auditName}}正在审核</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
</template>

<script>
  import {MIXINS} from "@/assets/js/mixins";
  import {FILTER} from "@/assets/js/filter";
  import {receiptCheck} from "./check";

  export default {
    mixins:[MIXINS,FILTER,receiptCheck],
    data(){
      return {
        //权限配置
        power: {
          'sign-jr-cw-rev-edit': {
            state: false,
            name: '编辑'
          },
          'sign-jr-com-revdetail': {
            state: false,
            name: '收款详情'
          },
          'sign-jr-com-htdetail': {
            state: false,
            name: '合同详情'
          }
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
  /deep/.contract-msg{
    margin: 0;
    text-align: left;
    span{
      color: @color-blue;
      cursor: pointer;
    }
  }
  .null-context:empty{
    position: relative;
    &:before{
      content: '--';
      display: inline-block;
    }
  }
  /deep/ .theader-bg{
    >th>.cell{
      white-space: normal !important;
    }
  }
  .btn-text-info{
    padding: 0;
    color: @color-blue;
    cursor: pointer;
    &.color-red{
      color: red;
    }
  }
</style>
