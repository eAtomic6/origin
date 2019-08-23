import {contractConfig,toChineseNumber} from "./base.js"
let obj = {
  val6:'',
  check1:{
    name:'proveType',
    require:true
  },
  val11:'',
  check2:{
    name:'isPledge'
  },
  val12:'',
  val13:'',
  val14:'',
  val15:'',
  val16:'',
  val17:'',
  val18:'',
  val19:'',
  check3:{
    name:'methodType'
  },
  val22:'',
  check4:{
    name:'payType'
  },
  val23:'',
  val24:'',
  val25:'',
  val26:'',
  val27:'',
  val29:'',
  val30:'',
  check5:{
    name:'payType1'
  },
  val31:'',
  val32:'',
  check6:{
    name:'payType2'
  },
  val33:'',
  val36:'',
  val37:'',
  val38:'',
  val39:'',
  val40:'',
}
let errorArr1=[]

function getCheckState(ele){
  return	!!(ele.querySelector('p').getAttribute('checked'))
}

//非空校验
function submit(e,Obj=obj){
  errorArr1=[]
  sessionStorage.setItem("templateError",JSON.stringify(errorArr1))
  for(let item in Obj){
    let templateError=JSON.parse(sessionStorage.getItem("templateError"))
    if(templateError.length>0){
        return
    }
    let itemType=Object.prototype.toString.call(Obj[item])
    if(itemType==='[object Object]'){
      let state=false
      let box=document.querySelectorAll(`div[name=${Obj[item].name}]`)
      let arr=Array.from(box)
      state = arr.every(function (item) {
        return getCheckState(item)===false
      })
      if(state){
        errorArr1.push(Obj[item].name)
        break
      }else{
        //勾选后判断
        if(Obj[item].require){
          let box=document.querySelectorAll(`div[name=${Obj[item].name}]`)
          let detail={}
          switch (Obj[item].name){
            case 'proveType':
              if(getCheckState(box[0])){
                detail={
                  val9:''
                }
              }else{
                document.querySelector(`span[extendparam="val9"]`).classList.remove('BODERRED')
                document.querySelector(`span[extendparam="val10"]`).classList.remove('BODERRED')
                let value9 = document.querySelector(`span[extendparam="val9"]`).innerHTML
                let value10 = document.querySelector(`span[extendparam="val10"]`).innerHTML
                if(!value9&&!value10){
                  detail={
                    val9:''
                  }
                }
              }
              break
          }
          submit(e,detail)
        }
      }
    }else {
      let classList = Array.from(document.querySelector(`*[extendparam=${item}]`).classList)
      if(classList.includes('dropdown-item')||classList.includes('calendar-item')){
        if(item==="val6"){
          Obj[item]=document.querySelector(`span[extendparam=${item}]`).innerHTML
        }else{
          Obj[item]=document.querySelector(`input[extendparam=${item}]`).value
        } 
      }else{
        Obj[item]=document.querySelector(`span[extendparam=${item}]`).innerHTML
      }
      document.querySelector(`*[extendparam=${item}]`).classList.remove('BODERRED')
      if(Obj[item].length===0){
        errorArr1.push({
          type:'input',
          name:item
        })
        break
      }
    }
  }
  sessionStorage.setItem('templateError',JSON.stringify(errorArr1))
  console.log(errorArr1)
  return errorArr1
}

//给按钮添加点击事件
let mainBtn=document.querySelector('#submit');
if(mainBtn){
  mainBtn.addEventListener('click',function(e){
    submit(e,obj,true)
  })
}else{
  let btn=document.createElement('span')
  btn.id='submit'
  btn.style.display='none'
  btn.innerHTML='click'
  document.body.appendChild(btn)
  btn.addEventListener('click',function(e){
    submit(e,obj,true)
  })
}

