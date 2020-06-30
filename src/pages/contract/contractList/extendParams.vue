<template>
  <div class="view-container">
    <div class="top" v-if="isShowType">
      <div class="type">
        <div :class="{'active':isActive===1}" @click="changeType(1)">居间合同</div>
        <div :class="{'active':isActive===2}" @click="changeType(2)">买卖合同</div>
      </div>
    </div>
    <div class="contentBox">
      <div class="nav" :class="{'hid':isActive===2}">
        <ul>
					<li v-for="item in navTag" :key="item.id" :class="{'navBlue':navId===item.id}"  @click="goNav(item.id)"><span :title="item.title">{{item.title}}</span></li>
        </ul>
      </div>
      <iframe :src="src1" frameborder="0" ref='iframeFirst' :style="{ height: clientHei }" v-show="isActive===1"></iframe>
      <iframe :src="src2" frameborder="0" ref='iframeSecond' :style="{ height: clientHei }" v-show="isActive===2"></iframe>
      <div class="btn">
        <el-button round @click="isSave(1)">保存</el-button><br>
        <!-- xuneng20191210修改：所有合同类型都支持提审 -->
        <el-button v-if="power['sign-ht-info-toverify'].state||power['sign-ht-xq-entrust-edit'].state&&Msg.isentrust" type="primary" round @click="submit" v-loading.fullscreen.lock="fullscreenLoading">提审</el-button><br>
        <span class="huojian" @click="backTop"><img src="/static/img/huojian.png" alt=""></span>
      </div>
    </div>
		<!-- 买卖合同提审弹窗 -->
		<el-dialog title="" :visible.sync="dialogSub" class="signDialog" width="460px" :closeOnClickModal="$tool.closeOnClickModal" center>
			<div class="submitBox">
				<p>是否需要打印草签合同？</p>
				<p>温馨提示：草签合同无公章，仅供买卖双方确认合同条款使用</p>
			</div>
      <span slot="footer" class="">
        <el-button @click="toPrint">打印合同，稍后提审</el-button>
        <el-button type="primary" @click="toSubmit">无需打印，直接提审</el-button>
      </span>
    </el-dialog>
		<!-- 其他合同提审弹窗 -->
		<el-dialog title="提示" :visible.sync="otherDialogSub" width="460px" :closeOnClickModal="$tool.closeOnClickModal">
      <span>确定合同填写无误并提交审核？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="otherDialogSub = false">取 消</el-button>
        <el-button type="primary" @click="toSubmit">确 定</el-button>
      </span>
    </el-dialog>

		<!-- 创建合同成功提示框 -->
    <el-dialog title="提示" :visible.sync="dialogSuccess" width="460px" :closeOnClickModal="$tool.closeOnClickModal" :showClose="false">
      <span>{{Msg.type===1?'请上传资料库':'是否继续上传附件？如果不上传附件权证将无法办理！（你也可以以后再上传，上传附件后权证将接收办理）'}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="toContract">取 消</el-button>
        <el-button type="primary" @click="toUpload">确 定</el-button>
      </span>
    </el-dialog>
		<!-- 打印 -->
    <PdfPrint :url="pdfUrl" ref="pdfPrint" v-if="haveUrl" @closePrint="closePrint"></PdfPrint>
		<div class="printMaskLayer" v-if="haveUrl"></div>
		<!-- 设置/转交审核人 -->
    <checkPerson :show="checkPerson.state" :type="checkPerson.type" :showLabel="checkPerson.label" :bizCode="checkPerson.code" :flowType="checkPerson.flowType" @close="closeCheckPerson" @submit="closeCheckPerson" v-if="checkPerson.state"></checkPerson>
  </div>
</template>

<script>
let emptyInput1=[]
let emptyInput2=[]
let loading=null
import { MIXINS } from "@/assets/js/mixins";
import {MIXINS_MM} from "../mixins/MM.js";
import {MIXINS_JJ} from "../mixins/JJ.js";
import {MIXINS_ZL} from "../mixins/ZL.js";
import {MIXINS_DB} from "../mixins/DB.js";
import {MIXINS_YX} from "../mixins/YX.js";
import {MIXINS_DJ} from "../mixins/DJ.js";
import PdfPrint from '@/components/PdfPrint';
import checkPerson from '@/components/checkPerson';

export default {
	mixins: [MIXINS,MIXINS_MM,MIXINS_JJ,MIXINS_ZL,MIXINS_DB,MIXINS_YX,MIXINS_DJ],
	components: {
		PdfPrint,
		checkPerson
  },
  data(){
    return{
      clientHei:'',
      Msg:'',//合同信息
      isHaveHtml:'',//是否有html文件 1.有 2.没有
      htmlPath:'',//html
      isShowType:false,
      isActive: 1,
      src1:'',
      src2:'',
      html:'',
      fullscreenLoading:false,
      navId:'',
			dialogSuccess:false,
			dialogSub:false,
			otherDialogSub:false,
			param:'',
			//权限
			power:{
				'sign-com-htdetail': {
          state: false,
          name: '合同详情'
				},
				'sign-ht-xq-data': {
          state: false,
          name: '资料库权限'
				},
				'sign-ht-info-toverify': {
          state: false,
          name: '提交审核'//编辑+提审
				},
				'sign-ht-xq-entrust-edit': {
          state: false,
          name: '委托合同'
        },
        'sign-ht-info-sverify': {
          state: false,
          name: '提交审核'//新增+提审
        },
			},
			iframe1State:false,
			iframe2State:false,
			pdfUrl:'',
			haveUrl:false,
			http:'',
			navTag:"",
			checkPerson: {
        state:false,
        type:1,
        code:'',
        flowType:3,
        label:false
      },
    }
  },
  created(){
		// this.fullscreenLoading=true
		loading=this.$loading({
			lock: true,
			text: 'Loading',
			spinner: 'el-icon-loading',
			background: 'rgba(0, 0, 0, 0.5)'
		});
		// this.getAdmin();//获取当前登录人信息
    // http://localhost:8080/api/contract/showHtml?id=327&type=residence
		this.clientHeight();
		this.Msg = JSON.parse(sessionStorage.getItem("contractMsg"));
    if (!window.location.origin) {
        window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
    }
    // console.log(window.location.origin)
    this.http = window.location.origin
    let dayRandomTime=new Date().getTime()
    if(this.Msg.type===1){
      //租赁
      this.src1=`${this.http}/api/contract/showHtml?id=${this.Msg.id}&type=address`
    }else if(this.Msg.type===2){
			//买卖
			if(this.Msg.isWuHanMM){//是否是武汉的买卖合同
				this.isShowType=true;
				this.src1=`${this.http}/api/contract/showHtml?id=${this.Msg.id}&type=residence&dayRandomTime=${dayRandomTime}`//居间
				this.src2=`${this.http}/api/contract/showHtml?id=${this.Msg.id}&type=business&dayRandomTime=${dayRandomTime+10}`//买卖
			}else{
				this.isShowType=false;
				this.isActive=2;
				this.src2=`${this.http}/api/contract/showHtml?id=${this.Msg.id}&type=address`//买卖
				// entrust
			}
    }else if(this.Msg.type===3){
      //代办
      this.src1=`${this.http}/api/contract/showHtml?id=${this.Msg.id}&type=address`
    }else if(this.Msg.type===4){
      //意向
      this.src1=`${this.http}/api/contract/showHtml?id=${this.Msg.id}&type=address`
    }else if(this.Msg.type===5){
      //定金
      this.src1=`${this.http}/api/contract/showHtml?id=${this.Msg.id}&type=address`
		}else if(this.Msg.isentrust){
			//委托
			this.src1=`${this.http}/api/contract/showHtml?id=${this.Msg.id}&type=entrust`
		}
  },
  methods: {
    // 控制弹框body内容高度，超过显示滚动条
    clientHeight() {
			// this.clientHei= screen.height -300 + 'px'
			// console.log('teddddddd')
      this.clientHei= document.documentElement.clientHeight -150 + 'px'
    },
    //居间买卖切换
    changeType(value) {
			this.isActive = value;
			this.navId='';
      if(value===1){
        // this.count=1;
        // this.showAddress=this.residence;
        // this.setSrc(this.showAddress,this.total_r);
      }else{
        // this.count=1;
        // this.showAddress=this.business;
        // this.setSrc(this.showAddress,this.total_b);
      }
    },
    //导航跳转
    goNav(id){
			this.navId=id;
			let iframebox=this.$refs.iframeSecond
			let navHeight = iframebox.contentWindow.document.querySelector(`#${id}`).offsetTop+5
			iframebox.contentWindow.scrollTo(0,navHeight)
    },
    //回到顶部
    backTop(){
			let iframebox1=this.$refs.iframeFirst;
			let iframebox2=this.$refs.iframeSecond;
			iframebox1.contentWindow.scrollTo(0,0)
			iframebox2.contentWindow.scrollTo(0,0)
		},
		//创建成功提示
    toUpload(){//上传合同资料库
      this.dialogSuccess=false;
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
              id: this.Msg.id,//合同id
              code: this.Msg.code,//合同编号
              contType: this.Msg.type//合同类型
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
		//保存
    isSave(operation){
			var param={};
			var isClick=0
			if(operation===1){
				isClick=1
				loading=this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.5)'
				});
			}else if(operation===4){
				loading=this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.5)'
				});
			}
			var isFull=0;//合同是否填写完整
			let iframebox1=this.$refs.iframeFirst
			let iframebox2=this.$refs.iframeSecond
			iframebox2.contentWindow.document.body.click()
			let htmlTxt1 = `<!DOCTYPE html><html lang="en">${iframebox1.contentWindow.document.getElementsByTagName('html')[0].innerHTML}</html>`
			let htmlTxt2 = `<!DOCTYPE html><html lang="en">${iframebox2.contentWindow.document.getElementsByTagName('html')[0].innerHTML}</html>`

			if(this.Msg.type===2){
				iframebox2.contentWindow.document.querySelector("#submit").click()
				if(this.Msg.isWuHanMM){
					iframebox1.contentWindow.document.querySelector("#submit").click()
					emptyInput1 = sessionStorage.getItem("templateError")?JSON.parse(sessionStorage.getItem("templateError")):[];
					emptyInput2 = sessionStorage.getItem("templateError1")?JSON.parse(sessionStorage.getItem("templateError1")):[];
					param = {
						id:this.Msg.id,
						isClick:isClick,
						html:{
							residence:htmlTxt1,
							business:htmlTxt2
						},
						isCanAudit:isFull//1.完整 0.否
					}
				}else{
					emptyInput2 = sessionStorage.getItem("templateError1")?JSON.parse(sessionStorage.getItem("templateError1")):[];
					param = {
						id:this.Msg.id,
						html:{
							address:htmlTxt2
						},
						isCanAudit:isFull//1.完整 0.否
					}
				}
			}else if(this.Msg.isentrust){
				iframebox1.contentWindow.document.querySelector("#submit").click()
				emptyInput1 = sessionStorage.getItem("templateError")?JSON.parse(sessionStorage.getItem("templateError")):[];
				param = {
					id:this.Msg.id,
					isClick:isClick,
					html:{
						entrust:htmlTxt1
					},
					isCanAudit:isFull//1.完整 0.否
				}
			}else{
				iframebox1.contentWindow.document.querySelector("#submit").click()
				emptyInput1 = sessionStorage.getItem("templateError")?JSON.parse(sessionStorage.getItem("templateError")):[];
				param = {
					id:this.Msg.id,
					isClick:isClick,
					html:{
						address:htmlTxt1
					},
					isCanAudit:isFull//1.完整 0.否
				}
			}
      if(emptyInput1.length===0&&emptyInput2.length===0){
				param.isCanAudit=1
			}
      this.$ajax.postJSON('/api/contract/updateHtml', param).then(res => {
				res=res.data
				if(res.status===200){
					loading.close()
					if(operation===1){
						this.$message({
							message:'保存成功',
							type:'success'
						})
					}else if(operation===4){
						this.pdfUrl=`${this.http}/api/contract/generateContPdf?id=${this.Msg.id}`
						this.haveUrl=true;
						this.dialogSub=false
					}
				}
      }).catch(error=>{
				loading.close()
				this.$message({
					message:error,
					type:'error'
				})
			})
    },
    submit(){
			let iframebox1=this.$refs.iframeFirst;
			let iframebox2=this.$refs.iframeSecond;
			if(this.Msg.type===2){
				iframebox2.contentWindow.document.querySelector("#submit").click()
				if(this.Msg.isWuHanMM){
					iframebox1.contentWindow.document.querySelector("#submit").click()
					emptyInput1 = sessionStorage.getItem("templateError")?JSON.parse(sessionStorage.getItem("templateError")):[];
					emptyInput2 = sessionStorage.getItem("templateError1")?JSON.parse(sessionStorage.getItem("templateError1")):[];
					if(this.isActive===1){
						if(emptyInput1.length>0){
							if(emptyInput1[0].company){
								this.$message({
									message:'主客方门店未设置公章',
									type:'warning'
								})
							}else{
								this.$message({
									message:'合同信息未填写完整',
									type:'warning'
								})
							}
							let inputHeight1=0
							if(emptyInput1[0].type){
								let inputTag = iframebox1.contentWindow.document.querySelector(`*[extendparam=${emptyInput1[0].name}]`)
								inputTag.classList.add("BODERRED")
								inputHeight1 = inputTag.offsetTop
							}else{
								inputHeight1 = iframebox1.contentWindow.document.querySelector(`*[name=${emptyInput1[0]}]`).offsetTop
							}
							iframebox1.contentWindow.scrollTo(0,inputHeight1)
						}else if(emptyInput2.length>0){
							this.$message({
								message:'买卖合同信息未填写完整',
								type:'warning'
							})
						}
					}else{
						if(emptyInput2.length>0){
							if(emptyInput2[0].company){
								this.$message({
									message:'主客方门店未设置公章',
									type:'warning'
								})
							}else{
								this.$message({
									message:'合同信息未填写完整',
									type:'warning'
								})
							}
							let inputHeight2=0
							if(emptyInput2[0].type){
								let inputTag = iframebox2.contentWindow.document.querySelector(`*[extendparam=${emptyInput2[0].name}]`)
								inputTag.classList.add("BODERRED")
								inputHeight2 = inputTag.offsetTop
							}else{
								inputHeight2 = iframebox2.contentWindow.document.querySelector(`*[name=${emptyInput2[0]}]`).offsetTop
							}
							iframebox2.contentWindow.scrollTo(0,inputHeight2)
						}else if(emptyInput1.length>0){
							this.$message({
								message:'居间合同信息未填写完整',
								type:'warning'
							})
						}
					}
				}else{//非武汉买卖
					emptyInput2 = sessionStorage.getItem("templateError1")?JSON.parse(sessionStorage.getItem("templateError1")):[];
					if(emptyInput2.length>0){
						if(emptyInput2[0].company){
							this.$message({
								message:'主客方门店未设置公章',
								type:'warning'
							})
						}else{
							this.$message({
								message:'合同信息未填写完整',
								type:'warning'
							})
						}
						let inputHeight2=0
						if(emptyInput2[0].type){
							let inputTag = iframebox2.contentWindow.document.querySelector(`*[extendparam=${emptyInput2[0].name}]`)
							inputTag.classList.add("BODERRED")
							inputHeight2 = inputTag.offsetTop
						}else{
							inputHeight2 = iframebox2.contentWindow.document.querySelector(`*[name=${emptyInput2[0]}]`).offsetTop
						}
						iframebox2.contentWindow.scrollTo(0,inputHeight2)
					}
				}
			
			}else{
				iframebox1.contentWindow.document.querySelector("#submit").click()
				emptyInput1 = sessionStorage.getItem("templateError")?JSON.parse(sessionStorage.getItem("templateError")):[];
				if(emptyInput1.length>0){
					if(emptyInput1[0].company){
						this.$message({
							message:'主客方门店未设置公章',
							type:'warning'
						})
					}else{
						this.$message({
							message:'合同信息未填写完整',
							type:'warning'
						})
					}
					let inputHeight1=0
					if(emptyInput1[0].type){
						let inputTag = iframebox1.contentWindow.document.querySelector(`*[extendparam=${emptyInput1[0].name}]`)
						inputTag.classList.add("BODERRED")
						if(inputTag.offsetParent.tagName==="TD"){
							inputHeight1=inputTag.offsetParent.offsetTop + inputTag.offsetParent.offsetParent.offsetTop
						}else{
							inputHeight1 = inputTag.offsetTop
						}
					}else{
						inputHeight1 = iframebox1.contentWindow.document.querySelector(`*[name=${emptyInput1[0]}]`).offsetTop
					}
					iframebox1.contentWindow.scrollTo(0,inputHeight1)
				}
			}
			if(emptyInput1.length===0&&emptyInput2.length===0){
				let htmlTxt1=''
				let htmlTxt2=''
				let param = {}
				if(this.Msg.type===2){
					htmlTxt1 = `<!DOCTYPE html><html lang="en">${iframebox1.contentWindow.document.getElementsByTagName('html')[0].innerHTML}</html>`
					htmlTxt2 = `<!DOCTYPE html><html lang="en">${iframebox2.contentWindow.document.getElementsByTagName('html')[0].innerHTML}</html>`
					if(this.Msg.isWuHanMM){
						param = {
							cityId:this.Msg.cityId,
							bizCode:this.Msg.code,
							id:this.Msg.id,
							html:{
								residence:htmlTxt1,
								business:htmlTxt2
							}
						}
					}else{
						param = {
							cityId:this.Msg.cityId,
							bizCode:this.Msg.code,
							id:this.Msg.id,
							html:{
								address:htmlTxt2
							}
						}
					}
				}else{
					htmlTxt1 = `<!DOCTYPE html><html lang="en">${iframebox1.contentWindow.document.getElementsByTagName('html')[0].innerHTML}</html>`
					param = {
						cityId:this.Msg.cityId,
						bizCode:this.Msg.code,
						id:this.Msg.id,
					}
					if(this.Msg.isentrust){
						param.html = {
							entrust:htmlTxt1
						}
					}else{
						param.html = {
							address:htmlTxt1
						}
					}
				}
				this.param = param;
				if(this.Msg.type==2){
					this.dialogSub=true
				}else{
					this.otherDialogSub=true
				}
			}
		},
		//确定提审
		toSubmit(){
			loading=this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.5)'
				});
			this.$ajax.postJSON('/api/contract/updateContractAudit', this.param).then(res => {
				res=res.data
				if(res.status===200){
					loading.close()
					this.dialogSub=false
					this.$message({
						message:'提审成功',
						type:'success'
					})
					if(this.Msg.isHaveData||this.Msg.isentrust){
						this.$router.push('/contractList');
					}else{
						this.dialogSuccess=true
					}
				}
			}).catch(error=>{
				loading.close()
				if(error.message==='下一节点审批人不存在'){
            this.checkPerson.code=this.Msg.code;
            this.checkPerson.state=true;
						this.checkPerson.label=true;
						if(this.Msg.isentrust){
							this.checkPerson.flowType=11;
						}
          }else{
            this.$message({
              message:error,
              type: "error"
            })
          }
			})
		},
		//关闭设置审核人弹窗
		closeCheckPerson(){
			this.checkPerson.state=false;
			if(this.Msg.isHaveData||this.Msg.isentrust){
				this.$router.push('/contractList');
			}else{
				this.dialogSuccess=true
			}
    },
		//打印草签合同
		toPrint(){
			this.isSave(4)
		},
		closePrint(){
       this.pdfUrl='';
       this.haveUrl=false;
    },
		//获取自定义勾选框选中状态
		getCheckState(ele){
			return	!!(ele.querySelector('p').getAttribute('checked'))
		},
	},
  mounted(){
		var iframe1 = this.$refs.iframeFirst;
		var iframe2 = this.$refs.iframeSecond;
		var that = this
		if(this.Msg.type===2){
			if(this.Msg.isWuHanMM){
				iframe2.onload=function(){
					that.iframe2State=true
					if(that.getUserMsg.cityId===11){//襄阳
						let nav = [
							{title:"第一条、房屋基本情况",id:"one"},
							{title:"第二条、房屋权属情况",id:"two"},
							{title:"第三条、成交方式",id:"three"},
							{title:"第四条、房产转让价格",id:"four"},
							{title:"第五条、付款约定",id:"five"},
							{title:"第六条、房屋产权及具体状况的承诺",id:"six"},
							{title:"第七条、房产过户",id:"seven"},
							{title:"第八条、房屋交付",id:"eight"},
							{title:"第九条、户口迁移及学籍、学位",id:"nine"},
							{title:"第十条 、违约责任",id:"ten"},
							{title:"第十一条、不可抗力",id:"eleven"},
							{title:"第十二条、其他",id:"twelve"},
							{title:"第十三条、争议解决",id:"thirteen"},
							{title:"第十四条、生效要件",id:"fourteen"},
						]
						that.navTag=[].concat(nav)
					}else{
						let iframeBox=this.contentDocument
						let p_titleList=Array.from(iframeBox.querySelectorAll('.navTitle'))
						let nav = []
						p_titleList.forEach(element => {
							let val = element.innerHTML
							let id = element.id
							nav.push({title:val,id:id})
						});
						that.navTag=[].concat(nav)
					}
				}
				iframe1.onload=function(){
					that.iframe1State=true
				}
			}else{
				iframe2.onload=function(e){
					that.isSave(2)
					let iframeBox=this.contentDocument
					let p_titleList=Array.from(iframeBox.querySelectorAll('.navTitle'))
					let nav = []
					p_titleList.forEach(element => {
						let val = element.innerHTML
						let id = element.id
						nav.push({title:val,id:id})
					});
					that.navTag=[].concat(nav)
				}
			}
		}else{
			iframe1.onload=function(){
				that.isSave(2)
			}
		}
		window.onresize = this.clientHeight;
  },
  beforeUpdate() {
    this.clientHeight();
	},
	computed:{
		iframeState:function(val){
			return this.iframe1State&&this.iframe2State
		},
		getUserMsg(){
      return this.getUser.user
    }
	},
	watch:{
		iframeState:function(val){
			if(val){
				this.isSave(3)
			}
		}
	}
};
</script>
<style scoped lang="less">
@import "~@/assets/common.less";
.signDialog{
	/deep/.el-dialog__header{
		border: none !important;
	}
}
.submitBox{
	padding-top: 10px;
	text-align: center;
	p{
		&:first-of-type{
			font-size: 16px;
			font-weight: bold;
		}
		&:last-of-type{
			color: red;
			margin: 10px;
		}
	}
}
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
.view-container{
  position: relative;
  // text-align: center;
  .top{
    height: 50px;
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
  .contentBox{
    margin-top: 20px;
    display: flex;
    justify-content: center;
    .nav{
      text-align: left;
      font-size: 16px;
			visibility: hidden;
			width: 250px;
      >ul{
        padding: 10px;
				border: 1px solid #ccc;
				>li{
					span{
						display: inline-block;
						width: 230px;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
      }
      span{
        cursor: pointer;
        line-height: 1.6;
      }
      .navBlue{
          color:@color-blue
      }
    }
    .hid{
      visibility: initial;
    }
    iframe{
      width: 870px;
    }
    .btn{
      margin-right: 160px;
      margin-left: 20px;
      box-sizing: border-box;
      padding-top: 200px;
      /deep/.is-round{
        margin-bottom: 20px;
      }
    }
    .huojian{
			display: inline-block;
			width: 75px;
			text-align: center;
			cursor: pointer;
    }
  }
}
</style>
