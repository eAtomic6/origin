import {set_upload_param} from "./upload";

let uploader = null

const UPLOAD={
  data(){
    return {
      filePath:[],//表单提交传给后台的文件路径
    }
  },
  mounted() {
    let that = this
    this.filePath = []
    this.$nextTick(()=>{
      uploader = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',
        browse_button: that.$refs.select, //选择文件按钮
        flash_swf_url: 'lib/plupload-2.1.2/js/Moxie.swf',
        silverlight_xap_url: 'lib/plupload-2.1.2/js/Moxie.xap',
        url: 'http://oss.aliyuncs.com',

        filters: {
          prevent_duplicates: true //不允许选取重复文件
        },
        init:{
          FileFiltered:function () {
            debugger
          },
          FilesAdded: function(up, files) {
            // 选择文件后执行
            debugger
            // that.up()
          },
          BeforeUpload: function(up, file) {
            // 点击上传前执行
          },
          UploadProgress: function(up, file) {
            // 上传操作进行中
          },
          FileUploaded: function(up, file, info) {
            // 响应
            if(info.status===200||info.status===203){
              that.$message({
                message:'上传成功'
              })
            }
          },
          Error: function(up, err) {
            // ...
          }
        }
      });
      uploader.init()
    })
  },
  methods:{
    /**
     * 上传操作
     */
    up:function () {
      console.log(uploader)
      let path = 'picture/'
      if(uploader.files.length!==0){
        this.getUrl(path).then(res=>{
          debugger
          this.filePath.push(`${res.host}${res.key}${uploader.files[0].name.split('.')[1]}`)
          console.log(this.filePath)
          set_upload_param(uploader,res,uploader.files[0].name);
        })
      }
    },
    getUrl:function (file) {
      return new Promise((resolve,reject)=>{
        this.$ajax.get('/api/load/generateSignature',{dir:file}).then(res=>{
          if(res.status===200){
            resolve(res.data)
          }
        }).catch(error=>{
          reject()
        })
      })
    },
    /**
     * 请求判定文件是否上传成功
     * @param path
     */
    getFiles:function (path) {
      this.$http.get('/api/load/generateAccessURL',{url:path}).then(res=>{

      })
    },
    getSetting:async function (e) {
      let obj = new plupload.File(e.target.files[0])
      uploader.addFile(obj)
      console.log(obj)
      uploader.setOption('browse_button','id')
      console.log(uploader.settings)
      console.log(uploader.files)
    },
    getDom:function () {
      return new Promise((resolve,reject)=>{
        let dom = this.$refs.select
        if(!dom){
          reject()
        }else {
          resolve(dom)
        }
      })
    }
  }
}
export {
  UPLOAD
}
