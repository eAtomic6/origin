<template>
    <div>
        <div class="dialog1">

            <div v-loading="loading"
                class="base-dialog">
                <!-- 头部左边业绩分成title -->
                <div class="ach-header">
                    <h1 v-if="dialogType==0">业绩申诉审核
                    </h1>
                </div>

                <!-- 房源列表 -->
                <div class="ach-body">
                    <div class="house-divide">
                        <div class="house-left f_l">
                            <h1 class="f14">房源方分成 <span style="position:relative;left:20px;color:#f56c6c">合计：{{housetotal?housetotal:0}}%</span>
                            </h1>
                            <p class="f_l delive">房客源可分配业绩总计：{{comm?comm:0}}元</p>
                        </div>
                        <div class="house-right f_r"
                            v-if="!backAId">
                            <el-button type="primary"
                                v-if="dialogType==0"
                                @click="houseRelativeMans('getExamineEmployees')">相关人员
                            </el-button>
                            <el-button type="primary"
                                v-else-if="dialogType==1"
                                @click="houseRelativeMans('getEmployeesByEdit')">相关人员
                            </el-button>
                            <el-button type="primary"
                                v-else-if="dialogType==2"
                                @click="houseRelativeMans('getBackExamineEmployees')">相关人员
                            </el-button>
                            <el-button type="primary"
                                v-else-if="dialogType==3"
                                @click="houseRelativeMans('getFirstInput')">相关人员
                            </el-button>
                            <el-button type="primary"
                                @click="addListCell('houseArr')">添加分配人
                            </el-button>
                            <el-button type="primary"
                                @click="houseRecode">房源价格变更记录
                            </el-button>
                        </div>
                    </div>

                    <div class="ach-divide-list">
                        <el-table :data="houseArr"
                            style="width:100%">
                            <!-- 角色类型 不可输入-->
                            <el-table-column label="角色类型"
                                width="125">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.roleType"
                                        placeholder="请选择"
                                        @change="rolesTypeCheck(scope.row.roleType,scope.$index,'houseArr')">
                                        <el-option v-for="item in roleType0"
                                            :key="item.id"
                                            :label="item.description"
                                            :value="item.code"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>

                            <!-- 分成比例保留小数点后一位有效数字 可输入,不可下拉-->
                            <el-table-column label="分成比例(%)"
                                width="95">
                                <template slot-scope="scope">
                                    <el-input v-model.number="scope.row.ratio"
                                        placeholder="请输入"
                                        @input="filterRatioVal(scope.row.ratio,scope.$index,'houseArr')"></el-input>
                                </template>
                            </el-table-column>

                            <el-table-column label="分成金额（元）"
                                width="110">
                                <template slot-scope="scope">
                                    {{(comm|| 0) * scope.row.ratio  / 100 * (100 - (scope.row.platformFeeRatio || 0)) / 100 }}
                                    <!-- (合同应收佣金 * 个人角色比例) - (特许服务费 = 合同应收佣金 * 个人角色比例 * 平台费比例) -->
                                </template>
                            </el-table-column>

                            <!-- 经纪人,可输入,可下拉,搜索不到匹配项,失去焦点清空val -->
                            <el-table-column label="经纪人">
                                <template slot-scope="scope">
                                    <el-tooltip class="item"
                                        effect="dark"
                                        :disabled="scope.row.assignor?false:true"
                                        :content="scope.row.assignor+''"
                                        placement="top"
                                        :open-delay="300">
                                        <el-select v-model="scope.row.assignor"
                                            filterable
                                            remote
                                            reserve-keyword
                                            :clearable="true"
                                            placeholder="请输入内容"
                                            :remote-method="getAssignors"
                                            :loading="loading1"
                                            v-loadmore="moreAssignors"
                                            @change="changeAssignors(scope.row.assignor,scope.$index,0)">
                                            <el-option v-for="item in assignors"
                                                :key="item.empId"
                                                :label="item.name+'-'+item.depName"
                                                :value="item.empId"></el-option>
                                        </el-select>
                                    </el-tooltip>
                                </template>
                            </el-table-column>

                            <!-- <el-table-column label="登录账号" v-if="getUser.version===3" width="120">
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="scope.row.loginAccount+''"
                    :disabled="scope.row.loginAccount?false:true"
                    placement="top"
                    :open-delay="300"
                  >
                    <el-input v-if="!!scope.row.loginAccount" v-model="scope.row.loginAccount" disabled></el-input>
                    <el-input v-else v-model="hx" disabled></el-input>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="员工工号" v-if="getUser.version===3" width="120">
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="scope.row.assignorNum+''"
                    :disabled="scope.row.assignorNum?false:true"
                    placement="top"
                    :open-delay="300"
                  >
                    <el-input
                      v-if="scope.row.assignorNum&&scope.row.assignorNum.length>0"
                      v-model="scope.row.assignorNum"
                      disabled
                    ></el-input>
                    <el-input v-else v-model="hx" disabled></el-input>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="经纪人工号" v-else width="120">
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="scope.row.assignorNum+''"
                    :disabled="scope.row.assignorNum?false:true"
                    placement="top"
                    :open-delay="300"
                  >
                    <el-input
                      v-if="scope.row.assignorNum&&scope.row.assignorNum.length>0"
                      v-model="scope.row.assignorNum"
                      disabled
                    ></el-input>
                    <el-input v-else v-model="hx" disabled></el-input>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="经纪人级别" width="100">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.assignorLevel&&scope.row.assignorLevel.length>0"
                    v-model="scope.row.assignorLevel"
                    disabled
                  ></el-input>
                  <el-input v-else v-model="hx" disabled></el-input>
                </template>
              </el-table-column>
              <el-table-column label="销售经理级别" width="100">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.salesManagerLevel&&scope.row.salesManagerLevel.length>0"
                    v-model="scope.row.salesManagerLevel"
                    disabled
                  ></el-input>
                  <el-input v-else v-model="hx" disabled></el-input>
                </template>
              </el-table-column> -->

                            <!-- 在职状况  可下拉,不可输入    0待入职,1在职,2离职 (通过枚举id=20查询)-->
                            <el-table-column label="在职状况"
                                width="110">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.isJob"
                                        placeholder="请选择">
                                        <el-option v-for="item in dictionary['20']"
                                            :key="item.key"
                                            :label="item.value"
                                            :value="{'label':item.value,'value':item.key}"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>

                            <!-- 门店，可输入，可下拉 -->
                            <el-table-column label="门店">
                                <template slot-scope="scope">
                                    <el-tooltip v-if="scope.row.level3"
                                        class="item"
                                        effect="dark"
                                        :open-delay="300"
                                        :content="scope.row.level3+''"
                                        :disabled="scope.row.level3?false:true"
                                        placement="top">
                                        <el-select v-model="scope.row.level3"
                                            filterable
                                            remote
                                            reserve-keyword
                                            :clearable="true"
                                            placeholder="请输入内容"
                                            :loading="loading1"
                                            :remote-method="getLevel(3)"
                                            @change="changeLevel3(scope.row.level3,scope.$index,0,0)">
                                            <el-option v-for="item in level3s"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id+'-'+item.name"></el-option>
                                        </el-select>
                                    </el-tooltip>
                                    <el-select v-else
                                        v-model="scope.row.level3"
                                        filterable
                                        remote
                                        reserve-keyword
                                        :clearable="true"
                                        placeholder="请输入内容"
                                        :loading="loading1"
                                        :remote-method="getLevel(3)"
                                        @change="changeLevel3(scope.row.level3,scope.$index,0,0)">
                                        <el-option v-for="item in level3s"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id+'-'+item.name"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>

                            <!-- 店长，可输入，可下拉 -->
                            <el-table-column label="店长">
                                <template slot-scope="scope">
                                    <el-tooltip class="item"
                                        effect="dark"
                                        :open-delay="300"
                                        :content="scope.row.shopkeeper+''"
                                        :disabled="scope.row.shopkeeper?false:true"
                                        placement="top">
                                        <el-select v-model="scope.row.shopkeeper"
                                            filterable
                                            remote
                                            reserve-keyword
                                            :clearable="true"
                                            :loading="loading1"
                                            placeholder="请输入内容"
                                            :remote-method="getShopInfo(2)"
                                            v-loadmore="moreShopInfos"
                                            @change="changeShopkeeper(scope.row.shopkeeper,scope.$index,0)">
                                            <el-option v-for="item in shopkeepers"
                                                :key="item.empId"
                                                :label="item.name+'-'+item.depName"
                                                :value="item.empId+'-'+item.name"></el-option>
                                        </el-select>
                                    </el-tooltip>
                                </template>
                            </el-table-column>

                            <!-- 单组，可输入，可下拉 -->
                            <el-table-column label="单组"
                                v-if="$route.query.version=='0'">
                                <template slot-scope="scope">
                                    <el-tooltip class="item"
                                        effect="dark"
                                        :open-delay="300"
                                        :content="scope.row.level4+''"
                                        :disabled="scope.row.level4?false:true"
                                        placement="top">
                                        <el-select v-model="scope.row.level4"
                                            filterable
                                            remote
                                            reserve-keyword
                                            :clearable="true"
                                            :loading="loading1"
                                            placeholder="请输入内容"
                                            :remote-method="getLevel(4)"
                                            @change="changeLevel3(scope.row.level4,scope.$index,0,1)">
                                            <el-option v-for="item in level4s"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id+'-'+item.name"></el-option>
                                        </el-select>
                                    </el-tooltip>
                                </template>
                            </el-table-column>

                            <!-- 区经，可输入，可下拉   changeAmaldar-->
                            <el-table-column label="总监">
                                <template slot-scope="scope">
                                    <el-tooltip class="item"
                                        effect="dark"
                                        :open-delay="300"
                                        :content="scope.row.amaldar+''"
                                        :disabled="scope.row.amaldar?false:true"
                                        placement="top">
                                        <el-select v-model="scope.row.amaldar"
                                            filterable
                                            remote
                                            reserve-keyword
                                            :clearable="true"
                                            :loading="loading1"
                                            placeholder="请输入内容"
                                            :remote-method="getShopInfo(1)"
                                            v-loadmore="moreAmaldars"
                                            @change="changeAmaldar(scope.row.amaldar,scope.$index,0)">
                                            <el-option v-for="item in amaldars"
                                                :key="item.empId"
                                                :label="item.name+'-'+item.depName"
                                                :value="item.empId+'-'+item.name"></el-option>
                                        </el-select>
                                    </el-tooltip>
                                </template>
                            </el-table-column>

                            <!-- 区总，可输入，可下拉 changeManager-->
                            <el-table-column label="副总">
                                <template slot-scope="scope">
                                    <el-tooltip class="item"
                                        effect="dark"
                                        :open-delay="300"
                                        :content="scope.row.manager+''"
                                        :disabled="scope.row.manager?false:true"
                                        placement="top">
                                        <el-select v-model="scope.row.manager"
                                            filterable
                                            remote
                                            reserve-keyword
                                            :clearable="true"
                                            :loading="loading1"
                                            placeholder="请输入内容"
                                            :remote-method="getShopInfo(0)"
                                            v-loadmore="moreManagers"
                                            @change="changeManager(scope.row.manager,scope.$index,0)">
                                            <el-option v-for="item in managers"
                                                :key="item.empId"
                                                :label="item.name+'-'+item.depName"
                                                :value="item.empId+'-'+item.name"></el-option>
                                        </el-select>
                                    </el-tooltip>
                                </template>
                            </el-table-column>

                            <el-table-column label="公共业绩"
                                width="280">
                                <template slot-scope="scope">
                                    <el-checkbox-group @change="getPublicGrade(scope.row)"
                                        v-model="scope.row.checkbox">
                                        <el-checkbox v-for="(item,index) in ['门店','公司','大区']"
                                            :key=index
                                            :label=index>{{item}}</el-checkbox>
                                    </el-checkbox-group>
                                </template>
                            </el-table-column>

                            <el-table-column prop="manager"
                                label="操作">
                                <template slot-scope="scope">
                                    <a class="delete"
                                        style="color:#478de3;text-decoration:underline;cursor:pointer;"
                                        @click="deleteListCell(scope.$index,houseArr,scope.row.id)">删除</a>
                                    <!-- <a href="javascript:;" class="delete" style="color:#478de3;" @click="delete(index)">删除</a> -->
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>

                    <div class="house-divide top20">
                        <div class="house-left f_l">
                            <h1 class="f14">客源方分成 <span style="position:relative;left:20px;color:#f56c6c">合计：{{clienttotal?clienttotal:0}}%</span>
                            </h1>
                            <p class="f_l delive">房客源可分配业绩总计：{{comm?comm:0}}元</p>
                        </div>
                        <div class="house-right f_r"
                            v-if="!backAId">
                            <el-button type="primary"
                                v-if="dialogType==0"
                                @click="clientRelativeMans('getExamineEmployees')">相关人员
                            </el-button>
                            <el-button type="primary"
                                v-else-if="dialogType==1"
                                @click="clientRelativeMans('getEmployeesByEdit')">相关人员
                            </el-button>
                            <el-button type="primary"
                                v-else-if="dialogType==2"
                                @click="clientRelativeMans('getBackExamineEmployees')">相关人员
                            </el-button>
                            <el-button type="primary"
                                v-else-if="dialogType==3"
                                @click="clientRelativeMans('getFirstInput')">相关人员
                            </el-button>
                            <el-button type="primary"
                                @click="addListCell('clientArr')">添加分配人
                            </el-button>
                            <el-button type="primary"
                                @click="ammanger">{{$route.query.version=='0'?'AM管理关系':'师徒管理关系'}}
                            </el-button>
                        </div>
                    </div>

                    <div class="ach-divide-list">
                        <el-table :data="clientArr"
                            style="width: 100%">
                            <el-table-column label="角色类型"
                                width="125">
                                <template slot-scope="scope">
                                    <!-- filterable -->
                                    <el-select v-model="scope.row.roleType"
                                        placeholder="请选择"
                                        @change="rolesTypeCheck(scope.row.roleType,scope.$index,'clientArr')">
                                        <el-option v-for="item in roleType1"
                                            :key="item.id"
                                            :label="item.description"
                                            :value="item.code"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>

                            <el-table-column label="分成比例(%)"
                                width="95">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.ratio"
                                        placeholder="请输入"
                                        @input="filterRatioVal(scope.row.ratio,scope.$index,'clientArr')"></el-input>
                                </template>
                            </el-table-column>

                            <el-table-column label="分成金额（元）"
                                width="110">
                                <template slot-scope="scope">
                                    {{(comm|| 0) * scope.row.ratio  / 100 * (100 - (scope.row.platformFeeRatio || 0)) / 100 }}
                                    <!-- (合同应收佣金 * 个人角色比例) - (特许服务费 = 合同应收佣金 * 个人角色比例 * 平台费比例) -->
                                </template>
                            </el-table-column>

                            <el-table-column label="经纪人">
                                <template slot-scope="scope">
                                    <el-tooltip class="item"
                                        effect="dark"
                                        :content="scope.row.assignor+''"
                                        :disabled="scope.row.assignor?false:true"
                                        placement="top"
                                        :open-delay="300">
                                        <el-select v-model="scope.row.assignor"
                                            filterable
                                            remote
                                            reserve-keyword
                                            :clearable="true"
                                            placeholder="请输入内容"
                                            :remote-method="getAssignors"
                                            :loading="loading1"
                                            v-loadmore="moreAssignors"
                                            @change="changeAssignors(scope.row.assignor,scope.$index,1)">
                                            <el-option v-for="item in assignors"
                                                :key="item.empId"
                                                :label="item.name+'-'+item.depName"
                                                :value="item.empId"></el-option>
                                        </el-select>
                                    </el-tooltip>
                                </template>
                            </el-table-column>

                            <!-- <el-table-column label="登录账号" v-if="getUser.version===3" width="120">
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="scope.row.loginAccount+''"
                    :disabled="scope.row.loginAccount?false:true"
                    placement="top"
                    :open-delay="300"
                  >
                    <el-input v-if="!!scope.row.loginAccount" v-model="scope.row.loginAccount" disabled></el-input>
                    <el-input v-else v-model="hx" disabled></el-input>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="员工工号" v-if="getUser.version===3" width="120">
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="scope.row.assignorNum+''"
                    :disabled="scope.row.assignorNum?false:true"
                    placement="top"
                    :open-delay="300"
                  >
                    <el-input
                      v-if="scope.row.assignorNum&&scope.row.assignorNum.length>0"
                      v-model="scope.row.assignorNum"
                      disabled
                    ></el-input>
                    <el-input v-else v-model="hx" disabled></el-input>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="经纪人工号" v-else width="120">
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="scope.row.assignorNum+''"
                    :disabled="scope.row.assignorNum?false:true"
                    placement="top"
                    :open-delay="300"
                  >
                    <el-input
                      v-if="scope.row.assignorNum&&scope.row.assignorNum.length>0"
                      v-model="scope.row.assignorNum"
                      disabled
                    ></el-input>
                    <el-input v-else v-model="hx" disabled></el-input>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="经纪人级别" width="100">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.assignorLevel&&scope.row.assignorLevel.length>0"
                    v-model="scope.row.assignorLevel"
                    disabled
                  ></el-input>
                  <el-input v-else v-model="hx" disabled></el-input>
                </template>
              </el-table-column>
              <el-table-column label="销售经理级别" width="100">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.salesManagerLevel&&scope.row.salesManagerLevel.length>0"
                    v-model="scope.row.salesManagerLevel"
                    disabled
                  ></el-input>
                  <el-input v-else v-model="hx" disabled></el-input>
                </template>
              </el-table-column> -->

                            <el-table-column label="在职状况"
                                width="110">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.isJob"
                                        placeholder="请选择">
                                        <el-option v-for="item in dictionary['20']"
                                            :key="item.key"
                                            :label="item.value"
                                            :value="{'label':item.value,'value':item.key}"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>

                            <!-- 门店，可输入，可下拉 -->
                            <el-table-column label="门店">
                                <template slot-scope="scope">
                                    <el-tooltip v-if="scope.row.level3"
                                        class="item"
                                        effect="dark"
                                        :open-delay="300"
                                        :content="scope.row.level3+''"
                                        :disabled="scope.row.level3?false:true"
                                        placement="top">
                                        <el-select v-model="scope.row.level3"
                                            filterable
                                            remote
                                            reserve-keyword
                                            :clearable="true"
                                            placeholder="请输入内容"
                                            :loading="loading1"
                                            :remote-method="getLevel(3)"
                                            @change="changeLevel3(scope.row.level3,scope.$index,1,0)">
                                            <el-option v-for="item in level3s"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id+'-'+item.name"></el-option>
                                        </el-select>
                                    </el-tooltip>
                                    <el-select v-else
                                        v-model="scope.row.level3"
                                        filterable
                                        remote
                                        reserve-keyword
                                        :clearable="true"
                                        placeholder="请输入内容"
                                        :loading="loading1"
                                        :remote-method="getLevel(3)"
                                        @change="changeLevel3(scope.row.level3,scope.$index,1,0)">
                                        <el-option v-for="item in level3s"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id+'-'+item.name"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>

                            <!-- 店长，可输入，可下拉 -->
                            <el-table-column label="店长">
                                <template slot-scope="scope">
                                    <el-tooltip class="item"
                                        effect="dark"
                                        :content="scope.row.shopkeeper+''"
                                        :disabled="scope.row.shopkeeper?false:true"
                                        placement="top"
                                        :open-delay="300">
                                        <el-select v-model="scope.row.shopkeeper"
                                            filterable
                                            remote
                                            reserve-keyword
                                            :clearable="true"
                                            placeholder="请输入内容"
                                            :loading="loading1"
                                            :remote-method="getShopInfo(2)"
                                            @change="changeShopkeeper(scope.row.shopkeeper,scope.$index,1)">
                                            <el-option v-for="item in shopkeepers"
                                                :key="item.empId"
                                                :label="item.name+'-'+item.depName"
                                                :value="item.empId+'-'+item.name"></el-option>
                                        </el-select>
                                    </el-tooltip>
                                </template>
                            </el-table-column>

                            <!-- 单组，可输入，可下拉 -->
                            <el-table-column label="单组"
                                v-if="$route.query.version=='0'">
                                <template slot-scope="scope">
                                    <el-tooltip class="item"
                                        effect="dark"
                                        :content="scope.row.level4+''"
                                        :disabled="scope.row.level4?false:true"
                                        placement="top"
                                        :open-delay="300">
                                        <el-select v-model="scope.row.level4"
                                            filterable
                                            remote
                                            reserve-keyword
                                            :clearable="true"
                                            placeholder="请输入内容"
                                            :loading="loading1"
                                            :remote-method="getLevel(4)"
                                            @change="changeLevel3(scope.row.level4,scope.$index,1,1)">
                                            <el-option v-for="item in level4s"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id+'-'+item.name"></el-option>
                                        </el-select>
                                    </el-tooltip>
                                </template>
                            </el-table-column>

                            <!-- 区经，可输入，可下拉 -->
                            <el-table-column label="总监">
                                <template slot-scope="scope">
                                    <el-tooltip class="item"
                                        effect="dark"
                                        :content="scope.row.amaldar+''"
                                        :disabled="scope.row.amaldar?false:true"
                                        placement="top"
                                        :open-delay="300">
                                        <el-select v-model="scope.row.amaldar"
                                            filterable
                                            remote
                                            reserve-keyword
                                            :clearable="true"
                                            placeholder="请输入内容"
                                            :loading="loading1"
                                            :remote-method="getShopInfo(1)"
                                            v-loadmore="moreAmaldars"
                                            @change="changeAmaldar(scope.row.amaldar,scope.$index,1)">
                                            <el-option v-for="item in amaldars"
                                                :key="item.empId"
                                                :label="item.name+'-'+item.depName"
                                                :value="item.empId+'-'+item.name"></el-option>
                                        </el-select>
                                    </el-tooltip>
                                </template>
                            </el-table-column>

                            <!-- 区总，可输入，可下拉 -->
                            <el-table-column label="副总">
                                <template slot-scope="scope">
                                    <el-tooltip class="item"
                                        effect="dark"
                                        :content="scope.row.manager+''"
                                        :disabled="scope.row.manager?false:true"
                                        placement="top"
                                        :open-delay="300">
                                        <el-select v-model="scope.row.manager"
                                            filterable
                                            remote
                                            reserve-keyword
                                            :clearable="true"
                                            placeholder="请输入内容"
                                            :loading="loading1"
                                            :remote-method="getShopInfo(0)"
                                            v-loadmore="moreManagers"
                                            @change="changeManager(scope.row.manager,scope.$index,1)">
                                            <el-option v-for="item in managers"
                                                :key="item.empId"
                                                :label="item.name+'-'+item.depName"
                                                :value="item.empId+'-'+item.name"></el-option>
                                        </el-select>
                                    </el-tooltip>
                                </template>
                            </el-table-column>

                            <el-table-column label="公共业绩"
                                width="280">
                                <template slot-scope="scope">
                                    <el-checkbox-group @change="getPublicGrade(scope.row)"
                                        v-model="scope.row.checkbox">
                                        <el-checkbox v-for="(item,index) in ['门店','公司','大区']"
                                            :key=index
                                            :label=index>{{item}}</el-checkbox>
                                    </el-checkbox-group>
                                </template>
                            </el-table-column>

                            <el-table-column prop="manager"
                                label="操作">
                                <template slot-scope="scope">
                                    <a class="delete"
                                        style="color:#478de3;text-decoration:underline;cursor:pointer;"
                                        @click="deleteListCell(scope.$index,clientArr,scope.row.id)">删除</a>
                                </template>
                            </el-table-column>
                        </el-table>

                    </div>

                    <template v-if="hasServiceAgent">
                        <div class="house-divide top20"
                            v-if="contType==2||contType==3">
                            <div class="house-left f_l">
                                <h1 class="f14">交易服务费佣金分成 <span style="position:relative;left:20px;color:#f56c6c">合计：{{serfeetotal?serfeetotal:0}}%</span>
                                </h1>
                                <p class="f_l delive">交易服务费佣金可分配业绩总计：{{tradeFee?tradeFee:0}}元</p>
                            </div>
                            <div class="house-right f_r">
                                <el-button type="primary"
                                    @click="addListCell('serviceAgents')">添加分配人</el-button>
                            </div>
                        </div>

                        <div class="ach-divide-list"
                            v-if="contType==2||contType==3">
                            <el-table :data="serviceAgents"
                                style="width: 100%">
                                <el-table-column label="角色类型"
                                    width="125">
                                    <template slot-scope="scope">
                                        <!-- filterable -->
                                        <el-select v-model="scope.row.roleType"
                                            placeholder="请选择"
                                            @change="rolesTypeCheck(scope.row.roleType,scope.$index,'serviceAgents')">
                                            <el-option v-for="item in roleType1"
                                                :key="item.id"
                                                :label="item.description"
                                                :value="item.code"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>

                                <el-table-column label="分成比例(%)"
                                    width="95">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.ratio"
                                            placeholder="请输入"
                                            @input="filterRatioVal(scope.row.ratio,scope.$index,'serviceAgents')"></el-input>
                                    </template>
                                </el-table-column>

                                <el-table-column label="分成金额（元）"
                                    width="110">
                                    <template slot-scope="scope">
                                        {{(comm|| 0) * scope.row.ratio  / 100 * (100 - (scope.row.platformFeeRatio || 0)) / 100 }}
                                        <!-- (合同应收佣金 * 个人角色比例) - (特许服务费 = 合同应收佣金 * 个人角色比例 * 平台费比例) -->
                                    </template>
                                </el-table-column>

                                <el-table-column label="经纪人">
                                    <template slot-scope="scope">
                                        <el-tooltip class="item"
                                            effect="dark"
                                            :content="scope.row.assignor+''"
                                            :disabled="scope.row.assignor?false:true"
                                            placement="top"
                                            :open-delay="300">
                                            <el-select v-model="scope.row.assignor"
                                                filterable
                                                remote
                                                reserve-keyword
                                                :clearable="true"
                                                placeholder="请输入内容"
                                                :remote-method="getAssignors"
                                                :loading="loading1"
                                                v-loadmore="moreAssignors"
                                                @change="changeAssignors(scope.row.assignor,scope.$index,2)">
                                                <el-option v-for="item in assignors"
                                                    :key="item.empId"
                                                    :label="item.name+'-'+item.depName"
                                                    :value="item.empId"></el-option>
                                            </el-select>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>

                                <!-- <el-table-column label="登录账号" v-if="getUser.version===3" width="120">
                  <template slot-scope="scope">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="scope.row.loginAccount+''"
                      :disabled="scope.row.loginAccount?false:true"
                      placement="top"
                      :open-delay="300"
                    >
                      <el-input v-if="!!scope.row.loginAccount" v-model="scope.row.loginAccount" disabled></el-input>
                      <el-input v-else v-model="hx" disabled></el-input>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="员工工号" v-if="getUser.version===3" width="120">
                  <template slot-scope="scope">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="scope.row.assignorNum+''"
                      :disabled="scope.row.assignorNum?false:true"
                      placement="top"
                      :open-delay="300"
                    >
                      <el-input
                        v-if="scope.row.assignorNum&&scope.row.assignorNum.length>0"
                        v-model="scope.row.assignorNum"
                        disabled
                      ></el-input>
                      <el-input v-else v-model="hx" disabled></el-input>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="经纪人工号" v-else width="150">
                  <template slot-scope="scope">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="scope.row.assignorNum+''"
                      :disabled="scope.row.assignorNum?false:true"
                      placement="top"
                      :open-delay="300"
                    >
                      <el-input
                        v-if="scope.row.assignorNum&&scope.row.assignorNum.length>0"
                        v-model="scope.row.assignorNum"
                        disabled
                      ></el-input>
                      <el-input v-else v-model="hx" disabled></el-input>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="经纪人级别" width="100">
                  <template slot-scope="scope">
                    <el-input
                      v-if="scope.row.assignorLevel&&scope.row.assignorLevel.length>0"
                      v-model="scope.row.assignorLevel"
                      disabled
                    ></el-input>
                    <el-input v-else v-model="hx" disabled></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="销售经理级别" width="100">
                  <template slot-scope="scope">
                    <el-input
                      v-if="scope.row.salesManagerLevel&&scope.row.salesManagerLevel.length>0"
                      v-model="scope.row.salesManagerLevel"
                      disabled
                    ></el-input>
                    <el-input v-else v-model="hx" disabled></el-input>
                  </template>
                </el-table-column> -->

                                <el-table-column label="在职状况"
                                    width="110">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.isJob"
                                            placeholder="请选择">
                                            <el-option v-for="item in dictionary['20']"
                                                :key="item.key"
                                                :label="item.value"
                                                :value="{'label':item.value,'value':item.key}"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>

                                <!-- 门店，可输入，可下拉 -->
                                <el-table-column label="门店">
                                    <template slot-scope="scope">
                                        <el-tooltip v-if="scope.row.level3"
                                            class="item"
                                            effect="dark"
                                            :content="scope.row.level3+''"
                                            :disabled="scope.row.level3?false:true"
                                            placement="top"
                                            :open-delay="300">
                                            <el-select v-model="scope.row.level3"
                                                filterable
                                                remote
                                                reserve-keyword
                                                :clearable="true"
                                                placeholder="请输入内容"
                                                :loading="loading1"
                                                :remote-method="getLevel(3)"
                                                @change="changeLevel3(scope.row.level3,scope.$index,2,0)">
                                                <el-option v-for="item in level3s"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id+'-'+item.name"></el-option>
                                            </el-select>
                                        </el-tooltip>
                                        <el-select v-else
                                            v-model="scope.row.level3"
                                            filterable
                                            remote
                                            reserve-keyword
                                            :clearable="true"
                                            placeholder="请输入内容"
                                            :loading="loading1"
                                            :remote-method="getLevel(3)"
                                            @change="changeLevel3(scope.row.level3,scope.$index,2,0)">
                                            <el-option v-for="item in level3s"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id+'-'+item.name"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>

                                <!-- 店长，可输入，可下拉 -->
                                <el-table-column label="店长">
                                    <template slot-scope="scope">
                                        <el-tooltip class="item"
                                            effect="dark"
                                            :content="scope.row.shopkeeper+''"
                                            :disabled="scope.row.shopkeeper?false:true"
                                            placement="top"
                                            :open-delay="300">
                                            <el-select v-model="scope.row.shopkeeper"
                                                filterable
                                                remote
                                                reserve-keyword
                                                :clearable="true"
                                                placeholder="请输入内容"
                                                :loading="loading1"
                                                :remote-method="getShopInfo(2)"
                                                @change="changeShopkeeper(scope.row.shopkeeper,scope.$index,2)">
                                                <el-option v-for="item in shopkeepers"
                                                    :key="item.empId"
                                                    :label="item.name+'-'+item.depName"
                                                    :value="item.empId+'-'+item.name"></el-option>
                                            </el-select>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>

                                <!-- 单组，可输入，可下拉 -->
                                <el-table-column label="单组"
                                    v-if="$route.query.version=='0'">
                                    <template slot-scope="scope">
                                        <el-tooltip class="item"
                                            effect="dark"
                                            :content="scope.row.level4+''"
                                            :disabled="scope.row.level4?false:true"
                                            placement="top"
                                            :open-delay="300">
                                            <el-select v-model="scope.row.level4"
                                                filterable
                                                remote
                                                reserve-keyword
                                                :clearable="true"
                                                placeholder="请输入内容"
                                                :loading="loading1"
                                                :remote-method="getLevel(4)"
                                                @change="changeLevel3(scope.row.level4,scope.$index,2,1)">
                                                <el-option v-for="item in level4s"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id+'-'+item.name"></el-option>
                                            </el-select>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>

                                <!-- 区经，可输入，可下拉 -->
                                <el-table-column label="总监">
                                    <template slot-scope="scope">
                                        <el-tooltip class="item"
                                            effect="dark"
                                            :content="scope.row.amaldar+''"
                                            :disabled="scope.row.amaldar?false:true"
                                            placement="top"
                                            :open-delay="300">
                                            <el-select v-model="scope.row.amaldar"
                                                filterable
                                                remote
                                                reserve-keyword
                                                :clearable="true"
                                                placeholder="请输入内容"
                                                :loading="loading1"
                                                :remote-method="getShopInfo(1)"
                                                v-loadmore="moreAmaldars"
                                                @change="changeAmaldar(scope.row.amaldar,scope.$index,2)">
                                                <el-option v-for="item in amaldars"
                                                    :key="item.empId"
                                                    :label="item.name+'-'+item.depName"
                                                    :value="item.empId+'-'+item.name"></el-option>
                                            </el-select>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>

                                <!-- 区总，可输入，可下拉 -->
                                <el-table-column label="副总">
                                    <template slot-scope="scope">
                                        <el-tooltip class="item"
                                            effect="dark"
                                            :content="scope.row.manager+''"
                                            :disabled="scope.row.manager?false:true"
                                            placement="top"
                                            :open-delay="300">
                                            <el-select v-model="scope.row.manager"
                                                filterable
                                                remote
                                                reserve-keyword
                                                :clearable="true"
                                                placeholder="请输入内容"
                                                :loading="loading1"
                                                :remote-method="getShopInfo(0)"
                                                v-loadmore="moreManagers"
                                                @change="changeManager(scope.row.manager,scope.$index,2)">
                                                <el-option v-for="item in managers"
                                                    :key="item.empId"
                                                    :label="item.name+'-'+item.depName"
                                                    :value="item.empId+'-'+item.name"></el-option>
                                            </el-select>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>

                                <el-table-column label="公共业绩"
                                    width="280">
                                    <template slot-scope="scope">
                                        <el-checkbox-group @change="getPublicGrade(scope.row)"
                                            v-model="scope.row.checkbox">
                                            <el-checkbox v-for="(item,index) in ['门店','公司','大区']"
                                                :key=index
                                                :label=index>{{item}}</el-checkbox>
                                        </el-checkbox-group>
                                    </template>
                                </el-table-column>

                                <el-table-column prop="manager"
                                    label="操作">
                                    <template slot-scope="scope">
                                        <a class="delete"
                                            style="color:#478de3;text-decoration:underline;cursor:pointer;"
                                            @click="deleteListCell(scope.$index,serviceAgents,scope.row.id)">删除</a>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </template>

                    <div class="house-divide top20"
                        style="height:38px">
                        <div class="house-left f_l">
                            <h1 class="f14">申诉信息</h1>
                        </div>
                    </div>
                    <div class="ach-divide-list"
                        style="margin-bottom:20px">
                        <el-table :data="shensuArr"
                            class="sushen"
                            style="width: 100%">
                            <el-table-column label="申诉人">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.appealName&&scope.row.appealName.length>0">
                                        {{scope.row.appealDepName}}-{{scope.row.appealName}}
                                    </div>
                                    <div v-else>-</div>
                                </template>
                            </el-table-column>

                            <el-table-column label="申诉时间">
                                <template slot-scope="scope">
                                    {{scope.row.appealTime|formatTime(false)}}
                                </template>
                            </el-table-column>

                            <el-table-column label="申诉角色">
                                <template slot-scope="scope">
                                    <div v-if="!scope.row.roles||scope.row.roles.length==0">
                                        <div>--</div>
                                    </div>
                                    <div v-else>
                                        <el-tooltip class="item"
                                            effect="dark"
                                            :content="scope.row.roles.join(',')"
                                            placement="top-start">
                                            <p class="dot">{{scope.row.roles.join(',')}}</p>
                                        </el-tooltip>
                                    </div>

                                </template>
                            </el-table-column>
                            <el-table-column label="申诉内容"
                                width="200">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.appealContent&&scope.row.appealContent.length>0">
                                        <el-popover trigger="hover"
                                            width="200"
                                            :content="scope.row.appealContent"
                                            placement="top">
                                            <p class="dot"
                                                slot="reference">{{scope.row.appealContent}}</p>
                                        </el-popover>
                                    </div>
                                    <div v-else>-</div>
                                </template>
                            </el-table-column>

                            <el-table-column label="申诉凭证">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.voucherUrl&&scope.row.voucherUrl.length>0">
                                        <div v-for="(item,index) in scope.row.voucherUrl">
                                            <p class="link"
                                                @click="previewPhoto(scope.row.voucherUrl,index)">附件{{index+1}}</p>
                                        </div>
                                    </div>
                                    <div v-else>-</div>
                                </template>
                            </el-table-column>

                            <el-table-column label="审核人">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.auditName&&scope.row.auditName.length>0">
                                        {{scope.row.auditDepName}}-{{scope.row.auditName}}
                                    </div>
                                    <div v-else>-</div>
                                </template>
                            </el-table-column>

                            <el-table-column min-width="120"
                                label="审核状态(时间)">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.auditStatus">
                                        {{scope.row.auditStatus.label}} ({{scope.row.auditTime|formatTime(false)}})
                                    </div>
                                    <div v-else>-</div>
                                </template>
                            </el-table-column>

                            <el-table-column label="审核备注">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.auditRemarks">
                                        <el-popover trigger="hover"
                                            width="200"
                                            :content="scope.row.auditRemarks"
                                            placement="top">
                                            <p class="dot"
                                                slot="reference">{{scope.row.auditRemarks}}</p>
                                        </el-popover>
                                    </div>
                                    <div v-else>-</div>

                                </template>
                            </el-table-column>

                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.auditStatus&&scope.row.auditStatus.value==0&&auditIds==1">
                                        <el-button @click="itemht(scope.row,1)"
                                            type="text"
                                            size="small">审核</el-button>
                                    </div>
                                    <div v-else>-</div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>

                </div>
                <preview :imgList="previewFiles"
                    :start="previewIndex"
                    v-if="preview"
                    @close="preview=false"></preview>
                <!-- 合同备注栏 -->
                <h1 class="f14"
                    v-if="this.contRemarks">合同备注栏</h1>
                <div class="contRemark"
                    v-if="this.contRemarks">
                    <el-input v-model="this.contRemarks"
                        disabled
                        type="textarea"
                        :rows="4"
                        class="f_l"
                        resize="none"
                        maxlength="200"></el-input>
                </div>

                <div class="top20">
                    <div class="house-left">
                        <h1 class="f14">上传业绩分成协议</h1>
                    </div>
                    <ul class="ulData"
                        style="margin-top:10px">
                        <li>
                            <file-up class="upload-box"
                                @getUrl="addSubject">
                                <i class="iconfont icon-shangchuan"></i>
                                <p>点击上传</p>
                            </file-up>
                        </li>
                        <li v-for="(item,i) in filesList"
                            :key="i">
                            <el-tooltip class="item"
                                effect="dark"
                                :content="item.name"
                                placement="bottom">
                                <div class="attach-box"
                                    @click="previewPhoto(filesList,i)">
                                    <img :src="item.path|getSignImage(contDataFiles)"
                                        alt
                                        v-if="isPictureFile(item.fileType)"
                                        width="70%"
                                        height="62px" />
                                    <upload-cell :type="item.fileType"
                                        v-else></upload-cell>
                                    <p>{{item.name}}</p>
                                </div>
                            </el-tooltip>
                            <i class="iconfont icon-tubiao-6"
                                @click="deleteFn(i)"></i>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- 申诉审核底部 -->
            <div class="ach-footer"
                v-if="dialogType==0"
                style="height:100px;padding-bottom: 30px;width:100%">

                <div class="footer-btn-layout f_r">
                    <el-button type="primary"
                        round
                        @click="passAch"
                        class="color-green"
                        id="savebtn">确定
                    </el-button>
                </div>
            </div>

            <div class="dialog2">
                <el-dialog :visible.sync="showTips1"
                    append-to-body
                    custom-class="dialog2In"
                    :close-on-click-modal="false">
                    <div v-loading="loading3">
                        <h1 style="font-size:18px;"
                            slot="title">选择相关人员</h1>
                        <div class="mansList">
                            <el-table :data="mansList"
                                style="width: 100%"
                                @selection-change="handleSelectionChange"
                                :header-cell-style="{'background-color':'#F7F6Fd'}">
                                <el-table-column type="selection"
                                    width="70"></el-table-column>

                                <el-table-column label="经纪人"
                                    width="100">
                                    <template slot-scope="scope">
                                        <p>{{scope.row.assignor}}</p>
                                    </template>
                                </el-table-column>

                                <el-table-column label="角色类型"
                                    width="100">
                                    <template slot-scope="scope">
                                        <p>{{scope.row.roleName}}</p>
                                    </template>
                                </el-table-column>

                                <el-table-column label="门店">
                                    <template slot-scope="scope">
                                        <p>{{scope.row.level3}}</p>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>

                        <div class="dialog2-btn">
                            <el-button type="primary"
                                round
                                @click="showTips1 = false">取消
                            </el-button>
                            <el-button type="primary"
                                round
                                @click="manSure(type)"
                                v-dbClick>确定
                            </el-button>
                        </div>
                    </div>
                </el-dialog>
            </div>
        </div>

        <div class="dialog3"
            style="z-index: 2007;">
            <!-- 选择审核人弹框 -->
            <checkPerson :show="checkPerson.state"
                :type="checkPerson.type"
                :bizCode="checkPerson.code"
                :flowType="checkPerson.flowType"
                @close="closeCheckPerson"
                v-if="checkPerson.state"
                @submit="personChose"></checkPerson>
        </div>
        <el-dialog class="record-table-dialog"
            :closeOnClickModal="$tool.closeOnClickModal"
            width="770px"
            title="房源价格变更记录（近三天历史记录）"
            :visible.sync="recordShow">
            <el-table :data="recordData"
                class="recordtable"
                border
                max-height="300">
                <el-table-column prop="TotalPriceBefore"
                    label="总价（修改前）"></el-table-column>
                <el-table-column prop="FinalPriceBefore"
                    label="底价（修改前）"></el-table-column>
                <el-table-column prop="TotalPriceAfter"
                    label="总价（修改后）"></el-table-column>
                <el-table-column prop="FinalPriceAfter"
                    label="底价（修改后）"></el-table-column>
                <el-table-column label="成交价格误差（%）"
                    width="140">
                    <template slot-scope="scope">
                        {{scope.row.PriceDifferential}}
                    </template>
                </el-table-column>
                <el-table-column prop="ModificationTime"
                    label="修改时间"
                    width="135"></el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog class="record-table-dialog"
            :closeOnClickModal="$tool.closeOnClickModal"
            width="770px"
            :title="$route.query.version=='0'?'AM管理关系':'师徒管理关系'"
            :visible.sync="AMShow">
            <el-table :data="AMData"
                class="recordtable"
                border
                max-height="300">
                <el-table-column prop="ManagerName"
                    label="M经理"></el-table-column>
                <el-table-column prop="ManagerLevel"
                    label="M经理职级"></el-table-column>
                <el-table-column prop="EmpName"
                    label="经纪人"></el-table-column>
                <el-table-column prop="EmpLevel"
                    label="经纪人级别"></el-table-column>
                <el-table-column prop="StartTime"
                    label="开始时间"></el-table-column>
                <el-table-column prop="EndTime"
                    label="结束时间"></el-table-column>
                <el-table-column prop="Remarks"
                    label="备注"></el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog title="审核"
            :visible.sync="aplDialog"
            width="740px"
            @close="close"
            :closeOnClickModal="$tool.closeOnClickModal">
            <div class="input-group"
                style="position:relative">
                <label>申诉人：</label>
                <span>{{aplman}}</span>
            </div>
            <div class="input-group"
                style="position:relative">
                <label>审核角色：</label>
                <span v-if="aplrole">{{aplrole.join('，')}}</span>
                <span v-else>-</span>
            </div>
            <div class="input-group"
                style="position:relative">
                <label>申诉内容：</label>
                <span>{{aplcontent}}</span>
            </div>
            <div class="input-group"
                style="position:relative">
                <label>附件信息：</label>
                <div v-if="aplurl&&aplurl.length>0">
                    <span v-for="(item,index) in aplurl">
                        <span class="link"
                            @click="previewPhoto(aplurl,index)"
                            style="margin-right:20px">附件{{index+1}}</span>
                    </span>
                </div>
                <div v-else>暂无</div>
            </div>
            <div class="input-group"
                style="position:relative;">
                <label>备注：</label>
                <el-input type="textarea"
                    :rows="4"
                    resize='none'
                    v-model="aplremark"
                    placeholder="无备注内容"
                    :maxlength="inputMax"></el-input>
                <span class="text-absolute">{{validInput}}/{{inputMax}}</span>
            </div>
            <div slot="footer"
                class="dialog-footer">
                <el-button @click="nopass"
                    type="primary"
                    class="confirmBtn color-red"
                    v-dbClick>驳回</el-button>
                <el-button @click="pass"
                    type="primary"
                    class="confirmBtn"
                    v-dbClick>通过</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import { MIXINS } from "@/assets/js/mixins";
