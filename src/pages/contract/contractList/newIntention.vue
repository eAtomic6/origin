<!-- 新增意向金 -->
<template>
  <div class="newintention" id="newIntention">
    <div class="formbox">
      <el-form :inline="true" :model="contractForm" :rules="rules" ref="contractForm" size="small" class="form-innnerbox">
        <div class="form-content">
          <!-- 合同信息 -->
          <div class="column-form">
            <div class="column-title">合同信息</div>
            <div class="form-cont">
              <el-form-item label="签约日期：" prop="signDate">
                <el-date-picker
                style="width:180px"
                :disabled="type===2?true:false"
                v-model="contractForm.signDate"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
                :picker-options="pickerOptions"
                default-time="12:00:00">
              </el-date-picker>
              </el-form-item>
              <el-form-item label="合同类型：">
                <el-input placeholder="意向" :disabled="true" v-if="contractForm.type == 4"></el-input>
                <el-input placeholder="定金"  :disabled="true" v-if="contractForm.type == 5"></el-input>
              </el-form-item>
              <el-form-item label="纸质合同编号：" prop="pCode"  v-if="recordType===2">
                <el-input v-model="contractForm.pCode" :disabled="canInput" maxlength="30" placeholder="请输入" type="text" clearable @input="cutInfo('pCode',0)" >
                </el-input>
              </el-form-item>
              <br>
              <el-form-item label="认购期限：" prop="subscriptionTerm">
                <el-date-picker v-model="contractForm.subscriptionTerm" :disabled="canInput" value-format="yyyy/MM/dd" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="认购总价：" prop="subscriptionPrice">
                <el-input v-model="contractForm.subscriptionPrice" :disabled="canInput" type="text" clearable @input="cutNumber('subscriptionPrice')" >
                  <i slot="suffix" class="yuan">元</i>
                </el-input>
              </el-form-item>

              <el-form-item label="意向金金额：" prop="dealPrice" v-if="contractForm.type == 4">
                <el-input v-model="contractForm.dealPrice" :disabled="canInput" type="text" clearable @input="cutNumber('dealPrice')">
                  <i slot="suffix" class="yuan">元</i>
                  <template slot="append">{{contractForm.dealPrice | moneyFormat}}</template>
                </el-input>
              </el-form-item>

              <el-form-item label="定金金额：" prop="dealPrice" v-if="contractForm.type == 5">
                <el-input v-model="contractForm.dealPrice" :disabled="canInput" type="text" clearable @input="cutNumber('dealPrice')">
                  <!-- <i slot="suffix" class="yuan">万元</i> -->
                  <i slot="suffix" class="yuan">元</i>
                  <template slot="append">{{contractForm.dealPrice | moneyFormat}}</template>
                </el-input>
              </el-form-item>
            </div>
          </div>

          <!-- 房源信息 -->
          <div class="column-form">
            <div class="column-title">房源信息</div>
            <div class="form-cont">
              <el-form-item>
                <el-form-item label="房源编号：" prop="houseno" class="paddingLeft">
                  <el-button type="primary" @click="toLayerHouse()"  v-if="sourceBtnCheck||canInput||!offLine">{{contractForm.houseinfoCode?contractForm.houseinfoCode:'请选择房源'}}</el-button>
                  <el-button type="text" v-else>{{contractForm.houseinfoCode}}</el-button>
                </el-form-item>
                <el-form-item label="物业地址：" class="ml30">
                  <div v-if="contractForm.houseinfoCode">{{contractForm.houseInfo.EstateName.replace(/\s/g,"")+' '+contractForm.houseInfo.BuildingName.replace(/\s/g,"")+contractForm.houseInfo.Unit.replace(/\s/g,"")+contractForm.houseInfo.RoomNo.replace(/\s/g,"")}}</div>
                  <div v-else>--</div>
                </el-form-item>
              </el-form-item>

              <el-form-item label="产权地址：" class="disb rightAddrStyle" required>
                <el-form-item prop="rightAddrCity" :rules="{validator: rightAddr1, trigger: 'change'}">
                  <el-input v-model="contractForm.rightAddrCity" :disabled="canInput" clearable maxlength="10" class="addrwidth" @input="cutAddress('city')"></el-input>
                </el-form-item>
                市
                <el-form-item prop="rightAddrArea" :rules="{validator: rightAddr2, trigger: 'change'}">
                  <el-input v-model="contractForm.rightAddrArea" :disabled="canInput" clearable maxlength="10" class="addrwidth" @input="cutAddress('area')"></el-input>
                </el-form-item>
                区
                <el-form-item prop="rightAddrDetail" :rules="{validator: rightAddr3, trigger: 'change'}">
                  <el-input v-model="contractForm.rightAddrDetail" :disabled="canInput" clearable class="big-input" maxlength="70" @input="cutAddress('detail')"></el-input>
                </el-form-item>
              </el-form-item>

              <el-form-item label="房源总价：" class="disb paddingLeft">
                <el-form-item>
                  <el-input v-model="contractForm.houseInfo.ListingPrice" :disabled="canInput" clearable @input="cutNumber('editHousePrice')">
                  </el-input>
                </el-form-item>
                <el-form-item prop="houseInfo.TimeUnit" :rules="{required: true, message: '请选择单位'}" v-if="String(contractForm.houseInfo.ListingPrice).length>0||contractForm.houseInfo.TradeInt">
                  <el-select v-model="contractForm.houseInfo.TimeUnit" :disabled="isDisabled" clearable placeholder="单位" style="width:100px;">
                    <el-option label="元" :value="1"></el-option>
                    <el-option label="元/月" :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-form-item>

              <!-- <el-form-item label="房源总价：" class="error-item" v-if="contractForm.houseInfo.TradeInt">
                <el-input v-model.number="contractForm.houseInfo.ListingPrice" :disabled="canInput" clearable @input="cutNumber('editHousePrice')">
                  <i slot="suffix" class="yuan" v-if="contractForm.houseInfo.TradeInt && contractForm.houseInfo.TradeInt == 2">元</i>
                  <i slot="suffix" class="yuan" v-if="contractForm.houseInfo.TradeInt && contractForm.houseInfo.TradeInt == 3">元/月</i>
                </el-input>
              </el-form-item> -->

              <!-- <el-form-item label="房源总价：" class="error-item" :prop="'houseInfo.ListingPrice'" :rules="{validator: housePrice, trigger: 'change'}"  v-if="!contractForm.houseInfo.TradeInt" >
                <el-input v-model="contractForm.houseInfo.ListingPrice" :disabled="canInput" type="text" clearable v-if="!contractForm.houseInfo.TradeInt">
                </el-input>
              </el-form-item> -->

              <el-form-item label="业主信息：" class="disb paddingLeft" v-if="contractForm.type==4">

                <el-form-item :prop="'contPersons[' + 0 + '].name'" :rules="{validator: nameInput, trigger: 'change'}">
                  <el-input v-model="contractForm.contPersons[0].name" :disabled="canInput" clearable placeholder="姓名" class="namewidth" maxlength=20 @input="cutInfo('name',0)"></el-input>
                </el-form-item>

                <el-form-item :prop="'contPersons[' + 0 + '].mobile'" :rules="{validator: telPhoneInput, trigger:'change'}">
                  <el-input v-model="contractForm.contPersons[0].mobile" :disabled="canInput" clearable placeholder="手机号" class="ownwidth" @input="cutInfo('editPhone',0)"></el-input>
                </el-form-item>

                <el-form-item>
                  <el-select v-model="contractForm.contPersons[0].cardType" :disabled="canInput" placeholder="证件类型" style="width:120px;" @change="changeCardType(0)">
                    <el-option v-for="item in dictionary['633']" :key="item.key" v-if="recordType===10&&item.key!=4||recordType!=10" :label="item.value" :value="item.key"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item>
                  <el-input v-model="contractForm.contPersons[0].identifyCode" :disabled="canInput" clearable placeholder="证件号" class="custwidth" :maxlength="contractForm.contPersons[0].cardType===1?18:contractForm.contPersons[0].cardType===2?30:contractForm.contPersons[0].cardType===3?20:10" @clear="clearIdentify(0,'identifyCode')" @input="cutInfo('card',0)"></el-input>
                </el-form-item>

                <el-form-item v-if="recordType===10">
                  <el-input v-model="contractForm.contPersons[0].email" :disabled="canInput" clearable placeholder="邮箱" class="custwidth" :maxlength="20" @clear="clearIdentify(0,'email')" @input="cutInfo('email',0)"></el-input>
                </el-form-item>
                <br>
                <el-form-item v-if="recordType===10&&contractForm.contPersons[0].cardType==3" :rules="{validator: nameInput, trigger: 'change'}">
                  <el-input v-model="contractForm.contPersons[0].companyName" :disabled="canInput" clearable placeholder="企业名称" class="custwidth" :maxlength="100" @clear="clearIdentify(0,'companyName')" @input="cutInfo('companyName',0)"></el-input>
                </el-form-item>

                <el-form-item v-if="recordType===10&&contractForm.contPersons[0].cardType==3" :rules="{validator: nameInput, trigger: 'change'}">
                  <el-input v-model="contractForm.contPersons[0].lepName" :disabled="canInput" clearable placeholder="法人名称" class="custwidth" :maxlength="10" @clear="clearIdentify(0,'lepName')" @input="cutInfo('lepName',0)"></el-input>
                </el-form-item>

                <el-form-item v-if="recordType===10&&contractForm.contPersons[0].cardType==3">
                  <el-input v-model="contractForm.contPersons[0].lepIdentity" :disabled="canInput" clearable placeholder="法人身份证号码" class="custwidth" :maxlength="18" @clear="clearIdentify(0,'lepIdentity')" @input="cutInfo('lepIdentity',0)"></el-input>
                </el-form-item>

              </el-form-item>
              <el-form-item label="业主信息：" class="disb" required v-if="contractForm.type==5">

                <el-form-item :prop="'contPersons[' + 0 + '].name'" :rules="{validator: nameExp, trigger: 'change'}">
                  <el-input v-model="contractForm.contPersons[0].name" :disabled="canInput" clearable placeholder="姓名" class="namewidth" maxlength=20 @input="cutInfo('name',0)"></el-input>
                </el-form-item>

                <el-form-item :prop="'contPersons[' + 0 + '].mobile'" :rules="{validator: telPhone, trigger:'change'}">
                  <el-input v-model="contractForm.contPersons[0].mobile" :disabled="canInput" clearable placeholder="手机号" class="ownwidth" @input="cutInfo('editPhone',0)"></el-input>
                </el-form-item>

                <el-form-item :prop="'contPersons[' + 0 + '].cardType'" :rules="{required: true, message: '请选择证件类型', trigger: 'change'}">
                  <el-select v-model="contractForm.contPersons[0].cardType" :disabled="canInput" placeholder="证件类型" style="width:120px;" @change="changeCardType(0)">
                    <el-option v-for="item in dictionary['633']" :key="item.key" v-if="recordType===10&&item.key!=4||recordType!=10" :label="item.value" :value="item.key"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item :prop="'contPersons[' + 0 + '].identifyCode'" :rules="{required: true,validator: idCard, trigger:'change'}">
                  <el-input v-model="contractForm.contPersons[0].identifyCode" :disabled="canInput" clearable placeholder="证件号" class="custwidth" :maxlength="contractForm.contPersons[0].cardType===1?18:contractForm.contPersons[0].cardType===2?30:contractForm.contPersons[0].cardType===3?20:10" @clear="clearIdentify(0,'identifyCode')" @input="cutInfo('card',0)"></el-input>
                </el-form-item>

                <el-form-item v-if="recordType===10">
                  <el-input v-model="contractForm.contPersons[0].email" :disabled="canInput" clearable placeholder="邮箱" class="custwidth" :maxlength="20" @clear="clearIdentify(0,'email')" @input="cutInfo('email',0)"></el-input>
                </el-form-item>
                <br>
                <el-form-item v-if="recordType===10&&contractForm.contPersons[0].cardType==3">
                  <el-input v-model="contractForm.contPersons[0].companyName" :disabled="canInput" clearable placeholder="企业名称" class="custwidth" :maxlength="100" @clear="clearIdentify(0,'companyName')" @input="cutInfo('companyName',0)"></el-input>
                </el-form-item>

                <el-form-item v-if="recordType===10&&contractForm.contPersons[0].cardType==3">
                  <el-input v-model="contractForm.contPersons[0].lepName" :disabled="canInput" clearable placeholder="法人名称" class="custwidth" :maxlength="10" @clear="clearIdentify(0,'lepName')" @input="cutInfo('lepName',0)"></el-input>
                </el-form-item>

                <el-form-item v-if="recordType===10&&contractForm.contPersons[0].cardType==3">
                  <el-input v-model="contractForm.contPersons[0].lepIdentity" :disabled="canInput" clearable placeholder="法人身份证号码" class="custwidth" :maxlength="18" @clear="clearIdentify(0,'lepIdentity')" @input="cutInfo('lepIdentity',0)"></el-input>
                </el-form-item>

              </el-form-item>
            </div>
          </div>

          <!-- 客源信息 -->
          <div class="column-form">
            <div class="column-title">客源信息</div>
            <div class="form-cont">
              <div>
                <el-form-item label="客源编号：" prop="guestinfoCode">
                  <el-button-group v-model="contractForm.guestinfoCode">
                    <el-button type="primary" @click="toLayerGuest()" v-if="sourceBtnCheck||canInput||!offLine" v-model="contractForm.guestinfoCode">{{contractForm.guestinfoCode?contractForm.guestinfoCode:'请选择客源'}}</el-button>
                    <el-button type="text" v-else v-model="contractForm.guestinfoCode">{{contractForm.guestinfoCode}}</el-button>
                  </el-button-group>
                </el-form-item>

                <el-form-item label="成交经纪人：" required>
                  <el-form-item>
                    <!-- <el-select v-model="contractForm.guestInfo.GuestStoreName" placeholder="请选择门店">
                        <el-option v-for="item in option2" :key="item.id" :label="item.name" :value="item.id + ',' + item.name"></el-option>
                    </el-select> -->
                    <el-input v-model="contractForm.guestInfo.GuestStoreName" placeholder="请选择门店" :disabled=true></el-input>
                  </el-form-item>
                  <el-form-item class="small-input">
                    <!-- <el-select v-model="contractForm.guestInfo.EmpName" placeholder="请选择经纪人">
                        <el-option v-for="item in option3" :key="item.empId" :label="item.name" :value="item.empId + ',' + item.name"></el-option>
                    </el-select> -->
                    <el-input v-model="contractForm.guestInfo.EmpName" placeholder="请选择经纪人" :disabled=true></el-input>
                  </el-form-item>

                </el-form-item>
              </div>
              <el-form-item label="客户信息：" class="disb" required>

                <el-form-item :prop="'contPersons[' + 1 + '].name'" :rules="{validator: nameExp, trigger: 'change'}">
                  <el-input v-model="contractForm.contPersons[1].name" :disabled="canInput" clearable placeholder="姓名" class="namewidth" maxlength=20 @input="cutInfo('name',1)"></el-input>
                </el-form-item>

                <el-form-item :prop="'contPersons[' + 1 + '].mobile'" :rules="{validator: telPhone,trigger:'change'}">
                  <el-input v-model="contractForm.contPersons[1].mobile" clearable placeholder="手机号" class="ownwidth" @input="cutInfo('editPhone',1)"></el-input>
                </el-form-item>

                <el-form-item :prop="'contPersons[' + 1 + '].cardType'" :rules="{required: true, message: '请选择证件类型', trigger: 'change'}">
                  <el-select v-model="contractForm.contPersons[1].cardType" :disabled="canInput" placeholder="证件类型" style="width:120px;" @change="changeCardType(1)">
                    <el-option v-for="item in dictionary['633']" :key="item.key" v-if="recordType===10&&item.key!=4||recordType!=10" :label="item.value" :value="item.key"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item :prop="'contPersons[' + 1 + '].identifyCode'" :rules="{validator: idCard1, trigger:'change'}">
                  <el-input v-model="contractForm.contPersons[1].identifyCode" :disabled="canInput" clearable placeholder="证件号" class="custwidth" :maxlength="contractForm.contPersons[1].cardType===1?18:contractForm.contPersons[1].cardType===2?30:contractForm.contPersons[1].cardType===3?20:10" @clear="clearIdentify(1)" @input="cutInfo('card',1)">></el-input>
                </el-form-item>

                <el-form-item v-if="recordType===10">
                  <el-input v-model="contractForm.contPersons[1].email" :disabled="canInput" clearable placeholder="邮箱" class="custwidth" :maxlength="20" @clear="clearIdentify(0)" @input="cutInfo('email',0)"></el-input>
                </el-form-item>
                <br>
                <el-form-item v-if="recordType===10&&contractForm.contPersons[1].cardType==3" :prop="'contPersons[' + 1 + '].companyName'" :rules="{validator: nameExp, trigger:'change'}">
                  <el-input v-model="contractForm.contPersons[1].companyName" :disabled="canInput" clearable placeholder="企业名称" class="custwidth" :maxlength="100" @clear="clearIdentify(0)" @input="cutInfo('companyName',0)"></el-input>
                </el-form-item>

                <el-form-item v-if="recordType===10&&contractForm.contPersons[1].cardType==3" :prop="'contPersons[' + 1 + '].lepName'" :rules="{validator: nameExp, trigger:'change'}">
                  <el-input v-model="contractForm.contPersons[1].lepName" :disabled="canInput" clearable placeholder="法人名称" class="custwidth" :maxlength="10" @clear="clearIdentify(0)" @input="cutInfo('lepName',0)"></el-input>
                </el-form-item>

                <el-form-item v-if="recordType===10&&contractForm.contPersons[1].cardType==3" :prop="'contPersons[' + 1 + '].lepIdentity'" :rules="{validator: lepIdentity, trigger:'change'}">
                  <el-input v-model="contractForm.contPersons[1].lepIdentity" :disabled="canInput" clearable placeholder="法人身份证号码" class="custwidth" :maxlength="18" @clear="clearIdentify(0)" @input="cutInfo('lepIdentity',0)"></el-input>
                </el-form-item>

              </el-form-item>

            </div>
            <div class="form-cont mt30" v-if="contractForm.type == 4">
              <el-form-item label="意向备注：" class="disb textlengthbox">
                <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 5}" :disabled="canInput"  placeholder="请输入内容" v-model="contractForm.remarks" class="textareawidth" maxlength=200></el-input>
                <span class="textLength">{{contractForm.remarks.length}}/200</span>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="form-btn">
      <el-button type="primary" round @click="checkRule('contractForm')" v-if="hidBtn!==1">保存并进入下一步</el-button>
    </div>
    <!-- 房客源弹框 -->
    <houseGuest :dialogType="dialogType" :dialogVisible="isShowDialog" :choseHcode="choseHcode" :choseGcode="choseGcode"  @closeHouseGuest="closeCommission" v-if='isShowDialog'></houseGuest>
    <!-- 确定保存合同弹框 -->
    <el-dialog title="" :visible.sync="dialogSure" width="460px" class="personalMsg" :closeOnClickModal="$tool.closeOnClickModal" :close-on-press-escape="$tool.closeOnClickModal">
      <div class="warning-box">
        <p><i class="iconfont icon-tubiao_shiyong-1"></i><span>请确认客户和业主的姓名与证件上的一致？</span></p>
        <ul>
          <li v-if="contractForm.contPersons[0].name">
            {{contractForm.contPersons[0].name}}：{{contractForm.contPersons[0].identifyCode}}
          </li>
          <li>
            {{contractForm.contPersons[1].name}}：{{contractForm.contPersons[1].identifyCode}}
          </li>
        </ul>
        <p>否则合同将无效，之后收款所开票据无效！！！</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogSure = false">不确认</el-button>
        <el-button size="small" v-if="type===1" type="primary" @click="onSubmit1()" v-loading.fullscreen.lock="fullscreenLoading">确认</el-button>
        <el-button size="small" v-if="type==2" type="primary" @click="onSubmit2()" v-loading.fullscreen.lock="fullscreenLoading">确认</el-button>
      </span>
    </el-dialog>
    <!-- 创建合同成功提示框 -->
    <el-dialog title="提示" :visible.sync="dialogSuccess" width="460px" :closeOnClickModal="$tool.closeOnClickModal" :close-on-press-escape="$tool.closeOnClickModal">
      <span>是否继续上传附件？</span>
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

  </div>