//初始化时间控件
Calendar.create({
  classN: 'calendar-item',
  callBack: function(bindElem, dateObj) {
    if(bindElem.tagName.toLowerCase()==='input'){
      bindElem.value=`${dateObj.year}年${dateObj.month}月${dateObj.date}日`
      bindElem.setAttribute('value',bindElem.value)
      bindElem.setAttribute('random',dateObj.random)
    }
  }
})

//初始化下拉控件
Dropdown.create({
  classN: 'dropdown-item',
  callBack: function(bindElem, dateObj) {
    if(bindElem.tagName.toLowerCase()==='span'){
      bindElem.innerHTML = dateObj.value
      bindElem.classList.remove('input-select')
      bindElem.classList.remove('input-before')
    }
  }
})

//输入自适应
contractConfig.inputListener(function(ev,tip){
  let max=tip.target.getAttribute('max')
  let textArea=document.getElementById('inputArea')
  if(max){//监听max属性，判断文本框是有有输入长度限制
    textArea.setAttribute('maxLength',parseInt(max))
  }else {
    textArea.removeAttribute('maxLength')
  }
  //监听listen属性，判断是否有输入类型限制
  let spanAttr=tip.target.getAttribute('listen')
  if(spanAttr==='number'){
    ev.target.value=ev.target.value.replace(/[^\d]/g, "")
    let toChineseArr = ['val22','val25','val30','val32']
    let chineseStr = tip.target.getAttribute('extendparam')
    if(toChineseArr.includes(chineseStr)){
        document.querySelector(`*[extendparam=${chineseStr}_add]`).innerHTML = toChineseNumber(ev.target.value).split('元')[0]
    }
  }
  if(spanAttr==='chinese'){
    ev.target.value=ev.target.value.replace(/[^\d]/g, "")
    if(ev.target.value.length>0){
    let str = toChineseNumber(ev.target.value)
    let value=str.split('元')[0]
    tip.target.innerHTML=value
    }else {
    tip.target.innerHTML=''
    tip.target.classList.add('input-before')
    }
  }else {
    tip.target.innerHTML=ev.target.value
  }
},function(tip){
  //获取输入框的默认值
  let initVal=tip.target.innerHTML
  let ArrCn = ['val22','val25','val30','val32']
  let strCn = tip.target.getAttribute('extendparam')
  if(ArrCn.includes(strCn)){
    if(initVal.length>0){
      document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = toChineseNumber(initVal)
   }else{
      document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
   }
   }
})

// 勾选框逻辑
contractConfig.checkboxListener(function(){},function(obj,index){
  if(obj.currentTarget.getAttribute('name')==='proveType'){
    document.querySelector(`span[extendparam="val9"]`).innerHTML=''
    document.querySelector(`span[extendparam="val10"]`).innerHTML=''
    document.querySelector(`span[extendparam="val9"]`).classList.add("input-before")
    document.querySelector(`span[extendparam="val10"]`).classList.add("input-before")
    let proveTypeDoms = document.getElementsByName("proveType")
    if(proveTypeDoms[0].querySelector('p').getAttribute('checked')==='true'){
        document.querySelector(`span[extendparam="val10"]`).setAttribute('systemParam','true')
    }else{
        document.querySelector(`span[extendparam="val10"]`).removeAttribute('systemParam')
    }
  }
})

