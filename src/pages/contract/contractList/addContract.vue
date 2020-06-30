<template>
    <div class="view-container">
        <div v-if="contVersion===2">
            <el-form 
            :inline="true"
            :model="contractForm"
            class="add-form"
            size="small"
            :style="{ height: clientHei }">
                <!-- 合同信息 -->
                <div class="contractMsg">
                    <p>
                        合同信息
                        <span v-if="isDeal||contractForm.dealById" class="toCommission">
                            <span class="toCommissionStyle" @click="toCommission">
                                <span class="attention iconfont icon-tubiao-10" :class="{'attention_':isToCommission}"></span>是否转佣
                            </span>
                            <span>应收金额（元）：{{ys}}</span>
                            <span>已收金额（元）：{{ss}}</span>
                            <span>未收金额（元）：{{ws}}</span>
                            <span>已退金额（元）：{{yt}}</span>
                            <span v-if="isToCommission">转佣金额（元）：{{zy}}</span>
                        </span>
                    </p>
                    <div class="form-content">
                        <el-form-item 
                            label="签约时间："
                            style="text-align:right;width:285px;"
                            class="form-label">
                            <el-date-picker 
                                style="width:180px"
                                :disabled="type===2?true:false"
                                v-model="contractForm.signDate"
                                type="datetime"
                                format="yyyy-MM-dd HH:mm"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择日期时间"
                                :picker-options="pickerOptions"
                                default-time="12:00:00">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item 
                            label="合同类型："
                            class="width-250">
                            <el-input 
                                placeholder="请输入内容"
                                value="租赁"
                                :disabled="true"
                                style="width:140px"
                                v-if="contractForm.type===1">
                            </el-input>
                            <el-input 
                                placeholder="请输入内容"
                                :value="loanType===7?'全款买卖':loanType===8?'贷款买卖':'买卖'"
                                :disabled="true"
                                style="width:140px"
                                v-if="contractForm.type===2">
                            </el-input>
                            <el-input 
                                placeholder="请输入内容"
                                value="代办"
                                :disabled="true"
                                style="width:140px"
                                v-if="contractForm.type===3">
                            </el-input>
                            <el-input 
                                placeholder="请输入内容"
                                value="意向"
                                :disabled="true"
                                style="width:140px"
                                v-if="contractForm.type===4"></el-input>
                        </el-form-item>
                        <el-form-item 
                            label="纸质合同编号："
                            class="width-250 form-label"
                            style="width:340px;"
                            v-if="recordType===2">
                            <input 
                                style="width:200px;"
                                type="text"
                                :disabled="canInput"
                                maxlength="30"
                                v-model="contractForm.pCode"
                                @input="inputCode('pCode')"
                                placeholder="请输入"
                                class="dealPrice"
                                :class="{'disabled':canInput}">
                        </el-form-item>
                        <el-form-item 
                            label="预计过户时间："
                            style="text-align:right;width:280px;"
                            class="form-label"
                            v-if="showTransferTime&&(contractForm.type===2||contractForm.type===3)">
                            <el-date-picker 
                                style="width:140px"
                                v-model="contractForm.estTransferTime"
                                :disabled="canInput"
                                type="date"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期时间"
                                :picker-options="pickerOptionsLast"
                                default-time="12:00:00">
                            </el-date-picker>
                        </el-form-item>
                        <br>
                        <el-form-item 
                            label="客户佣金："
                            class="width-250">
                            <input 
                                type="text"
                                :disabled="canInput"
                                v-model="contractForm.custCommission"
                                @input="cutNumber('custCommission')"
                                @change="countTotal"
                                placeholder="请输入内容"
                                class="dealPrice"
                                :class="{'disabled':canInput}">
                            <i class="yuan">元</i>
                        </el-form-item>
                        <el-form-item 
                            label="业主佣金："
                            style="text-align:right;width:285px;">
                            <input 
                                type="text"
                                :disabled="canInput"
                                v-model="contractForm.ownerCommission"
                                @input="cutNumber('ownerCommission')"
                                @change="countTotal"
                                placeholder="请输入内容"
                                class="dealPrice"
                                :class="{'disabled':canInput}">
                            <i class="yuan">元</i>
                        </el-form-item>
                        <!-- <el-form-item 
                            label="佣金支付费："
                            style="text-align:right;width:280px;">
                            <input 
                                type="text"
                                :disabled="canInput"
                                v-model="contractForm.ownerCommission"
                                @input="cutNumber('ownerCommission')"
                                @change="countTotal"
                                placeholder="请输入内容"
                                class="dealPrice"
                                :class="{'disabled':canInput}">
                            <i class="hint iconfont icon-wenhao1" title="佣金成本支出"></i>
                        </el-form-item> -->
                        <el-form-item 
                            label="总佣金："
                            style="text-align:right;width:280px;">
                            <input 
                                placeholder="请输入内容"
                                :value="commissionTotal"
                                :disabled="true"
                                class="dealPrice disabled">
                            <i class="yuan">元</i>
                        </el-form-item>
                    </div>
                </div>
                <!-- 房源信息 -->
                <div class="houseMsg">
                    <p>房源信息</p>
                    <div class="form-content">
                        <el-form-item label="房源编号："
                            class="width-250"
                            :class="{'form-label':type===1}">
                            <span class="select"
                                @click="showDialog('house')"
                                v-if="sourceBtnCheck||canInput||!offLine||isDeal">{{contractForm.houseinfoCode?contractForm.houseinfoCode:'请选择房源'}}</span>
                            <span class="select_"
                                v-else>{{contractForm.houseinfoCode}}</span>
                        </el-form-item>
                        <el-form-item :label="contractForm.type===1?'租金：':'成交总价：'"
                            class="form-label width-250">
                            <input type="text"
                                :disabled="canInput"
                                v-model="contractForm.dealPrice"
                                @input="cutNumber('dealPrice')"
                                placeholder="请输入内容"
                                class="dealPrice"
                                :class="{'disabled':canInput}">
                            <i class="yuan"
                                v-if="contractForm.type!==1">元</i>
                        </el-form-item>
                        <el-form-item v-if="contractForm.type===1">
                            <el-select :disabled="canInput"
                                v-model="contractForm.timeUnit"
                                placeholder="请选择"
                                style="width:105px">
                                <el-option v-for="item in dictionary['507']"
                                    :key="item.key"
                                    :label="`元 / ${item.value}`"
                                    :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <span class="chineseNum">{{contractForm.dealPrice|moneyFormat}}</span>
                        </el-form-item>
                        <br>
                        <el-form-item label="物业地址："
                            :class="{'form-label':type===1}"
                            style="width:605px;text-align:right">
                            <span class="propertyAddress"
                                v-if="contractForm.houseinfoCode">
                                {{contractForm.houseInfo.EstateName.replace(/\s/g,"")+' '+contractForm.houseInfo.BuildingName.replace(/\s/g,"")+contractForm.houseInfo.Unit.replace(/\s/g,"")+contractForm.houseInfo.RoomNo.replace(/\s/g,"")}}
                            </span>
                            <span class="propertyAddress color_"
                                v-else>物业地址</span>
                        </el-form-item>
                        <!-- 温州不需要建成年代 -->
                        <el-form-item label="建成年代："
                            :class="{'form-label':type===1}"
                            style="width:250px;text-align:right"
                            v-if="userMsg.cityId!=16">
                            <span class="CompleteYear"
                                style="width:150px;"
                                v-if="contractForm.houseInfo.CompleteYear">
                                {{contractForm.houseInfo.CompleteYear}}
                            </span>
                            <span class="CompleteYear color_"
                                style="width:150px;"
                                v-else>建成年代</span>
                        </el-form-item>
                        <br>
                        <el-form-item label="产权地址："
                            class="form-label"
                            style="width:750px;text-align:right">
                            <input v-model="rightAddrCity"
                                :disabled="canInput"
                                maxlength="10"
                                placeholder="请输入"
                                @input="cutAddress('city')"
                                class="dealPrice"
                                :class="{'disabled':canInput}"
                                style="width:100px" /> 市
                            <input v-model="rightAddrArea"
                                :disabled="canInput"
                                maxlength="10"
                                placeholder="请输入"
                                @input="cutAddress('area')"
                                class="dealPrice"
                                :class="{'disabled':canInput}"
                                style="width:100px" /> 区
                            <input v-model="rightAddrDetail"
                                :disabled="canInput"
                                maxlength="70"
                                placeholder="详细地址"
                                @input="cutAddress('detail')"
                                class="dealPrice"
                                :class="{'disabled':canInput}"
                                style="width:400px" />
                        </el-form-item>
                        <br>
                        <el-form-item label="建筑面积："
                            class="width-250">
                            <input type="text"
                                v-model="contractForm.houseInfo.Square"
                                :disabled="canInput"
                                @input="cutNumber('Square')"
                                placeholder="请输入内容"
                                class="dealPrice"
                                :class="{'disabled':canInput}">
                            <i class="yuan">㎡</i>
                        </el-form-item>
                        <el-form-item label="套内面积："
                            class="width-250">
                            <input type="text"
                                v-model="contractForm.houseInfo.SquareUse"
                                :disabled="canInput"
                                @input="cutNumber('SquareUse')"
                                placeholder="请输入内容"
                                class="dealPrice"
                                :class="{'disabled':canInput}">
                            <i class="yuan">㎡</i>
                        </el-form-item>
                        <br>
                        <el-form-item label="业主信息："
                            class="form-label"
                            style="padding-left:18px">
                            <ul class="peopleMsg">
                                <li v-for="(item,index) in ownerList" :key="index">
                                    <div>
                                        <span class="merge">
                                            <input v-model="item.name"
                                                :disabled="canInput"
                                                placeholder="姓名"
                                                maxlength="30"
                                                @input="inputOnly(index,'owner')"
                                                class="name_"
                                                :class="{'disabled':canInput}">
                                            <input v-model="item.mobile"
                                                :disabled="canInput"
                                                type="tel"
                                                placeholder="电话"
                                                class="mobile_"
                                                :class="{'disabled':canInput}"
                                                @input="verifyMobile(item,index,'owner')"
                                                @keydown="saveMobile(item,index,'owner')">
                                        </span>
                                        <el-select v-model="item.relation"
                                            placeholder="关系"
                                            :disabled="canInput"
                                            class="relation_">
                                            <el-option v-for="item in relationList"
                                                :key="item.key"
                                                :label="item.value"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                        <span class="shell"
                                            v-if="contractForm.type!=1"><input type="text"
                                                v-model="item.propertyRightRatio"
                                                :disabled="canInput"
                                                @input="cutNumber_(index,'owner')"
                                                placeholder="产权比"
                                                class="propertyRight"
                                                :class="{'disabled':canInput}"></span>
                                        <el-select v-model="item.cardType"
                                            :disabled="canInput"
                                            placeholder="证件类型"
                                            class="idtype"
                                            @change="changeCadrType($event,index,'owner')">
                                            <el-option v-for="item in dictionary['633']"
                                                v-if="recordType===10&&item.key!=4||recordType!=10"
                                                :key="item.key"
                                                :label="item.value"
                                                :value="item.key">
                                            </el-option>
                                        </el-select>
                                        <input v-model="item.encryptionCode"
                                            type="text"
                                            :disabled="canInput"
                                            :maxlength="item.cardType===1?18:item.cardType===2?30:item.cardType===3?20:10"
                                            placeholder="请输入证件号"
                                            class="idCard_"
                                            :class="{'disabled':canInput}"
                                            @input="verifyIdcard(item)">

                                        <input v-model="item.email"
                                            v-if="recordType===10"
                                            type="text"
                                            :disabled="canInput"
                                            placeholder="邮箱（选填）"
                                            class="idCard_"
                                            :class="{'disabled':canInput}"
                                            @input="inputEmail(item)">

                                        <span @click.stop="addcommissionData"
                                            class="icon"
                                            v-if="!canInput">
                                            <i class="iconfont icon-tubiao_shiyong-14"></i>
                                        </span>
                                        <span @click.stop="delPeople(index,'owner')"
                                            v-if="ownerList.length>1&&!canInput"
                                            class="icon">
                                            <i class="iconfont icon-tubiao_shiyong-4"></i>
                                        </span>
                                    </div>
                                    <div style="margin-top:10px" v-if="item.cardType===3&&recordType===10">
                                        <input v-model="item.companyName"
                                        type="text"
                                        :disabled="canInput"
                                        placeholder="企业名称"
                                        maxlength="100"
                                        class="idCard_"
                                        :class="{'disabled':canInput}"
                                        @input="inputLegalP(item,'companyName')">
                                    
                                        <input v-model="item.lepName"
                                        type="text"
                                        :disabled="canInput"
                                        placeholder="法人名称"
                                        maxlength="10"
                                        class="idCard_"
                                        :class="{'disabled':canInput}"
                                        @input="inputLegalP(item,'lepName')">
                                    
                                        <input v-model="item.lepIdentity"
                                        type="text"
                                        :disabled="canInput"
                                        placeholder="法人身份证号"
                                        maxlength="18"
                                        class="idCard_"
                                        :class="{'disabled':canInput}"
                                        @input="inputLegalP(item,'lepIdentity')">
                                    </div>
                                </li>
                            </ul>
                        </el-form-item>
                    </div>
                </div>
                <!-- 客源信息 -->
                <div class="houseMsg">
                    <p>客源信息</p>
                    <div class="form-content">
                        <el-form-item label="客源编号："
                            class="width-250"
                            :class="{'form-label':type===1}">
                            <span class="select"
                                @click="showDialog('guest')"
                                v-if="sourceBtnCheck||canInput||!offLine||isDeal">{{contractForm.guestinfoCode?contractForm.guestinfoCode:'请选择客源'}}</span>
                            <span class="select_"
                                v-else>{{contractForm.guestinfoCode}}</span>
                        </el-form-item>
                        <br>
                        <el-form-item label="客户信息："
                            class="form-label"
                            style="padding-left:18px">
                            <ul class="peopleMsg">
                                <li v-for="(item,index) in guestList" :key="index">
                                    <div>
                                        <span class="merge">
                                            <input v-model="item.name"
                                                :disabled="canInput"
                                                placeholder="姓名"
                                                maxlength="30"
                                                @input="inputOnly(index,'guest')"
                                                class="name_"
                                                :class="{'disabled':canInput}">
                                            <input v-model="item.mobile"
                                                :disabled="canInput"
                                                type="tel"
                                                placeholder="电话"
                                                class="mobile_"
                                                :class="{'disabled':canInput}"
                                                @input="verifyMobile(item,index,'guest')"
                                                @keydown="saveMobile(item,index,'guest')">
                                        </span>
                                        <el-select v-model="item.relation" :disabled="canInput" placeholder="关系" class="relation_">
                                            <el-option v-for="item in relationList"
                                                :key="item.key"
                                                :label="item.value"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                        <span class="shell" v-if="contractForm.type!=1">
                                            <input type="text"
                                                v-model="item.propertyRightRatio"
                                                :disabled="canInput"
                                                @input="cutNumber_(index,'guest')"
                                                placeholder="产权比"
                                                class="propertyRight"
                                                :class="{'disabled':canInput}"></span>
                                        <el-select v-model="item.cardType" :disabled="canInput" placeholder="证件类型" class="idtype" @change="changeCadrType($event,index,'guest')">
                                            <el-option v-for="item in dictionary['633']"
                                                v-if="recordType===10&&item.key!=4||recordType!=10"
                                                :key="item.key"
                                                :label="item.value"
                                                :value="item.key">
                                            </el-option>
                                        </el-select>
                                        <input id="guestCard"
                                            v-model="item.encryptionCode"
                                            :disabled="canInput"
                                            :maxlength="item.cardType===1?18:item.cardType===2?30:item.cardType===3?20:10"
                                            type="text"
                                            placeholder="请输入证件号"
                                            class="idCard_"
                                            :class="{'disabled':canInput}"
                                            @input="verifyIdcard(item)">

                                        <input v-model="item.email"
                                            v-if="recordType===10"
                                            type="text"
                                            :disabled="canInput"
                                            placeholder="邮箱（选填）"
                                            class="idCard_"
                                            :class="{'disabled':canInput}"
                                            @input="inputEmail(item)">

                                        <span @click.stop="addcommissionData1" class="icon" v-if="!canInput">
                                            <i class="iconfont icon-tubiao_shiyong-14"></i>
                                        </span>
                                        <span @click.stop="delPeople(index,'guest')" v-if="guestList.length>1&&!canInput" class="icon">
                                            <i class="iconfont icon-tubiao_shiyong-4"></i>
                                        </span>
                                    </div>
                                    
                                    <div style="margin-top:10px" v-if="item.cardType===3&&recordType===10">
                                        <input v-model="item.companyName"
                                        type="text"
                                        :disabled="canInput"
                                        placeholder="企业名称"
                                        maxlength="100"
                                        class="idCard_"
                                        :class="{'disabled':canInput}"
                                        @input="inputLegalP(item,'companyName')">
                                    
                                        <input v-model="item.lepName"
                                        type="text"
                                        :disabled="canInput"
                                        placeholder="法人名称"
                                        maxlength="10"
                                        class="idCard_"
                                        :class="{'disabled':canInput}"
                                        @input="inputLegalP(item,'lepName')">
                                    
                                        <input v-model="item.lepIdentity"
                                        type="text"
                                        :disabled="canInput"
                                        placeholder="法人身份证号"
                                        maxlength="18"
                                        class="idCard_"
                                        :class="{'disabled':canInput}"
                                        @input="inputLegalP(item,'lepIdentity')">
                                    </div>
                                </li>
                            </ul>
                        </el-form-item>
                    </div>
                </div>
                <!-- 合同备注 -->
                <div class="houseMsg">
                    <p @click="showRemarkTab"
                        class="thirdParty">备注栏 <span class="attention iconfont icon-tubiao-10"
                            :class="{'attention_':showRemark}"></span></p>
                    <div class="remarkType"
                        v-show="showRemark">
                        <el-form-item style="padding-left:20px;position:relative;">
                            <!-- @input="inputCode('remarks')" -->
                            <el-input type="textarea"
                                :rows="6"
                                maxlength="200"
                                resize='none'
                                :disabled="canInput"
                                v-model="contractForm.remarks"
                                placeholder="请输入备注内容"></el-input>
                            <span class="textLength">{{contractForm.remarks.length}}/200</span>
                        </el-form-item>
                    </div>
                </div>
                <!-- 三方合作 -->
                <div class="houseMsg">
                    <p @click="toCooperation"
                        class="thirdParty">三方合作 <span class="attention iconfont icon-tubiao-10"
                            :class="{'attention_':cooperation}"></span></p>
                    <div class="cooperation"
                        v-show="cooperation">
                        <div>
                            <el-form-item label="扣合作费："
                                class="width-250">
                                <input type="text"
                                    v-model="contractForm.otherCooperationCost"
                                    :disabled="canInput"
                                    @input="cutNumber('otherCooperationCost')"
                                    placeholder="请输入内容"
                                    class="dealPrice"
                                    :class="{'disabled':canInput}">
                                <i class="yuan">元</i>
                            </el-form-item>
                            <el-form-item label="类型："
                                class="width-250">
                                <el-select v-model="contractForm.otherCooperationInfo.type"
                                    :disabled="canInput"
                                    placeholder="请选择"
                                    style="width:140px">
                                    <el-option label="无"
                                        :value="0">
                                    </el-option>
                                    <el-option v-for="item in dictionary['517']"
                                        :key="item.key"
                                        :label="item.value"
                                        :value="item.key">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <br>
                            <el-form-item label="合作方姓名："
                                class="width-250">
                                <input type="text"
                                    v-model="contractForm.otherCooperationInfo.name"
                                    :disabled="canInput"
                                    maxlength="6"
                                    @input="inputOnly(999,'other')"
                                    placeholder="请输入姓名"
                                    class="dealPrice"
                                    :class="{'disabled':canInput}">
                            </el-form-item>
                            <el-form-item label="联系方式："
                                class="width-250">
                                <el-input v-model="contractForm.otherCooperationInfo.mobile"
                                    :disabled="canInput"
                                    type="tel"
                                    placeholder="请输入手机号"
                                    style="width:140px"
                                    @input="verifyMobile_(contractForm.otherCooperationInfo.mobile)"></el-input>
                            </el-form-item>
                            <el-form-item label="身份证号："
                                style="width:310px;text-align:right">
                                <el-input v-model="contractForm.otherCooperationInfo.identifyCode"
                                    :disabled="canInput"
                                    maxlength="18"
                                    placeholder="请输入身份证号"
                                    @input="verifyIdcard(contractForm.otherCooperationInfo.identifyCode,2)"></el-input>
                            </el-form-item>
                            <br>
                            <el-form-item label="备注："
                                style="padding-left:51px">
                                <!-- @input="inputCode('cooperation')" -->
                                <el-input type="textarea"
                                    :rows="6"
                                    maxlength="200"
                                    resize='none'
                                    :disabled="canInput"
                                    v-model="contractForm.otherCooperationInfo.remarks"
                                    placeholder="无备注内容"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                </div>
            </el-form>
            <div class="btn">
                <div>
                    <div v-if="type===2">
                        <p><span>录入时间：</span>{{contractForm.createTime|formatTime}}</p>
                        <p><span>录入人：</span>{{contractForm.recordDeptName}}-{{contractForm.recordName}}</p>
                        <p><span>最后修改：</span>{{contractForm.updateTime|formatTime}}</p>
                    </div>
                </div>
                <div>
                    <el-button type="primary"
                        round
                        @click="isSave(0)"
                        :disabled="canClick">{{canInput?"保存":"保存并进入下一步"}}</el-button>
                </div>
            </div>
            <!-- 房源客源弹窗 -->
            <houseGuest :dialogType="dialogType"
                :dialogVisible="isShowDialog"
                :contractType="contractType"
                :choseHcode="choseHcode"
                :choseGcode="choseGcode"
                @closeHouseGuest="closeHouseGuest"
                v-if="isShowDialog">
            </houseGuest>
            <!-- 保存合同确认框dialogSave -->
            <el-dialog title=""
                :visible.sync="dialogSave"
                class="personalMsg"
                width="460px"
                :closeOnClickModal="$tool.closeOnClickModal">
                <div class="warning-box">
                    <!-- <p v-if="type!=1"> -->
                    <p>
                        <i class="iconfont icon-tubiao_shiyong-1"></i>
                        <span>请确认客户和业主的姓名与证件上的一致？</span>
                    </p>
                    <!-- <div class="firstAdd" v-else>
            <i class="iconfont icon-tubiao_shiyong-1"></i>
            <p>您的合同24小时后自动删除，请签约成功后尽快上传合同主体和资料库</p>
            <p>请确认客户和业主的姓名与证件上的一致？</p>
          </div> -->
                    <ul>
                        <li v-for="item in ownerList"
                            :key="'owner'+item.encryptionCode">
                            {{item.name}}：{{item.encryptionCode}}
                        </li>
                        <li v-for="item in guestList"
                            :key="'guets'+item.encryptionCode">
                            {{item.name}}：{{item.encryptionCode}}
                        </li>
                    </ul>
                    <p>否则合同将无效，之后收款所开票据无效！！！</p>
                </div>
                <span slot="footer"
                    class="dialog-footer">
                    <el-button @click="dialogSave = false"
                        size="small">不确认</el-button>
                    <el-button type="primary"
                        size="small"
                        @click="saveCont"
                        v-loading.fullscreen.lock="fullscreenLoading">确认</el-button>
                </span>
            </el-dialog>
            <!-- 删除人员确认框 -->
            <el-dialog title="提示"
                :visible.sync="dialogDel"
                width="460px"
                :closeOnClickModal="$tool.closeOnClickModal">
                <div style="padding-top:10px;font-size:16px;">确定删除当前联系人吗？</div>
                <span slot="footer"
                    class="dialog-footer">
                    <el-button @click="dialogDel = false">取 消</el-button>
                    <el-button type="primary"
                        @click="delPeopleMsg">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 创建合同成功提示框 -->
            <el-dialog title="提示"
                :visible.sync="dialogSuccess"
                width="460px"
                :closeOnClickModal="$tool.closeOnClickModal"
                :showClose="false">
                <span>是否继续上传附件？如果不上传附件权证将无法办理！（你也可以以后再上传，上传附件后权证将接收办理）</span>
                <span slot="footer"
                    class="dialog-footer">
                    <el-button @click="toContract">取 消</el-button>
                    <el-button type="primary"
                        @click="toUpload">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 单公司提示框 -->
            <el-dialog title="提示"
                :visible.sync="singleCompany"
                width="460px"
                :closeOnClickModal="$tool.closeOnClickModal"
                :showClose="false">
                <div class="singleCompany">{{singleCompanyName}}未设置公章，请联系管理员设置！</div>
                <span slot="footer"
                    class="dialog-footer">
                    <el-button type="primary"
                        @click="toH5">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 分成人信息弹窗 -->
            <el-dialog :title="dialogType==='house'?'当前房源分成人':'当前客源分成人'"
                :visible.sync="agentsDialog"
                width="500px"
                :closeOnClickModal="$tool.closeOnClickModal">
                <div class="agentsDialog">
                    <!-- <p>当前房源分成人</p> -->
                    <ul>
                        <li v-for="(item, index) in agentsList"
                            :key="index"
                            :title="`${item.roleText} ${item.empName}·${item.deptName}`"><span>{{item.roleText}}</span>{{item.empName+"·"+item.deptName}}</li>
                    </ul>
                </div>
            </el-dialog>
            <!-- 设置/转交审核人 -->
            <checkPerson :show="checkPerson.state"
                :type="checkPerson.type"
                :showLabel="checkPerson.label"
                :bizCode="checkPerson.code"
                :flowType="checkPerson.flowType"
                @close="closeCheckPerson"
                @submit="closeCheckPerson"
                v-if="checkPerson.state"></checkPerson>
            <a id="add"
                href=""
                v-show="false"
                target="_blank"></a>
        </div>
        <div v-else>
            <contractBasics :contractForm="contractForm"
                v-if="isHaveDetail&&type===2"
                :recordType="recordType"
                :offLineInput="offLine"
                :sourceBtnCheck="sourceBtnCheck"
                :operationType="type"
                :ownerList_="ownerList_"
                :guestList_="guestList_"
                :ownerList="ownerList"
                :guestList="guestList"
                :canInput="canInput"
                :getShowRemark="showRemark"
                :basicsOptions="basicsOptions">
            </contractBasics>
            <contractBasics :contractForm="contractForm"
                v-if="isHaveDetail&&type===1"
                :recordType="recordType"
                :houseId="houseId"
                :operationType="type">
            </contractBasics>
        </div>
    </div>
