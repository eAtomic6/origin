<template>
  <div>
    <el-form :inline="true" :model="contractForm" class="add-form" size="small" :style="{ height: tableHeight }">
      <!-- 合同信息 -->
      <div class="contractMsg">
        <p>合同信息</p>
        <div class="form-content">
          <el-form-item label="签约日期：" style="width:285px;text-align:right;" class="form-label">
            <!-- <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="contractForm.signDate" style="width:140px"></el-date-picker> -->
            <el-date-picker
              style="width:180px"
              :disabled="operationType===2?true:false"
              v-model="contractForm.signDate"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              :picker-options="pickerOptions"
              default-time="12:00:00">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="交易方式：" class="form-label" style="width:290px;text-align:right;">
            <el-select v-model="contractForm.transMode" placeholder="全部" :clearable="true" style="width:150px">
              <el-option v-for="item in dictionary['716']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="纸质合同编号：" class="width-250" style="width:340px;">
            <input style="width:200px;" type="text" maxlength="30" v-model="contractForm.pCode" @input="inputCode('pCode')" placeholder="请输入" class="dealPrice">
          </el-form-item>
          <br>
          <el-form-item label="成交金额：" class="form-label width-250">
            <input type="text" v-model="contractForm.dealPrice" @input="cutNumber('dealPrice')" placeholder="请输入内容" class="dealPrice">
            <i class="yuan">元</i>
          </el-form-item>
          <el-form-item label="应收佣金：" class="form-label" style="width:320px;text-align:right;">
            <input type="text" v-model="contractForm.receivableCommission" @input="cutNumber('receivableCommission')" placeholder="请输入内容" class="dealPrice">
            <i class="yuan">元</i>
          </el-form-item>
        </div>
      </div>
      <!-- 房源信息 -->
      <div class="houseMsg">
        <p>房源信息</p>
        <div class="form-content">
          <el-form-item label="房源编号：" class="width-250 form-label">
            <!-- <input type="text" v-model="contractForm.houseinfoCode" maxlength="20" @input="inputCode('houseinfoCode')" placeholder="请输入内容" class="dealPrice"> -->
            <el-input style="width:140px;" type="text" maxlength="20" v-model="contractForm.houseinfoCode" :clearable="true" @input="inputCode('houseinfoCode')" placeholder="请输入内容"></el-input>
          </el-form-item>
          <span class="select" @click="showDialog('house')">请选择房源</span>
          <br>
          <el-form-item label="物业地址：" class="form-label" style="width:705px;text-align:right">
            <!-- <input v-model="rightAddrCity" maxlength="10" placeholder="请输入" @input="cutAddress('city')" class="dealPrice" style="width:100px" /> 市
            <input v-model="rightAddrArea" maxlength="10" placeholder="请输入" @input="cutAddress('area')" class="dealPrice" style="width:100px" /> 区
            <input v-model="rightAddrDetail" maxlength="70" placeholder="详细地址" @input="cutAddress('detail')" class="dealPrice" style="width:400px" /> -->
            <input v-model="contractForm.propertyAddr" :disabled="canNotInput" maxlength="100" placeholder="请输入" @input="inputCode('propertyAddr')" class="dealPrice" :class="{'disabled':canNotInput}" style="width:600px" />
          </el-form-item>
          <br>
          <el-form-item label="业主信息：" class="form-label" style="padding-left:18px">
            <ul class="peopleMsg">
              <li v-for="(item,index) in ownerList" :key="index">
                <span class="merge">
                  <input v-model="item.name" placeholder="姓名" maxlength="30" @input="inputOnly(index,'owner')" class="name_">
                  <input v-model="item.encryptionMobile" placeholder="电话" class="mobile_" @input="verifyMobile(item,index,'owner')" @keydown="saveMobile(item,index,'guest')">
                </span>
                <el-select v-model="item.relation" placeholder="关系" class="relation_">
                  <el-option v-for="item in relationList" :key="item.key" :label="item.value" :value="item.value">
                  </el-option>
                </el-select>
                <el-select v-model="item.cardType" placeholder="证件类型" class="idtype" @change="changeCadrType($event,index,'owner')">
                  <el-option v-for="item in dictionary['633']" :key="item.key" :label="item.value" :value="item.key">
                  </el-option>
                </el-select>
                <input v-model="item.cardCode" type="text" :maxlength="item.cardType===1?18:item.cardType===2?9:item.cardType===3?20:10" placeholder="请输入证件号" class="idCard_" @input="verifyIdcard(item)">
                <span @click.stop="addcommissionData('owner')" class="icon">
                  <i class="iconfont icon-tubiao_shiyong-14"></i>
                </span>
                <span @click.stop="delPeople(index,'owner')" v-if="ownerList.length>1" class="icon">
                  <i class="iconfont icon-tubiao_shiyong-4"></i>
                </span>
              </li>
            </ul>
          </el-form-item>
        </div>
      </div>
      <!-- 客源信息 -->
      <div class="houseMsg" v-if="contractForm.transMode!==1">
        <p>客源信息</p>
        <div class="form-content">
          <el-form-item label="客源编号：" class="width-250 form-label">
            <!-- <input type="text" v-model="contractForm.guestinfoCode" maxlength="20" @input="inputCode('guestinfoCode')" placeholder="请输入内容" class="dealPrice"> -->
            <el-input style="width:140px;" type="text" maxlength="20" v-model="contractForm.guestinfoCode" :clearable="true" @input="inputCode('guestinfoCode')" placeholder="请输入内容"></el-input>
          </el-form-item>
          <span class="select" @click="showDialog('guest')">请选择客源</span>
          <br>
          <el-form-item label="客户信息：" class="form-label" style="padding-left:18px">
            <ul class="peopleMsg">
              <li v-for="(item,index) in guestList" :key="index">
                <span class="merge">
                  <input v-model="item.name" placeholder="姓名" maxlength="30" @input="inputOnly(index,'guest')"  class="name_">
                  <input v-model="item.encryptionMobile" placeholder="电话" class="mobile_"  @input="verifyMobile(item,index,'guest')" @keydown="saveMobile(item,index,'guest')">
                </span>
                <el-select v-model="item.relation" placeholder="关系" class="relation_">
                  <el-option v-for="item in relationList" :key="item.key" :label="item.value" :value="item.value">
                  </el-option>
                </el-select>
                <el-select v-model="item.cardType" placeholder="证件类型" class="idtype" @change="changeCadrType($event,index,'guest')">
                  <el-option v-for="item in dictionary['633']" :key="item.key" :label="item.value" :value="item.key">
                  </el-option>
                </el-select>
                <input id="guestCard" v-model="item.cardCode" :maxlength="item.cardType===1?18:item.cardType===2?9:item.cardType===3?20:10" type="text" placeholder="请输入证件号" class="idCard_" @input="verifyIdcard(item)">
                <span @click.stop="addcommissionData('guest')" class="icon">
                  <i class="iconfont icon-tubiao_shiyong-14"></i>
                </span>
                <span @click.stop="delPeople(index,'guest')" v-if="guestList.length>1" class="icon">
                  <i class="iconfont icon-tubiao_shiyong-4"></i>
                </span>
              </li>
            </ul>
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
            <el-tooltip class="item" effect="dark" :content="contractForm.dealAgentStoreName" placement="top" v-if="contractForm.dealAgentStoreName.length>7">
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
             <el-tooltip class="item" effect="dark" :content="contractForm.shopOwnerStoreName" placement="top" v-if="contractForm.shopOwnerStoreName.length>7">
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
    <!-- 删除人员确认框 -->
    <el-dialog title="提示" :visible.sync="dialogDel" width="460px" :closeOnClickModal="$tool.closeOnClickModal">
      <span>确定删除当前联系人吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDel = false">取 消</el-button>
        <el-button type="primary" @click="delPeopleMsg">确 定</el-button>
      </span>
    </el-dialog>
     <!-- 房源客源弹窗 -->
     <!-- 长租房客源只展示求租 -->
    <houseGuest
    :dialogType="dialogType"
    :dialogVisible="isShowDialog"
    :contractType="contractType"
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
  signDate: {
    name: "签约日期"
  },
  transMode:{
    name:"交易方式"
  },
  dealPrice: {
    name: "成交金额",
    type: "money"
  },
  receivableCommission: {
    name: "应收佣金",
    type: "money"
  },
  houseinfoCode: {
    name: "房源"
  },
  guestinfoCode: {
    name: "客源"
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
        signDate: "",
        transMode:"",
        dealPrice:"",
        receivableCommission:"",
        houseinfoCode:"",
        guestinfoCode:"",
        dealAgentId:"",
        dealAgentName:"",
        dealAgentStoreId:"",
        dealAgentStoreName:"",
        shopOwnerId:"",
        shopOwnerName:"",
        shopOwnerStoreId:"",
        shopOwnerStoreName:"",
        cooperationName:""
      },
      rightAddrCity:'',
      rightAddrArea:'',
      rightAddrDetail:'',
      //人员关系列表
      relationList: [],
      //业主信息
      ownerList: [
        {
          cardCode: "",
          mobile: "",
          encryptionMobile: "",
          relation: "",
          cardType: "",
          name: "",
        }
      ],
      ownerList_:[],
      //客户信息
      guestList: [
        {
          cardCode: "",
          mobile: "",
          encryptionMobile: "",
          relation: "",
          cardType: "",
          name: "",
        }
      ],
      guestList_:[],
      delType:'',
      //删除客户确认框
      dialogDel:false,
      dictionary: {
        //数据字典
        "633":"",//证件类型(护照,身份证,营业执照)
        "716":"",//交易方式
      },
      //经纪人
      options:[],
      // 店长
      options_:[],
      //房客源弹窗
      isShowDialog:false,
      dialogType:"",
      contractType:"求租",
      choseHcode:0,
      choseGcode:0,
      fullscreenLoading:false,//加载loading动画
      canNotInput:false,//带出的物业地址不能修改
      //日期选择器禁止选择未来时间
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
    }
  },
  created () {
    this.getRelation();//人员关系
    this.getDictionary();//字典
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
      this.$ajax.get("/api/contractInfo/longLease/detail",param).then(res=>{
        res=res.data
        if(res.status===200){
          let contractDetail=res.data
          this.$set(contractDetail,"contractInfo",JSON.parse(contractDetail.contractInfo))
          delete contractDetail.code
          delete contractDetail.cityId
          delete contractDetail.dealAgentStoreSystemtag
          delete contractDetail.receiveAmountState
          delete contractDetail.recordDept
          delete contractDetail.recordId
          delete contractDetail.recordDeptSystemtag
          delete contractDetail.tradeType
          delete contractDetail.updateBy
          delete contractDetail.updateName
          delete contractDetail.receivedCommission
          //签约日期
          contractDetail.signDate= this.$options.filters['timeFormat_'](contractDetail.signDate)
          //交易方式
          contractDetail.transMode= contractDetail.contractInfo.transMode
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
          //物业地址
          contractDetail.propertyAddr=contractDetail.contractInfo.propertyAddr
          // // 产权地址
          // let rightAddress = contractDetail.contractInfo.propertyAddr
          // let index1 = rightAddress.indexOf('市')
          // let index2 = rightAddress.indexOf('区')
          // if(index1>0){
          //   this.rightAddrCity=rightAddress.substring(0,index1)
          // }
          // if(index2>0){
          //   if(index1>0){
          //     this.rightAddrArea=rightAddress.substring(index1+1,index2)
          //   }else{
          //     this.rightAddrArea=rightAddress.substring(0,index2)
          //   }
          // }
          // if(index1>0&&index2>0){
          //   this.rightAddrDetail=rightAddress.substring(index2+1)
          // }else if(index1>0&&index2<0){
          //   this.rightAddrDetail=rightAddress.substring(index1+1)
          // }else if(index1<0&&index2>0){
          //   this.rightAddrDetail=rightAddress.substring(index2+1)
          // }else{
          //   this.rightAddrDetail=rightAddress
          // }
          // 房源信息
          contractDetail.houseInfo=contractDetail.contractInfo.houseInfo
          this.ownerList=[];
          for (var i = 0; i < contractDetail.contractInfo.ownerList.length; i++) {
            let element = {
              pid:contractDetail.contractInfo.ownerList[i].pid,
              name:contractDetail.contractInfo.ownerList[i].name,
              mobile:contractDetail.contractInfo.ownerList[i].mobile,
              encryptionMobile:contractDetail.contractInfo.ownerList[i].encryptionMobile,
              relation:contractDetail.contractInfo.ownerList[i].relation,
              cardCode:contractDetail.contractInfo.ownerList[i].cardCode,
              cardType:contractDetail.contractInfo.ownerList[i].cardType,
              isEncryption:true
            }
            let obj = Object.assign({}, element);
            this.ownerList.push(obj);
            let obj_ = Object.assign({}, element);
            this.ownerList_.push(obj_);
          };
          // 客源信息
          contractDetail.guestInfo=contractDetail.contractInfo.guestInfo
          this.guestList=[];
          for (var i = 0; i < contractDetail.contractInfo.customerList.length; i++) {
            let element = {
              pid:contractDetail.contractInfo.customerList[i].pid,
              name:contractDetail.contractInfo.customerList[i].name,
              mobile:contractDetail.contractInfo.customerList[i].mobile,
              encryptionMobile:contractDetail.contractInfo.customerList[i].encryptionMobile,
              relation:contractDetail.contractInfo.customerList[i].relation,
              cardCode:contractDetail.contractInfo.customerList[i].cardCode,
              cardType:contractDetail.contractInfo.customerList[i].cardType,
              isEncryption:true
            }
            let obj = Object.assign({}, element);
            this.guestList.push(obj);
            let obj_ = Object.assign({}, element);
            this.guestList_.push(obj_);
          };
          if(this.guestList.length===0){
            this.guestList=[
              {
                cardCode: "",
                mobile: "",
                encryptionMobile: "",
                relation: "",
                cardType: "",
                name: "",
              }
            ]
          }
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
      this.contractForm.signDate=time_
    },
    //获取所在城市的人员关系
    getRelation() {
      let param = {
        type: "Relation"
      };
      this.$ajax.get("/api/dictionary/uplus", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.relationList = res.data;
        }
      });
    },
    //添加客户
    addcommissionData(type) {
      if(type==="owner"){
        if (this.ownerList.length < 4) {
          this.ownerList.push({
            cardCode: "",
            mobile: "",
            encryptionMobile:"",
            relation: "",
            cardType: "",
            name: "",
          });
        } else {
          this.$message({
            message: "已达到最大数量",
            type: "warning"
          });
        }
      }else{
        if (this.guestList.length < 4) {
          this.guestList.push({
            cardCode: "",
            mobile: "",
            encryptionMobile:"",
            relation: "",
            cardType: "",
            name: "",
          });
        } else {
          this.$message({
            message: "已达到最大数量",
            type: "warning"
          });
        }
      }
    },
    //删除联系人确认框
    delPeople(index,type){
      this.peopleIndex=index;
      this.delType=type;
      this.dialogDel=true;
    },
    //确认删除
    delPeopleMsg(){
      if(this.delType==="owner"){
        this.ownerList.splice(this.peopleIndex, 1);
        this.ownerList_.splice(this.peopleIndex, 1);
        this.dialogDel=false;
      }else if(this.delType==="guest"){
        this.guestList.splice(this.peopleIndex, 1);
        this.guestList_.splice(this.peopleIndex, 1);
        this.dialogDel=false;
      }
    },
    //证件类型切换
    changeCadrType(value,index,type){
      if(type==="guest"){
        this.guestList[index].cardCode=''
      }else{
        this.ownerList[index].cardCode=''
      }
    },
     //房源客源弹窗
    showDialog(value) {
      this.isShowDialog = true;
      this.dialogType = value;
    },
    //关闭房源客源弹窗
    closeHouseGuest(value) {
      if (value) {//判断是否点击的确认按钮
        if (value.dialogType === "house") {
          if(this.choseHcode&&this.choseHcode!==value.selectCode){
            this.contractForm.propertyRightAddr=''
          }
          this.isShowDialog = false;
          this.getHouseDetail(value.selectCode);
          this.choseHcode=value.selectCode;
        } else if (value.dialogType === "guest") {
          this.isShowDialog = false;
          this.getGuestDetail(value.selectCode);
          this.choseGcode=value.selectCode;
        }
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
          this.canNotInput=true
          let houseMsg = res.data;
          this.contractForm.houseinfoCode = houseMsg.PropertyNo; //房源编号
          this.contractForm.houseInfo = houseMsg;
          // 物业地址 2019.10.11黄鹤更改需求由三个输入框合成一个 并且带出的物业地址不能修改
          this.contractForm.propertyAddr=this.contractForm.houseInfo.EstateName.replace(/\s/g,"")+this.contractForm.houseInfo.BuildingName.replace(/\s/g,"")+this.contractForm.houseInfo.Unit.replace(/\s/g,"")+this.contractForm.houseInfo.RoomNo.replace(/\s/g,"")
          //重新选择房源时清空产权地址
          // this.rightAddrCity='';
          // this.rightAddrArea='';
          // this.rightAddrDetail='';
          if(houseMsg.OwnerInfoList.length>0){
            this.ownerList=[];
            this.ownerList_=[];
            houseMsg.OwnerInfoList.forEach(element => {
              element.cardCode='';
              element.name=element.OwnerName;
              element.mobile=element.OwnerMobile;
              element.relation=element.Relation;
              element.cardType='';
              element.isEncryption=true;
              delete element.OwnerName
              delete element.OwnerMobile
              delete element.Relation
              let obj = Object.assign({}, element);
              obj.encryptionMobile=obj.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
              this.ownerList.push(obj);
              let obj_ = Object.assign({}, element);
              this.ownerList_.push(obj_);
            });
          }
        }
      }).catch(error=>{
        loading.close()
        this.$message({
          message:error,
          type: "error"
        })
      });
    },
     //根据客源id获取客源信息
    getGuestDetail(id) {
      loading=this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      });
      let param = {
        customerId: id,
      };
      this.$ajax.get("/api/resource/customers/one", param).then(res => {
        loading.close()
        res = res.data;
        if (res.status === 200) {
          let guestMsg = res.data;
          this.contractForm.guestinfoCode = guestMsg.InquiryNo; //客源编号
          this.contractForm.guestInfo = guestMsg;
          //2019.10.11黄鹤更改需求 选择了客源自动带出经纪人和经纪人店长
          // 成交经纪人 
          this.contractForm.dealAgentId=guestMsg.EmpCode//经纪人id
          this.contractForm.dealAgentName=guestMsg.EmpName//经纪人姓名
          this.contractForm.dealAgentStoreId=guestMsg.GuestStoreCode//经纪人门店id
          this.contractForm.dealAgentStoreName=guestMsg.GuestStoreName//经纪人门店
          //经纪人上级
          this.getSuperior(guestMsg.EmpCode)
          let item = {
            depName:guestMsg.GuestStoreName,
            depId:guestMsg.GuestStoreCode,
            empName:guestMsg.EmpName,
            empId:guestMsg.EmpCode
          }
          this.options=[item]
          if(guestMsg.OwnerInfo.length>0){
            this.guestList=[];
            this.guestList_=[];
            guestMsg.OwnerInfo.forEach(element => {
              element.cardCode='';
              element.name=element.CustName;
              element.mobile=element.CustMobile;
              element.relation=element.CustRelation;
              element.cardType='';
              element.isEncryption=true;
              delete element.CustName
              delete element.CustMobile
              delete element.CustRelation
              let obj = Object.assign({}, element);
              obj.encryptionMobile=obj.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
              this.guestList.push(obj);
              let obj_ = Object.assign({}, element);
              this.guestList_.push(obj_);
            });
          }
        }
      }).catch(error=>{
        loading.close()
        this.$message({
          message:error,
          type: "error"
        })
      });
    },
    //2019.10.11黄鹤更改需求 选择了经纪人自动带出店长和店长门店
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
    //纸质合同编号限制
    inputCode(type){
      let addrReg = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\(\)\-\_]/g
      if(this.contractForm.pCode&&type==="pCode"){
        this.contractForm.pCode=this.contractForm.pCode.replace(/\s+/g,"").replace(addrReg,'')
      }
      if(this.contractForm.houseinfoCode&&type==="houseinfoCode"){
        this.contractForm.houseinfoCode=this.contractForm.houseinfoCode.replace(/\s+/g,"").replace(addrReg,'')
        this.canNotInput=false
        this.contractForm.propertyAddr=""
      }
      if(this.contractForm.guestinfoCode&&type==="guestinfoCode"){
        this.contractForm.guestinfoCode=this.contractForm.guestinfoCode.replace(/\s+/g,"").replace(addrReg,'')
      }
      if(this.contractForm.propertyAddr&&type==="propertyAddr"){
        this.contractForm.propertyAddr=this.contractForm.propertyAddr.replace(/\s+/g,"").replace(addrReg,'')
      }
    },
    //数字金额限制
    cutNumber(val){
      if(val==="dealPrice"){
        this.$nextTick(()=>{
          this.contractForm.dealPrice=this.$tool.cutFloat({val:this.contractForm.dealPrice,max:999999999.99})
        })
      }else if(val==="receivableCommission"){
        this.$nextTick(()=>{
          this.contractForm.receivableCommission=this.$tool.cutFloat({val:this.contractForm.receivableCommission,max:999999999.99})
        })
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
    //姓名限制
    inputOnly(index,type){if(type==='guest'){
        this.guestList[index].name=this.$tool.textInput(this.guestList[index].name)
      }else if(type==="owner"){
        this.ownerList[index].name=this.$tool.textInput(this.ownerList[index].name)
      }else if(type==='cooperationName'){
        this.contractForm.cooperationName=this.$tool.textInput(this.contractForm.cooperationName)
      }
    },
    //存贮改变之前的手机号
    saveMobile(item,index,type){
      if(item.isEncryption){
        if(type==="owner"){
          this.beforeChangeMobile= this.ownerList[index].encryptionMobile;
        }else if(type==="guest"){
          this.beforeChangeMobile=this.guestList[index].encryptionMobile;
        }
      }
    },
    //手机号验证
    verifyMobile(item,index,type) {
      let beginNum = /^0.*$/
      let beginNum_ = /^1.*$/
      if(item.encryptionMobile.length>0){
        if(type==="owner"){
          if(beginNum.test(item.encryptionMobile)){
            this.ownerList[index].encryptionMobile=item.encryptionMobile.substring(0,13)
          // }else if(beginNum_.test(item.encryptionMobile)){
          }else{
            this.ownerList[index].encryptionMobile=item.encryptionMobile.substring(0,11)
          }
          item.encryptionMobile=this.ownerList[index].encryptionMobile
        }else if(type==="guest"){
          if(beginNum.test(item.encryptionMobile)){
            this.guestList[index].encryptionMobile=item.encryptionMobile.substring(0,13)
          // }else if(beginNum_.test(item.encryptionMobile)){
          }else{
            this.guestList[index].encryptionMobile=item.encryptionMobile.substring(0,11)
          }
          item.encryptionMobile=this.guestList[index].encryptionMobile
        }
      }
      if(item.isEncryption){
        if(type==="owner"){
          if(this.ownerList[index].encryptionMobile!==this.beforeChangeMobile){
            if(Number(item.encryptionMobile)){
              this.ownerList[index].encryptionMobile=item.encryptionMobile;
            }else{
              this.ownerList[index].encryptionMobile='';
            }
            // this.ownerList[index].mobile='';
            this.ownerList[index].isEncryption=false;
          }
        }else if(type==="guest"){
          if(this.guestList[index].encryptionMobile!==this.beforeChangeMobile){
            if(Number(item.encryptionMobile)){
              this.guestList[index].encryptionMobile=item.mobile;
            }else{
              this.guestList[index].encryptionMobile='';
            }
            this.guestList[index].isEncryption=false;
          }
        }
      }else{
        if(item.encryptionMobile.length>=11){
          let reg = /^1[0-9]{10}$/;
          let reg_ = /^0\d{2,3}\-?\d{7,8}$/
          if (!reg.test(item.encryptionMobile)&&!reg_.test(item.encryptionMobile)) {
            this.$message({
              message:'电话号码格式不正确',
              type: "warning"
            })
          }
        }
      }
    },
    //身份证验证
    verifyIdcard(value,type=1){
      if(type===2){
        if(value.length===18){
          if (!this.isIdCardNo(value)) {
            this.$message({
              message:'身份证格式不正确',
              type: "warning"
            })
          }
        }
      }else{
        if(value.cardCode.length===18){
          if (!this.isIdCardNo(value.cardCode)&&value.cardType===1) {
            this.$message({
              message:'身份证格式不正确',
              type: "warning"
            })
          }
        }
      }
    },
    isIdCardNo(num) {
      num = num.toUpperCase();
      //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
      if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
          // alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
          return false;
      }
      //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
      //下面分别分析出生日期和校验位
      var len, re;
      len = num.length;
      if (len == 15) {
          re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
          var arrSplit = num.match(re);
          //检查生日日期是否正确
          var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
          var bGoodDay;
          bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2]))
                      && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3]))
                      && (dtmBirth.getDate() == Number(arrSplit[4]));
          if (!bGoodDay) {
              // alert('输入的身份证号里出生日期不对！');
              return false;
          } else {
              //将15位身份证转成18位
              //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
              var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
              var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
              var nTemp = 0, i;
              num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
              for (i = 0; i < 17; i++) {
                  nTemp += num.substr(i, 1) * arrInt[i];
              }
              num += arrCh[nTemp % 11];
              return true;
          }
      }
      if (len == 18) {
          re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
          var arrSplit = num.match(re);
          //检查生日日期是否正确
          var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
          var bGoodDay;
          bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2]))
                      && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3]))
                      && (dtmBirth.getDate() == Number(arrSplit[4]));
          if (!bGoodDay) {
              // alert(dtmBirth.getYear());
              // alert(arrSplit[2]);
              // alert('输入的身份证号里出生日期不对！');
              return false;
          } else {
              //检验18位身份证的校验码是否正确。
              //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
              // var valnum;
              // var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
              // var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
              // var nTemp = 0, i;
              // for (i = 0; i < 17; i++) {
              //     nTemp += num.substr(i, 1) * arrInt[i];
              // }
              // valnum = arrCh[nTemp % 11];
              // if (valnum != num.substr(17, 1)) {
              //     // alert('18位身份证的校验码不正确！应该为：' + valnum);
              //     return false;
              // }
              return true;
          }
      }
      return false;
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
      var rule_ = JSON.parse(JSON.stringify(rule))
      if(!this.contractForm.signDate){
        this.contractForm.signDate=''
      }
      if(!this.contractForm.transMode){
        this.contractForm.transMode=''
      }
      if(this.contractForm.transMode===1){
        delete rule_.guestinfoCode
      }
      this.$tool.checkForm(this.contractForm, rule_).then(() => {
        // 物业地址
        if(this.contractForm.propertyAddr){
        //产权地址
        // if (this.rightAddrCity&&this.rightAddrArea&&this.rightAddrDetail) {
        //   this.contractForm.propertyAddr=this.rightAddrCity+"市"+this.rightAddrArea+"区"+this.rightAddrDetail
          //业主信息
            let isOk
            let ownerArr = this.ownerList.map(item=>Object.assign({},item));
            ownerArr.forEach((element,index) => {
              if(element.isEncryption){//没编辑过手机号
                element.mobile=this.ownerList_[index].mobile
              }else{//编辑过手机号
                element.mobile=element.encryptionMobile;
              }
            });
            for(var i=0;i<ownerArr.length;i++){
              let element = ownerArr[i];
              isOk = false;
              //客户姓名
              if (element.name) {
                if(element.name.replace(/\s/g,"")){
                  element.name=element.name.replace(/\s/g,"");
                  if(element.name.indexOf("先生")===-1&&element.name.indexOf("女士")===-1){
                    // 电话号码
                    if (element.mobile.length === 11||true) {
                    let reg = /^1[0-9]{10}$/;//手机号正则
                    let reg_ = /^0\d{2,3}\-?\d{7,8}$/;//固话正则
                    if (reg.test(element.mobile)||reg_.test(element.mobile)) {
                      // 人员关系
                      if (element.relation) {
                        // 证件类型
                        if(element.cardType){
                          // 证件号码
                          if (element.cardCode.replace(/\s/g,"")) {
                            if(element.cardType!==1){
                              element.cardCode=element.cardCode.replace(/[&\|\\\*^%$#@\-]/g,"")
                            }
                            if (element.cardType===1&&this.isIdCardNo(element.cardCode)||(element.cardType===2&&element.cardCode.length<=9)||(element.cardType===3&&element.cardCode.length<=20)||(element.cardType===4&&element.cardCode.length<=10)) {
                              isOk = true;
                            }else{
                              this.$message({
                                message: "房源信息-业主证件号不正确",
                                type: "warning"
                              });
                              break
                            }
                          } else {
                            this.$message({
                              message: "房源信息-业主证件号不能为空",
                              type: "warning"
                            });
                            break
                          }
                      }else {
                        this.$message({
                          message: "房源信息-业主证件类型不能为空",
                          type: "warning"
                        });
                        break
                      }
                    } else {
                      this.$message({
                        message: "房源信息-业主关系不能为空",
                        type: "warning"
                      });
                      break
                    }
                    }else{
                      this.$message({
                        message: "房源信息-业主电话号码不正确",
                        type: "warning"
                      });
                      break
                    }
                  } else {
                    this.$message({
                      message: "房源信息-业主电话号码不正确",
                      type: "warning"
                    });
                    break
                  }
                } else {
                  this.$message({
                    message: "房源信息-业主姓名不正确",
                    type: "warning"
                  });
                  break
                }
                }else{
                  this.$message({
                    message: "房源信息-业主姓名不能为空",
                    type: "warning"
                  });
                  break
                }
              } else {
                this.$message({
                  message: "房源信息-客户姓名不能为空",
                  type: "warning"
                });
                break
              }
            };
            if(isOk){
              let isOk_
              if(this.contractForm.transMode===2){
                //客户信息
                let guestArr = this.guestList.map(item=>Object.assign({},item));
                guestArr.forEach((element,index) => {
                  if(element.isEncryption){//没编辑过手机号
                    element.mobile=this.guestList_[index].mobile
                  }else{//编辑过手机号
                    element.mobile=element.encryptionMobile;
                  }
                });
                for(var i=0;i<guestArr.length;i++){
                  let element = guestArr[i];
                  isOk = false;
                  //客户姓名
                  if (element.name) {
                    if(element.name.replace(/\s/g,"")){
                      element.name=element.name.replace(/\s/g,"");
                      if(element.name.indexOf("先生")===-1&&element.name.indexOf("女士")===-1){
                        // 电话号码
                        if (element.mobile.length === 11||true) {
                        let reg = /^1[0-9]{10}$/;//手机号正则
                        let reg_ = /^0\d{2,3}\-?\d{7,8}$/;//固话正则
                        if (reg.test(element.mobile)||reg_.test(element.mobile)) {
                          // 人员关系
                          if (element.relation) {
                            // 证件类型
                            if(element.cardType){
                              // 证件号码
                              if (element.cardCode.replace(/\s/g,"")) {
                                if(element.cardType!==1){
                                  element.cardCode=element.cardCode.replace(/[&\|\\\*^%$#@\-]/g,"")
                                }
                                if (element.cardType===1&&this.isIdCardNo(element.cardCode)||(element.cardType===2&&element.cardCode.length<=9)||(element.cardType===3&&element.cardCode.length<=20)||(element.cardType===4&&element.cardCode.length<=10)) {
                                  isOk_ = true;
                                }else{
                                  this.$message({
                                    message: "客源信息-客户证件号不正确",
                                    type: "warning"
                                  });
                                  break
                                }
                              } else {
                                this.$message({
                                  message: "客源信息-客户证件号不能为空",
                                  type: "warning"
                                });
                                break
                              }
                          }else {
                            this.$message({
                              message: "客源信息-客户证件类型不能为空",
                              type: "warning"
                            });
                            break
                          }
                        } else {
                          this.$message({
                            message: "客源信息-客户关系不能为空",
                            type: "warning"
                          });
                          break
                        }
                        }else{
                          this.$message({
                            message: "客源信息-客户电话号码不正确",
                            type: "warning"
                          });
                          break
                        }
                      } else {
                        this.$message({
                          message: "客源信息-客户电话号码不正确",
                          type: "warning"
                        });
                        break
                      }
                    } else {
                      this.$message({
                        message: "客源信息-客户姓名不正确",
                        type: "warning"
                      });
                      break
                    }
                    }else{
                      this.$message({
                        message: "客源信息-客户姓名不能为空",
                        type: "warning"
                      });
                      break
                    }
                  } else {
                    this.$message({
                      message: "客源信息-客户姓名不能为空",
                      type: "warning"
                    });
                    break
                  }
                };
              }
              if(isOk_||this.contractForm.transMode===1){
                //验证手机号吗是否重复
                let ownerMobileList = [];
                let guestMobileList = [];
                //验证身份证是否重复
                let IdCardList = [];
                //验证护照是否重复
                let passportList = [];
                //验证营业执照是否重复
                let businessList = [];
                //验证军官证是否重复
                let militaryIDList = [];

                ownerArr.forEach(element => {
                  if(element.cardType===1){
                    IdCardList.push(element.cardCode);
                  }
                  if(element.cardType===2){
                    passportList.push(element.cardCode);
                  }
                  if(element.cardType===3){
                    businessList.push(element.cardCode);
                  }
                  if(element.cardType===4){
                    militaryIDList.push(element.encryptionCode);
                  }
                  let obj = JSON.parse(JSON.stringify(element))
                  obj.mobile=obj.mobile.replace('-','')
                  ownerMobileList.push(obj.mobile);
                });
                let ownerGuestMobile = true
                if(this.contractForm.transMode===2){
                  //客户信息
                  let guestArr = this.guestList.map(item=>Object.assign({},item));
                  guestArr.forEach((element,index) => {
                    if(element.isEncryption){//没编辑过手机号
                      element.mobile=this.guestList_[index].mobile
                    }else{//编辑过手机号
                      element.mobile=element.encryptionMobile;
                    }
                  });
                  guestArr.forEach(element => {
                    if(element.cardType===1){
                      IdCardList.push(element.cardCode);
                    }
                    if(element.cardType===2){
                      passportList.push(element.cardCode);
                    }
                    if(element.cardType===3){
                      businessList.push(element.cardCode);
                    }
                    if(element.cardType===4){
                      militaryIDList.push(element.encryptionCode);
                    }
                    let obj = JSON.parse(JSON.stringify(element))
                    obj.mobile=obj.mobile.replace('-','')
                    guestMobileList.push(obj.mobile);
                  });
                  for (let index = 0; index < guestMobileList.length; index++) {
                    if(ownerMobileList.includes(guestMobileList[index])){
                      ownerGuestMobile=false
                      break
                    }
                  }
                }
                let IdCardList_= Array.from(new Set(IdCardList));
                let passportList_= Array.from(new Set(passportList));
                let businessList_= Array.from(new Set(businessList));
                let militaryIDList_= Array.from(new Set(militaryIDList));

                if(ownerGuestMobile){
                  if(IdCardList.length===IdCardList_.length){
                    if(passportList.length===passportList_.length){
                      if(businessList.length===businessList_.length){
                        if(militaryIDList.length===militaryIDList_.length){
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
                            message:'军官证重复',
                            type: "warning"
                          })
                        }
                      }else{
                        this.$message({
                          message:'营业执照重复',
                          type: "warning"
                        })
                      }
                    }else{
                      this.$message({
                        message:'护照重复',
                        type: "warning"
                      })
                    }
                  }else{
                    this.$message({
                      message:'证件号重复',
                      type: "warning"
                    })
                  }
                }else{
                  this.$message({
                    message:'电话号码重复',
                    type: "warning"
                  })
                }
              }
            }
        }else{
          this.$message({
            message:'房源信息-物业地址未填写完整',
            type: "warning"
          })
        }
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
      this.contractForm.ownerList=[];
      this.contractForm.customerList=[];
      let ownerArr = this.ownerList.map(item=>Object.assign({},item));
      let guestArr = this.guestList.map(item=>Object.assign({},item));
      ownerArr.forEach((element,index) => {
        if(element.isEncryption){
          element.mobile=this.ownerList_[index].mobile
        }else{
          element.mobile=element.encryptionMobile;
        }
        delete element.isEncryption;
        if(this.operationType===1){
          element.pid=index+1
        }
        this.contractForm.ownerList.push(element);
      });
      if(this.contractForm.transMode===2){
        guestArr.forEach((element,index) => {
          if(element.isEncryption){
            element.mobile=this.guestList_[index].mobile
          }else{
            element.mobile=element.encryptionMobile;
          }
          if(this.operationType===1){
            element.pid=index+1
          }
          delete element.isEncryption;
          this.contractForm.customerList.push(element);
        });
      }else{
        //若先填写了客源信息 然后切换交易方式为收房 保存合同时需要把客源信息去掉
        delete this.contractForm.guestinfoCode
        delete this.contractForm.guestinfo
      }
      let param = this.contractForm
      param.id = this.contId ? this.contId : null
      delete param.createTime
      delete param.recordDeptName
      delete param.recordName
      delete param.updateTime
      //新增
      let url="/api/contractInfo/longLease/addContract"
      let message = "创建成功"
      //编辑
      if(this.operationType===2){
        url="/api/contractInfo/longLease/updateContract"
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
              type:"cz"
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
        return time_
      }
    }
  },
};
</script>

<style scoped lang="less">
@import "~@/assets/common.less";
.disabled {
  background-color: #f5f7fa;
  cursor: not-allowed;
  color: #C0C4CC !important;
}
.add-form {
  padding: 10px;
  font-size: 14px;
  box-sizing:border-box;
  background: @bg-white;
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