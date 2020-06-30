import {contractConfig,toChineseNumber} from "./base.js"
let Obj = {
  cn_arr:['val7','val8','val9','val14']
}
let sub = {
  'checkbox_houseType': {
    stateful: function(index) {
      return index===3?{'val1': null} : null
    }
  },
  'val2': null,
  'val3': null,
  'checkbox_useRight': null,
  'checkbox_guaranty': {
    stateful: function(index) {
      return index===1?{'val4': null} : null
    }
  },
  'checkbox_lease': {
    stateful: function(index) {
      return index===1?{'checkbox_leaseSon': null} : null
    }
  },
  'checkbox_negotiate': null,
  'val5': null,
  'val6': null,
  'val7': null,
  'val8': null,
  'checkbox_pmoney':null,
  'val9': null,
  'checkbox_zhizhao2':{
    stateful: function(index) {
      return index===1?{'val100': null,'val101':null} : null
    }
  },
  'checkbox_leakage': {
    stateful: function(index) {
      return index===1?{'checkbox_leakagePlace': null} : null
    }
  },
  'checkbox_death': null,
  'time_val102':null,
  'checkbox_installment': {
    stateful: function(index) {
      return index===0?{'val10': null} : null
    }
  },
  'val11': null,
  'val12': null,
  'checkbox_delivery': {
    stateful: function(index) {
      return index===1?{'val13': null} : null
    }
  },
  'val14': null,
  'checkbox_ownerCost':null,
  'checkbox_incomeTax': null,
  'checkbox_otherCost': null,
}


//给按钮添加点击事件
let mainBtn=document.querySelector('#submit');
if(mainBtn){
  mainBtn.addEventListener('click',function(e){
    contractConfig.submit(e,sub,'templateError1')
  })
}else{
  let btn=document.createElement('span')
  btn.id='submit'
  btn.style.display='none'
  btn.innerHTML='click'
  document.body.appendChild(btn)
  btn.addEventListener('click',function(e){
    contractConfig.submit(e,sub,'templateError1')
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
    tip.target.innerHTML = ev.target.value
    let cn_str = tip.target.getAttribute('extendparam')
    if(Obj['cn_arr'].includes(cn_str)){
      document.querySelector(`*[extendparam=${cn_str}_add]`).innerHTML = toChineseNumber(ev.target.value).split("元")[0]
    }
  }
},function(tip){
  //获取输入框的默认值
  let initVal=tip.target.innerHTML
  let strCn = tip.target.getAttribute('extendparam')
  if(Obj['cn_arr'].includes(strCn)){
    if(initVal.length>0){
      document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = toChineseNumber(initVal).split("元")[0]
    }else{
      document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
    }
  }
})