import checkPerson from "@/components/checkPerson";

export default {
    mixins: [MIXINS],
    data() {
        return {
            serviceAgents: [],
            hx: "-",
            aplid: "",
            aplman: "",
            aplrole: "",
            aplcontent: "",
            aplurl: [],
            imgList: [],
            inputMax: 200,
            aplremark: "",
            shensuArr: [],
            AMData: [],
            AMShow: false,
            recordData: [],
            recordShow: false,
            shows: true,
            houseArr: [], //房源列表
            clientArr: [], //客源列表
            mansList: [], //人员列表
            houseMansArr: [], //相关人员房源列表
            clientMansArr: [], //相关人员客源列表
            examineDate: "", //审核时间
            showTips1: false,
            roleType0: [], //房源角色类型
            roleType1: [], //客源角色类型
            comm: "", //可分配业绩
            tradeFee: 0,
            addManList: [],
            dictionary: {
                //数据字典
                "20": "" //员工状态
            },
            type: "", //房源1 客源2
            remark: "",
            agendIds: [], //存放 删除经纪人的流水id
            addArr: [],
            backAId: null,
            assignors: [], //模糊搜索经纪人
            level3s: [], //模糊搜索门店
            level4s: [], //模糊搜索单组
            shopkeepers: [], //模糊搜索店长
            amaldars: [], //模糊搜索区经
            managers: [], //模糊搜索区总
            loading1: false,
            loading: false,
            radioFlag: 3,
            assignorIndex: null,
            assignorStr: null,
            assignorTotal: null,
            shopIndex: 1,
            shopStr: null,
            shopTotal: null,
            loading3: false,
            checkPerson: {
                state: false,
                type: "init",
                code: "",
                flowType: 0
            },
            dialogType: "",
            contractCode: "",
            aId: "",
            achIndex: "",
            achObj: "",
            contractId2: "",
            state2: "",
            aplDialog: false,
            shenname: [],
            auditIds: "",
            filesList: [],
            contDataFiles: [], //资料库图片缩略图
            mainDataFiles: [], //合同主体图片缩略图
            // distributionAgreement: [],
            // attachList: [], //上传附件数组
            preloadList: [],
            preloadFiles: [],
            contType: "",
            hasServiceAgent: false, //是否勾选交易服务费佣金分成
            contRemarks: "" //合同备注栏
        };
    },
    components: {
        checkPerson
    },
    created() {
        this.contType = this.$route.query.contType;
        this.dialogType = this.$route.query.dialogType;
        this.contractCode = this.$route.query.contractCode;
        this.aId = this.$route.query.aId;
        this.achIndex = this.$route.query.achIndex;
        this.achObj = JSON.parse(this.$route.query.achObj);
        this.contractId2 = this.$route.query.contractId;
        this.getDictionary();
        this.$ajax.get("/api/role/types").then(res => {
            if (res.status === 200) {
                // console.log(res.data.data[0]);
                this.roleType0 = res.data.data[1]; //房源角色类型
                this.roleType1 = res.data.data[2]; //客源角色类型
            }
        });

        this.getData();
    },
    methods: {
        getData() {
            this.$ajax
                .get("/api/appeal/getExamineInfo", { aId: this.aId })
                .then(res => {
                    if (res.status === 200) {
                        //2.4.6新需求 增加合同备注栏
                        if (
                            res.data.data.contRemarks &&
                            res.data.data.contRemarks.length > 0
                        ) {
                            this.contRemarks = res.data.data.contRemarks;
                        } else {
                            this.contRemarks = "";
                        }
                        this.hasServiceAgent =
                            res.data.data.hasServiceAgent === 0 ? false : true;
                        this.houseArr = res.data.data.houseAgents;
                        this.shensuArr = res.data.data.appeals;
                        this.auditIds = res.data.data.auditIds;
                        for (let i = 0; i < this.shensuArr.length; i++) {
                            this.shensuArr[i].voucherUrl = this.getPicture(
                                JSON.parse(this.shensuArr[i].voucherUrl)
                            );
                        }
                        var houseArr2 = res.data.data.houseAgents;
                        this.clientArr = res.data.data.customerAgents;
                        for (let i = 0; i < this.houseArr.length; i++) {
                            // this.houseArr[i].checkbox=[],
                            this.$set(this.houseArr[i], "checkbox", []);
                            this.houseArr[i].checkbox.push(
                                this.houseArr[i].place
                            );
                        }
                        for (let i = 0; i < this.clientArr.length; i++) {
                            this.$set(this.clientArr[i], "checkbox", []);
                            this.clientArr[i].checkbox.push(
                                this.clientArr[i].place
                            );
                        }
                        this.serviceAgents = res.data.data.serviceAgents;
                        for (let i = 0; i < this.serviceAgents.length; i++) {
                            this.$set(this.serviceAgents[i], "checkbox", []);
                            this.serviceAgents[i].checkbox.push(
                                this.serviceAgents[i].place
                            );
                        }
                        if (
                            res.data.data.distributionAgreement &&
                            JSON.parse(res.data.data.distributionAgreement)
                                .length > 0
                        ) {
                            let pathList = JSON.parse(
                                res.data.data.distributionAgreement
                            );
                            this.filesList = pathList;
                            let preloadList = [];
                            pathList.forEach((item, index) => {
                                //判断附件是否为图片，是则存入临时数组获取签名用于缩略图展示
                                if (this.isPictureFile(item.fileType)) {
                                    preloadList.push(item.path);
                                }
                            });
                            this.fileSign(preloadList, "preload").then(res => {
                                this.contDataFiles = res;
                            });
                        }
                        this.comm = res.data.data.comm;
                        this.tradeFee = res.data.data.tradeFee;
                        if (res.data.data.examineDate) {
                            this.examineDate = res.data.data.examineDate;
                        }
                        this.loading = false;
                    }
                });
        },
        trim(str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        },
        nopass() {
            if (this.trim(this.aplremark).length == 0) {
                this.$message({ message: "请填写备注信息！" });
                return;
            }

            let param = {
                id: this.aplid,
                examineRemark: this.aplremark
            };
            this.$ajax
                .post("/api/appeal/appealReject  ", param, 2)
                .then(res => {
                    if (res.status == 200) {
                        this.$message({ message: "操作成功", type: "success" });
                        this.aplremark = "";
                        this.aplDialog = false;
                        this.getData();
                    }
                })
                .catch(err => {
                    this.$message({ message: err });
                });
        },
        pass() {
            let param = {
                id: this.aplid,
                examineRemark: this.aplremark
            };
            this.$ajax
                .post("/api/appeal/appealAdopt", param, 2)
                .then(res => {
                    if (res.status == 200) {
                        this.$message({ message: "操作成功", type: "success" });
                        this.aplremark = "";
                        this.aplDialog = false;
                        this.getData();
                    }
                })
                .catch(err => {
                    this.$message({ message: err });
                });
        },
        getPicture(item) {
            return this.$tool.cutFilePath(item);
        },
        itemht(row) {
            this.aplman = row.appealName;
            this.aplrole = row.roles;
            this.aplcontent = row.appealContent;
            this.aplurl = row.voucherUrl;
            this.aplid = row.id;
            this.aplDialog = true;
        },
        //判断数组数据角色类型是否存在重复
        unique(arr1) {
            const res = new Map();
            return arr1.filter(
                a => !res.has(a.roleType) && res.set(a.roleType, 1)
            );
        },
        /**
         * 角色类型选择方法
         * @param val当前选择的roleType值
         * @param index数组当前操作项
         * @param arr操作的数组名
         * @returns {boolean}
         */
        rolesTypeCheck(val, index, arr) {
            let arr1 = JSON.parse(JSON.stringify(this[arr]));
            arr1.splice(index, 1);
            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i].roleType == val) {
                    this.$message.error("角色已经存在，请勿重新添加");
                    this.$set(this[arr][index], "roleType", "");
                    return false;
                }
            }
        },
        ammanger() {
            let param = {
                contId: this.contractId2
            };
            this.AMShow = true;
            this.$ajax.get("/api/achievement/getEmpAMById", param).then(res => {
                if (res.status === 200) {
                    this.AMData = res.data.data;
                }
            });
        },
        houseRecode() {
            let param = {
                contId: this.contractId2
            };
            this.recordShow = true;
            this.$ajax
                .get("/api/achievement/getHistoryPriceHouse", param)
                .then(res => {
                    if (res.status === 200) {
                        this.recordData = res.data.data;
                    }
                });
        },
        /**
         * 分成比例数值输入方法
         * @param val
         * @param index数组当前操作项
         * @param arr操作的数组名
         */
        filterRatioVal(val, index, arr) {
            this.$set(
                this[arr][index],
                "ratio",
                this.$tool.cutFloat({
                    val: this[arr][index].ratio,
                    max: 100
                })
            );
        },
        // 获取经纪人
        getAssignors(queryString) {
            if (queryString !== "") {
                this.loading1 = true;
                this.assignorStr = queryString;

                let param = {
                    keyword: queryString,
                    pageNum: 1,
                    pageSize: 100,
                    leave: true,
                    systemtag: this.userInfo.systemtag,
                    contId: this.contractId2
                };
                this.$ajax
                    .get("/api/organize/employees/pages", param)
                    .then(res => {
                        if (res.status === 200) {
                            this.loading1 = false;
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
                let param = {
                    keyword: queryString,
                    pageNum: page,
                    pageSize: 100,
                    leave: true,
                    systemtag: this.userInfo.systemtag
                };
                this.$ajax
                    .get("/api/organize/employees/pages", param)
                    .then(res => {
                        if (res.status === 200) {
                            this.assignors = this.assignors.concat(
                                res.data.data.list
                            );
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
        changeAssignors(val, index, type) {
            if (val) {
                let param = {
                    id: val
                };
                this.$ajax
                    .get("/api/organize/employee/agent/details", param)
                    .then(res => {
                        let {
                            assignor,
                            isJob,
                            level3,
                            shopkeeper,
                            level4,
                            amaldar,
                            manager,
                            assignorId,
                            storefront3Id,
                            storefront4Id,
                            managerId,
                            amaldarId,
                            shopkeeperId,
                            platformFeeRatio,
                            assignorNum,
                            assignorLevel,
                            salesManagerLevel,
                            loginAccount
                        } = res.data.data;
                        if (type == 0) {
                            Object.assign(this.houseArr[index], {
                                assignor,
                                isJob,
                                level3,
                                shopkeeper,
                                level4,
                                amaldar,
                                manager,
                                assignorId,
                                storefront3Id,
                                storefront4Id,
                                managerId,
                                amaldarId,
                                shopkeeperId,
                                platformFeeRatio,
                                assignorNum,
                                assignorLevel,
                                salesManagerLevel,
                                loginAccount
                            });
                        } else if (type == 1) {
                            Object.assign(this.clientArr[index], {
                                assignor,
                                isJob,
                                level3,
                                shopkeeper,
                                level4,
                                amaldar,
                                manager,
                                assignorId,
                                storefront3Id,
                                storefront4Id,
                                managerId,
                                amaldarId,
                                shopkeeperId,
                                platformFeeRatio,
                                assignorNum,
                                assignorLevel,
                                salesManagerLevel,
                                loginAccount
                            });
                        } else {
                            Object.assign(this.serviceAgents[index], {
                                assignor,
                                isJob,
                                level3,
                                shopkeeper,
                                level4,
                                amaldar,
                                manager,
                                assignorId,
                                storefront3Id,
                                storefront4Id,
                                managerId,
                                amaldarId,
                                shopkeeperId,
                                platformFeeRatio,
                                assignorNum,
                                assignorLevel,
                                salesManagerLevel,
                                loginAccount
                            });
                        }
                    });
            } else {
                let initObj = {
                    isJob: "",
                    level3: "",
                    shopkeeper: "",
                    level4: "",
                    amaldar: "",
                    manager: "",
                    assignorId: "",
                    storefront3Id: "",
                    storefront4Id: "",
                    managerId: "",
                    amaldarId: "",
                    shopkeeperId: "",
                    platformFeeRatio: "",
                    assignorNum: "",
                    assignorLevel: "",
                    salesManagerLevel: "",
                    loginAccount: ""
                };
                if (type == 0) {
                    Object.assign(this.houseArr[index], initObj);
                } else if (type == 1) {
                    Object.assign(this.clientArr[index], initObj);
                } else {
                    Object.assign(this.serviceAgents[index], initObj);
                }
            }
        },
        // 获取门店，单组信息  type=3(门店)  type=4(单组)
        getLevel(type) {
            // 闭包
            return queryString => {
                if (queryString !== "") {
                    this.loading1 = true;
                    let param = {
                        // type: type,
                        keyword: queryString
                    };
                    this.$ajax.get("/api/organize/deps", param).then(res => {
                        if (res.status === 200) {
                            if (type == 3) {
                                this.level3s = res.data.data;
                            } else {
                                this.level4s = res.data.data;
                            }
                            this.loading1 = false;
                        }
                    });
                }
            };
        },
        // 改变门店,单组（type1,0=房源，1=客源，2=交易服务费佣金）（type2,0=门店，1=单组）
        changeLevel3(val, index, type1, type2) {
            if (val) {
                let level3Arr = val.split("-");
                if (type1 == 0 && type2 == 0) {
                    this.houseArr[index].storefront3Id = level3Arr[0];
                    if (level3Arr[2]) {
                        this.houseArr[index].level3 =
                            level3Arr[1] + "-" + level3Arr[2];
                    } else {
                        this.houseArr[index].level3 = level3Arr[1];
                    }
                } else if (type1 == 0 && type2 == 1) {
                    this.houseArr[index].storefront4Id = level3Arr[0];
                    this.houseArr[index].level4 = level3Arr[1];
                } else if (type1 == 1 && type2 == 0) {
                    this.clientArr[index].storefront3Id = level3Arr[0];
                    if (level3Arr[2]) {
                        this.clientArr[index].level3 =
                            level3Arr[1] + "-" + level3Arr[2];
                    } else {
                        this.clientArr[index].level3 = level3Arr[1];
                    }
                } else if (type1 == 1 && type2 == 1) {
                    this.clientArr[index].storefront4Id = level3Arr[0];
                    this.clientArr[index].level4 = level3Arr[1];
                } else if (type1 == 2 && type2 == 0) {
                    this.clientArr[index].storefront3Id = level3Arr[0];
                    if (level3Arr[2]) {
                        this.serviceAgents[index].level3 =
                            level3Arr[1] + "-" + level3Arr[2];
                    } else {
                        this.serviceAgents[index].level3 = level3Arr[1];
                    }
                } else if (type1 == 2 && type2 == 1) {
                    this.serviceAgents[index].storefront4Id = level3Arr[0];
                    this.serviceAgents[index].level4 = level3Arr[1];
                }
            }
        },
        //公共业绩选择
        getPublicGrade(row) {
            if (row.checkbox.length == 0) {
                return;
            }
            row.checkbox = row.checkbox.slice(-1);
        },
        // 获取店长，区经,区总
        getShopInfo(roleId) {
            return queryString => {
                if (queryString !== "") {
                    this.loading1 = true;
                    this.shopStr = queryString;
                    let list = [{}];
                    let param = {
                        keyword: queryString,
                        pageNum: 1,
                        pageSize: 100,
                        leave: true,
                        systemtag: this.userInfo.systemtag,
                        contId: this.contractId2
                    };
                    this.$ajax
                        .get("/api/organize/employees/pages", param)
                        .then(res => {
                            if (roleId == 2) {
                                this.shopkeepers = res.data.data.list;
                            } else if (roleId == 1) {
                                this.amaldars = res.data.data.list;
                            } else if (roleId == 0) {
                                this.managers = res.data.data.list;
                            }
                            this.loading1 = false;
                            this.shopTotal = res.data.data.total;
                            this.shopIndex = 1;
                        });
                }
            };
        },
        getMoreShopInfo(queryString, page, roleId) {
            if (queryString !== "") {
                let list = [{}];
                let param = {
                    keyword: queryString,
                    pageNum: page,
                    pageSize: 100,
                    leave: true,
                    systemtag: this.userInfo.systemtag
                };
                this.$ajax
                    .get("/api/organize/employees/pages", param)
                    .then(res => {
                        if (roleId == 2) {
                            this.shopkeepers = this.shopkeepers.concat(
                                res.data.data.list
                            );
                        } else if (roleId == 1) {
                            this.amaldars = this.amaldars.concat(
                                res.data.data.list
                            );
                        } else if (roleId == 0) {
                            this.managers = this.managers.concat(
                                res.data.data.list
                            );
                        }
                    });
            }
        },
        // 下拉加载更多店长
        moreShopInfos() {
            if (this.shopkeepers.length >= this.shopTotal) {
                return;
            } else {
                this.shopIndex++;
                this.getMoreShopInfo(this.shopStr, this.shopIndex, 2);
            }
        },
        // 下拉加载更多区经
        moreAmaldars() {
            if (this.amaldars.length >= this.shopTotal) {
                return;
            } else {
                this.shopIndex++;
                this.getMoreShopInfo(this.shopStr, this.shopIndex, 1);
            }
        },
        // 下拉加载更多区总
        moreManagers() {
            if (this.managers.length >= this.shopTotal) {
                return;
            } else {
                this.shopIndex++;
                this.getMoreShopInfo(this.shopStr, this.shopIndex, 0);
            }
        },
        // 改变店长
        changeShopkeeper(val, index, type1) {
            if (val) {
                let idName = val.split("-");
                if (type1 == 0) {
                    this.houseArr[index].shopkeeperId = idName[0];
                    this.houseArr[index].shopkeeper = idName[1];
                } else if (type1 == 1) {
                    this.clientArr[index].shopkeeperId = idName[0];
                    this.clientArr[index].shopkeeper = idName[1];
                } else if (type1 == 2) {
                    this.serviceAgents[index].shopkeeperId = idName[0];
                    this.serviceAgents[index].shopkeeper = idName[1];
                }
            }
        },
        // 改变区经
        changeAmaldar(val, index, type1) {
            if (val) {
                let idName = val.split("-");
                if (type1 == 0) {
                    this.houseArr[index].amaldarId = idName[0];
                    this.houseArr[index].amaldar = idName[1];
                } else if (type1 == 1) {
                    this.clientArr[index].amaldarId = idName[0];
                    this.clientArr[index].amaldar = idName[1];
                } else if (type1 == 2) {
                    this.serviceAgents[index].amaldarId = idName[0];
                    this.serviceAgents[index].amaldar = idName[1];
                }
            }
        },
        // 改变区总
        changeManager(val, index, type1) {
            if (val) {
                let idName = val.split("-");
                if (type1 == 0) {
                    this.houseArr[index].managerId = idName[0];
                    this.houseArr[index].manager = idName[1];
                } else if (type1 == 1) {
                    this.clientArr[index].managerId = idName[0];
                    this.clientArr[index].manager = idName[1];
                } else if (type1 == 2) {
                    this.serviceAgents[index].managerId = idName[0];
                    this.serviceAgents[index].manager = idName[1];
                }
            }
        },
        //获取房源客源相关人员
        getMans(type, fieldStr) {
            this.showTips1 = true;
            this.loading3 = true;
            let param = {
                contId: this.contractId2
            };
            this.$ajax.get("/api/achievement/" + fieldStr, param).then(res => {
                let data = res.data;
                if (data.status === 200) {
                    if (type == 1) {
                        this.mansList = data.data.houseAgents;
                    } else {
                        this.mansList = data.data.customerAgents;
                    }
                }
                this.loading3 = false;
            });
        },
        // 房源选择相关人
        houseRelativeMans(fieldStr) {
            this.type = 1;
            this.mansList = [];
            this.getMans(this.type, fieldStr);
        },
        // 客源选择相关人
        clientRelativeMans(fieldStr) {
            this.mansList = [];
            this.type = 2;
            this.getMans(this.type, fieldStr);
        },
        /**
         * 添加分配人操作
         * @param arrName数组名
         */
        addListCell(arrName) {
            let obj = {
                amaldar: "",
                assignor: "",
                isJob: {
                    label: "",
                    value: ""
                },
                level3: "",
                level4: "",
                manager: "",
                place: -1,
                checkbox: [],
                ratio: "",
                roleType: "",
                isService: 0,
                shopkeeper: "",
                amaldarId: "",
                managerId: "",
                shopkeeperId: "",
                platformFeeRatio: "",
                contractId: this.achObj.contractId,
                contractCode: this.contractCode
            };
            arrName === "serviceAgents" && (obj.isService = 1);
            this[arrName].push(obj);
            this.addArr.push(obj);
        },
        // 删除按钮
        deleteListCell(index, rows, id) {
            this.agendIds.push(id);
            rows.splice(index, 1);
        },
        // 弹框通过操作
        passAch() {
            if (this.houseArr.length == 0 && this.clientArr.length != 0) {
                this.$message.error("房源至少保留一人");
                return false;
            } else if (
                this.houseArr.length != 0 &&
                this.clientArr.length == 0
            ) {
                this.$message.error("客源至少保留一人");
                return false;
            }
            var arr1 = this.unique(this.houseArr);
            if (arr1.length < this.houseArr.length) {
                this.$message.error("房源方有重复角色存在，请核实");
                return;
            }
            var arr2 = this.unique(this.clientArr);
            if (arr2.length < this.clientArr.length) {
                this.$message.error("客源方有重复角色存在，请核实");
                return;
            }
            let arr = [],
                roleFlag = true,
                flag = true,
                sum = 0,
                ser_sum = 0,
                sumFlag = false;
            for (let i = 0; i < this.houseArr.length; i++) {
                this.houseArr[i].sortNum = i + 1;
                this.houseArr[i].contractId = this.achObj.contractId;
                this.houseArr[i].contractCode = this.contractCode;
                this.houseArr[i].place =
                    this.houseArr[i].checkbox[0] === ""
                        ? -1
                        : this.houseArr[i].checkbox[0];
            }
            for (let i = 0; i < this.clientArr.length; i++) {
                this.clientArr[i].sortNum = i + 1;
                this.clientArr[i].contractId = this.achObj.contractId;
                this.clientArr[i].contractCode = this.contractCode;
                this.clientArr[i].place =
                    this.clientArr[i].checkbox[0] === ""
                        ? -1
                        : this.clientArr[i].checkbox[0];
            }
            for (let i = 0; i < this.serviceAgents.length; i++) {
                this.serviceAgents[i].sortNum = i + 1;
                this.serviceAgents[i].contractId = this.achObj.contractId;
                this.serviceAgents[i].contractCode = this.contractCode;
                this.serviceAgents[i].place =
                    this.serviceAgents[i].checkbox[0] === ""
                        ? -1
                        : this.serviceAgents[i].checkbox[0];
            }
            let resultArr = this.houseArr.concat(this.clientArr);
            let resultArr2 = resultArr.concat(this.serviceAgents);
            for (var i = 0; i < resultArr.length; i++) {
                sum = this.toDecimal(sum, resultArr[i].ratio);
            }
            if (sum == 100) {
                sumFlag = true;
            } else {
                sumFlag = false;
            }
            for (var i = 0; i < this.serviceAgents.length; i++) {
                ser_sum = this.toDecimal(ser_sum, this.serviceAgents[i].ratio);
            }
            if (
                this.hasServiceAgent &&
                (this.contType == 2 || this.contType == 3) &&
                ser_sum != 100
            ) {
                this.$message.error("请输入正确的交易服务费佣金分成比例");
                return;
            }
            for (var i = 0; i < resultArr2.length; i++) {
                if (this.$route.query.version == "0") {
                    // 旧版本 总监 副总 必填
                    if (
                        resultArr2[i].roleType === "" ||
                        resultArr2[i].ratio === "" ||
                        resultArr2[i].assignor === "" ||
                        resultArr2[i].isJob === "" ||
                        resultArr2[i].level3 === "" ||
                        resultArr2[i].shopkeeper === "" ||
                        resultArr2[i].level4 === "" ||
                        resultArr2[i].amaldar === "" ||
                        resultArr2[i].manager === ""
                    ) {
                        flag = false;
                    }
                } else {
                    // 新版本 总监 副总 非必填
                    if (
                        (this.isProd == 0 && this.cityId == 40) ||
                        (this.isProd == 1 && this.cityId == 16)
                    ) {
                        if (
                            resultArr2[i].roleType === "" ||
                            resultArr2[i].ratio === "" ||
                            resultArr2[i].assignor === "" ||
                            resultArr2[i].isJob === "" ||
                            resultArr2[i].level3 === ""
                        ) {
                            flag = false;
                        }
                    } else {
                        if (
                            resultArr2[i].roleType === "" ||
                            resultArr2[i].ratio === "" ||
                            resultArr2[i].assignor === "" ||
                            resultArr2[i].isJob === "" ||
                            resultArr2[i].level3 === "" ||
                            resultArr2[i].shopkeeper === ""
                        ) {
                            flag = false;
                        }
                    }
                }
            }
            //flag=true代表信息都填完整，flag=false代表还有信息没有填
            // console.log(sumFlag);

            if (flag && sumFlag) {
                this.loading = true;
                // 新版本时参数添加level4和storefront4Id字段
                if (this.$route.query.version == "1") {
                    resultArr2.forEach(item => {
                        item.level4 = item.level3;
                        item.storefront4Id = item.storefront3Id;
                    });
                }
                let param = {
                    id: this.aId,
                    remark: this.remark,
                    distributions: resultArr2,
                    agendIds: this.agendIds,
                    contractId: this.achObj.contractId,
                    distributionAgreement: this.filesList
                };
                this.$ajax
                    .postJSON("/api/appeal/saveAgents", param)
                    .then(res => {
                        if (res.data.status == 200) {
                            this.$emit("close");
                            this.loading = false;
                            this.$message({
                                message: "操作成功",
                                type: "success"
                            });
                            this.$emit(
                                "adoptData",
                                this.achIndex,
                                resultArr,
                                res.data.data
                            );
                            this.getData();
                        }
                    })
                    .catch(error => {
                        if (error.message === "下一节点审批人不存在") {
                            this.checkPerson.flowType = 2;
                            this.checkPerson.code = this.aId;
                            this.checkPerson.state = true;
                            this.checkPerson.type = 3;
                        } else {
                            this.$message({
                                message: error,
                                type: "error"
                            });
                        }
                        this.loading = false;
                    });
            } else if (!sumFlag && flag) {
                this.$message.error("请输入正确的分成比例");
            } else {
                this.$message.error("请完善信息");
            }
        },
        close() {
            this.aplremark = "";
        },
        handleSelectionChange(val) {
            //返回的是选择当行的对象
            this.addManList = val;
            this.addArr.push(val);
        },
        // 相关人员确定操作
        manSure(type) {
            let addhouseArr = [];
            if (this.type == 1) {
                var hflag = true;
                this.addManList.forEach((item, index) => {
                    for (let i = 0; i < this.houseArr.length; i++) {
                        if (item.roleType == this.houseArr[i].roleType) {
                            this.$message.error("角色已经存在，请勿重新添加");
                            hflag = false;
                            return false;
                        }
                    }
                });
                if (hflag) {
                    this.houseArr = this.houseArr.concat(this.addManList);
                    for (let i = 0; i < this.houseArr.length; i++) {
                        this.$set(this.houseArr[i], "checkbox", []);
                        this.$set(this.houseArr[i], "isService", 0);
                        this.houseArr[i].checkbox.push(this.houseArr[i].place);
                    }
                }
            } else {
                let kflag = true;
                this.addManList.forEach((item, index) => {
                    for (let i = 0; i < this.clientArr.length; i++) {
                        if (item.roleType == this.clientArr[i].roleType) {
                            this.$message.error("角色已经存在，请勿重新添加");
                            kflag = false;
                            return false;
                        }
                    }
                });
                if (kflag) {
                    this.clientArr = this.clientArr.concat(this.addManList);
                    for (let i = 0; i < this.clientArr.length; i++) {
                        this.$set(this.clientArr[i], "checkbox", []);
                        this.$set(this.clientArr[i], "isService", 0);
                        this.clientArr[i].checkbox.push(
                            this.clientArr[i].place
                        );
                    }
                }
            }
            this.showTips1 = false;
        },
        addSubject(data) {
            let arr = data.param;
            arr.forEach(item => {
                let fileType = this.$tool.get_suffix(item.name);
                item.fileType = fileType;
            });
            this.filesList = this.filesList.concat(arr);
            arr.forEach(item => {
                if (this.isPictureFile(item.fileType)) {
                    this.preloadList.push(item.path);
                }
            });
            //   this.fileSign(preloadList,'preload').then(res=>{
            //   this.contDataFiles=res
            // })
            if (this.preloadList.length) {
                this.fileSign(this.preloadList, "preload").then(res => {
                    this.contDataFiles = this.contDataFiles.concat(res);
                });
            }
        },
        deleteFn(i) {
            if (this.filesList.length == 1) {
                this.$message({
                    message: "至少保留一个，请勿删除",
                    type: "warning"
                });
                return;
            }
            this.filesList.splice(i, 1);
        },
        //设置审核人弹窗确认操作
        personChose: function() {
            this.checkPerson.state = false;
            let _this = this;
            if (this.dialogType == 3 || this.dialogType == 1) {
                setTimeout(function() {
                    _this.$emit("close");
                }, 50);
            }
        },
        //设置审核人弹窗关闭操作
        closeCheckPerson() {
            this.checkPerson.state = false;
            let _this = this;
            if (this.dialogType == 3 || this.dialogType == 1) {
                setTimeout(function() {
                    _this.$emit("close");
                }, 50);
            }
        },
        toDecimal(num1, num2) {
            var sq1, sq2, m;
            try {
                sq1 = num1.toString().split(".")[1].length;
            } catch (e) {
                sq1 = 0;
            }
            try {
                sq2 = num2.toString().split(".")[1].length;
            } catch (e) {
                sq2 = 0;
            }
            m = Math.pow(10, Math.max(sq1, sq2));
            return (num1 * m + num2 * m) / m;
        },
        accAdd(num1, num2) {
            var baseNum, baseNum1, baseNum2;
            try {
                baseNum1 = num1.toString().split(".")[1].length;
            } catch (e) {
                baseNum1 = 0;
            }
            try {
                baseNum2 = num2.toString().split(".")[1].length;
            } catch (e) {
                baseNum2 = 0;
            }
            baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
            return Math.round(num1 * baseNum + num2 * baseNum) / baseNum;
        }
    },
    filters: {
        getSignImage(val, list) {
            if (list.length === 0) {
                return "";
            } else {
                return list.find(item => {
                    return item.includes(val);
                });
            }
        }
    },
    computed: {
        isProd() {
            return this.getUser.isProd;
        },
        serfeetotal() {
            var sum = 0;
            this.serviceAgents.forEach((item, index) => {
                sum = this.accAdd(sum, item.ratio == "" ? 0 : item.ratio);
            });
            return sum;
        },
        validInput() {
            return this.aplremark.length;
        },
        housetotal() {
            var sum = 0;
            this.houseArr.forEach((item, index) => {
                sum = this.accAdd(sum, item.ratio == "" ? 0 : item.ratio);
            });
            return sum;
        },
        clienttotal() {
            var sum = 0;
            this.clientArr.forEach((item, index) => {
                sum = this.accAdd(sum, item.ratio == "" ? 0 : item.ratio);
            });
            return sum;
        },
        feetotal() {
            var sum = 0;
            if (this.serviceAgents) {
                this.serviceAgents.forEach((item, index) => {
                    sum = this.accAdd(sum, item.ratio == "" ? 0 : item.ratio);
                });
                return sum;
            } else {
                return 0;
            }
        },
        fctotal() {
            return this.accAdd(this.housetotal, this.clienttotal);
        },
        userInfo() {
            return this.getUser.user;
        },
        cityId() {
            return this.getUser.user.cityId;
        }
    }
};
</script>

<style lang="less" scoped>
@import "~@/assets/common.less";
// 相关人员弹框
.link {
    color: #478de3;
    cursor: pointer;
}

.dot {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.preview {
    z-index: 2220 !important;
}

.ulData {
    display: flex;
    flex-wrap: wrap;

    li {
        margin-right: 10px;
        position: relative;
        margin-bottom: 10px;

        > i {
            display: none;
            position: absolute;
            top: 5px;
            right: 5px;
            color: @color-warning;
            font-size: 20px;
            cursor: pointer;
        }

        &:hover > i {
            display: block;
        }
    }
}

.upload-box {
    display: inline-block;
    text-align: center;
    width: 120px;
    height: 120px;
    box-sizing: border-box;
    padding-top: 28px;
    border: 1px dashed @border-DE;
    border-radius: 2px;

    i {
        color: @bg-th;
        font-size: 50px;
    }

    p {
        padding-top: 10px;
        color: @color-324;
        font-size: 12px;
    }
}

.attach-box {
    display: inline-block;
    text-align: center;
    width: 120px;
    height: 120px;
    padding-top: 20px;
    box-sizing: border-box;
    border-radius: 4px;
    background: @color-F2;

    > p {
        padding-top: 5px;
        display: inline-block;
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

/deep/ .dialog2In {
    width: 450px !important;
    max-height: 600px;
    /*min-height: 500px;*/
    margin-top: 13vh !important;

    .is-checked {
        color: #478de3 !important;
    }

    h1 {
        height: 53px;
        line-height: 53px;
        // font-size: 20px;
        color: #233241;
        padding-left: 20px;
        box-sizing: border-box;
        border-bottom: 1px solid #edecf0;
    }

    .mansList {
        overflow-y: auto;
        max-height: 250px;
        height: 250px;
        // width: 450px !important;
    }

    /deep/ tr td:first-of-type,
    th:first-of-type {
        padding-left: 20px;
    }

    .dialog2-btn {
        /*height: 100px;*/
        padding: 20px 0;
        padding-right: 30px;
        box-sizing: border-box;
        background-color: #fff;
        width: 440px;
        text-align: right;

        button {
            width: 100px;
            height: 38px;
            border-radius: 19px;
        }

        button:first-of-type {
            background-color: #f5f5f5;
            color: #000;
            border: 1px solid #e8eaf6;
        }
    }

    .cell {
        font-size: 12px;
    }
}

//业绩详情弹框改变样式
.dialog1 {
    padding-left: 20px;
    padding-top: 5px;

    /deep/ .base-dialog {
        /deep/ .el-input__suffix {
            right: 21px;
        }

        /deep/ .el-icon-circle-close {
            position: absolute;
            right: -15px;
            top: 0;
        }

        .close-btn {
            position: absolute;
            right: 30px;
            top: 30px;
            font-size: 30px;
        }

        .ach-header {
            min-height: 70px;
            background-color: #fff;
            border-bottom: 1px solid #edecf0;
            overflow: hidden;

            h1 {
                // font-size: 20px;
                color: #233241;
            }

            p {
                // font-size: 14px;
                color: #6c7986;
                margin: 12px 0 0 20px !important;
                line-height: 0;
            }
        }

        .ach-body {
            // max-height: 500px;
            box-sizing: border-box;
            overflow-y: auto;

            .ach-divide-list {
                display: flex;
                justify-content: space-between;
            }

            /deep/ .el-select__caret.is-reverse,
            .el-icon-arrow-up {
                position: absolute;
                line-height: 30px;
                left: -5px;
                top: 0;
            }

            .el-radio + .el-radio {
                margin-left: 0;
            }

            .house-divide {
                width: 100%;
                display: flex;
                height: 60px;
                justify-content: space-between;
                //   background-color: pink;
                .house-left {
                    margin-top: 10px;
                    margin-bottom: 15px;

                    h1 {
                        // font-size: 16px !important;
                        color: #233241 !important;
                        margin: 0px !important;
                    }
                }

                .house-right {
                    margin-top: 10px;

                    button {
                        padding: 0 10px !important;
                        border-radius: 0;
                    }

                    button:first-of-type {
                        height: 36px;
                        border-radius: 5px;
                    }

                    button:nth-of-type(2) {
                        // width: 105px;
                        height: 36px;
                        border-radius: 5px;
                    }

                    button:nth-of-type(3) {
                        // width: 105px;
                        height: 36px;
                        border-radius: 5px;
                    }

                    .el-button--primary {
                        background-color: #409eff;
                        border: 0;
                    }
                }
            }

            //弹框审核信息
            h1 {
                // font-size: 16px;
                color: #233241;
                margin: 0px !important;
            }
        }

        /deep/ .el-table {
            // font-size: 14px !important;
            border-spacing: 0px;

            td,
            th {
                padding: 0px 0px !important;
                height: 100%;
            }

            .el-table__header {
                // height: 55px;
                th {
                    padding: 0;
                    background-color: #eef2fb;
                }
            }

            // .el-table__header th .cell {
            //   height: 30px;
            //   line-height: 30px;
            // }
        }

        /deep/ .el-radio__label {
            font-size: 12px;
        }

        .ach-footer {
            // min-height: 100px;
            width: 100%;
            background-color: #fff;
            padding-left: 20px;
            box-sizing: border-box;
            position: relative;

            .el-input__prefix {
                left: 107px;
            }

            .el-input__suffix {
                right: 90px;
                display: none;
            }

            .el-input__inner {
                width: 150px !important;
            }

            p {
                margin-top: 5px;
            }

            .text-layout-out {
                position: relative;
                width: 500px;
            }

            .text-layout {
                position: relative;

                .el-textarea {
                    position: absolute;
                    left: 43px;
                    top: 0;
                    padding-bottom: 80px;
                    width: 60%;
                }

                textarea {
                    width: 400px !important;
                    height: 90px;
                }

                .textLength {
                    position: absolute;
                    right: 50px;
                    bottom: -65px;
                    color: #6c7986;
                    text-align: right;
                }
            }

            .footer-btn-layout {
                height: 38px;
                text-align: right;
                padding-right: 30px;
                margin-top: 15px;

                button {
                    height: 38px;
                    border-radius: 19px;
                    border: 0;
                }

                .color-green {
                    background-color: #54d384;
                }

                .color-red {
                    background-color: #f56c6c;
                    margin-left: 20px;
                }

                .color-blue {
                    background-color: #478de3;
                }

                .color-white {
                    background-color: #fff;
                    color: #000;
                    border: 1px solid #e8eaf6;
                }
            }
        }
    }

    .input-ratio {
        color: #606266;
    }

    .orange {
        color: #f56c6c;
    }

    .delive {
        margin-top: 5px;
        color: #f56c6c;
    }
}

/deep/ .top20 {
    margin-top: 10px;
}

/deep/ .el-dialog.base-dialog .ach-body {
    padding: 0 20px !important;
}

/deep/ .dialog2In .el-dialog__header {
    padding: 0 !important;
}

/deep/ .el-dialog.base-dialog .el-input__inner {
    border: 0;
    box-shadow: 0;
    padding: 0;
    padding-left: 5px !important;
    padding-right: 25px !important;
    // padding-left: 10px;
    font-size: 12px !important;
}

.text-absolute {
    position: absolute;
    right: 4px;
    color: #d6d6d6;
    bottom: 0;
}

/deep/ input::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #ccc !important;
}

/deep/ input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #ccc !important;
}

/deep/ input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #ccc !important;
}

/deep/ input:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #ccc !important;
}

.record-table-dialog {
    /deep/ .el-dialog__body {
        padding: 10px 20px;
    }
}

.recordtable {
    // min-height: 200px;
    /deep/ th {
        background-color: #eef2fb;
    }
}

// .dialog1 /deep/ input, .el-input__inner{
//   font-size: 10px !important;
//   height: 30px;
//   line-height: 30px;
// }
//   .dialog1 /deep/ .el-input__icon{
//     line-height: 0px;
//   }
.grey {
    background-color: #f5f5f5;
    color: #aca899;
    border: 1px solid #ddd;

    &:hover {
        background-color: #f5f5f5;
        color: #aca899;
        border: 1px solid #ddd;
    }
}

/deep/ .sushen tr td .cell {
    line-height: 30px;
}
.contRemark {
    width: 700px;
    height: 80px;
    margin-top: 10px;
    /deep/.is-disabled {
        .el-textarea__inner {
            color: #606266;
            font-size: 12px;
        }
    }
}
</style>
