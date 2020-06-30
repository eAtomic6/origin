<template>
  <div class="firstDetail">
    <div class="msg">
      <div class="title">合同信息</div>
      <div class="content">
        <div class="one_">
          <p style="position:relative;">
            <span class="tag">合同编号：</span>
            <el-tooltip class="item" effect="dark" :content="getDetail.code" placement="bottom">
              <div class="contractDetailCode">
                {{getDetail.code}}
              </div>
            </el-tooltip>
          </p>
          <p style="position:relative;">
            <span class="tag">纸质合同编号：</span>
            <el-tooltip class="item" v-if="getDetail.pCode" effect="dark" :content="getDetail.pCode" placement="bottom">
              <div class="contractDetailCode">
                {{getDetail.pCode?getDetail.pCode:"-"}}
              </div>
            </el-tooltip>
            <span class="text" v-else>-</span>
          </p>
          <p>
            <span class="tag">放款日期：</span>
            <span class="text" v-if="getDetail.contractInfo">{{getDetail.contractInfo.loanDate}}</span>
          </p>
          <p style="position:relative;">
            <span class="tag">项目类型：</span>
            <el-tooltip v-if="getDetail.contractInfo&&getDetail.contractInfo.projectType" class="item" effect="dark" :content="getDetail.contractInfo.projectType" placement="top">
              <div class="contractDetailCode" style="color:#233241;font-weight:100;">
                {{getDetail.contractInfo.projectType}}
              </div>
            </el-tooltip>
            <span class="text" v-else>-</span>
            <!-- <span class="text" v-if="getDetail.contractInfo">{{getDetail.contractInfo.projectType?getDetail.contractInfo.projectType:"-"}}</span> -->
          </p>
        </div>
        <div class="one_">
          <p>
            <span class="tag">放款金额：</span>
            <span class="text" v-if="getDetail.contractInfo">{{getDetail.contractInfo.loanAmount}} 元</span>
          </p>
          <p>
            <span class="tag">期限时间：</span>
            <span class="text" v-if="getDetail.contractInfo">{{getDetail.contractInfo.termStart?`${getDetail.contractInfo.termStart} ~ ${getDetail.contractInfo.termEnd}`:'-'}}</span>
          </p>
        </div>
        <div class="one_">
          <p style="position:relative;">
            <span class="tag">金融专员：</span>
            <el-tooltip v-if="getDetail.contractInfo&&getDetail.contractInfo.financeCommissioner" class="item" effect="dark" :content="getDetail.contractInfo.financeCommissioner" placement="top">
              <div class="contractDetailCode" style="color:#233241;font-weight:100;">
                {{getDetail.contractInfo.financeCommissioner}}
              </div>
            </el-tooltip>
            <span class="text" v-else>-</span>
            <!-- <span class="text" v-if="getDetail.contractInfo">{{getDetail.contractInfo.financeCommissioner?getDetail.contractInfo.financeCommissioner:"-"}}</span> -->
          </p>
          <p style="position:relative;">
            <span class="tag">经办人：</span>
            <el-tooltip v-if="getDetail.contractInfo&&getDetail.contractInfo.transactor" class="item" effect="dark" :content="getDetail.contractInfo.transactor" placement="top">
              <div class="contractDetailCode" style="color:#233241;font-weight:100;">
                {{getDetail.contractInfo.transactor}}
              </div>
            </el-tooltip>
            <span class="text" v-else>-</span>
            <!-- <span class="text" v-if="getDetail.contractInfo">{{getDetail.contractInfo.transactor?getDetail.contractInfo.transactor:"-"}}</span> -->
          </p>
          <p style="position:relative;">
            <span class="tag">受理人：</span>
            <el-tooltip v-if="getDetail.contractInfo&&getDetail.contractInfo.acceptor" class="item" effect="dark" :content="getDetail.contractInfo.acceptor" placement="top">
              <div class="contractDetailCode" style="color:#233241;font-weight:100;">
                {{getDetail.contractInfo.acceptor}}
              </div>
            </el-tooltip>
            <span class="text" v-else>-</span>
            <!-- <span class="text" v-if="getDetail.contractInfo">{{getDetail.contractInfo.acceptor?getDetail.contractInfo.acceptor:"-"}}</span> -->
          </p>
          <p style="position:relative;">
            <span class="tag">岗位名称：</span>
            <el-tooltip v-if="getDetail.contractInfo&&getDetail.contractInfo.positionName" class="item" effect="dark" :content="getDetail.contractInfo.positionName" placement="top">
              <div class="contractDetailCode" style="color:#233241;font-weight:100;">
                {{getDetail.contractInfo.positionName}}
              </div>
            </el-tooltip>
            <span class="text" v-else>-</span>
            <!-- <span class="text" v-if="getDetail.contractInfo">{{getDetail.contractInfo.positionName?getDetail.contractInfo.positionName:"-"}}</span> -->
          </p>
        </div>
        <div class="one_">
          <p>
            <span class="tag">收入金额：</span>
            <span class="text" v-if="getDetail.contractInfo">{{getDetail.contractInfo.incomeAmount}} 元</span>
          </p>
          <p>
            <span class="tag">金融成本比例：</span>
            <span class="text" v-if="getDetail.contractInfo">{{getDetail.contractInfo.financeCostRatio}}</span>
          </p>
          <p>
            <span class="tag">金融成本：</span>
            <span class="text" v-if="getDetail.contractInfo">{{getDetail.contractInfo.financeCost}} 元</span>
          </p>
        </div>
      </div>
    </div>
    <div class="msg">
      <div class="title">房源信息</div>
      <div class="content">
        <div class="one_">
          <p style="position:relative;">
            <span class="tag">房源编号：</span>
            <el-tooltip class="item" effect="dark" :content="getDetail.houseinfoCode" placement="bottom">
              <div class="contractDetailCode">
                {{getDetail.houseinfoCode}}
              </div>
            </el-tooltip>
          </p>
          <p style="width:1000px">
            <span class="tag">U+地址：</span>
            <span class="text" v-if="getDetail.contractInfo">{{getDetail.contractInfo.propertyAddr}}</span>
          </p>
        </div>
        <div class="one_">
          <p style="width:1000px">
            <span class="tag">产权地址：</span>
            <span class="text" v-if="getDetail.contractInfo">{{getDetail.contractInfo.propertyRightAddr}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="msg">
      <div class="title">客源信息</div>
      <div class="content">
        <div class="one_">
          <p>
            <span class="tag">客户姓名：</span>
            <span class="text" v-if="getDetail.contractInfo">{{getDetail.contractInfo.customerName}}</span>
          </p>
          <p>
            <span class="tag">所属区域：</span>
            <span class="text" v-if="getDetail.contractInfo">{{getDetail.contractInfo.customerArea}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="msg">
      <div class="title">签约信息</div>
      <div class="content">
        <div class="one_">
          <p style="position:relative;">
            <span class="tag">成交经纪人：</span>
            <el-tooltip class="item" effect="dark" :content="getDetail.dealAgentStoreName+' - '+getDetail.dealAgentName" placement="top">
              <div class="contractDetailCode" style="color:#233241;font-weight:100;">
                {{getDetail.dealAgentStoreName+" - "+getDetail.dealAgentName}}
              </div>
            </el-tooltip>
          </p>
          <p style="position:relative;">
            <span class="tag">店长：</span>
            <el-tooltip class="item" effect="dark" :content="getDetail.shopOwnerStoreName+' - '+getDetail.shopOwnerName" placement="top">
              <div class="contractDetailCode" style="color:#233241;font-weight:100;">
                {{getDetail.shopOwnerStoreName+" - "+getDetail.shopOwnerName}}
              </div>
            </el-tooltip>
          </p>
        </div>
        <div class="one_">
          <p style="width:1000px">
            <span class="tag">合作方：</span>
            <span class="text">{{getDetail.cooperationName?getDetail.cooperationName:"-"}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="msg">
      <div class="title">店佣信息</div>
      <div class="content">
        <div class="table">
         <el-table :data="getStoreList" border header-row-class-name="theader-bg" style="width:500px">
            <el-table-column label="返店佣金" min-width="120">
              <template slot-scope="scope">
                {{scope.row.amount}}元
              </template>
            </el-table-column>
            <el-table-column label="结款时间" min-width="150">
              <template slot-scope="scope">
                {{scope.row.closingDate|formatTime}}
              </template>
            </el-table-column>
            <el-table-column min-width="100" label="收款人">
              <template slot-scope="scope">
                {{scope.row.employeeName}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
           
<script>
export default {
  props:{
    detail:{
      type: Object,
      default() {
        return {}
      }
    },
    storeList:{
      type: Array,
      default() {
        return []
      }
    },
  },
  data(){
    return{
      clientrData:[],
    }
  },
  computed: {
    getDetail: function() {
      return this.detail;
    },
    getStoreList: function() {
      return this.storeList;
    },
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.contractDetailCode{
  position: absolute;
  left: 100px;
  top:50%;
  transform: translateY(-50%);
  width: 150px;
  display: inline-block;
  box-sizing: border-box;
  color: @color-blue;
  font-weight: bold;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.msg {
  border-bottom: 1px solid @border-ED;
  display: flex;
  padding: 20px 0 20px 0;
  .title {
    width: 70px;
    font-weight: bold;
    color: @color-blank;
    white-space: nowrap;
  }
  .content {
    min-width: 1100px;
    .one_ {
      margin-bottom: 10px;
      &:last-of-type {
        margin-bottom: 0;
      }
      > p {
        width: 270px;
        display: inline-block;
        .tag {
          display: inline-block;
          width: 100px;
          text-align: right;
          color: @color-6c;
        }
        .text {
          color: @color-blank;
        }
        .dealPrice {
          color: @color-yellow;
        }
        .serialNumber {
          color: @color-blue;
          font-weight: bold;
        }
      }
      .address {
        width: 600px;
      }
    }
    .extendParams{
      width: 1000px;
      display: flex;
      flex-wrap: wrap;
      > p{
        display: flex;
        width: 300px;
        padding: 4px 0;
        .tag{
          width: 100px;
          cursor: pointer;
        }
        .text{
          max-width: 110px;
          cursor: pointer;
        }
        .colon{
          color: @color-6c;
        }
        .extendUnit{
          color: @color-6c;
          padding-left: 5px;
        }
        .tagHidden{
          text-overflow:ellipsis;
          white-space:nowrap;
          overflow:hidden;
          display: inline-block;
        }
      }
    }
    .performance {
      > p {
        color: @color-6c;
        .orange {
          color: @color-orange;
        }
      }
    }
    .table {
      padding: 10px 0;
      width: 1050px;
      /deep/ .theader-bg {
        > th {
          background-color: @bg-th;
        }
      }
      i {
        font-size: 20px;
        padding-left: 5px;
        color: #54d384;
        cursor: pointer;
      }
      > p {
        color: @color-6c;
        padding-bottom: 10px;
      }
    }
    .remark {
      display: flex;
      padding-left: 15px;
      >span{
        color: @color-6c;
      }
      > p {
        color: @color-6c;
        width: 650px;
        height: 100px;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid rgba(236, 239, 242, 1);
        background: @bg-FA;
      }
      /deep/.el-textarea.is-disabled .el-textarea__inner{
        color: #606266;
      }
    }
  }
}
</style>