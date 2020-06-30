<template>
  <div class="view-container">
    <el-dialog title="合同签后审核" :visible="getDialogVisible" @close='close' width="760px" :closeOnClickModal="$tool.closeOnClickModal">
      <div class="mainCont" :class="{'wtType':isWT}">
        <div class="mainData" :class="{'noBorder':isWT}">
          <p :class="{'fontBold':!isWT}">{{isWT?'委托合同主体：':'合同主体'}}</p>
          <ul class="ulData" style="margin-bottom:10px">
            <li v-for="(item,index) in mainData" :key="item.index">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="bottom">
                <div class="namePath" @click="previewPhoto(mainData,index)">
                  <img class="signImage" :src="item.path|getSignImage(mainDataFiles)" alt="" v-if="isPictureFile(item.fileType)">
                  <upload-cell :type="item.fileType" v-else></upload-cell>
                  <p>{{item.name}}</p>
                </div>
              </el-tooltip>
            </li>
          </ul>
        </div>
        <div class="dataBank" v-if="!isWT">
          <p class="fontBold">资料库</p>
          <div class="classify" v-if="sellerList.length>0">
            <div class="one_" v-for="(item,index) in sellerList" :key="index" v-if="item.value.length>0">
              <p class="title">业主</p>
              <p class="title_"><i v-if="item.isrequire">*</i>{{item.title}}</p>
              <ul class="ulData">
                <li v-for="(item_,index_) in item.value" :key="item_.index">
                  <el-tooltip class="item" effect="dark" :content="item_.name" placement="bottom">
                    <div class="namePath" @click="previewPhoto(item.value,index_,3)">
                      <img class="signImage" :src="item_.path|getSignImage(contDataFiles)" alt="" v-if="isPictureFile(item_.fileType)">
                      <upload-cell :type="item_.fileType" v-else></upload-cell>
                      <p>{{item_.name}}</p>
                    </div>
                  </el-tooltip>
                </li>
              </ul>
            </div>
          </div>
          <div class="classify" v-if="buyerList.length>0">
            <div class="one_" v-for="(item,index) in buyerList" :key="index" v-if="item.value.length>0">
              <p class="title">客户</p>
              <p class="title_"><i v-if="item.isrequire">*</i>{{item.title}}</p>
              <ul class="ulData">
                <li v-for="(item_,index_) in item.value" :key="item_.index">
                  <el-tooltip class="item" effect="dark" :content="item_.name" placement="bottom">
                    <div class="namePath" @click="previewPhoto(item.value,index_,3)">
                      <img class="signImage" :src="item_.path|getSignImage(contDataFiles)" alt="" v-if="isPictureFile(item_.fileType)">
                      <upload-cell :type="item_.fileType" v-else></upload-cell>
                      <p>{{item_.name}}</p>
                    </div>
                  </el-tooltip>
                </li>
              </ul>
            </div>
          </div>
          <div class="classify" v-if="otherList.length>0">
            <div class="one_" v-for="(item,index) in otherList" :key="index" v-if="item.value.length>0">
              <p class="title">其他</p>
              <p class="title_"><i v-if="item.isrequire">*</i>{{item.title}}</p>
              <ul class="ulData">
                <li v-for="(item_,index_) in item.value" :key="item_.index">
                  <el-tooltip class="item" effect="dark" :content="item_.name" placement="bottom">
                    <div class="namePath" @click="previewPhoto(item.value,index_,3)">
                      <img class="signImage" :src="item_.path|getSignImage(contDataFiles)" alt="" v-if="isPictureFile(item_.fileType)">
                      <upload-cell :type="item_.fileType" v-else></upload-cell>
                      <p>{{item_.name}}</p>
                    </div>
                  </el-tooltip>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <p class="form-label" style="margin-top:10px;">通过/驳回原因：</p>
      <div class="reason">
        <el-input type="textarea" :rows="6" placeholder="请输入通过或者驳回原因" v-model.trim="checkReasion" @input="inputOnly" resize='none' maxlength="200">
        </el-input>
        <span>{{checkReasion.length}}/200</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="checked(2)">驳回</el-button>
        <el-button round type="primary" @click="checked(1)">通过</el-button>
      </span>
    </el-dialog>
    <!-- 驳回弹窗 -->
    <el-dialog title="确认驳回" class="rejectDialog" :visible.sync="rejectDialog" width="460px" :closeOnClickModal="$tool.closeOnClickModal">
      <div class="checkList">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="合同主体"></el-checkbox>
          <el-checkbox label="资料库"></el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="rejectDialog=false">取 消</el-button>
        <el-button round type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置/转交审核人 -->
    <checkPerson
    :show="checkPerson.state" page="list"
    :type="checkPerson.type"
    :showLabel="checkPerson.label"
    :bizCode="checkPerson.code"
    :flowType="checkPerson.flowType"
    @close="closeCheckPerson"
    @submit="closeCheckPerson"
    v-if="checkPerson.state"
    >
    </checkPerson>
    <!-- 图片预览 -->
    <preview
    :imgList="previewFiles"
    :start="previewIndex"
    :previewType="previewType"
    v-if="preview"
    @close="preview=false"
    >
    </preview>
  </div>
