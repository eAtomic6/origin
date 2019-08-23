<template>
	<div id="changecancel">
		<!-- 合同变更（编辑） -->
		<el-dialog :title="title" :visible="getCancelDialog" width="740px" class="layer-changecancel mt80" @close='close' :closeOnClickModal="$tool.closeOnClickModal">
			<div class="audit-box" v-if="getDialogType==='changeEdit'">
				<div class="textareabox">
					<p class="form-label">合同变更原因</p>
					<div class="reason">
						<el-input type="textarea" :rows="6" placeholder="请填写合同变更原因，最多100字" v-model="textarea" resize='none' style="width:570px" maxlength="100">
						</el-input>
						<span>{{textarea.length}}/100</span>
					</div>
				</div>
				<!-- 上传附件 -->
				<div class="uploadfile">
					<div class="uploadtitle form-label">上传变更协议<span><b>注：</b>协议支持所有格式</span></div>
					<div class="uploadbtn">
						<ul>
							<li>
								<file-up class="uploadSubject" :scane="changeScane" @getUrl="uploadSubject" id="change_">
									<i class="iconfont icon-shangchuan"></i>
									<p>点击上传</p>
								</file-up>
							</li>
							<li v-for="(item,index) in uploadList" :key="item.index" @mouseover="moveIn(item.index+item.path)" @mouseout="moveOut(item.index+item.path)">
								<el-tooltip class="item" effect="dark" :content="item.name" placement="bottom">
									<div class="namePath" @click="previewPhoto(uploadList,index)">
										<upload-cell :type="item.fileType"></upload-cell>
										<p>{{item.name}}</p>
									</div>
								</el-tooltip>
								<i class="iconfont icon-tubiao-6" @click="delectData(index)" :class="{'deleteShow':isDelete===item.index+item.path}"></i>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<!-- 合同变更（查看） -->
			<div class="audit-box" v-if="getDialogType==='changeLook'">
				<div class="textareabox">
					<p>合同变更原因</p>
					<!-- <el-input type="textarea" :rows="3" placeholder="请填写合同变更原因，最多100字" class="textarea" maxlength=100></el-input> -->
					<div class="reason">
						<el-input type="textarea" :disabled="true" :rows="5" placeholder="暂无备注" v-model="textarea" resize='none' style="width:570px" maxlength="100">
						</el-input>
						<span>{{textarea.length}}/100</span>
					</div>
				</div>
				<!-- 上传附件 -->
				<div class="uploadfile">
					<div class="uploadtitle">变更协议<span><b>注：</b>协议支持所有格式</span></div>
					<div class="uploadbtn">
						<ul>
							<li v-for="(item,index) in address.value" :key="index">
								<el-tooltip class="item" effect="dark" :content="item.name" placement="bottom">
									<div class="namePath" @click="previewPhoto(address.value,index)">
										<upload-cell :type="item.fileType"></upload-cell>
										<p>{{item.name}}</p>
									</div>
								</el-tooltip>
							</li>
						</ul>
						<!-- <span class="dataPreview" v-for="item in address.value" :key="item.path">
							<p>{{item.name}}</p>
						</span> -->
					</div>
				</div>
			</div>

			<!-- 合同解约（编辑） -->
			<div class="audit-box" v-if="getDialogType==='cancelEdit'">
				<div class="textareabox">
					<p class="form-label">合同解约原因</p>
					<!-- <el-input type="textarea" :rows="3" placeholder="请填写合同变更原因，最多100字" class="textarea" maxlength=100></el-input> -->
					<div class="reason">
						<el-input type="textarea" :rows="5" placeholder="请填写合同解约原因，最多100字" v-model="textarea" resize='none' style="width:570px" maxlength="100">
						</el-input>
						<span>{{textarea.length}}/100</span>
					</div>
				</div>
				<!-- 上传附件 -->
				<div class="uploadfile">
					<div class="uploadtitle form-label">上传解除协议<span><b>注：</b>协议支持所有格式</span></div>
					<div class="uploadbtn">
						<ul>
							<li>
								<file-up class="uploadSubject" :scane="cancelScane" @getUrl="uploadSubject" id="cancel_">
									<i class="iconfont icon-shangchuan"></i>
									<p>点击上传</p>
								</file-up>
							</li>
							<li v-for="(item,index) in uploadList" :key="item.index" @mouseover="moveIn(item.index+item.path)" @mouseout="moveOut(item.index+item.path)">
								<el-tooltip class="item" effect="dark" :content="item.name" placement="bottom">
									<div class="namePath" @click="previewPhoto(uploadList,index)">
										<upload-cell :type="item.fileType"></upload-cell>
										<p>{{item.name}}</p>
									</div>
								</el-tooltip>
								<i class="iconfont icon-tubiao-6" @click="delectData(index)" :class="{'deleteShow':isDelete===item.index+item.path}"></i>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<!-- 合同解约（查看） -->
			<div class="audit-box" v-if="getDialogType==='cancelLook'">
				<div class="textareabox">
					<p>合同解约原因</p>
					<!-- <el-input type="textarea" :rows="3" placeholder="请填写合同变更原因，最多100字" class="textarea" maxlength=100></el-input> -->
					<div class="reason">
						<el-input type="textarea" :rows="6" :disabled="true" placeholder="请填写合同解约原因，最多100字" v-model="textarea" resize='none' style="width:570px" maxlength="100">
						</el-input>
						<span>{{textarea.length}}/100</span>
					</div>
				</div>
				<!-- 上传附件 -->
				<div class="uploadfile">
					<div class="uploadtitle">上传解约协议<span><b>注：</b>协议支持所有格式</span></div>
					<div class="uploadbtn">
						<ul>
							<li v-for="(item,index) in address.value" :key="index">
								<el-tooltip class="item" effect="dark" :content="item.name" placement="bottom">
									<div class="namePath" @click="previewPhoto(address.value,index)">
										<upload-cell :type="item.fileType"></upload-cell>
										<p>{{item.name}}</p>
									</div>
								</el-tooltip>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<!-- 上传合同主体 -->
			<div class="audit-box" style=" height: 390px " v-if="getDialogType==='upload'">
				<!-- 上传附件 -->
				<div class="uploadfile uploadfile2">
					<div class="uploadtitle form-label">上传合同主体<span><b>注：</b>合同主体上传支持所有格式</span></div>
					<div class="uploadbtn">
						<ul>
							<li>
								<file-up class="uploadSubject" :scane="uploadScane" @getUrl="uploadSubject" id="zhuti_">
									<i class="iconfont icon-shangchuan"></i>
									<p>点击上传</p>
								</file-up>
							</li>
							<li v-for="(item,index) in uploadList" :key="item.index" @mouseover="moveIn(item.index+item.path)" @mouseout="moveOut(item.index+item.path)">
								<el-tooltip class="item" effect="dark" :content="item.name" placement="bottom">
									<div class="namePath" @click="previewPhoto(uploadList,index,2)">
										<upload-cell :type="item.fileType"></upload-cell>
										<p>{{item.name}}</p>
									</div>
								</el-tooltip>
								<i class="iconfont icon-tubiao-6" @click="delectData(index)"  :class="{'deleteShow':isDelete===item.title+item.path}"></i>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="btnbox" v-if="getDialogType==='upload'||getDialogType==='changeEdit'||getDialogType==='cancelEdit'">
				<el-button @click="close">取 消</el-button>
				<el-button type="primary" @click="saveFile" :disabled="forbid">保 存</el-button>
			</div>
			<!-- 图片预览 -->
    	<preview :imgList="previewFiles" :start="previewIndex" :previewType="previewType" v-if="preview" @close="preview=false"></preview>
		</el-dialog>
	</div>
