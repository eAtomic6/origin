import {contractConfig,toChineseNumber} from "./base.js"

let sub = {
    'time_val5': null,
    'time_val34': null
}

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
// let msg = {
//     code: '7448748',
//     ownerName: 'huhijio',
//     ownerID: '464645465',
//     guestName: 'wt5rhrt',
//     guestID: '848494',
//     dealPrice: '10',
//     dealPriceUpper: '拾',
//     ownerName: 'seghsg',
//     guestStoreName: 'uiohohh',
//     ownerCommission: '30',
//     ownerCommissionUpper: '叁拾',
//     custCommission: '40',
//     custCommissionUpper: '肆拾',
// }
for(let readonlyItem in msg){
    let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
    if(onlyReadDom.length>0){
        onlyReadDom.forEach((element => {
			if(readonlyItem === 'code'){
				element.value = msg[readonlyItem]
				element.setAttribute('value', msg[readonlyItem])
			} else {
				element.innerHTML = msg[readonlyItem]
			}
		}))
    }
}