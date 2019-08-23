import {mapMutations,mapGetters} from 'vuex'

const MIXINS = {
  data(){
    return{
      userMsg:null,
      DepList:[],
      EmployeList:[],
      EmployeInit:0,//初始员工总数
      employeScroll:null,
      tree:true,
      Loading:true,
      preview:false,
      previewFiles:[],
      previewIndex:0,
      defaultProps: {
        children: 'subs',
        label: 'name'
      },
      //部门下拉筛选
      dep:{
        id:'',
        name:'',
        empId:'',
        empName:''
      },
      employePage:1,
      employeTotal:0,
      tableBoxCom:null,
      tableNumberCom:null,
      systemTagList: []
    }
  },
  watch:{
    getUser:function (val) {
      for (let item in this.power){
        // this.power[item].state=true
        let path=this.$route.path
        /*if(path==='/Bill'||path==='/actualHarvest'){
          this.power[item].state=true
        }else {*/
          if(val.privileges.indexOf(item)>-1){
            this.power[item].state=true
          }
        // }
      }
    },
    getBodyScollShow(){
        this.comHeightFn();
    }
  },
  methods: {
    noPower:function (msg) {
      this.$message({
        message:`没有${msg}权限`
      })
    },
    /**
     * 收取字典id，拼接字符串
     * @param obj
     * @returns {string}
     */
    getDictionaryIds: function (obj) {
      let arr = []
      for (let item in obj) {
        arr.push(item)
      }
      return arr.join(',')

    },
    /**
     * 获取筛选数据
     * dictionary必须在各自页面定义 例：dictionary:{'1':'','2':''}
     */
    getDictionary: function () {
      let param = {
        parentIds: this.getDictionaryIds(this.dictionary)
      }
      this.$ajax.get('/api/dictionary/batchQuery', param).then(res => {
        // console.log(res);
        res = res.data
        if (res.status === 200) {
          // console.log(res.data)
          this.dictionary = Object.assign({}, res.data)
        }
      })
    },
    /**
     * 获取当前用户信息
     */
    getAdmin:function () {
      this.$ajax.get('/api/me').then(res=>{
        res=res.data
        if(res.status===200){
          this.userMsg = res.data.user;
          localStorage.setItem('initId',res.data.user.cityId)
          localStorage.setItem('cityName',res.data.user.cityName)
        }
      })
    },
    /**
     * 获取体系
     */
    getSystemTag:function () {
      this.$ajax.get('/api/organize/getSystemTagByCityId').then(res=>{
        res=res.data
        if(res.status===200){
          this.systemTagList = res.data
        }
      })
    },
    /**
     * 获取部门
     */
    remoteMethod:function (val) {
      this.$ajax.get('/api/access/deps/tree',{keyword:val}).then(res=>{
        res=res.data
        if(res.status===200){
          this.DepList=[].concat(res.data)
          this.Loading=false
        }
      })
    },
    getEmploye:function (val,page=1,sub=true) {
      this.$ajax.get('/api/organize/employees/pages',{depId:val,pageNum:page,selectSubs:sub}).then(res=>{
        res=res.data
        if(res.status===200){
          res.data.list.some((item,index)=>{
            if(item.empId===this.dep.empId){
              res.data.list.splice(index,1)
            }
          })
          this.EmployeList=this.EmployeList.concat(res.data.list)
          this.employeTotal=res.data.total
          this.EmployeInit = res.data.total
        }
      })
    },
    getEmployeByText:function (val,sub=true) {
      this.$ajax.get('/api/organize/employees/pages',{keyword:val,depId:this.dep.id,pageNum:1,selectSubs:sub}).then(res=>{
        res=res.data
        if(res.status===200){
          this.EmployeList=[].concat(res.data.list)
          this.employeTotal=res.data.total
        }
      })
    },
    clearSelect:function (type='dep') {
      if(type==='dep'){
        this.dep.id=''
        this.dep.name=''
        this.EmployeList=[]
        this.employePage=1
        // this.remoteMethod()
      }else {
        this.EmployeList=[]
        this.employePage=1
      }
    },
    //部门、员工树结构选择操作
    handleNodeClick(data) {
      this.getEmploye(data.depId)
      this.clearSelect('emp')
      this.dep.id=data.depId
      this.dep.name=data.name
      /*if(data.subs.length===0){
        this.$refs.tree.blur()
      }*/
    },
    //员工树结构选择操作
    handleEmpNodeClick(data) {
      let cell = {empId:'',name:''}
      if(data){
        cell = this.EmployeList.find(item=>item.empId===data)
      }
      this.dep=Object.assign({},this.dep,{
        empId:cell.empId,
        empName:cell.name
      })
    },
    //员工滚动加载更多
    moreEmploye:function () {
      if(this.EmployeList.length>=this.employeTotal){
        return
      }else {
        this.getEmploye(this.dep.id,++this.employePage)
      }
    },
    /**
     * 合同信息操作
     * @param type
     */
    msgOpera:function ({contType,contId,contCode,operaType,power}) {
      if(operaType==='cont'&&power.state){
        // this.setPath(this.getPath.concat({name:'合同详情'}))
        this.setPath(this.getPath.concat({name:'合同详情'}))
        this.$router.push({
          path:contType===this.$tool.contType['4']||contType===this.$tool.contType['5']?'detailIntention':'contractDetails',
          query:{
            contType:contType,
            id:contId,
            code:contCode,
            pageName:'合同详情'
          }
        })
      }else {
        this.noPower(`查看${power.name}`)
      }
    },
    /**
     * 获取签名
     */
    fileSign:function (arr,type) {
      let param={urls:arr.join(',')}
      if(type==='download'){
        param.rct='application%2Foctet-stream'
      }
      // param.style='jjw-watermark'
      this.$ajax.put('/api/load/generateAccessURLBatch',param,2).then(res=>{
        res=res.data
        if(res.status===200){
          if(type==='download'){
            var a = document.createElement('a');
            a.download = undefined;
            a.href = res.data[0];
            // a.innerText='test'
            document.body.appendChild(a)
            a.click();
            document.body.removeChild(a)
          }else if(type===2){//合同主体
            this.previewFiles=res.data
            this.preview=true
            this.previewType="contMain"
          }else if(type===3){//合同资料库
            this.previewFiles=res.data
            this.preview=true
            this.previewType="contData"
          }else {
            this.previewFiles=res.data
            this.preview=true
          }
        }
      })
    },
    // 图片放大
    // 这个方法的前提是你的图片json 格式是 是name ， path 分开的
    /**
     *
     * @param {图片数组} arr
     * @param {点击第几张图片} i
     */
    previewPhoto(arr,i,downType=1){
        let type = this.$tool.get_suffix(arr[i].path)
        if(this.imgBoolFn(type)){
            // 图片 和 视频 预览
            let arr2 = [];
            arr.map(e=>{
                if(this.imgBoolFn(this.$tool.get_suffix(e.path))){
                    if(e.path === arr[i].path){
                      this.previewIndex = arr2.length;
                    }
                    arr2.push(e.path);
                }
            })
            this.fileSign(arr2,downType)
        }else{
            // 其他文件 下载
            if(downType===2){//合同主体
              if(this.power['sign-ht-xq-main-down'].state){
                this.fileSign([].concat(arr[i].path),'download');
              }else{
                this.noPower('合同主体下载');
              }
            }else if(downType===3){
              if(this.power['sign-ht-xq-data'].state){
                this.fileSign([].concat(arr[i].path),'download');
              }else{
                this.noPower('合同资料库下载');
              }
            }else{
              this.fileSign([].concat(arr[i].path),'download');
            }

        }
    },
    // 判断图片类别
    imgBoolFn(type){
        switch (type.toLowerCase()) {
            case '.png':
                return true
                break;
            case '.gif':
                return true
                break;
            case '.jpg':
                return true
                break;
            case '.jpeg':
                return true
                break;
            /*case '.avi':
                return true
                break;*/
            case '.mp4':
                return true
                break;
            default:
                return false
                break;
        }
    },
    /**
     * 导出excel
     */
    excelCreate:function (url,param) {
      this.HQloadingList = true
      this.$ajax.get(`/api${url}`,param).then(res=>{
        res=res.data
        if(res.status===200){
          this.HQloadingList = false
          this.fileSign([res.data],'download')
          /*var a = document.createElement('a');
          a.download = undefined;
          a.href = res.data;
          // a.innerText='test'
          document.body.appendChild(a)
          a.click();
          document.body.removeChild(a)*/
        }
      }).catch(error=>{
        this.$message({
          message:error
        })
        this.HQloadingList = false
      })
    },
    /**
     * 权限判断
     */
    havePower:function (url) {
      console.log('test')
    },
    //解决浮点数乘法计算精度问题
    multiply : function (arg1, arg2) {
      var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
      try {
        m += s1.split(".")[1].length;
      }
      catch (e) {
      }
      try {
        m += s2.split(".")[1].length;
      }
      catch (e) {
      }
      return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    },
    //动态高度获取
    comHeightFn(){
      if(this.$refs.tableCom&&this.$refs.tableComView){
        let wh = document.documentElement.clientHeight;
        let h1 =this.$refs.tableComView.clientHeight + 80;
        let h2 =this.$refs.tableCom.$el.clientHeight;
        let th = wh - h1;
        this.tableNumberCom = h2 + th;
      }
    },
    ...mapMutations([
      'setPath',
      'setLoading',
      'setSearchQuery'
    ])
  },
  computed:{
    ...mapGetters([
      'getPath',
      'getUser',
      'getLoading',
      'getCollapse',
      'getBodyScollShow',
      'getSearchQuery',
      'getDataList'
    ])
  },
  mounted() {
    window.onresize = this.comHeightFn;

    for (let item in this.power){
      // this.power[item].state=true
      let path=this.$route.path
      /*if(path==='/Bill'||path==='/actualHarvest'){
        this.power[item].state=true
      }else {*/
      if(this.getUser){
        if(this.getUser.privileges.indexOf(item)>-1){
          this.power[item].state=true
        }
      }
      // }
    }
  },
}

export {
  MIXINS,
}
