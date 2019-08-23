<template>
  <div class="view-container">
    <div class="header">
      <div class="title">
        <p><span>合同预览</span>合同需签章打印且双方签字后生效</p>
      </div>
      <div class="type" v-if="isShowType">
        <div :class="{'active':isActive===1}" @click="changeType(1)">居间合同</div>
        <div :class="{'active':isActive===2}" @click="changeType(2)">买卖合同</div>
      </div>
      <div class="btn" v-if="contType<4">
        <!-- <el-button round><i class="iconfont icon-icon-test3"></i></el-button> -->
        <!-- <el-button round><i class="iconfont icon-yuanjiaojuxing1"></i></el-button> -->
        <!-- <div class="blowUp">
          <div @click="blowUp">放大</div>
          <div @click="shrink">缩小</div>
        </div> -->
        <el-button-group>
          <el-button round @click="blowUp"><i class="iconfont icon-icon-test3"></i></el-button>
          <el-button round @click="shrink"><i class="iconfont icon-yuanjiaojuxing1"></i></el-button>
        </el-button-group>
        <el-button type="primary" round v-if="power['sign-ht-info-edit'].state&&(examineState<0||examineState===2)" @click="toEdit">编辑</el-button>
        <!-- <div class="showPosBox" v-if="examineState===1&&contState===1&&isActive===1&&(companySigns.length>1||companySigns.length===1&&!isNewTemplate)" @mouseover="showList" @mouseout="closeList"> -->
        <div class="showPosBox" v-if="examineState===1&&contState===1&&isActive===1&&(companySigns.length===1&&!isNewTemplate||companySigns.length!=1)" @mouseover="showList" @mouseout="closeList">
          <!-- <el-button type="primary" round v-if="examineState===1&&contState===1&&isActive===1" @click="showPos" @mouseover.native="showList" @mouseout="closeList">签章位置</el-button> -->
          <span class="signAddr" @click="showList_">{{isNewTemplate?"签章选择":"签章位置"}}</span>
          <div class="signList">
            <ul>
              <li v-for="item in companySigns" :key="item.storeId" @click="chooseSign(item)">
                {{item.name}}
              </li>
              <li v-if="companySigns.length===0" class="noCompanySigns">该门店暂未设置签章！</li>
            </ul>
          </div>
        </div>
        <!-- <el-button type="primary" round v-if="examineState===1&&contState===1&&isActive===1" @click="showPos">签章位置</el-button> -->
        <el-button type="primary" round v-if="power['sign-ht-xq-void'].state&&contState!=3&&contState!=0" @click="dialogInvalid = true">撤单</el-button>
        <el-button round type="primary" v-if="power['sign-ht-view-toverify'].state&&examineState<0&&contType<4&&isCanAudit===1" @click="isSubmitAudit=true">提交审核</el-button>
        <el-button round type="primary" v-if="power['sign-ht-xq-modify'].state&&contState===3&&contChangeState!=2&&contChangeState!=1&&laterStageState!=5" @click="goChangeCancel(1)">变更</el-button>
        <el-button round type="danger"  v-if="power['sign-ht-xq-cancel'].state&&contState===3&&contChangeState!=2&&laterStageState!=5"  @click="goChangeCancel(2)">解约</el-button>
        <!-- <el-button round v-if="power['sign-ht-view-print'].state&&examineState===1&&contState===1&&(!isNewTemplate&&signPositions.length>0||isNewTemplate&&storeId)" @click="signature(3)"  v-loading.fullscreen.lock="fullscreenLoading">签章打印</el-button> -->
        <el-popover
          v-if="power['sign-ht-view-print'].state&&examineState===1&&contState===1&&(!isNewTemplate&&signPositions.length>0||isNewTemplate&&storeId)"
          placement="top-start"
          width="140"
          trigger="hover">
          <img class="signImg" :src="signImg" alt="">
          <el-button slot="reference" round @click="signature(1)" v-loading.fullscreen.lock="fullscreenLoading">签章打印</el-button>
        </el-popover>
        <el-button round v-if="power['sign-ht-view-print'].state&&examineState===1&&contState===2" @click="dayin">签章打印</el-button>
        <el-button type="primary" round @click="dialogCheck = true" v-if="examineState===0&&userMsg.empId===auditId">审核</el-button>
        <el-button round v-if="examineState===0&&userMsg.empId!==auditId">审核中</el-button>
        <el-button round @click="showContData" v-if="power['sign-ht-xq-data'].state">资料库</el-button>
      </div>
      <div class="btn" v-else>
        <el-button-group>
          <el-button round @click="blowUp"><i class="iconfont icon-icon-test3"></i></el-button>
          <el-button round @click="shrink"><i class="iconfont icon-yuanjiaojuxing1"></i></el-button>
        </el-button-group>
        <el-button type="primary" round v-if="power['sign-ht-info-edit'].state" @click="toEdit">编辑</el-button>
      </div>
    </div>

    <div class="yulan" :style="{ height: clientHei }">
      <div class="content">
        <div class="signaturewrap">
            <img v-for="(item,index) in src" :key="index" :src="item" alt="" :style="{width:getWidth}">
            <!-- <div class="signature">
                <img src="../../../assets/img/yz.png" class="yuanzhang" alt="">
                <i class="el-icon-close"></i>
            </div> -->

        </div>
        <!-- <div class="btnList">
          <el-button class="paging iconfont icon-tubiao_shiyong-20" @click="del"></el-button>
          <div class="tally"><span>{{count}}</span>/<span>{{showTotal}}</span></div>
          <el-button class="paging iconfont icon-tubiao_shiyong-22" @click="add"></el-button>
        </div> -->
        <!-- <div class="blowUp">
          <button @click="blowUp">放大</button>
          <button @click="shrink">缩小</button>
        </div> -->
      </div>
    </div>

    <!-- 合同撤单弹窗 -->
    <el-dialog title="合同撤单" :visible.sync="dialogInvalid" width="740px" :closeOnClickModal="$tool.closeOnClickModal">
      <div class="top">
        <p class="form-label">合同撤单原因</p>
        <div class="reason">
          <el-input type="textarea" :rows="6" placeholder="请填写合同撤单原因，最多100字 " v-model="invalidReason" resize='none' style="width:597px" maxlength="100">
          </el-input>
          <span>{{invalidReason.length}}/100</span>
          <p v-if="examineState>-1&&contState!=2"><span>注：</span>您的合同{{examineState===1?'已审核通过':'正在审核中'}}，是否确认要做撤单？撤单后，合同需要重新提审！</p>
          <p v-if="contState===2"><span>注：</span>您的合同已签章，是否确认要做撤单？撤单后，合同需要重新提审！</p>
          <p v-if="examineState<0"><span>注：</span>您的合同是否确认要做撤单？撤单后，合同需要重新提审！</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="dialogInvalid = false">取消</el-button>
        <el-button round type="primary" @click="setInvalid">保存</el-button>
      </span>
    </el-dialog>
    <!-- 合同审核弹窗 -->
    <el-dialog title="合同审核" :visible.sync="dialogCheck" width="740px" :closeOnClickModal="$tool.closeOnClickModal">
      <div class="checkTop">
        <div @click="sign"><span :class="{'sign':isSign}">标记风险单</span></div>
      </div>
      <div class="checkBottom">
        <p><span v-if="isSign">*</span>审核备注</p>
        <div class="reason">
          <el-input type="textarea" :rows="5" placeholder="请填写审核原因以及风险单原因，最多100字 " v-model="textarea" resize='none' style="width:624px" maxlength="100">
          </el-input>
          <span>{{textarea.length}}/100</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="checked(2)">驳回</el-button>
        <el-button round type="success" @click="checked(1)">通过</el-button>
      </span>
    </el-dialog>
    <!-- 变更/解约编辑弹窗 -->
    <changeCancel :dialogType="canceldialogType" :cancelDialog="changeCancel_" :contId="changeCancelId" :code="code" @closeChangeCancel="changeCancelDialog" v-if="changeCancel_"></changeCancel>
     <!-- 提审确认框 -->
    <el-dialog title="提示" :visible.sync="isSubmitAudit" width="460px">
      <span>确定提审？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isSubmitAudit = false">取 消</el-button>
        <el-button type="primary" @click="submitAudit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 打印 -->
    <!-- <PdfPrint :url="pdfUrl" ref="pdfPrint" v-if="haveUrl"></PdfPrint> -->
    <PdfPrint :url="pdfUrl" ref="pdfPrint" v-if="haveUrl" @closePrint="closePrint"></PdfPrint>
    <div class="printMaskLayer" v-if="haveUrl"></div>
    <!-- 设置/转交审核人 -->
    <checkPerson :show="checkPerson.state" :type="checkPerson.type" :showLabel="checkPerson.label" :bizCode="checkPerson.code" :flowType="checkPerson.flowType" @close="checkPerson.state=false" @submit="checkPerson.state=false" v-if="checkPerson.state"></checkPerson>
    <!-- 合同资料库弹窗 -->
    <el-dialog title="资料库" :visible.sync="dialogContData" width="740px" :closeOnClickModal="$tool.closeOnClickModal">
      <div class="contData">
        <div class="classify" v-if="sellerList.length>0">
          <p class="title">业主</p>
          <div class="one_" v-for="(item,index) in sellerList" :key="index">
            <p><i v-if="item.isrequire">*</i>{{item.title}}</p>
            <ul class="ulData">
              <li>
                <file-up class="uploadSubject" :scane="dataScane" :id="'seller'+index" @getUrl="addSubject">
                  <i class="iconfont icon-shangchuan"></i>
                  <p>点击上传</p>
                </file-up>
              </li>
              <li v-for="(item_,index_) in item.value" :key="item_.index" @mouseover="moveIn(item.title+item_.path)" @mouseout="moveOut(item.title+item_.path)">
                <el-tooltip class="item" effect="dark" :content="item_.name" placement="bottom">
                  <div class="namePath" @click="previewPhoto(item.value,index_,3)">
                    <upload-cell :type="item_.fileType"></upload-cell>
                    <p>{{item_.name}}</p>
                  </div>
                </el-tooltip>
                <i class="iconfont icon-tubiao-6" @click="delectData(index,index_,'seller')" :class="{'deleteShow':isDelete===item.title+item_.path}"></i>
              </li>
            </ul>
          </div>
        </div>
        <div class="classify" v-if="buyerList.length>0">
          <p class="title">客户</p>
          <div class="one_" v-for="(item,index) in buyerList" :key="index">
            <p><i v-if="item.isrequire">*</i>{{item.title}}</p>
            <ul class="ulData">
              <li>
                <file-up class="uploadSubject" :scane="dataScane" :id="'buyer'+index" @getUrl="addSubject">
                  <i class="iconfont icon-shangchuan"></i>
                  <p>点击上传</p>
                </file-up>
              </li>
              <li v-for="(item_,index_) in item.value" :key="item_.index" @mouseover="moveIn(item.title+item_.path)" @mouseout="moveOut(item.title+item_.path)">
                <el-tooltip class="item" effect="dark" :content="item_.name" placement="bottom">
                  <div class="namePath" @click="previewPhoto(item.value,index_,3)">
                    <upload-cell :type="item_.fileType"></upload-cell>
                    <p>{{item_.name}}</p>
                  </div>
                </el-tooltip>
                <i class="iconfont icon-tubiao-6" @click="delectData(index,index_,'buyer')" :class="{'deleteShow':isDelete===item.title+item_.path}"></i>
              </li>
            </ul>
          </div>
        </div>
        <div class="classify" v-if="otherList.length>0">
          <p class="title">其他</p>
          <div class="one_" v-for="(item,index) in otherList" :key="index">
            <p><i v-if="item.isrequire">*</i>{{item.title}}</p>
            <ul class="ulData">
              <li>
                <file-up class="uploadSubject" :scane="dataScane" :id="'other'+index" @getUrl="addSubject">
                  <i class="iconfont icon-shangchuan"></i>
                  <p>点击上传</p>
                </file-up>
              </li>
              <li v-for="(item_,index_) in item.value" :key="item_.index" @mouseover="moveIn(item.title+item_.path)" @mouseout="moveOut(item.title+item_.path)">
                <el-tooltip class="item" effect="dark" :content="item_.name" placement="bottom">
                  <div class="namePath" @click="previewPhoto(item.value,index_,3)">
                    <upload-cell :type="item_.fileType"></upload-cell>
                    <p>{{item_.name}}</p>
                  </div>
                </el-tooltip>
                <i class="iconfont icon-tubiao-6" @click="delectData(index,index_,'other')" :class="{'deleteShow':isDelete===item.title+item_.path}"></i>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="dialogContData=false">取消</el-button>
        <el-button round type="primary" @click="uploading('上传成功')">保存</el-button>
      </span>
      <!-- 图片预览 -->
      <preview :imgList="previewFiles" :start="previewIndex" :previewType="previewType" v-if="preview" @close="preview=false"></preview>
    </el-dialog>
  </div>
