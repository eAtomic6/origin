<template>
  <div class="view">
    <div class="view-context">
      <p class="f14 txt-title">收款信息</p>
      <ul class="bill-form">
        <li>
          <p class="block-receipt-type worth-list">
            <span>应收佣金（元）：{{firstCreate.content.receivableCommission}}</span><span>已收（元）：{{firstCreate.content.receivedCommission}}</span><span
            class="warning-text">未收（元）：{{firstCreate.content.uncollected}}</span>
          </p>
        </li>
        <li>
          <div class="input-group col">
            <div class="flex-box tool-tip">
              <label class="form-label no-width f14 margin-bottom-base">
                <span>款类</span>
              </label>
              <el-tooltip content="当未找到需要的款类时，可联系管理员进行配置" placement="top">
                <p class="tip-message"><i class="iconfont icon-wenhao"></i>填写帮助</p>
              </el-tooltip>
            </div>
            <moneyTypePop :data="moneyType" :init="moneyTypeName" @checkCell="getCell"
                          @clear="clearMoneyType"></moneyTypePop>
          </div>
          <div class="input-group col" :class="[inputPerson?'active-360':'']">
            <label class="form-label no-width f14 margin-bottom-base">收付对象</label>
            <div class="flex-box">
              <el-select size="small" class="w200" v-model="form.objType" placeholder="请选择"
                         @change="getOption(form.objType,1)">
                <el-option
                  v-for="item in dropdown"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <input type="text" size="small" class="w140 el-input__inner person" placeholder="请输入" maxlength="20"
                     v-model.trim="form.objName" @input="inputOnly('normal')" v-if="inputPerson">
            </div>
          </div>
          <div class="input-group col active-400">
            <label class="form-label no-width f14 margin-bottom-base">收款人:</label>
            <div class="flex-box w400" v-if="inObjPerson">
              <select-tree v-if="firstCreate.state" :data="DepList" :init="form.deptName" @checkCell="handleNodeClick"
                           @clear="clearSelect('dep')" @search="searchDep" key="other"></select-tree>
              <div class="h32" :class="[!firstCreate.state?'no-min':'']" v-else>{{firstCreate.content.storeName}}</div>
              <el-select :clearable="true" ref="employe" v-loadmore="moreEmploye" class="margin-left" size="small"
                         v-model="form.employeeId" placeholder="请选择" @clear="clearSelect('emp')" @focus="employeInfo=false"
                         @change="getOption(form.employeeId,2)">
                <el-option :label="form.employeeName" :value="form.employeeId" v-if="employeInfo"></el-option>
                <el-option
                  v-for="(item,index) in EmployeList"
                  :key="index"
                  :label="item.name"
                  :value="item.empId">
                </el-option>
              </el-select>
            </div>
            <!--<div class="h32" v-else>{{dep.name}}-{{form.inObj}}</div>-->
          </div>
        </li>
        <li>
          <div class="input-group col no-max">
            <div class="flex-box tool-tip no-max">
              <label class="form-label no-width f14 margin-bottom-base">{{receiptType|typeFormatter}}（元）</label><span>{{form.amount|formatChinese}}</span>
            </div>
            <input type="text" size="small" class="w430 el-input__inner" placeholder="请输入" v-model="form.amount"
                   @input="cutNum(1)">
          </div>
          <div class="input-group col">
            <label class="form-label no-width f14 margin-bottom-base">结款时间</label>
            <el-date-picker
              class="w400"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="form.closingDate"
              type="datetime"
              @change="checkDate"
              placeholder="选择日期时间">
            </el-date-picker>
          </div>
        </li>
      </ul>
      <section>
        <p class="txt-title">其他信息</p>
        <div class="col-other other-message">
          <div class="input-group">
            <p><label class="f14">备注信息</label></p>
            <el-input v-model="form.remark" class="info-textarea"
                      :class="[form.remark&&form.remark.length>0?'':'scroll-hidden']" placeholder="请填写备注信息" rows="5"
                      maxlength="200" type="textarea"></el-input>
          </div>
        </div>
      </section>
    </div>
    <p>
      <el-button class="btn-info" round size="small" @click="goCancel">取消</el-button>
      <el-button class="btn-info" round size="small" type="primary" @click="goResult('postJSON')"
                 v-loading.fullscreen.lock="fullscreenLoading">{{!!$route.query.edit?"提交":"创建"}}收款信息
      </el-button>
    </p>
    <checkPerson :show="checkPerson.state" page="list" :bizCode="checkPerson.code" :flowType="checkPerson.flowType" @submit="personChose" @close="personChose" v-if="checkPerson.state"></checkPerson>
  </div>
</template>

