<template>
  <div class="layout" style="background-color: #f5f5f5" ref="tableComView">
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
      <el-form :inline="true" :model="propForm" class="prop-form" size="small">
        <el-form-item label="关键字" prop="search">
          <el-tooltip content="合同编号/房源编号/客源编号/物业地址/业主/客户/房产证号/手机号" placement="top">
            <el-input
              class="w200"
              v-model="propForm.search"
              placeholder="请输入"
              :trigger-on-focus="false"
              clearable
            ></el-input>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="签约日期" prop="dateMo" class="mr">
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

        <!-- 部门 -->
        <el-form-item label="部门" style="margin-left:20px;">
          <!-- <el-select :clearable="true" ref="tree" size="small" :loading="Loading" :remote-method="remoteMethod" @visible-change="initDepList" @clear="clearDep"   v-model="propForm.department" placeholder="请选择">
                <el-option class="drop-tree" value="">
                  <el-tree :data="DepList" :props="defaultProps" @node-click="depHandleClick"></el-tree>
                </el-option>
          </el-select>-->
          <select-tree
            :data="DepList"
            :init="propForm.department"
            @checkCell="depHandleClick"
            @clear="clearDep"
            @search="searchDep"
          ></select-tree>
        </el-form-item>

        <el-form-item>
          <el-select
            :clearable="true"
            v-loadmore="moreEmploye"
            @change="handleEmpNodeClick"
            class="margin-left"
            size="small"
            v-model="propForm.dealAgentId"
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

        <el-form-item label="合同类型" prop="contractType">
          <el-select
            v-model="propForm.contractType"
            class="width200"
            :class="{'width325':propForm.contractType.length>3}"
            :clearable="true"
            multiple
          >
            <el-option
              v-for="item in dictionary['10']"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分成类型" prop="divideType">
          <el-select v-model="propForm.divideType" class="w120" :clearable="true">
            <el-option
              v-for="item in dictionary['21']"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="业绩状态" prop="achType">
          <el-select v-model="propForm.achType" class="w120" :clearable="true">
            <el-option
              v-for="item in achStatuArr"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
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

        <el-form-item label="合作方式" prop="contractType">
          <el-select v-model="propForm.joinMethods" class="w120" :clearable="true">
            <el-option
              v-for="item in dictionary['53']"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </ScreeningTop>

    <!-- 筛选条件 end -->
    <!-- 数据列表 -->
    <div class="data-layout">
      <!-- 头部 -->
      <div class="table-tool">
        <div class="tool-left">
          <h4 class="f14">
            <i class="iconfont icon-tubiao-11"></i>数据列表
          </h4>
          <ul>
            <li>
              <span>
                总分成：
                <b class="orange">{{countData[3] ?countData[3] :'0'}}元</b>，
              </span>
            </li>
            <li>
              <span>分类分成：</span>
            </li>
            <li>
              <span>
                出售：
                <b class="orange">{{countData[1] ?countData[1] :'0'}}元</b>，
              </span>
            </li>
            <li>
              <span>
                代办：
                <b class="orange">{{countData[2] ?countData[2] :'0'}}元</b>，
              </span>
            </li>
            <li>
              <span>
                出租：
                <b class="orange">{{countData[0] ?countData[0] :'0'}}元</b>
              </span>
            </li>
          </ul>
        </div>
        <p>
          <el-button
            class="f_r"
            round
            type="primary"
            size="medium"
            @click="getExcel"
            style="padding:9px 15px;min-width: 80px;"
            v-if="power['sign-yj-rev-export'].state"
          >导出</el-button>
        </p>
      </div>
      <!-- 头部 end -->

      <!-- 表格 -->
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

          <el-table-column label="业绩状态" align="center" min-width="80">
            <template slot-scope="scope">
              <p v-if="scope.row.achievementState==-1" class="blue" style="cursor:text">待提审</p>
              <p v-if="scope.row.achievementState==0" class="blue" style="cursor:text">审核中</p>
              <p v-if="scope.row.achievementState==1" class="green">已通过</p>
              <p v-if="scope.row.achievementState==2" class="orange">已驳回</p>
            </template>
          </el-table-column>

          <el-table-column label="申诉状态" align="center" min-width="80">
            <template slot-scope="scope">
              <p v-if="scope.row.appealStatus.value==-1" class="blue" style="cursor:text">未申诉</p>
              <p v-if="scope.row.appealStatus.value==0" class="blue" style="cursor:text">已处理</p>
              <p v-if="scope.row.appealStatus.value==1" class="green">未处理</p>
            </template>
          </el-table-column>

          <el-table-column label="合同类型" align="center" min-width="60">
            <template slot-scope="scope">
              <p>{{scope.row.contType.label}}</p>
            </template>
          </el-table-column>

          <el-table-column prop="propertyAddr" label="物业地址" align="center" min-width="120"></el-table-column>

          <el-table-column label="成交经纪人" align="center" min-width="120">
            <template slot-scope="scope">
              <p v-if="scope.row.dealName">{{scope.row.dealStorefront}}-{{scope.row.dealName}}</p>
              <p v-else>暂无</p>
            </template>
          </el-table-column>

          <el-table-column prop="date" label="签约日期" align="center" min-width="90">
            <template slot-scope="scope">
              <p>{{scope.row.signDate|formatDate}}</p>
            </template>
          </el-table-column>

          <el-table-column label="分成类型" align="center" min-width="60">
            <template slot-scope="scope">
              <!-- 目前一期分成类型只有业绩，暂时写死 -->
              <p>业绩</p>
            </template>
          </el-table-column>

          <el-table-column label="分成人" align="center" min-width="200">
            <template slot-scope="scope">
              <div v-if="scope.row.distributions.length==0">
                <div>--</div>
              </div>
              <div v-else>
                <div v-for="item in scope.row.distributions">
                  <p>{{item.level4}}-{{item.assignor}}</p>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="角色类型" align="center" min-width="90">
            <template slot-scope="scope">
              <div v-if="scope.row.distributions.length==0">
                <div>--</div>
              </div>
              <div v-else>
                <div v-for="item in scope.row.distributions">
                  <div>
                    <p>{{item.roleName}}</p>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="分成比例" align="center" min-width="60">
            <template slot-scope="scope">
              <div v-if="scope.row.distributions.length==0">
                <div>--</div>
              </div>
              <div v-else>
                <div v-for="item in scope.row.distributions">
                  <p>{{item.ratio}}%</p>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="特许费比例（%）" align="center" min-width="60">
            <template slot-scope="scope">
              <div v-if="scope.row.distributions.length==0">
                <div>--</div>
              </div>
              <div v-else>
                <div v-for="item in scope.row.distributions">
                  <p>{{item.platformFeeRatio}}%</p>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column align="center" min-width="90">
            <template slot="header" slot-scope="scope">
              应收分成金额（元）
              <el-tooltip content="应收分成金额=个人应收佣金-特许费（未减去收款手续费）" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <div v-if="scope.row.distributions.length==0">
                <div>--</div>
              </div>
              <div v-else>
                <p v-for="item in scope.row.distributions">{{item.aMoney}}</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="当前审核人" align="center" min-width="120">
            <template slot-scope="scope">
              <p
                v-if="scope.row.achievementState==0"
              >{{scope.row.auditDepName?scope.row.auditDepName:'-'}}-{{scope.row.auditName?scope.row.auditName:'-'}}</p>
              <p v-else>-</p>
              <el-button
                type="text"
                @click="choseCheckPerson(scope.row,userInfo&&userInfo.empId===scope.row.auditId?2:1)"
                v-if="((userInfo&&userInfo.empId==scope.row.preAuditId)||scope.row.auditId===userInfo.empId)&&scope.row.achievementState==0"
              >{{userInfo&&userInfo.empId===scope.row.auditId?'转交审核人':'设置审核人'}}</el-button>
            </template>
          </el-table-column>

          <el-table-column label="下一步审核人" align="center" min-width="120">
            <template slot-scope="scope">
              <p
                v-if="scope.row.achievementState==0"
              >{{scope.row.nextAuditDepName?scope.row.nextAuditDepName:'-'}}-{{scope.row.nextAuditName?scope.row.nextAuditName:'-'}}</p>
              <p v-else>-</p>
              <el-button
                type="text"
                style="color:red"
                @click="choseCheckPerson(scope.row,3)"
                v-if="(userInfo&&scope.row.auditId===userInfo.empId&&(scope.row.nextAuditId!==0))&&scope.row.achievementState==0"
              >设置审核人</el-button>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.isModify==0">
                <div v-if="scope.row.achievementState==-1" class="check-btn">
                  <span
                    @click.stop="editAch(scope.row,scope.$index)"
                    style="cursor:pointer;"
                    v-if="power['sign-yj-rev-edit'].state"
                  >确认业绩</span>
                  <span
                    @click.stop="shenSu(scope.row,scope.$index)"
                    style="cursor:pointer;"
                    v-if="power['sign-yj-rev-appeal'].state"
                  >申诉</span>
                </div>

                <div v-if="scope.row.achievementState==1" class="check-btn">
                  <span
                    @click.stop="againCheck(scope.row,scope.$index)"
                    style="cursor:pointer;"
                    v-if="power['sign-yj-rev-fs'].state&&(userInfo&&scope.row.finalAuditorId===userInfo.empId)"
                  >反审核</span>
                  <span
                    @click.stop="shenSu(scope.row,scope.$index)"
                    style="cursor:pointer;"
                    v-if="power['sign-yj-rev-appeal'].state"
                  >申诉</span>
                </div>

                <div v-if="scope.row.achievementState==2" class="check-btn">
                  <span
                    @click.stop="editAch(scope.row,scope.$index)"
                    style="cursor:pointer;"
                    v-if="power['sign-yj-rev-edit'].state"
                  >确认业绩</span>
                  <span
                    @click.stop="shenSu(scope.row,scope.$index)"
                    style="cursor:pointer;"
                    v-if="power['sign-yj-rev-appeal'].state"
                  >申诉</span>
                </div>

                <div v-if="scope.row.achievementState==0" class="check-btn">
                  <div v-if="power['sign-yj-rev-retreat'].state||power['sign-yj-rev-appeal'].state||(userInfo&&userInfo.empId==scope.row.auditId)">
                      <span
                        @click.stop="chehui(scope.row,scope.$index)"
                        style="cursor:pointer;"
                        v-if="power['sign-yj-rev-retreat'].state"
                      >撤回</span>
                      <span
                        @click.stop="shenSu(scope.row,scope.$index)"
                        style="cursor:pointer;"
                        v-if="power['sign-yj-rev-appeal'].state"
                      >申诉</span>
                      <span
                        @click.stop="checkAch(scope.row,scope.$index)"
                        style="cursor:pointer;"
                        v-if="userInfo&&userInfo.empId==scope.row.auditId"
                      >审核</span>
                  </div>
                 <span v-else>-</span>
                  <!-- <span
                    v-if="userInfo&&userInfo.empId!=scope.row.auditId&&scope.row.arraignmentId!=userInfo.empId"
                  >-</span> -->
                </div>
              </div>
              <div v-else>
                <p>-</p>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total,prev, pager, next , jumper"
          :total="total"
          v-if="total!=0"
        ></el-pagination>
      </div>
      <!-- 分页 -->
      <!-- <div class="pagination" v-if="total!=0">

      </div>-->
    </div>

    <!-- 表单列表弹出框（业绩详情） -->
    <div>
      <el-dialog
        :visible.sync="dialogVisible"
        width="1000px"
        :close-on-click-modal="false"
        custom-class="base-dialog"
      >
        <div v-loading="loading2">
          <b class="el-icon-close" @click="closeDialog"></b>
          <div class="ach-header">
            <h1 class="f14">业绩详情</h1>
            <p class="f14" style="font-weight:bold;">
              可分配业绩：
              <span class="orange">{{comm}}元</span>
              <span>（可分配业绩=客户佣金+业主佣金-第三方合作费）</span>
            </p>
          </div>
          <div class="ach-body">
            <h1 class="f14">房源方分成</h1>
            <div class="ach-divide-list">
              <el-table :data="houseArr" style="width: 100%" border>
                <!-- roleType 分成人角色类型 :
             房源>0:录入、1:维护、2:独家、3:房勘、4:钥匙、5:委托、6:建盘
                客源>7:主客方、8:推荐人、9:签约人、10:A/M、11:协议方、12:协议方2-->
                <el-table-column label="角色类型" width="100">
                  <template slot-scope="scope">
                    <div>
                      <p>{{scope.row.roleName}}</p>
                    </div>
                  </template>
                </el-table-column>

                <!-- ratio -->
                <el-table-column prop="ratio"></el-table-column>

                <!-- assignor -->
                <el-table-column prop="assignor" label="经纪人" width="100"></el-table-column>

                <!-- isJob  在职状态(0:离职  1:在职 2:待入职) -->
                <el-table-column label="在职状况" width="75">
                  <template slot-scope="scope">
                    <div v-if="scope.row.isJob">
                      <p>{{scope.row.isJob.label}}</p>
                    </div>
                  </template>
                </el-table-column>

                <!-- shopkeeper -->
                <el-table-column prop="shopkeeper" label="店长" width="100"></el-table-column>
                <!-- level4 -->
                <el-table-column prop="level4" label="单组" width="135"></el-table-column>
                <!-- level3 -->
                <el-table-column prop="level3" label="门店" width="135"></el-table-column>

                <!-- amaldar -->
                <el-table-column prop="amaldar" label="总监" width="100"></el-table-column>

                <!-- manager -->
                <el-table-column prop="manager" label="副总"></el-table-column>
                <el-table-column label="公共业绩">
                  <template slot-scope="scope">
                    <div v-if="scope.row.place==-1">--</div>
                    <div v-if="scope.row.place==0">门店公共业绩</div>
                    <div v-if="scope.row.place==1">公司公共业绩</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <h1 class="f14">客源方分成</h1>
            <div class="ach-divide-list">
              <el-table :data="clientArr" style="width: 100%" border>
                <!-- roleType 分成人角色类型 :
                房源>0:录入、1:维护、2:独家、3:房勘、4:钥匙、5:委托、6:建盘
                客源>7:主客方、8:推荐人、9:签约人、10:A/M、11:协议方、12:协议方2-->
                <el-table-column label="角色类型" width="100">
                  <template slot-scope="scope">
                    <div>
                      <p>{{scope.row.roleName}}</p>
                    </div>
                  </template>
                </el-table-column>

                <!-- ratio -->
                <el-table-column prop="ratio" label="分成比例(%)" width="100"></el-table-column>

                <!-- assignor -->
                <el-table-column prop="assignor" label="经纪人" width="100"></el-table-column>

                <!-- isJob  在职状态(0:离职  1:在职 2:待入职) -->
                <el-table-column label="在职状况" width="75">
                  <template slot-scope="scope">
                    <div v-if="scope.row.isJob">
                      <p>{{scope.row.isJob.label}}</p>
                    </div>
                  </template>
                </el-table-column>

                <!-- shopkeeper -->
                <el-table-column prop="shopkeeper" label="店长" width="100"></el-table-column>
                <!-- level4 -->
                <el-table-column prop="level4" label="单组" width="135"></el-table-column>
                <!-- level3 -->
                <el-table-column prop="level3" label="门店" width="135"></el-table-column>

                <!-- amaldar -->
                <el-table-column prop="amaldar" label="总监" width="100"></el-table-column>

                <!-- manager -->
                <el-table-column prop="manager" label="副总"></el-table-column>
                <el-table-column label="公共业绩">
                  <template slot-scope="scope">
                    <div v-if="scope.row.place==-1">--</div>
                    <div v-if="scope.row.place==0">门店公共业绩</div>
                    <div v-if="scope.row.place==1">公司公共业绩</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <h1 class="f14">审核信息</h1>

            <div class="ach-check-list">
              <el-table :data="checkArr" border>
                <!-- examineDate -->
                <el-table-column label="时间" width="150">
                  <template slot-scope="scope">
                    <p v-if="scope.row.examineDate">{{scope.row.examineDate|formatTime}}</p>
                    <p v-else>-</p>
                  </template>
                </el-table-column>
                <!-- auditorDepartment -->
                <el-table-column prop="auditor" label="姓名" width="220"></el-table-column>
                <!-- auditor -->
                <el-table-column prop="auditorDepartment" label="职务" width="150"></el-table-column>

                <!-- 节点名称（新增）-->
                <!-- <el-table-column
              prop="updateByName"
              label="节点名称"
              width="130"
            >
                </el-table-column>-->

                <!-- result审核结果(0未审核 1通过 2驳回)(薪资组审核) -->
                <el-table-column prop="createDepName" label="操作" width="150">
                  <!-- <template slot-scope="scope">
                <div>
                  <div v-if="scope.row.contType==0">
                    <p class="blue">提交审核</p>
                  </div>
                  <div v-if="scope.row.contType==-1">
                    <p class="blue">待提审</p>
                  </div>
                  <div v-else-if="scope.row.contType==1">
                    <p class="green">审核通过</p>
                  </div>
                  <div v-else-if="scope.row.contType==2">
                    <p class="orange">已驳回</p>
                  </div>
                 <div v-else-if="scope.row.contType==3">
                    <p class="orange">撤销</p>
                  </div>
                  <div v-else>
                    <p>-</p>
                  </div>
                </div>
                  </template>-->
                </el-table-column>

                <!-- remark -->
                <el-table-column label="备注">
                  <template slot-scope="scope">
                    <div v-if="scope.row.remark">
                      <el-popover
                        trigger="hover"
                        placement="top"
                        :content="scope.row.remark"
                        width="150"
                      >
                        <div
                          style="width:160px"
                          slot="reference"
                          class="name-wrapper"
                        >{{scope.row.remark}}</div>
                      </el-popover>
                    </div>
                    <div v-else>--</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="ach-footer"></div>
        </div>
      </el-dialog>
    </div>

    <!-- 审核，编辑，反审核，业绩分成弹框 -->
    <achDialog
      :shows="shows"
      @saveData="saveData"
      @adoptData="adoptData"
      @rejectData="rejectData"
      @close="closeDialogs"
      @opens="shows=true"
      :dialogType="dialogType"
      :contractCode="code2"
      :aId="aId"
      :achIndex="achIndex"
      :achObj="achObj"
    ></achDialog>

    <!-- 撤回提审弹框 -->
    <div class="sure-layout">
      <el-dialog
        :title="'操作-'+smallTips"
        :visible.sync="recallShow"
        :close-on-click-modal="false"
        custom-class="sure-dialog"
      >
        <span class="tips">是否确认{{smallTips}}?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="recallShow = false">取 消</el-button>
          <el-button type="primary" @click="changeStatus" v-dbClick>确 定</el-button>
        </span>
      </el-dialog>
    </div>
      <!-- 申诉弹窗 -->
      <el-dialog :closeOnClickModal="$tool.closeOnClickModal" @close="close2" width="1000px" height="450px" class="ssdialog"  title="申诉" :visible.sync="isSS">
            <div class="ssu">
              <p class="dot" ><span class="jianju">合同编号：</span>{{htbh}}</p>
              <p style="width:300px">签约时间：{{qysj}}</p>
              <p style="width:300px" v-if="userInfo">申诉人：{{userInfo.name}}</p>
            </div>
            <div class="role">
              <span class="point jianju">申诉角色：</span>
              <el-select v-model="SSuForm.role" placeholder="请选择" multiple 
              class="width300"
              :class="{'width425':SSuForm.role.length>3}"
              :clearable="true">
                    <el-option v-for="item in people" :key="item.code" :label="item.description"  :value="item.code"></el-option>
              </el-select>
            </div>
            <div class="role">
              <span class="point jianju" style="margin-right:25px;">审核人：</span>{{depName}}
              <el-select v-model="SSuForm.empNames" style="margin-left:22px;width:210px" placeholder="请选择"  
               @change="getName">
                    <el-option v-for="item in this.empNames" :key="item.empId" :label="item.name"  :value="item.empId"></el-option>
              </el-select>
            </div>
             <div class="input-group" style="align-items: normal;position:relative">
                    <span class="point jianju" style="min-width:78px">申诉内容：</span>
                    <el-input type="textarea" :rows="4" resize='none' v-model="SSuForm.remark" placeholder="无备注内容" :maxlength="inputMax"></el-input>
                     <span class="text-absolute">{{validInput}}/{{inputMax}}</span>
              </div>
              <div class="input-group" style="align-items: normal">
                <span class="jianju">申诉凭证：</span>
                <div>
                  <fileUp @getUrl='getAdd' :scane="uploadScane" :more=true :rules="mbrules" id='pinzheng' class='fileup'>选择文件</fileUp>
                  <!-- <span class="sustip" v-show="this.SSuForm.pinzheng.length!=0">{{this.SSuForm.pinzheng.length}}个上传成功！</span> -->
                  <div class="sustip" v-show="SSuForm.pinzheng&&SSuForm.pinzheng.length!=0">
                    <!-- {{this.SSuForm.pinzheng}} -->
                    <span style="margin-right:20px"   v-for="(item,index) in SSuForm.pinzheng">
                          <span class="closepre">
                            <span
                          class="link"
                          slot="reference"
                          @click.stop="previewPhoto(SSuForm.pinzheng,index)">附件{{index+1}}
                            </span>
                            <i class="el-icon-close" @click="cutfile(index)"></i>
                        </span>
                    </span>
                  </div>
                </div>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button @click="submitForm" type="primary" size="small" round class="paper-btn paper-btn-blue" v-dbClick>确 定</el-button>
              </div>
      </el-dialog>
    <!-- 选择审核人弹框 -->
    <checkPerson
      :show="checkPerson.state"
      :type="checkPerson.type"
      :bizCode="checkPerson.code"
      :flowType="checkPerson.flowType"
      @close="checkPerson.state=false"
      v-if="checkPerson.state"
      @submit="personChose"
      :showLabel="checkPerson.label"
      :page="checkPerson.page"
    ></checkPerson>
    <preview :imgList="previewFiles" :start="previewIndex" v-if="preview" @close="preview=false"></preview>
  </div>
