import {contractConfig, toChineseNumber} from "./base.js"

let sub = {
  'checkbox_houseUse':null,
  // 'val15':null,
  'checkbox_houseUsing':{
    stateful:function (val) {
      return val===0?{'val16':null,'val17':null,'val18':null,'val19':null}:{'val20':null,'checkbox_bear':null}
    }
  },
  'checkbox_Housingnature': null,
  'checkbox_Mortgage':{
    stateful:function (val) {
      return val===1?{
        'val21':null,
        'drapdown_val22':{
          stateful:function (val) {
            let res=Object.create(null)
            switch (Number(val)) {
              case 1:
                res={'val23':null,'val24':null}
                break;
              case 2:
                res={'val25':null,'val26':null}
                break;
              case 3:
                res={'val27':null,'val28':null}
                break;
            }
            return res
          }
        }
      }:null
    }
  },
  'checkbox_lease': null,
  'val29': null,
  'val30': null,//第三条
  'val31': null,
  'checkbox_Transferprice':null,
  'checkbox_Parkingspace':{
    stateful:function (val) {
      return val===0?{
        'checkbox_Parkinguse':null,
        'val32': null,
        'val33':null,
      }:null
    }
  },
  'val34':null,
  'val35':null,
  'val36':null,
  'val37':null,
  'drapdown_val38':{
    stateful:function (val) {
      let res=null
      switch (Number(val)) {
        case 1:
          res={
            'val39':null
          }
          break;
        case 2:
          res={
            'val40':null,
            'val41':null,
            'val42':null,
            'val43':null
          }
          break;
      }
      return res;
    }
  },
  'val44': null,
  'checkbox_loan':{
    stateful:function (val) {
      return val===3?{'val45': null,}:null
    }
  },
  'val46':null,
  'drapdown_val47':{
    stateful:function (val) {
      let res=null;
      switch (Number(val)) {
        case 1:
          res={
            'checkbox_Transfer':null
          }
          break;
        case 2:
          res={
            'val48':null
          }
          break;
      }
      return res;
    }
  },
  'val49':null,
  'checkbox_structure':null,
  'checkbox_structure1':null,
  'val50':null,
  'val51':null,
  'drapdown_val99':{
    stateful:function (val) {
      return Number(val)===2?{'val52':null}:null
    }
  },
  'checkbox_Housingsituation':null,
  'checkbox_Housingsituation1':null,
  'checkbox_Housingsituation2':null,
  'checkbox_Housingsituation3':null,
  'val53':null,
  'drapdown_val54':{
    stateful:function (val) {
      let res=null;
      switch (Number(val)) {
        case 1:
          res={'val55':null}
          break;
        case 2:
          res={'val56':null}
          break;
        case 3:
          res={'val57':null}
          break
      }
      return res;
    }
  },
  'val59':null,
  'checkbox_Ownershiptransfer':null,
  'drapdown_val61':{
    stateful:function (val) {
      return Number(val)===1?{'val62':null}:null
    }
  }
}

//给按钮添加点击事件
let mainBtn = document.querySelector('#submit');
if (mainBtn) {
  mainBtn.addEventListener('click', function (e) {
    contractConfig.submit(e, sub, 'templateError1')
  })
} else {
  let btn = document.createElement('span')
  btn.id = 'submit'
  btn.style.display = 'none'
  btn.innerHTML = 'click'
  document.body.appendChild(btn)
  btn.addEventListener('click', function (e) {
    contractConfig.submit(e, sub, 'templateError1')
  })
}

