import {contractConfig, toChineseNumber} from "./base.js"

let sub = {
  // 'val1':null,
  // 'val2':null,
  // 'val3':null,
  // 'val4':null,
  'val10':null,
  'val11':null,
  'val12':null,
  // 'val13': null,
  // 'val14':null,
  'checkbox_dy':null,
  'checkbox_sale':null,
  'checkbox_rent': null,
  'checkbox_call':null,
  'val15':null,
  /*'checkbox_area':{
    stateful:function (val) {
      let res = null;
      switch (val) {
        case 0:
          res = {'val17': null,'val18': null};
          break;
        case 1:
          res = {'val19': null,'val20': null};
          break;
        case 2:
          res = {'val21': null,'val22': null};
          break
        case 3:
          res = {'val23': null};
          break;
      }
      return res;
    }
  },*/
  'checkbox_certificate': {
    stateful: function (val) {
      return val === 3 ? {'val25': null} : null
    }
  },
  'val26': null,
  'checkbox_thirdcheck': null,
  'checkbox_thirdpay': {
    stateful: function (val) {
      let res = null;
      switch (val) {
        case 0:
          res = {
            'time_val90': null,
            'val33': null,
            'checkbox_paymentonetime': {
              stateful: function (index) {
                return index === 2 ? {'val35': null} : null
              }
            }
          };
          break;
        case 1:
          res = {
            'time_val91': null,
            'val36': null,
            'checkbox_paymentloan': {
              stateful:function (index) {
                return index === 2 ? {'val38': null} : null
              }
            },
            'val39': null,
            'val40': null,
            'time_val92': null,
            'checkbox_paymentagree':{
              stateful:function (i) {
                return i===2?{'val41':null}:null
              }
            }
          };
          break;
      }
      return res;
    }
  },
  'val27': null,
  'val28': null,
  'val29': null,
  'val30': null,
  'val31': null,
  'val32': null,
  'val42':null,
  'checkbox_paymentbalance':null,
  'checkbox_fourthcheck': {
    stateful: function (index) {
      return index === 2 ? {'val43': null} : null
    }
  },
  'time_val93': null,
  'val44': null,
  'val45': null,
  'val46':null,
  'val47':null,
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
      let attr = bindElem.getAttribute('inputmethod')
      if (attr) {
        contractConfig.initForm(Obj[attr === 'pay' ? 'part4' : attr === 'delivery' ? 'part5' : 'part6'], 0)
        if (attr === 'pay') {
          contractConfig.prohibit(bindElem, ['a', 'b', 'c', 'd'], 'pay')
        }
        if (attr === 'delivery') {
          contractConfig.prohibit(bindElem, ['1', '2'], 'delivery')
        }
        if (attr === 'taxAgree') {
          contractConfig.prohibit(bindElem, ['1', '2', '3', '4'], 'taxAgree')
        }
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
// let msg={
//   code: "S0001191107007",
//   companyNames: ["金银湖三级门店哦"],
//   guestCardType: "军官证",
//   guestCardTypes: "",
//   guestID: "132",
//   guestIDs: "ee2353-344，ii397-4839",
//   guestName: "然迪生",
//   guestNames: "胜负少，发士夫",
//   guestTel: "13011111111",
//   guestTels: "",
//   id: 3354,
//   isentrust: 1,
//   ownerCardType: "营业执照",
//   ownerCardTypes: "",
//   ownerID: "123",
//   ownerIDs: "ee2353-344，ii397-4839",
//   ownerName: "熊先",
//   ownerNames: "胜多少，发士夫",
//   ownerTel: "18888888888",
//   ownerTels: "",
//   propertyAddr: "a市b区c",
//   singleCompany: "",
//   dealPrice:1000,
//   dealPriceUpper:'壹仟',
//   square:160
// }
for (let readonlyItem in msg) {
  let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
  let arr = []
  if (readonlyItem === 'signDate') {
    let time = new Date(msg.signDate)
    arr.push(time.getFullYear())
    arr.push(time.getMonth() + 1)
    arr.push(time.getDate())
  }

  let readonlyArr = ['ownerName', 'ownerID', 'ownerNames', 'ownerIDs', 'guestName', 'guestID', 'guestNames', 'guestIDs', 'propertyAddr', 'dealPrice', 'dealPriceUpper', 'square']
  if (onlyReadDom.length > 0) {
    onlyReadDom.forEach((element, index) => {
      if (readonlyItem === 'signDate') {
        element.setAttribute('value', arr[index])
      } else if (readonlyItem === "companyNames") {
        element.innerHTML = msg[readonlyItem][0]
        element.classList.remove('input-before')
      } else if (readonlyArr.includes(readonlyItem)) {
        if (element.getAttribute("systemparam") === "propertyAddr") {
          let value = msg["propertyAddr"]
          if (value.substring(0, 3) === "淄博市") {
            element.innerHTML = value.replace("淄博市", '')
          } else {
            element.innerHTML = value
          }
        } else {
          element.innerHTML = msg[readonlyItem]
        }
        element.classList.remove('input-before')
      } else {
        element.value = msg[readonlyItem]
        element.setAttribute('value', msg[readonlyItem])
      }
    })
  }
}

// 勾选框逻辑
contractConfig.checkboxListener(function () {
}, function (obj, index) {
  let attr = obj.currentTarget.getAttribute('name')
  let boxArray = document.getElementsByName(attr);
  if (attr == 'area') {
    let ioArr = {
      0: ['val17', 'val18'],
      1: ['val19', 'val20'],
      2: ['val21', 'val22'],
      3: ['val23']
    }
    boxArray.forEach((item, index) => {
      if (item.querySelector('p').getAttribute('checked')) {
        ioArr[index].forEach(item => {
          document.querySelector(`*[extendParam=${item}]`).removeAttribute('systemparam')
        })
      } else {
        ioArr[index].forEach(item => {
          document.querySelector(`*[extendParam=${item}]`).setAttribute('systemparam', true)
          document.querySelector(`*[extendParam=${item}]`).innerHTML = ''
        })
      }
    })
  } else if (['certificate', 'paymentonetime', 'paymentloan', 'fourthcheck','paymentagree'].includes(attr)) {
    let checkIO = {
      'certificate': 'val25',
      'paymentonetime': 'val35',
      'paymentloan': 'val38',
      'fourthcheck': 'val43',
      'paymentagree':'val41'
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
  }else if(attr==='thirdpay'){
    let checkIO={
      0:['val90','val33','val33_add','checkbox_paymentonetime','val35'],
      1:['val91','val36','val36_add','checkbox_paymentloan','val38','val39','val40','val40_add','val92','checkbox_paymentagree','val41']
    }
    let modalView=document.querySelectorAll('.pay_check')
    boxArray.forEach((item,i)=>{
      // contractConfig.initForm(checkIO[0].concat(checkIO[1]),0)
      if(item===obj.currentTarget){
        modalView.forEach(item=>{
          item.classList.remove('modal')
        })
        if(item.querySelector('p').getAttribute('checked')){
          // contractConfig.initForm(checkIO[i],0)
          if(i===0){
            contractConfig.initForm(checkIO[1],0)
            modalView[1].classList.add('modal')
          }else {
            contractConfig.initForm(checkIO[0],0)
            modalView[0].classList.add('modal')
          }
        }else{
          contractConfig.initForm(checkIO[i],0)
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
    if (['val15', 'val33', 'val36', 'val40'].includes(cn_str)) {
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
  if (['val15', 'val33', 'val36', 'val40'].includes(strCn)) {
    if (initVal.length > 0) {
      document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = toChineseNumber(initVal).split('元')[0]
    } else {
      document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
    }
  }
})