</template>

<script>
import { TOOL } from "@/assets/js/common";
import { MIXINS } from "@/assets/js/mixins";
import houseGuest from "../contractDialog/houseGuest";
import checkPerson from "@/components/checkPerson";
import contractBasics from "../contractDialog/contractBasics";
const rule = {
    signDate: {
        name: "签约日期"
    },
    estTransferTime: {
        name: "预计过户时间"
    },
    pCode: {
        name: "纸质合同编号"
    },
    houseinfoCode: {
        name: "房源"
    },
    guestinfoCode: {
        name: "客源"
    }
};
let loading = null;
export default {
    mixins: [MIXINS],
    components: {
        houseGuest,
        checkPerson,
        contractBasics
    },
    data() {
        return {
            clientHei: "",
            contractForm: {
                // type: 2,
                houseinfoCode: "",
                guestinfoCode: "",
                signDate: "",
                estTransferTime: "",
                payType: 1,
                dealPrice: "",
                contPersons: [],
                propertyRightAddr: "",
                houseInfo: {
                    HouseStoreCode: "",
                    ShopOwnerMobile: "",
                    ShopOwnerName: ""
                },
                guestInfo: {
                    ShopOwnerMobile: "",
                    ShopOwnerName: ""
                },
                otherCooperationInfo: {
                    identifyCode: "",
                    mobile: ""
                },
                isHaveCooperation: 0,
                remarks: ""
            },
            //业主信息
            ownerList: [
                {
                    type: 1,
                    encryptionCode: "",
                    mobile: "",
                    relation: "",
                    cardType: "",
                    name: "",
                    propertyRightRatio: "",
                    email:"",
                    lepName:"",
                    companyName:"",
                    lepIdentity:"",
                }
            ],
            ownerList_: [],
            //客户信息
            guestList: [
                {
                    type: 2,
                    encryptionCode: "",
                    mobile: "",
                    relation: "",
                    cardType: "",
                    name: "",
                    propertyRightRatio: "",
                    email:"",
                    lepName:"",
                    companyName:"",
                    lepIdentity:"",
                }
            ],
            guestList_: [],
            dialogType: "",
            isShowDialog: false,
            dialogSave: false,
            //三方合作
            cooperation: false,
            //操作类型  默认是添加
            type: 1,
            recordType: "", //判断创建合同为1线上，2线下，10无纸化
            dictionary: {
                //数据字典
                "514": "", //产权状态
                "507": "", //时间单位
                "517": "", //第三方合作类型
                "12": "", //第三方合作类型
                "556": "", //付款方式
                "633": "" //证件类型(护照,身份证,营业执照)
            },
            transFlowList: [],
            contractType: "",
            loading: false,
            //门店选择列表
            options: [],
            options_: [],
            //人员关系列表
            relationList: [],
            //编辑时的合同id
            id: "",
            //扩展参数类型
            parameterList: [],
            //扩展参数验证
            parameterRule: {},
            fullscreenLoading: false,
            hintText: "",
            haveExamine: 0,
            //人员信息下标
            peopleIndex: "",
            dialogDel: false,
            delType: "",
            choseHcode: 0, //选择的房源编号
            choseGcode: 0, //选择的客源编号
            dialogSuccess: false,
            detailCode: "",
            detailId: "",
            //改变之前的手机号
            beforeChangeMobile: "",
            checkPerson: {
                state: false,
                type: 1,
                code: "",
                flowType: 3,
                label: false
            },
            userMsg: {}, //当前登录人信息
            recordId: "", //合同创建人id
            canClick: false,
            //权限配置
            power: {
                "sign-ht-info-toverify": {
                    state: false,
                    name: "提交审核" //编辑+提审
                },
                "sign-ht-info-sverify": {
                    state: false,
                    name: "提交审核" //新增+提审
                },
                "sign-com-htdetail": {
                    state: false,
                    name: "合同详情"
                },
                "sign-ht-xq-data-add": {
                    state: false,
                    name: "编辑资料库"
                }
            },
            rightAddrCity: "",
            rightAddrArea: "",
            rightAddrDetail: "",
            singleCompany: false, //单公司提示框
            singleCompanyName: "",
            agentsDialog: false,
            agentsList: [], //分成人列表
            sourceBtnCheck: true, //房客源是否可选择
            //是否能输入（已签约 未结算）
            canInput: false,
            //线下合同已签约状态编辑
            offLine: false,
            //日期选择器禁止选择未来时间
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            pickerOptionsLast: {
                disabledDate(time) {
                    let n = 24 * 60 * 60 * 1000;
                    return time.getTime() + n < Date.now();
                }
            },
            isHaveDetail: false,
            contVersion: 2, //合同基本信息版式（1 基础版  2 复杂版）
            commissionTotal: 0, //总佣金
            loanType: 0, //7 全款买卖 8 贷款买卖
            showRemark: false, //备注栏折叠展开
            basicsOptions: [], //基础版经纪人信息

            isToCommission: false, // 是否转佣
            ys: 0, //应收金额
            ss: 0, //实收
            ws: 0, //未收金额
            yt: 0, //已退金额
            zy: 0, //转佣金额

            houseId:0,//转成交房源id
        };
    },
    computed: {
        isDeal() {
            let { isDeal = 0 } = this.$route.query || {};
            return isDeal;
        }
    },
    created() {
        let backMsg = JSON.parse(localStorage.getItem("backMsg"));
        if (backMsg) {
            //存在则是从h5页面返回  需走编辑逻辑
            let contMsg = JSON.parse(sessionStorage.getItem("contractMsg"));
            this.contractForm.type = parseInt(contMsg.type); //合同类型
            this.type = 2; //编辑
            this.id = parseInt(contMsg.id);
            this.getContractDetail();
        } else {
            this.contractForm.type = Number(this.$route.query.type);
            if (this.$route.query.loanType) {
                this.loanType = Number(this.$route.query.loanType);
            }
            this.recordType = parseInt(this.$route.query.recordType);
            if (this.$route.query.operateType) {
                this.type = parseInt(this.$route.query.operateType);
                if (this.type == 2) {
                    this.id = parseInt(this.$route.query.id);
                    this.getContractDetail();
                } else if (this.type == 1) {
                    this.getNewData();
                    this.isHaveDetail = true;
                    this.getVersion();
                    if(Number(this.$route.query.turnDeal)===1){//房源转成交需要获取房源详情
                    this.houseId = Number(this.$route.query.houseId)
                        this.getHousedetail(this.houseId)
                    }
                }
            }
        }
        let arr = this.$tool.getRouter(
            ["二手房", "合同", "合同列表"],
            "contractList"
        );
        arr.push({
            name: this.type === 1 ? "新增合同" : "合同编辑",
            path: this.$route.fullPath
        });
        this.setPath(arr);
        this.getDictionary(); //字典
        this.getTransFlow(); //交易类型
        this.getRelation(); //人员关系
        // this.getExtendParams();//扩展参数
        this.getShopList(); //门店
        this.getAdmin(); //获取当前登录人信息
        if (this.$route.query.isDeal) {
            this.id = this.$route.query.id;
            this.getContractDetail();
        }
    },
    methods: {
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
        //计算总佣金
        countTotal() {
            let owner = Number( this.contractForm.ownerCommission ? this.contractForm.ownerCommission : 0 );
            let cust = Number( this.contractForm.custCommission ? this.contractForm.custCommission : 0 );
            let commission = Number( this.zy ? this.zy : 0 );
            let total
            if((this.$route.query.isDeal||this.contractForm.dealById)&&this.isToCommission){//转成交合同
                total = cust + owner + Number(this.zy)
            }else{
                total = cust + owner;
            }
            this.commissionTotal = this.fomatFloat(total, 2);
        },
        // 转成交合同编辑时获取原意向/定金合同应收实收数据
        getZYInfo(id){
            let param = {
                contId:id
            }
            this.$ajax.get("/api/contract/getZYInfo",param).then(res=>{
                res=res.data
                if(res.status===200){
                    this.ys = res.data.ys //应收金额
                    this.ss = res.data.ss //实收
                    this.ws = res.data.ws //未收金额
                    this.yt = res.data.yt //已退金额
                    this.zy = res.data.zy //转佣金额
                    this.countTotal();
                }
            })
        },
        //运算时四舍五入保留两位小数 num为传入的值，n为保留的小数位
        fomatFloat: function(num, n) {
            var f = parseFloat(num);
            if (isNaN(f)) {
                return false;
            }
            f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); // n 幂
            var s = f.toString();
            var rs = s.indexOf(".");
            //判定如果是整数，增加小数点再补0
            if (rs < 0) {
                rs = s.length;
                s += ".";
            }
            while (s.length <= rs + n) {
                s += "0";
            }
            return s;
        },
        //获取当前日期
        getNewData() {
            let time = new Date();
            let y = time.getFullYear();
            let M = time.getMonth() + 1;
            let D = time.getDate();
            let h = time.getHours();
            let m = time.getMinutes();
            let s = time.getSeconds();
            let time_ = `${y}-${M > 9 ? M : "0" + M}-${D > 9 ? D : "0" + D} ${
                h > 9 ? h : "0" + h
            }:${m > 9 ? m : "0" + m}:${s > 9 ? s : "0" + s}`;
            this.contractForm.signDate = time_;
        },
        // 控制弹框body内容高度，超过显示滚动条
        clientHeight() {
            this.clientHei = document.documentElement.clientHeight - 160 + "px";
        },
        addcommissionData() {
            if (this.ownerList.length < 10) {
                this.ownerList.push({
                    type: 1,
                    encryptionCode: "",
                    mobile: "",
                    encryptionMobile: "",
                    relation: "",
                    cardType: "",
                    name: "",
                    propertyRightRatio: ""
                });
            } else {
                this.$message({
                    message: "已达到最大数量",
                    type: "warning"
                });
            }
        },
        addcommissionData1() {
            if (this.guestList.length < 10) {
                this.guestList.push({
                    type: 2,
                    encryptionCode: "",
                    mobile: "",
                    encryptionMobile: "",
                    relation: "",
                    cardType: "",
                    name: "",
                    propertyRightRatio: ""
                });
            } else {
                this.$message({
                    message: "已达到最大数量",
                    type: "warning"
                });
            }
        },
        //删除联系人确认框
        delPeople(index, type) {
            this.peopleIndex = index;
            this.delType = type;
            this.dialogDel = true;
        },
        //确认删除
        delPeopleMsg() {
            if (this.delType === "owner") {
                this.ownerList.splice(this.peopleIndex, 1);
                this.ownerList_.splice(this.peopleIndex, 1);
                this.dialogDel = false;
            } else if (this.delType === "guest") {
                this.guestList.splice(this.peopleIndex, 1);
                this.guestList_.splice(this.peopleIndex, 1);
                this.dialogDel = false;
            }
        },
        //存贮改变之前的手机号
        saveMobile(item, index, type) {
            if (item.isEncryption) {
                if (type === "owner") {
                    this.beforeChangeMobile = this.ownerList[index].mobile;
                } else if (type === "guest") {
                    this.beforeChangeMobile = this.guestList[index].mobile;
                }
            }
        },
        //第三方
        toCooperation() {
            this.cooperation = !this.cooperation;
            if (this.contractForm.isHaveCooperation) {
                this.contractForm.isHaveCooperation = 0;
                this.contractForm.otherCooperationCost = "";
                this.contractForm.otherCooperationInfo.type = "";
                this.contractForm.otherCooperationInfo.name = "";
                this.contractForm.otherCooperationInfo.mobile = "";
                this.contractForm.otherCooperationInfo.identifyCode = "";
                this.contractForm.otherCooperationInfo.remarks = "";
            } else {
                this.contractForm.isHaveCooperation = 1;
            }
        },
        // 备注栏
        showRemarkTab() {
            this.showRemark = !this.showRemark;
            this.contractForm.remarks = "";
        },
        //证件类型切换
        changeCadrType(value, index, type) {
            // console.log(value,index,type)
            if (type === "guest") {
                this.guestList[index].encryptionCode = "";
                if(value!=3){
                    this.guestList[index].companyName=""
                    this.guestList[index].lepName=""
                    this.guestList[index].lepIdentity=""
                }
            } else {
                this.ownerList[index].encryptionCode = ""
                if(value!=3){
                    this.ownerList[index].companyName=""
                    this.ownerList[index].lepName=""
                    this.ownerList[index].lepIdentity=""
                }
            }
        },
        //身份证验证
        verifyIdcard(value, type = 1) {
            // let reg = /^[1-9]\d{5}((((19|[2-9][0-9])\d{2})(0?[13578]|1[02])(0?[1-9]|[12][0-9]|3[01]))|(((19|[2-9][0-9])\d{2})(0?[13456789]|1[012])(0?[1-9]|[12][0-9]|30))|(((19|[2-9][0-9])\d{2})0?2(0?[1-9]|1[0-9]|2[0-8]))|(((1[6-9]|[2-9][0-9])(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))0?229))\d{3}[0-9Xx]$/;
            // let reg = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/
            if (type === 2) {
                if (value.length === 18) {
                    if (!this.isIdCardNo(value)) {
                        this.$message({
                            message: "身份证格式不正确",
                            type: "warning"
                        });
                    }
                }
            } else {
                if (value.encryptionCode.length === 18) {
                    if (
                        !this.isIdCardNo(value.encryptionCode) &&
                        value.cardType === 1
                    ) {
                        this.$message({
                            message: "身份证格式不正确",
                            type: "warning"
                        });
                    }
                }
            }
        },
        //手机号验证
        verifyMobile(item, index, type) {
            let beginNum = /^0.*$/;
            let beginNum_ = /^1.*$/;
            if (item.mobile.length > 0) {
                if (type === "owner") {
                    if (beginNum.test(item.mobile)) {
                        this.ownerList[index].mobile = item.mobile.substring(
                            0,
                            13
                        );
                        // }else if(beginNum_.test(item.mobile)){
                    } else {
                        this.ownerList[index].mobile = item.mobile.substring(
                            0,
                            11
                        );
                    }
                    item.mobile = this.ownerList[index].mobile;
                } else if (type === "guest") {
                    if (beginNum.test(item.mobile)) {
                        this.guestList[index].mobile = item.mobile.substring(
                            0,
                            13
                        );
                        // }else if(beginNum_.test(item.mobile)){
                    } else {
                        this.guestList[index].mobile = item.mobile.substring(
                            0,
                            11
                        );
                    }
                    item.mobile = this.guestList[index].mobile;
                }
            }
            if (item.isEncryption) {
                //是否是加密的号码
                if (type === "owner") {
                    if (
                        this.ownerList[index].mobile !== this.beforeChangeMobile
                    ) {
                        if (Number(item.mobile)) {
                            this.ownerList[index].mobile = item.mobile;
                        } else {
                            this.ownerList[index].mobile = "";
                        }
                        this.ownerList[index].isEncryption = false;
                    }
                } else if (type === "guest") {
                    if (
                        this.guestList[index].mobile !== this.beforeChangeMobile
                    ) {
                        if (Number(item.mobile)) {
                            this.guestList[index].mobile = item.mobile;
                        } else {
                            this.guestList[index].mobile = "";
                        }
                        this.guestList[index].isEncryption = false;
                    }
                }
            } else {
                if (item.mobile.length >= 11) {
                    let reg = /^1[0-9]{10}$/;
                    let reg_ = /^0\d{2,3}\-?\d{7,8}$/;
                    if (!reg.test(item.mobile) && !reg_.test(item.mobile)) {
                        this.$message({
                            message: "电话号码格式不正确",
                            type: "warning"
                        });
                    }
                }
            }
        },
        verifyMobile_(value) {
            let beginNum = /^0.*$/;
            let beginNum_ = /^1.*$/;
            if (value.length > 0) {
                if (beginNum.test(value)) {
                    this.contractForm.otherCooperationInfo.mobile = value.substring(
                        0,
                        13
                    );
                }
                if (beginNum_.test(value)) {
                    this.contractForm.otherCooperationInfo.mobile = value.substring(
                        0,
                        11
                    );
                }
                value = this.contractForm.otherCooperationInfo.mobile;
            }
            if (value.length >= 11) {
                let reg = /^1[0-9]{10}$/;
                let reg_ = /^0\d{2,3}\-?\d{7,8}$/;
                if (!reg.test(value) && !reg_.test(value)) {
                    this.$message({
                        message: "电话号码格式不正确",
                        type: "warning"
                    });
                }
            }
        },
        //法人验证
        inputLegalP(val,name){
            if(name!="lepIdentity"){
                val[name]=this.$tool.textInput(val[name]);
            }else{
                if(val[name]&&val[name].length==18&&!this.isIdCardNo(val[name])){
                    this.$message({
                        message: "身份证格式不正确",
                        type: "warning"
                    });
                }
            }
        },
        //邮箱验证
        inputEmail(val){
            console.log(val)
            val.email=val.email.replace(/\s+/g,"")
        },
        //验证合同信息
        isSave(value) {
            var rule_ = JSON.parse(JSON.stringify(rule));
            this.haveExamine = value;
            // if(this.userMsg.cityId!=52||(this.userMsg.cityId===52&&this.contractForm.type===1)) {
            if(!this.showTransferTime||(this.showTransferTime&&this.contractForm.type===1)) {
                // 非兰州无预计过户时间
                delete rule_.estTransferTime
            }
            if (this.recordType != 2) {
                delete rule_.pCode;
            }
            if (!this.contractForm.signDate) {
                this.contractForm.signDate = "";
            }
            if (this.contractForm.pCode) {
                this.contractForm.pCode = this.contractForm.pCode.replace(/\s+/g,"");
            }
            if (!this.contractForm.pCode) {
                this.contractForm.pCode = "";
            }
            this.$tool.checkForm(this.contractForm, rule_).then(() => {
                if (this.contractForm.custCommission > 0 || this.contractForm.ownerCommission > 0 ) {
                    //佣金
                    if (this.contractForm.dealPrice > 0) {
                        // if((Number(this.contractForm.custCommission?this.contractForm.custCommission:0)+Number(this.contractForm.ownerCommission?this.contractForm.ownerCommission:0))<=this.contractForm.dealPrice){
                        // this.contractForm.propertyRightAddr = this.contractForm.propertyRightAddr.replace(/\s+/g,"")
                        // let addrReg=/\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\&|\!|\~|\`|\|/g
                        // this.contractForm.propertyRightAddr=this.contractForm.propertyRightAddr.replace(addrReg,'')
                        if ( this.rightAddrCity && this.rightAddrArea && this.rightAddrDetail ) {
                            this.contractForm.propertyRightAddr = this.rightAddrCity + "市" + this.rightAddrArea + "区" + this.rightAddrDetail;
                            // if(this.contractForm.propertyCard){
                            //   this.contractForm.propertyCard=this.contractForm.propertyCard.replace(/\s/g,"");
                            // }
                            // if(this.contractForm.propertyCard||this.contractForm.type===1){
                            //业主产权比
                            let ownerRightRatio = 0;

                            let isOk;
                            // this.ownerList.forEach(element => {
                            let ownerArr = this.ownerList.map(item =>
                                Object.assign({}, item)
                            );
                            ownerArr.forEach((element, index) => {
                                if (element.isEncryption) {
                                    element.encryptionMobile = this.ownerList_[index].encryptionMobile;
                                } else {
                                    element.encryptionMobile = element.mobile;
                                }
                            });

                            for (var i = 0; i < ownerArr.length; i++) {
                                let element = ownerArr[i];
                                isOk = false;
                                if (element.name) {
                                    if (element.name.replace(/\s/g, "")) {
                                        element.name = element.name.replace(/\s/g,"");
                                        //2020.01.09 更改需求 温州客户业主姓名可以存在 ‘先生’ ‘女士’ 字符(待定)
                                        if ( element.name.indexOf("先生") === -1 && element.name.indexOf("女士") === -1) {
                                            if (element.encryptionMobile.length === 11 || true ) {
                                                let reg = /^1[0-9]{10}$/; //手机号正则
                                                let reg_ = /^0\d{2,3}\-?\d{7,8}$/; //固话正则
                                                if (reg.test(element.encryptionMobile) || reg_.test(element.encryptionMobile)) {
                                                    if (element.relation) {
                                                        if ((this.contractForm.type === 1 && element.cardType) || this.contractForm.type !== 1) {
                                                            if (this.type ===2) {
                                                                if (!element.propertyRightRatio) {
                                                                    element.propertyRightRatio = "0";
                                                                }
                                                            }
                                                            if ((element.propertyRightRatio && element.propertyRightRatio > 0) || element.propertyRightRatio === "0" || this.contractForm.type === 1) {
                                                                if (element.encryptionCode.replace(/\s/g,"")) {
                                                                    if (element.cardType !== 1 ) {
                                                                        element.encryptionCode = element.encryptionCode.replace(/[&\|\\\*^%$#@\-]/g,"");
                                                                    }
                                                                    if ((element.cardType === 1 && this.isIdCardNo(element.encryptionCode)) ||(element.cardType ===2 &&element.encryptionCode.length <=30) || (element.cardType === 4 && element.encryptionCode.length <= 10)) {
                                                                        if(element.email){
                                                                            let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
                                                                            if(reg.test(element.email)){
                                                                                isOk = true;
                                                                                ownerRightRatio += element.propertyRightRatio - 0;
                                                                            }else{
                                                                                this.$message({
                                                                                    message:"房源信息-业主邮箱不正确",
                                                                                    type:"warning"
                                                                                });
                                                                                break;
                                                                            }
                                                                        }else{
                                                                            isOk = true;
                                                                            ownerRightRatio+=element.propertyRightRatio-0;
                                                                        }
                                                                        
                                                                    } else if(element.cardType === 3 && element.encryptionCode.length <= 20){
                                                                        element.lepIdentity = element.lepIdentity?element.lepIdentity.replace(/[&\|\\\*^%$#@\-]/g,""):'';
                                                                        if(this.recordType===10&&element.companyName&&element.lepName&&element.lepIdentity&&this.isIdCardNo(element.lepIdentity)||this.recordType!=10){
                                                                            if(element.email){
                                                                                let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
                                                                                if(reg.test(element.email)){
                                                                                    isOk = true;
                                                                                    ownerRightRatio += element.propertyRightRatio - 0;
                                                                                }else{
                                                                                    this.$message({
                                                                                        message:"房源信息-业主邮箱不正确",
                                                                                        type:"warning"
                                                                                    });
                                                                                    break;
                                                                                }
                                                                            }else{
                                                                                isOk = true;
                                                                                ownerRightRatio+=element.propertyRightRatio-0;
                                                                            }
                                                                        }else{
                                                                            this.$message(
                                                                                {
                                                                                    message:`房源信息-业主${!element.companyName?'企业名称':!element.lepName?'法人名称':'法人身份证号码'}不正确`,
                                                                                    type:"warning"
                                                                                }
                                                                            );
                                                                        }
                                                                    }else {
                                                                        this.$message(
                                                                            {
                                                                                message:"房源信息-业主证件号不正确",
                                                                                type:"warning"
                                                                            }
                                                                        );
                                                                        break;
                                                                    }
                                                                } else {
                                                                    this.$message(
                                                                        {
                                                                            message:"房源信息-业主证件号不能为空",
                                                                            type:"warning"
                                                                        }
                                                                    );
                                                                    break;
                                                                }
                                                            } else {
                                                                this.$message(
                                                                    {
                                                                        message:
                                                                            "房源信息-业主产权比不能为空或负",
                                                                        type:
                                                                            "warning"
                                                                    }
                                                                );
                                                                break;
                                                            }
                                                        } else {
                                                            this.$message({
                                                                message:
                                                                    "房源信息-业主证件类型不能为空",
                                                                type:
                                                                    "warning"
                                                            });
                                                            break;
                                                        }
                                                    } else {
                                                        this.$message({
                                                            message:
                                                                "房源信息-业主关系不能为空",
                                                            type: "warning"
                                                        });
                                                        break;
                                                    }
                                                } else {
                                                    this.$message({
                                                        message:
                                                            "房源信息-业主电话号码不正确",
                                                        type: "warning"
                                                    });
                                                    break;
                                                }
                                            } else {
                                                this.$message({
                                                    message:
                                                        "房源信息-业主电话号码不正确",
                                                    type: "warning"
                                                });
                                                break;
                                            }
                                        } else {
                                            this.$message({
                                                message:
                                                    "房源信息-业主姓名不正确",
                                                type: "warning"
                                            });
                                            break;
                                        }
                                    } else {
                                        this.$message({
                                            message:
                                                "房源信息-业主姓名不能为空",
                                            type: "warning"
                                        });
                                        break;
                                    }
                                } else {
                                    this.$message({
                                        message:
                                            "房源信息-业主姓名不能为空",
                                        type: "warning"
                                    });
                                    break;
                                }
                            }
                            if (isOk) {
                                if ( ownerRightRatio === 100 || this.contractForm.type === 1) {
                                    if (this.contractForm.guestInfo.GuestStoreCode) {
                                        //客户产权比
                                        let guestRightRatio = 0;
                                        let isOk_;
                                        // this.guestList.forEach(element => {
                                        let guestArr = this.guestList.map(
                                            item => Object.assign({}, item)
                                        );
                                        guestArr.forEach(
                                            (element, index) => {
                                                if (element.isEncryption) {
                                                    element.encryptionMobile = this.guestList_[index].encryptionMobile;
                                                } else {element.encryptionMobile = element.mobile;}
                                            }
                                        );
                                        for (var i = 0;i < guestArr.length;i++) {
                                            let element = guestArr[i];
                                            isOk_ = false;
                                            if (element.name) {
                                                if (element.name.replace(/\s/g,"")) {element.name = element.name.replace(/\s/g,"");
                                                    if (element.name.indexOf("先生") === -1 && element.name.indexOf("女士") === -1) {
                                                        if (element.encryptionMobile.length===11||true) {
                                                            let reg = /^1[0-9]{10}$/; //手机号正则
                                                            let reg_ = /^0\d{2,3}\-?\d{7,8}$/; //固话正则
                                                            if (reg.test(element.encryptionMobile)||reg_.test( element.encryptionMobile)) {
                                                                if (element.relation) {
                                                                    if ((this.contractForm.type===1&&element.cardType)||this.contractForm.type!==1) {
                                                                        if (this.type ===2) {
                                                                            if (!element.propertyRightRatio) {
                                                                                element.propertyRightRatio="0";
                                                                            }
                                                                        }
                                                                        if ((element.propertyRightRatio&&element.propertyRightRatio>0)||element.propertyRightRatio==="0"||this.contractForm.type===1) {
                                                                            if (element.encryptionCode.replace(/\s/g,"")) {
                                                                                if (this.contractForm.type===1) {
                                                                                    if (element.cardType!==1) {
                                                                                        element.encryptionCode = element.encryptionCode.replace(/[&\|\\\*^%$#@\-]/g,"");
                                                                                    }
                                                                                }
                                                                                if ((element.cardType===1&&this.isIdCardNo(element.encryptionCode))||(element.cardType===2&&element.encryptionCode.length<=30)||(element.cardType===4&&element.encryptionCode.length <=10)) {
                                                                                    if(element.email){
                                                                                        let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
                                                                                        if(reg.test(element.email)){
                                                                                            isOk_ = true;
                                                                                            guestRightRatio += element.propertyRightRatio - 0;
                                                                                        }else{
                                                                                            this.$message({
                                                                                                message:"客源信息-客户邮箱不正确",
                                                                                                type:"warning"
                                                                                            });
                                                                                            break;
                                                                                        }
                                                                                    }else{
                                                                                        isOk_ = true;
                                                                                        guestRightRatio+=element.propertyRightRatio-0;
                                                                                    }
                                                                                } else if(element.cardType === 3 && element.encryptionCode.length <= 20){
                                                                                    element.lepIdentity = element.lepIdentity?element.lepIdentity.replace(/[&\|\\\*^%$#@\-]/g,""):'';
                                                                                    if(this.recordType===10&&element.companyName&&element.lepName&&element.lepIdentity&&this.isIdCardNo(element.lepIdentity)||this.recordType!=10){
                                                                                        if(element.email){
                                                                                            let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
                                                                                            if(reg.test(element.email)){
                                                                                                isOk_ = true;
                                                                                                guestRightRatio += element.propertyRightRatio - 0;
                                                                                            }else{
                                                                                                this.$message({
                                                                                                    message:"客源信息-客户邮箱不正确",
                                                                                                    type:"warning"
                                                                                                });
                                                                                                break;
                                                                                            }
                                                                                        }else{
                                                                                            isOk_ = true;
                                                                                            guestRightRatio+=element.propertyRightRatio-0;
                                                                                        }
                                                                                    }else{
                                                                                        this.$message(
                                                                                            {
                                                                                                message:`客源信息-客户${!element.companyName?'企业名称':!element.lepName?'法人名称':'法人身份证号码'}不正确`,
                                                                                                type:"warning"
                                                                                            }
                                                                                        );
                                                                                    }
                                                                                }else {
                                                                                    this.$message(
                                                                                        {
                                                                                            message:
                                                                                                "客源信息-客户证件号不正确",
                                                                                            type:
                                                                                                "warning"
                                                                                        }
                                                                                    );
                                                                                    break;
                                                                                }
                                                                            } else {
                                                                                this.$message(
                                                                                    {
                                                                                        message:
                                                                                            "客源信息-客户证件号不能为空",
                                                                                        type:
                                                                                            "warning"
                                                                                    }
                                                                                );
                                                                                break;
                                                                            }
                                                                        } else {
                                                                            this.$message(
                                                                                {
                                                                                    message:
                                                                                        "客源信息-客户产权比不能为空或负",
                                                                                    type:
                                                                                        "warning"
                                                                                }
                                                                            );
                                                                            break;
                                                                        }
                                                                    } else {
                                                                        this.$message(
                                                                            {
                                                                                message:
                                                                                    "客源信息-客户证件类型不能为空",
                                                                                type:
                                                                                    "warning"
                                                                            }
                                                                        );
                                                                        break;
                                                                    }
                                                                } else {
                                                                    this.$message(
                                                                        {
                                                                            message:
                                                                                "客源信息-客户关系不能为空",
                                                                            type:
                                                                                "warning"
                                                                        }
                                                                    );
                                                                    break;
                                                                }
                                                            } else {
                                                                this.$message(
                                                                    {
                                                                        message:
                                                                            "客源信息-客户电话号码不正确",
                                                                        type:
                                                                            "warning"
                                                                    }
                                                                );
                                                                break;
                                                            }
                                                        } else {
                                                            this.$message({
                                                                message:
                                                                    "客源信息-客户电话号码不正确",
                                                                type:
                                                                    "warning"
                                                            });
                                                            break;
                                                        }
                                                    } else {
                                                        this.$message({
                                                            message:
                                                                "客源信息-客户姓名不正确",
                                                            type: "warning"
                                                        });
                                                        break;
                                                    }
                                                } else {
                                                    this.$message({
                                                        message:
                                                            "客源信息-客户姓名不能为空",
                                                        type: "warning"
                                                    });
                                                    break;
                                                }
                                            } else {
                                                this.$message({
                                                    message:
                                                        "客源信息-客户姓名不能为空",
                                                    type: "warning"
                                                });
                                                break;
                                            }
                                        }
                                        if (isOk_) {
                                            if (
                                                guestRightRatio === 100 ||
                                                this.contractForm.type === 1
                                            ) {
                                                // 验证手机号是否重复  2019.10.17 张丽茹更改需求 业主之间电话号码可以重复 客户之间电话号码可以重复 但业主和客户电话号码不能重复
                                                let ownerMobileList = [];
                                                let guestMobileList = [];
                                                //验证身份证是否重复
                                                let IdCardList = [];
                                                //验证护照是否重复
                                                let passportList = [];
                                                //验证营业执照是否重复
                                                let businessList = [];
                                                //验证军官证是否重复
                                                let militaryIDList = [];

                                                ownerArr.forEach(
                                                    element => {
                                                        if (
                                                            element.cardType ===
                                                            1
                                                        ) {
                                                            IdCardList.push(
                                                                element.encryptionCode
                                                            );
                                                        }
                                                        if (
                                                            element.cardType ===
                                                            2
                                                        ) {
                                                            passportList.push(
                                                                element.encryptionCode
                                                            );
                                                        }
                                                        if (
                                                            element.cardType ===
                                                            3
                                                        ) {
                                                            businessList.push(
                                                                element.encryptionCode
                                                            );
                                                        }
                                                        if (
                                                            element.cardType ===
                                                            4
                                                        ) {
                                                            militaryIDList.push(
                                                                element.encryptionCode
                                                            );
                                                        }
                                                        let obj = JSON.parse(
                                                            JSON.stringify(
                                                                element
                                                            )
                                                        );
                                                        obj.encryptionMobile = obj.encryptionMobile.replace(
                                                            "-",
                                                            ""
                                                        );
                                                        ownerMobileList.push(
                                                            obj.encryptionMobile
                                                        );
                                                    }
                                                );

                                                guestArr.forEach(
                                                    element => {
                                                        if (
                                                            element.cardType ===
                                                            1
                                                        ) {
                                                            IdCardList.push(
                                                                element.encryptionCode
                                                            );
                                                        }
                                                        if (
                                                            element.cardType ===
                                                            2
                                                        ) {
                                                            passportList.push(
                                                                element.encryptionCode
                                                            );
                                                        }
                                                        if (
                                                            element.cardType ===
                                                            3
                                                        ) {
                                                            businessList.push(
                                                                element.encryptionCode
                                                            );
                                                        }
                                                        if (
                                                            element.cardType ===
                                                            4
                                                        ) {
                                                            militaryIDList.push(
                                                                element.encryptionCode
                                                            );
                                                        }
                                                        let obj = JSON.parse(
                                                            JSON.stringify(
                                                                element
                                                            )
                                                        );
                                                        obj.encryptionMobile = obj.encryptionMobile.replace(
                                                            "-",
                                                            ""
                                                        );
                                                        guestMobileList.push(
                                                            obj.encryptionMobile
                                                        );
                                                    }
                                                );
                                                let ownerGuestMobile = true;
                                                let otherMobile = true;
                                                if (
                                                    this.contractForm
                                                        .isHaveCooperation ===
                                                        1 &&
                                                    this.contractForm
                                                        .otherCooperationInfo
                                                        .mobile
                                                ) {
                                                    // mobileList.push(this.contractForm.otherCooperationInfo.mobile)
                                                    let allMobileList = ownerMobileList.concat(
                                                        guestMobileList
                                                    );
                                                    for (
                                                        let i = 0;
                                                        i <
                                                        allMobileList.length;
                                                        i++
                                                    ) {
                                                        if (
                                                            allMobileList[
                                                                i
                                                            ] ===
                                                            this
                                                                .contractForm
                                                                .otherCooperationInfo
                                                                .mobile
                                                        ) {
                                                            otherMobile = false;
                                                            break;
                                                        }
                                                    }
                                                    for (
                                                        let index = 0;
                                                        index <
                                                        guestMobileList.length;
                                                        index++
                                                    ) {
                                                        if (
                                                            ownerMobileList.includes(
                                                                guestMobileList[
                                                                    index
                                                                ]
                                                            )
                                                        ) {
                                                            ownerGuestMobile = false;
                                                            break;
                                                        }
                                                    }
                                                } else {
                                                    for (
                                                        let index = 0;
                                                        index <
                                                        guestMobileList.length;
                                                        index++
                                                    ) {
                                                        if (
                                                            ownerMobileList.includes(
                                                                guestMobileList[
                                                                    index
                                                                ]
                                                            )
                                                        ) {
                                                            ownerGuestMobile = false;
                                                            break;
                                                        }
                                                    }
                                                }
                                                if (
                                                    this.contractForm
                                                        .isHaveCooperation ===
                                                        1 &&
                                                    this.contractForm
                                                        .otherCooperationInfo
                                                        .identifyCode
                                                ) {
                                                    IdCardList.push(
                                                        this.contractForm
                                                            .otherCooperationInfo
                                                            .identifyCode
                                                    );
                                                }
                                                let IdCardList_ = Array.from(
                                                    new Set(IdCardList)
                                                );
                                                let passportList_ = Array.from(
                                                    new Set(passportList)
                                                );
                                                let businessList_ = Array.from(
                                                    new Set(businessList)
                                                );
                                                let militaryIDList_ = Array.from(
                                                    new Set(militaryIDList)
                                                );
                                                if (
                                                    ownerGuestMobile &&
                                                    otherMobile
                                                ) {
                                                    if (
                                                        IdCardList.length ===
                                                        IdCardList_.length
                                                    ) {
                                                        if (
                                                            passportList.length ===
                                                            passportList_.length
                                                        ) {
                                                            if (
                                                                businessList.length ===
                                                                businessList_.length
                                                            ) {
                                                                if (
                                                                    militaryIDList.length ===
                                                                    militaryIDList_.length
                                                                ) {
                                                                    //验证三方合作
                                                                    if (
                                                                        this
                                                                            .contractForm
                                                                            .isHaveCooperation
                                                                    ) {
                                                                        let mobileOk = true;
                                                                        let IDcardOk = true;
                                                                        if (
                                                                            this
                                                                                .contractForm
                                                                                .otherCooperationInfo
                                                                                .mobile
                                                                        ) {
                                                                            mobileOk = false;
                                                                            let reg = /^1[0-9]{10}$/;
                                                                            let reg_ = /^0\d{2,3}\-?\d{7,8}$/; //固话正则
                                                                            if (
                                                                                reg.test(
                                                                                    this
                                                                                        .contractForm
                                                                                        .otherCooperationInfo
                                                                                        .mobile
                                                                                ) ||
                                                                                reg_.test(
                                                                                    this
                                                                                        .contractForm
                                                                                        .otherCooperationInfo
                                                                                        .mobile
                                                                                )
                                                                            ) {
                                                                                mobileOk = true;
                                                                            } else {
                                                                                this.$message(
                                                                                    {
                                                                                        message:
                                                                                            "三方合作-电话号码不正确",
                                                                                        type:
                                                                                            "warning"
                                                                                    }
                                                                                );
                                                                            }
                                                                        }
                                                                        if (
                                                                            this
                                                                                .contractForm
                                                                                .otherCooperationInfo
                                                                                .identifyCode
                                                                        ) {
                                                                            IDcardOk = false;
                                                                            if (
                                                                                this.isIdCardNo(
                                                                                    this
                                                                                        .contractForm
                                                                                        .otherCooperationInfo
                                                                                        .identifyCode
                                                                                )
                                                                            ) {
                                                                                IDcardOk = true;
                                                                            } else {
                                                                                this.$message(
                                                                                    {
                                                                                        message:
                                                                                            "三方合作-身份证号不正确",
                                                                                        type:
                                                                                            "warning"
                                                                                    }
                                                                                );
                                                                            }
                                                                        }
                                                                        if (
                                                                            mobileOk &&
                                                                            IDcardOk
                                                                        ) {
                                                                            this.dialogSave = true;
                                                                        }
                                                                    } else {
                                                                        this.dialogSave = true;
                                                                    }
                                                                } else {
                                                                    this.$message(
                                                                        {
                                                                            message:
                                                                                "军官证重复",
                                                                            type:
                                                                                "warning"
                                                                        }
                                                                    );
                                                                }
                                                            } else {
                                                                this.$message(
                                                                    {
                                                                        message:
                                                                            "营业执照重复",
                                                                        type:
                                                                            "warning"
                                                                    }
                                                                );
                                                            }
                                                        } else {
                                                            this.$message({
                                                                message:
                                                                    "护照重复",
                                                                type:
                                                                    "warning"
                                                            });
                                                        }
                                                    } else {
                                                        this.$message({
                                                            message:
                                                                "身份证号重复",
                                                            type: "warning"
                                                        });
                                                    }
                                                } else {
                                                    this.$message({
                                                        message:
                                                            "电话号码重复",
                                                        type: "warning"
                                                    });
                                                }
                                            } else {
                                                this.$message({
                                                    message:
                                                        "客源信息-客户产权比和必须为100%",
                                                    type: "warning"
                                                });
                                            }
                                        }
                                    } else {
                                        this.$message({
                                            message:
                                                "客源信息-客源方门店不能为空",
                                            type: "warning"
                                        });
                                    }
                                } else {
                                    this.$message({
                                        message:
                                            "房源信息-业主产权比和必须为100%",
                                        type: "warning"
                                    });
                                }
                            }
                        } else {
                            this.$message({
                                message: "房源信息-产权地址未填写完整",
                                type: "warning"
                            });
                        }
                    } else {
                        this.$message({
                            message: `房源信息-${
                                this.contractForm.type === 1
                                    ? "租金"
                                    : "成交总价"
                            }不能为零`,
                            type: "warning"
                        });
                    }
                } else {
                    this.$message({
                        message: "合同信息-佣金不能为零",
                        type: "warning"
                    });
                }
            })
            .catch(error => {
                this.$message({
                    message: `${error.title.length < 3 ? "" : "合同信息-"}${
                        error.title
                    }${error.msg}`,
                    type: "warning"
                });
            });
        },
        saveCont() {
            this.fullscreenLoading = true;
            this.addContract();
        },
        // 新增/编辑合同
        addContract() {
            this.fullscreenLoading = true;
            this.dialogSave = false;
            this.contractForm.contPersons = [];
            let ownerArr = this.ownerList.map(item => Object.assign({}, item));
            let guestArr = this.guestList.map(item => Object.assign({}, item));
            ownerArr.forEach((element, index) => {
                if (element.isEncryption) {
                    element.encryptionMobile = this.ownerList_[index].encryptionMobile;
                } else {
                    element.encryptionMobile = element.mobile;
                }
                delete element.isEncryption;
                this.contractForm.contPersons.push(element);
            });
            guestArr.forEach((element, index) => {
                if (element.isEncryption) {
                    element.encryptionMobile = this.guestList_[index].encryptionMobile;
                } else {
                    element.encryptionMobile = element.mobile;
                }
                delete element.isEncryption;
                this.contractForm.contPersons.push(element);
            });
            if (this.contractForm.type === 1) {
                //租赁合同
                var param = {
                    leaseCont: this.contractForm,
                    type: this.type,
                    haveExamine: this.haveExamine
                };
            } else if (this.contractForm.type === 2 || this.contractForm.type === 3) {
                //买卖代办合同
                var param = {
                    saleCont: this.contractForm,
                    type: this.type,
                    haveExamine: this.haveExamine
                };
                if (this.loanType) {
                    //武汉买卖分贷款 全款
                    param.loanType = this.loanType;
                }
            }
            // if (this.recordType === 2) {
            //     param.recordType = 2;
            // } else {
            //     param.recordType = 1;
            // }
            param.recordType=this.recordType
            if (this.type === 1) {
                //新增
                if(this.isDeal){
                    let paramType = this.contractForm.type === 1 ? "leaseCont" : "saleCont"
                    delete param[paramType].contChangeState;
                    delete param[paramType].contState;
                    delete param[paramType].contType;
                    delete param[paramType].laterStageState;
                    delete param[paramType].toExamineState;
                    delete param[paramType].previewImg;
                    delete param[paramType].subscriptionTerm;
                    delete param[paramType].updateTime;
                    delete param[paramType].distributableAchievement;
                    delete param[paramType].achievementState;
                    delete param[paramType].recordType;
                    delete param[paramType].resultState;
                
                    param[paramType].dealById = this.id
                    param[paramType].dealByCode = this.contractForm.code
                    param[paramType].isTransfeOfCommission = this.isToCommission
                }else{
                    delete param.dealById
                }
                var url = "/api/contract/addContract";
                if (this.recordType === 2) {
                    url = "/api/contract/addLocalContract";
                }
                this.$ajax.postJSON(url, param).then(res => {
                        res = res.data;
                        if (res.status === 200) {
                            this.fullscreenLoading = false;
                            if (this.recordType === 2) {
                                this.$message({
                                    message: "创建成功",
                                    type: "success"
                                });
                                this.$router.push({
                                    path: "/contractDetails",
                                    query: {
                                        id: res.data.id,
                                        contType: this.contractForm.type,
                                        type: "contBody"
                                    }
                                });
                            } else {
                                let contractMsg = res.data;
                                this.hidBtn = 1;
                                sessionStorage.setItem("contractMsg",JSON.stringify(contractMsg));
                                if (contractMsg.singleCompany) {
                                    this.singleCompany = true;
                                    this.singleCompanyName = contractMsg.singleCompany;
                                } else {
                                    this.$router.push({
                                        path: "/extendParams"
                                    });
                                }
                            }
                        }
                    })
                    .catch(error => {
                        this.fullscreenLoading = false;
                        if (error !== "该合同房源已被其他合同录入，请重新选择房源！" && error !== "该合同下的房源客源不属于同一个体系，请重新选择！" && error !== "纸质合同编号规则不允许和系统生成规则一致，请重新输入！" && error !== "合同编号已存在，请重新输入！" && error !== "合同编号不符合规范！") {
                            this.canClick = true;
                        }
                        this.$message({
                            message: error,
                            type: "error"
                        });
                    });
            } else{
                //  if (this.type === 2) 
                //编辑
                if (this.contractForm.type === 1) {
                    delete param.leaseCont.contChangeState;
                    delete param.leaseCont.contState;
                    delete param.leaseCont.contType;
                    delete param.leaseCont.laterStageState;
                    delete param.leaseCont.toExamineState;
                    delete param.leaseCont.previewImg;
                    delete param.leaseCont.subscriptionTerm;
                    delete param.leaseCont.updateTime;
                    delete param.leaseCont.distributableAchievement;
                    delete param.leaseCont.achievementState;
                    delete param.leaseCont.recordType;
                    delete param.leaseCont.resultState;
                    param.leaseCont.isTransfeOfCommission = this.isToCommission
                } else if ( this.contractForm.type === 2 || this.contractForm.type === 3 ) {
                    delete param.saleCont.contChangeState;
                    delete param.saleCont.contState;
                    delete param.saleCont.contType;
                    delete param.saleCont.laterStageState;
                    delete param.saleCont.toExamineState;
                    delete param.saleCont.previewImg;
                    delete param.saleCont.subscriptionTerm;
                    delete param.saleCont.updateTime;
                    delete param.saleCont.distributableAchievement;
                    delete param.saleCont.achievementState;
                    delete param.saleCont.recordType;
                    delete param.saleCont.resultState;
                    param.saleCont.isTransfeOfCommission = this.isToCommission
                }
                var url = "/api/contract/updateContract";
                if (this.recordType === 2) {
                    url = "/api/contract/addLocalContract";
                }

                this.$ajax
                    .postJSON(url, param)
                    .then(res => {
                        res = res.data;
                        if (res.status === 200) {
                            this.fullscreenLoading = false;
                            if (this.recordType === 2) {
                                this.$message({
                                    message: "保存成功",
                                    type: "success"
                                });
                                if (this.canInput) {
                                    //已签约状态编辑完成跳转合同列表
                                    this.$router.push({
                                        path: "/contractList"
                                    });
                                } else {
                                    this.$router.push({
                                        path: "/contractDetails",
                                        query: {
                                            id: res.data.id,
                                            contType: this.contractForm.type,
                                            type: "contBody"
                                        }
                                    });
                                }
                            } else {
                                if (this.canInput) {
                                    //已签约状态编辑完成跳转合同列表
                                    this.$message({
                                        message: "保存成功",
                                        type: "success"
                                    });
                                    this.$router.push({
                                        path: "/contractList"
                                    });
                                } else {
                                    let contractMsg = res.data;
                                    sessionStorage.setItem(
                                        "contractMsg",
                                        JSON.stringify(contractMsg)
                                    );
                                    if (contractMsg.singleCompany) {
                                        this.singleCompany = true;
                                        this.singleCompanyName =
                                            contractMsg.singleCompany;
                                    } else {
                                        this.$router.push({
                                            path: "/extendParams"
                                        });
                                    }
                                }
                            }
                        }
                    })
                    .catch(error => {
                        this.fullscreenLoading = false;
                        this.$message({
                            message: error,
                            type: "error"
                        });
                    });
            }
        },
        //跳转H5页面
        toH5() {
            this.singleCompany = false;
            this.$router.push({
                path: "/extendParams"
            });
        },
        //创建成功提示
        toUpload(value) {
            //上传合同资料库
            this.dialogSuccess = false;
            if (this.power["sign-com-htdetail"].state) {
                if (this.power["sign-ht-xq-data-add"].state) {
                    this.setPath(
                        this.$tool.getRouter(
                            ["合同", "合同列表", "合同详情"],
                            "contractList"
                        )
                    );
                    this.$router.replace({
                        path: "/contractDetails",
                        query: {
                            type: "dataBank",
                            id: this.detailId, //合同id
                            code: this.detailCode, //合同编号
                            contType: this.contractForm.type //合同类型
                        }
                    });
                } else {
                    this.$message({
                        message: "没有资料库权限,无法跳转到资料库"
                    });
                    this.$router.push("/contractList");
                }
            } else {
                this.$message({
                    message: "没有合同详情权限,无法跳转到资料库"
                });
                this.$router.push("/contractList");
            }
        },
        toContract() {
            //回到合同列表
            this.dialogSuccess = false;
            this.$router.push("/contractList");
        },
        //获取所在城市的交易类型
        getTransFlow() {
            this.$ajax.get("/api/contract/getTransFlowListByCity").then(res => {
                res = res.data;
                if (res.status === 200) {
                    this.transFlowList = res.data;
                }
            });
        },
        //获取所在城市的人员关系
        getRelation() {
            let param = {
                type: "Relation"
            };
            this.$ajax.get("/api/dictionary/uplus", param).then(res => {
                res = res.data;
                if (res.status === 200) {
                    this.relationList = res.data;
                }
            });
        },
        //房源客源弹窗
        showDialog(value) {
            if (this.contractForm.type === 1) {
                this.contractType = "求租";
            } else {
                this.contractType = "求购";
            }
            this.isShowDialog = true;
            this.dialogType = value;
        },
        //根据房源id获取房源信息
        getHousedetail(id) {
            loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.5)"
            });
            let param = {
                houseId: id
            };
            this.$ajax
                .get("/api/resource/houses/one", param)
                .then(res => {
                    loading.close();
                    res = res.data;
                    if (res.status === 200) {
                        let houseMsg = res.data;
                        this.contractForm.houseinfoCode = houseMsg.PropertyNo; //房源编号
                        houseMsg.CompleteYear = houseMsg.CompleteYear
                            ? houseMsg.CompleteYear
                            : "--";
                        if (!this.canInput) {
                            //正常编辑
                            if (houseMsg.TradeInt === 2) {
                                // this.contractForm.dealPrice = houseMsg.ListingPrice*10000;//成交总价
                            } else {
                                // this.contractForm.dealPrice = houseMsg.ListingPrice;
                                // 1 月 2 季度 4 年
                                let unit;
                                if (houseMsg.PriceUnitNameEnum) {
                                    unit = houseMsg.PriceUnitNameEnum;
                                } else {
                                    unit = 1;
                                }
                                this.$set(this.contractForm, "timeUnit", unit);
                            }
                            this.contractForm.houseInfo = houseMsg;
                            //重新选择房源时清空产权地址
                            this.rightAddrCity = "";
                            this.rightAddrArea = "";
                            this.rightAddrDetail = "";
                            if (houseMsg.OwnerInfoList.length > 0) {
                                this.ownerList = [];
                                this.ownerList_ = [];
                                houseMsg.OwnerInfoList.forEach(element => {
                                    element.type = 1;
                                    element.encryptionCode = "";
                                    element.propertyRightRatio = "";
                                    // element.name=element.OwnerName;
                                    //2019.12.16更改需求不带出姓名
                                    element.name = "";
                                    element.mobile = element.OwnerMobile;
                                    element.relation = element.Relation;
                                    element.cardType = "";
                                    element.isEncryption = true;
                                    delete element.OwnerName;
                                    delete element.OwnerMobile;
                                    delete element.Relation;
                                    let obj = Object.assign({}, element);
                                    obj.mobile = obj.mobile.replace(
                                        /^(\d{3})\d{4}(\d+)/,
                                        "$1****$2"
                                    );
                                    this.ownerList.push(obj);
                                    let obj_ = Object.assign({}, element);
                                    obj_.encryptionMobile = obj_.mobile;
                                    this.ownerList_.push(obj_);
                                });
                            }
                        } else {
                            //已签约编辑
                            //2019.10.14 张丽茹更改需求 已签约编辑房源物业地址需要更新
                            // houseMsg.EstateName=this.contractForm.houseInfo.EstateName
                            // houseMsg.BuildingName=this.contractForm.houseInfo.BuildingName
                            // houseMsg.Unit=this.contractForm.houseInfo.Unit
                            // houseMsg.RoomNo=this.contractForm.houseInfo.RoomNo
                            houseMsg.Square = this.contractForm.houseInfo.Square;
                            houseMsg.SquareUse = this.contractForm.houseInfo.SquareUse;
                            houseMsg.PriceUnitNameEnum = this.contractForm.timeUnit; // 1 月 2 季度 4 年

                            if (this.contractForm.houseInfo.TradeInt === 2) {
                                houseMsg.ListingPrice =
                                    this.contractForm.dealPrice / 10000;
                            } else {
                                houseMsg.ListingPrice = this.contractForm.dealPrice;
                            }
                        }
                        this.contractForm.houseInfo = houseMsg;
                        // this.options.push({
                        //   name: houseMsg.HouseStoreName,
                        //   id: houseMsg.HouseStoreCode
                        // });
                        //获取房源分成人--新增xu
                        let param = {
                            id: houseMsg.PropertyCode,
                            type: 1
                        };
                        // this.getAgentMsg(param)
                    }
                })
                .catch(error => {
                    loading.close();
                    this.$message({
                        message: error,
                        type: "error"
                    });
                });
        },
        //根据客源id获取客源信息
        getGuestDetail(id) {
            loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.5)"
            });
            let param = {
                customerId: id
            };
            this.$ajax
                .get("/api/resource/customers/one", param)
                .then(res => {
                    loading.close();
                    res = res.data;
                    if (res.status === 200) {
                        let guestMsg = res.data;
                        this.contractForm.guestinfoCode = guestMsg.InquiryNo; //客源编号
                        if (!this.canInput) {
                            //正常编辑
                            this.contractForm.guestInfo = guestMsg;
                            this.$set(
                                this.contractForm.guestInfo,
                                "paymentMethod",
                                1
                            );
                            if (guestMsg.OwnerInfo.length > 0) {
                                this.guestList = [];
                                this.guestList_ = [];
                                guestMsg.OwnerInfo.forEach(element => {
                                    element.type = 2;
                                    element.encryptionCode = "";
                                    element.propertyRightRatio = "";
                                    // element.name=element.CustName;
                                    //2019.12.16更改需求不带出姓名
                                    element.name = "";
                                    element.mobile = element.CustMobile;
                                    element.relation = element.CustRelation;
                                    element.cardType = "";
                                    element.isEncryption = true;
                                    delete element.CustName;
                                    delete element.CustMobile;
                                    delete element.CustRelation;
                                    let obj = Object.assign({}, element);
                                    obj.mobile = obj.mobile.replace(
                                        /^(\d{3})\d{4}(\d+)/,
                                        "$1****$2"
                                    );
                                    this.guestList.push(obj);
                                    let obj_ = Object.assign({}, element);
                                    obj_.encryptionMobile = obj_.mobile;
                                    this.guestList_.push(obj_);
                                });
                            }
                        } else {
                            //已签约编辑
                            this.contractForm.guestInfo = guestMsg;
                        }
                        //获取客源分成人
                        let param = {
                            id: guestMsg.InquiryCode,
                            type: 2
                        };
                        // this.getAgentMsg(param)
                    }
                })
                .catch(error => {
                    loading.close();
                    this.$message({
                        message: error,
                        type: "error"
                    });
                });
        },
        //获取分成人信息
        getAgentMsg(param) {
            this.$ajax.get("/api/contract/getAgents", param).then(res => {
                res = res.data;
                if (res.status === 200) {
                    this.agentsList = res.data;
                    this.agentsDialog = true;
                }
            });
        },
        //关闭房源客源弹窗
        closeHouseGuest(value) {
            if (value) {
                //判断是否点击的确认按钮
                if (value.dialogType === "house") {
                    if (
                        this.choseHcode &&
                        this.choseHcode !== value.selectCode
                    ) {
                        this.contractForm.propertyRightAddr = "";
                    }
                    this.isShowDialog = false;
                    this.getHousedetail(value.selectCode);
                    this.choseHcode = value.selectCode;
                } else if (value.dialogType === "guest") {
                    this.isShowDialog = false;
                    this.getGuestDetail(value.selectCode);
                    this.choseGcode = value.selectCode;
                }
            } else {
                this.isShowDialog = false;
            }
        },
        //获取门店
        getShopList() {
            let param = {
                keyword: ""
            };
            this.$ajax.get("/api/contract/getDepsByCityId", param).then(res => {
                this.loading = false;
                res = res.data;
                if (res.status === 200) {
                    this.options = res.data;
                    this.options_ = res.data;
                }
            });
        },
        getShop(id) {
            if (id) {
                this.contractForm.houseInfo.ShopOwnerName = "";
                this.contractForm.houseInfo.ShopOwnerMobile = "";
                this.options.forEach(element => {
                    if (element.id === id) {
                        this.contractForm.houseInfo.HouseStoreName =
                            element.name;
                    }
                });
                let param1 = {
                    depId: id,
                    type: 1
                };
                this.$ajax
                    .get("/api/organize/dep/manager", param1)
                    .then(res => {
                        res = res.data;
                        if (res.status === 200) {
                            if (res.data) {
                                this.contractForm.houseInfo.ShopOwnerName =
                                    res.data.name;
                                this.contractForm.houseInfo.ShopOwnerMobile =
                                    res.data.mobile;
                            } else {
                                let param2 = {
                                    depId: id,
                                    type: 2
                                };
                                this.$ajax
                                    .get("/api/organize/dep/manager", param2)
                                    .then(res => {
                                        res = res.data;
                                        if (res.status === 200) {
                                            if (res.data) {
                                                this.contractForm.houseInfo.ShopOwnerName =
                                                    res.data.name;
                                                this.contractForm.houseInfo.ShopOwnerMobile =
                                                    res.data.mobile;
                                            } else {
                                                let param3 = {
                                                    depId: id,
                                                    type: 3
                                                };
                                                this.$ajax
                                                    .get(
                                                        "/api/organize/dep/manager",
                                                        param3
                                                    )
                                                    .then(res => {
                                                        res = res.data;
                                                        if (
                                                            res.status === 200
                                                        ) {
                                                            if (res.data) {
                                                                this.contractForm.houseInfo.ShopOwnerName =
                                                                    res.data.name;
                                                                this.contractForm.houseInfo.ShopOwnerMobile =
                                                                    res.data.mobile;
                                                            } else {
                                                                this.$message({
                                                                    message:
                                                                        "该门店没有店长",
                                                                    type:
                                                                        "warning"
                                                                });
                                                            }
                                                        }
                                                    });
                                            }
                                        }
                                    });
                            }
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
        getShop_(id) {
            if (id) {
                this.contractForm.guestInfo.ShopOwnerName = "";
                this.contractForm.guestInfo.ShopOwnerMobile = "";
                this.options_.forEach(element => {
                    if (element.id === id) {
                        this.contractForm.guestInfo.GuestStoreName =
                            element.name;
                    }
                });
                let param1 = {
                    depId: id,
                    type: 1
                };
                this.$ajax
                    .get("/api/organize/dep/manager", param1)
                    .then(res => {
                        res = res.data;
                        if (res.status === 200) {
                            if (res.data) {
                                this.contractForm.guestInfo.ShopOwnerName =
                                    res.data.name;
                                this.contractForm.guestInfo.ShopOwnerMobile =
                                    res.data.mobile;
                            } else {
                                let param2 = {
                                    depId: id,
                                    type: 2
                                };
                                this.$ajax
                                    .get("/api/organize/dep/manager", param2)
                                    .then(res => {
                                        res = res.data;
                                        if (res.status === 200) {
                                            if (res.data) {
                                                this.contractForm.guestInfo.ShopOwnerName =
                                                    res.data.name;
                                                this.contractForm.guestInfo.ShopOwnerMobile =
                                                    res.data.mobile;
                                            } else {
                                                let param3 = {
                                                    depId: id,
                                                    type: 3
                                                };
                                                this.$ajax
                                                    .get(
                                                        "/api/organize/dep/manager",
                                                        param3
                                                    )
                                                    .then(res => {
                                                        res = res.data;
                                                        if (
                                                            res.status === 200
                                                        ) {
                                                            if (res.data) {
                                                                this.contractForm.guestInfo.ShopOwnerName =
                                                                    res.data.name;
                                                                this.contractForm.guestInfo.ShopOwnerMobile =
                                                                    res.data.mobile;
                                                            } else {
                                                                this.$message({
                                                                    message:
                                                                        "该门店没有店长"
                                                                });
                                                            }
                                                        }
                                                    });
                                            }
                                        }
                                    });
                            }
                        }
                    })
                    .catch(error => {
                        this.$message({
                            message: error
                        });
                    });
            }
        },
        allClear(type) {
            if (type === "owner") {
                this.contractForm.houseInfo.ShopOwnerName = "";
                this.contractForm.houseInfo.ShopOwnerMobile = "";
            } else if (type === "guest") {
                this.contractForm.guestInfo.ShopOwnerName = "";
                this.contractForm.guestInfo.ShopOwnerMobile = "";
            }
        },
        //获取合同信息
        getContractDetail() {
            let param = {
                id: this.id
            };
            this.$ajax.get("/api/contract/detail", param).then(res => {
                res = res.data;
                if (res.status === 200) {
                    this.contractForm = res.data;
                    this.recordId = res.data.recordId;
                    this.isHaveDetail = true;
                    this.recordType=this.contractForm.recordType.value
                    // this.contractForm.estTransferTime=this.contractForm.estTransferTime?TOOL.dateFormat(this.contractForm.estTransferTime):''
                    if(this.contractForm.estTransferTime){
                        this.$set(this.contractForm,'estTransferTime',TOOL.dateFormat(this.contractForm.estTransferTime))
                    }else{
                        this.$set(this.contractForm,'estTransferTime','')
                    }
                    this.contVersion = res.data.recordVersion; //合同基本信息版式（1 基础版  2 复杂版）
                    if (this.contVersion === 1) {
                        //经纪人
                        let option = {
                            empId: res.data.dealAgentId,
                            empName: res.data.dealAgentName,
                            depId: res.data.dealAgentStoreId,
                            depName: res.data.dealAgentStoreName
                        };
                        if (option.empId) {
                            this.basicsOptions = [option];
                        } else {
                            this.contractForm.dealAgentId = "";
                        }
                    }
                    if (res.data.remarks && res.data.remarks.length > 0) {
                        this.showRemark = true;
                    }
                    if (res.data.loanType) {
                        //武汉买卖 全款贷款
                        this.loanType = res.data.loanType;
                    }
                    // this.contractForm.signDate = res.data.signDate.substr(0, 10);
                    // this.isDeal=this.contractForm.dealById?1:0 //是否是转成交的合同
                    this.isToCommission=this.contractForm.isTransfeOfCommission?true:false
                    let isDealTpe = this.contractForm.houseinfoCode && this.contractForm.houseinfoCode.search("Z") === 0 ? 1 : 2;
                    this.contractForm.type = this.$route.query.isDeal ? Number(isDealTpe) : res.data.contType.value;
                    if(this.$route.query.isDeal){//转成交
                        this.ys=this.contractForm.receivableCommission //应收金额
                        this.ss=this.contractForm.receivedCommission //实收
                        this.ws=this.contractForm.uncollectedCommission //未收金额
                        this.yt=this.contractForm.retiredCommission //已退金额
                        this.zy = Number(this.contractForm.receivedCommission) - Number(this.contractForm.retiredCommission) //转佣金额
                        this.countTotal();
                    }else if(!this.$route.query.isDeal&&!this.contractForm.dealById){
                        this.countTotal();
                    }
                    if(this.contractForm.dealById&&this.type===2){//编辑转成交的合同
                        this.getZYInfo(this.contractForm.id)
                    }
                    //合同状态为已签约且未结算时只允许编辑房客源编号
                    if (this.contractForm.recordType.value === 1 && res.data.resultState.value === 1 && res.data.contState.value === 3 && !this.$route.query.isDeal) {
                        this.canInput = true;
                    }
                    //线下合同已签约状态除签约时间、合同类型、房客源编号、物业地址不支持编辑外，其他都字段均支持修改
                    if (this.contractForm.recordType.value === 2 && this.contractForm.contState.value === 3) {
                        this.offLine = true;
                    }
                    this.sourceBtnCheck = res.data.contState.value === 3 ? false : true;
                    let rightAddress = res.data.propertyRightAddr;
                    let index1 = rightAddress.indexOf("市");
                    let index2 = rightAddress.indexOf("区");
                    if (index1 > 0) {
                        this.rightAddrCity = rightAddress.substring(0, index1);
                    }
                    if (index2 > 0) {
                        if (index1 > 0) {
                            this.rightAddrArea = rightAddress.substring(
                                index1 + 1,
                                index2
                            );
                        } else {
                            this.rightAddrArea = rightAddress.substring(
                                0,
                                index2
                            );
                        }
                    }
                    if (index1 > 0 && index2 > 0) {
                        this.rightAddrDetail = rightAddress.substring(
                            index2 + 1
                        );
                    } else if (index1 > 0 && index2 < 0) {
                        this.rightAddrDetail = rightAddress.substring(
                            index1 + 1
                        );
                    } else if (index1 < 0 && index2 > 0) {
                        this.rightAddrDetail = rightAddress.substring(
                            index2 + 1
                        );
                    } else {
                        this.rightAddrDetail = rightAddress;
                    }

                    // this.contractForm.extendParams=JSON.parse(res.data.extendParams);
                    // this.options.push({id:res.data.houseInfo.HouseStoreCode,name:res.data.houseInfo.HouseStoreName});
                    // this.options_.push({id:res.data.guestInfo.GuestStoreCode,name:res.data.guestInfo.GuestStoreName});
                    if (res.data.isHaveCooperation) {
                        this.cooperation = true;
                    }
                    this.ownerList = [];
                    this.guestList = [];
                    for ( var i = 0; i < this.contractForm.contPersons.length; i++ ) {
                        if ( this.contractForm.contPersons[i].personType.value === 1 ) {
                            let element = {
                                name: this.contractForm.contPersons[i].name,
                                mobile: this.contractForm.contPersons[i].mobile,
                                pid: this.contractForm.contPersons[i].pid,
                                encryptionMobile: this.contractForm.contPersons[i].encryptionMobile,
                                relation: this.contractForm.contPersons[i].relation,
                                propertyRightRatio: this.contractForm.contPersons[i].propertyRightRatio,
                                identifyCode: this.contractForm.contPersons[i].identifyCode,
                                encryptionCode: this.contractForm.contPersons[i].encryptionCode,
                                cardType: this.contractForm.contPersons[i].cardType,
                                email: this.contractForm.contPersons[i].email==='-'?'':this.contractForm.contPersons[i].email,
                                lepName: this.contractForm.contPersons[i].lepName==='-'?'':this.contractForm.contPersons[i].lepName,
                                companyName: this.contractForm.contPersons[i].companyName==='-'?'':this.contractForm.contPersons[i].companyName,
                                lepIdentity: this.contractForm.contPersons[i].lepIdentity==='-'?'':this.contractForm.contPersons[i].lepIdentity,
                                type: 1,
                                isEncryption: true
                            };
                            let obj = Object.assign({}, element);
                            // obj.mobile=obj.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
                            this.ownerList.push(obj);
                            let obj_ = Object.assign({}, element);
                            this.ownerList_.push(obj_);
                        } else if (this.contractForm.contPersons[i].personType.value === 2) {
                            let element = {
                                name: this.contractForm.contPersons[i].name,
                                mobile: this.contractForm.contPersons[i].mobile,
                                pid: this.contractForm.contPersons[i].pid,
                                encryptionMobile: this.contractForm.contPersons[i].encryptionMobile,
                                relation: this.contractForm.contPersons[i].relation,
                                propertyRightRatio: this.contractForm.contPersons[i].propertyRightRatio,
                                identifyCode: this.contractForm.contPersons[i].identifyCode,
                                encryptionCode: this.contractForm.contPersons[i].encryptionCode,
                                cardType: this.contractForm.contPersons[i].cardType,
                                email: this.contractForm.contPersons[i].email==='-'?'':this.contractForm.contPersons[i].email,
                                lepName: this.contractForm.contPersons[i].lepName==='-'?'':this.contractForm.contPersons[i].lepName,
                                companyName: this.contractForm.contPersons[i].companyName==='-'?'':this.contractForm.contPersons[i].companyName,
                                lepIdentity: this.contractForm.contPersons[i].lepIdentity==='-'?'':this.contractForm.contPersons[i].lepIdentity,
                                type: 2,
                                isEncryption: true
                            };
                            let obj = Object.assign({}, element);
                            // obj.mobile=obj.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
                            this.guestList.push(obj);
                            let obj_ = Object.assign({}, element);
                            this.guestList_.push(obj_);
                        }
                    }
                }
            });
        },
        cutNumber(val) {
            if (val === "contCode") {
                //合同编号
            } else if (val === "dealPrice") {
                this.$nextTick(() => {
                    this.contractForm.dealPrice = this.$tool.cutFloat({
                        val: this.contractForm.dealPrice,
                        max: 999999999.99
                    });
                });
            } else if (val === "custEnsure") {
                this.$nextTick(() => {
                    this.contractForm.custEnsure = this.$tool.cutFloat({
                        val: this.contractForm.custEnsure,
                        max: 999999999.99
                    });
                });
            } else if (val === "custCommission") {
                this.$nextTick(() => {
                    this.contractForm.custCommission = this.$tool.cutFloat({
                        val: this.contractForm.custCommission,
                        max: 999999999.99
                    });
                });
            } else if (val === "ownerCommission") {
                this.$nextTick(() => {
                    this.contractForm.ownerCommission = this.$tool.cutFloat({
                        val: this.contractForm.ownerCommission,
                        max: 999999999.99
                    });
                });
            } else if (val === "commissionPayment") {
                this.$nextTick(() => {
                    this.contractForm.commissionPayment = this.$tool.cutFloat({
                        val: this.contractForm.commissionPayment,
                        max: 999999999.99
                    });
                });
            } else if (val === "stagesArrears") {
                this.$nextTick(() => {
                    this.contractForm.houseInfo.stagesArrears = this.$tool.cutFloat(
                        {
                            val: this.contractForm.houseInfo.stagesArrears,
                            max: 999999999.99
                        }
                    );
                });
            } else if (val === "otherCooperationCost") {
                this.$nextTick(() => {
                    this.contractForm.otherCooperationCost = this.$tool.cutFloat(
                        {
                            val: this.contractForm.otherCooperationCost,
                            max: 999999999.99
                        }
                    );
                });
            } else if (val === "Square") {
                this.$nextTick(() => {
                    this.contractForm.houseInfo.Square = this.$tool.cutFloat({
                        val: this.contractForm.houseInfo.Square,
                        max: 999999.99
                    });
                });
            } else if (val === "SquareUse") {
                this.$nextTick(() => {
                    this.contractForm.houseInfo.SquareUse = this.$tool.cutFloat(
                        {
                            val: this.contractForm.houseInfo.SquareUse,
                            max: 999999.99
                        }
                    );
                });
            }
        },
        cutNumber_(index, type) {
            if (type === "guest") {
                this.guestList[index].propertyRightRatio = this.$tool.cutFloat({
                    val: this.guestList[index].propertyRightRatio,
                    max: 100
                });
            } else if (type === "owner") {
                this.ownerList[index].propertyRightRatio = this.$tool.cutFloat({
                    val: this.ownerList[index].propertyRightRatio,
                    max: 100
                });
            }
        },
        cutAddress(type) {
            let addrReg = /\\|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\&|\!|\~|\`|\|/g;
            if (type === "city") {
                this.rightAddrCity = this.rightAddrCity
                    .replace(/\s+/g, "")
                    .replace(addrReg, "")
                    .replace("市", "")
                    .replace(/\//g, "");
            } else if (type === "area") {
                this.rightAddrArea = this.rightAddrArea
                    .replace(/\s+/g, "")
                    .replace(addrReg, "")
                    .replace("区", "")
                    .replace(/\//g, "");
            } else {
                this.rightAddrDetail = this.rightAddrDetail
                    .replace(/\s+/g, "")
                    .replace(addrReg, "");
            }
        },
        inputOnly(index, type) {
            if (type === "owner") {
                this.ownerList[index].name = this.$tool.textInput(
                    this.ownerList[index].name
                );
            } else if (type === "guest") {
                this.guestList[index].name = this.$tool.textInput(
                    this.guestList[index].name
                );
            } else if (type === "other") {
                this.contractForm.otherCooperationInfo.name = this.$tool.textInput(
                    this.contractForm.otherCooperationInfo.name
                );
            }
        },
        inputCode(type) {
            let addrReg = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\(\)\-\_]/g;
            if (type === "pCode") {
                if (this.contractForm.pCode) {
                    this.contractForm.pCode = this.contractForm.pCode
                        .replace(/\s+/g, "")
                        .replace(addrReg, "");
                }
            } else if (type === "remarks") {
                if (this.contractForm.remarks) {
                    this.contractForm.remarks = this.contractForm.remarks
                        .replace(/\s+/g, "")
                        .replace(addrReg, "");
                }
            } else if (type === "cooperation") {
                if (this.contractForm.otherCooperationInfo.remarks) {
                    this.contractForm.otherCooperationInfo.remarks = this.contractForm.otherCooperationInfo.remarks
                        .replace(/\s+/g, "")
                        .replace(addrReg, "");
                }
            }
        },
        closeCheckPerson() {
            checkPerson.state = false;
            this.$router.push("/contractList");
        },
        //这个可以验证15位和18位的身份证，并且包含生日和校验位的验证。
        isIdCardNo(num) {
            num = num.toUpperCase();
            //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
            if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num)) {
                // alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
                return false;
            }
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            //下面分别分析出生日期和校验位
            var len, re;
            len = num.length;
            if (len == 15) {
                re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
                var arrSplit = num.match(re);
                //检查生日日期是否正确
                var dtmBirth = new Date(
                    "19" + arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]
                );
                var bGoodDay;
                bGoodDay =
                    dtmBirth.getYear() == Number(arrSplit[2]) &&
                    dtmBirth.getMonth() + 1 == Number(arrSplit[3]) &&
                    dtmBirth.getDate() == Number(arrSplit[4]);
                if (!bGoodDay) {
                    // alert('输入的身份证号里出生日期不对！');
                    return false;
                } else {
                    //将15位身份证转成18位
                    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                    var arrInt = new Array(
                        7,
                        9,
                        10,
                        5,
                        8,
                        4,
                        2,
                        1,
                        6,
                        3,
                        7,
                        9,
                        10,
                        5,
                        8,
                        4,
                        2
                    );
                    var arrCh = new Array(
                        "1",
                        "0",
                        "X",
                        "9",
                        "8",
                        "7",
                        "6",
                        "5",
                        "4",
                        "3",
                        "2"
                    );
                    var nTemp = 0,
                        i;
                    num =
                        num.substr(0, 6) + "19" + num.substr(6, num.length - 6);
                    for (i = 0; i < 17; i++) {
                        nTemp += num.substr(i, 1) * arrInt[i];
                    }
                    num += arrCh[nTemp % 11];
                    return true;
                }
            }
            if (len == 18) {
                re = new RegExp(
                    /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/
                );
                var arrSplit = num.match(re);
                //检查生日日期是否正确
                var dtmBirth = new Date(
                    arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]
                );
                var bGoodDay;
                bGoodDay =
                    dtmBirth.getFullYear() == Number(arrSplit[2]) &&
                    dtmBirth.getMonth() + 1 == Number(arrSplit[3]) &&
                    dtmBirth.getDate() == Number(arrSplit[4]);
                if (!bGoodDay) {
                    // alert(dtmBirth.getYear());
                    // alert(arrSplit[2]);
                    // alert('输入的身份证号里出生日期不对！');
                    return false;
                } else {
                    //检验18位身份证的校验码是否正确。
                    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                    // var valnum;
                    // var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                    // var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                    // var nTemp = 0, i;
                    // for (i = 0; i < 17; i++) {
                    //     nTemp += num.substr(i, 1) * arrInt[i];
                    // }
                    // valnum = arrCh[nTemp % 11];
                    // if (valnum != num.substr(17, 1)) {
                    //     // alert('18位身份证的校验码不正确！应该为：' + valnum);
                    //     return false;
                    // }
                    return true;
                }
            }
            return false;
        },
        //是否转佣
        toCommission() {    
            this.isToCommission = !this.isToCommission;
            this.countTotal()
        }
    },
    mounted() {
        window.onresize = this.clientHeight;
    },
    beforeUpdate() {
        this.clientHeight();
    },
    beforeDestroy() {
        localStorage.removeItem("backMsg");
    },
    filters: {
        moneyFormat: function(val) {
            if (!val) {
                return "零";
            } else {
                return TOOL.toChineseNumber(val);
            }
        }
    }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.disabled {
    background-color: #f5f7fa;
    cursor: not-allowed;
    color: #c0c4cc !important;
}
.personalMsg {
    /deep/.el-dialog__header {
        border: none !important;
    }
}
.singleCompany {
    // text-align: center;
    padding: 20px 0 10px 10px;
}
.agentsDialog {
    box-sizing: border-box;
    padding: 10px 10px 10px;
    p {
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
    }
    > ul {
        background-color: #e8e8e8;
        padding: 6px 12px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        > li {
            flex-basis: 46%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
            line-height: 1.6;
            span {
                box-sizing: border-box;
                display: inline-block;
                min-width: 50px;
                padding-right: 10px;
                font-weight: bold;
            }
        }
    }
}
.warning-box {
    margin: -4px 0 18px 10px;
    padding-top: 10px;
    > p {
        line-height: 1.4;
        &:first-of-type {
            // display:flex;
            // align-items:center;
            i {
                color: orange;
                font-size: 48px;
                margin-right: 16px;
            }
            span {
                font-size: 16px;
            }
        }
        &:last-of-type {
            padding-left: 64px;
            color: red;
        }
    }
    > ul {
        margin-bottom: 10px;
        li {
            padding-left: 65px;
        }
    }
    .firstAdd {
        width: 370px;
        box-sizing: border-box;
        padding-left: 65px;
        position: relative;
        > i {
            color: orange;
            font-size: 48px;
            margin-right: 16px;
            position: absolute;
            top: -15px;
            left: 0;
        }
        p {
            font-size: 16px;
            &:first-of-type {
                color: red;
                font-size: 14px;
            }
            &:last-of-type {
                margin: 15px 0;
            }
        }
    }
}
.view-container {
    // padding: 0 0 20px 0;
    .add-form {
        padding: 10px;
        font-size: 14px;
        background: @bg-white;
        overflow-y: auto;
    }
    input {
        &:-ms-input-placeholder {
            color: #cbced5 !important;
        }
        &::-webkit-input-placeholder {
            color: #cbced5;
        }
        &::-moz-placeholder {
            color: #cbced5;
        }
    }
    /deep/.el-input__inner {
        &:-ms-input-placeholder {
            color: #cbced5 !important;
        }
        &::-webkit-input-placeholder {
            color: #cbced5;
        }
        &::-moz-placeholder {
            color: #cbced5;
        }
    }
}
/deep/.form-label {
    position: relative;
    &:before {
        content: "*";
        display: inline-block;
        color: red;
    }
}
.dealPrice {
    display: inline-block;
    box-sizing: border-box;
    width: 140px;
    padding: 7px 15px;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    &::-webkit-input-placeholder {
        color: #ccc;
    }
}
.propertyRight {
    width: 80px;
    box-sizing: border-box;
    padding: 7px 10px !important;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
}
.forbid {
    background: #f5f7fa;
}
.yuan {
    position: absolute;
    top: 0;
    right: 6px;
    font-size: 14px;
    color: #ccc;
}
.hint {
    cursor: pointer;
    position: absolute;
    top: 0;
    left: -115px;
    font-size: 18px;
    color: @color-blue;
}
.contractMsg {
    border-bottom: 1px solid @border-ED;
    > p {
        padding-bottom: 10px;
        padding-left: 10px;
        font-size: 14px;
        font-weight: bold;
    }
    .form-content {
        padding-left: 30px;
        .sxf_1 {
            width: 100px;
        }
        .sxf_2 {
            width: 80px;
        }
        .sxf_3 {
            width: 80px;
        }
        .chineseNum {
            padding-left: 10px;
            color: @color-orange;
            font-size: 14px;
        }
    }
}
.houseMsg {
    .chineseNum {
        padding-left: 10px;
        color: @color-orange;
        font-size: 14px;
    }
    border-bottom: 1px solid @border-ED;
    > p {
        padding: 20px 0 20px 10px;
        font-size: 14px;
        font-weight: bold;
    }
    .thirdParty {
        cursor: pointer;
        display: inline-block;
        .attention {
            color: #ccc;
            font-weight: normal;
        }
        .attention_ {
            color: @color-blue;
        }
    }
    .form-content {
        padding-left: 30px;
        .select {
            display: inline-block;
            text-align: center;
            color: @color-white;
            width: 140px;
            padding: 2px 0;
            background: @color-blue;
            border-radius: 2px;
            cursor: pointer;
        }
        .select_ {
            display: inline-block;
            width: 140px;
            text-align: left;
            color: @color-blue;
            font-weight: bold;
        }
        .propertyAddress {
            cursor: not-allowed;
            min-width: 500px;
            display: inline-block;
            box-sizing: border-box;
            text-align: left;
            font-size: 14px;
            padding-left: 15px;
            color: #c0c4cc;
            border-radius: 4px;
            background: #f5f7fa;
            border: 1px solid #dcdfe6;
        }
        .CompleteYear {
            cursor: not-allowed;
            width: 150px;
            display: inline-block;
            box-sizing: border-box;
            text-align: left;
            font-size: 14px;
            padding-left: 15px;
            color: #c0c4cc;
            border-radius: 4px;
            background: #f5f7fa;
            border: 1px solid #dcdfe6;
        }
        .color_ {
            color: #c0c4cc;
        }
        .shopName {
            min-width: 200px;
            height: 32px;
        }
        .parameter {
            display: flex;
            width: 1200px;
            flex-wrap: wrap;
            padding-bottom: 10px;
            li {
                display: flex;
                height: 50px;
                width: 350px;
                line-height: 50px;
                > .title {
                    width: 100px;
                    cursor: pointer;
                    text-align: right;
                    // padding-right: 10px;
                    color: #606266;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    display: inline-block;
                }
                > .colon {
                    padding: 0 5px;
                }
                > .unit {
                    width: 70px;
                    padding-left: 10px;
                    color: #606266;
                    overflow: hidden;
                }
            }
        }
    }
    .remarkType {
        padding-left: 30px;
        /deep/.el-textarea__inner {
            width: 600px;
            min-height: 200px;
        }
        .textLength {
            position: absolute;
            bottom: 0;
            right: 10px;
            color: #6c7986;
        }
    }
    .cooperation {
        min-height: 240px;
        padding-left: 30px;
        /deep/.el-textarea__inner {
            width: 600px;
            min-height: 200px;
        }
    }
    .peopleMsg {
        li {
            min-width: 540px;
            font-size: 14px;
            margin-bottom: 20px;
            .merge {
                border: 1px solid #dcdfe6;
                padding: 7px 2px;
                border-radius: 3px;
            }
            .shell {
                display: inline-block;
                position: relative;
                &::after {
                    content: "%";
                    display: inline-block;
                    color: #ccc;
                    position: absolute;
                    top: 0;
                    right: 6px;
                }
            }
            input {
                padding: 6px 0;
                color: #606266;
                &::-webkit-input-placeholder {
                    color: #ccc;
                }
            }
        }
        .name_ {
            width: 250px;
            padding-left: 5px;
            border: none;
            border-right: 1px solid #dcdfe6;
        }
        .mobile_ {
            width: 100px;
            border: none;
            margin-left: -4px;
            padding-left: 2px;
        }
        .rate_ {
            width: 90px;
        }
        .idCard_ {
            width: 160px;
            padding: 7px 5px;
            padding-left: 5px;
            border: 1px solid #dcdfe6;
            border-radius: 3px;
        }
        .relation_ {
            width: 80px;
        }
        .idtype {
            width: 100px;
        }
        .icon {
            display: inline-block;
            cursor: pointer;
            .icon-tubiao_shiyong-14 {
                font-size: 22px;
                color: @color-blue;
            }
            .icon-tubiao_shiyong-4 {
                font-size: 22px;
                color: @color-FF5;
            }
        }
    }
}
.width-250 {
    width: 245px;
    text-align: right;
}
.btn {
    padding-top: 10px;
    padding-left: 20px;
    display: flex;
    justify-content: space-between;
    p {
        color: @color-6c;
        display: inline-block;
        padding-right: 20px;
        font-size: 12px;
    }
}
.toCommission {
    cursor: pointer;
    display: inline-block;
    .toCommissionStyle{
        color: black;
        .attention {
            color: #ccc !important;
            font-weight: normal;
        }
        .attention_ {
            color: @color-blue !important;
        }
    }
    padding-left: 65px;
    font-weight: normal;
    color: red;
    >span {
        font-size: 14px !important;
        padding-right: 30px;
    }
}
</style>
