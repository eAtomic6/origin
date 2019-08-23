<!-- 调佣审核 -->
<template>
  <div class="view-container" id="adjustcheck" ref="tableComView">
    <!-- 筛选查询 -->
    <ScreeningTop @propQueryFn="queryFn('search')" @propResetFormFn="resetFormFn" class="adjustbox">
      <el-form :inline="true" :model="adjustForm" class="adjust-form" size="mini" ref="adjustCheckForm">
        <el-form-item label="关键字">
          <el-tooltip effect="dark" content="合同编号/房源编号/客源编号" placement="top">
            <el-input v-model="adjustForm.keyword" style="width:150px" clearable placeholder="请输入"></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="发起日期">
          <el-date-picker v-model="adjustForm.signDate" type="daterange" unlink-panels start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
          </el-date-picker>

        </el-form-item>
        <el-form-item label="合同类型">
          <!-- <el-select v-model="adjustForm.tradeType" placeholder="全部" class="width150" clearable>
            <el-option v-for="item in dictionary['10']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select> -->
          <el-select v-model="adjustForm.contractTypes" multiple placeholder="全部" style="width:200px" :class="{'width300':adjustForm.contractTypes&&adjustForm.contractTypes.length>3}">
            <el-option
              v-for="item in dictionary['10']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合作方式">
          <el-select v-model="adjustForm.depAttr" placeholder="全部" class="width150" clearable>
            <el-option v-for="item in dictionary['53']" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <!-- <el-select v-model="Form.getDepName" clearable filterable remote placeholder="请选择门店" :remote-method="getDepNameFn" @change="changeDepNameFn" :loading="loading" @clear="clearDepNameFn" class="width200">
              <el-option v-for="item in adjustForm.getDepName" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select v-model="Form.getAgentName" clearable filterable placeholder="经纪人" :loading="loading2" class="width100">
              <el-option v-for="item in adjustForm.getAgentName" :key="item.empId" :label="item.name" :value="item.empId"></el-option>
          </el-select> -->
          <select-tree :data="DepList" :init="adjustForm.depName" @checkCell="depHandleClick" @clear="clearDep" @search="searchDep" class="fl"></select-tree>
          <el-select :clearable="true" v-loadmore="moreEmploye" class="margin-left" size="small" v-model="adjustForm.empId" @change="handleEmpNodeClick" placeholder="请选择">
            <el-option
              v-for="item in EmployeList"
              :key="item.empId"
              :label="item.name"
              :value="item.empId">
            </el-option>
          </el-select>

        </el-form-item>

        <el-form-item label="审核状态">
          <el-select v-model="adjustForm.checkState" placeholder="全部" class="width150" clearable>
            <el-option label="审核中" value="0"></el-option>
            <el-option label="通过" value="1"></el-option>
            <el-option label="驳回" value="2"></el-option>
          </el-select>
        </el-form-item>


      </el-form>
    </ScreeningTop>

    <!-- 数据列表 -->
    <div class="contract-list">
      <!-- <div class="form-title-fl"><i class="iconfont icon-tubiao-11 mr8"></i>数据列表</div>    -->
      <el-table :data="tableData.list" ref="tableCom" :max-height="tableNumberCom" style="width: 100%" v-loading="loadingTable" @row-dblclick='toDetail' border>
        <el-table-column label="合同编号" align="center" min-width="120" fixed :formatter="nullFormatter">
          <template slot-scope="scope">
            <div class="blue curPointer" @click="goContractDetail(scope.row)">{{scope.row.contractCode}}</div>
          </template>
        </el-table-column>
        <el-table-column label="合同类型" :formatter="nullFormatter" min-width="60" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.tradeType === 1">租赁</p>
            <p v-if="scope.row.tradeType === 2">买卖</p>
            <p v-if="scope.row.tradeType === 3">代办</p>
            <p v-if="scope.row.tradeType === 4">意向</p>
            <p v-if="scope.row.tradeType === 5">定金</p>

          </template>

        </el-table-column>
        <el-table-column label="成交总价" :formatter="nullFormatter" align="center" min-width="90" prop="dealPrice">
          <template slot-scope="scope">
            <span>{{scope.row.dealPrice}} 元</span>
            <span v-for="item in dictionary['507']" :key="item.key" v-if="item.key===scope.row.timeUnit&&scope.row.tradeType===1"> / {{item.value}}</span>
          </template>
        </el-table-column>
        <el-table-column label="成交经纪人" :formatter="nullFormatter" align="center" min-width="120">
          <template slot-scope="scope">
            <p>{{scope.row.dealAgentStoreName}}</p>
            <p>{{scope.row.dealAgentName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="签约日期" align="center" min-width="90">
          <template slot-scope="scope">
            <p>{{scope.row.signDate | getDate}}</p>
          </template>
        </el-table-column>
        <el-table-column label="发起日期" align="center" min-width="90">
          <template slot-scope="scope">
            <p>{{scope.row.createTime | getDate}}</p>
          </template>
        </el-table-column>
        <el-table-column label="发起人" :formatter="nullFormatter" align="center" min-width="120">
          <template slot-scope="scope">
            <p>{{scope.row.createByDepName}}</p>
            <p>{{scope.row.createByName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" :formatter="nullFormatter" align="center" min-width="80">
          <template slot-scope="scope">
            <span class="blue" v-if="scope.row.checkState === 0">审核中</span>
            <span class="green" v-if="scope.row.checkState === 1">通过</span>
            <span class="red" v-if="scope.row.checkState === 2">驳回</span>
          </template>
        </el-table-column>
        <el-table-column label="审核日期" align="center" min-width="90">
          <template slot-scope="scope">
            <p>{{scope.row.checkTime | getDate}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="当前审核人" min-width="120">
          <template slot-scope="scope">

            <span v-if="scope.row.checkby>0&&scope.row.checkState===0">
              <p>{{scope.row.checkByDepName}}</p>
              <p>{{scope.row.checkByName}}</p>
            </span>
            <p v-else>--</p>

            <p class="btn-text-info" type="text" v-if="getUserMsg&& (scope.row.preAuditId === getUserMsg.empId || scope.row.checkby === getUserMsg.empId) && scope.row.checkState===0" @click="choseCheckPerson(scope.row,getUserMsg.empId===scope.row.checkby?2:1)">{{getUserMsg.empId===scope.row.checkby?'转交审核人':'设置审核人'}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="下一步审核人" min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.nextAuditId>0">
              <p>{{scope.row.nextAuditStore}}</p>
              <p>{{scope.row.nextAuditName}}</p>
            </span>
            <p v-else>--</p>

            <p class="btn-text-info color-red" type="text" v-if="getUserMsg && (scope.row.checkby === getUserMsg.empId&& scope.row.nextAuditId!==0) && scope.row.checkState===0" @click="choseCheckPerson(scope.row,3)">设置审核人</p>
          </template>
        </el-table-column>
        <el-table-column label="审核备注" align="center" min-width="120">
          <template slot-scope="scope">
              <span v-if="scope.row.checkRemark&&(scope.row.checkRemark).trim().length > 0">
                <el-popover trigger="hover" placement="top">
                  <div style="width:160px;word-break: break-all;word-wrap:break-word;white-space: normal;text-align: justify">
                    {{scope.row.checkRemark}}
                  </div>
                  <div slot="reference" class="name-wrapper" :class="{'isFlex':scope.row.checkRemark.length<16}">
                    {{scope.row.checkRemark}}
                  </div>
                </el-popover>
              </span>
              <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="120" fixed="right" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.checkState === 0 && scope.row.checkby === getUserMsg.empId">
              <el-button type="text" class="curPointer" @click="auditApply(scope.row)">审核</el-button>
            </template>
            <span v-else>--</span>
          </template>

        </el-table-column>
      </el-table>
      <el-pagination
      @current-change="handleCurrentChange"
      :page-size="tableData.pageSize"
      :current-page="tableData.pageNum"
      layout="total, prev, pager, next, jumper"
      :total="tableData.total"
      v-if="tableData.total > 0"
      >
     </el-pagination>
    </div>

    <!-- 调佣审核弹框 -->
    <el-dialog title="调佣审核" :visible.sync="dialogVisible" width="820px" class="layer-audit" :closeOnClickModal="$tool.closeOnClickModal" :close-on-press-escape="$tool.closeOnClickModal">
      <div class="audit-box"  :style="{ height: clientHeight() }">
        <div class="audit-col">
          <div class="col-li">
            <p>合同编号：<span class="blue">{{layerAudit.contractCode}}</span></p>
            <p>物业地址：<span>{{layerAudit.propertyAddr}}</span></p>
          </div>
          <div class="col-li">
            <p>申请日期：<span>{{layerAudit.createTime | getDate}}</span></p>
            <p>申请人：<span>{{layerAudit.createByDepName + '-' + layerAudit.createByName}}</span></p>
          </div>
          <div class="col-li">
            <p>合同类型：<span>{{layerAudit.tradeType}}</span></p>
            <p class="mr100">成交总价：{{layerAudit.dealPrice}}元
              <span v-for="item in dictionary['507']" :key="item.key" v-if="item.key===layerAudit.timeUnit"> / {{item.value}}</span>
            </p>
            <p>可分配业绩：<span>{{layerAudit.money}}元</span></p>
          </div>
          <div class="col-li">
            <p>调整类型：<span>佣金调整</span></p>
            <p><el-checkbox v-model="relieveFn" :disabled="true">有解除协议</el-checkbox></p>
          </div>
          <div class="textareabox">
            <span>调整原因</span>
            <el-input type="textarea" :rows="3" v-model="layerAudit.reason" class="textarea" maxlength=100 :disabled="true"></el-input>
          </div>
        </div>

        <div class="audit-col bordernone">
          <!-- 表格 -->
          <table class="table">
            <thead>
              <tr>
                <th></th>
                <th>业主佣金</th>
                <th>客户佣金</th>
                <!-- <th>按揭手续费</th> -->
                <th v-if="layerAudit.isCooperation === 1">合作费扣除</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>原金额</td>
                <td>{{layerAudit.ownerCommission}}元</td>
                <td>{{layerAudit.custCommission}}元</td>
                <td v-if="layerAudit.isCooperation === 1">{{layerAudit.otherCooperationCost}}元</td>
              </tr>
              <tr>
                <td>调整为</td>
                <td>{{layerAudit.newOwnerCommission}}元</td>
                <td>{{layerAudit.newCustCommission}}元</td>
                <td v-if="layerAudit.isCooperation === 1">{{layerAudit.newOtherCooperationCost}}元</td>
              </tr>
            </tbody>
          </table>
          <!-- 上传附件 -->
          <div class="uploadfile">
            <div class="uploadtitle">附件:</div>
            <ul class="ulData">

                <li v-for="(item,index) in uploadList" :key="item.index">
                  <el-tooltip class="item" effect="dark" :content="item.name" placement="bottom">
                    <div class="namePath" @click="previewPhoto(uploadList,index)">
                        <upload-cell :type="item.fileType"></upload-cell>
                        <p>{{item.name}}</p>
                    </div>
                  </el-tooltip>
                  <!-- <i class="iconfont icon-tubiao-6" @click="ZTdelectData(index)" v-if="isDelete===item.index+item.path"></i> -->
                </li>
            </ul>
          </div>
        </div>
        <!-- 审核备注 -->
        <div class="textareabox2 textlengthbox">
          <span>审核备注</span>
          <el-input type="textarea" :rows="5" v-model="auditForm.textarea" class="textarea" maxlength=200 ></el-input>
          <span class="textLength">{{auditForm.textarea.length}}/200</span>
        </div>
      </div>
      <div class="btnbox">
        <el-button class="refuse" @click="refuseFn()" v-loading.fullscreen.lock="fullscreenLoading">驳 回</el-button>
        <el-button type="primary"  @click="receptFn()" class="recept" v-loading.fullscreen.lock="fullscreenLoading">通 过</el-button>
      </div>
      <!-- 图片放大 -->
      <preview :imgList="previewFiles" :start="previewIndex" v-if="preview" @close="preview=false"></preview>
    </el-dialog>

    <!-- 调佣详情 -->
    <el-dialog title="调佣详情" :visible.sync="dialogVisible2" width="820px" class="layer-audit" :closeOnClickModal="$tool.closeOnClickModal" :close-on-press-escape="$tool.closeOnClickModal">
      <div class="audit-box"  :style="{ height: clientHeight2() }">
        <div class="audit-col">
          <div class="col-li">
            <p>合同编号：<span class="blue">{{layerAudit.contractCode}}</span></p>
            <p>物业地址：<span>{{layerAudit.propertyAddr}}</span></p>
          </div>
          <div class="col-li">
            <p>申请日期：<span>{{layerAudit.createTime | getDate}}</span></p>
            <p>申请人：<span>{{layerAudit.createByDepName + '-' + layerAudit.createByName}}</span></p>
          </div>
          <div class="col-li">
            <p>合同类型：<span>{{layerAudit.tradeType}}</span></p>
            <p class="mr100">成交总价：{{layerAudit.dealPrice}}元
              <span v-for="item in dictionary['507']" :key="item.key" v-if="item.key===layerAudit.timeUnit"> / {{item.value}}</span>
            </p>
            <p>可分配业绩：<span>{{layerAudit.money}}元</span></p>
          </div>
          <div class="col-li">
            <p>调整类型：<span>佣金调整</span></p>
            <p><el-checkbox v-model="relieveFn" :disabled="true">有解除协议</el-checkbox></p>
          </div>
          <div class="textareabox">
            <span>调整原因</span>
            <el-input type="textarea" :rows="3"  v-model="layerAudit.reason" class="textarea" maxlength=100 :disabled="true"></el-input>
          </div>
        </div>

        <div class="audit-col">
          <!-- 表格 -->
          <table class="table">
            <thead>
              <tr>
                <th></th>
                <th>业主佣金</th>
                <th>客户佣金</th>
                <!-- <th>按揭手续费</th> -->
                <th v-if="layerAudit.isCooperation === 1">合作费扣除</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>原金额</td>
                <td>{{layerAudit.ownerCommission}}元</td>
                <td>{{layerAudit.custCommission}}元</td>
                <td v-if="layerAudit.isCooperation === 1">{{layerAudit.otherCooperationCost}}元</td>
              </tr>
              <tr>
                <td>调整为</td>
                <td>{{layerAudit.newOwnerCommission}}元</td>
                <td>{{layerAudit.newCustCommission}}元</td>
                <td v-if="layerAudit.isCooperation === 1">{{layerAudit.newOtherCooperationCost}}元</td>
              </tr>
            </tbody>
          </table>
          <!-- 上传附件 -->
          <div class="uploadfile">
            <div class="uploadtitle">附件:</div>
            <ul class="ulData">

                <li v-for="(item,index) in uploadList" :key="item.index">
                  <el-tooltip class="item" effect="dark" :content="item.name" placement="bottom">
                    <div class="namePath" @click="previewPhoto(uploadList,index)">
                        <upload-cell :type="item.fileType"></upload-cell>
                        <p>{{item.name}}</p>
                    </div>
                  </el-tooltip>
                  <!-- <i class="iconfont icon-tubiao-6" @click="ZTdelectData(index)" v-if="isDelete===item.index+item.path"></i> -->
                </li>
            </ul>
          </div>

        </div>

        <div class="audit-col bordernone">
          <!-- 表格 -->
          <div class="mb20">审核信息：</div>

          <el-table :data="checkInfo" border style="width: 100%" class="table table2 mt20">
            <el-table-column label="时间" width=160 align=center>
              <template slot-scope="scope">
                <p>{{scope.row.auditTime | getTime}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="userName" label="姓名">
            </el-table-column>
            <el-table-column prop="roleName" label="职务"  width=110></el-table-column>
            <el-table-column prop="operate" label="操作" :formatter="nullFormatter" align="center" width=100>
              <!-- <template slot-scope="scope">
                <span class="blue" v-if="scope.row.auditState === 4">未审核</span>
                <span class="green" v-if="scope.row.auditState === 1">通过</span>
                <span class="red" v-if="scope.row.auditState === 2">驳回</span>
              </template> -->
            </el-table-column>
            <el-table-column label="备注">
              <template slot-scope="scope">
                <span v-if="scope.row.auditInfo">
                  <el-popover trigger="hover" placement="top">
                    <div style="width:160px;word-break: break-all;word-wrap:break-word;white-space: normal;text-align: justify">
                      {{scope.row.auditInfo}}
                    </div>
                    <div slot="reference" class="name-wrapper" :class="{'isFlex':scope.row.auditInfo.length<16}">
                      {{scope.row.auditInfo}}
                    </div>
                  </el-popover>
                </span>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>

      <!-- 图片放大 -->
      <preview :imgList="previewFiles" :start="previewIndex" v-if="preview" @close="preview=false"></preview>
    </el-dialog>
    <checkPerson :show="checkPerson.state" :type="checkPerson.type" :page="checkPerson.page" :showLabel="checkPerson.label" :bizCode="checkPerson.code" :flowType="checkPerson.flowType" @submit="personChose" @close="myclose" v-if="checkPerson.state"></checkPerson>
  </div>
</template>



<script>
  import ScreeningTop from '@/components/ScreeningTop';
  import { Message } from 'element-ui';

  import {FILTER} from "@/assets/js/filter";
  import {TOOL} from "@/assets/js/common";
  import { MIXINS } from "@/assets/js/mixins";
  import checkPerson from '@/components/checkPerson'

  export default {
    name: "adjust-check",
    // mixins: [FILTER],
    mixins: [FILTER,MIXINS],
    data(){
      return{
        checkPerson: {
          state:false,
          type:'init',
          code:'',
          flowType:0,
          label:false,
          page:'list'
        },
        clientHei: document.documentElement.clientHeight, //窗体高度
        fullscreenLoading:false,//创建按钮防抖
        loading:false,
        loading2:false,
        loadingTable:false,

        // 分页
        pageNum: 1,
        pageSize: 10,
        total: 0,
        // Form :{
        //   getDepName: '',
        //   getAgentName: ''
        // },
        adjustForm:{
          signDate: '', //发起日期
          contractTypes: '', //合同类型
          depAttr: '', //合作方式
          depName:'',
          depId: '',
          empId: '',
          // getDepName: [{
          //   name: "全部",
          //   id: ""
          // }],    //选择门店
          // getAgentName: [{
          //   name: "全部",
          //   empId: ""
          // }],
          checkState: '',  //审核状态
          keyword: ''   //关键字

        },
        dictionary: {
          //数据字典
          "10": "", //合同类型
          "17": "", //审核状态
          "507": "", // 成交总价单位
          "53": "" // 合作方式
        },

        layerAudit:{

        },

        checkInfo:[],

        // preview:false,
        // start:'',

        isDelete:'',

        myCheckId: '',
        //上传的协议
        uploadList: [],

        auditForm: {
          textarea: '', //备注
        },
        // 弹框里用到的
        dialogImageUrl: '',
        dialogVisible: false,
        dialogVisible2: false,
        // checked: false, //是否有解除协议

        tableData:[],

        power: {
          'sign-ht-maid-query': {
            state: false,
            name: '查询'
          },
          'sign-ht-maid-vdetail': {
            state: false,
            name: '调佣详情'
          },
          'sign-com-htdetail':{
              name:'合同详情',
              state:false,
          },
        }




      }
    },

    computed: {
      relieveFn() {
        if(this.layerAudit.relieve === 1){
          return true
        }else if(this.layerAudit.relieve === 0){
          return false
        }
      },
      getUserMsg(){
        return this.getUser.user
      }

    },

    filters: {
       getDate(val) {
         return TOOL.dateFormat(val);
       },
       getTime(val) {
         if(val === ''){
           return '-'
         }
         return TOOL.timeFormat(val)
       }
    },

    methods:{


      //图片预览
      // getPicture(value,index){
      //     this.start=index;
      //     let arr=[];
      //     // console.log(value);
      //     value.forEach(item =>{
      //         arr.push(item.path)
      //     })
      //     this.fileSign(arr)
      // },

      // //文件的删除
      // ZTdelectData(index){
      //     this.uploadList.splice(index,1)
      // },

      // //显示删除按钮
      // moveIn(value){
      //     this.isDelete=value
      // },
      // moveOut(value){
      //     if(this.isDelete===value){
      //         this.isDelete=''
      //     }
      // },
      trim(str){
        return str.replace(/(^\s*)|(\s*$)/g, "")
      },
      myclose: function() {
        this.checkPerson.state=false
        // this.queryFn();

      },
      // 选择审核人
      choseCheckPerson:function (row,type) {
        this.checkPerson.flowType=4   //调佣的流程类型为4
        this.checkPerson.code=row.checkId  //业务编码为checkId
        this.checkPerson.state=true
        this.checkPerson.type=type
        if(row.nextAuditId===-1){
          this.checkPerson.label=true
        }else {
          this.checkPerson.label=false
        }
      },
      personChose:function () {
        this.checkPerson.state=false
        // this.$message({
        //   message:`成功${this.checkPerson.type==='set'?'设置审核人':'转交审核人'}`
        // })
        this.queryFn()
      },

      // 控制弹框body内容高度，超过显示滚动条
      clientHeight() {
          return this.clientHei - 265 + 'px'
      },

      clientHeight2() {
          return this.clientHei - 197 + 'px'
      },

      // 得到部门门店和经纪人信息
      // getDepNameFn(e) {
      //   this.loading = true;
      //   this.$ajax.get("/api/access/deps", {keyword: e})
      //   .then(res => {
      //     let data = res.data;
      //     if (res.data.status === 200) {
      //       this.loading = false;
      //       if(e === '' || !e){
      //         this.adjustForm.getDepName = [{
      //           name: "全部",
      //           id: ""
      //         },...data.data]
      //       }else{
      //         this.adjustForm.getDepName = data.data
      //       }

      //     }
      //   }).catch(error => {
      //     this.$message({
      //       message: error
      //     })
      //   })
      // },

      // changeDepNameFn(e) {
      //   if(e !== "" || !!e){
      //     this.loading2 = true;
      //     this.$ajax.get("/api/organize/employees",{
      //       cityId:this.userMsg.cityId,
      //       depId: e
      //     })

      //     .then(res => {

      //       if (res.data.status === 200) {
      //         this.loading2 = false;
      //         this.Form.getAgentName = '';
      //         if(res.data.data.length > 0){

      //           this.adjustForm.getAgentName = [{
      //             name: "全部",
      //             empId: ""
      //           },...res.data.data]
      //         }
      //         else{
      //           this.adjustForm.getAgentName = res.data.data
      //         }

      //       }

      //     }).catch(error => {
      //       this.$message({
      //         message: error
      //       })
      //     })
      //   }else{
      //       this.Form.getAgentName = '';
      //       this.adjustForm.getAgentName = [{
      //           name: "全部",
      //           empId: ""
      //       }]
      //       // this.Form.getDepName = '全部';
      //       this.Form.getDepName = '';
      //       this.getDepNameFn('');
      //   }
      // },


      // 清除部门搜索
      // clearDepNameFn(){
      //     this.getDepNameFn('');
      // },


      // 重置
      resetFormFn() {
          TOOL.clearForm(this.adjustForm);
          this.pageNum = 1;
          // this.changeDepNameFn('');
          // this.pageNum=1;
          // this.queryFn();
          this.EmployeList = []
      },

      // 查询
      queryFn(type="init") {
        // console.log(this.power)
        // if(this.power['sign-ht-maid-query'].state){
          // console.log(this.userMsg.empId)
          if(type==='search'){
            this.pageNum=1
          }
          this.loadingTable = true;
          let startTime = '';
          let endTime = '';

          if(this.adjustForm.signDate && this.adjustForm.signDate.length === 2){
              startTime = TOOL.dateFormat(this.adjustForm.signDate[0]);
              endTime = TOOL.dateFormat(this.adjustForm.signDate[1]);
          }
            let param = {
              pageNum: this.pageNum,
              pageSize: this.pageSize,
              deptId: this.adjustForm.depId,
              depName:this.adjustForm.depName,
              empId: this.adjustForm.empId,
              startTime,
              endTime,
              // contractType: this.adjustForm.tradeType,
              depAttr: this.adjustForm.depAttr,
              checkState: this.adjustForm.checkState,
              keyword: this.adjustForm.keyword
            }
            if(this.adjustForm.contractTypes.length>0){
              param.contractTypes=this.adjustForm.contractTypes.join(',')
            }else{
              param.contractTypes=''
            }
            if(type==="search"||type==="page"){
              sessionStorage.setItem('sessionQuery',JSON.stringify({
                path:'/adjustCheck',
                url:'/commission/updateList',
                query:Object.assign({},param,{empName:this.dep.empName}),
                methods:"get"
              }))
            }
            //调整佣金审核列表
            this.$ajax
            .get("/api/commission/updateList", param)
            .then(res => {
              let data = res.data;
              if (res.data.status === 200) {
                this.tableData = data.data

              }
              this.$nextTick(()=>{
                this.loadingTable = false;
              })

            }).catch(error => {
              this.$message({
                message: error
              })
            })
        // }else{
        //   this.noPower(this.power['sign-ht-maid-query'].name)
        // }

      },

      // 双击详情事件
      toDetail(e) {
        if(this.power['sign-ht-maid-vdetail'].state){

          this.dialogVisible2 = true
          let param = {
            checkId: e.checkId,
            contractCode: e.contractCode
          }
          this.$ajax.get("/api/commission/toCheck", param)
          .then(res => {
            let data = res.data;
            if (res.data.status === 200) {
              console.log(data.data)
              this.layerAudit = data.data;
              this.myCheckId = data.data.checkId;
              this.uploadList = data.data.voucher;
              this.checkInfo = data.data.list
              console.log()
            }
          }).catch(error => {
              this.$message({
                message: error
              })
          });
        }else{
          this.noPower(this.power['sign-ht-maid-vdetail'].name)
        }

      },

      // 点击审核事件
      auditApply(e) {
        this.dialogVisible = true
        this.auditForm.textarea = ''
        let param = {
          checkId: e.checkId,
          contractCode: e.contractCode
        }
        this.$ajax.get("/api/commission/toCheck", param)
        .then(res => {
          console.log(e);
          let data = res.data;
          if (res.data.status === 200) {
            console.log(data.data)
            this.layerAudit = data.data;
            this.myCheckId = data.data.checkId;
            this.uploadList = data.data.voucher;
          }
        }).catch(error => {
            this.$message({
              message: error
            })
        });
      },

      // 驳回操作
      refuseFn() {

        let param = {
          checkId: this.myCheckId,
          remark: this.auditForm.textarea
        }
        if((this.auditForm.textarea).trim() !== ""){
          this.fullscreenLoading=true
          this.$ajax.get("/api/commission/updateReject", param)
          .then(res => {
            this.$nextTick(()=>{
              this.fullscreenLoading=false
            })
            if (res.data.status === 200) {
              this.dialogVisible = false
              // 数据刷新
              this.queryFn();
              setTimeout(() => {
                 this.$message('已驳回');
              }, 2000);

            }
          }).catch(error => {
            this.$nextTick(()=>{
              this.fullscreenLoading=false
            })

              this.$message({
                message: error
              })
          });
        }else if((this.auditForm.textarea).trim() === ""){
          this.$message('审核备注未填写！');
        }

      },

      // 通过操作
      receptFn() {
        this.fullscreenLoading=true
        let param = {
          checkId: this.myCheckId,
          remark: this.auditForm.textarea
        }
        this.$ajax.get("/api/commission/update", param)
        .then(res => {
          this.$nextTick(()=>{
              this.fullscreenLoading=false
            })
          if (res.data.status === 200) {
            this.dialogVisible = false
              // 数据刷新
            this.queryFn();
            setTimeout(() => {
              this.$message('已通过');
            }, 2000);
          }

        }).catch(error => {

            this.$nextTick(()=>{
              this.fullscreenLoading=false
            })
            if(error.status === 300 && error.data.checkId){
              // this.choseCheckPerson(error.data.checkId,'set')
              this.checkPerson.flowType=4   //调佣的流程类型为4
              this.checkPerson.code=error.data.checkId  //业务编码为checkId
              this.checkPerson.state=true
              this.checkPerson.type=3
              // this.checkPerson.label=true
              // this.checkPerson.current=false
            }
            else{
              this.$message({
                message: error
              })
            }

        });
      },

      //跳转合同详情页
      goContractDetail(value){
        if(this.power['sign-com-htdetail'].state){

          // console.log(value)
          this.setPath(this.$tool.getRouter(['合同','调佣审核','合同详情'],'adjustCheck'));
          this.$router.push({
            path:'/contractDetails',
            query:{
              id: value.contId,
              code: value.contractCode,
              contType: value.tradeType
            }
          })
        }else{
           this.noPower(this.power['sign-com-htdetail'].name);
        }
      },

      handleCurrentChange(e) {
        this.pageNum = e;
        this.queryFn("page");
      },



      depHandleClick(data) {
        // this.getEmploye(data.depId)
        this.adjustForm.depId=data.depId
        this.adjustForm.depName=data.name
        this.adjustForm.empId = ''

        this.handleNodeClick(data)
      },

      clearDep:function () {
        this.adjustForm.depId=''
        this.adjustForm.depName=''
        // this.EmployeList=[]
        this.adjustForm.empId=''
        this.clearSelect()
      },
      searchDep:function (payload) {
        /*this.DepList=payload.list
        this.adjustForm.depName=payload.depName*/
      },

      initDepList: function (val) {
        if (!val) {
          this.remoteMethod()
        }else {

        }
      },

    },

    created() {
      let res=this.getDataList
      if(res&&(res.route===this.$route.path)){
        this.tableData = res.data
        let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
        this.adjustForm = Object.assign({},this.adjustForm,session.query,{contractTypes:session.query.contractTypes.length>0?session.query.contractTypes.split(','):''})
        if(this.adjustForm.contractTypes){
          this.adjustForm.contractTypes = this.adjustForm.contractTypes.map(item=>{
            return Number(item)
          })
        }
        delete this.adjustForm.pageNum
        delete this.adjustForm.startTime
        delete this.adjustForm.endTime
        this.pageNum=session.query.pageNum
        if(session.query.startTime){
          this.adjustForm.signDate=[session.query.startTime,session.query.endTime]
        }
        if(this.adjustForm.empId){
        this.dep=Object.assign({},this.dep,{id:this.adjustForm.deptId,empId:this.adjustForm.empId,empName:this.adjustForm.empName})
        this.EmployeList.unshift({
          empId:this.adjustForm.empId,
          name:this.adjustForm.empName
        })
        this.getEmploye(this.adjustForm.deptId)
      }
        // this.adjustForm.empId=''
        // this.adjustForm.deptId=''
      }else{
        this.queryFn();
      }
      // this.getDepNameFn();
      this.getDictionary();
      // this.getAdmin();
      this.remoteMethod()
    },

    mounted() {
      var _this = this;
       window.onresize = function(){
         _this.clientHei = document.documentElement.clientHeight;
       }
    },

    components: {
          ScreeningTop,
          Message,
          checkPerson
      }
  };
</script>
<style lang="less">

@import "~@/assets/common.less";

#adjustcheck{
  .btn-text-info{
    padding: 0;
    color: @color-blue;
    cursor: pointer;
    &.color-red{
      color: red;
    }
  }
  .el-textarea.is-disabled .el-textarea__inner{
        color:#233241;
    }
  .fl{
    float: left;
  }

  .mt20{
    margin-bottom: 20px;
  }
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
    margin-bottom: 10px;
  }
  .el-form-item--mini .el-form-item__content, .el-form-item--mini .el-form-item__label{
    line-height: 32px;
  }
  .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner{
    width: 330px;
    line-height: 32px;
    height: 32px;
  }
  .el-range-editor--mini.el-input__inner{
    height: 32px;
    font-size: 14px;
  }
  .el-range-editor--mini .el-range-input{
    font-size: 14px;
  }
  .el-input--mini .el-input__inner{
    height: 32px;
    line-height: 32px;
    font-size: 14px;
  }
  .el-pagination{
      text-align: right;
      // padding: 30px 0 20px;
  }

  .adjustbox{
    box-shadow:0px 1px 6px 0px rgba(7,47,116,0.1);
  }

  .adjust-form {
    margin-bottom: 10px;
    background-color: #fff;
    border-radius:2px;
    box-sizing: border-box;
  }

  .contract-list {
      background-color: #fff;
      padding: 10px 12px 0;
    .form-title-fl{
      font-size: 14px;
      color: #233241;
      padding: 6px 0;

      .mr8{
        margin-right: 8px;
      }
    }
    .el-table{
      th{
        background-color: #EEF2FB;
        &:first-child{
          /*padding-left: 20px;*/
        }
      }
      tr{
        td{
          &:first-child{
            /*padding-left: 20px;*/
          }
        }
      }

    }
  }

  .blue{
    color: @color-blue;
  }
  .yellow{
    color: @color-yellow;
  }
  .green{
    color: @color-green;
  }
  .red{
    color: @color-warning;
  }
  .btn{
    color: @color-blue;
    cursor: pointer;
  }

  .width250{
    width: 250px;
  }
  .width200{
    width: 200px;
  }
  .width150{
    width: 150px;
  }
  .mb20{
    margin-bottom: 20px;
  }
  .width100{
    width: 100px;
  }
  .mr100{
    margin-right: 100px;
  }
  .curPointer{
    cursor: pointer;
    &:hover{
      text-decoration: underline;
    }
  }
  // 调佣审核弹层样式
  .layer-audit{
    .el-dialog{
      margin: 80px auto 60px !important;
      margin-top: 0vh;
    }
    .el-dialog__header{
      border-bottom: 1px solid #EDECF0;
      padding: 16px 20px 15px;
      span{
          color: #233241;
          font-size: 20px;


      }
      .el-dialog__headerbtn{
          top: 16px;
          .el-dialog__close{
              font-size: 24px;
              color: #32485F;
          }
      }
    }
    .el-dialog__body{
          padding: 0;
      }
  }
  .audit-box{
    padding: 0 20px 0px 20px;
    overflow-y: auto;
    .audit-col{
      padding: 30px 0;
      border-bottom: 1px solid #EDECF0;
      .col-li{
        overflow: hidden;
        clear: left;
        margin-bottom: 18px;
        p{
          float: left;
          &:first-child{
            width: 250px;
            color: #6C7986;
            span{
              color: #233241;
              &.blue{
                color: #478DE3;
              }
            }
          }
        }
      }
      .textareabox{
        display: flex;
        align-items: flex-start;
        span{
          width: 80px;
          em{
            color:#FF3E3E;
            margin-right: 3px;
          }
        }
      }
      .table{
        width: 100%;
        border-collapse:collapse;
        border-spacing:1;
        border-top: 1px solid #E8EAF6;
        border-left: 1px solid #E8EAF6;
        text-align: center;
        .el-input__inner{
          height: 28px;
          line-height: 28px;
          padding: 0;
          text-align: center;
        }
        .el-input__icon{
          line-height: 28px;
        }
        .el-input__suffix{
          right: 0px;
        }
        tr th{
          background-color:#F2F3F8;
          border-right: 1px solid #E8EAF6;
          border-bottom: 1px solid #E8EAF6;
          line-height: 40px;
          height: 40px;
        }
        tr td{
          overflow: hidden;
          padding: 14px 10px;
          border-right: 1px solid #E8EAF6;
          border-bottom: 1px solid #E8EAF6;
          &.flex{
            display: flex;
            align-items: center;
            justify-content: center;

          }
          .width70{
            width: 72px;
            height: 28px;
            line-height: 28px;
            margin-right: 3px;

          }
          .mr10{
            margin-right: 10px;
            .el-input__inner{
              text-align: left;
              padding-left: 10px;
            }
          }
          .fl{
            float: left;
          }
        }
      }
      .table2{
        tr td{
          padding: 12px 0;
        }
      }
      .uploadfile{
        margin: 40px 0 0;
        display: flex;
        .uploadtitle{
          color: #6C7986;
          width: 78px;
          span{
            margin-left: 16px;
            color: #8E8E8E;
            b{
              color: #6C7986;
            }
          }
        }
        .ulData{

            width: 100%;
            overflow: hidden;
            li{
                margin-right: 20px;
                margin-bottom: 20px;
                position: relative;
                float: left;
                &:nth-child(5n){
                  margin-right: 0;
                }
                > i{
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    color: #F56C6C;
                    font-size: 20px;
                    cursor: pointer;
                }
            }
        }

        .namePath{
            display: inline-block;
            text-align: center;
            width: 120px;
            height: 120px;
            padding-top: 20px;
            box-sizing: border-box;
            border-radius:4px;
            background: #F2F3F8;
            > p{
              padding-top: 5px;
              display: inline-block;
              width: 100px;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
        }

      }

    }
    .bordernone{
      border-bottom: none;
    }
  }
  .textareabox2{
    display: flex;
    align-items: flex-start;
    margin-bottom: 30px;
    span{
      width: 76px;
    }
  }
  .btnbox{
    display: flex;
    justify-content: flex-end;
    padding: 15px 20px 15px 0;
    border-top: 1px solid #EDECF0;
    .el-button{
      width: 100px;
      height: 38px;
      border-radius: 18px;
      padding: 0;
      &.refuse{
        background-color: #EAEFF5;
      }
      &.recept{
        background-color: #54D384;
        border-color: #54D384;
      }

    }
  }
  .name-wrapper {
    min-width: 80px;
    max-height: 65px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: normal;
    word-break: break-all;
    word-wrap:break-word;
  }

  .isFlex{
    display: flex;
    align-items: center;
  }
  .textlengthbox{
      position: relative;
  }
  .textLength{
      position: absolute;
      bottom: 10px;
      right: 20px;
      color: #6C7986;
      text-align: right;
  }

}





</style>
