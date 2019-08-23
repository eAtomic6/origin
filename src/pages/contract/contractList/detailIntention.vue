<!-- 意向详情金 -->
<template>
    <div class="newintention" id="intention" >
        <div class="detailbox">
           <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane :label="detailData.contType.value === 4 ? '意向金详情':'定金详情'" name="first" class="first-tab">
                    <div class="tab" :style="{ height: clientHeight() }">
                        <ul class="ul2">
                            <li class="tabs-title">合同信息</li>
                            <ul class="ul3">
                                <li>
                                    <div class="div1"><span>合同编号：</span><em class="blue">{{detailData.code}}</em></div>
                                    <div class="div2"><span>签约日期：</span>{{detailData.signDate | subStrFn}}</div>
                                    <div class="div3"><span>认购期限：</span>{{detailData.subscriptionTerm | subStrFn}}</div>
                                </li>
                                <li>
                                    <div class="div1"><span>合同类型：</span>{{detailData.contType.label | nullData}}</div>
                                    <div class="div2"><span>认购总价：</span>{{detailData.subscriptionPrice | nullData}}元</div>
                                    <div v-if="this.detailData.contType.value == 4"><span>意向金金额：</span><span class="yellow mr12">{{detailData.dealPrice | nullData}}元</span><span class="chinesemoney yellow">{{detailData.dealPrice | moneyFormat}}</span></div>
                                    <div v-if="this.detailData.contType.value == 5"><span>定金金额：</span><span class="yellow mr12">{{detailData.dealPrice | nullData}}元</span><span class="chinesemoney yellow">{{detailData.dealPrice | moneyFormat}}</span></div>
                                </li>
                            </ul>
                        </ul>
                        <ul class="ul2">
                            <li class="tabs-title">房源信息</li>
                            <ul class="ul3">
                                <li>
                                    <div class="div1"><span>房源编号：</span><em class="blue">{{detailData.houseinfoCode | nullData}}</em></div>
                                    <div class="div2"><span>房型：</span>{{detailData.houseInfo.HouseType | nullData}}</div>
                                    <div class="div22"><span>物业地址：</span>{{detailData.propertyAddr | nullData}}</div>
                                </li>
                                <li>
                                    <div class="div1" v-if="detailData.houseInfo.TradeInt == 0"><span>房源价格：</span>{{detailData.houseInfo.ListingPrice | nullData}}</div>
                                    <div class="div1" v-if="detailData.houseInfo.TradeInt == 2"><span>房源价格：</span>{{detailData.houseInfo.ListingPrice | nullData}}元</div>
                                    <div class="div1" v-if="detailData.houseInfo.TradeInt == 3"><span>房源价格：</span>{{detailData.houseInfo.ListingPrice | nullData}}元/月</div>
                                    <div class="div1"><span>建筑面积：</span>{{detailData.houseInfo.Square | nullData}}㎡</div>
                                    <div class="div2"><span>朝向：</span>{{detailData.houseInfo.Orientation | nullData}}</div>

                                    <div><span>用途：</span>{{detailData.houseInfo.HousePurpose | nullData}}</div>
                                </li>
                                <li>
                                    <div class="div1"><span>套内面积：</span>{{detailData.houseInfo.SquareUse | nullData}}㎡</div>
                                    <div class="div2"><span>装修：</span>{{detailData.houseInfo.DecorateType | nullData}}</div>
                                    <div><span>产权地址：</span>{{detailData.houseInfo.propertyRightAddr | nullData}}</div>

                                </li>
                                <li>
                                    <div class="div1"><span>业主姓名：</span>{{ownerInfo[0].name | nullData}}</div>
                                    <div class="div2"><span>手机：</span>{{ownerInfo[0].mobile | nullData}}</div>
                                    <div><span v-if="ownerInfo[0].cardType == 1">身份证号：</span><span v-if="ownerInfo[0].cardType == 2">护照：</span><span v-if="ownerInfo[0].cardType == 3">营业执照：</span>{{ownerInfo[0].identifyCode | nullData}}</div>
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
                                    <div class="div1"><span>客户姓名：</span>{{custInfo[0].name | nullData}}</div>
                                    <div class="div2"><span>手机：</span>{{custInfo[0].mobile | nullData}}</div>
                                    <div><span v-if="custInfo[0].cardType == 1">身份证号：</span><span v-if="custInfo[0].cardType == 2">护照：</span><span v-if="custInfo[0].cardType == 3">营业执照：</span>{{custInfo[0].identifyCode | nullData}}</div>
                                </li>
                            </ul>
                        </ul>
                        <div class="textbox" v-if="this.detailData.contType.value == 4">
                            <span>意向备注：</span>
                            <el-input type="textarea" class="textareawidth" :disabled="true" v-model="detailData.remarks" :autosize="{ minRows: 5, maxRows: 5}"></el-input>
                        </div>
                    </div>
                    <div class="fixed">
                        <div class="form-btn">
                            <div class="btnbox">
                                <div class="fl">
                                    <ul>
                                        <li>录入时间：<span>{{detailData.createTime | getDate}}</span></li>
                                        <li>录入人：<span>{{detailData.recordDeptName + '-' + detailData.recordName}}</span></li>
                                        <li>最后修改：<span>{{detailData.updateTime | getDate}}</span></li>
                                    </ul>
                                </div>
                                <div class="fr">
                                    <el-button type="primary" plain round class="btn1" @click="onPreview()" v-if="power['sign-ht-info-view'].state">预 览</el-button>
                                    <el-button type="primary" round class="mr30 btn2" v-if="power['sign-ht-info-edit'].state" @click="onEdit(detailData.contType)">编 辑</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="合同主体" name="second" v-if="this.contState === 2 || this.contState === 3">
                    <div class="contractSubject">
                        <ul class="ulData">
                            <li v-if="power['sign-ht-xq-main-add'].state">
                                <file-up class="uploadSubject" @getUrl="uploadSubject" id="zhuti_" :scane="scaneZhuti">
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
                                <i class="iconfont icon-tubiao-6" @click="ZTdelectData(index)" :class="{'deleteShow': power['sign-ht-xq-main-add'].state&&isDelete===item.index+item.path}"></i>
                            </li>
                        </ul>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="资料库" name="third" class="third-tab" v-if="power['sign-ht-xq-data'].state">
                    <div class="dataBank" v-if="power['sign-ht-xq-data'].state">

                        <!-- 业主 -->
                        <div class="classify" v-if="this.sellerList.length>0">
                            <div class="ht-title">业主</div>
                            <div class="small-col" v-for="(item,index) in sellerList" :key="index" v-if="power['sign-ht-xq-data'].state">
                                <p class="small-title"><i v-if="item.isrequire">*</i>{{item.title}}</p>
                                <ul class="ulData">
                                    <li v-if="power['sign-ht-xq-data'].state">
                                        <file-up class="uploadSubject" :id="'seller'+index" @getUrl="addSubject" :scane="scaneData">
                                            <i class="iconfont icon-shangchuan"></i>
                                            <p>点击上传</p>
                                        </file-up>
                                    </li>
                                    <li v-for="(item_,index_) in item.value" :key="item_.index" @mouseover="moveIn(item.title+item_.path)" @mouseout="moveOut(item.title+item_.path)">
                                        <el-tooltip class="item" effect="dark" :content="item_.name" placement="bottom">
                                            <div class="namePath" @click="previewPhoto(item.value,index_)">
                                                <upload-cell :type="item_.fileType"></upload-cell>
                                                <p>{{item_.name}}</p>
                                            </div>
                                        </el-tooltip>
                                        <i class="iconfont icon-tubiao-6" @click="delectData(index,index_,'seller')" :class="{'deleteShow':power['sign-ht-xq-data'].state&&isDelete===item.title+item_.path}"></i>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <!-- 客户 -->
                        <div class="classify" v-if="this.buyerList.length>0">
                            <div class="ht-title">客户</div>
                            <div class="small-col" v-for="(item,index) in buyerList" :key="index" v-if="power['sign-ht-xq-data'].state">
                                <p class="small-title"><i v-if="item.isrequire">*</i>{{item.title}}</p>
                                <ul class="ulData">
                                    <li v-if="power['sign-ht-xq-data'].state">
                                        <file-up class="uploadSubject" :id="'buyer'+index" @getUrl="addSubject" :scane="scaneData">
                                            <i class="iconfont icon-shangchuan"></i>
                                            <p>点击上传</p>
                                        </file-up>
                                    </li>

                                        <li v-for="(item_,index_) in item.value" :key="item_.index" @mouseover="moveIn(item.title+item_.path)" @mouseout="moveOut(item.title+item_.path)">
                                            <el-tooltip class="item" effect="dark" :content="item_.name" placement="bottom">
                                                <div class="namePath" @click="previewPhoto(item.value,index_)">
                                                    <upload-cell :type="item_.fileType"></upload-cell>
                                                    <p>{{item_.name}}</p>
                                                </div>
                                            </el-tooltip>
                                            <i class="iconfont icon-tubiao-6" @click="delectData(index,index_,'buyer')" :class="{'deleteShow':power['sign-ht-xq-data'].state&&isDelete===item.title+item_.path}"></i>
                                        </li>

                                </ul>
                            </div>
                        </div>

                        <!-- 其他 -->
                        <div class="classify" v-if="otherList.length>0">
                            <div class="ht-title">其他</div>
                            <div class="small-col" v-for="(item,index) in otherList" :key="index" v-if="power['sign-ht-xq-data'].state">
                                <p class="small-title"><i v-if="item.isrequire">*</i>{{item.title}}</p>
                                <ul class="ulData">
                                    <li v-if="power['sign-ht-xq-data'].state">
                                        <file-up class="uploadSubject" :id="'other'+index" @getUrl="addSubject" :scane="scaneData">
                                            <i class="iconfont icon-shangchuan"></i>
                                            <p>点击上传</p>
                                        </file-up>
                                    </li>
                                    <li v-for="(item_,index_) in item.value" :key="item_.index" @mouseover="moveIn(item.title+item_.path)" @mouseout="moveOut(item.title+item_.path)">
                                        <el-tooltip class="item" effect="dark" :content="item_.name" placement="bottom">
                                            <div class="namePath" @click="previewPhoto(item.value,index_)">
                                                <upload-cell :type="item_.fileType"></upload-cell>
                                                <p>{{item_.name}}</p>
                                            </div>
                                        </el-tooltip>
                                        <i class="iconfont icon-tubiao-6" @click="delectData(index,index_,'other')" :class="{'deleteShow':power['sign-ht-xq-data'].state&&isDelete===item.title+item_.path}"></i>
                                    </li>
                                </ul>
                            </div>

                        </div>

                    </div>

                </el-tab-pane>
            </el-tabs>

            <!-- 上传按钮 -->
            <div class="functionTable">

                <el-button type="primary" round class="search_btn" @click="saveFile" v-if="name==='second' && (this.contState === 2 || this.contState === 3) && power['sign-ht-xq-main-add'].state">上传</el-button>  <!-- 合同主体上传 -->
                <el-button type="primary" round class="search_btn" @click="uploading('上传成功')" v-if="name==='third' && power['sign-ht-xq-data'].state">上传</el-button>  <!-- 资料库上传 -->

            </div>

            <!-- 图片放大 -->
             <preview :imgList="previewFiles" :start="previewIndex" v-if="preview" @close="preview=false"></preview>
        </div>


    </div>

