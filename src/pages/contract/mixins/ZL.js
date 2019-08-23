let Obj2 = {
  val22:'',
  val25:'',
  val26:'',
  val27:'',
  check4:{
    name:'zhizhao4',
    require:true
  },
  val33:'',
  check5:{
    name:'zhizhao5',
    require:true,
    // other:['val40','val41']
  },
  val42:'',
  check6:{
    name:'zhizhao6'
  },
  check18:{
    name:'facility',
    require:true
  },
  val52:'',
  val53:'',
  val56:'',
  // val59:'',
  val60:'',
  val61:'',
  // val64:'',
  val65:'',
  val66:'',
  // check7:{
  //     name:'zhizhao7'
  // },
  val73:'',
  check8:{
    name:'zhizhao8'
  },
  val300:'',
  val79:'',
  val80:'',
  val82:'',
  val83:'',
  val84:'',
  val92:'',
  val93:'',
  val94:'',
  val301:'',
  check9:{
    name:'zhizhao9',
    require:true
  },
  check10:{
    name:'zhizhao10',
    require:true
  },
  check11:{
    name:'zhizhao11',
    require:true
  },
  check12:{
    name:'zhizhao12',
    require:true
  },
  check15:{
    name:'zhizhao15',
    require:true
  },
  check16:{
    name:'remote',
    require:true
  },
  check17:{
    name:'zhizhao16',
    require:true
  },
}
let errorArr1=[]
const MIXINS_ZL={
  data(){
    return{

    }
  },
  methods:{
    //获取自定义勾选框选中状态
    getCheckState(ele){
      return	!!(ele.querySelector('p').getAttribute('checked'))
    },
    //租赁校验

    leaseCheck(iframe,obj=Obj2){
      errorArr1=[]
      for(let item in obj){
        let itemType=Object.prototype.toString.call(obj[item])
        if(itemType==='[object Object]'){
          let state=false
          if(obj[item].name==="textarea"){
            state=true
          }else{
            // debugger
            let box=iframe.document.querySelectorAll(`div[name=${obj[item].name}]`)
            let arr=Array.from(box)
            let list=['facility','zhizhao9','zhizhao10','zhizhao11','zhizhao12','zhizhao15','zhizhao16','remote']
            let that=this
            if(!list.includes(obj[item].name)){
              state = arr.every(function (item) {
                return that.getCheckState(item)===false
              })
            }
          }
          if(state){
            if(obj[item].other){
              let otherState = obj[item].other.every(function (tip) {
                return iframe.document.querySelector(`input[extendparam=${tip}]`).value.length===0
              })
              if(otherState){
                errorArr1.push(obj[item].name)
                break
              }
            }else {
              // console.log(obj[item].name,iframe.document.querySelector(`input[name=${obj[item].name}]`).offsetTop,'请勾选')
              errorArr1.push(obj[item].name)
              break
            }
          }else{
            //勾选后判断
            // debugger
            if(obj[item].require){
              let box=iframe.document.querySelectorAll(`div[name=${obj[item].name}]`)
              let detail={}
              switch (obj[item].name){
                case 'zhizhao9':
                  if(this.getCheckState(box[box.length-1])){
                    detail={
                      val114:''
                    }
                  }
                  break
                case 'zhizhao10':
                  if(this.getCheckState(box[box.length-1])){
                    detail={
                      val119:''
                    }
                  }
                  break
                case 'facility':
                  if(this.getCheckState(box[box.length-1])){
                    detail={
                      val51:''
                    }
                  }
                  break
                case 'zhizhao11':
                  if(this.getCheckState(box[box.length-1])){
                    detail={
                      val125:''
                    }
                  }
                  break
                case 'zhizhao12':
                  if(this.getCheckState(box[box.length-1])){
                    detail={
                      val130:''
                    }
                  }
                  break
                case 'zhizhao15':
                  if(this.getCheckState(box[box.length-1])){
                    detail={
                      val139:''
                    }
                  }
                  break
                case 'zhizhao16':
                  if(this.getCheckState(box[0])){
                    detail={
                      val148:''
                    }
                  }
                  break
                case 'remote':
                  if(this.getCheckState(box[0])){
                    detail.val141=''
                  }
                  if(this.getCheckState(box[1])){
                    detail.val143=''
                  }
                  if(this.getCheckState(box[2])){
                    detail.val145=''
                  }
                  break
                case 'zhizhao4':
                  if(this.getCheckState(box[box.length-1])){
                    detail={
                      val32:''
                    }
                  }
                  break
                case 'zhizhao5':
                  if(this.getCheckState(box[0])){
                    detail={
                      val40:''
                    }
                  }else{
                   iframe.document.querySelector(`span[extendparam="val40"]`).classList.remove('BODERRED')
                   iframe.document.querySelector(`span[extendparam="val41"]`).classList.remove('BODERRED')
                   let value40 = iframe.document.querySelector(`span[extendparam="val40"]`).innerHTML
                   let value41 = iframe.document.querySelector(`span[extendparam="val41"]`).innerHTML
                   if(!value40&&!value41){
                    detail={
                      val40:''
                    }
                   }
                  }
                  // if(this.getCheckState(box[2])){
                  //   detail={
                  //     val41:''
                  //   }
                  // }
                  break
              }
              this.leaseCheck(iframe,detail)
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
  MIXINS_ZL
}
