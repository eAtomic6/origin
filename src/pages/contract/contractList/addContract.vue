<template>
  <div class="view-container">
    <el-form :inline="true" :model="contractForm" class="add-form" size="small" :style="{ height: clientHei }">
      <!-- 合同信息 -->
      <div class="contractMsg">
        <p>合同信息</p>
        <div class="form-content">
          <el-form-item label="签约日期：" class="width-250 form-label">
            <el-date-picker type="date" value-format="yyyy/MM/dd" placeholder="选择日期" v-model="contractForm.signDate" style="width:140px" @clear="clearData"></el-date-picker>
          </el-form-item>
          <el-form-item label="合同类型：" class="width-250">
            <el-input placeholder="请输入内容" value="租赁" :disabled="true" style="width:140px" v-if="contractForm.type===1"></el-input>
            <el-input placeholder="请输入内容" value="买卖" :disabled="true" style="width:140px" v-if="contractForm.type===2"></el-input>
            <el-input placeholder="请输入内容" value="代办" :disabled="true" style="width:140px" v-if="contractForm.type===3"></el-input>
          </el-form-item>
          <el-form-item label="纸质合同编号：" class="width-250 form-label" style="width:340px;" v-if="isOffline===1">
            <input style="width:200px;" type="text" maxlength="30" v-model="contractForm.code" @input="inputCode" placeholder="请输入" class="dealPrice">
          </el-form-item>
          <br>
          <!-- <el-form-item label="客户保证金：" class="width-250" v-if="contractForm.type===2||contractForm.type===3">
            <input type="text" v-model="contractForm.custEnsure" @input="cutNumber('custEnsure')" placeholder="请输入内容" class="dealPrice" :disabled="type===2?true:false" :class="{'forbid':type===2}">
            <i class="yuan">元</i>
          </el-form-item> -->
          <el-form-item label="客户佣金：" class="width-250">
            <input type="text" v-model="contractForm.custCommission" @input="cutNumber('custCommission')" placeholder="请输入内容" class="dealPrice">
            <i class="yuan">元</i>
          </el-form-item>
          <el-form-item label="业主佣金：" class="width-250">
            <input type="text" v-model="contractForm.ownerCommission" @input="cutNumber('ownerCommission')" placeholder="请输入内容" class="dealPrice">
            <i class="yuan">元</i>
          </el-form-item>
          <!-- <el-form-item label="佣金支付费：" class="width-250">
            <input type="text" v-model="contractForm.commissionPayment" @input="cutNumber('commissionPayment')" placeholder="请输入内容" class="dealPrice">
            <i class="yuan">元</i>
          </el-form-item> -->
          <br>
          <!-- <el-form-item label="交易流程：" class="form-label" style="width:325px;text-align:right" v-if="contractForm.type===1">
            <el-select v-model="contractForm.transFlowCode" placeholder="请选择交易流程" :clearable="true" style="width:220px">
              <el-option v-for="item in transFlowList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item> -->
        </div>
      </div>
      <!-- 房源信息 -->
      <div class="houseMsg">
        <p>房源信息</p>
        <div class="form-content">
          <el-form-item label="房源编号：" class="width-250" :class="{'form-label':type===1}">
            <span class="select" @click="showDialog('house')" v-if="type===1">{{contractForm.houseinfoCode?contractForm.houseinfoCode:'请选择房源'}}</span>
            <span class="select_" v-else>{{contractForm.houseinfoCode}}</span>
          </el-form-item>
          <el-form-item :label="contractForm.type===1?'租金：':'成交总价：'" class="form-label width-250">
            <input type="text" v-model="contractForm.dealPrice" @input="cutNumber('dealPrice')" placeholder="请输入内容" class="dealPrice">
            <i class="yuan" v-if="contractForm.type!==1">元</i>
            <!-- <el-input :value="contractForm.dealPrice" type="text" maxlength="13" placeholder="请输入内容" style="width:140px" @change="cutNumber"><i slot="suffix" v-if="contractForm.type!=1">元</i></el-input> -->
          </el-form-item>
          <el-form-item v-if="contractForm.type===1">
            <el-select v-model="contractForm.timeUnit" placeholder="请选择" style="width:105px">
              <el-option v-for="item in dictionary['507']" :key="item.key" :label="`元 / ${item.value}`" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <span class="chineseNum">{{contractForm.dealPrice|moneyFormat}}</span>
          </el-form-item>
          <br>
          <el-form-item label="物业地址：" :class="{'form-label':type===1}" style="width:605px;text-align:right">
            <span class="propertyAddress" v-if="contractForm.houseinfoCode">
              <!-- {{contractForm.houseInfo.EstateName+contractForm.houseInfo.BuildingName+contractForm.houseInfo.Unit+contractForm.houseInfo.RoomNo}} -->
              {{type===1?contractForm.houseInfo.EstateName:contractForm.propertyAddr}}
            </span>
            <span class="propertyAddress color_" v-else>物业地址</span>
          </el-form-item>
          <br>
           <el-form-item label="产权地址：" class="form-label" style="width:750px;text-align:right">
             <!-- <el-input v-model="contractForm.propertyRightAddr" maxlength="70" placeholder="请输入内容" style="width:700px"></el-input> -->
             <input v-model="rightAddrCity" maxlength="10" placeholder="请输入" @input="cutAddress('city')" class="dealPrice" style="width:100px" /> 市
             <input v-model="rightAddrArea" maxlength="10" placeholder="请输入" @input="cutAddress('area')" class="dealPrice" style="width:100px" /> 区
             <input v-model="rightAddrDetail" maxlength="70" placeholder="详细地址" @input="cutAddress('detail')" class="dealPrice" style="width:400px" /> 
          </el-form-item>
          <br>
          <el-form-item label="建筑面积：" class="width-250">
            <!-- <el-input v-model="contractForm.houseInfo.Square" placeholder="请输入内容" :disabled="type===2?true:false" style="width:140px"><i slot="suffix">㎡</i></el-input> -->
            <input type="text" v-model="contractForm.houseInfo.Square" @input="cutNumber('Square')" placeholder="请输入内容" class="dealPrice">
            <i class="yuan">㎡</i>
          </el-form-item>
          <el-form-item label="套内面积：" class="width-250">
            <!-- <el-input v-model="contractForm.houseInfo.SquareUse" placeholder="请输入内容" :disabled="type===2?true:false" style="width:140px"><i slot="suffix">㎡</i></el-input> -->
            <input type="text" v-model="contractForm.houseInfo.SquareUse" @input="cutNumber('SquareUse')" placeholder="请输入内容" class="dealPrice">
            <i class="yuan">㎡</i>
          </el-form-item>
          <!-- <el-form-item label="房源方门店：" class="form-label" style="width:310px;text-align:right">
            <span class="propertyAddress shopName" v-if="contractForm.houseinfoCode">{{contractForm.houseInfo.HouseStoreName}}</span>
            <span class="propertyAddress color_ shopName" v-else>门店</span>
          </el-form-item> -->
          <!-- <el-form-item label="店长：">
            {{contractForm.houseInfo.ShopOwnerName}} {{contractForm.houseInfo.ShopOwnerMobile}}
          </el-form-item> -->
          <!-- <br v-if="contractForm.type===2||contractForm.type===3"> -->
          <!-- <el-form-item label="产权状态：" v-if="contractForm.type===2||contractForm.type===3" class="width-250">
            <el-select v-model="contractForm.houseInfo.propertyRightStatus" placeholder="请选择" :disabled="type===2?true:false" style="width:140px" :clearable="true">
              <el-option  label="无" :value="0"></el-option>
              <el-option v-for="item in dictionary['514']" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="按揭银行：" v-if="contractForm.type===2||contractForm.type===3" class="width-250">
            <el-select v-model="contractForm.houseInfo.stagesBankName" placeholder="请选择银行" :disabled="type===2?true:false" style="width:140px" :clearable="true">
              <el-option label="中国工商银行" value="中国工商银行"></el-option>
              <el-option label="中国建设银行" value="中国建设银行"></el-option>
              <el-option label="中国银行" value="中国银行"></el-option>
              <el-option label="中国农业银行" value="中国农业银行"></el-option>
              <el-option label="交通银行" value="交通银行"></el-option>
              <el-option label="招商银行" value="招商银行"></el-option>
              <el-option label="中信银行" value="中信银行"></el-option>
              <el-option label="中国民生银行" value="中国民生银行"></el-option>
              <el-option label="兴业银行" value="兴业银行"></el-option>
              <el-option label="上海浦东发展银行" value="上海浦东发展银行"></el-option>
              <el-option label="中国邮政储蓄银行" value="中国邮政储蓄银行"></el-option>
              <el-option label="中国光大银行" value="中国光大银行"></el-option>
              <el-option label="平安银行" value="平安银行"></el-option>
              <el-option label="华夏银行" value="华夏银行"></el-option>
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="按揭欠款：" v-if="contractForm.type===2||contractForm.type===3" class="width-250">
            <input type="text" v-model="contractForm.houseInfo.stagesArrears" :disabled="type===2?true:false" @input="cutNumber('stagesArrears')" placeholder="请输入内容" class="dealPrice" :class="{'forbid':type===2}">
            <i class="yuan">元</i>
          </el-form-item> -->
          <!-- <el-form-item>
            <span class="chineseNum" v-if="contractForm.type===2||contractForm.type===3">{{contractForm.houseInfo.stagesArrears|moneyFormat}}</span>
          </el-form-item> -->
          <!-- <br v-if="contractForm.type===2||contractForm.type===3"> -->
          <!-- <el-form-item label="产权地址：" v-if="contractForm.type===2||contractForm.type===3" style="width:520px;text-align:right">
            <el-input v-model="contractForm.houseInfo.propertyRightAddr" maxlength="30" placeholder="请输入内容" :disabled="type===2?true:false" style="width:416px"></el-input>
          </el-form-item>
          <el-form-item label="房产证号：" v-if="contractForm.type===2||contractForm.type===3" :class="{'form-label':type===1}" style="width:300px;text-align:right">
            <el-input v-model="contractForm.propertyCard" maxlength="30" placeholder="请输入内容" :disabled="type===2?true:false" style="width:200px"></el-input>
          </el-form-item> -->
          <br>
          <el-form-item label="业主信息：" class="form-label" style="padding-left:18px">
            <ul class="peopleMsg">
              <li v-for="(item,index) in ownerList" :key="index" v-if="item.type===1">
                <span class="merge">
                  <input v-model="item.name" placeholder="姓名" maxlength="30" @input="inputOnly(index,'owner')" class="name_">
                  <input v-model="item.mobile" type="tel" maxlength="11" placeholder="电话" class="mobile_" @input="verifyMobile(item,index,'owner')" @keydown="saveMobile(item,index,'guest')">
                </span>
                 <!-- :disabled="type===2&&!item.edit?true:false" -->
                <el-select v-model="item.relation" placeholder="关系" class="relation_">
                  <el-option v-for="item in relationList" :key="item.key" :label="item.value" :value="item.value">
                  </el-option>
                </el-select>
                <span class="shell" v-if="contractForm.type!=1"><input type="text" v-model="item.propertyRightRatio" @input="cutNumber_(index,'owner')" placeholder="产权比" class="propertyRight"></span>
                <el-select v-model="item.cardType" placeholder="证件类型" class="idtype" @change="changeCadrType($event,index,'owner')">
                  <el-option v-for="item in dictionary['633']" :key="item.key" :label="item.value" :value="item.key">
                  </el-option>
                </el-select>
                 <!-- :class="{'disabled':type===2&&!item.edit}" -->
                <input v-model="item.encryptionCode" type="text" :maxlength="item.cardType===1?18:item.cardType===2?9:item.cardType===3?20:18" placeholder="请输入证件号" class="idCard_" @input="verifyIdcard(item)">
                <span @click.stop="addcommissionData" class="icon">
                  <i class="iconfont icon-tubiao_shiyong-14"></i>
                </span>
                <span @click.stop="delPeople(index,'owner')" v-if="ownerList.length>1" class="icon">
                  <i class="iconfont icon-tubiao_shiyong-4"></i>
                </span>
              </li>
            </ul>
          </el-form-item>
        </div>
      </div>
      <!-- 客源信息 -->
      <div class="houseMsg">
        <p>客源信息</p>
        <div class="form-content">
          <el-form-item label="客源编号：" class="width-250" :class="{'form-label':type===1}">
            <span class="select" @click="showDialog('guest')" v-if="type===1">{{contractForm.guestinfoCode?contractForm.guestinfoCode:'请选择客源'}}</span>
            <span class="select_" v-else>{{contractForm.guestinfoCode}}</span>
          </el-form-item>
          <!-- <el-form-item label="付款方式：" :class="{'form-label':type===1}">
            <el-select v-model="contractForm.guestInfo.paymentMethod" placeholder="请选择" :disabled="type===2?true:false" style="width:140px" :clearable="true">
              <el-option v-for="item in dictionary['556']" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="客源方门店：" class="form-label">
            <span class="propertyAddress shopName" v-if="contractForm.guestinfoCode">{{contractForm.guestInfo.GuestStoreName}}</span>
            <span class="propertyAddress color_ shopName" v-else>门店</span>
          </el-form-item>
          <el-form-item label="店长：">
            {{contractForm.guestInfo.ShopOwnerName}}{{contractForm.guestInfo.ShopOwnerMobile}}
          </el-form-item> -->
          <br>
          <el-form-item label="客户信息：" class="form-label" style="padding-left:18px">
            <ul class="peopleMsg">
              <li v-for="(item,index) in guestList" :key="index" v-if="item.type===2">
                <span class="merge">
                  <input v-model="item.name" placeholder="姓名" maxlength="30" @input="inputOnly(index,'guest')"  class="name_">
                  <input v-model="item.mobile" type="tel" maxlength="11" placeholder="电话" class="mobile_"  @input="verifyMobile(item,index,'guest')" @keydown="saveMobile(item,index,'guest')">
                </span>
                <el-select v-model="item.relation" placeholder="关系" class="relation_">
                  <el-option v-for="item in relationList" :key="item.key" :label="item.value" :value="item.value">
                  </el-option>
                </el-select>
                <span class="shell" v-if="contractForm.type!=1"><input type="text" v-model="item.propertyRightRatio" @input="cutNumber_(index,'guest')" placeholder="产权比" class="propertyRight"></span>
                <el-select v-model="item.cardType" placeholder="证件类型" class="idtype" @change="changeCadrType($event,index,'guest')">
                  <el-option v-for="item in dictionary['633']" :key="item.key" :label="item.value" :value="item.key">
                  </el-option>
                </el-select>
                <input id="guestCard" v-model="item.encryptionCode" :maxlength="item.cardType===1?18:item.cardType===2?9:item.cardType===3?20:18" type="text" placeholder="请输入证件号" class="idCard_" @input="verifyIdcard(item)">
                <span @click.stop="addcommissionData1" class="icon">
                  <i class="iconfont icon-tubiao_shiyong-14"></i>
                </span>
                <span @click.stop="delPeople(index,'guest')" v-if="guestList.length>1" class="icon">
                  <i class="iconfont icon-tubiao_shiyong-4"></i>
                </span>
              </li>
            </ul>
          </el-form-item>
        </div>
      </div>
      <!-- 三方合作 -->
      <div class="houseMsg">
        <p @click="toCooperation" class="thirdParty">三方合作 <span class="attention iconfont icon-tubiao-10" :class="{'attention_':cooperation}"></span></p>
        <div class="cooperation" v-show="cooperation">
          <div>
            <el-form-item label="扣合作费：" class="width-250">
              <input type="text" v-model="contractForm.otherCooperationCost" @input="cutNumber('otherCooperationCost')" placeholder="请输入内容" class="dealPrice">
              <i class="yuan">元</i>
            </el-form-item>
            <el-form-item label="类型：" class="width-250">
              <el-select v-model="contractForm.otherCooperationInfo.type" placeholder="请选择" style="width:140px">
                <el-option label="无" :value="0">
                </el-option>
                <el-option v-for="item in dictionary['517']" :key="item.key" :label="item.value" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <br>
            <el-form-item label="合作方姓名：" class="width-250">
              <!-- <el-input v-model="contractForm.otherCooperationInfo.name" maxlength="6" placeholder="请输入姓名" style="width:140px"></el-input> -->
              <input type="text" v-model="contractForm.otherCooperationInfo.name" maxlength="6" @input="inputOnly(999,'other')" placeholder="请输入姓名" class="dealPrice">
            </el-form-item>
            <el-form-item label="联系方式：" class="width-250">
              <el-input v-model="contractForm.otherCooperationInfo.mobile" type="tel" maxlength="11" placeholder="请输入手机号" style="width:140px" @input="verifyMobile_(contractForm.otherCooperationInfo.mobile)"></el-input>
            </el-form-item>
            <el-form-item label="身份证号：" style="width:310px;text-align:right">
              <el-input v-model="contractForm.otherCooperationInfo.identifyCode" maxlength="18" placeholder="请输入身份证号" @input="verifyIdcard(contractForm.otherCooperationInfo.identifyCode,2)"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="备注：" style="padding-left:51px">
              <el-input type="textarea" :rows="6" maxlength="200" resize='none' v-model="contractForm.otherCooperationInfo.remarks" placeholder="无备注内容"></el-input>
            </el-form-item>
          </div>
        </div>
      </div>
      <!-- <div class="houseMsg">
        <p>扩展参数</p> -->
        <!-- {{contractForm.extendParams}}
        <div class="form-content" v-if="parameterList.length>0">
          <ul class="parameter">
            <li v-for="(item,index) in parameterList" :key="index"> -->
              <!-- <span class="title" :class="{'form-label':item.isRequired}">{{item.name+':'}}</span> -->

              <!-- <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                <span class="title" :class="{'form-label':item.inputType.value!=4}">{{item.name}}</span>
              </el-tooltip>
              <span class="colon">: </span> -->
              <!-- class="form-label" -->
              <!-- 输入框 -->
              <!-- <el-input v-model="contractForm.extendParams[index].value" placeholder="请输入内容" style="width:140px" v-if="item.inputType.value===1&&contractForm.extendParams[index]" size="small"></el-input> -->
              <!-- 下拉框 -->
              <!-- <el-select v-model="contractForm.extendParams[index].value" :clearable="true" placeholder="请选择" style="width:140px" v-if="(item.inputType.value===2||item.inputType.value===3)&&contractForm.extendParams[index]" size="small">
                <el-option v-for="item_ in item.options" :key="item_" :label="item_" :value="item_">
                </el-option>
              </el-select> -->
              <!-- 日期选择器 -->
              <!-- <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="contractForm.extendParams[index].value" style="width:140px" v-if="item.inputType.value===4&&contractForm.extendParams[index]" size="small"></el-date-picker> -->
              <!-- 下拉多选 -->
              <!-- <el-select
                v-if="item.inputType.value===5&&contractForm.extendParams[index]"
                size="small"
                v-model="contractForm.extendParams[index].value"
                multiple
                collapse-tags
                style="margin-left: 20px;"
                placeholder="请选择">
                <el-option
                  v-for="item_ in item.options"
                  :key="item_"
                  :label="item_"
                  :value="item_">
                </el-option>
              </el-select>
              <span class="unit">{{item.unit}}</span>
            </li>
          </ul>
        </div>
      </div> -->
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
          <!-- 新增+提审 -->
          <!-- <el-button type="success" v-if="power['sign-ht-info-sverify'].state&&type===1" round @click="isSave(1)">提交审核</el-button> -->
          <!-- 编辑+提审 -->
          <!-- <el-button type="success" v-if="power['sign-ht-info-toverify'].state&&type===2&&userMsg&&userMsg.empId===recordId" round @click="isSave(1)">提交审核</el-button> -->
          <!-- <el-button type="primary" round @click="isSave(0)">保存</el-button> -->
          <el-button type="primary" round @click="isSave(0)" :disabled="canClick">保存并进入下一步</el-button>
        </div>
      </div>

    <!-- 房源客源弹窗 -->
    <houseGuest :dialogType="dialogType" :dialogVisible="isShowDialog" :contractType="contractType" :choseHcode="choseHcode" :choseGcode="choseGcode" @closeHouseGuest="closeHouseGuest" v-if="isShowDialog">
    </houseGuest>
    <!-- 保存合同确认框 -->
    <el-dialog title="" :visible.sync="dialogSave" class="personalMsg" width="460px" :closeOnClickModal="$tool.closeOnClickModal">
      <div class="warning-box">
        <p><i class="iconfont icon-tubiao_shiyong-1"></i><span>请确认客户和业主的姓名与证件上的一致？</span></p>
        <ul>
          <li v-for="item in ownerList" :key="'owner'+item.encryptionCode">
            {{item.name}}：{{item.encryptionCode}}
          </li>
          <li v-for="item in guestList" :key="'guets'+item.encryptionCode">
            {{item.name}}：{{item.encryptionCode}}
          </li>
        </ul>
        <p>否则合同将无效，之后收款所开票据无效！！！</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSave = false" size="small">不确认</el-button>
        <el-button type="primary" size="small" @click="saveCont" v-loading.fullscreen.lock="fullscreenLoading">确认</el-button>
      </span>
    </el-dialog>
    <!-- 删除人员确认框 -->
    <el-dialog title="提示" :visible.sync="dialogDel" width="460px" :closeOnClickModal="$tool.closeOnClickModal">
      <span>确定删除当前联系人吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDel = false">取 消</el-button>
        <el-button type="primary" @click="delPeopleMsg">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 创建合同成功提示框 -->
    <el-dialog title="提示" :visible.sync="dialogSuccess" width="460px" :closeOnClickModal="$tool.closeOnClickModal" :showClose="false">
      <span>是否继续上传附件？如果不上传附件权证将无法办理！（你也可以以后再上传，上传附件后权证将接收办理）</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="toContract">取 消</el-button>
        <el-button type="primary" @click="toUpload">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 单公司提示框 -->
    <el-dialog title="提示" :visible.sync="singleCompany" width="460px" :closeOnClickModal="$tool.closeOnClickModal" :showClose="false">
      <div class="singleCompany">{{singleCompanyName}}未设置公章，请联系管理员设置！</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="toH5">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置/转交审核人 -->
    <checkPerson :show="checkPerson.state" :type="checkPerson.type" :showLabel="checkPerson.label" :bizCode="checkPerson.code" :flowType="checkPerson.flowType" @close="closeCheckPerson" @submit="closeCheckPerson" v-if="checkPerson.state"></checkPerson>
    <a id="add" href="" v-show="false" target="_blank"></a>
  </div>