</template>

<script>
import {TOOL} from "@/assets/js/common";
import { MIXINS } from "@/assets/js/mixins";
// import {FILTER} from "@/assets/js/filter";
export default {
    mixins: [MIXINS],
    data() {
        return {
            userMsg:{}, //当前登录人信息
            clientHei: document.documentElement.clientHeight, //窗体高度
            activeName: 'first',
            name:'first',
            dialogImageUrl: '',
            dialogVisible: false,
            contState:'',
            // code:'',
            scaneZhuti:{
                path:'zhuti',
                id: this.code
            },
            scaneData: {
                path:"ziliaoku",
                id: this.code
            },

            detailData: {
                // code:'',
                signDate:'',
                subscriptionTerm:'',
                contType: {
                    label: '',
                    value: ''
                },
                houseInfo: {},
                guestInfo: {},
                contPersons: [
                    {
                        name: '',
                        mobile: '',
                        identifyCode: '',
                        personType:{
                            label: '',
                            value: ''
                        }
                    }
                ],

            },
            ownerInfo:[
                {
                    name: '',
                    mobile: '',
                    identifyCode: '',
                }
            ],
            custInfo: [
                {
                    name: '',
                    mobile: '',
                    identifyCode: '',
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

            isDelete:'',

            //权限
            power: {
                'sign-ht-info-view': {
                    state: false,
                    name: '预览'
                },
                'sign-ht-xq-main-add': {
                    state: false,
                    name: '编辑合同主体'
                },
                'sign-ht-xq-data': {
                    state: false,
                    name: '编辑资料库'
                },
                'sign-ht-info-edit': {
                    state: false,
                    name: '编辑'
                },
            }
        }
    },
    beforeRouteEnter(to,from,next){
      next(vm=>{
        vm.setPath(vm.$tool.getRouter(['合同','合同列表','合同详情'],'contractList'));
      })
    },

    methods: {


        handleClick(tab, event) {
            this.name=tab.name;
        },

        // 控制弹框body内容高度，超过显示滚动条
        clientHeight() {
            return this.clientHei - 285 + 'px'
        },

        //预览事件
        onPreview() {
            this.setPath(this.$tool.getRouter(['合同','合同列表','合同预览'],'contractList'));
            this.$router.push({
                path:'/contractPreview',
                query:{
                    id: this.$route.query.id
                }
            })
        },

        //编辑事件
        onEdit(e) {
            this.setPath(this.$tool.getRouter(['合同','合同列表','编辑合同'],'contractList'));
            this.$router.push({
                path:'/newIntention',
                query:{
                    contType: e.value,
                    id: this.$route.query.id,
                    operateType: 2,
                    formDetail: true,
                    isOffline:this.detailData.recordType.value===2?1:2
                }
            })
        },


        //合同资料库添加数据到每种类型
        addSubject(data){
            console.log(data);
            let arr = data.param;
            let num = Number(data.btnId.substring(data.btnId.length-1));
            let typeId = data.btnId.substring(0,data.btnId.length-1)
            arr.forEach(element => {
                let fileType = this.$tool.get_suffix(element.name);
                element.fileType = fileType;
            });
            if(typeId==='seller'){

                this.sellerList[num].value=this.sellerList[num].value.concat(arr);
            }else if(typeId==='buyer'){

                this.buyerList[num].value=this.buyerList[num].value.concat(arr);
            }else if(typeId==='other'){

                this.otherList[num].value=this.otherList[num].value.concat(arr);
                console.log(this.otherList[num].value)
            }
        },

        //获取合同资料库信息

        //获取合同资料库类型
        getContDataType() {
        let param = {
            id: this.$route.query.id
        };
        this.$ajax.get("/api/contract/getContDataTypeById", param).then(res => {
            res = res.data;
            if (res.status === 200) {
            let dataType = JSON.parse(res.data);
            console.log(dataType);
            dataType.forEach(element => {
                if(element.type==="1"){
                    let item={};
                    item.value=[];
                    item.kind=element.type;
                    item.title=element.name;
                    item.isrequire=element.isNecessary;
                    this.buyerList.push(item);

                }else if(element.type==="2"){
                    let item={};
                    item.value=[];
                    item.kind=element.type;
                    item.title=element.name;
                    item.isrequire=element.isNecessary;
                    this.sellerList.push(item);

                }else if(element.type==="3"){
                    let item={};
                    item.value=[];
                    item.kind=element.type;
                    item.title=element.name;
                    item.isrequire=element.isNecessary;
                    this.otherList.push(item);
                    console.log(this.otherList)

                }
            });
            }
        })
        .catch((error)=>{
            this.$message({
                message: error
            })
        });
        },

        //获取资料库信息之后

        getContData() {
            let param = {
                id: this.$route.query.id
            };
            this.$ajax.get("/api/contract/getContAttachmentById", param).then(res => {
                res = res.data;
                if (res.status === 200) {
                let address = JSON.parse(res.data.address);
                console.log(address)
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
            });
        },



        //上传资料库
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

                    arr_.push(uploadContData[i]);
                    isOk = true;
                }else if(!uploadContData[i].isrequire&&uploadContData[i].value.length>0){

                    arr_.push(uploadContData[i]);
                     isOk = true;
                }else{
                    isOk = true;
                }
            }
            if(isOk){
                let param = {
                datas: arr_,
                contId: this.$route.query.id
                }
                console.log(param)
                this.$ajax.postJSON('/api/contract/uploadContData', param).then(res=>{
                    res=res.data;
                    if(res.status===200){
                        this.$message({
                            message:msg,
                            type:'success'
                        })
                        this.getContData();
                    }
                }).catch((error)=>{
                    this.$message({
                        message: error
                    })
                })
            }
        },

        delectData(index,index_,type){
            console.log(index,index_,type);

            if(this.detailData.isHaveData){
                if(type==="seller"){
                    if(this.sellerList[index].isrequire){
                        if(this.sellerList[index].value.length>1){
                            this.sellerList[index].value.splice(index_,1);
                            this.uploading('删除成功')
                        }else{
                        this.$message({
                            message:'至少保留一个，请勿删除',
                            type:'warning'
                        })
                        }
                    }else{
                        this.sellerList[index].value.splice(index_,1);
                        this.uploading('删除成功')
                    }
                }else if(type==="buyer"){

                    if(this.buyerList[index].isrequire){
                        if(this.buyerList[index].value.length>1){
                            this.buyerList[index].value.splice(index_,1);
                            this.uploading('删除成功')
                        }else{
                        this.$message({
                            message:'至少保留一个，请勿删除',
                            type:'warning'
                        })
                        }
                    }else{
                        this.buyerList[index].value.splice(index_,1);
                        this.uploading('删除成功')
                    }
                }else if(type==="other"){

                if(this.otherList[index].isrequire){
                        if(this.otherList[index].value.length>1){
                            this.otherList[index].value.splice(index_,1);
                            this.uploading('删除成功')
                        }else{
                        this.$message({
                            message:'至少保留一个，请勿删除',
                            type:'warning'
                        })
                    }
                }else{
                    this.otherList[index].value.splice(index_,1);
                    this.uploading('删除成功')
                }
            }
        }
        else{
            if(type==="seller"){
                this.sellerList[index].value.splice(index_,1);
            }else if(type==="buyer"){
                this.buyerList[index].value.splice(index_,1);
            }else if(type==="other"){
                this.otherList[index].value.splice(index_,1);
            }
        }
        },



         //获取合同主体信息（已上传后，拿到返回的文件路径）
        getContractBody(){
            let param = {
                id:this.$route.query.id
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
            }).catch((error)=>{
                this.$message({
                    message: error
                })
            })
        },

        //合同主体获取文件路径后缀名
        uploadSubject(data) {
            let arr = data.param;
            console.log(data)
            arr.forEach(element => {
                let fileType = this.$tool.get_suffix(element.name);
                element.fileType = fileType;
            });
			this.uploadList=this.uploadList.concat(arr);
        },

        //合同主体的删除
        ZTdelectData(index){
            this.uploadList.splice(index,1)
        },
        //合同主体上传文件
        saveFile() {
            if(this.uploadList.length>0){
                this.uploadList.forEach(element => {
                delete element.fileType
                });
                let param = {
                contId:this.$route.query.id,
                datas:this.uploadList
                }
                this.$ajax.postJSON("/api/contract/uploadContBody", param).then(res => {

                    if(res.data.status===200){
                        this.getContractBody();
                        this.$message({
                            message:'上传成功'
                        })
                    }else if(res.data.status===500){

                        this.$message.error(res.data.message)
                    }
                }).catch((error)=>{
                    this.$message({
                        message: error
                    })
                })
            }else{
                this.$message({
                message:'请选合同主体'
                })
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


        // 查询
        getDetail() {
          let param = {
            id: this.$route.query.id
          }
          //根据合同ID查询详细信息
          this.$ajax
          .get("/api/contract/detail", param)
          .then(res => {


            if (res.data.status === 200) {
                this.detailData = res.data.data
                this.code = res.data.data.code
                console.log(this.code)
                this.contState = res.data.data.contState.value
                console.log(this.contState)
                var contperson = this.detailData.contPersons
                if (contperson.length > 0) {
                    for (let i=0; i < contperson.length; i++){
                        if (contperson[i].personType.value == 1){
                            this.ownerInfo.unshift(contperson[i])
                        }else if(contperson[i].personType.value == 2){
                            this.custInfo.unshift(contperson[i])
                        }
                    }
                }
                if(res.data.data.isHaveData ==1){ //判断有无上传过资料库，有的话返回上传过的信息
                    this.getContData()
                }
                 if(this.contState===3){
                    this.getContractBody();//获取合同主体
                }
            }

          })
          .catch((error)=>{
                this.$message({
                    message: error
                })
            })
      },

    },

    filters: {
        getDate(val) {
            return TOOL.timeFormat(val);
        },

        subStrFn(val) {
           return val.substr(0, 10)
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
        }
    },

    created() {
        this.getDetail();  //合同详细信息
        this.getAdmin();//获取当前登录人信息
        this.getContDataType();   //获取资料库里的资料类型
        if (this.$route.query.type === "dataBank") {
            this.activeName = "third";
            this.name="third";
        }
    },

    mounted() {
      var _this = this;
       window.onresize = function(){
         _this.clientHei = document.documentElement.clientHeight;
       }
    },

}
</script>

<style lang="less">
#intention{

    overflow: hidden;
    background-color: #fff;
    .el-textarea.is-disabled .el-textarea__inner{
        color:#233241;
    }
    .el-tabs__item{
        height: 50px;
        line-height: 50px;
        font-size: 16px;
    }
    .el-tabs__active-bar{
        height: 2px;
    }
    .el-tabs__nav-scroll{
        padding: 0 30px;
    }

    .deleteShow{
        display: block !important;
    }

    .detailbox{
        padding: 20px 0 0px;
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
        .el-tabs--top{
            height: 100%;
            .el-tabs__content{
                height: 100%;
                overflow-y: auto;
            }
        }
        .tab{
            padding: 10px 30px;
            overflow-y: auto;
            .textbox{
                display: flex;
                margin-bottom: 20px;
                span{
                    color: #6C7986;
                    font-size: 14px;
                    width: 70px;
                    white-space: nowrap;
                }
                .el-textarea{
                    width: 650px;
                    height: 80px;
                    margin-left: 15px;
                }
                .el-textarea.is-disabled .el-textarea__inner{
                    height: 80px;
                }
            }
            .ul1{
                    display: flex;
                    align-items: top;
                    clear: both;
                    border-bottom: 1px solid #EDECF0;
                    margin:10px 0 30px 0;
                    padding-bottom: 10px;
                }
            ul{

                li{
                    margin-right: 100px;
                    div{
                        font-size: 14px;
                        margin-bottom: 20px;
                        color:#233241;
                        span{
                            color: #6C7986;
                        }
                        em.blue{
                            color: #478DE3;
                            font-weight: 700;
                        }
                    }
                }
                li.tabs-title{
                    color: #233241;
                    font-size: 14px;
                    font-weight: bold;
                    margin-right: 30px;
                }
                &.ul2{
                    display: block;
                    overflow: hidden;
                    border-bottom: 1px solid #EDECF0;
                    margin:10px 0 30px 0;
                    padding-bottom: 10px;
                    .ul3{
                        float: left;
                        overflow: hidden;
                        border-bottom: none;
                        li{
                            margin-right: 0;
                            overflow: hidden;
                            clear: both;
                            display: flex;
                            span.yellow{
                                color: #FF9039;
                            }
                            span.mr12{
                                margin-right: 12px;
                            }
                            .div1{
                                width: 210px;
                            }
                            .div2{
                                width: 200px;
                            }
                            .div3{
                                width: 200px;
                            }
                        }
                    }

                    li.tabs-title{
                        margin-right: 30px;
                        margin-bottom: 20px;
                        float: left;
                    }

                }
            }
        }
        .fixed{
            width: 100%;
        }
        .form-btn{
            overflow: hidden;
            border-top: 1px solid #EDECF0;
            background-color: #fff;
            height: 80px;
            line-height: 80px;
            .btnbox{

                bottom: 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .el-button.is-round{
                    padding: 11px 23px;
                    width: 100px;
                }
                .btn1{
                    background-color: #EAEFF5;
                    color: #32485F;
                    border: 1px solid #EAEFF5;
                }
                .btn2{
                    background-color: #478DE3;
                }
            }
            .fl{
                overflow: hidden;
                left: 20px;
                li{
                    &.first-child{
                        margin-left: 30px;
                    }
                    float: left;
                    margin-left: 20px;
                    font-size: 12px;
                    color: #6C7986;
                    span{
                        color: #32485F;
                    }
                }
            }
            .fr{
                right: 20px;
                .mr30{
                    margin-right: 30px;
                }
            }
        }
         //合同主体
        .contractSubject {
            padding: 40px;
        }

        .third-tab{
           padding: 20px 30px 30px 30px;
        }
        .classify{
            margin-bottom: 30px;
            border-bottom: 1px solid #EDECF0;
            padding-bottom: 15px;

            .ht-title{
                color: #32485F;
                font-size: 16px;
                margin-bottom: 15px;
            }
            .small-col{
                margin-bottom: 20px;
                padding-left: 10px;
                .small-title{
                    font-size: 14px;
                    color: #6C7986;
                    margin-bottom: 15px;
                    i{
                        color: #FF3E3E;

                    }
                }

            }

        }
        .ulData{
            display: flex;
            flex-wrap:wrap;
            li{
                margin-right: 10px;
                position: relative;
                > i{
                    display: none;
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    color: #F56C6C;
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
            border: 1px dashed #EDECF0;
            border-radius:1px;
            i {
            color: #EEF2FB;
            font-size: 50px;
            }
            p {
            padding-top: 10px;
            color: #32485F;
            font-size: 12px;
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
            background: #F2F3F8;
            p{
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

</style>


