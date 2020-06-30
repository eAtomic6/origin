<template>
  <div class="view-container">
    <div class="mainContent">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="合同详情" name="detail">
          <!-- <newHouseDetail :style="{ height: clientHei }"></newHouseDetail> -->
          <component v-bind:is="contractType" :imgPathList="imgPathList" :detail="contractDetail" :storeList="storeCommissionList" :style="{ height: clientHei }"></component>
          <div class="footer">
            <div>
              <p><span>录入时间：</span>{{contractDetail.createTime|formatTime}}</p>
              <p><span>录入人：</span>{{contractDetail.recordDeptName}}-{{contractDetail.recordName}}</p>
              <p><span>最后修改：</span>{{contractDetail.updateTime|formatTime}}</p>
            </div>
            <div>
              <el-button v-if="contractType==='newHouseDetail'&&power['sign-xf-ht-xq-edit'].state||contractType==='longRentDetail'&&power['sign-cz-ht-xq-edit'].state||contractType==='financialDetail'&&power['sign-jr-ht-xq-edit'].state" round type="primary" class="search_btn" @click="goEdit">编辑</el-button>
              <!-- <el-button  round type="primary" class="search_btn" @click="goEdit">编辑</el-button> -->
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="回访录音" name="recording" v-if="contractType!=='financialDetail'">
          <div class="type" v-if="contractType==='longRentDetail'&&contractDetail.contractInfo&&contractDetail.contractInfo.transMode===2">
            <div :class="{'active':isActive===1}" @click="changeType(1)">房源</div>
            <div :class="{'active':isActive===2}" @click="changeType(2)">客源</div>
          </div>
          <div class="type" v-else>
            <div class="active onlyOne">{{contractType==='newHouseDetail'?"客源":"房源"}}</div>
          </div>
          <div class="record">
            <el-table :data="recordData" border style="width: 100%" header-row-class-name="theader-bg">
              <el-table-column label="回访时间" width="200">
                <template slot-scope="scope">
                  {{scope.row.startTime|formatTime}}
                </template>
              </el-table-column>
              <el-table-column label="回访人">
                <template slot-scope="scope">
                  <p>{{scope.row.storeName}}</p>
                  <p>{{scope.row.callerName}}</p>
                </template>
              </el-table-column>
              <el-table-column label="回访电话">
                <template slot-scope="scope">
                  {{scope.row.calledMobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}}
                </template>
              </el-table-column>
              <el-table-column prop="recording" label="录音" width="200">
                <template slot-scope="scope">
                  <div class="recordPlay" v-if="scope.row.recording">
                    <span class="playBtn" @click="playStop(scope.$index,scope.row)">
                      <i class="iconfont" :class="[(recordKey===scope.$index)&&isPlay&&!isReady?'icon-tubiao_shiyong-19':'icon-tubiao_shiyong-17',isReady?'icon-loading':'icon-tubiao_shiyong-17']"></i>
                    </span>
                    <span class="duration">
                      <span>{{scope.row.talkTime|SecondFormat}}</span>
                      <!--<el-progress :percentage="recordKey===scope.$index?playTime:0" :show-text="false"></el-progress>-->
                      <el-progress :show-text="false" :percentage="scope.row.recordTime"></el-progress>
                    </span>
                  </div>
                  <span v-else>--</span>
                  <audio :src="scope.row.recordSrc" :id="'audio'+scope.$index"></audio>
                </template>
              </el-table-column>
              <el-table-column label="备注" width="320">
                <template slot-scope="scope">
                  <div v-if="scope.row.remarks">
                    <el-popover trigger="hover" placement="top" v-if="contractType==='newHouseDetail'&&power['sign-xf-ht-xq-ly'].state||contractType==='longRentDetail'&&power['sign-cz-ht-xq-ly'].state||contractType==='financialDetail'&&power['sign-jr-ht-xq-ly'].state">
                      <div style="width:300px">
                        {{scope.row.remarks}}
                      </div>
                      <div slot="reference" class="name-wrapper">
                        {{scope.row.remarks}}
                      </div>
                    </el-popover>
                    <div v-else class="noPower"><i class="iconfont icon-tubiao_shiyong-12"></i> 无权限浏览</div>
                  </div>
                  <p v-else class="iconfont icon-tubiao_shiyong-14 addRemarks" @click="showRemark(scope.row)"> 添加备注</p>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination v-if="recordData.length>0" class="pagination-info" @current-change="handleCurrentChange" :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 回访录音添加备注弹窗 -->
    <el-dialog title="添加备注" :visible.sync="showRemarks" width="740px" :closeOnClickModal="$tool.closeOnClickModal" @close="closeRemarks">
      <div class="top">
        <p class="form-label" style="width:50px"> 备注</p>
        <div class="reason">
          <el-input type="textarea" :rows="6" placeholder="请填写备注，最多100字 " v-model="recordRemarks" resize='none' style="width:640px" maxlength="100"></el-input>
          <span class="recordLength">{{recordRemarks.length}}/100</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="showRemarks = false">取消</el-button>
        <el-button round type="primary" @click="addRemark">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
           
