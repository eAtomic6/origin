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
            <el-tooltip v-if="getDetail.pCode" class="item" effect="dark" :content="getDetail.pCode" placement="bottom">
              <div class="contractDetailCode" >
                 {{getDetail.pCode}}
              </div>
            </el-tooltip>
            <span class="text" v-else>--</span>
          </p>
          <p>
            <span class="tag">签约日期：</span>
            <span class="text">{{getDetail.signDate|timeFormat_}}</span>
          </p>
          <p>
            <span class="tag">交易方式：</span>
            <span class="text" v-if="getDetail.contractInfo">{{getDetail.contractInfo.transMode===1?'收房':'出房'}}</span>
          </p>
        </div>
        <div class="one_">
          <p>
            <span class="tag">成交金额：</span>
            <span class="text">{{getDetail.dealPrice}} 元</span>
          </p>
          <p>
            <span class="tag">应收佣金：</span>
            <span class="text">{{getDetail.receivableCommission}} 元</span>
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
            <span class="tag">房源地址：</span>
            <span class="text" v-if="getDetail.contractInfo">{{getDetail.contractInfo.propertyAddr}}</span>
          </p>
        </div>
        <div class="table" v-if="getDetail.contractInfo">
          <el-table :data="getDetail.contractInfo.ownerList" border header-row-class-name="theader-bg">
            <el-table-column prop="name" label="客户姓名"></el-table-column>
            <el-table-column label="电话">
              <template slot-scope="scope">
                {{scope.row.encryptionMobile}}
                <i class="iconfont icon-tubiao_shiyong-16" @click="call(scope.row,scope.$index,'owner')" v-if="power['sign-cz-ht-xq-ly'].state"></i>
              </template>
            </el-table-column>
            <el-table-column prop="relation" label="关系"></el-table-column>
            <el-table-column min-width="150" label="证件号码">
              <template slot-scope="scope">
                {{scope.row.cardType===1?'身份证号：':scope.row.cardType===2?'护照：':scope.row.cardType===3?'营业执照：':'军官证：'}}{{scope.row.cardCode}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="msg" v-if="getDetail.contractInfo&&getDetail.contractInfo.transMode===2">
      <div class="title">客源信息</div>
      <div class="content">
        <div class="one_">
          <p style="position:relative;">
            <span class="tag">客源编号：</span>
            <el-tooltip class="item" effect="dark" :content="getDetail.guestinfoCode" placement="bottom">
              <div class="contractDetailCode">
                {{getDetail.guestinfoCode}}
              </div>
            </el-tooltip>
          </p>
        </div>
        <div class="table" v-if="getDetail.contractInfo">
          <el-table :data="getDetail.contractInfo.customerList" border header-row-class-name="theader-bg">
            <el-table-column prop="name" label="客户姓名"></el-table-column>
            <el-table-column label="电话">
              <template slot-scope="scope">
                {{scope.row.encryptionMobile}}
                <i class="iconfont icon-tubiao_shiyong-16" @click="call(scope.row,scope.$index,'guest')" v-if="power['sign-cz-ht-xq-ly'].state"></i>
              </template>
            </el-table-column>
            <el-table-column prop="relation" label="关系"></el-table-column>
            <el-table-column min-width="150" label="证件号码">
              <template slot-scope="scope">
                {{scope.row.cardType===1?'身份证号：':scope.row.cardType===2?'护照：':scope.row.cardType===3?'营业执照：':'军官证：'}}{{scope.row.cardCode}}
              </template>
            </el-table-column>
          </el-table>
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
    <!-- 拨号弹出框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="460px" :closeOnClickModal="$tool.closeOnClickModal">
      <div>
        <div class="icon">
          <i class="el-icon-success"></i>
        </div>
        <div class="text">
          <p>号码绑定成功！ </p>
          <p>请拨打此号码 {{callNumber}} 联系客户</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
           
<script>
import { MIXINS } from "@/assets/js/mixins";
export default {
  mixins: [MIXINS],
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
      clientrData:[],//店佣
      callNumber: "",
      dialogVisible: false,
      canCall:true,
      power:{
        'sign-cz-ht-xq-ly': {
          state: false,
          name: '拨打电话'
        },
      },
    }
  },
  created () {
    this.getAdmin();//获取当前登录人信息
  },
  methods:{
    //打电话
    call(value,index,type) {
      let ownerData=this.detail.contractInfo.ownerList
      let clientrData=this.detail.contractInfo.customerList
      var nowTime = (new Date()).getTime();
      var param = {
        plateType:2,
        // id:value.pid,
        contractCode:this.detail.code,
        sourceType:type==="owner"?0:1,
        calledMobile:value.mobile,
        calledName:value.name
      };
      if(type==='owner'){
        if(ownerData[index].time){
          let oldTime = (nowTime-ownerData[index].time);
          if(oldTime<300000){
            this.callNumber=ownerData[index].virtualNum;
            this.dialogVisible = true;
          }else{
            ownerData[index].time=nowTime;
            this.getVirtualNum(param,index,type);
          }
        }else{
          ownerData[index].time=nowTime;
          this.getVirtualNum(param,index,type);
        }
      }else if(type==='guest'){
        if(clientrData[index].time){
          let oldTime = (nowTime-clientrData[index].time);
          if(oldTime<300000){
            this.callNumber=clientrData[index].virtualNum;
            this.dialogVisible = true;
          }else{
            clientrData[index].time=nowTime;
            this.getVirtualNum(param,index,type);
          }
        }else{
          clientrData[index].time=nowTime;
          this.getVirtualNum(param,index,type);
        }
      }
    },
    //生成虚拟号码
    getVirtualNum(param,index,type){
      let ownerData=this.detail.contractInfo.ownerList
      let clientrData=this.detail.contractInfo.customerList
      this.$ajax.get('/api/record/longLease/virtualNum',param).then(res=>{
        this.canCall=true;
        res=res.data;
        if(res.status===200){
          if(type==='owner'){
            ownerData[index].virtualNum=res.data.virtualNum
          }else if(type==='guest'){
            clientrData[index].virtualNum=res.data.virtualNum
          }
          this.callNumber=res.data.virtualNum;
          this.dialogVisible = true;
        }
      }).catch(error=>{
        if(type==='owner'){
          ownerData[index].time=''
        }else if(type==='guest'){
          clientrData[index].time=''
        }
        this.canCall=true;
        this.$message({
          message:error,
          type: "error"
        })
      })
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
.blankColor{
  color:blank;
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
  }
}
/deep/.el-dialog__body {
  .icon {
    text-align: center;
    font-size: 50px;
    padding-bottom: 15px;
    padding-top: 25px;
    color: #54d384;
  }
  .text {
    text-align: center;
    padding-bottom: 30px;
    p {
      line-height: 30px;
    }
  }
}
</style>