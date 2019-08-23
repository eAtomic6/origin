<template>
  <div class="view">
    <p class="f14 txt-title">付款信息</p>
    <ul class="bill-form">
      <li>
        <div class="input-group col" :class="[inputPerson?'active-360':'']">
          <label class="form-label no-width f14">收款方</label>
          <div class="flex-box">
            <el-select size="small" class="w200" v-model="form.inObjType" placeholder="请选择" @change="getOption">
              <el-option
                v-for="item in dropdown"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <input type="text" size="small" class="w140 el-input__inner person" placeholder="请输入" v-model.trim="form.inObj" maxlength="20" @input="inputOnly(2)" v-if="inputPerson">
          </div>
        </div>
        <div class="input-group col">
          <label class="form-label no-width f14">发起人:</label>
          <p class="text-height" v-if="userMsg&&!inObjPerson.state">{{userMsg.depName}} - {{userMsg.name}}</p>
          <p class="text-height" v-else>{{inObjPerson.dep}} - {{inObjPerson.emp}}</p>
        </div>
        <div class="input-group col">
          <label class="form-label no-width f14">账户类型</label>
          <div class="flex-box">
            <el-select size="small" class="w200" v-model="form.accountProperties" @change="getAccountType" placeholder="请选择">
              <el-option
                v-for="item in bankType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </li>
      <li>

        <div class="input-group col">
          <div class="flex-box tool-tip">
            <label class="form-label no-width f14">
              <span>款类</span>
            </label>
            <el-tooltip content="当未找到需要的款类时，可联系管理员进行配置" placement="top">
              <p class="tip-message"><i class="iconfont icon-wenhao"></i>填写帮助</p>
            </el-tooltip>
          </div>
          <moneyTypePop :data="moneyType" :init="moneyTypeName" @checkCell="getCell" @clear="clearMoneyType"></moneyTypePop>
        </div>
        <div class="input-group col active-400">
          <div class="flex-box tool-tip no-max">
            <label class="form-label no-width f14">付款金额（元）</label><span>{{form.amount|formatChinese}}</span>
          </div>
          <input type="text" size="small" class="w400 el-input__inner" placeholder="请输入" v-model="form.amount" @input="cutNum">
        </div>
        <div class="input-group col">
          <label class="no-width f14">可支配金额:</label>
          <div class="text-height">
            <p class="no-wrap"><span>款类大类余额：{{amount.balance}}元</span>;<span v-if="showAmount">合同余额：{{amount.contractBalance}}元</span></p>
            <!--<p v-if="showAmount"><span>合同余额：{{amount.contractBalance}}元</span></p>-->
          </div>
        </div>
      </li>
    </ul>
    <!--<section>
      <div class="input-group">
        <label class="form-label no-width f14">收款方</label>
        <el-select size="small" v-model="form.inObjType" placeholder="请选择" @change="getOption">
          <el-option
            v-for="item in dropdown"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="input-group">
        <label class="form-label no-width f14">申请人:</label>
        <p v-if="userMsg">{{userMsg.depName}} - {{userMsg.name}}</p>
      </div>
    </section>-->
    <!--<div class="input-group">
      <label class="form-label f14">款类</label>
      <el-table class="collapse-cell" :span-method="collapse" border :data="moneyType" style="width: 100%"
                header-row-class-name="theader-bg">
        <el-table-column align="center" label="款类（大类）" prop="pName">
          &lt;!&ndash;<template slot-scope="scope">{{s}}</template>&ndash;&gt;
        </el-table-column>
        <el-table-column min-width="100" align="center" label="款类（小类）">
          <template slot-scope="scope">
            <el-radio class="money-type-radio" v-model="form.moneyType" :label="scope.row.key" @change="getType(scope.row)">{{scope.row.name}}</el-radio>
            &lt;!&ndash;<ul>
              <li v-for="item in scope.row.moneyTypes">
                <el-radio class="money-type-radio" v-model="form.moneyType" :label="item.key" @change="getType(scope.row)">{{item.name}}</el-radio>
              </li>
            </ul>&ndash;&gt;
          </template>
        </el-table-column>
        <el-table-column align="center" label="付款金额（元） ">
          <template slot-scope="scope">
            <input type="text" class="no-style" placeholder="请输入" v-focus v-model="form.smallAmount" @input="cutNum" v-if="form.moneyType===scope.row.key">
            <span v-else @click="getType(scope.row,'focus')">请输入</span>
            &lt;!&ndash;<ul>
              <li v-for="(item,index) in scope.row.moneyTypes">
                <input type="text" class="no-style" placeholder="请输入" v-focus v-model="form.smallAmount" @input="cutNum" v-if="form.moneyType===item.key">
                <span v-else @click="getType(scope.row,'focus',index)">请输入</span>
              </li>
            </ul>&ndash;&gt;
          </template>
        </el-table-column>
        <el-table-column align="center" label="金额大写">
          <template slot-scope="scope">
            <span>{{form.smallAmount|formatChinese}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="100" align="center" label="可支配金额">
          <template slot-scope="scope">
            <div v-if="amount" style="margin: 0 10px;">
              <p><span>款类大类余额：{{amount.balance}}元</span></p>
              <p v-if="showAmount"><span>合同余额：{{amount.contractBalance}}元</span></p>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>-->
    <div class="input-group col-other">
      <p class="txt-title"><label class="form-label f14">收款账户</label></p>
      <el-table border :data="list" style="width: 100%" header-row-class-name="theader-bg">
        <el-table-column align="center" label="开户名">
          <template slot-scope="scope">
            <input type="text" class="no-style" placeholder="请输入" v-model.trim="scope.row.userName" @input="inputOnly(1)">
          </template>
        </el-table-column>
        <el-table-column align="center" label="银行卡号">
          <template slot-scope="scope">
            <input type="text" class="no-style" placeholder="请输入" maxlength="20" v-model="scope.row.cardNumber" @input="getBank(scope.row)">
          </template>
        </el-table-column>
        <el-table-column align="center" label="银行">
          <template slot-scope="scope">
            <!--<span>{{scope.row.bankName|formatNull}}</span>-->
            <span v-if="form.accountProperties===0">{{scope.row.bankName|formatNull}}</span>
            <el-select size="small" v-model="scope.row.bankName" placeholder="请选择" filterable v-else>
              <el-option
                v-for="item in adminBanks"
                :key="item.id"
                :label="item.bankName"
                :value="item.bankName">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="支行" v-if="form.accountProperties===1">
          <template slot-scope="scope">
            <input type="text" class="no-style" placeholder="请输入" v-model.trim="scope.row.bankBranch" @input="inputOnly(3)" @blur="bankCheck">
          </template>
        </el-table-column>
        <el-table-column align="center" label="金额（元）">
          <template slot-scope="scope">
            <span>{{form.amount}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="other-message">
      <p class="txt-title">其他信息</p>
      <section class="flex-row">
        <div class="input-group col-other">
          <p><label class="f14">备注信息</label></p>
          <el-input placeholder="请填写备注信息" class="info-textarea" :class="[form.remark&&form.remark.length>0?'':'scroll-hidden']" type="textarea" rows="5" maxlength="200" v-model="form.remark"></el-input>
        </div>
        <div class="input-group col-other">
          <p><label class="form-label f14">付款凭证</label><span>（凭证类型：买卖交易合同、收据、租赁合同、解约协议、定金协议、意向金协议）</span></p>
          <ul class="upload-list">
            <li>
              <file-up class="upload-context" @getUrl="getFiles" :scane="uploadScane">
                <i class="iconfont icon-shangchuan"></i>
                <span>点击上传</span>
              </file-up>
            </li>
            <li v-for="(item,index) in imgList" :key="index" @mouseenter="activeLi=index" @mouseleave="activeLi=''" @click="previewPhoto(imgList,index)">
              <upload-cell :type="item.type"></upload-cell>
              <el-tooltip :content="item.name" placement="top">
                <div class="span">{{item.name}}</div>
              </el-tooltip>
              <p v-show="activeLi===index" @click.stop="delFile"><i class="iconfont icon-tubiao-6"></i></p>
            </li>
          </ul>
          <!--<p class="upload-text"><span>点击可上传图片附件或拖动图片到此处以上传附件</span>（买卖交易合同、收据、租赁合同、解约协议、定金协议、意向金协议）</p>-->
        </div>
      </section>
    </div>
    <p>
      <el-button class="btn-info" round size="small" type="primary" @click="showLayer">提交付款申请</el-button>
      <el-button class="btn-info" round size="small" @click="goCancel">取消</el-button>
    </p>
    <preview :imgList="previewFiles" :start="previewIndex" v-if="preview" @close="preview=false"></preview>
    <el-dialog
      title="付款信息确认"
      :visible.sync="layer.show"
      :closeOnClickModal="$tool.closeOnClickModal"
      width="740px">
      <div class="check-dialog">
        <p>付款信息</p>
        <el-table border :data="layer.content" style="width: 100%" header-row-class-name="theader-bg" key="layer-table-first">
          <el-table-column align="center" label="合同编号" prop="code"></el-table-column>
          <el-table-column align="center" min-width="120" label="物业地址" prop="address"></el-table-column>
          <el-table-column align="center" min-width="120" label="收款方" prop="inObj"></el-table-column>
          <el-table-column align="center" min-width="120" label="付款时间">
            <template slot-scope="scope">
              <span>-</span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="120" label="发起人">
            <template slot-scope="scope">
              <span>{{userMsg.depName}} - {{userMsg.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="款类" prop="moneyType"></el-table-column>
        </el-table>
        <p>收款账户</p>
        <el-table border :data="list" style="width: 100%" header-row-class-name="theader-bg" key="layer-table-second">
          <el-table-column align="center" label="户名" prop="userName"></el-table-column>
          <el-table-column align="center" label="银行卡号 " prop="cardNumber"></el-table-column>
          <el-table-column align="center" label="银行" prop="bankName"></el-table-column>
          <el-table-column align="center" label="支行" prop="bankBranch" v-if="form.accountProperties===1"></el-table-column>
          <el-table-column align="center" label="金额（元）">
            <template slot-scope="scope">
              <span>{{form.amount}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button size="small" class="btn-info" round @click="layer.show = false">返 回</el-button>
    <el-button size="small" class="btn-info" round type="primary" @click="goResult" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {UPLOAD} from "@/assets/js/uploadMixins";
  import {MIXINS} from "@/assets/js/mixins";
  import moneyTypePop from '@/components/moneyTypePop'

  const rule={
    inObj:{
      name:'收款方',
    },
    moneyType:{
      name:'款类',
    },
    amount:{
      name:'付款金额',
      type:'money'
    },
    userName:{
      name:'开户名',
    },
    cardNumber:{
      name:'银行卡号',
      type:'bankCard'
    },
    bankName:{
      name:'银行'
    },
    filePath:{
      name:'付款凭证',
    },
  }

  export default {
    mixins: [UPLOAD,MIXINS],
    components:{
      moneyTypePop,
    },
    data() {
      return {
        inputPerson:false,//是否显示第三方输入
        form: {
          contId:'',
          remark:'',
          inObj:'',
          inObjId:'',
          inObjType:'',
          moneyType:'',
          moneyTypePid:'',
          amount:'',
          accountProperties:1
        },
        moneyType: [],
        moneyTypeName: '',
        list:[
          {
            bankName:'',
            bankBranch:'',
            bankCode:'',
            userName:'',
            cardNumber:'',
            amount:''
          }
        ],
        dropdown:[],
        amount:{
          balance:0,
          contractBalance:0
        },
        files:[],
        imgList:[],
        activeLi:'',
        collapseRow:{
          total:0,
          row:[]
        },
        showAmount:true,//是否显示合同余额
        fullscreenLoading:false,//创建按钮防抖
        //弹窗
        layer:{
          show:false,
          content:[
            {
              moneyType:'',
              inObj:'',
              code:'',
              address:''
            }
          ],
          form:{}
        },
        //发起人信息
        inObjPerson:{
          dep:'',
          emp:'',
          state:false
        },
        bankType:[
          {
            label:'个人账户',
            value:0
          },
          {
            label:'企业账户',
            value:1
          }
        ],
        adminBanks:[],
        uploadScane:{path:'fk',id:''},//上传场景值
      }
    },
    created(){
      let query=this.$route.query
      this.form.contId = this.$route.query.contId?parseInt(this.$route.query.contId):''
      this.layer.content[0]=Object.assign(this.layer.content[0],query)
      this.getDropdown()
      this.getMoneyType()
      this.getAdmin()
      this.getBanks()

      let type = this.$route.query.edit
      if (type) {
        this.inObjPerson.state=true
        this.getDetails({type: type, payId: this.$route.query.id})
      }
      if(query.code){
        this.uploadScane.id=query.code
      }
    },
    methods:{
      bankCheck:function () {
        let regx = /[\u4E00-\u9FA5]/g
        let arr = []
        if(this.list[0].bankBranch.length>0){
          arr = this.list[0].bankBranch.match(regx)
        }
        if(!arr){
          this.$message({
            message:'支行名称必须带有中文'
          })
          return false
        }else {
          return true
        }
      },
      /**
       * 获取银行列表
       */
      getBanks:function () {
        this.$ajax.get('/api/system/selectBankName').then(res=>{
          res=res.data
          if(res.status===200){
            this.adminBanks=res.data
          }
        }).catch(error=>{

        })
      },
      /**
       * 户名输入，只能输入中文、英文
       */
      inputOnly:function (type) {
        if(type===2){
          this.form.inObj=this.$tool.textInput(this.form.inObj)
        }else if(type===1) {
          this.list[0].userName=this.$tool.textInput(this.list[0].userName,3)
        }else if(type===3) {
          this.list[0].bankBranch=this.$tool.textInput(this.list[0].bankBranch,4)
        }
      },
      clearData:function () {
        this.$tool.clearForm(this.form)
        this.$tool.clearForm(this.list[0])
        this.files=[]
        this.imgList=[]
      },
      //金额输入
      cutNum:function () {
        this.form.amount=this.$tool.cutFloat({val:this.form.amount,max:999999999.99})
      },
      /**
       * 修改款单，获取初始数据
       */
      getDetails: function (param) {
        this.$ajax.get('/api/payInfo/selectDetail', param).then(res => {
          res = res.data
          if (res.status === 200) {
            let obj = {
              remark: res.data.remark,
              inObj: res.data.inObjName,
              inObjId: res.data.inObjId,
              inObjType:res.data.inObjType.value,
              moneyType: res.data.moneyType,
              moneyTypePid: res.data.moneyTypePid,
              amount: res.data.amount,
              id: res.data.id
            }
            if(res.data.filePath){
              this.imgList=this.$tool.cutFilePath(JSON.parse(res.data.filePath))
            }
            this.imgList.forEach(item=>{
              this.files.push(`${item.path}?${item.name}`)
            })
            this.inObjPerson = Object.assign(this.inObjPerson,{dep:res.data.store,emp:res.data.createByName})
            this.moneyTypeName = res.data.moneyTypeName
            this.showAmount=res.data.agent?true:false
            this.list = res.data.account
            this.form = Object.assign({}, this.form, obj)
            this.layer.content[0]=Object.assign(this.layer.content[0],{moneyType:res.data.moneyTypeName,inObj:`${res.data.inObjType.label}${obj.inObj?('-'+obj.inObj):''}`})
            this.getAmount()
          }
        })
      },
      /**
       * 获取上传文件
       */
      getFiles:function (payload) {
        this.files=this.files.concat(this.$tool.getFilePath(payload.param))
        this.imgList=this.$tool.cutFilePath(this.files)
      },
      delFile:function () {
        this.imgList.splice(this.activeLi,1)
        this.files.splice(this.activeLi,1)
      },
      /**
       * 获取下拉框数据
       */
      getDropdown:function () {
        let param = {
          contId:this.form.contId
        }
        this.$ajax.get('/api/payInfo/selectValue',param).then(res=>{
          res=res.data
          if(res.status===200){
            this.dropdown = res.data
          }
        })
      },
      /**
       * 获取所有款类
       */
      getMoneyType:function () {
        let param={}
        if(this.$route.query.edit){
          param.payId=this.$route.query.id
        }
        this.$ajax.get('/api/payInfo/selectMoneyType',param).then(res=>{
          res=res.data
          if(res.status===200){
            this.moneyType = res.data
            /*res.data.forEach(item=>{
              this.collapseRow.total=this.collapseRow.total+item.moneyTypes.length
              this.collapseRow.row.push(item.moneyTypes.length)
              item.moneyTypes.forEach(cell=>{
                cell.pId=item.id
                cell.pName=item.name
              })
              this.moneyType = this.moneyType.concat(item.moneyTypes)
            })*/
            /*res.data.forEach((item,index)=>{
              if(item.name==='代收代付'){
                this.moneyType.splice(index,1)
              }
            })*/
          }
        })
      },
      //款类选择
      getType:function (label,type,index) {
        this.showAmount=label.pName!=='佣金'?false:true
        if(type==='focus'){
          // this.form.moneyType=label.moneyTypes[index].key
          this.form.moneyType=label.key
        }
        // this.form.moneyTypePid = label.id
        this.form.moneyTypePid = label.pId
        this.getAmount()
      },
      getCell:function (label) {
        this.showAmount=label.pName!=='佣金'?false:true
        this.form.moneyType=label.key
        this.form.moneyTypePid = label.pId
        this.layer.content[0].moneyType=label.name
        this.getAmount()
      },
      clearMoneyType:function () {
        this.form.moneyType=''
        this.form.moneyTypePid = ''
        this.moneyTypeName = ''
        this.$tool.clearForm(this.amount,true)
      },
      getAmount:function () {
        let param={
          contId:this.form.contId,
          moneyTypePid:this.form.moneyTypePid,
          moneyType:this.form.moneyType
        }
        if(this.$route.query.edit){
          param.payId=this.$route.query.id
          param.flag=1
        }
        this.$ajax.get('/api/payInfo/selectAvailableBalance',param).then(res=>{
          res=res.data
          if(res.status===200){
            this.amount = Object.assign(this.amount,res.data)
          }
        })
      },
      /**
       * 根据卡号获取银行信息
       */
      getBank:function (row) {
        row.cardNumber=this.$tool.numberInput(row.cardNumber)
        let param = {
          cardNumber:row.cardNumber
        }
        if(param.cardNumber.length>=16&&param.cardNumber.length<=20&&this.form.accountProperties===0){
          this.$ajax.get('/api/system/selectBankNameByCard',param).then(res=>{
            res=res.data
            if(res.status===200){
              row.bankName = res.data.bankName?res.data.bankName:''
            }
          })
        }
        if(param.cardNumber.length>20){
          row.cardNumber = row.cardNumber.substr(0,20)
        }
      },
      /**
       * 合并所有行
       */
      collapse:function ({ rowIndex, columnIndex }) {
        if(columnIndex>=3){
          if (rowIndex === 0) {
            return [this.moneyType.length,1]
          } else {
            return [0,0]
          }
        }
        if(columnIndex===0){
          return this.$tool.collapseRow({
            rowIndex:rowIndex,
            rowTotal:this.collapseRow.total,
            collapse:this.collapseRow.row
          })
        }
      },
      /**
       * 获取银行属性
       */
      getAccountType:function (item) {
        if(item===0){
          this.getBank(this.list[0])
          // this.list[0].bankBranch=''
        }
      },
      /**
       * 获取下拉框选择对象
       * @param item
       */
      getOption:function (item) {
        let obj = {
          inObjId:'',
          inObj:''
        }
        this.dropdown.find(tip=>{
          if(tip.value===item&&!!tip.custId){
            obj.inObjId = tip.custId
            obj.inObj = tip.custName
            this.layer.content[0].inObj=tip.label
            return
          }
        })
        if(item===3){
          this.inputPerson=true
        }else {
          this.inputPerson=false
        }
        this.form = Object.assign({},this.form,obj)
      },
      showLayer:function () {
        let param = Object.assign({},this.form)
        this.list[0].amount = param.amount
        param.inAccount = [].concat(this.list)

        let promiseArr=[]
        if(this.form.accountProperties===0){
          promiseArr=[this.$tool.checkForm(param,rule),this.$tool.checkForm(this.list[0],rule)]
        }else {
          let rule_other=JSON.parse(JSON.stringify(rule))
          let obj={
            accountProperties:{
              name:'银行账户属性'
            },
            bankBranch:{
              name:'支行'
            }
          }
          rule_other=Object.assign({},rule_other,obj)
          promiseArr=[this.$tool.checkForm(param,rule_other),this.$tool.checkForm(this.list[0],rule_other)]
        }

        Promise.all(promiseArr).then(res=>{
          if(this.showAmount){
            if(parseFloat(param.amount)>this.amount.balance||parseFloat(param.amount)>this.amount.contractBalance){
              this.$message({
                message:'输入金额不能大于可支配金额'
              })
              return
            }
          }else {
            if(parseFloat(param.amount)>this.amount.balance){
              this.$message({
                message:'输入金额不能大于可支配金额'
              })
              return
            }
          }
          if(!this.bankCheck()){
            return
          }
          if(this.files.length===0){
            this.$message({
              message:'付款凭证不能为空'
            })
          }else {
            this.layer.show=true
            if(this.form.inObjType===3){
              let leng=this.layer.content[0].inObj.split('-').length
              if(leng===1){
                this.layer.content[0].inObj=`${this.layer.content[0].inObj}-${this.form.inObj}`
              }
            }
            if(this.form.accountProperties===1){
              this.adminBanks.find(item=>{
                if(item.bankName===this.list[0].bankName){
                  this.list[0].bankCode=item.bankId
                }
              })
            }else {
              this.list[0].bankBranch=''
              this.list[0].bankCode=''
            }
            param.filePath = [].concat(this.files)
            this.layer.form=Object.assign({},param)
          }
        }).catch(error=>{
          this.$message({
            message:error.title==='银行'?this.form.accountProperties===0?'银行卡号输入有误':'请选择银行':`${error.title}${error.msg}`
          })
        })
      },
      goCancel:function () {
        this.$confirm('是否取消当前操作',{closeOnClickModal:false}).then(()=>{
          this.$router.go(-1)
        }).catch(()=>{

        })
      },
      goResult:function () {
        this.fullscreenLoading=true
        if(this.$route.query.edit){
          // delete param.contId
          this.$ajax.put('/api/payInfo/updatePayMentInfo', this.layer.form).then(res => {
            res = res.data
            if (res.status === 200) {
              this.fullscreenLoading=false
              this.$router.replace({
                path: 'payResult',
                query:{
                  content:(res.data.vo&&res.data.time)?JSON.stringify({dep:res.data.vo.deptName,name:res.data.vo.createByName,time:res.data.time}):'',
                  edit:1
                }
              })
            }
          }).catch(error=>{
            this.fullscreenLoading=false
            this.$message({
              message:error
            })
          })
        }else {
          this.$ajax.postJSON('/api/payInfo/savePayment', this.layer.form).then(res => {
            res = res.data
            this.fullscreenLoading=false
            if (res.status === 200) {
              this.$router.replace({
                path: 'payResult',
                query:{
                  content:(res.data.vo&&res.data.time)?JSON.stringify({dep:res.data.vo.deptName,name:res.data.vo.createByName,time:res.data.time}):''
                }
              })
            }
          }).catch(error=>{
            this.fullscreenLoading=false
            if(error.message==='下一节点审批人不存在'){
              this.$router.replace({
                path: 'payResult',
                query:{
                  content:(error.data.vo&&error.data.time)?JSON.stringify({dep:error.data.vo.deptName,name:error.data.vo.createByName,time:error.data.time,payCode:error.data.payCode,type:error.data.type}):''
                }
              })

            }else {
              this.$message({
                message:error
              })
            }
          })
        }
        /*this.$tool.checkForm(param,rule).then((res)=>{
          if(param.smallAmount>this.amount.balance){
            this.$message({
              message:'输入金额不能大于可支配金额'
            })
            return
          }
          this.$tool.checkForm(this.list[0],rule).then(()=>{
            if(this.files.length===0){
              this.$message({
                message:'付款凭证不能为空'
              })
            }else {
              param.filePath = [].concat(this.files)
              if(this.$route.query.edit){
                delete param.contId
                this.$ajax.put('/api/payInfo/updatePayMentInfo', param).then(res => {
                  res = res.data
                  if (res.status === 200) {
                    this.$message({
                      message:'修改成功'
                    })
                    this.$router.go(-1)
                  }
                }).catch(error=>{
                  this.$message({
                    message:error
                  })
                })
              }else {
                this.$ajax.postJSON('/api/payInfo/savePayment', param).then(res => {
                  res = res.data
                  if (res.status === 200) {
                    this.$router.push({
                      path: 'payResult',
                      query:{
                        content:(res.data.vo&&res.data.time)?JSON.stringify({dep:res.data.vo.deptName,name:res.data.vo.createByName,time:res.data.time}):''
                      }
                    })
                  }
                }).catch(error=>{
                  this.$message({
                    message:error
                  })
                })
              }
            }
          }).catch((error)=>{
            this.$message({
              message:error.title==='刷卡银行'?'银行卡号输入有误':`${error.title}${error.msg}`
            })
          })
        }).catch((error)=>{
          this.$message({
            message:`${error.title}${error.msg}`
          })
        })*/
      }
    },
    watch:{
      list:function (val) {
        if(val.length===0){
          this.list.push({
            bankName:'',
            userName:'',
            cardNumber:'',
            amount:''
          })
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
  .txt-title{
    font-weight: bold;
    margin-bottom: @margin-15;
    font-size: @size-14;
  }
  .no-wrap{
    white-space: nowrap;
  }
  /deep/.info-textarea{
    width: 285px;
    .el-textarea__inner{
      height: 115px;
    }
  }
  input[size='small']{
    height: 32px;
  }
  input.person{
    margin-left: @margin-10;
  }
  .other-message{
    margin-top: 30px;
  }
  .flex-box{
    display: flex;
    &.tool-tip{
      max-width: 200px;
      justify-content: space-between;
      margin-bottom: @margin-10;
    }
    &.no-max{
      max-width: none;
    }
    .tip-message{
      margin-left: @margin-10;
      display: flex;
      align-items: center;
      cursor: pointer;
      >i{
        margin-right: 4px;
        font-size: @size-14;
      }
    }
  }
  .bill-form{
    margin-top: 30px;
    >li{
      display: flex;
      /*max-width: 210px;
      &:last-of-type{
        max-width: none;
      }
      &.active{
        max-width: 360px;
      }*/
      .col{
        max-width: 210px;
        margin: 0 60px 25px 0;
        &.active-360{
          max-width: 360px;
        }
        &.active-400{
          max-width: 400px;
        }
        >label{
          display: block;
          margin-bottom: @margin-10;
        }
        >input{
          height: 32px;
          line-height: 32px;
        }
        .text-height{
          height: 32px;
          line-height: 32px;
        }
      }
    }
  }
  .check-dialog{
    >p{
      margin-bottom: @margin-base;
      &:last-of-type{
        margin-top: @margin-15;
      }
    }
  }
  .col-other{
    >p{
      &:first-of-type{
        margin-bottom: @margin-10;
      }
    }
  }
  section.flex-row{
    display: flex;
    .input-group{
      margin-right: 60px;
    }
  }
  /deep/.collapse-cell{
    .el-table__row{
      >td{
        padding: 0;
        .cell{
          padding: 0 @margin-10;
          >input{
            text-align: center;
          }
          /*padding: 0;
          >ul{
            >li{
              padding: 12px 10px;
              border-bottom: 1px solid #ebeef5;
              text-align: left;
              &:last-of-type{
                border: 0;
              }
            }
          }*/
        }
      }
    }
  }
  .input-group {
    display: block;
    max-width: 980px;
    .type-list{
      display: flex;
      flex-wrap: wrap;
      margin: 20px 0px;
      >li{
        width: 150px;
        padding: 10px;
        box-sizing: border-box;
        text-align: center;
        margin: 0 10px 10px 0;
        border: 1px solid @color-D6;
        color: @color-6c;
        &.active{
          color: @color-blue;
          border-color: @color-blue;
        }
      }
    }
    .span-join{
      display: flex;
      align-items: center;
      justify-content: flex-end;
      max-width: 300px;
      margin: 20px 0;
      padding: 6px 8px;
      border: 1px solid @color-D6;
      border-radius: 4px;
      >input{
        flex: 1;
      }
    }
    .upload-list{
      display: flex;
      flex-wrap: nowrap;
      margin: @margin-base;
      width: 630px;
      overflow-x: auto;
      >li{
        border: 1px dashed @color-D6;
        width: 115px;
        min-width: 115px;
        height: 115px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-right: @margin-10;
        &:last-of-type{
          margin-right: 0;
        }
        .span{
          width: 100px;
          text-align: center;
          /*word-break: break-all;*/
          white-space: nowrap;
          overflow: hidden;
          text-overflow:ellipsis;
        }
        &:first-of-type{
          .iconfont{
            color: @bg-th;
            font-size: 58px;
            position: relative;
            display: flex;
            align-items: center;
            &:before{

            }
          }
        }
        &:nth-of-type(n+1){
          margin-right: @margin-base;
          position: relative;
          >p{
            position: absolute;
            top: 0;
            right: 0;
            color: @color-red;
            .iconfont{
              font-size: 20px;
            }
          }
        }
        /*&:nth-of-type(n+7){
          margin-top: @margin-base;
        }*/
      }
    }
    .upload-text{
      color: @color-99A;
      padding: @margin-base;
      >span{
        &:first-of-type{
          color: @color-blue;
        }
      }
    }
    /deep/ .el-table,.el-textarea{

    }
  }

  .view {
    background-color: @bg-white;
    padding: @margin-10;
    > section {
      margin: @margin-10 0px;
      /*&:first-of-type {
        display: flex;
        .input-group{
          display: flex;
          margin: 0;
          &:first-of-type{
            margin-right: @margin-15;
          }
        }
      }*/
    }
    >p{
      &:last-of-type{
        margin-top: @margin-15;
      }
    }
  }
</style>
