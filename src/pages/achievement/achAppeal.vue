<template>
  <div class="layout" style="background-color: #f5f5f5" ref="tableComView">
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
      <el-form :inline="true" :model="propForm" class="prop-form" size="small">
        <el-form-item label="关键字" prop="search">
          <el-tooltip content="合同编号/纸质合同编号/房源编号/客源编号/物业地址/业主/客户/房产证号/手机号" placement="top">
            <el-input
              class="w200"
              v-model="propForm.search"
              placeholder="请输入"
              :trigger-on-focus="false"
              clearable
            ></el-input>
          </el-tooltip>
        </el-form-item>

        <span @click.stop="aplquery(1)" class="shensulink" style="cursor:pointer;">今日申诉</span>
        <span @click.stop="aplquery(2)" class="shensulink" style="cursor:pointer;">三日内申诉</span>
        <el-form-item label="申诉日期" prop="dateMo" class="mr">
          <el-date-picker
            v-model="propForm.dateMo"
            class="w330"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="申诉状态" prop="appealType">
          <el-select v-model="propForm.appealType" class="w120" :clearable="true">
            <el-option
              v-for="item in aplStatuArr"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="签约方式">
          <el-select v-model="propForm.recordType" class="w120" :clearable="true">
            <el-option
              v-for="item in dictionary['64']"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </ScreeningTop>
    <!-- 数据列表 -->
    <div class="data-layout">
      <div class="data-list" v-loading="loading">
        <el-table
          :data="selectAchList"
          style="width: 100%"
          class="info-scrollbar"
          @row-dblclick="enterDetail"
          ref="tableCom"
          :max-height="tableNumberCom"
          border
        >
          <el-table-column label="合同信息" align="left" min-width="200">
            <template slot-scope="scope">
              <p>
                合同：
                <span
                  class="blue"
                  @click="skipContDel(scope.row)"
                  style="cursor:pointer;"
                >{{scope.row.code}}</span>
              </p>
              <p v-if="scope.row.recordType.value===2">
                纸质合同编号:
                <span
                  class="blue"
                  @click="skipContDel(scope.row)"
                  style="cursor:pointer;"
                >{{scope.row.pCode}}</span>
              </p>
              <p>
                房源：
                <span>{{scope.row.houseinfoCode}}</span>
                {{scope.row.ownerName}}
              </p>
              <p>
                客源：
                <span>{{scope.row.guestinfoCode}}</span>
                {{scope.row.customerName}}
              </p>
            </template>
          </el-table-column>

          <el-table-column prop="recordType.label" label="签约方式" min-width="60"></el-table-column>
          <el-table-column label="上传合同主体时间" min-width="90">
            <template slot-scope="scope">
              <p>{{scope.row.uploadTime|formatTime(false)}}</p>
            </template>
          </el-table-column>

          <el-table-column label="申诉状态" min-width="80">
            <template slot-scope="scope">
              <div v-if="scope.row.appealStatus">
                <p v-if="scope.row.appealStatus.value==0" class="green">已处理</p>
                <p v-if="scope.row.appealStatus.value==1" class="orange">未处理</p>
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>

          <el-table-column label="申诉人" min-width="120">
            <template slot-scope="scope">
              <div v-for="item in scope.row.achievementAppeals">
                <p>{{item.appealDepName}}-{{item.appealName}}</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="date" label="申诉时间" min-width="90">
            <template slot-scope="scope">
              <div v-for="item in scope.row.achievementAppeals">
                <p>{{item.appealTime|formatTime(false)}}</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="申诉角色" min-width="100">
            <template slot-scope="scope">
              <div v-for="item in scope.row.achievementAppeals">
                <div v-if="!item.roles||item.roles.length==0">-</div>
                <div v-else>
                  <!-- {{item.roles.join(',')}} -->
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="item.roles.join(',')"
                    placement="top-start"
                  >
                    <p class="dot">{{item.roles.join(',')}}</p>
                  </el-tooltip>

                  <!-- <div  v-for="item in item.roles">
                      <span>{{item}}</span>
                  </div>-->
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="申诉内容" min-width="200">
            <template slot-scope="scope">
              <div v-for="item in scope.row.achievementAppeals">
                <div v-if="item.appealContent.length>10">
                  <el-popover
                    trigger="hover"
                    width="100"
                    :content="item.appealContent"
                    placement="top"
                  >
                    <p class="dot" slot="reference">{{item.appealContent}}</p>
                  </el-popover>
                </div>
                <div v-else-if="item.appealContent.length>0">
                  <p>{{item.appealContent}}</p>
                </div>
                <div v-else>
                  <p>-</p>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="申诉凭证" min-width="100">
            <template slot-scope="scope">
              <div v-for="item2 in scope.row.achievementAppeals">
                <div v-if="item2.voucherUrl&&item2.voucherUrl.length>0">
                  <el-popover
                    placement="right"
                    max-width="200"
                    trigger="hover">
                      <span style="margin:20px" v-for="(item,index) in item2.voucherUrl">
                          <span>
                            <span
                              class="link"
                              slot="reference"
                              @click.stop="previewPhoto(item2.voucherUrl,index)">附件{{index+1}}</span>
                        </span>
                      </span>
                    <span class="link"
                          slot="reference">附件</span>
                  </el-popover>
                </div>
                <div v-else>-</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="审核人" min-width="120">
            <template slot-scope="scope">
              <div v-for="item in scope.row.achievementAppeals">
                <p>{{item.auditDepName}}-{{item.auditName}}</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="审核状态(时间)" min-width="200">
            <template slot-scope="scope">
              <div v-for="item in scope.row.achievementAppeals">
                <div v-if="item.auditStatus">
                  <p v-if="item.auditStatus.value==0">未审</p>
                  <p v-if="item.auditStatus.value==1">通过 {{item.auditTime|formatTime(false)}}</p>
                  <p v-if="item.auditStatus.value==2">驳回 {{item.auditTime|formatTime(false)}}</p>
                </div>
                <div v-else>-</div>
              </div>
            </template>
          </el-table-column>


          <el-table-column label="审核备注" min-width="200">
            <template slot-scope="scope">
              <div v-for="item in scope.row.achievementAppeals">
                <div v-if="item.auditRemarks.length>0">
                  <el-popover trigger="hover" width="200" :content="item.auditRemarks" placement="top">
                    <p class="dot" slot="reference">{{item.auditRemarks}}</p>
                  </el-popover>
                </div>
                <div v-else>-</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="上传业绩分成协议时间" min-width="90">
            <template slot-scope="scope">
              <p v-if="scope.row.agreementUploadTime">{{scope.row.agreementUploadTime|formatTime(false)}}</p>
              <p v-else>-</p>
            </template>
          </el-table-column>

          <el-table-column label="变更/解约" min-width="90">
            <template slot-scope="scope">
              <p v-if="scope.row.statusChange">{{scope.row.statusChange.label}}</p>
              <p v-else>-</p>
            </template>
          </el-table-column>


          <el-table-column label="操作" min-width="70" fixed="right">
            <template slot-scope="scope">
              <div v-if="scope.row.type==0" class="check-btn">
                <span @click.stop="checkAch(scope.row,scope.$index)"
                      v-if="scope.row.auditIds==1&&scope.row.appealStatus.value!=0"
                      style="cursor:pointer;">审核</span>
              </div>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total,prev, pager, next , jumper"
          :total="total"
          v-if="total!=0"
        ></el-pagination>
      </div>
    </div>
    <preview :imgList="previewFiles" :start="previewIndex" v-if="preview" @close="preview=false"></preview>
  </div>
