<template>
    <div class="preview">
      <div class="view-container" :class="[getType==='img'?'img-drag':'']" ref="drag" @mousedown="mousedown" @mouseup="dragging=false">
        <img ref="img" :src="imgSrc" :style="{width:getWidth,height:getHeight,transform:getRotate}" alt="" v-if="getType==='img'">
        <video ref="video" :style="{transform:getRotate}" controls v-else-if="getType==='video'">
          <source  :src="imgSrc" type="video/mp4">
        </video>
        <a :href="imgSrc" download v-else>文件不支持预览，请手动下载</a>
      </div>
      <p class="pagination page-prev" @click="chose('prev')"><img :src="getImg('btn-prev.png')" alt=""></p>
      <p class="pagination page-next" @click="chose('next')"><img :src="getImg('btn-next.png')" alt=""></p>
      <p class="tools btn-close" @click="chose('close')"><img :src="getImg('btn-close.png')" alt=""></p>
      <ul class="tools" v-if="getPreviewType==='contMain'||getPreviewType==='contData'">
        <li @click="opera(1)" v-if="getPreviewType==='contMain'&&power['sign-ht-xq-main-down'].state"><i class="iconfont icon-yuanjiaojuxing"></i></li>
        <li @click="opera(1)" v-if="getPreviewType==='contData'&&power['sign-ht-xq-data'].state"><i class="iconfont icon-yuanjiaojuxing"></i></li>
        <li @click="opera(2)"><i class="iconfont icon-tubiao-12"></i></li>
        <li @click="opera(3)" v-if="getType==='img'"><i class="iconfont icon-icon-test3"></i></li>
        <li @click="opera(4)" v-if="getType==='img'"><i class="iconfont icon-yuanjiaojuxing1"></i></li>
      </ul>
      <ul class="tools" v-else>
        <li @click="opera(1)"><i class="iconfont icon-yuanjiaojuxing"></i></li>
        <li @click="opera(2)"><i class="iconfont icon-tubiao-12"></i></li>
        <li @click="opera(3)" v-if="getType==='img'"><i class="iconfont icon-icon-test3"></i></li>
        <li @click="opera(4)" v-if="getType==='img'"><i class="iconfont icon-yuanjiaojuxing1"></i></li>
      </ul>
    </div>
</template>

