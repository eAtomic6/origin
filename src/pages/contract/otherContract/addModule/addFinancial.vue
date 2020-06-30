<template>
  <div>
    <el-form :inline="true" :model="contractForm" class="add-form" size="small" :style="{ height: tableHeight }">
      <!-- 合同信息 -->
      <div class="contractMsg">
        <p>合同信息</p>
        <div class="form-content">
          <el-form-item label="放款日期：" class="form-label width-250">
            <!-- <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="contractForm.loanDate" style="width:140px"></el-date-picker> -->
            <el-date-picker
              style="width:140px"
              :disabled="operationType===2?true:false"
              v-model="contractForm.loanDate"
              type="datetime"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间"
              :picker-options="pickerOptions"
              default-time="12:00:00">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="纸质合同编号：" style="width:380px;text-align:right;">
            <input style="width:200px;" type="text" maxlength="30" v-model="contractForm.pCode" @input="inputCode('pCode')" placeholder="请输入" class="dealPrice">
          </el-form-item>
          <el-form-item label="项目类型：" style="width:320px;text-align:right;">
            <input style="width:200px;" type="text" maxlength="100" v-model="contractForm.projectType" @input="inputCode('projectType')" placeholder="请输入" class="dealPrice">
          </el-form-item>
          <br>
          <el-form-item label="放款金额：" class="form-label width-250">
            <input type="text" v-model="contractForm.loanAmount" @input="cutNumber('loanAmount')" @change="countCost" placeholder="请输入内容" class="dealPrice">
            <i class="yuan">元</i>
          </el-form-item>
          <el-form-item label="期限时间：" style="width:510px;text-align:right;">
            <el-date-picker v-model="termData" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width:330px">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="金融专员：" style="width:270px;text-align:right;">
            <input type="text" maxlength="10" v-model="contractForm.financeCommissioner" @input="inputOnly('financeCommissioner')" placeholder="请输入" class="dealPrice">
          </el-form-item>
          <br>
          <el-form-item label="经办人：" class="width-250">
            <input type="text" maxlength="10" v-model="contractForm.transactor" @input="inputOnly('transactor')" placeholder="请输入" class="dealPrice">
          </el-form-item>
          <el-form-item label="受理人：" style="width:320px;text-align:right;">
            <input type="text" maxlength="10" v-model="contractForm.acceptor" @input="inputOnly('acceptor')" placeholder="请输入" class="dealPrice">
          </el-form-item>
          <el-form-item label="岗位名称：" style="width:245px;text-align:right;">
            <input type="text" maxlength="10" v-model="contractForm.positionName" @input="inputOnly('positionName')" placeholder="请输入" class="dealPrice">
          </el-form-item>
          <br>
          <el-form-item label="收入金额：" class="form-label width-250">
            <input type="text" v-model="contractForm.incomeAmount" @input="cutNumber('incomeAmount')" placeholder="请输入" class="dealPrice">
            <i class="yuan">元</i>
          </el-form-item>
          <el-form-item label="金融成本比例：" class="form-label" style="width:320px;text-align:right;">
            <input type="text" v-model="contractForm.financeCostRatio" @input="cutNumber('financeCostRatio')" @change="countCost" placeholder="请输入" class="dealPrice">
            <i class="yuan">%</i>
          </el-form-item>
          <el-form-item label="金融成本：" class="form-label width-250">
            <input type="text" v-model="contractForm.financeCost" disabled @input="cutNumber('financeCost')" placeholder="请输入" class="dealPrice">
            <i class="yuan">元</i>
          </el-form-item>
          <br>
          <el-form-item label="杂费：" class="width-250">
            <input type="text" v-model="contractForm.sundryAmount" @input="cutNumber('sundryAmount')" placeholder="请输入" class="dealPrice">
            <i class="yuan">元</i>
          </el-form-item>
        </div>
      </div>
      <!-- 房源信息 -->
      <div class="houseMsg">
        <p>房源信息</p>
        <div class="form-content">
          <el-form-item label="房源编号：" class="width-250 form-label">
            <!-- <input type="text" v-model="contractForm.houseinfoCode" @input="inputCode('houseinfoCode')" placeholder="请输入内容" class="dealPrice"> -->
            <el-input style="width:140px;" type="text" maxlength="20" v-model="contractForm.houseinfoCode" :clearable="true" @input="inputCode('houseinfoCode')" placeholder="请输入内容"></el-input>
          </el-form-item>
          <span class="select" @click="showDialog">请选择房源</span>
          <br>
          <el-form-item label="U+地址：" style="width:705px;text-align:right">
            <input v-model="contractForm.propertyAddr" maxlength="10" placeholder="请输入" @input="inputCode('propertyAddr')" class="dealPrice" style="width:600px" />
          </el-form-item>
          <br>
          <el-form-item label="产权地址：" class="form-label" style="width:750px;text-align:right">
            <input v-model="rightAddrCity" maxlength="10" placeholder="请输入" @input="cutAddress('city')" class="dealPrice" style="width:100px" /> 市
            <input v-model="rightAddrArea" maxlength="10" placeholder="请输入" @input="cutAddress('area')" class="dealPrice" style="width:100px" /> 区
            <input v-model="rightAddrDetail" maxlength="70" placeholder="详细地址" @input="cutAddress('detail')" class="dealPrice" style="width:400px" />
          </el-form-item>
        </div>
      </div>
      <!-- 客源信息 -->
      <div class="houseMsg">
        <p>客源信息</p>
        <div class="form-content">
          <el-form-item label="客户姓名：" class="form-label" style="width:245px;text-align:right;">
            <input type="text" v-model="contractForm.customerName" @input="inputOnly('customerName')" placeholder="请输入" class="dealPrice">
          </el-form-item>
          <el-form-item label="所属区域：" class="form-label" style="width:245px;text-align:right;">
            <el-select v-model="contractForm.customerArea" placeholder="全部" :clearable="true" style="width:150px">
              <el-option v-for="(item,index) in areaNameList" :key="index" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <!-- 签约信息 -->
      <div class="houseMsg">
        <p>签约信息</p>
        <div class="form-content">
          <el-form-item label="成交经纪人：" class="form-label" style="width:355px;text-align:right">
            <el-select
              style="width:100px"
              v-model="contractForm.dealAgentId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入"
              @change="selectOption($event,'agent')"
              :remote-method="(val)=>remoteMethod(val,'agent')">
              <el-option
                v-for="item in options"
                :key="item.empId"
                :label="item.empName"
                :value="item.empId">
                <span style="float: left">{{ item.empName+"-"+item.depName }}</span>
              </el-option>
            </el-select>
            <el-tooltip class="item" effect="dark" :content="contractForm.dealAgentStoreName" placement="top" v-if="contractForm.dealAgentStoreName&&contractForm.dealAgentStoreName.length>7">
              <span>
                <input type="text" placeholder="所属门店" disabled class="dealPrice storeStyle" v-model="contractForm.dealAgentStoreName">
              </span>
            </el-tooltip>
            <input type="text" placeholder="所属门店" disabled class="dealPrice storeStyle" v-model="contractForm.dealAgentStoreName" v-else>
          </el-form-item>
          <el-form-item label="店长：" class="form-label" style="width:300px;text-align:right">
            <el-select
              style="width:100px"
              v-model="contractForm.shopOwnerId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入"
              @change="selectOption($event,'owner')"
              :remote-method="(val)=>remoteMethod(val,'owner')">
              <el-option
                v-for="item in options_"
                :key="item.empId"
                :label="item.empName"
                :value="item.empId">
                <span style="float: left">{{ item.empName+"-"+item.depName }}</span>
              </el-option>
            </el-select>
             <el-tooltip class="item" effect="dark" :content="contractForm.shopOwnerStoreName" placement="top" v-if="contractForm.shopOwnerStoreName&&contractForm.shopOwnerStoreName.length>7">
              <span>
                <input type="text" placeholder="所属门店" disabled class="dealPrice storeStyle" v-model="contractForm.shopOwnerStoreName">
              </span>
            </el-tooltip>
            <input type="text" placeholder="所属门店" disabled class="dealPrice storeStyle" v-model="contractForm.shopOwnerStoreName" v-else>
          </el-form-item>
          <br>
          <el-form-item label="合作方：" style="width:330px;text-align:right">
            <input v-model="contractForm.cooperationName" maxlength="30" placeholder="请输入" @input="inputOnly(0,'cooperationName')" class="dealPrice" style="width:200px" /> 
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="btn">
      <div>
        <div v-if="getOperationType===2">
          <p><span>录入时间：</span>{{contractForm.createTime|formatTime}}</p>
          <p><span>录入人：</span>{{contractForm.recordDeptName}}-{{contractForm.recordName}}</p>
          <p><span>最后修改：</span>{{contractForm.updateTime|formatTime}}</p>
        </div>
      </div>
      <div>
        <el-button type="primary" round @click="toSave" v-loading.fullscreen.lock="fullscreenLoading">保存</el-button>
      </div>
    </div>
     <!-- 房源客源弹窗 -->
    <houseGuest
    dialogType="house"
    :dialogVisible="isShowDialog"
    :choseHcode="choseHcode"
    :choseGcode="choseGcode"
    @closeHouseGuest="closeHouseGuest"
    v-if="isShowDialog">
    </houseGuest>
  </div>
