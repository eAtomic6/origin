<template>
  <el-dialog
    :title="!paperType?'票据详情':'开票信息填写'" :close-on-click-modal="$tool.closeOnClickModal"
    :close-on-press-escape="$tool.closeOnClickModal"
    :visible.sync="paperShow"
    width="1000px"
    class="layer-paper"
    @close="propCloseFn">
    <div>
      <div class="paper-edit-box" v-if="paperType">
        <ul>
          <li>
            <p><label>合同编号:</label><span>{{paperInfoData.contCode}}</span></p>
            <p><label>物业地址:</label><span>{{paperInfoData.address}}</span></p>
          </li>
          <li class="tips-second">
            <p><label>合计金额:</label><span>{{paperInfoData.proceedsAmount}}元</span></p>
            <p>
              <label>交款单位:</label>
              <el-select size="small" class="w200" v-model="form.payerType" placeholder="请选择" @change="getOption">
                <el-option
                  v-for="item in dropdown"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <input type="text" size="small" class="w140 el-input__inner person" placeholder="请输入" maxlength="20" v-model.trim="form.payerName" @input="form.payerName=$tool.textInput(form.payerName)" v-if="form.inputInfo">
            </p>
          </li>
          <li v-for="(item,index) in moneyTypes" :key="index">
            <label class="checkbox-info iconfont" :class="[item.check?'active':'']"
                   @click="item.check=!item.check"></label>
            <div class="type-list">
              <p><label>款类：</label><span>{{item.typeName}}</span></p>
              <p><label>金额：</label><span>{{item.amount}}元</span></p>
              <div class="input-group">
                <label>开票项目：</label>
                <el-select class="w120" size="small" v-model="item.project" placeholder="请选择">
                  <el-option v-for="item in dictionary['542']" :key="item.key" :label="item.value" :value="item.key">
                  </el-option>
                </el-select>
              </div>
              <!-- <p><label class="checkbox-info iconfont" :class="[item.addressHidden?'active':'']" @click="item.addressHidden=!item.addressHidden"></label><span>隐藏物业地址</span></p> -->
              <p><label>票据编号：</label><span>{{item.billCode}}</span></p>
            </div>
          </li>
        </ul>
        <el-button round size="small" class="paper-btn paper-btn-blue paper-btn-float" @click="billing">确定开票</el-button>
      </div>
      <div v-show="FooterShow">
        <div class="paper-watch-tab" v-if="paperType">
          <p>票据预览</p>
          <ul v-if="moneyTypes.length>1">
            <li v-for="(item,index) in moneyTypes" :key="index" :class="[index===activeType?'active':'']"
                @click="activeType=index">{{item.typeName}}
            </li>
          </ul>
        </div>
        <!--<div class="paper-top" v-if="!paperType"></div>-->
        <LayerPrint ref="easyPrint" :morePaper="opera2batch">
          <template v-if="!opera2batch">
            <LayerPaperInfo
              :number="paperInfoData.contCode"
              :name="paperInfoData.payerName"
              :collectionTime="paperInfoData.paymentTime"
              :invoiceTime="paperInfoData.lastPrintTime?getPrint==='all'?`${paperInfoData.lastPrintTime.KHL},${paperInfoData.lastPrintTime.JZL}`:'':''"
              :paper="paperInfoData.billCode"
              :project="getPro"
              :hide="paperInfoData.hide"
              :address="paperInfoData.address"
              :money="paperInfoData.amount"
              :moneyZh="paperInfoData.amountZh"
              :create="paperInfoData.createByName"
              :rules="paperInfoData.remark"
              :imgSrc="imgUrl"
              :time="paperInfoData.printDate"
              :num="paperInfoData.printCount?(getPrint==='all'?`${paperInfoData.printCount.KHL},${paperInfoData.printCount.JZL}`:getPrint==='client'?paperInfoData.printCount.KHL:paperInfoData.printCount.JZL):0"
              :methodAndAmount="paperInfoData.methodAndAmount"
              :storesName="paperInfoData.storeName"
              :printType="printType"
              :paperFail="paperFail"
              :payerType="paperInfoData.payerType"></LayerPaperInfo>
          </template>
          <template v-else>
            <LayerPaperInfo
              v-for="(item,index) in paperList_jzl"
              :key="item.id"
              :number="item.contCode"
              :name="item.payerName"
              :collectionTime="item.paymentTime"
              :invoiceTime="item.createTime"
              :paper="item.billCode"
              :project="item.type"
              :hide="item.hide"
              :address="item.address"
              :money="item.amount"
              :moneyZh="item.amountZh"
              :create="item.createByName"
              :rules="item.remark"
              :imgSrc="imgUrlList[index]"
              :time="item.printDate"
              :num="item.printCount?(getPrint==='client'?item.printCount.KHL:item.printCount.JZL):0"
              :methodAndAmount="item.methodAndAmount"
              :storesName="item.storeName"
              :printType="printType"
              :paperFail="paperFail"
              :payerType="item.payerType"></LayerPaperInfo>
          </template>
        </LayerPrint>
        <!-- :imgSrc="paperInfoData.signImg" -->
      </div>
      <!-- <PdfPrint :url="pdfUrl" ref="pdfPrint"></PdfPrint> -->
      <p class="print-waring" v-if="FooterShow&&printType!=='all'">温馨提示：打印时，请选择谷歌浏览器</p>
    </div>
    <p slot="footer" v-show="FooterShow&&printType!=='all'">
      <el-button round size="small" class="paper-btn" @click="propCloseFn">取消</el-button>
      <el-button round size="small" class="paper-btn paper-btn-blue" @click="printPaper" v-if="!stateBoll">打印
      </el-button>
    </p>
  </el-dialog>
