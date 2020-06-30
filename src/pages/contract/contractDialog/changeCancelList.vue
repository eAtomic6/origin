<template>
  <div>
    <el-table :max-height="tableHeight" class="info-scrollbar" :data="tableDate" style="width: 100%" border>
      <el-table-column label="合同信息" label-class-name="pdl" min-width="200" fixed>
        <template slot-scope="scope">
          <div class="contract_msg">
            <div class="riskLabel">
              <el-popover
                placement="top-start"
                width="50"
                trigger="hover"
                content="风险单"
                v-if="scope.row.isRisk">
                <i slot="reference" class="iconfont icon-tubiao_shiyong-1 risk"></i>
              </el-popover>
            </div>
            <ul class="contract-msglist">
              <li>合同：<span @click="toDetail(scope.row)">{{scope.row.code}}</span></li>
              <li v-if="scope.row.houseinfoCode">房源：<span>{{scope.row.houseinfoCode}}</span> {{scope.row.showOwnerName}}</li>
              <li>客源：<span>{{scope.row.guestinfoCode}}</span> {{scope.row.showCustName}}</li>
            </ul>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="合同类型" min-width="60">
        <template slot-scope="scope">
          <span v-if="scope.row.loanType">{{scope.row.loanType===7?"全款买卖":"贷款买卖"}}</span>
          <span v-else>{{scope.row.contType.label}}</span>
        </template>
      </el-table-column>

      <el-table-column label="物业地址" prop="propertyAddr" min-width="160">
        <template slot-scope="scope">
          <span v-if="!scope.row.propertyAddr">-</span>
          <template>
            <p>{{scope.row.propertyAddr.split(' ')[0]}}</p>
            <p>{{scope.row.propertyAddr.split(' ')[1]}}</p>
          </template>
        </template>
      </el-table-column>
      
      <el-table-column label="成交总价" prop="dealPrice" min-width="90">
        <template slot-scope="scope">
          <span>{{scope.row.dealPrice}} 元</span>
          <!-- <span v-for="item in dictionary['507']" :key="item.key" v-if="item.key===scope.row.timeUnit&&scope.row.contType.value===1"> / {{item.value}}</span> -->
        </template>
      </el-table-column>

      <el-table-column label="成交经纪人" min-width="120">
        <template slot-scope="scope">
          <p>{{scope.row.dealAgentStoreName}}</p>
          <p>{{scope.row.dealAgentName}}</p>
        </template>
      </el-table-column>

      <el-table-column label="签约时间" min-width="110">
        <template slot-scope="scope">
          {{scope.row.signDate.substr(0, 16)}}
        </template>
      </el-table-column>

      <el-table-column label="签约方式" prop="recordType.label" min-width="60">
      </el-table-column>

      <el-table-column label="可分配业绩 (元)" min-width="90">
        <template slot-scope="scope">
            <span>{{scope.row.distributableAchievement}}</span>
        </template>
      </el-table-column>

      <el-table-column :label="listType==='bg'?'变更审核状态':'解约审核状态'" min-width="80">
        <template slot-scope="scope">
          <!-- {{scope.row.changeRecord.examineState===0?"审核中":scope.row.changeRecord.examineState===1?"已通过":"已驳回"}} -->
          <span v-if="scope.row.changeRecord.examineState===0" class="yellow">审核中</span>
          <span v-if="scope.row.changeRecord.examineState===1" class="green">已通过</span>
          <span v-if="scope.row.changeRecord.examineState===2" class="red">已驳回</span>
        </template>
      </el-table-column>

      <el-table-column label="审核时间" min-width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.changeRecord.auditTime">{{Number(scope.row.changeRecord.auditTime)|formatTime(false)}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column label="当前审核人" min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.changeRecord.auditId>0&&scope.row.changeRecord.examineState===0">
            <p>{{scope.row.changeRecord.auditStoreName}}</p>
            <p>{{scope.row.changeRecord.auditName}}</p>
          </span>
          <p v-else>-</p>
          <el-button type="text" v-if="getUserMsg&&(scope.row.changeRecord.auditId===getUserMsg.empId||scope.row.changeRecord.preAuditId===getUserMsg.empId)&&scope.row.changeRecord.examineState===0" @click="choseCheckPerson(scope.row,scope.row.changeRecord.preAuditId===getUserMsg.empId?1:2)">{{getUserMsg&&getUserMsg.empId===scope.row.changeRecord.auditId?'转交审核人':'设置审核人'}}</el-button>
        </template>
      </el-table-column>

      <el-table-column label="下一步审核人" min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.changeRecord.nextAuditId>0">
            <p>{{scope.row.changeRecord.nextAuditStoreName}}</p>
            <p>{{scope.row.changeRecord.nextAuditName}}</p>
          </span>
          <p v-else>-</p>
          <el-button type="text" v-if="getUserMsg&&(scope.row.changeRecord.nextAuditId!==0&&scope.row.changeRecord.auditId===getUserMsg.empId&&scope.row.changeRecord.examineState===0)" @click="choseCheckPerson(scope.row,3)" :class="{'error_':scope.row.changeRecord.nextAuditId===0}">设置审核人</el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="90" fixed="right" class-name="null-formatter">
        <template slot-scope="scope">
          <div style="color:red" v-if="scope.row.changeRecord.examineState===0&&scope.row.changeRecord.auditId>0&&getUserMsg&&scope.row.changeRecord.auditId!==getUserMsg.empId">{{scope.row.changeRecord.auditName}}正在审核</div><div class="btn" v-if="scope.row.changeRecord.examineState===0&&((scope.row.changeRecord.auditId===getUserMsg.empId)||((!(scope.row.changeRecord.auditId>0))&&getUserMsg&&scope.row.changeRecord.grabDept==='true'))" @click="goCheck(scope.row)">审核</div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 设置/转交审核人 -->
    <checkPerson
    :show="checkPerson.state"
    page="list"
    :type="checkPerson.type"
    :showLabel="checkPerson.label"
    :bizCode="checkPerson.code"
    :flowType="checkPerson.flowType"
    @close="closeCheckPerson"
    @submit="closeCheckPerson"
    v-if="checkPerson.state">
    </checkPerson>
    <!-- 变更/解约查看 合同主体上传弹窗 -->
    <changeCancel
    :dialogType="getListType"
    :cancelDialog="changeCancel"
    dialogOperation="details"
    :contId="contId"
    :code="contCode"
    :dialogContType="dialogContType"
    @close="ChangeCancelDialog"
    @success="freachChangeCancel"
    v-if="changeCancel">
    </changeCancel>
  </div>
