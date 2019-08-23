let Obj1={
  check0:{
    name:'prove',
    require:true
  },
  // check1:{
  //   name:'acquire',
  //   require:true
  // },
  // check120:{
  // 	name:'trader'
  // },
  check2:{
    name:'hasRunsh',
    require:true
  },
  check7:{
    name:'loans'
  },
  check8:{
    name:'pledge'
  },
  check9:{
    name:'transaction'
  },
  check10:{//房屋性质
    name:'nature',
    other:['val30'],
  },
  check3:{
    name:'setting',
    require:true
  },
  check11:{
    name:'rentout'
  },
  val46:'',
  check4:{
    name:'furniture',
    require:true
  },
  check5:{
    name:'carport',
    require:true
  },
  val70:'',
  val71:'',
  val72:'method2',
  val93:'',
  val94:'method3',
  check12:{
    name:'yes'
  },
  check6:{
    name:'check02',
    require:true
  },
  val110:'',
  val111:'',
  check14:{
    name:"check03"
  },
  check15:{
    name:"check04"
  },
  check16:{
    name:"check05"
  },
  check17:{
    name:"check06"
  },
  val121:'',
  check18:{
    name:"check07"
  },
  val200:'',
  val124:'method5',
  val129:'',
  check13:{
    name:'check01'
  },
  val130:'',
  val131:'',
  val132:'',
  val138:'',
}
let errorArr2=[]
const MIXINS_MM={
  data(){
    return{

    }
  },
  methods:{
    //获取自定义勾选框选中状态
    getCheckState(ele){
      return	!!(ele.querySelector('p').getAttribute('checked'))
    },
    //买卖校验
    dealCheck(iframe,obj=Obj1){
      errorArr2=[]
      for(let item in obj){
        let itemType=Object.prototype.toString.call(obj[item])
        if(itemType==='[object Object]'){
          let state=false
          if(obj[item].name==='textarea'){
            state=true
          }else {
            let box=iframe.document.querySelectorAll(`div[name=${obj[item].name}]`)
            let arr=Array.from(box)
            let that=this
            state = arr.every(function (tagItem) {
              // return tagItem.checked===false
              return that.getCheckState(tagItem)===false
            })
          }
          if(state){
            if(obj[item].other){
              let otherState = obj[item].other.every(function (tip) {
                return iframe.document.querySelector(`span[extendparam=${tip}]`).innerHTML.length===0
              })
              if(otherState){
                // errorArr2.push({
                // 	type:'input',
                // 	name:obj[item].other[0]
                // })
                errorArr2.push(obj[item].name)
                break
              }
            }else {
              // console.log(obj[item].name,iframe.document.querySelector(`input[name=${obj[item].name}]`).offsetTop,'请勾选')
              errorArr2.push(obj[item].name)
              break
            }
          }else {
            //勾选后判断
            if(obj[item].require){
              let box=iframe.document.querySelectorAll(`div[name=${obj[item].name}]`)
              let detail={}
              switch (obj[item].name){
                case 'prove':
                  if(this.getCheckState(box[0])){
                    detail={
                      val12:''
                    }
                  }else{
                    detail={
                      val15:'',
                      check919:{
                        name:'trader'
                      }
                    }
                  }
                  break
                // case 'acquire':
                //   if(this.getCheckState(box[0])){
                //     detail={
                //       val12:''
                //     }
                //   }else {
                //     detail={
                //       val15:''
                //     }
                //   }
                //   break
                case 'hasRunsh':
                  if(this.getCheckState(box[0])){
                    detail={
                      val19:''
                    }
                  }
                  break
                case 'setting':
                  if(this.getCheckState(box[1])){
                    detail={
                      val33:'method1'
                    }
                  }
                  break
                case 'thirdparty':
                  if(this.getCheckState(box[0])){
                    detail={
                      val35:'',
                    }
                  }
                  break
                case 'cash':
                  if(this.getCheckState(box[0])){
                    detail={
                      val40:'',
                      val45:''
                    }
                  }else{
                    detail={
                      val44:'',
                      val45:''
                    }
                  }
                  break
                case 'pass':
                  if(this.getCheckState(box[0])){
                    detail={
                      val45:'',
                      val46:'',
                      val47:''
                    }
                  }else {
                    detail={
                      val49:''
                    }
                  }
                  break
                case 'furniture':
                  if(this.getCheckState(box[0])){
                    detail={
                      val62:''
                    }
                  }
                  break
                case 'carport':
                  if(this.getCheckState(box[0])){
                    detail={
                      check:{
                        name:'right'
                      },
                      val67:'',
                      val68:''
                    }
                  }
                  break
                case 'psecond':
                  if(this.getCheckState(box[0])){
                    detail={
                      val74:''
                    }
                  }else{
                    detail={
                      val78:''
                    }
                  }
                  break
                case 'loanstype':
                  if(this.getCheckState(box[0])||this.getCheckState(box[1])||this.getCheckState(box[2])){
                    detail={
                      val98:'',
                      val99:'method4'
                    }
                  }
                  break
                case 'check02':
                  if(this.getCheckState(box[0])){
                    detail={
                      val107:''
                    }
                  }else {
                    detail={
                      val109:''
                    }
                  }
                  break
              }
              this.dealCheck(iframe,detail)
            }
          }
        }else {
          let methodDetail={}
          let val
          let classList =  Array.from(iframe.document.querySelector(`*[extendparam=${item}]`).classList)
          if(classList.includes('dropdown-item')||classList.includes('calendar-item')){
            val=iframe.document.querySelector(`input[extendparam=${item}]`).value
          }else{
            val=iframe.document.querySelector(`span[extendparam=${item}]`).innerHTML
          }
          iframe.document.querySelector(`*[extendparam=${item}]`).classList.remove('BODERRED')
          if(obj[item]==='method1'){
            switch (val.toLowerCase()){
              case 'a':
                methodDetail={
                  check:{
                    name:'thirdparty',
                    require:true
                  }
                }
                break
              case 'b':
                methodDetail={
                  check:{
                    name:'cash',
                    require:true
                  }
                }
                break
              default:
                errorArr2.push({
                  type:'input',
                  name:item
                })
            }
            // this.dealCheck(iframe,methodDetail)
          }else if(obj[item]==='method2'){
            switch (val.toLowerCase()){
              case 'a':
                break
              case 'b':
                methodDetail={
                  check:{
                    name:'psecond',
                    require:true
                  },
                  val79:'',
                  val80:''
                }
                break
              case 'c':
                methodDetail={
                  val81:'',
                  val84:''
                }
                break
              case 'd':
                methodDetail={
                  val85:'',
                  val88:'',
                  check1:{
                    name:'pthird'
                  },
                  check2:{
                    name:'pfourth'
                  }
                }
                break
              default:
                errorArr2.push({
                  type:'input',
                  name:item
                })
            }
            // this.dealCheck(iframe,methodDetail)
          }else if(obj[item]==='method3'){
            switch (val.toLowerCase()){
              case 'a':
                break
              case 'b':
                methodDetail={
                  check:{
                    name:'loanstype',
                    require:true
                  }
                }
                break
              default:
                errorArr2.push({
                  type:'input',
                  name:item
                })
              // reject(`请输入,${item}`)
            }
            // this.dealCheck(iframe,methodDetail)
          }else if(obj[item]==='method4'){
            switch (val.toLowerCase()){
              case 'a':
                break
              case 'b':
                methodDetail={
                  val100:'',
                  val101:''
                }
                break
              case 'c':
                break
              default:
                errorArr2.push({
                  type:'input',
                  name:item
                })
              // reject(`请输入,${item}`)
            }
            // this.dealCheck(iframe,methodDetail)
          }else if(obj[item]==='method5'){
            switch (val.toLowerCase()){
              case 'a':
                methodDetail={
                  val125:''
                }
                break
              case 'b':
                methodDetail={
                  val126:''
                }
                break
              case 'c':
                methodDetail={
                  val127:''
                }
                break
              default:
                errorArr2.push({
                  type:'input',
                  name:item
                })
            }
            // this.dealCheck(iframe,methodDetail)
          }else {
            if(val.length===0){
              errorArr2.push({
                type:'input',
                name:item
              })
              break
            }
          }
          if(errorArr2.length===0){
            this.dealCheck(iframe,methodDetail)
          }
        }
      }
      console.log(errorArr2)
      return errorArr2
    },
  }
}
export {
  MIXINS_MM
}