</template>

<script>
    import {MIXINS} from "@/assets/js/mixins";
    import ScreeningTop from "@/components/ScreeningTop";

    export default {
        mixins: [MIXINS],
        data() {
            return {
                imgList: [],
                uploadScane: {path: "shensu", id: ""}, //上传场景值
                people: [],
                htbh: "",
                qysj: "",
                inputMax: 200,
                isSS: false,
                mbrules: ["jpg", "png", "doc", "docx", "pdf", "jpeg", "xlsx", "xls"],
                selectAchList: [], //应收列表数组
                countData: [], //数据统计数组
                houseArr: [], //应收详情房源数组
                clientArr: [], //应收详情客源数组
                checkArr: [], //应收详情审核信息数组
                departs: [], //部门
                depUser: "",
                users: [],
                dialogVisible: false, //详情弹框
                SSuForm: {
                    role: [],
                    remark: "",
                    pinzheng: ""
                },
                // 筛选条件
                propForm: {
                    appealType: 2,
                    dateMo: "",
                    search: "",
                    recordType: ""
                },
                shows: false,
                dialogType: 0, //0代表审核  1代表编辑  2代表反审核  3代表业绩分成
                code: "",
                code2: "",
                dictionary: {
                    //数据字典
                    "10": "", //合同类型
                    "21": "", //分成状态
                    "53": "", //合作方式
                    "64": "" //签约方式
                },
                beginData: false,
                currentPage: 1,
                pageSize: 10,
                comm: "", //业绩分成
                aId: null, //业绩id
                contractId: null, //合同id
                achIndex: null,
                ajaxParam: {},
                total: 0,
                loading: false,
                loading2: false,
                achObj: {},
                recallShow: false,
                smallTips: "",
                statuIndex: null,
                statuContId: null,
                statuType: null,
                statuAid: null,
                aplStatuArr: [
                    {
                        key: 0,
                        value: "全部"
                    },
                    {
                        key: 1,
                        value: "已处理"
                    },
                    {
                        key: 2,
                        value: "未处理"
                    }
                ],
                //权限配置
                power: {
                    "sign-yj-appeal-query": {
                        state: false,
                        name: "查询"
                    },
                    "sign-yj-rev-edit": {
                        state: false,
                        name: "编辑"
                    },
                    "sign-yj-rev-addemp": {
                        state: false,
                        name: "录入分成"
                    },
                    "sign-yj-rev-retreat": {
                        state: false,
                        name: "撤回"
                    },
                    "sign-yj-rev-fs": {
                        state: false,
                        name: "反审核"
                    },
                    "sign-com-htdetail": {
                        state: false,
                        name: "合同详情"
                    },
                    "sign-yj-rev-export": {
                        state: false,
                        name: "导出"
                    }
                },
            };
        },
        created() {
        },
        mounted() {
            this.ajaxParam = {
                pageNum: this.currentPage,
                pageSize: this.pageSize
            };
            this.$nextTick(() => {
                let res = this.getDataList;
                if (res && res.route === this.$route.path) {
                    this.selectAchList = res.data.list;
                    for (let i = 0; i < this.selectAchList.length; i++) {
                        for (
                            let j = 0;
                            j < this.selectAchList[i].achievementAppeals.length;
                            j++
                        ) {
                            // for(let k=0;k<_that.selectAchList[i].achievementAppeals[j].)
                            this.selectAchList[i].achievementAppeals[
                                j
                                ].voucherUrl = this.getPicture(
                                JSON.parse(this.selectAchList[i].achievementAppeals[j].voucherUrl)
                            );
                        }
                    }
                    this.total = res.data.total;

                    let session = JSON.parse(sessionStorage.getItem("sessionQuery")).query;
                    this.propForm.dateMo = session.startTime
                        ? [session.startTime, session.endTime]
                        : [];
                    this.propForm.search = session.keyword;
                    this.propForm.appealType = session.appealStatus;
                    this.currentPage = session.pageNum;
                    this.pageSize = session.pageSize;
                    this.propForm.empName = session.empName;
                    this.propForm.recordType = session.recordType
                    // if(this.propForm.dealAgentId){
                    //     this.dep=Object.assign({},this.dep,{id:this.propForm.dealAgentStoreId,empId:this.propForm.dealAgentId,empName:this.propForm.empName})
                    //     this.EmployeList.unshift({
                    //       empId:this.propForm.dealAgentId,
                    //       name:this.propForm.empName
                    //     })
                    //     this.getEmploye(this.propForm.dealAgentStoreId)
                    //   }

                    this.$nextTick(() => {
                        this.loading = false;
                    });
                } else {
                    this.getData(this.ajaxParam);
                }
            });
            // 字典初始化
            this.getDictionary();
            //部门初始化
            this.remoteMethod();
        },
        computed: {
            userInfo() {
                return this.getUser
            },
            validInput() {
                return this.SSuForm.remark.length
            }
        },
        components: {
            MIXINS,
            ScreeningTop,
        },
        filters: {
            rounding(value) {
                return value.toFixed(2);
            }
        },
        methods: {
            getPicture(item) {
                return this.$tool.cutFilePath(item);
            },
            getData(ajaxParam, typeshow, param) {
                if (typeshow != 1 && param == 2) {
                    this.currentPage = 1;
                }
                this.loading = true;
                let _that = this;
                this.$ajax.get("/api/appeal/getAppealList", ajaxParam).then(res => {
                    let data = res.data;
                    if (res.status === 200) {
                        _that.selectAchList = data.data.list;
                        for (let i = 0; i < _that.selectAchList.length; i++) {
                            for (let j = 0; j < _that.selectAchList[i].achievementAppeals.length; j++) {
                                _that.selectAchList[i].achievementAppeals[j].voucherUrl = this.getPicture(JSON.parse(_that.selectAchList[i].achievementAppeals[j].voucherUrl));
                            }
                        }
                        _that.total = data.data.total;
                        this.$nextTick(() => {
                            this.loading = false;
                        });
                    }
                }).catch(error => {
                    this.$message({message: error});
                    this.$nextTick(() => {
                        this.loading = false;
                    });
                });
            },
            //获取应收列表详情
            enterDetail(row) {
                this.code = row.code;
                let newPage = this.$router.resolve({
                    path: "/achDetial",
                    query: {
                        contCode: row.code,
                        entrance: 3,
                        aId: row.aId,
                        contractId2: row.id,
                        version: this.selectAchList[0].version,
                        contType: row.contType.value
                    }
                });
                window.open(newPage.href, "_blank");
            },
            aplquery(type) {
                this.propForm.dateMo = "";
                if (type == 1) {
                    let today = this.$tool.dateFormat(Date.now())
                    this.propForm.dateMo = [today, today]
                    this.ajaxParam = {
                        keyword: this.propForm.search, //关键字
                        pageNum: this.currentPage,
                        pageSize: this.pageSize,
                        appealStatus: this.propForm.appealType,
                        timeType: 1
                    };
                } else if (type == 2) {
                    let today2 = this.$tool.dateFormat(Date.now())
                    let three2 = this.$tool.dateFormat((Date.now() - 259200000))
                    this.propForm.dateMo = [three2, today2]
                    this.ajaxParam = {
                        keyword: this.propForm.search, //关键字
                        pageNum: this.currentPage,
                        pageSize: this.pageSize,
                        appealStatus: this.propForm.appealType,
                        timeType: 2
                    };
                }

                // this.ajaxParam.pageNum = 1;
                // this.currentPage = 1;
                let param = JSON.parse(JSON.stringify(this.ajaxParam));
                this.getData(this.ajaxParam);
            },
            queryFn(typeshow) {
                if (this.propForm.dateMo) {
                    this.ajaxParam = {
                        startTime: this.propForm.dateMo[0], //开始时间
                        endTime: this.propForm.dateMo[1], //结束时间
                        keyword: this.propForm.search, //关键字
                        pageNum: this.currentPage,
                        pageSize: this.pageSize,
                        appealStatus: this.propForm.appealType,
                        recordType: this.propForm.recordType
                    };
                } else {
                    this.ajaxParam = {
                        keyword: this.propForm.search, //关键字
                        pageNum: this.currentPage,
                        pageSize: this.pageSize,
                        appealStatus: this.propForm.appealType,
                        recordType: this.propForm.recordType
                    };
                }
                // this.ajaxParam.pageNum = 1;
                // this.currentPage = 1;
                let param = JSON.parse(JSON.stringify(this.ajaxParam));
                // delete param.dealAgentStoreId
                // delete param.dealAgentId
                sessionStorage.setItem(
                    "sessionQuery",
                    JSON.stringify({
                        path: "/achAppeal",
                        url: "/appeal/getAppealList",
                        query: Object.assign({}, param, {empName: this.dep.empName}),
                        methods: "get"
                    })
                );
                this.getData(this.ajaxParam, typeshow, 2);
            },
            resetFormFn() {
                this.ajaxParam = {
                    dealAgentStoreId: "", //部门
                    dealAgentId: "", //员工
                    contractType: "", //合同类型
                    distributionType: "", //分成类型
                    achievementStatus: "", //业绩类型
                    startTime: "", //开始时间
                    endTime: "", //结束时间
                    keyword: "", //关键字
                    joinMethods: "",
                    recordType: "",
                    pageNum: this.currentPage,
                    pageSize: this.pageSize
                };
                this.ajaxParam.pageNum = 1;
                this.currentPage = 1;
                this.propForm = {
                    department: "", //部门
                    dealAgentStoreId: "",
                    dealAgentId: "",
                    empName: "",
                    departmentDetail: "", //部门详情（员工）
                    contractType: "", //合同类型
                    divideType: "", //分成类型
                    achType: "", //业绩类型
                    dateMo: "",
                    search: "",
                    joinMethods: "",
                    recordType: ""
                };
                this.EmployeList = [];
            },
            checkAch(value, index) {
                let newPage = this.$router.resolve({
                    path: "/aplPage",
                    query: {
                        aId: value.aId,
                        contractCode: value.code,
                        dialogType: 0,
                        achIndex: index,
                        achObj: JSON.stringify({contractId: value.id}),
                        contractId: value.id,
                        version: this.selectAchList[0].version,
                        contType: value.contType.value
                    }
                });
                window.open(newPage.href, "_blank");
            },
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.ajaxParam.pageNum = val;
                this.currentPage = val;
                this.queryFn(1);
            },
            skipContDel(value) {
                //进入合同详情
                if (this.power["sign-com-htdetail"].state) {
                    let param = {
                        code: value.code
                    };

                    this.$router.push({
                        path: "/contractDetails",
                        query: {
                            id: value.id,
                            code: value.code,
                            contType: value.contType.value
                        }
                    });

                } else {
                    this.noPower("合同详情查看");
                }
            },
        }
    };