// 勾选框逻辑
contractConfig.checkboxListener(function(){},function(obj,index){
  let attr = obj.currentTarget.getAttribute('name')
  if(attr == 'houseType') {//第一条 房屋属性 其他类型输入框能否输入逻辑
    let boxArray = document.getElementsByName(attr);
    let _val1 = document.querySelector(`span[extendparam="val1"]`)
    _val1.classList.remove("BODERRED")
    for(let i = 0; i < boxArray.length; i++) {
      if(boxArray[i] == obj.currentTarget) {
        if(boxArray[i].querySelector('p').getAttribute('checked')==='true') {
          if(i==boxArray.length-1) {
            _val1.removeAttribute('systemParam')
          } else {
            _val1.innerHTML = ''
            _val1.classList.add("input-before")
            _val1.setAttribute('systemParam','true')
          }
        } else {
          _val1.innerHTML = ''
          _val1.classList.add("input-before")
          _val1.removeAttribute('systemParam')
        }
      }
    }
  }else if(attr=="zhizhao2"){
    document.querySelector(`span[extendparam="val100"]`).innerHTML=''
    document.querySelector(`span[extendparam="val101"]`).innerHTML=''
    document.querySelector(`span[extendparam="val100"]`).classList.add("input-before")
    document.querySelector(`span[extendparam="val101"]`).classList.add("input-before")
    document.querySelector(`span[extendparam="val100"]`).removeAttribute('systemParam')
    document.querySelector(`span[extendparam="val101"]`).removeAttribute('systemParam')
    let proveTypeDoms = document.getElementsByName("zhizhao2")
    if(proveTypeDoms[0].querySelector('p').getAttribute('checked')==='true'||proveTypeDoms[2].querySelector('p').getAttribute('checked')==='true'){
      document.querySelector(`span[extendparam="val100"]`).setAttribute('systemParam','true')
      document.querySelector(`span[extendparam="val101"]`).setAttribute('systemParam','true')
  }
  if(proveTypeDoms[1].querySelector('p').getAttribute('checked')==='true'){
      document.querySelector(`span[extendparam="val100"]`).removeAttribute('systemParam','true')
      document.querySelector(`span[extendparam="val101"]`).removeAttribute('systemParam','true')
  }
  else{
    document.querySelector(`span[extendparam="val100"]`).setAttribute('systemParam','true')
    document.querySelector(`span[extendparam="val101"]`).setAttribute('systemParam','true')
  }
  }else if(attr=="installment"){
    let installment = document.getElementsByName("installment")
    if(installment[1].querySelector('p').getAttribute('checked')==='true'){
      document.querySelector(`*[extendparam="val10"]`).value=''
      document.querySelector(`*[extendparam="val10"]`).removeAttribute('value')
      document.querySelector(`*[extendparam="val10"]`).removeAttribute('random')
      document.querySelector(`*[extendparam="val10"]`).classList.add("input-before")
      document.querySelector(`*[extendparam="val10"]`).setAttribute('disabled','true')
    }else{
      document.querySelector(`*[extendparam="val10"]`).removeAttribute('disabled')
    }
    if(installment[0].querySelector('p').getAttribute('checked')==='true'){
      document.querySelector(`*[extendparam="val10"]`).removeAttribute('disabled')
    }else{
      document.querySelector(`*[extendparam="val10"]`).setAttribute('disabled','true')
      document.querySelector(`*[extendparam="val10"]`).value=''
      document.querySelector(`*[extendparam="val10"]`).removeAttribute('value')
      document.querySelector(`*[extendparam="val10"]`).removeAttribute('random')
    }
  }
  else if(attr == 'guaranty'){//第二条  抵押人是否可输入逻辑
    let boxArray = document.getElementsByName(attr);
    let _val4 = document.querySelector(`span[extendparam="val4"]`)
    _val4.classList.remove("BODERRED")
    for(let i = 0; i < boxArray.length; i++) {
      if(boxArray[i] == obj.currentTarget) {
        if(boxArray[i].querySelector('p').getAttribute('checked')==='true') {
          if(i==boxArray.length-1) {
            _val4.removeAttribute('systemParam')
          } else {
            _val4.innerHTML = ''
            _val4.classList.add("input-before")
            _val4.setAttribute('systemParam','true')
          }
        } else {
          _val4.innerHTML = ''
          _val4.classList.add("input-before")
          _val4.removeAttribute('systemParam')
        }
      }
    }
  }else if(attr == 'delivery'){//第八条第一小条输入框能否输入逻辑
    let boxArray = document.getElementsByName(attr);
    let _val13 = document.querySelector(`span[extendparam="val13"]`)
    _val13.classList.remove("BODERRED")
    for(let i = 0; i < boxArray.length; i++) {
      if(boxArray[i] == obj.currentTarget) {
        if(boxArray[i].querySelector('p').getAttribute('checked')==='true') {
          if(i==boxArray.length-1) {
            _val13.removeAttribute('systemParam')
          } else {
            _val13.innerHTML = ''
            _val13.classList.add("input-before")
            _val13.setAttribute('systemParam','true')
          }
        } else {
          _val13.innerHTML = ''
          _val13.classList.add("input-before")
          _val13.removeAttribute('systemParam')
        }
      }
    }
  }else if(attr == 'lease'){//第二条 房屋是否带租约勾选逻辑
    let boxArray = document.getElementsByName(attr);
    let leaseSon = document.querySelectorAll(`*[name='leaseSon']`)
    for(let i = 0; i < boxArray.length; i++) {
      if(boxArray[i] == obj.currentTarget) {
        if(boxArray[i].querySelector('p').getAttribute('checked')==='true') {
          if(i==boxArray.length-1) {
            for (let index = 0; index < leaseSon.length; index++) {
              leaseSon[index].removeAttribute('readonly')
            }
          } else {
            for (let index = 0; index < leaseSon.length; index++) {
              leaseSon[index].setAttribute('readonly','readonly')
              leaseSon[index].querySelector('p').removeAttribute('checked')
            }
          }
        } else {
          for (let index = 0; index < leaseSon.length; index++) {
            leaseSon[index].removeAttribute('readonly')
            leaseSon[index].querySelector('p').removeAttribute('checked')
          }
        }
      }
    }
  }else if(attr == 'leakage'){//第二条 房屋是否带租约勾选逻辑
    let boxArray = document.getElementsByName(attr);
    let leakagePlace = document.querySelectorAll(`*[name='leakagePlace']`)
    for(let i = 0; i < boxArray.length; i++) {
      if(boxArray[i] == obj.currentTarget) {
        if(boxArray[i].querySelector('p').getAttribute('checked')==='true') {
          if(i==boxArray.length-1) {
            for (let index = 0; index < leakagePlace.length; index++) {
              leakagePlace[index].removeAttribute('readonly')
            }
          } else {
            for (let index = 0; index < leakagePlace.length; index++) {
              leakagePlace[index].setAttribute('readonly','readonly')
              leakagePlace[index].querySelector('p').removeAttribute('checked')
            }
          }
        } else {
          for (let index = 0; index < leakagePlace.length; index++) {
            leakagePlace[index].removeAttribute('readonly')
            leakagePlace[index].querySelector('p').removeAttribute('checked')
          }
        }
      }
    }
  }
})

