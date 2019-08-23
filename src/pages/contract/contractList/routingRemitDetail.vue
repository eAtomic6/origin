<template>
  <div class="view-container">
    <el-table :data="tableData" border>
      <el-table-column align="left" label="合同编号" width="140">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.startTime|timeFormat_}}</span> ~ -->
          <span class="contractCode" @click="toDetail(scope.row)">{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="合同类型">
        <template slot-scope="scope">
          {{scope.row.contType.label}}
        </template>
      </el-table-column>
      <el-table-column align="left" prop="address" label="物业地址">
      </el-table-column>
      <el-table-column align="left" label="成交总价">
        <template slot-scope="scope">
          <!-- <span v-if="scope.row.contType.value!==1">{{scope.row.dealPrice}} 元</span>
          <span v-else>{{scope.row.dealPrice}} 元 / {{scope.row.timeUnit}}</span> -->
          <span>{{scope.row.dealPrice}} 元</span>
          <span v-for="item in dictionary['507']" :key="item.key" v-if="item.key===scope.row.timeUnit&&scope.row.contType.value===1"> / {{item.value}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="成交经纪人" min-width="120">
        <template slot-scope="scope">
          {{scope.row.dealAgentStoreName+' - '+scope.row.dealAgentName}}
        </template>
      </el-table-column>
      <el-table-column align="left" label="当期实收(元)" prop="thisSettlement" min-width="90">
      </el-table-column>
      <el-table-column align="left" label="结算比率" prop="ratioSettlementStr">
      </el-table-column>
      <el-table-column min-width="110">
        <template slot="header" slot-scope="scope">
          <span class="openAll" @click="openAll">当期成本(元)<i class="iconfont icon-wenhao" style="padding-left: 5px;color: orange;"></i></span>
        </template>
        <template slot-scope="scope">
          {{scope.row.thisCost}}
        </template>
      </el-table-column>
      <el-table-column v-if="!isOpen">
        <template slot="header" slot-scope="scope">
          <span>金融服务费(元)</span>
        </template>
        <template slot-scope="scope">
          {{scope.row.serviceFee}}
        </template>
      </el-table-column>
      <el-table-column v-if="!isOpen">
        <template slot="header" slot-scope="scope">
          <span>按揭手续费(元)</span>
        </template>
        <template slot-scope="scope">
          {{scope.row.mortgageFee}}
        </template>
      </el-table-column>

      <!-- <el-table-column align="left" label="当期成本(元)" prop="serviceFee">
        <template slot-scope="scope">
          {{scope.row.serviceFee+scope.row.mortgageFee}}
        </template>
      </el-table-column> -->
      <!-- <el-table-column align="left" label="金融服务费(元)" prop="serviceFee" v-if="!isOpen">
      </el-table-column>
      <el-table-column align="left" label="按揭手续费(元)" prop="mortgageFee" v-if="!isOpen">
      </el-table-column> -->
      <el-table-column align="left" label="实际结算(元)" prop="actualSettlement">
      </el-table-column>
      <el-table-column align="left" label="分成人" min-width="120">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.startTime|timeFormat_}}</span> ~ -->
          <p v-for="(item,index) in scope.row.resultDetailsList" :key="index">{{item.disDeptName}} - {{item.disName}}</p>
        </template>
      </el-table-column>
      <el-table-column align="left" label="分成角色">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.startTime|timeFormat_}}</span> ~ -->
          <p v-for="(item,index) in scope.row.resultDetailsList" :key="index">{{item.roleType}}</p>
        </template>
      </el-table-column>
      <el-table-column align="left" label="分成比率">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.startTime|timeFormat_}}</span> ~ -->
          <p v-for="(item,index) in scope.row.resultDetailsList" :key="index">{{item.disRatio}} %</p>
        </template>
      </el-table-column>
      <el-table-column  min-width="140">
        <template slot="header" slot-scope="scope">
          <span class="openAll" @click="openAll_">门店承担成本(元)<i class="iconfont icon-wenhao" style="padding-left: 5px;color: orange;"></i></span>
        </template>
        <template slot-scope="scope">
          {{scope.row.storeCost}}
        </template>
      </el-table-column>
      <el-table-column v-if="!isOpen_">
        <template slot="header" slot-scope="scope">
          <span>特许服务费(元)</span>
        </template>
        <template slot-scope="scope">
          {{scope.row.platformFee}}
        </template>
      </el-table-column>
      <el-table-column v-if="!isOpen_" width="140">
        <template slot="header" slot-scope="scope">
          <span>当期刷卡手续费(元)</span>
        </template>
        <template slot-scope="scope">
          {{scope.row.payCardFee}}
        </template>
      </el-table-column>


      <!-- <el-table-column align="left" label="特许服务费(元)" prop="platformFee">
      </el-table-column>
      <el-table-column align="left" label="当期刷卡手续费(元)" prop="payCardFee" width="140">
      </el-table-column> -->
      <el-table-column align="left" label="当期实收分成(元)" prop="disAmount" width="130">
      </el-table-column>
    </el-table>
    <!-- 固定滚动条 -->
    <!-- <div class="pagination" v-if="tableData.length>0">
      <el-pagination
        class="pagination-info"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div> -->

  </div>
