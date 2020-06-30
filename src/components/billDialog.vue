<template>
  <el-dialog
    :title="getTitle"
    width="671px"
    :close-on-click-modal="false"
    @close="goCancel"
    :visible="dialogShow"
  >
    <div class="view-context">
      <ul class="bill-form">
        <li v-if="dialogOperation!==3">
          <div class="input-group col">
            <label class="form-label no-width f14 margin-bottom-base">款类</label>
            <div class="flex-box w300">
              <el-select
                size="small"
                class="w300"
                v-model="form.moneyTypePid"
                placeholder="请选择"
                @change="getMoneyType"
              >
                <el-option
                  v-for="item in moneyType"
                  :key="item.parentId"
                  :label="item.name"
                  :value="item.parentId"
                >
                </el-option>
              </el-select>
            </div>

            <!-- <moneyTypePop class="info-pop" :data="moneyType" :init="moneyTypeName" @checkCell="getCell"
                          @clear="clearMoneyType"></moneyTypePop> -->
          </div>
          <div class="input-group col">
            <label class="form-label no-width f14 margin-bottom-base">合同编号</label>
            <div class="flex-box w300">
              <el-input
                size="small"
                :disabled="true"
                v-model="form.code"
              ></el-input>
            </div>
          </div>

          <div
            class="input-group col"
            v-if="dialogType===2"
          >
            <label class="form-label no-width f14 margin-bottom-base">收付时间</label>
            <el-date-picker
              class="w300"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="form.receiptDate"
              type="datetime"
              placeholder="选择日期时间"
              @change="checkDate"
            >
            </el-date-picker>
          </div>
          <div class="input-group col">
            <label class="form-label no-width f14 margin-bottom-base">收付方式</label>
            <div class="flex-box w300">
              <el-select
                size="small"
                class="w300"
                v-model="form.methods"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in methodsList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="input-group col">
            <label class="form-label no-width f14 margin-bottom-base">金额</label>
            <div class="flex-box">
              <input
                type="text"
                size="small"
                class="w300 el-input__inner"
                placeholder="请输入"
                maxlength="20"
                v-model.trim="form.amount"
                @input="inputOnly('amount')"
              >
            </div>
          </div>

          <div class="input-group col" v-show="form.methods===2">
            <label class="form-label no-width f14 margin-bottom-base">收款人</label>
            <div class="flex-box">
              <el-select
                size="small"
                :class="[(Number(form.objType)!==3)?'w300':'w140']"
                v-model="form.objType"
                placeholder="请选择"
                @change="getOption(form.objType,1)"
              >
                <el-option
                  v-for="item in dropdown"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <input
                type="text"
                size="small"
                class="w140 el-input__inner person"
                placeholder="请输入"
                maxlength="20"
                v-model.trim="form.objName"
                @input="inputOnly('normal')"
                v-if="Number(form.objType)===3"
              >
            </div>
          </div>
          <div class="input-group col" v-show="form.methods===1">
            <label class="form-label no-width f14 margin-bottom-base">收款人</label>
            <div class="flex-box">
              <select-tree
                v-if="firstCreate.state"
                :data="DepList"
                :init="form.deptName"
                @checkCell="handleNodeClick"
                @clear="clearSelect('dep')"
                @search="searchDep"
                key="other"
              ></select-tree>
              <el-input
                :disabled="true"
                size="small"
                class="w140"
                v-model="form.deptName"
                v-else
              ></el-input>
              <el-select
                :clearable="true"
                ref="employe"
                v-loadmore="moreEmploye"
                class="person w140"
                size="small"
                v-model="form.employeeId"
                placeholder="请选择"
                @clear="clearSelect('emp')"
                @focus="employeInfo=false"
                @change="getOption(form.employeeId,2)"
              >
                <el-option
                  :label="form.employeeName"
                  :value="form.employeeId"
                  v-if="employeInfo"
                ></el-option>
                <el-option
                  v-for="(item,index) in EmployeList"
                  :key="index"
                  :label="item.name"
                  :value="item.empId"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </li>
        <li v-if="dialogOperation===3">
          <p class="details-content"><span>录入时间：</span><span>{{detailMsg.writeTime}}</span></p>
          <p class="details-content"><span>合同编号：</span><span>{{form.code}}</span></p>
          <p class="details-content"><span>款类：</span><span>{{moneyTypeName}}</span></p>
          <p class="details-content"><span>应收金额（元）：</span><span>{{form.amount}}</span></p>
          <p class="details-content"><span>收付方式：</span><span>{{form.methods===1?'收款':'付款'}}</span></p>
          <p class="details-content"><span>收款人：</span><span v-if="detailMsg.payer">{{detailMsg.payer.pay}}</span></p>
        </li>
      </ul>
      <section>
        <div class="col-other other-message">
          <div
            v-if="dialogOperation!==3"
            class="input-group"
            style="position: relative;"
          >
            <p><label class="f14">备注：</label></p>
            <el-input
              v-model="form.remark"
              class="info-textarea"
              :class="[form.remark&&form.remark.length>0?'':'scroll-hidden']"
              placeholder="请填写备注信息"
              rows="5"
              maxlength="200"
              type="textarea"
              show-word-limit
            ></el-input>
            <span class="text-calendar">{{getTextLength}}/200</span>
          </div>
          <div class="input-group">
            <p v-if="dialogOperation!==3"><label class="f14">上传附件:</label></p>
            <p v-else><label class="f14">附件：</label><span v-if="imgList.length===0">无</span></p>
            <ul class="upload-list">
              <li v-if="dialogOperation!==3">
                <file-up
                  class="upload-context"
                  @getUrl="getFiles"
                >
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
                  alt=""
                  v-if="isPictureFile(item.type)"
                  height="90px"
                  :key="item.path"
                  :width="item.width"
                >
                <upload-cell
                  :type="item.type"
                  v-else
                ></upload-cell>
                <!--<span>{{item.name}}</span>-->
                <el-tooltip
                  :content="item.name"
                  placement="top"
                >
                  <div class="span">{{item.name}}</div>
                </el-tooltip>
                <p
                  v-show="activeLi===index&&dialogOperation!==3"
                  @click.stop="delFile"
                ><i class="iconfont icon-tubiao-6"></i></p>
              </li>
            </ul>
            <!--<p class="upload-text"><span>点击可上传图片附件或拖动图片到此处以上传附件</span>（买卖交易合同、收据、租赁合同、解约协议、定金协议、意向金协议）</p>-->
          </div>
        </div>
      </section>
      <preview
        :imgList="previewFiles"
        :start="previewIndex"
        v-if="preview"
        @close="preview=false"
      ></preview>
    </div>
    <p
      slot="footer"
      v-if="dialogOperation!==3"
    >
      <el-button
        class="btn-info"
        round
        size="small"
        @click="goCancel"
      >取消</el-button>
      <el-button
        class="btn-info"
        round
        size="small"
        type="primary"
        @click="goResult('postJSON')"
        v-loading.fullscreen.lock="fullscreenLoading"
      >保存
      </el-button>
    </p>
  </el-dialog>
