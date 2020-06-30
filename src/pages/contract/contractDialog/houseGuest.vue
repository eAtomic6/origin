<template>
  <div class="view-container">
    <el-dialog
      :title="title"
      :visible="getDialogVisible"
      @close="close"
      :closeOnClickModal="$tool.closeOnClickModal"
    >
      <!-- 选择房源弹窗 -->
      <div v-if="getDialogType==='house'" class="dataList">
        <el-form :inline="true" :model="searchForm" class="search-form" size="small">
          <el-form-item label="关键字：">
            <el-select
              v-model="estateCode"
              :multiple="false"
              clearable
              filterable
              remote
              reserve-keyword
              @change="getBuildList"
              placeholder="楼盘名称"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in options"
                :key="item.EstateCode"
                :label="item.EstateName"
                :value="item.EstateCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="BuildingCode" placeholder="楼栋单元" :clearable="true">
              <el-option
                v-for="item in buildList"
                :key="item.BuildingCode"
                :label="item.BuildingName"
                :value="item.BuildingCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="houseKeyword" placeholder="房号/房源编号/房东手机"></el-input>
          </el-form-item>
          <el-form-item>
            <span @click="isAttention">
              我的关注
              <span class="attention" :class="{'attention_':attention>0}"></span>
            </span>
          </el-form-item>
          <el-button type="primary" round class="search_btn" @click="inquireHouse">查询</el-button>
          <el-button round class="search_btn" @click="resetFormFn">清空</el-button>
          <el-form-item label="部门：">
            <select-tree
              :data="DepList"
              :init="depName"
              @checkCell="depHandleClick"
              @clear="clearDep"
              @search="searchDep"
            ></select-tree>
          </el-form-item>
          <el-form-item>
            <el-select
              style="width:100px"
              :clearable="true"
              v-loadmore="moreEmploye"
              class="margin-left"
              size="small"
              v-model="empId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in EmployeList"
                :key="item.empId"
                :label="item.name"
                :value="item.empId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="search_content" v-loading="loading_" v-if="showDataList">
          <el-table
            :data="dataList"
            border
            header-row-class-name="theader-bg"
            @row-click="selectItem"
            :row-class-name="tableRowClassName"
            height="217"
          >
            <el-table-column width="40">
              <template slot-scope="scope">
                <span class="outSide">
                  <span class="inLine" :class="{'inLineBg':selectCode===scope.row.PropertyCode}"></span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="PropertyNo" label="房源编号" width="150">
              <template slot-scope="scope">
                {{scope.row.PropertyNo}}
                <span class="zhuanjie" v-if="scope.row.IsRetained===1">留</span>
              </template>
            </el-table-column>
            <el-table-column prop="EstateName" label="楼盘名称" width="150"></el-table-column>
            <el-table-column label="状态" prop="LStatus" width="60"></el-table-column>
            <el-table-column prop="FloorNum" label="楼层" width="80"></el-table-column>
            <el-table-column prop="HouseType" label="房型" width="80"></el-table-column>
            <el-table-column label="面积" width="70">
              <template slot-scope="scope">{{scope.row.Square}} ㎡</template>
            </el-table-column>
            <el-table-column :label="priceType" width="80">
              <template slot-scope="scope">{{scope.row.Price}} {{scope.row.TradeInt===3?'元':'万元'}}</template>
            </el-table-column>
            <el-table-column prop="DecorateType" label="装修" width="60" :formatter="nullFormatter"></el-table-column>
            <el-table-column prop="Emp1" label="维护人"></el-table-column>
          </el-table>
          <el-pagination
            class="pagination-info"
            @current-change="handleCurrentChange1"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
        <div class="noList" v-if="!showDataList">未查到相关房源</div>
      </div>
      <!-- 选择客源弹窗 -->
      <div v-if="getDialogType==='guest'" class="dataList_">
        <el-form :inline="true" :model="searchForm" class="search-form_" size="small">
          <div>
            <el-form-item label="交易:">
              <el-select
                style="width:150px"
                v-model="guestType"
                placeholder
                :disabled="contractType!=''"
              >
                <el-option
                  v-for="item in guestTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字:">
              <el-input v-model="guestKeyword" placeholder="客源编号/手机号/客户姓名" style="width:180px"></el-input>
            </el-form-item>
            <el-form-item label="部门:">
              <select-tree
                :data="DepList"
                :init="depName"
                @checkCell="depHandleClick"
                @clear="clearDep"
                @search="searchDep"
              ></select-tree>
            </el-form-item>
            <el-form-item>
              <el-select
                style="width:100px"
                :clearable="true"
                v-loadmore="moreEmploye"
                class="margin-left"
                size="small"
                v-model="empId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in EmployeList"
                  :key="item.empId"
                  :label="item.name"
                  :value="item.empId"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-button type="primary" round class="search_btn" @click="inquireGuest">查询</el-button>
            <el-button round class="search_btn" @click="resetFormFn">清空</el-button>
          </div>
        </el-form>
        <div class="search_content" v-loading="loading_" v-if="showDataList">
          <el-table
            :data="dataList"
            border
            header-row-class-name="theader-bg"
            @row-click="selectItem"
          >
            <el-table-column width="40">
              <template slot-scope="scope">
                <span class="outSide">
                  <span class="inLine" :class="{'inLineBg':selectCode===scope.row.InquiryCode}"></span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="CustName" label="姓名"></el-table-column>
            <el-table-column label="客源编号">
              <template slot-scope="scope">
                {{scope.row.InquiryNo}}
                <span class="zhuanjie" v-if="scope.row.IsRefer===1">转介</span>
              </template>
            </el-table-column>
            <el-table-column prop="Trade" label="交易"></el-table-column>
            <el-table-column label="意向区域" min-width="100">
              <template slot-scope="scope">
                <!-- <span class="districtName">{{scope.row.DistrictName}}</span> -->
                <el-popover trigger="hover" placement="top">
                  <div style="width:160px">{{scope.row.DistrictName}}</div>
                  <div slot="reference" class="name-wrapper">{{scope.row.DistrictName}}</div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column :label="priceType" min-width="60">
              <template slot-scope="scope">
                <span v-if="scope.row.PriceMin||scope.row.PriceMax" >{{scope.row.PriceMin}}{{Number(scope.row.PriceMax)?"-"+ scope.row.PriceMax:""}}{{scope.row.Trade==='求租'?'元':'万元'}}{{Number(scope.row.PriceMax)?"":"以上"}}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column label="维护人" min-width="100">
              <template slot-scope="scope">{{scope.row.DeptName+' - '+scope.row.EmpName}}</template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="pagination-info"
            @current-change="handleCurrentChange2"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
        <div class="noList" v-if="!showDataList">
          <p v-if="clientStatus===1">未查到相关客源</p>
          <p v-if="clientStatus===2">
            当前查询的客源为公客，请先在【客源资料】中进行激活
            <br />（当前查询的客源为已成交的私客，请先在【客源资料】中进行激活）
          </p>
          <p v-if="clientStatus===3">
            系统未查询到该客源，您可以
            <el-button type="text" @click="innerVisible=true">快速添加该客源</el-button>
          </p>
        </div>
        <!-- <div class="floor_btn">
          <el-button round class="search_btn">取消</el-button>
          <el-button type="primary" round class="search_btn">确定</el-button>
        </div>-->
        <!-- 添加客源弹窗 -->
        <el-dialog
          width="30%"
          title="添加客源"
          :visible.sync="innerVisible"
          :modal="isModel"
          style="margin-top:150px"
          append-to-body
        >
          <el-form :inline="true" :model="addclient" class="search-form" size="mini">
            <el-form-item label="姓名：">
              <el-input v-model="addclient.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号：">
              <el-input v-model="addclient.mobile" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="交易类型：">
              <el-select v-model="addclient.tradeType" placeholder style="width:150px">
                <el-option label="求租" value="1"></el-option>
                <el-option label="求购" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用途：">
              <el-select v-model="addclient.tradeType" placeholder>
                <el-option label="求租" value="1"></el-option>
                <el-option label="求购" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="client_b">
            <el-button round class="search_btn" @click="innerVisible=false">取消</el-button>
            <el-button type="primary" round class="search_btn" @click="innerVisible=false">确定</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="floor_btn">
        <el-button round class="search_btn" @click="close">取消</el-button>
        <el-button type="primary" round class="search_btn" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { MIXINS } from "@/assets/js/mixins";