</template>

<script>
import houseGuest from "../contractDialog/houseGuest";
//  import {FILTER} from "@/assets/js/filter";
import { TOOL } from "@/assets/js/common";
import { MIXINS } from "@/assets/js/mixins";
export default {
  mixins: [MIXINS],
  components: {
    houseGuest
  },
  data() {
    // 表单正则
    var checkNull = (rule, value, callback) => {
      if (!value || value !=='') {
        return callback(new Error());
      }
    };
    var checkPrice = (rule, value, callback) => {

      if (!value) {
        return callback(new Error("请输入价格"));
      }
      else if(value == 0){
        return callback(new Error("不能为零"));
      }
      else if(value > 0 && parseInt(value)==value && value.toString().charAt(0) == "0"){
        return callback(new Error("整数的第一位不能为0"));
      }
      else {
        if (value < 0 || value > 999999999.99) {
          callback(new Error("输入总价在0-999999999.99之间"));
        } else {
          callback();
        }
      }
    };
    return {
      houseInfoTimeUnit:'',
      choseHcode:0,//选择的房源编号
      choseGcode:0,//选择的客源编号
      fullscreenLoading:false,//创建按钮防抖
      isShowDialog: false,
      dialogType: "",
      loading: false,
      dialogSure: false,
      dialogSuccess:false,
      type: 1,
      recordType:'',
      //编辑时的合同id
      id: "",
      //创建合同成功后的id
      detailId:'',
      dictionary: {
        //数据字典
        "633": "", //证件类型

      },
      contractForm: {
        type: '',
        signDate: "",
        houseinfoCode: "",
        guestinfoCode: "",
        subscriptionTerm: "",
        subscriptionPrice: "",
        dealPrice: "",
        remarks: "",
        //产权地址
        rightAddrCity:'',
        rightAddrArea:'',
        rightAddrDetail:'',
        houseInfo: {
          EstateName: "",
          BuildingName: "",
          Unit: "",
          RoomNo: "",
          ListingPrice:"",
          TimeUnit:"",
        },
        guestInfo: {
          GuestStoreCode: "",
          GuestStoreName: "",
          EmpCode: "",
          EmpName: ""
        },
        //合同人员相关信息
        contPersons: [
          //业主信息
          {
            name: "",
            encryptionMobile: "",
            mobile:'',
            encryptionCode: "",
            identifyCode: '',
            cardType:'',
            email:"",
            lepName:"",
            companyName:"",
            lepIdentity:"",
            type: 1,
            relation: ''
          },
          //客户信息
          {
            name: "",
            encryptionMobile: "",
            mobile:'',
            encryptionCode: "",
            identifyCode: '',
            cardType:'',
            email:"",
            lepName:"",
            companyName:"",
            lepIdentity:"",
            type: 2,
            relation: ""
          }
        ],
      },
      //门店选择列表
      option2: [],
      option3: [],

      // 表单校验规则
      rules: {
        signDate: [
          {
            type: "string",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],

        subscriptionTerm: [
          {
            type: "string",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        subscriptionPrice: [{required: true, validator: checkPrice,trigger:'change' }],
        dealPrice: [{ required: true, validator: checkPrice,trigger:'change' }],

        pCode:[
          {
            type: "string",
            required: true,
            message: "请输入纸质合同编号",
            trigger:'change'
          }
        ],

        guestinfoCode: [
          { required: true, message: "请选择客源编号", trigger:'change'}
        ],
        // 'houseInfo.TimeUnit':[{required: true, message: "请选择单位", trigger:'change'}]

      },
      hidBtn:'',//隐藏保存按钮
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
      //日期选择器禁止选择未来时间
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      sourceBtnCheck:true,//房客源是否可选择
      //是否能输入（已签约 未结算）
      canInput:false,
      //线下合同已签约状态编辑
      offLine:false,
      singleCompany:false,
      singleCompanyName:"",//单公司（为设置签章）
    };
  },
  created() {
    this.getDictionary();
    let backMsg = JSON.parse(localStorage.getItem("backMsg"));
    if(backMsg){//存在则是从h5页面返回  需走编辑逻辑
      let contMsg = JSON.parse(sessionStorage.getItem("contractMsg"));
      this.contractForm.type=parseInt(contMsg.type);//合同类型
      this.type=2
      this.id=parseInt(contMsg.id)
      this.getContractDetail();
      this.setPath(this.$tool.getRouter(['合同','合同列表','编辑合同'],'contractList'));
    }else{
      // this.remoteMethod()
      // this.getShopList();
      this.contractForm.type = this.$route.query.contType //区分合同类型
      this.recordType = parseInt(this.$route.query.recordType)
      //编辑页面刷新时，页面数据会清空，这时获取不了this.$route.query.operateType
      if (this.$route.query.operateType) {
          this.type = parseInt(this.$route.query.operateType)
        if(this.$route.query.operateType ==2 ){
          this.type = parseInt(this.$route.query.operateType);
          this.id = this.$route.query.id;
          this.getContractDetail();
        }else{
          this.getNewData()
          if(Number(this.$route.query.turnDeal)===1){//房源转成交需要获取房源详情
            this.getHousedetail(this.$route.query.houseId)
          }
        }
      }
    }
    let arr=this.$tool.getRouter(['二手房','合同','合同列表'],"contractList");
    arr.push({name:this.type===1?"新增合同":'合同编辑',path:this.$route.fullPath});
    this.setPath(arr);
  },
  methods: {
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

    clearIdentify(type,name){
     this.$nextTick(() => {
       if(name==="all"){
         this.$set(this.contractForm.contPersons,type,Object.assign({},this.contractForm.contPersons[type],{identifyCode:''}))
         this.$set(this.contractForm.contPersons,type,Object.assign({},this.contractForm.contPersons[type],{companyName:''}))
         this.$set(this.contractForm.contPersons,type,Object.assign({},this.contractForm.contPersons[type],{lepName:''}))
         this.$set(this.contractForm.contPersons,type,Object.assign({},this.contractForm.contPersons[type],{lepIdentity:''}))
       }else{
         this.$set(this.contractForm.contPersons,type,Object.assign({},this.contractForm.contPersons[type],{name:''}))
       }
       
     })
    },

    changeCardType(val){
      this.$nextTick(() => {
        this.clearIdentify(val,"all")
        this.$refs.contractForm.validateField('contPersons[' + val + '].identifyCode');
      })
    },

    cutInfo(val,index){
      if(val == "editPhone") {
        let beginNum = /^0.*$/
        let beginNum_ = /^1.*$/
        if(this.contractForm.contPersons[index].mobile.length>0){
          if(beginNum.test(this.contractForm.contPersons[index].mobile)){
            this.contractForm.contPersons[index].mobile=this.contractForm.contPersons[index].mobile.substring(0,13)
          }
          if(beginNum_.test(this.contractForm.contPersons[index].mobile)){
            this.contractForm.contPersons[index].mobile=this.contractForm.contPersons[index].mobile.substring(0,11)
          }
        }
        // this.$nextTick(() => {
        //   this.contractForm.contPersons[index].mobile = this.contractForm.contPersons[index].mobile.toString().replace(/\D/g,"")
        // })
      }
      else if(val == "card"||val=="lepIdentity") {
        this.$nextTick(() => {
         this.contractForm.contPersons[index].identifyCode = this.contractForm.contPersons[index].identifyCode.toString().replace(/\s/g,"")
        })
      }
      else if(val == "name"||val=="lepName"||val=="companyName") {
        this.$nextTick(() => {
         this.contractForm.contPersons[index].name = this.contractForm.contPersons[index].name.toString().replace(/\s/g,"")
        //  this.contractForm.contPersons[index].name = this.$tool.textInput(this.contractForm.contPersons[index].name)
        })
      }
      else if(val=="pCode"){
        this.$nextTick(() => {
          let addrReg = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\(\)\-\_]/g
          this.contractForm.pCode = this.contractForm.pCode.toString().replace(/\s/g,"").replace(addrReg,'')
        })
      }
    },
    //产权地址限制输入
    cutAddress(type){
      let addrReg=/\\|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\&|\!|\~|\`|\|/g
      if(type==="city"){
        this.contractForm.rightAddrCity=this.contractForm.rightAddrCity.replace(/\s+/g,"").replace(addrReg,'').replace("市","").replace(/\//g,'')
      }else if(type==="area"){
        this.contractForm.rightAddrArea=this.contractForm.rightAddrArea.replace(/\s+/g,"").replace(addrReg,'').replace("区","").replace(/\//g,'')
      }else{
        this.contractForm.rightAddrDetail=this.contractForm.rightAddrDetail.replace(/\s+/g,"").replace(addrReg,'')
      }
    },
    housePrice (rule, value, callback) {
      let myprice = /(^[1-9][0-9]{0,8}(['元']{1}|['元/月']{3})$)|(^([1-9][0-9]{0,8}|[0])\.[0-9]{1,2}(['元']{1}|['元/月']{3})$)/;
      if(value){
        if (!myprice.test(value)) {
          callback(new Error("提示：输入总价在0-999999999.99之间，不能等于0。必须带上单位，出租类型单位为'元/月',出售类型单位为'元'，例子：'3000元/月'或者'300元'，小数点只保留后两位。"));
        }
        else if(parseFloat(value) <= 0 || parseFloat(value) > 999999999.99){
          callback(new Error("输入总价在0-999999999.99之间，不能等于0"));
        }
        else {
          callback();
        }
      }else{
        callback();
      }
    },

    idCard (rule, value, callback) {
      let passport = /[^\s*]/
      if(!this.contractForm.contPersons[0].cardType){
          callback(new Error("请先选择证件类型"));
      }else if(this.contractForm.contPersons[0].cardType == 1){
        if (!value || value == '') {

           return callback(new Error("请输入证件号"));
        } else if (!this.isIdCardNo(value)) {
          // debugger
          callback(new Error("请输入正确格式的证件号"));
        } else {
          callback();
        }
      }else if(this.contractForm.contPersons[0].cardType == 2 || this.contractForm.contPersons[0].cardType == 3 || this.contractForm.contPersons[0].cardType == 4){
        if (!value || value == '') {
           return callback(new Error("请输入证件号"));
        }
        else if (!passport.test(value)) {
          // debugger
          callback(new Error("请输入正确格式的证件号"));
        }
        else{
          callback()
        }
      }
    },

    lepIdentity(rule, value, callback){
      if (!value || value == '') {
          return callback(new Error("请输入证件号"));
      } else if (!this.isIdCardNo(value)) {
        // debugger
        callback(new Error("请输入正确格式的证件号"));
      }
    },

    idCard1 (rule, value, callback) {
      let passport = /[^\s*]/
      if(!this.contractForm.contPersons[1].cardType){
          callback(new Error("请先选择证件类型"));
      }else if(this.contractForm.contPersons[1].cardType == 1){
        if (!value || value == '') {
           return callback(new Error("请输入证件号"));
        } else if (!this.isIdCardNo(value)) {
          // debugger
          callback(new Error("请输入正确格式的证件号"));
        } else {
          callback();
        }
      }else if(this.contractForm.contPersons[1].cardType == 2 || this.contractForm.contPersons[1].cardType == 3 || this.contractForm.contPersons[1].cardType == 4){
        if (!value || value == '') {
           return callback(new Error("请输入证件号"));
        }
        else if (!passport.test(value)) {
          // debugger
          callback(new Error("请输入正确格式的证件号"));
        }
        else{
          callback()
        }
      }
    },


    telPhone (rule, value, callback) {
      let myreg = /^[1][0-9]{10}$/;
      let myreg_ = /^0\d{2,3}\-?\d{7,8}$/;//固话正则

      if (!value) {
        return callback(new Error("请输入电话号码"));
      }else{
        if (!myreg.test(value)&&!myreg_.test(value)) {
          callback(new Error("请输入正确电话号码"));
        } else {
          callback();
        }
      }
    },


    nameExp (rule, value, callback) {
      let namereg = /^[a-zA-Z\u4e00-\u9fa5]*$/;
      if (!value || value == '') {
        return callback(new Error("请输入姓名"));
      }else if (!namereg.test(value)) {
        callback(new Error("只能输入大小写字母和汉字"));
      } else {
        callback();
      }
    },

    nameInput(rule, value, callback){
      let namereg = /^[a-zA-Z\u4e00-\u9fa5]*$/;
      if (!value || value == '') {
        return callback();
      }else if (!namereg.test(value)) {
        callback(new Error("只能输入大小写字母和汉字"));
      } else {
        callback();
      }
    },

    telPhoneInput (rule, value, callback) {
      let myreg = /^[1][0-9]{10}$/;
      let myreg_ = /^0\d{2,3}\-?\d{7,8}$/;//固话正则

      if (!value || value == '') {
        return callback();
      }else{
        if (!myreg.test(value)&&!myreg_.test(value)) {
          callback(new Error("请输入正确电话号码"));
        } else {
          callback();
        }
      }
    },

    rightAddr1(rule, value, callback){
      if (!value || value == '') {
        return callback(new Error("请输入城市"));
      }else{
        callback();
      }
    },
    rightAddr2(rule, value, callback){
      if (!value || value == '') {
        return callback(new Error("请输入区域"));
      }else{
        callback();
      }
    },
    rightAddr3(rule, value, callback){
      if (!value || value == '') {
        return callback(new Error("请输入详细地址"));
      }else{
        callback();
      }
    },

    cutNumber(val) {
      // console.log(val)
      if (val === "subscriptionPrice") {
        this.$nextTick(() => {
          this.contractForm.subscriptionPrice = this.$tool.cutFloat({
            val: this.contractForm.subscriptionPrice,
            max: 999999999.99
          });
        });
      }
      else if (val === "dealPrice") {
        this.$nextTick(() => {
          this.contractForm.dealPrice = this.$tool.cutFloat({
            val: this.contractForm.dealPrice,
            max: 999999999.99
          });
        });
      }
      else if (val === "editHousePrice") {
        this.$nextTick(() => {
          this.contractForm.houseInfo.ListingPrice = this.$tool.cutFloat({
            val: this.contractForm.houseInfo.ListingPrice,
            max: 999999999.99
          });
        });
      }
    },

    //选择房源弹框
    toLayerHouse() {
      this.isShowDialog = true;
      this.dialogType = "house";
    },

    trim(str){
      return str.replace(/(^\s*)|(\s*$)/g, "")
    },

    toLayerGuest() {
      this.isShowDialog = true;
      this.dialogType = "guest";
    },

    //根据房源id获取房源信息
    getHousedetail(id) {
      let param = {
        houseId: id
      };
      this.$ajax.get("/api/resource/houses/one", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.$refs['contractForm'].clearValidate('houseInfo.ListingPrice');
          let houseMsg = res.data;
          this.contractForm.houseinfoCode = houseMsg.PropertyNo; //房源编号
          this.contractForm.houseInfo = houseMsg;
          this.contractForm.houseInfo.ListingPrice=''
          if(houseMsg.TradeInt===2){
            // this.$set(this.contractForm.houseInfo,'ListingPrice',this.multiply(houseMsg.ListingPrice,10000))
            // this.contractForm.houseInfo.ListingPrice = this.multiply(houseMsg.ListingPrice,10000)
            // this.contractForm.houseInfo.TimeUnit=1
            this.$set(this.contractForm.houseInfo,'TimeUnit',1)
          }else if(houseMsg.TradeInt===3){
            // this.contractForm.houseInfo.TimeUnit=2
            this.$set(this.contractForm.houseInfo,'TimeUnit',2)
          }
        }
      })
      .catch(error => {
        this.$message({
          message: error
        });
      });
    },

    //根据客源id获取客源信息
    getGuestDetail(id) {
      let param = {
        customerId: id
      };
      this.$ajax.get("/api/resource/customers/one", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          let guestMsg = res.data;
          console.log(guestMsg);
          this.contractForm.guestinfoCode = guestMsg.InquiryNo; //客源编号
          this.contractForm.guestInfo = guestMsg;
          this.contractForm.contPersons[1].name = guestMsg.OwnerInfo.CustName;
          this.contractForm.contPersons[1].encryptionMobile = guestMsg.OwnerInfo.CustMobile;
          this.contractForm.contPersons[1].mobile = guestMsg.OwnerInfo.CustMobile;
          this.contractForm.contPersons[1].relation = guestMsg.OwnerInfo.CustRelation;
          this.contractForm.contPersons[1].type = 2;

          this.$nextTick(function() {
            if(this.contractForm.guestinfoCode !==''){
              this.$refs.contractForm.validateField('guestinfoCode');
              this.$refs.contractForm.validateField('contPersons[1].mobile');
              this.$refs.contractForm.validateField('contPersons[1].name');
            }
          })
        }
      })
      .catch(error => {
        this.isShowDialog = false;
        this.$message({
          message: error
        });
      });
    },

    //根据合同id查询合同详细信息（编辑接口会用到）
    getContractDetail() {
      let param = {
        id: this.id
      };
      this.$ajax.get("/api/contract/detail", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.contractForm = res.data;
          // this.contractForm.signDate = res.data.signDate.substr(0, 10);
          this.contractForm.subscriptionTerm = res.data.subscriptionTerm.substr(0,10);
          this.contractForm.type = res.data.contType.value;
          //合同状态为已签约且未结算时只允许编辑房客源编号
          if(this.contractForm.recordType.value===1&&res.data.resultState.value===1&&res.data.contState.value===3){
            this.canInput=true
          }
          //线下合同已签约状态除签约时间、合同类型、房客源编号、物业地址不支持编辑外，其他都字段均支持修改
          if(this.contractForm.recordType.value===2&&this.contractForm.contState.value===3){
            this.offLine=true
          }
          this.sourceBtnCheck=(res.data.contState.value===3)?false:true
          if(this.contractForm.houseinfoCode){
            if(this.contractForm.houseInfo.TradeInt===2){
              // this.contractForm.houseInfo.TimeUnit=1
              this.$set(this.contractForm.houseInfo,'TimeUnit',1)
            }else if(this.contractForm.houseInfo.TradeInt===3){
              // this.contractForm.houseInfo.TimeUnit=2
              this.$set(this.contractForm.houseInfo,'TimeUnit',2)
            }
          }else if(this.contractForm.houseInfo.ListingPrice.length>0){
            if(this.contractForm.houseInfo.ListingPrice.indexOf('元/月')>-1){
              // this.contractForm.houseInfo.TimeUnit=2
              this.$set(this.contractForm.houseInfo,'TimeUnit',2)
            }else{
              // this.contractForm.houseInfo.TimeUnit=1
              this.$set(this.contractForm.houseInfo,'TimeUnit',1)
            }
            this.contractForm.houseInfo.ListingPrice=this.contractForm.houseInfo.ListingPrice.split("元")[0]
          }
          // this.contractForm.guestInfo.GuestStoreName = res.data.guestInfo.GuestStoreName;
          // this.contractForm.guestInfo.GuestStoreCode = res.data.guestInfo.GuestStoreCode;
          // this.contractForm.guestInfo.EmpName = res.data.guestInfo.EmpName;
          // this.contractForm.guestInfo.empId = res.data.guestInfo.EmpCode;
          let rightAddress = res.data.propertyRightAddr
          let index1 = rightAddress.indexOf('市')
          let index2 = rightAddress.indexOf('区')
          if(index1>0){
            this.$set(this.contractForm,'rightAddrCity',rightAddress.substring(0,index1))
          }
          if(index2>0){
            if(index1>0){
              this.$set(this.contractForm,'rightAddrArea',rightAddress.substring(index1+1,index2))
            }else{
              this.$set(this.contractForm,'rightAddrArea',rightAddress.substring(0,index2))
            }
          }
          if(index1>0&&index2>0){
            this.$set(this.contractForm,'rightAddrDetail',rightAddress.substring(index2+1))
          }else if(index1>0&&index2<0){
            this.$set(this.contractForm,'rightAddrDetail',rightAddress.substring(index1+1))
          }else if(index1<0&&index2>0){
            this.$set(this.contractForm,'rightAddrDetail',rightAddress.substring(index2+1))
          }else{
            this.$set(this.contractForm,'rightAddrDetail',rightAddress)
          }

          for (let i = 0; i < res.data.contPersons.length; i++) {
            if (res.data.contPersons[i].personType.value === 1) {
              this.contractForm.contPersons[0].name = res.data.contPersons[i].name;
              this.contractForm.contPersons[0].encryptionMobile = res.data.contPersons[i].mobile;
              this.contractForm.contPersons[0].mobile = res.data.contPersons[i].mobile;
              this.contractForm.contPersons[0].relation = res.data.contPersons[i].relation;
              this.contractForm.contPersons[0].identifyCode =  res.data.contPersons[i].identifyCode;
              this.contractForm.contPersons[0].encryptionCode =  res.data.contPersons[i].identifyCode;
              this.contractForm.contPersons[0].type = res.data.contPersons[i].personType.value;
              this.contractForm.contPersons[0].email=res.data.contPersons[i].email==='-'?'':this.contractForm.contPersons[i].email;
              this.contractForm.contPersons[0].lepName=res.data.contPersons[i].lepName==='-'?'':this.contractForm.contPersons[i].lepName;
              this.contractForm.contPersons[0].companyName=res.data.contPersons[i].companyName==='-'?'':res.data.contPersons[i].companyName;
              this.contractForm.contPersons[0].lepIdentity=res.data.contPersons[i].lepIdentity==='-'?'':res.data.contPersons[i].lepIdentity;
            } else if ( this.contractForm.contPersons[i].personType.value === 2 ) {
              this.contractForm.contPersons[1].name = res.data.contPersons[i].name;
              this.contractForm.contPersons[1].encryptionMobile = res.data.contPersons[i].mobile;
              this.contractForm.contPersons[1].mobile = res.data.contPersons[i].mobile;
              this.contractForm.contPersons[1].relation = res.data.contPersons[i].relation;
              this.contractForm.contPersons[1].identifyCode = res.data.contPersons[i].identifyCode,
              this.contractForm.contPersons[1].encryptionCode =  res.data.contPersons[i].identifyCode;
              this.contractForm.contPersons[1].type = res.data.contPersons[i].personType.value;
              this.contractForm.contPersons[1].email=res.data.contPersons[i].email==='-'?'':this.contractForm.contPersons[i].email;
              this.contractForm.contPersons[1].lepName=res.data.contPersons[i].lepName==='-'?'':res.data.contPersons[i].lepName;
              this.contractForm.contPersons[1].companyName=res.data.contPersons[i].companyName==='-'?'':res.data.contPersons[i].companyName;
              this.contractForm.contPersons[1].lepIdentity= res.data.contPersons[i].lepIdentity==='-'?'':res.data.contPersons[i].lepIdentity;
            }
          }
        }
      })
      .catch(error => {
        this.$message({
          message: error
        });
      });
    },

    //关闭选择房源客源弹窗
    closeCommission(value,contractForm) {
      if (value) {
        if (value.dialogType === "house") {

          this.getHousedetail(value.selectCode);
          this.choseHcode=value.selectCode;
          this.isShowDialog = false;
        } else if (value.dialogType === "guest") {

          this.getGuestDetail(value.selectCode);
          this.choseGcode=value.selectCode;
          this.isShowDialog = false;

        }
      } else {
        this.isShowDialog = false;

      }
    },

    checkRule(contractForm) {

      this.$refs[contractForm].validate(valid => {
        if (valid) {
          if(this.contractForm.houseinfoCode){
            if(parseFloat(this.contractForm.houseInfo.ListingPrice)<=0||parseFloat(this.contractForm.houseInfo.ListingPrice)>999999999.99){
              this.$message({
                type: "warning",
                message: "房源总价在0-999999999.99之间，不能等于0"
              });
              return false
            }
          }
          if(this.contractForm.contPersons[0].name.indexOf("先生")!=-1||this.contractForm.contPersons[0].name.indexOf("女士")!=-1||this.contractForm.contPersons[1].name.indexOf("先生")!=-1||this.contractForm.contPersons[1].name.indexOf("女士")!=-1){
            this.$message({
              type: "warning",
              message: "业主或客户姓名不正确"
            });
            return false
          }
          if(this.contractForm.contPersons[0].email){
            let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if(!reg.test(this.contractForm.contPersons[0].email)){
              this.$message({
                type: "warning",
                message: "业主邮箱格式错误"
              });
              return false
            }
          }
          if(this.contractForm.contPersons[1].email){
            let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if(!reg.test(this.contractForm.contPersons[1].email)){
              this.$message({
                type: "warning",
                message: "客户邮箱格式错误"
              });
              return false
            }
          }
          let mobileNum0 = JSON.parse(JSON.stringify(this.contractForm.contPersons[0])).mobile.replace('-','')
          let mobileNum1 = JSON.parse(JSON.stringify(this.contractForm.contPersons[1])).mobile.replace('-','')
          // if(this.contractForm.contPersons[0].mobile !=='' &&this.contractForm.contPersons[1].mobile !== ''&&((this.contractForm.contPersons[0].mobile).trim() === (this.contractForm.contPersons[1].mobile).trim())){
          if(mobileNum0===mobileNum1){
            this.$message({
              type: "warning",
              message: "业主电话号码和客户电话号码不能重复!"
            });
          }else if(this.contractForm.contPersons[0].identifyCode !=='' &&this.contractForm.contPersons[1].identifyCode !== ''&&(this.contractForm.contPersons[0].identifyCode === this.contractForm.contPersons[1].identifyCode)){
            this.$message({
              type: "warning",
              message: "业主证件号和客户证件号不能重复!"
            });
          }else if(this.type===1){
            // this.onSubmit1()
            this.dialogSure=true
          }else if(this.type===2){
            // this.onSubmit2()
            this.dialogSure=true
          }
            return true
        } else {
            return false;
        }
      })


    },

    // 新增意向金接口（post）
    onSubmit1() {
      // this.dialogSure = false
      this.fullscreenLoading=true

      let param = {
        igdCont: {
          type: this.contractForm.type,
          pCode: this.contractForm.pCode,
          signDate: this.contractForm.signDate,
          houseinfoCode: this.contractForm.houseinfoCode,
          guestinfoCode: this.contractForm.guestinfoCode,
          subscriptionTerm: this.contractForm.subscriptionTerm,
          subscriptionPrice: this.contractForm.subscriptionPrice,
          dealPrice: this.contractForm.dealPrice,
          remarks: this.contractForm.remarks,
          houseInfo:this.contractForm.houseInfo,
          guestInfo:this.contractForm.guestInfo,
          contPersons: [
            //业主信息
            {
              name: this.contractForm.contPersons[0].name,
              encryptionMobile: this.contractForm.contPersons[0].mobile,
              mobile:this.contractForm.contPersons[0].mobile,
              encryptionCode: this.contractForm.contPersons[0].identifyCode,
              identifyCode: this.contractForm.contPersons[0].identifyCode,
              cardType: this.contractForm.contPersons[0].cardType,
              type: 1
            },
            //客户信息
            {
              name: this.contractForm.contPersons[1].name,
              encryptionMobile: this.contractForm.contPersons[1].mobile,
              mobile: this.contractForm.contPersons[1].mobile,
              encryptionCode: this.contractForm.contPersons[1].identifyCode,
              identifyCode: this.contractForm.contPersons[1].identifyCode,
              cardType: this.contractForm.contPersons[1].cardType,
              type: 2,

            }
          ],
          propertyRightAddr:this.contractForm.rightAddrCity+"市"+this.contractForm.rightAddrArea+"区"+this.contractForm.rightAddrDetail
        },
        type: this.type,
        recordType:this.recordType
      };
      let price=''
      if(param.igdCont.houseInfo.ListingPrice){
        price = String(param.igdCont.houseInfo.ListingPrice)
      }
      if(!param.igdCont.houseinfoCode&&price.length>0){
        if(param.igdCont.houseInfo.TimeUnit===1){
          param.igdCont.houseInfo.ListingPrice=price.replace(/\.$/,'')+'元'
        }else if(param.igdCont.houseInfo.TimeUnit===2){
          param.igdCont.houseInfo.ListingPrice=price.replace(/\.$/,'')+'元/月'
        }
      }else if(price.length>0){
        param.igdCont.houseInfo.ListingPrice=price.replace(/\.$/,'')
      }
      
      var url = '/api/contract/addContract';
      if(this.recordType===2){
        url = '/api/contract/addLocalContract'
      }

      this.$ajax.postJSON(url, param).then(res => {
        this.fullscreenLoading=false
        let tips = res.data.message;
        if (res.data.status === 200) {
          if(this.recordType===2){
            this.$message({
              message:"创建成功",
              type: "success"
            })
            //xuneng20191210修改：创建线下意向定金合同，成功跳转合同主体
            this.$router.push({
              path:'detailIntention',
              query:{
                type:'contBody',
                id: res.data.data.id,
                contType: res.data.data.type
              }
            });
          }else{
            let contractMsg = res.data.data
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
        } else {
          this.fullscreenLoading=false
          this.$message.error(tips);
        }
      })
      .catch(error => {
        this.fullscreenLoading=false
        this.$message({
          message: error,
          type:"error"
        });
      });
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
        path: "/detailIntention",
        query: {
          type: "dataBank",
          id: this.detailId,
          contType: this.contractForm.type
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
    // 编辑意向金接口
    onSubmit2() {
      // this.dialogSure = false
      this.fullscreenLoading=true

      let param = {
        igdCont: this.contractForm,
        type: this.type,
        recordType:this.recordType
      };
      param.igdCont.contPersons[0].encryptionMobile = param.igdCont.contPersons[0].mobile;
      param.igdCont.contPersons[1].encryptionMobile = param.igdCont.contPersons[1].mobile;
      param.igdCont.contPersons[0].encryptionCode = param.igdCont.contPersons[0].identifyCode;
      param.igdCont.contPersons[1].encryptionCode = param.igdCont.contPersons[1].identifyCode;
      param.igdCont.propertyRightAddr=this.contractForm.rightAddrCity+"市"+this.contractForm.rightAddrArea+"区"+this.contractForm.rightAddrDetail
      let price=''
      if(param.igdCont.houseInfo.ListingPrice){
        price = String(param.igdCont.houseInfo.ListingPrice)
      }
      if(!param.igdCont.houseinfoCode&&price.length>0){
        if(param.igdCont.houseInfo.TimeUnit===1){
          param.igdCont.houseInfo.ListingPrice=price.replace(/\.$/,'')+'元'
        }else if(param.igdCont.houseInfo.TimeUnit===2){
          param.igdCont.houseInfo.ListingPrice=price.replace(/\.$/,'')+'元/月'
        }
      }else if(price.length>0){
        param.igdCont.houseInfo.ListingPrice=price.replace(/\.$/,'')
      }
      if (this.type== 2) {
        // delete param.igdCont.code;
        delete param.igdCont.contType;
        delete param.igdCont.recordName;
        delete param.igdCont.recordDept;
        delete param.igdCont.custEnsure;
        delete param.igdCont.custCommission;
        delete param.igdCont.ownerCommission;
        delete param.igdCont.commissionPayment;
        delete param.igdCont.otherCooperationCost;
        delete param.igdCont.transFlowCode;
        delete param.igdCont.contChangeState;
        delete param.igdCont.laterStageState;
        delete param.igdCont.contState;
        delete param.igdCont.propertyAddr;
        delete param.igdCont.propertyCard;
        delete param.igdCont.timeUnit;
        delete param.igdCont.moneyUnit;
        delete param.igdCont.createTime;
        delete param.igdCont.updateTime;
        delete param.igdCont.isHavaCooperation;
        delete param.igdCont.extendParams;
        delete param.igdCont.otherCooperationInfo;
        delete param.igdCont.receivableCommission;
        delete param.igdCont.isHaveData;
        delete param.igdCont.toExamineState;
        delete param.igdCont.previewImg;
        delete param.igdCont.isHaveCooperation;
        delete param.igdCont.remarksExamine;
        delete param.igdCont.showCustName;
        delete param.igdCont.showOwnerName;
        delete param.igdCont.distributableAchievement;
        delete param.igdCont.dataType;
        delete param.igdCont.dealAgentId;
        delete param.igdCont.dealAgentName;
        delete param.igdCont.dealAgentStoreId;
        delete param.igdCont.dealAgentStoreName;
        delete param.igdCont.contPersons[0].personType;
        delete param.igdCont.contPersons[0].contractId;
        delete param.igdCont.contPersons[0].createTime;
        delete param.igdCont.contPersons[0].isDel;
        // delete param.igdCont.contPersons[0].pid;
        delete param.igdCont.contPersons[0].propertyRightRatio;
        delete param.igdCont.contPersons[0].uId;
        delete param.igdCont.contPersons[0].updateTime;

        delete param.igdCont.contPersons[1].personType;
        delete param.igdCont.contPersons[1].contractId;
        delete param.igdCont.contPersons[1].createTime;
        delete param.igdCont.contPersons[1].isDel;
        // delete param.igdCont.contPersons[1].pid;
        delete param.igdCont.contPersons[1].propertyRightRatio;
        delete param.igdCont.contPersons[1].uId;
        delete param.igdCont.contPersons[1].updateTime;

        delete param.igdCont.achievementState;
        delete param.igdCont.recordType
        delete param.igdCont.rightAddrCity
        delete param.igdCont.rightAddrArea
        delete param.igdCont.rightAddrDetail
      }


      var url = '/api/contract/updateContract';
      if(this.recordType===2){
        url = '/api/contract/addLocalContract'
      }

      this.$ajax.postJSON(url, param).then(res => {
        this.fullscreenLoading=false
        let tips = res.data.message;

        if (res.data.status === 200) {
          if(this.recordType===2){
            this.$message({
              message:"编辑成功",
              type: "success"
            })
            this.$router.push('/contractList');
          }else{
            let contractMsg = res.data.data
            sessionStorage.setItem("contractMsg", JSON.stringify(contractMsg));
            // this.setPath(this.$tool.getRouter(['合同','合同列表','合同编辑'],'contractList'));
            this.$router.push({
              path: "/extendParams"
            });
          }

        } else {
          this.fullscreenLoading=false
          this.$message.error(tips);
        }
      })
      .catch(error => {
        this.fullscreenLoading=false
        this.$message({
          message: error,
          type:"error"
        });
      });
    },

    isIdCardNo(num) {

      // num = num.toUpperCase();
      //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
      if (!(/(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/.test(num))) {
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
  },
  computed:{
    isDisabled(){
      return (this.canInput||!!this.contractForm.houseinfoCode)
    }
  },
  filters: {
    moneyFormat: function(val) {
      if (!val) {
        return "零";
      } else {
        return TOOL.toChineseNumber(val);
      }
    }
  },
  beforeDestroy(){
    localStorage.removeItem('backMsg')
  },
};
</script>

<style lang="less" scoped>
.singleCompany{
  padding: 20px 0 10px 10px;
}
.personalMsg{
  /deep/.el-dialog__header{
    border: none !important;
  }
}
.warning-box{
  margin: -4px 0 18px 28px;
  p{
    line-height: 1.4;
    &:first-of-type{
      // display:flex;
      // align-items:center;
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
  .error-item{
    /deep/.el-form-item__error{
      top: 0 !important;
      left: 220px !important;
      width: 500px;
      line-height: 18px;
    }
  }

#newIntention {
  /deep/.el-input-group__append {
    background-color: transparent;
    border: none;
    color: #ff9039;
  }

  .el-button--text {
    font-weight: 700;
  }
  .fr {
    float: right;
  }
  .mr20 {
    margin-right: 20px;
  }
  .ml30 {
    margin-left: 30px;
  }
  .form-innnerbox {
    background-color: #fff;
    border-radius: 5px;
    overflow-y: auto;
    position: relative;
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 200px;
    }
    .el-input--suffix .el-input__inner {
      padding-right: 15px;
    }
    .form-content {
      padding: 30px 30px 40px 30px;
    }
    .column-form {
      margin-bottom: 30px;
      .column-title {
        font-size: 16px;
        color: #233241;
        margin-bottom: 30px;
        font-weight: bold;
      }
      .form-cont {
        border-bottom: 1px solid #edecf0;
        padding-bottom: 10px;
        .small-input {
          width: 140px;
        }
        .big-input {
          width: 500px;
        }
        .yuan {
          line-height: 30px;
          padding-right: 5px;
        }
        .disb {
          display: block;
        }
        .ownwidth {
          width: 140px;
        }
        .addrwidth{
          width: 100px;
        }
        .namewidth {
          width: 200px;
        }
        .custwidth {
          width: 190px;
        }
        .textareawidth {
          width: 650px;
          height: 120px;
        }
      }
      .mt30 {
        margin-top: 30px;
      }
      .pb30 {
        padding-bottom: 30px;
      }
    }

  }
  .textlengthbox {
    position: relative;
    /deep/.el-form-item__label{
      padding-left: 9px;
    }
  }
  .textLength {
    position: absolute;
    bottom: 8px;
    right: 20px;
    color: #6c7986;
  }
  .form-btn {
    overflow: hidden;
    position: fixed;
    bottom: 50px;
    right: 138px;
    background-color: #fff;
  }
  .select {
    display: inline-block;
    text-align: center;
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
    width: 112px;
    height: 40px;
    line-height: 38px;
    cursor: pointer;
    border-radius: 4px;
  }
  .select_{
    display: inline-block;
    text-align: left;
    color: #409EFF;
    font-weight: bold;
  }
}
.rightAddrStyle{
  /deep/.el-form-item{
    margin-right: 0;
  }
}
.paddingLeft{
  /deep/.el-form-item__label{
    padding-left: 9px;
  }
}
</style>


