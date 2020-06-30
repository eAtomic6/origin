<template>
    <div>
        <div class="ach-header">
            <h1 class="f14">业绩详情</h1>
            <p class="f14"
                style="font-weight:bold;color:red">
                <!-- 可分配业绩：<span>{{comm}}元</span>
        <span>（可分配业绩=客户佣金+业主佣金-第三方合作费）</span> -->
            </p>
        </div>
        <div class="ach-body">
            <h1 class="f14">房源方分成
                <el-button type="primary"
                    @click="houseRecode">房源价格变更记录
                </el-button>
            </h1>
            <p class="f_l delive"
                style="position:relative;color:red;top:-14px">房客源可分配业绩总计：{{comm?comm:0}}元</p>
            <div class="ach-divide-list">
                <el-table :data="houseArr"
                    style="width: 100%"
                    border>
                    <!-- roleType 分成人角色类型 :
           房源>0:录入、1:维护、2:独家、3:房勘、4:钥匙、5:委托、6:建盘
           客源>7:主客方、8:推荐人、9:签约人、10:A/M、11:协议方、12:协议方2-->
                    <el-table-column label="角色类型">
                        <template slot-scope="scope">
                            <div>
                                <p>{{scope.row.roleName}}</p>
                            </div>
                        </template>
                    </el-table-column>

                    <!-- ratio -->
                    <el-table-column prop="ratio"
                        label="分成比例(%)">
                    </el-table-column>

                    <el-table-column label="分成金额（元）"
                        width="110">
                        <template slot-scope="scope">
                            {{(comm|| 0) * scope.row.ratio  / 100 * (100 - (scope.row.platformFeeRatio || 0)) / 100 }}
                            <!-- (合同应收佣金 * 个人角色比例) - (特许服务费 = 合同应收佣金 * 个人角色比例 * 平台费比例) -->
                        </template>
                    </el-table-column>

                    <!-- assignor -->
                    <el-table-column prop="assignor"
                        label="经纪人">
                    </el-table-column>

                    <!-- <el-table-column label="登录账号" v-if="getUser.version===3" width="100">
            <template slot-scope="scope">
              <p v-if="scope.row.loginAccount">{{scope.row.loginAccount}}</p>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <el-table-column label="员工工号" v-if="getUser.version===3" width="100">
            <template slot-scope="scope">
              <p v-if="scope.row.assignorNum">{{scope.row.assignorNum}}</p>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <el-table-column label="经纪人工号" v-else width="100">
            <template slot-scope="scope">
              <p v-if="scope.row.assignorNum">{{scope.row.assignorNum}}</p>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <el-table-column label="经纪人级别" width="100">
            <template slot-scope="scope">
              <p v-if="scope.row.assignorLevel">{{scope.row.assignorLevel}}</p>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <el-table-column label="销售经理级别" width="100">
            <template slot-scope="scope">
              <p v-if="scope.row.salesManagerLevel">{{scope.row.salesManagerLevel}}</p>
              <p v-else>-</p>
            </template>
          </el-table-column> -->

                    <!-- isJob  在职状态(0:离职  1:在职 2:待入职) -->
                    <el-table-column label="在职状况">
                        <template slot-scope="scope">
                            <div v-if="scope.row.isJob">
                                <p>{{scope.row.isJob.label}}</p>
                            </div>
                        </template>
                    </el-table-column>

                    <!-- shopkeeper -->
                    <el-table-column label="店长">
                        <template slot-scope="scope">
                            <span v-if="scope.row.shopkeeper">{{scope.row.shopkeeper}}</span>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                    <!-- level4 -->
                    <el-table-column prop="level4"
                        label="单组"
                        v-if="$route.query.version=='0'">
                    </el-table-column>
                    <!-- level3 -->
                    <el-table-column prop="level3"
                        label="门店">
                    </el-table-column>

                    <!-- amaldar -->
                    <el-table-column prop="amaldar"
                        label="总监"
                        :formatter="nullFormatter">
                    </el-table-column>

                    <!-- manager -->
                    <el-table-column prop="manager"
                        label="副总"
                        :formatter="nullFormatter">
                    </el-table-column>
                    <el-table-column label="公共业绩">
                        <template slot-scope="scope">
                            <div v-if="scope.row.place==-1">--</div>
                            <div v-if="scope.row.place==0">门店公共业绩</div>
                            <div v-if="scope.row.place==1">公司公共业绩</div>
                            <div v-if="scope.row.place==2">大区公共业绩</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <h1 class="f14">客源方分成
                <el-button type="primary"
                    @click="ammanger">{{$route.query.version=='0'?'AM管理关系':'师徒管理关系'}}
                </el-button>
            </h1>
            <p class="f_l delive"
                style="position:relative;color:red;top:-14px">房客源可分配业绩总计：{{comm?comm:0}}元</p>
            <div class="ach-divide-list">
                <el-table :data="clientArr"
                    style="width: 100%"
                    border>
                    <!-- roleType 分成人角色类型 :
              房源>0:录入、1:维护、2:独家、3:房勘、4:钥匙、5:委托、6:建盘
              客源>7:主客方、8:推荐人、9:签约人、10:A/M、11:协议方、12:协议方2-->
                    <el-table-column label="角色类型">
                        <template slot-scope="scope">
                            <div>
                                <p>{{scope.row.roleName}}</p>
                            </div>
                        </template>
                    </el-table-column>

                    <!-- ratio -->
                    <el-table-column prop="ratio"
                        label="分成比例(%)">
                    </el-table-column>

                    <el-table-column label="分成金额（元）"
                        width="110">
                        <template slot-scope="scope">
                            {{(comm|| 0) * scope.row.ratio  / 100 * (100 - (scope.row.platformFeeRatio || 0)) / 100 }}
                            <!-- (合同应收佣金 * 个人角色比例) - (特许服务费 = 合同应收佣金 * 个人角色比例 * 平台费比例) -->
                        </template>
                    </el-table-column>

                    <!-- assignor -->
                    <el-table-column prop="assignor"
                        label="经纪人">
                    </el-table-column>

                    <!-- <el-table-column label="登录账号" v-if="getUser.version===3" width="100">
            <template slot-scope="scope">
              <p v-if="scope.row.loginAccount">{{scope.row.loginAccount}}</p>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <el-table-column label="员工工号" v-if="getUser.version===3" width="100">
            <template slot-scope="scope">
              <p v-if="scope.row.assignorNum">{{scope.row.assignorNum}}</p>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <el-table-column label="经纪人工号" v-else width="100">
            <template slot-scope="scope">
              <p v-if="scope.row.assignorNum">{{scope.row.assignorNum}}</p>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <el-table-column label="经纪人级别" width="100">
            <template slot-scope="scope">
              <p v-if="scope.row.assignorLevel">{{scope.row.assignorLevel}}</p>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <el-table-column label="销售经理级别" width="100">
            <template slot-scope="scope">
              <p v-if="scope.row.salesManagerLevel">{{scope.row.salesManagerLevel}}</p>
              <p v-else>-</p>
            </template>
          </el-table-column> -->

                    <!-- isJob  在职状态(0:离职  1:在职 2:待入职) -->
                    <el-table-column label="在职状况">
                        <template slot-scope="scope">
                            <div v-if="scope.row.isJob">
                                <p>{{scope.row.isJob.label}}</p>
                            </div>
                        </template>
                    </el-table-column>

                    <!-- shopkeeper -->
                    <el-table-column label="店长">
                        <template slot-scope="scope">
                            <span v-if="scope.row.shopkeeper">{{scope.row.shopkeeper}}</span>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                    <!-- level4 -->
                    <el-table-column prop="level4"
                        label="单组"
                        v-if="$route.query.version=='0'">
                    </el-table-column>
                    <!-- level3 -->
                    <el-table-column prop="level3"
                        label="门店">
                    </el-table-column>

                    <!-- amaldar -->
                    <el-table-column prop="amaldar"
                        label="总监"
                        :formatter="nullFormatter">
                    </el-table-column>

                    <!-- manager -->
                    <el-table-column prop="manager"
                        label="副总"
                        :formatter="nullFormatter">
                    </el-table-column>
                    <el-table-column label="公共业绩">
                        <template slot-scope="scope">
                            <div v-if="scope.row.place==-1">--</div>
                            <div v-if="scope.row.place==0">门店公共业绩</div>
                            <div v-if="scope.row.place==1">公司公共业绩</div>
                            <div v-if="scope.row.place==2">大区公共业绩</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <template v-if="hasServiceAgent">
                <h1 class="f14"
                    v-if="contType==2||contType==3">交易服务费佣金分成
                </h1>
                <p class="f14"
                    v-if="contType==2||contType==3"
                    style="color:red">
                    交易服务费佣金可分配业绩：<span>{{tradeFee}}元</span>
                </p>
                <div class="ach-divide-list"
                    v-if="contType==2||contType==3">
                    <el-table :data="serviceach"
                        style="width: 100%"
                        border>
                        <!-- roleType 分成人角色类型 :
                房源>0:录入、1:维护、2:独家、3:房勘、4:钥匙、5:委托、6:建盘
                客源>7:主客方、8:推荐人、9:签约人、10:A/M、11:协议方、12:协议方2-->
                        <el-table-column label="角色类型">
                            <template slot-scope="scope">
                                <div>
                                    <p>{{scope.row.roleName}}</p>
                                </div>
                            </template>
                        </el-table-column>

                        <!-- ratio -->
                        <el-table-column prop="ratio"
                            label="分成比例(%)">
                        </el-table-column>

                        <el-table-column label="分成金额（元）"
                            width="110">
                            <template slot-scope="scope">
                                {{tradeFee * scope.row.ratio / 100 || 0}}
                            </template>
                        </el-table-column>

                        <!-- assignor -->
                        <el-table-column prop="assignor"
                            label="经纪人">
                        </el-table-column>

                        <!-- <el-table-column label="登录账号" v-if="getUser.version===3" width="100">
              <template slot-scope="scope">
                <p v-if="scope.row.loginAccount">{{scope.row.loginAccount}}</p>
                <p v-else>-</p>
              </template>
            </el-table-column>
            <el-table-column label="员工工号" v-if="getUser.version===3" width="100">
              <template slot-scope="scope">
                <p v-if="scope.row.assignorNum">{{scope.row.assignorNum}}</p>
                <p v-else>-</p>
              </template>
            </el-table-column>
            <el-table-column label="经纪人工号" v-else width="100">
              <template slot-scope="scope">
                <p v-if="scope.row.assignorNum">{{scope.row.assignorNum}}</p>
                <p v-else>-</p>
              </template>
            </el-table-column>
            <el-table-column label="经纪人级别" width="100">
              <template slot-scope="scope">
                <p v-if="scope.row.assignorLevel">{{scope.row.assignorLevel}}</p>
                <p v-else>-</p>
              </template>
            </el-table-column>
            <el-table-column label="销售经理级别" width="100">
              <template slot-scope="scope">
                <p v-if="scope.row.salesManagerLevel">{{scope.row.salesManagerLevel}}</p>
                <p v-else>-</p>
              </template>
            </el-table-column> -->

                        <!-- isJob  在职状态(0:离职  1:在职 2:待入职) -->
                        <el-table-column label="在职状况">
                            <template slot-scope="scope">
                                <div v-if="scope.row.isJob">
                                    <p>{{scope.row.isJob.label}}</p>
                                </div>
                            </template>
                        </el-table-column>

                        <!-- shopkeeper -->
                        <el-table-column label="店长">
                            <template slot-scope="scope">
                                <span v-if="scope.row.shopkeeper">{{scope.row.shopkeeper}}</span>
                                <span v-else>-</span>
                            </template>
                        </el-table-column>
                        <!-- level4 -->
                        <el-table-column prop="level4"
                            label="单组"
                            v-if="$route.query.version=='0'">
                        </el-table-column>
                        <!-- level3 -->
                        <el-table-column prop="level3"
                            label="门店">
                        </el-table-column>

                        <!-- amaldar -->
                        <el-table-column prop="amaldar"
                            label="总监"
                            :formatter="nullFormatter">
                        </el-table-column>

                        <!-- manager -->
                        <el-table-column prop="manager"
                            label="副总"
                            :formatter="nullFormatter">
                        </el-table-column>
                        <el-table-column label="公共业绩">
                            <template slot-scope="scope">
                                <div v-if="scope.row.place==-1">--</div>
                                <div v-if="scope.row.place==0">门店公共业绩</div>
                                <div v-if="scope.row.place==1">公司公共业绩</div>
                                <div v-if="scope.row.place==2">大区公共业绩</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </template>

            <h1 class="f14">审核信息</h1>

            <div class="ach-check-list">
                <el-table :data="checkArr"
                    key="tab11"
                    border>
                    <!-- examineDate -->
                    <el-table-column label="时间">
                        <template slot-scope="scope">
                            <p v-if="scope.row.examineDate">{{scope.row.examineDate|formatTime}}</p>
                            <p v-else>-</p>
                        </template>
                    </el-table-column>
                    <!-- auditorDepartment -->
                    <el-table-column prop="auditor"
                        label="姓名">
                    </el-table-column>
                    <!-- auditor -->
                    <el-table-column prop="auditorDepartment"
                        label="职务">
                    </el-table-column>

                    <el-table-column prop="createDepName"
                        label="操作">
                    </el-table-column>

                    <!-- remark -->
                    <el-table-column label="备注">
                        <template slot-scope="scope">
                            <div v-if="scope.row.remark">
                                <el-popover trigger="hover"
                                    placement="top"
                                    :content="scope.row.remark"
                                    width="130">
                                    <div style="width:160px"
                                        slot="reference"
                                        class="name-wrapper">{{scope.row.remark}}</div>
                                </el-popover>
                            </div>
                            <div v-else>
                                --
                            </div>
                        </template>
                    </el-table-column>
                </el-table>

            </div>

            <h1 class="f14">申诉信息</h1>

            <div class="ach-divide-list">
                <el-table key="tab12"
                    :data="shensuArr"
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

            <h1 class="f14"
                v-if="fujian">业绩分成协议</h1>
            <ul class="ulData"
                style="margin-top:10px"
                v-if="fujian">
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
                    <!-- <i class="iconfont icon-tubiao-6" @click="deleteFn(i)"></i> -->
                </li>
            </ul>
        </div>

        <preview :imgList="previewFiles"
            :start="previewIndex"
            v-if="preview"
            @close="preview=false"></preview>
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
                    label="底价（修改前）"
                    v-if="$route.query.version=='0'"></el-table-column>
                <el-table-column prop="TotalPriceAfter"
                    label="总价（修改后）"></el-table-column>
                <el-table-column prop="FinalPriceAfter"
                    label="底价（修改后）"
                    v-if="$route.query.version=='0'"></el-table-column>
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
                <el-button @click="pass('no')"
                    type="primary"
                    class="confirmBtn color-red"
                    v-dbClick>驳回</el-button>
                <el-button @click="pass()"
                    type="primary"
                    class="confirmBtn"
                    v-dbClick>通过</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { FILTER } from "@/assets/js/filter";