</template>

<script>
import { MIXINS } from "@/assets/js/mixins";
export default {
	mixins: [MIXINS],
  // dialogType类型有四种：1.changeEdit 变更编辑
  //                      2.changeLook 变更查看
  //                      3.cancelEdit  解约编辑
  //                      4.cancelLook  解约查看
  //                      5.upload  上传合同主体
  props: {
    dialogType: {
      type: String,
      default: ""
    },
    contId: {
      type: Number,
      default: 0
    },
    code: {
      type: String,
      default: ""
    },
    contState: {
      type: Number,
      default: 99
    },
    cancelDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
			title: "",
			//上传文件的路径数组
			uploadList:[],
			isImg:false,
			textarea:'',
			address:{},
			isDelete:'',
			preview:false,
			//保存按钮是否可点击
			forbid:false,
			previewType:'none',
			changeScane:{
				path:"biangeng",
				id:this.code
			},
			cancelScane:{
				path:"jieyue",
				id:this.code
			},
			uploadScane:{
				path:"zhuti",
				id:this.code
			},
			power:{
				'sign-ht-xq-main-down': {
          state: false,
          name: '下载合同主体'
        },
			}
    };
  },

  computed: {
    getCancelDialog() {
      return this.cancelDialog;
    },
    getDialogType() {
      return this.dialogType;
    },
    getContId() {
      return this.contId;
    },
    getCode() {
      return this.code;
    }
  },

  methods: {
    close() {
      this.$emit("closeChangeCancel");
		},
		//获取文件路径数组
		uploadSubject(data){
			let arr = data.param;
			arr.forEach(element => {
        let fileType = this.$tool.get_suffix(element.name);
        element.fileType = fileType;
      });
			this.uploadList=this.uploadList.concat(arr);
      // let fileType = this.$tool.get_suffix(arr[0].name);
      // arr[0].fileType = fileType;
			// this.uploadList.push(arr[0])
		},
		moveIn(value){
			this.isDelete=value
		},
		moveOut(value){
			if(this.isDelete===value){
        this.isDelete=''
      }
		},
		delectData(index){
			// this.uploadList.splice(index,1)
			if(this.contState===3){
        if(this.uploadList.length>1){
          this.uploadList.splice(index,1);
          // let param = {
          //   contId:this.contId,
          //   datas:this.uploadList
          // }
          // this.$ajax.postJSON("/api/contract/uploadContBody", param).then(res => {
          //   res=res.data;
          //   if(res.status===200){
          //     // this.getContractBody();
          //     this.$message({
          //       message:'删除成功',
          //       type:'success'
          //     })
          //   }
          // })
        }else{
          this.$message({
            message:'至少保留一个，请勿删除',
            type:'warning'
          })
        }
      }else{
        this.uploadList.splice(index,1);
      }
		},
		//获取合同主体信息
    getContractBody(){
      let param = {
        id:this.contId
      }
      this.$ajax.get('/api/contract/getContractBodyById', param).then(res=>{
        res=res.data;
        if(res.status===200){
          let uploadList_ = res.data;
          uploadList_.forEach(element => {
            let fileType = this.$tool.get_suffix(element.name);
            element.fileType=fileType;
          });
          this.uploadList=uploadList_;
        }
      })
    },
		//提交变更解约
		subChangeCancel(url,param){
			this.forbid=true;
			this.$ajax.postJSON(url,param).then(res=>{
				res=res.data;
				if(res.status===200){
					this.forbid=false;
					this.$message({
						message:'操作成功',
						type:'success'
					});
					this.close();
				}
			}).catch(error=>{
				this.forbid=false;
				this.$message({
					message:error,
					type: "error"
				})
			})
		},
		//保存上传文件
		saveFile(){
			// this.uploadList.forEach(element => {
			// 	delete element.fileType
			// });
			// console.log(this.uploadList);
			if(this.textarea.length>0){
				this.textarea=this.textarea.replace(/\s/g,"")
			}
			if(this.dialogType==="upload"){
				//上传合同主体
				if(this.uploadList.length>0){
					var url = "/api/contract/uploadContBody";
					var param = {
						contId:this.contId,
						datas:this.uploadList
					}
					this.subChangeCancel(url,param);
				}else{
					this.$message({
						message:'请上传合同主体资料',
						type:'warning'
					})
				}
				
			}else if(this.dialogType==="changeEdit"){
				//上传合变更协议
				if(this.textarea.length>0){
					if(this.uploadList.length>0){
						var url = "/api/contract/change";
						var param = {
							id:this.contId,
							reason:this.textarea,
							address:this.uploadList,
							type:1
						}
						this.subChangeCancel(url,param);
					}else{
						this.$message({
							message:'请上传变更协议',
							type:'warning'
						})
					}
				}else{
					this.$message({
						message:'请填写变更原因',
						type:'warning'
					})
				}
			}else if(this.dialogType==="cancelEdit"){
				//上传解除协议
				if(this.textarea.length>0){
					if(this.uploadList.length>0){
						var url = "/api/contract/cancel";
						var param = {
							id:this.contId,
							reason:this.textarea,
							address:this.uploadList,
							type:2
						}
						this.subChangeCancel(url,param);
					}else{
						this.$message({
							message:'请上传解约协议',
							type:'warning'
						})
					}
				}else{
					this.$message({
						message:'请填写解约原因',
						type:'warning'
					})
				}
			}
		},
		//获取变更解约详情
		getChangeDetail(type){
			let param = {
				type:type,
				id:this.contId
			};
			this.$ajax.get("/api/contract/changeDetail", param).then(res=>{
				res=res.data;
				if(res.status===200){
					this.textarea=res.data.changeReason;

					let address_ =JSON.parse(res.data.address);
					//console.log(address_);
					// let fileType = this.$tool.get_suffix(arr[0].name);
					address_.value.forEach(element => {
						let fileType = this.$tool.get_suffix(element.name);
						element.fileType=fileType;
					});
					this.address=address_;
				}
			})
		},
		//图片预览
  //   getPicture(value,index){
  //     this.start=index;
  //     let arr=[];
  //     // console.log(value);
  //     value.forEach(item =>{
  //       arr.push(item.path)
  //     })
  //     this.fileSign(arr)
  //   }
  },

  created() {
    console.log("222");
    if (this.dialogType === "changeEdit" || this.dialogType === "changeLook") {
			this.title = "合同变更";
			if(this.dialogType === "changeLook"){
				this.getChangeDetail(2)
			}
    } else if (
      this.dialogType === "cancelEdit" || this.dialogType === "cancelLook") {
			this.title = "合同解约";
			if(this.dialogType === "cancelLook"){
				this.getChangeDetail(1)
			}
    } else if (this.dialogType === "upload") {
			this.title = "合同主体";
			if(this.contState===3){
				this.getContractBody();
			}
    }
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/common.less";
#changecancel {
  .mt80 {
    .el-dialog {
      margin: 80px auto 60px !important;
      margin-top: 0vh;
    }
  }
  .layer-changecancel {
    /deep/.el-dialog__header {
      border-bottom: 1px solid #edecf0;
      padding: 16px 20px 15px;
      span {
        color: #233241;
        font-size: 20px;
      }
      .el-dialog__headerbtn {
        top: 16px;
        .el-dialog__close {
          font-size: 24px;
          color: #32485f;
        }
      }
    }
    /deep/.el-dialog__body {
      padding: 0;
    }

    .audit-box {
      padding: 26px 20px 10px 20px;
      height: 400px;
      overflow-y: auto;
      .textareabox {
        display: flex;
        align-items: flex-start;
        > p {
					padding-right: 15px;
					font-size: 14px;
					width: 90px;
					color: @color-6c;
				}
        .reason {
					position: relative;
					/deep/.el-textarea{
						textarea{
							min-height: 120px!important;
						}
					}
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
      .uploadfile {
        margin: 40px 0 30px;
        min-height: 100px;
        .uploadtitle {
          color: #6c7986;
          span {
            margin-left: 16px;
            color: #8e8e8e;
            b {
              color: #6c7986;
            }
          }
        }
        .uploadbtn {
					margin: 10px 0 0 100px;
          .uploadSubject{
						display: inline-block;
						text-align: center;
						width: 120px;
						height: 120px;
						box-sizing: border-box;
						padding-top: 20px;
						border: 2px dashed @border-DE;
						i{
							color: @bg-th;
							font-size: 59px;
						}
						p{
							padding-top: 5px;
							color:@color-324;
							font-size: 14px;
						}
					}
					.dataPreview{
						display: inline-block;
						text-align: center;
						width: 130px;
						height: 130px;
						margin-right: 18px;
						box-sizing: border-box;
						background: skyblue;
						border: 2px solid @border-DE;
					}
					.deleteShow{
						display: block !important;
					}
					ul{
						display: flex;
						flex-wrap:wrap;
						li{
							margin-right: 10px;
							margin-bottom: 10px;
							position: relative;
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
					.namePath{
						display: inline-block;
						text-align: center;
						width: 120px;
						height: 120px;
						padding-top: 20px;
						box-sizing: border-box;
						border-radius:4px;
						background: @color-F2;
						> p{
							padding-top: 5px;
							display: inline-block;
							width: 100px;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
						}
					}
        }
      }
      .uploadfile2 {
        margin: 0px 0 30px;
      }
    }

    .btnbox {
      display: flex;
      justify-content: flex-end;
      padding: 15px 20px 15px 0;
      border-top: 1px solid #edecf0;
      .el-button {
        width: 100px;
        height: 38px;
        border-radius: 18px;
        padding: 0;
      }
    }
  }
}
</style>


