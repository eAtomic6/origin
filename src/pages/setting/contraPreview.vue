<template>
    <div class='view-container'  v-loading="loading">
      <p class='title'>
          <span>合同模板预览</span>
          <!-- <el-button type="primary saveAll paper-btn" @click="saveAll" v-dbClick v-if="saveBtn">保存</el-button> -->
      </p>
    <div class="top" >
      <div class="type" v-if="uploadType==3">
        <div :class="{'active':isActive===1}" @click="changeType(1)">全款买卖合同</div>
        <div :class="{'active':isActive===2}" @click="changeType(2)">贷款买卖合同</div>
        <div :class="{'active':isActive===3}" @click="changeType(3)">居间合同</div>
      </div>
      <div class="type" v-if="uploadType==2">
        <div :class="{'active':isActive===1}" @click="changeType(1)">买卖合同</div>
        <div :class="{'active':isActive===2}" @click="changeType(2)">居间合同</div>
      </div>
      <!-- <div class="type" v-if="uploadType==1">
        <div :class="{'active':isActive===1}" @click="changeType(1)">居间合同</div>
      </div> -->
    </div>
      <div class="bodycontainer"  ref='bigbox'>
          <div class="ht-list listone" v-show='showFir' ref='htlist'>
          <div class='pagerUp'>
              <el-button ref='delBtn' class="el-icon-caret-top" @click="del(1)"></el-button>
              <div><span>{{count}}</span>/<span>{{total}}</span></div>
              <el-button  class="el-icon-caret-bottom paper-next" @click="add(1)"></el-button>
          </div>
          <img id='ht' src="" alt="">
          <div class='signature signatureone'  ref='dropBtn'  v-show='sigtureShow3'>
              <img :src="src" alt="">
          </div>
      </div>
       <div class="ht-list listone" v-show='showSed' ref='htlist'>
          <div class='pagerUp'>
              <el-button ref='delBtn' class="el-icon-caret-top" @click="del(2)"></el-button>
              <div><span>{{count2}}</span>/<span>{{total2}}</span></div>
              <el-button  class="el-icon-caret-bottom paper-next" @click="add(2)"></el-button>
          </div>
          <img id='ht2' src="" alt="">
          <div class='signature signaturetwo' ref='dropBtn' v-show='sigtureShow3'>
              <img :src="src" alt="">
          </div>
        </div>

        <div class="ht-list listone" v-show='showThd' ref='htlist'>
          <!-- <el-button type="primary paper-btn" class="qzbtn" @click="showPos" v-show='position2'>签章位置</el-button> -->
          <div class='pagerUp'>
              <el-button ref='delBtn' class="el-icon-caret-top" @click="del(3)"></el-button>
              <div><span>{{count3}}</span>/<span>{{total3}}</span></div>
              <el-button  class="el-icon-caret-bottom paper-next" @click="add(3)"></el-button>
          </div>
          <img id='ht3' src="" alt="">
          <div class='signature signaturetwo' ref='dropBtn' v-show='sigtureShow3'>
              <img :src="src" alt="">
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import {TOOL} from "@/assets/js/common";
import {MIXINS} from "@/assets/js/mixins";
export default{
    mixins: [MIXINS],
        data(){
          return{
            src:`${require('@/assets/img/yz.png')}`,
            sigtureShow3:false,
            sigtureShow:false,
            id:'',
            loading:true,
            contraName:'',
            mmaiAddress:'',
            jjianAddress:'',
            mbanAddress:'',
            modalDialog:false,
            tableDate:[],
            show:'', //展示形式 1:上传
            type:'',
            count:1,
            count2:1,
            count3:1,
            flag:1,
            total:1,
            total2:1,
            total3:1,
            imgSrc:'',
            imgSrc2:'',
            imgSrc3:'',
            cityId:'',
            enableTemplateId:'',
            showSed:false,
            timeout:0,
            touch:true,
            contents:[],
            content:[],
            qmnewsrcArr:[],
            signPositions:[],
            isActive:1,
            uploadType:1,
            showFir:true,
            showSed:false,
            showThd:false
          }
        },
        created(){
            this.qkAddress = this.$route.query.qkAddress
            this.dkAddress = this.$route.query.dkAddress
            this.jjianAddress2 = this.$route.query.jjianAddress2
            this.uploadType=this.$route.query.uploadType
            this.cityId=this.$route.query.selectCity
            this.cityName=this.$route.query.cityName
            this.mmaiAddress = this.$route.query.mmaiAddress
            this.jjianAddress = this.$route.query.jjianAddress
            this.mbanAddress = this.$route.query.mbanAddress
            this.type = this.$route.query.type
            this.contraName = this.$route.query.contraName
            this.show=this.$route.query.show
            this.id=this.$route.query.id
            this.enableTemplateId=this.$route.query.enableTemplateId
            if(this.show==1){
                this.setPath(this.$tool.getRouter(['设置','后台设置','合同模板设置','合同模板上传'],'contractTemplate'))
            }else if(this.show==2){
                this.setPath(this.$tool.getRouter(['设置','后台设置','合同模板设置','合同模板预览'],'contractTemplate'))
            }
        },
        mounted(){
            if(this.show==1){
               this.getImgAdd(this.count)
            }else if(this.show==2){
                debugger
                this.$ajax.get('/api/setting/contractTemplate/show',{enableTemplateId:this.enableTemplateId}).then((res)=>{
                    this.$nextTick(()=>{
                      this.loading=false
                    })
                     let resadd=res.data.data
                     if(resadd.img&&resadd.img.url!=''){
                            this.uploadType=1
                            this.imgSrc=resadd.img.url
                           this.total=res.data.data.img.count
                           let htImg=document.getElementById('ht')
                           var newsrc=this.imgSrc.substr(0,this.imgSrc.lastIndexOf('.'))+this.count+this.imgSrc.substr(this.imgSrc.lastIndexOf('.'))
                           this.autograph(htImg,newsrc)
                     }else if(res.data.data.businessImg&&res.data.data.businessImg.url!=''){
                            this.uploadType=2
                            this.imgSrc=res.data.data.businessImg.url
                            this.imgSrc2=res.data.data.residenceImg.url
                            this.total=res.data.data.businessImg.count
                            this.total2=res.data.data.residenceImg.count
                            let htImg=document.getElementById('ht')
                            var newsrc=this.imgSrc.substr(0,this.imgSrc.lastIndexOf('.'))+this.count+this.imgSrc.substr(this.imgSrc.lastIndexOf('.'))
                            this.autograph(htImg,newsrc)
                     }else if(res.data.data.wholeImg&&res.data.data.wholeImg.url!=''){
                            this.uploadType=3
                            this.imgSrc=res.data.data.wholeImg.url
                            this.imgSrc2=res.data.data.loanImg.url
                            this.imgSrc3=res.data.data.residenceImg.url
                            this.total=res.data.data.wholeImg.count
                            this.total2=res.data.data.loanImg.count
                            this.total3=res.data.data.residenceImg.count
                            let htImg=document.getElementById('ht')
                            var newsrc=this.imgSrc.substr(0,this.imgSrc.lastIndexOf('.'))+this.count+this.imgSrc.substr(this.imgSrc.lastIndexOf('.'))
                            this.autograph(htImg,newsrc)
                    }
          
                })
            }
        },
        methods:{
            changeType(type){
                if(type==2){
                    this.showFir=false
                    this.showSed=true
                    this.showThd=false
                    this.isActive=2
                    let htImg2=document.getElementById('ht2')
                     var newsrc2=this.imgSrc2.substr(0,this.imgSrc2.lastIndexOf('.'))+this.count2+this.imgSrc2.substr(this.imgSrc2.lastIndexOf('.'))
                     this.autograph(htImg2,newsrc2)
                }else if(type==1){
                    this.showFir=true
                    this.showSed=false
                    this.showThd=false
                    this.isActive=1
                    let htImg=document.getElementById('ht')
                     var newsrc=this.imgSrc.substr(0,this.imgSrc.lastIndexOf('.'))+this.count+this.imgSrc.substr(this.imgSrc.lastIndexOf('.'))
                     this.autograph(htImg,newsrc)
                }
                else if(type==3){
                     this.showFir=false
                    this.showThd=true
                    this.showSed=false
                    this.isActive=3
                    let htImg=document.getElementById('ht3')
                     var newsrc=this.imgSrc3.substr(0,this.imgSrc3.lastIndexOf('.'))+this.count3+this.imgSrc3.substr(this.imgSrc3.lastIndexOf('.'))
                     this.autograph(htImg,newsrc)
                }
            },
            saveAll(){
                if(this.show==1){
                        var param={
                        contractSeats:this.tableDate,
                        type:this.type,
                        cityName:this.cityName,
                        name:this.contraName,
                        cityId:this.cityId,
                        id:this.id
                        }
                        if(this.uploadType==3){
                            param=Object.assign({},param,{
                                address:{
                                whole:this.qkAddress ==''?'':this.qkAddress.path+'?'+this.qkAddress.name,
                                loan:this.dkAddress==''?'':this.dkAddress.path+'?'+this.dkAddress.name,
                                residence:this.jjianAddress2==''?'':this.jjianAddress2.path+'?'+this.jjianAddress2.name,
                            },
                            imgAddress:{
                                whole:this.imgSrc,
                                loan:this.imgSrc2,
                                residence:this.imgSrc3
                            },
                            imgPage:{
                                whole:this.total,
                                loan:this.total2,
                                residence:this.total3
                            }
                            })
                        }else{
                            param=Object.assign({},param,{
                                address:{
                                address:this.mbanAddress==''?'':this.mbanAddress.path+'?'+this.mbanAddress.name,
                                business:this.mmaiAddress==''?'':this.mmaiAddress.path+'?'+this.mmaiAddress.name,
                                residence:this.jjianAddress==''?'':this.jjianAddress.path+'?'+this.jjianAddress.name
                              },
                              imgAddress:{
                               "business":this.uploadType==2?this.imgSrc:'',
                               "residence":this.uploadType==2?this.imgSrc2:'',
                               "address":this.uploadType==1?this.imgSrc:''
                               },
                               imgPage:{
                                   "business":this.uploadType==2?this.total:0,
                                    "residence": this.uploadType==2?this.total2:0,
                                    "count": this.uploadType==1?this.total:0},
                            })
                        }
                            this.$ajax.postJSON('/api/setting/contractTemplate/insert',param).then(res=>{
                            if(res.status==200){
                                    this.touch=false
                                    this.$message({
                                    type: 'success',
                                    message: '上传成功'
                                    })
                            }
                        }).catch(
                                error=>this.$notify({
                                    type:'error',
                                    message: error,
                                    duration:3000,
                                },
                                    this.modalDialog=true
                                ),

                        )
                }
            },
            del(type){
                if(type==1){
                    this.count--
                    this.flag=0
                    if(this.count<=0){
                        this.count=this.total
                    }
                     this.sigtureShow=false
                    var htImg=document.getElementById('ht')
                    var newsrc=this.imgSrc.substr(0,this.imgSrc.lastIndexOf('.'))+this.count+this.imgSrc.substr(this.imgSrc.lastIndexOf('.'))
                    this.autograph(htImg,newsrc)
                }else if(type==2){
                    this.count2--
                    this.flag=0
                    if(this.count2<=0){
                        this.count2=this.total2
                    }
                    var htImg2=document.getElementById('ht2')
                    var newsrc=this.imgSrc2.substr(0,this.imgSrc2.lastIndexOf('.'))+this.count2+this.imgSrc2.substr(this.imgSrc2.lastIndexOf('.'))
                    this.autograph(htImg2,newsrc)
                }else if(type==3){
                    this.count3--
                    this.flag=0
                    if(this.count3<=0){
                        this.count3=this.total3
                    }
                    var htImg3=document.getElementById('ht3')
                    var newsrc=this.imgSrc2.substr(0,this.imgSrc3.lastIndexOf('.'))+this.count3+this.imgSrc3.substr(this.imgSrc3.lastIndexOf('.'))
                    this.autograph(htImg3,newsrc)
                }
            },
             add(type){
                 //展示当前页：根据this.count遍历签章数组，获取当前展示页的签章信息
               if(type==1){
                    this.flag=0
                    this.count++
                    if(this.count>this.total){
                        this.count=1
                    }
                     this.sigtureShow=false
                    var htImg=document.getElementById('ht')
                    var newsrc=this.imgSrc.substr(0,this.imgSrc.lastIndexOf('.'))+this.count+this.imgSrc.substr(this.imgSrc.lastIndexOf('.'))
                    this.autograph(htImg,newsrc)
               }else if(type==2){
                    this.flag=0
                    this.count2++
                    if(this.count2>this.total2){
                        this.count2=1
                    }
                    var htImg2=document.getElementById('ht2')
                    var newsrc=this.imgSrc2.substr(0,this.imgSrc2.lastIndexOf('.'))+this.count2+this.imgSrc2.substr(this.imgSrc2.lastIndexOf('.'))
                    this.autograph(htImg2,newsrc)
                }else if(type==3){
                    this.flag=0
                    this.count3++
                    if(this.count3>this.total3){
                        this.count3=1
                    }
                    var htImg3=document.getElementById('ht3')
                    var newsrc=this.imgSrc3.substr(0,this.imgSrc3.lastIndexOf('.'))+this.count3+this.imgSrc3.substr(this.imgSrc3.lastIndexOf('.'))
                    this.autograph(htImg3,newsrc)
                }
            },
            autograph(obj,newsrc){
                    var flag=0
                    for(let i=0;i< this.qmnewsrcArr.length;i++){
                        if(this.qmnewsrcArr[i][newsrc]){
                            obj.src=this.qmnewsrcArr[i][newsrc]
                            flag=1
                            if(Number(this.qmnewsrcArr[i].timeout)<Math.floor(new Date().getTime()/1000)){
                                flag=0
                            }
                        }
                    }
                     if(flag==0){
                          this.$ajax.get('/api/load/generateAccessURL',{url:newsrc}).then(res=>{
                          if(res.status==200){
                          this.timeout=res.data.data.url.split('?')[1].split('&')[0].split('=')[1]
                          let newsrc2=res.data.data.url
                          let a={}
                          a[newsrc]=newsrc2
                          a['timeout']=this.timeout
                          this.qmnewsrcArr.push(a)
                          obj.src=newsrc2
                          }
                     })
                   }
            },
            getImgAdd(count){
            var param={
                  
                  id:this.id,
                  cityId:this.cityId,
              }
              if(this.uploadType==3){
                param=Object.assign({},param,{
                    templateAddress:{
                    whole:this.qkAddress ==''?'':this.qkAddress.path,
                    loan:this.dkAddress==''?'':this.dkAddress.path,
                    residence:this.jjianAddress2==''?'':this.jjianAddress2.path
                  },
                })
              }else{
                param=Object.assign({},param,{
                    templateAddress:{
                    address:this.mbanAddress==''?'':this.mbanAddress.path,
                    business:this.mmaiAddress==''?'':this.mmaiAddress.path,
                    residence:this.jjianAddress==''?'':this.jjianAddress.path
                  },
                })
              }
              this.$ajax.get('/api/setting/contractTemplate/checkTemplate',param).then(res=>{
              if(res.status==200){
                  this.$nextTick(()=>{
                      this.loading=false
                    })
                 if(this.uploadType ==2){
                    this.imgSrc=res.data.data.businessImg.url
                    this.imgSrc2=res.data.data.residenceImg.url
                    this.total=res.data.data.businessImg.count
                    this.total2=res.data.data.residenceImg.count
                    let htImg=document.getElementById('ht')
                    var newsrc=this.imgSrc.substr(0,this.imgSrc.lastIndexOf('.'))+this.count+this.imgSrc.substr(this.imgSrc.lastIndexOf('.'))
                    this.autograph(htImg,newsrc)
                 }else if(this.uploadType==1){
                     let htImg=document.getElementById('ht')
                    this.imgSrc=res.data.data.img.url  //一个的
                    this.total=res.data.data.img.count
                    var newsrc=this.imgSrc.substr(0,this.imgSrc.lastIndexOf('.'))+this.count+this.imgSrc.substr(this.imgSrc.lastIndexOf('.'))
                    this.autograph(htImg,newsrc)
                 }else if(this.uploadType==3){
                    this.imgSrc=res.data.data.wholeImg.url
                    this.imgSrc2=res.data.data.loanImg.url
                    this.imgSrc3=res.data.data.residenceImg.url
                    this.total=res.data.data.wholeImg.count
                    this.total2=res.data.data.loanImg.count
                    this.total3=res.data.data.residenceImg.count
                    let htImg=document.getElementById('ht')
                    var newsrc=this.imgSrc.substr(0,this.imgSrc.lastIndexOf('.'))+this.count+this.imgSrc.substr(this.imgSrc.lastIndexOf('.'))
                    this.autograph(htImg,newsrc)
                 }
              }
              this.saveAll()
            }).catch(error=>{
                 this.$message({
                    type: 'error',
                    center:true,
                    message: error
                    })

                    setTimeout(() => {
                        this.$nextTick(()=>{
                            this.loading=false
                        })
                        this.$router.push({
                            path: "/contractTemplate",
                        });
                    }, 1500);
            })
            }
        }

}
</script>
<style lang='less' scoped>
@import "~@/assets/common.less";
 .top{
    height: 50px;
  }
  .type {
    height: 36px;
    align-items: center;
    box-sizing: border-box;
    border: 2px solid @color-blue;
    // border-radius: 18px;
    overflow: hidden;
    display: flex;
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    > div {
      width: 110px;
      height: 36px;
      margin: 0 10px;
      line-height: 36px;
      text-align: center;
      font-size: 14px;
      color: @color-blue;
      cursor: pointer;
      &:first-child{
          margin-left: 0px
      }
      &:last-child{
          margin-right: 0px
      }
    }
    .active {
      background: @color-blue;
      color: @color-white;
    }
  }