//基础数据赋值
let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
// let msg = {
//   code: "Z0001190610001",
//   commissionPayment: 0,
//   companyNames: ["adfasfd"],
//   custCommission: 0,
//   custCommissionUpper: "零",
//   custEnsure: 0,
//   dealPrice: 4000,
//   dealPriceUpper: "肆仟",
//   guestCardType: "2",
//   guestCardTypes: "",
//   guestID: "345345345",
//   guestIDs: "",
//   guestName: "租个房子",
//   guestNames: "",
//   guestTel: "13071291915",
//   guestTels: "",
//   guestinfoCode: "CSXD000063",
//   houseinfoCode: "Z461JYHH000182",
//   id: 1978,
//   isHaveData: 0,
//   isWuHanMM: 0,
//   moneyUnit: "元",
//   otherCooperationCost: 0,
//   ownerCardType: "2",
//   ownerCardTypes: "",
//   ownerCommission: 1212,
//   ownerCommissionUpper: "壹仟贰佰壹拾贰",
//   ownerID: "123123123",
//   ownerIDs: "",
//   ownerName: "录房勘啊",
//   ownerNames: "",
//   ownerTels: "",
//   propertyAddr: "啊时代发生的发生地方",
//   propertyCard: "",
//   remarks: "",
//   signDate: 1560096000000,
//   square: 235,
//   squareUse: 200,
//   subscriptionPrice: 0,
//   subscriptionPriceUpper: "零",
//   timeUnit: "月",
//   type: 1
// }
for(let readonlyItem in msg){
  let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
  let arr= []
  if(readonlyItem==='signDate'){
    let time = new Date(msg.signDate)
    arr.push(time.getFullYear())
    arr.push(time.getMonth()+1)
    arr.push(time.getDate())
  }
  if(readonlyItem==="companyNames"){
    if(msg[readonlyItem].length>0){
      let companyName = document.querySelector(`*[extendParam="val6"]`)
      let companyNameTxt = msg[readonlyItem].join(',')
      companyName.setAttribute('list',companyNameTxt)
    }
  }
  if(onlyReadDom.length>0){
    onlyReadDom.forEach((element,index) => {
      if(readonlyItem==='signDate'){
        element.setAttribute('value', arr[index])
      }else if(readonlyItem==='ownerName'){
        if(msg['ownerNames']){
          let names = msg['ownerName']+'、'+msg['ownerNames']
          element.innerHTML = names
        }else{
          element.innerHTML = msg['ownerName']
        }
      }else if(readonlyItem==='ownerID'){
        if(msg['ownerIDs']){
          let types = msg['ownerID']+'、'+msg['ownerIDs']
          element.innerHTML = types
        }else{
          element.innerHTML = msg['ownerID']
        }
      }else if(readonlyItem==='ownerCardType'){
        if(msg['ownerCardTypes']){
          let types = msg['ownerCardType']+'、'+msg['ownerCardTypes']
          element.innerHTML = types
        }else{
          element.innerHTML = msg['ownerCardType']
        }
      }else if(readonlyItem==='guestName'){
        if(msg['guestNames']){
          let names = msg['guestName']+'、'+msg['guestNames']
          element.innerHTML = names
        }else{
          element.innerHTML = msg['guestName']
        }
      }else if(readonlyItem==='guestID'){
        if(msg['guestIDs']){
          let types = msg['guestID']+'、'+msg['guestIDs']
          element.innerHTML = types
        }else{
          element.innerHTML = msg['guestID']
        }
      }else if(readonlyItem==='guestCardType'){
        if(msg['guestCardTypes']){
          let types = msg['guestCardType']+'、'+msg['guestCardTypes']
          element.innerHTML = types
        }else{
          element.innerHTML = msg['guestCardType']
        }
      }else if(readonlyItem==='propertyAddr'){
        if(element.getAttribute("extendParam")==="val7"){
          let value = msg["propertyAddr"]
          if(value.substring(0,3)==="合肥市"){
            element.innerHTML=value.replace("合肥市",'')
          }else{
            element.innerHTML=value
          }
        }else{
          element.innerHTML=msg[readonlyItem]
        }
      }else if(readonlyItem==='timeUnit'){
        element.querySelector('p').removeAttribute('checked')
        if(element.getAttribute('value')===msg[readonlyItem]){
            element.querySelector('p').setAttribute('checked', 'true')
        }
      }else if(readonlyItem==='code'){
        element.value=msg[readonlyItem]
        element.setAttribute('value', msg[readonlyItem])
      }else{
        element.innerHTML=msg[readonlyItem]
      }
      element.classList.remove('input-before')
    });
  }
}