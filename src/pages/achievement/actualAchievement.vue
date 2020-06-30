<template>
  <div class="layout" style="background-color: #f5f5f5" ref="tableComView">
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
      <el-form :inline="true" :model="propForm" class="prop-form" size="small">
        <el-form-item label="关键字" prop="search">
          <el-tooltip content="合同编号/纸质合同编号/房源编号/客源编号/物业地址/业主/客户/房产证号/手机号/经纪人姓名" placement="top">
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
          <select-tree
            :data="DepList"
            :init="propForm.department"
            @checkCell="depHandleClick"
            @clear="clearDep"
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
              v-if="![4,5,6].includes(item.key)"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <!--<el-form-item label="分成类型" prop="divideType">
          <el-select v-model="propForm.divideType" class="w120" :clearable="true">
            <el-option
              v-for="item in dictionary['21']"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>-->

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

        <el-form-item label="签后审核状态" prop="contractType">
          <el-select v-model="propForm.afterSigningStatus" class="w120" :clearable="true">
            <el-option
              v-for="item in dictionary['756']"
              :key="item.value"
              :label="item.value"
              :value="item.sort"
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
        <el-form-item label="收佣状态">
          <el-select
            v-model="propForm.receiveAmountState"
            placeholder="全部"
            :clearable="true"
            style="width:150px"
          >
            <el-option
              v-for="item in dictionary['13']"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核时间" prop="dateMo" class="mr">
          <el-date-picker
            v-model="propForm.auditTime"
            class="w330"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="上传人">
          <el-select
            v-model="propForm.uploadId"
            filterable
            remote
            reserve-keyword
            :clearable="true"
            placeholder="请输入内容"
            :remote-method="getAssignors"
            :loading="loadingAssignors"
            v-loadmore="moreAssignors"
            @change="changeAssignors"
            style="width:150px"
          >
            <el-option
              v-for="item in assignors"
              :key="item.empId"
              :label="item.name+'-'+item.depName"
              :value="item.empId"
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
          @sort-change="sortTimeFn"
          border
        >
          <el-table-column label="合同信息" align="left" min-width="220">
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
                <span
                  class="blue"
                  style="cursor:pointer;"
                  @click="jumpUPlus(scope.row,1)"
                  v-if="getUser.version===3"
                >{{scope.row.houseinfoCode}}</span>
                <span v-else>{{scope.row.houseinfoCode}}</span>
                {{scope.row.ownerName}}
                <span
                  class="zhuanjie"
                  v-if="scope.row.isRetained===1"
                >留</span>
              </p>
              <p>
                客源：
                <span
                  class="blue"
                  style="cursor:pointer;"
                  @click="jumpUPlus(scope.row,2)"
                  v-if="getUser.version===3"
                >{{scope.row.guestinfoCode}}</span>
                <span v-else>{{scope.row.guestinfoCode}}</span>
                {{scope.row.customerName}}
                <span
                  class="zhuanjie"
                  v-if="scope.row.isRefer===1"
                >转介</span>
              </p>
            </template>
          </el-table-column>

          <el-table-column label="成交经纪人" min-width="120">
            <template slot-scope="scope">
              <p v-if="scope.row.dealName">{{scope.row.dealStorefront}}-{{scope.row.dealName}}</p>
              <p v-else>暂无</p>
            </template>
          </el-table-column>

          <el-table-column label="业绩状态" min-width="80">
            <template slot-scope="scope">
              <p v-if="scope.row.achievementState==-1" class="blue" style="cursor:text">待提审</p>
              <p v-if="scope.row.achievementState==0" class="blue" style="cursor:text">审核中</p>
              <p v-if="scope.row.achievementState==1" class="green">已通过</p>
              <p v-if="scope.row.achievementState==2" class="orange">已驳回</p>
            </template>
          </el-table-column>

          <el-table-column label="申诉状态" min-width="80">
            <template slot-scope="scope">
              <p v-if="scope.row.appealStatus.value==-1" class="blue" style="cursor:text">未申诉</p>
              <p v-if="scope.row.appealStatus.value==0" class="blue" style="cursor:text">已处理</p>
              <p v-if="scope.row.appealStatus.value==1" class="green">未处理</p>
            </template>
          </el-table-column>

          <el-table-column label="合同类型" min-width="80">
            <template slot-scope="scope">
              <p v-if="scope.row.loanType&&scope.row.loanType==7">全款买卖</p>
              <p v-else-if="scope.row.loanType&&scope.row.loanType==8">贷款买卖</p>
              <p v-else>{{scope.row.contType.label}}</p>
            </template>
          </el-table-column>

          <el-table-column prop="recordType.label" label="签约方式" min-width="60"></el-table-column>
          <el-table-column label="签后审核状态" min-width="90">
            <template slot-scope="scope">
              <span
                v-if="scope.row.signinState&&scope.row.signinState.value!==2"
                :class="[{'blue-txt':scope.row.signinState.value===-1},{'yellow-txt':scope.row.signinState.value===0},{'green-txt':scope.row.signinState.value===1}]"
              >{{scope.row.signinState.label}}</span>
              <el-tooltip
                class="item"
                popper-class="signature-state"
                placement="top"
                v-else-if="scope.row.signinState&&scope.row.signinState.value===2&&scope.row.signinRemarks.length>0"
              >
                <span slot="content">{{scope.row.signinRemarks}}</span>
                <span class="red-txt">{{scope.row.signinState.label}}</span>
              </el-tooltip>
              <span
                class="red-txt"
                v-else-if="scope.row.signinState&&scope.row.signinState.value===2&&scope.row.signinRemarks.length===0"
              >{{scope.row.signinState.label}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="上传合同主体时间" sortable="custom" prop="uploadSort" min-width="90">
            <template slot-scope="scope">
              <p>{{scope.row.uploadTime|formatTime(false)}}</p>
            </template>
          </el-table-column>
          <el-table-column label="上传人" min-width="90">
            <template slot-scope="scope">
              <p>{{(scope.row.uploadDepName?scope.row.uploadDepName:'-')+ "-" + (scope.row.uploadName?scope.row.uploadName:'-')}}</p>
              <!-- <p>{{scope.row.uploadDepName?scope.row.uploadDepName:"无"+"-"+scope.row.uploadName?scope.row.uploadName:"无"}}</p> -->
            </template>
          </el-table-column>
          <el-table-column prop="propertyAddr" label="物业地址" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.propertyAddr.length===0">--</span>
              <template v-else>
                <p>{{scope.row.propertyAddr.split(' ')[0]}}</p>
                <p>{{scope.row.propertyAddr.split(' ')[1]}}</p>
              </template>
            </template>
          </el-table-column>

          <el-table-column prop="signSort" label="签约时间" sortable="custom" min-width="90">
            <template slot-scope="scope">
              <p>{{scope.row.signDate|formatTime(false)}}</p>
            </template>
          </el-table-column>

          <el-table-column label="分成类型" min-width="60">
            <template slot-scope="scope">
              <!-- 目前一期分成类型只有业绩，暂时写死 -->
              <p>业绩</p>
            </template>
          </el-table-column>

          <el-table-column label="分成人" min-width="200">
            <template slot-scope="scope">
              <div v-if="scope.row.distributions.length==0">
                <div>--</div>
              </div>
              <div v-else>
                <div v-for="item in scope.row.distributions">
                  <el-tooltip
                    v-if="(item.level4+item.assignor).length>12"
                    class="item"
                    effect="dark"
                    :content="item.level4+'-'+item.assignor"
                    placement="top"
                  >
                    <p class="fenc-text">{{item.level4}}-{{item.assignor}}</p>
                  </el-tooltip>
                  <p v-else>{{item.level4}}-{{item.assignor}}</p>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="角色类型" min-width="90">
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

          <el-table-column label="分成比例" min-width="80">
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

          <el-table-column label="上传业绩分成协议时间" min-width="90">
            <template slot-scope="scope">
              <p
                v-if="scope.row.agreementUploadTime"
              >{{scope.row.agreementUploadTime|formatTime(false)}}</p>
              <p v-else>-</p>
            </template>
          </el-table-column>

          <el-table-column label="变更/解约" min-width="90">
            <template slot-scope="scope">
              <p v-if="scope.row.statusChange">{{scope.row.statusChange.label}}</p>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <el-table-column label="成交总价（元）" min-width="90" prop="dealPrice"></el-table-column>
          <el-table-column label="实收/应收" min-width="90">
            <template slot-scope="scope">
              <p>{{scope.row.receivedCommission+'/'+scope.row.receivableCommission}}</p>
            </template>
          </el-table-column>
          <el-table-column label="收佣状态" min-width="90">
            <template slot-scope="scope">
              <p>{{scope.row.receiveAmountState.label}}</p>
            </template>
          </el-table-column>
          <el-table-column label="交易服务费（元）" min-width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.tradeFee<0">-</span>
              <span v-else>{{scope.row.tradeFee}}</span>
            </template>
          </el-table-column>
          <el-table-column label="交易服务费佣金（元）" min-width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.tradeFeeComm<0">-</span>
              <span v-else>{{scope.row.tradeFeeComm}}</span>
            </template>
          </el-table-column>

          <el-table-column label="平台费比例（%）" min-width="60">
            <template slot-scope="scope">
              <div v-if="scope.row.distributions.length==0">
                <div>--</div>
              </div>
              <div v-else>
                <div v-for="item in scope.row.distributions">
                  <p>{{platformFeeFn(item.platformFeeRatio)}}</p>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column min-width="90">
            <template slot="header" slot-scope="scope">
              应收分成金额（元）
              <el-tooltip content="应收分成金额=个人应收佣金-平台费（未减去收款手续费）" placement="top">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <div v-if="scope.row.distributions.length==0">
                <div>--</div>
              </div>
              <div v-else>
                <p v-for="item in scope.row.distributions">{{aMoneyFn(item.aMoney)}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="审核时间" prop="achievementSort" sortable="custom" min-width="140">
            <template slot-scope="scope">
              <p>{{scope.row.auditTime|formatTime(false)}}</p>
            </template>
          </el-table-column>

          <el-table-column label="当前审核人" min-width="120">
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

          <el-table-column label="下一步审核人" min-width="120">
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

          <el-table-column label="操作" min-width="120" fixed="right">
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
                    v-if="power['sign-yj-rev-fs'].state&&userInfo"
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
                    v-if="userInfo&&userInfo.empId===scope.row.auditId||scope.row.validateGrabAuth"
                  >审核</span>
                  <div
                    style="color:red"
                    v-if="scope.row.auditId>0&&userInfo&&scope.row.auditId!==userInfo.empId"
                  >{{scope.row.auditName}}正在审核</div>
                </div>
              </div>
              <div v-else>
                <p>--</p>
              </div>
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
      <!-- 分页 -->
      <!-- <div class="pagination" v-if="total!=0">

      </div>-->
    </div>

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
    <el-dialog
      :closeOnClickModal="$tool.closeOnClickModal"
      @close="close2"
      width="1000px"
      height="450px"
      class="ssdialog"
      title="申诉"
      :visible.sync="isSS"
    >
      <div class="ssu">
        <p class="dot">
          <span class="jianju">合同编号：</span>
          {{htbh}}
        </p>
        <p style="width:300px">签约时间：{{qysj}}</p>
        <p style="width:300px" v-if="userInfo">申诉人：{{userInfo.name}}</p>
      </div>
      <div class="role">
        <span class="point jianju">申诉角色：</span>
        <el-select
          v-model="SSuForm.role"
          placeholder="请选择"
          multiple
          class="width300"
          :class="{'width425':SSuForm.role.length>3}"
          :clearable="true"
        >
          <el-option
            v-for="item in people"
            :key="item.code"
            :label="item.description"
            :value="item.code"
          ></el-option>
        </el-select>
      </div>
      <div class="role">
        <span class="point jianju" style="margin-right:25px;">审核人：</span>
        {{depName}}
        <el-select
          v-model="SSuForm.empNames"
          style="margin-left:22px;width:210px"
          filterable
          placeholder="请选择"
          @change="getName"
        >
          <el-option
            v-for="item in this.empNames"
            :key="item.empId"
            :label="item.name"
            :value="item.empId"
          ></el-option>
        </el-select>
      </div>
      <div class="input-group" style="align-items: normal;position:relative">
        <span class="point jianju" style="min-width:78px">申诉内容：</span>
        <el-input
          type="textarea"
          :rows="4"
          resize="none"
          v-model="SSuForm.remark"
          placeholder="无备注内容"
          :maxlength="inputMax"
        ></el-input>
        <span class="text-absolute">{{validInput}}/{{inputMax}}</span>
      </div>
      <div class="input-group" style="align-items: normal">
        <span class="jianju">申诉凭证：</span>
        <div>
          <fileUp
            @getUrl="getAdd"
            :scane="uploadScane"
            :more="true"
            :rules="mbrules"
            id="pinzheng"
            class="fileup"
          >选择文件</fileUp>
          <!-- <span class="sustip" v-show="this.SSuForm.pinzheng.length!=0">{{this.SSuForm.pinzheng.length}}个上传成功！</span> -->
          <div class="sustip" v-show="SSuForm.pinzheng&&SSuForm.pinzheng.length!=0">
            <!-- {{this.SSuForm.pinzheng}} -->
            <span style="margin-right:20px" v-for="(item,index) in SSuForm.pinzheng">
              <span class="closepre">
                <span
                  class="link"
                  slot="reference"
                  @click.stop="previewPhoto(SSuForm.pinzheng,index)"
                >附件{{index+1}}</span>
                <i class="el-icon-close" @click="cutfile(index)"></i>
              </span>
            </span>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="submitForm"
          type="primary"
          size="small"
          round
          class="paper-btn paper-btn-blue"
          v-dbClick
        >
          确
          定
        </el-button>
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
import { FILTER } from "@/assets/js/filter";
import { MIXINS } from "@/assets/js/mixins";
import ScreeningTop from "@/components/ScreeningTop";
import checkPerson from "@/components/checkPerson";

export default {
  mixins: [MIXINS, FILTER],
  data() {
    return {
      pinzheng2: [],
      imgList: [],
      roleName: "",
      auditName: "",
      depName: "",
      uploadScane: { path: "shensu", id: "" }, //上传场景值
      people: [],
      htbh: "",
      yjId: "",
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
      empNames: [],
      SSuForm: {
        role: [],
        remark: "",
        empNames: "",
        auditName: "",
        pinzheng: []
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
        appealType: "", //申诉状态
        dateMo: "",
        search: "",
        joinMethods: "", //合作方式
        recordType: "", //签约方式2.3.1新加
        auditTime: "", //审核时间
        afterSigningStatus: "" //签后审核状态
      },
      shows: false,
      dialogType: 0, //0代表审核  1代表编辑  2代表反审核  3代表业绩分成
      code: "",
      code2: "",
      dictionary: {
        //数据字典
        "10": "", //合同类型
        "13": "", //收佣状态
        "21": "", //分成状态
        "53": "", //合作方式
        "64": "", //签约方式
        "756": "" //签后审核状态
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
      recallShow: false, //撤回弹窗是否显示
      smallTips: "",
      statuContId: null,
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
      },
      // 上传人
      assignors: [], //模糊搜索经纪人
      loadingAssignors: false,
      assignorIndex: null,
      assignorStr: null,
      assignorTotal: null,
      // 表格箭头变化
      sortChange: {}
    };
  },
  mounted() {
    this.ajaxParam = {
      pageNum: this.currentPage,
      pageSize: this.pageSize
    };
    this.$nextTick(() => {
      let res = this.getDataList;
      if (this.$route.query.source && this.$route.query.source === "uplus") {
        Object.assign(this.propForm, { achType: 0 });
        Object.assign(this.ajaxParam, { achievementStatus: 0 });
      }
      if (res && res.route === this.$route.path) {
        this.selectAchList = res.data.list;
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
        this.propForm.dealAgentStoreId = session.dealAgentStoreId;
        this.propForm.dealAgentId = session.dealAgentId;
        this.propForm.appealType = session.appealStatus;
        this.propForm.dateMo = session.startTime
          ? [session.startTime, session.endTime]
          : [];
        this.propForm.search = session.keyword;
        this.currentPage = session.pageNum;
        this.pageSize = session.pageSize;
        this.propForm.empName = session.empName;
        this.propForm.department = session.department;
        this.propForm.joinMethods = session.joinMethods;
        this.propForm.recordType = session.recordType;
        this.propForm.auditTime = session.auditStartTime
          ? [session.auditStartTime, session.auditEndTime]
          : [];
        this.propForm.afterSigningStatus = session.afterSigningStatus; //新加

        if (this.propForm.contractType[0] != "") {
          for (let i = 0; i < this.propForm.contractType.length; i++) {
            this.propForm.contractType[i] = Number(
              this.propForm.contractType[i]
            );
          }
        } else {
          this.propForm.contractType = [];
        }
        if (this.propForm.dealAgentId) {
          this.dep = Object.assign({}, this.dep, {
            id: this.propForm.dealAgentStoreId,
            empId: this.propForm.dealAgentId,
            empName: this.propForm.empName
          });
          this.EmployeList.unshift({
            empId: this.propForm.dealAgentId,
            name: this.propForm.empName
          });
          this.getEmploye(this.propForm.dealAgentStoreId);
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
    userInfo() {
      return this.getUser.user;
    },
    validInput() {
      return this.SSuForm.remark.length;
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
    platformFeeFn(p) {
      if (p || p == 0) {
        return `${p}%`;
      } else {
        return "-";
      }
    },
    aMoneyFn(m) {
      if ((m && m !== "") || m == 0) {
        return `${m}`;
      } else {
        return "-";
      }
    },
    //申诉弹窗关闭回调事件-初始化表单对象
    close2() {
      this.yjId = "";
      this.SSuForm.role = [];
      this.SSuForm.remark = "";
      this.SSuForm.pinzheng = [];
      this.depName = "";
      this.SSuForm.empNames = "";
      this.auditName = "";
      this.roleName = "";
    },
    //删除上传附件队列中的文件
    cutfile(index) {
      this.SSuForm.pinzheng.splice(index, 1);
    },
    //申诉弹窗中获取审核人下拉框选中项
    getName(val) {
      for (let i = 0; i < this.empNames.length; i++) {
        if (val == this.empNames[i].empId) {
          this.auditName = this.empNames[i].name;
          this.depName = this.empNames[i].depName;
          this.roleName = this.empNames[i].roleName;
        }
      }
    },
    trim(str) {
      return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    //附件上传回调
    getAdd(obj) {
      this.SSuForm.pinzheng = this.SSuForm.pinzheng.concat(obj.param);
    },
    getPicture(item) {
      return this.$tool.cutFilePath(item);
    },
    //申诉表单提交
    submitForm() {
      if (this.SSuForm.role.length == 0) {
        this.$message("申诉角色不能为空！");
        return;
      }
      if (this.trim(this.SSuForm.remark).length == 0) {
        this.$message("申诉内容不能为空！");
        return;
      }
      if (this.auditName == "") {
        this.$message("审核人不能为空！");
        return;
      }
      let arr2 = [];
      let arr = JSON.parse(JSON.stringify(this.SSuForm.pinzheng));
      for (let i = 0; i < arr.length; i++) {
        arr2.push(arr[i].path + "?" + arr[i].name);
      }
      let param = {
        achievementId: this.yjId,
        appealRole: this.SSuForm.role.join(","),
        appealContent: this.SSuForm.remark,
        voucherUrl: arr2,
        auditDepName: this.depName,
        auditId: this.SSuForm.empNames,
        auditName: this.auditName,
        auditPostionName: this.roleName
      };
      if (this.power["sign-yj-rev-appeal"].state) {
        this.$ajax
          .postJSON("/api/appeal/saveAppealInfo", param, 2)
          .then(res => {
            if (res.status == 200) {
              this.isSS = false;
              this.yjId = "";
              this.SSuForm.role = [];
              this.SSuForm.remark = "";
              this.SSuForm.pinzheng = [];
              this.SSuForm.empNames = "";
              this.auditName = "";
              this.roleName = "";
              this.$message({ message: "提交成功！" });
              this.getData(this.ajaxParam);
            }
          })
          .catch(error => {
            if (error.message === "下一节点审批人不存在") {
              this.checkPerson.flowType = 2;
              this.checkPerson.code = this.yjId;
              this.checkPerson.state = true;
              this.checkPerson.type = error.data.type;
            } else {
              this.$message({
                message: error,
                type: "error"
              });
            }
            this.isSS = false;
            this.getData(this.ajaxParam);
          });
      } else {
        this.noPower(this.power["sign-yj-rev-appeal"].name);
      }
    },
    //申诉弹窗显示前的校验方法
    shenSu(row, index) {
      if (
        (!row.dealName || row.dealName == "-") &&
        (!row.dealStorefront || row.dealStorefront == "-")
      ) {
        this.$message({
          message: "无成交经纪人不能发起申诉",
          type: "error"
        });
        return;
      }
      this.uploadScane.id = row.code;
      this.htbh = row.code;
      this.yjId = row.aId;
      this.qysj = this.$tool.timeFormat(row.signDate, false);
      this.$ajax
        .get("/api/appeal/launchAppeal", { aId: `${this.yjId}` })
        .then(res => {
          if (res.data.status == 200) {
            this.isSS = true;
            this.people = res.data.data.allRole;
            this.depName = res.data.data.empNames[0].depName;
            this.empNames = res.data.data.empNames;

            this.SSuForm.empNames = res.data.data.empNames[0].empId;
            this.auditName = res.data.data.empNames[0].name;
          }
        })
        .catch(err => {
          if (err.status == 300) {
            this.$message({ message: err.message });
          }
        });
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
    getData(ajaxParam, typeshow, param) {
      if (typeshow != 1 && param == 2) {
        this.currentPage = 1;
      }
      this.loading = true;
      let _that = this;
      this.$ajax
        .get("/api/achievement/selectAchievementList", ajaxParam)
        .then(res => {
          // console.log(res);
          let data = res.data;
          if (res.status === 200) {
            _that.selectAchList = data.data.list;
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
      let param = Object.assign(
        {},
        this.ajaxParam,
        { strStartTime: this.ajaxParam.startTime },
        { strEndTIme: this.ajaxParam.endTime }
      );
      this.excelCreate("/input/achievementExcel", param);
    },
    chehui(value, index) {
      this.smallTips = "撤回";
      this.statuContId = value.id;
      this.statuAid = value.aId;
      this.recallShow = true;
    },
    //撤回确定操作
    changeStatus() {
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
          }
        })
        .catch(error => {
          this.$message.error({ message: error });
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
    //查询操作
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
          appealStatus: this.propForm.appealType,
          startTime: this.propForm.dateMo[0], //开始时间
          endTime: this.propForm.dateMo[1], //结束时间
          keyword: this.propForm.search, //关键字
          pageNum: this.currentPage,
          department: this.propForm.department,
          pageSize: this.pageSize,
          joinMethods: this.propForm.joinMethods,
          recordType: this.propForm.recordType,
          receiveAmountState: this.propForm.receiveAmountState,
          uploadId: this.propForm.uploadId,
          ...this.sortChange
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
          appealStatus: this.propForm.appealType,
          keyword: this.propForm.search, //关键字
          department: this.propForm.department,
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          joinMethods: this.propForm.joinMethods,
          recordType: this.propForm.recordType,
          receiveAmountState: this.propForm.receiveAmountState,
          uploadId: this.propForm.uploadId,
          ...this.sortChange
        };
      }
      //新加
      Object.assign(this.ajaxParam, {
        afterSigningStatus: this.propForm.afterSigningStatus
      });
      if (this.propForm.auditTime && this.propForm.auditTime.length > 0) {
        Object.assign(this.ajaxParam, {
          auditStartTime: this.propForm.auditTime[0],
          auditEndTime: this.propForm.auditTime[1]
        });
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
          query: Object.assign({}, param, {
            empName: this.dep.empName
          }),
          methods: "get"
        })
      );
      this.getData(this.ajaxParam, typeshow, 2);
    },
    resetFormFn() {
      this.currentPage = 1;
      this.propForm = {
        department: "", //部门
        dealAgentStoreId: "",
        dealAgentId: "",
        empName: "",
        departmentDetail: "", //部门详情（员工）
        contractType: [], //合同类型
        divideType: "", //分成类型
        achType: "", //业绩类型
        dateMo: "",
        search: "",
        joinMethods: "",
        recordType: "",
        auditTime: "",
        afterSigningStatus: ""
      };
      this.EmployeList = [];
    },
    //点击审核
    checkAch(value, index) {
      if (value.auditId === this.userInfo.empId) {
        let newPage = this.$router.resolve({
          path: "/achPage",
          query: {
            aId: value.aId,
            contractCode: value.code,
            dialogType: 0,
            achIndex: index,
            achObj: JSON.stringify({ contractId: value.id }),
            contractId: value.id,
            version: this.selectAchList[0].version,
            contType: value.contType.value
          }
        });
        window.open(newPage.href, "_blank");
      } else {
        let param = {
          bizCode: value.aId,
          flowType: 2
        };
        this.$ajax
          .get("/api/machine/getAuditAuth", param)
          .then(res => {
            res = res.data;
            if (res.status === 200) {
              let newPage = this.$router.resolve({
                path: "/achPage",
                query: {
                  aId: value.aId,
                  contractCode: value.code,
                  dialogType: 0,
                  achIndex: index,
                  achObj: JSON.stringify({
                    contractId: value.id
                  }),
                  contractId: value.id,
                  version: this.selectAchList[0].version,
                  contType: value.contType.value
                }
              });
              window.open(newPage.href, "_blank");
            }
          })
          .catch(error => {
            this.$message({
              message: error,
              type: "error"
            });
          });
      }
    },
    editAch(value, index) {
      let newPage = this.$router.resolve({
        path: "/achPage",
        query: {
          aId: value.aId, //业绩id
          contractCode: value.code, //合同编号
          dialogType: 1, // 类型  编辑的话就是1
          achIndex: index,
          achObj: JSON.stringify({ contractId: value.id }), //合同id
          contractId: value.id,
          version: this.selectAchList[0].version, //版本
          contType: value.contType.value //合同类型
        }
      });
      window.open(newPage.href, "_blank");
    },
    //点击反审核
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
    //点击合同编号进详情
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
    /**
     * 跳转房客源详情
     * @param code
     * @param type 1=房源，2=客源
     */
    jumpUPlus(row, type) {
      let url = "";
      let code = "";
      if (type === 1) {
        url = "/getHouseDetails";
        code = row.houseinfoCode;
      } else {
        url = "/getCustomerDetails";
        code = row.guestinfoCode;
      }
      this.$ajax
        .get("/api/achievement" + url, { code: code })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            window.open(res.data);
          }
        })
        .catch(error => {
          this.$message({
            message: error.message
          });
        });
    },
    //触发设置审核人弹窗
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
    // 上传人
    getAssignors(queryString) {
      if (queryString !== "") {
        this.loadingAssignors = true;
        this.assignorStr = queryString;
        let list = [{}];
        let param = {
          keyword: queryString,
          pageNum: 1,
          pageSize: 100,
          leave: true
        };
        this.$ajax.get("/api/organize/employees/pages", param).then(res => {
          if (res.status === 200) {
            this.loadingAssignors = false;
            this.assignors = res.data.data.list;
            this.assignorTotal = res.data.data.total;
            this.assignorIndex = 1;
          }
        });
      }
    },
    // 经纪人下拉加载下一页
    getMoreAssignors(queryString, page) {
      if (queryString !== "") {
        let list = [{}];
        let param = {
          keyword: queryString,
          pageNum: page,
          pageSize: 100,
          leave: true
        };
        this.$ajax.get("/api/organize/employees/pages", param).then(res => {
          if (res.status === 200) {
            this.assignors = this.assignors.concat(res.data.data.list);
          }
        });
      }
    },
    moreAssignors() {
      if (this.assignors.length >= this.assignorTotal) {
        return;
      } else {
        this.assignorIndex++;
        this.getMoreAssignors(this.assignorStr, this.assignorIndex);
      }
    },
    // 改变经纪人
    changeAssignors(val) {
      // if (val) {
      //     let param = {
      //         id: val
      //     };
      //     this.$ajax
      //         .get("/api/organize/employee/agent/details", param)
      //         .then(res => {
      //             let data = res.data.data;
      //             console.log(data)
      //         });
      // } else {
      // }
    },
    // 表格
    sortTimeFn({ column, prop, order }) {
      if (order === "descending") {
        this.sortChange = {
          [prop]: 0
        };
      } else if (order === "ascending") {
        this.sortChange = {
          [prop]: 1
        };
      } else {
        this.sortChange = {};
      }
      // 请求数据
      this.queryFn(1);
    }
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/less/lsx.less";
@import "~@/assets/common.less";

.signature-state {
  > span {
    display: inline-block;
    max-width: 300px;
  }
}
.blue-txt {
  color: @color-blue;
}
.yellow-txt {
  color: @color-yellow;
}
.green-txt {
  color: @color-green;
}
.red-txt {
  color: @color-warning;
}

.layout {
  .check-btn span {
    color: #478de3;
  }

  .check-btn:empty {
    position: relative;

    &:before {
      content: "--";
      display: inline-block;
    }
  }

  .closepre {
    width: 50px;
    display: inline-block;
    position: relative;

    i {
      width: 12px;
      height: 12px;
      line-height: 12px;
      background-color: #9b9b9b;
      position: absolute;
      border-radius: 50%;
      font-size: 12px;
      color: #fff;
      top: 2px;
      right: 0;
      display: none;
      cursor: pointer;
    }

    &:hover i {
      display: block;
    }
  }

  // .paper-btn{
  //   background-color: @color-blue;
  //   border-color: @color-blue;
  // }
  .jianju {
    text-align: right;
    width: 80px;
    display: inline-block;
    margin-right: 15px;
  }

  .sustip {
    position: relative;
    line-height: 40px;
    width: 470px;
    font-style: italic;
    padding-left: 0;
    font-size: 12px;
    color: darkseagreen;
  }

  .fileup {
    width: 80px;
    height: 32px;
    line-height: 32px;
    background: rgba(71, 141, 227, 1);
    color: white;
    text-align: center !important;
  }

  .check-btn span:nth-child(n + 1) {
    margin-left: 8px;
  }

  .link {
  }

  .dot {
    text-overflow: ellipsis;
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

    .fenc-text {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
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

.point::before {
  content: "*";
  color: red;
  position: relative;
  top: 3;
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

.preview {
  z-index: 2220 !important;
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