.view-container{
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    .title{
        height: 58px;
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        padding-left:12px;
        padding-right:12px;
        border-bottom: solid 1px rgba(206,225,246,1)
    }
    .ht-list{
        min-height: 500px;
        margin: 0 25px;
        position: relative;
        width:706px;
            height:993px;
        img{
            width: 706px;
        }
        .signature{
            position: absolute;
            // background-image: url('~@/assets/img/yz.png');
            background-size: 130px;
            width: 130px;
            left: 0;
            height: 130px;
            top:0;
            &::after{
                content:'';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 9;
            }
            img{
                width: 130px;
                height: 130px;
            }
        }
        > button{
            position: absolute;
            right: -100px;
            top: 50px;
        }
        .pagerUp{
            width: 40px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 5px;
            > button{
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                box-sizing: border-box;
                justify-content: center;
                align-items: center;
            }
            >div{
                margin: 10px auto;
                text-align: center;
            }
        }

    }
}
.expand{
    .tip{
        position: absolute;
        top: 30px;
        left: 250px;
        color:#6d95bd;
        font-size: 14px
    }
    /deep/ .el-dialog__body{
        border-top: solid 1px rgba(237,236,240,1);
        padding-top:21px;
        .ex-body{
            p:first-child{
                color:#ff3e3e;
                margin-bottom: 17px;
            }
            .footer{
                text-align: right;
                margin-top: 15px;
            }
        }
    }
}
.paper-btn{
    width:100px;
    height:36px;
    background:#409EFF;
    border-radius:18px;
}
.bodycontainer{
    display: flex;
    width:100%;
    overflow: auto;
    height: calc(100% - 59px);
    .ht-list{
        margin: 0 auto;
  
    }
}
/deep/ .el-table::before{
    height: 0;
}
/deep/ .el-dialog .el-dialog__body{
    padding:13px 13px;
}
</style>