</template>
           
<script>
import { MIXINS } from "@/assets/js/mixins";
import checkPerson from '@/components/checkPerson';
import changeCancel from "../contractDialog/changeCancel";
export default{
  mixins: [MIXINS],
  components: {
    checkPerson,
    changeCancel
  },
  props:{
    tableDate:{
      type: Array,
      default() {
        return []
      }
    },
    tableHeight:{
      type: Number,
      default:0
    },
    listType:{
      type:String,
      default:""
    }
  },
  data(){
    return{
      checkPerson: {
        state:false,
        type:1,
        code:'',
        flowType:this.listType==='bg'?9:10,
        label:false,
      },
      changeCancel:false,
      dialogContType:1,//变更解约弹窗是否是意向定金合同
      contCode:"",
      contId:"",
      commission:"",
      dictionary: {
        //数据字典
        "507": "",
      },
      //权限配置
      power: {
        'sign-ht-info-view': {
          state: false,
          name: '预览'
        },
        'sign-com-htdetail': {
          state: false,
          name: '合同详情'
        },
        "sign-ht-htsh-export": {
          state: false,
          name: '导出'
        },
      }
    }
  },
  created(){
    this.getDictionary();//字典
  },
  methods:{
    choseCheckPerson(row,type) {
      this.checkPerson.code=row.code;
      this.checkPerson.state=true;
      this.checkPerson.type=type;
      if(row.nextAuditId>=0){
        this.checkPerson.label=false;
      }else{
        this.checkPerson.label=true;
      }
    },
    //关闭设置审核人弹窗
    closeCheckPerson(){
      console.log('qweqw')
      this.checkPerson.state=false;
      this.$emit("freach")
    },
    //合同详情
    toDetail(value) {
      if(this.power['sign-com-htdetail'].state){
        if(value.contType.value===1||value.contType.value===2||value.contType.value===3){
          this.$router.push({
            path: "/contractDetails",
            query: {
              id: value.id,//合同id
              code: value.code,//合同编号
              contType: value.contType.value//合同类型
            }
          });
        }else{
          this.$router.push({
            path: "/detailIntention",
            query: {
              id: value.id,
              contType: value.contType.value
            }
          });
        }
      }else{
        this.noPower('合同详情查看')
      }
    },
    //合同审核
    goCheck(item) {
      if(item.contType.value>3){
        this.dialogContType=2
      }else{
        this.dialogContType=1
      }
      let param={
        bizCode:item.code,
        flowType:this.listType==="bg"?9:10
      }
      if(item.changeRecord.auditId===this.getUserMsg.empId){
        this.changeCancel=true
        this.contCode=item.code
        this.contId=item.id
      }else{
        this.$ajax.get('/api/machine/getAuditAuth',param).then(res=>{
          res = res.data
          if(res.status===200){
            this.changeCancel=true
            this.contCode=item.code
            this.contId=item.id
            this.commission={
              owner:item.ownerCommission,
              user:item.custCommission
            }
          }
        }).catch(error=>{
          this.$message({
            message:error,
            type: "error"
          })
        })
      }
      
    },
    //变更解约弹窗
    ChangeCancelDialog(){
      this.changeCancel=false
      this.$emit("freach")
    },
    freachChangeCancel(){
      this.changeCancel=false
      this.$emit("freach")
    }
  },
  computed:{
    fawu:function(){
      let host=window.location.host
      let url = false
      switch (host){
        case "localhost:8080":
        case "sign2.jjw.com:28879":
          url=this.getUserMsg.depId===594||this.getUserMsg.depId===838
              break
        case "sign2.jjw.com":
          url=this.getUserMsg.depId===900||this.getUserMsg.depId===2257
              break
      }
      return url
    },
    getUserMsg(){
      return this.getUser.user
    },
    getListType(){
      return this.listType
    }
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
  }
}
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
/deep/.pdl{
  &.cell{
    padding-left: 30px !important;
  }
}
.contract_msg{
  display: flex;
   align-items: center;
  .riskLabel{
    width: 20px;
    padding-right: 20px;
    color: @color-orange;
    font-size: 18px;
    .risk{
      color: @color-warning;
      position: relative;
      .remarksExamine{
        background: #fff;
        font-size: 14px;
        color: #606266;
        position: absolute;
        left: 0;
        top: 0;
        display: inline-block;
        width: 60px;
      }
    }

  }
  .contract-msglist {
    > li {
      text-align: left;
      &:first-of-type{
        > span{
          color: @color-blue;
          cursor: pointer;
        }
      }
    }
  }
}
.btn {
  color: @color-blue;
  cursor: pointer;
}
/deep/ .el-table th {
  background: @bg-th;
}
/deep/ .null-formatter {
  .cell:empty {
    position: relative;

    &:before {
      content: '--';
      width: 30px;
      display: inline-block;
    }
  }
}
.yellow {
  color: @color-yellow;
}
.green {
  color: @color-green;
}
.red {
  color: @color-warning;
}
</style>