</template>

<script>
import { MIXINS } from "@/assets/js/mixins";
import moneyTypePop from "@/components/moneyTypePop";

const rule = {
  pid: {
    name: "款类",
    type: "negativeNum"
  },
  skTime: {
    name: "收款时间"
  },
  amount: {
    name: "收款金额",
    type: "money"
  },
  type: {
    name: "收付方式"
  },
  outObjType: {
    name: "付款方",
    type: "negativeNum"
  },
  outObj: {
    name: "付款方"
  },
  empId: {
    name: "收款人"
  }
};

export default {
  mixins: [MIXINS],
  components: {
    moneyTypePop
  },
  props: {
    dialogShow: {
      type: Boolean,
      default: true
    },
    dialogType: {
      type: Number,
      default: 1 //1=应收/应付款项,2=实收/实付款项
    },
    dialogOperation: {
      type: Number,
      default: 1 //1=新增,2=编辑,3=查看
    },
    contId: {
      //合同id
      type: Number,
      default: 124
    },
    payId: {
      //查询详情，编辑时用到id
      type: Number,
      default: 2659
    }
  },
  data() {
    return {
      methodsList: [],
      form: {
        contId: this.contId,
        code: "",
        moneyType: "",
        moneyTypePid: "",
        remark: "",
        amount: "",
        receiptDate: "",
        deptId: "",
        deptName: "",
        employeeName: "",
        employeeId: "",
        objName: "",
        objType: "", //付款方options类型
        methods: 1 //add收付方式
      },
      moneyType: [],
      moneyTypeName: "",
      dropdown: [], //收付对象list
      employeInfo: true,
      employePage: 1,
      fullscreenLoading: false, //提交表单防抖
      firstCreate: {
        state: true,
        content: {},
        dealAgentId: 0
      }, //合同是否第一次创建
      files: [],
      imgList: [],
      activeLi: "",
      preloadFiles: [],
      detailMsg: {
        writeTime: "", //录入时间
        payer: null
      }
    };
  },
  mounted() {
    this.addInit(this.contId);
    // this.getMoneyType()
    if (this.dialogOperation !== 1) {
      this.getDetailsData(this.payId);
    }
  },
  methods: {
    //判断用户该合同是否第一次选择收款人部门
    addInit: function(id) {
      this.$ajax.get("/api/receivables/toInsert", { id: id }).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.dropdown = res.data.dropDown;
          this.methodsList = [].concat(res.data.type);
          this.moneyType = res.data.moneyTypes;
          this.form.code = res.data.code;
          this.firstCreate.dealAgentId = res.data.dealAgentId;
          if (!!res.data.dealAgentStoreId) {
            this.firstCreate.state = false;
            this.getEmploye(res.data.dealAgentStoreId);
            this.form = Object.assign(this.form, {
              deptId: res.data.dealAgentStoreId,
              deptName: res.data.dealAgentStoreName
            });
          } else {
            this.form.deptId = this.getUser.user.depId;
            this.form.deptName = this.getUser.user.depName;
            this.getEmploye(this.getUser.user.depId);
            this.form.employeeId = this.getUser.user.empId;
            this.form.employeeName = this.getUser.user.name;
          }
        }
      });
    },
    checkDate:function(val){
      // debugger
      let date=new Date(val);
      if(date.getTime()>Date.now()){
        this.form.receiptDate=''
        this.$message({
          message:'不能选择未来时间'
        })
      }
    },
    inputOnly: function(type, index) {
      //输入框限制
      if (type === "amount") {
        this.form.amount = this.$tool.cutFloat({
          val: this.form.amount,
          max: 999999999.99
        });
      } else {
        this.form.objName = this.$tool.textInput(this.form.objName);
      }
    },
    searchDep: function(payload) {
      this.form.inObjId = "";
      this.clearSelect("emp");
    },
    //收款人下拉选项操作
    clearSelect: function(type = "dep") {
      if (type === "dep") {
        this.form.deptName = "";
        this.EmployeList = [];
        this.form.employeeId = "";
        this.form.employeeName = "";
        this.employePage = 1;
      } else {
        this.form.employeeName = "";
      }
    },
    //收款人选择部门
    handleNodeClick(data) {
      this.getEmploye(data.depId, 1, false);
      this.clearSelect();
      this.form.deptId = data.depId;
      this.form.deptName = data.name;
    },
    /**
     * 获取所有款类
     */
    getMoneyType: function() {
      let param = {};
      this.$ajax.get("/api/payInfo/selectMoneyType", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.moneyType = this.moneyType.concat(res.data);
        }
      });
    },
    //取消
    goCancel: function() {
      // this.$tool.clearForm(this.form)
      this.$emit("close");
    },
    /**
     * 创建收款操作
     */
    goResult: function(type, url = "/receivables/insertrRceivables") {
      let {
        contId,
        code,
        moneyType,
        moneyTypePid,
        remark,
        amount,
        receiptDate,
        deptId,
        deptName,
        employeeName,
        employeeId,
        objName,
        objType
      } = this.form;
      let param = Object.create(null);
      Object.assign(param, {
        id: contId,
        code: code,
        pid: moneyTypePid,
        key: moneyType,
        amount: amount,
        type: this.form.methods,
        remark: remark,
        filePath: this.files
      });
      if (this.form.methods === 1) {
        Object.assign(param, {
          storeId: deptId,
          storeName: deptName,
          empId: employeeId,
          empName: employeeName
        });
      } else {
        Object.assign(param, { outObjType: objType, outObj: objName });
      }
      if (this.dialogType === 2) {
        Object.assign(param, { skTime: receiptDate });
      }
      if (this.dialogOperation === 2) {
        type = "put";
        url = "/receivables/updateRceivables";
        param.payId = Number(this.payId);
      }
      this.$tool
        .checkForm(param, rule)
        .then(res => {
          this.$ajax[type](`/api${url}`, param)
            .then(res => {
              res = res.data;
              if (res.status === 200) {
                this.$emit("success");
              }
            })
            .catch(error => {
              this.$message({
                message: `${error}`
              });
            });
        })
        .catch(error => {
          this.$message({
            message: `${error.title}${error.msg}`
          });
        });
    },
    /**
     * 编辑时获取详情
     */
    getDetailsData: function(id) {
      let param = {
        id: id
      };
      this.$ajax.get("/api/receivables/getRceivables", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          let {
            amount,
            contractCode,
            file,
            moneyType,
            payer,
            time,
            type,
            remark
          } = res.data;
          this.moneyTypeName = moneyType.name;
          this.files = [].concat(file);
          this.dialogOperation === 3 &&
            Object.assign(this.detailMsg, {
              writeTime: this.$tool.timeFormat(time),
              payer: payer
            });
          //初始化form表单对象
          Object.assign(this.form, {
            amount: amount,
            code: contractCode,
            receiptDate:
              this.dialogType === 2 ? this.$tool.timeFormat(time) : "",
            methods: type.value,
            moneyTypePid: moneyType.parentId,
            moneyType: moneyType.key,
            remark: remark
          });
          if (this.form.methods === 1) {
            Object.assign(this.form, {
              deptId: payer.prefixId,
              deptName: payer.prefixName,
              employeeId: payer.suffixId,
              employeeName: payer.suffixName
            });
          } else {
            Object.assign(this.form, {
              objType: payer.prefixId,
              objName: payer.suffixName
            });
          }
          if (this.dialogType === 2) {
            Object.assign(this.form, {
              receiptDate: this.$tool.timeFormat(res.data.skTime)
            });
          }
          this.getFiles();
        }
      });
    },
    /**
     * 款类选择操作
     */
    getCell: function(label) {
      this.form.moneyType = label.key;
      this.form.moneyTypePid = label.pId;
    },
    clearMoneyType: function() {
      this.form.moneyType = "";
      this.form.moneyTypePid = "";
      this.moneyTypeName = "";
    },
    /**
     * 获取下拉框选择对象
     * @param item
     * @param type 1=付款方选择;2=选择收款人
     */
    getOption: function(item, type) {
      let obj = {};
      let list = type === 1 ? this.dropdown : this.EmployeList;
      list.find(tip => {
        if (tip[type === 1 ? "value" : "empId"] === item) {
          if (type === 1) {
            obj.objName = tip.custName;
          } else {
            obj.employeeName = tip.name;
          }
          return;
        }
      });

      this.form = Object.assign({}, this.form, obj);
    },
    /**
     * 获取上传文件
     */
    getFiles: function(payload) {
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
    //获取款类小类
    getMoneyType(val){
      this.moneyType.forEach(element => {
        if(element.parentId===val){
          this.form.moneyType=element.key
        }
      });
    }
  },
  computed: {
    getTitle: function() {
      let res = "";
      switch (this.dialogOperation) {
        case 1:
          res = "新增";
          break;
        case 2:
          res = "编辑";
          break;
        case 3:
          res = "查看";
          break;
      }
      return res;
    },
    getTextLength:function(){
      let res=this.form.remark.trim()
      return res.length
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

/deep/ .info-pop {
  .w200 {
    width: 300px !important;
  }
}
.text-calendar{
  position: absolute;
  right: 30px;
  bottom: 5px;
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

.person {
  margin-left: 20px;
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
  width: 615px;
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

/*.other-message {
    .input-group {
      margin-right: 60px;
    }
  }*/

.bill-form {
  /*margin-bottom: 30px;*/
  > li {
    display: flex;
    flex-wrap: wrap;
    /*justify-content: space-between;*/
    /*&:last-of-type {
      .col {
        margin-bottom: 0px;
      }
    }*/
    .col {
      /*max-width: 210px;*/
      margin: 0 @margin-15 @margin-10 0;
      flex: 1;
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
    .details-content {
      flex: 1;
      min-width: 48%;
      &:nth-of-type(2n + 2) {
        margin-left: @margin-10;
      }
      &:not(:last-of-type) {
        margin-bottom: @margin-10;
      }
    }
  }
}

.pay-list {
  margin: @margin-15 0 44px;
  > li {
    display: flex;
    align-items: flex-end;
    /*justify-content: space-between;*/
    border-bottom: 1px @color-E9 dashed;
    padding-bottom: @margin-15;
    margin-bottom: @margin-15;
    &:last-of-type {
      /*border: 0px;*/
      margin-bottom: 0px;
    }
    > i {
      color: @color-C8;
      font-size: @icon-size-30;
    }
  }
  .message-box {
    > section {
      display: flex;
      flex-direction: column;
      margin-right: 60px;
      &:nth-of-type(2) {
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
    width: 615px;
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
    padding: @margin-10 @margin-10;
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
    margin-bottom: @margin-15;
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
</style>