//初始化时间控件
Calendar.create({
  classN: 'calendar-item',
  callBack: function (bindElem, dateObj) {
    if (bindElem.tagName.toLowerCase() === 'input') {
      bindElem.value = `${dateObj.year}年${dateObj.month}月${dateObj.date}日`
      bindElem.setAttribute('value', bindElem.value)
      bindElem.setAttribute('random', dateObj.random)
    }
  }
})
//初始化下拉控件
Dropdown.create({
  classN: 'dropdown-item',
  callBack: function (bindElem, dateObj) {
    if (bindElem.tagName.toLowerCase() === 'input') {
      bindElem.value = dateObj.value
      bindElem.setAttribute('value', bindElem.value)
      let obj={
        'val22':{
          1:['val25','val26','val27','val28'],
          2:['val23','val24','val27','val28'],
          3:['val23','val24','val25','val26'],
          'init':['val23','val24','val25','val26','val27','val28']
        },
        'val38':{
          1:['val40','val41','val42','val43'],
          2:['val39'],
          'init':['val39','val40','val41','val42','val43']
        },
        'val47':{
          1:['val48'],
          2:['checkbox_Transfer'],
          'init':['checkbox_Transfer','val48']
        },
        'val99':{
          1:['val52'],
          2:[],
          'init':['val52']
        },
        'val54':{
          1:['val56','val57'],
          2:['val55','val57'],
          3:['val55','val56'],
          'init':['val55','val56','val57']
        },
        'val61':{
          1:[],
          2:['val62'],
          'init':['val62']
        }
      }
      let attr=bindElem.getAttribute('extendParam')
      if(obj[attr]){
        contractConfig.initForm(obj[attr]['init'],0)
        contractConfig.initForm(obj[attr][Number(dateObj.value)],1)
      }
    } else {
      bindElem.innerHTML = dateObj.value
      bindElem.classList.remove('input-select')
      bindElem.classList.remove('input-before')
    }
  }
})


// 输入框右侧吸边
let textLong = Array.from(document.querySelectorAll('.text-limit'))
textLong.forEach(function (item) {
  item.addEventListener('input', function () {
    let leng = this.value.length
    for (let i = 0; i < leng; i++) {
      if (this.scrollWidth > this.clientWidth) {
        this.value = this.value.substring(0, this.value.length - 1)
      }
    }
  })
})

//基础数据赋值
let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
/*let msg={
  code: "S0001191107007",
  companyNames: ["金银湖三级门店哦"],
  guestCardType: "军官证",
  guestCardTypes: "",
  guestID: "132",
  guestIDs: "ee2353-344，ii397-4839",
  guestName: "然迪生",
  guestNames: "胜负少，发士夫",
  guestTel: "13011111111",
  guestTels: "",
  id: 3354,
  isentrust: 1,
  ownerCardType: "营业执照",
  ownerCardTypes: "",
  ownerID: "123",
  ownerIDs: "ee2353-344，ii397-4839",
  ownerName: "熊先",
  ownerNames: "胜多少，发士夫",
  ownerTel: "18888888888",
  ownerTels: "",
  propertyAddr: "a市b区c",
  singleCompany: "是的噶几开会说",
  dealPrice:1000,
  dealPriceUpper:'壹仟',
  square:160
}*/
for (let readonlyItem in msg) {
  let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));

  let readonlyArr = ['code','companyNames','ownerName', 'ownerID', 'ownerNames', 'ownerIDs', 'guestName', 'guestID', 'guestNames', 'guestIDs', 'propertyAddr', 'dealPrice', 'dealPriceUpper', 'square']
  if(onlyReadDom.length>0){
    onlyReadDom.forEach((element,index) => {
      if(readonlyItem==="companyNames"&&msg['companyNames'].length>0){
        element.innerHTML=msg[readonlyItem][0]
        element.classList.remove('input-before')
      }else if(readonlyArr.includes(readonlyItem)){
        element.innerHTML=msg[readonlyItem]
        element.classList.remove('input-before')
      }
    })
  }
}