</template>
           
<script>
import { MIXINS } from "@/assets/js/mixins";
import { TOOL } from "@/assets/js/common";
import checkPerson from '@/components/checkPerson';

export default {
  mixins: [MIXINS],
  components:{
    checkPerson
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    id:{
      type: Number,
      default: 0
    },
    signedId:{
      type: Number,
      default: 0
    },
    isWT:{
      type:Number,
      default:0
    }
  },
  data(){
    return{
      title:"合同签后审核",
      checkReasion:"",//审核原因
      mainData:[],//合同主体
      contDataFiles:[],//资料库图片缩略图
      mainDataFiles:[],//合同主体图片缩略图
      checkPerson: {
        state:false,
        type:1,
        code:'',
        flowType:12,
        label:false,
        current:false
      },
      // 资料库类型
      //买方类型
      buyerList: [],
      //卖方类型
      sellerList: [],
      //其他类型
      otherList: [],
      rejectDialog:false,//驳回弹窗
      checkList:[],
    }
  },
  created(){
    this.getMainData()
    if(this.isWT){
      this.title="委托合同主体审核"
    }else{
      this.getContDataType()
    }
  },
  methods:{
    close(){
      this.$emit("closeDialog")
    },
    closeCheckPerson(){
      this.close()
    },
    inputOnly(){
      let addrReg=/\\|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\&|\!|\~|\`|\|/g
      this.checkReasion=this.checkReasion.replace(/\s+/g,"").replace(addrReg,'')
    },
    //获取合同主体
    getMainData(){
      let param = {
        id:this.id,
        isentrust:this.isWT?1:0
      }
      this.$ajax.get('/api/contract/getContractBodyById', param).then(res=>{
        res=res.data
        if(res.status===200){
          let uploadList_ = res.data
          uploadList_.forEach(element => {
            let fileType = this.$tool.get_suffix(element.name)
            element.fileType=fileType
          });
          this.mainData=uploadList_  //合同
          let preloadList=[]
          uploadList_.forEach((item,index)=>{//判断附件是否为图片，是则存入临时数组获取签名用于缩略图展示
            if(this.isPictureFile(item.fileType)){
              preloadList.push(item.path)
            }
          })
          this.fileSign(preloadList,'preload').then(res=>{
            this.mainDataFiles=res
          })
        }
      })
    },
    //获取资料库
    getContData() {
      let param = {
        id: this.id
      };
      this.$ajax.get("/api/contract/getContAttachmentById", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          let pathList = []
          let address = JSON.parse(res.data.address);
          address.forEach(element => {
            element.value.forEach(item => {
              let fileType = this.$tool.get_suffix(item.name);
              item.fileType=fileType
              pathList.push(item)
            });
            if(Number(element.kind)===1){
              this.buyerList.forEach(ele => {
                if(element.title===ele.title){
                  ele.value=element.value
                }
              });
            }else if(Number(element.kind)===2){
              this.sellerList.forEach(ele => {
                if(element.title===ele.title){
                  ele.value=element.value
                }
              });
            }else if(Number(element.kind)===3){
              this.otherList.forEach(ele => {
                if(element.title===ele.title){
                  ele.value=element.value
                }
              });
            }
          });
          let preloadList=[]
          pathList.forEach((item,index)=>{//判断附件是否为图片，是则存入临时数组获取签名用于缩略图展示
            if(this.isPictureFile(item.fileType)){
              preloadList.push(item.path)
            }
          })
          this.fileSign(preloadList,'preload').then(res=>{
            this.contDataFiles=res
          })
        }
      });
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
          dataType.forEach(element => {
            if(Number(element.type)===1){
              let item={};
              item.value=[];
              item.kind=element.type;
              item.title=element.name;
              item.isrequire=element.isNecessary;
              this.buyerList.push(item);
            }else if(Number(element.type)===2){
              let item={};
              item.value=[];
              item.kind=element.type;
              item.title=element.name;
              item.isrequire=element.isNecessary;
              this.sellerList.push(item);
            }else if(Number(element.type)===3){
              let item={};
              item.value=[];
              item.kind=element.type;
              item.title=element.name;
              item.isrequire=element.isNecessary;
              this.otherList.push(item);
            }
          });
          this.getContData()
        }
      })
    },
    //审核弹窗
    checked(type){
      if(type===1){//通过
        let param = {
          id:this.signedId,//签后id
          contId:this.id,//合同id
          remarks:this.checkReasion,//审核备注
          state:0,//通过驳回 0通过 1驳回
          contType:this.isWT===1?0:1//是否是委托合同 0是 1不是
        }
        this.subCheck(param)
      }else{//驳回
        if(this.checkReasion.length>0){
          if(this.isWT){//委托合同直接驳回
            let param = {
              id:this.signedId,//签后id
              contId:this.id,//合同id
              remarks:this.checkReasion,//审核备注
              state:1,//通过驳回 0通过 1驳回
              rejectFileType:'2',//驳回类型 字符串 '1'资料库 '2'合同主体 '12'资料库和合同主体
              contType:this.isWT===1?0:1//是否是委托合同 0是 1不是
            }
            this.subCheck(param)
          }else{//主合同选择是合同主体驳回还是资料库驳回
            this.checkList=["合同主体", "资料库"]
            this.rejectDialog=true
          }
        }else{
          this.$message({
            message:"请填写通过/驳回原因",
            type:"warning"
          })
        }
      }
    },
    //提交审核
    subCheck(param){
      console.log(param)
      this.$ajax.post('/api/signingAudit/signinAudit',param).then(res=>{
        res=res.data
        if(res.status===200){
          this.$message({
            message:"操作成功",
            type:"success"
          })
          this.close()
        }
      }).catch(error=>{
        if(error.status === 300 && error.message==="下一节点审批人不存在"){
          this.checkPerson.flowType=12   //签后审核的流程类型为12
          this.checkPerson.code=this.signedId  //业务编码为checkId
          this.checkPerson.state=true
          this.checkPerson.type=3
        }else{
          this.$message({
            message: error,
            type:"error"
          })
        }
      })
    },
    //主合同驳回
    confirm(){
      if(this.checkList.length>0){
        let param
        if(this.checkList.length===2){
          param = {
            id:this.signedId,//签后id
            contId:this.id,//合同id
            remarks:this.checkReasion,//审核备注
            state:1,//通过驳回 0通过 1驳回
            rejectFileType:'12',//驳回类型 字符串 '1'资料库 '2'合同主体 '12'资料库和合同主体
            contType:this.isWT===1?0:1//是否是委托合同 0是 1不是
          }
        }else if(this.checkList.length===1){
          param = {
            id:this.signedId,//签后id
            contId:this.id,//合同id
            remarks:this.checkReasion,//审核备注
            state:1,//通过驳回 0通过 1驳回
            rejectFileType:this.checkList[0]==="合同主体"?'2':'1',//驳回类型 字符串 '1'资料库 '2'合同主体 '12'资料库和合同主体
            contType:this.isWT===1?0:1//是否是委托合同 0是 1不是
          }
        }
        this.subCheck(param)
      }else{
        this.$message({
          message:"驳回类型不能为空",
          type:"warning"
        })
      }
    },
  },
  computed: {
    getDialogVisible: function() {
      return this.dialogVisible;
    },
  },
  filters:{
    /**
     * 过滤显示图片缩略图
     * @param val后端返回的所有文件资源遍历的当前项
     * @param list图片资源获取签名后的临时数组
     */
    getSignImage(val,list){
      if(list.length===0){
        return '';
      }else {
        return list.find(item=>{
          return item.includes(val)
        })
      }
    }
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/common.less";
/deep/.el-tabs__item{
  font-size: 18px;
}
.reason {
  position: relative;
  margin: 10px 0;
  width: 710px;
  > span {
    position: absolute;
    bottom: 10px;
    right: 20px;
    color: @color-6c;
  }
}
/deep/.el-dialog{
  .el-dialog__body{
    padding-left: 20px;
  }
  .el-dialog__footer{
    padding: 10px;
  }
}
.namePath{
  display: inline-block;
  text-align: center;
  width: 120px;
  height: 120px;
  padding-top: 20px;
  box-sizing: border-box;
  border-radius:4px;
  background: @color-F2;
  .signImage{
    width:60px;
    height: 60px;
    margin: 1px 0;
  }
  > p{
    padding-top: 5px;
    display: inline-block;
    width: 100px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
}
//资料库
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
      top: 5px;
      right: 5px;
      color: @color-warning;
      font-size: 20px;
      cursor: pointer;
    }
  }
}
.mainCont{
  height: 400px;
  overflow-y: auto;
}
.wtType{
  height: 200px!important;
}
.mainData{
  border-bottom: 1px solid @border-ED;
}
.noBorder{
  border-bottom:none;
  >p{
    padding: 5px 0;
  }
}
.fontBold{
  padding: 5px 0;
  font-size: 16px;
  color: black;
}
.dataBank {
  padding: 0 30px 0 0;
  .classify {
    position: relative;
    .one_ {
      padding-left: 10px;
      padding-top: 30px;
      padding-bottom: 30px;
      border-bottom: 1px solid @border-ED;
      .title {
        font-size: 16px;
        color: @color-324;
        position: absolute;
        top: 10px;
        left: 5px;
      }
      .title_ {
        font-size: 14px;
        padding: 10px 0;
        color: @color-6c;
        > i {
          color: @color-FF;
        }
      }
    }
  }
  // .classify {
  //   padding: 10px 0 10px 10px;
  //   &:last-of-type{
  //     border-bottom: none;
  //   }
  //   .title {
  //     font-size: 16px;
  //     color: @color-324;
  //   }
  //   .one_ {
  //     padding-left: 10px;
  //     > p {
  //       font-size: 14px;
  //       padding: 10px 0;
  //       color: @color-6c;
  //       > i {
  //         color: @color-FF;
  //       }
  //     }
  //   }
  // }
}
.rejectDialog{
  .checkList{
    text-align: center;
    padding: 40px 10px 40px 0;
    /deep/.el-checkbox__label{
      font-weight: bold;
      font-size: 16px;
    }
  }
  /deep/.el-dialog__footer{
    border-top: 1px solid #e8eaf6 ;
  }
}

</style>