</template>

<script>
import changeCancel from "../contractDialog/changeCancel";
import PdfPrint from '@/components/PdfPrint';
import { MIXINS } from "@/assets/js/mixins";
import checkPerson from '@/components/checkPerson';

export default {
  mixins: [MIXINS],
  components: {
    changeCancel,
    PdfPrint,
    checkPerson
  },
  data() {
    return {
      isActive: 1,
      dialogInvalid: false,
      dialogCheck: false,
      invalidReason: "",
      textarea:"",
      isSign: 0,
      //审核
      operationType: "",
      //合同id
      id:'',
      code:'',
      cityId:'',
      isShowType:false,
      //审批流节点信息
      // auditNodeResult:{},
      //签章
      isSignature:false,
      //买卖合同地址
      business:'',
      total_b:'',
      //居间合同地址
      residence:'',
      total_r:'',
      //其他合同地址
      address:'',
      total_a:'',
      //展示地址
      showAddress:'',
      showTotal:'',
      src:[],
      count:1,
      //合同状态
      contState:'',
      //审核状态
      examineState:'',
      //合同类型
      contType:'',
      //变更解约
      contChangeState:'',
      laterStageState:'',
      //当前待审人id
      auditId:'',
      //当前登录人信息
      userMsg:{},
      subCheck:'提交审核',
      canceldialogType:'',
      changeCancel_:'',
      changeCancelId:'',
      isCanAudit:'',//html是否完整
      isSubmitAudit:false,
      //客源方门店id
      guestStoreId:'',
      //合同打印的pdf地址
      pdfUrl:'',
      haveUrl:false,
      //加载等待
      fullscreenLoading:false,
      clientHei:'',
      //合同资料库
      isHaveData:'',
      dialogContData:false,
       //买方类型
      buyerList: [],
      //卖方类型
      sellerList: [],
      //其他类型
      otherList: [],
      isDelete:'',
      recordId:'',//合同创建人id
      checkPerson: {
        state:false,
        type:1,
        code:'',
        flowType:3,
        label:false
      },
      previewType:"none",
      imgWidth:700,
      reduce:0,//合同页数是否减少 0无  1有
      position:true,
      signPositions:[],
      companySigns:[],//印章
      storeId:'',//印章id
      signImg:'',
      showSignList:false,
      isNewTemplate:true,//是否是新模板
      dataScane:{
        path:"ziliaoku",
        id:this.$route.query.code
      },
      http:'',
      power: {
        'sign-ht-info-edit': {
          state: false,
          name: '编辑'
        },
        'sign-ht-xq-void': {
          state: false,
          name: '撤单'
        },
        'sign-ht-view-toverify': {
          state: false,
          name: '提交审核'
        },
        'sign-ht-xq-modify': {
          state: false,
          name: '变更'
        },
        'sign-ht-xq-cancel': {
          state: false,
          name: '解约'
        },
        'sign-ht-view-print': {
          state: false,
          name: '签章打印'
        },
        'sign-ht-xq-data': {
          state: false,
          name: '资料库权限'
        },
        // 'sign-ht-xq-data-add': {
        //   state: false,
        //   name: '编辑资料库'
        // },
        'sign-ht-xq-main-down': {
            state: false,
            name: '下载合同主体'
        },
        'sign-ht-xq-data-down': {
          state: false,
          name: '下载合同资料库'
        },
      },
      countnum:0,//创建拖拽元素个数
    };
  },
  created() {
    if (!window.location.origin) {
      window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
    }
    this.http = window.location.origin
    this.id = this.$route.query.id;
    this.code = this.$route.query.code;
    if (this.$route.query.operationType) {
      this.operationType = this.$route.query.operationType;
    }
    this.getContDataType();//获取合同集料库类型
    this.getContImg();
    this.getAdmin();//获取当前登录人信息

  },
  methods: {
      tuozhuai(sign,countnum){
        var oDiv=document.getElementsByClassName('signature')[countnum]
        var that=this
        oDiv.onmousedown = function(ev){
          // debugger
            var disX = ev.clientX -oDiv.offsetLeft;
            var disY = ev.clientY - oDiv.offsetTop;
          var l=0;
          var t=0;
          let pageNums=Array.from(document.querySelectorAll('.signaturewrap>img'))
          let pageHeight=[]
          let pageindex=0
          pageNums.forEach((item,index)=>{
            pageHeight.push(item.offsetHeight)
          })
            document.onmousemove = function(ev){
            l = ev.clientX-disX;
            t = ev.clientY-disY;
            l > oDiv.parentNode.offsetWidth-130 ? l = oDiv.parentNode.offsetWidth-130 : l
            l < 0 ? l = 0 : l
            t < 0 ? t = 0 : t
            t > oDiv.parentNode.offsetHeight-130 ? t = oDiv.parentNode.offsetHeight-130 : t

            // let pageindex=parseInt(ev.target.offsetTop/(992))+1

            oDiv.style.left = l+'px';
            oDiv.style.top = t+'px';
            };

            document.onmouseup = function(ev){
              let deviation=0
              if(oDiv.offsetTop<pageHeight[0]){
                pageindex=1
              }else {
                deviation=oDiv.offsetTop-pageHeight[0]
                pageindex=parseInt(deviation/(pageHeight[1]))+2
              }
              sign.x=Number((l/706).toFixed(2))-0.02
              sign.y=Number((t/document.querySelectorAll('.signaturewrap>img')[pageindex-1].offsetHeight).toFixed(2))
              sign.pageIndex=Number(pageindex)

              let deviationY=sign.pageIndex===1?0:that.isShowType?0.086:0.086
              let deviationX=that.isShowType&&sign.pageIndex===1?0.01:0.03
              // console.log(deviationX,deviationY)
              if(that.isShowType){
                sign.x=sign.x+deviationX
              }
              if(sign.y>1){
                sign.y=sign.y-(sign.pageIndex-1)-deviationY
              }else {
                sign.y=sign.y-deviationY
              }
              let state=sign.y>0.85&&sign.y<1
            if(state){
              sign.y=0.85
            }else{
              sign.y=parseFloat(sign.y).toFixed(4)
            }
            sign.x=parseFloat(sign.x).toFixed(4)
            document.onmousemove=null;
            document.onmouseup=null;
            };
        };
        document.getElementsByClassName('el-icon-close')[countnum].onclick=function(ev){
          that.signPositions.forEach((item,index)=>{
            if(item.index==ev.target.getAttribute('index')){
              that.signPositions.splice(index,1)
              console.log(ev.target.parentNode,'parent');
              ev.target.parentNode.style.display="none"
            }
          })
        }
    },
    //显示印章下拉框
    showList(){
      // if(this.companySigns.length>1){
        document.querySelector('.signList').style.display="block"
      // }
    },
    closeList(){
      document.querySelector('.signList').style.display="none"
    },
    showList_(){
      if(!this.isNewTemplate&&this.companySigns.length>0){
        if(this.storeId){
          if(!this.isNewTemplate){
            this.showPos()
          }
        }
        // else if(!this.storeId&&this.companySigns.length===0){
        //   this.$message({
        //     message:'该公司未设置电子签章，请先设置合同电子签章！',
        //     type:'warning'
        //   })
        // }
      }
    },
    chooseSign(item){
      this.storeId=item.storeId;
      this.signImg=item.contractSign;
      this.showSignList=false;
      if(!this.isNewTemplate){
        let imgDoms = Array.from(document.getElementsByClassName('signature'))
        imgDoms.forEach(element => {
          element.querySelector('img').src=item.contractSign;
        });
        this.showPos()
      }
    },
    showPos(){
      var content=document.getElementsByClassName('yulan')[0]
      let signturn=document.createElement('div')
      signturn.setAttribute('class','signature')
      signturn.innerHTML =`
                <img src="" class="yuanzhang" alt="">
                <i class="el-icon-close" @click="delsign" index="${this.countnum}"></i>
                `
      // signturn.querySelector('img').src=require("../../../assets/img/yz.png")
      signturn.querySelector('img').src=this.signImg
      var signaturewrap=document.getElementsByClassName('signaturewrap')[0]
      signaturewrap.appendChild(signturn)
      // var sign={x:0,y:0,pageIndex:1,index:this.count}
      var sign={x:0,y:content.scrollTop,pageIndex:1,index:this.countnum}
      let obj=document.getElementsByClassName('signature')[this.countnum]
      obj.style.top=sign.y+'px'
      this.signPositions.push(JSON.parse(JSON.stringify(sign)))
      this.signPositions.forEach((item,index)=>{
        if(item.index==this.countnum){
          this.tuozhuai(this.signPositions[index],this.countnum++)
        }
      })

    },
    // 控制弹框body内容高度，超过显示滚动条
    clientHeight() {
      this.clientHei= document.documentElement.clientHeight -140 + 'px'
    },
    //居间买卖切换
    changeType(value) {
      this.isActive = value;
      if(value===1){
        this.count=1;
        this.showAddress=this.residence;
        this.setSrc(this.showAddress,this.total_r);
        let signatures=document.getElementsByClassName('signature')

        for(let i=0;i<signatures.length;i++){
          signatures[i].style.opacity=1
        }
        // this.showTotal=this.total_r
      }else{
        this.count=1;
        this.showAddress=this.business;
        this.setSrc(this.showAddress,this.total_b);
        // this.showTotal=this.total_b;
        var signatures=document.getElementsByClassName('signature')
        for(let i=0;i<signatures.length;i++){
          signatures[i].style.opacity=0
        }
      }
    },
    //放大缩小
    blowUp(){//放大
      if(this.imgWidth<950){
        this.imgWidth+=50
      }
    },
    shrink(){//缩小
      if(this.imgWidth>650){
        this.imgWidth-=50
      }
    },
    //翻页
    // add(){
    //   if(this.count<this.showTotal){
    //     this.count++;
    //     this.setSrc(this.showAddress,this.count);
    //   }
    // },
    // del(){
    //   if(this.count>1){
    //     this.count--;
    //     this.setSrc(this.showAddress,this.count);
    //   }
    // },
    //标记风险单
    sign() {
      if (this.isSign) {
        this.isSign = 0;
      } else {
        this.isSign = 1;
      }
    },
    //通过驳回
    toChecked(param){
      this.$ajax.postJSON('/api/machine/audit', param).then(res=>{
        res=res.data
        if(res.status===200){
          this.dialogCheck=false;
          this.isSignature=true;
          this.getContImg();
          this.$message({
            message:'审核成功',
            type:'success'
          })
        }
      }).catch(error => {
          if(error.message==='下一节点审批人不存在'){
            this.checkPerson.code=this.code;
            this.checkPerson.state=true;
            this.checkPerson.type=3;
            // this.checkPerson.type=error.data.type===1?'set':'init';
            this.checkPerson.label=true;
          }else{
            this.$message({
              message:error,
              type: "error"
            })
          }
        })
    },
    //签章
    signature(value){
      if(value===1){//签章
        let param = {
          id:this.id,
          type:value,
          signPosition:JSON.stringify(this.signPositions),
          storeId:this.storeId
          // reduce:this.reduce//合同页数是否减少 0无  1有
        }
        this.fullscreenLoading=true;
        //签章
        this.$ajax.post('/api/contract/signture', param).then(res=>{
          res=res.data;
          if(res.status===200){
            // let pdfUrl=res.data;
            // this.fullscreenLoading=false;
            this.getContImg()
            // // debugger
            // let pictureList = Array.from(document.getElementsByClassName('signature'))
            // console.log(pictureList)
            // pictureList.forEach(element => {
            //   element.style.display="none"
            // });
            // this.getUrl(pdfUrl);
            // this.haveUrl=true;
            this.pdfUrl=`${this.http}/api/contract/getSignPdf?id=${this.id}`
            this.haveUrl=true;
            this.fullscreenLoading=false;
          }
        }).catch(error =>{
          this.fullscreenLoading=false;
          this.$message({
            message:error,
            type: "error"
          })
        })
      }else if(value===2){//打印(仅仅记录次数)
        let param = {
          id:this.id,
          type:value
        }
        this.$ajax.post('/api/contract/signture', param).then(res=>{
          res=res.data;
          if(res.status===200){
            this.pdfUrl=`${this.http}/api/contract/getSignPdf?id=${this.id}`
            this.haveUrl=true;
          }
        })
      }
    },
    dayin(){
      // this.$refs.pdfPrint.print();
      this.signature(2);
    },
    //关闭打印
    closePrint(){
       this.haveUrl=false;
    },
    //获取签名
    getUrl(url){
      let param = {
        url:url
      }
      this.$ajax.get("/api/load/generateAccessURL",param).then(res=>{
        res = res.data
        if(res.status ===200){
          this.pdfUrl = res.data.url;
        }
      })
    },
    checked(num) {
      //驳回/风险单
      if (num===2 || this.isSign) {
        if (this.textarea.length>0) {
          this.textarea=this.textarea.replace(/\s/g,"");
          if(this.textarea.length>0){
            let param = {
              bizCode:this.code,
              flowType:3,
              approvalForm:{
                result: num,
                isRisk: this.isSign, //风险单
                remark: this.textarea
              }
            };
            this.toChecked(param);
          }else{
            this.$message({
              message: '请填写审核原因以及风险单原因',
              type: 'warning'
            });
          }
        }else{
          this.$message({
            message: '请填写审核原因以及风险单原因',
            type: 'warning'
          });
        }
      } else {
        let param = {
          bizCode:this.code,
          flowType:3,
          approvalForm:{
            result: num,
            isRisk: this.isSign, //风险单
            remark: this.textarea
          }
        };
        this.toChecked(param);
      }
    },
    //获取当前待审节点
    // getAuditNode(){
    //   let param = {
    //     bizCode:this.code,
    //     flowType:3
    //   }
    //   this.$ajax.get('/api/machine/getAuditNode', param).then(res=>{
    //     res=res.data;
    //     if(res.status===200){
    //       this.auditNodeResult=res.data;
    //     }
    //   })
    // },
    //获取合同预览图片
    getContImg(type){
      let param = {
        id:this.id
      };
      this.$ajax.get('/api/contract/preview', param).then(res=>{
        res=res.data;
        if(res.status===200){
          // this.getContData();
          // if(res.data.contState.value===2&&!type){
          //   this.signature(2)
          // }
          this.examineState=res.data.examineState.value;
          this.laterStageState=res.data.laterStageState.value;
          this.contState=res.data.contState.value;
          this.contType=res.data.contType.value;
          this.recordId=res.data.recordId;
          this.isCanAudit=res.data.isCanAudit;
          this.guestStoreId=res.data.guestStoreId;
          this.contChangeState=res.data.contChangeState.value;
          this.cityId=res.data.cityId;
          this.auditId=res.data.auditId;
          this.isSign=res.data.isRisk;
          this.isHaveData=res.data.isHaveData;
          if(res.data.companySigns&&res.data.companySigns.length===1){
            this.storeId=res.data.companySigns[0].storeId;
            this.signImg=res.data.companySigns[0].contractSign;
          }
          this.companySigns=res.data.companySigns?res.data.companySigns:[];
          this.isNewTemplate=res.data.isNewTemplate;//是否是新合同模板
          if(res.data.isRisk){
            this.textarea=res.data.remarksExamine;
          }
          // if(res.data.cityId===1&&(res.data.contType.value===2||res.data.contType.value===3)){

            //1 武汉  2 合肥  11 襄阳
          if(res.data.isWuHanMM===1&&(res.data.contType.value===2)){
            this.isShowType=true;
            //买卖
            this.business=res.data.imgAddress.business;
            this.total_b=res.data.imgCount.business;
            //居间
            this.residence=res.data.imgAddress.residence;
            this.total_r=res.data.imgCount.residence;
            this.showAddress=res.data.imgAddress.residence;
            // this.showTotal=res.data.imgCount.residence;
            this.setSrc(this.showAddress,res.data.imgCount.residence);
          }else {
            //其他
            this.address=res.data.imgAddress.address;
            this.total_a=res.data.imgCount.count;
            this.showAddress=res.data.imgAddress.address;
            // this.showTotal=res.data.imgCount.count;
            this.setSrc(this.showAddress,res.data.imgCount.count);
          }
        }
      })
    },
    //拼接地址
    setSrc(value,count){
      // let src = value.substr(0,value.lastIndexOf('.'))+count+value.substr(value.lastIndexOf('.'));
      var arrSrc = [];
      for(let i=1;i<=count;i++){
        let src = value.substr(0,value.lastIndexOf('.'))+i+value.substr(value.lastIndexOf('.'));
        arrSrc.push(src);
      }
      let param = {
        urls:arrSrc.join(',')
      }
      this.$ajax.put("/api/load/generateAccessURLBatch",param,2).then(res=>{
        res = res.data
        if(res.status ===200){
          this.src = res.data;
          res.data.forEach(element => {
            if(element==="文件不存在"){
              this.reduce=1;
            }
          });
        }
      })
    },
    //编辑
    toEdit(){
      this.setPath(this.$tool.getRouter(['合同','合同列表','合同编辑'],'contractList'));
      if(this.contType>3){
        this.$router.replace({
          path: "/newIntention",
          query: {
            id: this.id,
            contType: this.contType,
            operateType: 2
          }
        });
      }else{
        this.$router.replace({
          path: "/addContract",
          query: {
            id: this.id,
            operateType: 2,
            type: this.contType
          }
        });
      }

    },
     //提审
    submitAudit(){
      let param = {
        cityId:this.cityId,
        flowType:3,
        bizCode:this.code
      }
      this.$ajax.get('/api/machine/submitAduit', param).then(res=>{
        res=res.data
        if(res.status===200){
          this.$message({
            message:'提交审核成功',
            type:'success'
          });
          this.getContImg();
          this.isSubmitAudit=false
          this.subCheck="审核中"
        }else{
          this.$message({
            message:res.message,
          })
          this.isSubmitAudit=false
        }
      }).catch(error => {
          if(error.message==='下一节点审批人不存在'){
            this.isSubmitAudit=false
            this.checkPerson.code=this.code;
            this.checkPerson.state=true;
            this.checkPerson.type=1;
            // this.checkPerson.type=error.data.type===1?'set':'init';
            this.checkPerson.label=true;
          }else{
            this.$message({
              message:error,
              type: "error"
            })
          }
        })
    },
    // 变更解约弹窗
    goChangeCancel(value) {
      this.changeCancelId = Number(this.id);
      if (value === 1) {
        this.canceldialogType = "changeEdit";
        this.changeCancel_ = true;
      } else if (value === 2) {
        this.canceldialogType = "cancelEdit";
        this.changeCancel_ = true;
      }
    },
    // 关闭变更解约弹窗
    changeCancelDialog() {
      this.getContImg();
      this.changeCancel_ = false;
      this.canceldialogType = "";
      this.changeCancelId = "";
    },
    //撤单
    setInvalid(){
      if(this.invalidReason.length>0){
        this.invalidReason=this.invalidReason.replace(/\s/g,"")
        if(this.invalidReason.length>0){
          let param = {
            id: this.id,
            reason: this.invalidReason
          };
          this.$ajax.post('/api/contract/invalid', param).then(res=>{
            res=res.data;
            if(res.status===200){
              this.getContImg();
              this.dialogInvalid=false;
              this.$message({
                message:'操作成功',
                type:"success"
              })
            }
          }).catch(error => {
            this.$message({
              message:error,
              type: "error"
            })
          })
        }else{
          this.$message({
            message:'请填写撤单原因',
            type:"warning"
          })
        }
      }else{
        this.$message({
          message:'请填写撤单原因',
          type:"warning"
        })
      }
    },
    //合同资料库弹窗
    showContData(){
      if(this.isHaveData){
        this.getContData();
      }
      this.dialogContData=true;
    },
     //获取合同资料库类型列表
    getContDataType() {
      let param = {
        id: this.id
      };
      this.$ajax.get("/api/contract/getContDataTypeById", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          let dataType = JSON.parse(res.data);
          // console.log(dataType);
          dataType.forEach(element => {
            if(element.type==='1'){
              let item={};
              item.value=[];
              item.kind=element.type;
              item.title=element.name;
              item.isrequire=element.isNecessary;
              this.buyerList.push(item);
            }else if(element.type==='2'){
              let item={};
              item.value=[];
              item.kind=element.type;
              item.title=element.name;
              item.isrequire=element.isNecessary;
              this.sellerList.push(item);
            }else if(element.type==='3'){
              let item={};
              item.value=[];
              item.kind=element.type;
              item.title=element.name;
              item.isrequire=element.isNecessary;
              this.otherList.push(item);
            }
          });
        }
      })
    },
    //获取合同资料库信息

    getContData() {
      let param = {
        id: this.id
      };
      this.$ajax.get("/api/contract/getContAttachmentById", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          if(res.data){
            let address = JSON.parse(res.data.address);
            // console.log(address)
            address.forEach(element => {
              element.value.forEach(item => {
                let fileType = this.$tool.get_suffix(item.name);
                item.fileType=fileType
              });
              if(element.kind==="1"){
                this.buyerList.forEach(ele => {
                  if(element.title===ele.title){
                    ele.value=element.value
                  }
                });
              }else if(element.kind==="2"){
                this.sellerList.forEach(ele => {
                  if(element.title===ele.title){
                    ele.value=element.value
                  }
                });
              }else if(element.kind==="3"){
                this.otherList.forEach(ele => {
                  if(element.title===ele.title){
                    ele.value=element.value
                  }
                });
              }
            });
          }
        }
      });
    },
    //合同资料库添加数据
    addSubject(data){
      let arr = data.param;
      let num = Number(data.btnId.substring(data.btnId.length-1));
      let typeId = data.btnId.substring(0,data.btnId.length-1);
      arr.forEach(element => {
        let fileType = this.$tool.get_suffix(element.name);
        element.fileType = fileType;
      });
      if(typeId==='seller'){
        // this.sellerList[num].value.push(arr[0]);
        this.sellerList[num].value=this.sellerList[num].value.concat(arr);
      }else if(typeId==='buyer'){
        // this.buyerList[num].value.push(arr[0]);
        this.buyerList[num].value=this.buyerList[num].value.concat(arr);
      }else if(typeId==='other'){
        // this.otherList[num].value.push(arr[0]);
        this.otherList[num].value=this.otherList[num].value.concat(arr);
      }
    },
    //显示删除按钮
    moveIn(value){
      this.isDelete=value
    },
    moveOut(value){
      if(this.isDelete===value){
        this.isDelete=''
      }
    },
    //上传合同资料库
    uploading(msg){
      let uploadContData = this.sellerList.concat(this.buyerList, this.otherList);
      console.log(uploadContData);
      let isOk;
      let arr_=[];
      for(let i=0;i<uploadContData.length;i++){
        isOk = false;
        if(uploadContData[i].isrequire&&uploadContData[i].value.length===0){
          this.$message({
            message:`${uploadContData[i].title}不能为空`,
            type:'warning'
          });
          break
        }else if(uploadContData[i].isrequire&&uploadContData[i].value.length>0){
          // uploadContData[i].value.forEach(element => {
          // delete element.fileType;
          // });
          arr_.push(uploadContData[i]);
          isOk = true;
        }else if(!uploadContData[i].isrequire&&uploadContData[i].value.length>0){
          // uploadContData[i].value.forEach(element => {
          //   delete element.fileType;
          // });
          arr_.push(uploadContData[i]);
          isOk = true;
        }else{
          isOk = true;
        }
      }
      if(isOk){
        if(this.laterStageState===4||this.laterStageState===1){
          var code = 1;
        }else{
          var code = 2;
        }
        let param = {
          datas: arr_,
          contId: this.id,
          operation:code
        }
        // console.log(param)
        this.$ajax.postJSON('/api/contract/uploadContData', param).then(res=>{
          res=res.data;
          if(res.status===200){
            this.$message({
              message:msg,
              type:'success'
            });
            this.getContImg();
            this.dialogContData=false;
          }
        })
      }
    },
    //合同资料科删除
    delectData(index,index_,type){
      if(this.isHaveData){
        if(type==="seller"){
          if(this.sellerList[index].isrequire){
            if(this.sellerList[index].value.length>1){
              this.sellerList[index].value.splice(index_,1);
              // this.uploading('删除成功')
            }else{
              this.$message({
                message:'至少保留一个，请勿删除',
                type:'warning'
              })
            }
          }else{
            this.sellerList[index].value.splice(index_,1);
            // this.uploading('删除成功')
          }
        }else if(type==="buyer"){
          // this.buyerList[index].value.splice(index_,1);
          if(this.buyerList[index].isrequire){
            if(this.buyerList[index].value.length>1){
              this.buyerList[index].value.splice(index_,1);
              // this.uploading('删除成功')
            }else{
              this.$message({
                message:'至少保留一个，请勿删除',
                type:'warning'
              })
            }
          }else{
            this.buyerList[index].value.splice(index_,1);
            // this.uploading('删除成功')
          }
        }else if(type==="other"){
          // this.otherList[index].value.splice(index_,1);
          if(this.otherList[index].isrequire){
            if(this.otherList[index].value.length>1){
              this.otherList[index].value.splice(index_,1);
              // this.uploading('删除成功')
            }else{
              this.$message({
                message:'至少保留一个，请勿删除',
                type:'warning'
              })
            }
          }else{
            this.otherList[index].value.splice(index_,1);
            // this.uploading('删除成功')
          }
        }
      }else{
        if(type==="seller"){
          this.sellerList[index].value.splice(index_,1);
        }else if(type==="buyer"){
          this.buyerList[index].value.splice(index_,1);
        }else if(type==="other"){
          this.otherList[index].value.splice(index_,1);
        }
      }

    },
  },
  mounted(){
    window.onresize = this.clientHeight;
  },
  beforeUpdate() {
    this.clientHeight();
  },
  computed:{
    getWidth:function () {
      return `${this.imgWidth}px`
    },
  }
  // watch:{
  //   textarea:function(val){
  //     if(val.length>10){
  //       console.log('test')
  //     }
  //   }
  // }
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";