<script>
import { TOOL } from "@/assets/js/common";
import { MIXINS } from "@/assets/js/mixins";
import newHouseDetail from "../otherContract/detailModule/newHouseDetail";
import longRentDetail from "../otherContract/detailModule/longRentDetail";
import financialDetail from "../otherContract/detailModule/financialDetail";

export default {
  mixins: [MIXINS],
  components: {
    newHouseDetail,
    longRentDetail,
    financialDetail,
  },
  data(){
    return{
      activeName:"detail",
      contractDetail:{},
      imgPathList:[],//附件缩略图
      storeCommissionList:[],
      clientHei:"",
      contId:"",//列表带过来的id
      contractType:"",
      isActive:1,//录音类型 1房源 2客源
      currentPage: 1,
      pageSize: 10,
      total:0,
      recordData:[],//录音列表
      recordKey:"",
      isPlay:false,
      isReady:false,
      recordSrc:'',
      showRemarks:false,//录音备注弹窗
      recordRemarks:"",
      remarkId:"",
      power:{
        //新房
        'sign-xf-ht-xq-ly': {
          state: false,
          name: '回访录音'
        },
        'sign-xf-ht-xq-edit': {
          state: false,
          name: '编辑'
        },
        //长租
        'sign-cz-ht-xq-ly': {
          state: false,
          name: '回访录音'
        },
        'sign-cz-ht-xq-edit': {
          state: false,
          name: '编辑'
        },
        //金融
        'sign-jr-ht-xq-ly': {
          state: false,
          name: '回访录音'
        },
        'sign-jr-ht-xq-edit': {
          state: false,
          name: '编辑'
        },
      }
    }
  },
  created () {
    let contractName={
      1:{name:'新房',type:'xf'},
      2:{name:'长租',type:'cz'},
      3:{name:'金融',type:'jr'}
    }
    let routeType
    this.contId=Number(this.$route.query.id)
    if(this.$route.query.type==="newHouse"){
      this.contractType="newHouseDetail"
      this.isActive=2
      routeType=1
    }else if(this.$route.query.type==="longRent"){
      this.contractType="longRentDetail"
      routeType=2
    }else{
      this.contractType="financialDetail"
      routeType=3
    }
    let arr=this.$tool.getRouter([contractName[routeType].name,'合同','合同列表'],`otherContractList?type=${contractName[routeType].type}`);
    arr.push({name:'合同详情',path:this.$route.fullPath});
    this.setPath(arr);
    this.getContractDetail();//合同详情
    this.getStoreCommission();//店佣信息
  },
  methods:{
    // 控制弹框body内容高度，超过显示滚动条
    clientHeight() {
      this.clientHei= document.documentElement.clientHeight -200 + 'px'
    },
    //tab切换
    handleClick(tab, event) {
      this.activeName=tab.name;
      if(tab.name==="recording"){
        this.getRecordList();//电话录音
      }
    },
    //合同详情
    getContractDetail(){
      let url,param
      param = {
        id:this.contId
      }
      if(this.contractType==="newHouseDetail"){
        url="/api/contractInfo/newHouse/detail"
      }else if(this.contractType==="longRentDetail"){
        url="/api/contractInfo/longLease/detail"
      }else{
        url="/api/contractInfo/finance/detail"
      }
      this.$ajax.get(url,param).then(res=>{
        res=res.data
        if(res.status===200){
          this.contractDetail=res.data
          this.$set(this.contractDetail,"contractInfo",JSON.parse(this.contractDetail.contractInfo))
          if(this.contractDetail.vouchers&&this.contractDetail.vouchers.length>0){
            let preloadList=[]
            this.contractDetail.vouchers.forEach((item,index)=>{//判断附件是否为图片，是则存入临时数组获取签名用于缩略图展示
              if(this.isPictureFile(item.fileType)){
                preloadList.push(item.path)
              }
            })
            this.fileSign(preloadList,'preload').then(res=>{
              this.imgPathList=[].concat(res)
            })
          }
        }
      })
    },
    //店佣信息
    getStoreCommission(){
      let param = {
        id:this.contId
        // id:1
      }
      this.$ajax.get("/api/contractInfo/storeCommission",param).then(res=>{
        res=res.data
        if(res.status===200){
          this.storeCommissionList=res.data
        }
      })
    },
    //编辑
    goEdit(){
      let type,router
      if(this.contractType==="newHouseDetail"){
        type="newHouse"
        router="新房"
      }else if(this.contractType==="longRentDetail"){
        type="longRent"
        router="长租"
      }else{
        type="financial"
        router="金融"
      }
      this.$router.replace({
        path: "/addOtherContract",
        query: {
          type: type,
          id: this.contId,
          operationType:2
        }
      });
    },
    //房源客源切换
    changeType(value) {
      this.isActive = value;
      this.currentPage=1;
      let myAudios = document.getElementsByTagName('audio');
      for(var i=0;i<myAudios.length;i++){
        myAudios[i].pause();
      }
      this.playTime=0
      this.recordKey=''
      this.isReady=false
      this.getRecordList();
    },
    //查询录音
    getRecordList(){
      let param = {
        sourceType: this.isActive===1?0:1,
        contractCode: this.contractDetail.code,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      let url
      if(this.contractType==="newHouseDetail"){
        url="/api/record/xinfang/list"
      }else if(this.contractType==="longRentDetail"){
        url="/api/record/longLease/list"
      }
      this.$ajax.get(url, param).then(res=>{
        res=res.data;
        if(res.status===200){
          // this.recordData=res.data.list;
          this.total=res.data.total;
          let recordList = res.data.list
          recordList.forEach(element => {
            if(element.recording){
              if (!window.location.origin) {
                window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
              }
              let http = window.location.origin
              let src = `${http}/api/record/download?recording=${element.recording}`
              element.recordSrc=src
              element.recordTime=0
              element.secondTime=0
            }
          });
          this.recordData=recordList
        }
      }).catch(error=>{
        this.$message({
          message:error,
          type: "error"
        })
      })
    },
    //翻页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getRecordList();
    },
    //添加备注弹窗
    showRemark(item){
      if(this.power['sign-xf-ht-xq-ly'].state){
        this.showRemarks=true;
        this.remarkId = item.id;
      }else{
        // this.noPower('添加备注')
        this.$message({
          message:"没有添加备注权限",
          type:"warning"
        })
      }
    },
    //添加备注
    addRemark(){
      if(this.recordRemarks.length>0){
        this.recordRemarks=this.recordRemarks.replace(/\s/g,"");
        if(this.recordRemarks.length>0){
          let param = {
            remarks:this.recordRemarks,
            id:this.remarkId
          }
          this.$ajax.put('/api/record/update',param, 2).then(res=>{
            res=res.data;
            if(res.status===200){
              this.showRemarks=false;
              this.$message({
                message:'添加成功'
              });
              this.getRecordList();
            }
          }).catch(error=>{
            this.$message({
              message:error,
              type: "error"
            })
          })
        }else{
          this.$message({
            message:"备注不能为空",
            type: "warning"
          })
        }
      }else{
        this.$message({
          message:"备注不能为空",
          type: "warning"
        })
      }
    },
    //关闭录音备注弹窗
    closeRemarks(){
      this.showRemarks=false;
      this.recordRemarks='';
      this.remarkId='';
    },
    //播放录音
    playStop(index,row){
      if(this.contractType==="newHouseDetail"&&this.power['sign-xf-ht-xq-ly'].state||this.contractType==="longRentDetail"&&this.power['sign-cz-ht-xq-ly'].state||this.contractType==="financialDetail"&&this.power['sign-jr-ht-xq-ly'].state){
        let id = 'audio'+index;
        let myAudios = document.getElementsByTagName('audio');
        let myAudio = document.getElementById(id);
        if(index!=this.recordKey){
          this.playTime=0
        }
        this.recordKey=index;
        if (myAudio.paused){
          for(var i=0;i<myAudios.length;i++){
            myAudios[i].pause();
          }
          myAudio.play();
          this.isPlay=true;
        }else{
          myAudio.pause();
          this.isPlay=false;
        }
        var that=this
        myAudio.ontimeupdate = function (e) {
          that.isReady=false
          console.log(myAudio.duration,myAudio.readyState,myAudio.networkState)
          if(!myAudio.duration){
            if(myAudio.paused){
              return
            }else{
              that.isReady=true
              return
            }
          }
          let playTime_=(myAudio.currentTime/myAudio.duration)*100;
          if(playTime_){
            row.recordTime=playTime_
            row.secondTime=myAudio.currentTime
          }
        };
        myAudio.onended=function(e){
          row.recordTime=0;
          that.isPlay=false;
          myAudio.pause();
        }
      }else{
        this.$message({
          message:"没有听取录音权限",
          type:"warning"
        })
        // this.noPower('听取录音')
      }

    },

    //下载录音
    downloadRecord(){
      let param = {
        recording:'82c17a1fe080c3043f7581bbcb97ca6a'
      }
      this.$ajax.get('/api/record/downloadRecord',param).then(res=>{
        res=res.data;
        if(res.status===200){

        }
      })
    },
  },
  filters: {
    moneyFormat: function(val) {
      if (!val) {
        return "零";
      } else {
        return TOOL.toChineseNumber(val);
      }
    },
    //秒转时分秒
    SecondFormat: function(result){
      var h = Math.floor(result / 3600) < 10 ? '0'+Math.floor(result / 3600) : Math.floor(result / 3600);
      var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
      var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
      return result = h + ":" + m + ":" + s;
    },
  },
  mounted(){
    window.onresize = this.clientHeight;
  },
  beforeUpdate() {
    this.clientHeight();
  },
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.view-container {
  position: relative;
  min-height: 100%;
  padding-left: 20px;
  background: @bg-white;
  font-size: 14px;
  .firstDetail{
    overflow-y: auto;
  }
  .mainContent{
    .type {
      margin-top: 20px;
      width: 168px;
      height: 36px;
      align-items: center;
      box-sizing: border-box;
      border: 2px solid @color-blue;
      border-radius: 18px;
      overflow: hidden;
      display: flex;
      > div {
        width: 50%;
        height: 36px;
        line-height: 36px;
        text-align: center;
        font-size: 14px;
        color: @color-blue;
        cursor: pointer;
      }
      .onlyOne{
        width: 100%;
      }
      .active {
        background: @color-blue;
        color: @color-white;
      }
    }
    .record {
      width: 950px;
      padding-top: 20px;
      .name-wrapper {
        text-overflow:ellipsis;
        white-space:nowrap;
        overflow:hidden;
      }
      .noPower{
        width:300px;
        text-align:center
      }
      .addRemarks{
        font-size: 14px;
        color: @color-blue;
        cursor: pointer;
        display: inline-block;
        width: 299px;
        text-align: center;
      }
      .recordPlay{
        .playBtn{
          cursor: pointer;
          >i{
            font-size: 28px;
            color: #9BB3CB;
          }
        }
        .duration{
          display: inline-block;
          width: 140px;
          .totalTime{
            display: inline-block;
            width: 140px;
            height: 6px;
            background: #E8EAF6;
            position: relative;
            border-radius: 3px;
            .playTime{
              position: absolute;
              top: 0;
              left: 0;
              width: 10px;
              height: 8px;
              border-radius: 4px;
              background: @color-blue;
            }
          }
        }
      }
    }
    /deep/.el-tabs{
      .el-tabs__header {
        margin-bottom: 0;
      }
      .el-tabs__item {
        font-size: 18px;
        height: 50px;
        line-height: 50px;
      }
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      p {
        color: @color-6c;
        display: inline-block;
        padding-right: 20px;
        font-size: 12px;
      }
      > div {
        &:last-of-type {
          padding-right: 20px;
          /deep/.el-button.is-round {
            padding: 10px 20px;
          }
        }
      }
    }
  }
  .top {
    display: flex;
    padding-top: 20px;
    > p {
      padding-right: 15px;
      font-size: 14px;
      width: 90px;
      color: @color-6c;
    }
    >.invalid{
      font-size: 16px;
      width: 120px;
    }
    > .reason {
      position: relative;
      /deep/.el-textarea{
        textarea{
          min-height: 120px!important;
        }
      }
      > .recordLength {
        position: absolute;
        bottom: 10px;
        right: 20px;
        color: @color-6c;
      }
      > .invalidReasonLength{
        position: absolute;
        bottom: 35px;
        right: 20px;
        color: @color-6c;
      }
      > p {
        padding-top: 10px;
        color: @color-6c;
        font-size: 12px;
        > span {
          color: @color-blank;
        }
      }
    }
  }
}
</style>