</template>
           
<script>
import { TOOL } from "@/assets/js/common";
import { MIXINS } from "@/assets/js/mixins";
import houseGuest from "../../contractDialog/houseGuest";

const rule = {
  loanDate: {
    name: "放款日期"
  },
  loanAmount:{
    name:"放款金额",
    type: "money"
  },
  incomeAmount: {
    name: "收入金额",
    type: "money"
  },
  financeCostRatio: {
    name: "金融成本比例",
  },
  houseinfoCode: {
    name: "房源"
  },
};
let loading = null
export default {
  mixins: [MIXINS],
  components: {
    houseGuest
  },
  props:{
    //操作类型  1 新增  2  编辑
    operationType: {
      type: Number,
      default: 1
    },
    contId: {
      type: Number,
      default: ""
    },
    tableHeight:{
      type: String,
      default:''
    },
  },
  data(){
    return{
      contractForm:{
        loanDate:"",
        loanAmount:"",
        financeCommissioner:"",
        transactor:"",
        acceptor:"",
        positionName:"",
        incomeAmount:"",
        financeCostRatio:"",
        financeCost:"",
        houseinfoCode:"",
        propertyAddr:"",
        customerName:"",
        customerArea:"",
        dealAgentId:"",
        dealAgentName:"",
        dealAgentStoreId:"",
        dealAgentStoreName:"",
        shopOwnerId:"",
        shopOwnerName:"",
        shopOwnerStoreId:"",
        shopOwnerStoreName:"",
        cooperationName:"",
      },
      termData:[],
      rightAddrCity:'',
      rightAddrArea:'',
      rightAddrDetail:'',
      //所属区域
      areaNameList:[],
      //经纪人
      options:[],
      // 店长
      options_:[],
      dictionary: {
        //数据字典
        "633":"",//证件类型(护照,身份证,营业执照)
      },
      //房客源弹窗
      isShowDialog:false,
      choseHcode:0,
      choseGcode:0,
      fullscreenLoading:false,//加载loading动画
      //日期选择器禁止选择未来时间
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
    }
  },
  created () {
    this.getDictionary();//字典
    this.getRegion();//获取客户所属区域
    if(this.operationType===1){
      this.getNewData();//当前时间
    }else{
      this.getContractDetail()
    }
  },
  methods:{
     //合同详情
    getContractDetail(){
      let param = {
        id:this.contId
      }
      this.$ajax.get("/api/contractInfo/finance/detail",param).then(res=>{
        res=res.data
        if(res.status===200){
          let contractDetail=res.data
          this.$set(contractDetail,"contractInfo",JSON.parse(contractDetail.contractInfo))
          delete contractDetail.code
          delete contractDetail.cityId
          delete contractDetail.guestinfoCode
          delete contractDetail.dealAgentStoreSystemtag
          delete contractDetail.receiveAmountState
          delete contractDetail.recordDept
          delete contractDetail.recordId
          delete contractDetail.recordDeptSystemtag
          delete contractDetail.tradeType
          delete contractDetail.updateBy
          delete contractDetail.updateName
          delete contractDetail.receivedCommission
          //放款日期
          contractDetail.loanDate= contractDetail.contractInfo.loanDate
          //项目类型
          contractDetail.projectType= contractDetail.contractInfo.projectType
          // 放款金额
          contractDetail.loanAmount= contractDetail.contractInfo.loanAmount
          // 期限时间
          if(contractDetail.contractInfo.termStart){
            this.termData=[contractDetail.contractInfo.termStart,contractDetail.contractInfo.termEnd]
          }
          //金融专员
          contractDetail.financeCommissioner= contractDetail.contractInfo.financeCommissioner
          //经办人
          contractDetail.transactor= contractDetail.contractInfo.transactor
          //受理人
          contractDetail.acceptor= contractDetail.contractInfo.acceptor
          //岗位名称
          contractDetail.positionName= contractDetail.contractInfo.positionName
          //收入金额
          contractDetail.incomeAmount= contractDetail.contractInfo.incomeAmount
          //金融成本比例
          contractDetail.financeCostRatio= contractDetail.contractInfo.financeCostRatio
          //金融成本
          contractDetail.financeCost= contractDetail.contractInfo.financeCost
          //杂费
          contractDetail.sundryAmount= contractDetail.contractInfo.sundryAmount
          // 房源信息
          contractDetail.houseInfo=contractDetail.contractInfo.houseInfo
          //房源编号
          // contractDetail.houseInfo=contractDetail.contractInfo.houseInfo
          //U+地址
          contractDetail.propertyAddr=contractDetail.contractInfo.propertyAddr
          // 产权地址
          let rightAddress = contractDetail.contractInfo.propertyRightAddr
          let index1 = rightAddress.indexOf('市')
          let index2 = rightAddress.indexOf('区')
          if(index1>0){
            this.rightAddrCity=rightAddress.substring(0,index1)
          }
          if(index2>0){
            if(index1>0){
              this.rightAddrArea=rightAddress.substring(index1+1,index2)
            }else{
              this.rightAddrArea=rightAddress.substring(0,index2)
            }
          }
          if(index1>0&&index2>0){
            this.rightAddrDetail=rightAddress.substring(index2+1)
          }else if(index1>0&&index2<0){
            this.rightAddrDetail=rightAddress.substring(index1+1)
          }else if(index1<0&&index2>0){
            this.rightAddrDetail=rightAddress.substring(index2+1)
          }else{
            this.rightAddrDetail=rightAddress
          }
          //客源信息
          // 客户姓名
          contractDetail.customerName= contractDetail.contractInfo.customerName
          // 所属区域
          contractDetail.customerArea= contractDetail.contractInfo.customerArea
          //经纪人
          let option = {
            empId:contractDetail.dealAgentId,
            empName:contractDetail.dealAgentName,
            depId:contractDetail.dealAgentStoreId,
            depName:contractDetail.dealAgentStoreName
          }
          this.options=[option]
          // 店长
          let option_ = {
            empId:contractDetail.shopOwnerId,
            empName:contractDetail.shopOwnerName,
            depId:contractDetail.shopOwnerStoreId,
            depName:contractDetail.shopOwnerStoreName
          }
          this.options_=[option_]
          console.log(contractDetail)
          delete contractDetail.contractInfo
          this.contractForm=contractDetail
        }
      })
    },
    //获取当前日期
    getNewData(){
      let time = new Date()
      let y = time.getFullYear()
      let M = time.getMonth() + 1
      let D = time.getDate()
      let h = time.getHours()
      let m = time.getMinutes()
      let s = time.getSeconds()
      let time_ = `${y}-${M > 9 ? M : '0' + M}-${D > 9 ? D : '0' + D} ${h > 9 ? h : '0' + h}:${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`;
      this.contractForm.loanDate=time_
    },
    //获取客户所属区域
    getRegion(){
      this.$ajax.get("/api/organize/currentdep/areaname").then(res=>{
        res=res.data
        if(res.status===200){
          this.areaNameList=res.data
        }
      })
    },
    //计算金融成本
    countCost(){
      if(this.contractForm.loanAmount&&(this.contractForm.financeCostRatio||this.contractForm.financeCostRatio==="0")){
        // this.contractForm.financeCost
        let result = Number(this.contractForm.loanAmount)*Number(this.contractForm.financeCostRatio)/100
        this.contractForm.financeCost=this.fomatFloat(result,2)
      }
    },
    //运算时四舍五入保留两位小数 num为传入的值，n为保留的小数位
    fomatFloat: function(num, n) {
      var f = parseFloat(num);
      if (isNaN(f)) {
        return false;
      }
      f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); // n 幂
      var s = f.toString();
      var rs = s.indexOf(".");
      //判定如果是整数，增加小数点再补0
      if (rs < 0) {
        rs = s.length;
        s += ".";
      }
      while (s.length <= rs + n) {
        s += "0";
      }
      return s;
    },
    //纸质合同编号限制
    inputCode(type){
      let addrReg = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\(\)\-\_]/g
      if(this.contractForm.pCode&&type==="pCode"){
        this.contractForm.pCode=this.contractForm.pCode.replace(/\s+/g,"").replace(addrReg,'')
      }
      if(this.contractForm.project&&type==="projectType"){
        this.contractForm.projectType=this.contractForm.projectType.replace(/\s+/g,"").replace(addrReg,'')
      }
      if(this.contractForm.houseinfoCode&&type==="houseinfoCode"){
        this.contractForm.houseinfoCode=this.contractForm.houseinfoCode.replace(/\s+/g,"").replace(addrReg,'')
        //手动更改房源编号 清空U+地址
        this.contractForm.propertyAddr=""
      }
      if(this.contractForm.propertyAddr&&type==="propertyAddr"){
        this.contractForm.propertyAddr=this.contractForm.propertyAddr.replace(/\s+/g,"").replace(addrReg,'')
      }
    },
    //数字金额限制
    cutNumber(val){
      if(val==="loanAmount"){
        this.$nextTick(()=>{
          this.contractForm.loanAmount=this.$tool.cutFloat({val:this.contractForm.loanAmount,max:999999999.99})
        })
      }else if(val==="incomeAmount"){
        this.$nextTick(()=>{
          this.contractForm.incomeAmount=this.$tool.cutFloat({val:this.contractForm.incomeAmount,max:999999999.99})
        })
      }else if(val==="sundryAmount"){
        this.$nextTick(()=>{
          this.contractForm.sundryAmount=this.$tool.cutFloat({val:this.contractForm.sundryAmount,max:999999999.99})
        })
      }else if(val==="financeCost"){
        this.$nextTick(()=>{
          this.contractForm.financeCost=this.$tool.cutFloat({val:this.contractForm.financeCost,max:999999999.99})
        })
      }else if(val==="financeCostRatio"){
        this.$nextTick(()=>{
          this.contractForm.financeCostRatio=this.$tool.cutFloat({val:this.contractForm.financeCostRatio,max:100})
        })
      }
      // financeCostRatio
    },
    //姓名限制
    inputOnly(type){
      if(type==='financeCommissioner'){
        this.contractForm.financeCommissioner=this.$tool.textInput(this.contractForm.financeCommissioner)
      }
      if(type==='transactor'){
        this.contractForm.transactor=this.$tool.textInput(this.contractForm.transactor)
      }
      if(type==='acceptor'){
        this.contractForm.acceptor=this.$tool.textInput(this.contractForm.acceptor)
      }
      if(type==='positionName'){
        this.contractForm.positionName=this.$tool.textInput(this.contractForm.positionName)
      }
      if(type==='customerName'){
        this.contractForm.customerName=this.$tool.textInput(this.contractForm.customerName)
      }
      if(type==='cooperationName'){
        this.contractForm.cooperationName=this.$tool.textInput(this.contractForm.cooperationName)
      }
    },
    //产权地址限制
    cutAddress(type){
      let addrReg=/\\|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\&|\!|\~|\`|\|/g
      if(type==="city"){
        this.rightAddrCity=this.rightAddrCity.replace(/\s+/g,"").replace(addrReg,'').replace("市","").replace(/\//g,'')
      }else if(type==="area"){
        this.rightAddrArea=this.rightAddrArea.replace(/\s+/g,"").replace(addrReg,'').replace("区","").replace(/\//g,'')
      }else{
        this.rightAddrDetail=this.rightAddrDetail.replace(/\s+/g,"").replace(addrReg,'')
      }
    },
    //房源客源弹窗
    showDialog(value) {
      this.isShowDialog = true;
    },
     //关闭房源客源弹窗
    closeHouseGuest(value) {
      if (value) {//判断是否点击的确认按钮
        this.isShowDialog = false;
        this.getHouseDetail(value.selectCode);
        this.choseHcode=value.selectCode;
      } else {
        this.isShowDialog = false;
      }
    },
     //根据房源id获取房源信息
    getHouseDetail(id) {
      loading=this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      });
      let param = {
        houseId: id,
      };
      this.$ajax.get("/api/resource/houses/one", param).then(res => {
        loading.close()
        res = res.data;
        if (res.status === 200) {
          let houseMsg = res.data;
          this.contractForm.houseinfoCode = houseMsg.PropertyNo; //房源编号
          this.contractForm.houseInfo = houseMsg;
          this.contractForm.propertyAddr=houseMsg.EstateName.replace(/\s/g,"")+' '+houseMsg.BuildingName.replace(/\s/g,"")+houseMsg.Unit.replace(/\s/g,"")+houseMsg.RoomNo.replace(/\s/g,"")
          //重新选择房源时清空产权地址
          this.rightAddrCity='';
          this.rightAddrArea='';
          this.rightAddrDetail='';
        }
      }).catch(error=>{
        loading.close()
        this.$message({
          message:error,
          type: "error"
        })
      });
    },
     //根据经纪人id查询上级
    getSuperior(id){
      let param = {
        agentId:id
      }
      this.$ajax.get("/api/resource/getShopowner",param).then(res=>{
        res=res.data
        if(res.status===200){
          this.contractForm.shopOwnerId=res.data.ShopOwnerId//店长id
          this.contractForm.shopOwnerName=res.data.ShopOwnerName//店长姓名
          this.contractForm.shopOwnerStoreId=res.data.ShopOwnerStoreId//店长门店id
          this.contractForm.shopOwnerStoreName=res.data.ShopOwnerStoreName//店长门店
          let item = {
            depName:res.data.ShopOwnerStoreName,
            depId:res.data.ShopOwnerStoreId,
            empName:res.data.ShopOwnerName,
            empId:res.data.ShopOwnerId
          }
          this.options_=[item]
        }
      })
    },
    //经纪人店长查询
    remoteMethod(keyword,type){
      if(keyword!==''){
        let param = {
          // type:type==="agent"?1:2,  2019.10.16张丽茹更改需求 经纪人可以为店长 不做限制
          name:keyword
        }
        this.$ajax.get('/api/contractInfo/getEmpDeptInfo',param).then(res=>{
          res=res.data
          if(res.status===200){
            if(type==="agent"){
              this.options=res.data
            }else{
              this.options_=res.data
            }
          }
        })
      }
    },
    //经纪人所属门店
    selectOption(val,type){
      if(type==="agent"){
        this.getSuperior(val)
        if(this.options.length>0&&val){
          this.options.forEach(element => {
            if(element.empId==val){
              this.contractForm.dealAgentName=element.empName
              this.contractForm.dealAgentStoreId=element.depId
              this.contractForm.dealAgentStoreName=element.depName
            }
          });
        }
      }else{
        if(this.options_.length>0&&val){
          this.options_.forEach(element => {
            if(element.empId==val){
              this.contractForm.shopOwnerName=element.empName
              this.contractForm.shopOwnerStoreId=element.depId
              this.contractForm.shopOwnerStoreName=element.depName
            }
          });
        }
      }
    },
    //保存合同
    toSave(){
      if(!this.contractForm.loanDate){
        this.contractForm.loanDate=''
      }
      if(!this.contractForm.customerArea){
        this.contractForm.customerArea=''
      }
      this.$tool.checkForm(this.contractForm, rule).then(() => {
        // U+地址   2019.09.29黄鹤更改需求变为非必填项
        // if(this.contractForm.propertyAddr){
          //产权地址
          if (this.rightAddrCity&&this.rightAddrArea&&this.rightAddrDetail) {
            this.contractForm.propertyRightAddr=this.rightAddrCity+"市"+this.rightAddrArea+"区"+this.rightAddrDetail
            //客户姓名
            if(this.contractForm.customerName){
              if(this.contractForm.customerName.indexOf("先生")===-1&&this.contractForm.customerName.indexOf("女士")===-1){
                //客户所属区域
                if(this.contractForm.customerArea){
                  //经纪人
                  if(this.contractForm.dealAgentId){
                    // 店长
                    if(this.contractForm.shopOwnerId){
                      this.postContractForm()
                    }else{
                      this.$message({
                        message:'签约信息-店长不能为空',
                        type: "warning"
                      })
                    }
                  }else{
                    this.$message({
                      message:'签约信息-成交经纪人不能为空',
                      type: "warning"
                    })
                  }
                }else{
                  this.$message({
                    message:'客源信息-所属区域不能为空',
                    type: "warning"
                  })
                }
              }else{
                this.$message({
                  message:'客源信息-客户姓名不正确',
                  type: "warning"
                })
              }
            }else{
              this.$message({
                message:'客源信息-客户姓名不能为空',
                type: "warning"
              })
            }
          }else{
            this.$message({
              message:'房源信息-物业地址未填写完整',
              type: "warning"
            })
          }
        // }else{
        //   this.$message({
        //     message: "房源信息-U+地址不能为空",
        //     type: "warning"
        //   });
        // }
      }).catch(error => {
          this.$message({
            message: `${error.title.length<3?'':'合同信息-'}${error.title}${error.msg}`,
            type: "warning"
          });
        });
    },
    //提交合同表单
    postContractForm(){
      this.fullscreenLoading=true
      if(this.termData){
        if (this.termData.length > 0) {
          this.contractForm.termStart = this.termData[0];
          this.contractForm.termEnd = this.termData[1];
        }
      }
      let param = this.contractForm
      param.id = this.contId ? this.contId : null
      delete param.createTime
      delete param.recordDeptName
      delete param.recordName
      delete param.updateTime
      //新增
      let url="/api/contractInfo/finance/addContract"
      let message = "创建成功"
      //编辑
      if(this.operationType===2){
        url="/api/contractInfo/finance/updateContract"
        message = "保存成功"
      }
      this.$ajax.postJSON(url,param).then(res=>{
        res=res.data
        if(res.status===200){
          this.fullscreenLoading=false
          this.$message({
            message:message,
            type:"success"
          })
          this.$router.push({
            path: "/otherContractList",
            query:{
              type:"jr"
            }
          });
        }
      }).catch(error=>{
        this.fullscreenLoading=false
        this.$message({
          message:error,
          type:"error"
        })
      })
    }
  },
  computed: {
    getOperationType: function() {
      return this.operationType;
    },
    getContId: function() {
      return this.contId;
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
  },
};
</script>

<style scoped lang="less">
@import "~@/assets/common.less";
input:disabled{
  background-color: #f5f7fa;
}
.add-form {
  padding: 10px;
  font-size: 14px;
  background: @bg-white;
  box-sizing:border-box;
  overflow-y: auto;
}
.contractMsg {
  border-bottom: 1px solid @border-ED;
  > p {
    padding-bottom: 10px;
    padding-left: 10px;
    font-size: 14px;
    font-weight: bold;
  }
  .form-content {
    padding-left: 30px;
  }
}
.houseMsg {
  .chineseNum {
    padding-left: 10px;
    color: @color-orange;
    font-size: 14px;
  }
  border-bottom: 1px solid @border-ED;
  > p {
    padding: 20px 0 20px 10px;
    font-size: 14px;
    font-weight: bold;
  }
  .thirdParty {
    cursor: pointer;
    display: inline-block;
    .attention {
      color: #ccc;
      font-weight: normal;
    }
    .attention_ {
      color: @color-blue;
    }
  }
  .form-content {
    padding-left: 30px;
    .select {
      display: inline-block;
      text-align: center;
      color: @color-white;
      width: 140px;
      padding: 2px 0;
      line-height: 32px;
      background: @color-blue;
      border-radius: 2px;
      cursor: pointer;
    }
    .select_{
      display: inline-block;
      width: 140px;
      text-align: left;
      color:@color-blue;
      font-weight: bold;
    }
    .propertyAddress{
      cursor:not-allowed;
      min-width: 500px;
      display: inline-block;
      box-sizing: border-box;
      text-align: left;
      font-size: 14px;
      padding-left: 15px;
      color: #606266;
      border-radius: 4px;
      background: #F5F7FA;
      border: 1px solid #dcdfe6;
    }
    .color_{
      color: #c0c4cc;
    }
    .shopName{
      min-width: 200px;
      height: 32px;
    }
    .parameter{
      display: flex;
      width: 1200px;
      flex-wrap:wrap;
      padding-bottom: 10px;
      li{
        display: flex;
        height: 50px;
        width: 350px;
        line-height: 50px;
        > .title{
          width: 100px;
          cursor: pointer;
          text-align: right;
          // padding-right: 10px;
          color: #606266;
          text-overflow:ellipsis;
          white-space:nowrap;
          overflow:hidden;
          display: inline-block;
        }
        > .colon{
          padding: 0 5px;
        }
        > .unit{
          width: 70px;
          padding-left: 10px;
          color: #606266;
          overflow: hidden;
        }
      }
    }
    .storeStyle{
      color:#606266;
      width: 120px;
      background-color: #f5f7fa;
    }
  }
  .cooperation {
    min-height: 240px;
    padding-left: 30px;
    /deep/.el-textarea__inner {
      width: 600px;
      min-height: 200px;
    }
  }
  .peopleMsg {
    li {
      min-width: 540px;
      font-size: 14px;
      margin-bottom: 10px;
      .merge {
        border: 1px solid #dcdfe6;
        padding: 7px 2px;
        border-radius: 3px;
      }
      .shell{
        display: inline-block;
        position: relative;
        &::after {
          content: '%';
          display: inline-block;
          color: #ccc;
          position: absolute;
          top: 0;
          right: 6px;
        }
      }
      input {
        padding: 6px 0;
        color: #606266;
        &::-webkit-input-placeholder {
        color: #ccc;
        }
      }
    }
    .name_ {
      width: 250px;
      padding-left: 5px;
      border: none;
      border-right: 1px solid #dcdfe6;
    }
    .disabled {
      background-color: #f5f7fa;
    }
    .mobile_ {
      width: 100px;
      border: none;
      margin-left: -4px;
      padding-left: 2px;
    }
    .rate_ {
      width: 90px;
    }
    .idCard_ {
      width: 160px;
      padding: 7px 5px;
      padding-left: 5px;
      border: 1px solid #dcdfe6;
      border-radius: 3px;
    }
    .relation_ {
      width: 80px;
    }
    .idtype {
      width: 100px;
    }
    .icon {
      display: inline-block;
      cursor: pointer;
      .icon-tubiao_shiyong-14 {
        font-size: 22px;
        color: @color-blue;
      }
      .icon-tubiao_shiyong-4{
        font-size: 22px;
        color: @color-FF5;
      }
    }
  }
}
.width-250{
  width: 245px;
  text-align: right;
}
/deep/.form-label {
  position: relative;
  &:before {
    content: '*';
    display: inline-block;
    color: red;
  }
}
.dealPrice{
  display: inline-block;
  box-sizing: border-box;
  width: 140px;
  padding: 7px 15px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  color:#606266;
  &::-webkit-input-placeholder {
    color: #ccc;
  }
}
.yuan{
  position: absolute;
  top: 0;
  right: 6px;
  font-size: 14px;
  color: #ccc;
}
.btn {
  padding: 10px 20px 0;
  display: flex;
  justify-content: space-between;
  p {
    color: @color-6c;
    display: inline-block;
    padding-right: 20px;
    font-size: 12px;
  }
}
</style>