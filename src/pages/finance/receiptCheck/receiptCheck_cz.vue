<template>
  <el-table class="info-scrollbar" :max-height="tableHeight" border :data="getList" header-row-class-name="theader-bg" style="width: 100%;" @row-dblclick="toDetails">
    <el-table-column min-width="120" label="收款ID" prop="payCode"
                     :formatter="nullFormatter"></el-table-column>
    <el-table-column label="合同信息" min-width="200" prop="cityName" :formatter="nullFormatter">
      <template slot-scope="scope">
        <ul class="contract-msg">
          <li>合同:<span @click="toLink(scope.row,'cz')">{{scope.row.cCode}}</span></li>
          <li class="code-paper" v-if="scope.row.cPaperCode">纸质合同编号:<span @click="toLink(scope.row,'cz')">{{scope.row.cPaperCode}}</span></li>
        </ul>
      </template>
    </el-table-column>
    <el-table-column min-width="120" label="交易方式" prop="transMode"
                     :formatter="nullFormatter"></el-table-column>
    <el-table-column min-width="120" label="签约时间">
      <template slot-scope="scope">
        <span>{{scope.row.signDate|formatTime(false)}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="60" label="成交金额(元)" prop="dealPrice" :formatter="nullFormatter"></el-table-column>
    <el-table-column min-width="90" label="实收/应收（佣金)">
      <template slot-scope="scope">
        <span>{{scope.row.receivedCommission}}/{{scope.row.receivableCommission}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="80" label="收佣状态">
      <template slot-scope="scope">
        <span>{{scope.row.statusReceiveAmount|getLabel}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="120" label="成交经纪人">
      <template slot-scope="scope">
        <span>{{scope.row.dealAgentStoreName}}-{{scope.row.dealAgentName}}</span>
      </template>
    </el-table-column>
    <el-table-column label="店长" min-width="120">
      <template slot-scope="scope">
        <span>{{scope.row.dealAgentStoreName}}-{{scope.row.shopOwnerName}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="90" label="房源编号" prop="houseinfoCode" :formatter="nullFormatter"></el-table-column>
    <el-table-column min-width="90" label="物业地址" prop="address" :formatter="nullFormatter"></el-table-column>
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
        <p class="btn-text-info color-red" type="text" v-if="getUser.user&&(scope.row.nextAuditId!==0&&getUser.user.empId===scope.row.auditId)&&scope.row.state&&scope.row.state.value===3" @click="choseCheckPerson(scope.row,3)">设置审核人</p>
      </template>
    </el-table-column>
    <el-table-column label="创建时间" min-width="120">
      <template slot-scope="scope">
        <span>{{scope.row.createTime|formatTime(false)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="收款时间" min-width="120">
      <template slot-scope="scope">
        <span>{{scope.row.skTime|formatTime(false)}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="80" label="状态">
      <template slot-scope="scope">
        <span>{{scope.row.state|getLabel}}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" fixed="right" min-width="120">
      <template slot-scope="scope">
        <div class="null-context">
          <el-button type="text" @click="cellOpera(scope.row,'edit')" v-if="scope.row.state.value!==1&&power['sign-cz-cw-rev-edit'].state&&scope.row.edit===1">编辑</el-button><el-button type="text" @click="cellOpera(scope.row)" v-if="scope.row.state.value===3&&(getUser.user&&(getUser.user.empId===scope.row.auditId)||scope.row.grabDept)">审核</el-button><div style="color:red" v-if="scope.row.state.value===3&&scope.row.auditId>0&&getUser.user&&scope.row.auditId!==getUser.user.empId">{{scope.row.auditName}}正在审核</div>
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
          'sign-cz-cw-rev-edit': {
            state: false,
            name: '编辑'
          },
          'sign-cz-com-revdetail': {
            state: false,
            name: '收款详情'
          },
          'sign-cz-com-htdetail': {
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