</template>

<script>
// 引入审核，编辑，反审核，分成弹框
import achDialog from "./achDialog";
import { MIXINS } from "@/assets/js/mixins";
import ScreeningTop from "@/components/ScreeningTop";
import checkPerson from "@/components/checkPerson";
export default {
  mixins: [MIXINS],
  name: "actualAchievement",
  data() {
    return {
      pinzheng2:[],
      imgList:[],
      roleName:'',
      auditName:'',
      depName:'',
      uploadScane:{path:'shensu',id:''},//上传场景值
      people:[],
      htbh:'',
      yjId:'',
      qysj:'',
      inputMax:200,
      isSS:false,
      mbrules:['jpg','png','doc','docx','pdf','jpeg','xlsx','xls'],
      selectAchList: [], //应收列表数组
      countData: [], //数据统计数组
      houseArr: [], //应收详情房源数组
      clientArr: [], //应收详情客源数组
      checkArr: [], //应收详情审核信息数组
      departs: [], //部门
      depUser: "",
      users: [],
      empNames:[],
      dialogVisible: false, //详情弹框
      SSuForm:{
        role:[],
        remark:'',
        empNames:'',
        auditName:'',
        pinzheng:[],
      },
      // 筛选条件
      propForm: {
        department: "", //部门
        dealAgentStoreId: "",
        dealAgentId: "",
        departmentDetail: "", //部门详情（员工）
        contractType: "", //合同类型
        divideType: "", //分成类型
        achType: "", //业绩类型
        appealType:'', //申诉状态
        dateMo: "",
        search: "",
        joinMethods: "" //合作方式
      },
      shows: false,
      dialogType: 0, //0代表审核  1代表编辑  2代表反审核  3代表业绩分成
      code: "",
      code2: "",
      dictionary: {
        //数据字典
        "10": "", //合同类型
        "21": "", //分成状态
        "53": "" //合作方式
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
      achStatuArr: [
        {
          key: -1,
          value: "待提审"
        },
        {
          key: 0,
          value: "审核中"
        },
        {
          key: 1,
          value: "已通过"
        },
        {
          key: 2,
          value: "已驳回"
        }
      ],
      aplStatuArr: [
        {
          key: -1,
          value: "未申诉"
        },
        {
          key: 0,
          value: "已处理"
        },
        {
          key: 1,
          value: "未处理"
        },
        {
          key: 2,
          value: "全部"
        }
      ],
      //权限配置
      power: {
        "sign-yj-rev-appeal": {
          state: false,
          name: "申诉"
        },
        "sign-yj-rev-query": {
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
      checkPerson: {
        state: false,
        type: "init",
        code: "",
        label: false,
        flowType: 0,
        page: "list"
      }
    };
  },
  created(){
    
    

    
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
        // this.selectAchList.forEach((item, index) => {
        //   for (let i = 0; i < item.distributions.length; i++) {
        //     item.distributions[i].aMoney =
        //       Math.floor(this.mul(item.distributions[i].aMoney, 100)) / 100;
        //   }
        // });
        this.total = res.data.total;
        if (res.data.list[0]) {
          this.countData = res.data.list[0].contractCount;
        } else {
          this.countData = [0, 0, 0, 0];
        }
        
        let session = JSON.parse(sessionStorage.getItem("sessionQuery")).query;
        this.propForm.contractType = session.contractType.split(",");
        this.propForm.divideType = session.distributionType;
        this.propForm.achType = session.achievementStatus;
        this.propForm.dealAgentStoreId=session.dealAgentStoreId
        this.propForm.dealAgentId=session.dealAgentId
        this.propForm.appealType=session.appealStatus
        this.propForm.dateMo = session.startTime
          ? [session.startTime, session.endTime]
          : [];
        this.propForm.search = session.keyword;
        this.currentPage = session.pageNum;
        this.pageSize = session.pageSize;
        this.propForm.empName=session.empName
        this.propForm.department=session.department
        this.propForm.joinMethods = session.joinMethods;
        if (this.propForm.contractType[0] != "") {
          for (let i = 0; i < this.propForm.contractType.length; i++) {
            this.propForm.contractType[i] = Number(
              this.propForm.contractType[i]
            );
          }
        } else {
          this.propForm.contractType = [];
        }
        if(this.propForm.dealAgentId){
            this.dep=Object.assign({},this.dep,{id:this.propForm.dealAgentStoreId,empId:this.propForm.dealAgentId,empName:this.propForm.empName})
            this.EmployeList.unshift({
              empId:this.propForm.dealAgentId,
              name:this.propForm.empName
            })
            this.getEmploye(this.propForm.dealAgentStoreId)
          }
         
        
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
      userInfo(){
        return this.getUser.user
      },
      validInput() {
        // debugger
        return this.SSuForm.remark.length
        }
      },
  components: {
    achDialog,
    MIXINS,
    ScreeningTop,
    checkPerson
  },
  filters: {
    rounding(value) {
      return value.toFixed(2);
    }
  },
  methods: {
    close2(){
          this.yjId=''
          this.SSuForm.role=[]
          this.SSuForm.remark=''
          this.SSuForm.pinzheng=[]
          this.depName=''
          this.SSuForm.empNames=''
          this.auditName=''
          this.roleName=''
    },
    cutfile(index){
      this.SSuForm.pinzheng.splice(index,1)

    },
    getName(val){
      for(let i=0;i<this.empNames.length;i++){
        if(val==this.empNames[i].empId){
            this.auditName=this.empNames[i].name
            this.depName=this.empNames[i].depName
            this.roleName=this.empNames[i].roleName
        }
      }
    },
    trim(str){  
                 return str.replace(/(^\s*)|(\s*$)/g, "")
            },
    submitForm(){
      if(this.SSuForm.role.length==0){
        this.$message('申诉角色不能为空！')
        return
      }
      if(this.trim(this.SSuForm.remark).length==0){
        this.$message('申诉内容不能为空！')
        return
      }
      if(this.auditName==''){
        this.$message('审核人不能为空！')
        return
      }
      let arr2=[]
      let arr=JSON.parse(JSON.stringify(this.SSuForm.pinzheng))
       for(let i=0;i<arr.length;i++){
        arr2.push(arr[i].path+'?'+arr[i].name)
      }
      let param={
          achievementId :this.yjId,
          appealRole:this.SSuForm.role.join(','),
          appealContent:this.SSuForm.remark,
          voucherUrl:arr2,
          auditDepName:this.depName,
          auditId:this.SSuForm.empNames,
          auditName:this.auditName,
          auditPostionName:this.roleName,
      }
      if(this.power['sign-yj-rev-appeal'].state){
        this.$ajax.postJSON('/api/appeal/saveAppealInfo',param,2).then(res=>{
          if(res.status==200){
              this.isSS=false
              this.yjId=''
              this.SSuForm.role=[]
              this.SSuForm.remark=''
              this.SSuForm.pinzheng=[]
              this.SSuForm.empNames=''
              this.auditName=''
              this.roleName=''
              this.$message({message: '提交成功！'})
              this.getData(this.ajaxParam);
          }
        }).catch(error=>{
          if(error.message==='下一节点审批人不存在'){
              this.checkPerson.flowType=2;
              this.checkPerson.code= this.yjId;
              this.checkPerson.state=true
              this.checkPerson.type=error.data.type;

            }else{
              this.$message({
                message:error,
                type: "error"
              })
            }
            this.isSS=false
            this.getData(this.ajaxParam);
        })
       }else{
              this.noPower(this.power['sign-yj-rev-appeal'].name)
        }
    },
    getAdd(obj){
      // this.files=obj
      // for(let i=0;i<obj.param.length;i++){
      //   this.SSuForm.pinzheng.push(obj.param[i].path+'?'+obj.param[i].name)
      // }
      // this.imgList=this.$tool.cutFilePath(this.files)
      
      this.SSuForm.pinzheng=this.SSuForm.pinzheng.concat(obj.param)
      },
    getPicture(item){
        return this.$tool.cutFilePath(item)
      },
    shenSu(row,index){
      this.uploadScane.id=row.code
      this.htbh=row.code
      this.yjId=row.aId
      this.qysj=this.$tool.dateFormat(row.signDate)
      this.$ajax.get("/api/appeal/launchAppeal",{aId:`${this.yjId}`}).then(res=>{
      if(res.data.status==200){
        this.people=res.data.data.allRole
        this.depName=res.data.data.empNames[0].depName
        this.empNames=res.data.data.empNames
        
        this.SSuForm.empNames=res.data.data.empNames[0].empId
        this.auditName=res.data.data.empNames[0].name
        this.isSS=true
      } 
      }).catch(err=>{
        if(err.status==300){
        this.$message({message:err.message})
        }
      })
    },
    mul: function(arg1, arg2) {
      var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
      try {
        m += s1.split(".")[1].length;
      } catch (e) {}
      try {
        m += s2.split(".")[1].length;
      } catch (e) {}
      return (
        (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
        Math.pow(10, m)
      );
    },
    //获取当前部门
    initDepList: function(val) {
      if (!val) {
        this.remoteMethod();
      }
    },
    clearDep: function() {
      this.propForm.department = "";
      this.EmployeList = [];
      this.propForm.dealAgentId = "";
      this.propForm.dealAgentStoreId = "";
      this.clearSelect();
    },
    depHandleClick(data) {
      this.propForm.dealAgentStoreId = data.depId;
      this.propForm.department = data.name;
      this.propForm.dealAgentId = "";
      this.handleNodeClick(data);
    },
    searchDep: function(payload) {
      /*this.DepList=payload.list
      this.propForm.department=payload.depName*/
    },
    getData(ajaxParam,typeshow,param) {
      if(typeshow!=1&&param==2){
        this.currentPage=1
      }
      this.loading = true;
      let _that = this;
      this.$ajax
        .get("/api/achievement/selectAchievementList", ajaxParam)
        .then(res => {
          console.log(res);
          let data = res.data;
          if (res.status === 200) {
            _that.selectAchList = data.data.list;
            // _that.selectAchList.forEach((item, index) => {
            //   for (let i = 0; i < item.distributions.length; i++) {
            //     item.distributions[i].aMoney =
            //       Math.floor(this.mul(item.distributions[i].aMoney, 100)) / 100;
            //     //  debugger
            //   }
            // });
            _that.total = data.data.total;
            if (data.data.list[0]) {
              _that.countData = data.data.list[0].contractCount;
            } else {
              _that.countData = [0, 0, 0, 0];
            }
            this.$nextTick(() => {
              this.loading = false;
            });
          }
        })
        .catch(error => {
          this.$message({ message: error });
          this.$nextTick(() => {
            this.loading = false;
          });
        });
    },
    // 导出功能
    getExcel() {
      this.queryFn();
      // this.ajaxParam.is_Receivable=1;
      let param = Object.assign({}, this.ajaxParam);
      this.excelCreate("/input/achievementExcel", param);
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    // 保存操作
    saveData(index, resultArr, status) {
      this.shows = false;
      this.selectAchList[index].distributions = resultArr;
      if (status || status == 0) {
        this.selectAchList[index].achievementState = status;
      }
    },
    // 通过操作
    adoptData(index, resultArr, result) {
      this.shows = false;
      this.selectAchList[index].distributions = resultArr;
      this.selectAchList[index].achievementState = result;
    },
    // 驳回操作
    rejectData(index, resultArr) {
      this.shows = false;
      this.selectAchList[index].distributions = resultArr;
      this.selectAchList[index].achievementState = 2;
    },
    tishen(value, index) {
      this.smallTips = "提审";
      this.statuIndex = index;
      this.statuContId = value.id;
      this.statuType = 0;
      this.statuAid = value.aId;
      this.recallShow = true;
    },
    chehui(value, index) {
      this.smallTips = "撤回";
      this.statuIndex = index;
      this.statuContId = value.id;
      this.statuType = 1;
      this.statuAid = value.aId;
      this.recallShow = true;
    },
    changeStatus() {
      // 提审
      //  if(this.statuType==0){
      //    let param={
      //      contId:this.statuContId,
      //      aId:this.statuAid,
      //      status:0
      //    }
      //    this.$ajax
      //     .postJSON("/api/achievement/applyStatusArraign", param)
      //     .then(res => {
      //       if (res.data.status == 200) {
      //          this.$message({ message: "操作成功", type: "success" });
      //          this.recallShow=false;
      //          this.selectAchList[this.statuIndex].achievementState=0;
      //       }
      //     }).catch(error => {
      //          this.$message.error({message: error})
      //     })
      //  }
      // 撤回
      if (this.statuType == 1) {
        let param = {
          contId: this.statuContId,
          aId: this.statuAid,
          status: -1
        };
        this.$ajax
          .postJSON("/api/achievement/withdrawStatusArraign", param)
          .then(res => {
            if (res.data.status == 200) {
              this.$message({ message: "操作成功", type: "success" });
              this.recallShow = false;
              this.getData(this.ajaxParam);
              //  this.selectAchList[this.statuIndex].achievementState=-1;
            }
          })
          .catch(error => {
            this.$message.error({ message: error });
          });
      }
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
          version: this.selectAchList[0].version
        }
      });
      window.open(newPage.href, "_blank");
      // this.dialogVisible = true;
      // this.loading2=true;
      // //合同边和获取业绩详情
      // this.code = row.code;
      // let param = { contCode: row.code, entrance: 3,aId:row.aId };
      // this.$ajax
      //   .get("/api/achievement/getAchDetails", param)
      //   .then(res => {
      //     let data = res.data;
      //     if (res.status === 200) {
      //       this.houseArr = data.data.houseAgents;
      //       this.clientArr = data.data.customerAgents;
      //       if(data.data.achievements){
      //           this.checkArr = data.data.achievements;  //详情的审核信息
      //           this. $nextTick(()=>{
      //             this.loading2=false;
      //          })

      //       }else{
      //         this.checkArr = [];
      //       }

      //       this.comm = data.data.comm;
      //     }
      //   });
    },
    queryFn(typeshow) {
      if (this.propForm.dateMo) {
        this.ajaxParam = {
          dealAgentStoreId: this.propForm.dealAgentStoreId, //部门
          dealAgentId: this.propForm.dealAgentId, //员工
          contractType:
            this.propForm.contractType.length === 0
              ? ""
              : this.propForm.contractType.join(","), //合同类型
          distributionType: this.propForm.divideType, //分成类型
          achievementStatus: this.propForm.achType, //业绩类型
          appealStatus:this.propForm.appealType,
          startTime: this.propForm.dateMo[0], //开始时间
          endTime: this.propForm.dateMo[1], //结束时间
          keyword: this.propForm.search, //关键字
          pageNum: this.currentPage,
          department:this.propForm.department,
          pageSize: this.pageSize,
          joinMethods: this.propForm.joinMethods
        };
      } else {
        this.ajaxParam = {
          dealAgentStoreId: this.propForm.dealAgentStoreId, //部门
          dealAgentId: this.propForm.dealAgentId, //员工
          contractType:
            this.propForm.contractType.length === 0
              ? ""
              : this.propForm.contractType.join(","), //合同类型
          distributionType: this.propForm.divideType, //分成类型
          achievementStatus: this.propForm.achType, //业绩类型
          appealStatus:this.propForm.appealType,
          keyword: this.propForm.search, //关键字
          department:this.propForm.department,
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          joinMethods: this.propForm.joinMethods
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
          path: "/actualAchievement",
          url: "/achievement/selectAchievementList",
          query: Object.assign({},param,{empName:this.dep.empName}),
          methods: "get"
        })
      );
      this.getData(this.ajaxParam,typeshow,2);
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
        pageNum: this.currentPage,
        pageSize: this.pageSize
      };
      this.ajaxParam.pageNum = 1;
      this.currentPage = 1;
      this.propForm = {
        department: "", //部门
        dealAgentStoreId: '',
        dealAgentId: '',
        empName:'',
        departmentDetail: "", //部门详情（员工）
        contractType: "", //合同类型
        divideType: "", //分成类型
        achType: "", //业绩类型
        dateMo: "",
        search: "",
        joinMethods: ""
      };
      this.EmployeList = [];
    },
    checkAch(value, index) {
      let newPage = this.$router.resolve({
        path: "/achPage",
        query: {
          aId: value.aId,
          contractCode: value.code,
          dialogType: 0,
          achIndex: index,
          achObj: JSON.stringify({ contractId: value.id }),
          contractId: value.id,
          version: this.selectAchList[0].version
        }
      });
      window.open(newPage.href, "_blank");
    },
    // editAch(value,index) {            //编辑时触发
    //     this.beginData = true;
    //     this.code2 =  value.code;
    //     this.aId =  value.aId;
    //     this.contractId =  value.id;
    //     this.dialogType = 1;
    //     this.achIndex=index
    //     this.achObj={
    //       contractId:value.id,//合同id
    //     }
    //     this.shows = true;
    // },
    editAch(value, index) {
      let newPage = this.$router.resolve({
        path: "/achPage",
        query: {
          aId: value.aId,
          contractCode: value.code,
          dialogType: 1,
          achIndex: index,
          achObj: JSON.stringify({ contractId: value.id }),
          contractId: value.id,
          version: this.selectAchList[0].version
        }
      });
      window.open(newPage.href, "_blank");
    },
    againCheck(value, index) {
      let newPage = this.$router.resolve({
        path: "/achPage",
        query: {
          aId: value.aId,
          contractCode: value.code,
          dialogType: 2,
          achIndex: index,
          achObj: JSON.stringify({ contractId: value.id }),
          contractId: value.id,
          version: this.selectAchList[0].version
        }
      });
      window.open(newPage.href, "_blank");
    },
    //分页
    handleSizeChange(val) {
      console.log(val);
      console.log(222222222);
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
        this.$ajax
          .get("/api/achievement/judgeContDetailsPower", param)
          .then(res => {
            console.log(res.data.data);
            if (res.data.data) {
              this.setPath(
                this.$tool.getRouter(
                  ["业绩", "应收业绩", "合同详情"],
                  "actualAchievement"
                )
              );
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
          });
      } else {
        this.noPower("合同详情查看");
      }
    },
    choseCheckPerson(val, type1) {
      this.checkPerson.flowType = 2;
      this.checkPerson.code = val.aId;
      this.checkPerson.state = true;
      this.checkPerson.type = type1;
      if (type1 == 1 || type1 == 2) {
        this.checkPerson.label = false;
      } else {
        if (val.nextAuditId != 0) {
          this.checkPerson.label = false;
        } else {
          this.checkPerson.label = true;
        }
      }
    },
    personChose: function() {
      this.checkPerson.state = false;
      this.getData(this.ajaxParam);
    },
    closeDialogs() {
      this.getData(this.ajaxParam);
      this.code2 = "";
      this.shows = false;
    }
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
  .closepre{
    width:50px;
    display:inline-block;
    position:relative;
    i{
        width: 12px;
        height: 12px;
        line-height: 12px;
        background-color: #9B9B9B;
        position: absolute;
        border-radius: 50%;
        font-size: 12px;
        color: #fff;
        top: 2px;
        right:0;
        display: none;
        cursor: pointer;
    }
    &:hover i{
        display:block
    }
  }
  // .paper-btn{
  //   background-color: @color-blue;
  //   border-color: @color-blue;
  // }
  .jianju{
    text-align: right;
    width: 80px;
    display: inline-block;
    margin-right: 15px;
  }
  .sustip{
    position: relative;
    line-height: 40px;
    width:470px;
    font-style: italic;
    padding-left: 0;
    font-size: 12px;
    color: darkseagreen;
  }
  .fileup{
            width:80px;
            height:32px;
            line-height: 32px;
            background:rgba(71,141,227,1);
            color: white;
            text-align: center !important
    }
  .check-btn span:first-of-type {
    margin-right: 8px;
  }
  .link{

  }
  .dot{
    text-overflow:ellipsis;
      white-space: nowrap;
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
      color: #D6D6D6;
      bottom: 0;
    }
    .role{
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

.point::before{
    content:'*';
    color:red;
    position:relative;
    top:3
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
.ssu{
  display: flex;
  p{
    display: flex;
    align-items: center;
    margin-right: 30px;
    height: 37px;
    span{
      min-width: 78px;
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
.preview{
  z-index:2220!important
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
</style>
