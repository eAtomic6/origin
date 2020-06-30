<!-- 意向详情金 -->
<template>
    <div class="view-container"
        id="intention">
        <div class="detailbox"
            v-if="detailData.contState">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane :label="detailData.contType.value === 4 ? '意向金详情':'定金详情'"
                    name="first"
                    class="first-tab">
                    <div class="tab"
                        :style="{ height: clientHeight() }">
                        <ul class="ul2">
                            <li class="tabs-title">合同信息</li>
                            <ul class="ul3">
                                <li>
                                    <div class="div1"><span>合同编号：</span><em class="blue">{{detailData.code}}</em></div>
                                    <div class="div1"
                                        v-if="detailData.recordType.value===2"><span>纸质合同编号：</span><em class="blue">{{detailData.pCode}}</em></div>
                                    <div class="div2"><span>签约日期：</span>{{detailData.signDate.substr(0, 16)}}</div>
                                    <div class="div3"><span>认购期限：</span>{{detailData.subscriptionTerm | subStrFn}}</div>
                                </li>
                                <li>
                                    <div class="div1"><span>合同类型：</span>{{detailData.contType.label | nullData}}</div>
                                    <div class="div2"><span>认购总价：</span>{{detailData.subscriptionPrice | nullData}}元</div>
                                    <div v-if="detailData.contType.value == 4"><span>意向金金额：</span><span class="yellow mr12">{{detailData.dealPrice | nullData}}元</span><span class="chinesemoney yellow">{{detailData.dealPrice | moneyFormat}}</span></div>
                                    <div v-if="detailData.contType.value == 5"><span>定金金额：</span><span class="yellow mr12">{{detailData.dealPrice | nullData}}元</span><span class="chinesemoney yellow">{{detailData.dealPrice | moneyFormat}}</span></div>
                                </li>
                            </ul>
                        </ul>
                        <ul class="ul2">
                            <li class="tabs-title">房源信息</li>
                            <ul class="ul3">
                                <li>
                                    <div class="div1"><span>房源编号：</span><em :class="{'blue':detailData.houseinfoCode}">{{detailData.houseinfoCode | nullData}}</em></div>
                                    <div class="div2"
                                        v-if="detailData.houseInfo.HouseType==='0*0*0*0'"><span>房型：</span>--</div>
                                    <div class="div2"
                                        v-else><span>房型：</span>{{detailData.houseInfo.HouseType | nullData}}</div>
                                    <div class="div22"><span>物业地址：</span>{{detailData.propertyAddr | nullData}}</div>
                                </li>
                                <li>
                                    <div class="div1"
                                        v-if="detailData.houseInfo.TradeInt == 0&&detailData.houseInfo.ListingPrice"><span>房源价格：</span>{{detailData.houseInfo.ListingPrice | nullData}}</div>
                                    <div class="div1"
                                        v-if="detailData.houseInfo.TradeInt == 2&&detailData.houseInfo.ListingPrice"><span>房源价格：</span>{{detailData.houseInfo.ListingPrice | nullData}}元</div>
                                    <div class="div1"
                                        v-if="detailData.houseInfo.TradeInt == 3&&detailData.houseInfo.ListingPrice"><span>房源价格：</span>{{detailData.houseInfo.ListingPrice | nullData}}元/月</div>
                                    <div class="div1"
                                        v-if="!detailData.houseInfo.ListingPrice"><span>房源价格：</span>--</div>
                                    <div class="div2"
                                        v-if="detailData.houseInfo.Square"><span>建筑面积：</span>{{detailData.houseInfo.Square | nullData}}㎡</div>
                                    <div class="div2"
                                        v-else><span>建筑面积：</span>--</div>
                                    <div class="div2"><span>朝向：</span>{{detailData.houseInfo.Orientation | nullData}}</div>
                                    <div><span>用途：</span>{{detailData.houseInfo.HousePurpose | nullData}}</div>
                                </li>
                                <li>
                                    <div class="div1" v-if="detailData.houseInfo.SquareUse"><span>套内面积：</span>{{detailData.houseInfo.SquareUse | nullData}}㎡</div>
                                    <div class="div1"
                                        v-else><span>套内面积：</span>--</div>
                                    <div class="div2"><span>装修：</span>{{detailData.houseInfo.DecorateType | nullData}}</div>
                                    <div><span>产权地址：</span>{{detailData.propertyRightAddr | nullData}}</div>
                                </li>
                                <li>
                                    <div class="div1" style="position:relative">
                                        <span>业主姓名：</span>
                                        <span class="ellipsisStyle" :title="ownerInfo[0].name">{{ownerInfo[0].name | nullData}}</span>
                                    </div>
                                    <div class="div2"><span>手机：</span>{{ownerInfo[0].mobile | nullData}}</div>
                                    <div class="div2"><span v-if="ownerInfo[0].cardType == 1">身份证号：</span><span v-if="ownerInfo[0].cardType == 2">护照：</span><span v-if="ownerInfo[0].cardType == 3">营业执照：</span><span v-if="ownerInfo[0].cardType == 4">军官证：</span><span class="ellipsisStyle" :title="ownerInfo[0].identifyCode">{{ownerInfo[0].identifyCode | nullData}}</span></div>
                                    <div v-if="detailData.recordType&&detailData.recordType===10"><span>邮箱：</span>{{detailData.email}}</div> 
                                </li>
                                <li v-if="detailData.recordType&&detailData.recordType===10">
                                    <div class="div1" style="position:relative">
                                        <span>企业名称：</span>
                                        <span class="ellipsisStyle" :title="ownerInfo[0].companyName">{{ownerInfo[0].companyName | nullData}}</span>
                                    </div>
                                    <div class="div1" style="position:relative">
                                        <span>法人名称：</span>
                                        <span class="ellipsisStyle" :title="ownerInfo[0].lepName">{{ownerInfo[0].lepName | nullData}}</span>
                                    </div>
                                    <div class="div1" style="position:relative">
                                        <span>法人身份证号：</span>
                                        <span class="ellipsisStyle" :title="ownerInfo[0].lepIdentity">{{ownerInfo[0].lepIdentity | nullData}}</span>
                                    </div>
                                </li>
                            </ul>
                        </ul>
                        <ul class="ul2">
                            <li class="tabs-title">客源信息</li>
                            <ul class="ul3">
                                <li>
                                    <div class="div1"><span>客源编号：</span><em class="blue">{{detailData.guestinfoCode | nullData}}</em></div>
                                    <div><span>成交经纪人：</span>{{detailData.dealAgentStoreName + '-' + detailData.dealAgentName | nullData}}</div>
                                </li>
                                <li>
                                    <div class="div1"
                                        style="position:relative">
                                        <span>客户姓名：</span>
                                        <span class="ellipsisStyle" :title="custInfo[0].name">{{custInfo[0].name | nullData}}</span>
                                    </div>
                                    <div class="div2"><span>手机：</span>{{custInfo[0].mobile | nullData}}</div>
                                    <div class="div2"><span v-if="custInfo[0].cardType == 1">身份证号：</span><span v-if="custInfo[0].cardType == 2">护照：</span><span v-if="custInfo[0].cardType == 3">营业执照：</span><span v-if="custInfo[0].cardType == 4">军官证：</span><span class="ellipsisStyle" :title="custInfo[0].identifyCode">{{custInfo[0].identifyCode | nullData}}</span></div>
									<div v-if="detailData.recordType&&detailData.recordType===10"><span>邮箱：</span>{{detailData.email}}</div>
                                </li>
                                <li v-if="detailData.recordType&&detailData.recordType===10">
                                    <div class="div1" style="position:relative">
                                        <span>企业名称：</span>
                                        <span class="ellipsisStyle" :title="ownerInfo[0].companyName">{{ownerInfo[0].companyName | nullData}}</span>
                                    </div>
                                    <div class="div1" style="position:relative">
                                        <span>法人名称：</span>
                                        <span class="ellipsisStyle" :title="ownerInfo[0].lepName">{{ownerInfo[0].lepName | nullData}}</span>
                                    </div>
                                    <div class="div1" style="position:relative">
                                        <span>法人身份证号：</span>
                                        <span class="ellipsisStyle" :title="ownerInfo[0].lepIdentity">{{ownerInfo[0].lepIdentity | nullData}}</span>
                                    </div>
                                </li>
                            </ul>
                        </ul>
                        <div class="textbox"
                            v-if="detailData.contType.value == 4">
                            <span>意向备注：</span>
                            <el-input type="textarea"
                                class="textareawidth"
                                :disabled="true"
                                v-model="detailData.remarks"
                                :autosize="{ minRows: 5, maxRows: 5}"></el-input>
                        </div>
                    </div>
                    <div class="footer">
                        <div>
                            <p><span>录入时间：</span>{{detailData.createTime|getDate}}</p>
                            <p><span>录入人：</span>{{detailData.recordDeptName}}-{{detailData.recordName}}</p>
                            <p><span>最后修改：</span>{{detailData.updateTime|getDate}}</p>
                        </div>
                        <div v-if="detailData.contChangeState.value!=2">
                            <el-button round
                                class="search_btn"
                                v-if="power['sign-ht-info-view'].state&&detailData.recordType.value===1"
                                @click="onPreview()">预览</el-button>
                            <el-button round
                                type="danger"
                                class="search_btn"
                                v-if="power['sign-ht-xq-void'].state&&(detailData.recordType.value===1&&detailData.contState.value===2)"
                                @click="invalid">撤单</el-button>
                            <el-button round
                                type="danger"
                                class="search_btn"
                                v-if="power['sign-ht-xq-cancel'].state&&detailData.contState.value===3&&detailData.laterStageState.value!=5&&detailData.cancelExamineState!=0&&detailData.resultState.value===1"
                                @click="goChangeCancel(2)">解约</el-button>
                            <el-button round
                                type="primary"
                                class="search_btn"
                                v-if="power['sign-ht-xq-modify'].state&&detailData.contState.value===3&&detailData.contChangeState.value!=1&&detailData.laterStageState.value!=5&&detailData.changeExamineState!=0&&detailData.resultState.value===1"
                                @click="goChangeCancel(1)">变更</el-button>
                            <el-button round
                                type="primary"
                                class="search_btn"
                                v-if="(power['sign-ht-info-edit'].state&&detailData.recordType.value!=2&&detailData.contState.value!=3)
                                ||(power['sign-ht-info-addoffline'].state&&detailData.recordType.value===2&&(detailData.contState.value!=3||detailData.contState.value===3&&detailData.resultState.value===1&&!getUserMsg&&!detailData.isDeal))"
                                @click="onEdit(detailData.contType)">编辑</el-button>
                            <el-button round
                                type="primary"
                                class="search_btn"
                                v-if="power['sign-ht-view-toverify'].state&&detailData.toExamineState.value<0&&detailData.isCanAudit===1"
                                @click="isSubmitAudit=true">提交审核</el-button>
                        </div>
                        <div v-else>
                            <el-button round
                                class="search_btn"
                                v-if="power['sign-ht-info-view'].state&&detailData.recordType.value===1"
                                @click="onPreview()">预览</el-button>
                        </div>
                    </div>
                </el-tab-pane>
                <!-- xuneng修改：意向定金打开合同主体限制，照搬买卖租赁 -->
                <el-tab-pane label="合同主体"
                    name="second"
                    v-if="power['sign-ht-xq-main-add'].state">
                    <div class="contractSubject"
                        v-if="power['sign-ht-xq-main-add'].state&&(detailData.contState.value>1||detailData.contState.value!=0&&detailData.recordType.value===2)">
                        <ul class="ulData">
                            <li v-show="(detailData.signingState&&detailData.signingState.value!==1&&detailData.signingState.value!==0)||!detailData.signingState">
                                <file-up class="uploadSubject"
                                    @getUrl="uploadSubject"
                                    id="zhuti_"
                                    :scane="scaneZhuti">
                                    <i class="iconfont icon-shangchuan"></i>
                                    <p>点击上传</p>
                                </file-up>
                            </li>
                            <li v-for="(item,index) in uploadList"
                                :key="item.index"
                                @mouseover="moveIn(item.index+item.path)"
                                @mouseout="moveOut(item.index+item.path)">
                                <el-tooltip class="item"
                                    effect="dark"
                                    :content="item.name"
                                    placement="bottom">
                                    <div class="namePath"
                                        @click="previewPhoto(uploadList,index)">
                                        <img class="signImage"
                                            :src="item.path|getSignImage(mainDataFiles)"
                                            alt=""
                                            v-if="isPictureFile(item.fileType)">
                                        <upload-cell :type="item.fileType"
                                            v-else></upload-cell>
                                        <p>{{item.name}}</p>
                                    </div>
                                </el-tooltip>
                                <i class="iconfont icon-tubiao-6"
                                    v-if="(detailData.signingState&&detailData.signingState.value!==1&&detailData.signingState.value!==0)||!detailData.signingState"
                                    @click="ZTdelectData(index)"
                                    :class="{'deleteShow': power['sign-ht-xq-main-add'].state&&isDelete===item.index+item.path}"></i>
                            </li>
                        </ul>
                        <el-button type="primary"
                            round
                            class="search_btn"
                            @click="saveFile('main')"
                            v-if="power['sign-ht-xq-main-add'].state&&((detailData.signingState&&detailData.signingState.value!==1&&detailData.signingState.value!==0)||!detailData.signingState)&&(detailData.contState.value>1||(detailData.recordType.value===2&&detailData.contState.value!=0))">确认上传</el-button>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="资料库"
                    name="third"
                    class="third-tab"
                    v-if="power['sign-ht-xq-data'].state">
                    <div class="dataBank"
                        v-if="power['sign-ht-xq-data'].state"
                        :style="{ height: clientHeight() }">
                        <!-- 业主 -->
                        <div class="classify"
                            v-if="this.sellerList.length>0">
                            <div class="small-col"
                                v-for="(item,index) in sellerList"
                                :key="index"
                                v-if="item.value.length>0||((detailData.signingState&&detailData.signingState.value!==1&&detailData.signingState.value!==0)||!detailData.signingState)">
                                <div class="ht-title"
                                    v-if="index===0">业主</div>
                                <p class="small-title"><i v-if="item.isrequire">*</i>{{item.title}}</p>
                                <ul class="ulData">
                                    <li v-show="(detailData.signingState&&detailData.signingState.value!==1&&detailData.signingState.value!==0)||!detailData.signingState">
                                        <file-up class="uploadSubject"
                                            :id="'seller'+index"
                                            @getUrl="addSubject"
                                            :scane="scaneData">
                                            <i class="iconfont icon-shangchuan"></i>
                                            <p>点击上传</p>
                                        </file-up>
                                    </li>
                                    <li v-for="(item_,index_) in item.value"
                                        :key="item_.index"
                                        @mouseover="moveIn(item.title+item_.path)"
                                        @mouseout="moveOut(item.title+item_.path)">
                                        <el-tooltip class="item"
                                            effect="dark"
                                            :content="item_.name"
                                            placement="bottom">
                                            <div class="namePath"
                                                @click="previewPhoto(item.value,index_)">
                                                <img class="signImage"
                                                    :src="item_.path|getSignImage(contDataFiles)"
                                                    alt=""
                                                    v-if="isPictureFile(item_.fileType)">
                                                <upload-cell :type="item_.fileType"
                                                    v-else></upload-cell>
                                                <p>{{item_.name}}</p>
                                            </div>
                                        </el-tooltip>
                                        <i v-if="(detailData.signingState&&detailData.signingState.value!==1&&detailData.signingState.value!==0)||!detailData.signingState"
                                            class="iconfont icon-tubiao-6"
                                            @click="delectData(index,index_,'seller')"
                                            :class="{'deleteShow':power['sign-ht-xq-data'].state&&isDelete===item.title+item_.path}"></i>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!-- 客户 -->
                        <div class="classify"
                            v-if="this.buyerList.length>0">
                            <div class="small-col"
                                v-for="(item,index) in buyerList"
                                :key="index"
                                v-if="item.value.length>0||((detailData.signingState&&detailData.signingState.value!==1&&detailData.signingState.value!==0)||!detailData.signingState)">
                                <div class="ht-title"
                                    v-if="index===0">客户</div>
                                <p class="small-title"><i v-if="item.isrequire">*</i>{{item.title}}</p>
                                <ul class="ulData">
                                    <li v-show="(detailData.signingState&&detailData.signingState.value!==1&&detailData.signingState.value!==0)||!detailData.signingState">
                                        <file-up class="uploadSubject"
                                            :id="'buyer'+index"
                                            @getUrl="addSubject"
                                            :scane="scaneData">
                                            <i class="iconfont icon-shangchuan"></i>
                                            <p>点击上传</p>
                                        </file-up>
                                    </li>
                                    <li v-for="(item_,index_) in item.value"
                                        :key="item_.index"
                                        @mouseover="moveIn(item.title+item_.path)"
                                        @mouseout="moveOut(item.title+item_.path)">
                                        <el-tooltip class="item"
                                            effect="dark"
                                            :content="item_.name"
                                            placement="bottom">
                                            <div class="namePath"
                                                @click="previewPhoto(item.value,index_)">
                                                <img class="signImage"
                                                    :src="item_.path|getSignImage(contDataFiles)"
                                                    alt=""
                                                    v-if="isPictureFile(item_.fileType)">
                                                <upload-cell :type="item_.fileType"
                                                    v-else></upload-cell>
                                                <p>{{item_.name}}</p>
                                            </div>
                                        </el-tooltip>
                                        <i v-if="(detailData.signingState&&detailData.signingState.value!==1&&detailData.signingState.value!==0)||!detailData.signingState"
                                            class="iconfont icon-tubiao-6"
                                            @click="delectData(index,index_,'buyer')"
                                            :class="{'deleteShow':power['sign-ht-xq-data'].state&&isDelete===item.title+item_.path}"></i>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!-- 其他 -->
                        <div class="classify"
                            v-if="otherList.length>0">
                            <div class="small-col"
                                v-for="(item,index) in otherList"
                                :key="index"
                                v-if="item.value.length>0||((detailData.signingState&&detailData.signingState.value!==1&&detailData.signingState.value!==0)||!detailData.signingState)">
                                <div class="ht-title"
                                    v-if="index===0">其他</div>
                                <p class="small-title"><i v-if="item.isrequire">*</i>{{item.title}}</p>
                                <ul class="ulData">
                                    <li v-show="(detailData.signingState&&detailData.signingState.value!==1&&detailData.signingState.value!==0)||!detailData.signingState">
                                        <file-up class="uploadSubject"
                                            :id="'other'+index"
                                            @getUrl="addSubject"
                                            :scane="scaneData">
                                            <i class="iconfont icon-shangchuan"></i>
                                            <p>点击上传</p>
                                        </file-up>
                                    </li>
                                    <li v-for="(item_,index_) in item.value"
                                        :key="item_.index"
                                        @mouseover="moveIn(item.title+item_.path)"
                                        @mouseout="moveOut(item.title+item_.path)">
                                        <el-tooltip class="item"
                                            effect="dark"
                                            :content="item_.name"
                                            placement="bottom">
                                            <div class="namePath"
                                                @click="previewPhoto(item.value,index_)">
                                                <img class="signImage"
                                                    :src="item_.path|getSignImage(contDataFiles)"
                                                    alt=""
                                                    v-if="isPictureFile(item_.fileType)">
                                                <upload-cell :type="item_.fileType"
                                                    v-else></upload-cell>
                                                <p>{{item_.name}}</p>
                                            </div>
                                        </el-tooltip>
                                        <i v-if="(detailData.signingState&&detailData.signingState.value!==1&&detailData.signingState.value!==0)||!detailData.signingState"
                                            class="iconfont icon-tubiao-6"
                                            @click="delectData(index,index_,'other')"
                                            :class="{'deleteShow':power['sign-ht-xq-data'].state&&isDelete===item.title+item_.path}"></i>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="审核记录"
                    name="fourth">
                    <div class="firstDetail"
                        :style="{ height: clientHei }">
                        <!-- 合同审核记录 -->
                        <div class="receiptModule"
                            v-if="power['sign-com-htdetail'].state&&detailData.recordType.value!=2">
                            <div class="moduleTitle">
                                <span>合同审核</span>
                            </div>
                            <div class="receiptList">
                                <el-table :data="checkData"
                                    border
                                    style="width: 100%"
                                    header-row-class-name="theader-bg">
                                    <el-table-column label="时间">
                                        <template slot-scope="scope">
                                            {{scope.row.auditTime|formatTime}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="userName"
                                        label="姓名">
                                    </el-table-column>
                                    <el-table-column prop="roleName"
                                        label="职务">
                                    </el-table-column>
                                    <el-table-column prop="operate"
                                        label="操作">
                                    </el-table-column>
                                    <el-table-column label="备注"
                                        width="320">
                                        <template slot-scope="scope">
                                            <el-popover trigger="hover"
                                                placement="top"
                                                v-if="scope.row.auditInfo!='-'&&scope.row.auditInfo">
                                                <div style="width:300px">
                                                    {{scope.row.auditInfo}}
                                                </div>
                                                <div slot="reference"
                                                    class="name-wrapper">
                                                    {{scope.row.auditInfo}}
                                                </div>
                                            </el-popover>
                                            <span v-else>-</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                        <!-- 合同签后审核记录 -->
                        <div class="receiptModule"
                            v-if="power['sign-com-htdetail'].state">
                            <div class="moduleTitle">
                                <span>合同签后审核</span>
                            </div>
                            <div class="receiptList">
                                <el-table :data="QHcheckData"
                                    border
                                    style="width: 100%"
                                    header-row-class-name="theader-bg">
                                    <el-table-column label="时间">
                                        <template slot-scope="scope">
                                            {{scope.row.auditTime|formatTime}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="userName"
                                        label="姓名">
                                    </el-table-column>
                                    <el-table-column prop="roleName"
                                        label="职务">
                                    </el-table-column>
                                    <el-table-column prop="operate"
                                        label="操作">
                                    </el-table-column>
                                    <el-table-column label="备注"
                                        width="320">
                                        <template slot-scope="scope">
                                            <el-popover trigger="hover"
                                                placement="top"
                                                v-if="scope.row.auditInfo!='-'&&scope.row.auditInfo">
                                                <div style="width:300px">
                                                    {{scope.row.auditInfo}}
                                                </div>
                                                <div slot="reference"
                                                    class="name-wrapper">
                                                    {{scope.row.auditInfo}}
                                                </div>
                                            </el-popover>
                                            <span v-else>-</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                        <!-- 合同变更审核记录 -->
                        <div class="receiptModule"
                            v-if="power['sign-com-htdetail'].state">
                            <div class="moduleTitle">
                                <span>合同变更审核</span>
                            </div>
                            <div class="receiptList">
                                <el-table :data="BGcheckData"
                                    border
                                    style="width: 100%"
                                    header-row-class-name="theader-bg">
                                    <el-table-column label="时间">
                                        <template slot-scope="scope">
                                            {{scope.row.auditTime|formatTime}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="userName"
                                        label="姓名">
                                    </el-table-column>
                                    <el-table-column prop="roleName"
                                        label="职务">
                                    </el-table-column>
                                    <el-table-column prop="operate"
                                        label="操作">
                                    </el-table-column>
                                    <el-table-column label="备注"
                                        width="320">
                                        <template slot-scope="scope">
                                            <el-popover trigger="hover"
                                                placement="top"
                                                v-if="scope.row.auditInfo!='-'&&scope.row.auditInfo">
                                                <div style="width:300px">
                                                    {{scope.row.auditInfo}}
                                                </div>
                                                <div slot="reference"
                                                    class="name-wrapper">
                                                    {{scope.row.auditInfo}}
                                                </div>
                                            </el-popover>
                                            <span v-else>-</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                        <!-- 合同解约审核记录 -->
                        <div class="receiptModule"
                            v-if="power['sign-com-htdetail'].state">
                            <div class="moduleTitle">
                                <span>合同解约审核</span>
                            </div>
                            <div class="receiptList">
                                <el-table :data="JYcheckData"
                                    border
                                    style="width: 100%"
                                    header-row-class-name="theader-bg">
                                    <el-table-column label="时间">
                                        <template slot-scope="scope">
                                            {{scope.row.auditTime|formatTime}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="userName"
                                        label="姓名">
                                    </el-table-column>
                                    <el-table-column prop="roleName"
                                        label="职务">
                                    </el-table-column>
                                    <el-table-column prop="operate"
                                        label="操作">
                                    </el-table-column>
                                    <el-table-column label="备注"
                                        width="320">
                                        <template slot-scope="scope">
                                            <el-popover trigger="hover"
                                                placement="top"
                                                v-if="scope.row.auditInfo!='-'&&scope.row.auditInfo">
                                                <div style="width:300px">
                                                    {{scope.row.auditInfo}}
                                                </div>
                                                <div slot="reference"
                                                    class="name-wrapper">
                                                    {{scope.row.auditInfo}}
                                                </div>
                                            </el-popover>
                                            <span v-else>-</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 上传按钮 -->
        <div class="uploadBtn">
            <el-button type="primary"
                round
                class="search_btn"
                @click="uploading('上传成功')"
                v-if="power['sign-ht-xq-data'].state&&name==='third'&&((detailData.signingState&&detailData.signingState.value!==1&&detailData.signingState.value!==0)||!detailData.signingState)">{{detailData.laterStageState.value===4?'提交审核':'确认上传'}}</el-button> <!-- 合同资料库上传 -->
        </div>
        <!-- 图片放大 -->
        <preview :imgList="previewFiles"
            :start="previewIndex"
            v-if="preview"
            @close="preview=false"></preview>
        <!-- 变更/解约编辑弹窗 -->
        <changeCancel :dialogType="canceldialogType"
            :cancelDialog="changeCancel_"
            :cityCode="detailData.cityCode"
            :contId="changeCancelId"
            :commission="commission"
            :code="detailData.code"
            :dialogContType="2"
            @close="changeCancelDialog"
            @success="freshChangeCancel"
            v-if="changeCancel_"></changeCancel>
        <!-- 设置/转交审核人 -->
        <checkPerson :show="checkPerson.state"
            :type="checkPerson.type"
            :showLabel="checkPerson.label"
            :bizCode="checkPerson.code"
            :flowType="checkPerson.flowType"
            @close="closeCheckPerson"
            @submit="closeCheckPerson"
            v-if="checkPerson.state"></checkPerson>
        <!-- 提审弹窗 -->
        <el-dialog title="提示"
            :visible.sync="isSubmitAudit"
            width="460px">
            <span>确定提审？</span>
            <span slot="footer"
                class="dialog-footer">
                <el-button @click="isSubmitAudit = false">取 消</el-button>
                <el-button type="primary"
                    @click="submitAudit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 合同撤单弹窗 -->
        <el-dialog title="合同撤单"
            :visible.sync="dialogInvalid"
            width="400px"
            :closeOnClickModal="$tool.closeOnClickModal">
            <div class="top">
                <p class="invalid">是否确认撤单！</p>
            </div>
            <span slot="footer"
                class="dialog-footer">
                <el-button round
                    @click="dialogInvalid = false">取消</el-button>
                <el-button round
                    type="primary"
                    @click="setInvalid">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { TOOL } from "@/assets/js/common";
import { MIXINS } from "@/assets/js/mixins";
import changeCancel from "../contractDialog/changeCancel";
import checkPerson from "@/components/checkPerson";
// import {FILTER} from "@/assets/js/filter";
export default {
    mixins: [MIXINS],
    components: {
        changeCancel,
        checkPerson
    },
    data() {
        return {
            userMsg: {}, //当前登录人信息
            clientHei: document.documentElement.clientHeight, //窗体高度
            activeName: "first",
            name: "first",
            dialogImageUrl: "",
            dialogVisible: false,
            contState: "",
            code: "",
            scaneZhuti: {
                path: "zhuti",
                id: this.code
            },
            scaneData: {
                path: "ziliaoku",
                id: this.code
            },

            detailData: {
                // code:'',
                signDate: "",
                subscriptionTerm: "",
                contType: {
                    label: "",
                    value: ""
                },
                houseInfo: {},
                guestInfo: {},
                contPersons: [
                    {
                        name: "",
                        mobile: "",
                        identifyCode: "",
                        personType: {
                            label: "",
                            value: ""
                        }
                    }
                ]
            },
            ownerInfo: [
                {
                    name: "",
                    mobile: "",
                    identifyCode: ""
                }
            ],
            custInfo: [
                {
                    name: "",
                    mobile: "",
                    identifyCode: ""
                }
            ],
            //客户类型
            buyerList: [],
            //业主类型
            sellerList: [],
            //其他类型
            otherList: [],
            //主体合同
            uploadList: [],
            contDataFiles: [], //资料库图片缩略图
            mainDataFiles: [], //合同主体图片缩略图
            isDelete: "",
            //变更解约
            changeCancel_: false,
            canceldialogType: "",
            changeCancelId: "",
            commission: "",
            //审核记录
            checkData: [],
            QHcheckData: [],
            BGcheckData: [],
            JYcheckData: [],
            isSubmitAudit: false, //提审
            checkPerson: {
                state: false,
                type: 1,
                code: "",
                flowType: 3,
                label: false
            },
            dialogInvalid: false, //撤单
            //权限
            power: {
                "sign-com-htdetail": {
                    state: false,
                    name: "合同详情"
                },
                "sign-ht-info-view": {
                    state: false,
                    name: "预览"
                },
                "sign-ht-xq-main-add": {
                    state: false,
                    name: "编辑合同主体"
                },
                "sign-ht-xq-data": {
                    state: false,
                    name: "编辑资料库"
                },
                "sign-ht-info-edit": {
                    state: false,
                    name: "编辑"
                },
                "sign-ht-info-addoffline": {
                    state: false,
                    name: "创建线下合同"
                },
                "sign-ht-xq-cancel": {
                    state: false,
                    name: "解约"
                },
                "sign-ht-xq-modify": {
                    state: false,
                    name: "变更"
                },
                "sign-ht-view-toverify": {
                    state: false,
                    name: "提交审核"
                },
                "sign-ht-xq-void": {
                    state: false,
                    name: "撤单"
                }
            }
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.setPath(
                vm.$tool.getRouter(
                    ["二手房", "合同", "合同列表", "合同详情"],
                    "contractList"
                )
            );
        });
    },

    methods: {
        // if(res.data.data.isHaveData ==1){ //判断有无上传过资料库，有的话返回上传过的信息
        // 				this.getContData()
        // 			}
        // 			if(this.contState===3){
        // 				this.getContractBody();//获取合同主体
        // 			}
        handleClick(tab, event) {
            this.name = tab.name;
            if (tab.name === "second") {
                if (
                    this.detailData.contState.value < 2 &&
                    this.detailData.recordType.value === 1
                ) {
                    this.$message({
                        message: "合同未签章,不允许上传合同主体",
                        type: "warning"
                    });
                }
                if (this.contState === 3) {
                    this.getContractBody(); //获取合同主体
                }
            } else if (tab.name === "third") {
                if (this.detailData.isHaveData == 1) {
                    //判断有无上传过资料库，有的话返回上传过的信息
                    this.getContData();
                }
            } else if (tab.name === "fourth") {
                this.getAuditList(); //合同审核
                this.getAuditList(9); //变更审核
                this.getAuditList(10); //解约审核
                this.getAuditList(12); //签后
            }
        },

        // 控制弹框body内容高度，超过显示滚动条
        clientHeight() {
            return this.clientHei - 250 + "px";
        },

        //预览事件
        onPreview() {
            this.setPath(
                this.$tool.getRouter(
                    ["二手房", "合同", "合同列表", "合同预览"],
                    "contractList"
                )
            );
            this.$router.push({
                path: "/contractPreview",
                query: {
                    id: this.$route.query.id,
                    isentrust: 0
                }
            });
        },

        //编辑事件
        onEdit(e) {
            this.setPath(
                this.$tool.getRouter(
                    ["二手房", "合同", "合同列表", "合同编辑"],
                    "contractList"
                )
            );
            //合同锁定
            if (
                (this.detailData.contState.value === 1 &&
                    this.detailData.toExamineState.value === 0) ||
                this.detailData.contState.value === 2
            ) {
                let param = {
                    id: this.detailData.id
                };
                this.$ajax.put("/api/contract/lock", param, 2).then(res => {});
            }
            this.$router.push({
                path: "/newIntention",
                query: {
                    contType: e.value,
                    id: this.$route.query.id,
                    operateType: 2,
                    formDetail: true,
                    recordType: this.detailData.recordType.value
                }
            });
        },

        //合同资料库添加数据到每种类型
        addSubject(data) {
            let arr = data.param;
            let num = Number(data.btnId.substring(data.btnId.length - 1));
            let typeId = data.btnId.substring(0, data.btnId.length - 1);
            arr.forEach(element => {
                let fileType = this.$tool.get_suffix(element.name);
                element.fileType = fileType;
            });
            if (typeId === "seller") {
                this.sellerList[num].value = this.sellerList[num].value.concat(
                    arr
                );
            } else if (typeId === "buyer") {
                this.buyerList[num].value = this.buyerList[num].value.concat(
                    arr
                );
            } else if (typeId === "other") {
                this.otherList[num].value = this.otherList[num].value.concat(
                    arr
                );
            }
            let preloadList = [];
            arr.forEach((item, index) => {
                //判断附件是否为图片，是则存入临时数组获取签名用于缩略图展示
                if (this.isPictureFile(item.fileType)) {
                    preloadList.push(item.path);
                }
            });
            this.fileSign(preloadList, "preload").then(res => {
                this.contDataFiles = this.contDataFiles.concat(res);
            });
        },

        //获取合同资料库信息

        //获取合同资料库类型
        getContDataType() {
            let param = {
                id: this.$route.query.id
            };
            this.$ajax
                .get("/api/contract/getContDataTypeById", param)
                .then(res => {
                    res = res.data;
                    if (res.status === 200) {
                        let dataType = JSON.parse(res.data);
                        dataType.forEach(element => {
                            if (element.type === "1") {
                                let item = {};
                                item.value = [];
                                item.kind = element.type;
                                item.title = element.name;
                                item.isrequire = element.isNecessary;
                                this.buyerList.push(item);
                            } else if (element.type === "2") {
                                let item = {};
                                item.value = [];
                                item.kind = element.type;
                                item.title = element.name;
                                item.isrequire = element.isNecessary;
                                this.sellerList.push(item);
                            } else if (element.type === "3") {
                                let item = {};
                                item.value = [];
                                item.kind = element.type;
                                item.title = element.name;
                                item.isrequire = element.isNecessary;
                                this.otherList.push(item);
                            }
                        });
                    }
                })
                .catch(error => {
                    this.$message({
                        message: error
                    });
                });
        },

        //获取资料库信息之后

        getContData() {
            let param = {
                id: this.$route.query.id
            };
            this.$ajax
                .get("/api/contract/getContAttachmentById", param)
                .then(res => {
                    res = res.data;
                    if (res.status === 200) {
                        let pathList = [];
                        let address = JSON.parse(res.data.address);
                        address.forEach(element => {
                            element.value.forEach(item => {
                                let fileType = this.$tool.get_suffix(item.name);
                                item.fileType = fileType;
                                pathList.push(item);
                            });
                            if (element.kind === "1") {
                                this.buyerList.forEach(ele => {
                                    if (element.title === ele.title) {
                                        ele.value = element.value;
                                    }
                                });
                            } else if (element.kind === "2") {
                                this.sellerList.forEach(ele => {
                                    if (element.title === ele.title) {
                                        ele.value = element.value;
                                    }
                                });
                            } else if (element.kind === "3") {
                                this.otherList.forEach(ele => {
                                    if (element.title === ele.title) {
                                        ele.value = element.value;
                                    }
                                });
                            }
                        });
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
                });
        },

        //上传资料库
        uploading(msg) {
            let uploadContData = this.sellerList.concat(
                this.buyerList,
                this.otherList
            );
            console.log(uploadContData);
            let isOk;
            let arr_ = [];
            for (let i = 0; i < uploadContData.length; i++) {
                isOk = false;
                if (
                    uploadContData[i].isrequire &&
                    uploadContData[i].value.length === 0
                ) {
                    this.$message({
                        message: `${uploadContData[i].title}不能为空`,
                        type: "warning"
                    });
                    break;
                } else if (
                    uploadContData[i].isrequire &&
                    uploadContData[i].value.length > 0
                ) {
                    arr_.push(uploadContData[i]);
                    isOk = true;
                } else if (
                    !uploadContData[i].isrequire &&
                    uploadContData[i].value.length > 0
                ) {
                    arr_.push(uploadContData[i]);
                    isOk = true;
                } else {
                    isOk = true;
                }
            }
            if (isOk) {
                let param = {
                    datas: arr_,
                    contId: this.$route.query.id
                };
                this.$ajax
                    .postJSON("/api/contract/uploadContData", param)
                    .then(res => {
                        res = res.data;
                        if (res.status === 200) {
                            this.$message({
                                message: msg,
                                type: "success"
                            });
                            // this.getContData();
                            this.getDetail();
                        }
                    })
                    .catch(error => {
                        this.$message({
                            message: error
                        });
                    });
            }
        },

        delectData(index, index_, type) {
            if (this.detailData.isHaveData) {
                if (type === "seller") {
                    if (this.sellerList[index].isrequire) {
                        if (this.sellerList[index].value.length > 1) {
                            this.sellerList[index].value.splice(index_, 1);
                            this.uploading("删除成功");
                        } else {
                            this.$message({
                                message: "至少保留一个，请勿删除",
                                type: "warning"
                            });
                        }
                    } else {
                        this.sellerList[index].value.splice(index_, 1);
                        this.uploading("删除成功");
                    }
                } else if (type === "buyer") {
                    if (this.buyerList[index].isrequire) {
                        if (this.buyerList[index].value.length > 1) {
                            this.buyerList[index].value.splice(index_, 1);
                            this.uploading("删除成功");
                        } else {
                            this.$message({
                                message: "至少保留一个，请勿删除",
                                type: "warning"
                            });
                        }
                    } else {
                        this.buyerList[index].value.splice(index_, 1);
                        this.uploading("删除成功");
                    }
                } else if (type === "other") {
                    if (this.otherList[index].isrequire) {
                        if (this.otherList[index].value.length > 1) {
                            this.otherList[index].value.splice(index_, 1);
                            this.uploading("删除成功");
                        } else {
                            this.$message({
                                message: "至少保留一个，请勿删除",
                                type: "warning"
                            });
                        }
                    } else {
                        this.otherList[index].value.splice(index_, 1);
                        this.uploading("删除成功");
                    }
                }
            } else {
                if (type === "seller") {
                    this.sellerList[index].value.splice(index_, 1);
                } else if (type === "buyer") {
                    this.buyerList[index].value.splice(index_, 1);
                } else if (type === "other") {
                    this.otherList[index].value.splice(index_, 1);
                }
            }
        },

        //获取合同主体信息（已上传后，拿到返回的文件路径）
        getContractBody() {
            let param = {
                id: this.$route.query.id
            };
            this.$ajax
                .get("/api/contract/getContractBodyById", param)
                .then(res => {
                    res = res.data;
                    if (res.status === 200) {
                        let uploadList_ = res.data;
                        uploadList_.forEach(element => {
                            let fileType = this.$tool.get_suffix(element.name);
                            element.fileType = fileType;
                        });
                        this.uploadList = uploadList_;
                        let preloadList = [];
                        uploadList_.forEach((item, index) => {
                            //判断附件是否为图片，是则存入临时数组获取签名用于缩略图展示
                            if (this.isPictureFile(item.fileType)) {
                                preloadList.push(item.path);
                            }
                        });
                        this.fileSign(preloadList, "preload").then(res => {
                            if (param.isentrust) {
                                this.entrustMainFiles = res;
                            } else {
                                this.mainDataFiles = res;
                            }
                        });
                    }
                })
                .catch(error => {
                    this.$message({
                        message: error
                    });
                });
        },

        //合同主体获取文件路径后缀名
        uploadSubject(data) {
            let arr = data.param;
            arr.forEach(element => {
                let fileType = this.$tool.get_suffix(element.name);
                element.fileType = fileType;
            });
            this.uploadList = this.uploadList.concat(arr);
            let preloadList = [];
            arr.forEach((item, index) => {
                //判断附件是否为图片，是则存入临时数组获取签名用于缩略图展示
                if (this.isPictureFile(item.fileType)) {
                    preloadList.push(item.path);
                }
            });
            this.fileSign(preloadList, "preload").then(res => {
                this.mainDataFiles = this.mainDataFiles.concat(res);
            });
        },

        //合同主体的删除
        ZTdelectData(index) {
            // this.uploadList.splice(index,1)
            if (this.detailData.contState.value === 3) {
                if (this.uploadList.length > 1) {
                    this.uploadList.splice(index, 1);
                    let param = {
                        contId: this.$route.query.id,
                        datas: this.uploadList
                    };
                    this.$ajax
                        .postJSON("/api/contract/uploadContBody", param)
                        .then(res => {
                            res = res.data;
                            if (res.status === 200) {
                                this.$message({
                                    message: "删除成功",
                                    type: "success"
                                });
                            }
                        });
                } else {
                    this.$message({
                        message: "至少保留一个，请勿删除",
                        type: "warning"
                    });
                }
            } else {
                this.uploadList.splice(index, 1);
            }
        },
        //合同主体上传文件
        saveFile() {
            if (this.uploadList.length > 0) {
                this.uploadList.forEach(element => {
                    delete element.fileType;
                });
                let param = {
                    contId: this.$route.query.id,
                    datas: this.uploadList
                }
                this.$ajax.postJSON("/api/contract/uploadContBody", param).then(res => {
                        if (res.data.status === 200) {
                            this.getContractBody();
                            this.getDetail();
                            this.$message({
                                message: "上传成功",
                                type: "success"
                            });
                        } else if (res.data.status === 500) {
                            this.$message.error(res.data.message);
                        }
                    })
                    .catch(error => {
                        this.$message({
                            message: error
                        });
                    });
            } else {
                this.$message({
                    message: "请选合同主体"
                });
            }
        },

        //显示删除按钮
        moveIn(value) {
            this.isDelete = value;
        },
        moveOut(value) {
            if (this.isDelete === value) {
                this.isDelete = "";
            }
        },

        // 查询
        getDetail() {
            let param = {
                id: this.$route.query.id
            };
            //根据合同ID查询详细信息
            this.$ajax
                .get("/api/contract/detail", param)
                .then(res => {
                    if (res.data.status === 200) {
                        this.detailData = res.data.data;
                        this.code = res.data.data.code;
                        this.contState = res.data.data.contState.value;
                        //变更解约佣金
                        this.commission = {
                            owner: this.detailData.ownerCommission,
                            user: this.detailData.custCommission
                        };
                        var contperson = this.detailData.contPersons;
                        if (contperson.length > 0) {
                            for (let i = 0; i < contperson.length; i++) {
                                if (contperson[i].personType.value == 1) {
                                    this.ownerInfo.unshift(contperson[i]);
                                } else if (
                                    contperson[i].personType.value == 2
                                ) {
                                    this.custInfo.unshift(contperson[i]);
                                }
                            }
                        }
                    }
                })
                .catch(error => {
                    this.$message({
                        message: error
                    });
                });
        },
        // 变更解约弹窗
        goChangeCancel(value) {
            this.changeCancelId = Number(this.detailData.id);
            if (value === 1) {
                this.canceldialogType = "bg";
                this.changeCancel_ = true;
            } else if (value === 2) {
                this.canceldialogType = "jy";
                this.changeCancel_ = true;
            }
        },
        // 关闭变更解约弹窗
        changeCancelDialog() {
            this.changeCancel_ = false;
            this.getDetail();
        },
        freshChangeCancel() {
            this.changeCancel_ = false;
            this.getDetail();
        },
        //合同审核信息
        getAuditList(type = 3) {
            let param = {
                flowType: type,
                bizCode: this.code
            };
            if (type === 12) {
                param.bizCode = this.detailData.signingId;
            }
            if (!param.bizCode) {
                return;
            }
            this.$ajax.get("/api/machine/getAuditList", param).then(res => {
                res = res.data;
                if (res.status === 200) {
                    if (type === 3) {
                        this.checkData = res.data.data;
                    } else if (type === 9) {
                        this.BGcheckData = res.data.data;
                    } else if (type === 10) {
                        this.JYcheckData = res.data.data;
                    } else if (type === 12) {
                        this.QHcheckData = res.data.data;
                    }
                }
            });
        },
        //提审
        submitAudit() {
            let param = {
                cityId: this.detailData.cityCode,
                flowType: 3,
                bizCode: this.code,
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
                        this.getDetail();
                    } else {
                        this.$message({
                            message: res.message
                        });
                    }
                })
                .catch(error => {
                    if (error.message === "下一节点审批人不存在") {
                        this.isSubmitAudit = false;
                        this.checkPerson.code = this.code;
                        this.checkPerson.state = true;
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
        //关闭设置审核人弹窗
        closeCheckPerson() {
            this.checkPerson.state = false;
        },
        //合同撤单弹窗
        invalid() {
            this.dialogInvalid = true;
        },
        setInvalid() {
            let param = {
                id: this.$route.query.id
            };
            this.$ajax
                .post("/api/contract/invalid", param)
                .then(res => {
                    res = res.data;
                    if (res.status === 200) {
                        this.getDetail();
                        this.dialogInvalid = false;
                        this.$message({
                            message: "操作成功",
                            type: "success"
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

    filters: {
        getDate(val) {
            return TOOL.timeFormat(val);
        },

        subStrFn(val) {
            return val.substr(0, 10);
        },

        nullData(val) {
            return TOOL.nullFormat(val);
        },

        moneyFormat: function(val) {
            if (!val) {
                return "零";
            } else {
                return TOOL.toChineseNumber(val);
            }
        },
        /**
         * 过滤显示图片缩略图
         * @param val后端返回的所有文件资源遍历的当前项
         * @param list图片资源获取签名后的临时数组
         */
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

    created() {
        this.getDetail(); //合同详细信息
        this.getAdmin(); //获取当前登录人信息
        this.getContDataType(); //获取资料库里的资料类型
        if (this.$route.query.type === "dataBank") {
            this.activeName = "third";
            this.name = "third";
        } else if (this.$route.query.type === "contBody") {
            this.activeName = "second";
            this.name = "second";
        }
    },

    mounted() {
        var _this = this;
        window.onresize = function() {
            _this.clientHei = document.documentElement.clientHeight;
        };
    },
    computed: {
        //非业务人员的判断
        getUserMsg() {
            return this.getUser.isBusiness;
        }
    }
};
</script>

<style lang="less" scoped>
@import "~@/assets/common.less";
.view-container {
    position: relative;
    min-height: 100%;
    padding-left: 20px;
    background: @bg-white;
    font-size: 14px;
    .uploadBtn {
        position: absolute;
        left: 40px;
        bottom: 20px;
        z-index: 999;
    }
    /deep/.el-textarea.is-disabled .el-textarea__inner {
        color: #233241;
    }
    /deep/.el-tabs__item {
        height: 50px;
        line-height: 50px;
        font-size: 16px;
    }
    /deep/.el-tabs__active-bar {
        height: 2px;
    }
    // .el-tabs__nav-scroll{
    // 	padding: 0 30px;
    // }

    .deleteShow {
        display: block !important;
    }

    .detailbox {
        border-radius: 4px;
        height: 100%;
        position: relative;
        .functionTable {
            position: absolute;
            right: 0;
            top: 20px;
            padding-right: 20px;
            .el-button.is-round {
                padding: 10px 20px;
            }
        }
        .el-tabs--top {
            height: 100%;
            .el-tabs__content {
                height: 100%;
                overflow-y: auto;
            }
        }
        .tab {
            padding: 10px 30px 30px 0;
            overflow-y: auto;
            .textbox {
                display: flex;
                margin-bottom: 20px;
                span {
                    color: #6c7986;
                    font-size: 14px;
                    width: 70px;
                    white-space: nowrap;
                }
                .el-textarea {
                    width: 650px;
                    height: 80px;
                    margin-left: 15px;
                }
                /deep/.el-textarea.is-disabled .el-textarea__inner {
                    height: 80px;
                }
            }
            .ul1 {
                display: flex;
                align-items: top;
                clear: both;
                border-bottom: 1px solid #edecf0;
                margin: 10px 0 30px 0;
                padding-bottom: 10px;
            }
            ul {
                li {
                    margin-right: 100px;
                    div {
                        font-size: 14px;
                        margin-bottom: 20px;
                        color: #233241;
                        span {
                            color: #6c7986;
                        }
                        em.blue {
                            color: #478de3;
                            font-weight: 700;
                        }
                    }
                }
                li.tabs-title {
                    color: #233241;
                    font-size: 14px;
                    font-weight: bold;
                    margin-right: 30px;
                }
                &.ul2 {
                    display: block;
                    overflow: hidden;
                    border-bottom: 1px solid #edecf0;
                    margin: 10px 0 30px 0;
                    padding-bottom: 10px;
                    .ul3 {
                        float: left;
                        overflow: hidden;
                        border-bottom: none;
                        li {
                            margin-right: 0;
                            overflow: hidden;
                            clear: both;
                            display: flex;
                            span.yellow {
                                color: #ff9039;
                            }
                            span.mr12 {
                                margin-right: 12px;
                            }
                            .div1 {
                                width: 210px;
                            }
                            .div2 {
                                width: 200px;
                            }
                            .div3 {
                                width: 200px;
                            }
                        }
                    }

                    li.tabs-title {
                        margin-right: 30px;
                        margin-bottom: 20px;
                        float: left;
                    }
                }
            }
        }
        /deep/.el-tabs {
            .el-tabs__header {
                margin-bottom: 0;
            }
            .el-tabs__item {
                font-size: 18px;
                height: 50px;
                line-height: 50px;
            }
        }
        .footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 60px;
            p {
                color: @color-6c;
                display: inline-block;
                padding-right: 20px;
                font-size: 12px;
            }
            > div {
                &:last-of-type {
                    padding-right: 20px;
                    /deep/.el-button.is-round {
                        padding: 10px 20px;
                    }
                }
            }
        }

        .fixed {
            width: 100%;
        }
        .form-btn {
            overflow: hidden;
            border-top: 1px solid #edecf0;
            background-color: #fff;
            height: 80px;
            line-height: 80px;
            .btnbox {
                bottom: 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .btn1 {
                    background-color: #eaeff5;
                    color: #32485f;
                    border: 1px solid #eaeff5;
                }
                .btn2 {
                    background-color: #478de3;
                }
            }
            .fl {
                overflow: hidden;
                left: 20px;
                li {
                    &.first-child {
                        margin-left: 30px;
                    }
                    float: left;
                    margin-left: 20px;
                    font-size: 12px;
                    color: #6c7986;
                    span {
                        color: #32485f;
                    }
                }
            }
            .fr {
                right: 20px;
                .mr30 {
                    margin-right: 30px;
                }
            }
        }
        //合同主体
        .contractSubject {
            padding: 40px;
        }
        .classify {
            position: relative;
            .small-col {
                padding-left: 10px;
                padding-top: 30px;
                padding-bottom: 30px;
                border-bottom: 1px solid @border-ED;
                .ht-title {
                    font-size: 16px;
                    color: @color-324;
                    position: absolute;
                    top: 10px;
                    left: 5px;
                }
                .small-title {
                    font-size: 14px;
                    padding: 10px 0;
                    color: @color-6c;
                    > i {
                        color: @color-FF;
                    }
                }
            }
        }
        .ulData {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 20px;
            li {
                margin-right: 10px;
                position: relative;
                > i {
                    display: none;
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    color: #f56c6c;
                    font-size: 20px;
                    cursor: pointer;
                }
            }
        }
        .uploadSubject {
            display: inline-block;
            text-align: center;
            width: 120px;
            height: 120px;
            box-sizing: border-box;
            padding-top: 28px;
            border: 1px dashed #edecf0;
            border-radius: 1px;
            i {
                color: #eef2fb;
                font-size: 50px;
            }
            p {
                padding-top: 10px;
                color: #32485f;
                font-size: 12px;
            }
        }
        .namePath {
            display: inline-block;
            text-align: center;
            width: 120px;
            height: 120px;
            padding-top: 20px;
            box-sizing: border-box;
            border-radius: 4px;
            background: #f2f3f8;
            .signImage {
                width: 60px;
                height: 60px;
                margin: 1px 0;
            }
            > p {
                padding-top: 5px;
                display: inline-block;
                width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}
.firstDetail {
    overflow-y: auto;
}
.receiptModule {
    padding-top: 20px;
    width: 950px;
    .moduleTitle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
        span {
            border-left: 3px solid #409eff;
            padding-left: 5px;
        }
    }
    .receiptList {
        .receipBtn {
            color: #409eff;
            cursor: pointer;
            margin-right: 10px;
        }
    }
}
.contractDetailCode {
    position: absolute;
    left: 70px;
    top: 50%;
    transform: translateY(-50%);
    width: 130px;
    display: inline-block;
    box-sizing: border-box;
    color: @color-blue;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.dataBank {
    overflow-y: auto;
    // padding-top: 10px;
}
.ellipsisStyle{
    display: inline-block;
    width: 120px;
    color: #233241 !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: top
}
</style>