<script>
  import {MIXINS} from "@/assets/js/mixins";
  import moneyTypePop from '@/components/moneyTypePop';
  import checkPerson from '@/components/checkPerson';

  const rule = {
    moneyType: {
      name: '款类',
    },
    objType: {
      name: '收付对象',
      type: 'negativeNum'
    },
    objName: {
      name: '收付对象',
    },
    employeeId: {
      name: '收款人',
    },
    amount: {
      name: '佣金',
      type: 'money'
    },
    closingDate: {
      name: '结款时间'
    }
  }

  export default {
    mixins: [MIXINS],
    components: {
      moneyTypePop,
      checkPerson
    },
    data() {
      return {
        checkPerson: {//审核人弹窗配置
          state:false,
          type:3,
          code:'',
          flowType:1,//流程类型，本页面为定值
        },
        payId:2,//收款编号
        inputPerson: false,//是否显示第三方输入框
        receiptType:1,//创建收款的导航类型,1新房收款 2长租收款 3金融收款
        form: {
          contId: '',
          moneyType: '',
          moneyTypePid:'',
          remark: '',
          amount: '',
          closingDate: '',
          deptId:'',
          deptName:'',
          employeeName:'',
          employeeId:'',
          objName:'',
          objType:'',
        },
        moneyType: [],
        moneyTypeName: '',
        dropdown: [],//收付对象list
        employeInfo: true,
        employePage: 1,
        fullscreenLoading: false,//提交表单防抖
        showAmount: false,//款类是否为代收代付
        inObjPerson: true,//收款人是否可选
        firstCreate: {
          state: true,
          content: {}
        },//合同是否第一次创建
      }
    },
    mounted() {
      let urlParam=this.$route.query
      this.receiptType= urlParam?Number(urlParam.type):1
      this.form.contId = urlParam.contId ? parseInt(urlParam.contId) : ''

      let contractName={
        1:{name:'新房',type:'xf'},
        2:{name:'长租',type:'cz'},
        3:{name:'金融',type:'jr'}
      }
      let arr;

      // this.getMoneyType()
      // this.getDictionary()

      this.addInit(this.$route.query.contId)
      if(urlParam.edit){
        this.payId=Number(urlParam.id)
        this.getDetailsData()
        arr=this.$tool.getRouter([contractName[this.receiptType].name,'财务','收款审核'],`/receiptCheck?type=${contractName[this.receiptType].type}`);
        arr.push({name:'编辑收款',path:this.$route.fullPath});
      }else {
        arr=this.$tool.getRouter([contractName[this.receiptType].name,'合同','合同列表'],`/otherContractList?type=${contractName[this.receiptType].type}`)
        arr.push({name:'创建收款',path:this.$route.fullPath});
      }
      this.setPath(arr);
    },
    methods: {
        checkDate:function(val){
            // debugger
            let date=new Date(val);
            if(date.getTime()>Date.now()){
                this.form.closingDate=''
                this.$message({
                    message:'不能选择未来时间'
                })
            }
        },
      //判断用户该合同是否第一次选择收款人部门
      addInit: function (id) {
        this.$ajax.get('/api/payInfoRecord/toInsert', {contId: id}).then(res => {
          res = res.data
          if (res.status === 200) {
            this.firstCreate.content = Object.assign({}, res.data.payee,res.data.contCommission)
            this.dropdown = res.data.dropDown
            this.moneyType=res.data.moneyTypes
            if (!res.data.payee.firstCreate) {
              this.firstCreate.state = false
              this.getEmploye(res.data.payee.storeId)
              this.form=Object.assign(this.form,{deptId:res.data.payee.storeId,deptName:res.data.payee.storeName})
            } else {
              // console.log(this.getUser)
              this.firstCreate.state = true

              this.form.deptId = this.getUser.user.depId
              this.form.deptName = this.getUser.user.depName
              this.getEmploye(this.getUser.user.depId)
              this.form.employeeId = this.getUser.user.empId
              this.form.employeeName = this.getUser.user.name
            }
          }
        })
      },
      inputOnly: function (type, index) {//输入框限制
        this.form.objName = this.$tool.textInput(this.form.objName)
      },
      searchDep: function (payload) {
        this.form.inObjId = ''
        this.clearSelect('emp')
      },
      //收款人下拉选项操作
      clearSelect: function (type = 'dep') {
        if (type === 'dep') {
          this.form.deptName = ''
          this.EmployeList = []
          this.form.employeeId = ''
          this.form.employeeName = ''
          this.employePage = 1
        } else {
          this.form.employeeName = ''
        }
      },
      //收款人选择部门
      handleNodeClick(data) {
        this.getEmploye(data.depId, 1, false)
        this.clearSelect()
        this.form.deptId = data.depId
        this.form.deptName = data.name
      },
      /**
       * 获取所有款类
       */
      getMoneyType: function () {
        let param = {}
        if (this.$route.query.edit) {
          param.payId = this.$route.query.id
        }
        this.$ajax.get('/api/payInfo/selectMoneyType', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.moneyType = this.moneyType.concat(res.data)
          }
        })
      },
      //取消
      goCancel: function () {
        this.$confirm('是否取消当前操作', {closeOnClickModal: false}).then(() => {
          this.$router.go(-1)
        }).catch(() => {

        })
      },
      /**
       * 创建收款操作
       */
      goResult: function (type,url='/payInfoRecord/insertSKRecord') {
        let editUrl={
          1:'/payInfoRecord/updateXFSKRecord',
          2:'/payInfoRecord/updateCZSKRecord',
          3:'/payInfoRecord/updateJRSKRecord'
        }
        if(this.$route.query.edit){
          type='put';
          url=editUrl[this.receiptType];
        }
        this.fullscreenLoading=true
        let param = Object.assign({}, this.form)
        if(!param.closingDate){
          param.closingDate=''
        }
        this.$tool.checkForm(param,rule).then(res=>{
          this.$ajax[type](`/api${url}`,param).then(res=>{
            res = res.data
            if (res.status === 200) {
              this.fullscreenLoading=false
              this.$router.replace({
                path: 'receiptCheck',
                query:{
                  type:this.receiptType===1?"xf":this.receiptType===2?"cz":this.receiptType===3?"jr":"xf",
                }
              })
            }
          }).catch(error=>{
            this.fullscreenLoading=false
            if(error.message==='下一节点审批人不存在'){//设置下一节点审核人
              this.checkPerson=Object.assign(this.checkPerson,{state:true,code:error.data.payCode})
            }else {
              this.$message({
                message:error
              })
            }
          })
        }).catch(error=>{
          this.fullscreenLoading=false
          this.$message({
            message:`${error.title}${error.msg}`
          })
        })
      },
      //监听设置下一节点审核人弹窗操作
      personChose:function () {
        this.checkPerson.state=false
        this.$router.replace({
          path: 'receiptCheck',
          query:{
            type:this.receiptType===1?"xf":this.receiptType===2?"cz":this.receiptType===3?"jr":"xf",
          }
        })
      },
      /**
       * 编辑时获取详情
       */
      getDetailsData: function () {
        let param={payId:this.payId}
        this.$ajax.get('/api/payInfoRecord/getSKDetail',param).then(res=>{
          res=res.data
          if(res.status===200){
            this.form.id=res.data.id
            // this.form.contId=res.data.cid
            this.moneyTypeName=res.data.moneyName

            let {moneyType,moneyTypePid,remark,amount,closingDate,employeeName,employeeId,objName,objType}=res.data
            Object.assign(this.form,{moneyType,moneyTypePid,remark,amount,closingDate:this.$tool.timeFormat(closingDate),employeeName,employeeId,objName,objType:objType.value})

            if(objType.value===3){//自定义收款对象
              this.inputPerson=true
            }
          }
        })
      },
      /**
       * 款类选择操作
       */
      getCell: function (label) {
        this.form.moneyType = label.key
        this.form.moneyTypePid = label.pId
      },
      clearMoneyType: function () {
        this.form.moneyType = ''
        this.form.moneyTypePid = ''
        this.moneyTypeName = ''
        this.$tool.clearForm(this.amount, true)
      },
      /**
       * 获取下拉框选择对象
       * @param item
       * @param type 1=收付对象;2=选择收款人
       */
      getOption: function (item, type) {
        let obj = {}
        let list = type === 1 ? this.dropdown : this.EmployeList
        list.find(tip => {
          if (tip[type === 1 ? 'value' : 'empId'] === item) {
            if (type === 1) {
              obj.objName = tip.custName
              if (item === 3) {//表示收付对象选择其他项
                this.inputPerson = true
                // obj.objName = this.form.objName
                // this.form.objName
              } else {
                this.inputPerson = false
              }
            } else {
              obj.employeeName = tip.name
            }
            return
          }
        })

        this.form = Object.assign({}, this.form, obj)
      },
      cutNum:function (val) {
        this.form.amount=this.$tool.cutFloat({val:this.form.amount,max:999999999.99})
      },
    },
    filters: {
      typeFormatter(val) {
        let res = ''
        switch (val) {
          case 1:
            res = '返店佣金'
            break;
          case 2:
          case 3:
            res = '佣金'
            break;
          default:
            res='佣金'
        }
        return res;
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";

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

  input[size='small'] {
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
        margin: 0 30px 21px 0;
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
      content: '';
      display: inline-block;
      border: 1px solid @color-B9;
      width: 16px;
      height: 16px;
    }
    &.active {
      &:before {
        content: 'A';
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
    color: #A1A1A1;
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
            content: '';
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
        &:nth-of-type(n+1) {
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
    /deep/ .el-table, .el-textarea {

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
