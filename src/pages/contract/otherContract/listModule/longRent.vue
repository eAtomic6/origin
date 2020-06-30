<template>
  <el-table :max-height="tableHeight" class="info-scrollbar" :data="tableDate" style="width: 100%" @row-dblclick='toDetail' border>
    <el-table-column label="合同信息" width="200" fixed>
      <template slot-scope="scope">
        <ul class="contract-msglist">
          <li>合同：<span class="blueColor" @click="toDetail(scope.row)">{{scope.row.code}}</span></li>
          <li v-if="scope.row.pCode">纸质合同编号：<span class="blueColor" @click="toDetail(scope.row)">{{scope.row.pCode}}</span></li>
        </ul>
      </template>
    </el-table-column>

    <el-table-column label="交易方式" min-width="100">
      <template slot-scope="scope">
        <span v-for="item in dictionary['716']" :key="item.key" v-if="item.key==scope.row.contractInfo.transMode">{{item.value}}</span>
      </template>
    </el-table-column>

    <el-table-column label="签约日期" min-width="100">
      <template slot-scope="scope">
        <span>{{Number(scope.row.signDate)|timeFormat_}}</span>
      </template>
    </el-table-column>

    <el-table-column label="成交金额(元)" prop="dealPrice" min-width="100">
      <template slot-scope="scope">
        <span>{{scope.row.dealPrice}}元</span>
      </template>
    </el-table-column>

    <el-table-column label="实收/应收(佣金)" min-width="100">
      <template slot-scope="scope">
        <span>{{scope.row.receivedCommission}}/{{scope.row.receivableCommission}}</span>
      </template>
    </el-table-column>

    <el-table-column label="收佣状态" prop="receiveAmountState.label" min-width="100">
    </el-table-column>

    <el-table-column label="财务收款" min-width="100">
      <template slot-scope="scope">
        <div class="btn" v-if="power['sign-cz-ht-ls-debt'].state" @click="gathering(scope.row)">收款</div>
        <span v-else>-</span>
      </template>
    </el-table-column>

    <el-table-column label="成交经纪人" min-width="120">
      <template slot-scope="scope">
        <p>{{scope.row.dealAgentStoreName}}</p>
        <p>{{scope.row.dealAgentName}}</p>
      </template>
    </el-table-column>

    <el-table-column label="店长" min-width="120">
      <template slot-scope="scope">
        <p>{{scope.row.shopOwnerStoreName}}</p>
        <p>{{scope.row.shopOwnerName}}</p>
      </template>
    </el-table-column>

    <el-table-column label="房源编号" prop="houseinfoCode" min-width="100">
    </el-table-column>

    <el-table-column label="物业地址" min-width="150" show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{scope.row.contractInfo.propertyAddr}}</span>
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
      dictionary: {
        //数据字典
        "716":"",//交易方式
      },
      power: {
        'sign-cz-ht-ls-debt': {
          state: false,
          name: '收款'
        },
      }
    }
  },
  created () {
    this.getDictionary();//字典
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
        return time_.substr(0, 16)
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