import { FILTER } from "@/assets/js/filter";

export default {
  mixins: [MIXINS, FILTER],
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogType: {
      type: String,
      default: "" //房源 house  客源 guest
    },
    contractType: {
      type: String,
      default: "" //求租  求购
    },
    choseHcode: {
      //选中的房源编号
      type: Number,
      default: 0
    },
    choseGcode: {
      //选中的客源编号
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      title: "",
      //查询表单
      searchForm: {},
      //房源客源列表
      dataList: [],
      //添加客源信息
      addclient: {},
      //添加客源弹窗
      innerVisible: false,
      clientStatus: 1,
      isModel: false,
      currentPage: 1,
      pageSize: 5,
      total: 0,
      attention: 0,
      //房源类型  2 出售  3 租价
      housetType: "",
      //客源类型  1 求租  2 求购
      guestType: "",
      guestTypeList: [
        { label: "求租", value: 1 },
        { label: "求购", value: 2 }
      ],
      priceType: "",
      houseKeyword: "",
      guestKeyword: "",
      //楼盘
      options: [],
      loading: false,
      //楼盘id
      estateCode: "",
      //楼栋
      buildList: [],
      //楼栋id
      BuildingCode: "",
      selectCode: "",
      loading_: false,
      showDataList: true,
      isReady: true,
      house: "house",
      guest: "guest",
      depId: "", //部门id
      empId: "", //人员id
      depName: "",
      userMsg: ""
    };
  },
  created() {
    if (this.contractType === "求租") {
      this.housetType = 3;
      this.guestType = 1;
      this.priceType = "租价";
    } else if (this.contractType === "求购") {
      this.housetType = 2;
      this.guestType = 2;
      this.priceType = "售价";
    } else {
      this.priceType = "租/售价";
    }
    if (this.dialogType === "house") {
      this.title = "选择房源";
      this.getHouseList();
      this.selectCode = this.choseHcode;
    } else if (this.dialogType === "guest") {
      this.title = "选择客源";
      this.getGuestList();
      this.selectCode = this.choseGcode;
    }
  },
  methods: {
    close() {
      this.$emit("closeHouseGuest");
    },
    //我的关注
    isAttention() {
      if (this.attention) {
        this.attention = 0;
      } else {
        this.attention = 1;
      }
      this.showDataList = true;
      this.getHouseList();
    },
    handleCurrentChange1(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getHouseList();
    },
    handleCurrentChange2(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getGuestList();
    },
    //房源列表
    getHouseList() {
      this.showDataList = true;
      this.loading_ = true;
      let param = {
        pageSize: this.pageSize,
        pageIndex: this.currentPage,
        keyword: this.houseKeyword,
        contType: this.housetType,
        isFocus: this.attention,
        estateCode: this.estateCode,
        buildingCode: this.BuildingCode,
        depId: this.depId,
        empId: this.empId
      };
      this.$ajax
        .get("/api/contract/houses", param)
        .then(res => {
          res = res.data;
          this.loading_ = false;
          if (res.status === 200) {
            this.dataList = [];
            if (res.data && res.data.TotalCount > 0) {
              this.dataList = res.data.list;
              this.showDataList = true;
              this.total = res.data.TotalCount;
            } else {
              this.dataList = [];
              this.showDataList = false;
              this.total = 0;
            }
          }
        })
        .catch(error => {
          this.loading_ = false;
        });
    },
    //客源列表
    getGuestList() {
      this.showDataList = true;
      this.loading_ = true;
      let param = {
        pageSize: this.pageSize,
        pageIndex: this.currentPage,
        type: this.guestType,
        keyword: this.guestKeyword,
        depId: this.depId,
        empId: this.empId
      };
      this.$ajax
        .get("/api/resource/customers", param)
        .then(res => {
          this.loading_ = false;
          res = res.data;
          if (res.status === 200) {
            this.dataList = [];
            if (res.data && res.data.TotalCount > 0) {
              this.dataList = res.data.list;
              this.showDataList = true;
              this.total = res.data.TotalCount;
            } else {
              this.dataList = [];
              this.showDataList = false;
              this.total = 0;
            }
          }
        })
        .catch(error => {
          this.loading_ = false;
        });
    },
    //楼盘名称
    remoteMethod(query) {
      this.options = [];
      this.buildList = [];
      if (query !== "") {
        this.loading = true;
        let param = {
          keyword: query
        };
        this.$ajax.get("/api/resource/buildings", param).then(res => {
          res = res.data;
          this.loading = false;
          if (res.status === 200) {
            this.options = res.data;
          }
        });
      }
    },
    //楼栋
    getBuildList(id) {
      this.buildList = [];
      this.BuildingCode = "";
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].EstateCode === id) {
          this.buildList = this.options[i].BuildingList;
        }
      }
    },
    //房源查询
    inquireHouse() {
      this.currentPage = 1;
      this.getHouseList();
    },
    //客源查询
    inquireGuest() {
      this.currentPage = 1;
      this.getGuestList();
    },
    //选中房源客源
    selectItem(value) {
      if (this.dialogType === "house") {
        // if (value.invalid) {
        if (this.selectCode === value.PropertyCode) {
          this.selectCode = "";
        } else {
          this.selectCode = value.PropertyCode;
        }
        // } else {
        //   this.$message({
        //     message: "不能选择已锁定房源",
        //     type:"warning"
        //   });
        // }
      } else if (this.dialogType === "guest") {
        if (this.selectCode === value.InquiryCode) {
          this.selectCode = "";
        } else {
          this.selectCode = value.InquiryCode;
        }
      }
    },
    //确定选择
    confirm() {
      if (this.selectCode) {
        this.$emit("closeHouseGuest", {
          selectCode: this.selectCode,
          dialogType: this.dialogType
        });
      } else {
        if (this.dialogType === "house") {
          this.$alert("请选择房源", "提示", {
            confirmButtonText: "确定"
          });
        } else if (this.dialogType === "guest") {
          this.$alert("请选择客源", "提示", {
            confirmButtonText: "确定"
          });
        }
      }
    },
    //重置
    resetFormFn() {
      // contType:this.housetType,
      // isFocus:this.attention,
      // estateCode:this.estateCode,
      // buildingCode:this.BuildingCode
      this.houseKeyword = "";
      this.guestKeyword = "";
      this.attention = 0;
      this.estateCode = "";
      this.BuildingCode = "";
      this.options = [];
      this.buildList = [];
      (this.depId = ""), (this.empId = ""), (this.depName = "");
      this.EmployeList = [];
    },
    tableRowClassName({ row, rowIndex }) {
      if (!row.invalid) {
        return "";
      }
    },
    //部门
    depHandleClick(data) {
      // this.getEmploye(data.depId)
      this.depId = data.depId;
      this.depName = data.name;

      this.handleNodeClick(data);
    },
    clearDep: function() {
      this.depId = "";
      this.depName = "";
      // this.EmployeList=[]
      this.empId = "";
      this.clearSelect();
    },
    searchDep: function(payload) {
      /*this.DepList=payload.list
      this.contractForm.depName=payload.depName*/
    },
    moreEmploye: function() {
      if (this.EmployeList.length >= this.employeTotal) {
        return;
      } else {
        this.getEmploye(this.depId, ++this.employePage);
      }
    },
    getEmploye: function(val, page = 1, sub = true) {
      this.$ajax
        .get("/api/organize/employees/pages", {
          depId: val,
          pageNum: page,
          selectSubs: sub
        })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            // res.data.list.forEach((element,index) => {
            //   if(element.empId===this.userMsg.user.empId){
            //     res.data.list.splice(index,1)
            //   }
            // });
            this.EmployeList = this.EmployeList.concat(res.data.list);
            this.employeTotal = res.data.total;
            this.EmployeInit = res.data.total;
          }
        });
    }
  },
  computed: {
    getDialogVisible: function() {
      return this.dialogVisible;
    },
    getDialogType: function() {
      return this.dialogType;
    },
    getContractType: function() {
      return this.contractType;
    },
    getChoseHcode: function() {
      return this.choseHcode;
    },
    getChoseGcode: function() {
      return this.choseGcode;
    }
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";

/deep/.margin-left {
  margin-left: 0;
}
.view-container {
  .search_content {
    min-height: 300px;
  }
  .dataList {
    height: 405px;
    min-width: 1000px;
    overflow-y: auto;
  }
  .dataList_ {
    height: 360px;
    min-width: 1000px;
    overflow-y: auto;
  }
  .outSide {
    display: flex;
    justify-content: center;
    align-items: center;
    //box-sizing: border-box;
    //padding: 2px;
    width: 18px;
    height: 18px;
    border: 1px solid #ccc;
    border-radius: 50%;
    .inLine {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .inLineBg {
      background: @color-blue;
    }
  }
  .name-wrapper {
    // display: flex;
    // display: -webkit-box;
    /*!autoprefixer: off */
    // -webkit-box-orient: vertical;
    /* autoprefixer: on */
    // -webkit-line-clamp: 1;
    // overflow: hidden;
    // text-overflow:ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .search_btn {
    padding: 8px 15px;
  }
  .attention {
    display: inline-block;
    width: 10px;
    height: 10px;
    border: 1px solid #ccc;
    border-radius: 2px;
  }
  .attention_ {
    background: @color-blue;
  }
  .floor_btn {
    overflow: hidden;
    display: flex;
    justify-content: flex-end;
    //float: right;
  }
  .noList {
    background: #dedde2;
    padding: 130px 0;
    text-align: center;
  }
}
.search-form_ {
  display: flex;
  justify-content: space-between;
}
/deep/.warning-row {
  background: oldlace;
}
/deep/.el-dialog {
  min-width: 1050px;
  .el-dialog__header {
    padding-top: 15px;
    padding-bottom: 15px;
    .el-dialog__title {
      color: @color-blue;
    }
  }
  .el-dialog__body {
    padding: 20px;
    border-top: 1px solid #edecf0;
  }
  .client_b {
    display: flex;
    justify-content: flex-end;
    .el-button.is-round {
      padding: 8px 20px;
    }
  }
}
/deep/ .pagination-info {
  text-align: center;
  margin-top: 30px;
}
</style>
