<template>
  <div class="view">
    <div class="view-context">
      <p class="f14 txt-title">收款信息</p>
      <ul class="bill-form">
        <li>
          <div class="input-group" style="white-space: nowrap;">
            <label class="form-label no-width f14 margin-bottom-base">收款方式:</label>
            <p class="block-receipt-type">
              <el-button
                size="small"
                class="btn-info"
                :type="!billStatus?'primary':''"
                @click="checkReceiptType(1)"
              >线上收款</el-button>
              <el-button
                size="small"
                class="btn-info"
                :type="billStatus?'primary':''"
                @click="checkReceiptType(2)"
              >线下收款</el-button>
              <!--<el-tooltip content="同一个合同的收款方式必须统一，要么全部选线上要么全部选线下" width="100" placement="top">
                <i class="iconfont icon-wenhao"></i>
              </el-tooltip>-->
            </p>
            <p class="block-receipt-type worth-list" v-if="firstCreate.content.contCommission">
              <span>{{isentrust?"应收交易服务费":"应收佣金"}}（元）：{{firstCreate.content.contCommission.receivableCommission}}</span>
              <span>已收（元）：{{firstCreate.content.contCommission.receivedCommission}}</span>
              <span class="warning-text">未收（元）：{{firstCreate.content.contCommission.uncollected}}</span>
            </p>
          </div>
        </li>
        <li>
          <div class="input-group col">
            <div class="flex-box tool-tip">
              <label class="form-label no-width f14 margin-bottom-base">
                <span>款类</span>
              </label>
              <el-tooltip content="当未找到需要的款类时，可联系管理员进行配置" placement="top">
                <p class="tip-message">
                  <i class="iconfont icon-wenhao"></i>填写帮助
                </p>
              </el-tooltip>
            </div>
            <moneyTypePop
              v-if="!isentrust||$route.query.collect"
              ref="moneyType"
              :data="moneyType"
              :init="moneyTypeName"
              @checkCell="getCell"
              @clear="clearMoneyType"
            ></moneyTypePop>
            <el-input v-else type="text" size="small" class="w200" disabled placeholder="交易服务费"></el-input>
          </div>
          <!-- 分割线 收款开始 -->
          <div class="input-group col active-400 address-label" v-if="collect">
            <label class="form-label no-width f14 margin-bottom-base">房/客源:</label>
            <div class="flex-box w400">
              <el-select
                size="small"
                v-model="addressVal"
                @change="addressChangeFn"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item,index) in addressList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <div class="address-slelect" @click="addressClickFn">
                <span
                  :class="[addressLabel.selectCode?'':'cl-gray']"
                >{{addressLabel.selectCode?addressLabel.selectCode:"请选择"}}</span>
                <!-- >{{addressLabel.name?addressLabel.name:addressLabel.val}}</span> -->
                <!-- >{{addressLabel.name?addressLabel.name:addressLabel.val + addressValCom.name}}</span> -->
                <i class="el-icon-arrow-down"></i>
              </div>
            </div>
            <div class="address-label-p" v-if="addressLabel.label">物业地址：{{addressLabel.label}}</div>
          </div>
          <!-- 分割线 收款结束 -->
          <div class="input-group col" :class="[inputPerson?'active-360':'']">
            <label class="form-label no-width f14 margin-bottom-base">付款方</label>
            <div class="flex-box">
              <el-select
                size="small"
                class="w200"
                v-model="form.outObjType"
                placeholder="请选择"
                @change="getOption(form.outObjType,1)"
              >
                <el-option
                  v-for="item in dropdown"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <input
                type="text"
                size="small"
                class="w140 el-input__inner person"
                placeholder="请输入"
                maxlength="20"
                v-model.trim="form.outObj"
                @input="inputOnly('normal')"
                v-if="inputPerson"
              />
            </div>
          </div>
          <div class="input-group col active-400">
            <label class="form-label no-width f14 margin-bottom-base">收款人:</label>
            <div class="flex-box w400" v-if="inObjPerson">
              <select-tree
                :data="DepList"
                :init="dep.name"
                @checkCell="handleNodeClick"
                @clear="clearSelect('dep')"
                @search="searchDep"
                key="other"
              ></select-tree>
              <!-- <select-tree
                v-if="firstCreate.state"
                :data="DepList"
                :init="dep.name"
                @checkCell="handleNodeClick"
                @clear="clearSelect('dep')"
                @search="searchDep"
                key="other"
              ></select-tree>-->
              <!-- <div
                class="h32"
                :class="[!firstCreate.state?'no-min':'']"
                v-else
              >{{firstCreate.content.storeName}}</div>-->
              <el-select
                :clearable="true"
                ref="employe"
                v-loadmore="moreEmploye"
                class="margin-left"
                size="small"
                v-model="form.inObjId"
                placeholder="请选择"
                @clear="clearSelect('emp')"
                @focus="employeInfo=false"
                @change="getOption(form.inObjId,2)"
              >
                <el-option :label="form.inObj" :value="form.inObjId" v-if="employeInfo"></el-option>
                <el-option
                  v-for="(item,index) in EmployeList"
                  :key="index"
                  :label="item.name"
                  :value="item.empId"
                ></el-option>
              </el-select>
            </div>
            <div class="h32" v-else>{{dep.name}}-{{form.inObj}}</div>
          </div>
        </li>
        <li>
          <div class="input-group col" v-if="billStatus">
            <label class="form-label no-width f14 margin-bottom-base">收款时间</label>
            <el-date-picker
              class="w200"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="form.createTime"
              type="datetime"
              @change="checkDate"
              placeholder="选择日期时间"
            ></el-date-picker>
          </div>
          <div class="input-group col active-400">
            <div class="flex-box tool-tip no-max">
              <label class="form-label no-width f14 margin-bottom-base">收款金额（元）</label>
              <span>{{form.amount|formatChinese}}</span>
            </div>
            <input
              type="text"
              size="small"
              class="w400 el-input__inner"
              placeholder="请输入"
              v-model="form.amount"
              @input="cutNum(1)"
            />
          </div>
          <div class="input-group col" :class="[!firstCreate.state?'no-max':'']" v-if="billStatus">
            <label class="form-label f14 margin-bottom-base">收账账户</label>
            <el-select size="small" class="w200" v-model="activeAdmin" placeholder="请选择">
              <el-option
                v-for="item in account"
                :key="item.id"
                :label="`${item.storeName}-${item.bankAccountName} ${item.bankBranchName} ${item.bankCard}`"
                :value="item.id"
              >
                {{item.storeName}}-{{item.bankAccountName}}
                <span
                  style="margin: 0 4px;"
                >{{item.bankBranchName}}</span>
                {{item.bankCard}}
              </el-option>
            </el-select>
            <!-- <div
              class="h32"
              :class="[!firstCreate.state?'other':'']"
              v-else
            >{{firstCreate.content.account[0].storeName}}-{{firstCreate.content.account[0].userName}}-{{firstCreate.content.account[0].bankName}}-{{firstCreate.content.account[0].cardNumber}}</div>-->
          </div>
        </li>
      </ul>
      <div class="input-group" v-if="billStatus">
        <div class="flex-box txt-title">
          <label class="f14">支付信息</label>
          <el-tooltip content="多种收款方式可通过“添加支付方式”进行录入" placement="top">
            <p class="tip-message">
              <i class="iconfont icon-wenhao"></i>填写帮助
            </p>
          </el-tooltip>
        </div>
        <ul class="pay-list">
          <li v-for="(item,index) in payList" :key="index">
            <div class="message-box flex-box">
              <section>
                <label class="form-label f14 margin-bottom-base">支付方式</label>
                <el-select
                  size="small"
                  class="w200"
                  v-model="item.payMethod"
                  placeholder="请选择"
                  @change="hideCardList(item)"
                >
                  <el-option-group v-for="group in getDir" :key="group.label" :label="group.label">
                    <el-option
                      v-for="item in group.options"
                      :key="item.key"
                      :label="getPayMethod(item.key)?item.value:'刷卡-'+item.value"
                      :value="item.key"
                    ></el-option>
                  </el-option-group>
                </el-select>
              </section>
              <section>
                <div class="flex-box tool-tip w400 no-max">
                  <label class="form-label f14 margin-bottom-base">金额（元）</label>
                  <span>{{item.amount|formatChinese}}</span>
                </div>
                <input
                  type="text"
                  class="w400 el-input__inner"
                  placeholder="请输入"
                  v-model="item.amount"
                  @input="cutNum(item,'amount')"
                />
              </section>
              <section>
                <div class="flex-box tool-tip w200 no-max">
                  <label class="form-label f14 margin-bottom-base">手续费金额（元）</label>
                </div>
                <!--                <el-input size="small" :disabled="!getPayMethod(item.payMethod)" placeholder="请输入" v-model="item.fee" @input.native="cutNum(item,'fee')"></el-input>-->
                <input
                  type="text"
                  class="w200 el-input__inner input-info"
                  placeholder="请输入"
                  v-model="item.fee"
                  @input="cutNum(item,'fee')"
                />
              </section>
              <!--<section v-if="item.payMethod===2">
                <label class="f14 margin-bottom-base">收账账户</label>
                <el-select size="small" class="w300" v-model="item.activeAdmin" placeholder="请选择">
                  <el-option
                    v-for="item in account"
                    :key="item.id"
                    :label="`${item.bankAccountName} ${item.bankBranchName} ${item.bankCard}`"
                    :value="item.bankCard">
                    {{item.storeName}}-{{item.bankAccountName}}<span style="margin: 0 4px;">{{item.bankBranchName}}</span>{{item.bankCard}}
                  </el-option>
                </el-select>
              </section>-->
            </div>
            <div class="bankCard-list" v-if="billStatus&&payList[index].payMethod!==3">
              <p>
                <label class="f14">刷卡资料补充</label>
              </p>
              <el-table
                border
                :data="[cardList[index]]"
                style="width: 100%"
                header-row-class-name="theader-bg"
              >
                <el-table-column align="center" label="刷卡/转账银行">
                  <template slot-scope="scope">
                    <span>{{scope.row.bankName|formatNull}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="户名">
                  <template slot-scope="scope">
                    <input
                      type="text"
                      v-model.trim="scope.row.userName"
                      class="no-style"
                      placeholder="请输入"
                      @input="inputOnly('userName',index)"
                    />
                  </template>
                </el-table-column>
                <el-table-column align="center" label="账户 ">
                  <template slot-scope="scope">
                    <input
                      type="text"
                      v-model="scope.row.cardNumber"
                      class="no-style"
                      placeholder="请输入"
                      @input="getBank(scope.row,index)"
                    />
                  </template>
                </el-table-column>
                <!--<el-table-column align="center" label="金额（元）">
                  <template slot-scope="scope">
                    <input type="text" v-model="scope.row.amount" class="no-style" @input="cutNum(scope.row,'amount')"
                           placeholder="请输入">
                  </template>
                </el-table-column>-->
                <el-table-column align="center" label="订单编号">
                  <template slot-scope="scope">
                    <input
                      type="text"
                      v-model="scope.row.orderNo"
                      maxlength="20"
                      class="no-style"
                      placeholder="请输入"
                      @input="inputOnly('orderNo',index)"
                    />
                  </template>
                </el-table-column>
                <!--<el-table-column align="center" label="手续费（元）">
                  <template slot-scope="scope">
                    <input type="text" v-model="scope.row.fee" class="no-style" @input="cutNum(scope.row,'fee')"
                           placeholder="请输入">
                  </template>
                </el-table-column>-->
                <!--<el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" @click="cardOpera('add')">新增</el-button>
                    <el-button type="text" @click="cardOpera('delete',scope.row,scope.$index)">删除</el-button>
                  </template>
                </el-table-column>-->
              </el-table>
            </div>
            <i
              class="iconfont"
              :class="[index===0?'icon-icon-test':'icon-del']"
              @click="payListOper(index)"
            ></i>
          </li>
        </ul>
      </div>
      <section>
        <p class="txt-title">其他信息</p>
        <div class="col-other other-message">
          <div class="input-group" v-if="billStatus">
            <p>
              <label class="form-label f14">付款凭证</label>
              <span>（凭证类型：转账汇款电子回单、买卖交易合同、收据、租赁合同、解约协议、定金协议、意向金协议）</span>
            </p>
            <ul class="upload-list">
              <li>
                <file-up class="upload-context" @getUrl="getFiles" :scane="uploadScane">
                  <i class="iconfont icon-shangchuan"></i>
                  <span>点击上传</span>
                </file-up>
              </li>
              <li
                v-for="(item,index) in imgList"
                :key="index"
                @mouseenter="activeLi=index"
                @mouseleave="activeLi=''"
                @click="previewPhoto(imgList,index)"
              >
                <img
                  :src="item|getSignImage(preloadFiles,_self)"
                  alt
                  v-if="isPictureFile(item.type)"
                  height="90px"
                  :key="item.path"
                  :width="item.width"
                />
                <upload-cell :type="item.type" v-else></upload-cell>
                <!--<span>{{item.name}}</span>-->
                <el-tooltip :content="item.name" placement="top">
                  <div class="span">{{item.name}}</div>
                </el-tooltip>
                <p v-show="activeLi===index" @click.stop="delFile">
                  <i class="iconfont icon-tubiao-6"></i>
                </p>
              </li>
            </ul>
            <!--<p class="upload-text"><span>点击可上传图片附件或拖动图片到此处以上传附件</span>（买卖交易合同、收据、租赁合同、解约协议、定金协议、意向金协议）</p>-->
          </div>
          <div class="input-group">
            <p>
              <label class="f14">备注信息</label>
            </p>
            <el-input
              v-model="form.remark"
              class="info-textarea"
              :class="[form.remark&&form.remark.length>0?'':'scroll-hidden']"
              placeholder="请填写备注信息"
              rows="5"
              maxlength="200"
              type="textarea"
            ></el-input>
          </div>
          <!--<div class="input-group">
            <p><label class="f14">温馨提示</label></p>
            <ul class="warning-text">
              <li>1.线上未到账或者线下未审核通过情况下，想变更收款方式，需先作废之前的收款方式才能重新选择其他的收款方式；</li>
              <li>2.线上已到账或者线下审核通过情况下，无法更改收款方式，必须根据第一笔实收的收款方式继续收款;</li>
              <li v-if="billStatus">3.线下收款不参与线上结算。</li>
            </ul>
          </div>-->
        </div>
      </section>
    </div>
    <p>
      <el-button class="btn-info" round size="small" @click="goCancel">取消</el-button>
      <el-button
        class="btn-info"
        round
        size="small"
        type="primary"
        @click="goResult"
        v-loading.fullscreen.lock="fullscreenLoading"
      >{{!billStatus?'创建POS收款订单':'录入信息并提交审核'}}</el-button>
    </p>
    <preview :imgList="previewFiles" :start="previewIndex" v-if="preview" @close="preview=false"></preview>
    <checkPerson
      :show="checkPerson.state"
      :type="checkPerson.type"
      page="list"
      :showLabel="checkPerson.label"
      :bizCode="checkPerson.code"
      :flowType="checkPerson.flowType"
      @submit="personChose"
      @close="personChose"
      v-if="checkPerson.state"
    ></checkPerson>
    <!-- 房源客源弹窗 -->
    <houseGuest
      :dialogType="addressValCom.type"
      :dialogVisible="isShowDialog"
      :choseHcode="addressLabel.selectCode || 0"
      :choseGcode="addressLabel.selectCode || 0"
      @closeHouseGuest="closeHouseGuest"
      v-if="isShowDialog"
    ></houseGuest>
  </div>
</template>

<script>
import { MIXINS } from "@/assets/js/mixins";
import moneyTypePop from "@/components/moneyTypePop";
import checkPerson from "@/components/checkPerson";
import houseGuest from "@/pages/contract/contractDialog/houseGuest";

const rule = {
  moneyType: {
    name: "款类",
    type: "negativeNum"
  },
  outObjId: {
    name: "付款方",
    type: "negativeNum"
  },
  outObj: {
    name: "付款方"
  },
  inObjId: {
    name: "收款人"
  },
  createTime: {
    name: "收款时间"
  },
  amount: {
    name: "收款金额",
    type: "money"
  },
  admin: {
    name: "收账账户"
  }
};
const cardRule = {
  bankName: {
    name: "刷卡银行"
  },
  userName: {
    name: "户名"
  },
  cardNumber: {
    name: "账户"
  },
  orderNo: {
    name: "订单号"
  }
};
const payRule = {
  payMethod: {
    name: "支付方式"
  },
  amount: {
    name: "金额",
    type: "money"
  },
  fee: {
    name: "手续费",
    type: "zeroNum"
  }
};

export default {
  mixins: [MIXINS],
  components: {
    moneyTypePop,
    checkPerson,
    houseGuest
  },
  data() {
    return {
      checkPerson: {
        state: false,
        type: "init",
        code: "",
        flowType: 0,
        label: false,
        current: false
      },
      contId: "",
      dep: {
        id: "",
        name: ""
      },
      inputPerson: false, //是否显示第三方输入框
      billStatus: true, //线上或线下,false=线上，true=线下
      form: {
        contId: "",
        remark: "",
        inObj: "",
        inObjId: "",
        // inObjType:'',
        outObj: "",
        outObjId: "",
        outObjType: "",
        moneyType: "",
        moneyTypePid: "",
        amount: "",
        createTime: "",
        selectId: 0 //房客源选择
      },
      types: [
        {
          id: 1,
          name: "收入"
        },
        {
          id: 2,
          name: "代收代付"
        }
      ],
      activeType: 1,
      moneyType: [],
      moneyTypeName: "", //款类初始化值
      moneyTypeActiveName: "", //款类当前选中name
      isentrust: false, //是否为委托合同创建收款
      moneyTypeOther: [],
      payList: [
        {
          payMethod: "",
          amount: "",
          activeAdmin: "",
          fee: ""
        }
      ],
      cardList: [
        {
          bankName: "",
          userName: "",
          cardNumber: "",
          amount: "",
          orderNo: "",
          fee: ""
        }
      ],
      dictionary: {
        "534": [],
        "644": []
      },
      activeAdmin: "",
      account: [],
      dropdown: [],
      receiptMan: [],
      files: [],
      imgList: [],
      activeLi: "",
      employeInfo: true,
      employePage: 1,
      collapseMsg: {
        total: 0,
        row: []
      },
      fullscreenLoading: false, //提交表单防抖
      showAmount: false, //款类是否为代收代付
      showCard: true, //是否显示刷卡补充
      inObjPerson: true, //收款人是否可选
      firstCreate: {
        state: true,
        content: {}
      }, //合同是否第一次创建
      uploadScane: { path: "sk", id: "" }, //上传场景值
      hasChose_receiptType: {
        state: false,
        version: 0
      }, //合同是否第一次选择过收款方式
      preloadFiles: [],
      // 房客源地址
      addressLabel: {
        val: "请选择",
        name: "",
        label: "",
        selectCode: 0
      },
      addressList: [
        {
          name: "房源",
          type: "house",
          id: 0
        },
        {
          name: "客源",
          type: "guest",
          id: 1
        }
      ],
      addressVal: "",
      isShowDialog: false,
      addAountOther: {
        houseInfo: "", //房源
        guestInfo: "", //客源
        propertyRightAddr: "" //物业地址
      },
      isFukuanFangInput: false,
      shoufuType: "",
      payCode: ""
    };
  },
  mounted() {
    let urlParam = this.$route.query; //id款单id,contId合同id,code合同编号
    this.form.contId = urlParam.contId ? parseInt(urlParam.contId) : "";
    this.isentrust = Number(urlParam.isentrust) === 0 ? false : true;
    // this.billStatus=this.isentrust
    // let { user = {} } = JSON.parse(sessionStorage.getItem("userMsg")) || {};
    this.getMoneyType();
    this.getDictionary();
    // this.remoteMethod()
    this.getDropdown();
    // this.getReceiptman()
    // this.getAdmin()
    // !this.isentrust&&this.getFirstTime_receipt(urlParam.contId)//非委托合同才调用
    console.log("=====");
    console.log(this.getUser);
    if (urlParam.code) {
      this.uploadScane.id = urlParam.code;
    }
    let arr = [];
    if (urlParam.edit) {
      // this.inObjPerson = false
      if (!urlParam.collect) {
        this.getDetails({ type: 1, payId: urlParam.id });
      }

      arr = this.$tool.getRouter(
        [
          "二手房",
          "财务",
          Number(urlParam.edit) === 1 ? "收付款单" : "收款审核"
        ],
        Number(urlParam.edit) === 1 ? "/bill" : "/moneyCheck?type=1"
      );
      arr.push({ name: "编辑收款", path: this.$route.fullPath });
    } else {
      arr = this.$tool.getRouter(
        ["二手房", "合同", "合同列表"],
        "/contractList"
      );
      arr.push({ name: "创建收款", path: this.$route.fullPath });
      if (this.getUser) {
        this.getAcount(this.getUser && this.getUser.user.empId);
      }
    }

    this.setPath(arr);

    // 设置收款人
    let { user = {} } = JSON.parse(sessionStorage.getItem("userMsg")) || {};
    this.dep.id = user.depId;
    this.dep.name = user.depName;
    if (user.depId && urlParam.collect && urlParam.contId != 0) {
      arr = this.$tool.getRouter(["二手房", "财务", "收付款单"], "/bill");
      arr.push({ name: "编辑收款", path: this.$route.fullPath });
      this.setPath(arr);
      this.handleNodeClick(user);
      this.form.inObjId = user.empId;
      this.inputPerson = true;
      this.dep.id = user.depId;
      this.dep.name = user.depName;
      //设置收款账户
      this.getCompanyBanks(user.depId);
      this.form.inObj = user.name;
    } else if (user.depId && urlParam.collect && urlParam.contId == 0) {
      arr = this.$tool.getRouter(["二手房", "财务", "收付款单"], "/bill");
      arr.push({ name: "编辑收款", path: this.$route.fullPath });
      this.setPath(arr);
      this.handleNodeClick(user);
      this.form.inObjId = user.empId;
      this.inputPerson = true;
      this.dep.id = user.depId;
      this.dep.name = user.depName;
      //设置收款账户
      this.getCompanyBanks(user.depId);
      this.form.inObj = user.name;
      this.getDetails({ type: 1, payId: urlParam.id });
    } else {
      this.addInit(urlParam.contId);
      // this.getPayAccount(urlParam.id);
      this.dep.id = user.depId;
      this.dep.name = user.depName;
      this.form.inObjId = user.empId;
      this.form.inObj = user.name;
    }
  },
  methods: {
    checkDate: function(val) {
      // debugger
      let date = new Date(val);
      if (date.getTime() > Date.now()) {
        this.form.createTime = "";
        this.$message({
          message: "不能选择未来时间"
        });
      }
    },
    //判断用户该合同是否已经选择过收款方式
    getFirstTime_receipt: function(id) {
      this.$ajax
        .get("/api/payInfo/checkPayAccountType", { contId: id })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            if (res.data) {
              this.billStatus = res.data.account.value === 3 ? false : true;
              this.hasChose_receiptType.state = true;
              this.hasChose_receiptType.version = res.data.version;
            }
          }
        });
    },
    //判断用户该合同是否第一次选择收款人部门
    addInit: function(id) {
      this.$ajax
        .get("/api/payInfo/toInsert", {
          contId: id,
          type: this.isentrust ? 8 : 1
        })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.firstCreate.content = Object.assign({}, res.data);
            if (!res.data.showAccount) {
              this.firstCreate.state = false;

              if (
                !this.firstCreate.content.showAccount &&
                !this.firstCreate.content.changeAccount
              ) {
                // this.activeAdmin = res.data.account[0].accountId;
              }
              this.getEmploye(res.data.storeId);
            } else {
              // console.log(this.getUser)
              this.firstCreate.state = true;

              this.dep.id = this.getUser.user.depId;
              this.dep.name = this.getUser.user.depName;
              this.getEmploye(this.getUser.user.depId);
              this.form.inObjId = this.getUser.user.empId;
              this.form.inObj = this.getUser.user.name;
            }
          }
        });
    },
    getPayAccount(id) {
      this.$ajax
        .get("/api/payInfo/getPayAccount", {
          payId: id
        })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            console.log("=====");
            console.log(res);
            if (res.data.account) {
              this.activeAdmin = res.data.account[0].accountId;
            }
          }
        });
    },
    clearData: function() {
      this.$tool.clearForm(this.form);
      this.cardList = [];
      this.files = [];
      this.imgList = [];
    },
    cutNum: function(val, item) {
      if (val === 1) {
        this.form.amount = this.$tool.cutFloat({
          val: this.form.amount,
          max: 999999999.99
        });
      } else {
        val[item] = this.$tool.cutFloat({
          val: val[item],
          max: 999999999.99
        });
        if (!this.getPayMethod(val.payMethod) && item === "amount") {
          if (
            val.payMethod === 7 &&
            this.firstCreate.content.fee &&
            this.firstCreate.content.fee["7MaxLimit"] &&
            this.multiply(
              val[item],
              this.firstCreate.content.fee[val.payMethod]
            ) > this.firstCreate.content.fee["7MaxLimit"]
          ) {
            //判断是否选择的储蓄卡且手续费达到封顶额度
            val.fee = this.firstCreate.content.fee["7MaxLimit"];
          } else {
            val.fee = this.multiply(
              val[item],
              this.firstCreate.content.fee[val.payMethod]
            );
          }
        }
      }
    },
    //解决浮点数运算精度
    multiply: function(arg1, arg2) {
      var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
      try {
        m += s1.split(".")[1].length;
      } catch (e) {}
      try {
        m += s2.split(".")[1].length;
      } catch (e) {}
      return this.$tool.toFixed(
        (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
          Math.pow(10, m),
        2
      );
    },
    inputOnly: function(type, index) {
      if (type === "userName") {
        this.cardList[index].userName = this.$tool.textInput(
          this.cardList[index].userName,
          3
        );
      } else if (type === "orderNo") {
        this.cardList[index].orderNo = this.$tool.textInput(
          this.cardList[index].orderNo,
          2
        );
      } else {
        this.form.outObj = this.$tool.textInput(this.form.outObj);
      }
    },
    getPicture: function() {
      let arr = [];
      this.imgList.forEach(item => {
        arr.push(item.path);
      });
      this.fileSign(arr);
    },
    initDepList: function(val) {
      if (!val) {
        this.remoteMethod();
      }
    },
    searchDep: function(payload) {
      /*this.DepList=payload.list
                this.dep.name=payload.depName*/
      this.form.inObjId = "";
      this.clearSelect("emp");
    },
    //收款人下拉选项操作
    clearSelect: function(type = "dep") {
      if (type === "dep") {
        this.dep.name = "";
        this.EmployeList = [];
        this.form.inObjId = "";
        this.form.inObj = "";
        this.employePage = 1;
        /*if(this.DepList.length===0){
                      let val=this.getUser.user
                      this.dep.id=val.depId
                      this.dep.name=val.depName
                      this.getEmploye(val.depId)
                      this.form.inObjId=val.empId
                      this.form.inObj=val.name
                    }*/
      } else {
        this.form.inObj = "";
        /*this.employePage=1
                    this.EmployeList=[]*/
      }
      //初始收账账户数据
      this.payList.forEach(item => {
        item.activeAdmin = "";
      });
      if (this.firstCreate.state) {
        this.activeAdmin = "";
      }
      // this.account = [];
    },
    handleNodeClick(data) {
      this.getEmploye(data.depId, 1, false);
      this.clearSelect();
      this.dep.id = data.depId;
      this.dep.name = data.name;
      console.log(`depId=${this.dep.id}`);
      /*if(data.subs.length===0){
                  this.$refs.tree.blur()
                }*/
    },
    getCompanyBanks(depId) {
      let param = {
        storeId: depId
      };
      this.$ajax.get("/api/payInfo/getCompanyBanks", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          console.log("获取getCompanyBanks");
          console.log(res);
          this.account = [].concat(res.data);
        }
      });
    },
    //判断支付方式选择
    getPayMethod: function(method) {
      return [2, 3].includes(method);
    },
    //是否隐藏刷卡补充
    hideCardList: function(val) {
      if (this.getPayMethod(val.payMethod)) {
        this.$set(val, "fee", "");
      } else {
        if (
          val.amount &&
          val.payMethod === 7 &&
          this.firstCreate.content.fee &&
          this.firstCreate.content.fee["7MaxLimit"] &&
          this.multiply(
            val.amount,
            this.firstCreate.content.fee[val.payMethod]
          ) > this.firstCreate.content.fee["7MaxLimit"]
        ) {
          //判断是否选择的储蓄卡且手续费达到封顶额度
          val.fee = this.firstCreate.content.fee["7MaxLimit"];
        } else {
          val.amount &&
            this.$set(
              val,
              "fee",
              this.multiply(
                val.amount,
                this.firstCreate.content.fee[val.payMethod]
              )
            );
        }
      }
      /*let state = this.payList.every(item => {
                    return item.payMethod === 3
                })
                if (state) {
                    this.showCard = false
                } else {
                    this.showCard = true
                }*/
    },
    //支付信息表单增减
    payListOper: function(index) {
      if (index === 0) {
        let cell = {
          payMethod: "",
          amount: "",
          activeAdmin: "",
          fee: ""
        };
        this.payList = this.payList.concat(cell);
        this.cardOpera("add");
      } else {
        this.payList.splice(index, 1);
        this.cardOpera("delete", index);
      }
    },
    /**
     * 修改款单，获取初始数据
     */
    getDetails: function(param) {
      this.$ajax.get("/api/payInfo/selectRevDetail", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          let obj = {
            remark: res.data.remark,
            inObj: res.data.inObjName,
            inObjId: res.data.inObjId,
            // inObjType:'',
            outObj: res.data.outObj,
            outObjId: res.data.outObjId,
            outObjType: res.data.outObjType.value,
            moneyType: res.data.moneyType,
            moneyTypePid: res.data.moneyTypePid,
            amount: res.data.amount,
            id: res.data.id,
            createTime: this.$tool.timeFormat(res.data.payStartTime)
          };
          if (obj.outObjType === 3) {
            this.inputPerson = true;
          }
          this.billStatus = res.data.inAccountType === 3 ? false : true;
          this.moneyTypeName = res.data.moneyTypeName;
          this.dep.id = res.data.inObjStoreId;
          this.dep.name = res.data.inObjStore;
          this.payCode = res.data.payCode;
          // this.getEmploye(res.data.deptId)
          if (res.data.filePath) {
            this.files = [].concat(JSON.parse(res.data.filePath));
            this.getFiles();
          }
          if (res.data.inAccountType === 4) {
            //线下时才赋值
            this.cardList = res.data.account; //刷卡补充
            let arr = res.data.inAccount.map(item =>
              Object.assign({}, item, {
                activeAdmin: item.cardNumber,
                payMethod: item.payMethod.value
              })
            );
            this.payList = [].concat(arr);
            if (res.data.inAccount && res.data.inAccount.length > 0) {
              //收账账户
              this.activeAdmin = res.data.inAccount[0].accountId;
            }
          } else {
            //线上收款初始化时间控件
            obj.createTime = "";
          }
          // }
          this.form = Object.assign({}, this.form, obj);
          this.getAcount(this.form.inObjId);
          // this.hideCardList()
          if (this.$route.query.collect && this.$route.query.contId == 0) {
            if (res.data.houseinfoJson) {
              let houseinfoJson = JSON.parse(res.data.houseinfoJson);
              console.log("房源详情");
              console.log(houseinfoJson);
              this.addressVal = 0;
              this.addAountOther.houseInfo = houseinfoJson;
              console.log(this.addressLabel.selectCode);
              this.addressLabel.selectCode = houseinfoJson.PropertyNo;
              this.addressLabel.label =
                houseinfoJson.EstateName +
                houseinfoJson.BuildingName +
                houseinfoJson.Unit +
                houseinfoJson.RoomNo;
            }
            if (res.data.guestinfoJson) {
              let guestinfoJson = JSON.parse(res.data.guestinfoJson);
              console.log("客源详情");
              console.log(guestinfoJson);
              this.addAountOther.guestInfo = guestinfoJson;
              this.addressVal = 1;
              this.addressLabel.selectCode = guestinfoJson.InquiryNo;
            }
          }
        }
      });
    },
    /**
     * 获取所有款类
     */
    getMoneyType: function() {
      let param = {};
      if (this.$route.query.edit) {
        param.payId = this.$route.query.id;
      }
      this.$ajax.get("/api/payInfo/selectMoneyType", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.moneyType = this.moneyType.concat(res.data);
          /*res.data.forEach((item, index) => {
                          if (item.name === '代收代付') {
                            // this.moneyType.splice(index, 1)
                            this.moneyTypeOther = res.data.splice(index, 1)
                          }
                        })
                        res.data.forEach(item=>{
                          this.collapseMsg.total=this.collapseMsg.total+item.moneyTypes.length
                          this.collapseMsg.row.push(item.moneyTypes.length)
                          item.moneyTypes.forEach(cell=>{
                            cell.pId=item.id
                            cell.pName=item.name
                          })
                          this.moneyType = this.moneyType.concat(item.moneyTypes)
                        })*/
        }
      });
    },
    /**
     * 获取上传文件
     */
    getFiles: function(payload) {
      /*this.files = this.files.concat(this.$tool.getFilePath(payload.param))
                this.imgList = this.$tool.cutFilePath(this.files)*/

      if (payload) {
        this.files = this.files.concat(this.$tool.getFilePath(payload.param));
      }
      this.imgList = this.$tool.cutFilePath(this.files);
      // this.preloadFiles=[].concat()
      this.imgList.forEach(item => {
        if (this.isPictureFile(item.type)) {
          let hasImg = this.preloadFiles.find(imgData =>
            imgData.includes(item.path)
          );
          !hasImg &&
            this.fileSign([].concat(item.path), "preload").then(res => {
              this.preloadFiles.push(res[0]);
            });
        }
      });
    },
    delFile: function() {
      this.imgList.splice(this.activeLi, 1);
      this.files.splice(this.activeLi, 1);
    },
    goCancel: function() {
      this.$confirm("是否取消当前操作", { closeOnClickModal: false })
        .then(() => {
          this.$router.go(-1);
        })
        .catch(() => {});
    },
    goResult: function() {
      console.log(`www${this.billStatus}`);
      let param = Object.assign({ admin: this.activeAdmin }, this.form);
      param.payAccountType = this.billStatus ? 4 : 3;
      //支付信息列表更新
      let newPayList = this.payList.map(item => {
        return Object.assign({}, item);
      });
      let arr = [];
      let payTotal = 0;
      let cardTotal = 0;
      let checkTotal = 0;
      //收款信息验证
      if (!this.billStatus) {
        delete param.admin;
        delete param.createTime;
      }
      //无合同编号收款
      if (this.$route.query.collect) {
        if (!this.addAountOther.houseInfo && !this.addAountOther.guestInfo) {
          this.$message("请选择房客源任意一个");
          return;
        }
        this.addAountOther.propertyRightAddr = this.addressLabel.label;
        param = Object.assign(param, this.addAountOther);
      }
      if (param.createTime === null) {
        param.createTime = "";
      }
      if (this.isentrust) {
        if (this.$route.query.collect) {
          Object.assign(param, {
            moneyType: -1,
            moneyTypePid: -1,
            type: 1
          });
        } else {
          Object.assign(param, {
            moneyType: -1,
            moneyTypePid: -1,
            type: 8
          });
        }
      }
      arr.push(this.$tool.checkForm(param, rule));
      //支付信息验证
      if (this.billStatus) {
        let cardListStatus = newPayList.every(item => item.payMethod === 3);
        newPayList.forEach((item, index) => {
          if (item.payMethod !== 2) {
            delete item.activeAdmin;
          }
          if (item.payMethod !== 3) {
            checkTotal += parseFloat(item.amount);
          }
          payTotal += parseFloat(item.amount);
          arr.push(this.$tool.checkForm(item, payRule));
          if (!cardListStatus && this.cardList[index].cardNumber) {
            arr.push(this.$tool.checkForm(this.cardList[index], cardRule));
          }
          // (!cardListStatus&&this.cardList[index].bankName)&&arr.push(this.$tool.checkForm(this.cardList[index], cardRule))
        });
        /*if (!cardListStatus) {
                        //刷卡资料验证
                        this.cardList.forEach(item => {
                            cardTotal += parseFloat(item.amount)
                            item.bankName&&arr.push(this.$tool.checkForm(item, cardRule))
                        })
                    }*/
        Promise.all(arr)
          .then(res => {
            let total = parseFloat(this.form.amount);
            if (total !== parseFloat(payTotal.toFixed(2))) {
              this.$message({
                message: "收款金额=支付总金额"
              });
            } else if (
              parseFloat(checkTotal.toFixed(2)) !==
                parseFloat(cardTotal.toFixed(2)) &&
              this.cardList[0].bankName &&
              false
            ) {
              this.$message({
                message: "刷卡资料补充输入总金额=POS刷卡金额+转账金额"
              });
            } else if (this.files.length === 0) {
              this.$message({
                message: "收款凭证不能为空"
              });
            } else {
              param.filePath = [].concat(this.files);
              param.outAccount = cardListStatus ? [] : [].concat(this.cardList);
              param.inAccount = [];
              this.payList.forEach(item => {
                if (
                  this.firstCreate.state ||
                  this.firstCreate.content.showAccount ||
                  this.firstCreate.content.changeAccount
                ) {
                  this.account.find(card => {
                    if (card.id === this.activeAdmin) {
                      let obj = {
                        bankName: card.bankBranchName,
                        userName: card.bankAccountName,
                        cardNumber: card.bankCard,
                        accountId: card.id,
                        storeId: card.storeId,
                        storeName: card.storeName
                      };
                      param.inAccount.push(
                        Object.assign({}, obj, {
                          amount: item.amount,
                          payMethod: item.payMethod,
                          fee: item.fee //新增手续费项
                        })
                      );
                      return true;
                    }
                  });
                } else {
                  let obj = Object.assign(
                    {},
                    this.firstCreate.content.account[0]
                  );
                  delete obj.amount;
                  delete obj.fee;
                  delete obj.orderNo;
                  delete obj.payMethod;
                  param.inAccount.push(
                    Object.assign({}, obj, {
                      amount: item.amount,
                      payMethod: item.payMethod,
                      fee: item.fee //新增手续费项
                    })
                  );
                }
              });
              this.getResult(param, this.$route.query.edit ? "edit" : "");
            }
          })
          .catch(error => {
            this.$message({
              message:
                error.title === "刷卡银行"
                  ? "银行卡号输入有误"
                  : `${error.title}${error.msg}`
            });
          });
      } else {
        Promise.all(arr)
          .then(res => {
            //新加收款参数
            console.log("======");
            console.log(this.preloadFiles);
            console.log(this.addAountOther);
            console.log(param);
            this.getResult(param, this.$route.query.edit ? "edit" : "");
          })
          .catch(error => {
            this.$message({
              message: `${error.title}${error.msg}`
            });
          });
      }
    },
    getResult: function(param, type = "add") {
      this.fullscreenLoading = true;
      if (type === "edit") {
        this.$ajax
          .put("/api/payInfo/updateProceedsInfo", param)
          .then(res => {
            res = res.data;
            if (res.status === 200) {
              this.fullscreenLoading = false;
              res.data.payCode = this.payCode;
              if (this.billStatus) {
                this.$router.go(-1);
              } else {
                //编辑成为线上收款时跳转至结果页显示二维码
                this.$router.replace({
                  path: "receiptResult",
                  query: {
                    type: 1,
                    content: JSON.stringify(res.data)
                  }
                });
              }
            }
          })
          .catch(error => {
            this.fullscreenLoading = false;
            if (error.message === "下一节点审批人不存在") {
              this.checkPerson.code = error.data.payCode;
              this.checkPerson.state = true;
              this.checkPerson.flowType = 1;
              this.checkPerson.label = true;
              this.checkPerson.type = 1;
            } else {
              this.$message({
                message: error,
                type: "error"
              });
            }
            // this.$message({
            //     message: error
            // })
          });
      } else {
        if (this.$route.query.collect) {
          this.$ajax
            .postJSON("/api/payInfo/saveProNoContract", param)
            .then(res => {
              res = res.data;
              if (res.status === 200) {
                this.fullscreenLoading = false;
                this.$router.replace({
                  path: "receiptResult",
                  query: {
                    type: this.billStatus ? 2 : 1,
                    content: JSON.stringify(res.data)
                  }
                });
              }
            })
            .catch(error => {
              this.fullscreenLoading = false;
              if (error.message === "下一节点审批人不存在") {
                this.$router.replace({
                  path: "receiptResult",
                  query: {
                    type: this.billStatus ? 2 : 1,
                    content: JSON.stringify(error.data),
                    errorCode: "dialog"
                  }
                });
              } else {
                this.$message({
                  message: error
                });
              }
            });
        } else {
          this.$ajax
            .postJSON("/api/payInfo/saveProceeds", param)
            .then(res => {
              res = res.data;
              if (res.status === 200) {
                this.fullscreenLoading = false;
                this.$router.replace({
                  path: "receiptResult",
                  query: {
                    type: this.billStatus ? 2 : 1,
                    content: JSON.stringify(res.data)
                  }
                });
              }
            })
            .catch(error => {
              this.fullscreenLoading = false;
              if (error.message === "下一节点审批人不存在") {
                this.$router.replace({
                  path: "receiptResult",
                  query: {
                    type: this.billStatus ? 2 : 1,
                    content: JSON.stringify(error.data),
                    errorCode: "dialog"
                  }
                });
              } else {
                this.$message({
                  message: error
                });
              }
            });
        }
      }
    },
    //关闭设置审核人弹窗
    personChose() {
      this.$router.go(-1);
    },
    /**
     * 获取下拉框数据
     */
    getDropdown: function() {
      let param = {
        contId: this.form.contId
      };
      this.$ajax.get("/api/payInfo/selectValue", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.dropdown = res.data;
        }
      });
    },
    /**
     * 获取收款人
     */
    getReceiptman: function() {
      this.$ajax.get("/api/organize/currentdep/employee").then(res => {
        res = res.data;
        if (res.status === 200) {
          this.receiptMan = res.data;
        }
      });
    },
    /**
     * 获取收款账户
     */
    getAcount: function(empId) {
      let param = {
        contId: this.form.contId,
        empId: empId,
        payId: this.$route.query.id
      };
      this.$ajax.get("/api/payInfo/selectProceedsAccount", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.account = [].concat(res.data);
        }
      });
    },
    //选择收款类型操作
    checkReceiptType: function(type) {
      /*if(type===1&&this.isentrust){
                    this.$message({
                        message:'交易服务费的收款方式只能选择线下收款'
                    })
                    return
                }
                if (this.hasChose_receiptType.state) {
                    let msg = ''
                    switch (this.hasChose_receiptType.version) {
                        case 1:
                            msg = '请先作废之前的收款方式，作废后可重新选择其他收款方式~'
                            break;
                        case 2:
                            msg = '因您的第一笔实收是线上收款，请根据第一笔实收的收款方式继续收款~'
                            break;
                        case 3:
                            msg = '因您的第一笔实收是线下收款，请根据第一笔实收的收款方式继续收款~'
                            break;
                        default:
                            msg = '结果异常'
                    }
                    this.$message({
                        message: msg
                    })
                    return
                }*/
      this.billStatus = false; //线上收款
      type !== 1 && (this.billStatus = true);
      if (type == 2) {
        this.getCompanyBanks(this.dep.id);
      }
    },
    getCell: function(label) {
      this.moneyTypeActiveName = label.name;
      this.showAmount = label.pName === "代收代付" ? false : true;
      this.form.moneyType = label.key;
      this.form.moneyTypePid = label.pId;
      // this.layer.content[0].moneyType=label.name
      // this.getAmount()
    },
    clearMoneyType: function() {
      this.form.moneyType = "";
      this.form.moneyTypePid = "";
      this.moneyTypeName = "";
      this.$tool.clearForm(this.amount, true);
    },
    /**
     * 获取下拉框选择对象
     * @param item
     */
    getOption: function(item, type) {
      console.log("======");
      console.log(item);
      console.log(type);
      let obj = {};
      let list = type === 1 ? this.dropdown : this.EmployeList;
      list.find(tip => {
        if (tip[type === 1 ? "value" : "empId"] === item) {
          if (type === 1) {
            obj.outObjId = tip.custId;
            obj.outObj = tip.custName;
            if (
              (item == 1 && this.$route.query.code) ||
              (item == 2 && this.$route.query.code)
            ) {
              this.inputPerson = false;
            } else {
              this.inputPerson = true;
            }
          } else {
            obj.inObj = tip.name;
            if (this.firstCreate.state) {
              this.activeAdmin = "";
              this.getAcount(this.form.inObjId);
            }
          }
          return;
        }
      });

      this.form = Object.assign({}, this.form, obj);
    },
    /**
     * 刷卡资料补充
     */
    cardOpera: function(type, index) {
      if (type === "add") {
        let cell = {
          bankName: "",
          userName: "",
          cardNumber: "",
          amount: "",
          orderNo: "",
          fee: ""
        };
        this.cardList.push(cell);
      } else {
        this.cardList.splice(index, 1);
      }
    },
    /**
     * 根据卡号获取银行信息
     */
    getBank: function(row, index) {
      row.cardNumber = this.$tool.numberInput(row.cardNumber);
      let param = {
        cardNumber: row.cardNumber
      };
      if (param.cardNumber.length > 20) {
        row.cardNumber = row.cardNumber.substr(0, 20);
        return;
      }
      if (param.cardNumber.length >= 12) {
        this.$ajax.get("/api/system/selectBankNameByCard", param).then(res => {
          res = res.data;
          if (res.status === 200) {
            this.cardList[index].bankName = res.data.bankName
              ? res.data.bankName
              : "";
          }
        });
      }
    },
    // 获取房源客源
    addressClickFn() {
      if (this.addressVal === 0 || this.addressVal === 1) {
        this.isShowDialog = true;
      }
    },
    addressChangeFn() {
      this.addressLabel = {
        ...this.addressLabel,
        name: "",
        label: "",
        selectCode: 0
      };
      this.addAountOther = {
        houseInfo: "",
        guestInfo: "",
        propertyRightAddr: ""
      };
    },
    closeHouseGuest(value) {
      console.log("房客源");
      console.log(value);
      if (value) {
        if (value.dialogType == "house") {
          this.getHousedetail(value.selectCode, 1).then(res => {
            this.addressLabel.selectCode = res.PropertyNo;
            if (value.dialogType == "guest") {
              this.addAountOther.guestInfo = res;
            } else {
              this.addAountOther.houseInfo = res;
            }
          });
        } else {
          this.getHousedetail(value.selectCode, 2).then(res => {
            this.addressLabel.selectCode = res.InquiryNo;
            if (value.dialogType == "guest") {
              this.addAountOther.guestInfo = res;
            } else {
              this.addAountOther.houseInfo = res;
            }
          });
        }
      }
      this.isShowDialog = false;
    },
    //根据房源id获取房源信息
    getHousedetail(id, type) {
      return new Promise((resolve, reject) => {
        let param, url;
        if (type == 1) {
          url = "/api/resource/houses/one";
          param = {
            houseId: id
          };
        } else {
          url = "/api/resource/customers/one";
          param = {
            customerId: id
          };
        }

        this.$ajax
          .get(url, param)
          .then(res => {
            res = res.data;
            if (res.status === 200) {
              let houseMsg = res.data;
              if (type == 1) {
                this.addressLabel = {
                  ...this.addressLabel,
                  label:
                    houseMsg.EstateName.replace(/\s/g, "") +
                    " " +
                    houseMsg.BuildingName.replace(/\s/g, "") +
                    houseMsg.Unit.replace(/\s/g, "") +
                    houseMsg.RoomNo.replace(/\s/g, ""),
                  name: houseMsg.PropertyNo
                };
              }
              resolve(res.data);
            }
          })
          .catch(error => {
            this.$message({
              message: error
            });
          });
      });
    }
  },
  computed: {
    getDir: function() {
      // debugger
      let arr = this.dictionary["534"].slice(1);
      let dir = [
        {
          label: "POS刷卡",
          options: this.dictionary["644"].map(item => {
            if (item.value === "微信") {
              return { key: 10, value: item.value };
            } else if (item.value === "支付宝") {
              return { key: 9, value: item.value };
            } else {
              return { key: item.key + 7, value: item.value };
            }
          })
        },
        {
          label: "",
          options: arr
        }
      ];

      return dir;
    },
    collect() {
      let { collect = 0 } = this.$route.query || {};
      return collect;
    },
    addressValCom() {
      let n = {};
      this.addressList.forEach(e => {
        if (e.id === this.addressVal) {
          n = { ...e };
        }
      });
      return n;
    }
  },
  watch: {
    cardList: function(val) {
      if (val.length === 0) {
        this.cardList.push({
          bankName: "",
          userName: "",
          cardNumber: "",
          amount: "",
          orderNo: "",
          fee: ""
        });
      }
    },
    getUser: function(val) {
      this.getAcount(val.user.empId);
    }
  },
  filters: {
    /**
     * 过滤显示图片缩略图
     * @param val后端返回的所有文件资源遍历的当前项
     * @param list图片资源获取签名后的临时数组
     * @vm 接收vue实例通过this._self传递才有效
     */
    getSignImage(val, list, vm) {
      if (list.length === 0) {
        return "";
      } else {
        let imgDir = list.find(item => {
          return item.includes(val.path);
        });
        let img = new Image();
        img.src = imgDir;
        img.onload = function() {
          let persent = parseFloat((img.width / img.height).toFixed(2));
          let imgWidth = 0;
          // console.log(persent)
          if (img.width > 100) {
            imgWidth = 100;
            // picture.style.height=`${800/this.persent}px`
            if (img.height > 90) {
              // picture.style.height=`${window.innerHeight}px`
              if (persent > 1) {
                imgWidth = 90 * persent * 0.6;
              } else {
                imgWidth = 90 * persent;
              }
            }
          } else {
            if (img.height > 90) {
              // picture.style.height=`${window.innerHeight}px`
              imgWidth = 90 * persent;
            }
          }
          vm.$set(val, "width", `${imgWidth}px`);
        };
        return imgDir;
      }
    }
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/common.less";

input:disabled {
  &.input-info {
    background-color: @bg-grey !important;
  }
}

.h32 {
  height: 32px;
  line-height: 32px;
  min-width: 118px;

  &.other {
    min-width: 300px;
  }

  &.no-min {
    min-width: initial;
  }
}

.artice-margin {
  margin-bottom: 30px;
}

.txt-title {
  font-weight: bold;
  margin-bottom: @margin-15;
  font-size: @size-14;
}

input[size="small"] {
  height: 32px;
}

input.person {
  margin-left: @margin-10;
}

.flex-box {
  display: flex;

  &.tool-tip {
    max-width: 200px;
    justify-content: space-between;
  }

  &.no-max {
    max-width: none;
  }

  .tip-message {
    margin-left: @margin-10;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-weight: normal;

    > i {
      margin-right: 4px;
      font-size: @size-14;
    }
  }
}

/deep/ .info-textarea {
  width: 400px;

  .el-textarea__inner {
    height: 115px;
  }
}

.col-other {
  > p {
    &:first-of-type {
      margin-bottom: @margin-10;
    }
  }

  > .input-group {
    > p {
      margin-bottom: @margin-10;
    }
  }
}

.other-message {
  .input-group {
    margin-right: 60px;
  }
}

.bill-form {
  margin-bottom: 30px;

  > li {
    display: flex;

    &:last-of-type {
      .col {
        margin-bottom: 0px;
      }
    }

    .col {
      max-width: 210px;
      margin: 0 60px 21px 0;

      &.no-max {
        max-width: none;
      }

      &.active-360 {
        max-width: 360px;
      }

      &.active-400 {
        max-width: 400px;
      }

      > label {
        display: block;
      }

      > input {
        height: 32px;
        line-height: 32px;
      }

      .text-height {
        height: 32px;
        line-height: 32px;
      }
    }
  }
}

.pay-list {
  margin: @margin-15 0 30px;

  > li {
    display: flex;
    /*align-items: flex-end;*/
    /*justify-content: space-between;*/
    border-bottom: 1px @color-E9 dashed;
    position: relative;
    flex-direction: column;
    width: 920px;
    background-color: @bg-grey;
    padding: @margin-base @margin-10;
    margin-bottom: @margin-15;

    &:last-of-type {
      /*border: 0px;*/
      margin-bottom: 0px;
    }

    > i {
      color: @color-C8;
      font-size: @icon-size-30;
      margin-bottom: @margin-10;
      position: absolute;
      right: -40px;
      top: 50%;
      transform: translateY(-50%);
    }

    .bankCard-list {
      > p {
        margin-bottom: @margin-base;
      }
    }
  }

  .message-box {
    > section {
      display: flex;
      flex-direction: column;
      margin-right: 60px;

      &:nth-of-type(n + 1) {
        > input {
          height: 32px;
        }
      }
    }
  }
}

/deep/ .collapse-cell {
  /*margin-top: 13px !important;*/

  .el-table__row {
    > td {
      padding: 0;

      .cell {
        padding: 0 @margin-10;

        > input {
          text-align: center;
        }

        /*padding: 0;
          > ul {
            > li {
              padding: 12px 10px;
              border-bottom: 1px solid #ebeef5;
              text-align: left;
              &:last-of-type {
                border: 0;
              }
            }
          }*/
      }
    }
  }
}

.checkbox-info {
  display: flex;
  align-items: center;
  position: relative;

  &:before {
    content: "";
    display: inline-block;
    border: 1px solid @color-B9;
    width: 16px;
    height: 16px;
  }

  &.active {
    &:before {
      content: "A";
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  > span {
    line-height: initial;
    margin-left: 10px;
  }
}

.icon-xialazhankai {
  color: #a1a1a1;
  font-size: @size-base;
  margin-left: 10px;
}

.box {
  padding: 0 @margin-base;

  &-left {
    text-align: left;
  }
}

.input-group {
  display: block;
  max-width: 1110px;
  /*> p {
      > span {
        color: @color-red;
        margin-left: 20px;
      }
    }*/

  .money-type-list {
    display: flex;
    background-color: @bg-grey;
    padding: 0 15px;
    margin-top: @margin-base;

    > li {
      height: 40px;
      min-width: 100px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.active {
        color: @color-blue;
        position: relative;

        &:after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          border-top: 4px solid @color-blue;
        }
      }
    }
  }

  .table-total {
    margin: 0 0 47px;
    padding: 0;

    > li {
      display: inline-block;
      font-weight: bold;
      font-size: @size-base;
      margin-right: 20px;

      > span {
        color: @color-red;
      }
    }
  }

  .type-list {
    display: flex;
    flex-wrap: wrap;
    margin: 20px 0px;

    > li {
      width: 150px;
      padding: 10px;
      box-sizing: border-box;
      text-align: center;
      margin: 0 10px 10px 0;
      border: 1px solid @color-D6;
      color: @color-6c;

      &.active {
        color: @color-blue;
        border-color: @color-blue;
      }
    }
  }

  .span-join {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    max-width: 300px;
    margin: 20px 0;
    padding: 6px 8px;
    border: 1px solid @color-D6;
    border-radius: 4px;

    > input {
      flex: 1;
    }
  }

  .upload-list {
    display: flex;
    flex-wrap: nowrap;
    margin: @margin-base 0;
    width: 810px;
    overflow-x: auto;

    > li {
      border: 1px dashed @color-D6;
      width: 115px;
      min-width: 115px;
      height: 115px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .span {
        width: 100px;
        text-align: center;
        /*word-break: break-all;*/
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      &:first-of-type {
        .iconfont {
          color: @bg-th;
          font-size: 58px;
          position: relative;
          display: flex;
          align-items: center;

          &:before {
          }
        }
      }

      &:nth-of-type(n + 1) {
        margin-right: @margin-base;
        position: relative;

        > p {
          position: absolute;
          top: 0;
          right: 0;
          color: @color-red;

          .iconfont {
            font-size: 20px;
          }
        }
      }
    }
  }

  .upload-text {
    color: @color-99A;
    padding: 0 @margin-base;

    > span {
      &:first-of-type {
        color: @color-blue;
        margin: 0;
      }
    }
  }

  /deep/ .el-table,
  .el-textarea {
  }
}

.view {
  background-color: @bg-white;
  height: 100%;
  box-sizing: border-box;

  &-context {
    height: 100%;
    overflow: auto;
    padding: @margin-10 @margin-10 60px;
    box-sizing: border-box;
  }

  section {
    margin: @margin-10 0px;
    /*&:first-of-type {
        display: flex;
        .input-group {
          display: flex;
          margin: 0;
          &:first-of-type {
            margin-right: @margin-15;
          }
        }
      }*/
  }

  > p {
    &:last-of-type {
      position: absolute;
      bottom: @margin-10;
      right: @margin-15;
      text-align: right;
    }
  }
}

p.block-receipt-type {
  display: inline-block;

  &.worth-list {
    font-size: 14px;
    margin-left: 40px;

    & > span {
      margin-right: 30px;
    }
  }

  .icon-wenhao {
    margin-left: 10px;
  }
}

.warning-text {
  color: red;
}
// 添加客源房源
.address-label {
  position: relative;
  .address-label-p {
    position: absolute;
    left: 0;
    bottom: -20px;
    line-height: 20px;
    color: #999;
  }
  .address-slelect {
    line-height: 32px;
    height: 32px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    margin-left: 10px;
    width: 214px;
    box-sizing: border-box;
    padding: 0 30px 0 15px;
    position: relative;
    color: #606266;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .el-icon-arrow-down {
      color: #c0c4cc;
      font-size: 14px;
      position: absolute;
      width: 25px;
      position: absolute;
      right: 5px;
      line-height: 32px;
      text-align: center;
    }
    .cl-gray {
      color: #c0c4cc;
    }
    &:hover {
      border-color: #c0c4cc;
    }
  }
}
</style>