<script>
  import {MIXINS} from "@/assets/js/mixins";

  export default {
    name: "preview",
    mixins:[MIXINS],
    props:{
      imgList:{
        type:Array,
        default:function () {
          return []
        }
      },
      start:{
        type:Number,
        default:0
      },
      previewType:{
        type:String,
        default:'none'
      }
    },
    data(){
      return{
        imgSrc:'',
        activePage:this.start,
        imgWidth:100,
        initWidth:0,//预览图片的显示原始尺寸
        transform:0,
        //拖拽
        dragging:false,
        mousePos:{},
        dragPos:{
          x:0,
          y:0
        },
        typeList:[],
        activeType:'',
        persent:0,//缩放比例
        power:{
          'sign-ht-xq-main-down': {
            state: false,
            name: '下载合同主体'
          },
          'sign-ht-xq-data': {
            state: false,
            name: '下载合同资料库'
          },
        }
      }
    },
    created(){
      if(this.getImages.length>0){
        this.imgSrc=this.getImages[this.activePage].path
        // debugger
        this.init(this.imgSrc)
      }
      this.$nextTick(()=>{
        // this.initWidth=this.$refs.img.offsetWidth
        document.onmousemove=function (event) {
          if (this.dragging) {
            event = event || window.event;
            let dragObj = this.$refs.drag
            dragObj.style.left = parseInt(event.clientX - this.mousePos.x + this.dragPos.x) + "px";
            dragObj.style.top = parseInt(event.clientY - this.mousePos.y + this.dragPos.y) + "px";
            // console.log(dragObj.style.left,dragObj.style.top)
          }
        }.bind(this)
      })
    },
    methods:{
      getImg:function (src) {
        return require('@/assets/img/'+src)
      },
      chose:function (type) {
        // this.imgWidth=100
        this.transform=0
        let dragObj = this.$refs.drag
        dragObj.style.left = '50%'
        dragObj.style.top = '50%'
        dragObj.style.transform='translate(-50%,-50%)'
        if(type==='next'){
          if(this.activePage===this.getImages.length-1){
            this.activePage=0
          }else {
            this.activePage+=1
          }
        }else if(type==='prev') {
          if(this.activePage===0){
            this.activePage=this.getImages.length-1
          }else {
            this.activePage-=1
          }
        }else {
          this.$emit('close')
        }
      },
      opera:function (type) {
        switch (type){
          case 1:
            this.fileSign([].concat(this.imgSrc.split('?')[0]),'download')
            break
          case 2:
            this.transform+=90
            break
          case 3:
            if(this.imgWidth<this.initWidth+300){
              this.imgWidth+=50
            }
            break
          case 4:
            if(this.imgWidth>this.initWidth){
              this.imgWidth-=50
            }
            break
        }
      },
      mousedown:function () {
        // debugger
        this.dragging=true
        this.mousePos = Object.assign({},this.$tool.getMousePos())
        let dragObj = this.$refs.drag
        let objLeft = dragObj.style.left
        let objTop = dragObj.style.top
        this.dragPos.x=!objLeft||objLeft==='50%'?(document.body.offsetWidth-dragObj.offsetWidth)/2:parseInt(objLeft)
        this.dragPos.y=!objTop||objTop==='50%'?(document.body.offsetHeight-dragObj.offsetHeight)/2:parseInt(objTop)
        // console.log(this.mousePos,this.dragPos)
        dragObj.style.transform='none'
        if(!objLeft||objLeft==='50%'){
          dragObj.style.left=this.dragPos.x+'px'
        }
        if(!objTop||objTop==='50%'){
          dragObj.style.top=this.dragPos.y+'px'
        }
      },
      /**
       * 获取预览资源原始信息
       */
      init:function (src) {
        if(this.getType==='img'){
          this.$nextTick(()=>{
            let picture=this.$refs.img
            let img = new Image()
            img.src=src
            img.onload=function () {
              // debugger
              //防止图片未加载，获取width为0的情况
              this.persent = parseFloat((img.width/img.height).toFixed(2))
              this.imgWidth=img.width
              if(img.width>1000){
                this.imgWidth=800
                // picture.style.height=`${800/this.persent}px`
                if(img.height>window.innerHeight){
                  // picture.style.height=`${window.innerHeight}px`
                  if(this.persent>1){
                    this.imgWidth=window.innerHeight*this.persent*0.6
                  }else {
                    this.imgWidth=window.innerHeight*this.persent
                  }
                }
              }else {
                if(img.height>window.innerHeight){
                  // picture.style.height=`${window.innerHeight}px`
                  this.imgWidth=window.innerHeight*this.persent
                }
              }
              this.initWidth=this.imgWidth
              /*if(img.width<=200){
                this.imgWidth=img.width
              }else if(img.width>=1000){
                this.imgWidth=img.width*0.4
              }else {
                this.imgWidth=img.width*0.5
              }
              this.initWidth=this.imgWidth*/
            }.bind(this)
          })
        }else {
          this.$nextTick(()=>{
            let video=this.$refs.video
            video.src=src
            video.onloadedmetadata=function () {
              let persent=parseFloat((video.videoWidth/video.videoHeight).toFixed(2))
              if(video.videoHeight>window.innerHeight){
                // console.log('test',video.videoWidth,video.videoHeight,window.innerHeight,persent)
                video.style.width=`${window.innerHeight*persent}px`
                video.style.height=`${window.innerHeight}px`
                // console.log(video)
              }
              if(video.videoWidth>1000){
                video.style.width='800px'
                video.style.height=`${800/persent}px`
              }
            }
          })
        }
      },
    },
    computed:{
      getImages:function () {
        let arr=this.imgList.map((item,index)=>{
          if(item.indexOf('?')){
            return {
              id:index,
              type:this.$tool.get_suffix(item.split('?')[0]),
              path:item
            }
          }
        })
        return [].concat(arr)
      },
      getWidth:function () {
        return `${this.imgWidth}px`
      },
      getHeight:function () {
        return `${this.imgWidth/this.persent}px`
      },
      getRotate:function () {
        return `rotate(${this.transform}deg)`
      },
      getType:function () {
        switch (this.getImages[this.activePage].type.toLocaleLowerCase()){
          case '.png':
          case '.jpg':
          case '.jpeg':
          case '.gif':
          case '.bmp':
            return 'img'
            break
          case '.mp4':
          /*case '.avi':
          case '.rmvb':*/
            return 'video'
            break
          default:
            return 'other'
        }
      },
      getPreviewType(){
        return this.previewType;
      }
    },
    watch:{
      activePage:function (val) {
        this.imgSrc=this.getImages[this.activePage].path
        this.init(this.imgSrc)
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/common.less";
.preview{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background:rgba(0,0,0,0.6);
  z-index: 99;
  overflow: hidden;
}
  .pagination,.btn-close{
    position: absolute;
    img{
      width: 60%;
    }
  }
  .page-prev,.page-next{
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  .page-prev{
    left: 10%;
  }
  .page-next{
    right: 10%;
  }
  .btn-close{
    top: 50px;
    right: 10%;
  }
  ul.tools{
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform:translateX(-50%);
    display: flex;
    /*width:190px;*/
    background:rgba(0,0,0,0.6);
    border-radius:4px;
    z-index: 10;
    >li{
      flex: 1;
      min-width: 50px;
      text-align: center;
      padding: @margin-10 0;
      color: @color-white;
      cursor: pointer;
    }
  }
  .view-container{
    max-width: 60%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    user-select: none;
    &.img-drag{
      &:after{
        content:'';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 9;
      }
    }
    >.video{
      max-width: 750px;
    }
  }
</style>