</template>

<script>
import { TOOL } from "@/assets/js/common";
import { MIXINS } from "@/assets/js/mixins";
import houseGuest from "../contractDialog/houseGuest";
import checkPerson from '@/components/checkPerson';
const rule = {
  signDate: {
    name: "签约日期"
  },
  // transFlowCode: {
  //   name: "交易流程",
  // },
  code:{
    name:"合同编号"
  },
  houseinfoCode: {
    name: "房源"
  },
  dealPrice: {
    name: "成交总价",
    type: "money"
  },
  guestinfoCode: {
    name: "客源"
  }
};

export default {
  mixins: [MIXINS],
  components: {
    houseGuest,
    checkPerson
  },
  data() {
    return {
      clientHei:'',
      htType:'',
      contractForm: {
        // type: 2,
        houseinfoCode: "",
        guestinfoCode: "",
        signDate: "",
        transFlowCode: "",
        dealPrice: "",
        contPersons: [],
        propertyRightAddr:'',
        houseInfo: {
          HouseStoreCode: "",
          ShopOwnerMobile:'',
          ShopOwnerName:'',
        },
        guestInfo: {
          ShopOwnerMobile:'',
          ShopOwnerName:''
        },
        otherCooperationInfo: {
          identifyCode:'',
          mobile:''
        },
        extendParams:[],
        isHaveCooperation: 0
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
          propertyRightRatio: ""
        }
      ],
      ownerList_:[],
      //客户信息
      guestList: [
        {
          type: 2,
          encryptionCode: "",
          mobile: "",
          relation: "",
          cardType: "",
          name: "",
          propertyRightRatio: ""
        }
      ],
      guestList_:[],
      dialogType: "",
      isShowDialog: false,
      dialogSave: false,
      //三方合作
      cooperation: false,
      //操作类型  默认是添加
      type: 1,
      isOffline:'',
      dictionary: {
        //数据字典
        "514": "", //产权状态
        "507": "", //时间单位
        "517": "", //第三方合作类型
        "12": "", //第三方合作类型
        "556": "", //付款方式
        "633":"",//证件类型(护照,身份证,营业执照)
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
      id:'',
      //扩展参数类型
      parameterList:[],
      //扩展参数验证
      parameterRule:{},
      fullscreenLoading:false,
      hintText:'',
      haveExamine:0,
      //人员信息下标
      peopleIndex:'',
      dialogDel:false,
      delType:'',
      choseHcode:0,//选择的房源编号
      choseGcode:0,//选择的客源编号
      dialogSuccess:false,
      detailCode:'',
      detailId:'',
      //改变之前的手机号
      beforeChangeMobile:'',
      checkPerson: {
        state:false,
        type:1,
        code:'',
        flowType:3,
        label:false
      },
      userMsg:{}, //当前登录人信息
      recordId:'',//合同创建人id
      canClick:false,
      //权限配置
      power: {
        'sign-ht-info-toverify': {
          state: false,
          name: '提交审核'//编辑+提审
        },
        'sign-ht-info-sverify': {
          state: false,
          name: '提交审核'//新增+提审
        },
        'sign-com-htdetail': {
          state: false,
          name: '合同详情'
        },
        'sign-ht-xq-data-add': {
          state: false,
          name: '编辑资料库'
        },
      },
      rightAddrCity:'',
      rightAddrArea:'',
      rightAddrDetail:'',
      singleCompany:false,//单公司提示框
      singleCompanyName:'',
    };
  },
  created() {
    let backMsg = JSON.parse(localStorage.getItem("backMsg"));
    if(backMsg){//存在则是从h5页面返回  需走编辑逻辑
      let contMsg = JSON.parse(sessionStorage.getItem("contractMsg"));
      this.contractForm.type = parseInt(contMsg.type);//合同类型
      this.type=2;//编辑
      this.id=parseInt(contMsg.id)
      this.getContractDetail();
    }else{
      this.contractForm.type = Number(this.$route.query.type);
      this.isOffline = parseInt(this.$route.query.isOffline)
      if (this.$route.query.operateType) {
        this.type = parseInt(this.$route.query.operateType);
        if (this.type == 2) {
          this.id=parseInt(this.$route.query.id)
          this.getContractDetail();
        }else if(this.type == 1){
          this.getNewData()
        }
      }
    }
    this.getDictionary();//字典
    this.getTransFlow();//交易类型
    this.getRelation();//人员关系
    // this.getExtendParams();//扩展参数
    this.getShopList()//门店
    this.getAdmin();//获取当前登录人信息
  },
  methods: {
    //获取当前日期
    getNewData(){
        let time = new Date()
        let y = time.getFullYear()
        let M = time.getMonth() + 1
        let D = time.getDate()
        let time_ = `${y}/${M > 9 ? M : '0' + M}/${D > 9 ? D : '0' + D}`;
        this.contractForm.signDate=time_
    },
    // 控制弹框body内容高度，超过显示滚动条
    clientHeight() {
      this.clientHei= document.documentElement.clientHeight -160 + 'px'
    },
    addcommissionData() {
      if (this.ownerList.length < 4) {
        this.ownerList.push({
          edit: true,
          type: 1,
          encryptionCode: "",
          mobile: "",
          encryptionMobile:"",
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
    // deleteRowcommissionData(index) {
    //   this.ownerList.splice(index, 1);
    // },
    addcommissionData1() {
      if (this.guestList.length < 4) {
        this.guestList.push({
          edit: true,
          type: 2,
          encryptionCode: "",
          mobile: "",
          encryptionMobile:"",
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
    // deleteRowcommissionData1(index) {
    //   this.guestList.splice(index, 1);
    // },
    clearData(){
      console.log('111')
    },
    //删除联系人确认框
    delPeople(index,type){
      this.peopleIndex=index;
      this.delType=type;
      this.dialogDel=true;
    },
    //确认删除
    delPeopleMsg(){
      if(this.delType==="owner"){
        this.ownerList.splice(this.peopleIndex, 1);
        this.ownerList_.splice(this.peopleIndex, 1);
        this.dialogDel=false;
      }else if(this.delType==="guest"){
        this.guestList.splice(this.peopleIndex, 1);
        this.guestList_.splice(this.peopleIndex, 1);
        this.dialogDel=false;
      }
    },
    //存贮改变之前的手机号
    saveMobile(item,index,type){
      if(item.isEncryption){
        if(type==="owner"){
          this.beforeChangeMobile= this.ownerList[index].mobile;
        }else if(type==="guest"){
          this.beforeChangeMobile=this.guestList[index].mobile;
        }
      }
    },
    //第三方
    toCooperation() {
      this.cooperation = !this.cooperation;
      if (this.contractForm.isHaveCooperation) {
        this.contractForm.isHaveCooperation = 0;
      } else {
        this.contractForm.isHaveCooperation = 1;
      }
    },
    //获取合同扩展参数
    getExtendParams(){
      let param = {
        type:Number(this.$route.query.type)
      }
      this.$ajax.get('/api/contract/getExtendParamsByType', param).then(res=>{
        res=res.data;
        if(res.status===200){
          this.parameterList=res.data;
          res.data.forEach(element => {
            let name_ = element.name;
            // this.parameterRule[name_]={name:element.name};
            if(this.type===1){
              // this.$set(this.contractForm.extendParams,name_,'')
              this.contractForm.extendParams.push({
                name:name_,
                value:'',
                type:element.inputType.value,
                unit:element.unit
              })
            }
          });
        }
      })
    },
    //证件类型切换
    changeCadrType(value,index,type){
      // console.log(value,index,type)
      if(type==="guest"){
        this.guestList[index].encryptionCode=''
      }else{
        this.ownerList[index].encryptionCode=''
      }
    },
    //身份证验证
    verifyIdcard(value,type=1){
      // let reg = /^[1-9]\d{5}((((19|[2-9][0-9])\d{2})(0?[13578]|1[02])(0?[1-9]|[12][0-9]|3[01]))|(((19|[2-9][0-9])\d{2})(0?[13456789]|1[012])(0?[1-9]|[12][0-9]|30))|(((19|[2-9][0-9])\d{2})0?2(0?[1-9]|1[0-9]|2[0-8]))|(((1[6-9]|[2-9][0-9])(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))0?229))\d{3}[0-9Xx]$/;
      // let reg = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/
      if(type===2){
        if(value.length===18){
          if (!this.isIdCardNo(value)) {
            this.$message({
              message:'身份证格式不正确',
              type: "warning"
            })
          }
        }
      }else{
        if(value.encryptionCode.length===18){
          if (!this.isIdCardNo(value.encryptionCode)&&value.cardType===1) {
            this.$message({
              message:'身份证格式不正确',
              type: "warning"
            })
          }
        }
      }

    },
    //手机号验证
    verifyMobile(item,index,type) {
      // console.log(Number(item.mobile))
      //let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
       if(item.isEncryption){
        if(type==="owner"){
          if(this.ownerList[index].mobile!==this.beforeChangeMobile){
            if(Number(item.mobile)){
              this.ownerList[index].mobile=item.mobile;
            }else{
              this.ownerList[index].mobile='';
            }
            // this.ownerList[index].mobile='';
            this.ownerList[index].isEncryption=false;
          }
        }else if(type==="guest"){
          if(this.guestList[index].mobile!==this.beforeChangeMobile){
            if(Number(item.mobile)){
              this.guestList[index].mobile=item.mobile;
            }else{
              this.guestList[index].mobile='';
            }
            this.guestList[index].isEncryption=false;
          }
        }
      }else{
        if(item.mobile.length===11){
          let reg = /^1[0-9]{10}$/;
          let reg_ = /^0\d{2,3}-?\d{7,8}$/
          if (!reg.test(item.mobile)&&!reg_.test(item.mobile)) {
            this.$message({
              message:'电话号码格式不正确',
              type: "warning"
            })
          }
        }
      }
    },
    verifyMobile_(value) {
      if(value.length===11){
        let reg = /^1[0-9]{10}$/;
        let reg_ = /^0\d{2,3}-?\d{7,8}$/
        if (!reg.test(value)&&!reg_.test(value)) {
          this.$message({
            message:'电话号码格式不正确',
            type: "warning"
          })
        }
      }
    },
    //验证合同信息
    isSave(value) {
      var rule_ = JSON.parse(JSON.stringify(rule))
      this.haveExamine=value;
      // if(value){
      //   this.hintText='确定提审？'
      // }else{
      //   this.hintText='确定保存合同？'
      // }
      //验证合同信息
      // if(this.contractForm.type!==1){
      //   delete rule_.transFlowCode
      // }
      if(this.isOffline!==1){
        delete rule_.code
      }
      if(!this.contractForm.signDate){
        this.contractForm.signDate=''
      }
      if(!this.contractForm.transFlowCode){
        this.contractForm.transFlowCode=''
      }
      if(this.contractForm.code){
        this.contractForm.code=this.contractForm.code.replace(/\s+/g,"")
      }
      if(!this.contractForm.code){
        this.contractForm.code=''
      }
      this.$tool.checkForm(this.contractForm, rule_).then(() => {
          if (this.contractForm.custCommission > 0 || this.contractForm.ownerCommission > 0) {
            // if((Number(this.contractForm.custCommission?this.contractForm.custCommission:0)+Number(this.contractForm.ownerCommission?this.contractForm.ownerCommission:0))<=this.contractForm.dealPrice){
              // this.contractForm.propertyRightAddr = this.contractForm.propertyRightAddr.replace(/\s+/g,"")
              // let addrReg=/\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\&|\!|\~|\`|\|/g
              // this.contractForm.propertyRightAddr=this.contractForm.propertyRightAddr.replace(addrReg,'')
              if (this.rightAddrCity&&this.rightAddrArea&&this.rightAddrDetail) {
                this.contractForm.propertyRightAddr=this.rightAddrCity+"市"+this.rightAddrArea+"区"+this.rightAddrDetail
                // if(this.contractForm.propertyCard){
                //   this.contractForm.propertyCard=this.contractForm.propertyCard.replace(/\s/g,"");
                // }
                // if(this.contractForm.propertyCard||this.contractForm.type===1){
                  //业主产权比
                let ownerRightRatio = 0;

                let isOk;
                // this.ownerList.forEach(element => {
                let ownerArr = this.ownerList.map(item=>Object.assign({},item));
                ownerArr.forEach((element,index) => {
                  if(element.isEncryption){
                    element.encryptionMobile=this.ownerList_[index].encryptionMobile
                  }else{
                    element.encryptionMobile=element.mobile;
                  }
                });

                for(var i=0;i<ownerArr.length;i++){
                  let element = ownerArr[i]
                  isOk = false;
                  if (element.name) {
                    if(element.name.replace(/\s/g,"")){
                      element.name=element.name.replace(/\s/g,"");
                      if(element.name.indexOf("先生")===-1&&element.name.indexOf("女士")===-1){
                        if (element.encryptionMobile.length === 11) {
                        let reg = /^1[0-9]{10}$/;//手机号正则
                        let reg_ = /^0\d{2,3}-?\d{7,8}$/;//固话正则
                        if (reg.test(element.encryptionMobile)||reg_.test(element.encryptionMobile)) {
                          if (element.relation) {
                            if(this.contractForm.type===1&&element.cardType||this.contractForm.type!==1){
                              if(this.type===2){
                                if(!element.propertyRightRatio){
                                  element.propertyRightRatio="0"
                                }
                              }
                              if ((element.propertyRightRatio&&element.propertyRightRatio>0)||element.propertyRightRatio==='0'||this.contractForm.type===1) {
                                if (element.encryptionCode.replace(/\s/g,"")) {
                                  // if(this.contractForm.type===1){
                                    if(element.cardType!==1){
                                      element.encryptionCode=element.encryptionCode.replace(/[&\|\\\*^%$#@\-]/g,"")
                                    }
                                  // }
                                  if (element.cardType===1&&this.isIdCardNo(element.encryptionCode)||(element.cardType===2&&element.encryptionCode.length<=9)||(element.cardType===3&&element.encryptionCode.length<=20)) {
                                    isOk = true;
                                    ownerRightRatio += element.propertyRightRatio - 0;
                                  }else{
                                    this.$message({
                                      message: "房源信息-业主证件号不正确",
                                      type: "warning"
                                    });
                                    break
                                  }
                                } else {
                                  this.$message({
                                    message: "房源信息-业主证件号不能为空",
                                    type: "warning"
                                  });
                                  break
                                }
                              } else {
                                this.$message({
                                  message: "房源信息-业主产权比不能为空或负",
                                  type: "warning"
                                });
                                break
                              }
                            }else {
                              this.$message({
                                message: "房源信息-业主证件类型不能为空",
                                type: "warning"
                              });
                              break
                            }
                        } else {
                          this.$message({
                            message: "房源信息-业主关系不能为空",
                            type: "warning"
                          });
                          break
                        }
                        }else{
                          this.$message({
                            message: "房源信息-业主电话号码不正确",
                            type: "warning"
                          });
                          break
                        }
                      } else {
                        this.$message({
                          message: "房源信息-业主电话号码不正确",
                          type: "warning"
                        });
                        break
                      }
                    }else{
                      this.$message({
                        message: "房源信息-业主姓名不正确",
                        type: "warning"
                      });
                      break
                    }
                    }else{
                      this.$message({
                        message: "房源信息-业主姓名不能为空",
                        type: "warning"
                      });
                      break
                    }
                  } else {
                    this.$message({
                      message: "房源信息-业主姓名不能为空",
                      type: "warning"
                    });
                    break
                  }
                };
                if (isOk) {
                  if (ownerRightRatio === 100||this.contractForm.type===1) {
                    // if (this.contractForm.guestInfo.paymentMethod) {
                      if (this.contractForm.guestInfo.GuestStoreCode) {
                        //客户产权比
                        let guestRightRatio = 0;
                        let isOk_;
                        // this.guestList.forEach(element => {
                        let guestArr = this.guestList.map(item=>Object.assign({},item));
                        guestArr.forEach((element,index) => {
                          if(element.isEncryption){
                            element.encryptionMobile=this.guestList_[index].encryptionMobile
                          }else{
                            element.encryptionMobile=element.mobile;
                          }
                        });
                        for(var i=0;i<guestArr.length;i++){
                          let element = guestArr[i];
                          isOk_ = false;
                          if (element.name) {
                            if(element.name.replace(/\s/g,"")){
                              element.name=element.name.replace(/\s/g,"");
                              if(element.name.indexOf("先生")===-1&&element.name.indexOf("女士")===-1){
                                if (element.encryptionMobile.length === 11) {
                                let reg = /^1[0-9]{10}$/;//手机号正则
                                let reg_ = /^0\d{2,3}-?\d{7,8}$/;//固话正则
                                if (reg.test(element.encryptionMobile)||reg_.test(element.encryptionMobile)) {
                                  if (element.relation) {
                                    if(this.contractForm.type===1&&element.cardType||this.contractForm.type!==1){
                                    if(this.type===2){
                                      if(!element.propertyRightRatio){
                                        element.propertyRightRatio="0"
                                      }
                                    }
                                  if ((element.propertyRightRatio&&element.propertyRightRatio>0)||element.propertyRightRatio==='0'||this.contractForm.type===1) {
                                    if (element.encryptionCode.replace(/\s/g,"")) {
                                      if(this.contractForm.type===1){
                                        if(element.cardType!==1){
                                          element.encryptionCode=element.encryptionCode.replace(/[&\|\\\*^%$#@\-]/g,"")
                                        }
                                      }
                                      if (element.cardType===1&&this.isIdCardNo(element.encryptionCode)||(element.cardType===2&&element.encryptionCode.length<=9)||(element.cardType===3&&element.encryptionCode.length<=20)) {
                                        isOk_ = true;
                                        guestRightRatio += element.propertyRightRatio - 0;
                                      }else{
                                        this.$message({
                                          message: "客源信息-客户证件号不正确",
                                          type: "warning"
                                        });
                                        break
                                      }
                                    } else {
                                      this.$message({
                                        message: "客源信息-客户证件号不能为空",
                                        type: "warning"
                                      });
                                      break
                                    }
                                  } else {
                                    this.$message({
                                      message: "客源信息-客户产权比不能为空或负",
                                      type: "warning"
                                    });
                                    break
                                  }
                                  }else {
                                    this.$message({
                                      message: "客源信息-客户证件类型不能为空",
                                      type: "warning"
                                    });
                                    break
                                  }
                                } else {
                                  this.$message({
                                    message: "客源信息-客户关系不能为空",
                                    type: "warning"
                                  });
                                  break
                                }
                                }else{
                                  this.$message({
                                    message: "客源信息-客户电话号码不正确",
                                    type: "warning"
                                  });
                                  break
                                }
                              } else {
                                this.$message({
                                  message: "客源信息-客户电话号码不正确",
                                  type: "warning"
                                });
                                break
                              }
                            } else {
                              this.$message({
                                message: "客源信息-客户姓名不正确",
                                type: "warning"
                              });
                              break
                            }
                            }else{
                              this.$message({
                                message: "客源信息-客户姓名不能为空",
                                type: "warning"
                              });
                              break
                            }
                          } else {
                            this.$message({
                              message: "客源信息-客户姓名不能为空",
                              type: "warning"
                            });
                            break
                          }
                        };
                        if (isOk_) {
                          if (guestRightRatio === 100||this.contractForm.type===1) {
                            // 验证手机号是否重复
                            let mobileList = [];
                            //验证身份证是否重复
                            let IdCardList = [];
                            //验证护照是否重复
                            let passportList = [];
                            //验证营业执照是否重复
                            let businessList = [];

                            ownerArr.forEach(element => {
                              if(element.cardType===1){
                                IdCardList.push(element.encryptionCode);
                              }
                              if(element.cardType===2){
                                passportList.push(element.encryptionCode);
                              }
                              if(element.cardType===3){
                                businessList.push(element.encryptionCode);
                              }
                              mobileList.push(element.encryptionMobile);
                            });

                            guestArr.forEach(element => {
                              if(element.cardType===1){
                                IdCardList.push(element.encryptionCode);
                              }
                              if(element.cardType===2){
                                passportList.push(element.encryptionCode);
                              }
                              if(element.cardType===3){
                                businessList.push(element.encryptionCode);
                              }
                              mobileList.push(element.encryptionMobile);
                            });

                            if(this.contractForm.isHaveCooperation===1&&this.contractForm.otherCooperationInfo.mobile){
                              mobileList.push(this.contractForm.otherCooperationInfo.mobile)
                            }
                            if(this.contractForm.isHaveCooperation===1&&this.contractForm.otherCooperationInfo.identifyCode){
                              IdCardList.push(this.contractForm.otherCooperationInfo.identifyCode)
                            }
                            let mobileList_= Array.from(new Set(mobileList));
                            let IdCardList_= Array.from(new Set(IdCardList));
                            let passportList_= Array.from(new Set(passportList));
                            let businessList_= Array.from(new Set(businessList));
                            if(mobileList.length===mobileList_.length){
                              // debugger
                              if(IdCardList.length===IdCardList_.length){
                              if(passportList.length===passportList_.length){
                              if(businessList.length===businessList_.length){
                              //验证三方合作
                              if(this.contractForm.isHaveCooperation){
                                let mobileOk=true;
                                let IDcardOk=true;
                                // contractForm.otherCooperationInfo.mobile
                                if(this.contractForm.otherCooperationInfo.mobile){
                                  mobileOk=false;
                                  let reg = /^1[0-9]{10}$/;
                                  let reg_ = /^0\d{2,3}-?\d{7,8}$/;//固话正则
                                  if (reg.test(this.contractForm.otherCooperationInfo.mobile)||reg_.test(this.contractForm.otherCooperationInfo.mobile)) {
                                    mobileOk=true;
                                  }else{
                                    this.$message({
                                      message: "三方合作-电话号码不正确",
                                      type: "warning"
                                    });
                                  }
                                };
                                if(this.contractForm.otherCooperationInfo.identifyCode){
                                  IDcardOk=false;
                                  // let reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/;
                                  if (this.isIdCardNo(this.contractForm.otherCooperationInfo.identifyCode)) {
                                    IDcardOk=true;
                                  }else{
                                    this.$message({
                                      message: "三方合作-身份证号不正确",
                                      type: "warning"
                                    });
                                  }
                                };
                                if(mobileOk&&IDcardOk){
                                  // 合同扩展参数验证
                                  // let paramsOk=true;
                                  // for(var i=0;i<this.contractForm.extendParams.length;i++){
                                  //   paramsOk=false;
                                  //   let item = this.contractForm.extendParams[i];
                                  //   if(item.type!=4){//type=4为时间选择器
                                  //     if(item.value){
                                  //       if(item.type===5){
                                  //         if(item.value.length>0){
                                  //           paramsOk=true
                                  //         }else{
                                  //           this.$message({
                                  //             message: `扩展参数-${item.name}不能为空`,
                                  //             type: "warning"
                                  //           });
                                  //           break
                                  //         }
                                  //       }else{
                                  //         item.value=item.value.replace(/\s/g,"");
                                  //         if(item.value){
                                  //           paramsOk=true
                                  //         }else{
                                  //           this.$message({
                                  //             message: `扩展参数-${item.name}不能为空`,
                                  //             type: "warning"
                                  //           });
                                  //           break
                                  //         }
                                  //       }
                                  //     }else{
                                  //       this.$message({
                                  //         message: `扩展参数-${item.name}不能为空`,
                                  //         type: "warning"
                                  //       });
                                  //       break
                                  //     }
                                  //   }else{
                                  //     paramsOk=true
                                  //   }
                                  // }
                                  // if(paramsOk){
                                  //   this.dialogSave = true;
                                  // }



                                  this.dialogSave = true;
                                  // this.addContract();
                                }
                              }else{
                                // 合同扩展参数验证
                                // let paramsOk=true;
                                // for(var i=0;i<this.contractForm.extendParams.length;i++){
                                //   paramsOk=false;
                                //   let item = this.contractForm.extendParams[i];
                                //   // console.log(item);
                                //   if(item.type!=4){
                                //     if(item.value){
                                //       if(item.type===5){
                                //         if(item.value.length>0){
                                //           paramsOk=true
                                //         }else{
                                //           this.$message({
                                //             message: `扩展参数-${item.name}不能为空`,
                                //             type: "warning"
                                //           });
                                //           break
                                //         }
                                //       }else{
                                //         item.value=item.value.replace(/\s/g,"");
                                //         if(item.value){
                                //           paramsOk=true
                                //         }else{
                                //           this.$message({
                                //             message: `扩展参数-${item.name}不能为空`,
                                //             type: "warning"
                                //           });
                                //           break
                                //         }
                                //       }
                                //     }else{
                                //       this.$message({
                                //         message: `扩展参数-${item.name}不能为空`,
                                //         type: "warning"
                                //       });
                                //       break
                                //     }
                                //   }else{
                                //     paramsOk=true
                                //   }
                                // }
                                // if(paramsOk){
                                //   this.dialogSave = true;
                                // }
                                 this.dialogSave = true;
                                // this.addContract();
                              }
                              }else{
                                this.$message({
                                  message:'营业执照重复',
                                  type: "warning"
                                })
                              }
                              }else{
                                this.$message({
                                  message:'护照重复',
                                  type: "warning"
                                })
                              }
                            }else{
                              this.$message({
                                message:'证件号重复',
                                type: "warning"
                              })
                            }
                            }else{
                              this.$message({
                                message:'电话号码重复',
                                type: "warning"
                              })
                            }
                          } else {
                            this.$message({
                              message: "客源信息-客户产权比和必须为100%",
                              type: "warning"
                            });
                          }
                        }
                      } else {
                        this.$message({
                          message: "客源信息-客源方门店不能为空",
                          type: "warning"
                        });
                      }
                    // } else {
                    //   this.$message({
                    //     message: "客源信息-付款方式不能为空",
                    //     type: "warning"
                    //   });
                    // }
                  } else {
                    this.$message({
                      message: "房源信息-业主产权比和必须为100%",
                      type: "warning"
                    });
                  }
                }
                }else{
                  this.$message({
                    message:'房源信息-产权地址未填写完整',
                    type: "warning"
                  })
                }
              // } else {
              //   this.$message({
              //     message: "房源信息-房源方门店不能为空",
              //     type: "warning"
              //   });
              // }
          } else {
            this.$message({
              message: "合同信息-佣金不能为零",
              type: "warning"
            });
          }
        })
        .catch(error => {
          this.$message({
            message: `${error.title.length<3?'':'合同信息-'}${error.title}${error.msg}`,
            type: "warning"
          });
        });
    },
    saveCont() {
      this.fullscreenLoading=true;
      this.addContract()
    },
    // 新增/编辑合同
    addContract(){
      this.fullscreenLoading=true
      this.dialogSave=false
      this.contractForm.contPersons=[];
      let ownerArr = this.ownerList.map(item=>Object.assign({},item));
      let guestArr = this.guestList.map(item=>Object.assign({},item));
      ownerArr.forEach((element,index) => {
        if(element.isEncryption){
          element.encryptionMobile=this.ownerList_[index].encryptionMobile
        }else{
          element.encryptionMobile=element.mobile;
        }
        delete element.edit;
        delete element.isEncryption;
        this.contractForm.contPersons.push(element);
      });
      guestArr.forEach((element,index) => {
        if(element.isEncryption){
          element.encryptionMobile=this.guestList_[index].encryptionMobile
        }else{
          element.encryptionMobile=element.mobile;
        }
        delete element.edit;
        delete element.isEncryption;
        this.contractForm.contPersons.push(element);
      });
      if (this.contractForm.type === 1) {//租赁合同
        var param = {
          leaseCont: this.contractForm,
          type: this.type,
          haveExamine:this.haveExamine
        };
      }else if(this.contractForm.type === 2 || this.contractForm.type === 3){//买卖代办合同
        var param = {
          saleCont: this.contractForm,
          type: this.type,
          haveExamine:this.haveExamine
        };
      }
      if(this.isOffline===1){
        param.recordType=2
      }else{
        param.recordType=1
      }
      if(this.type===1){//新增
        var url = '/api/contract/addContract';
        if(this.isOffline===1){
          url = '/api/contract/addLocalContract'
        }
        this.$ajax.postJSON(url, param).then(res => {
          res = res.data;
          if (res.status === 200) {
            this.fullscreenLoading=false;
            if(this.isOffline===1){
              this.$message({
                message:"创建成功",
                type: "success"
              })
              this.$router.push({
                path: "/contractDetails",
                query:{
                  id:res.data.id,
                  contType:this.contractForm.type,
                  type:"contBody"
                }
              });
            }else{
              let contractMsg = res.data
              this.hidBtn=1
              sessionStorage.setItem("contractMsg", JSON.stringify(contractMsg));
              if(contractMsg.singleCompany){
                this.singleCompany=true
                this.singleCompanyName=contractMsg.singleCompany
              }else{
                this.$router.push({
                  path: "/extendParams"
                });
              }
              
            }

          }
        }).catch(error => {
          this.fullscreenLoading=false;
          if(error!=="该合同房源已被其他合同录入，请重新选择房源！"&&error!=="该合同下的房源客源不属于同一个体系，请重新选择！"&&error!=="线下合同编号规则不允许和系统生成规则一致，请重新输入！"&&error!=="合同编号已存在，请重新输入！"&&error!=="合同编号不符合规范！"){
            this.canClick=true
          }
          this.$message({
            message:error,
            type: "error"
          })
        })
      }else if(this.type===2){//编辑
        if(this.contractForm.type===1){
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
          delete param.leaseCont.recordType
        }else if(this.contractForm.type === 2 || this.contractForm.type === 3){
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
          delete param.saleCont.recordType
        }
        var url = '/api/contract/updateContract';
        if(this.isOffline===1){
          url = '/api/contract/addLocalContract'
        }
        // let page = window.open('','_blank');
        this.$ajax.postJSON(url, param).then(res => {
          res = res.data;
          if (res.status === 200) {
            this.fullscreenLoading=false;
            if(this.isOffline===1){
              this.$message({
                message:"保存成功",
                type: "success"
              })
              this.$router.push({
                path: "/contractDetails",
                query:{
                  id:res.data.id,
                  contType:this.contractForm.type,
                  type:"contBody"
                }
              });
            }else{
              let contractMsg = res.data
              sessionStorage.setItem("contractMsg", JSON.stringify(contractMsg));
              if(contractMsg.singleCompany){
                this.singleCompany=true
                this.singleCompanyName=contractMsg.singleCompany
              }else{
                this.$router.push({
                  path: "/extendParams"
                });
              }
            }
          }

        }).catch(error => {
          this.fullscreenLoading=false;
          this.$message({
            message:error,
            type: "error"
          })
        })
      }
    },
    //跳转H5页面
    toH5(){
      this.singleCompany=false
      this.$router.push({
        path: "/extendParams"
      });
    },
    //创建成功提示
    toUpload(value){//上传合同资料库
      this.dialogSuccess=false;
      if(this.power['sign-com-htdetail'].state){
        if(this.power['sign-ht-xq-data-add'].state){
          this.setPath(this.$tool.getRouter(['合同','合同列表','合同详情'],'contractList'));
          this.$router.replace({
            path: "/contractDetails",
            query: {
              type: "dataBank",
              id: this.detailId,//合同id
              code: this.detailCode,//合同编号
              contType: this.contractForm.type//合同类型
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
    },
    toContract(){//回到合同列表
      this.dialogSuccess=false;
      this.$router.push('/contractList');
    },
    /* 新增/编辑合同 */
    // addContract1() {
    //   this.contractForm.contPersons=[]
    //   this.ownerList.forEach(element => {
    //     delete element.edit
    //     this.contractForm.contPersons.push(element);
    //   });
    //   this.guestList.forEach(element => {
    //     delete element.edit
    //     this.contractForm.contPersons.push(element);
    //   });

    //   /* 新增/编辑租赁合同 */
    //   if (this.contractForm.type === 1) {
    //     let param = {
    //       leaseCont: this.contractForm,
    //       type: this.type,
    //       haveExamine:this.haveExamine
    //     };
    //     if(this.type===2){
    //       delete param.leaseCont.contChangeState;
    //       delete param.leaseCont.contState;
    //       delete param.leaseCont.contType;
    //       delete param.leaseCont.laterStageState;
    //       delete param.leaseCont.toExamineState;
    //       delete param.leaseCont.previewImg;
    //       delete param.leaseCont.updateTimes;
    //       delete param.leaseCont.propertyRightRatios;
    //       delete param.leaseCont.pids;
    //       delete param.leaseCont.pmobiles;
    //       delete param.leaseCont.pnames;
    //       delete param.saleCont.distributableAchievement;
    //     }
    //     this.$ajax.postJSON("/api/contract/editLeaseCont", param).then(res => {
    //       res = res.data;
    //       this.fullscreenLoading=false;
    //       if (res.status === 200) {
    //         this.dialogSave=false
    //         this.$message({
    //           message: "操作成功",
    //           type: "success"
    //         });
    //         this.$router.push('/contractList');
    //       }
    //     }).catch(error => {
    //       this.fullscreenLoading=false;
    //       console.log(error)
    //       this.$message({
    //         message:error
    //       })
    //     })
    //   }
    //   /* 新增/编辑买卖合同 */
    //   if (this.contractForm.type === 2 || this.contractForm.type === 3) {
    //     let param = {
    //       saleCont: this.contractForm,
    //       type: this.type,
    //       haveExamine:this.haveExamine
    //     };
    //     if(this.type===2){
    //       delete param.saleCont.contChangeState;
    //       delete param.saleCont.contState;
    //       delete param.saleCont.contType;
    //       delete param.saleCont.laterStageState;
    //       delete param.saleCont.toExamineState;
    //       delete param.saleCont.previewImg;
    //       delete param.saleCont.subscriptionTerm;
    //       delete param.saleCont.updateTime;
    //       delete param.saleCont.distributableAchievement;
    //       param.saleCont.signDate=param.saleCont.signDate.replace(/-/g,"/");
    //     }

    //     this.$ajax.postJSON("/api/contract/editSaleCont", param).then(res => {
    //       res = res.data;
    //       this.fullscreenLoading=false;
    //       if (res.status === 200) {
    //         this.dialogSave=false
    //         this.$message({
    //           message: "操作成功",
    //           type: "success"
    //         });
    //         this.$router.push('/contractList');
    //       }
    //     }).catch(error => {
    //       this.fullscreenLoading=false;
    //       this.$message({
    //         message:'数据异常'
    //       })
    //     })
    //   }
    // },
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
      console.log("房源");
      let param = {
        houseId: id,
        // dealDate:this.contractForm.signDate?this.contractForm.signDate:''
      };
      this.$ajax.get("/api/resource/houses/one", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          let houseMsg = res.data;
          this.contractForm.houseinfoCode = houseMsg.PropertyNo; //房源编号
          if(houseMsg.TradeInt===2){
            this.contractForm.dealPrice = houseMsg.ListingPrice*10000;//成交总价
          }else{
            this.contractForm.dealPrice = houseMsg.ListingPrice;
            // this.contractForm.timeUnit=2;
            // 1 月 2 季度 4 年
            let unit
            if(houseMsg.PriceUnitNameEnum){
              unit = houseMsg.PriceUnitNameEnum
            }else{
              unit = 1
            }
            this.$set(this.contractForm,'timeUnit',unit);
          }
          this.contractForm.houseInfo = houseMsg;
          if(houseMsg.OwnerInfoList.length>0){
            this.ownerList=[];
            this.ownerList_=[];
            houseMsg.OwnerInfoList.forEach(element => {
              element.type=1;
              element.encryptionCode='';
              element.propertyRightRatio='';
              element.name=element.OwnerName;
              element.mobile=element.OwnerMobile;
              element.relation=element.Relation;
              element.cardType='';
              element.isEncryption=true;
              delete element.OwnerName
              delete element.OwnerMobile
              delete element.Relation
              let obj = Object.assign({}, element);
              obj.mobile=obj.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
              this.ownerList.push(obj);
              let obj_ = Object.assign({}, element);
              obj_.encryptionMobile=obj_.mobile;
              this.ownerList_.push(obj_);
            });
          }
          // this.options.push({
          //   name: houseMsg.HouseStoreName,
          //   id: houseMsg.HouseStoreCode
          // });
        }
      }).catch(error=>{
        this.$message({
          message:error,
          type: "error"
        })
      });
    },
    //根据客源id获取客源信息
    getGuestDetail(id) {
      console.log("客源");
      let param = {
        customerId: id,
        // dealDate:this.contractForm.signDate?this.contractForm.signDate:''
      };
      this.$ajax.get("/api/resource/customers/one", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          let guestMsg = res.data;
          this.contractForm.guestinfoCode = guestMsg.InquiryNo; //客源编号
          this.contractForm.guestInfo = guestMsg;
          this.$set(this.contractForm.guestInfo,'paymentMethod',1)
          // this.contractForm.guestInfo.paymentMethod=1
          // if(houseMsg.OwnerInfoList.length>0){
          //   this.ownerList=[];
          //   this.ownerList_=[];
          //   houseMsg.OwnerInfoList.forEach(element => {
          //     element.type=1;
          //     element.encryptionCode='';
          //     element.propertyRightRatio='';
          //     element.name=element.OwnerName;
          //     element.mobile=element.OwnerMobile;
          //     element.relation=element.Relation;
          //     element.cardType='';
          //     element.isEncryption=true;
          //     delete element.OwnerName
          //     delete element.OwnerMobile
          //     delete element.Relation
          //     let obj = Object.assign({}, element);
          //     obj.mobile=obj.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
          //     this.ownerList.push(obj);
          //     let obj_ = Object.assign({}, element);
          //     obj_.encryptionMobile=obj_.mobile;
          //     this.ownerList_.push(obj_);
          //   });
          // }
          if(guestMsg.OwnerInfo.length>0){
            this.guestList=[];
            this.guestList_=[];
            guestMsg.OwnerInfo.forEach(element => {
              element.type=2;
              element.encryptionCode='';
              element.propertyRightRatio='';
              element.name=element.CustName;
              element.mobile=element.CustMobile;
              element.relation=element.CustRelation;
              element.cardType='';
              element.isEncryption=true;
              delete element.CustName
              delete element.CustMobile
              delete element.CustRelation
              let obj = Object.assign({}, element);
              obj.mobile=obj.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
              this.guestList.push(obj);
              let obj_ = Object.assign({}, element);
              obj_.encryptionMobile=obj_.mobile;
              this.guestList_.push(obj_);
            });
          }
        }
          // let element = {
          //   name: guestMsg.OwnerInfo.CustName,
          //   mobile: guestMsg.OwnerInfo.CustMobile,
          //   type: 2,
          //   relation: guestMsg.OwnerInfo.CustRelation,
          //   encryptionCode:'',
          //   cardType:'',
          //   propertyRightRatio:'',
          //   isEncryption:true
          // }
          // let obj = Object.assign({}, element);
          // obj.mobile=obj.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
          // this.guestList.push(obj);
          // let obj_ = Object.assign({}, element);
          // obj_.encryptionMobile=obj_.mobile;
          // this.guestList_.push(obj_);

          // this.guestList.push({
          //   name: guestMsg.OwnerInfo.CustName,
          //   mobile: guestMsg.OwnerInfo.CustMobile,
          //   type: 2,
          //   relation: guestMsg.OwnerInfo.CustRelation,
          //   identifyCode:'',
          //   propertyRightRatio:''
          // })
        // }
      }).catch(error=>{
        this.$message({
          message:error,
          type: "error"
        })
      });
    },
    //关闭房源客源弹窗
    closeHouseGuest(value) {
      if (value) {
        if (value.dialogType === "house") {
          if(this.choseHcode&&this.choseHcode!==value.selectCode){
            this.contractForm.propertyRightAddr=''
          }
          this.isShowDialog = false;
          this.getHousedetail(value.selectCode);
          this.choseHcode=value.selectCode;
        } else if (value.dialogType === "guest") {
          this.isShowDialog = false;
          this.getGuestDetail(value.selectCode);
          this.choseGcode=value.selectCode;
        }
      } else {
        this.isShowDialog = false;
      }
    },
    //获取门店
    getShopList() {
      let param = {
        keyword: ''
      };
      this.$ajax.get("/api/contract/getDepsByCityId", param).then(res => {
        this.loading = false;
        res = res.data;
        if (res.status === 200) {
            this.options=res.data
            this.options_=res.data
        }
      });
    },
    getShop(id) {
      if(id){
        this.contractForm.houseInfo.ShopOwnerName='';
        this.contractForm.houseInfo.ShopOwnerMobile='';
        this.options.forEach(element => {
          if(element.id===id){
            this.contractForm.houseInfo.HouseStoreName=element.name;
          }
        });
        let param1 = {
          depId: id,
          type:1
        };
        this.$ajax.get('/api/organize/dep/manager', param1).then(res=>{
          res=res.data;
          if(res.status===200){
            if(res.data){
              this.contractForm.houseInfo.ShopOwnerName=res.data.name;
              this.contractForm.houseInfo.ShopOwnerMobile=res.data.mobile;
            }else{
              let param2 = {
                depId: id,
                type:2
              };
              this.$ajax.get('/api/organize/dep/manager', param2).then(res=>{
                res=res.data;
                if(res.status===200){
                  if(res.data){
                    this.contractForm.houseInfo.ShopOwnerName=res.data.name;
                    this.contractForm.houseInfo.ShopOwnerMobile=res.data.mobile;
                  }else{
                    let param3 = {
                      depId: id,
                      type:3
                    };
                    this.$ajax.get('/api/organize/dep/manager', param3).then(res=>{
                      res=res.data;
                      if(res.status===200){
                        if(res.data){
                          this.contractForm.houseInfo.ShopOwnerName=res.data.name;
                          this.contractForm.houseInfo.ShopOwnerMobile=res.data.mobile;
                        }else{
                          this.$message({
                            message:'该门店没有店长',
                            type:'warning'
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          }
        }).catch(error=>{
          this.$message({
            message:error,
            type:'error'
          })
        })
      }
    },
    getShop_(id) {
      if(id){
        this.contractForm.guestInfo.ShopOwnerName='';
        this.contractForm.guestInfo.ShopOwnerMobile='';
        this.options_.forEach(element => {
          if(element.id===id){
            this.contractForm.guestInfo.GuestStoreName=element.name
          }
        });
        let param1 = {
          depId: id,
          type:1
        };
        this.$ajax.get('/api/organize/dep/manager', param1).then(res=>{
          res=res.data;
          if(res.status===200){
            if(res.data){
              this.contractForm.guestInfo.ShopOwnerName=res.data.name;
              this.contractForm.guestInfo.ShopOwnerMobile=res.data.mobile;
            }else{
              let param2 = {
                depId: id,
                type:2
              };
              this.$ajax.get('/api/organize/dep/manager', param2).then(res=>{
                res=res.data;
                if(res.status===200){
                  if(res.data){
                    this.contractForm.guestInfo.ShopOwnerName=res.data.name;
                    this.contractForm.guestInfo.ShopOwnerMobile=res.data.mobile;
                  }else{
                    let param3 = {
                      depId: id,
                      type:3
                    };
                    this.$ajax.get('/api/organize/dep/manager', param3).then(res=>{
                      res=res.data;
                      if(res.status===200){
                        if(res.data){
                          this.contractForm.guestInfo.ShopOwnerName=res.data.name;
                          this.contractForm.guestInfo.ShopOwnerMobile=res.data.mobile;
                        }else{
                          this.$message({
                            message:'该门店没有店长'
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          }
        }).catch(error=>{
          this.$message({
            message:error
          })
        })
      }
    },
    allClear(type){
      if(type==='owner'){
        this.contractForm.houseInfo.ShopOwnerName='';
        this.contractForm.houseInfo.ShopOwnerMobile='';
      }else if(type==='guest'){
        this.contractForm.guestInfo.ShopOwnerName='';
        this.contractForm.guestInfo.ShopOwnerMobile='';
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
          this.contractForm.signDate = res.data.signDate.substr(0, 10);
          this.contractForm.type=res.data.contType.value;
          let rightAddress = res.data.propertyRightAddr
          let index1 = rightAddress.indexOf('市')
          let index2 = rightAddress.indexOf('区')
          if(index1>0){
            this.rightAddrCity=rightAddress.substring(0,index1)
          }
          if(index2>0){
            if(index1>0){
              this.rightAddrArea=rightAddress.substring(index1+1,index2)
            }else{
              this.rightAddrArea=rightAddress.substring(0,index2)
            }
          }
          if(index1>0&&index2>0){
            this.rightAddrDetail=rightAddress.substring(index2+1)
          }else if(index1>0&&index2<0){
            this.rightAddrDetail=rightAddress.substring(index1+1)
          }else if(index1<0&&index2>0){
            this.rightAddrDetail=rightAddress.substring(index2+1)
          }else{
            this.rightAddrDetail=rightAddress
          }
          
          // this.contractForm.extendParams=JSON.parse(res.data.extendParams);
          // this.options.push({id:res.data.houseInfo.HouseStoreCode,name:res.data.houseInfo.HouseStoreName});
          // this.options_.push({id:res.data.guestInfo.GuestStoreCode,name:res.data.guestInfo.GuestStoreName});
          if(res.data.isHaveCooperation){
            this.cooperation=true
          }
          this.ownerList=[];
          this.guestList=[];
          for (var i = 0; i < this.contractForm.contPersons.length; i++) {
            if (this.contractForm.contPersons[i].personType.value === 1) {
              let element = {
                name:this.contractForm.contPersons[i].name,
                mobile:this.contractForm.contPersons[i].mobile,
                pid:this.contractForm.contPersons[i].pid,
                encryptionMobile:this.contractForm.contPersons[i].encryptionMobile,
                relation:this.contractForm.contPersons[i].relation,
                propertyRightRatio:this.contractForm.contPersons[i].propertyRightRatio,
                identifyCode:this.contractForm.contPersons[i].identifyCode,
                encryptionCode:this.contractForm.contPersons[i].encryptionCode,
                cardType:this.contractForm.contPersons[i].cardType,
                type:1,
                edit:false,
                isEncryption:true
              }
              let obj = Object.assign({}, element);
              // obj.mobile=obj.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
              this.ownerList.push(obj);
              let obj_ = Object.assign({}, element);
              this.ownerList_.push(obj_);
            } else if (this.contractForm.contPersons[i].personType.value === 2) {
              let element = {
                name:this.contractForm.contPersons[i].name,
                mobile:this.contractForm.contPersons[i].mobile,
                pid:this.contractForm.contPersons[i].pid,
                encryptionMobile:this.contractForm.contPersons[i].encryptionMobile,
                relation:this.contractForm.contPersons[i].relation,
                propertyRightRatio:this.contractForm.contPersons[i].propertyRightRatio,
                identifyCode:this.contractForm.contPersons[i].identifyCode,
                encryptionCode:this.contractForm.contPersons[i].encryptionCode,
                cardType:this.contractForm.contPersons[i].cardType,
                type:2,
                edit:false,
                isEncryption:true
              }
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
    cutNumber(val){
      if(val==="contCode"){//合同编号

      }else if(val==="dealPrice"){
        this.$nextTick(()=>{
          this.contractForm.dealPrice=this.$tool.cutFloat({val:this.contractForm.dealPrice,max:999999999.99})
        })
      }else if(val==="custEnsure"){
        this.$nextTick(()=>{
          this.contractForm.custEnsure=this.$tool.cutFloat({val:this.contractForm.custEnsure,max:999999999.99})
        })
      }else if(val==="custCommission"){
        this.$nextTick(()=>{
          this.contractForm.custCommission=this.$tool.cutFloat({val:this.contractForm.custCommission,max:999999999.99})
        })
      }else if(val==="ownerCommission"){
        this.$nextTick(()=>{
          this.contractForm.ownerCommission=this.$tool.cutFloat({val:this.contractForm.ownerCommission,max:999999999.99})
        })
      }else if(val==="commissionPayment"){
        this.$nextTick(()=>{
          this.contractForm.commissionPayment=this.$tool.cutFloat({val:this.contractForm.commissionPayment,max:999999999.99})
        })
      }else if(val==="stagesArrears"){
        this.$nextTick(()=>{
          this.contractForm.houseInfo.stagesArrears=this.$tool.cutFloat({val:this.contractForm.houseInfo.stagesArrears,max:999999999.99})
        })
      }else if(val==="otherCooperationCost"){
        this.$nextTick(()=>{
          this.contractForm.otherCooperationCost=this.$tool.cutFloat({val:this.contractForm.otherCooperationCost,max:999999999.99})
        })
      }else if(val==="Square"){
        this.$nextTick(()=>{
          this.contractForm.houseInfo.Square=this.$tool.cutFloat({val:this.contractForm.houseInfo.Square,max:999999.99})
        })
      }else if(val==="SquareUse"){
        this.$nextTick(()=>{
          this.contractForm.houseInfo.SquareUse=this.$tool.cutFloat({val:this.contractForm.houseInfo.SquareUse,max:999999.99})
        })
      }
    },
    cutNumber_(index,type){
      if(type==='guest'){
        this.guestList[index].propertyRightRatio=this.$tool.cutFloat({val:this.guestList[index].propertyRightRatio,max:100})
      }else if(type==='owner'){
        this.ownerList[index].propertyRightRatio=this.$tool.cutFloat({val:this.ownerList[index].propertyRightRatio,max:100})
      }
    },
    cutAddress(type){
      let addrReg=/\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\&|\!|\~|\`|\|/g
      if(type==="city"){
        this.rightAddrCity=this.rightAddrCity.replace(/\s+/g,"").replace(addrReg,'').replace("市","")
      }else if(type==="area"){
        this.rightAddrArea=this.rightAddrArea.replace(/\s+/g,"").replace(addrReg,'').replace("区","")
      }else{
        this.rightAddrDetail=this.rightAddrDetail.replace(/\s+/g,"").replace(addrReg,'')
      }
    },
    inputOnly(index,type){
      if(type==='owner'){
        this.ownerList[index].name=this.$tool.textInput(this.ownerList[index].name)
      }else if(type==='guest'){
        this.guestList[index].name=this.$tool.textInput(this.guestList[index].name)
      }else if(type==='other'){
        this.contractForm.otherCooperationInfo.name=this.$tool.textInput(this.contractForm.otherCooperationInfo.name)
      }
    },
    inputCode(){
      // let addrReg=/\\|\/|\@|\#|\%|\?|\？|\!|\！|\…|\￥|\+|\;|\；|\,|\，|\。|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\：|\:|\、|\^|\$|\&|\!|\~|\`|\|/g
      let addrReg = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\(\)\-\_]/g
      if(this.contractForm.code){
        this.contractForm.code=this.contractForm.code.replace(/\s+/g,"").replace(addrReg,'')
      }
     
    },
    closeCheckPerson(){
      checkPerson.state=false;
      this.$router.push('/contractList');
    },
    //这个可以验证15位和18位的身份证，并且包含生日和校验位的验证。
    isIdCardNo(num) {
      num = num.toUpperCase();
      //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
      if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
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
          var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
          var bGoodDay;
          bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2]))
                      && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3]))
                      && (dtmBirth.getDate() == Number(arrSplit[4]));
          if (!bGoodDay) {
              // alert('输入的身份证号里出生日期不对！');
              return false;
          } else {
              //将15位身份证转成18位
              //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
              var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
              var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
              var nTemp = 0, i;
              num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
              for (i = 0; i < 17; i++) {
                  nTemp += num.substr(i, 1) * arrInt[i];
              }
              num += arrCh[nTemp % 11];
              return true;
          }
      }
      if (len == 18) {
          re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
          var arrSplit = num.match(re);
          //检查生日日期是否正确
          var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
          var bGoodDay;
          bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2]))
                      && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3]))
                      && (dtmBirth.getDate() == Number(arrSplit[4]));
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
  }
  },
   mounted(){
    window.onresize = this.clientHeight;
  },
  beforeUpdate() {
    this.clientHeight();
  },
  beforeDestroy(){
    localStorage.removeItem('backMsg')
  },
  // watch:{
  //   ownerList:function(){
  //     let arr = this.ownerList.map(item=>Object.assign({},item))
  //     this.ownerList.forEach(item=>{
  //       // item=JSON.parse(JSON.stringify(item))
  //       debugger
  //       if(item.isEncryption){
  //         this.$set(item,'mobile',item.mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2"))
  //       }
  //     })
  //     this.ownerList_=[].concat(arr)
  //   }
  // },
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
.personalMsg{
  /deep/.el-dialog__header{
    border: none !important;
  }
}
.singleCompany{
  // text-align: center;
  padding: 20px 0 10px 10px;
}
.warning-box{
  margin: -4px 0 18px 28px;
  p{
    line-height: 1.4;
    &:first-of-type{
      // display:flex;
      // align-items:center;
      i{
        color:orange;
        font-size:48px;
        margin-right:16px;
      }
      span{
        font-size:16px
      }
    }
    &:last-of-type{
      padding-left:64px;
      color: red;
    }
  }
  >ul{
    margin-bottom: 10px;
    li{
      padding-left: 65px;
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
  input{
    &:-ms-input-placeholder{
      color:#CBCED5!important;
    }
    &::-webkit-input-placeholder{
      color:#CBCED5;
    }
    &::-moz-placeholder{
      color:#CBCED5;
    }
  }
  /deep/.el-input__inner{
    &:-ms-input-placeholder{
      color:#CBCED5!important;
    }
    &::-webkit-input-placeholder{
      color:#CBCED5;
    }
    &::-moz-placeholder{
      color:#CBCED5;
    }
  }
}
/deep/.form-label {
    position: relative;
    &:before {
      content: '*';
      display: inline-block;
      color: red;
    }
  }
  .dealPrice{
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
  .propertyRight{
    width: 80px;
    box-sizing: border-box;
    padding: 7px 10px!important;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
  }
  .forbid{
    background: #f5f7fa;
  }
  .yuan{
    position: absolute;
    top: 0;
    right: 6px;
    font-size: 14px;
    color: #ccc;
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
    .select_{
      display: inline-block;
      width: 140px;
      text-align: left;
      color:@color-blue;
      font-weight: bold;
    }
    .propertyAddress{
      cursor:not-allowed;
      min-width: 500px;
      display: inline-block;
      box-sizing: border-box;
      text-align: left;
      font-size: 14px;
      padding-left: 15px;
      color: #606266;
      border-radius: 4px;
      background: #F5F7FA;
      border: 1px solid #dcdfe6;
    }
    .color_{
      color: #c0c4cc;
    }
    .shopName{
      min-width: 200px;
      height: 32px;
    }
    .parameter{
      display: flex;
      width: 1200px;
      flex-wrap:wrap;
      padding-bottom: 10px;
      li{
        display: flex;
        height: 50px;
        width: 350px;
        line-height: 50px;
        > .title{
          width: 100px;
          cursor: pointer;
          text-align: right;
          // padding-right: 10px;
          color: #606266;
          text-overflow:ellipsis;
          white-space:nowrap;
          overflow:hidden;
          display: inline-block;
        }
        > .colon{
          padding: 0 5px;
        }
        > .unit{
          width: 70px;
          padding-left: 10px;
          color: #606266;
          overflow: hidden;
        }
      }
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
      margin-bottom: 10px;
      .merge {
        border: 1px solid #dcdfe6;
        padding: 7px 2px;
        border-radius: 3px;
      }
      .shell{
        display: inline-block;
        position: relative;
        &::after {
          content: '%';
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
    .disabled {
      background-color: #f5f7fa;
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
      .icon-tubiao_shiyong-4{
        font-size: 22px;
        color: @color-FF5;
      }
    }
  }
}
.width-250{
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
</style>