</template>

<script>
import { MIXINS } from "@/assets/js/mixins";

export default {
   mixins: [MIXINS],
  data(){
    return{
      tableData:[],
      // currentPage:1,
      // pageSize:10,
      // total:0,
      ids:'',
      type:'',
      isOpen:true,
      isOpen_:true,
      dictionary: {
        //数据字典
        "507": ""
      },
      power: {
        'sign-com-htdetail': {
          state: false,
          name: '合同详情'
        }
      }
    }
  },
  created() {
    this.ids = this.$route.query.ids;
    this.type = parseInt(this.$route.query.type);
    this.getDictionary();//字典
    if(this.type===1){
      this.setPath(this.$tool.getRouter(['财务','分账记录','分账明细'],'routingRecord'));
    }else if(this.type===2){
      this.setPath(this.$tool.getRouter(['财务','打款记录','打款明细'],'debitRecord'));
    }
    this.getAccountList(this.ids);
  },
  beforeRouteEnter(to,from,next){
    next(em=>{
      if(from.path==='/contractDetails'){
        if(em.type===1){
          em.setPath(em.$tool.getRouter(['财务','分账记录','分账明细'],'routingRecord'));
        }else if(em.type===2){
          em.setPath(em.$tool.getRouter(['财务','打款记录','打款明细'],'debitRecord'));
        }
      }
    })
  },
  methods:{
    //合同详情页
    toDetail(value) {
      if(this.power['sign-com-htdetail'].state){
        // this.setPath(this.$tool.getRouter(['合同','分账记录','合同详情'],'routingRecord'));
        if(value.contType.value===1||value.contType.value===2||value.contType.value===3){
          this.$router.push({
            path: "/contractDetails",
            query: {
              id: value.contId,//合同id
              code: value.code,//合同编号
              contType: value.contType.value//合同类型
            }
          });
        }else{
          this.$router.push({
            path: "/detailIntention",
            query: {
              id: value.id,
              contType: value.contType.value
            }
          });
        }
      }else{
        this.$message({
          message:'没有合同详情查看权限',
          type:'warning'
        })
      }
    },
    //分账明细列表
    getAccountList(ids){
      let param = {
        settleDetailsIds:ids
      };
      let url;
      if(this.type===1){
        url='/api/separate/account/details';
      }else if(this.type===2){
        url='/api/separate/money/out/details'
      }
      this.$ajax.get(url,param).then(res=>{
        res=res.data;
        if(res.status===200){
          this.tableData=res.data;
        }
      })
    },
    openAll(){
      this.isOpen=!this.isOpen;
    },
    openAll_(){
      this.isOpen_=!this.isOpen_;
    }
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";

.view-container{
  padding: 10px;
}
.contractCode{
  cursor: pointer;
  color: @color-blue;
}
/deep/.paper-box {
  padding-top: 10px !important;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 2px;
  box-sizing: border-box;
  box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
  .paper-set-tit {
    padding-bottom: 10px;
  }
}
/deep/ .el-table th {
  background: @bg-th;
}
.openAll{
  cursor: pointer;
}
</style>
