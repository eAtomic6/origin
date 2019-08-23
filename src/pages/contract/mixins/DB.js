let Obj3 = {
  val8:'',
  val10:'',
  val11:'',
  val12:'',
  val14:'',
  val15:'',
  val16:'',
  val17:'',
  check1:{
    name:'part'
  },
  val20:'',
  check2:{
    name:'owner',
    require:true
  },
  check3:{
    name:'guest',
    require:true
  },
}
let errorArr1=[]
const MIXINS_DB={
  data(){
    return{

    }
  },
  methods:{
    //获取自定义勾选框选中状态
    getCheckState(ele){
      return	!!(ele.querySelector('p').getAttribute('checked'))
    },
    // 代办校验
    commissionCheck(iframe,obj=Obj3){
      // debugger
      errorArr1=[]
      for(let item in obj){
        let itemType=Object.prototype.toString.call(obj[item])
        // console.log(itemType)
        if(itemType==='[object Object]'){
          let box=iframe.document.querySelectorAll(`div[name=${obj[item].name}]`)
          let arr=Array.from(box)
          let state = true
          let that = this
          if(obj[item].name==="owner"||obj[item].name==="guest"){
            state=false
          }else{
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
                errorArr1.push({
                  type:'input',
                  name:obj[item].other[0]
                })
                break
              }
            }else {
              // console.log(document.querySelector(`input[name=${obj[item].name}]`).offsetTop,'请勾选')
              errorArr1.push(obj[item].name)
              break
            }
          }else {
            //勾选后判断
            if(obj[item].require){
              let box=Array.from(iframe.document.querySelectorAll(`div[name=${obj[item].name}]`))
              let detail={}
              switch (obj[item].name){
                case 'owner':
                  box.forEach(element => {
                    if(this.getCheckState(element)){
                      let brother=element.parentElement.querySelector("input[type='text']")
                      let spanTag = element.parentElement.querySelector("span")
                      if(spanTag){
                        spanTag.classList.remove('WARNING')
                      }else{
                        brother.classList.remove('BODERRED')
                      }
                      if(brother.value.length===0){
                        if(spanTag){
                          spanTag.classList.add('WARNING')
                        }
                        errorArr1.push({
                          type:'input',
                          name:brother.getAttribute('extendparam')
                        })
                      }
                    }
                  });
                  break
                case 'guest':
                  box.forEach(element => {
                    if(this.getCheckState(element)){
                      let brother=element.parentElement.querySelector("input[type='text']")
                      let spanTag = element.parentElement.querySelector("span")
                      if(spanTag){
                        spanTag.classList.remove('WARNING')
                      }else{
                        brother.classList.remove('BODERRED')
                      }
                      if(brother.value.length===0){
                        if(spanTag){
                          spanTag.classList.add('WARNING')
                        }
                        errorArr1.push({
                          type:'input',
                          name:brother.getAttribute('extendparam')
                        })
                      }
                    }
                  });
                  break
              }
            }
          }
        }else {
          let classList = Array.from(iframe.document.querySelector(`*[extendparam=${item}]`).classList)
          if(classList.includes('dropdown-item')||classList.includes('calendar-item')){
              obj[item]=iframe.document.querySelector(`input[extendparam=${item}]`).value
              iframe.document.querySelector(`input[extendparam=${item}]`).classList.remove('BODERRED')
          }else{
              obj[item]=iframe.document.querySelector(`span[extendparam=${item}]`).innerHTML
              iframe.document.querySelector(`span[extendparam=${item}]`).classList.remove('BODERRED')
          }
          // let val=iframe.document.querySelector(`input[extendparam=${item}]`).value
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
  MIXINS_DB
}
