<template>
  <div class="view-container" ref="tableComView">
    <!-- 筛选查询 -->
    <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn" v-if="dictionary['9']">
      <el-form :inline="true" :model="contractForm" class="prop-form" size="small">
        <el-form-item label="关键字">
          <el-tooltip
            class="item"
            effect="dark"
            content="物业地址/业主/客户/手机号/合同编号/纸质合同编号/房源编号/客源编号/房客源店长"
            placement="top"
          >
            <el-input v-model="keyword" style="width:150px" placeholder="请输入" :clearable="true"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="签约日期">
          <el-date-picker
            v-model="signDate"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            format="yyyy-MM-dd"
            value-format="yyyy/MM/dd"
            style="width:330px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="合同类型">
          <el-select
            v-model="contractForm.contTypes"
            multiple
            placeholder="全部"
            style="width:200px"
            :class="{'width300':contractForm.contTypes&&contractForm.contTypes.length>3}"
          >
            <el-option
              v-for="item in dictionary['10']"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="合同状态">
          <el-select
            v-model="contractForm.contState"
            placeholder="全部"
            :clearable="true"
            style="width:150px"
          >
            <el-option
              v-for="item in dictionary['9']"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="签约方式">
          <el-select
            v-model="contractForm.recordType"
            placeholder="全部"
            :clearable="true"
            style="width:150px"
          >
            <el-option
              v-for="item in dictionary['64']"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成交报告" v-if="contVersion===2">
          <el-select
            v-model="contractForm.reportRecord"
            placeholder="全部"
            :clearable="true"
            style="width:150px"
          >
            <el-option label="已录" value="1"></el-option>
            <el-option label="未录" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用途">
          <el-select
            v-model="contractForm.housePurpose"
            placeholder="全部"
            :clearable="true"
            style="width:150px"
          >
            <el-option
              v-for="item in housePurpose"
              :key="item.key"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <select-tree
            :data="DepList"
            :init="contractForm.depName"
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
            v-model="contractForm.dealAgentId"
            @change="handleEmpNodeClick"
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
        <el-form-item label="合同审核状态">
          <el-select
            v-model="contractForm.toExamineState"
            placeholder="全部"
            :clearable="true"
            style="width:150px"
          >
            <el-option
              v-for="item in dictionary['51']"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="签后审核状态">
          <el-select
            v-model="contractForm.signinState"
            placeholder="全部"
            :clearable="true"
            style="width:150px"
          >
            <el-option
              v-for="item in dictionary['72']"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变更/解约">
          <el-select
            v-model="contractForm.contChangeState"
            placeholder="全部"
            :clearable="true"
            style="width:150px"
          >
            <el-option
              v-for="item in dictionary['6']"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算状态" v-if="contVersion===2">
          <el-select
            v-model="contractForm.resultState"
            placeholder="全部"
            :clearable="true"
            style="width:150px"
          >
            <el-option
              v-for="item in dictionary['14']"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收佣状态">
          <el-select
            v-model="contractForm.receiveAmountState"
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
        <el-form-item label="业绩状态">
          <el-select
            v-model="contractForm.achievementState"
            placeholder="全部"
            :clearable="true"
            style="width:150px"
          >
            <el-option
              v-for="item in dictionary['54']"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合作方式">
          <el-select
            v-model="contractForm.dealAgentStoreAttr"
            placeholder="全部"
            :clearable="true"
            style="width:150px"
          >
            <el-option
              v-for="item in dictionary['53']"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="后期状态" v-if="contVersion===2">
          <el-select v-model="contractForm.laterStageState" placeholder="全部" :clearable="true">
            <el-option
              v-for="item in dictionary['11']"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="佣金比例">
          <el-input
            class="percent"
            v-model="contractForm.beginRatio"
            @input.native="changeRatio('begin')"
            style="width:85px"
            placeholder="请输入"
            :clearable="true"
          ></el-input>-
          <el-input
            class="percent"
            v-model="contractForm.endRatio"
            @input.native="changeRatio('end')"
            style="width:85px"
            placeholder="请输入"
            :clearable="true"
          ></el-input>
        </el-form-item>
      </el-form>
    </ScreeningTop>
    <!-- 合同列表 -->
    <div class="contract-list">
      <div class="listTitle">
        <div>
          <span class="title">
            <i class="iconfont icon-tubiao-11"></i>数据列表
          </span>
        </div>
        <div>
          <div
            class="haveSon"
            :class="{'showOnLine':showOnLine}"
            @mouseover="moveIn('online')"
            @mouseout="moveOut('online')"
            v-if="power['sign-ht-info-add'].state"
            >
            创建线上合同
            <i class="el-icon-arrow-down el-icon--right"></i>
            <div class="holderPlace" v-if="dictionary['71']">
              <ul class="mainList">
                <li
                  v-for="item in dictionary['71']"
                  :key="item.key"
                  @click="addOnLine(item)"
                  style="position:relative;"
                  >
                  {{item.value}}
                  <i
                    class="el-icon-caret-right"
                    v-if="item.key===2&&item.children"
                    style="position:absolute;top:10px;left:55px;"
                    ></i>
                  <div class="childrenModule" v-if="item.key===2&&item.children">
                    <ul class="childrenList">
                      <li
                        v-for="item_ in item.children"
                        :key="item_.key"
                        @click="addOnLine(item_)"
                      >{{item_.value}}</li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div
            class="haveSon"
            :class="{'showOnLine':showOffLine}"
            @mouseover="moveIn('offline')"
            @mouseout="moveOut('offline')"
            v-if="power['sign-ht-info-addoffline'].state"
            >
            录入线下合同
            <i class="el-icon-arrow-down el-icon--right"></i>
            <div class="holderPlace" v-if="dictionary['65']">
              <ul class="mainList">
                <li
                  v-for="item in dictionary['65']"
                  :key="item.key"
                  @click="addOffLine(item)"
                  style="position:relative;"
                  >
                  {{item.value}}
                  <i
                    class="el-icon-caret-right"
                    v-if="item.key===2&&item.children"
                    style="position:absolute;top:10px;left:55px;"
                  ></i>
                  <div class="childrenModule" v-if="item.key===2&&item.children">
                    <ul class="childrenList">
                      <li
                        v-for="item_ in item.children"
                        :key="item_.key"
                        @click="addOffLine(item_)"
                      >{{item_.value}}</li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div
            class="haveSon printStyle"
            :class="{'showOnLine':showPrint}"
            @mouseover="moveIn('print')"
            @mouseout="moveOut('print')"
            v-if="power['sign-ht-info-print'].state"
            >
            打印空白合同
            <i class="el-icon-arrow-down el-icon--right"></i>
            <div class="holderPlace" v-if="dictionary['71']">
              <ul class="mainList">
                <li
                  v-for="item in dictionary['71']"
                  :key="item.key"
                  @click="printCont(item)"
                  style="position:relative;"
                >
                  {{item.value}}
                  <i
                    class="el-icon-caret-right"
                    v-if="item.key===2&&item.children"
                    style="position:absolute;top:10px;left:55px;"
                  ></i>
                  <div class="childrenModule" v-if="item.key===2&&item.children">
                    <ul class="childrenList">
                      <li
                        v-for="item_ in item.children"
                        :key="item_.key"
                        @click="printCont(item_)"
                      >{{item_.value}}</li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <el-button
            class="btn-info"
            v-if="power['sign-ht-info-export'].state"
            round
            type="primary"
            size="small"
            @click="getExcel"
          >导出</el-button>
        </div>
      </div>
      <el-table
        :span-method="objectSpanMethod"
        :row-class-name="rowStyle"
        ref="tableCom"
        class="info-scrollbar"
        :data="combineList"
        style="width: 100%"
        @row-dblclick="toDetail"
        border
        :max-height="tableNumberCom"
        >
        <el-table-column label="合同信息" label-class-name="pdl" class-name="bgc" min-width="250" fixed>
          <template slot-scope="scope">
            <div class="contract_msg">
              <div class="riskLabel">
                <!-- 风险单 -->
                <el-popover
                  placement="top-start"
                  width="50"
                  trigger="hover"
                  content="风险单"
                  v-if="scope.row.isRisk"
                >
                  <i slot="reference" class="iconfont icon-tubiao_shiyong-1 risk"></i>
                </el-popover>
              </div>
              <ul class="contract-msglist">
                <li>
                  合同：
                  <span class="blueColor" @click="toDetail(scope.row)">{{scope.row.code}}</span>
                </li>
                <li v-if="scope.row.recordType.value===2">
                  纸质合同编号：
                  <span class="blueColor" @click="toDetail(scope.row)">{{scope.row.pCode}}</span>
                </li>
                <li v-if="scope.row.houseinfoCode">
                  房源：
                  <span>{{scope.row.houseinfoCode}}</span>
                  {{scope.row.showOwnerName}}
                  <span
                    class="zhuanjie"
                    v-if="scope.row.isRetained===1"
                  >留</span>
                </li>
                <li>
                  客源：
                  <span>{{scope.row.guestinfoCode}}</span>
                  {{scope.row.showCustName}}
                  <span
                    class="zhuanjie"
                    v-if="scope.row.isRefer===1"
                  >转介</span>
                </li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="合同类型" min-width="70">
          <template slot-scope="scope">
            <span v-if="scope.row.loanType">{{scope.row.loanType===7?"全款买卖":"贷款买卖"}}</span>
            <span v-else>{{scope.row.isCombine?"委托合同":scope.row.contType.label}}</span>
          </template>
        </el-table-column>
        <el-table-column label="物业地址" min-width="160">
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
            <div v-if="!scope.row.isCombine">
              <span>{{scope.row.dealPrice}}元</span>
              <span
                v-for="item in dictionary['507']"
                :key="item.key"
                v-if="item.key===scope.row.timeUnit&&scope.row.contType.value===1"
              >/ {{item.value}}</span>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="佣金比例(%)" min-width="100">
          <template slot-scope="scope">
            <span
              v-if="(scope.row.contType.value===2||scope.row.contType.value===3)&&!scope.row.isCombine"
            >{{((scope.row.receivableCommission/scope.row.dealPrice)*100).toFixed(2)}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="财务收付" min-width="80">
          <template slot-scope="scope">
            <div v-if="!scope.row.isCombine">
              <div class="btn" @click="runningWater(scope.row)">流水</div>
              <div class="btn" v-if="!scope.row.isTransaction" @click="gathering(scope.row)">收款</div>
              <div class="btn" v-if="!scope.row.isTransaction" @click="payment(scope.row)">付款</div>
            </div>
            <div class="btn" v-else-if="!scope.row.isTransaction" @click="gathering(scope.row)">收款</div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="成交经纪人" min-width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.dealAgentStoreName||scope.row.dealAgentName">
              <p>{{scope.row.dealAgentStoreName}}</p>
              <p>{{scope.row.dealAgentName}}</p>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="房客源店长" min-width="150">
          <template slot-scope="scope">
            <p>房：{{scope.row.houseStoreName+"-"+scope.row.houseShopOwner}}</p>
            <p>客：{{scope.row.guestStoreName}}-{{scope.row.guestShopOwner?scope.row.guestShopOwner:''}}</p>
          </template>
        </el-table-column>
        <el-table-column label="合同状态" min-width="70">
          <template slot-scope="scope">
            <span>{{scope.row.contState.label}}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同审核状态" min-width="100">
          <template slot-scope="scope">
            <span
              v-if="scope.row.toExamineState.value===-1"
              class="blue"
            >{{scope.row.toExamineState.label}}</span>
            <span
              v-if="scope.row.toExamineState.value===0"
              class="yellow"
            >{{scope.row.toExamineState.label}}</span>
            <span
              v-if="scope.row.toExamineState.value===1"
              class="green"
            >{{scope.row.toExamineState.label}}</span>
            <span
              v-if="scope.row.toExamineState.value===2"
              class="red"
            >{{scope.row.toExamineState.label}}</span>
          </template>
        </el-table-column>
        <el-table-column label="变更/解约" min-width="80">
          <template slot-scope="scope">
            <div v-if="!scope.row.isCombine">
              <span v-if="scope.row.contChangeState.label==='未变更/解约'">-</span>
              <el-button
                type="text"
                size="medium"
                v-else
                @click="goChangeCancel(scope.row)"
              >{{scope.row.contChangeState.label}}</el-button>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="成交报告" min-width="80" v-if="contVersion===2" key="dealReportState">
          <template slot-scope="scope">
            <span
              v-if="(scope.row.contType.value===2||scope.row.contType.value===3)&&!scope.row.isCombine"
            >{{scope.row.dealReportState.label}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="签后审核状态" min-width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.signingState">
              <span
                v-if="scope.row.signingState.value===-1"
                class="blue"
              >{{scope.row.signingState.label}}</span>
              <span
                v-if="scope.row.signingState.value===0"
                class="yellow"
              >{{scope.row.signingState.label}}</span>
              <span
                v-if="scope.row.signingState.value===1"
                class="green"
              >{{scope.row.signingState.label}}</span>
              <!-- <span v-if="scope.row.signingState.value===2" class="red">{{scope.row.signingState.label}}</span> -->
              <el-tooltip
                class="item"
                popper-class="tooltipWidth"
                v-if="scope.row.signingState.value===2&&scope.row.signingRemarks"
                effect="dark"
                placement="top"
              >
                <span slot="content">{{scope.row.signingRemarks}}</span>
                <span class="red">{{scope.row.signingState.label}}</span>
              </el-tooltip>
              <span
                v-if="scope.row.signingState.value===2&&!scope.row.signingRemarks"
                class="red"
              >{{scope.row.signingState.label}}</span>
            </div>
            <div v-else class="blue">待提审</div>
          </template>
        </el-table-column>
        <el-table-column label="上传合同主体时间" min-width="120" key="uploadTime">
          <template slot-scope="scope">
            <span v-if="scope.row.uploadTime">{{Number(scope.row.uploadTime)|timeFormat_hm}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="后期状态" min-width="80" v-if="contVersion===2" key="laterStageState">
          <template slot-scope="scope">
            <span
              v-if="scope.row.contType.value<4&&scope.row.contType.value!==1&&!scope.row.isCombine"
            >
              <!-- @click="uploadData(scope.row)" -->
              <el-button
                v-if="scope.row.laterStageState&&scope.row.laterStageState.label==='已拒绝'"
                type="text"
                size="medium"
              >已拒绝</el-button>
              <span v-else>{{scope.row.laterStageState?scope.row.laterStageState.label:'-'}}</span>
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="后期进度" min-width="80" v-if="contVersion===2" key="stepInstanceName">
          <template slot-scope="scope">
            <span v-if="scope.row.contType.value<4&&!scope.row.isCombine">
              <span v-if="scope.row.stepInstanceName==='-'">-</span>
              <el-tooltip
                class="item"
                v-else
                effect="dark"
                :content="scope.row.stepInstanceName"
                placement="top"
              >
                <span
                  class="stepInstanceName"
                  @click="showStepInstance(scope.row)"
                >{{scope.row.stepInstanceName}}</span>
              </el-tooltip>
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="实收/应收" min-width="80" key="received">
          <template slot-scope="scope">
            <div
              class="btn"
              @click="runningWater(scope.row)"
              v-if="scope.row.contType.value<4"
            >{{scope.row.receivedCommission}}/{{scope.row.receivableCommission}}</div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="结算状态" min-width="80" v-if="contVersion===2">
          <template slot-scope="scope">
            <span
              v-if="scope.row.contType.value<4&&!scope.row.isCombine"
            >{{scope.row.resultState.label}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="业绩状态" min-width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.contType.value<4">{{scope.row.achievementState.label}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="签约方式" prop="recordType.label" min-width="70"></el-table-column>
        <el-table-column label="签约时间" min-width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.isCombine">{{scope.row.signDate.substr(0, 16)}}</span>
            <span v-else>{{Number(scope.row.signDate)|timeFormat_}}</span>
          </template>
        </el-table-column>
        <el-table-column label="录入时间" min-width="90">
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.isCombine">{{scope.row.signDate.substr(0, 16)}}</span>
            <span v-else>{{Number(scope.row.signDate)|timeFormat_}}</span> -->
            <span>{{Number(scope.row.createTime)|timeFormat_}}</span>
          </template>
        </el-table-column>
        <el-table-column label="录入人" min-width="90">
          <template slot-scope="scope">
            <p>{{scope.row.recordDeptName}}</p>
            <p>{{scope.row.recordName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="可分配业绩 (元)" min-width="120">
          <template slot-scope="scope">
            <span
              v-if="scope.row.contType.value<4"
            >{{scope.row.distributableAchievement?scope.row.distributableAchievement:0}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="打印次数">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="medium"
              @click="selectPrintInfo(scope.row)"
              v-if="scope.row.printCount>0"
            >{{scope.row.printCount}}</el-button>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="80" fixed="right" class-name="null-formatter">
          <template slot-scope="scope">
            <template v-if="!scope.row.isCombine&&scope.row.contState.value!=-1">
              <div
                class="btn"
                v-if="power['sign-ht-info-view'].state&&scope.row.recordType.value!=2"
                @click="goPreview(scope.row)"
              >预览</div>
              <div
                class="btn"
                v-if="power['sign-ht-view-toverify'].state&&(scope.row.toExamineState.value<0||scope.row.toExamineState.value===2)&&scope.row.isCanAudit===1"
                @click="goSave(scope.row,'cont')"
              >合同提审</div>
              <div
                class="btn"
                v-if="power['sign-ht-qhsh-toverify'].state&&scope.row.signAudit"
                @click="toSignAudit(scope.row,'sign')"
              >签后提审</div>
              <div
                class="btn"
                v-if="scope.row.contState.value===3&&(scope.row.contType.value===1||scope.row.contType.value===2||scope.row.contType.value===3)&&scope.row.contChangeState.value!=2&&scope.row.isHaveData===1&&scope.row.isCanChangeCommission===1"
                @click="toLayerAudit(scope.row)"
              >调佣</div>
              <div
                class="btn"
                v-if="scope.row.contState.value==1&&power['sign-ht-info-del'].state"
                @click="showDelete(scope.row)"
              >删除</div>
              <div
                v-if="(scope.row.contType.value==4||scope.row.contType.value==5)&&scope.row.contState.value===3 && !scope.row.isDeal"
                class="btn"
                @click="toDeal(scope.row)"
              >转成交</div>
              <!-- <div
                v-if="power['sign-ht-info-fqqs'].state&&scope.row.recordType.value===10"
                class="btn"
                @click="toSign(scope.row)"
              >发起签署</div> -->
              <div
                v-if="(scope.row.contState.value===1||scope.row.contState.value===2)&&scope.row.toExamineState.value===1&&scope.row.recordType.value===10"
                class="btn"
                @click="toSign(scope.row)"
              >发起签署</div>
            </template>
            <template v-if="scope.row.isCombine&&scope.row.contState.value!=-1">
              <div
                class="btn"
                v-if="power['sign-ht-info-view'].state&&scope.row.recordType.value===1"
                @click="goPreview(scope.row)"
              >预览</div>
              <div
                class="btn"
                v-if="power['sign-ht-xq-entrust-edit'].state&&(scope.row.toExamineState.value<0||scope.row.toExamineState.value===2)&&scope.row.contType.value<4&&scope.row.isCanAudit===1"
                @click="goSave(scope.row,'cont')"
              >合同提审</div>
              <div
                class="btn"
                v-if="power['sign-ht-qhsh-toverify'].state&&scope.row.signAudit"
                @click="toSignAudit(scope.row,'sign')"
              >签后提审</div>
            </template>
            <template v-if="scope.row.contState.value===-1">
              <div
                class="btn"
                @click="deleteCont(scope.row,1)"
                v-if="power['sign-ht-info-recovery'].state&&!scope.row.isCombine"
              >恢复</div>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 固定滚动条 -->
      <div class="pagination" v-if="tableData.length>0">
        <el-pagination
          class="pagination-info"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <!-- 流水明细弹框 -->
    <flowAccount
      :dialogTableVisible="water"
      :flowType="flowType"
      :contCode="contCode"
      :contId="waterContId"
      @closeRunningWater="closeWater"
      v-if="water"
    ></flowAccount>
    <!-- 调佣弹框 -->
    <layerAudit
      :dialogVisible="tiaoyong"
      :layerAudit="layerAudit"
      @closeCentCommission="closeCommission"
      v-if="tiaoyong"
    ></layerAudit>
    <!-- 结算弹窗 -->
    <layerSettle
      :settleDialog="jiesuan"
      :contId="settleId"
      :layerAudit="layerSettle"
      @closeSettle="closeSettle"
      v-if="settleId"
    ></layerSettle>
    <!-- 变更/解约查看 合同主体上传弹窗 -->
    <changeCancel
      :dialogType="dialogType"
      :dialogContType="dialogContType"
      :cancelDialog="changeCancel"
      operationType="look"
      :dialogOperation="dialogOperation"
      :contId="contId"
      :code="uploadCode"
      @close="ChangeCancelDialog"
      v-if="changeCancel"
    ></changeCancel>
    <!-- 后期进度查看 -->
    <lateProgress title="查看交易流程" ref="lateProgress"></lateProgress>
    <!-- 提审确认框 -->
    <el-dialog title="提示" :visible.sync="isSubmitAudit" width="460px">
      <span class="submitAudit">确定提审？</span>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="isSubmitAudit = false">取 消</el-button>
        <el-button round type="primary" @click="toAudit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 打印详情弹窗 -->
    <el-dialog title="打印详情" :visible.sync="isHavePrint" width="460px">
      <div>
        <el-table :data="printData" border>
          <el-table-column label="操作人">
            <template slot-scope="scope">{{scope.row.createDeptName+'-'+scope.row.createByName}}</template>
          </el-table-column>
          <el-table-column label="打印时间">
            <template slot-scope="scope">{{scope.row.createTime|formatTime}}</template>
          </el-table-column>
          <el-table-column label="类型">
            <template slot-scope="scope">{{scope.row.printType.label}}</template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
    <!-- 打印 -->
    <PdfPrint :url="pdfUrl" ref="pdfPrint" v-if="haveUrl" @closePrint="closePrint"></PdfPrint>
    <!-- <iframe :src="pdfUrl" frameborder="0" style="width:100px" id="dayin"></iframe> -->
    <div class="printMaskLayer" v-if="haveUrl"></div>
    <!-- <span @click="dayin">打印</span> -->
    <!-- 设置/转交审核人 -->
    <checkPerson
      :show="checkPerson.state"
      :type="checkPerson.type"
      :showLabel="checkPerson.label"
      :bizCode="checkPerson.code"
      :flowType="checkPerson.flowType"
      @close="closeCheckPerson"
      @submit="closeCheckPerson"
      v-if="checkPerson.state"
    ></checkPerson>
    <!-- 删除确认框 -->
    <el-dialog title="确认删除" :visible.sync="deleteDialog" width="460px" class="deleteDialog">
      <div class="deleteType">
        <p>确认删除该合同？</p>
        <p>删除后此合同在合同列表隐藏</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="deleteDialog = false">取 消</el-button>
        <el-button round type="primary" @click="deleteCont(deleteItem,0)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- u+转成交弹框 -->
    <el-dialog
      title="转成交"
      :visible.sync="uPlusIsShow"
      width="800px"
      class="uPluseDialog"
      :close-on-click-modal="$tool.closeOnClickModal"
      :close-on-press-escape="$tool.closeOnClickModal"
      >
      <div>
        <ul class="uPlus-class">
          <li class="li" style="width:100%;">
            <em class="cl-999">房源编号：</em>
            {{uPlusHouseDetail&&uPlusHouseDetail.PropertyNo}}
          </li>
          <li class="li" style="width:100%;">
            <em class="cl-999">建筑面积：</em>
            {{uPlusHouseDetail&&uPlusHouseDetail.Square}}㎡
          </li>
          <li class="li" style="width:100%;">
            <em class="cl-999">业主姓名：</em>
            {{uPlusHouseDetail&&uPlusHouseDetail.OwnerInfoList[0].OwnerName}}
          </li>
          <li class="li" style="width:100%;">
            <em class="cl-999">物业地址：</em>
            {{uPlusHouseDetail&&(uPlusHouseDetail.EstateName.replace(/\s/g,"")+' '+uPlusHouseDetail.BuildingName.replace(/\s/g,"")+uPlusHouseDetail.Unit.replace(/\s/g,"")+uPlusHouseDetail.RoomNo.replace(/\s/g,""))}}
          </li>
        </ul>
        <p style="margin-bottom:20px;">选择合同类型：</p>
        <el-select v-model="uPlusContType" placeholder="合同类型" :clearable="true" style="width:600px">
          <el-option
            v-for="item in uPlusDictionary71"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
        <p style="margin-bottom:20px;overflow: hidden;margin-top:20px;">选择签约方式：</p>
        <el-select
          v-model="uPlusQianyueType"
          placeholder="签约方式"
          :clearable="true"
          style="width:600px"
        >
          <el-option
            v-for="item in dictionary['64']"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
        <p class="dialog-footer">
          <el-button round @click="uPlusIsShow = false">取 消</el-button>
          <el-button round type="primary" @click="skipAddCont()">确 定</el-button>
        </p>
      </div>
    </el-dialog>
    <!-- 发起签署选择业主客户 -->
    <chosePerson :dialogVisible="chosePersonDialog" :ownerList="signOwnerList" :guestList="signGuestList" :choseQuery="choseQuery" @closeChose="closeChose"></chosePerson>
    <!-- 发起签署成功上传资料库弹窗 -->
    <el-dialog title="提示" :visible.sync="dataBaseDialog" width="400px" class="dataBase">
      <div>合同已发起签署</div>
      <div>请完成资料库的上传</div>
      <div class="dataBaseBtn">
        <el-button round type="primary" @click="toDataBase">上传资料库</el-button>
      </div>
      
    </el-dialog>
  </div>
</template>

<script>
import ScreeningTop from "@/components/ScreeningTop";
import flowAccount from "@/components/flowAccount";
import layerAudit from "../contractDialog/layerAudit";
import layerSettle from "../contractDialog/layerSettle";
import changeCancel from "../contractDialog/changeCancel";
import lateProgress from "../contractDialog/lateProgress";
import chosePerson from "../contractDialog/chosePerson";
import { TOOL } from "@/assets/js/common";
import { MIXINS } from "@/assets/js/mixins";
import PdfPrint from "@/components/PdfPrint";
import checkPerson from "@/components/checkPerson";

let rows = {};

export default {
  mixins: [MIXINS],
  components: {
    ScreeningTop,
    flowAccount,
    layerAudit,
    layerSettle,
    changeCancel,
    lateProgress,
    PdfPrint,
    checkPerson,
    chosePerson,
  },
  data() {
    return {
      tableBox: null,
      contractForm: {
        dealAgentId: ""
      },
      keyword: "",
      signDate: [],
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      //流水弹窗
      water: false,
      flowType: 1,
      tiaoyong: false,
      layerAudit: {},
      jiesuan: false,
      changeCancel: false,
      dialogOperation: "details",
      dialogType: "",
      dictionary: {
        //数据字典
        "10": "", //合同类型（创建线上  打印空白）
        "65": "", //线下合同类型
        "71": "", //合同类型（筛选条件）
        "9": "", //合同状态
        "51": "", //审核状态
        "6": "", //变更/解约
        "14": "", //结算状态
        "13": "", //收佣状态
        "53": "", //合作方式
        "54": "", //业绩状态
        "538": "", //用途
        "507": "", //租赁时间单位
        "11": "", //后期状态
        "64": "", //签约方式  线上线下
        "72": "" //签后审核状态
      },
      loading: false,
      //部门选择列表
      options: [],
      //经纪人列表
      brokersList: [],
      //合同id
      contId: "",
      //合同状态
      contState: 99,
      settleId: "",
      layerSettle: {
        contarctType: {
          label: ""
        },
        laterStageStatus: {
          lable: ""
        }
      },
      //流水用合同编号
      contCode: "",
      //上传用合同编号
      uploadCode: "",
      waterContId: "",
      housePurpose: [],
      //合同提审
      isSubmitAudit: false,
      submitAuditData: "",
      //签后提审
      signAuditItem: "",
      blankPdf1: "",
      blankPdf2: "",
      blankPdf3: "",
      blankPdf4: "",
      blankPdf5: "",
      pdfUrl: "",
      haveUrl: false,
      http: "",
      //业绩状态
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
      checkPerson: {
        state: false,
        type: 1,
        code: "",
        flowType: 3,
        label: false
      },
      printData: "", //打印次数详情
      isHavePrint: false,
      //合同基本信息版式 1 基础  2 复杂
      contVersion: 2,
      //权限配置
      power: {
        "sign-com-bill": {
          state: false,
          name: "流水"
        },
        "sign-ht-info-collect": {
          state: false,
          name: "收款"
        },
        "sign-ht-info-pay": {
          state: false,
          name: "付款"
        },
        "sign-ht-info-print": {
          state: false,
          name: "打印空白合同"
        },
        "sign-ht-info-add": {
          state: false,
          name: "创建正式合同"
        },
        "sign-ht-info-addoffline": {
          state: false,
          name: "创建线下合同"
        },
        "sign-ht-info-view": {
          state: false,
          name: "预览"
        },
        "sign-ht-view-toverify": {
          state: false,
          name: "提审"
        },
        "sign-ht-xq-entrust-edit": {
          state: false,
          name: "委托合同"
        },
        "sign-ht-xq-main-add": {
          state: false,
          name: "上传"
        },
        "sign-ht-info-adjust": {
          state: false,
          name: "调佣"
        },
        "sign-ht-info-end": {
          state: false,
          name: "结算状态"
        },
        "sign-ht-info-rec": {
          state: false,
          name: "收佣状态"
        },
        "sign-com-hqstep": {
          state: false,
          name: "后期进度"
        },
        "sign-com-htdetail": {
          state: false,
          name: "合同详情"
        },
        "sign-com-house": {
          state: false,
          name: "房源详情"
        },
        "sign-com-cust": {
          state: false,
          name: "客源详情"
        },
        "sign-ht-info-export": {
          state: false,
          name: "导出"
        },
        "sign-ht-info-del": {
          state: false,
          name: "合同删除"
        },
        "sign-ht-info-recovery": {
          state: false,
          name: "合同恢复"
        },
        "sign-ht-qhsh-toverify": {
          state: false,
          name: "签后提审"
        },
        'sign-ht-info-fqqs': {
          state: false,
          name: '发起签署'
        },
        "sign-ht-xq-data-add": {
          state: false,
          name: "编辑资料库"
        },
      },
      showOnLine: false,
      showPrint: false,
      showOffLine: false,
      //合同删除
      deleteDialog: false,
      deleteItem: "",
      dialogContType: 1, //变更解约弹窗是否是意向定金合同
      uPlusIsShow: false,
      uPlusHouseDetail: null,
      uPlusDictionary71: [],
      isDealType: "", //判断房源是租赁还是买卖类型，1租赁，2买卖
      uPlusContType: "",
      uPlusQianyueType: "",
      //发起签署选择业主客户
      chosePersonDialog:false,
      signOwnerList:[],
      signGuestList:[],
      choseQuery:{},
      dataBaseDialog:false
    };
  },
  created() {
    if (!window.location.origin) {
      window.location.origin =
        window.location.protocol +
        "//" +
        window.location.hostname +
        (window.location.port ? ":" + window.location.port : "");
    }
    if (this.$route.query.houseId) {
      this.uPlusIsShow = true;
      this.getUplusHouseDetail(this.$route.query.houseId);
    }
    this.http = window.location.origin;
    this.getAdmin(); //获取当前登录人信息
    this.getDictionary(); //字典
    this.getHousePurpose(); //用途
    this.remoteMethod(); //部门
    this.getVersion(); //获取合同基本信息版式
    let res = this.getDataList;
    if (res && res.route === this.$route.path) {
      this.tableData = res.data.list;
      this.total = res.data.count;
      let session = JSON.parse(sessionStorage.getItem("sessionQuery"));
      this.contractForm = Object.assign({}, this.contractForm, session.query, {
        contTypes:
          session.query.contTypes.length > 0
            ? session.query.contTypes.split(",")
            : ""
      });
      if (this.contractForm.contTypes) {
        this.contractForm.contTypes = this.contractForm.contTypes.map(item => {
          return Number(item);
        });
      }
      // this.contractForm.dealAgentStoreId=''
      // this.contractForm.dealAgentId=''
      delete this.contractForm.keyword;
      delete this.contractForm.pageNum;
      delete this.contractForm.beginDate;
      delete this.contractForm.endDate;
      this.keyword = session.query.keyword;
      this.currentPage = session.query.pageNum;
      if (session.query.beginDate) {
        this.signDate[0] = session.query.beginDate;
        this.signDate[1] = session.query.endDate;
      }
      if (this.contractForm.dealAgentId) {
        this.dep = Object.assign({}, this.dep, {
          id: this.contractForm.dealAgentStoreId,
          empId: this.contractForm.dealAgentId,
          empName: this.contractForm.empName
        });
        this.EmployeList.unshift({
          empId: this.contractForm.dealAgentId,
          name: this.contractForm.empName
        });
        this.getEmploye(this.contractForm.dealAgentStoreId);
      }
    } else {
      this.getContractList(); //合同列表
    }
  },
  methods: {
    moveIn(type) {
      if (type === "online") {
        this.showOnLine = true;
      } else if (type === "offline") {
        this.showOffLine = true;
      } else {
        this.showPrint = true;
      }
    },
    moveOut(type) {
      if (type === "online") {
        this.showOnLine = false;
      } else if (type === "offline") {
        this.showOffLine = false;
      } else {
        this.showPrint = false;
      }
    },
    //获取合同基本信息版式（1 基础版  2 复杂版）
    getVersion() {
      this.$ajax.get("/api/cont/version/getVersion").then(res => {
        res = res.data;
        if (res.status === 200) {
          if (res.data) {
            this.contVersion = res.data;
          }
        }
      });
    },
    //表格第一例用蓝色背景区分
    rowStyle(val) {
      if (val.row.bgc) {
        return "collapseRow";
      }
      return;
    },
    //委托合同合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (row.contractEntrust && row.contractEntrust.id && !row.isCombine) {
          rows = {
            index: rowIndex,
            id: row.contractEntrust.id
          };
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          if (
            rowIndex === rows.index + 1 &&
            row.contractEntrust &&
            rows.id === row.contractEntrust.id
          ) {
            return {
              rowspan: 0,
              colspan: 0
            };
          } else {
            return {
              rowspan: 1,
              colspan: 1
            };
          }
        }
      } else {
        return {
          rowspan: 1,
          colspan: 1
        };
      }
    },
    dayin() {
      document.querySelector("#dayin").contentWindow.print();
    },
    //用途
    getHousePurpose() {
      let param = {
        type: "HousePurpose"
      };
      this.$ajax.get("/api/dictionary/uplus", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.housePurpose = res.data;
        }
      });
    },
    //获取合同列表
    getContractList(type = "init") {
      let param = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.keyword
      };
      param = Object.assign({}, param, this.contractForm);
      if (this.signDate) {
        if (this.signDate.length > 0) {
          param.beginDate = this.signDate[0];
          param.endDate = this.signDate[1];
        }
      }
      if (
        this.contractForm.contTypes &&
        this.contractForm.contTypes.length > 0
      ) {
        param.contTypes = this.contractForm.contTypes.join(",");
      } else {
        param.contTypes = "";
      }

      if (type === "search" || type === "page") {
        sessionStorage.setItem(
          "sessionQuery",
          JSON.stringify({
            path: "/contractList",
            url: "/contract/contractList",
            query: Object.assign({}, param, {
              empName: this.dep.empName
            }),
            methods: "postJSON"
          })
        );
      }
      this.$ajax.postJSON("/api/contract/contractList", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.tableData = res.data.list;
          this.total = res.data.count;
        }
      });
    },
    //重置
    resetFormFn() {
      TOOL.clearForm(this.contractForm);
      this.keyword = "";
      this.signDate = [];
      this.EmployeList = [];
    },
    // 查询
    queryFn() {
      this.currentPage = 1;
      this.getContractList("search");
    },
    //佣金比例
    changeRatio(type) {
      if (type === "begin") {
        this.$nextTick(() => {
          this.contractForm.beginRatio = this.$tool.cutFloat({
            val: this.contractForm.beginRatio,
            max: 100
          });
        });
      } else if (type === "end") {
        this.$nextTick(() => {
          this.contractForm.endRatio = this.$tool.cutFloat({
            val: this.contractForm.endRatio,
            max: 100
          });
        });
      }
    },
    //流水
    runningWater(item) {
      if (this.power["sign-com-bill"].state) {
        if (item.contState.value != -1) {
          if (item.isCombine) {
            this.flowType = 8;
          } else {
            this.flowType = 1;
          }
          this.water = true;
          this.contCode = item.code;
          this.waterContId = item.id;
        } else {
          this.$message({
            message: "此合同已删除无法进行操作",
            type: "warning"
          });
        }
      } else {
        this.$message({
          message: "没有流水查看权限",
          type: "warning"
        });
      }
    },
    //关闭流水弹窗
    closeWater() {
      this.water = false;
      this.contCode = "";
      this.waterContId = "";
    },
    //收款
    gathering(item) {
      if (this.power["sign-ht-info-collect"].state) {
        if (item.contState.value != -1) {
          this.$router.push({
            path: "/receiptBill",
            query: {
              contId: item.id,
              code: item.code,
              isentrust: item.isCombine ? 1 : 0
            }
          });
        } else {
          this.$message({
            message: "此合同已删除无法进行操作",
            type: "warning"
          });
        }
      } else {
        this.$message({
          message: "没有收款权限",
          type: "warning"
        });
      }
    },
    //付款
    payment(item) {
      if (this.power["sign-ht-info-pay"].state) {
        if (item.contState.value != -1) {
          this.$router.push({
            path: "/payBill",
            query: {
              contId: item.id,
              code: item.code,
              address: item.propertyAddr
            }
          });
        } else {
          this.$message({
            message: "此合同已删除无法进行操作",
            type: "warning"
          });
        }
      } else {
        this.$message({
          message: "没有付款权限",
          type: "warning"
        });
      }
    },
    //打印次数详情
    selectPrintInfo(item) {
      let param = {
        contId: item.id
      };
      if (item.isCombine) {
        param.isentrust = 1;
      }
      this.$ajax.get("/api/contract/selectPrintInfo", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          if (res.data.length > 0) {
            this.printData = res.data;
            this.isHavePrint = true;
          }
        }
      });
    },
    //合同详情页
    toDetail(value) {
      if (this.power["sign-com-htdetail"].state) {
        if (value.contState.value != -1) {
          if (
            value.contType.value === 1 ||
            value.contType.value === 2 ||
            value.contType.value === 3
          ) {
            let newPage = this.$router.resolve({
              path: "/contractDetails",
              query: {
                id: value.id, //合同id
                contType: value.contType.value //合同类型
              }
            });
            window.open(newPage.href, "_blank");
          } else {
            let newPage = this.$router.resolve({
              path: "/detailIntention",
              query: {
                id: value.id,
                contType: value.contType.value
              }
            });
            window.open(newPage.href, "_blank");
          }
        } else {
          this.$message({
            message: "此合同已删除无法进行操作",
            type: "warning"
          });
        }
      } else {
        this.$message({
          message: "没有合同详情查看权限",
          type: "warning"
        });
      }
    },
    uploadData(value) {
      if (this.power["sign-com-htdetail"].state) {
        // let pathArr = this.getPath.concat([{name:"合同详情"}])
        // this.setPath(pathArr)
        this.$router.push({
          path: "/contractDetails",
          query: {
            type: "dataBank",
            id: value.id,
            code: value.code,
            contType: value.contType.value
          }
        });
      } else {
        this.$message({
          message: "没有合同详情权限",
          type: "warning"
        });
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getContractList("page");
    },
    //新增线上合同
    addOnLine(val) {
      if (val.key != 2 || (val.key === 2 && !val.children)) {
        this.showOnLine = false;
        let param = {
          recordType: 1,
          type: val.key
        };
        this.$ajax
          .get("/api/contract/checkContTemplate", param)
          .then(res => {
            res = res.data;
            if (res.status === 200) {
              localStorage.removeItem("backMsg");
              if (val.key === 1 || val.key === 2 || val.key === 3) {
                this.$router.push({
                  path: "/addContract",
                  query: {
                    type: val.key,
                    operateType: 1,
                    // isOffline: 0
                    recordType: 1
                  }
                });
              } else if (val.key === 7 || val.key === 8) {
                this.$router.push({
                  path: "/addContract",
                  query: {
                    type: 2,
                    operateType: 1,
                    // isOffline: 0,
                    recordType: 1,
                    loanType: val.key
                  }
                });
              } else if (val.key === 4 || val.key === 5) {
                this.$router.push({
                  path: "/newIntention",
                  query: {
                    contType: val.key,
                    operateType: 1,
                    // isOffline: 0
                    recordType: 1
                  }
                });
              }
            } else {
              this.$message({
                message: "该类型合同模板未上传,请上传后再创建",
                type: "warning"
              });
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
    //新增线下合同
    addOffLine(val) {
      if (val.key != 2 || (val.key === 2 && !val.children)) {
        this.showOffLine = false;
        if (val.key === 1 || val.key === 2 || val.key === 3) {
          this.$router.push({
            path: "/addContract",
            query: {
              type: val.key,
              operateType: 1,
              // isOffline: 1
              recordType: 2
            }
          });
        } else if (val.key === 7 || val.key === 8) {
          this.$router.push({
            path: "/addContract",
            query: {
              type: 2,
              operateType: 1,
              // isOffline: 1,
              recordType: 2,
              loanType: val.key
            }
          });
        } else if (val.key === 4 || val.key === 5) {
          this.$router.push({
            path: "/newIntention",
            query: {
              contType: val.key,
              operateType: 1,
              // isOffline: 1
              recordType: 2
            }
          });
        }
      }
    },
    //合同预览
    goPreview(item) {
      this.$router.push({
        path: "/contractPreview",
        query: {
          id: item.id,
          code: item.code,
          isentrust: item.isCombine ? 1 : 0
        }
      });
    },
    //调佣弹窗
    toLayerAudit(item) {
      let param = {
        contractCode: item.code
      };
      this.$ajax
        .get("/api/commission/detail", param)
        .then(res => {
          let data = res.data;
          if (res.data.status === 200) {
            this.layerAudit = data.data;
            this.tiaoyong = true;
          }
        })
        .catch(error => {
          this.$message({
            message: error,
            type: "error"
          });
        });
    },
    //关闭调佣弹窗
    closeCommission() {
      this.tiaoyong = false;
      this.layerAudit = {};
      this.getContractList();
    },
    //关闭变更解约弹窗
    ChangeCancelDialog() {
      this.changeCancel = false;
      this.contId = "";
      this.getContractList();
    },
    //字典查询
    getDictionaries() {
      this.$ajas.get("/api/dictionary/batchQuery", param).then(res => {});
    },
    //变更解约弹窗
    goChangeCancel(item) {
      if (item.contChangeState.value === 1) {
        this.changeCancel = true;
        this.dialogType = "bg";
        this.contId = item.id;
      } else if (item.contChangeState.value === 2) {
        this.changeCancel = true;
        this.dialogType = "jy";
        this.contId = item.id;
      }
      if (item.contType.value > 3) {
        this.dialogContType = 2;
      } else {
        this.dialogContType = 1;
      }
    },
    //获取当前部门
    initDepList: function(val) {
      if (!val) {
        this.remoteMethod();
      }
    },
    clearDep: function() {
      this.contractForm.dealAgentStoreId = "";
      this.contractForm.depName = "";
      // this.EmployeList=[]
      this.contractForm.dealAgentId = "";
      this.clearSelect();
    },
    depHandleClick(data) {
      // this.getEmploye(data.depId)
      this.contractForm.dealAgentStoreId = data.depId;
      this.contractForm.depName = data.name;
      this.contractForm.dealAgentId = "";

      this.handleNodeClick(data);
    },
    searchDep: function(payload) {
      /*this.DepList=payload.list
      this.contractForm.depName=payload.depName*/
    },
    //提审
    goSave(item, type) {
      this.isSubmitAudit = true;
      this.submitAuditData = item;
      this.auditType = type;
    },
    submitAudit() {
      let param = {
        cityId: this.submitAuditData.cityCode,
        flowType: this.submitAuditData.isCombine ? 11 : 3,
        bizCode: this.submitAuditData.code,
        modularType: 0 //合同类型
      };
      this.$ajax
        .get("/api/machine/submitAduit", param)
        .then(res => {
          this.isSubmitAudit = false;
          res = res.data;
          if (res.status === 200) {
            this.$message({
              message: "提审成功",
              type: "success"
            });
            this.getContractList();
          } else {
            this.$message({
              message: res.message
            });
          }
        })
        .catch(error => {
          this.isSubmitAudit = false;
          if (error.message === "下一节点审批人不存在") {
            this.checkPerson.code = this.submitAuditData.code;
            this.checkPerson.state = true;
            this.checkPerson.flowType = this.submitAuditData.isCombine ? 11 : 3;
            // this.checkPerson.type=error.data.type===1?'set':'init';
            this.checkPerson.label = true;
          } else {
            this.$message({
              message: error,
              type: "error"
            });
          }
        });
    },
    closeCheckPerson() {
      this.checkPerson.state = false;
      this.getContractList();
    },
    //发起结算弹窗
    closeAccount(item) {
      if (this.power["sign-ht-info-end"].state) {
        if (item.contChangeState.value !== 2) {
          let param = {
            id: item.id
          };
          this.$ajax
            .get("/api/settlement/getSettlById", param)
            .then(res => {
              // console.log(res);
              let data = res.data;
              if (res.data.status === 200) {
                this.jiesuan = true;
                this.settleId = item.id;
                this.layerSettle = data.data;
              }
            })
            .catch(error => {
              this.$message({
                message: error,
                type: "warning"
              });
            });
        } else {
          this.$message({
            message: "合同已解约，无法发起结算",
            type: "warning"
          });
        }
      } else {
        this.$message({
          message: "没有结算权限",
          type: "warning"
        });
      }
    },
    //关闭结算弹窗
    closeSettle() {
      this.jiesuan = false;
      this.settleId = "";
      this.getContractList();
    },
    //后期流程查看
    showStepInstance(item) {
      if (this.power["sign-com-hqstep"].state) {
        let value = {
          id: item.id,
          transFlowName: item.stepInstanceName,
          statusReceiveAmount: item.resultState
        };
        this.$refs.lateProgress.show(value);
      } else {
        this.$message({
          message: "没有后期流程查看权限",
          type: "warning"
        });
      }
    },
    closePrint() {
      this.pdfUrl = "";
      this.haveUrl = false;
    },
    //打印空白合同
    printCont(val) {
      if (val.key != 2 || (val.key === 2 && !val.children)) {
        this.showPrint = false;
        let param = {
          type: val.key
        };
        this.$ajax
          .get("/api/setting/contractTemplate/checkBlankPdf", param)
          .then(res => {
            res = res.data;
            if (res.status === 200) {
              let dayRandomTime = new Date().getTime();
              this.pdfUrl = `${this.http}/api/setting/contractTemplate/getBlankPdf?type=${val.key}&dayRandomTime=${dayRandomTime}`;
              this.haveUrl = true;
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
    //导出
    getExcel() {
      let param = {
        // pageNum: this.currentPage,
        // pageSize: this.pageSize,
        keyword: this.keyword
      };
      param = Object.assign({}, param, this.contractForm);
      if (this.signDate) {
        if (this.signDate.length > 0) {
          param.beginDate = this.signDate[0];
          param.endDate = this.signDate[1];
        }
      }
      if (
        this.contractForm.contTypes &&
        this.contractForm.contTypes.length > 0
      ) {
        param.contTypes = this.contractForm.contTypes.join(",");
      } else {
        param.contTypes = "";
      }

      delete param.depName;
      this.excelCreate("/input/contractExcel", param);
    },
    //合同删除确认框
    showDelete(val) {
      this.deleteItem = val;
      this.deleteDialog = true;
    },
    //合同删除
    deleteCont(val, type) {
      let param = {
        type: type,
        id: val.id
      };
      this.$ajax
        .put("/api/contract/delete", param, 2)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.$message({
              message: type === 1 ? "恢复成功" : "删除成功",
              type: "success"
            });
            this.deleteDialog = false;
            this.getContractList();
          }
        })
        .catch(error => {
          this.$message({
            message: error,
            type: "error"
          });
        });
    },
    //提审
    toAudit() {
      if (this.auditType === "cont") {
        this.submitAudit();
      } else if (this.auditType === "sign") {
        this.signAudit();
      }
    },
    //签后提审确认弹窗
    toSignAudit(val, type) {
      this.signAuditItem = val;
      this.isSubmitAudit = true;
      this.auditType = type;
    },
    //签后提审
    signAudit() {
      let param = {
        contId: this.signAuditItem.id,
        contType: this.signAuditItem.isCombine
          ? this.signAuditItem.isCombine
          : false
      };
      this.$ajax
        .post("/api/signingAudit/addsignin", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.isSubmitAudit = false;
            this.$message({
              message: "提审成功",
              type: "success"
            });
            this.getContractList();
          }
        })
        .catch(error => {
          this.isSubmitAudit = false;
          if (error.message === "下一节点审批人不存在") {
            this.checkPerson.code = error.data.bizCode;
            this.checkPerson.state = true;
            this.checkPerson.flowType = 12; //签后审核的流程类型为12
            this.checkPerson.label = true;
          } else {
            this.getContractList();
            this.$message({
              message: error,
              type: "error"
            });
          }
        });
    },
    //意向/定金转成交
    toDeal(row) {
      this.$router.push({
        path: "/addContract",
        query: {
          id: row.id,
          operateType: 1,
          type: row.contType.value,
          recordType: row.recordType.value,
          isDeal: 1
        }
      });
    },
    //获取U+房源详情
    getUplusHouseDetail(id) {
      let param = {
        houseId: id
      };
      this.$ajax
        .get("/api/resource/houses/one", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            console.log("获取房源详情");
            console.log(res);
            this.uPlusHouseDetail = res.data;
            console.log(this.uPlusHouseDetail);
            this.isDealType =
              this.uPlusHouseDetail.PropertyNo &&
              this.uPlusHouseDetail.PropertyNo.search("Z") === 0
                ? 1
                : 2;
            // this.uPlusDictionary71 = this.dictionary["71"];
            if (this.isDealType == 1) {
              //房源编号为租赁
              this.dictionary["71"].map((item, index) => {
                if (item.key == 2 || item.key == 3) {
                  return;
                } else {
                  this.uPlusDictionary71.push(item);
                }
              });
            } else if (this.isDealType == 2) {
              //房源编号为买卖
              this.dictionary["71"] &&
                this.dictionary["71"].map((item, index) => {
                  if (item.key == 1) {
                    return;
                  } else {
                    this.uPlusDictionary71.push(item);
                  }
                });
            }
            console.log("========");
            console.log(this.uPlusDictionary71);
          }
        })
        .catch(error => {
          this.$message({
            message: error
          });
        });
    },
    // 跳转新增合同
    skipAddCont() {
      if (this.uPlusContType == "") {
        this.$message({
          message: "请选择合同类型",
          type: "warning"
        });
        return;
      }
      if (this.uPlusQianyueType == "") {
        this.$message({
          message: "请选择签约方式",
          type: "warning"
        });
        return;
      }
      if (
        this.uPlusContType === 1 ||
        this.uPlusContType === 2 ||
        this.uPlusContType === 3
      ) {
        this.$router.push({
          path: "/addContract",
          query: {
            type: this.uPlusContType,
            operateType: 1,
            recordType: this.uPlusQianyueType,
            houseId: this.$route.query.houseId,
            turnDeal: 1
          }
        });
      } else if (this.uPlusContType === 4 || this.uPlusContType === 5) {
        this.$router.push({
          path: "/newIntention",
          query: {
            contType: this.uPlusContType,
            operateType: 1,
            recordType: this.uPlusQianyueType,
            houseId: this.$route.query.houseId,
            turnDeal: 1
          }
        });
      }
    },
    //发起签署
    toSign(val){
        this.choseQuery = {
            id:val.id,
            isHaveData:val.isHaveData,
            storeId:val.guestStoreCode,
            code:val.code,
            contType:val.contType.value
          }
        let owner = []
        let guest = []
        val.contPersons.forEach(element => {
            if(element.personType.value === 1){
                owner.push(element)
            }else{
                guest.push(element)
            }
        });
        if(owner.length>1||guest.length>1){//多个业主客户时选择一个发起签署
            this.signOwnerList=[].concat(owner)
            this.signGuestList=[].concat(guest)
            this.chosePersonDialog=true
        }else{
            let param = {
                contId:val.id,
                type:1,//签章
                isentrust:0,//非委托
                storeId:val.guestStoreCode//门店id
            }
            param.owner=[
                {name:owner[0].name,identityType:owner[0].cardType,identity:owner[0].encryptionCode,mobile:owner[0].mobile,email:owner[0].email}
            ]
            param.customer=[
                {name:guest[0].name,identityType:guest[0].cardType,identity:guest[0].encryptionCode,mobile:guest[0].mobile,email:guest[0].email}
            ]
            this.$ajax.postJSON('/api/app/contract/sendCont',param).then(res=>{
                res=res.data
                if(res.status===200){
                    if(!val.isHaveData){
                      this.dataBaseDialog=true
                    }else{
                      this.$message({
                        message:"操作成功",
                        type:"success"
                      })
                    }
                }
            }).catch(error=>{
                this.$message({
                  message:error,
                  type:"error"
                })
            })
        }
    },
    closeChose(val){
      this.chosePersonDialog=false
      if(val&&this.choseQuery.isHaveData){
        this.dataBaseDialog=true
      }
    },
    toDataBase(){
      if(this.power['sign-com-htdetail'].state){
        if(this.power['sign-ht-xq-data'].state){
					this.setPath(this.$tool.getRouter(['合同','合同列表','合同详情'],'contractList'));
					let path
					if(this.Msg.type===4||this.Msg.type===5){
						path="/detailIntention"
					}else{
						path="/contractDetails"
					}
          this.$router.replace({
            path: path,
            query: {
              type: "dataBank",
              id: this.choseQuery.id,//合同id
              code: this.choseQuery.code,//合同编号
              contType: this.choseQuery.contType//合同类型
            }
          });
        }else{
          this.$message({
            message:'没有资料库权限,无法跳转到资料库'
          });
          this.$router.push('/contractList');
        }
      }else{
        this.$message({
          message:'没有合同详情权限,无法跳转到资料库'
        });
        this.$router.push('/contractList');
      }
    }
  },
  computed: {
    combineList() {
      let arr = JSON.parse(JSON.stringify(this.tableData));
      arr.forEach((element, index) => {
        if ((index + 1) % 2 === 0) {
          this.$set(element, "bgc", true);
        }
      });
      this.tableData.forEach((element, index) => {
        if (element.contractEntrust && element.contractEntrust.id) {
          //在指定位置添加元素,第一个参数指定位置,第二个参数指定要删除的元素,如果为0,则追加
          let combineItem = JSON.parse(JSON.stringify(element));
          combineItem.loanType = 0; //武汉买卖类型
          combineItem.isCombine = true; //是否是插入的数据
          combineItem.signDate = combineItem.contractEntrust.signDate;
          combineItem.printCount = combineItem.contractEntrust.printCount; //打印次数
          combineItem.distributableAchievement =
            combineItem.contractEntrust.tradeFeeCommission; //可分配业绩
          combineItem.receivableCommission = combineItem.contractEntrust
            .receivableCommission
            ? combineItem.contractEntrust.receivableCommission
            : 0; //应收
          combineItem.receivedCommission = combineItem.contractEntrust
            .receivedCommission
            ? combineItem.contractEntrust.receivedCommission
            : 0; //实收

          if (combineItem.contState.value != -1) {
            combineItem.contState.value =
              combineItem.contractEntrust.entrustState; //合同状态
            combineItem.contState.label =
              combineItem.contractEntrust.entrustState === 1
                ? "起草中"
                : combineItem.contractEntrust.entrustState === 2
                ? "已签章"
                : "已签约";
          }
          //签后审核状态
          if (combineItem.signingEntrustState) {
            combineItem.signingState = {};
            combineItem.signingState.value =
              combineItem.signingEntrustState.value;
            combineItem.signingState.label =
              combineItem.signingEntrustState.label;
          } else {
            combineItem.signingState = "";
          }
          //签后审核驳回原因
          if (combineItem.signingEntrustRemarks) {
            combineItem.signingRemarks = combineItem.signingEntrustRemarks;
          } else {
            combineItem.signingRemarks = "";
          }

          combineItem.toExamineState.value =
            combineItem.contractEntrust.examineState; //审核状态
          combineItem.toExamineState.label =
            combineItem.contractEntrust.examineState === -1
              ? "待提审"
              : combineItem.contractEntrust.examineState === 0
              ? "审核中"
              : combineItem.contractEntrust.examineState === 1
              ? "已通过"
              : "已驳回";
          combineItem.uploadTime = combineItem.contractEntrust.uploadTime
            ? combineItem.contractEntrust.uploadTime
            : "-";
          // combineItem.achievementState.value=combineItem.contractEntrust.achievementState//业绩状态
          // combineItem.achievementState.label=combineItem.contractEntrust.achievementState===-2?"未录入":combineItem.contractEntrust.achievementState===-1?"待提审":combineItem.contractEntrust.achievementState===0?"审核中":combineItem.contractEntrust.achievementState===1?"已通过":"已驳回"
          combineItem.isCanAudit = combineItem.contractEntrust.isCanAudit
            ? combineItem.contractEntrust.isCanAudit
            : 0; //H5是否填写完整
          combineItem.signAudit = combineItem.contractEntrust.entrustSignAudit
            ? combineItem.contractEntrust.entrustSignAudit
            : false; //H5是否填写完整

          arr.forEach((ele, i) => {
            if (
              ele.contractEntrust &&
              ele.contractEntrust.id === element.contractEntrust.id &&
              !ele.isCombine
            ) {
              arr.splice(i + 1, 0, combineItem);
            }
          });
        }
      });
      console.log(arr);
      return arr;
    }
  },
  filters: {
    timeFormat_: function(val) {
      if (!val) {
        return "--";
      } else {
        let time = new Date(val);
        let y = time.getFullYear();
        let M = time.getMonth() + 1;
        let D = time.getDate();
        let h = time.getHours();
        let m = time.getMinutes();
        let s = time.getSeconds();
        let time_ = `${y}-${M > 9 ? M : "0" + M}-${D > 9 ? D : "0" + D} ${
          h > 9 ? h : "0" + h
        }:${m > 9 ? m : "0" + m}:${s > 9 ? s : "0" + s}`;
        return time_.substr(0, 16);
      }
    },
    timeFormat_hm: function(val) {
      if (!val) {
        return "--";
      } else {
        let time = new Date(val);
        let y = time.getFullYear();
        let M = time.getMonth() + 1;
        let D = time.getDate();
        let h = time.getHours();
        let m = time.getMinutes();
        let s = time.getSeconds();
        let time_ = `${y}-${M > 9 ? M : "0" + M}-${D > 9 ? D : "0" + D} ${
          h > 9 ? h : "0" + h
        }:${m > 9 ? m : "0" + m}:${s > 9 ? s : "0" + s}`;
        return time_.substr(0, 16);
      }
    }
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.width300 {
  width: 325px !important;
}
/deep/.pdl {
  &.cell {
    padding-left: 30px !important;
  }
}
// /deep/.el-table tbody tr:hover>td {
//     background-color:#ffffff!important
// }
/deep/.el-table__body {
  .el-table__row {
    &.hover-row {
      background-color: #fff !important;
      td {
        background-color: #fff !important;
      }
    }
    &.collapseRow {
      .bgc {
        background-color: #ecf5ff !important;
      }
    }
  }
}
.percent {
  position: relative;
  &::before {
    content: "%";
    position: absolute;
    right: 8px;
    color: #ccc;
  }
}
/deep/.el-form-item {
  margin-bottom: 10px;
}
/deep/.paper-box {
  /*padding-top: 10px !important;
  margin-bottom: 10px;*/
  background-color: #fff;
  border-radius: 2px;
  box-sizing: border-box;
  // box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
  .paper-set-tit {
    padding-bottom: 10px;
  }
}
/deep/.margin-left {
  margin-left: 0;
}
.pagination {
  /deep/.pagination-info {
    text-align: right;
    margin-top: 0;
  }
}
.printMaskLayer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  // display: none;
  z-index: 8888;
}
.contract-list {
  background-color: #fff;
  padding: 0 10px;
  border-radius: 2px;
  // box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
  > .listTitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    .title {
      font-size: 14px;
      color: @color-blank;
      i {
        padding-right: 8px;
      }
    }
    .text {
      font-size: 14px;
      color: @color-6c;
      padding-left: 10px;
    }
    .data {
      font-size: 14px;
      color: @color-blue;
    }
    .showOnLine {
      .holderPlace {
        display: inline-block !important;
      }
    }
    .printStyle {
      background-color: #fff !important;
      color: #606266 !important;
      border: 1px solid #dcdfe6;
    }
    .haveSon {
      cursor: pointer;
      display: inline-block;
      width: 120px;
      line-height: 2.7;
      border-radius: 20px;
      // font-size: 14px;
      background-color: #409eff;
      color: #fff;
      text-align: center;
      position: relative;
      .holderPlace {
        display: none;
        z-index: 999;
        position: absolute;
        top: 25px;
        left: 25px;
        padding-top: 20px;
        .mainList {
          line-height: 1;
          padding: 10px 0;
          background-color: #fff;
          color: #606266;
          display: inline-block;
          width: 73px;
          box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
          border-radius: 3px;
          > li {
            cursor: pointer;
            padding: 10px 5px;
            font-size: 14px;
            text-align: center;
            position: relative;
            &:hover {
              color: @color-blue;
              background-color: #ecf5ff;
            }
            .childrenModule {
              padding-left: 20px;
              position: absolute;
              top: 0;
              left: 60px;
              .childrenList {
                padding: 5px 0;
                display: inline-block;
                background-color: #fff;
                width: 73px;
                box-shadow: 0px 1px 6px 0px rgba(7, 47, 116, 0.1);
                > li {
                  cursor: pointer;
                  padding: 10px 5px;
                  font-size: 14px;
                  color: #606266;
                  text-align: center;
                  &:hover {
                    color: @color-blue;
                    background-color: #ecf5ff;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .name-wrapper {
    // min-width: 80px;
    height: 65px;
    line-height: 65px;
    text-align: center;
    display: -webkit-box;
    /*!autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .isFlex {
    display: flex;
    align-items: center;
  }
  .shell {
    width: 100%;
    height: 100%;
    display: inline-block;
  }
  .stepInstanceName {
    max-width: 130px;
    color: @color-blue;
    cursor: pointer;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    // display: inline-block;
  }
}
.contract_msg {
  display: flex;
  align-items: center;
  .riskLabel {
    width: 20px;
    padding-right: 20px;
    color: @color-orange;
    font-size: 18px;
    .risk {
      color: @color-warning;
      position: relative;
      .remarksExamine {
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
      .blueColor {
        color: @color-blue;
        cursor: pointer;
      }
    }
  }
}

.blue {
  color: @color-blue;
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
      content: "--";
      width: 30px;
      display: inline-block;
    }
  }
}
.deleteDialog {
  .deleteType {
    text-align: center;
    padding: 30px 0;
    p {
      font-size: 16px;
      &:last-of-type {
        font-size: 14px;
        color: red;
        margin-top: 10px;
      }
    }
  }
  /deep/.el-dialog__footer {
    padding: 10px;
    border-top: 1px solid #e8eaf6;
  }
}
.submitAudit {
  display: inline-block;
  padding-top: 10px;
}
.tooltipWidth {
  span {
    max-width: 160px;
    display: inline-block;
  }
}
.uPluseDialog {
  padding: 50px;
  // padding-bottom: 200px;
  .uPlus-class {
    width: 800px;
    padding: 20px;

    overflow: hidden;
    li {
      width: 300px !important;
      height: 50px;
      float: left;
      // margin: 20px 0 0 100px;

      // &:first-of-type{
      //   margin-left: 0;
      // }
    }
  }
  .dialog-footer {
    text-align: center;
    padding: 50px 0 50px 0;
  }
}
.dataBase{
  /deep/.el-dialog__body{
    div{
      text-align: center;
      &:first-child{
        margin-top: 20px;
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }
    }
    .dataBaseBtn{
      padding: 20px 0;
    }
  }
}
</style>
