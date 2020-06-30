<template>
  <div class="firstDetail">
    <div class="msg">
      <div class="title">合同信息</div>
      <div class="content">
        <div class="one_">
          <p style="position:relative;">
            <span class="tag">合同编号：</span>
            <el-tooltip class="item" effect="dark" :content="getDetail.code" placement="top-start">
              <div class="contractDetailCode">
                {{getDetail.code}}
              </div>
            </el-tooltip>
          </p>
          <p style="position:relative;">
            <span class="tag">纸质合同编号：</span>
            <el-tooltip class="item" v-if="getDetail.pCode" effect="dark" :content="getDetail.pCode" placement="top-start">
              <div class="contractDetailCode">
                {{getDetail.pCode}}
              </div>
            </el-tooltip>
            <span v-else class="text">-</span>
          </p>
          <p>
            <span class="tag">签约日期：</span>
            <span class="text">{{getDetail.signDate|timeFormat_}}</span>
          </p>
          <p style="position:relative;">
            <span class="tag">项目名称：</span>
            <el-tooltip v-if="getDetail.contractInfo" class="item" effect="dark" :content="getDetail.contractInfo.projectName" placement="top-start">
              <div class="contractDetailCode" style="color:#233241;font-weight:100;">
                {{getDetail.contractInfo.projectName}}
              </div>
            </el-tooltip>
          </p>
        </div>
        <div class="one_">
          <p>
            <span class="tag">成交总价：</span>
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
          <p style="width:1000px">
            <span class="tag">产权地址：</span>
            <span class="text" v-if="getDetail.contractInfo">{{getDetail.contractInfo.propertyRightAddr}}</span>
          </p>
        </div>
        <div class="one_">
          <p>
            <span class="tag">建筑面积：</span>
            <span class="text" v-if="getDetail.contractInfo">{{getDetail.contractInfo.square?`${getDetail.contractInfo.square} m²`:"-"}}</span>
          </p>
          <p>
            <span class="tag">户型：</span>
            <span class="text" v-if="getDetail.contractInfo">{{getDetail.contractInfo.houseType}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="msg">
      <div class="title">客源信息</div>
      <div class="content">
        <div class="one_">
          <p style="position:relative;">
            <span class="tag">客源编号：</span>
            <el-tooltip class="item" effect="dark" :content="getDetail.guestinfoCode" placement="top-start">
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
                <i class="iconfont icon-tubiao_shiyong-16" @click="call(scope.row,scope.$index,'guest')" v-if="power['sign-xf-ht-xq-ly'].state"></i>
              </template>
            </el-table-column>
            <el-table-column label="关系">
              <template slot-scope="scope">
                {{scope.row.relation?scope.row.relation:'-'}}
              </template>
            </el-table-column>
            <el-table-column min-width="150" label="证件号码">
              <template slot-scope="scope">
                <span v-if="scope.row.cardType">{{scope.row.cardType===1?'身份证号：':scope.row.cardType===2?'护照：':scope.row.cardType===3?'营业执照：':'军官证：'}}{{scope.row.cardCode}}</span>
                <span v-else>-</span>
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
    <div class="msg" v-if="getDetail.vouchers&&getDetail.vouchers.length>0||getDetail.remarks">
      <div class="title">其他信息</div>
      <div class="content">
        <div class="other" v-if="getDetail.vouchers&&getDetail.vouchers.length>0">
          <p>附件：</p>
          <ul class="ulData" style="margin-bottom:10px">
            <li v-for="(item,index) in getDetail.vouchers" :key="item.index">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="bottom">
                <div class="namePath" @click="previewPhoto(getDetail.vouchers,index)">
                  <img class="signImage" :src="item.path|getSignImage(getImgList)" alt="" v-if="isPictureFile(item.fileType)">
                  <upload-cell :type="item.fileType" v-else></upload-cell>
                  <p>{{item.name}}</p>
                </div>
              </el-tooltip>
            </li>
          </ul>
        </div>
        <div class="other" v-if="getDetail.remarks&&getDetail.remarks.length>0">
          <p>备注栏：</p>
          <div class="remarkType">
            <el-input style="width:600px" type="textarea" disabled :rows="6" maxlength="200" resize='none' @input="inputCode('remarks')" v-model="getDetail.remarks" placeholder="请输入备注内容"></el-input>
          </div>
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
     <!-- 图片预览 -->
    <preview :imgList="previewFiles" :start="previewIndex" :previewType="previewType" v-if="preview" @close="preview=false"></preview>
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
    imgPathList:{
      type: Array,
      default() {
        return []
      }
    },
  },
  data(){
    return{
      callNumber: "",
      dialogVisible: false,
      canCall:true,
      previewType:'none',
      power:{
        'sign-xf-ht-xq-ly': {
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
      let guestData=this.detail.contractInfo.customerList
      var nowTime = (new Date()).getTime();
      var param = {
        plateType:1,
        // id:value.pid,
        contractCode:this.detail.code,
        sourceType:1,
        calledMobile:value.mobile,
        calledName:value.name
      };
      if(type==='guest'){
        if(guestData[index].time){
          let oldTime = (nowTime-guestData[index].time);
          if(oldTime<300000){
            this.callNumber=guestData[index].virtualNum;
            this.dialogVisible = true;
          }else{
            guestData[index].time=nowTime;
            this.getVirtualNum(param,index,type);
          }
        }else{
          guestData[index].time=nowTime;
          this.getVirtualNum(param,index,type);
        }
        // console.log(guestData,this.detail.contractInfo.customerList)
      }
    },
    //生成虚拟号码
    getVirtualNum(param,index,type){
      let guestData=this.detail.contractInfo.customerList
      this.$ajax.get('/api/record/xinfang/virtualNum',param).then(res=>{
        this.canCall=true;
        res=res.data;
        if(res.status===200){
          if(type==='guest'){
            guestData[index].virtualNum=res.data.virtualNum
          }
          this.callNumber=res.data.virtualNum;
          this.dialogVisible = true;
        }
      }).catch(error=>{
         if(type==='guest'){
          guestData[index].time=''
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
    },
     /**
     * 过滤显示图片缩略图
     * @param val后端返回的所有文件资源遍历的当前项
     * @param list图片资源获取签名后的临时数组
     */
    getSignImage(val,list){
      if(list.length===0){
        return '';
      }else {
        return list.find(item=>{
          return item.includes(val)
        })
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
    getImgList: function() {
      return this.imgPathList;
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
.other{
  margin-bottom: 20px;
  padding-top: 20px;
  >p{
    color: #606266;
    margin-bottom: 10px;
  }
  .ulData{
    display: flex;
    flex-wrap:wrap;
    li{
      margin-right: 10px;
      position: relative;
      margin-bottom: 10px;
      > i{
        display: none;
        position: absolute;
        top: 5px;
        right: 5px;
        color: @color-warning;
        font-size: 20px;
        cursor: pointer;
      }
    }
  }
}
.namePath{
  display: inline-block;
  text-align: center;
  width: 120px;
  height: 120px;
  padding-top: 20px;
  box-sizing: border-box;
  border-radius:4px;
  background: @color-F2;
  .signImage{
    width:60px;
    height: 60px;
    margin: 1px 0;
  }
  > p{
    padding-top: 5px;
    display: inline-block;
    width: 100px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
}
</style>