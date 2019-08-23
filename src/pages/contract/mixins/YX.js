let Obj4 = {
  val3: '',
  val8: '',
  val9: '',
  val12: '',
  val13: '',
  val16: '',
}
let errorArr1=[]
const MIXINS_YX={
  data(){
    return{

    }
  },
  methods:{
    //获取自定义勾选框选中状态
    getCheckState(ele){
      return	!!(ele.querySelector('p').getAttribute('checked'))
    },
    //意向校验
    agreementCheck(iframe,obj=Obj4){
      errorArr1=[]
      for (let item in obj) {
        iframe.document.querySelector(`*[extendparam=${item}]`).classList.remove('BODERRED')
        if(item==="val3"){
          obj[item] = iframe.document.querySelector(`input[extendparam=${item}]`).value
        }else{
          obj[item] = iframe.document.querySelector(`span[extendparam=${item}]`).innerHTML
        }
        if (obj[item].length === 0) {
          errorArr1.push({
            type:'input',
            name:item
          })
          break
        }
      }
      console.log(errorArr1)
      return errorArr1
    },
  }
}
export {
  MIXINS_YX
}
