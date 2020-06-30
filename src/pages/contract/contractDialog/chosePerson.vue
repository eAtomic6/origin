<template>
    <div class="view-container">
      <el-dialog
        title="选择签署客户/业主"
        :visible="getDialogVisible"
        @close="submit('close')"
        :closeOnClickModal="$tool.closeOnClickModal"
        >
        <div class="personMsg">
          <div class="title">业主</div>
          <ul>
            <li v-for="(item,index) in getOwnerList" :key="index">
              <div class="personType">
                业主{{index+1}}
                <span @click="chose('owner',item)">
                  <span v-if="choseOwnerM.includes(item.mobile)"></span>
                </span>
              </div>
              <div>
                <span>姓名：{{item.name}}</span>
                <span>电话：{{item.mobile}}</span>
                <span>关系：{{item.relation}}</span>
                <span>证件类型：{{item.cardType===1?'身份证号':item.cardType===2?'护照':item.cardType===3?'营业执照':'军官证'}}</span>
                <span>证件号码：{{item.encryptionCode}}</span>
              </div>
            </li>
          </ul>
          <div class="title">客户</div>
          <ul>
            <li v-for="(item,index) in getGuestList" :key="index">
              <div class="personType">
                客户{{index+1}}
                <span @click="chose('guest',item)">
                  <span v-if="choseGuestM.includes(item.mobile)"></span>
                </span>
              </div>
              <div>
                <span>姓名：{{item.name}}</span>
                <span>电话：{{item.mobile}}</span>
                <span>关系：{{item.relation}}</span>
                <span>证件类型：{{item.cardType===1?'身份证号':item.cardType===2?'护照':item.cardType===3?'营业执照':'军官证'}}</span>
                <span>证件号码：{{item.encryptionCode}}</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="floor_btn">
          <el-button round class="search_btn" @click="submit('close')">取消</el-button>
          <el-button type="primary" round class="search_btn" @click="submit('confirm')">确认</el-button>
        </div>
      </el-dialog>
    </div>
</template>
           
<script>
export default{
  props:{
    dialogVisible:{
      type:Boolean,
      default:false
    },
    ownerList:{
      type:Array,
      default(){
        return []
      }
    },
    guestList:{
      type:Array,
      default(){
        return []
      }
    },
    choseQuery:{
      type:Object,
      default(){
        return {}
      }
    }
  },
  data(){
    return{
      choseOwnerM:[],
      choseOwner:[],
      choseGuestM:[],
      choseGuest:[],
    }
  },
  methods:{
    //选择
    chose(type,val){
      if(type==="owner"){
        let index = this.choseOwnerM.indexOf(val.mobile)
        if(index>-1){
          this.choseOwnerM.splice(index,1)
          this.choseOwner.splice(index,1)
        }else{
          this.choseOwnerM.push(val.mobile)
          this.choseOwner.push(val)
        }
      }else{
        let index = this.choseGuest.indexOf(val.mobile)
        if(index>-1){
          this.choseGuestM.splice(index,1)
          this.choseGuest.splice(index,1)
        }else{
          this.choseGuestM.push(val.mobile)
          this.choseGuest.push(val)
        }
      }
    },
    //确认/取消
    submit(type){
      if(type==='confirm'){
        if(this.choseOwner.length>0&&this.choseGuest.length>0){
          let param = {
              contId:this.getChoseQuery.id,
              type:1,//签章
              isentrust:0,//非委托
              storeId:this.getChoseQuery.storeId//门店id
          }
          let owner=[],customer=[]
          this.choseOwner.forEach(element => {
              let item = {
                  name:element.name,
                  identityType:element.cardType,
                  identity:element.encryptionCode,
                  mobile:element.mobile,
                  email:element.email,
              }
              owner.push(item)
          });
          this.choseGuest.forEach(element => {
              let item = {
                  name:element.name,
                  identityType:element.cardType,
                  identity:element.encryptionCode,
                  mobile:element.mobile,
                  email:element.email,
              }
              customer.push(item)
          });
          param.owner=owner
          param.customer=customer
          this.$ajax.postJSON('/api/app/contract/sendCont',param).then(res=>{
              res=res.data
              if(res.status===200){
                  this.$emit("closeChose",true)
              }
          }).catch(error=>{
              this.$message({
                message:error,
                type:"error"
              })
          })
        }else{
          this.$message({
            message:this.choseOwner.length>0?'请选择客户':'请选择业主',
            type:"warning",
          })
        }
      }else{
        this.$emit("closeChose",false)
      }
    },
  },
  computed:{
    getDialogVisible(){
      return this.dialogVisible;
    },
    getOwnerList(){
      return this.ownerList;
    },
    getGuestList(){
      return this.guestList;
    },
    getChoseQuery(){
      return this.choseQuery;
    },
  }     
}
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.personMsg{
  padding: 10px;
  height: 500px;
  overflow-y: auto;
  color: @color-blank;
  .title{
    padding: 0 10px;
    &:last-of-type{
      margin-top: 10px;
    }
  }
  ul{
    li{
      overflow: hidden;
      border-radius: 5px;
      box-shadow: -1px 1px 3px 2px #f2f2f2;
      margin-top: 10px;
      .personType{
        position: relative;
        color: @color-grey;
        background-color: #f2f2f2;
        padding: 10px;
        >span{
          cursor: pointer;
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid @color-blue;
          border-radius: 50%;
          >span{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateY(-50%) translateX(-50%);
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: @color-blue;
          }
        }
      }
      div{
        padding: 12px 10px;
        span{
          margin-right: 20px;
        }
      }
    }
  }
}
.floor_btn {
  overflow: hidden;
  display: flex;
  padding: 10px;
  justify-content: flex-end;
  //float: right;
  .search_btn {
    padding: 8px 15px;
  }
}        
</style>