.signImg{
  max-height: 130px;
  max-width: 130px;
}
.view-container {
  background: @bg-white;
  .printMaskLayer{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    // display: none;
    z-index: 8888;
  }
  .header {
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    height: 60px;
    box-sizing: border-box;
    border-bottom: 2px solid @border-CE;
    position: relative;
    .title {
      position: absolute;
      left: 30px;
      top: 15px;
      > p {
        font-size: 12px;
        color: @color-6c;
        > span {
          color: @color-blank;
          font-size: 18px;
          padding-right: 10px;
        }
      }
    }
    .type {
      width: 200px;
      height: 36px;
      align-items: center;
      box-sizing: border-box;
      border: 2px solid @color-blue;
      border-radius: 18px;
      overflow: hidden;
      display: flex;
      position: absolute;
      top: 12px;
      left: 50%;
      transform: translateX(-50%);
      > div {
        width: 50%;
        height: 36px;
        line-height: 36px;
        text-align: center;
        font-size: 14px;
        color: @color-blue;
        cursor: pointer;
      }
      .active {
        background: @color-blue;
        color: @color-white;
      }
    }
    .btn {
      position: absolute;
      right: 30px;
      top: 12px;
      /deep/.el-button.is-round {
        padding: 10px 23px;
      }
      .showPosBox{
        display: inline-block;
        position: relative;
        margin-right: 10px;
        .signAddr{
          cursor: pointer;
          display: inline-block;
          // width: 100px;
          text-align: center;
          padding: 8px 20px;
          font-size: 14px;
          color: #fff;
          border-radius: 20px;
          background: #409EFF;
        }
        .noCompanySigns{
          color: red;
          padding: 0 10px;
        }
        .signList{
          display: none;
          transition: display 2s;
          white-space: nowrap;
          position: absolute;
          top:30px;
          padding-top: 10px;
          left: 0;
          z-index: 99;
          ul{
            background: #fff;
            padding: 5px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
          }
          li{
            padding: 3px 10px;
            cursor: pointer;
            &:hover{
              background: #f1f1f1;
            }
          }
        }
      }
    }
    /deep/.el-button-group{
      margin-right: 10px;
      .el-button{
        padding: 5px 15px !important;
      }
    }
  }
  .yulan{
    overflow-y: auto;
  }
  .content{
    padding-top: 20px;
    padding-bottom: 10px;
    display: flex;
    justify-content: center;
    .signaturewrap{
          position: relative;
      /deep/ .signature{
        width:130px;
        height: 130px;
        position: absolute;
        box-sizing: 130px;
        box-sizing: border-box;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        z-index: 9;
        &::before{
              content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9;
        }
        i{
            width: 16px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            background-color: #9B9B9B;
            position: absolute;
            border-radius: 50%;
            font-size: 10px;
            color: #fff;
            top: 0px;
            z-index: 999;
            right: 0px;
            display: none;
            cursor: pointer;
        }
        &:hover i{
              display: block;
            }
         img{
           border: none;
           width:130px;
           height: 130px;
           padding: 0px;
         }

      }
      img{
            border: 1px solid #ccc;
            display: block;
            margin: 0 auto;
            padding:0 2px;
          }

    }
    .btnList{
      margin-left: 20px;
      .tally{
        padding: 20px 0;
      }
      .paging{
        width: 36px;
        height: 36px;
        box-sizing: border-box;
        border-radius: 50%;
        padding: 0;
        font-size: 22px;
        font-weight: bold;
        color: @color-6c;
      }
    }
  }
  /deep/.el-dialog__header {
    border-bottom: 1px solid @border-ED;
  }
  /deep/.el-textarea{
    textarea{
      min-height: 120px!important;
    }
  }
  .top {
    display: flex;
    padding-top: 20px;
    > p {
      padding-right: 15px;
      font-size: 14px;
      width: 90px;
      color: @color-6c;
    }
    > .reason {
      position: relative;
      > span {
        position: absolute;
        top: 90px;
        right: 10px;
        color: @color-6c;
      }
      > p {
        padding-top: 10px;
        color: @color-6c;
        font-size: 12px;
        > span {
          color: @color-blank;
        }
      }
    }
  }
  .checkTop {
    padding: 20px 0 20px 80px;
    span{
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      color: @color-blank;
      font-size: 14px;
      cursor: pointer;
    }
    .sign {
      color: @color-warning;
      border-color: @color-warning;
    }
  }
  .checkBottom {
    display: flex;
    > p {
      font-size: 14px;
      width: 75px;
      color: @color-6c;
      > span {
        color: red;
        font-size: 16px;
      }
    }
    > .reason {
      position: relative;
      > span {
        position: absolute;
        bottom: 10px;
        right: 20px;
        color: @color-6c;
      }
      > p {
        padding-top: 10px;
        color: @color-6c;
        font-size: 12px;
        > span {
          color: @color-blank;
        }
      }
    }
  }
  .contData{
    height: 450px;
    overflow-y: auto;
    .classify {
      padding-top: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid @border-ED;
      .title {
        font-size: 16px;
        color: @color-324;
      }
      .one_ {
        padding-left: 20px;
        > p {
          font-size: 14px;
          padding: 10px 0;
          color: @color-6c;
          > i {
            color: @color-FF;
          }
        }
      }
      .noData{
        text-align: center;
        width: 100px;
        height: 100px;
        padding-top: 40px;
        box-sizing: border-box;
        border-radius:4px;
        background: @color-F2;
      }
    }
    .ulData{
      display: flex;
      flex-wrap:wrap;
      li{
        margin-right: 10px;
        position: relative;
        margin-bottom: 10px;
        > i{
          display: none;
          position: absolute;
          top: 2px;
          right: 2px;
          color: @color-warning;
          font-size: 20px;
          cursor: pointer;
        }
      }
      .deleteShow{
        display: block !important;
      }
      .uploadSubject {
        display: inline-block;
        text-align: center;
        width: 100px;
        height: 100px;
        box-sizing: border-box;
        padding-top: 10px;
        border: 1px dashed @border-DE;
        border-radius:1px;
        i {
          color: @bg-th;
          font-size: 50px;
        }
        p {
          padding-top: 5px;
          color: @color-324;
          font-size: 12px;
        }
      }
    }
    .namePath{
      display: inline-block;
      text-align: center;
      width: 100px;
      height: 100px;
      padding-top: 10px;
      box-sizing: border-box;
      border-radius:4px;
      background: @color-F2;
      > p{
        padding-top: 3px;
        display: inline-block;
        width: 100px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
