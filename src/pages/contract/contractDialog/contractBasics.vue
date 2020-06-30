<template>
  <div class="view-container">
    <el-form :inline="true" :model="contractForm" class="add-form" size="small" :style="{ height: clientHei }">
      <!-- 合同信息 -->
      <div class="contractMsg">
        <p>合同信息</p>
        <div class="form-content">
          <el-form-item label="签约时间：" style="text-align:right;width:285px;" class="form-label">
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
          <el-form-item label="合同类型：" class="width-250">
            <el-input placeholder="请输入内容" value="租赁" :disabled="true" style="width:140px" v-if="contractForm.type===1"></el-input>
            <el-input placeholder="请输入内容" value="买卖" :disabled="true" style="width:140px" v-if="contractForm.type===2"></el-input>
            <el-input placeholder="请输入内容" value="代办" :disabled="true" style="width:140px" v-if="contractForm.type===3"></el-input>
          </el-form-item>
          <el-form-item label="纸质合同编号：" class="width-250 form-label" style="width:340px;" v-if="recordType===2">
            <input style="width:200px;" type="text" :disabled="canInput" maxlength="30" v-model="contractForm.pCode" @input="inputCode" placeholder="请输入" class="dealPrice" :class="{'disabled':canInput}">
          </el-form-item>
          <br>
          <el-form-item label="客户佣金：" class="width-250">
            <input type="text" :disabled="canInput" v-model="contractForm.custCommission" @input="cutNumber('custCommission')" @change="countTotal" placeholder="请输入内容" class="dealPrice" :class="{'disabled':canInput}">
            <i class="yuan">元</i>
          </el-form-item>
          <el-form-item label="业主佣金：" style="text-align:right;width:285px;">
            <input type="text" :disabled="canInput" v-model="contractForm.ownerCommission" @input="cutNumber('ownerCommission')" @change="countTotal" placeholder="请输入内容" class="dealPrice" :class="{'disabled':canInput}">
            <i class="yuan">元</i>
          </el-form-item>
          <el-form-item label="总佣金：" style="text-align:right;width:280px;">
            <input placeholder="请输入内容" :value="commissionTotal" :disabled="true" class="dealPrice disabled">
            <i class="yuan">元</i>
          </el-form-item>
        </div>
      </div>
      <!-- 房源信息 -->
      <div class="houseMsg">
        <p>房源信息</p>
        <div class="form-content">
          <el-form-item label="房源编号：" class="width-250" :class="{'form-label':operationType===1}">
            <span class="select" @click="showDialog('house')" v-if="sourceBtnCheck||canInput||!offLineInput">{{contractForm.houseinfoCode?contractForm.houseinfoCode:'请选择房源'}}</span>
            <span class="select_" v-else>{{contractForm.houseinfoCode}}</span>
          </el-form-item>
          <el-form-item :label="contractForm.type===1?'租金：':'成交总价：'" class="form-label width-250">
            <input type="text" :disabled="canInput" v-model="contractForm.dealPrice" @input="cutNumber('dealPrice')" placeholder="请输入内容" class="dealPrice" :class="{'disabled':canInput}">
            <i class="yuan" v-if="contractForm.type!==1">元</i>
          </el-form-item>
          <el-form-item v-if="contractForm.type===1">
            <el-select :disabled="canInput" v-model="contractForm.timeUnit" placeholder="请选择" style="width:105px">
              <el-option v-for="item in dictionary['507']" :key="item.key" :label="`元 / ${item.value}`" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <span class="chineseNum">{{contractForm.dealPrice|moneyFormat}}</span>
          </el-form-item>
          <br>
          <el-form-item label="物业地址：" :class="{'form-label':operationType===1}" style="width:605px;text-align:right">
            <span class="propertyAddress" v-if="contractForm.houseinfoCode">
              {{contractForm.houseInfo.EstateName.replace(/\s/g,"")+' '+contractForm.houseInfo.BuildingName.replace(/\s/g,"")+contractForm.houseInfo.Unit.replace(/\s/g,"")+contractForm.houseInfo.RoomNo.replace(/\s/g,"")}}
            </span>
            <span class="propertyAddress color_" v-else>物业地址</span>
          </el-form-item>
          <br>
          <el-form-item label="产权地址：" class="form-label" style="width:605px;text-align:right">
            <input v-model="contractForm.propertyRightAddr" :disabled="canInput" maxlength="70" placeholder="请输入内容" @input="cutAddress" class="dealPrice" :class="{'disabled':canInput}" style="width:500px" />
          </el-form-item>
          <br>
          <el-form-item label="建筑面积：" class="width-250">
            <input type="text" v-model="contractForm.houseInfo.Square" :disabled="canInput" @input="cutNumber('Square')" placeholder="请输入内容" class="dealPrice" :class="{'disabled':canInput}">
            <i class="yuan">㎡</i>
          </el-form-item>
          <el-form-item label="套内面积：" class="width-250">
            <input type="text" v-model="contractForm.houseInfo.SquareUse" :disabled="canInput" @input="cutNumber('SquareUse')" placeholder="请输入内容" class="dealPrice" :class="{'disabled':canInput}">
            <i class="yuan">㎡</i>
          </el-form-item>
          <br>
          <el-form-item label="业主信息：" class="form-label" style="padding-left:18px">
            <ul class="peopleMsg">
              <li v-for="(item,index) in t_ownerList" :key="index">
                <span class="merge">
                  <input v-model="item.name" :disabled="canInput" placeholder="姓名" maxlength="30" @input="inputOnly(index,'owner')" class="name_" :class="{'disabled':canInput}">
                  <input v-model="item.mobile" :disabled="canInput" type="tel" placeholder="电话" class="mobile_" :class="{'disabled':canInput}" @input="verifyMobile(item,index,'owner')" @keydown="saveMobile(item,index,'owner')">
                </span>
                <el-select v-model="item.relation" placeholder="关系" :disabled="canInput" class="relation_">
                  <el-option v-for="item in relationList" :key="item.key" :label="item.value" :value="item.value">
                  </el-option>
                </el-select>
                <span @click.stop="addcommissionData" class="icon" v-if="!canInput">
                  <i class="iconfont icon-tubiao_shiyong-14"></i>
                </span>
                <span @click.stop="delPeople(index,'owner')" v-if="t_ownerList.length>1&&!canInput" class="icon">
                  <i class="iconfont icon-tubiao_shiyong-4"></i>
                </span>
              </li>
            </ul>
          </el-form-item>
        </div>
      </div>
      <!-- 客源信息 -->
      <div class="houseMsg">
        <p>客源信息</p>
        <div class="form-content">
          <el-form-item label="客源编号：" class="width-250">
            <span class="select" @click="showDialog('guest')" v-if="sourceBtnCheck||canInput||!offLineInput">{{contractForm.guestinfoCode?contractForm.guestinfoCode:'请选择客源'}}</span>
            <span class="select_" v-else>{{contractForm.guestinfoCode?contractForm.guestinfoCode:'--'}}</span>
          </el-form-item>
          <el-form-item label="成交经纪人：" class="form-label" style="width:500px;text-align:right">
            <el-select
              :disabled="offLineInput"
              class="dealAgentStyle"
              style="width:130px"
              v-model="contractForm.dealAgentId"
              filterable
              remote
              reserve-keyword
              placeholder="成交经纪人"
              @change="selectOption"
							:remote-method="(val)=>remoteMethod(val,'agent')">
              <el-option
                v-for="item in options"
                :key="item.empId"
                :label="item.empName"
                :value="item.empId">
                <span style="float: left">{{ item.empName+"-"+item.depName }}</span>
              </el-option>
            </el-select>
            <input type="text" placeholder="店长" disabled class="dealPrice storeStyle" :title="contractForm.dealAgentShopowner" v-model="contractForm.dealAgentShopowner">
            <input type="text" placeholder="所属门店" disabled class="dealPrice storeStyle" :title="contractForm.dealAgentStoreName" v-model="contractForm.dealAgentStoreName">
          </el-form-item>
          <br>
          <el-form-item label="客户信息：" class="form-label" style="padding-left:18px">
            <ul class="peopleMsg">
              <li v-for="(item,index) in t_guestList" :key="index">
                <span class="merge">
                  <input v-model="item.name" :disabled="canInput" placeholder="姓名" maxlength="30" @input="inputOnly(index,'guest')"  class="name_" :class="{'disabled':canInput}">
                  <input v-model="item.mobile" :disabled="canInput" type="tel" placeholder="电话" class="mobile_" :class="{'disabled':canInput}" @input="verifyMobile(item,index,'guest')" @keydown="saveMobile(item,index,'guest')">
                </span>
                <el-select v-model="item.relation" :disabled="canInput" placeholder="关系" class="relation_">
                  <el-option v-for="item in relationList" :key="item.key" :label="item.value" :value="item.value">
                  </el-option>
                </el-select>
                <span @click.stop="addcommissionData1" class="icon" v-if="!canInput">
                  <i class="iconfont icon-tubiao_shiyong-14"></i>
                </span>
                <span @click.stop="delPeople(index,'guest')" v-if="t_guestList.length>1&&!canInput" class="icon">
                  <i class="iconfont icon-tubiao_shiyong-4"></i>
                </span>
              </li>
            </ul>
          </el-form-item>
        </div>
      </div>
      <!-- 合同备注 -->
      <div class="houseMsg">
        <p @click="showRemarkTab" class="thirdParty">备注栏 <span class="attention iconfont icon-tubiao-10" :class="{'attention_':showRemark}"></span></p>
        <div class="remarkType" v-show="showRemark">
          <el-form-item style="padding-left:20px;position:relative;">
              <!-- @input="inputCode('remarks')" -->
            <el-input type="textarea" :rows="6" maxlength="200" resize='none' :disabled="canInput" v-model="contractForm.remarks" placeholder="请输入备注内容"></el-input>
            <span class="textLength">{{contractForm.remarks.length}}/200</span>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="btn">
      <div>
        <div v-if="operationType===2">
          <p><span>录入时间：</span>{{contractForm.createTime|formatTime}}</p>
          <p><span>录入人：</span>{{contractForm.recordDeptName}}-{{contractForm.recordName}}</p>
          <p><span>最后修改：</span>{{contractForm.updateTime|formatTime}}</p>
        </div>
      </div>
      <div>
        <el-button type="primary" round @click="isSave(0)" :disabled="canClick">{{canInput?"保存":"保存并进入下一步"}}</el-button>
      </div>
    </div>

    <!-- 房源客源弹窗 -->
    <houseGuest :dialogType="dialogType" :dialogVisible="isShowDialog" :contractType="contractType" :choseHcode="choseHcode" :choseGcode="choseGcode" @closeHouseGuest="closeHouseGuest" v-if="isShowDialog">
    </houseGuest>
    <!-- 保存合同确认框 -->
    <el-dialog title="" :visible.sync="dialogSave" class="personalMsg" width="460px" :closeOnClickModal="$tool.closeOnClickModal">
      <div class="warning-box">
        <p>
          <i class="iconfont icon-tubiao_shiyong-1"></i>
          <span>请确认客户和业主的姓名与证件上的一致？</span>
        </p>
        <div class="personalStyle">
          <div class="ownerStyle">
            <div>
              业主姓名：
            </div>
            <div>
              <span v-for="(item,index) in t_ownerList" :key="'owner'+index">{{item.name}}{{index===t_ownerList.length-1?"":"，"}}</span>
            </div>
          </div>
          <div class="ownerStyle">
            <div>
              客户姓名：
            </div>
            <div>
              <span v-for="(item,index) in t_guestList" :key="'owner'+index">{{item.name}}{{index===t_guestList.length-1?"":"，"}}</span>
            </div>
          </div>
        </div>
        <!-- <ul>
          <li>业主姓名：</li>
          <li v-for="item in t_ownerList" :key="'owner'+item.encryptionCode" style="padding-left:85px;">
            {{item.name}}
          </li>
          <li>客户姓名：</li>
          <li v-for="item in t_guestList" :key="'guets'+item.encryptionCode" style="padding-left:85px;">
            {{item.name}}
          </li>
        </ul> -->
        <p>否则合同将无效，之后收款所开票据无效！！！</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSave = false" size="small">不确认</el-button>
        <el-button type="primary" size="small" @click="saveCont" v-loading.fullscreen.lock="fullscreenLoading">确认</el-button>
      </span>
    </el-dialog>
    <!-- 删除人员确认框 -->
    <el-dialog title="提示" :visible.sync="dialogDel" width="460px" :closeOnClickModal="$tool.closeOnClickModal">
      <span>确定删除当前联系人吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDel = false">取 消</el-button>
        <el-button type="primary" @click="delPeopleMsg">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 创建合同成功提示框 -->
    <el-dialog title="提示" :visible.sync="dialogSuccess" width="460px" :closeOnClickModal="$tool.closeOnClickModal" :showClose="false">
      <span>是否继续上传附件？如果不上传附件权证将无法办理！（你也可以以后再上传，上传附件后权证将接收办理）</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="toContract">取 消</el-button>
        <el-button type="primary" @click="toUpload">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 单公司提示框 -->
    <el-dialog title="提示" :visible.sync="singleCompany" width="460px" :closeOnClickModal="$tool.closeOnClickModal" :showClose="false">
      <div class="singleCompany">{{singleCompanyName}}未设置公章，请联系管理员设置！</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="toH5">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分成人信息弹窗 -->
    <el-dialog :title="dialogType==='house'?'当前房源分成人':'当前客源分成人'" :visible.sync="agentsDialog" width="500px" :closeOnClickModal="$tool.closeOnClickModal">
      <div class="agentsDialog">
        <!-- <p>当前房源分成人</p> -->
        <ul>
          <li v-for="(item, index) in agentsList" :key="index" :title="`${item.roleText} ${item.empName}·${item.deptName}`"><span>{{item.roleText}}</span>{{item.empName+"·"+item.deptName}}</li>
        </ul>
      </div>
    </el-dialog>
    <!-- 设置/转交审核人 -->
    <checkPerson :show="checkPerson.state" :type="checkPerson.type" :showLabel="checkPerson.label" :bizCode="checkPerson.code" :flowType="checkPerson.flowType" @close="closeCheckPerson" @submit="closeCheckPerson" v-if="checkPerson.state"></checkPerson>
    <a id="add" href="" v-show="false" target="_blank"></a>
  </div>