//基础数据赋值
let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
// let msg={
//   code: "S0001191107007",
//   companyNames: ["金银湖三级门店哦"],
//   guestCardType: "军官证",
//   guestCardTypes: "",
//   guestID: "132",
//   guestIDs: "",
//   guestName: "然爱迪生",
//   guestNames: "",
//   guestTel: "13011111111",
//   guestTels: "",
//   id: 3354,
//   isentrust: 1,
//   ownerCardType: "营业执照",
//   ownerCardTypes: "",
//   ownerID: "123",
//   ownerIDs: "",
//   ownerName: "熊先",
//   ownerNames: "",
//   ownerTel: "18888888888",
//   ownerTels: "",
//   propertyAddr: "a市b区c",
//   singleCompany: "",
//   guestStoreName:"2222",
//   guestStoreRegisterCode:'2222',
// }
for(let readonlyItem in msg){
  let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
  // let arr= []
  // if(readonlyItem==='signDate'){
  //   let time = new Date(msg.signDate)
  //   arr.push(time.getFullYear())
  //   arr.push(time.getMonth()+1)
  //   arr.push(time.getDate())
  // }
  // if(readonlyItem==="companyNames"){
  //   if(msg[readonlyItem].length>0){
  //     let companyName = document.querySelector(`*[extendParam="val13"]`)
  //     let companyNameTxt = msg[readonlyItem].join(',')
  //     companyName.setAttribute('list',companyNameTxt)
  //   }
  // }

  let readonlyArr = ['code','ownerName','ownerNames','guestStoreRegisterCode','guestStoreName','guestName','guestNames','propertyAddr','dealPrice','dealPriceUpper','square']
  if(onlyReadDom.length>0){
    onlyReadDom.forEach((element,index) => {
      if(readonlyArr.includes(readonlyItem)){
        if(readonlyItem=='guestStoreName'){
          element.removeAttribute('systemparam')
          if(element.innerHTML.length==0){
            element.innerHTML=msg[readonlyItem]
          }
          element.classList.remove('input-before')
        }
        else if(readonlyItem=='guestStoreRegisterCode'){
          element.removeAttribute('systemparam')
          if(element.innerHTML.length==0){
            element.innerHTML=msg[readonlyItem]
          }
          element.classList.remove('input-before')
        }else{
          element.innerHTML=msg[readonlyItem]
          element.classList.remove('input-before')
        }
      }
    })
  }
}