</template>

<script>
  import LayerPaperInfo from '@/components/LayerPaperInfo';
  import LayerPrint from '@/components/LayerPrint';
  // import vueEasyPrint from "vue-easy-print";
  import {MIXINS} from "@/assets/js/mixins";
  import {Loading} from 'element-ui';

  export default {
    props: {
      printType: {
        type: String,
        default: 'client'
      },
      contId:{
        type:[Number,String],
        default:''
      }
    },
    mixins: [MIXINS],
    data() {
      return {
        dictionary: {
          '542': '',
        },
        FooterShow: false,//详情底部操作按钮栏是否显示
        ID: '',//contId
        paperShow: false,
        paperType: false, //false详情打印 true开票
        paperInfoData: {}, //票据对象
        moneyTypes: [], //临时存放勾选的款类
        activeType: 0, //当前预览项
        imgUrl: '',
        imgUrlList:[],//批量打印记账联时签章图片集合
        stateBoll: false,
        layerLoading: '',
        paperFail:false,//票据详情作废icon是否显示
        opera2batch:false,//是否批量打印记账联
        paperList_jzl:[],//批量记账联数组集合
        paperList_jzl_common:[],//批量记账联数组集合code字段抽取
        form:{
          payerType:'',
          payerName:'',
          inputInfo:false
        },//交款单位
        dropdown:[],//交款单位下拉
      }
    },
    methods: {
      // 图片请求
      getImgFn(url,batch=false) {
        if(batch){
          this.$ajax.put('/api/load/generateAccessURLBatch',{urls:url},2).then(res=>{
            res=res.data
            if(res.status===200){
              this.imgUrlList=[].concat(res.data)
            }
          })
          return
        }
        if (!!url) {
          url = url.split('?')[0];
          this.$ajax.get('/api/load/generateAccessURL', {
            url
          }).then(res => {
            res = res.data;
            if (res.status === 200) {
              this.imgUrl = res.data.url
            }
          }).catch(err => {
            this.$message.error(err);
          })
        }
      },
      // 弹层关闭
      propCloseFn() {
        this.$tool.clearForm(this.layer)
        this.paperShow = false
        this.opera2batch=false
        this.moneyTypes=[]
        this.paperList_jzl=[]
        this.paperList_jzl_common=[]
        this.form=Object.assign({},{
          payerType:'',
          payerName:'',
          inputInfo:false
        })
        // this.$emit('closePrintModel')
      },
      /**
       * 获取交款单位下拉框数据
       */
      getDropdown: function () {
        let param = {
          contId: this.getContId
        }
        this.$ajax.get('/api/payInfo/selectValue', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.dropdown = res.data
          }
        })
      },
      getOption:function (tip) {
        this.form.inputInfo=false
        this.dropdown.find(item=>{
          if(item.value===tip){
            this.form.payerName=item.custName
            tip===3&&(this.form.inputInfo=true)
          }
        })
        /*this.paperInfoData=Object.assign({},this.paperInfoData,{
          payerName:this.form.payerName,
          payerType:this.form.payerType===1?'客户':this.form.payerType===2?'业主':'其他'})*/
      },
      /**
       * 票据详情
       * id票据id
       */
      getPaperDetails: function (id) {
        this.$ajax.get(`/api/bills/details`, {
          id
        }).then(res => {
          res = res.data
          if (res.status === 200) {
            let hide;
            if (res.data.isHiddenAddress) {
              hide = true;
            } else {
              hide = false;
            }
            this.paperInfoData = Object.assign({}, res.data, {
              hide
            })
            /*types.forEach(item=>{
              if(item.list.includes(this.paperInfoData.type)){
                this.paperInfoData.type=item.name
              }
            })*/
            // this.paperShow = true
            this.layerLoading.close();
            this.paperShow = true;
            this.FooterShow = true;
            // this.printPaper();
          }
        }).catch(err => {
          this.$message.error(err);
          this.layerLoading.close();
        })
      },
      billing: function () {
        if (this.moneyTypes.length === 0) {
          this.$message.error('无法开票');
          return false
        }
        if(!this.form.payerName){
          this.$message.error('请选择或输入交款单位');
          return false
        }
        if (!this.moneyTypes[this.activeType].project) {
          this.$message.error('请选择开票项目');
          return false
        }
        if (this.moneyTypes[this.activeType].check) {
          this.FooterShow = true
        } else {
          this.FooterShow = false
          this.$message.error('请勾选款类');
          return false
        }
        let param = this.moneyTypes[this.activeType]
        let obj = {
          createTime: '',
          billCode: param.billCode,
          hide: param.addressHidden,
          amount: param.amount,
          amountZh: param.amountZh,
          createByName: this.paperInfoData.createBy,
          remark: param.remark
        }
        this.dictionary['542'].find(item => {
          if (item.key === param.project) {
            obj.type = item.value
          }
        })
        this.paperInfoData = Object.assign({}, this.paperInfoData, obj, {
          createTime: this.$tool.dateFormat(new Date()),
          payerName:this.form.payerName,
          payerType:this.form.payerType===1?'客户':this.form.payerType===2?'业主':'其他'
        })
        // this.printPaper();
      },
      // 票据详情 打印
      printPaper() {
        if(this.paperType&&!this.form.payerName){//开票时判断是否选择单位
          this.$message.error('请选择或输入交款单位');
          return false
        }
        this.layerLoading = Loading.service({});
        let obj = {}
        if (!this.paperType) {//详情打印
          obj = {
            code: this.paperInfoData.billCode,
            isPrint: true
          }
          if(this.opera2batch){
            delete obj.code
            obj.codes=this.paperList_jzl_common.join(',')
          }
        } else {//开票打印
          let type = this.moneyTypes[this.activeType]
          let bool = 0;
          if (type.addressHidden) {
            bool = 1;
          }
          obj = {
            code: type.billCode,
            payId: this.ID,
            payDetailsId: type.payDetailsId,
            isHiddenAddress: bool,
            billType: type.project,
            isPrint: true,
            payerType:this.form.payerType,
            payerName:this.form.payerName
          }
        }
        obj.printType=this.getPrint === 'client' ? 1 : 2
        if(this.opera2batch){

        }else{
          if (!this.paperInfoData.signImg) {
            this.layerLoading.close();
            this.$message.error('请先设置财务专用电子签章');
            return false
          }
        }
        this.$ajax.post(this.getPrint==='client'?'/api/bills/print':this.opera2batch?'/api/bills/batchPrintTally':'/api/bills/printTally', obj).then(res => {
          res = res.data
          if (res.status === 200) {
            let obj = {};
            if (res.data.printTimes || res.data.printDate) {
              obj = res.data;
            }
            this.paperInfoData = {
              ...this.paperInfoData,
              ...obj
            }
            this.$nextTick(() => {
              this.$emit("emitPaperSet");
              let that = this;
              this.$refs.easyPrint.print(() => {
                // setTimeout(()=>{
                that.layerLoading.close();
                that.paperShow = false;
                // },101);
              });

            })
          }
        }).catch(err => {
          this.$message.error(err)
          this.layerLoading.close();
        })
      },
      // 获取开票列表
      paperList: function () {
        this.$ajax.get('/api/bills/tobe', {id: this.ID}).then(res => {
          res = res.data
          if (res.status === 200) {
            this.paperInfoData = Object.assign({}, res.data)
            let obj = JSON.parse(JSON.stringify(res.data))
            this.moneyTypes = [].concat(obj.list)
            this.moneyTypes.forEach((item, index) => {
              let obj = Object.assign({
                check: true,
                addressHidden: false,
                project: ''
              }, item)
              this.moneyTypes.splice(index, 1, obj)
            })
            this.layerLoading.close();
            if (this.moneyTypes.length > 0) {
              this.paperShow = true;
            }
          }
        }).catch(err => {
          this.$message.error(err);
          this.layerLoading.close();
        })
      },
      // 打开
      show(id, bool = false, stateBoll=1) {
        this.layerLoading = Loading.service({});
        this.paperType = bool;
        // this.paperShow = true;
        this.FooterShow = false;
        this.stateBoll = [3,4,5].includes(stateBoll)?true:false;
        this.paperFail = this.stateBoll//票据状态4已作废时，显示icon
        this.pdfUrl = "";
        this.ID = id
        //判断是开票或票据详情预览
        if (bool) {
          this.paperList();
          this.contId&&this.getDropdown()
        } else {
          this.getPaperDetails(id);
        }
      },
      //批量打印记账联
      batchOperation:function (id) {
        this.$ajax.get('/api/bills/batchDetails',{id}).then(res=>{
          res=res.data
          if(res.status===200){
            this.opera2batch=true
            this.paperShow=true
            this.FooterShow=true
            this.paperList_jzl=[].concat(res.data)
            let arr=[]
            this.paperList_jzl.forEach(item=>{
              let {billCode}=item
              arr.push(item.signImg.split('?')[0])
              this.paperList_jzl_common.push(billCode)
              let hide=false
              if(item.isHiddenAddress){
                hide=true
              }
              item.hide=hide
            })
            this.getImgFn(arr.join(','),true)
          }
        }).catch(error=>{
          if(error.includes('服务端操作失败')){
            this.$message({
              message:error
            })
          }else{
            let codes=[]
            let msg=JSON.parse(error)
            msg.forEach(item=>{
              codes.push(item.code)
            })
            this.$message({
              message:`票据${codes.join('，')}的门店签章获取失败`
            })
          }
        })
      }
    },
    components: {
      LayerPaperInfo,
      // vueEasyPrint,
      LayerPrint
    },
    mounted() {
      // 枚举类型数据获取
      this.getDictionary();
    },
    computed: {
      getPro: function () {
        let types = [
          {
            name: '服务费',
            list: [1, 2, 3, 4, 5]
          },
          {
            name: '违约服务费',
            list: [6]
          },
          {
            name: '房款',
            list: [7]
          },
          {
            name: '物业保证金',
            list: [8]
          },
          {
            name: '定金',
            list: [9]
          },
          {
            name: '意向金',
            list: [10]
          },
          {
            name: '刷卡手续费',
            list: [11]
          },
        ]
        let tips = types.findIndex(item => {
          if (this.moneyTypes.length > 0 && item.list.includes(this.moneyTypes[this.activeType].project)) {
            return item
          }
        })
        if (tips > -1) {//开票时，款类取勾选项
          return types[tips].name
        } else {//详情时取票据详情对象的type字段
          return this.paperInfoData.type
        }
      },
      getPrint: function () {
        return this.printType
      },
      getContId:function () {
        return this.contId
      }
    },
    watch: {
      paperInfoData(n, old) {
        this.getImgFn(n.signImg)
      },
      getContId:function (val) {
        if(this.paperType){
          this.getDropdown()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/common.less";
  input[size='small']{
    height: 32px;
  }
  input.person{
    margin-left: @margin-10;
  }
  .print-waring{
    float: left;
    padding: 15px 0 0 70px;
    color: red;
  }

  .layer-paper{
    /deep/.el-dialog{
      margin-top: 50px !important;
    }
  }
  // 按钮
  .paper-btn {
    width: 100px;
    text-align: center;
  }

  .paper-btn-blue {
    background-color: @color-blue;
    border-color: @color-blue;
    color: #fff;
  }

  // 开票信息填写
  .layer-mesage {
    .cl-1 {
      color: #6C7986;
      margin-right: 8px;
    }

    .cl-2 {
      color: #233241;
    }

    .ul {
      overflow: hidden;
      padding: 0 40px;

      > li {
        float: left;
        color: #233241;
        padding-top: 20px;
      }

      .w-150 {
        width: 140px;
        padding-right: 10px;
        display: inline-block;
      }

      .w-600 {
        width: 600px;
        display: inline-block;
      }

      .cl-1 {
        float: left;
      }
    }

    .ul-mesage {
      padding: 10px 40px 0;

      > li {
        padding-top: 18px;
        line-height: 32px;
      }

      .w150 {
        width: 150px;
      }
    }

    .sure-btn {
      text-align: right;
      padding: 30px 20px 0 0;
    }
  }

  .paper-top {
    padding-top: 20px;

  }

  // 开票预览
  .preview {
    margin: 22px 55px 0;
    border-top: 1px solid #D8D8D8;

    .preview-tit {
      font-size: 24px;
      font-weight: 400;
      color: #478DE3;
      padding-top: 36px;
      text-align: center;
    }

    .preview-ul {
      text-align: center;
      padding-top: 32px;

      > ul {
        line-height: 32px;
        border: 2px solid #478DE3;
        display: inline-block;
        border-radius: 18px;
        overflow: hidden;

        > li {
          width: 100px;
          text-align: center;
          color: #478DE3;
          cursor: pointer;
          float: left;

          &.on {
            color: #fff;
            background-color: #478DE3;
          }
        }
      }
    }
  }

  .paper-edit-box {
    margin: 0 40px;
    padding: 20px 0 80px;
    position: relative;

    .paper-btn-float {
      position: absolute;
      right: 0;
      bottom: 20px;
    }

    > ul {
      &:first-of-type {
        > li {
          /*margin-bottom: 10px;*/
          display: flex;
          /*align-items: center;*/
          &.tips-second{
            align-items: center;
            >p:first-of-type{
              margin-top: -4px;
            }
          }
          > label {
            margin-right: 10px;
            margin-top: 7px;
          }

          /*&:first-of-type,
          &:nth-of-type(2) {
            > p {
              &:first-of-type {
                !*width: 200px;*!
                margin-right: 20px;
              }
            }
          }*/
          &:first-of-type{
            display: block;
            overflow: hidden;
          }
          >p{
            float: left;
            margin: 0 10px 10px 0;
            &:last-of-type{
              margin-right: 0px;
            }
          }

          &:last-of-type {
            margin-bottom: 0px;
          }
        }
      }
    }

    .type-list {
      display: flex;
      flex-wrap: wrap;

      > p {
        min-width: 110px;
        margin-right: 20px;
        display: inherit;
        align-items: center;

        > label.checkbox-info {
          margin-right: 10px;
        }

        &:last-child {
          margin-right: 0;
        }
      }

      .input-group {
        margin-bottom: 0;
        margin-right: 20px;
      }
    }
  }

  .paper-watch-tab {
    font-size: 24px;
    border-top: 1px solid @border-D8;

    > p {
      color: @color-blue;
      text-align: center;
      font-weight: bold;
      margin: 32px;
    }

    > ul {
      display: flex;
      justify-content: center;
      margin-bottom: 26px;

      > li {
        border-top: 2px solid @color-blue;
        border-bottom: 2px solid @color-blue;
        min-width: 100px;
        height: 36px;
        display: inherit;
        align-items: center;
        justify-content: center;

        &:first-of-type {
          border-left: 2px solid @color-blue;
          border-top-left-radius: 18px;
          border-bottom-left-radius: 18px;
        }

        &:last-of-type {
          border-right: 2px solid @color-blue;
          border-top-right-radius: 18px;
          border-bottom-right-radius: 18px;
        }

        &.active {
          background-color: @color-blue;
          color: @color-white;
        }
      }
    }
  }

  .checkbox-info {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid @border-e6;

    &.active {
      position: relative;
      color: @color-blue;

      &:after {
        content: '\e65d';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
</style>