</template>

<script>
import { TOOL } from "@/assets/js/common";
import { MIXINS } from "@/assets/js/mixins";
import houseGuest from "../contractDialog/houseGuest";
import checkPerson from '@/components/checkPerson';
import contractBasics from "../contractDialog/contractBasics";
const rule = {
  signDate: {
    name: "签约时间"
  },
  pCode:{
    name:"纸质合同编号"
  },
  houseinfoCode: {
    name: "房源"
  },
};
let loading = null
export default {
  mixins: [MIXINS],
  components: {
    houseGuest,
    checkPerson,
    contractBasics
  },
  props:{
    contractForm:{
      type: Object,
      default(){
        return {}
      }
    },
    //线上线下合同
    recordType:{
      type:Number,
      default: 1
    },
    houseId:{
      type:Number,
      default:0
    },
    //是否能输入
    canInput:{
      type:Boolean,
      default:false
    },
    //线下合同已签约状态是否能编辑
    offLineInput:{
      type:Boolean,
      default:false
    },
    //房客源是否可选择
    sourceBtnCheck:{
      type:Boolean,
      default:true
    },
    //操作类型  新增编辑
    operationType:{
      type:Number,
      default: 1
    },
    guestList_:{
      type:Array,
      default(){
        return []
      }
    },
    ownerList_:{
      type:Array,
      default(){
        return []
      }
    },
    guestList:{
      type:Array,
      default(){
        return [
          {
            type: 2,
            mobile: "",
            relation: "",
            name: "",
          }
        ]
      }
    },
    ownerList:{
      type:Array,
      default(){
        return [
          {
            type: 1,
            mobile: "",
            relation: "",
            name: "",
          }
        ]
      }
		},
		basicsOptions:{
			type:Array,
			default(){
				return []
			}
    },
    //备注栏折叠展开
    getShowRemark:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      clientHei:'',
      t_ownerList:JSON.parse(JSON.stringify(this.ownerList)),
      t_ownerList_:JSON.parse(JSON.stringify(this.ownerList_)),
      t_guestList:JSON.parse(JSON.stringify(this.guestList)),
      t_guestList_:JSON.parse(JSON.stringify(this.guestList_)),
      options:JSON.parse(JSON.stringify(this.basicsOptions)),
      showRemark:JSON.parse(JSON.stringify(this.getShowRemark)),
      dialogType: "",
      isShowDialog: false,
      dialogSave: false,
      dictionary: {
        //数据字典
        "507": "", //时间单位
      },
      //房客源弹窗类型
      contractType: "",
      loading: false,
      //人员关系列表
      relationList: [],
      fullscreenLoading:false,
      haveExamine:0,
      //人员信息下标
      peopleIndex:'',
      dialogDel:false,
      delType:'',
      choseHcode:0,//选择的房源编号
      choseGcode:0,//选择的客源编号
      dialogSuccess:false,
      detailCode:'',
      detailId:'',
      //改变之前的手机号
      beforeChangeMobile:'',
      checkPerson: {
        state:false,
        type:1,
        code:'',
        flowType:3,
        label:false
      },
      canClick:false,
      //权限配置
      power: {
        'sign-com-htdetail': {
          state: false,
          name: '合同详情'
        },
        'sign-ht-xq-data-add': {
          state: false,
          name: '编辑资料库'
        },
      },
      singleCompany:false,//单公司提示框
      singleCompanyName:'',
      agentsDialog:false,
      agentsList:[],//分成人列表
      //日期选择器禁止选择未来时间
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      //总佣金
      commissionTotal:0,
    };
  },
  created() {
    this.getDictionary();//字典
    this.getRelation();//人员关系
    this.countTotal()
    if(this.operationType===2){
      this.countTotal()
    }
    if(this.houseId){
      this.getHousedetail(this.houseId)
    }
  },
  methods: {
    //计算总佣金
    countTotal(){
      let owner = Number(this.contractForm.ownerCommission?this.contractForm.ownerCommission:0)
      let cust = Number(this.contractForm.custCommission?this.contractForm.custCommission:0)
      if(cust||owner){
        let total = cust + owner
        this.commissionTotal = this.fomatFloat(total,2)
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
    // 控制弹框body内容高度，超过显示滚动条
    clientHeight() {
      this.clientHei= document.documentElement.clientHeight -160 + 'px'
    },
    addcommissionData() {
      if (this.t_ownerList.length < 10) {
        this.t_ownerList.push({
          type: 1,
          mobile: "",
          encryptionMobile:"",
          relation: "",
          name: "",
        });
      } else {
        this.$message({
          message: "已达到最大数量",
          type: "warning"
        });
      }
    },
    addcommissionData1() {
      if (this.t_guestList.length < 10) {
        this.t_guestList.push({
          type: 2,
          mobile: "",
          encryptionMobile:"",
          relation: "",
          name: "",
        });
      } else {
        this.$message({
          message: "已达到最大数量",
          type: "warning"
        });
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
        this.t_ownerList.splice(this.peopleIndex, 1);
        this.t_ownerList_.splice(this.peopleIndex, 1);
        this.dialogDel=false;
      }else if(this.delType==="guest"){
        this.t_guestList.splice(this.peopleIndex, 1);
        this.t_guestList_.splice(this.peopleIndex, 1);
        this.dialogDel=false;
      }
    },
    //存贮改变之前的手机号
    saveMobile(item,index,type){
      if(item.isEncryption){
        if(type==="owner"){
          this.beforeChangeMobile= this.t_ownerList[index].mobile;
        }else if(type==="guest"){
          this.beforeChangeMobile=this.t_guestList[index].mobile;
        }
      }
    },
    //手机号验证
    verifyMobile(item,index,type) {
      let beginNum = /^0.*$/
      let beginNum_ = /^1.*$/
      if(item.mobile.length>0){
        if(type==="owner"){
          if(beginNum.test(item.mobile)){
            this.t_ownerList[index].mobile=item.mobile.substring(0,13)
          // }else if(beginNum_.test(item.mobile)){
          }else{
            this.t_ownerList[index].mobile=item.mobile.substring(0,11)
          }
          item.mobile=this.t_ownerList[index].mobile
        }else if(type==="guest"){
          if(beginNum.test(item.mobile)){
            this.t_guestList[index].mobile=item.mobile.substring(0,13)
          // }else if(beginNum_.test(item.mobile)){
          }else{
            this.t_guestList[index].mobile=item.mobile.substring(0,11)
          }
          item.mobile=this.t_guestList[index].mobile
        }
      }
      if(item.isEncryption){
        if(type==="owner"){
          if(this.t_ownerList[index].mobile!==this.beforeChangeMobile){
            if(Number(item.mobile)){
              this.t_ownerList[index].mobile=item.mobile;
            }else{
              this.t_ownerList[index].mobile='';
            }
            this.t_ownerList[index].isEncryption=false;
          }
        }else if(type==="guest"){
          if(this.t_guestList[index].mobile!==this.beforeChangeMobile){
            if(Number(item.mobile)){
              this.t_guestList[index].mobile=item.mobile;
            }else{
              this.t_guestList[index].mobile='';
            }
            this.t_guestList[index].isEncryption=false;
          }
        }
      }else{
        if(item.mobile.length>=11){
          let reg = /^1[0-9]{10}$/;
          let reg_ = /^0\d{2,3}-?\d{7,8}$/
          if (!reg.test(item.mobile)&&!reg_.test(item.mobile)) {
            this.$message({
              message:'电话号码格式不正确',
              type: "warning"
            })
          }
        }
      }
    },
    //验证合同信息
    isSave(value) {
      var rule_ = JSON.parse(JSON.stringify(rule))
      this.haveExamine=value;
      if(this.recordType!=2){
        delete rule_.pCode
      }
      if(!this.contractForm.signDate){
        this.contractForm.signDate=''
      }
      if(this.contractForm.pCode){
        this.contractForm.pCode=this.contractForm.pCode.replace(/\s+/g,"")
      }
      if(!this.contractForm.pCode){
        this.contractForm.pCode=''
      }
      this.$tool.checkForm(this.contractForm, rule_).then(() => {
        if (this.contractForm.custCommission > 0 || this.contractForm.ownerCommission > 0) {//佣金
          if(this.contractForm.dealPrice>0){
						if(this.contractForm.propertyRightAddr){
							let isOk;
							let ownerArr = this.t_ownerList.map(item=>Object.assign({},item));
							ownerArr.forEach((element,index) => {
								if(element.isEncryption){
									element.encryptionMobile=this.t_ownerList_[index].encryptionMobile
								}else{
									element.encryptionMobile=element.mobile;
								}
							});

							for(var i=0;i<ownerArr.length;i++){
								let element = ownerArr[i]
								isOk = false;
								if (element.name) {
									if(element.name.replace(/\s/g,"")){
										element.name=element.name.replace(/\s/g,"");
										if(element.name.indexOf("先生")===-1&&element.name.indexOf("女士")===-1){
											if (element.encryptionMobile.length === 11||true) {
											let reg = /^1[0-9]{10}$/;//手机号正则
											let reg_ = /^0\d{2,3}\-?\d{7,8}$/;//固话正则
											if (reg.test(element.encryptionMobile)||reg_.test(element.encryptionMobile)) {
												if (element.relation) {
													isOk = true;  
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
									}else{
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
										message: "房源信息-业主姓名不能为空",
										type: "warning"
									});
									break
								}
							};
							if (isOk) {
								let isOk_;
								let guestArr = this.t_guestList.map(item=>Object.assign({},item));
								guestArr.forEach((element,index) => {
									if(element.isEncryption){
										element.encryptionMobile=this.t_guestList_[index].encryptionMobile
									}else{
										element.encryptionMobile=element.mobile;
									}
								});
								for(var i=0;i<guestArr.length;i++){
									let element = guestArr[i];
									isOk_ = false;
									if (element.name) {
										if(element.name.replace(/\s/g,"")){
											element.name=element.name.replace(/\s/g,"");
											if(element.name.indexOf("先生")===-1&&element.name.indexOf("女士")===-1){
												if (element.encryptionMobile.length === 11||true) {
												let reg = /^1[0-9]{10}$/;//手机号正则
												let reg_ = /^0\d{2,3}\-?\d{7,8}$/;//固话正则
												if (reg.test(element.encryptionMobile)||reg_.test(element.encryptionMobile)) {
													if (element.relation) {
														isOk_ = true;
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
								if (isOk_) {
									// 验证手机号是否重复  2019.10.17 张丽茹更改需求 业主之间电话号码可以重复 客户之间电话号码可以重复 但业主和客户电话号码不能重复
									let ownerMobileList = [];
									let guestMobileList = [];

									ownerArr.forEach(element => {
                    let obj = JSON.parse(JSON.stringify(element))
                    obj.encryptionMobile=obj.encryptionMobile.replace('-','')
										ownerMobileList.push(obj.encryptionMobile);
									});

									guestArr.forEach(element => {
                    let obj = JSON.parse(JSON.stringify(element))
                    obj.encryptionMobile=obj.encryptionMobile.replace('-','')
										guestMobileList.push(obj.encryptionMobile);
									});
									let ownerGuestMobile = true
									for (let index = 0; index < guestMobileList.length; index++) {
										if(ownerMobileList.includes(guestMobileList[index])){
											ownerGuestMobile=false
											break
										}
									}
									if(ownerGuestMobile){
										//经纪人
										if(this.contractForm.dealAgentId){
                      //门店
                      if(this.contractForm.dealAgentStoreId){
                        this.dialogSave = true;
                      }else{
                        this.$message({
                          message:'客源信息-门店不能为空',
                          type: "warning"
                        })
                      }
										}else{
											this.$message({
												message:'客源信息-成交经纪人不能为空',
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
								message: "房源信息-产权地址不能为空",
								type: "warning"
							});
						}
          }else{
            this.$message({
              message: `房源信息-${this.contractForm.type===1?"租金":"成交总价"}不能为零`,
              type: "warning"
            });
          }
        } else {
          this.$message({
            message: "合同信息-佣金不能为零",
            type: "warning"
          });
        }
      })
      .catch(error => {
        this.$message({
          message: `${error.title.length<3?'':'合同信息-'}${error.title}${error.msg}`,
          type: "warning"
        });
      });
    },
    saveCont() {
      this.fullscreenLoading=true;
      this.addContract()
    },
    // 新增/编辑合同
    addContract(){
      this.fullscreenLoading=true
      this.dialogSave=false
      this.contractForm.contPersons=[];
      let ownerArr = this.t_ownerList.map(item=>Object.assign({},item));
      let guestArr = this.t_guestList.map(item=>Object.assign({},item));
      ownerArr.forEach((element,index) => {
        if(element.isEncryption){
          element.encryptionMobile=this.t_ownerList_[index].encryptionMobile
        }else{
          element.encryptionMobile=element.mobile;
        }
        delete element.isEncryption;
        this.contractForm.contPersons.push(element);
      });
      guestArr.forEach((element,index) => {
        if(element.isEncryption){
          element.encryptionMobile=this.t_guestList_[index].encryptionMobile
        }else{
          element.encryptionMobile=element.mobile;
        }
        delete element.isEncryption;
        this.contractForm.contPersons.push(element);
      });
      // propertyRightAddr
      let detail = JSON.parse(JSON.stringify(this.contractForm))
      // delete detail.propertyRightAddr
      delete detail.otherCooperationInfo
      if (this.contractForm.type === 1) {//租赁合同
        var param = {
          leaseCont: detail,
          type: this.operationType,
          haveExamine:this.haveExamine
        };
      }else if(this.contractForm.type === 2 || this.contractForm.type === 3){//买卖代办合同
        var param = {
          saleCont: detail,
          type: this.operationType,
          haveExamine:this.haveExamine
        };
      }
      if(this.recordType===2){
        param.recordType=2
      }else{
        param.recordType=1
      }
      param.recordVersion=1//温州简单/复杂版  1简单 2复杂
      if(this.operationType===1){//新增
        var url = '/api/contract/addContract';
        if(this.recordType===2){
          url = '/api/contract/addLocalContract'
        }
        this.$ajax.postJSON(url, param).then(res => {
          res = res.data;
          if (res.status === 200) {
            this.fullscreenLoading=false;
            if(this.recordType===2){
              this.$message({
                message:"创建成功",
                type: "success"
              })
              this.$router.push({
                path: "/contractDetails",
                query:{
                  id:res.data.id,
                  contType:this.contractForm.type,
                  type:"contBody"
                }
              });
            }else{
              let contractMsg = res.data
              this.hidBtn=1
              sessionStorage.setItem("contractMsg", JSON.stringify(contractMsg));
              if(contractMsg.singleCompany){
                this.singleCompany=true
                this.singleCompanyName=contractMsg.singleCompany
              }else{
                this.$router.push({
                  path: "/extendParams"
                });
              }
            }
          }
        }).catch(error => {
          this.fullscreenLoading=false;
          if(error!=="该合同房源已被其他合同录入，请重新选择房源！"&&error!=="该合同下的房源客源不属于同一个体系，请重新选择！"&&error!=="纸质合同编号规则不允许和系统生成规则一致，请重新输入！"&&error!=="合同编号已存在，请重新输入！"&&error!=="合同编号不符合规范！"){
            this.canClick=true
          }
          this.$message({
            message:error,
            type: "error"
          })
        })
      }else if(this.operationType===2){//编辑
        if(this.contractForm.type===1){
          delete param.leaseCont.contChangeState;
          delete param.leaseCont.contState;
          delete param.leaseCont.contType;
          delete param.leaseCont.laterStageState;
          delete param.leaseCont.toExamineState;
          delete param.leaseCont.previewImg;
          delete param.leaseCont.subscriptionTerm;
          delete param.leaseCont.updateTime;
          delete param.leaseCont.distributableAchievement;
          delete param.leaseCont.achievementState;
          delete param.leaseCont.recordType
          delete param.leaseCont.resultState
        }else if(this.contractForm.type === 2 || this.contractForm.type === 3){
          delete param.saleCont.contChangeState;
          delete param.saleCont.contState;
          delete param.saleCont.contType;
          delete param.saleCont.laterStageState;
          delete param.saleCont.toExamineState;
          delete param.saleCont.previewImg;
          delete param.saleCont.subscriptionTerm;
          delete param.saleCont.updateTime;
          delete param.saleCont.distributableAchievement;
          delete param.saleCont.achievementState;
          delete param.saleCont.recordType
          delete param.saleCont.resultState
        }
        var url = '/api/contract/updateContract';
        if(this.recordType===2){
          url = '/api/contract/addLocalContract'
        }
        this.$ajax.postJSON(url, param).then(res => {
          res = res.data;
          if (res.status === 200) {
            this.fullscreenLoading=false;
            if(this.recordType===2){
              this.$message({
                message:"保存成功",
                type: "success"
              })
              if(this.canInput){//已签约状态编辑完成跳转合同列表
                this.$router.push({
                  path: "/contractList"
                });
              }else{
                this.$router.push({
                  path: "/contractDetails",
                  query:{
                    id:res.data.id,
                    contType:this.contractForm.type,
                    type:"contBody"
                  }
                });
              }
            }else{
              if(this.canInput){//已签约状态编辑完成跳转合同列表
                this.$message({
                  message:"保存成功",
                  type: "success"
                })
                this.$router.push({
                  path: "/contractList"
                });
              }else{
                let contractMsg = res.data
                sessionStorage.setItem("contractMsg", JSON.stringify(contractMsg));
                if(contractMsg.singleCompany){
                  this.singleCompany=true
                  this.singleCompanyName=contractMsg.singleCompany
                }else{
                  this.$router.push({
                    path: "/extendParams"
                  });
                }
              }
            }
          }

        }).catch(error => {
          this.fullscreenLoading=false;
          this.$message({
            message:error,
            type: "error"
          })
        })
      }
    },
    //跳转H5页面
    toH5(){
      this.singleCompany=false
      this.$router.push({
        path: "/extendParams"
      });
    },
    //创建成功提示
    toUpload(value){//上传合同资料库
      this.dialogSuccess=false;
      if(this.power['sign-com-htdetail'].state){
        if(this.power['sign-ht-xq-data-add'].state){
          this.setPath(this.$tool.getRouter(['合同','合同列表','合同详情'],'contractList'));
          this.$router.replace({
            path: "/contractDetails",
            query: {
              type: "dataBank",
              id: this.detailId,//合同id
              code: this.detailCode,//合同编号
              contType: this.contractForm.type//合同类型
            }
          });
        }else{
          this.$message({
            message:'没有资料库权限,无法跳转到资料库'
          });
          this.$router.push('/contractList');
        }
      }else{
        this.$message({
          message:'没有合同详情权限,无法跳转到资料库'
        });
        this.$router.push('/contractList');
      }
    },
    toContract(){//回到合同列表
      this.dialogSuccess=false;
      this.$router.push('/contractList');
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
    //房源客源弹窗
    showDialog(value) {
      if (this.contractForm.type === 1) {
        this.contractType = "求租";
      } else {
        this.contractType = "求购";
      }
      this.isShowDialog = true;
      this.dialogType = value;
    },
    //根据房源id获取房源信息
    getHousedetail(id) {
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
          if(!this.canInput){//正常编辑
            if(houseMsg.TradeInt===2){
              // this.contractForm.dealPrice = houseMsg.ListingPrice*10000;//成交总价
            }else{
              // this.contractForm.dealPrice = houseMsg.ListingPrice;
              // 1 月 2 季度 4 年
              let unit
              if(houseMsg.PriceUnitNameEnum){
                unit = houseMsg.PriceUnitNameEnum
              }else{
                unit = 1
              }
              this.$set(this.contractForm,'timeUnit',unit);
            }
            //产权地址
            let addr = houseMsg.EstateName.replace(/\s/g,"")+houseMsg.BuildingName.replace(/\s/g,"")+houseMsg.Unit.replace(/\s/g,"")+houseMsg.RoomNo.replace(/\s/g,"")
            this.$set(this.contractForm,'propertyRightAddr',addr);

            this.contractForm.houseInfo = houseMsg;
            if(houseMsg.OwnerInfoList.length>0){
              this.t_ownerList=[];
              this.t_ownerList_=[];
              houseMsg.OwnerInfoList.forEach(element => {
                element.type=1;
                element.name=element.OwnerName;
                element.mobile=element.OwnerMobile;
                element.relation=element.Relation;
                element.isEncryption=true;
                delete element.OwnerName
                delete element.OwnerMobile
                delete element.Relation
                let obj = Object.assign({}, element);
                obj.mobile=obj.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
                this.t_ownerList.push(obj);
                let obj_ = Object.assign({}, element);
                obj_.encryptionMobile=obj_.mobile;
                this.t_ownerList_.push(obj_);
              });
            }
          }else{//已签约编辑
            //2019.10.14 张丽茹更改需求 已签约编辑房源物业地址需要更新
            // houseMsg.EstateName=this.contractForm.houseInfo.EstateName
            // houseMsg.BuildingName=this.contractForm.houseInfo.BuildingName
            // houseMsg.Unit=this.contractForm.houseInfo.Unit
            // houseMsg.RoomNo=this.contractForm.houseInfo.RoomNo
            houseMsg.Square=this.contractForm.houseInfo.Square
            houseMsg.SquareUse=this.contractForm.houseInfo.SquareUse
            houseMsg.PriceUnitNameEnum=this.contractForm.timeUnit// 1 月 2 季度 4 年
            
            if(this.contractForm.houseInfo.TradeInt===2){
              houseMsg.ListingPrice=this.contractForm.dealPrice/10000
            }else{
              houseMsg.ListingPrice = this.contractForm.dealPrice
            }
          }
          this.contractForm.houseInfo = houseMsg;
          //获取房源分成人--新增xu
          let param = {
            id:houseMsg.PropertyCode,
            type:1
          }
          // this.getAgentMsg(param)
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
          if(!this.canInput){//正常编辑
            this.contractForm.guestInfo = guestMsg;
            this.$set(this.contractForm.guestInfo,'paymentMethod',1)
            if(guestMsg.OwnerInfo.length>0){
              this.t_guestList=[];
              this.t_guestList_=[];
              guestMsg.OwnerInfo.forEach(element => {
                element.type=2;
                element.name=element.CustName;
                element.mobile=element.CustMobile;
                element.relation=element.CustRelation;
                element.isEncryption=true;
                delete element.CustName
                delete element.CustMobile
                delete element.CustRelation
                let obj = Object.assign({}, element);
                obj.mobile=obj.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
                this.t_guestList.push(obj);
                let obj_ = Object.assign({}, element);
                obj_.encryptionMobile=obj_.mobile;
                this.t_guestList_.push(obj_);
              });
            }
            let item = {
							depName:guestMsg.GuestStoreName,
							depId:guestMsg.GuestStoreCode,
							empName:guestMsg.EmpName,
							empId:guestMsg.EmpCode
            }
						this.options=[].concat([item])
						// 成交经纪人 
            this.$set(this.contractForm,'dealAgentId',guestMsg.EmpCode)//经纪人id
            this.$set(this.contractForm,'dealAgentName',guestMsg.EmpName)//经纪人姓名
            this.$set(this.contractForm,'dealAgentStoreId',guestMsg.GuestStoreCode)//经纪人门店id
            this.$set(this.contractForm,'dealAgentStoreName',guestMsg.GuestStoreName)//经纪人门店
						//经纪人上级
						this.getSuperior(guestMsg.EmpCode)
          }else{//已签约编辑
            this.contractForm.guestInfo = guestMsg;
          }
          //获取客源分成人
          let param = {
            id:guestMsg.InquiryCode,
            type:2
          }
          // this.getAgentMsg(param)
        }
      }).catch(error=>{
        loading.close()
        this.$message({
          message:error,
          type: "error"
        })
      });
    },
    //获取分成人信息
    getAgentMsg(param){
      this.$ajax.get("/api/contract/getAgents",param).then(res=>{
        res=res.data
        if(res.status===200){
          this.agentsList=res.data
          this.agentsDialog=true
        }
      })
    },
    //关闭房源客源弹窗
    closeHouseGuest(value) {
      if (value) {//判断是否点击的确认按钮
        if (value.dialogType === "house") {
          if(this.choseHcode&&this.choseHcode!==value.selectCode){
            // this.contractForm.propertyRightAddr=''
          }
          this.isShowDialog = false;
          this.getHousedetail(value.selectCode);
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
    cutNumber(val){
      if(val==="contCode"){//合同编号

      }else if(val==="dealPrice"){
        this.$nextTick(()=>{
          this.contractForm.dealPrice=this.$tool.cutFloat({val:this.contractForm.dealPrice,max:999999999.99})
        })
      }else if(val==="custEnsure"){
        this.$nextTick(()=>{
          this.contractForm.custEnsure=this.$tool.cutFloat({val:this.contractForm.custEnsure,max:999999999.99})
        })
      }else if(val==="custCommission"){
        this.$nextTick(()=>{
          this.contractForm.custCommission=this.$tool.cutFloat({val:this.contractForm.custCommission,max:999999999.99})
        })
      }else if(val==="ownerCommission"){
        this.$nextTick(()=>{
          this.contractForm.ownerCommission=this.$tool.cutFloat({val:this.contractForm.ownerCommission,max:999999999.99})
        })
      }else if(val==="commissionPayment"){
        this.$nextTick(()=>{
          this.contractForm.commissionPayment=this.$tool.cutFloat({val:this.contractForm.commissionPayment,max:999999999.99})
        })
      }else if(val==="stagesArrears"){
        this.$nextTick(()=>{
          this.contractForm.houseInfo.stagesArrears=this.$tool.cutFloat({val:this.contractForm.houseInfo.stagesArrears,max:999999999.99})
        })
      }else if(val==="otherCooperationCost"){
        this.$nextTick(()=>{
          this.contractForm.otherCooperationCost=this.$tool.cutFloat({val:this.contractForm.otherCooperationCost,max:999999999.99})
        })
      }else if(val==="Square"){
        this.$nextTick(()=>{
          this.contractForm.houseInfo.Square=this.$tool.cutFloat({val:this.contractForm.houseInfo.Square,max:999999.99})
        })
      }else if(val==="SquareUse"){
        this.$nextTick(()=>{
          this.contractForm.houseInfo.SquareUse=this.$tool.cutFloat({val:this.contractForm.houseInfo.SquareUse,max:999999.99})
        })
      }
    },
    cutNumber_(index,type){
      if(type==='guest'){
        this.t_guestList[index].propertyRightRatio=this.$tool.cutFloat({val:this.t_guestList[index].propertyRightRatio,max:100})
      }else if(type==='owner'){
        this.t_ownerList[index].propertyRightRatio=this.$tool.cutFloat({val:this.t_ownerList[index].propertyRightRatio,max:100})
      }
    },
    cutAddress(){
      let addrReg=/\\|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\&|\!|\~|\`|\|/g
      this.contractForm.propertyRightAddr=this.contractForm.propertyRightAddr.replace(/\s+/g,"").replace(addrReg,'')
    },
    inputOnly(index,type){
      if(type==='owner'){
        this.t_ownerList[index].name=this.$tool.textInput(this.t_ownerList[index].name)
      }else if(type==='guest'){
        this.t_guestList[index].name=this.$tool.textInput(this.t_guestList[index].name)
      }else if(type==='other'){
        this.contractForm.otherCooperationInfo.name=this.$tool.textInput(this.contractForm.otherCooperationInfo.name)
      }
    },
    inputCode(){
      // let addrReg=/\\|\/|\@|\#|\%|\?|\？|\!|\！|\…|\￥|\+|\;|\；|\,|\，|\。|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\：|\:|\、|\^|\$|\&|\!|\~|\`|\|/g
      let addrReg = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\(\)\-\_]/g
      if(this.contractForm.pCode){
        this.contractForm.pCode=this.contractForm.pCode.replace(/\s+/g,"").replace(addrReg,'')
      }

    },
    closeCheckPerson(){
      checkPerson.state=false;
      this.$router.push('/contractList');
    },
    //这个可以验证15位和18位的身份证，并且包含生日和校验位的验证。
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
      if(keyword){
        let param = {
          // type:type==="agent"?1:2,  2019.10.16张丽茹更改需求 经纪人可以为店长 不做限制
          name:keyword
        }
        this.$ajax.get('/api/contractInfo/getEmpDeptInfo',param).then(res=>{
          res=res.data
          if(res.status===200){
            if(type==="agent"){
              // this.options = Object.assign([], this.someObject, res.data)
              this.options=res.data
            }else{
              this.options_=res.data
            }
          }
        })
      }
    },
    //经纪人所属门店
    selectOption(val){
      this.getSuperior(val)
      if(this.options.length>0&&val){
        this.options.forEach(element => {
          if(element.empId==val){
            this.$set(this.contractForm,"dealAgentName",element.empName)
            this.$set(this.contractForm,"dealAgentStoreId",element.depId)
            this.$set(this.contractForm,"dealAgentStoreName",element.depName)
          }
        });
      }
    },
    //根据经纪人id查询上级
    getSuperior(id){
      let param = {
        agentId:id
      }
      this.$ajax.get("/api/resource/getShopowner",param).then(res=>{
        res=res.data
        if(res.status===200){
          if(res.data&&res.data.ShopOwnerId){
            this.$set(this.contractForm,"dealAgentShopownerId",res.data.ShopOwnerId)//店长id
					  this.$set(this.contractForm,"dealAgentShopowner",res.data.ShopOwnerName)//店长姓名
					  this.$set(this.contractForm,"dealAgentShopownerMobile",res.data.ShopOwnerMobile)//店长电话
          }else{
            this.$set(this.contractForm,"dealAgentShopownerId",'')//店长id
            this.$set(this.contractForm,"dealAgentShopowner",'')//店长姓名
            this.$set(this.contractForm,"dealAgentShopownerMobile",'')//店长电话
          }
        }
      })
    },
    // 备注栏
    showRemarkTab(){
      this.showRemark = !this.showRemark
      this.contractForm.remarks=''
    },
  },
   mounted(){
    window.onresize = this.clientHeight;
  },
  beforeUpdate() {
    this.clientHeight();
  },
  beforeDestroy(){
    localStorage.removeItem('backMsg')
  },
  filters: {
    moneyFormat: function(val) {
      if (!val) {
        return "零";
      } else {
        return TOOL.toChineseNumber(val);
      }
    }
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
 .disabled {
    background-color: #f5f7fa;
    cursor: not-allowed;
    color: #C0C4CC !important;
  }
.personalMsg{
  /deep/.el-dialog__header{
    border: none !important;
  }
  .personalStyle{
    box-sizing: border-box;
    padding-left: 65px;
    margin-bottom: 10px;
    .ownerStyle{
      display: flex;
      width: 305px;
      margin-bottom: 5px;
      div{
        &:first-of-type{
          min-width: 75px;
        }
      }
    }
  }
}
.singleCompany{
  // text-align: center;
  padding: 20px 0 10px 10px;
}
.agentsDialog{
  box-sizing: border-box;
  padding: 10px 10px 10px;
  p{
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  >ul{
    background-color: #e8e8e8;
    padding: 6px 12px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    >li{
      flex-basis: 46%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      line-height: 1.6;
      span{
        box-sizing: border-box;
        display: inline-block;
        min-width: 50px;
        padding-right: 10px;
        font-weight: bold;
      }
    }
  }
}
.warning-box{
  margin: -4px 0 18px 28px;
  p{
    line-height: 1.4;
    &:first-of-type{
      i{
        color:orange;
        font-size:48px;
        margin-right:16px;
      }
      span{
        font-size:16px
      }
    }
    &:last-of-type{
      padding-left:64px;
      color: red;
    }
  }
  >ul{
    margin-bottom: 10px;
    li{
      padding-left: 65px;
    }
  }
}
.view-container {
  .add-form {
    padding: 10px;
    font-size: 14px;
    background: @bg-white;
    overflow-y: auto;
  }
  input{
    &:-ms-input-placeholder{
      color:#CBCED5!important;
    }
    &::-webkit-input-placeholder{
      color:#CBCED5;
    }
    &::-moz-placeholder{
      color:#CBCED5;
    }
  }
  /deep/.el-input__inner{
    &:-ms-input-placeholder{
      color:#CBCED5!important;
    }
    &::-webkit-input-placeholder{
      color:#CBCED5;
    }
    &::-moz-placeholder{
      color:#CBCED5;
    }
  }
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
    &::-webkit-input-placeholder {
      color: #ccc;
    }
  }
  .storeStyle{
    color:#606266;
    width: 120px;
    background-color: #f5f7fa;
    // cursor: not-allowed;
  }
  .propertyRight{
    width: 80px;
    box-sizing: border-box;
    padding: 7px 10px!important;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
  }
  .forbid{
    background: #f5f7fa;
  }
  .yuan{
    position: absolute;
    top: 0;
    right: 6px;
    font-size: 14px;
    color: #ccc;
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
    .sxf_1 {
      width: 100px;
    }
    .sxf_2 {
      width: 80px;
    }
    .sxf_3 {
      width: 80px;
    }
    .chineseNum {
      padding-left: 10px;
      color: @color-orange;
      font-size: 14px;
    }
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
  .remarkType{
    padding-left: 30px;
    /deep/.el-textarea__inner {
      width: 600px;
      min-height: 200px;
    }
    .textLength {
      position: absolute;
      bottom: 0;
      right: 10px;
      color: #6c7986;
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
      color: #C0C4CC;
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
.btn {
  padding-top: 10px;
  padding-left: 20px;
  display: flex;
  justify-content: space-between;
  p {
    color: @color-6c;
    display: inline-block;
    padding-right: 20px;
    font-size: 12px;
  }
}
.dealAgentStyle{
  /deep/.is-disabled{
    .el-input__inner{
      color:#606266!important;
    }
  }
}
</style>
