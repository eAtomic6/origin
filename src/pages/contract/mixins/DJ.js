let Obj5 = {
  val5:'',
  val7:'',
  val13:'',
  check1:{
      name:'manage'
  },
  val16:'',
  val17:'',
  val20:'',
  val25:'',
  check2:{
      name:'pay',
      other:['val35'],//勾选框的补充项
  },
  val37:'',
  check3:{
      name:'person'
  }
}
let errorArr1=[]
const MIXINS_DJ={
  data(){
    return{

    }
  },
  methods:{
    //获取自定义勾选框选中状态
    getCheckState(ele){
      return	!!(ele.querySelector('p').getAttribute('checked'))
    },
    //定金校验
    depositAgreementCheck(iframe,obj=Obj5){
      errorArr1=[]
      for(let item in obj){
        let itemType=Object.prototype.toString.call(obj[item])
        // console.log(itemType)
        if(itemType==='[object Object]'){
          let state=false
          if(obj[item].name==='textarea'){
            state=true
          }else {
            let box=iframe.document.querySelectorAll(`div[name=${obj[item].name}]`)
            let arr=Array.from(box)
            let that = this
            state = arr.every(function (item) {
              return that.getCheckState(item)===false
            })
          }
          if(state){
            if(obj[item].other){
              let otherState = obj[item].other.every(function (tip) {
                return iframe.document.querySelector(`span[extendparam=${tip}]`).innerHTML.length===0
              })
              if(otherState){
                if(obj[item].name==='textarea'){
                  errorArr1.push({
                    type:'input',
                    name:obj[item].other[0]
                  })
                }else {
                  errorArr1.push(obj[item].name)
                }
                break
              }
            }else {
              // console.log(document.querySelector(`input[name=${obj[item].name}]`).offsetTop,'请勾选')
              errorArr1.push(obj[item].name)
              break
            }
          }
        }else {
          let classList = Array.from(iframe.document.querySelector(`*[extendparam=${item}]`).classList)
          if(classList.includes('dropdown-item')||classList.includes('calendar-item')){
            debugger
              obj[item]=iframe.document.querySelector(`input[extendparam=${item}]`).value
              iframe.document.querySelector(`input[extendparam=${item}]`).classList.remove('BODERRED')
          }else{
            debugger
              obj[item]=iframe.document.querySelector(`span[extendparam=${item}]`).innerHTML
              iframe.document.querySelector(`span[extendparam=${item}]`).classList.remove('BODERRED')
          }
          // obj[item]=iframe.document.querySelector(`input[extendparam=${item}]`).value
          // iframe.document.querySelector(`input[extendparam=${item}]`).classList.remove('BODERRED')
          if(obj[item].length===0){
            errorArr1.push({
              type:'input',
              name:item
            })
            break
          }
        }
      }
      console.log(errorArr1)
      return errorArr1
    },
  }
}
export {
  MIXINS_DJ
}