</script>

<style scoped lang="less">
  @import "~@/assets/less/lsx.less";
  @import "~@/assets/common.less";

  .layout {
    .check-btn span {
      color: #478de3;
    }

    .check-btn:empty {
      position: relative;

      &:before {
        content: '--';
        display: inline-block;
      }
    }

    .dot {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .sustip {
      position: relative;
      line-height: auto;
      top: 12px;
      font-style: italic;
      padding-left: 0;
      font-size: 12px;
      color: darkseagreen;
    }

    .fileup {
      width: 86px;
      height: 32px;
      line-height: 32px;
      background: rgba(71, 141, 227, 1);
      margin-top: 10px;
      color: white;
      text-align: center !important;
    }

    .check-btn span:first-of-type {
      margin-right: 8px;
    }

    .blue {
      color: #478de3;
    }

    .orange {
      color: #f56c6c;
    }

    .green {
      color: #54d384;
    }

    .text-absolute {
      position: absolute;
      right: 15px;
      color: #d6d6d6;
      bottom: 0;
    }

    .role {
      margin-bottom: 10px;
    }

    // 改变头部面包屑样式
    .head {
      .head-left {
        float: left;

        /deep/ .el-breadcrumb {
          // font-size: 12px !important;
        }

        /deep/ .el-breadcrumb__inner {
          color: #99a1aa !important;
        }

        /deep/ .el-breadcrumb__item:nth-of-type(2) .el-breadcrumb__inner {
          color: #32485f !important;
        }
      }

      .head-right {
        float: right;
      }
    }

    //  筛选条件
    .filter-layout {
      // min-height: 180px;
      background-color: #fff;
      padding: 20px;
      padding-bottom: 0px;
      position: relative;

      .btn {
        width: 56px;
        height: 17px;
        position: absolute;
        bottom: -17px;
        left: 50%;
        margin-left: -28px;
        z-index: 9;
        background: url(../../assets/img/icon-dowm.png) no-repeat center center;
        background-size: 56px auto;
        cursor: pointer;
      }

      .filter-left {
        h1 {
          // font-size: 18px;
          color: #233241;
          position: relative;
          padding-left: 28px;

          b {
            position: absolute;
            width: 16px;
            height: 16px;
            // background-color: red;
            left: 0px;
            top: 50%;
            margin-top: -8px;
          }
        }
      }

      .filter-right {
        .el-button--primary {
          width: 100px;
          height: 36px;
          border-radius: 18px;
          line-height: 36px;
          padding: 0;
        }

        .el-button--primary:first-of-type {
          background-color: #fff;
          color: #32485f;
          border: 2px solid #e8eaf6;
        }

        .el-button--primary:nth-of-type(2) {
          background-color: #478de3;
          color: #fff;
          border: 0;
        }
      }
    }

    //数据列表

    .data-layout {
      padding: 10px;
      padding-top: 0;
      background-color: #fff;
      margin-top: 20px;
      padding-bottom: 0;

      .table-tool {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: @margin-base 0;

        .tool-left {
          display: inherit;
          align-items: center;

          > h4 {
            > i {
              margin-right: 8px;
            }
          }

          > ul {
            display: flex;
            margin-left: 20px;

            > li {
              color: @color-6c;
            }
          }
        }

        /*>p{
          position: absolute;
          top: 50%;
          right: 0;
          transform:translateY(-50%);
        }*/
      }
    }

    // 展示数据
    .data-list {
      padding-top: @margin-10;
      width: 100%;

      /deep/ .el-table {
        // font-size: 14px !important;
        td,
        th {
          padding: 24px 0;
        }

        .el-table__header {
          th {
            padding: 6px 0;
            background-color: #eef2fb;
          }
        }
      }
    }

    //业绩详情弹框改变样式
    /deep/ .el-dialog.base-dialog {
      // max-width: 1000px;
      margin: 13vh auto 0 !important;
      // overflow: auto;
      padding-bottom: 30px;

      .el-dialog__headerbtn {
        right: 0;
        top: 0;
        display: none !important;
      }

      b {
        position: absolute;
        right: 30px;
        top: 30px;
        font-size: 30px;
      }

      .ach-header {
        min-height: 70px;
        min-width: 100%;
        background-color: #fff;
        border-bottom: 1px solid #edecf0;
        overflow: hidden;

        h1 {
          font-size: 20px;
          color: #233241;
          margin: 20px 0 0 20px;
        }

        p {
          // font-size: 14px;
          color: #6c7986;
          margin: 12px 0 0 20px;
          line-height: 0;
        }
      }

      /deep/ .ach-body {
        // background-color: pink;
        padding: 0 20px !important;
        box-sizing: border-box;
        // overflow-y: scroll!important;
        max-height: 500px;

        /deep/ .el-table {
          // font-size: 14px !important;
          margin-top: 20px;
          // td,
          // th {
          //   padding: 24px 0;
          // }
          .el-table__header {
            // height: 55px;
            th {
              padding: 0;
              background-color: #eef2fb;

              .cell {
                // background-color: pink;
                // height: 55px;
                // line-height: 55px;
              }
            }
          }

          // .el-table__header th .cell {
          //   height: 30px;
          //   line-height: 30px;
          // }
        }

        //弹框审核信息
        h1 {
          font-size: 16px;
          color: #233241;
          margin: 13px 0 0 0px;
        }
      }

      /deep/ .el-dialog__header,
      /deep/ .el-dialog__footer,
      /deep/ .el-dialog__body {
        padding: 0 !important;
      }

      /deep/ .el-dialog__header {
        .el-dialog__headerbtn {
          right: 0;
          top: 0;
          display: none;
        }
      }
    }

    /deep/ .ach-body {
      overflow: auto;
    }
  }

  /deep/ tr.el-table__row {
    overflow: scroll !important;
  }

  .w430 {
    width: 430px;
  }

  .sure-layout {
    /deep/ .sure-dialog {
      width: 450px;
      height: 200px;
      overflow: hidden;
      // .el-table__header {
      //   padding-bottom: 60px;
      // }
      .tips {
        margin-left: 10px;
        font-size: 18px;
        padding-top: 20px;
        display: block;
        padding-bottom: 30px;
      }
    }

    .el-dialog__body {
      padding: 0 !important;
    }
  }

  .ssu {
    display: flex;

    p {
      display: flex;
      align-items: center;
      margin-right: 30px;
      height: 37px;

      span {
        min-width: 70px;
        margin-right: 8px;
      }
    }
  }

  .el-dialog.base-dialog .ach-body {
    padding: 0 20px;
    max-height: 500px;
  }

  /deep/ .el-dialog.base-dialog .el-dialog__header {
    padding: 0 !important;
  }

  .el-pagination {
    text-align: right !important;
    // padding-bottom: 50px;
    // padding-top: 50px;
  }

  .name-wrapper {
    display: flex;
    display: -webkit-box;
    /*!autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /deep/ .btn-text-info {
    font-size: 12px !important;
  }

  .width200 {
    width: 200px !important;
  }

  .width325 {
    width: 325px !important;
  }

  .width300 {
    width: 300px !important;
  }

  .width425 {
    width: 425px !important;
  }

  .name-wrapper {
    min-width: 80px;
    max-height: 65px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
  }

  .isFlex {
    display: flex;
    align-items: center;
  }

  .link {
    color: #478de3;
    cursor: pointer;
  }

  .shensulink {
    font-size: 14px;
    color: #478de3;
    margin-right: 8px;
    position: relative;
    top: 6px;
  }

  /deep/ .el-tooltip__popper {
    width: 300px !important
  }
</style>