// 勾选框逻辑
contractConfig.checkboxListener(function () {
}, function (obj, index) {
  let attr = obj.currentTarget.getAttribute('name')
  let boxArray = document.getElementsByName(attr);
  if (['loan'].includes(attr)) {//最后一个勾选带有输入框的场景
    let checkIO = {
      'loan': 'val45',
    }
    boxArray.forEach((item, i) => {
      if (item === obj.currentTarget) {
        let lastOne = document.querySelector(`*[extendParam=${checkIO[attr]}]`)
        if (i !== boxArray.length - 1) {
          lastOne.innerHTML = ''
          lastOne.classList.add('input-before')
          lastOne.classList.remove('BODERRED')
          lastOne.setAttribute('systemparam', true)
        } else if (item.querySelector('p').getAttribute('checked')) {
          lastOne.removeAttribute('systemparam')
        } else {
          lastOne.innerHTML = ''
          lastOne.setAttribute('systemparam', true)
          lastOne.classList.add('input-before')
          lastOne.classList.remove('BODERRED')
        }
      }
    })
  }else if(attr==='houseUsing'){
    let checkIO={
      0: ['val16','val17','val18','val19'],
      1: ['val20','checkbox_bear'],
    }
    boxArray.forEach((item,i)=>{
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if(item===obj.currentTarget){
        if(item.querySelector('p').getAttribute('checked')){
          contractConfig.initForm(checkIO[i],0)
          if(i===0){
            contractConfig.initForm(checkIO[1],1)
          }else {
            contractConfig.initForm(checkIO[0],1)
          }
        }else{
          contractConfig.initForm(checkIO[i],1)
        }
      }
    })
  }else if(attr==='Mortgage'){
    let checkIO={
      1: ['val21','val22','val23','val24','val25','val26','val27','val28'],
    }
    boxArray.forEach((item,i)=>{
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if(item===obj.currentTarget){
        if(item.querySelector('p').getAttribute('checked')){
          if(i===0){
            contractConfig.initForm(checkIO[1],1)
          }else {
            contractConfig.initForm(checkIO[1],0)
          }
        }else{
          contractConfig.initForm(checkIO[1],1)
        }
      }
    })
  }else if(attr==='Parkingspace'){
    let checkIO={
      0: ['checkbox_Parkinguse','val32','val33'],
    }
    boxArray.forEach((item,i)=>{
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if(item===obj.currentTarget){
        if(item.querySelector('p').getAttribute('checked')){
          if(i===0){
            contractConfig.initForm(checkIO[0],0)
          }else {
            contractConfig.initForm(checkIO[0],1)
          }
        }else{
          contractConfig.initForm(checkIO[0],1)
        }
      }
    })
  }
})

//输入自适应
contractConfig.inputListener(function (ev, tip) {
  let max = tip.target.getAttribute('max')
  let textArea = document.getElementById('inputArea')
  if (max) {//监听max属性，判断文本框是有有输入长度限制
    textArea.setAttribute('maxLength', parseInt(max))
  } else {
    textArea.removeAttribute('maxLength')
  }
  //监听listen属性，判断是否有输入类型限制
  let spanAttr = tip.target.getAttribute('listen')
  if (spanAttr === 'number') {
    ev.target.value = ev.target.value.replace(/[^\d]/g, "")
    tip.target.innerHTML = ev.target.value
    let cn_str = tip.target.getAttribute('extendparam')
    if (['val31','val35','val37','val39','val41','val42','val44','val49'].includes(cn_str)) {
      document.querySelector(`*[extendparam=${cn_str}_add]`).innerHTML = toChineseNumber(ev.target.value).split('元')[0]
    }
  }else if(spanAttr==='phone'){
    ev.target.value = ev.target.value.replace(/[^\d|-]/g, "")
    tip.target.innerHTML = ev.target.value
  }
}, function (tip) {
  //获取输入框的默认值
  let initVal = tip.target.innerHTML
  let strCn = tip.target.getAttribute('extendparam')
  if (['val31','val35','val37','val39','val41','val42','val44','val49'].includes(strCn)) {
    if (initVal.length > 0) {
      document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = toChineseNumber(initVal).split('元')[0]
    } else {
      document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
    }
  }
})
