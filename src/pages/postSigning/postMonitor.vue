<template>
  <div ref="tableComView" class="paper-set">
    <!-- 筛选 -->
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
      <el-form :inline="true" ref="propForm" :model="propForm" class="prop-form" size="small">
        <el-form-item label="关键字" prop="search">
          <el-tooltip content="合同编号/纸质合同编号/物业地址/业主/客户/房产证号/手机号" placement="top">
            <el-input class="w200" v-model="propForm.search" placeholder="请输入" clearable></el-input>
          </el-tooltip>
        </el-form-item>
        <!-- <el-form-item label="查询时间" prop="dateMo">
                    <el-date-picker v-model="propForm.dateMo" class="w330" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
        </el-form-item>-->
        <div class="in-block">
          <el-form-item label="交易步骤" class="mr" prop="lateName">
            <el-select v-model="propForm.lateName" class="w100" placeholder="状态">
              <el-option
                v-for="item in rules.lateName"
                :key="'lateName'+item.key"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="late">
            <el-select v-model="propForm.late" filterable placeholder="交易步骤" class="w100">
              <el-option
                v-for="item in rules.late"
                :key="'steps'+item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="交易流程" prop="time">
          <el-select v-model="propForm.time" class="w270">
            <el-option
              v-for="item in rules.time"
              :key="'time'+item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收佣状态" prop="paper">
          <el-select v-model="propForm.paper" class="w134">
            <el-option
              v-for="item in rules.paper"
              :key="'paper'+item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="in-block">
          <el-form-item label="部门" prop="departmentS" class="mr">
            <!-- <el-select
                        ref="tree"
                        size="small"
                        :loading="Loading"
                        :remote-method="remoteMethod"
                        v-model="propForm.departmentS"
                        @clear="clearDep"
                        @visible-change="initDepList"
                        clearable
                        filterable
                        remote
                        placeholder="请选择">
                            <el-option
                            class="drop-tree"
                            value="">
                                <el-tree
                                :data="DepList"
                                :props="defaultProps"
                                @node-click="depHandleClick"></el-tree>
                            </el-option>
            </el-select>-->
            <select-tree
              :data="DepList"
              :init="propForm.departmentS"
              @checkCell="depHandleClick"
              @clear="clearDep"
              @search="searchDep"
            ></select-tree>
          </el-form-item>
          <el-form-item prop="departmentMo">
            <el-select
              v-model="propForm.departmentMo"
              v-loadmore="moreEmploye"
              clearable
              @change="handleEmpNodeClick"
              class="w100"
            >
              <el-option
                v-for="item in EmployeList"
                :key="'departmentMo'+item.empId"
                :label="item.name"
                :value="item.empId"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="合作方式" prop="depAttr">
          <el-select v-model="propForm.depAttr" class="w100" :clearable="true">
            <el-option
              v-for="item in rules.depAttr"
              :key="'depAttr'+item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产权地址区域" prop="areaName">
          <el-select v-model="propForm.areaName" class="w134" :clearable="true">
            <el-option
              v-for="(item,i) in rules.areaName"
              :key="'areaName'+i"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="签约方式">
          <el-select v-model="propForm.recordType" class="w120" :clearable="true">
            <el-option
              v-for="item in dictionary['64']"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </ScreeningTop>
    <!-- 列表 -->
    <div class="paper-table-box">
      <div class="paper-set-tit">
        <div class="paper-tit-fl" v-if="power['sign-qh-cont-export'].state">
          <i class="iconfont icon-tubiao-11 mr-10 font-cl1"></i>数据列表
        </div>
        <p>
          <el-button
            class="btn-info"
            round
            type="primary"
            size="small"
            @click="getExcel"
            v-if="power['sign-qh-cont-export'].state"
          >导出</el-button>
        </p>
      </div>
      <el-table
        border
        ref="tableCom"
        :max-height="tableNumberCom"
        :data="tableData.list"
        v-loading="HQloadingList"
        element-loading-text="正在加载中"
        @row-dblclick="tradingStepsFn"
        class="paper-table"
      >
        <el-table-column label="合同信息" min-width="150">
          <template slot-scope="scope">
            <p>
              合同:
              <span
                class="blue"
                @click="contractFn(scope.row)"
                style="cursor:pointer;"
              >{{scope.row.code}}</span>
            </p>
            <p v-if="scope.row.recordType.value===2">
              纸质合同编号:
              <span
                class="blue"
                @click="contractFn(scope.row)"
                style="cursor:pointer;"
              >{{scope.row.pCode}}</span>
            </p>
            <p
              :class="[scope.row.remarkAfter&&scope.row.remarkAfter.value > 0?'remark':'']"
            >{{(scope.row.remarkAfter&&scope.row.remarkAfter.value >0)?(scope.row.remarkAfter&&scope.row.remarkAfter.label):""}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="recordType.label" label="签约方式" min-width="80"></el-table-column>
        <el-table-column label="接收日期" min-width="90">
          <template slot-scope="scope">{{dateFormat(scope.row.receiveTime)}}</template>
        </el-table-column>
        <el-table-column
          :formatter="nullFormatterData"
          prop="propertyAddr"
          label="物业地址"
          min-width="160"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.propertyAddr.length===0">--</span>
            <template v-else>
              <p>{{scope.row.propertyAddr.split(' ')[0]}}</p>
              <p>{{scope.row.propertyAddr.split(' ')[1]}}</p>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          :formatter="nullFormatterData"
          prop="transFlowName"
          label="交易流程"
          min-width="200"
        ></el-table-column>
        <el-table-column
          :formatter="nullFormatterData"
          prop="propertyRightAddr"
          label="产权地址"
          min-width="120"
        ></el-table-column>
        <el-table-column
          :formatter="nullFormatterData"
          prop="propertyRightRegion"
          label="产权地址区域"
          min-width="120"
        ></el-table-column>
        <el-table-column :formatter="nullFormatterData" prop="owner" label="业主" min-width="60"></el-table-column>
        <el-table-column :formatter="nullFormatterData" prop="customer" label="客户" min-width="60"></el-table-column>
        <el-table-column :formatter="nullFormatterData" label="成交经纪人" min-width="120">
          <template
            slot-scope="scope"
          >{{agentFn(scope.row.dealagentStoreName,scope.row.dealAgentName)}}</template>
        </el-table-column>
        <el-table-column
          :formatter="nullFormatterData"
          prop="guestinfo.ShopOwnerName"
          label="店长"
          min-width="80"
        ></el-table-column>
        <el-table-column
          prop="overtimeSteps"
          label="当前步骤"
          :formatter="nullFormatterData"
          min-width="80"
        >
          <!-- <template slot-scope="scope">
                        <el-button class="blue" type="text" @click="tradingStepsFn(scope.row)">{{scope.row.overtimeSteps}}</el-button>
          </template>-->
        </el-table-column>
        <el-table-column
          :formatter="nullFormatterData"
          prop="overtimeName"
          label="当前步骤责任人"
          min-width="120"
        ></el-table-column>
        <el-table-column label="计划完成时间" min-width="90">
          <template slot-scope="scope">{{dateFormat(scope.row.specifiedTime)}}</template>
        </el-table-column>
        <el-table-column
          :formatter="nullFormatterData"
          prop="overtimeDay"
          label="超时天数"
          min-width="60"
        ></el-table-column>
        <el-table-column :formatter="nullFormatterData" label="实收/应收" min-width="60">
          <template
            slot-scope="scope"
          >{{scope.row.receivedCommission}}/{{scope.row.receivableCommission}}</template>
        </el-table-column>
        <el-table-column
          :formatter="nullFormatterData"
          prop="statusReceiveAmount.label"
          label="收佣状态"
          min-width="60"
        ></el-table-column>
        <el-table-column :formatter="nullFormatterData" label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button
              class="blue"
              type="text"
              @click="operationFn(scope.row)"
              v-if="power['sign-com-bill'].state"
            >流水</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination" v-if="tableData.total">
      <el-pagination
        :current-page="tableData.pageNum"
        :page-size="tableData.pageSize"
        @current-change="currentChangeFn"
        layout=" total, prev, pager, next, jumper"
        :total="tableData.total"
      ></el-pagination>
    </div>
    <!-- 后期进度查看 -->
    <LayerLateProgress title="查看交易流程" ref="lateProgress"></LayerLateProgress>
    <!-- 流水 -->
    <flowAccount
      :dialogTableVisible="dialogTableVisible"
      :contCode="contCode"
      @closeRunningWater="closeWater"
      :contId="waterContId"
      v-if="dialogTableVisible"
    ></flowAccount>
  </div>
</template>

<script>
import ScreeningTop from "@/components/ScreeningTop";
import { FILTER } from "@/assets/js/filter";
import { MIXINS } from "@/assets/js/mixins";
import { TOOL } from "@/assets/js/common";
import LayerLateProgress from "@/components/LayerLateProgress";
import flowAccount from "@/components/flowAccount";

// 列表请求参数
let paramObj;

export default {
  mixins: [FILTER, MIXINS],
  components: {
    ScreeningTop,
    LayerLateProgress,
    flowAccount
  },
  data() {
    return {
      // 初始列表页面
      pageNum: 1,
      pageSize: 10,
      // 加载
      loading: false,
      loading2: false,
      HQloadingList: false,
      // 枚举数据
      dictionary: {
        "13": "收佣状态",
        "53": "合作方式",
        "64": "签约方式"
      },
      // 筛选条件
      propForm: {
        department: "",
        departmentS: "",
        departmentMo: "",
        search: "",
        paper: "",
        time: "",
        late: "",
        lateName: 3,
        depAttr: "",
        areaName: "",
        recordType: ""
      },
      // 筛选选项
      rules: {
        department: [
          {
            name: "全部",
            id: ""
          }
        ],
        departmentMo: [
          {
            name: "全部",
            empId: ""
          }
        ],
        paper: [
          {
            value: "全部",
            key: ""
          }
        ],
        time: [
          {
            name: "全部",
            id: ""
          }
        ],
        late: [],
        lateName: [
          {
            key: "",
            value: "全部"
          },
          {
            key: 1,
            value: "已完成"
          },
          {
            key: 2,
            value: "办理中"
          },
          {
            key: 3,
            value: "超时未办理"
          },
          {
            key: 4,
            value: "超时已办理"
          }
        ],
        depAttr: [],
        areaName: []
      },
      // 列表数据
      tableData: {},
      // 后期进度列表
      tableProgress: [],
      // 流水
      dialogTableVisible: false,
      waterContId: "",
      // code
      contCode: "",
      // 权限
      power: {
        // 'sign-qh-cont-query':{
        //     name:'查询',
        //     state:false
        // },
        "sign-com-bill": {
          name: "流水",
          state: false
        },
        "sign-com-htdetail": {
          name: "合同详情",
          state: false
        },
        "sign-qh-cont-export": {
          name: "导出",
          state: false
        }
      }
    };
  },
  computed: {
    // 城市
    cityId() {
      if (!!this.userMsg) {
        return this.userMsg.cityId;
      } else {
        return "";
      }
    }
  },
  methods: {
    // 产权地址下拉数据
    getAreaList: function() {
      this.$ajax
        .get("/api/organize/currentdep/areaname")
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.rules.areaName = res.data;
          }
        })
        .catch(err => {
          this.errMeFn(err);
        });
    },
    // 导出excel
    getExcel: function() {
      this.pageNum = 1;
      this.getListData("export");
      this.excelCreate("/input/stepMonitorExcel", paramObj);
    },
    // 成功提示
    successMeFn(e) {
      this.$message({
        message: e,
        type: "success"
      });
    },
    // 错误提示
    errMeFn(e) {
      this.$message.error(e);
    },
    // 重置
    resetFormFn() {
      this.propForm.department = "";
      this.pageNum = 1;
      this.$refs.propForm.resetFields();
      // this.pageNum=1;
      // this.getListData();
      this.EmployeList = [];
      this.propForm.recordType = "";
    },
    // 查询
    queryFn() {
      this.pageNum = 1;
      this.getListData("search");
    },
    // 合同编号弹层
    contractFn(value) {
      if (!this.power["sign-com-htdetail"].state) {
        this.noPower(this.power["sign-com-htdetail"].name);
        return false;
      }
      this.setPath(this.getPath.concat({ name: "合同详情" }));
      this.$router.push({
        path: "/contractDetails",
        query: {
          id: value.id, //合同id
          code: value.code, //合同编号
          contType: value.tradeType.value //合同类型
        }
      });
    },
    // 交易步骤
    tradingStepsFn(row, event) {
      this.$refs.lateProgress.show(row);
    },
    // 操作
    operationFn(item) {
      if (!this.power["sign-com-bill"].state) {
        this.noPower(this.power["sign-com-bill"].name);
        return false;
      }
      this.contCode = item.code;
      this.waterContId = item.id;
      this.dialogTableVisible = true;
    },
    closeWater() {
      this.dialogTableVisible = false;
    },
    // 时间处理
    dateFormat(val) {
      return TOOL.dateFormat(val);
    },
    // 分页
    // currentChangeFn(e){
    //     this.pageNum = e;
    //     this.getListData();
    // },
    // 经纪人
    agentFn(s, t) {
      if (!!s && !!t) {
        return `${s}-${t}`;
      } else if (!!s) {
        return s;
      } else if (!!t) {
        return t;
      } else {
        return "--";
      }
    },
    // 获取列表数据
    getListData(type = "init") {
      // if(!this.power['sign-qh-cont-query'].state){
      //     this.noPower(this.power['sign-qh-cont-query'].name);
      //     return false
      // }
      if (type === "init") {
        this.HQloadingList = true;
      }
      let receiveTimeEnd = "";
      let receiveTimeStar = "";
      let time = "";
      if (time) {
        time = this.propForm.dateMo;
      }
      if (time.length === 2) {
        receiveTimeStar = this.dateFormat(time[0]);
        receiveTimeEnd = this.dateFormat(time[1]);
      }
      paramObj = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        dealAgentId: this.propForm.departmentMo,
        dealDeptId: this.propForm.department,
        statusResult: this.propForm.paper,
        transFlowCode: this.propForm.time,
        stepState: this.propForm.lateName,
        stepInstanceCode: this.propForm.late,
        receiveTimeEnd,
        receiveTimeStar,
        keyword: this.propForm.search,
        depAttr: this.propForm.depAttr,
        areaName: this.propForm.areaName,
        recordType: this.propForm.recordType
      };

      //点击查询时，缓存筛选条件
      if (type === "search" || type === "pagination") {
        sessionStorage.setItem(
          "sessionQuery",
          JSON.stringify({
            path: "/postMonitor",
            url: "/postSigning/getMonitorContract",
            query: Object.assign(
              {},
              paramObj,
              { empName: this.dep.empName },
              { depName: this.propForm.departmentS }
            ),
            methods: "get"
          })
        );
      }

      this.$ajax
        .get("/api/postSigning/getMonitorContract", paramObj)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.tableData = res.data;
          }
          this.$nextTick(() => {
            this.HQloadingList = false;
          });
        })
        .catch(err => {
          this.errMeFn(err);
          this.$nextTick(() => {
            this.HQloadingList = false;
          });
        });
    },
    // 分页
    currentChangeFn(e) {
      this.pageNum = e;
      this.getListData("pagination");
    },
    // 交易步骤获取数据
    getTradingSteps() {
      this.$ajax
        .get("/api/postSigning/getAllStepFlows")
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.rules.late = res.data;
          }
        })
        .catch(err => {
          this.errMeFn(err);
        });
    },
    // 部门第二版 选择部门
    depHandleClick(data) {
      this.propForm.department = data.depId;
      this.propForm.departmentS = data.name;
      this.handleNodeClick(data);
    },
    // 部门第二版 删除
    clearDep() {
      this.propForm.department = "";
      this.propForm.departmentMo = "";
      this.clearSelect();
      this.remoteMethod();
    },
    // 部门第二版 下拉隐藏时 刷新数据清除上一次数据
    initDepList(val) {
      if (!val) {
        this.remoteMethod();
      }
    },
    // 部门搜索
    searchDep: function(payload) {
      /*this.DepList=payload.list
                this.propForm.departmentS = payload.depName*/
    },
    // 交易流程获取数据
    getTransactionProcess() {
      this.$ajax
        .post("/api/flowmanage/selectFlowPageList", {
          cityId: this.cityId
        })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.rules.time = [
              {
                name: "全部",
                id: ""
              },
              ...res.data
            ];
          }
        })
        .catch(err => {
          this.errMeFn(err);
        });
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 获取城市id
      this.getAdmin();
      // 交易步骤
      this.getTradingSteps();
      // 部门搜索
      this.remoteMethod();
      // 枚举数据查询
      this.getDictionary();
      // 产权地址区域
      this.getAreaList();
      let res = this.getDataList;
      if (res && res.route === this.$route.path) {
        this.tableData.list = res.data.list;
        this.tableData.total = res.data.total;
        let session = JSON.parse(sessionStorage.getItem("sessionQuery"));
        let query = session.query;
        this.propForm = {
          department: query.dealDeptId,
          departmentS: query.depName,
          departmentMo: query.dealAgentId,
          search: query.keyword,
          paper: query.statusResult,
          time: query.transFlowCode,
          late: query.stepInstanceCode,
          lateName: query.stepState,
          depAttr: query.depAttr,
          areaName: query.areaName,
          recordType: query.recordType
        };
        if (this.propForm.departmentMo) {
          this.dep = Object.assign({}, this.dep, {
            id: this.propForm.department,
            empId: this.propForm.departmentMo,
            empName: query.empName
          });
          this.EmployeList.unshift({
            empId: this.propForm.departmentMo,
            name: query.empName
          });
          this.getEmploye(this.propForm.department);
        }
        this.tableData.pageNum = query.pageNum;
      } else {
        // 列表数据
        this.getListData();
      }
    });
  },
  watch: {
    dictionary(newData, oldData) {
      // 收佣状态
      this.rules.paper = [
        {
          value: "全部",
          key: ""
        },
        ...newData[13]
      ];
      // 合作方式
      this.rules.depAttr = [...newData[53]];
    },
    cityId() {
      // 交易流程
      this.getTransactionProcess();
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/lsx.less";
</style>
