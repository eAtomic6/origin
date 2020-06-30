<template>
  <el-table :max-height="tableHeight" class="info-scrollbar" :data="tableDate" style="width: 100%" @row-dblclick='toDetail' border>
    <el-table-column label="合同信息" min-width="200" fixed>
      <template slot-scope="scope">
        <ul class="contract-msglist">
          <li>合同：<span class="blueColor" @click="toDetail(scope.row)">{{scope.row.code}}</span></li>
          <li v-if="scope.row.pCode">纸质合同编号：<span class="blueColor" @click="toDetail(scope.row)">{{scope.row.pCode}}</span></li>
        </ul>
      </template>
    </el-table-column>

    <el-table-column label="项目类型" min-width="120" show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{scope.row.contractInfo.projectType?scope.row.contractInfo.projectType:'-'}}</span>
      </template>
    </el-table-column>

    <el-table-column label="放款日期" min-width="100">
      <template slot-scope="scope">
        <span>{{scope.row.contractInfo.loanDate}}</span>
      </template>
    </el-table-column>

    <el-table-column label="放款金额(元)" min-width="100">
      <template slot-scope="scope">
        <span>{{scope.row.contractInfo.loanAmount}}</span>
      </template>
    </el-table-column>

    <el-table-column label="期限开始时间" min-width="100">
      <template slot-scope="scope">
        <span>{{scope.row.contractInfo.termStart?scope.row.contractInfo.termStart:'-'}}</span>
      </template>
    </el-table-column>

    <el-table-column label="期限结束时间" min-width="100">
      <template slot-scope="scope">
        <span>{{scope.row.contractInfo.termEnd?scope.row.contractInfo.termEnd:'-'}}</span>
      </template>
    </el-table-column>

    <el-table-column label="收入金额(元)" min-width="100">
      <template slot-scope="scope">
        <span>{{scope.row.contractInfo.incomeAmount}}</span>
      </template>
    </el-table-column>

    <el-table-column label="金融成本比例" min-width="100">
      <template slot-scope="scope">
        <span>{{scope.row.contractInfo.financeCostRatio}}%</span>
      </template>
    </el-table-column>

    <el-table-column label="金融成本(元)" min-width="100">
      <template slot-scope="scope">
        <span>{{scope.row.contractInfo.financeCost}}</span>
      </template>
    </el-table-column>

    <el-table-column label="实收佣金(元)" prop="receivedCommission" min-width="100">
    </el-table-column>

    <el-table-column label="杂费(元)" min-width="80">
      <template slot-scope="scope">
        <span>{{scope.row.contractInfo.sundryAmount?scope.row.contractInfo.sundryAmount:'-'}}</span>
      </template>
    </el-table-column>

    <el-table-column label="收佣状态" prop="receiveAmountState.label" min-width="80">
    </el-table-column>

    <el-table-column label="财务收款" min-width="80">
      <template slot-scope="scope">
        <div class="btn" v-if="power['sign-cz-ht-ls-debt'].state" @click="gathering(scope.row)">收款</div>
        <span v-else>-</span>
      </template>
    </el-table-column>

    <el-table-column label="金融专员" min-width="100">
      <template slot-scope="scope">
        <span>{{scope.row.contractInfo.financeCommissioner?scope.row.contractInfo.financeCommissioner:'-'}}</span>
      </template>
    </el-table-column>

    <el-table-column label="经办人" min-width="100">
      <template slot-scope="scope">
        <span>{{scope.row.contractInfo.transactor?scope.row.contractInfo.transactor:'-'}}</span>
      </template>
    </el-table-column>

    <el-table-column label="受理人" min-width="100">
      <template slot-scope="scope">
        <span>{{scope.row.contractInfo.acceptor?scope.row.contractInfo.acceptor:'-'}}</span>
      </template>
    </el-table-column>

    <el-table-column label="成交经纪人" min-width="100">
      <template slot-scope="scope">
        <p>{{scope.row.dealAgentStoreName}}</p>
        <p>{{scope.row.dealAgentName}}</p>
      </template>
    </el-table-column>

    <el-table-column label="店长" min-width="100">
      <template slot-scope="scope">
        <p>{{scope.row.shopOwnerStoreName}}</p>
        <p>{{scope.row.shopOwnerName}}</p>
      </template>
    </el-table-column>

    <el-table-column label="岗位名称" min-width="100">
      <template slot-scope="scope">
        <span>{{scope.row.contractInfo.positionName?scope.row.contractInfo.positionName:'-'}}</span>
      </template>
    </el-table-column>

    <el-table-column label="客户姓名" min-width="100">
      <template slot-scope="scope">
        <span>{{scope.row.contractInfo.customerName}}</span>
      </template>
    </el-table-column>

    <el-table-column label="所属区域" min-width="100">
      <template slot-scope="scope">
        <span>{{scope.row.contractInfo.customerArea}}</span>
      </template>
    </el-table-column>

    <el-table-column prop="houseinfoCode" label="房源编号" min-width="130">
    </el-table-column>

    <el-table-column label="产权地址" min-width="150" show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{scope.row.contractInfo.propertyRightAddr}}</span>
      </template>
    </el-table-column>
  </el-table>
</template>
           
<script>
import { MIXINS } from "@/assets/js/mixins";
export default{
  mixins: [MIXINS],
  props:{
    tableDate:{
      type: Array,
      default() {
        return []
      }
    },
    tableHeight:{
      type: Number,
      default:0
    },
  },
  data(){
    return{
      power: {
        'sign-cz-ht-ls-debt': {
          state: false,
          name: '收款'
        },
      }
    }
  },
  methods:{
    //收款
    gathering(val){
      this.$emit('getMoney',val)
    },
    toDetail(val){
      this.$emit('goDetail',val)
    },
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
}
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.contract-msglist {
  > li {
    text-align: left;
    .blueColor{
      color: @color-blue;
      cursor: pointer;
    }
  }
}  
.btn{
  color: @color-blue;
  cursor: pointer;
}  
</style>