import {contractConfig,toChineseNumber} from "./base.js"
//初始化时间控件
Calendar.create({
    classN: 'calendar-item',
    callBack: function(bindElem, dateObj) {
        // bindElem.innerHTML = dateObj.year + '-' + dateObj.month + '-' + dateObj.date;
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
        // bindElem.innerHTML = dateObj.year + '-' + dateObj.month + '-' + dateObj.date;
        if(bindElem.tagName.toLowerCase()==='input'){
            bindElem.value=dateObj.value
            bindElem.setAttribute('value',bindElem.value)
        }else{
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
    let toChineseArr = ['val22','val25','val30','val73','val80']
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
  let val_40 = document.querySelector(`span[extendparam="val40"]`).innerHTML
  if(val_40.length){
    document.querySelector(`span[extendparam="val41"]`).setAttribute('systemParam','true')
  }else{
    document.querySelector(`span[extendparam="val41"]`).removeAttribute('systemParam')
  }
  let val_41 = document.querySelector(`span[extendparam="val41"]`).innerHTML
  if(val_41.length){
    document.querySelector(`span[extendparam="val40"]`).setAttribute('systemParam','true')
  }else{
    document.querySelector(`span[extendparam="val40"]`).removeAttribute('systemParam')
  }

},function(tip){
  //获取输入框的默认值
  let initVal=tip.target.innerHTML
  let ArrCn = ['val22','val25','val30','val73','val80']
  let strCn = tip.target.getAttribute('extendparam')
  if(ArrCn.includes(strCn)){
    if(initVal.length>0){
      document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = toChineseNumber(initVal)
   }else{
      document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
   }
   }
   let cur_val = tip.target.getAttribute('extendparam')
   if(cur_val == 'val40'|| cur_val == 'val41'){
    document.querySelector(`span[extendparam="val41"]`).removeAttribute('systemParam')
    document.querySelector(`span[extendparam="val40"]`).removeAttribute('systemParam')
   }

})

// 勾选框逻辑
contractConfig.checkboxListener(function(){},function(obj,index){
  let attr = obj.currentTarget.getAttribute('name')
  if(attr){
    contractConfig.initForm(attr==='zhizhao4'?['val32']:[],0)
  }
  if(obj.currentTarget.getAttribute('name')==='zhizhao5'){
    document.querySelector(`span[extendparam="val40"]`).innerHTML=''
    document.querySelector(`span[extendparam="val41"]`).innerHTML=''
    document.querySelector(`span[extendparam="val40"]`).classList.add("input-before")
    document.querySelector(`span[extendparam="val41"]`).classList.add("input-before")
    document.querySelector(`span[extendparam="val40"]`).removeAttribute('systemParam')
    document.querySelector(`span[extendparam="val41"]`).removeAttribute('systemParam')
    let proveTypeDoms = document.getElementsByName("zhizhao5")
    if(proveTypeDoms[0].querySelector('p').getAttribute('checked')==='true'){
      document.querySelector(`span[extendparam="val41"]`).setAttribute('systemParam','true')
  }else{
      document.querySelector(`span[extendparam="val41"]`).removeAttribute('systemParam')
  }
  }
})

//给按钮添加点击事件
  let mainBtn=document.querySelector('#submit');
  if(mainBtn){
    mainBtn.addEventListener('click',function(e){
      contractConfig.submit(e,sub)
    })
  }else{
    let btn=document.createElement('span')
    btn.id='submit'
    btn.style.display='none'
    btn.innerHTML='click'
    document.body.appendChild(btn)
    btn.addEventListener('click',function(e){
      contractConfig.submit(e,sub)
    })
  }

let sub = {
  'val25': null,
  'checkbox_zhizhao4': {
    stateful:function (index) {
      return index===3?{'val32':null}:null
    },
  },
  'checkbox_zhizhao5': null,
  'info_test':{
    stateful:function() {
      let flag= document.querySelector(`*[name="zhizhao5"]`).querySelector('p').getAttribute('checked')
      let obj_40 = document.querySelector(`*[extendparam="val40"]`);
       obj_40.classList.remove('BODERRED');
       let obj_41 = document.querySelector(`*[extendparam="val41"]`);
       obj_41.classList.remove('BODERRED');
      if(flag){
        return {'val40':null}
      }else{
        let inputVal=document.querySelector('*[extendparam=val40]').innerHTML;
        if(inputVal.length===0){
          return {'val41':null};
        }else{
          return null;
        }
      }
    }
  },
  'val42': null,
  'checkbox_zhizhao6': null,
  'checkbox_facility': {
    stateful:function (index) {
      return index===5?{'val51':null}:null
    },
  },
  'val52': null,
  'time_val53': null,
  'time_val56': null,
  'val60': null,
  'time_val61': null,
  'val400': null,
  'val65': null,
  'val66': null,
  'checkbox_zhizhao7': null,
  'val73': null,
  'checkbox_zhizhao8': null,
  'val300': null,
  'val80': null,
  'time_val82': null,
  'val83': null,
  'val84': null,
  'val92': null,
  'val93': null,
  'val94': null,
  'val301': null,
}
//基础数据赋值
let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
// let msg={
// cityId: 2,
// code: "Z0002191023002",
// commissionPayment: 0,
// companyNames: ["周黑鸭", "正常测试"],
// custCommission: 600,
// custCommissionUpper: "陆佰",
// custEnsure: 0,
// dealPrice: 2400,
// dealPriceUpper: "贰仟肆佰",
// guestCardType: "护照",
// guestCardTypes: "护照",
// guestID: "111111222",
// guestIDs: "222222332",
// guestName: "熊桂兰",
// guestNames: "二傻子",
// guestTel: "18716810042",
// guestTels: "18611909690",
// guestinfoCode: "JGSD000020",
// houseinfoCode: "Z7E5CSXD000004",
// id: 3219,
// isHaveData: 0,
// isWuHanMM: 0,
// moneyUnit: "元",
// otherCooperationCost: 0,
// ownerCardType: "护照",
// ownerCardTypes: "护照",
// ownerCommission: 600,
// ownerCommissionUpper: "陆佰",
// ownerID: "222222222",
// ownerIDs: "111111111",
// ownerName: "测试数据",
// ownerNames: "跟恒",
// ownerTel: "18771790771",
// ownerTels: "18611909594",
// propertyAddr: "咸宁市大兴区288号88楼8层",
// propertyCard: "",
// remarks: "",
// signDate: 1571760000000,
// singleCompany: "",
// square: 100,
// squareUse: 22,
// subscriptionPrice: 0,
// subscriptionPriceUpper: "零",
// timeUnit: "月",
// type: 1,
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
            let companyName = document.querySelector(`*[extendParam="val25"]`)
            companyName.innerHTML = msg[readonlyItem][0]
            // let companyNameTxt = msg[readonlyItem].join(',')
            // companyName.setAttribute('list',companyNameTxt)
        }
    }
    if(onlyReadDom.length>0){
        onlyReadDom.forEach((element,index) => {
            if(readonlyItem==='timeUnit'){
                element.querySelector('p').removeAttribute('checked')
                if(element.getAttribute('value')===msg[readonlyItem]){
                    element.querySelector('p').setAttribute('checked', 'true')
                }
            }else if(readonlyItem==='signDate'){
                element.value=msg[readonlyItem]
                element.setAttribute('value', arr[index])
            // }else if(readonlyItem==='propertyAddr'||readonlyItem==='guestTel'||readonlyItem==='square'||readonlyItem==='dealPrice'||readonlyItem==='dealPriceUpper'||readonlyItem==='ownerName'||readonlyItem==='guestName'){
            }else if(readonlyItem==='houseinfoCode'||readonlyItem==='guestinfoCode'||readonlyItem==='code'){
                element.value=msg[readonlyItem]
                element.setAttribute('value', msg[readonlyItem])
            }else{
                if(element.getAttribute("extendParam")==="val33"){
                    let value = msg["propertyAddr"]
                    if(value.substring(0,3)==="咸宁市"){
                        element.innerHTML=value.replace("咸宁市",'')
                    }else{
                        element.innerHTML=value
                    }
                }else{
                    element.innerHTML=msg[readonlyItem]
                }
                element.classList.remove('input-title')
                element.classList.remove('input-title2')
                element.classList.remove('input-before')
            }
        });
    }
}