import { MIXINS } from "@/assets/js/mixins";

export default {
    mixins: [FILTER, MIXINS],
    data() {
        return {
            contDataFiles: [], //资料库图片缩略图
            mainDataFiles: [], //合同主体图片缩略图
            preloadList: [],
            preloadFiles: [],
            auditIds: "",
            aplremark: "",
            inputMax: 200,
            aplman: "",
            aplrole: "",
            aplcontent: "",
            aplurl: [],
            aplid: "",
            aplDialog: false,
            imgList: [],
            shensuArr: [],
            AMData: [],
            AMShow: false,
            recordData: [],
            recordShow: false,
            shows: true,
            houseArr: [], //房源列表
            clientArr: [], //客源列表
            examineDate: "", //审核时间
            comm: "", //可分配业绩
            remark: "",
            contCode: "",
            entrance: "",
            aId: "",
            checkArr: [],
            contractId2: "",
            serviceach: [],
            filesList: [],
            fujian: false,
            contType: "",
            tradeFee: 0,
            hasServiceAgent: false, //是否勾选交易服务费佣金分成
            contRemarks: "" //合同备注栏
        };
    },
    created() {
        this.contType = this.$route.query.contType;
        this.contCode = this.$route.query.contCode;
        this.entrance = this.$route.query.entrance;
        this.aId = this.$route.query.aId;
        this.contractId2 = this.$route.query.contractId2;
        //合同边和获取业绩详情
        this.setPath(
            this.$tool.getRouter(
                ["二手房", "业绩", "应收业绩", "业绩详情"],
                "actualAchievement"
            )
        );

        this.getData();
    },
    methods: {
        getData() {
            let param = {
                contId: this.contractId2,
                entrance: this.entrance,
                aId: this.aId
            };
            this.$ajax
                .get("/api/achievement/getAchDetails", param)
                .then(res => {
                    let data = res.data;
                    if (res.status === 200) {
                        //2.4.6新需求 增加合同备注栏
                        if (
                            data.data.contRemarks &&
                            data.data.contRemarks.length > 0
                        ) {
                            this.contRemarks = data.data.contRemarks;
                        } else {
                            this.contRemarks = "";
                        }
                        this.auditIds = data.data.auditIds;
                        this.shensuArr = data.data.appeals;
                        for (let i = 0; i < this.shensuArr.length; i++) {
                            this.shensuArr[i].voucherUrl = this.getPicture(
                                JSON.parse(this.shensuArr[i].voucherUrl)
                            );
                        }
                        this.houseArr = data.data.houseAgents;
                        this.clientArr = data.data.customerAgents;
                        this.serviceach = data.data.serviceAgents;
                        this.tradeFee = data.data.tradeFee;
                        this.hasServiceAgent =
                            data.data.hasServiceAgent === 0 ? false : true;
                        if (
                            res.data.data.distributionAgreement &&
                            JSON.parse(res.data.data.distributionAgreement)
                                .length > 0
                        ) {
                            this.fujian = true;
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
                        if (data.data.achievements) {
                            this.checkArr = data.data.achievements; //详情的审核信息
                        } else {
                            this.checkArr = [];
                        }
                        this.comm = data.data.comm;
                    }
                })
                .catch(err => {
                    this.$message({ message: err });
                });
        },
        close() {
            this.aplremark = "";
        },
        itemht(row) {
            this.aplman = row.appealName;
            this.aplrole = row.roles;
            this.aplcontent = row.appealContent;
            this.aplurl = row.voucherUrl;
            this.aplid = row.id;
            this.aplDialog = true;
        },
        trim(str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        },
        pass(operation = "yes") {
            let param = {
                id: this.aplid,
                examineRemark: this.aplremark
            };
            if (operation === "no" && this.trim(this.aplremark).length == 0) {
                this.$message({ message: "请填写备注信息！" });
                return;
            }
            let url =
                operation === "yes"
                    ? "/appeal/appealAdopt"
                    : "/appeal/appealReject";
            this.$ajax
                .post(`/api${url}`, param, 2)
                .then(res => {
                    if (res.status == 200) {
                        this.$message({ message: "操作成功", type: "success" });
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
        validInput() {
            return this.aplremark.length;
        }
    }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";

.color-red {
    background-color: #f56c6c;
    margin-left: 20px;
}

/deep/ .sushen tr td .cell {
    line-height: 30px;
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
    margin: 10px;
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

.link {
    color: #478de3;
    cursor: pointer;
}

.dot {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.text-absolute {
    position: absolute;
    right: 4px;
    color: #d6d6d6;
    bottom: 0;
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
    padding: 0 20px !important;
    box-sizing: border-box;
    // overflow-y: scroll!important;
    h1 {
        display: flex;
        justify-content: space-between;
    }

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
