<template>
  <div class="view-container">
    <!-- <el-form ref="form"  label-width="80px">
      <el-form-item label="城市选择" class="selectCity">
        <el-select v-model="selectCity" placeholder="请选择" value-key='label' @change='selCity'>
          <el-option
              v-for="(item) in citys"
              :key="item.cityId"
              :label="item.name"
              :value="item.cityId"
              >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form> -->
    <div class="data-list">
      <el-table :data="list" style="width: 100%" @row-dblclick="getRowDetails" border :default-sort = "{prop: 'uploadTime', order: 'descending'}">
        <el-table-column align="center" label="城市" prop="cityName" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="合同类型" prop="type.label" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="合同名称" prop="name" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="合同版本号" prop="version" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="上传人" prop="currentUpdateByName" :formatter="nullFormatter"></el-table-column>
        <el-table-column align="center" label="上传时间" :formatter="nullFormatter">
          <template slot-scope="scope">
            {{scope.row.uploadTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="已使用份数" prop="useNum"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="rowOperation(scope.row,1)" type="text" size="small">上传</el-button>
            <el-button @click="rowOperation(scope.row,2,1)" type="text" size="small" v-if="scope.row.name!=='-'">预览</el-button>
            <el-button @click="rowOperation(scope.row,3)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 上传,预览,详情弹出框 -->
    <el-dialog class="modal"  :closeOnClickModal="$tool.closeOnClickModal" :title='titleStr' :visible.sync="modal" >
      <template v-if="template===1">
        <div>
          <div class="modal-context">
            <label>合同名称：</label>
            <el-input placeholder="限制15个字符"  maxlength='15' v-model="contraName"></el-input>
          </div>
          <div class="file-upload">
            <label>上传：</label>
            <div class="file-upload-opera">
              <div v-if="uploadType">
                <p>
                  <fileUp @getUrl='getAdd("mmai",arguments)' :scane="{path:'template'}" :more="false" :rules="mbrules" id='mmai' class='fileup'>买卖</fileUp>
                  <span v-show="mmaiAddress!==''">上传成功！  {{mmaiAddress.name}}</span>
                </p>
                <p> 
                   <fileUp id='jjian' :rules="mbrules" :more="false"  :scane="{path:'template'}"  @getUrl='getAdd("jjian",arguments)' class='fileup' >居间</fileUp>
                   <span v-show="jjianAddress!==''">上传成功！  {{jjianAddress.name}}</span>
                </p>
                <span class="wordtip">温馨提示：只支持Word格式</span>
                <el-button class="sureUp" @click='sureUp'>确定</el-button>
              </div>
              <div v-else>
                <p> 
                  <fileUp id='mban' :rules="mbrules" @getUrl='getAdd("mban",arguments)' :scane="{path:'template'}" :more="false"  class='fileup'>模板</fileUp>
                  <span v-show="mbanAddress!==''">上传成功！  {{mbanAddress.name}}</span>
                </p>
                <span class="wordtip">温馨提示：只支持Word格式</span>
                <el-button class="sureUp" @click='sureUp'>确定</el-button>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="template===3">
        <el-table  :data="rowData" class="contractType detail" ref='detail' @row-click="rowClick" :row-class-name='tableStyle' highlight-current-row >
          <el-table-column align="center" min-width="100px" label="合同版本号" prop="version"
                           :formatter="nullFormatter"></el-table-column>
          <el-table-column align="center" min-width="100px" label="合同名称" prop="name"
                           :formatter="nullFormatter"></el-table-column>
          <el-table-column align="center" min-width="100px" label="上传人" prop="uploadByName"
                           :formatter="nullFormatter"></el-table-column>
          <el-table-column align="center" min-width="100px" label="上传时间"
                           :formatter="nullFormatter">
                           <template slot-scope="scope">
                          {{scope.row.uploadTime | formatDate}}
                        </template>
          </el-table-column>
          <el-table-column align="center" min-width="100px" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="enable(scope.row)">启用</el-button>
              <el-button @click="rowOperation(scope.row,2,2)" type="text" size="small">预览</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import {FILTER} from "@/assets/js/filter";
  import {MIXINS} from "@/assets/js/mixins";
  import {UPLOAD} from "@/assets/js/uploadMixins";

  export default {
    name: "contract-template",
    mixins: [FILTER,MIXINS,UPLOAD],
    data() {
      return {
        rowenableId:'',
        selectCity: 1,
        list: [],
        rowData: [],
        modal: false,
        template: '',//弹窗内容
        uploadType: false,//是否显示两个上传
        titleStr:'',
        contraName:'',
        cityName:'',
        citys:[],
        mbrules:['html'],
        contraType:'',
        mmaiAddress:'',
        jjianAddress:'',
        mbanAddress:'',
        towFlag:0, 
        id:'',
        power: {
              'sign-set-ht-query': {
                  state: false,
                  name: '查询'
              },
        }
      }
    },
    created() {
      // if(localStorage.getItem('cid')){
      //   this.selectCity=parseInt(localStorage.getItem('cid'))
      // }else{
        if(localStorage.getItem('initId')){
          this.selectCity=parseInt(localStorage.getItem('initId'))
        }
        // this.selectCity=parseInt(this.getUser.user.cityId)
          this.cityName='武汉'
      // }
      this.$ajax.get('/api/organize/cities').then((res)=>{
                if(res.status==200){
                    this.citys=res.data.data
          }
      })
      this.getList()
    },
    methods: {
      rowClick(){
         this.$refs.detail.$el.classList.remove('detail')
      },
      tableStyle({row, rowIndex}){
        if(this.rowenableId==row.id)
            return 'linestyle'
       },
      getAdd(type,obj){
        if(type=='mmai'){
           this.mmaiAddress=obj[0].param[obj[0].param.length-1];
        }else if(type=='jjian'){
          this.jjianAddress=obj[0].param[obj[0].param.length-1]
        }else if(type=='mban'){
          this.mbanAddress=obj[0].param[obj[0].param.length-1]
        }
      },
      selCity(){
            localStorage.setItem('cid',this.selectCity)
            this.getList()
      },
      popMsg(msg,callback){
        this.$confirm(msg,'提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(()=>{
           callback()
        }).catch(()=>{

        })
      },
      /**
       * 获取列表数据
       */
      getList: function () {
        let param = {
          cityId:this.selectCity
        }
        // if(this.power['sign-set-ht-query'].state){
              this.$ajax.get('/api/setting/contractTemplate/list', param).then(res => {
              res = res.data
              if (res.status === 200) {
                this.list = res.data
                this.cityName=res.data[0].cityName
              }
            }).catch(error => {
              console.log(error)
            })
        // }
        // else{
        //   this.noPower(this.power['sign-set-ht-query'].name)
        // }

      },
      trim(str){
            return str.replace(/(^\s*)|(\s*$)/g, "")
      },
      /**
       * 上传
       */
      sureUp(){
        if(this.trim(this.contraName).length==0){
          this.modal=true
          this.$message({
                type: 'error',
                message: '合同名称不能为空'
                })
              return
          }
        if(this.uploadType){
              if(this.mmaiAddress=='' || this.jjianAddress==''){
                this.$message({
                    type: 'error',
                    message: '请上传买卖和居间模板！'
                    })
                  return
              }
        }else{
              if(this.mbanAddress==''){
                this.$message({
                    type: 'error',
                    message: '请上传模板！'
                    })
                  return
              }
            }
        this.modal=false
        if(this.uploadType){
          this.towFlag=1
        }
        this.setPath(this.$tool.getRouter(['设置','合同模板设置','合同模板预览'],'contractTemplate'))
        this.$router.push({
        path: "/contraPreview",
        query: {
          mmaiAddress: this.mmaiAddress,
          jjianAddress:this.jjianAddress,
          mbanAddress:this.mbanAddress,
          selectCity:this.selectCity,
          type:this.contraType,
          cityName:this.cityName,
          contraName:this.contraName,
          towFlag:this.towFlag,
          show:1,
          id:this.id
        }
      });
      },
      /**
       * 启用
       */
      enable(row){
        let param={
          id:this.bigId,
          enableTemplateId:row.id,
          name:row.name,
          uploadByName:row.uploadByName,
          uploadTime:row.uploadTime
        }
        this.popMsg('确定要启用此类型模板吗？',()=>{
        this.$ajax.put('/api/setting/contractTemplate/enable',param,2).then(res=>{
          if(res.status==200){
            this.$message({
                type: 'success',
                message: '启用成功！'
                })
                this.getList()
          }
        })
         this.modal=false
       })
      },
      /**
       * 获取详情
       * @param row
       */
      getRowDetails: function (row, column, cell, event) {
          this.rowenableId=row.enableTemplateId;
          this.bigId=row.id
          this.$ajax.get('/api/setting/contractTemplate/listByType', {id: row.id,cityName:row.cityName}).then(res => {
          res = res.data
          if (res.status === 200) {
            this.rowData = res.data
            this.modal = true
            this.titleStr='合同模板详情'
            this.template = 3
          }
        }).catch(error => {
          console.log(error)
        })
      },
      rowOperation: function (row, type,showType) {
        //上传
        this.modal = true
        if(type===1){
            this.contraName=''
            this.mbanAddress=''
            this.mmaiAddress=''
            this.jjianAddress='' 
            this.template = 1
            this.id=row.id
            this.contraType=row.type.value
            this.titleStr='上传合同模板'
            this.uploadType = row.flag==1
        }
        //预览
        else if(type===2){
          this.setPath(this.$tool.getRouter(['设置','合同模板设置','合同模板预览'],'contractTemplate'))
          this.$router.push({
            path: "/contraPreview",
            query: {
              enableTemplateId:showType==2?row.id:row.enableTemplateId,
              show:2,
            }
          });
        }
        else if(type==3){
          this.setPath(this.$tool.getRouter(['设置','合同模板设置','合同模板修改'],'contractTemplate'))
           this.$router.push({
            path: "/contraPreview",
            query: {
              enableTemplateId:row.enableTemplateId,
              show:3,
            }
          });
        }
      }
    },
  }
</script>

<style scoped lang="less">
 @import "~@/assets/common.less";
.view-container{
  /deep/
  .el-form {
    background:rgba(255,255,255,1);
    box-shadow:0px 1px 6px 0px rgba(7,47,116,0.1);
    border-radius:4px;
    border: 1px solid transparent;
    .selectCity {
      padding: 6px 0;
      line-height: 32px;
      height: 32px;
      margin-bottom: 0;
      .el-form-item__content,
      .el-form-item__label {
        line-height: 32px;
      }
    }
    .el-select {
      width: 150px;
      height: 32px;
      .el-input {
        height: 100%;
        .el-input__inner {
          height: 100%;
          padding-left: 8px;
        }
        .el-input__icon {
          line-height: 32px;
        }
      }
    }
  }
}
  .data-list {
    background-color: #fff;
    padding-top: @margin-10;
    margin: 0px 10px;
      > p {
        padding: 0 6px;
        display: flex;
        height: 36px;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        .mr-8 {
             margin-right: 8px;
        }
    }
    /deep/
    .has-gutter {
        tr {
          border-radius: 4px;
          th {
            background: rgba(238, 242, 251, 1) !important;
            .cell{
              font-size:14px;
              font-family:MicrosoftYaHei;
              font-weight:400;
              color:rgba(108,121,134,1);
            }
          }
        }
      }
      /deep/
    .el-table__body-wrapper{
      tbody{
         .el-table__row{
          td{
            .cell{
              font-weight:400;
              color:rgba(35,50,65,1);
            }
          }
        }
        .el-table__row{
          td:nth-child(2){
            .cell{
              color:#409EFF;
            }
          }
        }
      }
    }
  }
  .icon-font-close {
    &:after {
      content: 'X';
      position: absolute;
      top: 50%;
      right: 20px;
      -webkit-transform: translateY(-50%);
      -moz-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      -o-transform: translateY(-50%);
      transform: translateY(-50%);
    }
  }
  .modal {
    > p {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding-left: 21px;
      height: 50px;
      display: flex;
      justify-content: left;
      align-items: center;
      border-bottom: solid 1px rgba(237,236,240,1);
    }
    .modal-context {
      display: flex;
      align-items: center;
      > label {
        min-width: 100px;
      }
    }
    .file-upload{
      margin-top: 30px;
      display: flex;
      >label {
        min-width: 100px;
      }
      &-opera{
        display: flex;
        flex-direction: column;
        p{
          position: relative;
          height: 70px;
          width: 391px;
          /deep/
          .fileup{
            width:86px;
            height:32px;
            line-height: 32px;
            background-color:#409EFF;
            border-radius:16px;
            color: white;
            text-align: center !important
          }
          span{
            position: absolute;
            line-height: auto;
            bottom: 12px;
            font-style: italic;
            padding-left: 0;
            font-size: 12px;
            color: darkseagreen;
          }
        }
        span{
          font-size:14px;
          font-family:MicrosoftYaHei;
          font-weight:400;
          color:rgba(108,121,134,1);
          padding-left: 14px;
        }
         .sureUp{
            width:86px;
            height:32px;
            line-height: 7px;
            background:#409EFF;
            border-radius:16px;
            color: white;
            text-align: center;
            position: absolute;
            right: 21px;
            bottom: 10px;
        }
      }
    }
    .contractType{
      border:solid 1px rgba(237,236,240,1);
      height: 453px;
      overflow-y: auto;
      /deep/
        .has-gutter{
          th{
             background:rgba(238,242,251,1);
            .cell{
            font-size:14px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(108,121,134,1);
            line-height:42px;
            }
          }
        }
    }
.wordtip{
  padding-left: 0 !important
}
/deep/ .el-dialog__body{
    padding: 30px 20px;
  }

/deep/ .detail tr.linestyle{
    background-color: #ECF5FF;
}
}
</style>
